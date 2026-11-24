# External Energy Flexibility (EEF) — Research Plan (v1, Nov 2026)

> Summary of the decisions agreed so far, and the starting point for future sessions. v0 had three RQs; v1 has four RQs, a control chapter, the Saudi implementation framework, the NEOM case and an explicit project horizon.

## Title (proposed)
**External Energy Flexibility: A Grid-Mediated Supply Framework for Inflexible AI Data Centers Balancing Reliability, Cost, and Sustainability**

المرونة الخارجية للطاقة: إطار تغذية عبر الشبكة لمراكز الذكاء الاصطناعي غير المرنة يوازن بين الاعتمادية والتكلفة والاستدامة

## Concept
- **AI data center (DC):**
  - constant load 24/7, near-zero internal flexibility (≈ 6% immediately curtailable in a 155,410-GPU trace)
  - always grid-connected, so its reliability equals the grid's
  - buys **all** its consumption from the grid at the regulated tariff
- **PV:** a plant sized to the DC's **annual** consumption injects **all** output into the grid and sells it to the single buyer (SPPC) under a PPA. The DC never absorbs PV.
- **Flexible loads:** through contracts with the grid and an aggregator, **existing** loads absorb **all** PV output:
  - desalination
  - district cooling with thermal energy storage
  - pumping
  - industry

  In return, every hour they reduce consumption below their baseline by the DC load, and the freed grid supply is credited to the DC.
- **Physical net on the loads:** +(PV − L) around midday and −L at night. Each 24-h window from 06:00 is energy-neutral.
- **Accounting:** PV is credited to the absorbing loads, and freed supply is credited to the DC. Both are measured against metered baselines and recorded as hourly certificates, with no double counting.
- **Control layers:**
  - planning (years)
  - day-ahead scheduling (24 h)
  - intraday MPC correction (minutes)
  - settlement (monthly)

  The layers act only on the loads, never on the DC, so the worst case is annual matching with unchanged reliability.

## Problem statement
AI data centers are large, nearly constant loads with little internal flexibility. In Saudi Arabia today they are supplied from a fossil-dominated grid (58% gas and 41% oil in 2022) at a regulated tariff, with diesel backup. "Green" claims rest on annual I-RECs, which are clean on paper only: 40.4% hourly matching in Riyadh. Batteries can match every hour but cost ≈ US$30 M/yr per 100 MW at 80%. On-site renewables are capped at 50 MW per premises, and there is no wheeling regime. Large flexible loads already on the grid could follow the sun, yet **no framework lets an inflexible data center use that external flexibility for verifiable hourly clean supply, without storage and without compromising reliability.**

## Motivations
1. **Rapid AI data center growth.** Globally ≈ 415 TWh in 2024 → ≈ 945 TWh by 2030 (IEA). In Saudi Arabia, 2.8 TWh in 2024 → 10.2–42.2 TWh by 2030 (KAPSARC), with a target of ≈ 1.5 GW of capacity by 2030.
2. **The credibility gap in clean claims.** Annual matching overstates decarbonization, and the GHG Protocol Scope 2 revision (new standard expected 2027) includes an hourly-matching option.
3. **The cost of storage** at high hourly-matching shares.
4. **Saudi context:**
   - 50% renewables by 2030
   - the midday dip in net load (the "duck curve") triples by 2030
   - 7.1–29.9 GW of industrial demand-response potential
   - an undefined role for flexibility in the single-buyer market
5. **Reliability is non-negotiable**, so any solution must keep grid-level reliability.
6. **Grid burden (the Texas lesson).** ERCOT's large-load queue grew from > 233 GW (Dec 2025) to ≈ 474 GW (mid-2026), ≈ 90% data centers, and Texas SB 6 (2025) now allows new large loads to be curtailed in emergencies. EEF supplies the DC without adding its night load to the system: it cuts the net night load by ≈ 59% of DC size, against ≈ 49% for a battery. The DC's own connection is still sized for its full load.

