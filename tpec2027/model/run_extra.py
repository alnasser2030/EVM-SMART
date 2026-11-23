"""Extra analyses for the 6-page TPEC version: monthly CFE and sensitivities."""
import csv
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from eef_model import base_profiles, bess_annual_cost, bess_min_energy, eef_max_cfe, eef_min_capacity

OUT = Path(__file__).resolve().parents[1] / "results"
MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
edges = np.cumsum([0] + MONTH_DAYS) * 24


def monthly(x):
    return np.array([x[edges[i]:edges[i + 1]].sum() for i in range(12)])


def write(name, header, rows):
    with open(OUT / name, "w", newline="") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)


# 1) monthly CFE at an 80% annual target: AM, EEF (min capacity, D=8), RE+BESS (min storage)
p = base_profiles()
e = eef_min_capacity(p, 0.8, 8)
b = bess_min_energy(p, 0.8)
L_m, D_m = monthly(p["load"]), monthly(p["direct"])
rows = []
for i in range(12):
    rows.append([i + 1, D_m[i] / L_m[i], (D_m[i] + monthly(e["d"])[i]) / L_m[i], (D_m[i] + monthly(b["dis"])[i]) / L_m[i]])
write("monthly_cfe.csv", ["month", "AM", "EEF", "BESS"], rows)
print("monthly", [[r[0]] + [round(v, 3) for v in r[1:]] for r in rows])

# 2) PV oversizing
rows = []
for k in (1.0, 1.25, 1.5):
    pk = base_profiles(pv_multiple=k)
    am = pk["direct"].sum() / pk["load"].sum()
    mx = eef_max_cfe(pk, 800.0, 8)["cfe"]
    e80 = eef_min_capacity(pk, 0.8, 8); e90 = eef_min_capacity(pk, 0.9, 8)
    b90 = bess_min_energy(pk, 0.9)
    rows.append([k, pk["cap_mw"], am, mx, e80["P_F"] if e80 else None, e90["P_F"] if e90 else None,
                 b90["E"] if b90 else None])
    print("pv", k, [round(v, 3) if isinstance(v, float) else v for v in rows[-1]])
write("sens_pv.csv", ["pv_multiple", "pv_MWp", "AM_cfe", "EEF_max_cfe", "EEF_P80_MW", "EEF_P90_MW", "BESS_E90_MWh"], rows)

# 3) shifting efficiency
rows = []
c80 = bess_annual_cost(b["E"], "mid")
for eta in (0.85, 0.95, 1.0):
    ee = eef_min_capacity(p, 0.8, 8, eta=eta)
    mx = eef_max_cfe(p, 800.0, 8, eta=eta)["cfe"]
    rows.append([eta, ee["P_F"], ee["d"].sum(), c80 / ee["d"].sum(), mx])
    print("eta", eta, [round(v, 3) for v in rows[-1]])
write("sens_eta.csv", ["eta", "P80_MW", "shifted_MWh", "breakeven_mid_USD_per_MWh", "max_cfe"], rows)
