"""Where EEF is the best option: displacement level x data-center size, 25-year annual equivalents.

Reads results/displacement_curve.csv (run_displacement.py) and compares four ways to supply a data center
that always takes 100% of its energy from the grid:
  GRID    grid only
  AM      PV = annual use, sold to SPPC, annual certificates
  Battery PV + battery reaching the same displacement X
  EEF     PV sold to SPPC + flexible loads freeing grid supply hour by hour (hybrid with storage beyond the pool)

All costs are US$ per MWh of data-center load per year, ON TOP OF the grid tariff (US$48/MWh), which every
option pays in full. PV is sold at its cost (NREP benchmark US$13.6/MWh), so it nets to zero in every option.
Value cases (assumptions, stated in the figure):
  bill           nothing else is valued
  grid           + grid reinforcement for load added on summer evenings, US$125/kW-yr (range 100-150)
  grid+carbon    + carbon at US$50/t (0.568 t/MWh)
Size enters through a fixed overhead per EEF contract (US$0.25 M/yr) and a regional flexibility pool (2 GW).

Writes results/displacement_costs.csv, results/displacement_size_map.csv and
figures/fig_displacement_curve.png, figures/fig_displacement_size_map.png.
"""
import csv
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import ListedColormap

import eef_model as em

ROOT = Path(__file__).resolve().parents[1]
RES, FIG = ROOT / "results", ROOT / "figures"
E_DC = 876.0                      # GWh/yr per 100 MW
TARIFF = em.P_BUY                 # US$/MWh, paid by every option
PV_PRICE = em.P_PPA               # US$/MWh, NREP benchmark = PV cost (assumption)
EF = em.EF_GRID                   # t/MWh
AM_X = 0.4036                     # hourly share of annual matching (baseline)
PI = {"low": 25.0, "mid": 50.0, "high": 75.0}            # US$/MWh shifted
R_KW = 125.0                      # US$/kW-yr grid reinforcement (assumption)
CASES = {"bill": (0.0, 0.0), "grid": (R_KW, 0.0), "grid+carbon": (R_KW, 50.0)}
F_CONTRACT = 0.25                 # US$ M/yr per EEF contract
POOL = 2000.0                     # MW regional flexibility pool
COL = {"EEF": "#7A1E2B", "EEF + storage": "#C98A93", "Battery": "#2E6DB4", "AM": "#B07A12", "GRID": "#6B6E70",
       "GRID / AM": "#6B6E70"}

# ------------------------------------------------------------------ per-X physics
AM_SITE = {"riyadh": 0.4036, "neom": 0.415}   # hourly share of annual matching (baseline)


def load_phys(site="riyadh"):
    phys = {}
    name = "displacement_curve.csv" if site == "riyadh" else f"displacement_curve_{site}.csv"
    with open(RES / name) as fh:
        for r in csv.DictReader(fh):
            if r["kind"] != "target":
                continue
            X = float(r["displacement_pct"]) / 100
            phys.setdefault(X, []).append(dict(
                design=r["design"], k=float(r["pv_multiple"]), pf=float(r["eef_PF_MW"]) / 100,
                shifted=float(r["eef_shifted_GWh"]), cov_e=float(r["eef_summer_evening_cover"]),
                E=float(r["bess_E_MWh"]), cov_b=float(r["bess_summer_evening_cover"])))
    return phys


phys = load_phys("riyadh")
XS = sorted(phys)


def eef_var(d, R, pi=PI["mid"]):
    return pi * d["shifted"] / E_DC + R / 8.76 * (1 - d["cov_e"])


def bess_var(d, R, case="mid"):
    return em.bess_annual_cost(d["E"], case) / (E_DC * 1e3) + R / 8.76 * (1 - d["cov_b"])


def best(X, R, ph=None):
    """Cheapest design (PV x1.0/06:00 or PV x1.25/09:00) for EEF and for the battery at displacement X."""
    ph = ph or phys
    e = min(ph[X], key=lambda d: eef_var(d, R))
    b = min(ph[X], key=lambda d: bess_var(d, R))
    return e, b


