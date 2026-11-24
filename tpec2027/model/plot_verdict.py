"""The verdict in two curves: for which displacement range and which data-center sizes EEF is the best option.

Curve 1 (displacement, 100-MW data center): EEF's 25-year cost advantage over the cheapest alternative
(GRID, AM or battery), and the share of summer evenings freed on the grid.
Curve 2 (size, at the recommended displacement): the same advantage against data-center size.
Both for Riyadh and NEOM. The Saudi grid is one interconnected system and the national flexible-load potential
(7.1-29.9 GW) exceeds the data-center capacity planned so far, so flexible load is not a limit here (Chapter 6 tests it).
The largest single campus planned is about 1.5 GW; larger figures are groups of campuses.
"Works" = EEF is the cheapest of the four AND it frees >= 90% of the data center's load on summer evenings.
Value case: grid reinforcement avoided (US$125/kW-yr) + carbon (US$50/t); other assumptions as plot_displacement.py.
Writes results/verdict_ranges.csv and figures/fig_verdict_curves.png.
"""
import csv

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

import plot_displacement as pdp

R, C = pdp.R_KW, 50.0
X_REC = 0.90
EVE_MIN = 0.90
S_MAX = 1500.0                     # MW, largest single campus planned in Saudi Arabia
SITES = {"riyadh": ("Riyadh", "-"), "neom": ("NEOM", "--")}
SIZES = np.logspace(0, np.log10(S_MAX), 361)
MAROON, BLUE, GREY = pdp.COL["EEF"], pdp.COL["Battery"], "#6B6E70"


def advantage(ph, X, S, am_x):
    k = pdp.costs(X, S, R, C, ph=ph, am_x=am_x)
    return min(k["GRID"], k["AM"], k["Battery"]) - k["EEF"], k["Battery"] - k["EEF"], k["f"], k["e"]


out, curves = [], {}
for site in SITES:
    ph, am_x = pdp.load_phys(site), pdp.AM_SITE[site]
    xs = sorted(ph)
    adv = [advantage(ph, X, 100.0, am_x) for X in xs]
    eve = [a[3]["cov_e"] for a in adv]
    ok = [X for X, a, ev in zip(xs, adv, eve) if a[0] > 0 and ev >= EVE_MIN]
    sz = [advantage(ph, X_REC, S, am_x) for S in SIZES]
    win = [S for S, a in zip(SIZES, sz) if a[0] > 0]
    beat_b = [S for S, a in zip(SIZES, sz) if a[1] > 0]
    curves[site] = dict(xs=xs, adv=adv, eve=eve, sz=sz)
    i90 = xs.index(X_REC)
    out.append([site, round(100 * min(ok)), round(100 * max(ok)), round(min(win), 1), round(max(win)),
                round(min(beat_b), 1), round(X_REC * 100), round(adv[i90][0], 2), round(adv[i90][1], 2)])
    print(site, "displacement", min(ok), "-", max(ok), "| size", round(min(win), 1), "-", round(max(win)),
          "| beats battery from", round(min(beat_b), 1), "| saving at 90%/100 MW", round(adv[i90][0], 2), round(adv[i90][1], 2))
with open(pdp.RES / "verdict_ranges.csv", "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["site", "displacement_min_pct", "displacement_max_pct", "size_min_MW", "size_max_MW_largest_campus",
                "size_min_MW_vs_battery", "size_curve_at_pct", "saving_vs_cheapest_USD_per_MWh_100MW",
                "saving_vs_battery_USD_per_MWh_100MW"])
    w.writerows(out)

plt.rcParams.update({"text.parse_math": False, "font.family": "DejaVu Sans", "font.size": 10.5,
                     "axes.spines.top": False, "axes.spines.right": False, "axes.edgecolor": "#9A9A9A",
                     "axes.titleweight": "bold", "axes.titlesize": 11.5, "axes.titlelocation": "left"})
fig = plt.figure(figsize=(15, 8.4), dpi=150)
gs = fig.add_gridspec(2, 2, height_ratios=[2.2, 1], hspace=.45, wspace=.18)
ax1, ax3, ax2 = fig.add_subplot(gs[0, 0]), fig.add_subplot(gs[1, 0]), fig.add_subplot(gs[:, 1])
r_lo, r_hi = min(o[1] for o in out), max(o[2] for o in out)
for site, (lab, ls) in SITES.items():
    cv = curves[site]; xp = [100 * X for X in cv["xs"]]
    ax1.plot(xp, [a[0] for a in cv["adv"]], color=MAROON, lw=2.6, ls=ls, marker="o", ms=4.5, label=f"{lab}: vs. the cheapest alternative")
    ax1.plot(xp, [a[1] for a in cv["adv"]], color=BLUE, lw=1.8, ls=ls, label=f"{lab}: vs. the battery")
    ax3.plot(xp, [100 * e for e in cv["eve"]], color=MAROON, lw=2.4, ls=ls, marker="o", ms=4, label=lab)
