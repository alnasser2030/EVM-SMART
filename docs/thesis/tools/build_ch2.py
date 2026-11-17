"""Convert docs/literature/chapter2_draft_v1.md into LaTeX (chapter2.tex + refs.bib).

Usage (from repo root):
    python3 docs/thesis/tools/build_ch2.py
    cd docs/thesis && pdflatex main_ch2 && bibtex main_ch2 && pdflatex main_ch2 && pdflatex main_ch2
"""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / "docs/literature/chapter2_draft_v1.md"
OUT = ROOT / "docs/thesis"

MANUAL_BIB = r"""
@techreport{r1,
  author      = {Shehabi, Arman and Smith, Sarah and Hubbard, Alex and Newkirk, Alex and Lei, Nuoa and Siddik, Md Abu Bakar and Holecek, Billie and Koomey, Jonathan and Masanet, Eric and Sartor, Dale},
  title       = {2024 United States Data Center Energy Usage Report},
  institution = {Lawrence Berkeley National Laboratory},
  address     = {Berkeley, CA, USA},
  number      = {LBNL-2001637},
  month       = dec,
  year        = {2024},
  note        = {doi: 10.71468/P1WC7Q}
}

@misc{r26,
  author       = {Li, Meiyi},
  title        = {Beyond Scalar Flexibility: From Eligible {AI} Workloads to Dependable Load Relief},
  howpublished = {arXiv:2609.05406},
  year         = {2026}
}

@misc{r27,
  author       = {Khanal, Saroj and Roh, Geon and Yao, Boyu and Silverman, Abraham and Gayme, Dennice and Konstantinou, Charalambos and Kim, Jip and Dvorkin, Yury},
  title        = {Shift or Curtail? How Much Data-Center Flexibility Is Worth Depends on the Host Power Grid},
  howpublished = {arXiv:2608.19622},
  year         = {2026}
}

@techreport{r40,
  author      = {{International Energy Agency}},
  title       = {Energy and {AI}},
  institution = {IEA},
  address     = {Paris, France},
  type        = {World Energy Outlook Special Report},
  year        = {2025},
  note        = {Licence: CC BY 4.0. [Online]. Available: https://www.iea.org/reports/energy-and-ai}
}
"""


def clean_bib(text: str) -> str:
    text = text.replace("&amp;", r"\&")
    text = re.sub(r"month=(Sept|June|July)\b", lambda m: "month=" + {"Sept": "sep", "June": "jun", "July": "jul"}[m.group(1)], text)
    text = re.sub(r"pages=\{(\d+)[–-](\d+)\}", r"pages={\1--\2}", text)
    text = re.sub(r"\s*(url|ISSN|publisher|collection|series)=\{[^{}]*\},?", "", text)
    # DOI -> note (IEEEtran.bst has no doi field)
    text = re.sub(r"DOI=\{([^}]*)\}", lambda m: "note={doi: %s}" % m.group(1), text)
    # KAPSARC discussion paper as tech report
    text = text.replace("@book{r23,", "@techreport{r23, type={Discussion Paper}, number={KS--2026-DP17},")
    # protect acronyms and proper nouns in titles (IEEEtran sentence-cases titles)
    proper = {"Saudi", "Arabia", "Khobar", "Paris", "U.S.", "Türkiye", "Europe", "Korea"}

    def protect(title):
        out = []
        for tok in re.split(r"(\s+)", title):
            core = tok.strip(",.:;?()")
            parts = core.split("-")
            acro = any(sum(c.isupper() for c in p) >= 2 or (any(c.isupper() for c in p) and any(c.isdigit() for c in p))
                       for p in parts)
            if core and (acro or core in proper):
                tok = tok.replace(core, "{" + core + "}", 1)
            out.append(tok)
        return "".join(out)

    text = re.sub(r"\btitle=\{([^{}]*)\}", lambda m: "title={" + protect(m.group(1)) + "}", text)
    return text


def cite_run(run: str) -> str:
    nums = []
    for a, b in re.findall(r"\[(\d+)\](?:\s*–\s*\[(\d+)\])?", run):
        a = int(a)
        nums.extend(range(a, int(b) + 1) if b else [a])
    return r"\cite{" + ",".join(f"r{n}" for n in nums) + "}"


CITE_RUN = re.compile(r"\[\d+\](?:\s*(?:–|,)\s*\[\d+\])*")

FIGS = {
    "fig2_3_references_by_year.png": "fig:years",
    "fig2_1_hourly_mismatch.png": "fig:mismatch",
    "fig2_2_positioning_map.png": "fig:position",
}
FIG_TEXT = {"Fig. 2.1": r"Fig.~\ref{fig:mismatch}", "Fig. 2.2": r"Fig.~\ref{fig:position}",
            "Fig. 2.3": r"Fig.~\ref{fig:years}"}

