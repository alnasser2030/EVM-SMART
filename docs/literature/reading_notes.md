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
