"""Run TPEC 2027 experiments and write results/*.csv."""
import csv
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from eef_model import (EF_GRID, L_MW, P_BUY, P_PPA, T, base_profiles, bess_annual_cost,
                       bess_min_energy, eef_max_cfe, eef_min_capacity)

OUT = Path(__file__).resolve().parents[1] / "results"
OUT.mkdir(exist_ok=True)
prof = base_profiles()
L_E = prof["load"].sum()                       # MWh/yr
am_cfe = prof["direct"].sum() / L_E


def write(name, header, rows):
    with open(OUT / name, "w", newline="") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)


# 1) baseline summary
write("baseline.csv", ["item", "value"], [
    ["DC load MW", L_MW], ["DC energy GWh/yr", L_E / 1e3], ["PV MWp (annual match)", prof["cap_mw"]],
    ["PV energy GWh/yr", prof["pv"].sum() / 1e3], ["AM hourly CFE", am_cfe],
    ["PV surplus GWh/yr", prof["surplus"].sum() / 1e3], ["DC deficit GWh/yr", prof["deficit"].sum() / 1e3],
    ["Grid tariff USD/MWh", P_BUY], ["PV PPA USD/MWh", P_PPA],
    ["GRID energy cost MUSD/yr", L_E * P_BUY / 1e6],
])

# 2) CFE vs flexible capacity
rows = []
for D in (4, 8, 12):
    for P in range(0, 321, 20):
        r = eef_max_cfe(prof, float(P), D) if P > 0 else {"cfe": am_cfe, "d": np.zeros(T)}
        rows.append([D, P, P / L_MW, r["cfe"], r["d"].sum()])
        print("curve", D, P, round(r["cfe"], 4), flush=True)
write("cfe_vs_flex.csv", ["D_h", "P_F_MW", "P_F_over_L", "cfe", "shifted_MWh"], rows)

# 3) targets: BESS vs EEF
rows = []
for X in (0.5, 0.6, 0.7, 0.8, 0.85, 0.9):
    b = bess_min_energy(prof, X)
    row = [X]
    if b is None:
        row += [None] * 5
    else:
        cost = {k: bess_annual_cost(b["E"], k) for k in ("low", "mid", "high")}
        row += [b["E"], b["dis"].sum(), cost["low"], cost["mid"], cost["high"]]
    for D in (8, 12):
        e = eef_min_capacity(prof, X, D)
        if e is None:
            row += [None, None, None, None]
        else:
            sh = e["d"].sum()
            be_mwh = (row[4] / sh) if (b is not None and sh > 0) else None          # mid-case US$/MWh shifted
            be_kw = (row[4] / (e["P_F"] * 1000)) if b is not None else None         # mid-case US$/kW-yr
            row += [e["P_F"], sh, be_mwh, be_kw]
    rows.append(row)
    print("target", [round(v, 3) if isinstance(v, float) else v for v in row], flush=True)
write("targets.csv", ["target_cfe", "bess_E_MWh", "bess_discharge_MWh", "bess_cost_low_USDyr", "bess_cost_mid_USDyr",
                      "bess_cost_high_USDyr", "eef8_P_MW", "eef8_shifted_MWh", "eef8_breakeven_USD_per_MWh_mid",
                      "eef8_breakeven_USD_per_kWyr_mid", "eef12_P_MW", "eef12_shifted_MWh",
                      "eef12_breakeven_USD_per_MWh_mid", "eef12_breakeven_USD_per_kWyr_mid"], rows)

# 4) maximum achievable CFE
rows = []
for D in (8, 12, 24):
    r = eef_max_cfe(prof, 600.0, D)
    rows.append(["EEF", D, r["cfe"]])
write("max_cfe.csv", ["config", "D_h", "max_cfe"], rows)

# 5) dispatch for typical days (EEF P=150 MW, D=8 h)
r = eef_max_cfe(prof, 150.0, 8)
days = {"summer (Jul 15)": 195, "winter (Jan 15)": 14}
rows = []
for name, d in days.items():
    for h in range(24):
        t = d * 24 + h
        rows.append([name, h, prof["pv"][t], prof["load"][t], r["u"][t], r["d"][t]])
write("dispatch_days.csv", ["day", "hour", "pv_MW", "load_MW", "up_MW", "down_MW"], rows)
write("dispatch_summary.csv", ["item", "value"], [["P_F", 150], ["D", 8], ["cfe", r["cfe"]],
                                                  ["shifted_MWh", r["d"].sum()]])
print("done")
