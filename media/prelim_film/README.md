# Prelim film: External Energy Flexibility

A 16-minute (16:07) educational film (1920×1080, 30 fps, no audio) for the PhD preliminary examination. It goes from the title to the conclusion in Texas A&M colours (maroon `#500000`, white, A&M gray `#707373`). The official A&M logo is not used.

- **Video:** `eef_prelim_film.mp4`
- **Interactive version:** open `prelim_film.html` in a browser. It has play/pause, a scrubber and a button for each section. Use it to pause on any scene while presenting.
- **Poster frame:** `poster.png`

## Structure

| Time | Section | Scenes |
|---|---|---|
| 0:00 | Opening | Flat AI load vs. the sun, title, roadmap (11 stops) |
| 0:36 | 01 Motivation | Global demand (IEA, LBNL), Saudi data centers (KAPSARC, national strategy), the Saudi grid (duck curve, 7.1–29.9 GW DR), **the Texas lesson (ERCOT queue 233 → 474 GW, SB 6)**, three pillars |
| 1:42 | 02 Problem | **How Saudi data centers are supplied today**, **why self-supply does not scale (SERA rules, a real off-grid design)**, annual matching = 40.4% hourly, ≈ 6% internal flexibility, battery escalation, problem statement |
| 3:14 | 03 State of the Art | Review funnel (1,365 → 53), three research streams (Venn), closest study (Yang et al. 2026), positioning map and gap |
| 4:14 | 04 Questions & Objectives | Main RQ, RQ1–RQ4 mapped to Chapters 3–6, objectives O1–O5 |
| 4:55 | 05 Methodology | EEF concept over one day, hourly accounting, **what displacement means (the data center takes 100% from the grid; PV sold; flexible loads free the same MWh hour by hour)**, four control layers, model pipeline, equations, **why linear programming**, the LP over one day, experimental design, **25-year cost basis** |
| 7:50 | 06 Results: Riyadh | Dispatch day, displacement vs. flexibility, **how much is shifted (not 100%: netted / shifted / grid mix)**, all four scenarios on one day, full comparison table, three pillars at 90%, cost across targets, **the full bill including PV sales**, break-even price, **when EEF wins**, **the displacement curve (EEF works at 85–97%, best ≈ 90%)**, **the size curve (≈ 8 MW to 1.5 GW)**, seasons and sensitivity |
| 11:27 | 07 Case: NEOM | Site and PV shape (later sun), NEOM results vs. Riyadh, NEOM at 90% (PV ×1.25) and scaled to the 1.5-GW Oxagon campus |
| 12:19 | 08 Implementation in KSA | **Actors and roles, six contracts, prices and money flows, steps and regulatory gaps** |
| 13:34 | 09 Expected Results | RQ2 control bounds, RQ3 first decision map, RQ4 first-order saturation, hypotheses H1–H4 |
| 14:37 | 10 Research Plan | Chapter status, next steps, publications |
| 14:54 | 11 Contributions & Conclusion | Five contributions, **the verdict at 90% displacement over 25 years: EEF the only configuration meeting all three pillars**, **recommendations (size, displacement, flexibility, window, prices, SERA asks)**, five-line conclusion, closing line |
| 15:57 | End card | Thank you / questions |

All result numbers come from `tpec2027/results/*.csv` (same model and data as the TPEC 2027 paper). The film presents its results at **90% displacement**, the best point of the displacement curve (`tpec2027/model/run_base.py` → `base_*.csv`); the paper's 80% case appears only where labelled. The NEOM case, the one-day scenario comparison and the decision map come from `tpec2027/model/run_sites.py` (outputs `sites_*.csv`, `scenario_day.csv`, `decision_map.csv`). The film uses **displacement** for the share of the data center's use freed on the grid hour by hour; the paper and the literature call the same number hourly matching (CFE). The displacement and size curves come from `tpec2027/model/run_displacement.py`, `plot_displacement.py` and `plot_verdict.py` (Riyadh and NEOM); grid reinforcement (US$125/kW-yr), carbon (US$50/t) and the contract overhead (US$0.25 M/yr) are stated assumptions, and flexible load is not limiting on the one national grid. All prices are shown in US$ (Saudi sources converted at 3.75 SAR per US$). The 1.5-GW campus figures are a linear ×15 scale-up of the 100-MW results, and the saturation chart is a first-order estimate; both are labelled as such in the film. Saudi market facts, SERA rules and the off-grid design are documented in `docs/implementation/eef_saudi_framework.md`. The off-grid design is shown without the developer's name. Literature numbers come from Chapter 2 (`docs/literature/chapter2_draft_v2.md`).

## Editing and rebuilding

| File | Contents |
|---|---|
| `engine.js` | Palette, helpers, icons, chrome (section label, progress bar, footer), timeline |
| `scenes_intro.js` | Opening, motivation, problem |
| `scenes_sota.js` | State of the art, research questions, objectives |
| `scenes_method.js` | Concept, accounting, control, model, design |
| `scenes_results.js` | Results, plan, contributions, conclusion, end card |
| `scenes_extra.js` | Model pipeline, LP day, scenario comparisons, NEOM case, expected results |
| `scenes_impl.js` | Status quo, when EEF wins, implementation (actors, contracts, prices, steps) |
| `scenes_basis.js` | Self-supply limits (SERA), why linear programming, 25-year cost basis, verdict |
| `scenes_bill.js` | How much is shifted, the full bill with PV sales |
| `scenes_size.js` | The Texas lesson, what displacement means, the displacement curve, the size curve, recommendations |
| `timeline.js` | Scene order and durations |
| `data.js` | Generated by `build_data.py` from the TPEC results |
| `equations.js` | Generated by `build_equations.js` (MathJax 3.2.2) |

The name line ("PhD Resident") is in `sTitle` and `sEnd` in `scenes_intro.js` and `scenes_results.js`.

```bash
python3 tpec2027/model/run_sites.py                      # NEOM case, scenario day, decision map (~1 min)
python3 media/prelim_film/build_data.py                  # after re-running the model
NODE_PATH=<dir>/node_modules node media/prelim_film/build_equations.js   # after editing equations (npm install mathjax-full@3.2.2)
node media/prelim_film/stills.js <outDir> scene:concept:10 120.5          # review stills (scene:<id>:<offset> or seconds)

# full render: 4 parallel segments, then join
N=29004; Q=$(( (N+3)/4 ))
for k in 0 1 2 3; do node media/prelim_film/record_pipe.js seg_$k.mp4 30 $((k*Q)) $(((k+1)*Q)) & done; wait
printf "file 'seg_%d.mp4'\n" 0 1 2 3 > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c:v libx264 -crf 21 -preset medium -pix_fmt yuv420p -movflags +faststart media/prelim_film/eef_prelim_film.mp4   # re-encode: keeps the file under GitHub's 100 MB limit
```

`N` is the duration × 30; `stills.js` prints the duration as `T_END`.

## Notes for presenting

- The film has no narration. Each scene has a headline and a one-line caption, so it can play on its own or under a live voice-over.
- Pausing on a scene in the HTML version gives a clean still for questions.
- Sources are cited in the top-right corner of each data scene.
