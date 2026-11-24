"""Displacement curve: how much flexibility (or battery) each displacement level needs (Riyadh, 100 MW).

Displacement X = share of the data center's annual consumption whose grid supply is freed hour by hour:
PV injected in the same hour plus flexible loads reducing below their baseline. The data center itself
always takes 100% of its energy from the grid; X is the same quantity the paper calls hourly matching.

Two designs:
  - PV x1.0 (annual PV = annual DC use), energy-neutral window from 06:00 (paper base case)
  - PV x1.25, window from 09:00 (reaches ~98%; covers summer ~100%)

For every X it records the least flexible capacity P_F, the energy shifted, the least battery for the same X,
and the coverage of summer evenings (Jun-Sep, 18:00-01:59), the hours that drive grid reinforcement.
Writes tpec2027/results/displacement_curve.csv.
"""
import csv
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
DESIGNS = {"pv1.0_w06": (1.0, 6), "pv1.25_w09": (1.25, 9)}
XS = [0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.93, 0.95, 0.97]


def cover(p, extra, mask):
    return float((p["direct"] + extra)[mask].sum() / p["load"][mask].sum())


rows = []
for name, (k, wh) in DESIGNS.items():
    em.WINDOW_START_HOUR = wh
    p = em.base_profiles(pv_multiple=k)
    xmax = em.eef_max_cfe(p, 5000.0, 24)["cfe"]
    rows.append([name, k, wh, "max", round(100 * xmax, 2), "", "", "", "", "", "", ""])
    for X in XS:
        if X > xmax - 0.005:
            continue
        e = em.eef_min_capacity(p, X, 24)
        b = em.bess_min_energy(p, X)
        rows.append([name, k, wh, "target", round(100 * X, 1), round(e["P_F"], 1), round(e["d"].sum() / 1e3, 2),
                     round(cover(p, e["d"], EVE), 4), round(cover(p, e["d"], SUMMER), 4),
                     round(b["E"], 1) if b else "", round(cover(p, b["dis"], EVE), 4) if b else "",
                     round(cover(p, b["dis"], SUMMER), 4) if b else ""])
        print(rows[-1])
em.WINDOW_START_HOUR = 6

with open(OUT / "displacement_curve.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["design", "pv_multiple", "window_start_h", "kind", "displacement_pct", "eef_PF_MW", "eef_shifted_GWh",
                "eef_summer_evening_cover", "eef_summer_cover", "bess_E_MWh", "bess_summer_evening_cover",
                "bess_summer_cover"])
    w.writerows(rows)
