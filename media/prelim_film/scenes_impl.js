// Status quo in Saudi Arabia, when EEF wins, and the implementation section (actors, contracts, prices, steps).

function xMark(p, x, y, r = 14, col = C.maroon) {
  E('circle', { cx: x, cy: y, r, fill: col }, p);
  E('path', { d: `M${x - r * .4},${y - r * .4} L${x + r * .4},${y + r * .4} M${x + r * .4},${y - r * .4} L${x - r * .4},${y + r * .4}`, stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }, p);
}
function okMark(p, x, y, r = 14, col = C.maroon) {
  E('circle', { cx: x, cy: y, r, fill: col }, p);
  E('path', { d: `M${x - r * .45},${y + r * .02} L${x - r * .1},${y + r * .38} L${x + r * .5},${y - r * .35}`, fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
}

// ------------------------------------------------------------ problem: the Saudi status quo
function sToday(g, lt) {
  head(g, lt, 'THE STATUS QUO', 'How Saudi data centers are supplied today');
  source(g, lt, .5, 'KAPSARC (2025); Saudi Energy; SERA (2026); S&P Global Platts (2025)');
  const routes = [
    ['pylon', 'Grid supply — Saudi Energy', 'Tariff: US$48/MWh for cloud (18 halalas/kWh); industrial US$53 → 61 from 2027'],
    ['shield', 'Backup — UPS + on-site generators', 'Typically diesel; Tier III needed for CST’s “Advanced” class'],
    ['doc', 'Green claims — annual I-RECs', 'Issued in Saudi Arabia since 2024: they match the year, not the hour'],
    ['pv', 'On-site PV — self-consumption', 'Up to 50 MW, same premises only (SERA, Nov 2026)'],
    ['node', 'Utility PV — only via the single buyer', 'SPPC signs NREP PPAs at US$11–17/MWh; no wheeling to consumers'],
  ];
  const probs = [
    'Night supply is gas and oil (58% / 41% of generation, 2022)',
    'Backup adds fuel and cost — not clean supply',
    'Clean on paper: only 40.4% matched hour by hour',
    'Too small: 100 MW needs ≈ 477 MWp of PV',
    'Other loads’ flexibility (7.1–29.9 GW) is never used for a buyer',
  ];
  const hg = inG(g, lt, .4, .6, 0);
  T(hg, 80, 286, 16, 'TODAY’S ROUTES', { w: 700, c: C.muted, ls: 3 });
  T(hg, 1080, 286, 16, 'WHAT IT MEANS', { w: 700, c: C.maroon, ls: 3 });
  routes.forEach(([ik, t1, t2], i) => {
    const y = 304 + i * 124, at = .8 + i * 1.6;
    const rg = inG(g, lt, at, .7, 0, -30);
    card(rg, 80, y, 900, 108, { flat: true });
    E('circle', { cx: 136, cy: y + 54, r: 34, fill: C.faint }, rg);
    ico(rg, ik, 136, y + 54, .44, C.ink2, 5);
    T(rg, 190, y + 46, 22, t1, { w: 700 });
    T(rg, 190, y + 78, 17, t2, { c: C.muted });
    const au = P(lt, at + .5, .5, eIO);
    if (au > 0) { E('line', { x1: 990, x2: 990 + 60 * au, y1: y + 54, y2: y + 54, stroke: C.maroon, 'stroke-width': 3 }, g); if (au >= 1) arrowHead(g, 1056, y + 54, 0, 12); }
    const pg = inG(g, lt, at + .8, .6, 0, 24);
    E('rect', { x: 1080, y: y + 10, width: 760, height: 88, rx: 12, fill: C.maroonT }, pg);
    xMark(pg, 1118, y + 54, 15);
    TP(pg, 1148, y + 50, 20, probs[i], 670, { w: 600, c: C.maroon, lh: 26 });
  });
  cap(g, lt, 10.0, 'Grid-grade reliability is solved — hourly clean supply is not.', { y: 972 });
}

// ------------------------------------------------------------ results: when does EEF win?
function sWhenBest(g, lt) {
  head(g, lt, 'WHEN DOES EEF WIN?', 'Five conditions — the first four met in Riyadh and at NEOM');
  const conds = [
    ['Grid-grade reliability is required', 'the data center stays on the grid', 'always'],
    ['Displacement target 85–97%', 'summer evenings ≥ 93% freed · ceiling ≈ 98% with PV × 1.25', '≈ 90%'],
    ['Flexibility costs less than storage', '< ≈ US$87 per MWh shifted · < ≈ US$215 per kW-year', 'US$25–75'],
    ['Data center of ≈ 8 MW or more', 'or smaller sites grouped in one contract; flexible load anywhere on the grid', '8 MW+'],
    ['Grid room and hourly claims are valued', 'reinforcement + carbon, or a PV price ≈ US$33/MWh; hourly credits', 'needed'],
  ];
  conds.forEach(([t1, t2, v], i) => {
    const y = 290 + i * 122, at = .8 + i * 1.3, cg = inG(g, lt, at, .7, 0, -30);
    card(cg, 80, y, 1080, 106);
    const ok = P(lt, at + .5, .5, eBack);
    if (ok > 0) { const og = G(cg, { transform: `translate(${140} ${y + 53}) scale(${Math.max(.01, ok).toFixed(3)})` }); okMark(og, 0, 0, 26, i === 4 ? C.maroonL : C.maroon); }
    T(cg, 190, y + 46, 23, t1, { w: 700 });
    T(cg, 190, y + 80, 18, t2, { c: C.muted });
    pill(cg, 1140 - tw(v, 18, 700) - 32, y + 53, v, { s: 18, w: 700, fill: i === 4 ? C.faint : C.maroonT, c: i === 4 ? C.ink2 : C.maroon });
  });
  const rg = inG(g, lt, 7.6, .8, 0, 30);
  card(rg, 1240, 290, 600, 600, { fill: C.paper });
  T(rg, 1272, 336, 16, 'EEF IS NOT THE BEST WHEN…', { w: 800, c: C.bess, ls: 3 });
  [['a site below ≈ 8 MW stands alone', '→ group it with others in one EEF contract'],
    ['batteries fall below ≈ US$100/kWh', '→ the break-even drops to ≈ US$42/MWh'],
    ['neither grid room nor carbon is valued', '→ on the bill alone, grid supply or AM is cheaper'],
    ['only annual claims matter', '→ annual matching is cheapest (but clean on paper only)']].forEach(([a, b], i) => {
    const y = 388 + i * 106;
    xMark(rg, 1282, y - 6, 12, C.bess);
    T(rg, 1306, y, 19, a, { w: 700 });
    TP(rg, 1306, y + 28, 16, b, 500, { c: C.ink2, lh: 22 });
  });
  E('rect', { x: 1262, y: 818, width: 556, height: 54, rx: 10, fill: C.maroonT }, rg);
  T(rg, 1540, 852, 17, 'Worst case = annual matching, same reliability', { a: 'middle', w: 700, c: C.maroon });
  cap(g, lt, 10.6, 'Outside these conditions the answer is grouping, a hybrid or plain supply — Chapter 5 draws the exact boundaries.', { y: 972 });
}

// ------------------------------------------------------------ implementation 1: actors
const ACTORS = [
  ['Ministry of Energy', 'Policy: NREP, 50% renewables by 2030', 'existing', 240, 322],
  ['SERA (regulator)', 'Licenses the aggregator; approves baselines, M&V and settlement', 'new rules', 960, 322],
  ['CST', 'Registers the data center and its sustainability plan', 'existing', 1680, 322],
  ['SPPC · Principal Buyer', 'Buys all PV output under the PPA', 'existing', 240, 600],
  ['Saudi Energy', 'Supplies the data center at tariff; meters and baseline data', 'existing', 1680, 600],
  ['National Grid SA', 'Connection; network check of EEF schedules', 'existing', 240, 856],
  ['Aggregator', 'Contracts and dispatches the flexible loads; carries delivery risk', 'new role', 720, 856],
  ['Flexible loads', 'Desalination, district cooling, pumping, industry', 'existing', 1200, 856],
  ['Hourly registry', 'PV certificates to the loads, freed-supply credits to the DC', 'new product', 1680, 856],
];
function sActors(g, lt) {
  head(g, lt, 'IMPLEMENTATION IN SAUDI ARABIA', 'Who is responsible for what');
  const hx = 960, hy = 600;
  ACTORS.forEach(([nm, role, tag, x, y], i) => {
    const at = 1.0 + i * .7;
    drawP(g, `M${hx},${hy} L${x},${y}`, P(lt, at - .3, .6, eIO), { stroke: tag === 'existing' ? C.rule : C.maroonL, 'stroke-width': 2.5, 'stroke-dasharray': tag === 'existing' ? null : '6 5' });
    const cg = inG(g, lt, at, .6, 16);
    const isNew = tag !== 'existing';
    E('rect', { x: x - 165, y: y - 62, width: 330, height: 124, rx: 14, fill: isNew ? C.maroonT : C.paper, stroke: isNew ? C.maroon : C.rule, 'stroke-width': isNew ? 2.5 : 1.5, filter: 'url(#sh)' }, cg);
    T(cg, x - 140, y - 22, 20, nm, { w: 800, c: isNew ? C.maroon : C.ink });
    TP(cg, x - 140, y + 6, 15, role, 280, { c: C.ink2, lh: 20 });
    const tw2 = tw(tag.toUpperCase(), 11, 800) + 18;
    E('rect', { x: x + 165 - tw2 - 12, y: y - 52, width: tw2, height: 20, rx: 10, fill: isNew ? C.maroon : C.faint }, cg);
    T(cg, x + 165 - 12 - tw2 / 2, y - 38, 11, tag.toUpperCase(), { a: 'middle', w: 800, c: isNew ? '#fff' : C.muted, ls: 1 });
  });
  const hgp = popG(g, lt, .5, hx, hy, .6);
  E('circle', { r: 78, fill: 'url(#gGlow)' }, hgp);
  E('circle', { r: 62, fill: C.maroon }, hgp);
  T(hgp, 0, 10, 30, 'EEF', { a: 'middle', w: 800, c: '#fff' });
  cap(g, lt, 8.4, 'Most actors exist today — EEF needs one new licence, one rulebook and an hourly registry.', { y: 972 });
}

// ------------------------------------------------------------ implementation 2: contracts
function sContracts(g, lt) {
  head(g, lt, 'IMPLEMENTATION · CONTRACTS', 'Six contracts — the data center’s supply never changes');
  const N = { pv: [190, 340, 'PV developer'], sppc: [560, 340, 'SPPC'], ngsa: [940, 340, 'National Grid SA'], dc: [190, 600, 'Data center'],
    agg: [600, 600, 'Aggregator'], fl: [1000, 600, 'Flexible loads'], se: [190, 860, 'Saudi Energy'], reg: [790, 860, 'Hourly registry'] };
  const edges = [
    ['C1', 'dc', 'se', 'supply at tariff', 1.0], ['C2', 'pv', 'sppc', 'PV PPA', 2.6], ['C3', 'dc', 'agg', 'EEF service', 4.2],
    ['C4', 'agg', 'fl', 'flexibility', 5.8], ['C5', 'agg', 'ngsa', 'dispatch & settlement', 7.4], ['C6', 'reg', 'agg', 'hourly credits', 9.0],
  ];
  edges.forEach(([id, a, b, lab, at]) => {
    const [x1, y1] = N[a], [x2, y2] = N[b], u = P(lt, at, .8, eIO);
    drawP(g, `M${x1},${y1} L${x2},${y2}`, u, { stroke: C.maroon, 'stroke-width': 3 });
    if (id === 'C6') drawP(g, `M${N.reg[0]},${N.reg[1]} L${N.dc[0]},${N.dc[1]}`, u, { stroke: C.maroon, 'stroke-width': 3, 'stroke-dasharray': '6 5' });
    const lg = inG(g, lt, at + .6, .5, 0);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, txt = `${id} · ${lab}`, w = tw(txt, 15, 700) + 24;
    E('rect', { x: mx - w / 2, y: my - 15, width: w, height: 30, rx: 15, fill: C.maroon }, lg);
    T(lg, mx, my + 5, 15, txt, { a: 'middle', w: 700, c: '#fff' });
  });
  Object.entries(N).forEach(([k, [x, y, nm]], i) => {
    const ng = inG(g, lt, .4 + i * .12, .6, 10);
    E('rect', { x: x - 110, y: y - 34, width: 220, height: 68, rx: 14, fill: k === 'dc' ? C.dc : k === 'agg' ? C.maroon : C.paper, stroke: C.rule, 'stroke-width': 1.5, filter: 'url(#sh)' }, ng);
    T(ng, x, y + 7, 19, nm, { a: 'middle', w: 800, c: k === 'dc' || k === 'agg' ? '#fff' : C.ink });
  });
  const terms = [
    ['C1', 'Supply agreement', 'DC ↔ Saudi Energy', '100% of use at the regulated tariff; firm supply — unchanged by EEF'],
    ['C2', 'PV purchase agreement', 'PV developer ↔ SPPC', 'PV ≈ annual use; ≈ US$11–17/MWh; attributes to the registry'],
    ['C3', 'EEF service agreement', 'DC ↔ aggregator', 'Pᶠ and a 24-h window; capacity + energy fee below break-even; no right to curtail the DC'],
    ['C4', 'Flexibility agreements', 'aggregator ↔ each load', 'baseline, limits, notice, payment share; water-security override'],
    ['C5', 'Dispatch & settlement', 'aggregator ↔ National Grid SA', 'day-ahead schedule, network check, intraday update, monthly settlement'],
    ['C6', 'Registry & claims', 'DC, loads ↔ registry', 'PV certificates to the loads; hourly credits to the DC; no double counting'],
  ];
  terms.forEach(([id, t1, who, t3], i) => {
    const y = 286 + i * 106, at = [1.0, 2.6, 4.2, 5.8, 7.4, 9.0][i] + .4, on = lt >= at;
    const tg = inG(g, lt, at, .6, 0, 30);
    E('rect', { x: 1190, y, width: 650, height: 94, rx: 12, fill: on ? C.paper : C.bg, stroke: on ? C.maroonL : C.rule, 'stroke-width': 1.5 }, tg);
    T(tg, 1212, y + 32, 18, id, { f: F.slab, w: 700, c: C.maroon });
    T(tg, 1258, y + 32, 18, t1, { w: 800 });
    T(tg, 1258 + tw(t1, 18, 800) + 12, y + 32, 14, who, { c: C.muted, it: true });
    TP(tg, 1212, y + 60, 15, t3, 610, { c: C.ink2, lh: 20 });
  });
}

// ------------------------------------------------------------ implementation 3: prices and money flows
function sMoney(g, lt) {
  head(g, lt, 'IMPLEMENTATION · PRICES', 'Who pays whom — per 100 MW at 80% displacement');
  const N = { se: [180, 330, 'Saudi Energy', C.grid], dc: [180, 590, 'Data center', C.dc], agg: [640, 590, 'Aggregator', C.maroon],
    fl: [640, 850, 'Flexible loads', C.maroon2], reg: [180, 850, 'Hourly registry', C.maroonL], sppc: [1000, 330, 'SPPC', C.grid], pv: [1000, 590, 'PV developer', C.sunD] };
  const flows = [
    ['dc', 'se', ['tariff ≈ US$42.0 M/yr', 'unchanged'], C.am, 14, 1.0],
    ['dc', 'agg', ['EEF fee ≈ US$17.3 M/yr', 'at US$50/MWh shifted'], C.maroon, 9, 2.4],
    ['agg', 'fl', ['payments − margin', ''], C.maroonL, 7, 3.8],
    ['sppc', 'pv', ['PPA ≈ US$9.6–14.9 M/yr', ''], C.sun, 7, 5.2],
    ['reg', 'dc', ['hourly credits', '≈ 701 GWh/yr'], C.maroon, 4, 6.6],
  ];
  flows.forEach(([a, b, [l1, l2], col, w, at]) => {
    const [x1, y1] = N[a], [x2, y2] = N[b];
    const e = drawP(g, `M${x1},${y1} L${x2},${y2}`, P(lt, at, .9, eIO), { stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', opacity: .55 });
    if (lt > at + .9) particles(g, e, lt, 4, 110, col, Math.max(4, w * .45), .95);
    const lg = inG(g, lt, at + .6, .5, 0);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, horiz = Math.abs(y2 - y1) < 5, ink = col === C.am ? C.grid : col === C.sun ? C.sunD : col;
    if (horiz) { T(lg, mx, my - 46, 16, l1, { a: 'middle', w: 700, c: ink }); if (l2) T(lg, mx, my - 26, 14, l2, { a: 'middle', c: ink, it: true }); }
    else { T(lg, mx + 22, my - 4, 16, l1, { w: 700, c: ink }); if (l2) T(lg, mx + 22, my + 16, 14, l2, { c: ink, it: true }); }
  });
  Object.entries(N).forEach(([k, [x, y, nm, col]], i) => {
    const ng = inG(g, lt, .4 + i * .1, .6, 10);
    E('rect', { x: x - 105, y: y - 32, width: 210, height: 64, rx: 14, fill: col, filter: 'url(#sh)' }, ng);
    T(ng, x, y + 7, 18, nm, { a: 'middle', w: 800, c: '#fff' });
  });
  const ng2 = inG(g, lt, 7.4, .6, 0);
  TP(ng2, 780, 836, 15, 'Loads move consumption, they do not add it — their energy bill is unchanged.', 330, { it: true, c: C.muted, lh: 20 });
  // price per kWh of the data center
  const x0 = 1260, bw = 120, base = 820, s = 4.875;
  const rg = inG(g, lt, 8.0, .7, 0, 30);
  card(rg, 1220, 286, 620, 640, { flat: true });
  T(rg, 1250, 330, 16, 'WHAT THE DATA CENTER PAYS (US$/MWh)', { w: 800, c: C.maroon, ls: 2 });
  const bars = [['Grid only', 48, 0, C.am], ['Battery', 48, 34.4, C.bess], ['EEF', 48, 19.8, C.maroon]];
  bars.forEach(([nm, t, extra, col], i) => {
    const x = x0 + 40 + i * 180, u = P(lt, 8.4 + i * .5, .9, eIO);
    E('rect', { x, y: base - t * s * u, width: bw, height: t * s * u, fill: C.am, opacity: .55 }, g);
    if (extra > 0) E('rect', { x, y: base - (t + extra * u) * s, width: bw, height: extra * s * u, fill: col }, g);
    const lg = inG(g, lt, 8.9 + i * .5, .5, 0);
    T(lg, x + bw / 2, base - (t + extra) * s - 14, 22, fmt(t + extra, 1), { a: 'middle', f: F.slab, w: 700, c: extra ? col : C.grid });
    T(lg, x + bw / 2, base + 30, 17, nm, { a: 'middle', w: 700, c: extra ? col : C.grid });
    if (extra) T(lg, x + bw / 2, base - t * s - extra * s / 2 + 6, 15, `+${fmt(extra, 1)}`, { a: 'middle', w: 800, c: '#fff' });
  });
  const tl = inG(g, lt, 9.2, .5, 0);
  T(tl, x0 + 40 + bw / 2, base - 48 * s / 2, 14, 'tariff 48', { a: 'middle', c: C.ink2, w: 700 });
  const nt = inG(g, lt, 10.4, .6, 0);
  TP(nt, 1250, 882, 14, 'Annual equivalents over a 25-year horizon (PV life); battery: 15-year life at 8%. Ceiling for EEF: ≈ US$87/MWh shifted or ≈ US$215/kW-yr.', 560, { c: C.muted, it: true, lh: 19 });
  cap(g, lt, 11.4, 'The data center keeps paying its US$48/MWh tariff; EEF adds ≈ US$20/MWh where storage adds ≈ US$34.', { y: 976 });
}

// ------------------------------------------------------------ implementation 4: steps and regulatory asks
function sImplSteps(g, lt) {
  head(g, lt, 'IMPLEMENTATION · STEPS', 'From the first contract to the first hourly credit');
  const steps = [
    ['Register & connect', 'CST registration; connection via National Grid SA / Saudi Energy (C1)'],
    ['Size and sponsor PV', '≈ annual use; PPA with SPPC (C2)'],
    ['Build the portfolio', '≈ 1.4 MW per MW of DC, shiftable ≥ 8 h, same grid region'],
    ['Agree baselines and M&V', 'interval meters; SERA-approved rules'],
    ['Sign C3 and C4', 'price below break-even; water-security override'],
    ['Operate', 'day-ahead → network check (C5) → intraday MPC → settlement'],
    ['Report', 'hourly credits (C6); CST sustainability plan; Scope 2'],
  ];
  const lu = P(lt, .6, 6.0, eIO);
  E('line', { x1: 130, x2: 130, y1: 300, y2: 300 + 560 * lu, stroke: C.maroon, 'stroke-width': 3 }, g);
  steps.forEach(([t1, t2], i) => {
    const y = 300 + i * 92, at = .6 + i * .85, sg = inG(g, lt, at, .6, 0, -24);
    E('circle', { cx: 130, cy: y + 10, r: 22, fill: C.maroon, stroke: C.bg, 'stroke-width': 4 }, sg);
    T(sg, 130, y + 18, 20, String(i + 1), { a: 'middle', f: F.slab, w: 700, c: '#fff' });
    T(sg, 176, y + 10, 23, t1, { w: 800 });
    T(sg, 176, y + 40, 18, t2, { c: C.muted });
  });
  const rg = inG(g, lt, 6.6, .8, 0, 30);
  E('rect', { x: 1180, y: 290, width: 660, height: 600, rx: 16, fill: C.maroon, filter: 'url(#sh)' }, rg);
  T(rg, 1214, 340, 16, 'WHAT SERA NEEDS TO ADD', { w: 800, c: '#fff', ls: 3, op: .85 });
  [['Aggregator licence', 'precedent: Abu Dhabi licensed aggregators in Nov 2026 after a 401-MW pilot'],
    ['Baseline & M&V standard', 'how load shifts are measured and verified'],
    ['Hourly certificates', 'time-stamped credits, an hourly extension of today’s I-RECs'],
    ['Crediting rule', 'freed supply credited to a named consumer against equal PV absorption — net billing already matches energy within a metering period']].forEach(([a, b], i) => {
    const y = 400 + i * 116;
    okMark(rg, 1228, y - 6, 13, 'rgba(255,255,255,.25)');
    T(rg, 1256, y, 22, a, { w: 800, c: '#fff' });
    TP(rg, 1256, y + 30, 17, b, 540, { c: '#fff', op: .85, lh: 23 });
  });
  cap(g, lt, 8.0, 'Everything else already exists — the single buyer, the supplier, the grid operator and the loads.', { y: 972 });
}
