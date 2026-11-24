// The Texas lesson (motivation), where EEF wins by data-center size (results), and recommendations (conclusion).

// ------------------------------------------------------------ motivation: the Texas lesson
function sTexas(g, lt) {
  head(g, lt, 'THE TEXAS LESSON', 'When data centers outrun the grid');
  source(g, lt, .5, 'ERCOT (2026); Utility Dive (2026); Sidley (2025); KAPSARC (2025)');
  const x0 = 140, base = 820, s = 0.9;
  const ax = inG(g, lt, .4, .6, 0);
  T(ax, 80, 300, 16, 'ERCOT LARGE LOADS ASKING TO CONNECT (GW)', { w: 800, c: C.muted, ls: 2 });
  E('line', { x1: x0, x2: 900, y1: base, y2: base, stroke: C.ink2, 'stroke-width': 2 }, ax);
  const bars = [['Dec 2025', 233, '> 70% data centers', .8], ['mid-2026', 474, '≈ 90% data centers', 2.0]];
  bars.forEach(([lab, v, note, at], i) => {
    const cx = 330 + i * 330, u = P(lt, at, 1.4, eIO), h = v * s * u;
    E('rect', { x: cx - 90, y: base - h, width: 180, height: h, rx: 6, fill: i ? C.maroon : C.maroonL }, g);
    const lg = inG(g, lt, at + 1.0, .5, 6);
    T(lg, cx, base - v * s - 18, 40, `${v} GW`, { a: 'middle', f: F.slab, w: 700, c: i ? C.maroon : C.maroon2 });
    T(lg, cx, base + 32, 19, lab, { a: 'middle', w: 800 });
    T(lg, cx, base + 58, 15, note, { a: 'middle', c: C.muted });
  });
  const ng = inG(g, lt, 3.6, .6, 0);
  T(ng, 330, 470, 22, '×2 in about six months', { a: 'middle', w: 800, c: C.ink2 });
  const rg = inG(g, lt, 4.6, .8, 0, 30);
  card(rg, 1000, 290, 840, 330);
  T(rg, 1030, 334, 16, 'THE QUEUE — AND THE NEW RULES', { w: 800, c: C.maroon, ls: 2 });
  ['only 22 GW had cleared ERCOT’s study requirements (Apr 2026)', 'Senate Bill 6 (June 2025): new large loads can be curtailed in emergencies', 'SB 6: new interconnection standards and batch studies', 'state regulator (PUCT) rules for large loads due by end-2026'].forEach((t, i) => {
    xMark(rg, 1046, 378 + i * 64, 12, C.maroonL);
    TP(rg, 1072, 384 + i * 64, 20, t, 740, { c: C.ink });
  });
  const kg = inG(g, lt, 7.0, .8, 0, 30);
  E('rect', { x: 1000, y: 650, width: 840, height: 240, rx: 16, fill: C.maroon, filter: 'url(#sh)' }, kg);
  T(kg, 1030, 694, 16, 'SAUDI ARABIA IS NEXT', { w: 800, c: '#fff', ls: 2, op: .85 });
  TP(kg, 1030, 736, 21, 'HUMAIN alone targets 1.9 GW by 2030 and 6.6 GW by 2034, on a grid built for air-conditioning peaks.', 780, { c: '#fff', lh: 29 });
  TP(kg, 1030, 820, 21, 'EEF’s aim: supply the data center without adding its night load to the system.', 780, { c: '#fff', w: 800, lh: 29 });
  cap(g, lt, 9.6, 'The constraint is not chips but power — reliable, clean and fast to connect.', { y: 972 });
}

