"""Displacement curve: how much flexibility (or battery) each displacement level needs (Riyadh, 100 MW).

Displacement X = share of the data center's annual consumption whose grid supply is freed hour by hour:
PV injected in the same hour plus flexible loads reducing below their baseline. The data center itself
always takes 100% of its energy from the grid; X is the same quantity the paper calls hourly matching.

Designs (PV multiple, window start, window length):
  - PV x1.0 (annual PV = annual DC use), daily window from 06:00 (paper base case; ceiling 91.2%)
  - PV x1.25 / x1.5 / x2 / x3, daily window from 09:00 (ceilings 98.1 / 98.7 / 99.2 / 99.6%)
  - PV x2, weekly window from 09:00: loads that can carry energy across days (e.g. water storage); ~100%
    (99.9%: the first hours of the year, before any PV, cannot be covered — a boundary artifact)
The sweep runs from 50% to ~100% to show where EEF stops working.

For every X it records the least flexible capacity P_F, the energy shifted, the least battery for the same X,
and the coverage of summer evenings (Jun-Sep, 18:00-01:59), the hours that drive grid reinforcement.
Writes tpec2027/results/displacement_curve.csv (Riyadh) or displacement_curve_neom.csv (`python3 run_displacement.py neom`).
"""
import csv
import sys
from pathlib import Path

import numpy as np

import eef_model as em

OUT = Path(__file__).resolve().parents[1] / "results"
T = em.T
DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
month = np.repeat(np.arange(1, 13), [24 * d for d in DAYS])
hour = np.arange(T) % 24
EVE = (month >= 6) & (month <= 9) & ((hour >= 18) | (hour <= 1))
SUMMER = (month >= 6) & (month <= 9)
DESIGNS = {"pv1.0_w06": (1.0, 6, 1), "pv1.25_w09": (1.25, 9, 1), "pv1.5_w09": (1.5, 9, 1), "pv2.0_w09": (2.0, 9, 1),
           "pv3.0_w09": (3.0, 9, 1), "pv2.0_w09_7d": (2.0, 9, 7)}
XS = [0.42, 0.45, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.93, 0.95, 0.97, 0.98, 0.99, 0.995, 0.999]
SITE = sys.argv[1] if len(sys.argv) > 1 else "riyadh"


def cover(p, extra, mask):
    return float((p["direct"] + extra)[mask].sum() / p["load"][mask].sum())


rows = []
for name, (k, wh, wd) in DESIGNS.items():
    em.WINDOW_START_HOUR, em.WINDOW_DAYS = wh, wd
    p = em.base_profiles(pv_multiple=k, site=SITE)
    xmax = em.eef_max_cfe(p, 1e5, 24 * wd)["cfe"]
    rows.append([name, k, wh, "max", round(100 * xmax, 2), "", "", "", "", "", "", "", wd])
    small = [X for X in XS if X <= xmax - 0.002]
    if k > 1.25:                         # oversized PV only for the top of the curve
        small = [X for X in small if X >= 0.97]
    for X in small:
        e = em.eef_min_capacity(p, X, 24 * wd)
        b = em.bess_min_energy(p, X)
        rows.append([name, k, wh, "target", round(100 * X, 1), round(e["P_F"], 1), round(e["d"].sum() / 1e3, 2),
                     round(cover(p, e["d"], EVE), 4), round(cover(p, e["d"], SUMMER), 4),
                     round(b["E"], 1) if b else "", round(cover(p, b["dis"], EVE), 4) if b else "",
                     round(cover(p, b["dis"], SUMMER), 4) if b else "", wd])
        print(rows[-1][:8])
em.WINDOW_START_HOUR, em.WINDOW_DAYS = 6, 1

with open(OUT / ("displacement_curve.csv" if SITE == "riyadh" else f"displacement_curve_{SITE}.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["design", "pv_multiple", "window_start_h", "kind", "displacement_pct", "eef_PF_MW", "eef_shifted_GWh",
                "eef_summer_evening_cover", "eef_summer_cover", "bess_E_MWh", "bess_summer_evening_cover",
                "bess_summer_cover", "window_days"])
    w.writerows(rows)
