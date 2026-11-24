"""Build media/prelim_film/narration_script.md from the timeline and the narration text below."""
import re

import os
FILM = os.path.dirname(os.path.abspath(__file__)) + "/"
N = {
    "cold": "An AI data center never sleeps. The sun does. So who supplies the night — cleanly, reliably, and at a fair cost?",
    "title": "External Energy Flexibility: supplying an AI data center with clean energy, hour by hour, without touching its reliability. My name is Ali Nasser, Electrical and Computer Engineering, Texas A&M.",
    "roadmap": "Here is the path: why this matters, what today's options leave unsolved, the state of the art and my questions, then the method, results for Riyadh and NEOM, implementation in Saudi Arabia, expected results, the plan, and the contributions.",
    "c1": "Chapter one: motivation.",
    "motGlobal": "Data centers used about four hundred and fifteen terawatt-hours in 2024, and that could more than double by 2030. AI is the main driver — and these facilities draw power around the clock.",
    "motSaudi": "Saudi Arabia is building for AI. Data-center demand could grow from under three terawatt-hours today to between ten and forty-two by 2030, with about one and a half gigawatts of capacity targeted.",
    "motGrid": "At the same time, the grid is adding solar fast, so noon gets cleaner and evenings get harder. Between seven and thirty gigawatts of industrial load could flex — but today that flexibility supplies no one's clean energy.",
    "texas": "Texas shows what happens when data centers outrun the grid: requests to connect large loads doubled to about four hundred and seventy gigawatts, and new rules now let the operator curtail them. Saudi Arabia is next.",
    "pillars": "So every option in this work is judged on three pillars at once: reliability equal to the grid's, low emissions hour by hour, and the lowest cost over the project's life.",
    "c2": "Chapter two: the problem.",
    "today": "Today, Saudi data centers buy all their energy from the grid at a regulated tariff — about forty-eight dollars per megawatt-hour — with diesel backup and annual green certificates. Reliability is solved. Hourly clean supply is not: at night, the supply is gas and oil.",
    "selfSupply": "Could a data center simply build its own solar? SERA caps self-consumption at fifty megawatts, on the same premises, and below the contracted load — while a hundred-megawatt campus needs nearly five hundred megawatts of solar. Self-supply does not scale; the answer has to work through the grid.",
    "annual": "The common fix is annual matching: buy as much renewable energy as you use over the year. On paper that is one hundred percent. Hour by hour, in Riyadh, it is only about forty percent — at night the data center still runs on the fossil-heavy grid.",
    "internal": "Could the data center shift its own load? AI servers run close to full most of the time — there is only about six percent of internal flexibility to work with.",
    "batteries": "The default answer is batteries. They can cover every hour, but the storage grows fast: at ninety percent, a hundred-megawatt data center needs about thirteen hundred megawatt-hours — close to forty million dollars a year.",
    "statement": "So the problem is this: an inflexible AI data center needs clean energy every hour, with grid-grade reliability, at an acceptable cost — and none of today's options delivers all three. That is the gap this dissertation sets out to close.",
    "c3": "Chapter three: the state of the art.",
    "review": "I searched the literature systematically — more than thirteen hundred records, screened down to fifty-three studies. Most of the evidence is very recent.",
    "venn": "The work falls into three streams. The first makes the data center itself flexible. The second pairs it with renewables and storage. The third uses demand response — but buys it for the system operator, not for a customer's supply. Each solves part of the problem; none uses other loads to supply a data center hour by hour.",
    "closest": "The closest study, by Yang and colleagues in 2026, is close in spirit, but it relies on a flexible data center and one physically coupled plant. My work keeps the data center untouched and contracts many existing loads across the grid.",
    "gap": "That leaves one empty cell: no study gives an inflexible AI data center hourly clean supply by contracting existing external loads, and judges it on reliability, emissions and cost together.",
    "c4": "Chapter four: questions and objectives.",
    "rq": "My main question: how can External Energy Flexibility let a grid-connected, constant-load AI data center displace its grid consumption hour by hour with clean energy, while keeping reliability and minimizing cost? Four sub-questions follow, one per chapter: how to formulate and compare it, how to operate it under uncertainty, when it wins, and where it saturates.",
    "objectives": "The objectives build on each other: define the framework and its accounting rule, build the planning model, design the control, derive decision maps and contracts, and quantify the national limits.",
    "c5": "Chapter five: methodology.",
    "concept": "Here is the idea over one day. The data center draws a constant load from the grid — always — so its reliability is the grid's. A solar plant sized to its annual use sells all of its output to the grid. Around noon, contracted flexible loads — desalination, district cooling, pumping, industry — consume more and absorb that solar. At night, the same loads consume less than usual, by as much as the data center uses. The data center never moves; the loads do the shifting.",
    "accounting": "Credit follows metered facts. The solar is credited to the loads that absorb it, never to the data center. The data center is credited only with supply the loads verifiably freed — hour by hour, with no double counting.",
    "displacement": "What I measure is displacement: the share of the data center's use that is freed on the grid in the same hour. The literature calls it hourly matching. Plain grid supply is zero, annual certificates give forty percent, and at one hundred the data center would add nothing to the grid in any hour.",
    "control": "Control has four layers — planning, day-ahead scheduling, intraday correction, and settlement — and every layer acts only on the external loads. If the loads fall short, only the displacement drops; the data center's supply is never at risk.",
    "pipeline": "The model takes hourly solar data for Riyadh and NEOM, the data-center load, the flexible portfolio, a battery benchmark, and prices and emission factors, and runs four linear programs over all eight thousand seven hundred and sixty hours of a year.",
    "model": "The core is a linear program. Flexible loads shift up to their contracted power, with a five percent loss, and every daily window must close at zero — the loads move energy, they do not add it. The objective is the smallest contracted flexibility that reaches a displacement target X. The battery is sized the same way, and the break-even price follows.",
    "whyLP": "Why linear programming? At the planning stage every relation is linear, so the solver returns the true minimum — not a heuristic estimate — in seconds per run. That makes full-year sweeps, two sites and decision maps affordable, and it treats the battery and EEF with exactly the same method.",
    "lpday": "This is the model on one day. The loads bank solar energy around noon and pay it back at night, and the account must close at zero every day. The five percent loss is the price of moving energy through someone else's process.",
    "design": "I compare four configurations: grid only, annual matching, solar plus battery, and EEF. All four buy their full consumption from the grid and share the same solar plant; only the way the night is covered changes.",
    "lifetime": "Costs cover a twenty-five-year project, reported per year, and what all options share cancels out. At ninety percent displacement the battery costs about thirty-nine million dollars a year — checked with a replacement at year fifteen — while EEF costs about twenty-two million, with no capital at all.",
    "c6": "Chapter six: results for Riyadh.",
    "dispatch": "Here is the dispatch. Around noon the loads absorb up to a hundred and fifty megawatts of solar; all night they consume a hundred megawatts less than usual. The data center never moves, and its displacement doubles compared with annual matching.",
    "curve": "How much flexibility is needed? About two megawatts of flexible load per megawatt of data center reaches ninety percent. Beyond eight hours of shifting, duration barely matters — power is the binding resource.",
    "shiftSplit": "Not all of the consumption is shifted. At ninety percent, forty percent is covered by solar in the same hour, fifty percent is shifted by the loads, and ten percent still comes from the grid mix. The model always picks the least flexibility that meets the target.",
    "scenarioDay": "On one July day, the four configurations cover the same night differently. Grid supply displaces nothing. Annual matching covers only the daylight hours. The battery and EEF both cover over ninety percent — one stores energy, the other moves demand that already exists.",
    "compare": "Over the full year, all four serve the data center one hundred percent of the time. The battery and EEF both cut emissions to about fifty kilotonnes a year — but EEF needs no new storage, costs about twenty-two million dollars a year instead of thirty-nine, and leaves less load on the grid at night.",
    "resPillars": "On the three pillars: reliability is identical for all four. EEF's emissions match the battery's — one sixth of annual matching. And EEF is about forty-four percent cheaper than the battery, with no new storage built.",
    "costTargets": "This holds at every target. From fifty to ninety percent displacement EEF stays below the battery, and the yearly saving grows from about three to seventeen million dollars.",
    "fullBill": "Now the full bill. Every option pays the same grid tariff, and selling the solar to the Principal Buyer pays back the solar plant. On top of that, EEF covers the night for about forty-five percent less per tonne of CO2 avoided than a battery.",
    "breakeven": "What does EEF replace? Storage. Contracting flexibility beats building batteries whenever it costs less than about eighty-seven dollars per megawatt-hour shifted — a wide margin over the prices I assume.",
    "whenBest": "EEF wins when the data center needs grid-grade reliability, the target is high, flexibility is cheaper than storage, the site is at least about eight megawatts, and the grid room and carbon it saves are valued. Outside these conditions the answer is grouping, a hybrid, or plain supply.",
    "dispCurve": "Where exactly does EEF work? I swept displacement from fifty to one hundred percent. From eighty-five percent the summer evenings are freed, and EEF stays the cheapest all the way to ninety-nine and a half. Up to ninety-eight needs only daily shifting and a quarter more solar; beyond that, two to three times the solar, or loads that shift across a week. One hundred percent is out of reach. Ninety percent frees the evenings with no oversizing — that is my recommendation.",
    "sizeCurve": "And for which sizes? The only size effect is the fixed cost of a contract. Below about eight megawatts it dominates, so small sites should be grouped. From eight megawatts up to the largest campus planned — one and a half gigawatts — EEF is the best option, and groups of campuses get the same result.",
    "seasons": "Summer is easy. Winter is where the daily window binds, because the days are shorter. Modest solar oversizing closes most of the gap.",
    "c7": "Chapter seven: the NEOM case.",
    "neomSite": "The second site is NEOM–Oxagon on the Red Sea coast: slightly sunnier, and the sun comes later in the day. What does that change?",
    "neomResults": "The same story, with a slightly lower ceiling. Annual matching rises to about forty-two percent. With solar sized to annual use NEOM tops out just under ninety percent, so ninety percent there takes a quarter more solar — and then about a hundred and sixty megawatts of flexible load per hundred megawatts.",
    "neomScale": "Scaled to the one-and-a-half-gigawatt Oxagon campus, that is about two point four gigawatts of contracted flexibility, eighteen gigawatt-hours of batteries avoided, and three point six megatonnes of CO2 a year below annual matching — at about fifty-eight percent of the storage cost.",
    "c8": "Chapter eight: implementation in Saudi Arabia.",
    "actors": "Who does what? The Ministry sets policy, SERA licenses and writes the rules, the Principal Buyer buys the solar, Saudi Energy supplies the data center, and the National Grid checks the schedules. EEF needs one new licence — the aggregator — one rulebook, and an hourly registry.",
    "contracts": "Six contracts make it work. The data center's supply contract never changes. The solar developer sells to the Principal Buyer. The data center buys an EEF service from the aggregator, who contracts the loads, schedules them with the grid operator, and settles hourly credits in a registry.",
    "money": "Who pays whom? The data center keeps paying its forty-eight dollar tariff. At ninety percent, EEF adds about twenty-five dollars per megawatt-hour, where storage would add forty-four. The flexible loads move consumption rather than add it, so their energy bill is unchanged — and they earn the payment.",
    "implSteps": "Step by step: register, connect, sponsor the solar, build the portfolio — about two megawatts per megawatt, anywhere on the national grid — agree baselines, sign the service, and operate. Everything else already exists.",
    "c9": "Chapter nine: expected results.",
    "expControl": "Chapter four asks how much of the planning result survives real operation. The planning model is the upper bound; if the loads deliver nothing, the worst case is annual matching. Control should land close to the upper bound.",
    "expDecision": "Chapter five draws decision maps. This first slice compares the break-even flexibility price with the battery's cost: EEF wins below the line, and the line rises as batteries get more expensive.",
    "expSaturation": "Chapter six asks how far external flexibility can go nationally. At ninety percent, each gigawatt of data centers needs about two gigawatts of flexible load — so the national potential would saturate somewhere between three and a half and fifteen gigawatts.",
    "expHyp": "Four hypotheses follow, each with a measurable test — and the preliminary results already bound the answers.",
    "c10": "Chapter ten: the research plan.",
    "plan": "Chapter two is complete. Chapter three has preliminary results for two sites and a paper for TPEC 2027. Chapters four to six follow: control, decision maps and contracts, and national saturation.",
    "c11": "Chapter eleven: contributions and conclusion.",
    "contrib": "This work contributes a new supply concept with an hourly accounting rule, a planning model with a three-pillar comparison, a control design, decision maps with a contractual framework, and the limits of external flexibility.",
    "verdict": "So who wins? Scored on all three pillars at ninety percent displacement over twenty-five years: grid supply and annual matching fail on emissions, the battery fails on cost, and EEF is the only configuration that meets all three — in Riyadh and at NEOM.",
    "recommend": "My recommendations: use EEF for data centers from about eight megawatts up, at eighty-five to ninety-nine and a half percent displacement, with about ninety as the target — and add an aggregator licence, hourly certificates and a solar purchase-price rule to SERA's framework.",
    "conclusion": "In conclusion: EEF keeps the data center's reliability identical to the grid's, cuts its emissions like a battery, costs less, and leaves room on the grid. In one line: the sun goes to the loads — and the night comes back to the data center.",
    "end": "Thank you. I welcome your questions.",
}
CHAPTERS = {"c1": "01 · Motivation", "c2": "02 · Problem", "c3": "03 · State of the Art", "c4": "04 · Questions & Objectives",
            "c5": "05 · Methodology", "c6": "06 · Results: Riyadh", "c7": "07 · Case: NEOM", "c8": "08 · Implementation in KSA",
            "c9": "09 · Expected Results", "c10": "10 · Research Plan", "c11": "11 · Contributions & Conclusion"}