// ------------------------------------------------------------ methodology: what displacement means
function sDisplacement(g, lt) {
  head(g, lt, 'WHAT WE MEASURE: DISPLACEMENT', 'How much of the data center’s use is freed on the grid — hour by hour');
  const steps = [
    ['shield', 'The data center takes 100% of its energy from the grid', 'always — its reliability is the grid’s'],
    ['pv', 'Its PV is sold to SPPC — all of it', 'sized to ≈ the data center’s annual use (× 1.0–1.25)'],
    ['node', 'Flexible loads free the same MWh, hour by hour', 'anywhere on the national grid, through the operator'],
  ];
  steps.forEach(([ik, t1, t2], i) => {
    const y = 296 + i * 150, rg = inG(g, lt, .6 + i * 1.2, .7, 0, -30);
    card(rg, 80, y, 960, 128);
    E('circle', { cx: 150, cy: y + 64, r: 42, fill: C.maroonT }, rg);
    ico(rg, ik, 150, y + 64, .48, C.maroon, 5);
    T(rg, 218, y + 56, 24, t1, { w: 700 });
    T(rg, 218, y + 92, 18, t2, { c: C.muted });
  });
  const rg = inG(g, lt, 4.2, .8, 0, 30);
  card(rg, 1100, 296, 740, 428, { fill: C.paper });
  T(rg, 1130, 342, 16, 'DISPLACEMENT  X', { w: 800, c: C.maroon, ls: 3 });
  EQN(rg, 'disp', 1130, 372, eqH('disp', 26), C.ink);
  TP(rg, 1130, 520, 19, 'PV in the same hour plus supply freed by the loads, over the data center’s use.', 680, { c: C.ink, lh: 26 });
  TP(rg, 1130, 610, 17, 'The literature calls the same number hourly matching (24/7 carbon-free energy).', 680, { c: C.muted, it: true, lh: 23 });
  // scale 0-100%
  const sx0 = 120, sx1 = 1800, SX = v => sx0 + (sx1 - sx0) * v / 100, sy = 838;
  const su = P(lt, 6.4, 1.2, eIO);
  E('rect', { x: sx0, y: sy - 12, width: (sx1 - sx0) * su, height: 24, rx: 12, fill: C.faint }, g);
  const bu = P(lt, 8.4, .8, eIO);
  if (bu > 0) E('rect', { x: SX(85), y: sy - 12, width: (SX(97) - SX(85)) * bu, height: 24, rx: 12, fill: C.maroon }, g);
  [[0, 'GRID · 0%', 'all of its load is new load', C.grid, 6.8], [40.4, 'Annual I-RECs · 40.4%', 'clean on paper only', C.am, 7.2],
    [91, 'EEF works · 85–97%', 'best at ≈ 90%', C.maroon, 8.6], [100, '100%', 'adds nothing, any hour', C.ink2, 9.0]].forEach(([v, l1, l2, col, at], i) => {
    const mg = inG(g, lt, at, .5, 0);
    E('circle', { cx: SX(v), cy: sy, r: 9, fill: col, stroke: '#fff', 'stroke-width': 3 }, mg);
    const up = i % 2 === 1, a = v === 0 ? 'start' : v === 100 ? 'end' : 'middle';
    T(mg, SX(v), up ? sy - 30 : sy + 44, 18, l1, { a, w: 800, c: col === C.am ? C.grid : col });
    if (l2) T(mg, SX(v), up ? sy - 54 : sy + 68, 15, l2, { a, c: C.muted });
  });
  cap(g, lt, 9.6, 'At 100% the data center would add nothing to the grid in any hour — EEF takes it to 85–97%.', { y: 976 });
}

