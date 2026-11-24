// Preliminary results, research plan, contributions, conclusion and end card.
const CC = { GRID: C.grid, AM: C.am, 'RE+BESS': C.bess, EEF: C.maroon };

function legend(p, x, y, items, s = 18) {
  let xx = x;
  items.forEach(([lab, col, kind]) => {
    if (kind === 'line') E('line', { x1: xx, x2: xx + 26, y1: y - 6, y2: y - 6, stroke: col, 'stroke-width': 4 }, p);
    else if (kind === 'dash') E('line', { x1: xx, x2: xx + 26, y1: y - 6, y2: y - 6, stroke: col, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, p);
    else E('rect', { x: xx, y: y - 16, width: 22, height: 18, rx: 3, fill: col }, p);
    T(p, xx + 34, y, s, lab, { c: C.ink2, w: 600 });
    xx += 34 + tw(lab, s, 600) + 30;
  });
}

// ------------------------------------------------------------ result 1: dispatch on a summer day
function sDispatch(g, lt) {
  head(g, lt, 'RESULT 1  ·  DISPATCH', 'The loads follow the sun — the data center never moves');
  const d = DAY, x0 = 190, x1 = 1370, z = 723, s = 1.057, X = h => x0 + (x1 - x0) * h / 24, Y = v => z - v * s;
  const ax = inG(g, lt, .3, .6, 0);
  for (const v of [-100, 0, 100, 200, 300, 400]) {
    E('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), stroke: v === 0 ? C.ink2 : C.faint, 'stroke-width': v === 0 ? 2 : 1.5 }, ax);
    T(ax, x0 - 12, Y(v) + 6, 16, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v), { a: 'end', c: C.muted });
  }
  T(ax, x0 - 12, Y(400) - 24, 16, 'MW', { a: 'end', c: C.muted, w: 700 });
  for (const hh of [0, 6, 12, 18, 24]) T(ax, X(hh), 888, 16, `${String(hh).padStart(2, '0')}:00`, { a: 'middle', c: C.muted });
  legend(ax, 190, 300, [['PV output', C.sunL], ['Net increase of flexible loads', C.maroonL], ['Net decrease', C.maroon], ['Data center', C.dc, 'line']], 17);
  const pu = P(lt, .6, 1.4, eIO);
  if (pu > 0) {
    const pts = sample(h => PV(h) * pu, 0, 24, 192);
    E('path', { d: `M${X(0)},${Y(0)} ` + pts.map(q => `L${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(' ') + ` L${X(24)},${Y(0)} Z`, fill: C.sunL, stroke: C.sun, 'stroke-width': 2, opacity: .9 }, g);
  }
  const hc = (lt - 2.4) * 24 / 7;
  for (let i = 0; i < 24; i++) {
    const u = clamp((hc - i) / 1.2);
    if (u <= 0) continue;
    const bx = X(i) + 6, bw = (x1 - x0) / 24 - 12;
    if (d.up[i] > 0) E('rect', { x: bx, y: Y(d.up[i] * u), width: bw, height: d.up[i] * s * u, fill: C.maroonL, rx: 2 }, g);
    if (d.down[i] > 0) E('rect', { x: bx, y: z, width: bw, height: d.down[i] * s * u, fill: C.maroon, rx: 2 }, g);
  }
  drawP(g, `M${X(0)},${Y(100)} H${X(24)}`, P(lt, 1.6, 1, eIO), { stroke: C.dc, 'stroke-width': 3.5, 'stroke-dasharray': '10 6' });
  if (hc > 0 && hc < 24) E('line', { x1: X(hc), x2: X(hc), y1: Y(400), y2: Y(-130), stroke: C.maroon, 'stroke-width': 2, opacity: .5 }, g);
  const c1 = inG(g, lt, 9.8, .6, 8);
  T(c1, X(12), Y(150) - 14, 18, 'up to +150 MW', { a: 'middle', w: 700, c: C.maroon2 });
  T(c1, X(3), Y(-100) + 34, 18, '−100 MW all night', { a: 'middle', w: 700, c: C.maroon });
  T(c1, X(21.5), Y(-100) + 34, 18, '−100 MW', { a: 'middle', w: 700, c: C.maroon });
  // side panel
  const rg = inG(g, lt, 1.2, .8, 14);
  T(rg, 1470, 330, 16, 'RIYADH · SUMMER DAY', { w: 700, c: C.muted, ls: 3 });
  pill(rg, 1470, 372, 'Pᶠ = 150 MW  ·  D = 8 h', { s: 18 });
  T(rg, 1470, 470, 20, 'Annual hourly matching', { w: 600, c: C.ink2 });
  T(rg, 1470, 532, 50, '40.4%', { f: F.slab, w: 700, c: C.am });
  const r2 = inG(g, lt, 9.2, .8, 10);
  T(r2, 1470, 600, 30, '↓', { c: C.maroon, w: 700 });
  T(r2, 1466, 690, 84, fmt(lerp(40.4, DATA.dispatch_summary.cfe, P(lt, 9.2, 1.6, eIO)), 1) + '%', { f: F.slab, w: 700, c: C.maroon });
  T(r2, 1470, 732, 20, `with EEF  ·  ${fmt(DATA.dispatch_summary.shifted_GWh, 1)} GWh/yr shifted`, { c: C.ink2 });
  cap(g, lt, 11.2, 'Up to +150 MW around noon, −100 MW all night — and hourly matching doubles.');
}

// ------------------------------------------------------------ result 2: how much flexibility
function sCurve(g, lt) {
  head(g, lt, 'RESULT 2  ·  HOW MUCH FLEXIBILITY?', '≈ 1.4 MW of flexibility per MW of data center for 80%');
  const x0 = 200, x1 = 1270, y0 = 860, y1 = 320, X = v => x0 + (x1 - x0) * v / 3.2, Y = c => y0 - (y0 - y1) * (c - 40) / 60;
  const ax = inG(g, lt, .3, .6, 0);
  for (const c of [40, 50, 60, 70, 80, 90, 100]) { E('line', { x1: x0, x2: x1, y1: Y(c), y2: Y(c), stroke: c === 40 ? C.ink2 : C.faint, 'stroke-width': c === 40 ? 2 : 1.5 }, ax); T(ax, x0 - 12, Y(c) + 6, 16, `${c}%`, { a: 'end', c: C.muted }); }
  for (const v of [0, .5, 1, 1.5, 2, 2.5, 3]) T(ax, X(v), y0 + 30, 16, v.toFixed(1), { a: 'middle', c: C.muted });
  T(ax, (x0 + x1) / 2, y0 + 62, 18, 'Contracted flexible power / data-center load  (Pᶠ / L)', { a: 'middle', c: C.ink2, w: 600 });
  T(ax, x0 - 12, y1 - 26, 16, 'Hourly matching', { a: 'end', c: C.muted, w: 700 });
  legend(ax, 760, y0 - 30, [['D = 8 h', C.maroon, 'line'], ['D = 12 h', C.maroonL, 'dash'], ['D = 4 h', C.am, 'dash']], 17);
  const curve = (key, u, attrs) => {
    const pts = DATA.cfe_curves[key], f = mono(pts.map(q => q[0]), pts.map(q => q[1]));
    const sm = sample(f, 0, 3.2, 200).map(q => [X(q[0]), Y(q[1])]);
    return drawP(g, poly(sm), u, attrs);
  };
  curve('4', P(lt, 4.0, 2.0, eIO), { stroke: C.am, 'stroke-width': 3.5, 'stroke-dasharray': P(lt, 4.0, 2.0) >= 1 ? '9 6' : null });
  curve('8', P(lt, .8, 2.8, eIO), { stroke: C.maroon, 'stroke-width': 5.5, 'stroke-linecap': 'round' });
  if (P(lt, 6.0, 1.2) > 0) curve('12', P(lt, 6.0, 1.2), { stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: .9 });
  const am = inG(g, lt, 1.0, .5, 0);
  E('circle', { cx: X(0), cy: Y(40.4), r: 8, fill: C.am }, am);
  E('line', { x1: X(0) + 6, y1: Y(40.4) - 4, x2: X(.62), y2: Y(45.4), stroke: C.grid, 'stroke-width': 1.5 }, am);
  pill(am, X(.62), Y(45.4), '40.4% — annual matching alone', { s: 16, fill: C.paper, stroke: C.am, c: C.grid });
  const g80 = inG(g, lt, 7.2, .6, 0);
  E('path', { d: `M${X(0)},${Y(80)} H${X(1.4)} V${y0}`, fill: 'none', stroke: C.maroon, 'stroke-width': 2, 'stroke-dasharray': '4 5' }, g80);
  E('circle', { cx: X(1.4), cy: Y(80), r: 9, fill: C.maroon, stroke: '#fff', 'stroke-width': 3 }, g80);
  pill(g80, X(1.4) + 22, Y(80) + 40, '1.4× → 80%', { s: 19, fill: C.maroon, c: '#fff' });
  const gmx = inG(g, lt, 8.6, .6, 0);
  E('line', { x1: X(0), x2: X(3.2), y1: Y(91.2), y2: Y(91.2), stroke: C.ink2, 'stroke-width': 1.5, 'stroke-dasharray': '3 5' }, gmx);
  T(gmx, X(3.2), Y(91.2) - 14, 17, `${DATA.max_cfe}% ceiling — each 24-h window must be energy-neutral`, { a: 'end', c: C.ink2, w: 600 });
  const tk = [['≈ 1.4 MW', 'of flexibility per MW of data center reaches 80% hourly matching'], ['8 h = 12 h', 'beyond 8 hours, duration barely matters — power is the binding resource'], ['≈ 1.7×', 'the power is needed if loads can shift for only 4 hours']];
  tk.forEach(([big, txt], i) => {
    const tg = inG(g, lt, 3.2 + i * 2.6, .7, 0, 30);
    const y = 330 + i * 190;
    E('rect', { x: 1370, y, width: 6, height: 150, fill: C.maroon }, tg);
    T(tg, 1398, y + 50, 42, big, { f: F.slab, w: 700, c: C.maroon });
    TP(tg, 1400, y + 92, 20, txt, 430, { c: C.ink2, lh: 27 });
  });
}

// ------------------------------------------------------------ result 3: three pillars
function sResPillars(g, lt) {
  head(g, lt, 'RESULT 3  ·  THREE PILLARS AT 80% HOURLY MATCHING', 'Grid reliability, battery-level emissions, lower cost');
  const pl = DATA.pillars, lg = inG(g, lt, .4, .6, 0);
  legend(lg, 80, 300, pl.map(p => [p.config, CC[p.config]]), 19);
  const panels = [
    ['(a) Reliability', 'data-center load served, %', p => p.served, 118, 1.0, v => `${fmt(v)}%`, 'Identical: the data center is always grid-supplied'],
    ['(b) Emissions', 'hourly-accounted, kt CO₂ / yr', p => p.em_kt, 560, 4.4, v => fmt(v, 1), 'EEF = battery — one third of annual matching'],
    ['(c) Cost of hourly matching', 'US$ million / yr (range: cost cases)', p => p.cost_mid, 52, 7.8, v => fmt(v, 1), `EEF ≈ ${fmt(100 * (1 - pl[3].cost_mid / pl[2].cost_mid))}% cheaper, with no new storage`],
  ];
  panels.forEach(([ttl, unit, get, vmax, at, lab, note], k) => {
    const px = 80 + k * 600, base = 790, hmax = 380;
    const tg = inG(g, lt, at - .4, .6, 10);
    T(tg, px, 362, 24, ttl, { w: 800 });
    T(tg, px, 390, 17, unit, { c: C.muted });
    E('line', { x1: px, x2: px + 520, y1: base, y2: base, stroke: C.ink2, 'stroke-width': 2 }, tg);
    pl.forEach((p, i) => {
      const bx = px + 30 + i * 125, v = get(p), u = P(lt, at + i * .25, 1.0, eIO);
      const xl = inG(g, lt, at, .5, 0);
      T(xl, bx + 40, base + 30, 17, p.config, { a: 'middle', w: 700, c: CC[p.config] === C.am ? C.grid : CC[p.config] });
      if (k === 2 && v === 0) {
        const ng = inG(g, lt, at + i * .25 + .4, .5, 6);
        T(ng, bx + 40, base - 34, 15, 'no hourly', { a: 'middle', c: C.muted, w: 600 });
        T(ng, bx + 40, base - 14, 15, 'matching', { a: 'middle', c: C.muted, w: 600 });
        return;
      }
      if (u <= 0) return;
      const h = hmax * v / vmax * u;
      E('rect', { x: bx, y: base - h, width: 80, height: h, rx: 4, fill: CC[p.config] }, g);
      const vg = inG(g, lt, at + i * .25 + .8, .5, 6);
      let ytop = base - hmax * v / vmax;
      if (k === 2) {
        const yl = base - hmax * p.cost_lo / vmax, yh = base - hmax * p.cost_hi / vmax;
        E('line', { x1: bx + 40, x2: bx + 40, y1: yl, y2: yh, stroke: C.ink, 'stroke-width': 2.5 }, vg);
        for (const yy of [yl, yh]) E('line', { x1: bx + 28, x2: bx + 52, y1: yy, y2: yy, stroke: C.ink, 'stroke-width': 2.5 }, vg);
        ytop = Math.min(ytop, yh);
        T(vg, bx + 40, base - 14, 20, lab(v), { a: 'middle', w: 700, c: '#fff' });
        T(vg, bx + 40, ytop - 14, 14, p.config === 'EEF' ? 'no storage' : `+${fmt(p.storage_MWh)} MWh`, { a: 'middle', c: C.ink2, w: 700 });
      } else T(vg, bx + 40, ytop - 12, 19, lab(v), { a: 'middle', w: 700, c: CC[p.config] === C.am ? C.grid : CC[p.config] });
    });
    const ng = inG(g, lt, at + 1.8, .6, 6);
    TP(ng, px, 864, 18, note, 520, { it: true, w: 600, c: C.maroon });
  });
  const vu = P(lt, 12.6, .9, eIO);
  if (vu > 0) {
    const vg = G(g, { opacity: vu.toFixed(3) });
    E('rect', { x: 960 - 880 * vu, y: 912, width: 1760 * vu, height: 70, rx: 12, fill: C.maroon }, vg);
    TR(vg, 960, 957, 25, [['EEF  =  ', { w: 800 }], ['reliability of the grid  +  emissions of a battery  +  a lower cost', {}]], { a: 'middle', c: '#fff' });
  }
}

// ------------------------------------------------------------ result 4: what EEF replaces, and the break-even price
function sBreakeven(g, lt) {
  head(g, lt, 'RESULT 4  ·  WHAT IT REPLACES', 'Flexibility instead of storage — and the price that decides');
  const rows = DATA.targets.filter(t => [60, 80, 90].includes(t.X));
  const lg = inG(g, lt, .4, .6, 0);
  T(lg, 80, 316, 16, 'RESOURCE NEEDED FOR EACH HOURLY-MATCHING TARGET', { w: 700, c: C.muted, ls: 3 });
  rows.forEach((t, i) => {
    const y = 400 + i * 160, at = .8 + i * .8;
    const rg = inG(g, lt, at, .6, 0);
    T(rg, 80, y + 22, 44, `${t.X}%`, { f: F.slab, w: 700 });
    const u = P(lt, at + .2, 1.0, eIO);
    E('rect', { x: 230, y: y - 22, width: 380 * t.flex_MW / 210 * u, height: 34, rx: 4, fill: C.maroon }, g);
    E('rect', { x: 230, y: y + 22, width: 380 * t.bess_MWh / 1350 * u, height: 34, rx: 4, fill: C.bess }, g);
    const vg = inG(g, lt, at + .9, .5, 0);
    T(vg, 240 + 380 * t.flex_MW / 210, y + 2, 19, `${fmt(t.flex_MW)} MW flexibility`, { w: 700, c: C.maroon });
    T(vg, 240 + 380 * t.bess_MWh / 1350, y + 46, 19, `or ${fmt(t.bess_MWh)} MWh battery`, { w: 700, c: C.bess });
  });
  // price ruler
  const r0 = 1060, r1 = 1800, yA = 580, X = v => r0 + (r1 - r0) * v / 150;
  const pg = inG(g, lt, 3.4, .7, 0);
  T(pg, 1020, 316, 16, 'PRICE PAID PER MWh SHIFTED (US$)', { w: 700, c: C.muted, ls: 3 });
  const zu = P(lt, 3.8, 1.2, eIO);
  E('rect', { x: r0, y: yA - 70, width: (X(87) - r0) * zu, height: 70, fill: C.maroonT }, g);
  E('rect', { x: X(87), y: yA - 70, width: (r1 - X(87)) * P(lt, 4.6, 1.0, eIO), height: 70, fill: C.bessL }, g);
  E('line', { x1: r0, x2: r1, y1: yA, y2: yA, stroke: C.ink2, 'stroke-width': 2 }, pg);
  for (const v of [0, 25, 50, 75, 100, 125, 150]) { E('line', { x1: X(v), x2: X(v), y1: yA, y2: yA + 8, stroke: C.ink2, 'stroke-width': 2 }, pg); T(pg, X(v), yA + 30, 16, v, { a: 'middle', c: C.muted }); }
  const zl = inG(g, lt, 4.8, .6, 0);
  T(zl, (r0 + X(87)) / 2, yA - 28, 19, 'EEF cheaper', { a: 'middle', w: 800, c: C.maroon });
  T(zl, (X(87) + r1) / 2, yA - 28, 19, 'battery cheaper', { a: 'middle', w: 800, c: C.bess });
  const mk = inG(g, lt, 5.6, .7, 0);
  E('line', { x1: X(87), x2: X(87), y1: yA - 120, y2: yA + 4, stroke: C.maroon, 'stroke-width': 3.5 }, mk);
  T(mk, X(87), yA - 172, 40, '≈ US$87', { a: 'middle', f: F.slab, w: 700, c: C.maroon });
  T(mk, X(87), yA - 136, 17, 'break-even, mid battery cost', { a: 'middle', c: C.ink2, w: 600 });
  const br = inG(g, lt, 7.0, .7, 0);
  E('path', { d: `M${X(51)},${yA + 60} V${yA + 70} H${X(146)} V${yA + 60}`, fill: 'none', stroke: C.ink2, 'stroke-width': 2 }, br);
  T(br, (X(51) + X(146)) / 2, yA + 98, 17, 'US$51–146 across low/high battery-cost cases', { a: 'middle', c: C.ink2 });
  E('path', { d: `M${X(25)},${yA + 130} V${yA + 140} H${X(75)} V${yA + 130}`, fill: 'none', stroke: C.maroon, 'stroke-width': 2 }, br);
  T(br, X(50), yA + 168, 17, 'flexibility price assumed: US$25–75', { a: 'middle', c: C.maroon, w: 600 });
  const kw = inG(g, lt, 8.4, .7, 8);
  TP(kw, 1020, 820, 21, 'In capacity terms: ≈ US$191–235 per kW-year of contracted flexibility (mid case).', 800, { c: C.ink2 });
  cap(g, lt, 9.4, 'Contracting flexibility beats building batteries whenever it costs less than about US$87 per MWh shifted.');
}

// ------------------------------------------------------------ result 5: seasons and sensitivity
function sSeasons(g, lt) {
  head(g, lt, 'RESULT 5  ·  SEASONS & SENSITIVITY', 'Summer is easy; winter is where the daily window binds');
  const M = DATA.monthly, x0 = 200, x1 = 1170, y0 = 840, y1 = 330, X = m => x0 + (x1 - x0) * (m - 1) / 11, Y = c => y0 - (y0 - y1) * (c - 30) / 60;
  const ax = inG(g, lt, .3, .6, 0);
  for (const c of [30, 45, 60, 75, 90]) { E('line', { x1: x0 - 20, x2: x1 + 20, y1: Y(c), y2: Y(c), stroke: c === 30 ? C.ink2 : C.faint, 'stroke-width': c === 30 ? 2 : 1.5 }, ax); T(ax, x0 - 32, Y(c) + 6, 16, `${c}%`, { a: 'end', c: C.muted }); }
  'JFMAMJJASOND'.split('').forEach((l, i) => T(ax, X(i + 1), y0 + 30, 16, l, { a: 'middle', c: C.muted, w: 700 }));
  T(ax, x0 - 32, y1 - 44, 16, 'Monthly hourly matching (annual target 80%)', { c: C.muted, w: 700 });
  legend(ax, 620, y0 - 24, [['EEF', C.maroon, 'line'], ['RE+BESS', C.bess, 'line'], ['AM', C.am, 'line']], 17);
  [['AM', C.am, 3.5, .6], ['BESS', C.bess, 4, 1.4], ['EEF', C.maroon, 5, 2.2]].forEach(([k, col, sw, at]) => {
    const pts = M.map(r => [X(r.m), Y(r[k])]);
    const u = P(lt, at, 1.6, eIO);
    drawP(g, poly(pts), u, { stroke: col, 'stroke-width': sw, 'stroke-linejoin': 'round' });
    if (u >= 1) pts.forEach(q => E('circle', { cx: q[0], cy: q[1], r: 5, fill: col }, g));
  });
  const jun = M[5], dec = M[11];
  const c1 = inG(g, lt, 4.6, .6, 8);
  E('line', { x1: X(6), x2: X(6), y1: Y(jun.BESS) + 8, y2: Y(70) - 18, stroke: C.maroon, 'stroke-width': 1.5 }, c1);
  pill(c1, X(6), Y(70), `Jun  ${fmt(jun.EEF, 1)}% vs ${fmt(jun.BESS, 1)}%`, { a: 'middle', s: 16, fill: C.paper, stroke: C.maroon });
  const c2 = inG(g, lt, 5.6, .6, 8);
  pill(c2, X(11.4), Y(dec.EEF) + 50, `Dec  ${fmt(dec.EEF, 1)}% vs ${fmt(dec.BESS, 1)}%`, { a: 'middle', s: 16, fill: C.paper, stroke: C.bess, c: C.bess });
  const tiles = [['PV +25–50%', 'raises the EEF ceiling from 91.2% to 93.1–93.7%'], ['90% target', 'needs 151–162 MW instead of 203 MW with oversized PV'], ['η = 0.85', '163 MW for 80% (vs. 140 MW at η = 0.95)']];
  tiles.forEach(([big, txt], i) => {
    const tg = inG(g, lt, 6.4 + i * 1.2, .7, 0, 30), y = 320 + i * 180;
    card(tg, 1290, y, 550, 160);
    T(tg, 1320, y + 58, 34, big, { f: F.slab, w: 700, c: C.maroon });
    TP(tg, 1320, y + 100, 20, txt, 490, { c: C.ink2, lh: 27 });
  });
  cap(g, lt, 8.6, 'Loads shift energy within a day; a battery can carry it across days — modest PV oversizing closes the gap.');
}

// ------------------------------------------------------------ result 6: location and national scale
function sScale(g, lt) {
  head(g, lt, 'RESULT 6  ·  LOCATION & SCALE', 'It holds at NEOM — and at national scale');
  const hg = inG(g, lt, .5, .6, 0);
  T(hg, 80, 316, 16, 'SECOND SITE: NEOM–OXAGON, RED SEA COAST', { w: 700, c: C.muted, ls: 3 });
  T(hg, 640, 372, 21, 'Riyadh', { a: 'middle', w: 800 });
  T(hg, 820, 372, 21, 'NEOM', { a: 'middle', w: 800, c: C.maroon });
  E('line', { x1: 80, x2: 900, y1: 392, y2: 392, stroke: C.rule, 'stroke-width': 2 }, hg);
  const rows = [['Annual matching alone', '40.4%', '41.5%'], ['Flexibility for 80%', '140 MW', '134 MW'], ['Battery for 80%', '1,027 MWh', '995 MWh'], ['Break-even price (mid)', '≈ US$87', 'US$86.7'], ['Maximum EEF matching', '91.2%', '89.5%']];
  rows.forEach(([lab, a, b], i) => {
    const y = 444 + i * 78, rg = inG(g, lt, 1.0 + i * .6, .6, 0, -24);
    if (i % 2 === 0) E('rect', { x: 80, y: y - 40, width: 820, height: 72, rx: 8, fill: C.faint, opacity: .6 }, rg);
    T(rg, 100, y + 4, 21, lab, { c: C.ink2 });
    T(rg, 640, y + 6, 25, a, { a: 'middle', f: F.slab, w: 700 });
    T(rg, 820, y + 6, 25, b, { a: 'middle', f: F.slab, w: 700, c: C.maroon });
  });
  // national scale
  const x0 = 1060, x1 = 1800, X = v => x0 + (x1 - x0) * v / 30;
  const ng = inG(g, lt, 4.4, .7, 0);
  T(ng, 1020, 316, 16, 'NATIONAL SCALE: 1.5 GW OF DATA CENTERS BY 2030', { w: 700, c: C.muted, ls: 3 });
  E('line', { x1: x0, x2: x1, y1: 760, y2: 760, stroke: C.ink2, 'stroke-width': 2 }, ng);
  for (const v of [0, 10, 20, 30]) T(ng, X(v), 790, 16, `${v} GW`, { a: 'middle', c: C.muted });
  const bars = [['Flexibility for 80%', 2.1, C.maroon, 4.8], ['Flexibility for 90%', 3.0, C.maroon2, 5.4]];
  bars.forEach(([lab, v, col, at], i) => {
    const y = 400 + i * 100, u = P(lt, at, .9, eIO), bg = inG(g, lt, at, .5, 0);
    T(bg, 1020, y - 12, 19, lab, { w: 600, c: C.ink2 });
    E('rect', { x: x0, y, width: (X(v) - x0) * u, height: 40, rx: 4, fill: col }, g);
    T(bg, X(v) + 14, y + 29, 24, `${v.toFixed(1)} GW`, { f: F.slab, w: 700, c: col });
  });
  const du = P(lt, 6.4, 1.2, eIO);
  const dg = inG(g, lt, 6.4, .5, 0);
  T(dg, 1020, 608, 19, 'Industrial demand-response potential, 2030', { w: 600, c: C.ink2 });
  E('rect', { x: X(7.1), y: 620, width: (X(29.9) - X(7.1)) * du, height: 40, rx: 4, fill: 'url(#hG)', stroke: C.grid, 'stroke-width': 2 }, g);
  const dl = inG(g, lt, 7.4, .5, 0);
  E('line', { x1: X(7.1), x2: X(7.1), y1: 372, y2: 620, stroke: C.grid, 'stroke-width': 1.5, 'stroke-dasharray': '4 5' }, dl);
  T(dl, X(7.1) + 10, 384, 15, 'below even the low estimate', { c: C.grid, w: 600, it: true });
  T(dl, X(7.1), 690, 18, '7.1', { a: 'middle', w: 700, c: C.grid });
  T(dl, X(29.9), 690, 18, '29.9 GW', { a: 'middle', w: 700, c: C.grid });
  TP(dl, 1020, 840, 18, 'Potential assessed for peak shaving rather than daily shifting (KAPSARC, 2026).', 800, { it: true, c: C.muted });
  cap(g, lt, 8.2, 'The result holds on the Red Sea coast — and the national need sits well within the estimated potential.');
}

// ------------------------------------------------------------ research plan
function sPlan(g, lt) {
  head(g, lt, 'DISSERTATION ROADMAP', 'From one paper to a dissertation');
  const ch = [
    ['1', 'Introduction', 'Motivation, problem, questions', 'frame', ''],
    ['2', 'Literature Review', '53 references, the gap', 'done', ''],
    ['3', 'EEF Concept & Planning', 'Model, four scenarios, Riyadh & NEOM', 'prelim', 'RQ1'],
    ['4', 'Operational Control', 'Day-ahead + MPC under uncertainty', 'plan', 'RQ2'],
    ['5', 'Decision Maps & Contracts', 'When EEF wins; market design', 'plan', 'RQ3'],
    ['6', 'Saturation & Expansion', 'Limits as capacity grows', 'plan', 'RQ4'],
    ['7', 'Conclusions', 'Contributions, future work', 'plan', ''],
  ];
  const ST = { frame: ['Framed here', C.paper, C.maroon], done: ['Complete', C.maroon, '#fff'], prelim: ['Preliminary results', 'url(#hM)', C.maroon], plan: ['Planned', C.paper, C.maroon] };
  ch.forEach(([n, ttl, sub, st, rq], i) => {
    const x = 80 + i * 254, w = 234, at = .6 + i * .45;
    const cg = inG(g, lt, at, .7, 26);
    const [lab, fill, ink] = ST[st];
    E('rect', { x, y: 290, width: w, height: 330, rx: 14, fill, stroke: C.maroon, 'stroke-width': st === 'plan' || st === 'frame' ? 2 : 0, 'stroke-dasharray': st === 'plan' ? '8 6' : null, filter: st === 'done' ? 'url(#sh)' : null }, cg);
    if (st === 'prelim') E('rect', { x: x + 12, y: 302, width: w - 24, height: 306, rx: 10, fill: C.paper, opacity: .93 }, cg);
    T(cg, x + 24, 370, 62, n, { f: F.slab, w: 700, c: st === 'done' ? '#fff' : C.maroon, op: st === 'plan' ? .5 : 1 });
    let yy = 420;
    wrap(ttl, 22, w - 44, 800).forEach(l => { T(cg, x + 24, yy, 22, l, { w: 800, c: st === 'done' ? '#fff' : C.ink }); yy += 28; });
    yy += 6;
    wrap(sub, 17, w - 44).forEach(l => { T(cg, x + 24, yy, 17, l, { c: st === 'done' ? '#fff' : C.muted, op: st === 'done' ? .85 : 1 }); yy += 23; });
    if (rq) pill(cg, x + 24, 560, rq, { s: 15, fill: st === 'done' ? 'rgba(255,255,255,.2)' : C.maroonT });
    T(cg, x + 24, 600, 14, lab.toUpperCase(), { w: 700, c: st === 'done' ? '#fff' : C.maroon, ls: 2 });
    if (st === 'done') ico(cg, 'check', x + w - 40, 350, .7, '#fff', 6);
  });
  const ng = inG(g, lt, 4.4, .7, 10);
  T(ng, 80, 690, 16, 'NEXT STEPS', { w: 700, c: C.muted, ls: 3 });
  const steps = ['Multi-class flexibility portfolio with costs', 'Forecast uncertainty: day-ahead + MPC', 'Multi-year weather and marginal emissions', 'Single-buyer and liberalized market contracts', 'Saturation as data-center capacity grows', 'Pilot design with SERA, SPPC and Saudi Energy'];
  let x = 80, y = 740;
  steps.forEach((s2, i) => {
    const w = tw(s2, 18, 600) + 32;
    if (x + w > 1840) { x = 80; y += 56; }
    const sg = inG(g, lt, 4.8 + i * .35, .5, 8);
    pill(sg, x, y, s2, { s: 18, fill: C.paper, stroke: C.maroon });
    x += w + 14;
  });
  const pg = inG(g, lt, 7.4, .7, 10);
  E('rect', { x: 80, y: 868, width: 1760, height: 66, rx: 12, fill: C.maroonT }, pg);
  TR(pg, 108, 910, 21, [['PUBLICATIONS   ', { w: 800, c: C.maroon }], ['TPEC 2027 — EEF concept and Riyadh case (submission, Nov 2026)   ·   journal articles planned from Chapters 4–6', { c: C.ink }]]);
}

// ------------------------------------------------------------ contributions
const CONTRIB = [
  ['A new concept', 'External Energy Flexibility, with an internal-vs-external flexibility taxonomy and an hourly accounting rule'],
  ['A planning model', 'and a three-pillar comparison against direct grid supply, annual matching and renewables + battery'],
  ['A control design', 'hierarchical, from planning to settlement, tested under forecast uncertainty'],
  ['Decision maps', 'generalized conditions for when EEF wins, and a contractual framework for single-buyer and liberalized markets'],
  ['Saturation limits', 'how far external flexibility goes as data-center capacity grows, and the best mix beyond it'],
];
function sContrib(g, lt) {
  head(g, lt, 'EXPECTED CONTRIBUTIONS', 'Five contributions');
  CONTRIB.forEach(([a, b], i) => {
    const y = 300 + i * 124, at = .7 + i * 1.3;
    const rg = inG(g, lt, at, .8, 0, -40);
    card(rg, 80, y, 1760, 104);
    E('circle', { cx: 150, cy: y + 52, r: 34, fill: C.maroon }, rg);
    T(rg, 150, y + 66, 36, String(i + 1), { a: 'middle', f: F.slab, w: 700, c: '#fff' });
    T(rg, 218, y + 62, 28, a, { f: F.slab, w: 700, c: C.maroon });
    const aw = tw(a, 28, 700, F.slab);
    TP(rg, 218 + aw + 24, y + 61, 22, b, 1560 - aw - 24, { c: C.ink2, lh: 30 });
  });
}

// ------------------------------------------------------------ conclusion
function sConclusion(g, lt) {
  const k = inG(g, lt, .1, .7, 0); T(k, 80, 150, 18, 'CONCLUSION', { w: 700, c: C.maroon, ls: 4 });
  const items = [
    ['shield', 'RELIABILITY', 'Identical to direct grid supply — the data center is never touched.'],
    ['leaf', 'EMISSIONS', '99.5 kt CO₂/yr at 80% matching: the same as a battery, one third of annual matching.'],
    ['cost', 'COST', '≈ US$17 M/yr vs. US$30 M/yr for storage — whenever flexibility costs < ≈ US$87/MWh shifted.'],
    ['pylon', 'LOCATION', 'Holds at NEOM–Oxagon: 134 MW of flexibility for 80%; ≈ 2 GW for the 1.5-GW campus.'],
    ['doc', 'APPLICATION', 'Works inside the single-buyer market: SPPC buys the PV, Saudi Energy supplies, a SERA-licensed aggregator delivers.'],
  ];
  const dim = 1 - .55 * P(lt, 10.2, 1.0, eIO);
  items.forEach(([ik, nm, txt], i) => {
    const y = 196 + i * 102, rg = inG(g, lt, .5 + i * 1.4, .8, 0, -30);
    rg.setAttribute('opacity', (Number(rg.getAttribute('opacity')) * dim).toFixed(3));
    E('circle', { cx: 130, cy: y + 40, r: 44, fill: C.maroonT }, rg);
    ico(rg, ik, 130, y + 40, .5, C.maroon, 5);
    T(rg, 200, y + 26, 18, nm, { w: 800, c: C.maroon, ls: 4 });
    T(rg, 200, y + 64, 27, txt, { c: C.ink });
  });
  const t1 = inG(g, lt, 10.6, 1.0, 18);
  T(t1, 960, 820, 64, 'The sun goes to the loads.', { a: 'middle', f: F.slab, w: 700, c: C.ink });
  const t2 = inG(g, lt, 12.0, 1.0, 18);
  T(t2, 960, 904, 64, 'The night comes back to the data center.', { a: 'middle', f: F.slab, w: 700, c: C.maroon });
  drawP(g, 'M760,940 H1160', P(lt, 13.0, 1.0, eIO), { stroke: C.maroon, 'stroke-width': 4, 'stroke-linecap': 'round' });
}

// ------------------------------------------------------------ end card
function sEnd(g, lt) {
  E('rect', { width: W, height: H, fill: C.maroon }, g);
  E('rect', { width: W, height: H, fill: 'url(#hW)', opacity: .18 }, g);
  const cx = 1500, cy = 470;
  drawP(g, `M${cx - 190},${cy} A190,190 0 1 1 ${cx + 190},${cy} A190,190 0 1 1 ${cx - 190},${cy}`, P(lt, .2, 2.0, eIO), { stroke: 'rgba(255,255,255,.28)', 'stroke-width': 2 });
  drawP(g, `M${cx - 300},${cy + 120} H${cx + 300}`, P(lt, .6, 1.6, eIO), { stroke: '#fff', 'stroke-width': 4, opacity: .55 });
  const su = P(lt, .8, 1.6, eIO);
  E('circle', { cx, cy: cy + 70 - 90 * su, r: 58, fill: '#fff', opacity: (.16 * su).toFixed(3) }, g);
  const a = inG(g, lt, .3, 1, 24); T(a, 136, 480, 120, 'Thank you', { f: F.slab, w: 700, c: '#fff' });
  const b = inG(g, lt, 1.0, 1, 16); T(b, 142, 556, 36, 'Questions & discussion', { w: 300, c: '#fff', op: .92 });
  const d = inG(g, lt, 1.8, 1, 14);
  E('rect', { x: 142, y: 690, width: 6, height: 118, fill: '#fff', opacity: .8 }, d);
  T(d, 172, 728, 38, 'Ali Nasser', { w: 700, c: '#fff' });
  T(d, 172, 770, 25, 'PhD Resident  ·  Department of Electrical & Computer Engineering', { c: '#fff', op: .88 });
  T(d, 172, 804, 25, 'Texas A&M University', { c: '#fff', op: .88 });
  const fo = 1 - P(lt, 7.0, 1.0, eIO);
  if (fo < 1) E('rect', { width: W, height: H, fill: '#000', opacity: (1 - fo).toFixed(3) }, g);
}
