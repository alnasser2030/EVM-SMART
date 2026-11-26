# TPEC 2027 paper — External Energy Flexibility (EEF)

- `paper/eef_tpec2027.pdf` — compiled paper (IEEE conference format, 6 pages; limit 6). Results are at the derived 90% target (Section IV-D and Fig. 3); a companion review paper is in `review_paper/`.
- `paper/eef_tpec2027.tex` — source. Author names and email are placeholders: `[Author Name]`, `[Advisor Name]`, `[email]`.
- `model/eef_model.py` — LP models (EEF minimum flexibility / maximum CFE; RE+BESS minimum storage), HiGHS via SciPy.
- `model/run_experiments.py` — runs all scenarios → `results/*.csv`.
- `figures/make_figures.py` — Figs. 1–4 from the results.
- `data/` — Riyadh hourly PV (PVGIS-SARAH3, 2020) and `parameters.md` with all sources.

Reproduce:
```bash
pip install scipy highspy matplotlib
python3 model/run_experiments.py && python3 figures/make_figures.py
cd paper && pdflatex eef_tpec2027 && bibtex eef_tpec2027 && pdflatex eef_tpec2027 && pdflatex eef_tpec2027
```

## Number check (paper ↔ results)
| Paper statement | Source file | Value |
|---|---|---|
| AM hourly matching 40.4% | results/baseline.csv | 0.4043 |
| PV 477 MWp, CF 20.96% | results/baseline.csv, data | 477.06 MWp; 1,836 kWh/kWp |
| Surplus = deficit 521.9 GWh | results/baseline.csv | 521.86 |
| 150 MW / 8 h → 82.0%, 364.6 GWh shifted | results/dispatch_summary.csv | 0.8205; 364,578 MWh |
| 80% needs 140 MW EEF or 1,027 MWh battery | results/targets.csv | 140.4 MW; 1,027.0 MWh |
| Break-even mid 85.8 / 86.2 / 87.0 / 89.2 $/MWh (60–90%) | results/targets.csv | ✓ |
| Max EEF CFE 91.2% | results/max_cfe.csv | 0.9117 |
| Battery cost at 80%: 30.2 M$/yr (mid) | results/targets.csv | 30,150,734 |
| EEF at $50/MWh, 80%: 17.3 M$/yr | 346,660 MWh × 50 | 17.33 M$ |
| Emissions 296 / 99.5 / 49.8 kt | (1−CFE)·876 GWh·0.568 | ✓ |
| NEOM: CF 21.37%, AM 41.5%, 80% → 134 MW or 995 MWh, BE 86.7 $/MWh, max EEF 89.5% | model rerun with data/pv_neom_2020_local_per_kWp.csv | ✓ |
| Monthly CFE (80% target): EEF 86.6% vs BESS 85.1% in Jun; 68.6% vs 71.5% in Dec; AM 34.9–44.5% | results/monthly_cfe.csv (model/run_extra.py) | ✓ |
| PV ×1.25/×1.5: max 93.1/93.7%; P80 123/118 MW; P90 162/151 MW; BESS90 1,252/1,227 MWh | results/sens_pv.csv | ✓ |
| η 0.85/1.0: P80 163/132 MW; max 89.3/91.5%; break-even per MWh unchanged | results/sens_eta.csv | ✓ |
| Three pillars at 80%: evening grid load 100/100/13/16 MW; night 100/100/51/41 MW; emissions 498/296/99.5/99.5 kt; storage 1,027 MWh (BESS only); cost 30.2 (18.1–49.2) vs 17.3 (8.7–26.0 at $25–75) M$/yr; grid purchases 42.0 M$/yr | results/three_pillars.csv (model/run_pillars.py) | ✓ |

## Number check: target, size and 90% results (paper ↔ results)
| Paper statement | Source file | Value |
|---|---|---|
| EEF cheapest from 45%; works 85–99.5% (evenings ≥ 90% freed) | results/displacement_costs.csv (grid+carbon), model/plot_verdict.py | cheapest EEF from 45; eve 0.929 at 85 |
| 83% of summer evenings freed at 80%, 99.2% at 90% | results/displacement_costs.csv | 0.827; 0.993 |
| EEF US$27.5–31/MWh; battery US$31–68/MWh; GRID 42.7, AM 31.2 | results/displacement_costs.csv | 27.52–31.03; 30.96–67.71 |
| +US$0.3/MWh from 80% to 90% | results/displacement_costs.csv | 27.72 → 28.02 |
| Designs: PV ×1.25 from 93%, ×1.5 at 98%, ×3 at 99%, weekly at 99.5% | results/displacement_costs.csv | ✓ |
| Size: cheaper than battery from 1.6 MW, cheapest from ≈ 8 MW; saving 3.2–3.5 vs AM, 17.4–17.7 vs battery | results/verdict_ranges.csv; figures/make_figures.py (fig4_target_size) | 1.6; 8.2–8.3 MW; 3.19→3.46; 17.43→17.70 |
| 90%: 203 MW or 1,320 MWh; 434.3 GWh shifted; break-even 89.2 US$/MWh | results/base_sites.csv | ✓ |
| 90% pillars: emissions 49.8 kt; battery 38.7 (23.2–63.3) M$/yr; EEF 21.7 (10.9–32.6); evening load 6/5 MW; night 24/10 MW | results/base_pillars.csv (model/run_base.py) | ✓ |
| Monthly at 90%: Jun 95.9 vs 96.2; Dec 77.7 vs 78.7; within 2 points every month | results/base_monthly.csv | ✓ |
| NEOM 90%: PV ×1.25, 157 MW or 1,223 MWh, break-even 86.1; works 85–99.5% from 8.5 MW | results/base_sites.csv, verdict_ranges.csv | ✓ |

