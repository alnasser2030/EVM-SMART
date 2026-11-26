"""Check that the planning LPs scale linearly with data-center size.

The LPs have no fixed costs or integer decisions, so scaling the load and the PV plant by a factor scales every
feasible solution by the same factor. This script confirms it numerically: it re-solves the 90% target (Riyadh,
PV = annual use, window from 06:00, D = 8 h) at 10, 100 and 1,000 MW and reports the results per MW of data center,
with the solve time of each LP. Size therefore enters the comparison only through the fixed contract overhead and
the national flexible-load pool (plot_displacement.costs, run_scenarios.py).

Writes results/scaling_check.csv.   Run:  python3 tpec2027/model/check_scaling.py
"""
import csv
import time

import eef_model as em

X, D = 0.90, 8.0
rows = []
for size in (10.0, 100.0, 1000.0):
    em.L_MW = size
    prof = em.base_profiles(1.0, "riyadh")
    t0 = time.perf_counter(); e = em.eef_min_capacity(prof, X, D); te = time.perf_counter() - t0
    t0 = time.perf_counter(); b = em.bess_min_energy(prof, X); tb = time.perf_counter() - t0
    shifted = e["d"].sum() / prof["load"].sum()
    rows.append([size, round(prof["cap_mw"] / size, 4), round(e["P_F"] / size, 4), round(b["E"] / size, 3),
                 round(100 * shifted, 2), round(100 * e["cfe"], 2), round(100 * b["cfe"], 2), round(te, 2), round(tb, 2)])
    print(f"{size:6.0f} MW | PV {prof['cap_mw'] / size:.4f} MWp/MW | flex {e['P_F'] / size:.4f} MW/MW | "
          f"battery {b['E'] / size:.3f} MWh/MW | shifted {100 * shifted:.2f}% | solve {te:.2f} s / {tb:.2f} s")
with open(em.ROOT / "results" / "scaling_check.csv", "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["dc_MW", "pv_MWp_per_MW", "flex_MW_per_MW", "battery_MWh_per_MW", "shifted_pct_of_load",
                "cfe_EEF_pct", "cfe_BESS_pct", "solve_s_EEF", "solve_s_BESS"])
    w.writerows(rows)
