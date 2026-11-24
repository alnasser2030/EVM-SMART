"""Where EEF is the best choice across data-center sizes (Riyadh, 80% hourly matching).

The planning LP is linear, so per-MW results are size-independent. Size enters through
three parametric effects (all stated as assumptions, to be refined in Chapters 5-6):
  1. a fixed annual overhead F per EEF contract (metering, M&V, registry, aggregator admin);
  2. the flexibility pool Q available to the data center (regional 2 GW or the national
     low estimate of 7.1 GW); beyond it, the remaining matching is met by storage (hybrid);
  3. battery cost per kWh is taken as size-independent (low/mid/high NREL 2030 cases).

Writes tpec2027/results/size_map.csv (costs per MWh of data-center load, US$).
"""
import csv
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "results"
E_PER_MW = 8.76                    # GWh/yr per MW of constant load
SHIFT_PER_MW = 346.66 / 100        # GWh/yr shifted per MW at 80% (from the 100-MW run)
FLEX_PER_MW = 1.404                # MW of contracted flexibility per MW of DC at 80%
BESS = {"low": 18.06, "mid": 30.15, "high": 49.23}   # US$ M/yr per 100 MW at 80%
PRICE = 50.0                       # US$/MWh shifted (assumed flexibility price, mid)
SIZES = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000, 3000, 5000, 6600, 10000]
OVERHEAD = [0.1, 0.25, 0.5]        # US$ M/yr per EEF contract (assumption)
POOLS = {"regional 2 GW": 2000.0, "national low 7.1 GW": 7100.0}

rows = []
for S in SIZES:
    e_mwh = E_PER_MW * S * 1e3                       # MWh/yr of DC load
    bess = {k: v / 100 * S * 1e6 / e_mwh for k, v in BESS.items()}   # US$/MWh
    eef_var = PRICE * SHIFT_PER_MW * S * 1e3 / e_mwh                 # US$/MWh of DC load
    for F in OVERHEAD:
        for pname, Q in POOLS.items():
            f = min(1.0, Q / (FLEX_PER_MW * S))       # share of the target EEF can deliver
            eef = F * 1e6 / e_mwh + f * eef_var + (1 - f) * bess["mid"]
            breakeven = (BESS["mid"] / 100 * S * 1e6 - F * 1e6) / (SHIFT_PER_MW * S * 1e3)
            rows.append([S, F, pname, round(f, 3), round(eef, 2), round(bess["low"], 2), round(bess["mid"], 2),
                         round(bess["high"], 2), round(breakeven, 1), round(0.593 * S, 1), round(0.492 * S, 1)])

with open(OUT / "size_map.csv", "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["dc_MW", "eef_overhead_MUSD_per_yr", "flex_pool", "eef_share_of_target", "eef_or_hybrid_USD_per_MWh",
                "bess_low_USD_per_MWh", "bess_mid_USD_per_MWh", "bess_high_USD_per_MWh",
                "eef_breakeven_price_USD_per_MWh_shifted", "night_load_cut_eef_MW", "night_load_cut_bess_MW"])
    w.writerows(rows)

for r in rows:
    if r[1] == 0.25 and r[2] == "regional 2 GW" or (r[1] == 0.25 and r[0] >= 2000):
        print(r)
