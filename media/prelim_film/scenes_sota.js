// State of the art, research questions and objectives.

// ------------------------------------------------------------ review method
function sReview(g, lt) {
  head(g, lt, 'LITERATURE REVIEW', 'A structured search, screened to the closest evidence');
  const steps = [[1365, 'records from database searches', 1000], [1217, 'unique records', 900], [85, 'kept after title & abstract screening', 680], [45, 'examined in full text', 470]];
  steps.forEach(([n, lab, w], i) => {
    const y = 290 + i * 96, u = P(lt, .6 + i * .9, .9, eIO), cx = 630;
    if (u <= 0) return;
    const col = [C.maroonL, C.maroon2, C.maroon, C.maroonD][i];
    E('rect', { x: cx - w * u / 2, y, width: w * u, height: 80, rx: 10, fill: col }, g);
    const tg = inG(g, lt, 1.0 + i * .9, .5, 0);
    const pre = i >= 2 ? '≈ ' : '';
    const nw = tw(pre + fmt(n), 36, 700, F.slab), lw = tw(lab, 22, 600);
    const x0 = cx - (nw + 18 + lw) / 2;
    T(tg, x0, y + 52, 36, pre + fmt(n), { f: F.slab, w: 700, c: '#fff' });
    T(tg, x0 + nw + 18, y + 49, 22, lab, { w: 600, c: '#fff', op: .92 });
  });
  const fu = P(lt, 4.4, .8);
  if (fu > 0) {
    drawP(g, 'M630,672 V706', fu, { stroke: C.maroon, 'stroke-width': 3 });
    if (fu >= 1) arrowHead(g, 630, 712, Math.PI / 2, 12);
  }
  const rg = popG(g, lt, 4.9, 630, 796, .7);
  E('circle', { r: 72, fill: C.maroon }, rg);
  T(rg, 0, 20, 60, '53', { a: 'middle', f: F.slab, w: 700, c: '#fff' });
  const rl = inG(g, lt, 5.3, .7, 0, -16);
  T(rl, 726, 786, 26, 'references cited', { w: 700 });
  T(rl, 726, 820, 20, 'peer-reviewed studies plus key reports', { c: C.muted });
  const db = inG(g, lt, 1.2, .8, 14);
  T(db, 1260, 320, 17, 'DATABASES', { w: 700, c: C.muted, ls: 3 });
  ['Crossref — IEEE, Elsevier, Springer, ACM, IOP, MDPI', 'IEEE Xplore', 'Semantic Scholar', 'arXiv'].forEach((s, i) => pill(db, 1260, 366 + i * 56, s, { s: 18, fill: C.paper, stroke: C.rule, c: C.ink }));
  const gl = inG(g, lt, 2.6, .8, 14);
  T(gl, 1260, 618, 17, 'REPORTS & STANDARDS', { w: 700, c: C.muted, ls: 3 });
  ['IEA', 'LBNL', 'KAPSARC', 'GHG Protocol', 'EnergyTag'].forEach((s, i) => pill(gl, 1260 + [0, 80, 172, 316, 492][i], 664, s, { s: 18 }));
  const yr = inG(g, lt, 6.2, .8, 10);
  E('rect', { x: 1260, y: 730, width: 6, height: 96, fill: C.maroon }, yr);
  T(yr, 1286, 770, 44, '> 50%', { f: F.slab, w: 700, c: C.maroon });
  T(yr, 1286, 810, 21, 'of the cited work was published 2024–2026', { c: C.ink2 });
  cap(g, lt, 7.4, 'AI data centers became a power-system problem only recently — most of the evidence is new.');
}

