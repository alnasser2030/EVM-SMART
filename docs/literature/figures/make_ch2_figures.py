"""Generate Chapter 2 figures (PNG 300 dpi + PDF) for the literature review.

Run:  python3 docs/literature/figures/make_ch2_figures.py
Outputs are written next to this script.
Colors follow the validated reference palette (blue #2a78d6, orange #eb6834).
"""
import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

OUT = os.path.dirname(os.path.abspath(__file__))
SURF, INK, INK2, MUTED, GRID = "#fcfcfb", "#0b0b0b", "#52514e", "#8a8984", "#e4e3df"
BLUE, ORANGE = "#2a78d6", "#eb6834"
plt.rcParams.update({
    "font.family": "DejaVu Sans", "font.size": 10, "axes.edgecolor": MUTED,
    "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2,
    "figure.facecolor": SURF, "axes.facecolor": SURF, "savefig.facecolor": SURF,
})


def save(fig, name):
    for ext in ("png", "pdf"):
        fig.savefig(os.path.join(OUT, f"{name}.{ext}"), dpi=300, bbox_inches="tight")
    plt.close(fig)


# ---------------------------------------------------------------- Fig 2.1
def fig_hourly_mismatch():
    """Illustrative day: constant AI DC load vs PV sized to the same daily energy."""
    t = np.linspace(0, 24, 24 * 12 + 1)
    load = np.ones_like(t)
    sunrise, sunset = 6.0, 18.0
    shape = np.where((t > sunrise) & (t < sunset),
                     np.clip(np.sin(np.pi * (t - sunrise) / (sunset - sunrise)), 0, None) ** 1.5, 0.0)
    pv = shape * (load.sum() / shape.sum())          # same daily energy as the load

    fig, ax = plt.subplots(figsize=(7.2, 3.6))
    ax.fill_between(t, load, pv, where=pv > load, color=ORANGE, alpha=0.22, lw=0)
    ax.fill_between(t, pv, load, where=pv < load, color=BLUE, alpha=0.14, lw=0)
    ax.plot(t, pv, color=ORANGE, lw=2, label="PV output (sized to annual DC energy)")
    ax.plot(t, load, color=BLUE, lw=2, label="AI data center load (constant)")

    ax.text(12, 1.75, "Midday surplus\ninjected into\nthe grid →\nabsorbed by\nexternal flexible\nloads (shift up)",
            ha="center", va="center", fontsize=8.5, color=INK)
    ax.text(3, 0.45, "Night deficit\nsupplied by the grid\n→ external loads\n    shift down",
            ha="center", va="center", fontsize=8.5, color=INK)
    ax.text(21, 0.45, "Evening deficit", ha="center", va="center", fontsize=8.5, color=INK)
    
    ax.set_xlim(0, 24); ax.set_ylim(0, 4.0)
    ax.set_xticks(range(0, 25, 3)); ax.set_xlabel("Hour of day")
    ax.set_ylabel("Power (per unit of DC load)")
    ax.grid(axis="y", color=GRID, lw=0.8); ax.set_axisbelow(True)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.legend(loc="upper left", frameon=False, fontsize=8.5)
    ax.set_title("Illustrative: annual energy matched, hourly supply not matched",
                 loc="left", fontsize=10, color=INK)
    save(fig, "fig2_1_hourly_mismatch")


# ---------------------------------------------------------------- Fig 2.2
def fig_positioning_map():
    """Research positioning: source of flexibility × purpose."""
    cols = ["Inside the\ndata center\n(workloads, UPS)",
            "Buyer's supply\nassets (PPAs,\nPV, storage)",
            "Other loads\non the grid"]
    rows = ["Buyer's hourly\nclean supply\n(24/7\nmatching)",
            "System\nservices\nand cost"]
    cells = {
        (0, 0): ("DC spatio-temporal\nload shifting for\n24/7 matching", "lit"),
        (0, 1): ("Hourly-matching\nprocurement with\ngeneration + storage", "lit"),
        (0, 2): ("External Energy\nFlexibility\n(this work)", "eef"),
        (1, 0): ("DC demand response,\npeak shaving,\nAI DC flexibility", "lit"),
        (1, 1): ("Renewable + storage\nsizing, colocation", "lit"),
        (1, 2): ("Demand response\nprocured by\nsystem operators", "lit"),
    }
    fig, ax = plt.subplots(figsize=(8.4, 5.0))
    ax.set_xlim(0, 3.55); ax.set_ylim(0, 2.75); ax.axis("off")
    x0, y0, w, h = 0.55, 0.0, 1.0, 1.0
    for (r, c), (txt, kind) in cells.items():
        x, y = x0 + c * w, y0 + (1 - r) * h
        eef = kind == "eef"
        box = FancyBboxPatch((x + 0.04, y + 0.06), w - 0.08, h - 0.12,
                             boxstyle="round,pad=0,rounding_size=0.04",
                             fc=ORANGE if eef else "#f1f0ed",
                             ec=ORANGE if eef else GRID, lw=1.2,
                             alpha=0.95 if eef else 1)
        ax.add_patch(box)
        ax.text(x + w / 2, y + h / 2, txt, ha="center", va="center",
                fontsize=8.5 if not eef else 10, color="white" if eef else INK,
                fontweight="bold" if eef else "normal")
    for c, lab in enumerate(cols):
        ax.text(x0 + c * w + w / 2, 2.32, lab, ha="center", va="center", fontsize=8.5, color=INK2)
    for r, lab in enumerate(rows):
        ax.text(0.27, y0 + (1 - r) * h + h / 2, lab, ha="center", va="center", fontsize=8.5, color=INK2)
    ax.text(x0 + 1.5 * w, 2.62, "Source of flexibility →", ha="center", fontsize=9, color=INK)
    ax.text(0.27, 2.32, "Purpose ↓", ha="center", va="center", fontsize=9, color=INK)
    save(fig, "fig2_2_positioning_map")


# ---------------------------------------------------------------- Fig 2.3
def fig_refs_by_year():
    years = [2024, 2013, 2020, 2021, 2019, 2019, 2023, 2026, 2025, 2024, 2024, 2022, 2022,
             2026, 2026, 2024, 2017, 2026, 2024, 2023, 2022, 2026, 2026, 2026, 2021, 2026,
             2026, 2026, 2022, 2024, 2018, 2016, 2024, 2025, 2026, 2024, 2017, 2020, 2018, 2025]
    yrs = np.arange(2013, 2027)
    cnt = np.array([years.count(y) for y in yrs])
    recent = sum(c for y, c in zip(yrs, cnt) if y >= 2024)
    fig, ax = plt.subplots(figsize=(7.2, 3.0))
    bars = ax.bar(yrs, cnt, width=0.7, color=BLUE, edgecolor=SURF, linewidth=2)
    for b, c in zip(bars, cnt):
        if c:
            ax.text(b.get_x() + b.get_width() / 2, c + 0.2, str(c), ha="center", fontsize=8, color=INK2)
    ax.set_xticks(yrs); ax.tick_params(axis="x", labelsize=8)
    ax.set_ylabel("References"); ax.set_ylim(0, max(cnt) + 2)
    ax.grid(axis="y", color=GRID, lw=0.8); ax.set_axisbelow(True)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.set_title(f"References by publication year (n = {len(years)}; {recent} from 2024–2026)",
                 loc="left", fontsize=10, color=INK)
    save(fig, "fig2_3_references_by_year")


if __name__ == "__main__":
    fig_hourly_mismatch(); fig_positioning_map(); fig_refs_by_year()
    print("figures written to", OUT)
