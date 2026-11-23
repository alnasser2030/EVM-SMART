"""Figures for the TPEC 2027 paper (IEEE column width ~3.5 in). Output: PDF + PNG."""
import csv
import os
import sys
from collections import defaultdict
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

HERE = Path(__file__).resolve().parent
RES = HERE.parent / "results"
INK, INK2, MUTED, GRID, SURF = "#0b0b0b", "#52514e", "#8a8984", "#e4e3df", "#ffffff"
BLUE, ORANGE, AQUA = "#2a78d6", "#eb6834", "#1baf7a"
plt.rcParams.update({"font.family": "serif", "font.serif": ["DejaVu Serif"], "font.size": 8,
                     "axes.edgecolor": MUTED, "axes.labelcolor": INK, "xtick.color": INK2, "ytick.color": INK2,
                     "axes.linewidth": 0.6, "legend.frameon": False, "savefig.facecolor": SURF})
W1 = 3.5   # single column width (in)


def rd(name):
    with open(RES / name) as f:
        return list(csv.DictReader(f))


def save(fig, name):
    for ext in ("pdf", "png"):
        fig.savefig(HERE / f"{name}.{ext}", dpi=300, bbox_inches="tight")
    plt.close(fig)


def style(ax):
    ax.grid(axis="y", color=GRID, lw=0.6); ax.set_axisbelow(True)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)


# ---------------------------------------------------------------- Fig. 1 architecture
def fig_architecture():
    fig, ax = plt.subplots(figsize=(7.16, 2.6))
    ax.set_xlim(0, 13.2); ax.set_ylim(-0.1, 4.3); ax.axis("off")
    BW, BH = 2.9, 1.0

    def box(x, y, title, sub, fc="#f3f2ef", ec=GRID, tc=INK, sc=INK2):
        ax.add_patch(FancyBboxPatch((x, y), BW, BH, boxstyle="round,pad=0,rounding_size=0.08", fc=fc, ec=ec, lw=0.9))
        ax.text(x + BW / 2, y + BH * 0.63, title, ha="center", va="center", fontsize=8, fontweight="bold", color=tc)
        ax.text(x + BW / 2, y + BH * 0.28, sub, ha="center", va="center", fontsize=6.2, color=sc)

    def arrow(p1, p2, color=INK2, ls="-", lw=1.2, rad=0.0):
        ax.add_patch(FancyArrowPatch(p1, p2, arrowstyle="-|>", mutation_scale=9, color=color, lw=lw,
                                     linestyle=ls, connectionstyle=f"arc3,rad={rad}", shrinkA=2, shrinkB=2))

    def label(x, y, t, ha="center"):
        ax.text(x, y, t, ha=ha, va="center", fontsize=6.3, color=INK2)

    X1, X2, X3 = 0.1, 4.45, 8.8
    YT, YB = 3.0, 0.75
    box(X1, YT, "PV plant", "sized to annual DC energy")
    box(X2, YT, "Power grid", "single buyer + operator")
    box(X1, YB, "AI data center", "constant load", fc=BLUE, ec=BLUE, tc="white", sc="white")
    box(X2, YB, "Aggregator", "contracts and dispatches")
    box(X3, YT, "Flexible loads", "desal., cooling, pumping", fc=AQUA, ec=AQUA, tc="white", sc="white")
    box(X3, YB, "Registry", "hourly credits, M&V")
    # energy (solid)
    arrow((X1 + BW, 3.5), (X2, 3.5), color=ORANGE, lw=1.6); label((X1 + BW + X2) / 2, 3.72, "all PV injected")
    arrow((X2 + 0.6, YT), (X1 + BW - 0.4, YB + BH), color=BLUE, lw=1.6); label(2.75, 2.35, "all DC energy", ha="right")
    arrow((X2 + BW, 3.68), (X3, 3.68), color=AQUA, lw=1.6); label((X2 + BW + X3) / 2, 3.9, "up at midday")
    arrow((X3, 3.25), (X2 + BW, 3.25), color=AQUA, lw=1.6, ls=(0, (3, 2))); label((X2 + BW + X3) / 2, 3.03, "down at night")
    # contracts / data (dashed grey)
    arrow((X1 + BW, 1.25), (X2, 1.25), ls=(0, (2, 2))); label((X1 + BW + X2) / 2, 1.47, "flex contract")
    arrow((X2 + BW, 1.25), (X3, 1.25), ls=(0, (2, 2))); label((X2 + BW + X3) / 2, 1.47, "verified shifts")
    arrow((X2 + BW - 0.5, YB + BH), (X3 + 0.4, YT), ls=(0, (2, 2)), rad=-0.12); label(7.6, 2.3, "dispatch")
    arrow((X3 + BW / 2, YB), (X1 + BW / 2, YB), ls=(0, (1, 2)), rad=-0.12)
    label((X1 + X3 + BW) / 2, -0.02, "displacement credits for verified matched hours")
    # control layers
    ax.add_patch(FancyBboxPatch((11.95, 0.75), 1.2, 3.25, boxstyle="round,pad=0,rounding_size=0.06",
                                fc="white", ec=MUTED, lw=0.7))
    ax.text(12.55, 3.72, "Control", ha="center", fontsize=7.2, fontweight="bold")
    for i, (a, b) in enumerate([("Planning", "years"), ("Day-ahead", "schedule"), ("Intraday", "MPC"),
                                ("Settlement", "M&V")]):
        y = 3.25 - i * 0.68
        ax.text(12.55, y, a, ha="center", fontsize=6.6, color=INK)
        ax.text(12.55, y - 0.21, b, ha="center", fontsize=6.0, color=INK2)
    save(fig, "fig1_architecture")