titles = {}
import glob
for f in glob.glob(FILM + "scenes_*.js"):
    s = open(f).read()
    for m in re.finditer(r"function (s\w+)\(g, lt\) \{\n(.*?)\n\}", s, re.S):
        h = re.search(r"head\(g, lt, ([`'])(.*?)\1, ([`'])(.*?)\3", m.group(2))
        if h:
            t = re.sub(r"\$\{[^}]*\}", "90", h.group(4))
            titles[m.group(1)] = t
titles.update({"sCold": "Cold open: a flat AI load against the sun", "sTitle": "Title card", "sStatement": "Problem statement",
               "sRQ": "Main research question and RQ1–RQ4", "sConcept": "The EEF concept over one day",
               "sConclusion": "Five-line conclusion and closing line", "sEnd": "Thank you"})
rows = re.findall(r"\['(\w+)', ([\d.]+), (\d+), (\w+)", open(FILM + "timeline.js").read())
lines, t, total_words, n = [], 0.0, 0, 0
cur_ch = "00 · Opening"
lines.append(f"## {cur_ch}\n")
for id_, d, sec, fn in rows:
    d = float(d)
    if id_ in CHAPTERS:
        cur_ch = CHAPTERS[id_]
        lines.append(f"\n## {cur_ch}\n")
    n += 1
    text = N[id_]
    wc = len(text.split())
    total_words += wc
    secs = wc / 2.4
    fit = "fits" if secs <= d + 1 else f"≈ {secs:.0f} s spoken — the scene will be stretched to your recording"
    on = "Chapter card" if id_ in CHAPTERS else titles.get(fn, fn)
    lines.append(f"**{n:02d} · `{id_}` · starts {int(t // 60)}:{t % 60:04.1f} · {d:g} s** — on screen: *{on}*  \n"
                 f"File name: `{n:02d}_{id_}.m4a` · {wc} words ({fit})\n\n> {text}\n")
    t += d
