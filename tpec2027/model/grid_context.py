"""National grid context for the scenarios: how much room the Saudi grid has, and how much a data center takes.

The Saudi grid already has its own growth to serve before any data center arrives: installed capacity is about
90 GW and the summer peak reached 77 GW in 2025, so the nominal margin is about 13 GW, and the peak has grown about
3 GW a year since 2020 (faster than annual consumption). Giga-projects, industry, cooling and desalination keep
using that room. This script sets the summer-evening grid load of each configuration from the size scenarios
(results/scenarios_size.csv, 90% target) against those national numbers.

Writes results/saudi_grid_context.csv (facts and sources), results/grid_context_dc.csv (per size) and
figures/fig_grid_context.{pdf,png}.
Run after model/run_scenarios.py:  python3 tpec2027/model/grid_context.py
"""
import csv
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
RES, FIG = ROOT / "results", ROOT / "figures"
COL = {"GRID": "#52514e", "RE+BESS": "#2a78d6", "EEF": "#1baf7a"}
INK, INK2, GRIDC, BAR = "#0b0b0b", "#4a4a4a", "#e4e3df", "#b5b4ae"

KAPSARC = "KAPSARC DP00535 (2026), Fig. 1b and Sec. 2 [r23]"
MEES = "MEES, 1 May 2026, 'Saudi Arabia advances power system upgrades'"
V2030 = "vision2030.ai, 'Saudi Arabia electricity consumption' (secondary source)"
PEAK = {2020: 62.3, 2021: 64.2, 2022: 65.3, 2023: 70.7, 2024: 74.8}   # GW, observed (SERA), via KAPSARC Fig. 1b
PEAK_2025, FORECAST_2025, CAPACITY = 77.08, 69.2, 90.0
FACTS = [
    ("Installed generation capacity", "more than 90", "GW", 2025, V2030),
    ("Summer peak load, record", PEAK_2025, "GW", 2025, MEES + " (+3% on 2024)"),
    *[("Summer peak load, observed", v, "GW", y, KAPSARC) for y, v in PEAK.items()],
    ("Peak forecast for 2025 made in 2021", FORECAST_2025, "GW", 2025, KAPSARC + "; exceeded by the observed peak since 2023"),
    ("Peak growth 2022-2023", 8.2, "%", 2023, KAPSARC + "; faster than annual consumption"),
    ("Annual demand growth since 2020", "more than 2", "%/yr", 2025, KAPSARC),
    ("Variable renewable capacity", 4.1, "GW", 2024, KAPSARC + " (SERA 2025)"),
    ("Variable renewable capacity, plan", "100-130", "GW", 2030, KAPSARC),
    ("Gas capacity, plan", 110, "GW", 2030, KAPSARC),
    ("Battery storage, plan", 48, "GWh", 2030, KAPSARC),
    ("Interconnection", "1.6 to 7.4", "GW", 2030, KAPSARC),
    ("Data-center demand, business as usual", 10, "TWh/yr", 2030, KAPSARC + " citing Alshehri et al. 2026"),
    ("Data-center demand, moderate AI", 20, "TWh/yr", 2030, KAPSARC + " citing Alshehri et al. 2026"),
]
growth = (PEAK_2025 - PEAK[2020]) / 5            # GW/yr, 2020-2025 average
margin = CAPACITY - PEAK_2025                     # nominal; less is available on a hot summer evening
dc2030 = (10e6 / 8760 / 1000, 20e6 / 8760 / 1000)  # TWh/yr -> GW of constant load (1.14, 2.28)

with open(RES / "saudi_grid_context.csv", "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["quantity", "value", "unit", "year", "source"])
    w.writerows(FACTS)
    w.writerow(["Peak growth 2020-2025, average (derived)", round(growth, 2), "GW/yr", 2025, "from the rows above"])
    w.writerow(["Nominal margin, capacity minus peak (derived)", round(margin, 1), "GW", 2025, "from the rows above"])

# ------------------------------------------------------------------ per-size table (90% target)
rows = {}
with open(RES / "scenarios_size.csv") as fh:
    for r in csv.DictReader(fh):
        rows.setdefault(r["flex_pool"], []).append(r)


def eve(pool, cfg):
    return [(float(r["dc_MW"]) / 1000, float(r[f"evening_grid_load_{cfg}_MW"]) / 1000) for r in rows[pool]]


out = []
for ru, rl in zip(rows["unlimited"], rows["low (7.1 GW)"]):
    S = float(ru["dc_MW"])
    if S < 100:
        continue
    g, b, e, el = (float(ru["evening_grid_load_GRID_MW"]), float(ru["evening_grid_load_RE+BESS_MW"]),
                   float(ru["evening_grid_load_EEF_MW"]), float(rl["evening_grid_load_EEF_MW"]))
    out.append([S, g, round(b, 1), round(e, 1), round(el, 1),
                *[round(100 * x / 1000 / PEAK_2025, 3) for x in (g, b, e)],
                *[round(100 * x / 1000 / margin, 2) for x in (g, b, e)],
                *[round(x / 1000 / growth, 3) for x in (g, b, e)]])
with open(RES / "grid_context_dc.csv", "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["dc_MW", "evening_GRID_MW", "evening_RE+BESS_MW", "evening_EEF_MW", "evening_EEF_low_pool_MW",
                "GRID_pct_of_2025_peak", "RE+BESS_pct_of_2025_peak", "EEF_pct_of_2025_peak",
                "GRID_pct_of_nominal_margin", "RE+BESS_pct_of_nominal_margin", "EEF_pct_of_nominal_margin",
                "GRID_years_of_peak_growth", "RE+BESS_years_of_peak_growth", "EEF_years_of_peak_growth"])
    w.writerows(out)

