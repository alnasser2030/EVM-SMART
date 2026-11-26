# Thesis LaTeX (TAMU format, IEEE citations)

- `chapter3_planning_model.pdf` — compiled Chapter 3 (External Energy Flexibility: Concept, Planning Model and Scenarios). Source `chapter3.tex` (hand-written, not generated), wrapper `main_ch3.tex`, extra sources `refs_ch3.bib`; figures from `tpec2027/figures/`, numbers from `tpec2027/results/` (Section 3.12 lists the scripts).
  ```bash
  cd docs/thesis && pdflatex main_ch3 && bibtex main_ch3 && pdflatex main_ch3 && pdflatex main_ch3 && cp main_ch3.pdf chapter3_planning_model.pdf
  ```

- `chapter2_literature_review.pdf` — compiled Chapter 2 (Literature Review).
- `main_ch2.tex` — standalone wrapper: 12 pt Times, 1-inch margins, double spacing, centered all-caps chapter title (Texas A&M OGAPS style), IEEEtran numeric citations.
- `chapter2.tex`, `refs.bib` — **generated** from `docs/literature/chapter2_draft_v2.md` by `tools/build_ch2.py` (BibTeX from Crossref in `refs_crossref.bib` plus manual entries for LBNL, IEA and arXiv items). Edit the markdown, then rebuild.

Rebuild:
```bash
python3 docs/thesis/tools/build_ch2.py
cd docs/thesis && pdflatex main_ch2 && bibtex main_ch2 && pdflatex main_ch2 && pdflatex main_ch2 && cp main_ch2.pdf chapter2_literature_review.pdf
```
Requires: pandoc, texlive-latex-recommended, texlive-latex-extra, texlive-fonts-extra (newtx), texlive-publishers (IEEEtran), texlive-bibtex-extra.

Note: reference numbers in the PDF follow order of first citation (IEEE), so they differ from the numbering in the markdown draft. The PDF numbering is authoritative.
