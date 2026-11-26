"""Scenarios along the two curves: displacement (40% to 100%) and data-center size (0.1 MW to 6 GW).

For every scenario the four configurations (GRID, AM, RE+BESS, EEF) are compared on:
  reliability   share of the data center's load served (the data center is always grid-supplied)
  cost          US$ per MWh of data-center consumption above the tariff (value case: grid reinforcement
                US$125/kW-yr on the summer-evening load not freed + carbon US$50/t; flexibility US$50/MWh shifted;
                battery mid; PV sold at cost; EEF contract overhead US$0.25 M/yr)
  emissions     hourly-accounted CO2 (average factor 0.568 t/MWh)
  grid room     the data center's load still on the grid on summer evenings (Jun-Sep, 18:00-02:00): the capacity the
                existing grid must find, or build, for the data center (the Texas lesson)

Size scenarios run at 90% and add the national flexible-load pool as a scenario: unlimited, high (29.9 GW) and low
(7.1 GW) industrial demand-response potential (KAPSARC). When the pool is short, the rest of the target is met by a
battery (EEF + storage). Per-MW results are size-independent because the LPs are linear (checked by re-solving at
10, 100 and 1,000 MW); size enters through the contract overhead and the pool.

Writes results/scenarios_displacement.csv, results/scenarios_size.csv and figures/fig_scenarios.{pdf,png}.
"""
import csv
import math

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

import plot_displacement as pdp

SITE = "riyadh"
R, C, EF = pdp.R_KW, 50.0, pdp.EF
PH, AM_X = pdp.load_phys(SITE), pdp.AM_SITE[SITE]
KT100 = 876.0 * EF                       # kt CO2/yr of a 100-MW data center fully on the grid mix (497.6)
SIZES = [0.1, 0.5, 1, 2, 5, 8, 10, 20, 50, 100, 250, 500, 1000, 1500, 3000, 4500, 6000]
POOLS = {"unlimited": float("inf"), "high (29.9 GW)": 29900.0, "low (7.1 GW)": 7100.0}
X_BASE = 0.90
COL = {"GRID": "#52514e", "AM": "#b5b4ae", "RE+BESS": "#2a78d6", "EEF": "#1baf7a"}


def scenario(X, S, pool=float("inf")):
    k = pdp.costs(X, S, R, C, ph=PH, am_x=AM_X, pool=pool)
    e, b, f = k["e"], k["b"], k["f"]
    eve = {"GRID": S, "AM": S, "RE+BESS": S * (1 - b["cov_b"]),
           "EEF": S * (f * (1 - e["cov_e"]) + (1 - f) * (1 - b["cov_b"]))}
    kt = {"GRID": KT100 * S / 100, "AM": KT100 * (1 - AM_X) * S / 100,
          "RE+BESS": KT100 * (1 - X) * S / 100, "EEF": KT100 * (1 - X) * S / 100}
    cost = {"GRID": k["GRID"], "AM": k["AM"], "RE+BESS": k["Battery"], "EEF": k["EEF"]}
    cheapest = min(cost, key=cost.get)
    works = cheapest == "EEF" and (f * e["cov_e"] + (1 - f) * b["cov_b"]) >= 0.9
    return dict(cost=cost, kt=kt, eve=eve, cheapest=cheapest, works=works, f=f,
                flex_GW=e["pf"] * S * f / 1000, bess_hybrid_MWh=(1 - f) * b["E"] * S / 100,
                design=e["design"], bess_MWh=b["E"] * S / 100, flex_per_MW=e["pf"])


# ---------------------------------------------------------------- displacement scenarios (100 MW; per-MW results)
disp_rows = []
for X in sorted(PH):
    s = scenario(X, 100.0)
    disp_rows.append([round(100 * X, 1), s["design"], round(s["flex_per_MW"], 2), round(s["bess_MWh"] / 100, 2),
                      *[round(s["cost"][c], 2) for c in COL], *[round(s["kt"][c], 1) for c in COL],
                      *[round(s["eve"][c], 1) for c in COL], s["cheapest"], "yes" if s["works"] else "no"])