head = f"""# Prelim film — narration script

Film: `eef_prelim_film.mp4` (16:07, 11 chapters, {n} scenes). Read at a relaxed pace, about 140 words a minute.
The whole script is ≈ {total_words} words, ≈ {total_words / 140:.0f} minutes of speech.

## How to record

1. **One clip per scene.** Name each file as shown under the scene (for example `05_motGlobal.m4a`). Any common format works: m4a, mp3 or wav.
2. **Phone is fine.** Use a quiet room with soft furnishings, hold the phone 20–30 cm from your mouth, and keep the same position for every clip.
3. **Leave about one second of silence** at the start and end of each clip.
4. **Do not rush to fit the time.** If a clip runs longer than its scene, I will stretch that scene to your voice. If it is shorter, the scene keeps its length.
5. **Chapter cards are optional.** Read the one-line title, or skip it and I will leave a short pause.
6. **Change any wording** to how you would naturally say it. Keep the numbers as written, because they match the screen.
7. **Send the clips together** (a zip or a shared folder). I will sync them to the scenes, mix them in, and send you the narrated film.

If you prefer one long take per chapter, that also works: leave about two seconds of silence between scenes so I can split it.

---

"""
open(FILM + "narration_script.md", "w").write(head + "\n".join(lines) + "\n")
print(n, total_words, round(total_words / 140, 1))
