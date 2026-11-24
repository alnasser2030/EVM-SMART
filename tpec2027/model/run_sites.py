"""Site comparison (Riyadh vs. NEOM-Oxagon) and scenario detail used by the prelim film.

Writes to tpec2027/results/:
  sites_summary.csv      per site: PV size, CF, AM matching, max EEF matching, resources and costs by target
  sites_cfe_vs_flex.csv  per site: maximum hourly matching vs. contracted flexible power (D = 8 h)
  sites_pillars.csv      per site: four configurations at 80% hourly matching
  sites_monthly.csv      per site and month: PV capacity factor and hourly matching (AM, EEF, RE+BESS at 80%)
  sites_daily_pv.csv     per site: mean PV output by hour (annual, June, December), per kWp
  scenario_day.csv       Riyadh, Jul 15: one-day operation of RE+BESS and EEF sized for 80% annual matching
  decision_map.csv       break-even flexibility price vs. battery capital cost (Riyadh, by target)
"""
import csv
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from eef_model import (BESS_CAPEX, CRF, EF_GRID, FOM, T, base_profiles, bess_annual_cost, bess_min_energy,
                       eef_max_cfe, eef_min_capacity, load_pv_per_kwp)

OUT = Path(__file__).resolve().parents[1] / "results"
MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
EDGES = np.cumsum([0] + MONTH_DAYS) * 24
TARGETS = (0.6, 0.7, 0.8, 0.9)


def monthly(x):
    return np.array([x[EDGES[i]:EDGES[i + 1]].sum() for i in range(12)])


def write(name, header, rows):
    with open(OUT / name, "w", newline="") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)
    print("wrote", name)


summary, curves, pillars, months, daily = [], [], [], [], []
for site in ("riyadh", "neom"):
    p = base_profiles(site=site)
    L, P = p["load"], p["pv"]
    kwp = load_pv_per_kwp(site)
    am = p["direct"].sum() / L.sum()
    mx = eef_max_cfe(p, 1000.0, 8)["cfe"]
    summary.append([site, "pv_MWp", p["cap_mw"]]); summary.append([site, "cf_pct", 100 * kwp.mean()])
    summary.append([site, "am_cfe_pct", 100 * am]); summary.append([site, "max_eef_cfe_pct", 100 * mx])
    for X in TARGETS:
        e = eef_min_capacity(p, X, 8) if X < mx else None
        b = bess_min_energy(p, X)
        summary.append([site, f"flex_MW_{int(X*100)}", e["P_F"] if e else ""])
        summary.append([site, f"bess_MWh_{int(X*100)}", b["E"] if b else ""])
        if e and b:
            summary.append([site, f"breakeven_mid_{int(X*100)}", bess_annual_cost(b["E"], "mid") / e["d"].sum()])
    for pf in range(0, 330, 20):
        curves.append([site, pf, 100 * eef_max_cfe(p, float(pf), 8)["cfe"]])
    # four configurations at 80%
    e, b = eef_min_capacity(p, 0.8, 8), bess_min_energy(p, 0.8)
    for cfg, cfe, store, cost in [("GRID", 0.0, 0, (0, 0, 0)), ("AM", am, 0, (0, 0, 0)),
                                  ("RE+BESS", b["cfe"], b["E"], tuple(bess_annual_cost(b["E"], k) / 1e6 for k in ("low", "mid", "high"))),
                                  ("EEF", e["cfe"], 0, tuple(e["d"].sum() * pr / 1e6 for pr in (25, 50, 75)))]:
        pillars.append([site, cfg, 100.0, 100 * cfe, (1 - cfe) * L.sum() * EF_GRID / 1e3, store, *cost])
    Lm, Dm = monthly(L), monthly(p["direct"])
    for i in range(12):
        months.append([site, i + 1, 100 * monthly(kwp)[i] / (MONTH_DAYS[i] * 24), 100 * Dm[i] / Lm[i],
                       100 * (Dm[i] + monthly(e["d"])[i]) / Lm[i], 100 * (Dm[i] + monthly(b["dis"])[i]) / Lm[i]])
    hrs = np.arange(T) % 24
    jun, dec = slice(EDGES[5], EDGES[6]), slice(EDGES[11], EDGES[12])
    for h in range(24):
        daily.append([site, h, kwp[hrs == h].mean(), kwp[jun][hrs[jun] == h].mean(), kwp[dec][hrs[dec] == h].mean()])

