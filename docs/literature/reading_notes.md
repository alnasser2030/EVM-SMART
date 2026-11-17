# Reading Notes — Full Texts

## Batch 1 (Priority A, 5 papers) — 2026-11-16

| # | Paper | Key finding | Relation to EEF |
|---|---|---|---|
| A2 | Hwang et al., *Risk-aware planning for corporate renewable procurement under hourly matching*, Energy 367 (2026) 142953 | Two-stage stochastic + CVaR sizing of PV, wind, BESS, gas and hourly RECs under hourly matching; data center, paper, steel, cement profiles; risk-averse design cuts CVaR ~35% at <4% extra cost | Closest method. Means of matching = **own assets + hourly certificates**; no external demand flexibility → **gap holds**. Good template for uncertainty (Ch.2) and a B2-type comparator |
| A3 | Lee, Choi & Kim, *Integrated procurement strategies: direct PPA, ESS, market*, JEET 21 (2026) 3187 | MILP for an industrial consumer in Korea; direct PPA infeasible without ESS beyond ~20% RE target; ESS needs grow non-linearly beyond ~80% → sharp cost rise | Strong **motivation**: storage-based matching becomes very expensive at high matching levels — the cost problem EEF targets. No external flexibility |
| A5 | Fei, Lyu & Ding, *Energy flexibility procurement in competitive DR markets: dual-channel supply chain*, Energy Economics 161 (2026) 109542 | Stackelberg game: grid operator buys flexibility directly from consumers and via a service provider (aggregator); direct channel reduces double marginalization, expands DR market >60% | **Buyer is the grid operator**, not a consumer firming its own supply → supports gap. Useful for the **contractual framework** (direct vs aggregator channel) |
| A7 | Xu, Ricks, Manocha, Patankar & Jenkins, *System-level impacts of voluntary CFE procurement*, Joule 8 (2024) 374–400 | Annual matching has negligible emission benefit; hourly matching cuts system emissions at a cost premium and drives advanced clean tech uptake | Core evidence for **B3 vs C**. Note: model includes demand-response resources of the **participating buyer itself** (internal flexibility) — not external loads → distinguishes EEF |
| A8 | Bjørn et al., *RECs threaten integrity of corporate science-based targets*, Nature Climate Change 12 (2022) 539 | Without REC-based claims, 2015–2019 scope 2 trajectories not 1.5 °C-aligned; 42% of committed scope 2 reductions may not be real | **Motivation**: annual/REC-based "100% renewable" is clean on paper |

**Batch-1 verdict:** none of the five uses flexibility of *other* grid consumers to deliver hourly matching for a buyer. Gap still holds. Highest-risk paper (A1, DC–desalination) not yet read.

## Batch 2 (Priority A, 4 papers) — 2026-11-16

| # | Paper | Key finding | Relation to EEF |
|---|---|---|---|
| A6 | *IDC Load Modeling for DR Considering the Coupling of Multiple Regulation Methods*, IEEE Trans. Smart Grid (2021) | Bottom-up IDC load model coupling spatial (geo-distributed) and temporal regulation via workloads/servers; hierarchical control; joint methods increase IDC DR capability | Representative of **internal** IDC flexibility (relies on shiftable/migratable workloads) → not applicable to constant-load AI training DCs; contrast for EEF |
| A7 | Chen et al., *Internet data centers participating in demand response: A comprehensive review*, RSER 117 (2020) 109466 | Review of IDC load modeling, regulation operations (spatial/temporal workload shifting, server/cooling control), economics and DR programs | Key citation that the DC-DR literature is about **regulating the DC's own load** → supports "literature looks inside" |
| A8 | Paterakis, Erdinç & Catalão, *An overview of Demand Response: key-elements and international experience*, RSER 69 (2017) 871–891 | DR taxonomy (incentive- vs price-based), benefits/barriers, enabling technologies, program examples incl. **baseline methods** (e.g., average of 10 previous normal days) | Foundation for modeling external flexible loads relative to a **baseline** and for program/contract design in the framework |
| A10 | Liu et al., *Data center demand response: avoiding the coincident peak via workload shifting and local generation*, Performance Evaluation 70 (2013) | Workload shifting + local generation avoids coincident-peak charges; up to 40% cost savings vs either alone | Classic **internal** DC flexibility (workload + on-site generation) → contrast for EEF |

**Batch-2 verdict:** all four confirm that data center flexibility is studied as an internal resource (workloads, servers, on-site generation). Gap still holds.

## Batch 3 (Priority A, 4 papers) — 2026-11-16

