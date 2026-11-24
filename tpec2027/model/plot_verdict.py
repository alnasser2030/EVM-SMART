"""The verdict in two curves: for which displacement range and which data-center sizes EEF is the best option.

Curve 1 (displacement, 100-MW data center): EEF's 25-year cost advantage over the cheapest alternative
(GRID, AM or battery), and the share of summer evenings freed on the grid.
Curve 2 (size, at the recommended displacement): the same advantage against data-center size.
Both for Riyadh and NEOM, with the national flexibility pool (one interconnected grid; low 7.1 GW, high 29.9 GW).
The size limit is the TOTAL data-center capacity using EEF nationally, not one campus. "Works" = EEF is the cheapest of the four AND it frees >= 90% of the data center's
load on summer evenings (the hours that drive grid reinforcement).
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
SITES = {"riyadh": ("Riyadh", "-"), "neom": ("NEOM", "--")}
SIZES = np.logspace(0, np.log10(30000), 451)
MAROON, BLUE, GREY = pdp.COL["EEF"], pdp.COL["Battery"], "#6B6E70"


def advantage(ph, X, S, am_x, pool=pdp.POOL):
    k = pdp.costs(X, S, R, C, ph=ph, am_x=am_x, pool=pool)
    return min(k["GRID"], k["AM"], k["Battery"]) - k["EEF"], k["Battery"] - k["EEF"], k["f"], k["e"]


out, curves = [], {}
for site in SITES:
    ph, am_x = pdp.load_phys(site), pdp.AM_SITE[site]
    xs = sorted(ph)
    adv = [advantage(ph, X, 100.0, am_x) for X in xs]
    eve = [a[3]["cov_e"] for a in adv]
    ok = [X for X, a, ev in zip(xs, adv, eve) if a[0] > 0 and ev >= EVE_MIN]
    sz = [advantage(ph, X_REC, S, am_x) for S in SIZES]
    pure = [S for S, a in zip(SIZES, sz) if a[0] > 0 and a[2] >= 1]
    hyb = [S for S, a in zip(SIZES, sz) if a[0] > 0 and a[2] < 1]
    sz_hi = [advantage(ph, X_REC, S, am_x, pdp.POOL_HIGH) for S in SIZES]
    pure_hi = [S for S, a in zip(SIZES, sz_hi) if a[0] > 0 and a[2] >= 1]
    curves[site] = dict(xs=xs, adv=adv, eve=eve, sz=sz, sz_hi=sz_hi)
    out.append([site, round(100 * min(ok)), round(100 * max(ok)), round(min(pure), 1), round(max(pure)),
                round(max(hyb)) if hyb else "", round(max(pure_hi)), round(X_REC * 100)])
    print(site, "displacement", min(ok), "-", max(ok), "| size EEF alone", round(min(pure), 1), "-", round(max(pure)),
          "| with storage up to", round(max(hyb)) if hyb else "-")
with open(pdp.RES / "verdict_ranges.csv", "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["site", "displacement_min_pct", "displacement_max_pct", "size_min_MW", "size_max_MW_eef_alone",
                "size_max_MW_with_storage", "size_max_MW_eef_alone_high_pool", "size_curve_at_pct"])
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
s_lo = min(o[3] for o in out); s_hi = min(o[4] for o in out); s_hh = min(o[6] for o in out)
for site, (lab, ls) in SITES.items():
    cv = curves[site]
    ax2.plot(SIZES, [a[0] for a in cv["sz"]], color=MAROON, lw=2.6, ls=ls, label=f"{lab}: vs. the cheapest alternative")
ax2.plot(SIZES, [a[0] for a in curves["riyadh"]["sz_hi"]], color=MAROON, lw=1.6, ls=":", label="Riyadh: same, national pool high (29.9 GW)")
ax2.plot(SIZES, [a[1] for a in curves["riyadh"]["sz"]], color=BLUE, lw=1.8, label="Riyadh: vs. the battery")
ax2.axvspan(s_lo, s_hi, color=MAROON, alpha=.10, lw=0)
ax2.axvspan(s_hi, s_hh, color=MAROON, alpha=.04, lw=0)
ax2.axhline(0, color="#333333", lw=1)
ax2.set_xscale("log"); ax2.set_xlim(1, 30000); ax2.set_ylim(-25, 26)
ax2.set_xticks([1, 10, 100, 1000, 10000]); ax2.set_xticklabels(["1 MW", "10 MW", "100 MW", "1 GW", "10 GW"])
for v, t in [(5, "5 MW"), (1500, "1.5 GW NEOM"), (6600, "6.6 GW HUMAIN")]:
    ax2.axvline(v, color=GREY, lw=.8, ls=":"); ax2.text(v * 1.08, -23.5, t, fontsize=8.5, color=GREY, rotation=90, va="bottom")
ax2.text(np.sqrt(s_lo * s_hi), 25, f"EEF works: ≈ {s_lo:.0f} MW – {s_hi / 1000:.1f} GW\n(national pool, low estimate)", ha="center", va="top", color=MAROON, weight="bold", fontsize=12)
ax2.text(np.sqrt(s_hi * s_hh), 19.5, f"up to ≈ {s_hh / 1000:.0f} GW\n(high pool)", ha="center", color=MAROON, fontsize=9.5)
ax2.text(s_lo * 1.4, -7, "← below ≈ 8 MW: fixed contract costs\n    dominate → pool small sites", fontsize=9, color="#333333")
ax2.set_title(f"(c) Size curve — at {X_REC:.0%} displacement, one national grid"); ax2.set_xlabel("Data-center capacity using EEF (one campus or the national total)")
ax2.set_ylabel("EEF saving, US$ per MWh of DC load"); ax2.grid(axis="y", color="#E6E3DE", lw=.8)
ax2.legend(frameon=False, fontsize=9, loc="lower center")
fig.suptitle(f"Verdict: EEF is the best option for {r_lo:.0f}–{r_hi:.0f}% displacement and for data centers of ≈ {s_lo:.0f} MW up to\n"
             f"≈ {s_hi / 1000:.1f} GW in total on the national grid (≈ {s_hh / 1000:.0f} GW with the high flexibility estimate) — Riyadh and NEOM", x=.01, ha="left", fontsize=13, weight="bold")
fig.text(.01, .012, "Value case: grid reinforcement avoided US$125/kW-yr + carbon US$50/t; flexibility US$50/MWh shifted; battery mid; "
         "PV sold at its cost;\nEEF overhead US$0.25 M/yr per contract; national flexibility pool 7.1 GW (low) – 29.9 GW (high), KAPSARC 2026. "
         "'Works' = cheapest of GRID, AM, battery and EEF, and ≥ 90% of summer evenings freed.", fontsize=8.3, color="#555555")
fig.subplots_adjust(left=.07, right=.98, top=.87, bottom=.12)
fig.savefig(pdp.FIG / "fig_verdict_curves.png")
