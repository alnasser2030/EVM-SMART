"""External Energy Flexibility (EEF) — planning model for the TPEC 2027 case study.

Compares four supply configurations for a constant AI data center (DC) in Riyadh:
  GRID     : all energy from the grid, no clean procurement
  AM       : PV sized to annual DC energy, injected to the grid (annual matching)
  RE+BESS  : AM PV + battery charged from the DC's PV surplus to raise hourly matching
  EEF      : AM PV + external flexible loads shifting consumption (up in surplus, down in deficit)

Hourly matching (CFE score) = sum_t min(L, matched supply_t) / sum_t L.
All LPs are solved with HiGHS (scipy.optimize.linprog).
"""
from pathlib import Path

import numpy as np
import scipy.sparse as sp
from scipy.optimize import linprog

ROOT = Path(__file__).resolve().parents[1]
T = 8760
L_MW = 100.0                     # DC load (MW)
USD_PER_SAR = 1 / 3.75
P_BUY = 0.18 * 1000 * USD_PER_SAR    # US$/MWh grid tariff: cloud-computing tariff 18 halalas/kWh (SERA 2025, via KAPSARC DP 2025)
P_PPA = 0.051 * 1000 * USD_PER_SAR   # US$/MWh PV PPA price (SPPC Round 5)
EF_GRID = 0.568                  # tCO2/MWh average grid emission factor (Saudi DNA)
CRF = 0.08 / (1 - 1.08 ** -15)   # 8%, 15 yr
FOM = 0.025                      # fixed O&M share of capex per year
BESS_CAPEX = {"low": 124.0, "mid": 207.0, "high": 338.0}   # US$/kWh, NREL 2025 update, 2030, 4-h
ETA_BESS = 0.9                   # round trip
WINDOW_START_HOUR = 6            # flexibility energy-neutral window 06:00 -> 05:59 next day


def load_pv_per_kwp() -> np.ndarray:
    return np.loadtxt(ROOT / "data/pv_riyadh_2020_local_per_kWp.csv")


def base_profiles(pv_multiple: float = 1.0):
    pv_kwp = load_pv_per_kwp()
    cap_mw = pv_multiple * L_MW * T / pv_kwp.sum()      # MWp so that annual PV = annual load (x multiple)
    pv = cap_mw * pv_kwp
    load = np.full(T, L_MW)
    direct = np.minimum(load, pv)
    surplus = np.maximum(pv - load, 0.0)
    deficit = np.maximum(load - pv, 0.0)
    return dict(pv=pv, load=load, direct=direct, surplus=surplus, deficit=deficit, cap_mw=cap_mw)


def _window_starts():
    hours = np.arange(T) % 24
    start = hours == WINDOW_START_HOUR
    start[0] = True
    end = np.roll(start, -1)
    end[-1] = True
    return start, end


