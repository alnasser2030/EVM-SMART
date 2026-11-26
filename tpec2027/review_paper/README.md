# TPEC 2027 review paper — internal and external flexibility for inflexible AI data centers

- `eef_review_tpec2027.pdf` — compiled paper (IEEE conference format, 6 pages including references; limit 6).
- `eef_review_tpec2027.tex` — source. Authors as in the companion paper: Ali Awad Ali Nasser and Mehrdad Ehsani (Texas A&M ECE).
- Diagrams are TikZ inside the `.tex`: Fig. 1 review protocol, Fig. 4 microgrid vs smart-grid supply, Fig. 5 positioning model.
- `make_review_figures.py` — data figures: Fig. 2 references by year (from `docs/thesis/refs.bib`), Fig. 3 illustrative hourly mismatch.
- References: `docs/thesis/refs.bib` (the 63 verified Chapter 2 references; all are cited).

Build:
```bash
python3 tpec2027/review_paper/make_review_figures.py
cd tpec2027/review_paper && pdflatex eef_review_tpec2027 && bibtex eef_review_tpec2027 && pdflatex eef_review_tpec2027 && pdflatex eef_review_tpec2027
```

Every number in the paper comes from Chapter 2 (`docs/literature/chapter2_draft_v2.md`, claims checked in `chapter2_verification.md`). The paper presents no model results, so it does not overlap the companion EEF modelling paper (`tpec2027/paper/`); it defines EEF only as the gap the review identifies.
