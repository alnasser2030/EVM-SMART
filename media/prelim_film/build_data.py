"""Export the TPEC 2027 model results used by the prelim film to data.js.

Run from the repository root:  python3 media/prelim_film/build_data.py
"""
import csv
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RES = os.path.join(ROOT, "tpec2027", "results")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.js")


def rows(name):
    with open(os.path.join(RES, name), newline="") as f:
        return list(csv.DictReader(f))


def kv(name):
    return {r["item"]: float(r["value"]) for r in rows(name)}


def r(x, n=2):
    return round(float(x), n)


data = {}

# Baseline and the dispatch example (P_F = 150 MW, D = 8 h)
b = kv("baseline.csv")
data["baseline"] = {
    "L": b["DC load MW"], "E_GWh": b["DC energy GWh/yr"], "pv_MWp": r(b["PV MWp (annual match)"], 1),
    "am_cfe": r(b["AM hourly CFE"] * 100, 1), "deficit_GWh": r(b["DC deficit GWh/yr"], 1),
}
ds = kv("dispatch_summary.csv")
data["dispatch_summary"] = {"P_F": ds["P_F"], "D": ds["D"], "cfe": r(ds["cfe"] * 100, 1),
                            "shifted_GWh": r(ds["shifted_MWh"] / 1000, 1)}

days = {}
for row in rows("dispatch_days.csv"):
    d = days.setdefault(row["day"], {"pv": [], "up": [], "down": []})
    d["pv"].append(r(row["pv_MW"], 1))
    d["up"].append(r(row["up_MW"], 1))
    d["down"].append(abs(r(row["down_MW"], 1)))
data["days"] = days

# Maximum CFE versus contracted flexible power, for each duration
curves = {}
for row in rows("cfe_vs_flex.csv"):
    curves.setdefault(row["D_h"], []).append([r(row["P_F_over_L"], 2), r(float(row["cfe"]) * 100, 2)])
data["cfe_curves"] = curves

# Resource needs and break-even price by target
data["targets"] = [{
    "X": r(float(t["target_cfe"]) * 100, 0),
    "bess_MWh": r(t["bess_E_MWh"], 0),
    "flex_MW": r(t["eef8_P_MW"], 0),
    "be_mid": r(t["eef8_breakeven_USD_per_MWh_mid"], 1),
    "bess_lo": r(float(t["bess_cost_low_USDyr"]) / 1e6, 2), "bess_mid": r(float(t["bess_cost_mid_USDyr"]) / 1e6, 2),
    "bess_hi": r(float(t["bess_cost_high_USDyr"]) / 1e6, 2), "shifted_GWh": r(float(t["eef8_shifted_MWh"]) / 1e3, 2),
} for t in rows("targets.csv")]

data["pillars"] = [{
    "config": p["config"], "served": r(p["dc_load_served_pct"], 1), "cfe": r(p["cfe_pct"], 1),
    "em_kt": r(p["emissions_kt"], 1), "storage_MWh": r(p["new_storage_MWh"], 0),
    "cost_lo": r(p["cost_lo_MUSD"], 1), "cost_mid": r(p["cost_mid_MUSD"], 1), "cost_hi": r(p["cost_hi_MUSD"], 1),
} for p in rows("three_pillars.csv")]

data["monthly"] = [{
    "m": int(m["month"]), "AM": r(float(m["AM"]) * 100, 1), "EEF": r(float(m["EEF"]) * 100, 1),
    "BESS": r(float(m["BESS"]) * 100, 1),
} for m in rows("monthly_cfe.csv")]

data["max_cfe"] = r(float(rows("max_cfe.csv")[0]["max_cfe"]) * 100, 1)

# grid-side net load (evening 19-23 h, night 0-5 h) for each configuration at 80%
data["netload"] = {p["config"]: [r(p["evening_net_load_MW"], 1), r(p["night_net_load_MW"], 1)] for p in rows("three_pillars.csv")}

