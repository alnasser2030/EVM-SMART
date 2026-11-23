# TPEC 2027 case-study parameters and sources

| Parameter | Value | Source / note |
|---|---|---|
| Location | Riyadh, 24.71°N 46.68°E | Main Saudi data center hub |
| PV profile | Hourly, 2020, kW per kWp; CF = 20.96%, 1,836 kWh/kWp/yr | PVGIS 5.3 seriescalc, PVGIS-SARAH3 radiation, fixed optimal tilt (24°, azimuth 3°), crystalline Si, 14% system loss; converted to local time (UTC+3), Feb 29 removed. File: `pv_riyadh_2020_local_per_kWp.csv` |
| AI data center load | 100 MW constant (876 GWh/yr) | Base case; results normalized per MW |
| PV size (AM, EEF) | Annual PV energy = annual DC energy → 477 MWp | Annual matching definition |
| Grid purchase tariff | 0.18 SAR/kWh (≈ US$48/MWh), cloud-computing tariff | KAPSARC DP (Alshehri et al., Dec 2025, doi 10.30573/KS--2025-DP69), citing SERA 2025; industrial 0.20 SAR/kWh (≈ US$53/MWh); exact data center tariff not yet decided. Does not affect EEF-vs-BESS results |
| PV PPA price | 0.051 SAR/kWh (≈ US$13.6/MWh) | SPPC NREP Round 5, Al-Masaa 1 GW (record-low reported tariff) |
| Grid emission factor (average) | 0.568 tCO2/MWh | Saudi DNA official grid emission factor (2021), as reported in KFUPM GHG inventory 2024 |
| BESS capital cost (4-h, 2030) | US$124 / 207 / 338 per kWh (low / mid / high) | NREL, Cost Projections for Utility-Scale Battery Storage: 2025 Update (June 2025) |
| BESS cost treatment | Charged on energy capacity only; power unconstrained | Deliberately favorable to storage (conservative for EEF) |
| BESS round-trip efficiency | 90% (√0.9 each way) | Assumption |
| BESS finance | 8% discount rate, 15-yr life → CRF 0.1168; fixed O&M 2.5% of capex/yr | Assumption |
| USD/SAR | 3.75 | Peg |
| External flexibility | One aggregated class: up/down power P_F, shiftable energy D·P_F, efficiency η = 0.95, energy-neutral within a 24-h window starting 06:00 | Generic class (desalination with water storage, cooling with TES, pumping, industry); duration D swept 4–12 h |
| Flexibility credit rule | Up-shift counts only when absorbing the DC's own PV surplus; down-shift counts only during the DC's deficit | Accounting rule proposed in paper |