## Main research question
How can External Energy Flexibility enable a grid-connected, constant-load AI data center to achieve hourly clean-energy matching while maintaining reliability and minimizing cost, compared with conventional supply configurations?

| RQ | Question | Objective | Chapter |
|---|---|---|---|
| **RQ1** | How can EEF be formalized (actors, contract, accounting), and how does it compare with GRID, RE+BESS and AM on reliability, cost and sustainability? | O1, O2 | 3 |
| **RQ2** | How should EEF be controlled in operation, and how robust is its hourly matching to forecast errors and the limits of the flexible loads? | O3 | 4 |
| **RQ3** | Under what general conditions (price ratios, flexibility cost, PV performance, available flexibility) does EEF dominate, and what contractual framework enables it in single-buyer and liberalized markets? | O4 | 5 |
| **RQ4** | At what scale of data center capacity does external flexibility saturate, and what supply mix is best beyond that point? | O5 | 6 |

## Objectives
- **Main:** develop and evaluate EEF, in which an inflexible AI data center contracts existing grid loads for hourly clean supply with grid-level reliability at least cost.
- **O1:** define EEF: actors, contract, hourly accounting rule (displacement credits with M&V).
- **O2:** build the planning model and compare EEF with GRID, RE+BESS and AM on the three pillars.
- **O3:** design and test operational control (day-ahead scheduling plus intraday MPC) under forecast uncertainty.
- **O4:** derive generalized decision maps, and propose a contractual framework for single-buyer and liberalized markets.
- **O5:** quantify the saturation of external flexibility and the best supply mix beyond it.

## Scenarios
| Label | Configuration | Today's equivalent in KSA |
|---|---|---|
| **GRID** (B1) | Direct grid supply, no clean procurement | today's default |
| **AM** (B3) | PV equal to annual use, injected; no flexibility | today's I-REC "green" claim |
| **RE+BESS** (B2) | Same PV + battery (benchmark) | storage route |
| **EEF** (C) | Same PV + external flexible loads + contracts | this work |

## Pillars & metrics
- **Reliability:** DC load served (identical to the grid in all four configurations). Grid-side impact is reported separately as evening and night net load.
- **Sustainability:** hourly matching (CFE score) and hourly-accounted emissions at the average factor (0.568 t CO₂/MWh), with the marginal-emission caveat.
- **Cost:** annualized cost of hourly matching; break-even flexibility price π\* = C_B / Σd.

## Method
- **Linear programming (HiGHS), 8,760 hours:** the planning physics is linear, the optimum is global, and one run (≈ 26,000 variables) takes 0.2–1.6 s. Each run answers one question: max matching for a given Pᶠ, min Pᶠ or min battery for a target, and the break-even price.
- **Later chapters:** stochastic or robust scheduling with MPC (Ch. 4), and MILP only if discrete unit sizes matter. Rationale: `docs/implementation/eef_saudi_framework.md` §10.

## Assumptions / scope
- **Horizon: 25 years**, set by the PV life. Costs are reported as annual equivalents.
  - The battery is annualized over a 15-year life at 8% with 2.5%/yr fixed O&M.
  - An explicit 25-year computation with one battery replacement changes the battery cost by ≈ 1% (US$30.5 M vs US$30.2 M/yr).
  - Present value over 25 years at 8%: battery ≈ US$326 M, EEF ≈ US$185 M.
  - Shared items (the PV plant and the grid tariff) cancel across configurations.
  - PV and inverter degradation, battery degradation, 6/8/10% discount rates and 20/30-year horizons are dissertation sensitivities.
- **DC size:** 100 MW base (the LP is linear, so per-MW results do not depend on size); 50, 300 and 1,000 MW plus the 1.5-GW NEOM campus as scale cases.
  - Size map from 1 MW to 10 GW (`tpec2027/model/run_sizes.py`). It assumes a fixed overhead of US$0.1–0.5 M/yr per EEF contract and a regional flexibility pool of 2 GW (or the national low estimate of 7.1 GW), with storage beyond the pool.
  - Result: EEF is best from ≈ 5 MW to ≈ 1.4 GW per region. Smaller sites should be pooled; above the pool, EEF is combined with storage.