| # | Paper | Key finding | Relation to EEF |
|---|---|---|---|
| A1 | Yang, Konstantinou (KAUST) & Hou, *Enabling grid-interactive data center–desalination coordination through thermo-electric coupling-based waste heat utilization*, Applied Energy 408 (2026) 127428 | Co-located flexible DC + RO desalination plant + PV + ESS behind one substation; DC waste heat preheats seawater (lower RO SEC); two-stage stochastic MINLP (Benders + McCormick) for joint planning/operation; 86.5% lower annualized cost, 17% from heat synergy; motivated by Saudi/UAE coasts | **Closest paper — must cite and differentiate.** Differences: (1) DC is assumed **flexible** (workload scheduling within daily task totals) — EEF assumes an **inflexible** AI DC; (2) desalination is **co-located, co-planned, physically coupled** (heat) — EEF uses **existing grid-connected loads** as a **portfolio**, coupled only **contractually via the grid**; (3) objective is **cost/arbitrage**, not **hourly clean-energy matching**; (4) no B1/B2/B3 comparison, no reliability pillar, no saturation analysis. → Gap holds |
| A2 | Ludkovski, Mouti & Swindle, *Least-cost structuring of 24/7 carbon-free electricity procurements*, IEEE PESGM 2024 | Chance-constrained portfolio of solar/wind PPAs to reach a target hourly CFE score at least cost, using multi-year joint simulations | **Supply-side only** (generator portfolio, no flexibility) → gap holds. Method reference for **CFE score definition** and probabilistic targets |
| A3 | Li, Tong & Mount, *Energy management for renewable-colocated AI data centers*, IEEE PES IM 2026 | EMS co-optimizes **AI workload scheduling**, on-site renewables and wholesale/retail market participation; cost reductions on real traces | AI DC with **internal** workload flexibility + on-site RE → contrast; EEF needs neither. Gap holds |
| A4 | Wu, Zhao, Mao & Liu, *Flexibility quantification of desalination plants for DR: adaptive robust optimization*, Applied Energy 373 (2024) 123835 | Defines technical/economic flexibility intervals of RO plants (max power exchange with distribution system), ARO with nested C&CG; incentive-based DR eliminates execution deviations | **Parameter source** for the desalination class in the EEF flexibility portfolio (power intervals, feasibility vs economic flexibility) |

Not obtained (not available via TAMU): A5 SMR–renewable microgrids for 24/7 DCs (SETA 2026) — low priority, cite from abstract or request via ILL; A9 Masanet et al., Science 2020 — seek open author/LBNL copy or ILL.

**Priority A verdict (13/15 read):** No paper uses the flexibility of *other, existing grid-connected loads* to deliver hourly clean-energy matching for an *inflexible* AI data center. Closest work (Yang et al. 2026) relies on a flexible, co-located DC with physical heat coupling to one desalination plant. **Gap confirmed at Priority A level.**

## Batch 4 (Priority B, IEEE, 5 papers) — 2026-11-17

| # | Paper | Key finding | Relation to EEF |
|---|---|---|---|
| B4 | *On the Interplay between Water and Power Grids: Desalination Plants for Demand Response*, IEEE PESGM 2023 | Game between a power service provider and a desalination plant; equilibrium exists (uniqueness conditions); incentives let the plant adjust power while meeting water requirements → extra system flexibility | Supports desalination as an **external flexibility class** and **incentive/contract design** (Stackelberg-type) for the framework. Buyer is the power provider, not a consumer |
| B5 | *A Water–Carbon Sustainability Framework for 24/7 Carbon-Free AI Datacenter Siting in the U.S.*, IEEE PESGM 2026 | State-level Water–Carbon Index (eGRID CO2 + WRI baseline water stress); few states are both low-carbon and low-water-stress; solar-rich regions often water-stressed | Context for **sustainability pillar** (water as a possible secondary metric in arid KSA). Siting, not supply design → no overlap |
| B6 | O'Connell et al., *Carbon-Free Energy: How Much, How Soon?*, IEEE Power & Energy Magazine (2021) | ~90% clean grids feasible by 2035 with wind, solar, short-duration batteries and transmission; existing gas at low capacity factors balances; policy/regulation essential | System-level context: high-VRE grids need flexibility; supports motivation and the regulatory angle of the framework |
| B7 | Alsaleh et al., *Model-free RL for Demand Response in PV-rich Distribution Systems*, Saudi Arabia Smart Grid 2022 | DRL aggregator directly controls a share of each load on IEEE 33-bus with high PV; shifts flexible demand to solar peaks while keeping voltage within limits | Saudi-context evidence that **shifting flexible demand to solar hours via an aggregator** is studied for grid voltage — not for a consumer's hourly matching. Supports aggregator role in framework |
| B8 | *Techno-Economic Viability of a Solar PV–Wind–Battery Hybrid System for an EV Charging Station in Khobar*, Saudi Arabia Smart Grid 2024 | HOMER sizing for 2,424 kWh/day, 444 kW peak load in Khobar | Saudi **cost/resource data** reference (PV/wind/battery in Eastern Province); RE+BESS-type sizing method example |

Not yet received: B1 (10.1109/tsg.2018.2871125), B2 (10.1109/tcc.2017.2744623), B3 (10.1109/mele.2023.3291195).

**Batch-4 verdict:** no overlap with EEF; adds support for desalination/aggregator-based external flexibility and Saudi context. Gap still holds.

## Batch 5 (Priority B, IEEE, 3 papers) — 2026-11-17

