"""Results at the recommended displacement (default 90%) for the prelim film.

The TPEC paper reports an 80% base case. The displacement sweep (run_displacement.py, plot_verdict.py) shows EEF
works best at 85-97%, best at about 90%, so the film presents its results at 90%. This script recomputes the
target-specific results at that level (python3 run_base.py [X]):
  base_pillars.csv        Riyadh, four configurations (same columns as three_pillars.csv)
  base_monthly.csv        Riyadh, monthly displacement of AM, EEF and RE+BESS
  base_scenario_day.csv   Riyadh, Jul 15, one-day operation with resources sized for X
  base_sites.csv          Riyadh and NEOM: design, flexibility, battery, break-even, sensitivities
  base_sites_pillars.csv  Riyadh and NEOM, four configurations
  base_sites_monthly.csv  Riyadh and NEOM, monthly displacement
Riyadh uses PV = annual use and the window from 06:00 (as the paper). NEOM cannot reach 90% that way (ceiling 89.5%),
so above its ceiling it uses PV x1.25 and the window from 09:00. D = 8 h throughout.
"""
import csv
import sys
from pathlib import Path

import numpy as np

from scipy.optimize import linprog

import eef_model as em

OUT = Path(__file__).resolve().parents[1] / "results"
MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
EDGES = np.cumsum([0] + MONTH_DAYS) * 24


def monthly(x):
    return np.array([x[EDGES[i]:EDGES[i + 1]].sum() for i in range(12)])


def day_lp(sur, defi, cap_up, cap_dn, store_max, eta_in, eta_out):
    """One-day LP (06:00 -> 05:00), as in run_sites.py: maximize the covered deficit."""
    n = 24
    order = list(range(6, 24)) + list(range(0, 6))
    s, g = sur[order], defi[order]
    A, b = np.zeros((n, 3 * n)), np.zeros(n)
    for k in range(n):
        A[k, 2 * n + k] = 1; A[k, k] = -eta_in; A[k, n + k] = 1 / eta_out
        if k: A[k, 2 * n + k - 1] = -1
    bnd = [(0, min(cap_up, x)) for x in s] + [(0, min(cap_dn, x)) for x in g] + [(0, store_max)] * (n - 1) + [(0, 0)]
    c = np.zeros(3 * n); c[n:2 * n] = -1; c[:n] = 1e-6
    x = linprog(c, A_eq=A, b_eq=b, bounds=bnd, method="highs").x
    inv = np.argsort(order)
    return x[:n][inv], x[n:2 * n][inv], x[2 * n:][inv]
X = float(sys.argv[1]) if len(sys.argv) > 1 else 0.9
T = em.T
h = np.arange(T) % 24
EVE, NIGHT = (h >= 19) & (h <= 23), h < 6


def write(name, header, rows):
    with open(OUT / name, "w", newline="") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)
    print("wrote", name)


def design(site):
    """Paper design if it reaches X, else PV x1.25 with the window from 09:00."""
    em.WINDOW_START_HOUR = 6
    p = em.base_profiles(site=site)
    if em.eef_max_cfe(p, 1000.0, 8)["cfe"] > X + 0.005:
        return p, 1.0, 6
    em.WINDOW_START_HOUR = 9
    return em.base_profiles(pv_multiple=1.25, site=site), 1.25, 9