# ---------------------------------------------------------------- Fig. 2 typical days
def fig_dispatch():
    rows = rd("dispatch_days.csv")
    by = defaultdict(list)
    for r in rows:
        by[r["day"]].append(r)
    fig, axes = plt.subplots(1, 2, figsize=(W1, 1.75), sharey=True)
    for ax, (day, rs) in zip(axes, by.items()):
        h = [int(r["hour"]) for r in rs]
        pv = [float(r["pv_MW"]) for r in rs]; ld = [float(r["load_MW"]) for r in rs]
        up = [float(r["up_MW"]) for r in rs]; dn = [-float(r["down_MW"]) for r in rs]
        ax.bar(h, up, width=0.8, color=AQUA, lw=0, label="Flex up")
        ax.bar(h, dn, width=0.8, color="white", edgecolor=AQUA, hatch="////", lw=0.6, label="Flex down")
        ax.plot(h, pv, color=ORANGE, lw=1.4, label="PV")
        ax.plot(h, ld, color=BLUE, lw=1.4, label="DC load")
        ax.axhline(0, color=MUTED, lw=0.5)
        ax.set_title(day, fontsize=7.5, color=INK); ax.set_xticks([0, 6, 12, 18, 23]); ax.set_xlabel("Hour")
        style(ax)
    axes[0].set_ylabel("MW")
    h_, l_ = axes[0].get_legend_handles_labels()
    fig.legend(h_, l_, fontsize=6.3, loc="lower center", ncol=4, bbox_to_anchor=(0.5, -0.06), handlelength=1.4)
    fig.tight_layout(w_pad=0.6, rect=(0, 0.08, 1, 1))
    save(fig, "fig2_dispatch")


# ---------------------------------------------------------------- Fig. 3 CFE vs flexible capacity
def fig_cfe_curve():
    rows = rd("cfe_vs_flex.csv")
    fig, ax = plt.subplots(figsize=(W1, 2.0))
    for D, col, lab in (("4", ORANGE, "4 h"), ("8", BLUE, "8 h"), ("12", AQUA, "12 h")):
        rs = [r for r in rows if r["D_h"] == D]
        x = [float(r["P_F_over_L"]) for r in rs]; y = [100 * float(r["cfe"]) for r in rs]
        ax.plot(x, y, color=col, lw=1.6 if D != "12" else 1.2, ls="-" if D != "12" else (0, (3, 2)),
                marker="o", ms=2.2, label=f"EEF, shift duration {lab}")
    am = 100 * float(rows[0]["cfe"])
    ax.axhline(am, color=MUTED, lw=0.8, ls=(0, (2, 2)))
    ax.text(0.05, am - 4, f"AM only ({am:.1f}%)", ha="left", fontsize=6.5, color=INK2)
    ax.set_xlabel("Contracted flexible power / DC load (–)"); ax.set_ylabel("Hourly matching (CFE, %)")
    ax.set_ylim(30, 100); ax.set_xlim(0, 3.2)
    style(ax); ax.legend(fontsize=6.5, loc="lower right")
    save(fig, "fig3_cfe_vs_flex")


# ---------------------------------------------------------------- Fig. 4 annual cost vs target
def fig_cost():
    rows = rd("targets.csv")
    X = [100 * float(r["target_cfe"]) for r in rows]
    lo = [float(r["bess_cost_low_USDyr"]) / 1e6 for r in rows]
    mid = [float(r["bess_cost_mid_USDyr"]) / 1e6 for r in rows]
    hi = [float(r["bess_cost_high_USDyr"]) / 1e6 for r in rows]
    sh = [float(r["eef8_shifted_MWh"]) for r in rows]
    fig, ax = plt.subplots(figsize=(W1, 2.0))
    ax.fill_between(X, lo, hi, color=BLUE, alpha=0.12, lw=0)
    ax.plot(X, mid, color=BLUE, lw=1.6, label="RE+BESS (mid; band = low–high cost)")
    for price, ls in ((25, (0, (1, 1.5))), (50, (0, (4, 2))), (75, "-")):
        ax.plot(X, [s * price / 1e6 for s in sh], color=AQUA, lw=1.3, ls=ls, label=f"EEF at US${price}/MWh shifted")
    ax.set_xlabel("Hourly matching target (CFE, %)"); ax.set_ylabel("Annual cost (MUS$/yr)")
    ax.set_xlim(min(X), max(X)); ax.set_ylim(0, max(hi) * 1.05)
    style(ax); ax.legend(fontsize=6, loc="upper left")
    save(fig, "fig4_cost")


if __name__ == "__main__":
    fig_architecture(); fig_dispatch(); fig_cfe_curve(); fig_cost()
    print("figures written")
