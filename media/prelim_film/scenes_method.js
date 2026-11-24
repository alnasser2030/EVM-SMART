// Methodology: the concept in one day, accounting, control, the model, and the experimental design.

// ------------------------------------------------------------ the concept, animated over one day
const LOADS = [['desal', 'Desalination'], ['cool', 'District cooling + TES'], ['pump', 'Water pumping'], ['factory', 'Industry']];
function sConcept(g, lt) {
  const t0 = 2.5, t1 = 25;
  const hr = lt < t0 ? 6 : lt > t1 ? 30 : 6 + (lt - t0) * 24 / (t1 - t0);
  const h = hr % 24, pv = PV(h), day = clamp(pv / 60);
  const m = P(lt, 11.9, 1.0, eIO);             // reduction for the data center introduced at step 3
  const absorb = lt > 7.2 ? pv : pv * P(lt, 6.2, 1.0);
  const net = absorb - 100 * m;
  E('rect', { width: W, height: H, fill: '#16203a', opacity: (.07 * (1 - day)).toFixed(3) }, g);
  head(g, lt, 'THE CONCEPT', 'External Energy Flexibility — one day, step by step');

  // clock
  const cg = inG(g, lt, .4, .6, 0);
  const ccx = 1774, ccy = 196;
  E('circle', { cx: ccx, cy: ccy, r: 46, fill: C.paper, stroke: C.rule, 'stroke-width': 2 }, cg);
  for (let k = 0; k < 24; k++) { const a = k / 24 * 2 * Math.PI - Math.PI / 2, r1 = k % 6 ? 40 : 34; E('line', { x1: ccx + r1 * Math.cos(a), y1: ccy + r1 * Math.sin(a), x2: ccx + 44 * Math.cos(a), y2: ccy + 44 * Math.sin(a), stroke: C.muted, 'stroke-width': k % 6 ? 1 : 2.5 }, cg); }
  const ha = hr / 24 * 2 * Math.PI - Math.PI / 2;
  E('line', { x1: ccx, y1: ccy, x2: ccx + 34 * Math.cos(ha), y2: ccy + 34 * Math.sin(ha), stroke: C.maroon, 'stroke-width': 4, 'stroke-linecap': 'round' }, cg);
  E('circle', { cx: ccx, cy: ccy, r: 5, fill: C.maroon }, cg);
  T(cg, 1708, 208, 36, `${String(Math.floor(h)).padStart(2, '0')}:00`, { a: 'end', f: F.slab, w: 700, c: C.ink });
  T(cg, 1708, 236, 16, day > .5 ? 'DAYTIME' : 'NIGHT', { a: 'end', w: 700, c: day > .5 ? C.sunD : C.bess, ls: 3 });

  // grid bus and pylon
  const ng = inG(g, lt, .5, .7, 0);
  E('rect', { x: 470, y: 548, width: 990, height: 14, rx: 7, fill: C.grid }, ng);
  ico(ng, 'pylon', 1020, 476, .8, C.grid, 4);
  T(ng, 700, 530, 19, 'Saudi grid  ·  single buyer', { a: 'middle', w: 700, c: C.grid });
  // PV plant
  const pg = inG(g, lt, .7, .7, 12);
  ico(pg, 'sun', 250, 330, .62, C.sun, 3);
  pg.lastChild.setAttribute('opacity', (.25 + .75 * day).toFixed(3));
  ico(pg, 'pv', 250, 460, 1.15, C.sunD, 4);
  T(pg, 250, 536, 22, 'PV plant', { a: 'middle', w: 700 });
  T(pg, 250, 562, 17, '477 MWp · sized to annual use', { a: 'middle', c: C.muted });
  T(pg, 250, 600, 26, `${fmt(pv)} MW`, { a: 'middle', f: F.slab, w: 700, c: C.sunD });
  // data center
  const dg = inG(g, lt, .9, .7, 12);
  ico(dg, 'dc', 1700, 450, 1.1, C.dc, 4);
  T(dg, 1700, 536, 22, 'AI data center', { a: 'middle', w: 700 });
  T(dg, 1700, 562, 17, '100 MW · constant · always on the grid', { a: 'middle', c: C.muted });
  T(dg, 1700, 600, 26, '100 MW', { a: 'middle', f: F.slab, w: 700, c: C.dc });
  // flexible loads with baseline meters
  LOADS.forEach(([k, name], i) => {
    const x = 600 + i * 240, lg = inG(g, lt, 1.1 + i * .15, .7, 14);
    card(lg, x - 105, 670, 210, 236, { flat: true });
    ico(lg, k, x - 44, 736, .56, C.maroon, 4.5);
    wrap(name, 17, 190, 700).forEach((l, j) => T(lg, x, 846 + j * 22, 17, l, { a: 'middle', w: 700 }));
    const bx = x + 38, by = 760, v = net / 4 * 1.05;
    E('line', { x1: bx - 30, x2: bx + 30, y1: by, y2: by, stroke: C.ink2, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, lg);
    if (lt > 6) E('rect', { x: bx - 16, y: v > 0 ? by - v : by, width: 32, height: Math.abs(v), fill: v > 0 ? C.maroonL : C.maroon, rx: 2 }, lg);
    T(lg, bx, by + 46, 12, 'baseline', { a: 'middle', c: C.muted });
  });
  // aggregator and contract lines
  const ag = inG(g, lt, 1.6, .7, 12);
  ico(ag, 'node', 1700, 780, .78, C.maroon, 4);
  T(ag, 1700, 852, 21, 'Aggregator', { a: 'middle', w: 700 });
  T(ag, 1700, 878, 16, 'contract & dispatch', { a: 'middle', c: C.muted });
  E('path', { d: 'M1700,618 V740', stroke: C.maroon, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', fill: 'none' }, ag);
  E('path', { d: 'M1660,780 H1430', stroke: C.maroon, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', fill: 'none' }, ag);
  T(ag, 1712, 686, 15, 'contract', { c: C.maroon, it: true, w: 600 });

  // energy paths and particles
  const fg = G(g);
  const pPV = E('path', { d: 'M330,462 C410,462 420,555 476,555', fill: 'none', stroke: C.sunL, 'stroke-width': 6, opacity: (.4 + .6 * day).toFixed(3) }, fg);
  const pDC = E('path', { d: 'M1454,555 C1540,555 1560,462 1626,462', fill: 'none', stroke: m > .5 ? C.maroonT : C.faint, 'stroke-width': 6 }, fg);
  if (lt > 1.2) {
    if (pv > 2) particles(fg, pPV, lt, 7, 120, C.sun, 6, clamp(pv / 120));
    particles(fg, pDC, lt, 7, 120, m > .5 ? C.maroon : C.am, 6, 1);
  }
  LOADS.forEach((_, i) => {
    const x = 600 + i * 240;
    const pl = E('path', { d: `M${x},562 V668`, fill: 'none', stroke: C.faint, 'stroke-width': 5 }, fg);
    if (lt > 7.2 && absorb > 2) particles(fg, pl, lt + i * .3, 3, 80, C.sun, 5, clamp(absorb / 120));
  });
  const fl = inG(g, lt, 2.6, .6, 0);
  T(fl, 400, 440, 16, 'exported', { a: 'middle', c: C.sunD, w: 700, it: true });
  if (m > .5) { const cl = inG(g, lt, 12.6, .6, 0); T(cl, 1540, 610, 16, 'credited supply', { a: 'middle', c: C.maroon, w: 700, it: true }); }

  // readout
  const rg = inG(g, lt, 7.4, .7, 10);
  card(rg, 80, 670, 400, 236, { flat: true, fill: C.paper });
  T(rg, 104, 708, 15, 'FLEXIBLE LOADS VS. BASELINE', { w: 700, c: C.muted, ls: 2 });
  T(rg, 104, 754, 21, 'Absorb PV', { w: 600 });
  T(rg, 456, 754, 24, `+${fmt(absorb)} MW`, { a: 'end', f: F.slab, w: 700, c: C.sunD });
  const rr = G(rg, { opacity: m.toFixed(3) });
  T(rr, 104, 798, 21, 'Reduce for the DC', { w: 600 });
  T(rr, 456, 798, 24, `−${fmt(100 * m)} MW`, { a: 'end', f: F.slab, w: 700, c: C.maroon });
  E('line', { x1: 104, x2: 456, y1: 818, y2: 818, stroke: C.rule, 'stroke-width': 1.5 }, rr);
  T(rr, 104, 860, 23, 'Net', { w: 800 });
  T(rr, 456, 862, 30, `${net >= 0 ? '+' : '−'}${fmt(Math.abs(net))} MW`, { a: 'end', f: F.slab, w: 700, c: net >= 0 ? C.sunD : C.maroon });

  // step captions
  const steps = [
    [2.6, 7.2, '1', 'All PV output is exported to the grid — the data center never absorbs it.'],
    [7.2, 11.9, '2', 'Contracted flexible loads absorb all of it, raising their use above baseline.'],
    [11.9, 17.5, '3', 'In return, they cut their use below baseline by the data center’s load — every hour.'],
    [17.5, 25.2, '4', 'At night the loads stay 100 MW below baseline; the freed supply is credited to the data center.'],
  ];
  steps.forEach(([a, b, n, txt]) => {
    const sg = winG(g, lt, a, b, .45);
    const wTxt = tw(txt, 26, 400), x0 = 960 - (wTxt + 56) / 2;
    E('circle', { cx: x0 + 18, cy: 958, r: 18, fill: C.maroon }, sg);
    T(sg, x0 + 18, 965, 20, n, { a: 'middle', w: 800, c: '#fff' });
    T(sg, x0 + 56, 967, 26, txt, { c: C.ink });
  });
  const sum = inG(g, lt, 25.4, .7, 8);
  TR(sum, 960, 966, 26, [['Net on the loads: ', { w: 700 }], ['+(PV − L) at midday, −L at night', { c: C.maroon, w: 700 }], ['. The data center never changes — its reliability is the grid’s.', {}]], { a: 'middle' });
}

// ------------------------------------------------------------ hourly accounting rule
function sAccounting(g, lt) {
  head(g, lt, 'HOURLY ACCOUNTING', 'Who gets credit for what — every hour');
  const x0 = 140, x1 = 980, yb = 610, s = .82, X = h => x0 + (x1 - x0) * h / 24, Y = v => yb - v * s;
  const netf = h => PV(h) - 100;
  const ax = inG(g, lt, .4, .7, 0);
  card(ax, 80, 290, 960, 620, { flat: true });
  T(ax, 110, 334, 19, 'Flexible loads’ consumption vs. their baseline (one day, concept)', { w: 700, c: C.ink2 });
  for (const hh of [0, 6, 12, 18, 24]) T(ax, X(hh), 880, 16, `${String(hh).padStart(2, '0')}:00`, { a: 'middle', c: C.muted });
  const u = P(lt, 1.0, 2.2, eIO);
  if (u > 0) {
    const pts = sample(netf, 0, 24 * u, Math.max(2, Math.round(240 * u)));
    const up = pts.map(q => [q[0], Math.max(0, q[1])]), dn = pts.map(q => [q[0], Math.min(0, q[1])]);
    const area = arr => `M${X(arr[0][0])},${yb} ` + arr.map(q => `L${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(' ') + ` L${X(arr[arr.length - 1][0]).toFixed(1)},${yb} Z`;
    E('path', { d: area(up), fill: 'url(#hS)', stroke: 'none' }, g);
    E('path', { d: area(dn), fill: C.maroon, opacity: .85 }, g);
    E('path', { d: poly(pts.map(q => [X(q[0]), Y(q[1])])), fill: 'none', stroke: C.ink, 'stroke-width': 3 }, g);
  }
  E('line', { x1: x0, x2: x1, y1: yb, y2: yb, stroke: C.ink2, 'stroke-width': 2.5, 'stroke-dasharray': '8 6', opacity: P(lt, .6, .6).toFixed(3) }, g);
  const bl = inG(g, lt, .8, .6, 0); T(bl, x1, yb - 12, 16, 'baseline', { a: 'end', c: C.ink2, w: 700 });
  const l1 = inG(g, lt, 3.0, .6, 8);
  pill(l1, X(12.6), Y(262), '+ PV absorbed → credited to the loads', { a: 'middle', s: 17, fill: C.paper, stroke: C.sun, c: C.sunD });
  const l2 = inG(g, lt, 3.6, .6, 8);
  pill(l2, X(4), yb + 120, '− supply freed → credited to the DC', { a: 'middle', s: 17, fill: C.paper, stroke: C.maroon });
  const rules = [
    ['doc', 'PV output is credited to the loads that absorb it — never to the data center.'],
    ['check', 'The data center is credited with freed supply, up to its use, only if the same loads absorbed equal PV within the window.'],
    ['search', 'Interval metering against baselines; hourly certificates in a registry — no double counting.'],
  ];
  rules.forEach(([ik, txt], i) => {
    const y = 290 + i * 210, rg = inG(g, lt, 4.4 + i * 1.3, .7, 0, 30);
    card(rg, 1100, y, 740, 190);
    E('circle', { cx: 1172, cy: y + 95, r: 44, fill: C.maroonT }, rg);
    ico(rg, ik, 1172, y + 95, .5, C.maroon, 5);
    T(rg, 1240, y + 52, 16, `RULE ${i + 1}`, { w: 700, c: C.maroon, ls: 3 });
    TP(rg, 1240, y + 88, 22, txt, 570, { lh: 30 });
  });
  cap(g, lt, 8.4, 'Credits follow metered, verified deviations — built for hourly certificates, not annual claims.');
}

// ------------------------------------------------------------ control architecture
function sControl(g, lt) {
  head(g, lt, 'CONTROL ARCHITECTURE', 'Four layers — acting only on the external loads');
  const layers = [
    ['PLANNING', 'years', 'Size the PV plant and the contracted flexible power and energy', 'Preliminary results'],
    ['DAY-AHEAD', '24 hours', 'Forecast PV and load, compute the hourly gap, dispatch the cheapest flexibility first; operator runs network checks', 'Chapter 4'],
    ['INTRADAY', 'minutes', 'Model-predictive correction as forecasts change; any residual error is absorbed by the grid', 'Chapter 4'],
    ['SETTLEMENT', 'monthly', 'Verify shifts against baselines, issue hourly credits, pay the loads', 'Chapters 3, 5'],
  ];
  layers.forEach(([nm, ts, d, tag], i) => {
    const y = 290 + i * 150, lg = inG(g, lt, .7 + i * 1.1, .7, 0, -30);
    card(lg, 80, y, 1100, 128);
    E('rect', { x: 80, y, width: 230, height: 128, rx: 14, fill: [C.maroonL, C.maroon2, C.maroon, C.maroonD][i] }, lg);
    E('rect', { x: 290, y, width: 20, height: 128, fill: [C.maroonL, C.maroon2, C.maroon, C.maroonD][i] }, lg);
    T(lg, 110, y + 58, 23, nm, { w: 800, c: '#fff', ls: 2 });
    T(lg, 110, y + 92, 19, ts, { c: '#fff', op: .85 });
    TP(lg, 340, y + 52, 21, d, 600, { lh: 29 });
    const pw = tw(tag, 15, 600) + 24; pill(lg, 1160 - pw, y + 30, tag, { s: 15, fill: C.faint, c: C.ink2, px: 12 });
    if (i < 3) { const au = P(lt, 1.3 + i * 1.1, .4); if (au > 0) { E('line', { x1: 195, x2: 195, y1: y + 128, y2: y + 128 + 22 * au, stroke: C.maroon, 'stroke-width': 3 }, g); } }
  });
  const rg = inG(g, lt, 5.4, .8, 0, 30);
  E('rect', { x: 1260, y: 290, width: 580, height: 578, rx: 16, fill: C.maroon, filter: 'url(#sh)' }, rg);
  ico(rg, 'shield', 1350, 380, .9, '#fff', 4);
  T(rg, 1420, 372, 16, 'BY DESIGN', { w: 700, c: '#fff', ls: 4, op: .75 });
  T(rg, 1420, 404, 25, 'Worst case = annual matching', { w: 700, c: '#fff' });
  TP(rg, 1300, 490, 23, 'Control never touches the data center. If the flexible loads under-deliver, only the matching score drops — the data center is still fully supplied by the grid.', 500, { c: '#fff', lh: 34 });
  TP(rg, 1300, 700, 22, 'Reliability of EEF = reliability of the grid.', 500, { c: '#fff', w: 700, lh: 30 });
  cap(g, lt, 7.8, 'The planning layer is solved in the preliminary results; operations and settlement follow in Chapters 4–5.');
}

// ------------------------------------------------------------ the optimization model
function sModel(g, lt) {
  head(g, lt, 'MATHEMATICAL MODEL', 'A linear program over 8,760 hours');
  const em = 34;
  const colA = [['cfe', 'Hourly matching (CFE) score: same-hour overlap plus credited flexibility'], ['net', 'Hourly PV surplus and deficit bound the loads’ net deviation'], ['state', 'Shifted energy of the aggregated flexible portfolio (efficiency η)'], ['bounds', 'Net up- and down-shifts limited by the contracted flexible power']];
  const colB = [['energy', 'Energy-neutral 24-h window from 06:00 — loads move consumption, they do not add it'], ['obj', 'Minimum contracted flexibility that reaches hourly-matching target X'], ['bess', 'Benchmark: battery with cyclic state of charge (RE+BESS)'], ['pi', 'Break-even flexibility price: annual battery cost per MWh shifted']];
  const hg = inG(g, lt, .5, .6, 0);
  T(hg, 120, 300, 16, 'EEF MODEL', { w: 700, c: C.muted, ls: 3 });
  T(hg, 1000, 300, 16, 'WINDOW, TARGET, BENCHMARK & PRICE', { w: 700, c: C.muted, ls: 3 });
  E('line', { x1: 960, x2: 960, y1: 290, y2: 900, stroke: C.rule, 'stroke-width': 2 }, hg);
  [[colA, 120, 0], [colB, 1000, 4]].forEach(([col, x, off]) => {
    let y = 326;
    col.forEach(([k, note], i) => {
      const hPx = eqH(k, em), at = 1.0 + (off + i) * 1.7;
      const eg = inG(g, lt, at, .8, 0, -24);
      E('rect', { x: x - 22, y, width: 5, height: hPx + 6, fill: C.maroon, rx: 2 }, eg);
      EQN(eg, k, x, y + 3, hPx, C.ink);
      const ng = inG(g, lt, at + .5, .7, 0);
      const ht = TP(ng, x, y + hPx + 36, 19, note, 800, { c: C.muted, lh: 26 });
      y += hPx + 22 + ht + 20;
    });
  });
  const fg = inG(g, lt, 14.6, .8, 8);
  const chips = ['8,760 hourly steps', 'linear programming', 'HiGHS solver', 'PVGIS hourly irradiance'];
  let cx = 960 - (chips.reduce((s, c) => s + tw(c, 18, 600) + 32, 0) + 14 * (chips.length - 1)) / 2;
  chips.forEach(c => { cx += pill(fg, cx, 958, c, { s: 18 }) + 14; });
}

// ------------------------------------------------------------ experimental design
const CFG = [
  ['GRID', C.grid, 'Direct grid supply', 'no clean procurement', ['pylon']],
  ['AM', C.am, 'Annual matching', 'PV = annual use, injected; no flexibility', ['pv']],
  ['RE+BESS', C.bess, 'Renewables + battery', 'same PV + battery (benchmark)', ['pv', 'battery']],
  ['EEF', C.maroon, 'External flexibility', 'same PV + external flexible loads', ['pv', 'node']],
];
function sDesign(g, lt) {
  head(g, lt, 'EXPERIMENTAL DESIGN', 'Four supply configurations, judged on three pillars');
  const cx = i => 520 + i * 335, cw = 315;
  CFG.forEach(([id, col, t1, t2, icons], i) => {
    const cg = inG(g, lt, .6 + i * .6, .7, 20);
    card(cg, cx(i), 280, cw, 250);
    E('rect', { x: cx(i), y: 280, width: cw, height: 8, fill: col, rx: 3 }, cg);
    icons.forEach((k, j) => ico(cg, k, cx(i) + cw / 2 + (j - (icons.length - 1) / 2) * 92, 350, .55, col === C.am ? C.grid : col, 4.5));
    T(cg, cx(i) + cw / 2, 432, 30, id, { a: 'middle', f: F.slab, w: 700, c: col === C.am ? C.grid : col });
    T(cg, cx(i) + cw / 2, 466, 19, t1, { a: 'middle', w: 700 });
    wrap(t2, 16, cw - 40).forEach((l, j) => T(cg, cx(i) + cw / 2, 494 + j * 21, 16, l, { a: 'middle', c: C.muted }));
  });
  const note = inG(g, lt, 3.2, .7, 0);
  T(note, 80, 330, 17, 'IN ALL FOUR', { w: 700, c: C.muted, ls: 3 });
  TP(note, 80, 364, 21, 'the data center buys its entire consumption from the grid', 380, { w: 600, c: C.ink2 });
  const rows = [['shield', 'Reliability', 'data-center load served (%)'], ['leaf', 'Emissions', 'hourly-accounted, t CO₂ / yr'], ['cost', 'Cost', 'annualized cost of hourly matching']];
  rows.forEach(([ik, nm, d], r) => {
    const y = 560 + r * 96, rg = inG(g, lt, 4.2 + r * .8, .7, 0, -30);
    E('rect', { x: 80, y, width: 1760, height: 80, rx: 10, fill: r % 2 ? C.paper : C.maroonT }, rg);
    ico(rg, ik, 124, y + 40, .4, C.maroon, 5);
    T(rg, 168, y + 36, 22, nm, { w: 800, c: C.maroon });
    T(rg, 168, y + 62, 16, d, { c: C.muted });
    CFG.forEach((_, i) => {
      const du = P(lt, 5.0 + r * .8 + i * .15, .4, eBack);
      if (du > 0) E('circle', { cx: cx(i) + cw / 2, cy: y + 40, r: 13 * du, fill: 'none', stroke: C.maroon, 'stroke-width': 3 }, rg);
    });
  });
  const dg = inG(g, lt, 8.0, .8, 10);
  T(dg, 80, 892, 16, 'DATA', { w: 700, c: C.muted, ls: 3 });
  const chips = ['Riyadh · PVGIS-SARAH3 hourly 2020', '477 MWp per 100 MW', 'Tariff ≈ US$48/MWh', '0.568 t CO₂/MWh', 'Battery: NREL 2025, 15 yr, 8%', 'Horizon 25 yr · annualized', '2nd site: NEOM'];
  let x = 160;
  chips.forEach(c => { x += pill(dg, x, 886, c, { s: 15, fill: c.startsWith('Horizon') ? C.maroonT : C.paper, stroke: c.startsWith('Horizon') ? C.maroon : C.rule, c: c.startsWith('Horizon') ? C.maroon : C.ink2, px: 11, py: 7 }) + 9; });
  cap(g, lt, 10.0, 'Same PV plant, same grid connection — only the way the night is covered changes.', { y: 970 });
}