# second site and scenario detail (run_sites.py)
sites = {}
for row in rows("sites_summary.csv"):
    sites.setdefault(row["site"], {})[row["item"]] = r(row["value"], 2) if row["value"] else None
data["sites"] = sites
data["site_curves"] = {}
for row in rows("sites_cfe_vs_flex.csv"):
    data["site_curves"].setdefault(row["site"], []).append([r(float(row["P_F_MW"]) / 100, 2), r(row["cfe_pct"], 2)])
data["site_pillars"] = {}
for p in rows("sites_pillars.csv"):
    data["site_pillars"].setdefault(p["site"], []).append({k: (p[k] if k in ("site", "config") else r(p[k], 2)) for k in p})
data["site_monthly"] = {}
for m in rows("sites_monthly.csv"):
    data["site_monthly"].setdefault(m["site"], []).append({k: (m[k] if k == "site" else r(m[k], 2)) for k in m})
data["site_daily"] = {}
for d in rows("sites_daily_pv.csv"):
    data["site_daily"].setdefault(d["site"], []).append(r(d["annual_kW_per_kWp"], 3))
data["scen_day"] = {k: [] for k in ("pv", "direct", "ch", "dis", "soc", "up", "down", "S")}
for h in rows("scenario_day.csv"):
    for k, col in (("pv", "pv_MW"), ("direct", "direct_MW"), ("ch", "bess_charge_MW"), ("dis", "bess_discharge_MW"),
                   ("soc", "bess_soc_MWh"), ("up", "eef_up_MW"), ("down", "eef_down_MW"), ("S", "eef_shifted_MWh")):
        data["scen_day"][k].append(max(0.0, r(h[col], 1)))
data["dmap"] = {}
for d in rows("decision_map.csv"):
    data["dmap"].setdefault(d["target_pct"], []).append([int(d["bess_capex_USD_per_kWh"]), r(d["breakeven_USD_per_MWh"], 1)])

# Displacement curve, size curve and verdict (tpec2027/model/plot_displacement.py, plot_verdict.py)
import sys
sys.path.insert(0, os.path.join(ROOT, "tpec2027", "model"))
import plot_displacement as pdp  # noqa: E402

R_, C_ = pdp.R_KW, 50.0
disp = {"R_kW": R_, "carbon": C_, "overhead_MUSD": pdp.F_CONTRACT, "sites": {}}
for site in ("riyadh", "neom"):
    ph, am_x = pdp.load_phys(site), pdp.AM_SITE[site]
    pts = []
    for X in sorted(ph):
        k = pdp.costs(X, 100.0, R_, C_, ph=ph, am_x=am_x)
        kb = pdp.costs(X, 100.0, 0.0, 0.0, ph=ph, am_x=am_x)
        e = k["e"]
        pts.append(dict(X=round(100 * X), adv=r(min(k["GRID"], k["AM"], k["Battery"]) - k["EEF"]), advB=r(k["Battery"] - k["EEF"]),
                        eve=r(100 * e["cov_e"], 1), pf=r(e["pf"]), grid=r(k["GRID"]), am=r(k["AM"]), bess=r(k["Battery"]),
                        eef=r(k["EEF"]), pv_bill=r(pdp.PV_PRICE + max(0, kb["EEF"] - min(kb["GRID"], kb["AM"], kb["Battery"])) / kb["e"]["k"], 1)))
    disp["sites"][site] = pts
for v in rows("verdict_ranges.csv"):
    disp.setdefault("verdict", {})[v["site"]] = {k: r(v[k], 1) for k in v if k != "site"}
data["disp"] = disp

with open(OUT, "w") as f:
    f.write("// Generated by build_data.py from tpec2027/results. Do not edit by hand.\n")
    f.write("window.DATA = " + json.dumps(data, separators=(",", ":")) + ";\n")
print("wrote", OUT)
