# Gap Check v0 — Themes 2, 4, 5 (preliminary)

Date: 2026-11-15 · Status: preliminary (metadata + abstracts + open sources; paywalled full texts not yet read)
Matrix: `literature_matrix_v0.csv` (42 papers)

## Method
- Crossref search (IEEE-filtered and all journals, 2015+), ~500 records → keyword screen → 42 curated.
- Web search for closest competitors and terminology.
- IEEE Xplore site blocks automated access; paywalled items marked "Paywalled (TAMU)" for manual download.

## Findings by theme
**T2 — Internal DC flexibility.** Large, fast-growing literature (workload shifting in time/space, curtailment, BTM batteries, UPS, cooling). Recent AI-specific work stresses that AI DC flexibility is *conditional* and small (e.g., ~6% of median facility power eligible for immediate curtailment in a 155k-GPU trace, arXiv 2609.05406). → **Supports our premise**: constant-load AI DCs cannot rely on internal flexibility.

**T4 — Clean-energy matching.** Strong evidence that annual matching / RECs overstate decarbonization (de Chalendar 2019; Bjørn 2022; Miller 2022) and that hourly (24/7) matching has real system value (Xu 2024; Riepin 2024). The means studied for hourly matching are **procured generation + storage + the DC's own load shifting** (Riepin 2025). → **Supports B3 as "clean on paper"**; no paper found using *other consumers'* flexibility as the matching means.

**T5 — Grid-side flexibility.** Mature DR/VPP/flexibility-market literature; desalination quantified as a flexibility resource (Applied Energy 2024). Flexibility is procured by **system/network operators** for grid services — not by a single large consumer to firm its own renewable supply. KAPSARC (2026): DR role undefined in Saudi single-buyer market.

## Preliminary gap statement
No study found that (i) treats a constant-load AI data center as inflexible, (ii) pairs it with grid-injected PV sized to its annual consumption, and (iii) achieves hourly matching by contracting **external** flexible loads on the grid — evaluated against direct grid supply and 100% RE + BESS on reliability, cost and sustainability, with saturation limits. The pieces exist separately (T2, T4, T5); their combination appears new.

## Must-read before confirming (risks to novelty)
1. **10.1016/j.apenergy.2026.127428** — DC–desalination coordination (Applied Energy 2026). Check whether desalination acts as flexibility *for* the DC. **Highest risk.**
2. 10.1016/j.energy.2026.142953 — hourly-matching procurement planning (Energy 2026).
3. 10.1007/s42835-026-02807-8 — PPA + storage + market procurement combos.
4. 10.1109/pesgm51994.2024.10688843 — least-cost 24/7 CFE structuring.
5. 10.1016/j.eneco.2026.109542 — flexibility procurement economics.

## Terminology
"External flexibility" is not an established term, but **"external DR flexibility"** appears with a different meaning (VPP market power, IEEE Access 2022), and DR definitions use "external signals". → Define EEF explicitly and distinguish it in the paper; consider alternatives such as *Externally Sourced Flexibility* if the advisor prefers.

## Next steps
- User: download paywalled must-reads 1–5 via TAMU library and upload.
- Claude: read full texts, then extend to themes 1, 3, 6, 7 and finalize the gap.

## Update 2026-11-16 — Priority A read (13/15)
Highest-risk paper (Yang et al., Applied Energy 2026, DC–desalination) **does not** pre-empt EEF: it assumes a flexible, co-located DC physically coupled (waste heat) to a single desalination plant and minimizes cost; EEF assumes an inflexible AI DC, uses a portfolio of existing grid-connected flexible loads via a contractual framework, and targets hourly clean-energy matching vs B1/B2/B3 with saturation limits. **Gap confirmed at Priority A level.** Must cite Yang et al. prominently (KAUST co-author; Saudi motivation) and state the differences explicitly.
