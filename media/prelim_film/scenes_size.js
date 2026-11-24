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

// ------------------------------------------------------------ results: where EEF wins, by data-center size
function sSizeMap(g, lt) {
  head(g, lt, 'WHERE EEF WINS — BY SIZE', 'From small data centers to hyperscale campuses');
  source(g, lt, .5, 'Model results, 80% hourly matching; overhead and pool sizes are assumptions');
  const sizes = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000, 3000, 5000, 6600, 10000];
  const x0 = 200, x1 = 1120, y0 = 860, y1 = 330, lx = v => Math.log10(v), X = v => x0 + (x1 - x0) * lx(v) / 4, Y = c => y0 - (y0 - y1) * c / 60;
  const E8 = 8.76e3, var80 = 19.79, bmid = 34.42, blo = 20.62, bhi = 56.2;
  const eef = (S, F, Q) => { const f = Math.min(1, Q / (1.404 * S)); return F * 1e6 / (E8 * S) + f * var80 + (1 - f) * bmid; };
  const ax = inG(g, lt, .3, .6, 0);
  for (const c of [0, 20, 40, 60]) { E('line', { x1: x0, x2: x1, y1: Y(c), y2: Y(c), stroke: c ? C.faint : C.ink2, 'stroke-width': c ? 1.5 : 2 }, ax); T(ax, x0 - 12, Y(c) + 6, 15, c, { a: 'end', c: C.muted }); }
  [[1, '1 MW'], [10, '10 MW'], [100, '100 MW'], [1000, '1 GW'], [10000, '10 GW']].forEach(([v, l]) => T(ax, X(v), y0 + 28, 15, l, { a: 'middle', c: C.muted, w: 600 }));
  T(ax, (x0 + x1) / 2, y0 + 58, 16, 'Data-center size (log scale)', { a: 'middle', c: C.ink2, w: 600 });
  T(ax, x0 - 12, y1 - 24, 15, 'Cost of hourly matching, US$ per MWh of DC load', { c: C.muted, w: 700 });
  // sweet-spot zone
  const zu = P(lt, 6.4, .8);
  if (zu > 0) { E('rect', { x: X(5), y: y1, width: X(1424) - X(5), height: y0 - y1, fill: C.maroon, opacity: (.07 * zu).toFixed(3) }, g); const zl = G(g, { opacity: zu.toFixed(3) }); T(zl, (X(5) + X(1424)) / 2, y1 + 26, 18, 'EEF BEST', { a: 'middle', w: 800, c: C.maroon, ls: 3 }); }
  // battery band
  const bu = P(lt, .8, 1.2, eIO);
  E('rect', { x: x0, y: Y(bhi), width: (x1 - x0) * bu, height: Y(blo) - Y(bhi), fill: C.bessL, opacity: .55 }, g);
  E('line', { x1: x0, x2: x0 + (x1 - x0) * bu, y1: Y(bmid), y2: Y(bmid), stroke: C.bess, 'stroke-width': 4 }, g);
  const bl = inG(g, lt, 1.6, .5, 0);
  T(bl, x1 - 6, Y(bmid) - 10, 16, 'Battery (mid; band = low–high)', { a: 'end', w: 800, c: C.bess });
  // EEF curves
  [[0.25, 2000, C.maroon, 4.5, null, 2.2], [0.25, 7100, C.maroon, 3, '7 6', 3.4], [0.5, 2000, C.maroonL, 2.5, '4 5', 4.2], [0.1, 2000, C.maroonL, 2.5, '4 5', 4.6]].forEach(([F, Q, col, w, dash, at]) => {
    const pts = []; for (let lv = 0; lv <= 4.0001; lv += .02) { const S = Math.pow(10, lv); pts.push([X(S), Y(Math.min(60, eef(S, F, Q)))]); }
    const u = P(lt, at, 1.6, eIO);
    drawP(g, poly(pts), u, { stroke: col, 'stroke-width': w, 'stroke-dasharray': u >= 1 ? dash : null });
  });
  const el = inG(g, lt, 3.8, .5, 0);
  T(el, X(30), Y(17) , 16, 'EEF (overhead US$0.25 M/yr, regional pool 2 GW)', { w: 800, c: C.maroon });
  T(el, X(2000) + 8, Y(21) + 30, 14, 'national pool 7.1 GW', { c: C.maroon, it: true });
  T(inG(g, lt, 5.2, .5, 0), X(2.4), Y(52), 14, 'overhead US$0.1–0.5 M/yr per contract', { c: C.maroon2, it: true });
  // markers
  const mk = inG(g, lt, 5.4, .6, 0);
  [[5, '5 MW', 846], [100, '100 MW', 822], [1500, '1.5 GW · NEOM campus / KSA 2030', y1 + 64], [6600, '6.6 GW · HUMAIN', 846]].forEach(([v, l, ly], i) => {
    E('line', { x1: X(v), x2: X(v), y1: y0, y2: y1 + 50, stroke: C.ink2, 'stroke-width': 1.2, 'stroke-dasharray': '2 5' }, mk);
    T(mk, X(v) + (i === 3 ? -6 : 6), ly, 13, l, { c: C.ink2, w: 700, a: i === 3 ? 'end' : 'start' });
  });
  // verdict by size
  const verdict = [
    ['< 5 MW', 'Close call — pool the sites', 'fixed contract costs dominate; one EEF contract for several small sites', C.bess],
    ['5 MW – 1.4 GW', 'EEF is best', 'US$20–25/MWh vs. US$34 for a battery; ≈ 1.4 MW of loads per MW', C.maroon],
    ['1.4 – 5 GW', 'Hybrid: EEF + storage', 'the regional flexibility pool runs out; EEF still cuts the cost', C.maroon2],
    ['> 5 GW', 'Storage-led, EEF as a supplement', 'beyond the national low estimate of 7.1 GW of flexible load', C.grid],
  ];
  verdict.forEach(([sz, t1, t2, col], i) => {
    const y = 300 + i * 150, vg = inG(g, lt, 6.8 + i * .6, .6, 0, 30);
    E('rect', { x: 1200, y, width: 640, height: 134, rx: 14, fill: i === 1 ? C.maroonT : C.paper, stroke: i === 1 ? C.maroon : C.rule, 'stroke-width': i === 1 ? 2.5 : 1.5 }, vg);
    E('rect', { x: 1200, y, width: 8, height: 134, rx: 3, fill: col }, vg);
    T(vg, 1232, y + 42, 24, sz, { f: F.slab, w: 700, c: col });
    T(vg, 1232, y + 76, 20, t1, { w: 800 });
    TP(vg, 1232, y + 104, 15, t2, 590, { c: C.ink2, lh: 19 });
  });
  cap(g, lt, 9.8, 'EEF is the best option from a few megawatts up to the size of the regional flexibility pool.', { y: 972 });
}