# ------------------------------------------------------------------ EEF
def _eef_lp(prof, D, eta, P_fixed=None, target=None):
    """Variables: u[T], d[T], S[T] (+ P_F if P_fixed is None)."""
    sur, defi = prof["surplus"], prof["deficit"]
    start, end = _window_starts()
    nv = 3 * T + (1 if P_fixed is None else 0)
    iu, idd, iS = 0, T, 2 * T
    iP = 3 * T
    rows, cols, vals = [], [], []
    # state: S_t - S_{t-1}*(not start) - eta*u_t + d_t = 0
    for t in range(T):
        rows += [t, t, t]; cols += [iS + t, iu + t, idd + t]; vals += [1.0, -eta, 1.0]
        if not start[t]:
            rows.append(t); cols.append(iS + t - 1); vals.append(-1.0)
    A_eq = sp.csr_matrix((vals, (rows, cols)), shape=(T, nv))
    b_eq = np.zeros(T)
    bounds = [(0, s) for s in sur] + [(0, x) for x in defi] + [(0, None)] * T
    # energy neutral: S = 0 at window end
    for t in np.where(end)[0]:
        bounds[iS + t] = (0, 0)
    ub_rows, ub_cols, ub_vals, b_ub = [], [], [], []
    r = 0
    if P_fixed is None:
        bounds.append((0, None))
        for t in range(T):
            for base in (iu, idd):
                ub_rows += [r, r]; ub_cols += [base + t, iP]; ub_vals += [1.0, -1.0]; b_ub.append(0.0); r += 1
            ub_rows += [r, r]; ub_cols += [iS + t, iP]; ub_vals += [1.0, -D]; b_ub.append(0.0); r += 1
    else:
        for t in range(T):
            bounds[iu + t] = (0, min(sur[t], P_fixed))
            bounds[idd + t] = (0, min(defi[t], P_fixed))
            if bounds[iS + t] != (0, 0):
                bounds[iS + t] = (0, D * P_fixed)
    c = np.zeros(nv)
    if target is not None:   # sum d >= target*sum L - sum direct
        need = target * prof["load"].sum() - prof["direct"].sum()
        ub_rows += [r] * T; ub_cols += list(range(idd, idd + T)); ub_vals += [-1.0] * T; b_ub.append(-need); r += 1
        c[iP] = 1.0
        c[iu:iu + T] = 1e-6          # tie-break: avoid unnecessary shifting
    else:
        c[idd:idd + T] = -1.0        # maximize matched down-shift
    A_ub = sp.csr_matrix((ub_vals, (ub_rows, ub_cols)), shape=(r, nv)) if r else None
    res = linprog(c, A_ub=A_ub, b_ub=np.array(b_ub) if r else None, A_eq=A_eq, b_eq=b_eq,
                  bounds=bounds, method="highs")
    if res.status != 0:
        return None
    x = res.x
    out = dict(u=x[iu:iu + T], d=x[idd:idd + T], S=x[iS:iS + T])
    out["P_F"] = x[iP] if P_fixed is None else P_fixed
    out["cfe"] = (prof["direct"].sum() + out["d"].sum()) / prof["load"].sum()
    return out


def eef_max_cfe(prof, P_F, D, eta=0.95):
    return _eef_lp(prof, D, eta, P_fixed=P_F)


def eef_min_capacity(prof, target, D, eta=0.95):
    return _eef_lp(prof, D, eta, target=target)


# ------------------------------------------------------------------ BESS
def bess_min_energy(prof, target):
    """Variables: ch[T], dis[T], soc[T], E. Cyclic SOC. Charge only from DC PV surplus."""
    sur, defi = prof["surplus"], prof["deficit"]
    ec = ed = np.sqrt(ETA_BESS)
    ich, idis, isoc, iE = 0, T, 2 * T, 3 * T
    nv = 3 * T + 1
    rows, cols, vals = [], [], []
    for t in range(T):
        prev = isoc + (t - 1 if t > 0 else T - 1)
        rows += [t] * 4; cols += [isoc + t, prev, ich + t, idis + t]; vals += [1.0, -1.0, -ec, 1.0 / ed]
    A_eq = sp.csr_matrix((vals, (rows, cols)), shape=(T, nv))
    ub_r, ub_c, ub_v, b_ub = [], [], [], []
    for t in range(T):
        ub_r += [t, t]; ub_c += [isoc + t, iE]; ub_v += [1.0, -1.0]; b_ub.append(0.0)
    need = target * prof["load"].sum() - prof["direct"].sum()
    ub_r += [T] * T; ub_c += list(range(idis, idis + T)); ub_v += [-1.0] * T; b_ub.append(-need)
    A_ub = sp.csr_matrix((ub_v, (ub_r, ub_c)), shape=(T + 1, nv))
    bounds = [(0, s) for s in sur] + [(0, x) for x in defi] + [(0, None)] * T + [(0, None)]
    c = np.zeros(nv); c[iE] = 1.0
    res = linprog(c, A_ub=A_ub, b_ub=np.array(b_ub), A_eq=A_eq, b_eq=np.zeros(T), bounds=bounds, method="highs")
    if res.status != 0:
        return None
    x = res.x
    return dict(E=x[iE], ch=x[ich:ich + T], dis=x[idis:idis + T], soc=x[isoc:isoc + T],
                cfe=(prof["direct"].sum() + x[idis:idis + T].sum()) / prof["load"].sum())


def bess_annual_cost(E_mwh, case="mid"):
    capex = BESS_CAPEX[case] * 1000 * E_mwh          # US$
    return capex * (CRF + FOM)                       # US$/yr