sites, sp, sm = [], [], []
for site in ("riyadh", "neom"):
    p, k, wh = design(site)
    p1 = em.base_profiles(site=site)                 # AM always uses PV = annual use
    L = p["load"]
    e, b = em.eef_min_capacity(p, X, 8), em.bess_min_energy(p, X)
    am = p1["direct"].sum() / L.sum()
    costs_b = [em.bess_annual_cost(b["E"], c) / 1e6 for c in ("low", "mid", "high")]
    sh = e["d"].sum()
    sites += [[site, "pv_multiple", k], [site, "window_start_h", wh], [site, "flex_MW", e["P_F"]], [site, "bess_MWh", b["E"]],
              [site, "shifted_GWh", sh / 1e3], [site, "breakeven_mid", costs_b[1] * 1e6 / sh],
              [site, "breakeven_kWyr_mid", costs_b[1] * 1e6 / (e["P_F"] * 1e3)]]
    rows = [["GRID", 100.0, L[EVE].mean(), L[NIGHT].mean(), 0.0, L.sum() * em.EF_GRID / 1e3, 0.0, 0, 0, 0],
            ["AM", 100.0, (L - p1["pv"])[EVE].mean(), (L - p1["pv"])[NIGHT].mean(), 100 * am, (1 - am) * L.sum() * em.EF_GRID / 1e3, 0.0, 0, 0, 0],
            ["RE+BESS", 100.0, (L - p["pv"] + b["ch"] - b["dis"])[EVE].mean(), (L - p["pv"] + b["ch"] - b["dis"])[NIGHT].mean(),
             100 * b["cfe"], (1 - b["cfe"]) * L.sum() * em.EF_GRID / 1e3, b["E"], *costs_b],
            ["EEF", 100.0, (L - p["pv"] + e["u"] - e["d"])[EVE].mean(), (L - p["pv"] + e["u"] - e["d"])[NIGHT].mean(),
             100 * e["cfe"], (1 - e["cfe"]) * L.sum() * em.EF_GRID / 1e3, 0.0, *(sh * pr / 1e6 for pr in (25, 50, 75))]]
    for r in rows:
        sp.append([site] + r)
    Lm, Dm, D1 = monthly(L), monthly(p["direct"]), monthly(p1["direct"])
    for i in range(12):
        sm.append([site, i + 1, D1[i] / Lm[i], (Dm[i] + monthly(e["d"])[i]) / Lm[i], (Dm[i] + monthly(b["dis"])[i]) / Lm[i]])
    if site == "riyadh":
        write("base_pillars.csv", ["config", "dc_load_served_pct", "evening_net_load_MW", "night_net_load_MW", "cfe_pct",
                                   "emissions_kt", "new_storage_MWh", "cost_lo_MUSD", "cost_mid_MUSD", "cost_hi_MUSD"], rows)
        write("base_monthly.csv", ["month", "AM", "EEF", "BESS"], [r[1:] for r in sm if r[0] == "riyadh"])
        # sensitivities at X: 4-h shifting, eta = 0.85
        e4 = em.eef_min_capacity(p, X, 4)
        e85 = em.eef_min_capacity(p, X, 8, eta=0.85)
        sites += [[site, "flex_MW_D4", e4["P_F"] if e4 else ""], [site, "flex_MW_eta085", e85["P_F"] if e85 else ""]]
        # one day (Jul 15) with resources sized for X
        d0 = 195 * 24
        pv, Ld = p["pv"][d0:d0 + 24], L[d0:d0 + 24]
        sur, defi, direct = np.maximum(pv - Ld, 0), np.maximum(Ld - pv, 0), np.minimum(pv, Ld)
        eu, ed, eS = day_lp(sur, defi, e["P_F"], e["P_F"], 8 * e["P_F"], 0.95, 1.0)
        ec, edis, esoc = day_lp(sur, defi, 1e9, 1e9, b["E"], np.sqrt(0.9), np.sqrt(0.9))
        write("base_scenario_day.csv", ["hour", "pv_MW", "direct_MW", "bess_charge_MW", "bess_discharge_MW", "bess_soc_MWh",
                                        "eef_up_MW", "eef_down_MW", "eef_shifted_MWh"],
              [[t, pv[t], direct[t], ec[t], edis[t], esoc[t], eu[t], ed[t], eS[t]] for t in range(24)])
        print("day displacement %: AM", round(100 * direct.sum() / Ld.sum(), 1),
              "RE+BESS", round(100 * (direct.sum() + edis.sum()) / Ld.sum(), 1), "EEF", round(100 * (direct.sum() + ed.sum()) / Ld.sum(), 1))
em.WINDOW_START_HOUR = 6
sites.append(["all", "X_pct", 100 * X])
write("base_sites.csv", ["site", "item", "value"], sites)
write("base_sites_pillars.csv", ["site", "config", "dc_load_served_pct", "evening_net_load_MW", "night_net_load_MW", "cfe_pct",
                                 "emissions_kt", "new_storage_MWh", "cost_lo_MUSD", "cost_mid_MUSD", "cost_hi_MUSD"], sp)
write("base_sites_monthly.csv", ["site", "month", "AM", "EEF", "BESS"], sm)
for r in sites:
    print(r)
for r in sp:
    print([round(v, 1) if isinstance(v, float) else v for v in r])