// ------------------------------------------------------------ three streams (Venn)
function sVenn(g, lt) {
  head(g, lt, 'STATE OF THE ART', 'Three streams of research — and an empty middle');
  const r = 215;
  const circ = [
    { cx: 790, cy: 470, col: C.maroon, at: .7, t: ['Internal', 'data-center', 'flexibility'], tx: 715, ty: 420 },
    { cx: 1130, cy: 470, col: C.bess, at: 4.0, t: ['Hourly', 'clean', 'matching'], tx: 1205, ty: 420 },
    { cx: 960, cy: 725, col: C.grid, at: 7.3, t: ['Grid demand', 'flexibility'], tx: 960, ty: 830 },
  ];
  circ.forEach(c => {
    const u = P(lt, c.at, 1.4, eIO);
    if (u <= 0) return;
    E('circle', { cx: c.cx, cy: c.cy, r, fill: c.col, opacity: (.10 * u).toFixed(3) }, g);
    drawP(g, `M${c.cx},${c.cy - r} A${r},${r} 0 1 1 ${c.cx - .01},${c.cy - r}`, u, { stroke: c.col, 'stroke-width': 3 });
    const tg = inG(g, lt, c.at + .6, .6, 0);
    c.t.forEach((l, i) => T(tg, c.tx, c.ty + i * 30, 24, l, { a: 'middle', w: 800, c: c.col }));
  });
  const panels = [
    { x: 80, y: 300, at: 1.3, col: C.maroon, k: 'STREAM 1', refs: ['Liu et al. 2013  ·  Kwon et al. 2019', 'Chen et al. 2020, 2021', 'Riepin et al. 2025  ·  Li et al. 2026'], lim: 'Flexibility from inside the data center — AI loads have ~6% to give.' },
    { x: 1390, y: 300, at: 4.6, col: C.bess, k: 'STREAM 2', refs: ['Xu et al. 2024  ·  Bjørn et al. 2022', 'Riepin & Brown 2024  ·  Ludkovski 2024', 'Hwang et al. 2026  ·  Lee et al. 2026'], lim: 'Generation + storage portfolios — costs escalate near 100%.' },
    { x: 80, y: 700, at: 7.9, col: C.grid, k: 'STREAM 3', refs: ['Paterakis et al. 2017  ·  Alshehri 2023', 'Wu et al. 2024  ·  Fei et al. 2026', 'KAPSARC 2026'], lim: 'Bought by system operators for system services — never for a buyer’s supply.' },
  ];
  panels.forEach(p => {
    const pg = inG(g, lt, p.at, .7, 12);
    T(pg, p.x, p.y, 16, p.k, { w: 700, c: p.col, ls: 3 });
    p.refs.forEach((l, i) => T(pg, p.x, p.y + 34 + i * 28, 19, l, { c: C.ink2 }));
    TP(pg, p.x, p.y + 34 + p.refs.length * 28 + 14, 20, p.lim, 440, { it: true, w: 600, c: p.col });
  });
  // the empty middle
  const cx = 960, cy = 556;
  if (lt > 10.6) {
    const pulse = .5 + .5 * Math.sin((lt - 10.6) * 4);
    const fillU = P(lt, 13.2, .7, eBack);
    const qg = G(g, { opacity: P(lt, 10.6, .6).toFixed(3) });
    if (fillU <= 0) {
      E('circle', { cx, cy, r: 44 + 4 * pulse, fill: C.bg, stroke: C.maroon, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, qg);
      T(qg, cx, cy + 15, 42, '?', { a: 'middle', f: F.slab, w: 700, c: C.maroon });
    } else {
      E('circle', { cx, cy, r: 70, fill: 'url(#gGlow)', opacity: .8 }, qg);
      E('circle', { cx, cy, r: 46 * Math.max(.01, fillU), fill: C.maroon }, qg);
      T(qg, cx, cy + 9, 26, 'EEF', { a: 'middle', w: 800, c: '#fff', op: clamp(fillU) });
    }
  }
  const cg = inG(g, lt, 14.0, .8, 12);
  E('line', { x1: 1008, y1: 580, x2: 1385, y2: 742, stroke: C.maroon, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, cg);
  T(cg, 1390, 716, 16, 'THIS WORK', { w: 700, c: C.maroon, ls: 3 });
  TP(cg, 1390, 752, 22, 'Other loads’ flexibility, contracted for a data center’s hourly clean supply', 450, { w: 700, c: C.maroon });
  cap(g, lt, 15.4, 'Each stream solves part of the problem; none uses other loads to supply a data center, hour by hour.');
}

// ------------------------------------------------------------ closest study
function sClosest(g, lt) {
  head(g, lt, 'CLOSEST STUDY', 'Yang et al. (2026) and this work: five differences');
  const hg = inG(g, lt, .5, .7, 10);
  T(hg, 360, 318, 18, 'YANG ET AL., APPLIED ENERGY 2026', { w: 700, c: C.muted, ls: 2 });
  T(hg, 360, 344, 18, 'data center + desalination plant', { c: C.muted });
  T(hg, 1060, 318, 18, 'THIS WORK — EXTERNAL ENERGY FLEXIBILITY', { w: 700, c: C.maroon, ls: 2 });
  T(hg, 1060, 344, 18, 'inflexible data center + existing grid loads', { c: C.maroon });
  E('line', { x1: 80, x2: 1840, y1: 366, y2: 366, stroke: C.rule, 'stroke-width': 2 }, hg);
  const rows = [
    ['DATA CENTER', 'Flexible — workload scheduling', 'Inflexible, constant AI load'],
    ['PARTNER LOADS', 'One co-located, co-planned plant', 'A portfolio of existing grid-connected loads'],
    ['COUPLING', 'Physical — waste heat preheats seawater', 'Contractual — through the grid and an aggregator'],
    ['OBJECTIVE', 'Minimize annualized cost', 'Hourly clean matching + reliability + cost'],
    ['SCOPE', 'One integrated site', 'Benchmarked vs. GRID, AM, RE+BESS; saturation limits'],
  ];
  rows.forEach(([lab, a, b], i) => {
    const y = 420 + i * 100, at = 1.2 + i * 1.6;
    const rg = inG(g, lt, at, .7, 0, -30);
    if (i % 2 === 0) E('rect', { x: 80, y: y - 40, width: 1760, height: 92, fill: C.faint, opacity: .55, rx: 8 }, rg);
    T(rg, 104, y + 13, 17, lab, { w: 700, c: C.muted, ls: 2 });
    T(rg, 360, y + 14, 25, a, { c: C.ink2 });
    const ag = inG(g, lt, at + .4, .6, 0, -20);
    E('line', { x1: 960, x2: 1020, y1: y + 6, y2: y + 6, stroke: C.maroon, 'stroke-width': 3 }, ag);
    arrowHead(ag, 1030, y + 6, 0, 13);
    T(ag, 1060, y + 14, 25, b, { w: 700, c: C.maroon });
  });
  cap(g, lt, 10.2, 'Closest in spirit — but it relies on a flexible data center and one physically coupled plant.');
}

// ------------------------------------------------------------ positioning grid -> the gap
function sGap(g, lt) {
  head(g, lt, 'RESEARCH GAP', 'One cell of the map is empty');
  const cols = [['Inside the data center', '(workloads, UPS)'], ['Buyer’s supply assets', '(PPAs, PV, storage)'], ['Other loads on the grid', '']];
  const rows = [['Buyer’s hourly', 'clean supply', '(24/7 matching)'], ['System services', 'and cost', '']];
  const cx = c => 520 + c * 450, ry = r => 370 + r * 250, cw = 430, ch = 230;
  const ax = inG(g, lt, .4, .7, 0);
  T(ax, 520, 272, 16, 'SOURCE OF FLEXIBILITY  →', { w: 700, c: C.muted, ls: 3 });
  T(ax, 80, 272, 16, 'PURPOSE  ↓', { w: 700, c: C.muted, ls: 3 });
  cols.forEach(([a, b], c) => { T(ax, cx(c) + cw / 2, 318, 21, a, { a: 'middle', w: 700 }); if (b) T(ax, cx(c) + cw / 2, 345, 18, b, { a: 'middle', c: C.muted }); });
  rows.forEach((ls, r) => ls.forEach((l, i) => l && T(ax, 80, ry(r) + 96 + i * 30, i < 2 ? 22 : 18, l, { w: i < 2 ? 700 : 400, c: i < 2 ? C.ink : C.muted })));
  const cells = [
    [0, 0, 'DC load shifting for 24/7 matching', 'Riepin et al. 2025 · Li et al. 2026', 1.0],
    [0, 1, 'Procurement with generation + storage', 'Xu 2024 · Riepin & Brown 2024 · Hwang 2026 · Lee 2026', 1.6],
    [1, 0, 'Data-center demand response, peak shaving', 'Liu 2013 · Kwon 2019 · Chen 2020 · Khanal 2026', 2.2],
    [1, 1, 'Renewable + storage sizing, colocation', 'e.g., Yang et al. 2026', 2.8],
    [1, 2, 'Demand response bought by system operators', 'Paterakis 2017 · Wu 2024 · Alshehri 2023 · KAPSARC 2026', 3.4],
  ];
  cells.forEach(([r, c, t1, t2, at]) => {
    const cg = inG(g, lt, at, .6, 14);
    E('rect', { x: cx(c), y: ry(r), width: cw, height: ch, rx: 12, fill: C.paper, stroke: C.rule, 'stroke-width': 1.5 }, cg);
    let yy = ry(r) + 70;
    wrap(t1, 23, cw - 60, 700).forEach(l => { T(cg, cx(c) + cw / 2, yy, 23, l, { a: 'middle', w: 700 }); yy += 31; });
    yy += 8;
    wrap(t2, 18, cw - 60).forEach(l => { T(cg, cx(c) + cw / 2, yy, 18, l, { a: 'middle', c: C.muted }); yy += 25; });
  });
  const x = cx(2), y = ry(0), fu = P(lt, 5.4, .7, eBack);
  if (lt > 1) {
    const pulse = .5 + .5 * Math.sin((lt - 1) * 4);
    E('rect', { x, y, width: cw, height: ch, rx: 12, fill: 'none', stroke: C.maroon, 'stroke-width': 2.5, 'stroke-dasharray': '9 7', opacity: (.45 + .45 * pulse).toFixed(3) }, g);
  }
  if (fu > 0) {
    const s = Math.max(.01, fu);
    const eg = G(g, { transform: `translate(${x + cw / 2} ${y + ch / 2}) scale(${s.toFixed(4)})` });
    E('rect', { x: -cw / 2, y: -ch / 2, width: cw, height: ch, rx: 12, fill: C.maroon, filter: 'url(#sh)' }, eg);
    T(eg, 0, -24, 30, 'External Energy', { a: 'middle', f: F.slab, w: 700, c: '#fff' });
    T(eg, 0, 14, 30, 'Flexibility', { a: 'middle', f: F.slab, w: 700, c: '#fff' });
    T(eg, 0, 58, 18, 'THIS WORK', { a: 'middle', w: 700, c: '#fff', ls: 4, op: .8 });
  }
  cap(g, lt, 6.6, 'No study gives an inflexible AI data center hourly clean supply by contracting existing external loads —\nevaluated together on reliability, emissions and cost.', { s: 25 });
}

// ------------------------------------------------------------ research questions
const RQS = [
  ['RQ1', 'Formulate & compare', 'How can EEF be formalized — actors, contract and hourly accounting — and how does it compare with GRID, RE+BESS and AM on reliability, cost and sustainability?', 'Chapter 3'],
  ['RQ2', 'Operate under uncertainty', 'How should EEF be controlled in operation, and how robust is its hourly matching to forecast errors and the limits of the flexible loads?', 'Chapter 4'],
  ['RQ3', 'When does EEF win?', 'Under what general conditions does EEF dominate, and what contractual framework enables it in single-buyer and liberalized markets?', 'Chapter 5'],
  ['RQ4', 'Where does it saturate?', 'At what scale of data-center capacity does external flexibility saturate, and what supply mix is best beyond that point?', 'Chapter 6'],
];
function sRQ(g, lt) {
  const k = inG(g, lt, .1, .7, 0); T(k, 80, 150, 18, 'RESEARCH QUESTIONS', { w: 700, c: C.maroon, ls: 4 });
  const mg = inG(g, lt, .4, 1, 20);
  E('rect', { x: 120, y: 190, width: 1680, height: 236, rx: 16, fill: C.maroon, filter: 'url(#sh)' }, mg);
  T(mg, 160, 240, 17, 'MAIN RESEARCH QUESTION', { w: 700, c: '#fff', ls: 4, op: .75 });
  TP(mg, 160, 296, 33, 'How can External Energy Flexibility enable a grid-connected, constant-load AI data center to achieve hourly clean-energy matching while maintaining reliability and minimizing cost, compared with conventional supply configurations?', 1600, { f: F.slab, w: 400, c: '#fff', lh: 46 });
  const bu = P(lt, 3.4, 1.0, eIO);
  if (bu > 0) {
    drawP(g, 'M960,426 V478', bu, { stroke: C.maroon, 'stroke-width': 3 });
    drawP(g, `M${960 - 675 * bu},478 H${960 + 675 * bu}`, 1, { stroke: C.maroon, 'stroke-width': 3 });
  }
  RQS.forEach(([id, ttl, q, ch], i) => {
    const x = 80 + i * 450, at = 4.0 + i * 2.4;
    const lu = P(lt, at - .2, .5);
    if (lu > 0) drawP(g, `M${x + 205},478 V${478 + 42 * lu}`, 1, { stroke: C.maroon, 'stroke-width': 3 });
    const cg = inG(g, lt, at, .8, 26);
    card(cg, x, 520, 410, 390);
    E('rect', { x, y: 520, width: 410, height: 8, fill: C.maroon, rx: 3 }, cg);
    T(cg, x + 30, 584, 40, id, { f: F.slab, w: 700, c: C.maroon });
    T(cg, x + 30, 626, 23, ttl, { w: 700 });
    TP(cg, x + 30, 666, 19, q, 352, { c: C.ink2, lh: 27 });
    pill(cg, x + 30, 874, '→ ' + ch, { s: 17 });
  });
  cap(g, lt, 14.5, 'Four sub-questions — one for each research chapter.', { y: 972 });
}

// ------------------------------------------------------------ objectives
const OBJS = [
  ['O1', 'Define EEF — actors, contract and the hourly accounting rule', 'RQ1'],
  ['O2', 'Build a planning model and compare EEF with GRID, RE+BESS and AM on three pillars', 'RQ1'],
  ['O3', 'Design operational control: day-ahead scheduling + intraday MPC under uncertainty', 'RQ2'],
  ['O4', 'Derive generalized decision maps and a contractual framework', 'RQ3'],
  ['O5', 'Quantify the saturation of external flexibility and the best mix beyond it', 'RQ4'],
];
function sObjectives(g, lt) {
  head(g, lt, 'OBJECTIVES', ['Develop and evaluate EEF — a framework in which an inflexible AI data', 'center contracts existing grid loads for hourly clean supply'], { size: 40 });
  OBJS.forEach(([id, txt, rq], i) => {
    const x = 80 + i * 356, w = 336, h = 250 + i * 50, top = 900 - h, at = 2.0 + i * 1.5;
    const u = P(lt, at, .9, eBack);
    if (u <= 0) return;
    const hh = h * clamp(u, 0, 1.05);
    E('rect', { x, y: 900 - hh, width: w, height: hh, rx: 12, fill: i === 4 ? C.maroonD : [C.maroonL, '#9A4D4D', C.maroon2, C.maroon][i] }, g);
    const tg = inG(g, lt, at + .5, .6, 10);
    T(tg, x + 26, top + 62, 44, id, { f: F.slab, w: 700, c: '#fff' });
    TP(tg, x + 26, top + 104, 21, txt, w - 52, { c: '#fff', w: 600, lh: 29 });
    pill(tg, x + 26, top + h - 34, rq, { s: 16, fill: 'rgba(255,255,255,.16)', stroke: 'rgba(255,255,255,.6)', c: '#fff' });
  });
  cap(g, lt, 10.6, 'Each objective builds on the one before it — from a definition to national-scale limits.', { y: 972 });
}