for ax in (ax1, ax3):
    ax.axvspan(r_lo, r_hi, color=MAROON, alpha=.08, lw=0)
    ax.set_xticks([50, 60, 70, 80, 85, 90, 95, 97]); ax.set_xlim(48, 99)
    ax.grid(axis="y", color="#E6E3DE", lw=.8)
ax1.axhline(0, color="#333333", lw=1)
ax1.set_ylim(-2, 26)
ax1.text((r_lo + r_hi) / 2, 23.5, f"EEF works: {r_lo:.0f}–{r_hi:.0f}%", ha="center", color=MAROON, weight="bold", fontsize=12)
ax1.set_title("(a) Displacement curve — 100-MW data center"); ax1.set_ylabel("EEF saving, US$ per MWh of DC load\n(25-yr annual equivalent; > 0 = EEF cheaper)")
ax1.legend(frameon=False, fontsize=9, loc="upper left")
ax3.axhline(100 * EVE_MIN, color="#333333", lw=1, ls=":")
ax3.text(49, 100 * EVE_MIN + 2, f"{100 * EVE_MIN:.0f}% of the DC load freed", fontsize=9, color="#333333")
ax3.set_ylim(0, 105); ax3.set_ylabel("Summer evenings\nfreed (%)"); ax3.set_xlabel("Displacement of the data center's use (%)")
ax3.set_title("(b) Grid room on summer evenings (18:00–02:00)")
s_lo = max(o[3] for o in out)
for site, (lab, ls) in SITES.items():
    cv = curves[site]
    ax2.plot(SIZES, [a[0] for a in cv["sz"]], color=MAROON, lw=2.6, ls=ls, label=f"{lab}: vs. the cheapest alternative")
    ax2.plot(SIZES, [a[1] for a in cv["sz"]], color=BLUE, lw=1.8, ls=ls, label=f"{lab}: vs. the battery")
ax2.axvspan(s_lo, S_MAX, color=MAROON, alpha=.10, lw=0)
ax2.axhline(0, color="#333333", lw=1)
ax2.set_xscale("log"); ax2.set_xlim(1, S_MAX * 1.02); ax2.set_ylim(-25, 26)
ax2.set_xticks([1, 10, 100, 1500]); ax2.set_xticklabels(["1 MW", "10 MW", "100 MW", "1.5 GW"])
ax2.axvline(5, color=GREY, lw=.8, ls=":"); ax2.text(5 * 1.08, -23.5, "5 MW", fontsize=8.5, color=GREY, rotation=90, va="bottom")
ax2.text(np.sqrt(s_lo * S_MAX), 24.5, f"EEF works: ≈ {s_lo:.0f} MW – 1.5 GW", ha="center", va="top", color=MAROON, weight="bold", fontsize=12)
ax2.text(s_lo * 1.4, -7, "← below ≈ 8 MW: fixed contract costs\n    dominate → group small sites\n    in one contract", fontsize=9, color="#333333")
ax2.text(S_MAX * .93, 7, "1.5 GW = largest single\ncampus planned (NEOM).\nLarger = groups of campuses;\nthe flat curve carries on.", fontsize=9, color="#333333", ha="right")
ax2.set_title(f"(c) Size curve — at {X_REC:.0%} displacement"); ax2.set_xlabel("Data-center size (one campus)")
ax2.set_ylabel("EEF saving, US$ per MWh of DC load"); ax2.grid(axis="y", color="#E6E3DE", lw=.8)
ax2.legend(frameon=False, fontsize=9, loc="lower center")
fig.suptitle(f"Verdict: EEF is the best option for {r_lo:.0f}–{r_hi:.0f}% displacement and for data centers of ≈ {s_lo:.0f} MW "
             f"to 1.5 GW — Riyadh and NEOM", x=.01, ha="left", fontsize=13, weight="bold")
fig.text(.01, .012, "Value case: grid reinforcement avoided US$125/kW-yr + carbon US$50/t; flexibility US$50/MWh shifted; battery mid; "
         "PV sold at its cost;\nEEF overhead US$0.25 M/yr per contract; flexible load not limiting (one national grid; 7.1–29.9 GW potential). "
         "'Works' = cheapest of GRID, AM, battery and EEF, and ≥ 90% of summer evenings freed.", fontsize=8.3, color="#555555")
fig.subplots_adjust(left=.07, right=.98, top=.9, bottom=.12)
fig.savefig(pdp.FIG / "fig_verdict_curves.png")