TABLE = r"""
```{=latex}
\begin{table}[!htbp]
\centering
\caption{Positioning of this work relative to the literature.}
\label{tab:positioning}
\small
\renewcommand{\arraystretch}{1.25}
\begin{tabularx}{\textwidth}{>{\raggedright\arraybackslash}p{3.1cm}>{\raggedright\arraybackslash}X>{\raggedright\arraybackslash}p{2.4cm}>{\raggedright\arraybackslash}p{2.5cm}>{\raggedright\arraybackslash}p{2.4cm}}
\toprule
\textbf{Stream} & \textbf{Flexibility source} & \textbf{Procured by} & \textbf{Purpose} & \textbf{Applicable to an inflexible AI DC?} \\
\midrule
Internal DC flexibility \cite{r2,r3,r4,r5,r6,r7,r8,r9,r24,r27} & DC workloads, servers, UPS, batteries & DC operator & Cost, DR, peak shaving, 24/7 CFE & Limited \cite{r26} \\
Renewables + storage supply \cite{r15,r30,r31,r32,r33} & On-site or contracted storage & DC / buyer & Self-supply, reliability & Costly at high shares \cite{r15} \\
Hourly clean matching \cite{r9,r10,r11,r14,r15,r16} & Procured generation, storage, own load & Buyer & 24/7 CFE & Only via costly storage \cite{r15} \\
Grid demand flexibility \cite{r17,r18,r19,r20,r21,r23} & Other consumers' loads & System operator / aggregator & System balancing & Not linked to a buyer's supply \\
DC--desalination coupling \cite{r22} & Co-located plant + flexible DC & Integrated owner & Cost (heat synergy) & No (assumes flexible DC) \\
\midrule
\textbf{This work (EEF)} & \textbf{Portfolio of existing external loads} & \textbf{DC via contractual framework} & \textbf{Hourly matching + reliability + cost} & \textbf{Yes} \\
\bottomrule
\end{tabularx}
\end{table}
```
"""


def body_from_markdown(md: str) -> str:
    body = md.split("## 2.1", 1)[1]
    body = "## 2.1" + body.split("\n---\n\n## References", 1)[0]

    # figures: image line + italic caption line -> LaTeX figure
    def fig(m):
        path, cap = m.group(1), m.group(2)
        name = Path(path).name
        cap = re.sub(r"^Fig\. 2\.\d\.\s*", "", cap).strip()
        cap = CITE_RUN.sub(lambda r: cite_run(r.group(0)), cap)
        width = "0.95\\textwidth" if "positioning" not in name else "0.9\\textwidth"
        pdf = name.replace(".png", ".pdf")
        return ("```{=latex}\n\\begin{figure}[!htbp]\n\\centering\n"
                f"\\includegraphics[width={width}]{{{pdf}}}\n"
                f"\\caption{{{cap}}}\n\\label{{{FIGS[name]}}}\n\\end{{figure}}\n```")
    body = re.sub(r"!\[[^\]]*\]\(([^)]+)\)\n\n\*(Fig\. 2\.\d\..*?)\*", fig, body)

    # table 2.1
    body = re.sub(r"\*Table 2\.1\..*?\*\n\n(\|.*\n)+", lambda m: TABLE.strip("\n") + "\n", body)
    body = body.replace("Table 2.1 details", r"Table~\ref{tab:positioning} details")

    for k, v in FIG_TEXT.items():
        body = body.replace(k, v)

    # headings
    body = re.sub(r"^## 2\.(\d+) (.+)$", lambda m: f"\\section{{{m.group(2)}}}\\label{{sec:2-{m.group(1)}}}",
                  body, flags=re.M)
    # citations
    body = CITE_RUN.sub(lambda m: cite_run(m.group(0)), body)
    return body


def main():
    md = MD.read_text()
    body = body_from_markdown(md)
    tex = subprocess.run(["pandoc", "-f", "markdown+raw_tex", "-t", "latex", "--wrap=preserve"],
                         input=body, capture_output=True, text=True, check=True).stdout
    tex = tex.replace("\\section{", "\\section{")  # keep numbered sections
    tex = tex.replace("\\textasciitilde{}", "~")
    tex = re.sub(r"\\hypertarget\{[^}]*\}\{%\n", "", tex)
    tex = re.sub(r"\\label\{([^}]*)\}\}", r"\\label{\1}", tex)
    (OUT / "chapter2.tex").write_text(
        "% Generated by tools/build_ch2.py from docs/literature/chapter2_draft_v1.md - edit the markdown, then rebuild.\n"
        "\\chapter{Literature Review}\\label{ch:literature}\n\n" + tex)
    crossref = (OUT / "refs_crossref.bib").read_text()
    (OUT / "refs.bib").write_text(clean_bib(crossref) + "\n" + MANUAL_BIB)
    print("wrote chapter2.tex and refs.bib")


if __name__ == "__main__":
    main()