// ------------------------------------------------------------ conclusion: recommendations
function sRecommend(g, lt) {
  head(g, lt, 'RECOMMENDATIONS', 'When to choose EEF — and how to set it up');
  const recs = [
    ['Size', 'Use EEF for data centers from ≈ 5 MW to ≈ 1.4 GW per grid region; pool smaller sites; go hybrid above the regional pool.'],
    ['Flexibility', 'Contract ≈ 1.4 MW of flexible load per MW for 80% (≈ 2.0 for 90%), shiftable ≥ 8 hours within the day.'],
    ['Window & PV', 'Start the daily window at ≈ 09:00 instead of 06:00; for > 90%, oversize PV by ≈ 25% (ceiling ≈ 98%).'],
    ['Prices', 'Pay flexibility below ≈ US$87/MWh shifted (≈ US$215/kW-yr). Sell PV at the NREP benchmark ≈ US$13.6/MWh — below the US$48/MWh purchase tariff.'],
    ['Target', 'Aim for 80% as the base case; the winner is the same from 50% to 90%.'],
    ['Regulation (SERA)', 'Add an aggregator licence, baseline & M&V rules, hourly certificates and a PV purchase-price rule to the framework.'],
  ];
  recs.forEach(([k, txt], i) => {
    const y = 290 + i * 104, rg = inG(g, lt, .7 + i * 1.0, .7, 0, -30);
    card(rg, 80, y, 1760, 90);
    E('circle', { cx: 132, cy: y + 45, r: 26, fill: C.maroon }, rg);
    T(rg, 132, y + 54, 24, String(i + 1), { a: 'middle', f: F.slab, w: 700, c: '#fff' });
    T(rg, 180, y + 54, 22, k, { w: 800, c: C.maroon });
    TP(rg, 420, y + (wrap(txt, 19, 1380).length > 1 ? 40 : 53), 19, txt, 1380, { c: C.ink, lh: 25 });
  });
  cap(g, lt, 7.4, 'Grid-grade reliability, battery-level emissions, lower cost — and less load on the grid at night.', { y: 972 });
}
