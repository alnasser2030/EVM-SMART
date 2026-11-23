# TPEC 2027 paper — External Energy Flexibility (EEF)

- `paper/eef_tpec2027.pdf` — compiled paper (IEEE conference format, 5 pages; limit 6).
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
