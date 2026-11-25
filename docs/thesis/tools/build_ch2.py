"""Convert the Chapter 2 markdown draft into LaTeX (chapter2.tex + refs.bib).

Usage (from repo root):
    python3 docs/thesis/tools/build_ch2.py
    cd docs/thesis && pdflatex main_ch2 && bibtex main_ch2 && pdflatex main_ch2 && pdflatex main_ch2

- Citations [n], [a]–[b] become \\cite{rn,...}; BibTeX numbers them by first citation (IEEE).
- BibTeX for DOI references is fetched once from Crossref and cached in refs_crossref.bib.
- Markdown pipe tables preceded by "*Table 2.N. caption*" become booktabs/tabularx tables.
"""
import json
import re
import subprocess
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / "docs/literature/chapter2_draft_v2.md"
OUT = ROOT / "docs/thesis"
CACHE = OUT / "refs_crossref.bib"

MANUAL_BIB = r"""
@techreport{r1,
  author      = {Shehabi, Arman and Smith, Sarah and Hubbard, Alex and Newkirk, Alex and Lei, Nuoa and Siddik, Md Abu Bakar and Holecek, Billie and Koomey, Jonathan and Masanet, Eric and Sartor, Dale},
  title       = {2024 {United States} Data Center Energy Usage Report},
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

@techreport{r49,
  author      = {{Greenhouse Gas Protocol}},
  title       = {{GHG Protocol} Scope 2 Guidance},
  institution = {World Resources Institute and World Business Council for Sustainable Development},
  address     = {Washington, DC, USA},
  year        = {2015}
}

@misc{r50,
  author       = {{Greenhouse Gas Protocol}},
  title        = {Upcoming Scope 2 Public Consultation: Hourly Matching and Deliverability},
  year         = {2025},
  howpublished = {[Online]. Available: https://ghgprotocol.org/blog/upcoming-scope-2-public-consultation-hourly-matching-and-deliverability}
}

@techreport{r51,
  author      = {{EnergyTag}},
  title       = {Granular Certificate Scheme Standard},
  institution = {EnergyTag},
  type        = {Standard, Version 2},
  year        = {2023},
  note        = {[Online]. Available: https://energytag.org}
}

@misc{r52,
  author       = {{U.S. International Trade Administration}},
  title        = {{Saudi Arabia ICT}: New Data Center Strategy to Accelerate {AI} and Cloud Expansion},
  year         = {2025},
  howpublished = {Market Intelligence. [Online]. Available: https://www.trade.gov/market-intelligence/saudi-arabia-ict-new-data-center-strategy-accelerate-ai-and-cloud-expansion}
}

@misc{r53,
  author       = {{NEOM}},
  title        = {{DataVolt} Signs Agreement with {NEOM} to Design and Develop the Region's First Net-Zero {AI} Factory Campus in {Oxagon}},
  month        = feb,
  year         = {2025},
  howpublished = {[Online]. Available: https://www.neom.com/en-us/newsroom/datavolt-signs-agreement-with-neom}
}

@techreport{r54,
  author      = {Gopstein, Avi and Nguyen, Cuong and O'Fallon, Cheyney and Hastings, Nelson and Wollman, David},
  title       = {{NIST} Framework and Roadmap for Smart Grid Interoperability Standards, Release 4.0},
  institution = {National Institute of Standards and Technology},
  address     = {Gaithersburg, MD, USA},
  type        = {NIST Special Publication},
  number      = {1108r4},
  month       = feb,
  year        = {2021},
  note        = {doi: 10.6028/NIST.SP.1108r4}
}

@misc{r55,
  title        = {{IEEE} Guide for Smart Grid Interoperability of Energy Technology and Information Technology Operation with the Electric Power System ({EPS}), End-Use Applications, and Loads},
  howpublished = {IEEE Std 2030-2011},
  year         = {2011},
  note         = {doi: 10.1109/IEEESTD.2011.6018239}
}

@misc{r63,
  title        = {{IEEE} Standard for the Specification of Microgrid Controllers},
  howpublished = {IEEE Std 2030.7-2017},
  year         = {2018},
  note         = {doi: 10.1109/IEEESTD.2018.8340204}
}
"""
MANUAL_KEYS = set(re.findall(r"@\w+\{(r\d+),", MANUAL_BIB))