write("sites_summary.csv", ["site", "item", "value"], summary)
write("sites_cfe_vs_flex.csv", ["site", "P_F_MW", "cfe_pct"], curves)
write("sites_pillars.csv", ["site", "config", "dc_load_served_pct", "cfe_pct", "emissions_kt", "new_storage_MWh",
                            "cost_lo_MUSD", "cost_mid_MUSD", "cost_hi_MUSD"], pillars)
write("sites_monthly.csv", ["site", "month", "pv_cf_pct", "AM", "EEF", "BESS"], months)
write("sites_daily_pv.csv", ["site", "hour", "annual_kW_per_kWp", "june_kW_per_kWp", "december_kW_per_kWp"], daily)

# Riyadh, Jul 15 (day 195): one-day operation of each configuration with resources sized for 80% annual
# matching (EEF: P_F from the annual LP, D = 8 h; RE+BESS: E from the annual LP). Each day LP maximizes the
# matched deficit over the 06:00 -> 05:00 window, with energy neutrality (EEF) or a cyclic state of charge (BESS).
from scipy.optimize import linprog


def day_lp(sur, defi, cap_up, cap_dn, store_max, eta_in, eta_out):
    n = 24
    order = list(range(6, 24)) + list(range(0, 6))
    s, g = sur[order], defi[order]
    # x = [up(24), dn(24), S(24)]; S_k = S_{k-1} + eta_in*up_k - dn_k/eta_out, S_-1 = 0, S_23 = 0
    A, b = np.zeros((n, 3 * n)), np.zeros(n)
    for k in range(n):
        A[k, 2 * n + k] = 1; A[k, k] = -eta_in; A[k, n + k] = 1 / eta_out
        if k: A[k, 2 * n + k - 1] = -1
    bnd = [(0, min(cap_up, x)) for x in s] + [(0, min(cap_dn, x)) for x in g] + [(0, store_max)] * (n - 1) + [(0, 0)]
    c = np.zeros(3 * n); c[n:2 * n] = -1; c[:n] = 1e-6
    x = linprog(c, A_eq=A, b_eq=b, bounds=bnd, method="highs").x
    inv = np.argsort(order)
    return x[:n][inv], x[n:2 * n][inv], x[2 * n:][inv]


p = base_profiles()
e80, b80 = eef_min_capacity(p, 0.8, 8), bess_min_energy(p, 0.8)
d0 = 195 * 24
pv, L = p["pv"][d0:d0 + 24], p["load"][d0:d0 + 24]
sur, defi, direct = np.maximum(pv - L, 0), np.maximum(L - pv, 0), np.minimum(pv, L)
eu, ed, eS = day_lp(sur, defi, e80["P_F"], e80["P_F"], 8 * e80["P_F"], 0.95, 1.0)
ec, edis, esoc = day_lp(sur, defi, 1e9, 1e9, b80["E"], np.sqrt(0.9), np.sqrt(0.9))
rows = [[h, pv[h], direct[h], ec[h], edis[h], esoc[h], eu[h], ed[h], eS[h]] for h in range(24)]
write("scenario_day.csv", ["hour", "pv_MW", "direct_MW", "bess_charge_MW", "bess_discharge_MW", "bess_soc_MWh",
                           "eef_up_MW", "eef_down_MW", "eef_shifted_MWh"], rows)
print("day matching %: AM", round(100 * direct.sum() / L.sum(), 1), " RE+BESS", round(100 * (direct.sum() + edis.sum()) / L.sum(), 1),
      " EEF", round(100 * (direct.sum() + ed.sum()) / L.sum(), 1), "| P_F", round(e80["P_F"], 1), "E", round(b80["E"], 1))

# decision map: break-even price is linear in battery capital cost
rows = []
for X in (0.6, 0.8, 0.9):
    e, b = eef_min_capacity(p, X, 8), bess_min_energy(p, X)
    for capex in range(100, 401, 25):
        rows.append([int(X * 100), capex, capex * 1000 * b["E"] * (CRF + FOM) / e["d"].sum()])
write("decision_map.csv", ["target_pct", "bess_capex_USD_per_kWh", "breakeven_USD_per_MWh"], rows)