| # | Paper | Key finding | Relation to EEF |
|---|---|---|---|
| B1 | Kwon, Ntaimo & Gautam, *Demand Response in Data Centers: Integration of Server Provisioning and Power Procurement*, IEEE Trans. Smart Grid 10(5) (2019) 4928 | Two-stage stochastic co-optimization of server provisioning (internal) with power procurement from grid, renewables and storage for DR | Internal flexibility + own procurement assets → contrast; stochastic procurement formulation is a method reference |
| B2 | Dabbagh, Hamdaoui, Rayes & Guizani, *Shaving DC Power Demand Peaks Through Energy Storage and Workload Shifting Control*, IEEE Trans. Cloud Computing 7(4) (2019) 1095 | Optimal/online peak shaving combining delay-tolerant workload classes and on-site batteries (Google traces) | Internal flexibility (workload delay + batteries) → contrast; workload "classes with delay tolerance and cost" parallels our external flexibility **classes** |
| B3 | Paananen, *Grid-Interactive Data Centers Enabling Energy Transition*, IEEE Electrification Magazine (Sept 2023) | Grid-interactive UPS batteries can provide fast frequency response and reserves; long-duration (hours/days) balancing needs energy-intensive flexible assets | DC flexibility via **UPS** for seconds–minutes services; notes hours-scale balancing needs other assets → supports EEF's focus on hour-scale external flexibility |

**Priority B complete (8/8). Verdict:** all DC-side papers use internal resources (workloads, servers, UPS/batteries). Gap holds.

## Batch 6 (open access, 7 papers) — 2026-11-17

| # | Paper | Key finding | Relation to EEF |
|---|---|---|---|
| OA1 | Riepin & Brown, *Spatio-temporal load shifting for truly clean computing*, Advances in Applied Energy (2025) (arXiv 2405.00036) | Company with geo-distributed DCs uses **its own** space-time load shifting + procurement to reach 24/7 CFE; three signals (resource quality, wind decorrelation, solar time lag) drive effective shifting | **Closest open-access method**: 24/7 CFE via **internal** DC flexibility. EEF replaces internal shifting (unavailable for constant AI load) with **external** flexibility → key contrast |
| OA2 | Riepin & Brown, *On the means, costs and system-level impacts of 24/7 CFE procurement*, Energy Strategy Reviews (2024) (arXiv 2403.07876) | 24/7 matching viable, reduces system emissions robustly across regions; means = clean generation + storage (+ advanced tech); volumetric (annual) matching has temporal mismatch | Core for **AM vs EEF**; means of matching exclude external demand flexibility |
| OA3 | Miller et al., *Hourly accounting of carbon emissions from electricity consumption*, ERL (2022) | Annual-average factors can bias inventories by up to ±35%; bias larger where grid carbon intensity varies and for loads with temporal variation | Method basis for **hourly emission accounting** in the sustainability pillar |
| OA4 | *Beyond scalar flexibility* (arXiv 2609.05406, 2026) | 155,410-GPU production trace: immediate eligible curtailment ≈ **6.35% of median facility power** (12.1% of workload power); relief shrinks with duration; scheduler exposes almost no delay-based capacity | **Strong evidence AI DCs are near-inflexible** → core premise of EEF |
| OA5 | Chen et al., *To Defer or To Shift? AI DC flexibility on grid interconnection* (ACM e-Energy 2026, arXiv 2604.05376) | Capacity expansion with network constraints; flexible AI load cuts total cost ~3.5% but may not reduce generation investment | Internal AI DC flexibility at system planning level → context/contrast; method idea for Ch.3 |
| OA6 | *Shift or curtail? DC flexibility value depends on host grid* (arXiv 2608.19622, 2026) | Firm/flexible/interruptible DC tiers in capacity expansion (PJM, Korea); Korea: shifting DC load into midday solar enables +0.5 GW solar, avoids gas and 0.3 GW batteries; calls for designing **flexibility products** for hyperscale DCs as future work | Value of **solar-hour shifting** shown — but with the DC's **own** load. Supports EEF value proposition and the framework/product design gap |
| OA7 | Petitet et al., *Evaluation and Role of Industrial Demand Response in Saudi Arabia*, KAPSARC DP (2026) | 2025–2030: duck-curve depth ×3, max 1-h ramp ×3.5–5.5; **industrial DR potential 7.1–29.9 GW by 2030**; DR role undefined in single-buyer market; phased policy via SPPC/NGSA/aggregators; assumes DCs could give 0.9–3.8 GW DR | **Key Saudi calibration** for the external flexibility supply (Ch.3 saturation) and framework actors (SPPC, NGSA, aggregators). Note: its DC-DR assumption conflicts with AI-DC inflexibility evidence (OA4) — discuss |

Not obtained: Cunha 2026 preprint (site blocks automated download).

**Batch-6 verdict:** Open-access evidence reinforces the premise (AI DC inflexible), the motivation (annual matching inadequate, 24/7 valuable) and gives Saudi calibration. No paper uses external loads' flexibility for a DC's hourly matching. Gap holds.
