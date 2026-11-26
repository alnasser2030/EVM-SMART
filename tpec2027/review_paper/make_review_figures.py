"""Data figures for the TPEC 2027 review paper, at IEEE column width (3.5 in), white background.

  fig_years.pdf     references by publication year (from docs/thesis/refs.bib)
  fig_mismatch.pdf  illustrative day: constant AI data center load vs PV sized to the same daily energy

Run:  python3 tpec2027/review_paper/make_review_figures.py
The diagrams (review protocol, positioning model, internal vs external flexibility) are TikZ in the .tex file.
"""
import collections
import os
import re

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BIB = os.path.join(HERE, "..", "..", "docs", "thesis", "refs.bib")
MAROON, SUN, BLUE, INK2, GRID = "#500000", "#d9962b", "#2e6db4", "#4a4a4a", "#e3e3e3"
plt.rcParams.update({
    "font.family": "serif", "font.serif": ["Times New Roman", "Nimbus Roman", "DejaVu Serif"], "font.size": 7.5,
    "axes.edgecolor": "#8a8a8a", "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2,
    "axes.spines.top": False, "axes.spines.right": False, "pdf.fonttype": 42,
})


def save(fig, name):
    fig.savefig(os.path.join(HERE, name), bbox_inches="tight", pad_inches=0.02)
    plt.close(fig)


def fig_years():
    years = [int(y) for y in re.findall(r"\byear\s*=\s*[{\"]?(\d{4})", open(BIB, encoding="utf-8").read())]
    c = collections.Counter(years)
    xs = list(range(min(c), max(c) + 1))
    recent = sum(c[y] for y in (2024, 2025, 2026))
    fig, ax = plt.subplots(figsize=(3.45, 1.25))
    ax.bar(xs, [c[x] for x in xs], color=[MAROON if x >= 2024 else "#b9a3a3" for x in xs], width=.72)
    for x in xs:
        if c[x]:
            ax.text(x, c[x] + .25, str(c[x]), ha="center", va="bottom", fontsize=6.2, color=INK2)
    ax.set_xticks([x for x in xs if x % 2 == 0 or x == xs[-1]])
    ax.tick_params(axis="x", labelsize=6.3)
    ax.set_ylim(0, max(c.values()) + 2.2)
    ax.set_ylabel("References")
    ax.grid(axis="y", color=GRID, lw=.6); ax.set_axisbelow(True)
    ax.text(.01, .97, f"n = {len(years)}; {recent} from 2024–2026", transform=ax.transAxes, va="top", fontsize=6.8, color=INK2)
    save(fig, "fig_years.pdf")
    print("years:", len(years), "recent:", recent)


def fig_mismatch():
    t = np.linspace(0, 24, 24 * 12 + 1)
    load = np.ones_like(t)
    rise, sett = 6.0, 18.0
    shape = np.where((t > rise) & (t < sett), np.clip(np.sin(np.pi * (t - rise) / (sett - rise)), 0, None) ** 1.5, 0.0)
    pv = shape * (load.sum() / shape.sum())
    fig, ax = plt.subplots(figsize=(3.45, 1.55))
    ax.fill_between(t, load, pv, where=pv > load, color=SUN, alpha=.28, lw=0)
    ax.fill_between(t, pv, load, where=pv < load, color=BLUE, alpha=.16, lw=0)
    ax.plot(t, pv, color=SUN, lw=1.5, label="PV sized to the DC's energy")
    ax.plot(t, load, color=MAROON, lw=1.5, label="AI data center load (constant)")
    ax.text(12, 1.55, "midday surplus", ha="center", fontsize=6.6, color=INK2)
    ax.text(2.6, .42, "night deficit", ha="center", fontsize=6.6, color=INK2)
    ax.text(21.4, .42, "evening deficit", ha="center", fontsize=6.6, color=INK2)
    ax.set_xlim(0, 24); ax.set_ylim(0, 3.6)
    ax.set_xticks(range(0, 25, 6)); ax.set_xlabel("Hour of day", labelpad=1)
    ax.set_ylabel("Power (p.u. of load)")
    ax.grid(axis="y", color=GRID, lw=.6); ax.set_axisbelow(True)
    ax.legend(loc="upper left", frameon=False, fontsize=6.4, handlelength=1.6)
    save(fig, "fig_mismatch.pdf")


if __name__ == "__main__":
    fig_years()
    fig_mismatch()
