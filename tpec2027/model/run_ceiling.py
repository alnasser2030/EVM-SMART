"""Why EEF stops short of 100% hourly matching, and what raises the ceiling (Riyadh, 100 MW).

Writes tpec2027/results/ceiling.csv:
  - decomposition of the gap from 100% (losses, day-to-day/seasonal imbalance, timing within the day)
  - maximum matching for PV multiples x window start hour (unlimited flexibility, D = 24 h)
"""
import csv
from pathlib import Path

import numpy as np

import eef_model as em

OUT = Path(__file__).resolve().parents[1] / "results"
ETA = 0.95

p = em.base_profiles()
L, sur, defi, direct = p["load"], p["surplus"], p["deficit"], p["direct"]
T, tot = len(L), L.sum()
idx = np.roll(np.arange(T), -6)               # windows 06:00 -> 05:59
s, g = sur[idx], defi[idx]


def window_bound(days):
    n, m = 24 * days, 0.0
    for k in range(0, T, n):
        m += min(ETA * s[k:k + n].sum(), g[k:k + n].sum())
    return 100 * (direct.sum() + m) / tot


lp_max = 100 * em.eef_max_cfe(p, 1000.0, 24)["cfe"]
rows = [["decomposition", "100% minus losses (annual window, eta=0.95)", round(window_bound(365), 2)],
        ["decomposition", "daily windows, ignoring hour order", round(window_bound(1), 2)],
        ["decomposition", "LP, daily window from 06:00 (model)", round(lp_max, 2)],
        ["window_bound", "weekly windows", round(window_bound(7), 2)],
        ["window_bound", "monthly windows", round(window_bound(30), 2)],
        ["battery_bound", "battery, annual, eta_rt=0.9", round(100 * (direct.sum() + 0.9 * sur.sum()) / tot, 2)]]
for k in (1.0, 1.25, 1.5, 2.0):
    pk = em.base_profiles(pv_multiple=k)
    for wh in (6, 9):
        em.WINDOW_START_HOUR = wh
        rows.append(["max_cfe", f"PV x{k}, window from {wh:02d}:00", round(100 * em.eef_max_cfe(pk, 5000.0, 24)["cfe"], 2)])
em.WINDOW_START_HOUR = 6

with open(OUT / "ceiling.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["kind", "case", "max_hourly_matching_pct"])
    w.writerows(rows)
for r in rows:
    print(r)