with open(pdp.RES / "scenarios_displacement.csv", "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["displacement_pct", "eef_design", "flex_MW_per_MW", "battery_MWh_per_MW",
                *[f"cost_{c}_USD_per_MWh" for c in COL], *[f"emissions_{c}_kt_per_100MW" for c in COL],
                *[f"evening_grid_load_{c}_MW_per_100MW" for c in COL], "cheapest", "EEF_works"])
    w.writerows(disp_rows)
    w.writerow([100.0, "not reachable (ceiling about 99.9%: shifting loss, low-solar days, first hours of the year)"])

# ---------------------------------------------------------------- size scenarios at 90%
size_rows, curves = [], {p: [] for p in POOLS}
for pname, pool in POOLS.items():
    for S in SIZES:
        s = scenario(X_BASE, float(S), pool)
        curves[pname].append(s)
        size_rows.append([pname, S, *[round(s["cost"][c], 2) for c in COL], s["cheapest"], "yes" if s["works"] else "no",
                          round(100 * s["f"], 1), round(s["flex_GW"], 3), round(s["bess_hybrid_MWh"]),
                          *[round(s["eve"][c], 1) for c in COL], *[round(s["kt"][c] / 1000, 3) for c in COL],
                          round(R * (s["eve"]["GRID"] - s["eve"]["EEF"]) / 1000, 2)])
with open(pdp.RES / "scenarios_size.csv", "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["flex_pool", "dc_MW", *[f"cost_{c}_USD_per_MWh" for c in COL], "cheapest", "EEF_works",
                "share_met_by_flex_pct", "flex_contracted_GW", "battery_for_shortfall_MWh",
                *[f"evening_grid_load_{c}_MW" for c in COL], *[f"emissions_{c}_Mt" for c in COL],
                "reinforcement_avoided_vs_GRID_MUSD_per_yr"])
    w.writerows(size_rows)

# ---------------------------------------------------------------- figure: 2 x 3
plt.rcParams.update({"font.family": "serif", "font.serif": ["DejaVu Serif"], "font.size": 7.5,
                     "axes.spines.top": False, "axes.spines.right": False, "axes.edgecolor": "#8a8984"})
fig, ax = plt.subplots(2, 3, figsize=(7.16, 4.6), gridspec_kw=dict(hspace=.62, wspace=.38))
Xs = [r[0] for r in disp_rows]
ci, ki, ei = 4, 8, 12          # first column of cost, emissions, evening load in disp_rows
lo, hi = 85, 99.5
for j, c in enumerate(COL):
    ax[0, 0].plot(Xs, [r[ci + j] for r in disp_rows], color=COL[c], lw=1.6 if c == "EEF" else 1.1, label=c)
    ax[0, 1].plot(Xs, [r[ki + j] for r in disp_rows], color=COL[c], lw=1.6 if c == "EEF" else 1.1,
                  ls=(0, (3, 2)) if c == "RE+BESS" else "-")
    ax[0, 2].plot(Xs, [r[ei + j] for r in disp_rows], color=COL[c], lw=1.6 if c == "EEF" else 1.1,
                  ls=(0, (3, 2)) if c in ("AM", "RE+BESS") else "-")
for a, t, yl in ((ax[0, 0], "(a) Cost", "US\\$/MWh of DC load"), (ax[0, 1], "(b) Emissions", "kt CO$_2$/yr per 100 MW"),
                 (ax[0, 2], "(c) Grid load on summer evenings", "MW per 100 MW of DC")):
    a.axvspan(lo, hi, color=COL["EEF"], alpha=.12, lw=0); a.axvline(90, color="#0b0b0b", lw=.6, ls=(0, (3, 2)))
    a.set_xlim(40, 100.5); a.set_xlabel("Displacement target (%)", labelpad=1); a.set_ylabel(yl)
    a.set_title(t, loc="left", fontsize=7.5); a.grid(axis="y", color="#e4e3df", lw=.5)