// ------------------------------------------------------------ results: the displacement curve
function sDispCurve(g, lt) {
  head(g, lt, 'THE DISPLACEMENT CURVE', 'Where EEF is the best option — 100-MW data center, 25 years');
  source(g, lt, .5, 'Model results; grid reinforcement (US$125/kW-yr) and carbon (US$50/t) are assumptions');
  const D = DATA.disp.sites, x0 = 200, x1 = 1080, X = v => x0 + (x1 - x0) * (v - 48) / 52;
  const yT = 630, yH = 330, Y = v => yT - (yT - yH) * (v + 2) / 24, yB = 870, yBH = 730, YB = v => yB - (yB - yBH) * v / 100;
  const ax = inG(g, lt, .3, .6, 0);
  for (const v of [0, 5, 10, 15, 20]) { E('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), stroke: v ? C.faint : C.ink2, 'stroke-width': v ? 1.5 : 2 }, ax); T(ax, x0 - 12, Y(v) + 6, 15, v, { a: 'end', c: C.muted }); }
  T(ax, x0 - 12, yH - 22, 15, 'EEF saving, US$ per MWh of DC load (> 0 = EEF cheaper)', { c: C.muted, w: 700 });
  for (const v of [0, 50, 100]) { E('line', { x1: x0, x2: x1, y1: YB(v), y2: YB(v), stroke: v ? C.faint : C.ink2, 'stroke-width': v ? 1.5 : 2 }, ax); T(ax, x0 - 12, YB(v) + 6, 15, `${v}%`, { a: 'end', c: C.muted }); }
  T(ax, x0 - 12, yBH - 22, 15, 'Summer evenings freed on the grid (18:00–02:00)', { c: C.muted, w: 700 });
  [50, 60, 70, 80, 85, 90, 97].forEach(v => T(ax, X(v), yB + 28, 15, v, { a: 'middle', c: C.muted }));
  T(ax, (x0 + x1) / 2, yB + 56, 16, 'Displacement of the data center’s use (%)', { a: 'middle', c: C.ink2, w: 600 });
  const bu = P(lt, 6.0, .8);
  if (bu > 0) {
    E('rect', { x: X(85), y: yH, width: X(97) - X(85), height: yT - yH + 20, fill: C.maroon, opacity: (.08 * bu).toFixed(3) }, g);
    E('rect', { x: X(85), y: yBH, width: X(97) - X(85), height: yB - yBH, fill: C.maroon, opacity: (.08 * bu).toFixed(3) }, g);
    T(G(g, { opacity: bu.toFixed(3) }), (X(85) + X(97)) / 2, yT + 12, 18, 'EEF WORKS', { a: 'middle', w: 800, c: C.maroon, ls: 2 });
  }
  E('line', { x1: x0, x2: x1, y1: YB(90), y2: YB(90), stroke: C.ink2, 'stroke-width': 1.2, 'stroke-dasharray': '3 5', opacity: P(lt, 4.6, .5).toFixed(3) }, g);
  const lines = [['riyadh', 'advB', C.bess, 3, null, 1.0], ['neom', 'advB', C.bess, 2.4, '8 6', 1.6], ['riyadh', 'adv', C.maroon, 4.5, null, 2.4], ['neom', 'adv', C.maroon, 3, '8 6', 3.0]];
  lines.forEach(([site, key, col, w, dash, at]) => {
    const u = P(lt, at, 1.4, eIO);
    drawP(g, poly(D[site].map(p => [X(p.X), Y(p[key])])), u, { stroke: col, 'stroke-width': w, 'stroke-dasharray': u >= 1 ? dash : null });
  });
  ['riyadh', 'neom'].forEach((site, i) => {
    const u = P(lt, 4.4 + i * .5, 1.2, eIO);
    drawP(g, poly(D[site].map(p => [X(p.X), YB(p.eve)])), u, { stroke: C.maroon, 'stroke-width': i ? 3 : 4.5, 'stroke-dasharray': u >= 1 && i ? '8 6' : null });
  });
  const lg = inG(g, lt, 3.6, .5, 0);
  const lr = D.riyadh[D.riyadh.length - 1];
  T(lg, X(97) + 10, Y(lr.advB) + 6, 16, 'vs. battery', { w: 800, c: C.bess });
  T(lg, X(97) + 10, Y(lr.adv) + 6, 16, 'vs. cheapest', { w: 800, c: C.maroon });
  T(lg, X(50), Y(21), 15, '— Riyadh    - - NEOM', { c: C.ink2, w: 600 });
  // right card: costs at 90%
  const p9 = D.riyadh.find(p => p.X === 90);
  const rg = inG(g, lt, 6.6, .8, 0, 30);
  card(rg, 1180, 290, 660, 640, { fill: C.paper });
  T(rg, 1210, 334, 16, 'AT 90% DISPLACEMENT · 25 YEARS', { w: 800, c: C.maroon, ls: 2 });
  T(rg, 1210, 360, 15, 'US$/MWh on top of the US$48 tariff, grid room and carbon counted', { c: C.muted });
  [['GRID', p9.grid], ['AM', p9.am], ['RE+BESS', p9.bess], ['EEF', p9.eef]].forEach(([k, v], i) => {
    const y = 392 + i * 58, u = P(lt, 7.0 + i * .3, .8, eIO);
    T(rg, 1210, y + 28, 18, k, { w: 800, c: inkOf(k) });
    E('rect', { x: 1350, y: y + 8, width: 8.4 * v * u, height: 30, rx: 4, fill: k === 'EEF' ? C.maroon : k === 'RE+BESS' ? C.bess : C.am, opacity: k === 'GRID' ? .55 : 1 }, rg);
    T(rg, 1360 + 8.4 * v * u, y + 30, 18, fmt(v, 1), { w: 800, c: k === 'EEF' ? C.maroon : C.ink2 });
  });
  const ng = inG(g, lt, 8.2, .7, 0);
  E('line', { x1: 1210, x2: 1810, y1: 640, y2: 640, stroke: C.rule, 'stroke-width': 1.5 }, ng);
  T(ng, 1210, 676, 18, 'Bill only?', { w: 800, c: C.maroon });
  TP(ng, 1330, 676, 17, `EEF still wins if SPPC buys its PV at ≈ US$${fmt(p9.pv_bill, 0)}/MWh — below the US$48 tariff.`, 480, { c: C.ink, lh: 23 });
  T(ng, 1210, 772, 18, 'Why not 100%?', { w: 800, c: C.maroon });
  TP(ng, 1370, 772, 17, 'Only ≈ 14 dusty or cloudy days a year. The gap is the 5% shifting loss and short winter days; PV × 1.25 reaches ≈ 98%.', 440, { c: C.ink, lh: 23 });
  cap(g, lt, 10.4, 'From 85% the summer evenings are freed; up to 97% EEF stays the cheapest — best at ≈ 90%.', { y: 980 });
}

// ------------------------------------------------------------ results: the size curve
function sSizeCurve(g, lt) {
  head(g, lt, 'THE SIZE CURVE', 'Which data centers should use EEF — at 90% displacement');
  source(g, lt, .5, 'Model results; contract overhead US$0.25 M/yr is an assumption');
  const D = DATA.disp.sites, F28 = DATA.disp.overhead_MUSD * 1e6 / 8760;
  const x0 = 200, x1 = 1100, y0 = 860, y1 = 330, Smax = 1500, X = v => x0 + (x1 - x0) * Math.log10(v) / Math.log10(Smax), Y = c => y0 - (y0 - y1) * (c + 25) / 47;
  const at90 = site => D[site].find(p => p.X === 90), adv = (site, key, S) => at90(site)[key] + F28 / 100 - F28 / S;
  const ax = inG(g, lt, .3, .6, 0);
  for (const c of [-20, -10, 0, 10, 20]) { E('line', { x1: x0, x2: x1, y1: Y(c), y2: Y(c), stroke: c ? C.faint : C.ink2, 'stroke-width': c ? 1.5 : 2 }, ax); T(ax, x0 - 12, Y(c) + 6, 15, c, { a: 'end', c: C.muted }); }
  [[1, '1 MW'], [10, '10 MW'], [100, '100 MW'], [1500, '1.5 GW']].forEach(([v, l]) => T(ax, X(v), y0 + 28, 15, l, { a: 'middle', c: C.muted, w: 600 }));
  T(ax, (x0 + x1) / 2, y0 + 58, 16, 'Data-center size (one campus, log scale)', { a: 'middle', c: C.ink2, w: 600 });
  T(ax, x0 - 12, y1 - 24, 15, 'EEF saving, US$ per MWh of DC load (> 0 = EEF cheaper)', { c: C.muted, w: 700 });
  const smin = DATA.disp.verdict.riyadh.size_min_MW;
  const zu = P(lt, 5.4, .8);
  if (zu > 0) { E('rect', { x: X(smin), y: y1, width: X(Smax) - X(smin), height: y0 - y1, fill: C.maroon, opacity: (.08 * zu).toFixed(3) }, g); T(G(g, { opacity: zu.toFixed(3) }), (X(smin) + X(Smax)) / 2, y1 + 26, 18, `EEF WORKS · ≈ ${fmt(smin, 0)} MW – 1.5 GW`, { a: 'middle', w: 800, c: C.maroon, ls: 2 }); }
  [['riyadh', 'advB', C.bess, 3, null, 1.0], ['neom', 'advB', C.bess, 2.4, '8 6', 1.6], ['riyadh', 'adv', C.maroon, 4.5, null, 2.4], ['neom', 'adv', C.maroon, 3, '8 6', 3.0]].forEach(([site, key, col, w, dash, at]) => {
    const pts = []; for (let lv = 0; lv <= Math.log10(Smax) + 1e-9; lv += .02) { const S = Math.pow(10, lv); pts.push([X(S), Y(Math.max(-25, adv(site, key, S)))]); }
    const u = P(lt, at, 1.6, eIO);
    drawP(g, poly(pts), u, { stroke: col, 'stroke-width': w, 'stroke-dasharray': u >= 1 ? dash : null });
  });
  const lg = inG(g, lt, 4.0, .5, 0);
  T(lg, X(1500) - 8, Y(adv('riyadh', 'advB', 1500)) - 12, 16, 'vs. battery', { a: 'end', w: 800, c: C.bess });
  T(lg, X(1500) - 8, Y(adv('riyadh', 'adv', 1500)) - 12, 16, 'vs. cheapest alternative', { a: 'end', w: 800, c: C.maroon });
  T(lg, X(30), Y(-18), 15, '— Riyadh    - - NEOM', { c: C.ink2, w: 600 });
  const mk = inG(g, lt, 4.6, .6, 0);
  E('line', { x1: X(5), x2: X(5), y1: y0, y2: y1 + 50, stroke: C.ink2, 'stroke-width': 1.2, 'stroke-dasharray': '2 5' }, mk);
  T(mk, X(5) + 6, y0 - 14, 13, '5 MW', { c: C.ink2, w: 700 });
  const verdict = [
    [`< ${fmt(smin, 0)} MW`, 'Group small sites in one contract', `fixed contract costs dominate; EEF still beats a battery from ≈ ${fmt(DATA.disp.verdict.riyadh.size_min_MW_vs_battery, 0)} MW`, C.bess],
    [`${fmt(smin, 0)} MW – 1.5 GW`, 'EEF is the best option', `saves ≈ US$${fmt(at90('riyadh').adv, 1)}/MWh vs. the cheapest alternative, ≈ US$${fmt(at90('riyadh').advB, 0)} vs. a battery`, C.maroon],
    ['> 1.5 GW', 'Groups of campuses — same result', 'the curve stays flat; no single campus is planned above 1.5 GW', C.maroon2],
    ['Flexible load', 'Not a limit today', `one national grid: 7.1–29.9 GW of flexible load; ≈ ${fmt(1.5 * at90('riyadh').pf, 1)} GW serves a 1.5-GW campus`, C.grid],
  ];
  verdict.forEach(([sz, t1, t2, col], i) => {
    const y = 290 + i * 152, vg = inG(g, lt, 6.4 + i * .6, .6, 0, 30);
    E('rect', { x: 1180, y, width: 660, height: 136, rx: 14, fill: i === 1 ? C.maroonT : C.paper, stroke: i === 1 ? C.maroon : C.rule, 'stroke-width': i === 1 ? 2.5 : 1.5 }, vg);
    E('rect', { x: 1180, y, width: 8, height: 136, rx: 3, fill: col }, vg);
    T(vg, 1212, y + 42, 24, sz, { f: F.slab, w: 700, c: col });
    T(vg, 1212, y + 76, 20, t1, { w: 800 });
    TP(vg, 1212, y + 104, 15, t2, 610, { c: C.ink2, lh: 19 });
  });
  cap(g, lt, 9.6, 'EEF suits every data center from ≈ 8 MW up to the largest campus planned — group the smaller ones.', { y: 972 });
}

// ------------------------------------------------------------ conclusion: recommendations
function sRecommend(g, lt) {
  head(g, lt, 'RECOMMENDATIONS', 'When to choose EEF — and how to set it up');
  const p9 = DATA.disp.sites.riyadh.find(p => p.X === 90);
  const recs = [
    ['Size', 'Use EEF for data centers from ≈ 8 MW up to the largest campus (1.5 GW). Group smaller sites in one contract; groups of campuses work the same.'],
    ['Displacement', 'Target 85–97%, best at ≈ 90%: the summer evenings are then ≈ 100% freed and EEF is the cheapest option.'],
    ['Flexibility', `Contract ≈ ${fmt(p9.pf, 1)} MW of flexible load per MW at 90% (1.4 at 80%), shiftable ≥ 8 h — anywhere on the national grid, through the operator.`],
    ['Window & PV', 'Start the daily window at ≈ 09:00 instead of 06:00; above 90%, oversize PV by ≈ 25% (ceiling ≈ 98%).'],
    ['Prices', `Pay flexibility below ≈ US$87/MWh shifted. SPPC buys the EEF-linked PV at US$13.6–${fmt(p9.pv_bill, 0)}/MWh — always below the US$48/MWh tariff.`],
    ['Regulation (SERA)', 'Add an aggregator licence, baseline & M&V rules, hourly certificates, and a PV purchase-price rule that values the grid room EEF frees.'],
  ];
  recs.forEach(([k, txt], i) => {
    const y = 290 + i * 104, rg = inG(g, lt, .7 + i * 1.0, .7, 0, -30);
    card(rg, 80, y, 1760, 90);
    E('circle', { cx: 132, cy: y + 45, r: 26, fill: C.maroon }, rg);
    T(rg, 132, y + 54, 24, String(i + 1), { a: 'middle', f: F.slab, w: 700, c: '#fff' });
    T(rg, 180, y + 54, 22, k, { w: 800, c: C.maroon });
    TP(rg, 420, y + (wrap(txt, 19, 1380).length > 1 ? 40 : 53), 19, txt, 1380, { c: C.ink, lh: 25 });
  });
  cap(g, lt, 7.4, 'Grid-grade reliability, battery-level emissions, the lowest cost — and room left on the grid.', { y: 972 });
}