# ------------------------------------------------------------------ figure
plt.rcParams.update({"font.family": "serif", "font.serif": ["DejaVu Serif"], "font.size": 7.5,
                     "axes.spines.top": False, "axes.spines.right": False, "axes.edgecolor": "#8a8984",
                     "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2})
fig, (a, b) = plt.subplots(1, 2, figsize=(7.16, 2.6), gridspec_kw=dict(wspace=.3, width_ratios=[1, 1.25]))

years = [*PEAK, 2025]
vals = [*PEAK.values(), PEAK_2025]
a.bar(years, vals, width=.62, color=BAR, edgecolor="white", lw=1)
a.bar([2025], [PEAK_2025], width=.62, color="none", edgecolor=INK2, hatch="////", lw=0)
for y, v in zip(years, vals):
    a.text(y, v + 1.2, f"{v:.1f}", ha="center", fontsize=6.4, color=INK2)
a.axhline(CAPACITY, color=INK, lw=1.1, ls=(0, (4, 2)))
a.text(2019.6, CAPACITY + 2, "Installed capacity, about 90 GW", fontsize=6.6, color=INK)
a.scatter([2025], [FORECAST_2025], marker="D", s=16, facecolor="white", edgecolor=INK, zorder=4, lw=.9)
a.annotate("2025 peak forecast\nmade in 2021", (2025, FORECAST_2025), (2023.15, 50), fontsize=6, color=INK2,
           arrowprops=dict(arrowstyle="-", color=INK2, lw=.6), ha="center")
a.annotate("", (2025.5, CAPACITY - .4), (2025.5, PEAK_2025 + .4), arrowprops=dict(arrowstyle="<->", color=INK, lw=.8))
a.text(2025.62, (CAPACITY + PEAK_2025) / 2 - 1, f"≈{margin:.0f} GW\nmargin", fontsize=6.2, va="center", color=INK)
a.set_xlim(2019.5, 2026.6); a.set_ylim(0, 100); a.set_xticks(years)
a.set_ylabel("GW"); a.grid(axis="y", color=GRIDC, lw=.5); a.set_axisbelow(True)
a.set_title(f"(a) Saudi summer peak: +{PEAK_2025 - PEAK[2020]:.1f} GW\nin five years, about {growth:.0f} GW a year",
            loc="left", fontsize=7.5)

b.axvspan(*dc2030, color=BAR, alpha=.35, lw=0)
b.text(sum(dc2030) / 2, 5.85, "all Saudi\ndata centers\nin 2030:\n10–20 TWh/yr", ha="center", va="top", fontsize=5.9, color=INK2)
b.axhline(growth, color=INK, lw=.7, ls=(0, (1.5, 1.5)))
b.text(.06, growth + .08, f"national peak growth\nin one year (≈{growth:.0f} GW)", ha="left", va="bottom",
       fontsize=6.2, color=INK)
for cfg, ls, lw in (("GRID", "-", 1.3), ("RE+BESS", (0, (3, 2)), 1.3), ("EEF", "-", 1.8)):
    xs, ys = zip(*eve("unlimited", cfg))
    b.plot(xs, ys, color=COL[cfg], ls=ls, lw=lw)
xs, ys = zip(*eve("low (7.1 GW)", "EEF"))
b.plot(xs, ys, color=COL["EEF"], ls=(0, (1, 1.2)), lw=1.6)
g6 = out[-1]
b.text(5.95, 2.7, f"GRID adds the full 6 GW\n= {g6[5]:.1f}% of the 2025 peak\n= {g6[8]:.0f}% of the margin", ha="right",
       va="top", fontsize=6.2, color=INK)
b.text(5.95, .45, f"at 6 GW: RE+BESS {g6[2]:.0f} MW;\nEEF {g6[3]:.0f} MW ({g6[7]:.2f}% of the peak),\n"
       f"{g6[4]:.0f} MW with a small pool (dotted)", ha="right", fontsize=6.0, color=INK)
b.set_xlim(0, 6.1); b.set_ylim(0, 6.6)
b.set_xlabel("Data-center size (GW)", labelpad=1); b.set_ylabel("GW added at the evening peak")
b.grid(axis="y", color=GRIDC, lw=.5); b.set_axisbelow(True)
b.set_title("(b) What one data center adds to that peak\non summer evenings (90% target)", loc="left", fontsize=7.5)
handles = [plt.Line2D([], [], color=COL[c], ls=s, lw=w) for c, s, w in
           (("GRID", "-", 1.3), ("RE+BESS", (0, (3, 2)), 1.3), ("EEF", "-", 1.8))]
b.legend(handles, ["GRID", "RE+BESS", "EEF"], fontsize=6, frameon=False, loc="upper left", bbox_to_anchor=(0, 1.02), ncol=3,
         handlelength=2.2, columnspacing=1.2)
for ext in ("pdf", "png"):
    fig.savefig(FIG / f"fig_grid_context.{ext}", dpi=300, bbox_inches="tight")

print(f"peak growth {growth:.2f} GW/yr; nominal margin {margin:.1f} GW; DC 2030 {dc2030[0]:.2f}-{dc2030[1]:.2f} GW")
print("MW | evening GRID / RE+BESS / EEF / EEF low pool | % of peak GRID/BESS/EEF | % of margin | years of growth")
for r in out:
    print(f"{r[0]:6.0f} | {r[1]:6.0f} {r[2]:6.1f} {r[3]:6.1f} {r[4]:6.1f} | {r[5]:5.2f} {r[6]:5.3f} {r[7]:5.3f} | "
          f"{r[8]:5.1f} {r[9]:5.2f} {r[10]:5.2f} | {r[11]:5.2f} {r[12]:5.3f} {r[13]:5.3f}")