ax[0, 0].legend(fontsize=6, frameon=False, ncol=2, loc="upper left")
ax[0, 0].set_ylim(0, 75); ax[0, 1].set_ylim(0, 540); ax[0, 2].set_ylim(-3, 108)
S = np.array(SIZES, dtype=float)
lss = {"unlimited": "-", "high (29.9 GW)": (0, (4, 2)), "low (7.1 GW)": (0, (1.5, 1.5))}
for c in ("GRID", "AM", "RE+BESS"):
    ax[1, 0].plot(S, [s["cost"][c] for s in curves["unlimited"]], color=COL[c], lw=1.1)
for p in POOLS:
    ax[1, 0].plot(S, [s["cost"]["EEF"] for s in curves[p]], color=COL["EEF"], lw=1.6, ls=lss[p], label=f"EEF, pool {p}")
ax[1, 0].set_ylim(0, 75); ax[1, 0].set_ylabel("US\\$/MWh of DC load"); ax[1, 0].set_title("(d) Cost at 90%", loc="left", fontsize=7.5)
ax[1, 0].legend(fontsize=5.6, frameon=False, loc="upper right")
for c in COL:
    ax[1, 1].plot(S / 1000, [s["kt"][c] / 1000 for s in curves["unlimited"]], color=COL[c], lw=1.6 if c == "EEF" else 1.1,
                  ls=(0, (3, 2)) if c == "RE+BESS" else "-")
ax[1, 1].set_ylabel("Mt CO$_2$/yr"); ax[1, 1].set_title("(e) Emissions at 90%", loc="left", fontsize=7.5)
for c in ("GRID", "RE+BESS"):
    ax[1, 2].plot(S / 1000, [s["eve"][c] / 1000 for s in curves["unlimited"]], color=COL[c], lw=1.1)
for p in POOLS:
    ax[1, 2].plot(S / 1000, [s["eve"]["EEF"] / 1000 for s in curves[p]], color=COL["EEF"], lw=1.6, ls=lss[p])
ax[1, 2].set_ylabel("GW the grid must supply"); ax[1, 2].set_title("(f) Grid load on summer evenings", loc="left", fontsize=7.5)
ax[1, 0].set_xscale("log"); ax[1, 0].set_xlim(.1, 6000)
ax[1, 0].set_xticks([.1, 1, 10, 100, 1000, 6000]); ax[1, 0].set_xticklabels(["0.1", "1", "10", "100", "1k", "6k"])
ax[1, 0].set_xlabel("Data-center size (MW)", labelpad=1)
for a in (ax[1, 1], ax[1, 2]):
    a.set_xlim(0, 6.1); a.set_xlabel("Data-center size (GW)", labelpad=1)
for a in ax[1]:
    a.grid(axis="y", color="#e4e3df", lw=.5)
fig.suptitle("Scenarios along both curves (Riyadh). Data-center load served: 100% in every scenario and configuration.",
             fontsize=7.8, x=.01, ha="left", y=.995)
for ext in ("pdf", "png"):
    fig.savefig(pdp.ROOT / "figures" / f"fig_scenarios.{ext}", dpi=300, bbox_inches="tight")

# ---------------------------------------------------------------- printed summary
print("displacement: X | design | flex/MW | cost GRID AM BESS EEF | kt EEF | evening EEF/BESS | cheapest works")
for r in disp_rows:
    print(f"{r[0]:5.1f} | {r[1]:12s} | {r[2]:4.2f} | {r[4]:5.1f} {r[5]:5.1f} {r[6]:5.1f} {r[7]:5.1f} | {r[11]:6.1f} | {r[15]:5.1f}/{r[14]:5.1f} | {r[16]:8s} {r[17]}")
print("\nsize at 90%: pool | MW | EEF cost | cheapest | works | flex share | flex GW | hybrid MWh | eve GRID/EEF MW | Mt GRID/EEF | reinf. avoided M$/yr")
for r in size_rows:
    if r[1] in (1, 5, 8, 10, 100, 1000, 1500, 3000, 4500, 6000):
        print(f"{r[0]:15s} {r[1]:6} | {r[5]:5.1f} | {r[6]:8s} {r[7]:3s} | {r[8]:5.1f}% | {r[9]:6.2f} | {r[10]:7} | {r[11]:7.0f}/{r[14]:6.1f} | {r[15]:5.2f}/{r[18]:5.2f} | {r[19]:6.1f}")