- **Prices in US$:** Saudi prices are converted at 3.75 SAR per US$.
- **PV selling price (assumption):** US$13.6/MWh (5.1 halalas/kWh), the NREP benchmark. This is below the DC's US$48/MWh purchase tariff. No official price exists for this case, so a three-tier SERA rule is proposed (framework §7c).
- **Sites:** Riyadh (base) and NEOM–Oxagon (second site, `tpec2027/model/run_sites.py`).
- **Out of scope:**
  - the building, GPUs and servers
  - internal cooling
  - distribution-level detail
  - sub-second GPU fluctuations, which are handled by the UPS
- **Grid:** single node in Ch. 3 (stated limitation); regional pools and network limits come in Ch. 6.

## Flexibility portfolio
- 4–6 generic load classes already on the Saudi grid:
  - RO desalination (about half of Saudi desalination capacity is RO)
  - district cooling with TES (SERA-licensed)
  - water pumping
  - industrial processes
  - possibly EV charging and building pre-cooling
- Each class is described by:
  - maximum up/down shift
  - shiftable energy and window
  - energy neutrality
  - availability
  - cost (capacity fee plus per-MWh payment)
- Dispatch in merit order gives a flexibility supply curve, which leads to the saturation analysis (Ch. 6).

## Implementation in Saudi Arabia
Full framework: [`docs/implementation/eef_saudi_framework.md`](implementation/eef_saudi_framework.md). It covers:
- the status quo
- the comparison with today's practice
- when EEF wins
- the actors
- the six contracts (C1–C6)
- prices and money flows
- the developer's steps
- the regulatory gaps
- where EEF wins by DC size (§4a)
- recommendations (§13)

**Actors:**
- Ministry of Energy (policy)
- SERA (aggregator licence, baselines, M&V, settlement)
- SPPC / Principal Buyer (buys the PV)
- Saudi Energy, formerly SEC (supplies the DC, meters)
- National Grid SA (connection, network check)
- a new licensed aggregator
- the flexible loads
- an hourly certificate registry
- CST (DC registration)

## Status (Nov 2026)
| Item | Status |
|---|---|
| Ch. 2 literature review | complete (53 refs, TAMU format PDF) |
| Ch. 3 planning model | preliminary results: Riyadh + NEOM, four scenarios, sensitivities |
| TPEC 2027 paper | 6 pages, ready for advisor review; submit by **30 Nov 2026** (author block to fill) |
| Prelim film | `media/prelim_film/` (11 sections, ≈ 15.5 min, with an interactive HTML version) |
| Implementation framework | `docs/implementation/eef_saudi_framework.md` |
| Ch. 4–6 | planned (control, decision maps and contracts, saturation) |

## Expected contributions
1. EEF concept with an internal-vs-external flexibility taxonomy and an hourly accounting rule
2. Planning model and three-pillar comparison against GRID, AM and RE+BESS
3. Hierarchical control design tested under uncertainty
4. Generalized decision maps and a contractual framework for single-buyer and liberalized markets
5. Saturation limits and expansion pathways

## Open items (need data or decisions outside this work)
- Real flexibility costs from candidate loads (desalination, district cooling, industry): interviews or tenders.
- SERA's position on an aggregator licence and hourly credits; the final AI-data-center tariff (KAPSARC: "yet to be decided").
- The GHG Protocol Scope 2 outcome (2027).
- Five grey-literature items in Chapter 2 to confirm (`docs/literature/chapter2_verification.md`); LBNL numbers to check against the public version.

## Dropped / future work
- Cooling as fast compensating load for GPU fluctuations (hardest; out of scope)
- Hydrogen (not wanted by advisor)

Roles: student = project manager; advisor = quality reviewer.