# ----------------------------------------------------------------- bibliography
def fetch_crossref_bib(refs: dict) -> str:
    cached = CACHE.read_text() if CACHE.exists() else ""
    have = set(re.findall(r"@\w+\{(r\d+),", cached))
    new = []
    for n, doi in sorted(refs.items()):
        key = f"r{n}"
        if key in have or key in MANUAL_KEYS or not doi:
            continue
        url = "https://api.crossref.org/works/" + urllib.parse.quote(doi) + "/transform/application/x-bibtex"
        for _ in range(3):
            try:
                b = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "thesis-build"}),
                                           timeout=40).read().decode()
                break
            except Exception:
                time.sleep(4)
        else:
            raise SystemExit(f"Crossref fetch failed for [{n}] {doi}")
        new.append(re.sub(r"^@(\w+)\{[^,]+,", lambda m: f"@{m.group(1)}{{{key},", b.strip(), count=1))
        time.sleep(0.8)
    if new:
        cached = cached.rstrip() + "\n\n" + "\n\n".join(new) + "\n"
        CACHE.write_text(cached)
    return cached


def clean_bib(text: str) -> str:
    text = text.replace("&amp;", r"\&")
    text = re.sub(r"month=(Sept|June|July)\b",
                  lambda m: "month=" + {"Sept": "sep", "June": "jun", "July": "jul"}[m.group(1)], text)
    text = re.sub(r"pages=\{(\d+)[–-](\d+)\}", r"pages={\1--\2}", text)
    text = re.sub(r"\s*(url|ISSN|publisher|collection|series)=\{[^{}]*\},?", "", text)
    text = re.sub(r"DOI=\{([^}]*)\}", lambda m: "note={doi: %s}" % m.group(1), text)
    text = text.replace("@book{r23,", "@techreport{r23, type={Discussion Paper}, number={KS--2026-DP17},")
    text = text.replace("CO2", r"{CO\textsubscript{2}}")
    proper = {"Saudi", "Arabia", "Khobar", "Paris", "U.S.", "Türkiye", "Europe", "Korea", "Vision"}

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

    return re.sub(r"\btitle=\{([^{}]*)\}", lambda m: "title={" + protect(m.group(1)) + "}", text)


# ----------------------------------------------------------------- body
CITE_RUN = re.compile(r"\[\d+\](?:\s*(?:–|,)\s*\[\d+\])*")


def cite_run(run: str) -> str:
    nums = []
    for a, b in re.findall(r"\[(\d+)\](?:\s*–\s*\[(\d+)\])?", run):
        nums.extend(range(int(a), int(b) + 1) if b else [int(a)])
    return r"\cite{" + ",".join(f"r{n}" for n in nums) + "}"


def tex_inline(cell: str) -> str:
    cell = cell.strip()
    cell = cell.replace("&", r"\&").replace("%", r"\%").replace("~", r"$\sim$")
    cell = CITE_RUN.sub(lambda m: cite_run(m.group(0)), cell)
    cell = re.sub(r"\*\*(.+?)\*\*", r"\\textbf{\1}", cell)
    cell = cell.replace("—", "---").replace("–", "--")
    return cell


TABLE_COLS = {  # column specs per table number (must sum to \textwidth)
    "2.2": r">{\raggedright\arraybackslash}p{2.1cm}>{\raggedright\arraybackslash}p{2.3cm}>{\raggedright\arraybackslash}X"
           r">{\raggedright\arraybackslash}p{2.6cm}>{\raggedright\arraybackslash}p{1.6cm}>{\raggedright\arraybackslash}p{2.6cm}",
    "2.3": r">{\raggedright\arraybackslash}p{3.1cm}>{\raggedright\arraybackslash}X>{\raggedright\arraybackslash}p{2.4cm}"
           r">{\raggedright\arraybackslash}p{2.5cm}>{\raggedright\arraybackslash}p{2.4cm}",
    "2.1": r">{\raggedright\arraybackslash}p{3.2cm}>{\raggedright\arraybackslash}X>{\raggedright\arraybackslash}X",
}


def table_block(m) -> str:
    num, cap, rows = m.group(1), m.group(2).strip(), m.group(3)
    lines = [l for l in rows.strip().splitlines() if l.strip()]
    cells = [[c for c in l.strip().strip("|").split("|")] for l in lines]
    head, body = cells[0], [r for r in cells[2:]]
    size = r"\scriptsize" if num == "2.2" else r"\small"
    out = [r"\begin{table}[!htbp]", r"\centering", f"\\caption{{{tex_inline(cap)}}}", f"\\label{{tab:{num}}}",
           size, r"\renewcommand{\arraystretch}{1.2}", f"\\begin{{tabularx}}{{\\textwidth}}{{{TABLE_COLS[num]}}}",
           r"\toprule", " & ".join(r"\textbf{" + tex_inline(h) + "}" for h in head) + r" \\", r"\midrule"]
    for r in body:
        if r[0].strip().startswith("**This work"):
            out.append(r"\midrule")
        out.append(" & ".join(tex_inline(c) for c in r) + r" \\")
    out += [r"\bottomrule", r"\end{tabularx}", r"\end{table}"]
    return "```{=latex}\n" + "\n".join(out) + "\n```\n"


