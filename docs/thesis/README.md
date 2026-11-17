# Thesis LaTeX (TAMU format, IEEE citations)

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
