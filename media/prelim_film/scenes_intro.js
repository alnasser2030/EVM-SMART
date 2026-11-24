// Opening, title, roadmap, motivation and problem scenes.

// ------------------------------------------------------------ cold open: flat load vs. the sun
function sCold(g, lt) {
  const x0 = 260, x1 = 1660, y0 = 820, sy = 1.42;
  const X = h => x0 + (x1 - x0) * h / 24, Y = v => y0 - v * sy;
  const h1 = inG(g, lt, .9, .9, 18); T(h1, 960, 178, 60, 'An AI data center never sleeps.', { a: 'middle', f: F.slab, w: 600 });
  const h2 = inG(g, lt, 4.3, .9, 18); T(h2, 960, 256, 60, 'The sun does.', { a: 'middle', f: F.slab, w: 600, c: C.maroon });
  const ax = inG(g, lt, .2, .8, 0);
  E('line', { x1: x0, x2: x1, y1: y0, y2: y0, stroke: C.ink2, 'stroke-width': 2 }, ax);
  for (const h of [0, 6, 12, 18, 24]) {
    E('line', { x1: X(h), x2: X(h), y1: y0, y2: y0 + 10, stroke: C.ink2, 'stroke-width': 2 }, ax);
    T(ax, X(h), y0 + 40, 20, `${String(h).padStart(2, '0')}:00`, { a: 'middle', c: C.muted, w: 600 });
  }
  // night deficit hatch
  const nu = P(lt, 6.4, 1.1);
  if (nu > 0) {
    const pts = sample(h => Math.min(PV(h), 100), 0, 24, 192);
    const d = `M${X(0)},${Y(100)} H${X(24)} ` + pts.reverse().map(q => `L${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(' ') + ' Z';
    E('path', { d, fill: 'url(#hM)', opacity: nu.toFixed(3) }, g);
    const lg = inG(g, lt, 6.9, .7, 8);
    pill(lg, X(3), Y(48), 'Night: from the grid mix', { a: 'middle', fill: C.bg, s: 19 });
    pill(lg, X(21.7), Y(48), 'Evening', { a: 'middle', fill: C.bg, s: 19 });
  }
  // PV rising out of the horizon
  const pu = P(lt, 3.5, 1.9, eIO);
  if (pu > 0) {
    const pts = sample(h => PV(h) * pu, 0, 24, 192);
    const d = `M${X(0)},${Y(0)} ` + pts.map(q => `L${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(' ') + ` L${X(24)},${Y(0)} Z`;
    E('path', { d, fill: 'url(#gSun)', stroke: C.sun, 'stroke-width': 3, opacity: .95 }, g);
    const lg = inG(g, lt, 4.8, .7, 8);
    T(lg, X(12.5), Y(PV(12.5)) - 20, 22, 'Solar PV', { a: 'middle', w: 700, c: C.sunD });
  }
  drawP(g, `M${X(0)},${Y(100)} H${X(24)}`, P(lt, .9, 1.8, eIO), { stroke: C.dc, 'stroke-width': 5, 'stroke-linecap': 'round' });
  const dl = inG(g, lt, 2.5, .7, 8);
  T(dl, X(0), Y(100) - 18, 21, 'AI data center  ·  100 MW, every hour', { w: 700, c: C.dc });
  cap(g, lt, 7.2, 'Who supplies the night — cleanly, reliably and affordably?', { s: 30, c: C.ink });
}

// ------------------------------------------------------------ title
function sTitle(g, lt) {
  E('rect', { width: W, height: H, fill: C.maroon }, g);
  E('rect', { width: W, height: H, fill: 'url(#hW)', opacity: .18 }, g);
  E('rect', { y: H - 16, width: W, height: 16, fill: C.maroonD }, g);
  // emblem: the sun above a flat line
  const cx = 1500, cy = 470;
  drawP(g, `M${cx - 190},${cy} A190,190 0 1 1 ${cx + 190},${cy} A190,190 0 1 1 ${cx - 190},${cy}`, P(lt, .3, 2.2, eIO), { stroke: 'rgba(255,255,255,.28)', 'stroke-width': 2 });
  const su = P(lt, 1.2, 1.6, eIO);
  E('circle', { cx, cy: cy + 70 - 90 * su, r: 58, fill: '#fff', opacity: (.16 * su).toFixed(3) }, g);
  drawP(g, `M${cx - 300},${cy + 120} H${cx + 300}`, P(lt, .8, 1.8, eIO), { stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: .55 });
  for (let i = 0; i < 6; i++) {
    const u = P(lt, 1.6 + i * .12, .8);
    E('line', { x1: cx - 250 + i * 100, x2: cx - 250 + i * 100, y1: cy + 140, y2: cy + 140 + 28 * u, stroke: '#fff', 'stroke-width': 2, opacity: (.35 * u).toFixed(3) }, g);
  }
  const a = inG(g, lt, .3, .8, 0); T(a, 140, 300, 22, 'PHD PRELIMINARY EXAMINATION', { w: 700, c: '#fff', ls: 6, op: .78 });
  drawP(g, 'M140,330 H300', P(lt, .5, .9), { stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round' });
  const b = inG(g, lt, .8, 1, 24); T(b, 136, 440, 86, 'External Energy Flexibility', { f: F.slab, w: 700, c: '#fff' });
  const c = inG(g, lt, 1.5, 1, 18);
  T(c, 140, 512, 36, 'A Grid-Mediated Supply Framework for Inflexible AI Data Centers', { w: 300, c: '#fff', op: .92 });
  T(c, 140, 560, 36, 'Balancing Reliability, Cost, and Sustainability', { w: 300, c: '#fff', op: .92 });
  const d = inG(g, lt, 2.8, 1, 14);
  E('rect', { x: 140, y: 690, width: 6, height: 118, fill: '#fff', opacity: .8 }, d);
  T(d, 170, 728, 38, 'Ali Nasser', { w: 700, c: '#fff' });
  T(d, 170, 770, 25, 'PhD Resident  ·  Department of Electrical & Computer Engineering', { c: '#fff', op: .88 });
  T(d, 170, 804, 25, 'Texas A&M University', { c: '#fff', op: .88 });
}

// ------------------------------------------------------------ roadmap
const ROAD = [
  ['Motivation', 'Why now'], ['Problem', 'What is missing'], ['State of the Art', '53 refs, one gap'],
  ['Questions & Objectives', 'RQ1–RQ4, O1–O5'], ['Methodology', 'Concept and model'], ['Results: Riyadh', 'All four scenarios'],
  ['Case: NEOM', 'Red Sea site'], ['Implementation', 'Actors, contracts'], ['Expected Results', 'Chapters 4–6'], ['Research Plan', 'Next steps'], ['Contributions', 'and conclusion'],
];
function sRoadmap(g, lt) {
  head(g, lt, 'OUTLINE', 'The path through this work');
  const n = ROAD.length, x0 = 100, x1 = 1820, sp = 160, xs = i => 160 + i * sp, y = x => 600 + 80 * Math.cos(Math.PI * (x - 160) / sp);
  const pts = []; for (let x = x0; x <= x1; x += 6) pts.push([x, y(x)]);
  const u = P(lt, .8, 7.2, eIO);
  drawP(g, poly(pts), 1, { stroke: C.faint, 'stroke-width': 10, 'stroke-linecap': 'round' });
  drawP(g, poly(pts), u, { stroke: C.maroon, 'stroke-width': 4, 'stroke-linecap': 'round' });
  const hx = x0 + (x1 - x0) * u;
  if (u > 0 && u < 1) { E('circle', { cx: hx, cy: y(hx), r: 34, fill: 'url(#gGlow)' }, g); E('circle', { cx: hx, cy: y(hx), r: 8, fill: C.maroon }, g); }
  ROAD.forEach(([name, sub], i) => {
    const x = xs(i), yy = y(x), tt = .8 + 7.2 * (x - x0) / (x1 - x0);
    const pg = popG(g, lt, tt - .15, x, yy);
    E('circle', { r: 28, fill: C.paper, stroke: C.maroon, 'stroke-width': 4 }, pg);
    T(pg, 0, 8, 20, String(i + 1).padStart(2, '0'), { a: 'middle', f: F.slab, w: 700, c: C.maroon });
    const lg = inG(g, lt, tt, .7, i % 2 ? -12 : 12);
    const lines = wrap(name, 20, 150, 700), lh = 25;
    const ly = i % 2 ? yy - 70 - lines.length * lh : yy + 74;
    lines.forEach((l, k) => T(lg, x, ly + k * lh, 20, l, { a: 'middle', w: 700 }));
    T(lg, x, ly + lines.length * lh + 2, 16, sub, { a: 'middle', c: C.muted });
  });
  cap(g, lt, 9, 'Eleven stops — from why this matters to how it is applied and what it contributes.');
}

// ------------------------------------------------------------ motivation 1: global demand
function sMotGlobal(g, lt) {
  head(g, lt, 'GLOBAL DEMAND', 'AI is driving data-center electricity up — fast');
  source(g, lt, .5, 'Sources: IEA, Energy and AI (2025); LBNL (2024)');
  const L = inG(g, lt, .6, .8, 16);
  T(L, 80, 430, 132, fmt(415 * P(lt, .6, 1.8, eIO)) + ' TWh', { f: F.slab, w: 700, c: C.maroon });
  T(L, 84, 486, 27, 'used by data centers worldwide in 2024', { w: 600 });
  T(L, 84, 524, 22, '≈ 1.5% of global electricity  ·  +12% per year since 2017', { c: C.muted });
  const us = inG(g, lt, 7.2, .8, 14);
  E('rect', { x: 80, y: 600, width: 6, height: 128, fill: C.maroon }, us);
  T(us, 108, 640, 24, 'UNITED STATES', { w: 700, c: C.muted, ls: 3 });
  TR(us, 108, 694, 50, [['4.4%', { c: C.ink }], ['  →  ', { c: C.muted }], ['6.7–12%', { c: C.maroon }]], { f: F.slab, w: 700 });
  T(us, 108, 728, 21, 'of national electricity, 2023 → 2028', { c: C.muted });
  const ag = inG(g, lt, 8.8, .8, 10);
  TP(ag, 84, 800, 23, 'A typical AI-focused data center uses as much electricity as 100,000 households.', 620, { c: C.ink2 });

  // projection columns
  const x0 = 880, y0 = 860, sy = 520 / 1800, Y = v => y0 - v * sy;
  const ax = inG(g, lt, .4, .8, 0);
  E('line', { x1: x0, x2: 1820, y1: y0, y2: y0, stroke: C.ink2, 'stroke-width': 2 }, ax);
  for (const v of [500, 1000, 1500]) {
    E('line', { x1: x0, x2: 1820, y1: Y(v), y2: Y(v), stroke: C.faint, 'stroke-width': 1.5 }, ax);
    T(ax, x0 - 10, Y(v) + 6, 17, fmt(v), { a: 'end', c: C.muted });
  }
  T(ax, x0 - 10, Y(1800) + 4, 17, 'TWh / yr', { a: 'end', c: C.muted, w: 600 });
  const cols = [[2024, 415, 1.0, 'measured'], [2030, 945, 2.6, 'projected'], [2035, 1200, 4.0, 'projected']];
  cols.forEach(([yr, v, at, kind], i) => {
    const cx = 1040 + i * 300, u = P(lt, at, 1.1, eIO), top = Y(v * u);
    if (u > 0) {
      E('rect', { x: cx - 85, y: top, width: 170, height: y0 - top, fill: kind === 'measured' ? C.maroon : 'url(#hM)', stroke: C.maroon, 'stroke-width': 2 }, g);
      const lg = inG(g, lt, at + .7, .6, 8);
      T(lg, cx, Y(v) - 18, 30, (i ? '≈ ' : '') + fmt(v), { a: 'middle', f: F.slab, w: 700, c: C.maroon });
    }
    const yl = inG(g, lt, at, .6, 0);
    T(yl, cx, y0 + 38, 22, String(yr), { a: 'middle', w: 700 });
    T(yl, cx, y0 + 64, 17, kind, { a: 'middle', c: C.muted });
  });
  // scenario range for 2035
  const ru = P(lt, 5.4, .9);
  if (ru > 0) {
    const cx = 1640, wg = G(g, { opacity: ru.toFixed(3) });
    E('line', { x1: cx + 110, x2: cx + 110, y1: Y(700), y2: Y(700 + 1000 * ru), stroke: C.ink2, 'stroke-width': 2.5 }, wg);
    for (const v of [700, 1700]) E('line', { x1: cx + 100, x2: cx + 120, y1: Y(v), y2: Y(v), stroke: C.ink2, 'stroke-width': 2.5 }, wg);
    T(wg, cx + 110, Y(1700) - 14, 17, 'scenario range', { a: 'middle', c: C.muted });
    T(wg, cx + 110, Y(1700) - 34, 17, '700–1,700', { a: 'middle', c: C.ink2, w: 700 });
  }
  // doubling arrow
  const du = P(lt, 3.6, 1.0, eIO);
  if (du > 0) {
    drawP(g, `M1060,${Y(415) - 60} Q1120,${Y(800)} 1240,${Y(900)}`, du, { stroke: C.ink2, 'stroke-width': 2.5, 'stroke-dasharray': du < 1 ? null : '0' });
    if (du >= 1) arrowHead(g, 1240, Y(900), -0.25, 13, C.ink2);
    const lg = inG(g, lt, 4.2, .6, 6);
    T(lg, 1120, Y(860) - 18, 21, 'more than doubles', { a: 'end', w: 700, c: C.ink2 });
  }
  cap(g, lt, 9.6, 'AI is the main driver — and these facilities draw power around the clock.');
}

// ------------------------------------------------------------ motivation 2: Saudi data centers
function sMotSaudi(g, lt) {
  head(g, lt, 'SAUDI ARABIA', 'The Kingdom is building for AI');
  source(g, lt, .5, 'Sources: KAPSARC (2025); U.S. ITA (2025); NEOM (2025)');
  const cards = [
    ['2.8 TWh', 'data-center electricity, 2024', '0.85% of national electricity use', .6],
    ['10.2–42.2 TWh', 'projected for 2030', 'up to ~15× today', 2.0],
    ['≈ 1.5 GW', 'national data-center target, 2030', 'National Data Center Strategy (2025); e.g., a 1.5-GW AI campus announced at NEOM–Oxagon', 3.4],
  ];
  cards.forEach(([big, lab, sub, at], i) => {
    const x = 80 + i * 600, cg = inG(g, lt, at, .8, 26);
    card(cg, x, 290, 560, 270);
    E('rect', { x, y: 290, width: 8, height: 270, fill: C.maroon, rx: 3 }, cg);
    T(cg, x + 40, 390, 60, big, { f: F.slab, w: 700, c: C.maroon });
    T(cg, x + 40, 440, 25, lab, { w: 700 });
    TP(cg, x + 40, 482, 20, sub, 490, { c: C.muted });
  });
  // growth range on a TWh axis
  const ax0 = 330, ax1 = 1800, sx = (ax1 - ax0) / 45, X = v => ax0 + v * sx;
  const ag = inG(g, lt, 4.6, .8, 0);
  E('line', { x1: ax0, x2: ax1, y1: 850, y2: 850, stroke: C.ink2, 'stroke-width': 2 }, ag);
  for (const v of [0, 10, 20, 30, 40]) { E('line', { x1: X(v), x2: X(v), y1: 850, y2: 860, stroke: C.ink2, 'stroke-width': 2 }, ag); T(ag, X(v), 884, 17, v, { a: 'middle', c: C.muted }); }
  T(ag, ax1, 884, 17, 'TWh / yr', { a: 'end', c: C.muted, w: 600 });
  T(ag, 80, 682, 22, '2024', { w: 700 });
  T(ag, 80, 782, 22, '2030 (projected)', { w: 700 });
  const u1 = P(lt, 4.9, .8, eIO);
  E('rect', { x: ax0, y: 656, width: 2.8 * sx * u1, height: 38, fill: C.maroon, rx: 3 }, g);
  const u2 = P(lt, 5.6, 1.4, eIO);
  if (u2 > 0) {
    E('rect', { x: X(10.2), y: 756, width: (42.2 - 10.2) * sx * u2, height: 38, fill: 'url(#hM)', stroke: C.maroon, 'stroke-width': 2, rx: 3 }, g);
    const lg = inG(g, lt, 6.6, .6, 6);
    T(lg, X(10.2), 742, 18, '10.2', { a: 'middle', w: 700, c: C.maroon });
    T(lg, X(42.2), 742, 18, '42.2', { a: 'middle', w: 700, c: C.maroon });
    T(lg, X(2.8) + 14, 682, 18, '2.8', { w: 700, c: C.maroon });
  }
  cap(g, lt, 7.6, 'A constant, multi-gigawatt load is arriving on a grid that is changing fast.');
}

// ------------------------------------------------------------ motivation 3: the Saudi grid
function sMotGrid(g, lt) {
  head(g, lt, 'THE SAUDI GRID', 'More sun at noon — and idle flexibility on the grid');
  source(g, lt, .5, 'Sources: KAPSARC (2026); Saudi 2030 renewable target');
  // illustrative net-load curves
  const x0 = 120, x1 = 880, y0 = 830, sy = 420, X = h => x0 + (x1 - x0) * h / 24, Y = v => y0 - v * sy;
  const base = h => .78 + .16 * Math.exp(-Math.pow((h - 20.5) / 3.2, 2)) + .05 * Math.exp(-Math.pow((h - 9) / 3, 2)) - .06 * Math.exp(-Math.pow((h - 4) / 2.5, 2));
  const sol = h => Math.exp(-Math.pow((h - 12.5) / 2.9, 2));
  const net = k => h => base(h) - k * sol(h);
  const ax = inG(g, lt, .5, .8, 0);
  card(ax, 80, 300, 840, 600, { flat: true, fill: C.paper });
  T(ax, 110, 344, 20, 'System net load over a day (illustrative)', { w: 700, c: C.ink2 });
  E('line', { x1: x0, x2: x1, y1: y0, y2: y0, stroke: C.ink2, 'stroke-width': 2 }, ax);
  for (const h of [0, 6, 12, 18, 24]) T(ax, X(h), y0 + 32, 17, `${String(h).padStart(2, '0')}:00`, { a: 'middle', c: C.muted });
  const c1 = sample(net(.14), 0, 24, 120).map(q => [X(q[0]), Y(q[1])]);
  drawP(g, poly(c1), P(lt, .9, 1.4, eIO), { stroke: C.am, 'stroke-width': 4, 'stroke-linecap': 'round' });
  const k = lerp(.14, .42, P(lt, 2.6, 2.2, eIO));
  if (lt > 2.4) {
    const c2 = sample(net(k), 0, 24, 120).map(q => [X(q[0]), Y(q[1])]);
    E('path', { d: poly(c2), fill: 'none', stroke: C.maroon, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  }
  const lg = inG(g, lt, 1.4, .6, 6);
  T(lg, X(3.2), Y(net(.14)(3.2)) - 18, 19, '2025', { a: 'middle', w: 700, c: C.muted });
  const lg2 = inG(g, lt, 4.4, .6, 6);
  T(lg2, X(12.5), Y(net(.42)(12.5)) + 40, 19, '2030', { a: 'middle', w: 700, c: C.maroon });
  const du = P(lt, 4.8, .8);
  if (du > 0) {
    const yA = Y(net(.14)(12.5)), yB = Y(net(.42)(12.5));
    const dg = G(g, { opacity: du.toFixed(3) });
    E('line', { x1: X(15.4), x2: X(15.4), y1: yA - 4, y2: yB + 4, stroke: C.maroon, 'stroke-width': 2.5 }, dg);
    arrowHead(dg, X(15.4), yB + 4, Math.PI / 2, 12);
    T(dg, X(15.8), (yA + yB) / 2 - 6, 22, 'midday dip ×3', { w: 700, c: C.maroon });
    T(dg, X(15.8), (yA + yB) / 2 + 22, 18, 'ramps ×3.5–5.5', { c: C.ink2 });
  }
  // right column
  const r1 = inG(g, lt, .9, .7, 10);
  pill(r1, 990, 330, 'TARGET: 50% RENEWABLE ELECTRICITY BY 2030', { s: 18, fill: C.maroonT });
  const r2 = inG(g, lt, 5.6, .8, 14);
  T(r2, 990, 462, 84, '7.1–29.9 GW', { f: F.slab, w: 700, c: C.maroon });
  T(r2, 994, 506, 25, 'industrial demand-response potential by 2030', { w: 600 });
  const loads = [['desal', 'Desalination'], ['cool', 'District cooling + storage'], ['pump', 'Water pumping'], ['factory', 'Industry']];
  loads.forEach(([k2, name], i) => {
    const x = 990 + i * 215, tg = inG(g, lt, 7 + i * .35, .6, 16);
    card(tg, x, 560, 196, 200, { flat: true });
    ico(tg, k2, x + 98, 638, .78, C.maroon, 4);
    wrap(name, 19, 176, 700).forEach((l, j) => T(tg, x + 98, 718 + j * 24, 19, l, { a: 'middle', w: 700 }));
  });
  const r3 = inG(g, lt, 9.4, .8, 8);
  TP(r3, 990, 830, 24, '…yet it is procured only by the system operator, for system services.', 840, { it: true, c: C.maroon, w: 600 });
  cap(g, lt, 10.6, 'Loads that can follow the sun already exist — but none of them supplies anyone’s clean energy.');
}

// ------------------------------------------------------------ motivation 4: three pillars
function sPillars(g, lt) {
  head(g, lt, 'THE STANDARD', 'Three pillars an AI data center cannot trade away');
  const roofU = P(lt, 4.2, .9, eIO);
  const xs = [560, 960, 1360];
  const items = [['shield', 'RELIABILITY', 'Load served 24/7 — grid-grade, no compromise'], ['leaf', 'EMISSIONS', 'Clean in every hour — not only on annual paper'], ['cost', 'COST', 'Affordable at gigawatt scale']];
  // base steps
  const bu = P(lt, .5, .8, eIO);
  E('rect', { x: 960 - 640 * bu, y: 800, width: 1280 * bu, height: 22, fill: C.maroon, rx: 2 }, g);
  E('rect', { x: 960 - 680 * bu, y: 822, width: 1360 * bu, height: 22, fill: C.maroonD, rx: 2 }, g);
  items.forEach(([ik, name, desc], i) => {
    const x = xs[i], u = P(lt, 1 + i * .8, 1.1, eIO), h = 400 * u, top = 800 - h;
    if (u <= 0) return;
    E('rect', { x: x - 125, y: top, width: 250, height: h, fill: C.maroonT, stroke: C.maroon, 'stroke-width': 3 }, g);
    for (const dx of [-70, -24, 24, 70]) E('line', { x1: x + dx, x2: x + dx, y1: top + 40, y2: 790, stroke: C.maroonL, 'stroke-width': 2, opacity: .55 }, g);
    E('rect', { x: x - 145, y: top - 26, width: 290, height: 26, fill: C.maroon }, g);
    const tg = inG(g, lt, 1.6 + i * .8, .6, 10);
    E('rect', { x: x - 105, y: 470, width: 210, height: 300, fill: C.bg, opacity: .92, rx: 8 }, tg);
    ico(tg, ik, x, 528, .7, C.maroon, 4.5);
    T(tg, x, 614, 24, name, { a: 'middle', w: 800, c: C.maroon, ls: 2 });
    wrap(desc, 20, 180, 400).forEach((l, j) => T(tg, x, 656 + j * 27, 20, l, { a: 'middle', c: C.ink2 }));
  });
  if (roofU > 0) {
    const rg = G(g, { opacity: roofU.toFixed(3), transform: `translate(0 ${(-30 * (1 - roofU)).toFixed(1)})` });
    E('path', { d: 'M360,372 L960,290 L1560,372 Z', fill: C.maroon }, rg);
    T(rg, 960, 358, 22, 'SUPPLYING AN AI DATA CENTER', { a: 'middle', w: 700, c: '#fff', ls: 4 });
  }
  cap(g, lt, 6.4, 'Every option in this work is judged on all three pillars — together.');
}

// ------------------------------------------------------------ problem 1: annual vs hourly
function sAnnual(g, lt) {
  head(g, lt, 'ANNUAL MATCHING', '100% renewable on paper — 40% in reality');
  const B = DATA.baseline;
  const l1 = inG(g, lt, .5, .6, 0); T(l1, 80, 330, 18, 'OVER A YEAR', { w: 700, c: C.muted, ls: 3 });
  const u1 = P(lt, .7, 1.1, eIO), u2 = P(lt, 1.3, 1.1, eIO);
  const lb = inG(g, lt, .7, .6, 6);
  T(lb, 80, 378, 22, 'PV output injected into the grid', { w: 600 });
  T(lb, 760, 378, 22, `${fmt(B.E_GWh)} GWh`, { a: 'end', w: 700, c: C.sunD });
  E('rect', { x: 80, y: 392, width: 680 * u1, height: 46, fill: C.sun, rx: 4 }, g);
  const lb2 = inG(g, lt, 1.3, .6, 6);
  T(lb2, 80, 488, 22, 'Data-center consumption', { w: 600 });
  T(lb2, 760, 488, 22, `${fmt(B.E_GWh)} GWh`, { a: 'end', w: 700, c: C.dc });
  E('rect', { x: 80, y: 502, width: 680 * u2, height: 46, fill: C.dc, rx: 4 }, g);
  const st = P(lt, 2.6, .5, eBack);
  if (st > 0) {
    const sg = G(g, { transform: `translate(420 612) rotate(-4) scale(${(2 - st).toFixed(3)})`, opacity: clamp(st).toFixed(3) });
    E('rect', { x: -230, y: -34, width: 460, height: 68, rx: 8, fill: 'none', stroke: C.maroon, 'stroke-width': 4 }, sg);
    T(sg, 0, 11, 26, '100% RENEWABLE — ON PAPER', { a: 'middle', w: 800, c: C.maroon, ls: 2 });
  }
  const cu = P(lt, 7.2, 1.6, eIO);
  const cg = inG(g, lt, 7.2, .7, 14);
  T(cg, 76, 810, 128, fmt(B.am_cfe * cu, 1) + '%', { f: F.slab, w: 700, c: C.maroon });
  T(cg, 80, 856, 23, 'matched in the same hour  (Riyadh, 8,760 h)', { w: 600 });
  T(cg, 80, 892, 21, `${fmt(B.deficit_GWh, 1)} GWh/yr still drawn from the grid mix`, { c: C.muted });

  // a day, hour by hour
  const x0 = 980, x1 = 1820, y0 = 830, sy = 1.25, X = h => x0 + (x1 - x0) * h / 24, Y = v => y0 - v * sy;
  const ax = inG(g, lt, 3.2, .6, 0);
  T(ax, 980, 330, 18, 'OVER A DAY — HOUR BY HOUR', { w: 700, c: C.muted, ls: 3 });
  E('line', { x1: x0, x2: x1, y1: y0, y2: y0, stroke: C.ink2, 'stroke-width': 2 }, ax);
  for (const h of [0, 6, 12, 18, 24]) T(ax, X(h), y0 + 30, 17, `${String(h).padStart(2, '0')}:00`, { a: 'middle', c: C.muted });
  const pu = P(lt, 3.5, 1.2, eIO);
  if (pu > 0) {
    const pts = sample(h => PV(h) * pu, 0, 24, 160);
    E('path', { d: `M${X(0)},${Y(0)} ` + pts.map(q => `L${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(' ') + ` L${X(24)},${Y(0)} Z`, fill: C.sunL, stroke: C.sun, 'stroke-width': 2.5 }, g);
  }
  const mu = P(lt, 5.0, .8);
  if (mu > 0) {
    const pts = sample(h => Math.min(PV(h), 100), 0, 24, 160);
    E('path', { d: `M${X(0)},${Y(0)} ` + pts.map(q => `L${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(' ') + ` L${X(24)},${Y(0)} Z`, fill: C.maroon, opacity: (.9 * mu).toFixed(3) }, g);
    const pts2 = sample(h => Math.min(PV(h), 100), 0, 24, 160).reverse();
    E('path', { d: `M${X(0)},${Y(100)} H${X(24)} ` + pts2.map(q => `L${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(' ') + ' Z', fill: 'url(#hG)', opacity: mu.toFixed(3) }, g);
  }
  drawP(g, `M${X(0)},${Y(100)} H${X(24)}`, P(lt, 4.2, 1, eIO), { stroke: C.dc, 'stroke-width': 4 });
  const lg = inG(g, lt, 5.6, .6, 6);
  T(lg, X(12.5), Y(50) + 8, 20, 'matched', { a: 'middle', w: 700, c: '#fff' });
  T(lg, X(3), Y(100) - 14, 19, 'grid mix', { a: 'middle', w: 700, c: C.grid });
  T(lg, X(21.5), Y(100) - 14, 19, 'grid mix', { a: 'middle', w: 700, c: C.grid });
  T(lg, X(12.5), Y(PV(12.5)) - 14, 19, 'surplus exported', { a: 'middle', w: 700, c: C.sunD });
  cap(g, lt, 10.2, 'Matching the year is not matching the hour: at night the data center runs on the fossil-heavy grid.');
}

// ------------------------------------------------------------ problem 2: internal flexibility is small
function sInternal(g, lt) {
  head(g, lt, 'INTERNAL FLEXIBILITY', 'AI data centers can barely flex themselves');
  source(g, lt, .5, 'Sources: Li et al. (2026); LBNL (2024)');
  const x0 = 140, y0 = 320, s = 46, gap = 8;
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10, u = P(lt, .4 + (r + c) * .07, .5);
    if (u <= 0) continue;
    const n = (9 - r) * 10 + c; // fill from the bottom row
    const hot = n < 6 && lt > 2.8;
    const part = n === 6 && lt > 2.8;
    const x = x0 + c * (s + gap), y = y0 + r * (s + gap);
    E('rect', { x, y, width: s, height: s, rx: 6, fill: hot ? C.maroon : C.faint, opacity: u.toFixed(3) }, g);
    if (part) E('rect', { x, y: y + s * .65, width: s, height: s * .35, rx: 4, fill: C.maroon, opacity: P(lt, 2.8, .5).toFixed(3) }, g);
  }
  const tg = inG(g, lt, 3.1, .8, 14);
  T(tg, 780, 470, 128, '≈ 6%', { f: F.slab, w: 700, c: C.maroon });
  T(tg, 786, 526, 29, 'of median facility power is immediately curtailable', { w: 600 });
  T(tg, 786, 566, 21, '155,410-GPU production trace (Li et al., 2026)', { c: C.muted });
  const t2 = inG(g, lt, 5.0, .8, 10);
  E('rect', { x: 786, y: 630, width: 6, height: 132, fill: C.maroon }, t2);
  T(t2, 812, 668, 26, 'Dependable relief shrinks as events grow longer.', { w: 600 });
  TP(t2, 812, 712, 22, 'Energy models assume AI training servers run about 80% of the time (LBNL, 2024).', 980, { c: C.ink2 });
  cap(g, lt, 7.0, 'Solutions that shift the data center’s own workload have little to work with.');
}

// ------------------------------------------------------------ problem 3: batteries escalate
function sBatteries(g, lt) {
  head(g, lt, 'THE DEFAULT FIX', 'Batteries can match every hour — at a growing price');
  source(g, lt, .5, 'Model results (this work); Lee et al. (2026)');
  const tg = DATA.targets, x0 = 160, y0 = 840, sy = 460 / 1320, Y = v => y0 - v * sy;
  const ax = inG(g, lt, .4, .6, 0);
  E('line', { x1: x0 - 20, x2: 1100, y1: y0, y2: y0, stroke: C.ink2, 'stroke-width': 2 }, ax);
  T(ax, 630, 922, 19, 'Displacement target', { a: 'middle', c: C.muted, w: 600 });
  T(ax, x0 - 20, 330, 19, 'Battery energy needed (MWh)', { c: C.muted, w: 600 });
  const sel = tg.filter(t => [50, 60, 70, 80, 90].includes(t.X)), tB = tg.find(t => t.X === DATA.BX);
  sel.forEach((t, i) => {
    const cx = 230 + i * 195, u = P(lt, .9 + i * .55, 1.0, eIO), h = t.bess_MWh * sy * u;
    const xl = inG(g, lt, .9 + i * .55, .5, 0);
    T(xl, cx, y0 + 34, 22, `${t.X}%`, { a: 'middle', w: 700 });
    if (u <= 0) return;
    E('rect', { x: cx - 60, y: y0 - h, width: 120, height: h, rx: 8, fill: t.X === DATA.BX ? C.bess : C.bessL, stroke: C.bess, 'stroke-width': 2.5 }, g);
    E('rect', { x: cx - 22, y: y0 - h - 12, width: 44, height: 12, rx: 3, fill: C.bess }, g);
    for (let k = 1; k * 110 < h - 10; k++) E('line', { x1: cx - 44, x2: cx + 44, y1: y0 - k * 110, y2: y0 - k * 110, stroke: t.X === DATA.BX ? 'rgba(255,255,255,.4)' : 'rgba(79,109,143,.35)', 'stroke-width': 2 }, g);
    const lg = inG(g, lt, 1.6 + i * .55, .5, 6);
    T(lg, cx, Y(t.bess_MWh) - 26, 24, fmt(t.bess_MWh), { a: 'middle', f: F.slab, w: 700, c: C.bess });
  });
  const rg = inG(g, lt, 4.4, .8, 14);
  T(rg, 1200, 380, 18, `AT ${DATA.BX}% DISPLACEMENT`, { w: 700, c: C.muted, ls: 3 });
  T(rg, 1196, 470, 84, `${fmt(tB.bess_MWh)} MWh`, { f: F.slab, w: 700, c: C.bess });
  T(rg, 1200, 516, 25, `≈ ${fmt(tB.bess_MWh / 100, 1)} hours of the data center’s load`, { w: 600 });
  T(rg, 1200, 556, 25, `≈ US$${fmt(tB.bess_mid)} M per year  (US$${fmt(tB.bess_lo)}–${fmt(tB.bess_hi)} M)`, { w: 600 });
  const r2 = inG(g, lt, 6.6, .8, 10);
  E('rect', { x: 1200, y: 620, width: 6, height: 104, fill: C.maroon }, r2);
  TP(r2, 1226, 656, 23, 'Studies find storage costs escalate above ~80% hourly matching (Lee et al., 2026).', 600, { c: C.maroon, w: 600 });
  cap(g, lt, 8.4, 'The closer the match gets to every hour, the more storage the data center must build and pay for.');
}

// ------------------------------------------------------------ problem 4: statement
function sStatement(g, lt) {
  const k = inG(g, lt, .1, .7, 0); T(k, 200, 250, 18, 'PROBLEM STATEMENT', { w: 700, c: C.maroon, ls: 4 });
  const bu = P(lt, .3, 1.2, eIO);
  E('rect', { x: 200, y: 290, width: 8, height: 560 * bu, fill: C.maroon }, g);
  const lines = [
    ['AI data centers are large, nearly constant loads with little internal flexibility.', 0],
    ['Annual matching is clean only on paper; batteries are clean every hour, but costly.', 0],
    ['Large flexible loads already on the grid could follow the sun —', 0],
    ['yet no framework lets an inflexible data center use that external flexibility', 1],
    ['to achieve verifiable hourly clean supply, without storage and', 1],
    ['without compromising reliability.', 1],
  ];
  lines.forEach(([l, hot], i) => {
    const at = .8 + i * 1.25 + (hot ? .6 : 0);
    const lg = inG(g, lt, at, .9, 0, -24);
    T(lg, 248, 360 + i * 86 + (hot ? 24 : 0), 36, l, { f: F.slab, w: hot ? 700 : 400, c: hot ? C.maroon : C.ink });
  });
  cap(g, lt, 10.5, 'This is the gap this dissertation sets out to close.', { c: C.muted });
}
