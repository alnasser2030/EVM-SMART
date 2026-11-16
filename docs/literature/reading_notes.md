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