FIG_LABEL = {"fig2_3_references_by_year.png": "fig:years", "fig2_1_hourly_mismatch.png": "fig:mismatch",
             "fig2_2_positioning_map.png": "fig:position"}


def body_from_markdown(md: str) -> str:
    body = "## 2.1" + md.split("## 2.1", 1)[1]
    body = body.split("\n---\n\n## References", 1)[0]

    fig_num = {}

    def fig(m):
        path, num, cap = m.group(1), m.group(2), m.group(3).strip()
        name = Path(path).name
        fig_num[num] = FIG_LABEL[name]
        cap = CITE_RUN.sub(lambda r: cite_run(r.group(0)), cap)
        cap = re.sub(r"Table (2\.\d)", r"Table~\\ref{tab:\1}", cap)
        width = "0.9\\textwidth" if "positioning" in name else "0.95\\textwidth"
        return ("```{=latex}\n\\begin{figure}[!htbp]\n\\centering\n"
                f"\\includegraphics[width={width}]{{{name.replace('.png', '.pdf')}}}\n"
                f"\\caption{{{cap}}}\n\\label{{{FIG_LABEL[name]}}}\n\\end{{figure}}\n```")

    body = re.sub(r"!\[[^\]]*\]\(([^)]+)\)\n\n\*Fig\. (2\.\d)\.\s*(.*?)\*", fig, body)
    body = re.sub(r"\*Table (2\.\d)\.\s*(.*?)\*\n\n((?:\|.*\n)+)", table_block, body)
    for num, label in fig_num.items():
        body = body.replace(f"Fig. {num}", f"Fig.~\\ref{{{label}}}")
    body = re.sub(r"Table (2\.\d)", r"Table~\\ref{tab:\1}", body)
    body = re.sub(r"^## 2\.(\d+) (.+)$", lambda m: f"\\section{{{m.group(2)}}}\\label{{sec:2-{m.group(1)}}}",
                  body, flags=re.M)
    body = re.sub(r"Sections? (2\.\d+)(?:–(2\.\d+))?",
                  lambda m: ("Sections~\\ref{sec:2-%s}--\\ref{sec:2-%s}" % (m.group(1)[2:], m.group(2)[2:]))
                  if m.group(2) else "Section~\\ref{sec:2-%s}" % m.group(1)[2:], body)
    body = CITE_RUN.sub(lambda m: cite_run(m.group(0)), body)
    return body


def main():
    md = MD.read_text()
    refs = {}
    for line in md.split("## References", 1)[1].splitlines():
        m = re.match(r"\[(\d+)\]\s+(.*)", line)
        if m:
            d = re.search(r"doi:\s*(\S+?)\.?(\s|$|\*)", m.group(2))
            refs[int(m.group(1))] = d.group(1) if d else None
    body = body_from_markdown(md)
    used = sorted({int(n) for n in re.findall(r"\\cite\{([^}]*)\}", body) for n in re.findall(r"r(\d+)", n)})
    missing = [n for n in used if n not in refs]
    if missing:
        raise SystemExit(f"cited but not in reference list: {missing}")
    tex = subprocess.run(["pandoc", "-f", "markdown+raw_tex", "-t", "latex", "--wrap=preserve"],
                         input=body, capture_output=True, text=True, check=True).stdout
    tex = tex.replace("\\textasciitilde{}", "~")
    tex = re.sub(r"\\hypertarget\{[^}]*\}\{%\n", "", tex)
    tex = re.sub(r"\\label\{([^}]*)\}\}", r"\\label{\1}", tex)
    (OUT / "chapter2.tex").write_text(
        "% Generated by tools/build_ch2.py from docs/literature/chapter2_draft_v2.md - edit the markdown, then rebuild.\n"
        "\\chapter{Literature Review}\\label{ch:literature}\n\n" + tex)
    crossref = fetch_crossref_bib({n: d for n, d in refs.items() if n in used})
    keep = "\n\n".join(e for e in re.split(r"\n\s*\n(?=@)", crossref.strip())
                       if int(re.match(r"@\w+\{r(\d+),", e.strip()).group(1)) in used)
    (OUT / "refs.bib").write_text(clean_bib(keep) + "\n" + MANUAL_BIB)
    unused = sorted(set(refs) - set(used))
    print(f"wrote chapter2.tex and refs.bib; {len(used)} references cited" + (f"; unused: {unused}" if unused else ""))


if __name__ == "__main__":
    main()
