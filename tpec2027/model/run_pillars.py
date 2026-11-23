"""Three-pillar comparison (reliability, emissions, cost) at an 80% hourly-matching target."""
import csv
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from eef_model import EF_GRID, P_BUY, T, base_profiles, bess_annual_cost, bess_min_energy, eef_min_capacity

OUT = Path(__file__).resolve().parents[1] / "results"
p = base_profiles(); L, P = p["load"], p["pv"]
e = eef_min_capacity(p, 0.8, 8); b = bess_min_energy(p, 0.8)
h = np.arange(T) % 24
eve, night = (h >= 19) & (h <= 23), h < 6
net = {"GRID": L.copy(), "AM": L - P, "RE+BESS": L - P + b["ch"] - b["dis"], "EEF": L - P + e["u"] - e["d"]}
cfe = {"GRID": 0.0, "AM": p["direct"].sum() / L.sum(), "RE+BESS": b["cfe"], "EEF": e["cfe"]}
sh = e["d"].sum()
cost = {"GRID": (0, 0, 0), "AM": (0, 0, 0),
        "RE+BESS": tuple(bess_annual_cost(b["E"], k) / 1e6 for k in ("low", "mid", "high")),
        "EEF": tuple(sh * pr / 1e6 for pr in (25, 50, 75))}
rows = []
for k in net:
    served = L.copy()   # DC load is bought from the grid in every hour in all configurations
    rows.append([k, 100 * served.sum() / L.sum(), net[k][eve].mean(), net[k][night].mean(), 100 * cfe[k],
                 (1 - cfe[k]) * L.sum() * EF_GRID / 1e3, b["E"] if k == "RE+BESS" else 0.0, *cost[k]])
with open(OUT / "three_pillars.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["config", "dc_load_served_pct", "evening_net_load_MW", "night_net_load_MW", "cfe_pct",
                "emissions_kt", "new_storage_MWh", "cost_lo_MUSD", "cost_mid_MUSD", "cost_hi_MUSD"])
    w.writerows(rows)
for r in rows:
    print([round(v, 1) if isinstance(v, float) else v for v in r])
print("grid energy purchase MUSD/yr (all configs):", round(L.sum() * P_BUY / 1e6, 1), "EEF shifted GWh", round(sh / 1e3, 1))