def costs(X, S, R, c, adder=0.0, ph=None, am_x=AM_X, pool=POOL):
    """adder: extra US$/MWh paid for EEF-linked PV above its cost (proposed SERA rule); EEF only."""
    ph = ph or phys
    e, b = best(X, R, ph)
    if adder:
        e = min(ph[X], key=lambda d: eef_var(d, R) - adder * d["k"])
    f = min(1.0, pool / (e["pf"] * S))
    carbon_x = c * EF * (1 - X)
    eef = F_CONTRACT * 1e6 / (8760 * S) + f * (eef_var(e, R) - adder * e["k"]) + (1 - f) * bess_var(b, R) + carbon_x
    return dict(GRID=R / 8.76 + c * EF, AM=R / 8.76 + c * EF * (1 - am_x), Battery=bess_var(b, R) + carbon_x,
                EEF=eef, f=f, e=e, b=b)


def main():
    # ------------------------------------------------------------------ table at 100 MW
    rows = []
    for name, (R, c) in CASES.items():
        for X in XS:
            k = costs(X, 100.0, R, c)
            e, b = k["e"], k["b"]
            others = min(k["GRID"], k["AM"], k["Battery"])
            pv_needed = PV_PRICE + max(0.0, k["EEF"] - others) / e["k"]   # sale price that makes EEF the cheapest
            rows.append([name, round(100 * X), e["design"], round(e["pf"], 2), round(e["cov_e"], 3),
                         round(k["GRID"], 2), round(k["AM"], 2), round(k["Battery"], 2), round(k["EEF"], 2),
                         round(eef_var(e, R, PI["low"]) + F_CONTRACT * 1e6 / 876e3 + c * EF * (1 - X), 2),
                         round(eef_var(e, R, PI["high"]) + F_CONTRACT * 1e6 / 876e3 + c * EF * (1 - X), 2),
                         round(bess_var(b, R, "low") + c * EF * (1 - X), 2), round(bess_var(b, R, "high") + c * EF * (1 - X), 2),
                         min(("GRID", "AM", "Battery", "EEF"), key=lambda n: k[n]), round(pv_needed, 1)])
    with open(RES / "displacement_costs.csv", "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["value_case", "displacement_pct", "eef_design", "flex_MW_per_MW", "summer_evening_cover",
                    "grid", "am", "battery_mid", "eef_mid", "eef_low_price", "eef_high_price", "battery_low", "battery_high",
                    "cheapest", "pv_sale_price_for_eef_cheapest"])
        w.writerows(rows)

    # ------------------------------------------------------------------ size x displacement map
    SIZES = np.logspace(0, 4, 161)
    NAMES = ["GRID / AM", "AM", "Battery", "EEF + storage", "EEF"]
    PV_RULE = 30.0                    # US$/MWh for EEF-linked PV in map (b): below the US$48 tariff
    maps = {}
    with open(RES / "displacement_size_map.csv", "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["panel", "dc_MW", "displacement_pct", "cheapest", "eef_share_of_target"])
        four = ("GRID", "AM", "Battery", "EEF")
        for panel, (R, c, a, opts) in {"clean": (0.0, 0.0, 0.0, ("Battery", "EEF")),
                                       "pv_rule": (0.0, 0.0, PV_RULE - PV_PRICE, four),
                                       "grid+carbon": (R_KW, 50.0, 0.0, four)}.items():
            Z = np.zeros((len(XS), len(SIZES)))
            for i, X in enumerate(XS):
                for j, S in enumerate(SIZES):
                    k = costs(X, S, R, c, a)
                    win = min(opts, key=lambda n: k[n])
                    if win in ("GRID", "AM"):
                        win = "GRID / AM" if abs(k["GRID"] - k["AM"]) < 1e-9 else win
                    lab = "EEF + storage" if win == "EEF" and k["f"] < 1 else win
                    Z[i, j] = NAMES.index(lab)
                    if j % 8 == 0:
                        w.writerow([panel, round(S, 1), round(100 * X), lab, round(k["f"], 3)])
            maps[panel] = Z

    # ------------------------------------------------------------------ figures
    plt.rcParams.update({"text.parse_math": False, "font.family": "DejaVu Sans", "font.size": 10, "axes.spines.top": False,
                         "axes.spines.right": False, "axes.edgecolor": "#9A9A9A", "axes.labelcolor": "#333333",
                         "xtick.color": "#555555", "ytick.color": "#555555", "axes.titleweight": "bold",
                         "axes.titlesize": 11, "axes.titlelocation": "left"})
    xp = [100 * X for X in XS]
    fig, axs = plt.subplots(2, 3, figsize=(15, 8.6), dpi=150)
    titles = {"bill": "(a) Bill only", "grid": "(b) + grid reinforcement avoided\n(US$125/kW-yr on summer-evening load)",
              "grid+carbon": "(c) + grid reinforcement + carbon (US$50/t)"}
    for ax, (name, (R, c)) in zip(axs[0], CASES.items()):
        tab = [r for r in rows if r[0] == name]
        g = [r[5] for r in tab]; a = [r[6] for r in tab]; bm = [r[7] for r in tab]; em_ = [r[8] for r in tab]
        ax.fill_between(xp, [r[11] for r in tab], [r[12] for r in tab], color=COL["Battery"], alpha=.12, lw=0)
        ax.fill_between(xp, [r[9] for r in tab], [r[10] for r in tab], color=COL["EEF"], alpha=.14, lw=0)
        ax.plot(xp, g, color=COL["GRID"], lw=2, ls=(0, (5, 3)))
        ax.plot(xp, a, color=COL["AM"], lw=2)
        ax.plot(xp, bm, color=COL["Battery"], lw=2)
        ax.plot(xp, em_, color=COL["EEF"], lw=2.6, marker="o", ms=4.5)
        win = [x for x, r in zip(xp, tab) if r[13] == "EEF"]
        if win:
            ax.axvspan(min(win) - 2, max(win) + 1, color=COL["EEF"], alpha=.06, lw=0)
            ax.text((min(win) + max(win)) / 2, 66, "EEF cheapest of all four", ha="center", color=COL["EEF"], fontsize=9.5, weight="bold")
        ends = [(bm[-1], "Battery", COL["Battery"]), (em_[-1], "EEF", COL["EEF"])]
        ends += [(g[-1], "GRID = AM", COL["GRID"])] if abs(g[-1] - a[-1]) < 1e-9 else [(a[-1], "AM", COL["AM"]), (g[-1], "GRID", COL["GRID"])]
        ends.sort()
        for n in range(1, len(ends)):                       # keep end labels at least 3 units apart
            if ends[n][0] - ends[n - 1][0] < 3:
                ends[n] = (ends[n - 1][0] + 3,) + ends[n][1:]
        for y, lab, col in ends:
            ax.text(98, y, lab, color=col, va="center", fontsize=9.5, weight="bold")
        ax.set_xlim(48, 104); ax.set_ylim(0, 70); ax.set_xticks([50, 60, 70, 80, 90, 97])
        ax.set_title(titles[name]); ax.set_xlabel("Displacement of the data center's use (%)")
        ax.grid(axis="y", color="#E6E3DE", lw=.8)
    axs[0][0].set_ylabel("US$ per MWh of DC load, on top of the\nUS$48/MWh tariff (25-yr annual equivalent)")
    # needs: flexibility per MW and summer-evening cover
    tg = [r for r in rows if r[0] == "grid"]
    ax = axs[1][0]
    ax.bar(xp, [r[3] for r in tg], width=1.6, color=COL["EEF"], alpha=.85)
    for x, r in zip(xp, tg):
        ax.text(x, r[3] + .04, f"{r[3]:.1f}", ha="center", fontsize=8, color="#333333")
    ax.set_title("(d) Flexible load to contract per MW of data center"); ax.set_ylabel("MW per MW")
    ax.set_xticks([50, 60, 70, 80, 90, 97]); ax.set_xlabel("Displacement (%)"); ax.set_ylim(0, 2.8)
    ax = axs[1][1]
    ax.plot(xp, [100 * r[4] for r in tg], color=COL["EEF"], lw=2.6, marker="o", ms=4.5)
    ax.axhline(100, color="#9A9A9A", lw=.8, ls=":")
    ax.set_title("(e) Summer evenings (18:00–02:00) freed on the grid"); ax.set_ylabel("% of DC load")
    ax.set_xticks([50, 60, 70, 80, 90, 97]); ax.set_xlabel("Displacement (%)"); ax.set_ylim(0, 105)
    ax.grid(axis="y", color="#E6E3DE", lw=.8)
    knee = next(x for x, r in zip(xp, tg) if r[4] >= .95)
    ax.text(96, 40, f"≥ 95% freed from\n{knee:.0f}% displacement", color=COL["EEF"], weight="bold", ha="right", va="top")
    ax = axs[1][2]
    for name, ls in [("bill", "-"), ("grid", "--")]:
        tab = [r for r in rows if r[0] == name]
        ax.plot(xp, [r[14] for r in tab], color=COL["EEF"], lw=2.4, ls=ls, marker="o", ms=4)
        ax.text(98, tab[-1][14], {"bill": "bill only", "grid": "+ grid\nreinforcement"}[name], color=COL["EEF"], fontsize=9, va="center")
    ax.axhline(TARIFF, color=COL["GRID"], lw=1.4); ax.text(50, TARIFF + 1.2, "grid purchase tariff US$48/MWh", color="#333333", fontsize=9)
    ax.axhline(PV_PRICE, color=COL["AM"], lw=1.4); ax.text(97, PV_PRICE - 3.2, "NREP benchmark US$13.6/MWh (= PV cost)", color="#333333", fontsize=9, ha="right")
    ax.set_title("(f) PV sale price that makes EEF the cheapest"); ax.set_ylabel("US$/MWh of PV sold")
    ax.set_xticks([50, 60, 70, 80, 90, 97]); ax.set_xlabel("Displacement (%)"); ax.set_ylim(0, 60); ax.set_xlim(48, 108)
    ax.grid(axis="y", color="#E6E3DE", lw=.8)
    fig.suptitle("Displacement curve — 100-MW data center, Riyadh, 25-year horizon\nflexibility US$50/MWh shifted (band US$25–75); battery mid (band low–high)",
                 x=.01, ha="left", fontsize=12, weight="bold")
    fig.text(.01, .005, "Each level uses the cheaper design: PV x1.0 (window from 06:00) or PV x1.25 (window from 09:00; the only one above 90%). "
             "PV sold at its cost nets to zero. Reinforcement, carbon and flexibility prices are assumptions.",
             fontsize=8.5, color="#555555")
    fig.tight_layout(rect=(0, .02, 1, .94))
    fig.savefig(FIG / "fig_displacement_curve.png")
    plt.close(fig)

    fig, axs = plt.subplots(1, 3, figsize=(15, 5.4), dpi=150, sharey=True)
    cmap = ListedColormap([COL[n] for n in NAMES])
    ptitles = {"clean": "(a) EEF vs. battery at the same displacement",
               "pv_rule": f"(b) All four, EEF-linked PV sold at US${PV_RULE:.0f}/MWh\n(below the US$48 tariff; nothing else valued)",
               "grid+carbon": "(c) All four, grid reinforcement (US$125/kW-yr)\n+ carbon (US$50/t) valued"}
    yedges = np.r_[45, [(a + b) / 2 * 100 for a, b in zip(XS[:-1], XS[1:])], 98.5]
    xedges = np.logspace(-0.0125, 4.0125, len(SIZES) + 1)
    for ax, (panel, Z) in zip(axs, maps.items()):
        ax.pcolormesh(xedges, yedges, Z, cmap=cmap, vmin=-.5, vmax=len(NAMES) - .5, shading="flat")
        ax.set_xscale("log"); ax.set_title(ptitles[panel])
        ax.set_xticks([1, 10, 100, 1000, 10000]); ax.set_xticklabels(["1 MW", "10 MW", "100 MW", "1 GW", "10 GW"])
        ax.set_xlabel("Data-center size")
        for v in (5, 1500, 6600):
            ax.axvline(v, color="white", lw=1, ls=":")
        present = sorted({int(z) for z in Z.ravel()})
        for z in present:
            ii, jj = np.where(Z == z)
            j0 = int(np.median(jj)); i0 = int(np.median(ii))
            xs_, ha = SIZES[j0], "center"
            if xs_ < 4: xs_, ha = 1.15, "left"
            elif xs_ > 2500: xs_, ha = 9000, "right"
            ax.text(xs_, [x * 100 for x in XS][i0], NAMES[z], color="white", ha=ha, va="center", fontsize=10, weight="bold")
    axs[0].set_ylabel("Displacement (%)")
    axs[0].set_yticks([50, 60, 70, 80, 85, 90, 93, 95, 97])
    fig.suptitle("Cheapest option by data-center size and displacement — 25 years\n"
                 "flexibility US$50/MWh shifted; battery mid; EEF overhead US$0.25 M/yr per contract; regional flexibility pool 2 GW", x=.01, ha="left", fontsize=11.5, weight="bold")
    fig.text(.01, .01, "Dotted lines: 5 MW, 1.5 GW (NEOM campus / KSA 2030), 6.6 GW (HUMAIN 2034). "
             "'EEF + storage' = EEF covers what the pool allows, storage the rest.", fontsize=8.5, color="#555555")
    fig.tight_layout(rect=(0, .03, 1, .9))
    fig.savefig(FIG / "fig_displacement_size_map.png")
    plt.close(fig)

    for r in rows:
        print(r)


if __name__ == "__main__":
    main()
