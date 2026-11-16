# External Energy Flexibility (EEF) — Research Plan (Draft v0)

> ملخص القرارات المتفق عليها حتى الآن — نقطة البداية للجلسات القادمة.

## Title (proposed)
**External Energy Flexibility: A Grid-Mediated Supply Framework for Inflexible AI Data Centers Balancing Reliability, Cost, and Sustainability**

المرونة الخارجية للطاقة: إطار تغذية عبر الشبكة لمراكز الذكاء الاصطناعي غير المرنة يوازن بين الاعتمادية والتكلفة والاستدامة

Alternatives:
- Beyond Internal Flexibility: Supplying Constant-Load AI Data Centers through External Energy Flexibility
- External Energy Flexibility for Solar-Matched AI Data Centers: Concept, Multi-Objective Assessment, and Saturation Limits

## Concept
- AI data center: constant load 24/7, near-zero internal flexibility, always grid-connected (reliability = grid).
- DC buys **all** its consumption from the grid at a fixed tariff.
- A PV plant sized to the DC's **annual** consumption injects **all** output into the grid, sold at a price lower than the purchase tariff.
- **External** flexible loads on the grid (treated as a generic resource — no distribution-level detail) shift to solar hours, absorbing the time mismatch hour by hour.
- A contractual **framework** links DC, PV plant, and grid/flexibility provider.

## Problem
Today's options for AI data centers: (1) direct grid connection — reliable, cheap, high emissions; (2) 100% clean with BESS — costly batteries with replacements, still needs grid backup. Annual matching is clean only on paper (night draw is fossil; midday curtailment grows). Literature focuses on **internal** DC flexibility, which constant-load AI DCs lack.

## Motivations
Saudi AI data center expansion (Vision 2030, GW-scale); net-zero 2060 & 50% renewables by 2030; 24/7 CFE commitments; very low Saudi PV cost; unified interconnected grid; undefined DR role in single-buyer market; BESS cost and lifetime.

## Main research question
How can External Energy Flexibility enable grid-connected, constant-load AI data centers to achieve hourly clean-energy matching while maintaining reliability and minimizing cost, compared to conventional supply configurations?

| | Sub-question | Chapter |
|---|---|---|
| RQ1 | Define and formulate EEF; compare with direct grid, 100% clean + BESS, annual matching without flexibility | 1 |
| RQ2 | Reliability–cost–sustainability trade-offs; generalized conditions (price ratio, flexibility cost, PV performance) where EEF dominates | 2 |
| RQ3 | Saturation point of grid flexibility as DC capacity grows; optimal supply mix after saturation; expansion pathway | 3 |

## Scenarios
Labels (renamed 2026-11-16; formerly B1/B2/B3/C):
- **GRID** (B1) Direct grid connection (no PV)
- **RE+BESS** (B2) 100% clean: PV + BESS, grid as backup
- **AM** (B3) Annual matching: PV injected, no flexibility
- **EEF** (C) PV injected + external flexibility portfolio + contractual framework

## Pillars & metrics
- **Reliability:** DC availability (Tier), grid-side impact (night peak, ramps, LOLP)
- **Cost:** annual total cost, NPV, flexibility cost per MWh
  - Net DC cost = consumption × buy price − PV output × sell price + PV capex/O&M + flexibility payments
- **Sustainability:** hourly CFE matching score, hourly-emission-factor emissions, PV curtailment
- Methods: Pareto fronts, MCDA (AHP/TOPSIS), sensitivity analysis

## Assumptions / scope
- Horizon: **25 years** (tied to PV); PV degradation ~0.5%/yr; inverter replacement once; BESS replacements in B2; discount rate 6/8/10% sensitivity; 20/30-yr sensitivity.
- DC sizes: **50, 100 (base), 300, 1000 MW**; constant load, PUE ~1.2–1.4; results also normalized per MW.
- Out of scope: building, GPUs/servers, internal cooling, distribution level, sub-second GPU fluctuations (handled by UPS).
- Grid: single node (no transmission congestion — stated limitation); parametric flexibility as % of system load, calibrated with public Saudi data (ECRA, SEC, KAPSARC); dimensionless results for generality; optional second case (ERCOT).

## Flexibility portfolio (decided 2026-11-16)
- External flexibility = portfolio of 4–6 generic load classes already on the Saudi grid (e.g., RO desalination, district cooling with TES, water pumping/irrigation, industrial processes, EV charging, building pre-cooling) — system level, no distribution detail.
- Each class: max up/down shift (MW), shiftable energy / shift window (h), energy-neutral within window, seasonal/hourly availability, cost (capacity fee + per-MWh shift payment).
- Loads move relative to their **baseline** following the DC's hourly gap PV(t) − DC(t): up at solar surplus, down at night deficit; dispatched by LP in merit order (cheapest first) → flexibility supply curve → saturation (Ch.3).
- Base case: contract-based direct dispatch; price-based (ToU/incentive) as sensitivity.

## Expected contributions
1. New EEF concept + internal/external flexibility taxonomy
2. Mathematical formulation and new indices (e.g., required external flexibility index)
3. Generalized decision maps
4. Saturation limits and expansion pathway
5. Contractual framework for single-buyer markets

## Dropped / future work
- Cooling as fast compensating load for GPU fluctuations (hardest; out of scope)
- Hydrogen (not wanted by advisor)

## 12-week plan (publish after graduation; chapters written in IEEE paper format)
| Weeks | Deliverable |
|---|---|
| 1–3 | Concept note, literature matrix & gap, data, mathematical formulation |
| 4–6 | Chapter 1: concept + four scenarios |
| 7–8 | Chapter 2: multi-objective, decision maps, framework |
| 9–10 | Chapter 3: saturation & expansion |
| 11 | Proposal / thesis draft — advisor QA review |
| 12 | Prelim preparation |

Weekly: explanation + committee-style quiz session; short progress report in repo.
Roles: student = project manager; advisor = quality reviewer.

Open items: check department publication requirement; optional arXiv preprint for priority; fix H₂ production column always 0 in existing `dashboard.py` output (legacy code).
