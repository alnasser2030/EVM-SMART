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
