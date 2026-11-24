// Added scenes: how the model works, all-scenario comparisons, the NEOM case and expected results.
const NEO = '#2B6F77', NEOL = '#D6E9EB';
const CFGS = ['GRID', 'AM', 'RE+BESS', 'EEF'];
const inkOf = k => (CC[k] === C.am ? C.grid : CC[k]);

function flowPath(p, d, lt, at, col = C.maroon, n = 4, speed = 90) {
  const u = P(lt, at, .8, eIO);
  const e = drawP(p, d, u, { stroke: C.rule, 'stroke-width': 3 });
  if (u >= 1) particles(p, e, lt, n, speed, col, 4.5, .9);
}

// ------------------------------------------------------------ methodology: model pipeline
function sPipeline(g, lt) {
  head(g, lt, 'HOW THE MODEL WORKS', 'From hourly data to the three pillars');
  const ins = [['pv', 'Hourly PV, 8,760 h', 'PVGIS-SARAH3 · Riyadh & NEOM · sized to annual use'], ['dc', 'Data-center load', '100 MW, constant, always on the grid'],
    ['node', 'Flexible portfolio', 'power Pᶠ · duration D · efficiency η'], ['battery', 'Battery benchmark', 'η 0.9 · NREL 2025 costs · 8%, 15 years'],
    ['cost', 'Prices & emissions', 'US$48/MWh tariff · 0.568 t CO₂/MWh']];
  const mods = [['Max displacement', 'for a given flexible power Pᶠ → the displacement curve'], ['Min flexibility', 'smallest Pᶠ that reaches target X (EEF)'],
    ['Min battery', 'smallest energy E that reaches target X (RE+BESS)'], ['Break-even price', 'π* = annual battery cost ÷ MWh shifted']];
  const outs = [['shield', 'Data-center load served', 'reliability'], ['leaf', 'Displacement, emissions', 'sustainability'], ['cost', 'Cost of displacement', 'cost'],
    ['battery', 'Storage avoided', 'MWh'], ['node', 'Flexibility required', 'MW per MW of load'], ['pylon', 'Net load on the grid', 'evening and night']];
  const hg = inG(g, lt, .3, .6, 0);
  T(hg, 80, 300, 16, 'INPUTS', { w: 700, c: C.muted, ls: 3 });
  T(hg, 700, 300, 16, 'LINEAR PROGRAMS  ·  HiGHS  ·  8,760 HOURS', { w: 700, c: C.maroon, ls: 3 });
  T(hg, 1380, 300, 16, 'OUTPUTS', { w: 700, c: C.muted, ls: 3 });
  ins.forEach(([ik, t1, t2], i) => {
    const y = 322 + i * 116, cg = inG(g, lt, .5 + i * .35, .6, 0, -24);
    card(cg, 80, y, 470, 100, { flat: true });
    E('circle', { cx: 130, cy: y + 50, r: 32, fill: C.maroonT }, cg);
    ico(cg, ik, 130, y + 50, .42, C.maroon, 5);
    T(cg, 180, y + 42, 21, t1, { w: 700 });
    TP(cg, 180, y + 70, 16, t2, 350, { c: C.muted, lh: 21 });
    flowPath(g, `M550,${y + 50} C600,${y + 50} 590,610 625,610`, lt, 2.4 + i * .1);
  });
  mods.forEach(([t1, t2], i) => {
    const y = 330 + i * 146, cg = inG(g, lt, 3.0 + i * .5, .7, 20);
    card(cg, 700, y, 520, 124);
    E('rect', { x: 700, y, width: 8, height: 124, rx: 3, fill: C.maroon }, cg);
    E('circle', { cx: 760, cy: y + 62, r: 26, fill: C.maroon }, cg);
    T(cg, 760, y + 72, 26, String(i + 1), { a: 'middle', f: F.slab, w: 700, c: '#fff' });
    T(cg, 806, y + 54, 24, t1, { f: F.slab, w: 700, c: C.maroon });
    TP(cg, 806, y + 86, 18, t2, 390, { c: C.ink2, lh: 24 });
    flowPath(g, `M625,610 C660,610 660,${y + 62} 700,${y + 62}`, lt, 3.0 + i * .5);
    flowPath(g, `M1220,${y + 62} C1260,${y + 62} 1260,612 1295,612`, lt, 5.6 + i * .2);
  });
  outs.forEach(([ik, t1, t2], i) => {
    const y = 322 + i * 98, cg = inG(g, lt, 6.4 + i * .3, .6, 0, 24);
    card(cg, 1380, y, 460, 84, { flat: true, fill: i < 3 ? C.maroonT : C.paper });
    ico(cg, ik, 1424, y + 42, .36, C.maroon, 5.5);
    T(cg, 1464, y + 38, 20, t1, { w: 700 });
    T(cg, 1464, y + 64, 16, t2, { c: C.muted });
    flowPath(g, `M1295,612 C1340,612 1330,${y + 42} 1380,${y + 42}`, lt, 6.4 + i * .3);
  });
  [[625, 610, 2.4], [1295, 612, 5.6]].forEach(([x, y, at]) => { const hg2 = popG(g, lt, at, x, y, .5); E('circle', { r: 11, fill: C.maroon, stroke: '#fff', 'stroke-width': 3 }, hg2); });
  cap(g, lt, 9.4, 'Four linear programs over 8,760 hours turn hourly profiles into the three pillars.');
}

// ------------------------------------------------------------ methodology: the LP over one day
function sLPDay(g, lt) {
  head(g, lt, 'THE MODEL IN ACTION', 'One day of the flexible loads’ energy account');
  const d = DAY, order = [...Array(24).keys()].map(k => (k + 6) % 24);
  const s = order.map(h => Math.max(d.pv[h] - 100, 0)), gg = order.map(h => Math.max(100 - d.pv[h], 0));
  const u = order.map(h => d.up[h]), dn = order.map(h => d.down[h]);
  const S = []; u.forEach((v, k) => S.push((k ? S[k - 1] : 0) + .95 * v - dn[k]));
  const x0 = 150, x1 = 1230, X = k => x0 + (x1 - x0) * k / 24, z = 470, sy = .8;
  const kc = (lt - 2.2) * 24 / 10;
  const ax = inG(g, lt, .3, .6, 0);
  E('line', { x1: x0, x2: x1, y1: z, y2: z, stroke: C.ink2, 'stroke-width': 2 }, ax);
  ['06:00', '12:00', '18:00', '00:00', '06:00'].forEach((l, i) => T(ax, X(i * 6), 590, 15, l, { a: 'middle', c: C.muted }));
  T(ax, x0 - 10, 300, 15, 'MW', { a: 'end', c: C.muted, w: 700 });
  legend(ax, x0, 618, [['surplus sₜ', C.sunL], ['deficit gₜ', '#E4E2DE'], ['net up-shift uₜ', C.maroonL], ['net down-shift dₜ', C.maroon]], 15);
  const area = (arr, sign, fill) => {
    const pts = []; arr.forEach((v, k) => { pts.push([X(k), z - sign * v * sy]); pts.push([X(k + 1), z - sign * v * sy]); });
    E('path', { d: `M${X(0)},${z} L` + pts.map(q => q.join(',')).join(' L') + ` L${X(24)},${z} Z`, fill, opacity: P(lt, .8, .8).toFixed(3) }, g);
  };
  area(s, 1, 'url(#hS)'); area(gg, -1, 'url(#hG)');
  for (let k = 0; k < 24; k++) {
    const v = clamp((kc - k) / 1.0); if (v <= 0) continue;
    const bx = X(k) + 7, bw = (x1 - x0) / 24 - 14;
    if (u[k] > 0) E('rect', { x: bx, y: z - u[k] * sy * v, width: bw, height: u[k] * sy * v, fill: C.maroonL, rx: 2 }, g);
    if (dn[k] > 0) E('rect', { x: bx, y: z, width: bw, height: dn[k] * sy * v, fill: C.maroon, rx: 2 }, g);
  }
  // shifted-energy account
  const b0 = 900, sS = 210 / 1200, YS = v => b0 - v * sS;
  const bg = inG(g, lt, 1.2, .6, 0);
  E('line', { x1: x0, x2: x1, y1: b0, y2: b0, stroke: C.ink2, 'stroke-width': 2 }, bg);
  E('line', { x1: x0, x2: x1, y1: YS(1200), y2: YS(1200), stroke: C.maroon, 'stroke-width': 1.5, 'stroke-dasharray': '6 6' }, bg);
  T(bg, x1, YS(1200) - 8, 15, 'cap D·Pᶠ = 8 h × 150 MW = 1,200 MWh', { a: 'end', c: C.maroon, w: 600 });
  T(bg, x0, 676, 15, 'SHIFTED ENERGY Sₜ (MWh)', { w: 700, c: C.muted, ls: 2 });
  const kk = clamp(kc, 0, 24);
  if (kk > 0) {
    const pts = [[X(0), b0]];
    for (let k = 0; k < Math.floor(kk); k++) pts.push([X(k + 1), YS(Math.max(0, S[k]))]);
    const fr = kk - Math.floor(kk), kf = Math.floor(kk);
    if (kf < 24 && fr > 0) pts.push([X(kf + fr), YS(Math.max(0, lerp(kf ? S[kf - 1] : 0, S[kf], fr)))]);
    E('path', { d: poly(pts) + ` L${pts[pts.length - 1][0]},${b0} Z`, fill: C.maroonT }, g);
    E('path', { d: poly(pts), fill: 'none', stroke: C.maroon, 'stroke-width': 3.5 }, g);
  }
  if (kc > 0 && kc < 24) E('line', { x1: X(kc), x2: X(kc), y1: 290, y2: b0, stroke: C.maroon, 'stroke-width': 1.5, opacity: .45 }, g);
  const ok = inG(g, lt, 12.4, .5, 6);
  pill(ok, X(24) - tw('Sₜ = 0 at 06:00 ✓', 16, 600) - 32, b0 - 26, 'Sₜ = 0 at 06:00 ✓', { s: 16, fill: C.maroon, c: '#fff' });
  const peak = inG(g, lt, 7.2, .5, 6);
  T(peak, X(10.5), YS(Math.max(...S)) - 12, 16, `peak ≈ ${fmt(Math.max(...S))} MWh banked`, { a: 'middle', w: 700, c: C.maroon });
  // equations, lit by phase
  const eqs = [['state', 'Net up-shift banks energy (η = 0.95); net down-shift pays it back', kk > 0 && kk < 24],
    ['bounds', 'Never more than Pᶠ = 150 MW, the surplus sₜ or the deficit gₜ', kk > 1.5 && kk < 23],
    ['energy', 'Never above D·Pᶠ; back to zero when the 24-h window closes', kk >= 22]];
  eqs.forEach(([k, note, on], i) => {
    const y = 300 + i * 190, eg = inG(g, lt, 1.0 + i * .5, .7, 0, 24);
    E('rect', { x: 1290, y, width: 550, height: 168, rx: 12, fill: on ? C.maroonT : C.paper, stroke: on ? C.maroon : C.rule, 'stroke-width': on ? 2.5 : 1.5 }, eg);
    EQN(eg, k, 1312, y + 24, eqH(k, 24), C.ink);
    TP(eg, 1312, y + 104, 17, note, 500, { c: C.ink2, lh: 23 });
  });
  cap(g, lt, 13.2, 'Loads bank PV around noon and pay it back at night — the account must close at zero every day.');
}

// ------------------------------------------------------------ results: all four on one day
function sScenarioDay(g, lt) {
  head(g, lt, 'ALL FOUR CONFIGURATIONS · RIYADH, 15 JULY', 'Four ways to cover the same night');
  const sd = DATA.scen_day;
  const lg = inG(g, lt, .3, .6, 0);
  legend(lg, 1190, 196, [['PV, same hour', C.sun], ['battery discharge', C.bess]], 16);
  legend(lg, 1190, 228, [['loads’ reduction (credited)', C.maroon], ['grid mix', C.am]], 16);
  const pan = [['GRID', 'Direct grid supply', h => [0, 0]], ['AM', 'Annual matching', h => [sd.direct[h], 0]],
    ['RE+BESS', `PV + ${fmt(DATA.sites.riyadh.bess_MWh_base)}-MWh battery (sized for ${DATA.BX}%)`, h => [sd.direct[h], sd.dis[h]]], ['EEF', `PV + ${fmt(DATA.sites.riyadh.flex_MW_base)} MW of flexible loads, 8 h (sized for ${DATA.BX}%)`, h => [sd.direct[h], sd.down[h]]]];
  pan.forEach(([k, sub, f], i) => {
    const px = 80 + (i % 2) * 900, py = 268 + Math.floor(i / 2) * 340, pw = 860, at = .5 + i * 2.4;
    const pg = inG(g, lt, at, .7, 18);
    card(pg, px, py, pw, 320, { flat: true });
    T(pg, px + 24, py + 42, 26, k, { f: F.slab, w: 700, c: inkOf(k) });
    T(pg, px + 24 + tw(k, 26, 700, F.slab) + 16, py + 41, 16, sub, { c: C.muted });
    let tot = 0; for (let h = 0; h < 24; h++) { const [a, b] = f(h); tot += a + b; }
    T(pg, px + pw - 24, py + 50, 40, `${fmt(tot / 24, 1)}%`, { a: 'end', f: F.slab, w: 700, c: inkOf(k) });
    T(pg, px + pw - 24, py + 74, 14, 'displaced this day', { a: 'end', c: C.muted });
    const cx0 = px + 56, cx1 = px + pw - 28, base = py + 222, sy = 1.15, bw = (cx1 - cx0) / 24 - 4;
    E('line', { x1: cx0, x2: cx1, y1: base, y2: base, stroke: C.ink2, 'stroke-width': 1.5 }, pg);
    [0, 6, 12, 18, 24].forEach(h => T(pg, cx0 + (cx1 - cx0) * h / 24, base + 20, 13, `${String(h).padStart(2, '0')}`, { a: 'middle', c: C.muted }));
    const hc = (lt - at - .4) * 24 / 2.2;
    for (let h = 0; h < 24; h++) {
      const v = clamp(hc - h); if (v <= 0) continue;
      const [a, b] = f(h), x = cx0 + (cx1 - cx0) * h / 24 + 2;
      let y = base;
      [[a, C.sun], [b, k === 'EEF' ? C.maroon : C.bess], [100 - a - b, C.am]].forEach(([val, col]) => {
        if (val <= .5) return;
        const hh = val * sy * v; y -= hh;
        E('rect', { x, y, width: bw, height: hh, fill: col, opacity: col === C.am ? .55 : 1 }, g);
      });
    }
    E('line', { x1: cx0, x2: cx1, y1: base - 100 * sy, y2: base - 100 * sy, stroke: C.dc, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: P(lt, at + .3, .5).toFixed(3) }, g);
    // the means strip
    const sg = inG(g, lt, at + 1.6, .6, 0), sy0 = py + 268;
    if (k === 'GRID') T(sg, px + 24, sy0 + 20, 16, 'No clean procurement — all 24 hours come from the grid mix.', { c: C.ink2, it: true });
    if (k === 'AM') T(sg, px + 24, sy0 + 20, 16, 'PV is exported at midday; nothing covers the night.', { c: C.ink2, it: true });
    if (k === 'RE+BESS') {
      const pts = sd.soc.map((v, h) => [cx0 + (cx1 - cx0) * (h + .5) / 24, sy0 + 34 - v / DATA.sites.riyadh.bess_MWh_base * 34]);
      E('path', { d: poly(pts), fill: 'none', stroke: C.bess, 'stroke-width': 3 }, sg);
      T(sg, px + 24, sy0 + 48, 13, 'battery state of charge', { c: C.bess, w: 700 });
    }
    if (k === 'EEF') {
      for (let h = 0; h < 24; h++) {
        const x = cx0 + (cx1 - cx0) * h / 24 + 2, up = sd.up[h] / 150 * 18, dw = sd.down[h] / 150 * 18;
        if (up > 0) E('rect', { x, y: sy0 + 18 - up, width: bw, height: up, fill: C.maroonL }, sg);
        if (dw > 0) E('rect', { x, y: sy0 + 18, width: bw, height: dw, fill: C.maroon }, sg);
      }
      E('line', { x1: cx0, x2: cx1, y1: sy0 + 18, y2: sy0 + 18, stroke: C.ink2, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, sg);
      T(sg, px + 24, sy0 + 48, 13, 'flexible loads vs. baseline', { c: C.maroon, w: 700 });
    }
  });
  const dpct = k => 100 * sd.direct.reduce((a, v, h) => a + v + (k === 'b' ? sd.dis[h] : sd.down[h]), 0) / 2400;
  cap(g, lt, 12.6, `Battery ${fmt(dpct('b'))}% and EEF ${fmt(dpct('e'))}% on this day — one stores energy, the other moves demand that already exists.`, { s: 25 });
}

// ------------------------------------------------------------ results: the full comparison table
function sCompareTable(g, lt) {
  head(g, lt, 'ALL FOUR CONFIGURATIONS · ANNUAL RESULTS', 'Every metric, side by side');
  const pl = Object.fromEntries(DATA.pillars.map(p => [p.config, p])), nl = DATA.netload;
  const xs = [760, 1030, 1300, 1600], cw = [250, 250, 250, 330];
  const hg = inG(g, lt, .4, .6, 0);
  CFGS.forEach((k, i) => {
    E('rect', { x: xs[i] - cw[i] / 2 + 8, y: 276, width: cw[i] - 16, height: 44, rx: 10, fill: CC[k] }, hg);
    T(hg, xs[i], 306, 21, k, { a: 'middle', w: 800, c: '#fff' });
    const sub = { GRID: 'today’s default', AM: 'today’s I-REC claim' }[k];
    if (sub) T(hg, xs[i], 338, 13, sub, { a: 'middle', w: 700, c: inkOf(k), it: true });
  });
  T(hg, 80, 306, 15, `${DATA.BX}% DISPLACEMENT TARGET · RIYADH`, { w: 700, c: C.muted, ls: 2 });
  const rows = [
    ['RELIABILITY', 'Data-center load served', ['100%', '100%', '100%', '100%'], [0, 1, 2, 3]],
    ['', 'Energy bought by the data center', ['876 GWh', '876 GWh', '876 GWh', '876 GWh'], []],
    ['EMISSIONS', 'Displacement', ['0%', `${fmt(pl.AM.cfe, 1)}%`, `${DATA.BX}%`, `${DATA.BX}%`], [2, 3]],
    ['', 'Emissions (kt CO₂ / yr)', CFGS.map(k => fmt(pl[k].em_kt, 1)), [2, 3]],
    ['COST', 'Cost of displacement (US$ M / yr)', ['—', '—', `${fmt(pl['RE+BESS'].cost_mid, 1)}  (${fmt(pl['RE+BESS'].cost_lo, 1)}–${fmt(pl['RE+BESS'].cost_hi, 1)})`, `${fmt(pl.EEF.cost_mid, 1)}  (${fmt(pl.EEF.cost_lo, 1)}–${fmt(pl.EEF.cost_hi, 1)})`], [3]],
    ['', 'New storage built', ['—', '—', `${fmt(pl['RE+BESS'].storage_MWh)} MWh`, 'none'], [3]],
    ['', 'Contracted flexibility', ['—', '—', '—', `${fmt(DATA.sites.riyadh.flex_MW_base)} MW · 8 h`], []],
    ['GRID IMPACT', 'Net grid load, evening 19–23 h (MW)', CFGS.map(k => fmt(nl[k][0], 1)), [nl.EEF[0] <= nl['RE+BESS'][0] ? 3 : 2]],
    ['', 'Net grid load, night 0–5 h (MW)', CFGS.map(k => fmt(nl[k][1], 1)), [3]],
  ];
  rows.forEach(([grp, lab, vals, best], r) => {
    const y = 344 + r * 62, at = .9 + r * .85, rg = inG(g, lt, at, .6, 0, -24);
    if (grp) { E('line', { x1: 80, x2: 1840, y1: y, y2: y, stroke: C.rule, 'stroke-width': 1.5 }, rg); }
    if (grp) T(rg, 80, y + 24, 13, grp, { w: 800, c: C.maroon, ls: 2 });
    T(rg, 80, y + 46, 19, lab, { w: 600, c: C.ink });
    vals.forEach((v, i) => {
      const bu = best.includes(i) ? P(lt, at + .6, .5) : 0;
      if (bu > 0) E('rect', { x: xs[i] - cw[i] / 2 + 14, y: y + 12, width: cw[i] - 28, height: 46, rx: 10, fill: 'none', stroke: CC[CFGS[i]] === C.am ? C.grid : CC[CFGS[i]], 'stroke-width': 2.5, opacity: bu.toFixed(3) }, rg);
      T(rg, xs[i], y + 43, 20, v, { a: 'middle', w: best.includes(i) ? 800 : 500, c: best.includes(i) ? inkOf(CFGS[i]) : C.ink2 });
    });
  });
  cap(g, lt, 10.4, 'Same reliability for all four; EEF matches the battery on emissions, needs no storage and costs less.');
}

// ------------------------------------------------------------ results: cost across targets
function sCostTargets(g, lt) {
  head(g, lt, 'COST ACROSS TARGETS', 'EEF stays cheaper than storage at every target');
  const tg = DATA.targets, x0 = 200, x1 = 1160, y0 = 860, y1 = 320, X = v => x0 + (x1 - x0) * (v - 50) / 40, Y = v => y0 - (y0 - y1) * v / 65;
  const ax = inG(g, lt, .3, .6, 0);
  for (const v of [0, 15, 30, 45, 60]) { E('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), stroke: v ? C.faint : C.ink2, 'stroke-width': v ? 1.5 : 2 }, ax); T(ax, x0 - 12, Y(v) + 6, 16, v, { a: 'end', c: C.muted }); }
  for (const v of [50, 60, 70, 80, 90]) T(ax, X(v), y0 + 30, 16, `${v}%`, { a: 'middle', c: C.muted, w: 700 });
  T(ax, x0 - 12, y1 - 24, 16, 'US$ million / yr', { a: 'end', c: C.muted, w: 700 });
  T(ax, (x0 + x1) / 2, y0 + 62, 17, 'Annual displacement target', { a: 'middle', c: C.ink2, w: 600 });
  const band = (lo, hi, fill, u) => {
    const n = Math.max(2, Math.round(tg.length * u));
    const top = tg.slice(0, n).map(t => [X(t.X), Y(hi(t))]), bot = tg.slice(0, n).map(t => [X(t.X), Y(lo(t))]).reverse();
    E('path', { d: poly(top.concat(bot)) + ' Z', fill, opacity: .75 }, g);
  };
  const ub = P(lt, .8, 2.4, eIO), ue = P(lt, 3.0, 2.4, eIO);
  if (ub > 0) { band(t => t.bess_lo, t => t.bess_hi, C.bessL, ub); drawP(g, poly(tg.map(t => [X(t.X), Y(t.bess_mid)])), ub, { stroke: C.bess, 'stroke-width': 4 }); }
  if (ue > 0) { band(t => t.shifted_GWh * .025, t => t.shifted_GWh * .075, C.maroonT, ue); drawP(g, poly(tg.map(t => [X(t.X), Y(t.shifted_GWh * .05)])), ue, { stroke: C.maroon, 'stroke-width': 4 }); }
  const lb = inG(g, lt, 3.2, .6, 0);
  const last = tg[tg.length - 1];
  T(lb, X(90) + 14, Y(last.bess_mid) + 6, 17, 'Battery', { w: 700, c: C.bess });
  T(lb, X(90) + 14, Y(last.bess_mid) + 26, 14, 'mid (low–high)', { c: C.bess });
  const le = inG(g, lt, 5.4, .6, 0);
  T(le, X(90) + 14, Y(last.shifted_GWh * .05) + 6, 17, 'EEF', { w: 700, c: C.maroon });
  T(le, X(90) + 14, Y(last.shifted_GWh * .05) + 26, 14, 'US$50/MWh (25–75)', { c: C.maroon });
  const BX = DATA.BX, tB = tg.find(t => t.X === BX), t80 = tg.find(t => t.X === 80), t50 = tg.find(t => t.X === 50), t90 = last;
  const mk = inG(g, lt, 6.2, .6, 0);
  E('line', { x1: X(BX), x2: X(BX), y1: Y(0), y2: Y(tB.bess_mid) - 10, stroke: C.ink2, 'stroke-width': 1.5, 'stroke-dasharray': '4 5' }, mk);
  [[tB.bess_mid, C.bess], [tB.shifted_GWh * .05, C.maroon]].forEach(([v, col]) => { E('circle', { cx: X(BX), cy: Y(v), r: 8, fill: col, stroke: '#fff', 'stroke-width': 3 }, mk); T(mk, X(BX) - 14, Y(v) - 12, 18, fmt(v, 1), { a: 'end', w: 800, c: col }); });
  const tiles = [[`US$${fmt(tB.shifted_GWh * .05, 1)} M vs ${fmt(tB.bess_mid, 1)} M`, `per year at ${BX}% displacement (base case)`],
    [`US$${fmt(t80.shifted_GWh * .05, 1)} M vs ${fmt(t80.bess_mid, 1)} M`, 'per year at 80% (the TPEC paper)'],
    [`+US$${fmt(t50.bess_mid - t50.shifted_GWh * .05, 1)} M → +${fmt(t90.bess_mid - t90.shifted_GWh * .05, 1)} M`, 'the yearly saving grows from 50% to 90% displacement']];
  tiles.forEach(([big, txt], i) => {
    const tg2 = inG(g, lt, 6.8 + i * 1.0, .7, 0, 30), y = 320 + i * 180;
    card(tg2, 1340, y, 500, 156);
    T(tg2, 1370, y + 62, 30, big, { f: F.slab, w: 700, c: C.maroon });
    TP(tg2, 1370, y + 104, 19, txt, 440, { c: C.ink2 });
  });
  cap(g, lt, 9.6, 'Mid battery cost vs. EEF at US$50 per MWh shifted; the shaded bands show the low–high cases.');
}

// ------------------------------------------------------------ NEOM 1: the site
function sNeomSite(g, lt) {
  head(g, lt, 'CASE 2 · NEOM–OXAGON', 'A second site on the Red Sea coast');
  source(g, lt, .5, 'PVGIS-SARAH3 2020 (both sites); NEOM (2025)');
  const S = DATA.sites;
  const cg = inG(g, lt, .6, .8, 14);
  card(cg, 80, 282, 660, 176);
  E('rect', { x: 80, y: 282, width: 8, height: 176, fill: NEO, rx: 3 }, cg);
  TP(cg, 112, 328, 21, 'A 1.5-GW AI campus at Oxagon was announced as net-zero in 2025 — yet it will initially draw power from thermal plants.', 600, { lh: 30 });
  T(cg, 112, 430, 16, 'The gap between annual claims and hourly supply, in one project.', { it: true, c: NEO, w: 600 });
  const sites = [['RIYADH', C.maroon, '24.71°N · 46.68°E', 'inland, central grid', S.riyadh], ['NEOM–OXAGON', NEO, '27.40°N · 35.60°E', 'Red Sea coast', S.neom]];
  sites.forEach(([nm, col, ll, where, s], i) => {
    const x = 80 + i * 340, sg = inG(g, lt, 1.6 + i * .6, .7, 18);
    card(sg, x, 484, 320, 250);
    E('rect', { x, y: 484, width: 320, height: 8, fill: col, rx: 3 }, sg);
    T(sg, x + 24, 532, 19, nm, { w: 800, c: col, ls: 2 });
    T(sg, x + 24, 562, 16, ll, { c: C.muted });
    T(sg, x + 24, 586, 16, where, { c: C.muted });
    T(sg, x + 24, 650, 40, `${fmt(s.cf_pct, 2)}%`, { f: F.slab, w: 700, c: col });
    T(sg, x + 24, 676, 15, 'PV capacity factor', { c: C.ink2 });
    T(sg, x + 24, 712, 17, `${fmt(s.pv_MWp)} MWp per 100 MW of load`, { w: 600, c: C.ink2 });
  });
  const ig = inG(g, lt, 8.0, .8, 10);
  E('rect', { x: 80, y: 764, width: 660, height: 140, rx: 14, fill: NEOL }, ig);
  T(ig, 108, 802, 16, 'SAME CLOCK, LATER SUN', { w: 800, c: NEO, ls: 3 });
  TP(ig, 108, 836, 19, 'Eleven degrees further west, NEOM’s output centres ≈ 40 min later — and twice the share arrives after 16:00 (12% vs. 6%).', 610, { c: C.ink, lh: 26 });
  // mean daily profile
  const x0 = 880, x1 = 1820, y0 = 590, y1 = 320, X = h => x0 + (x1 - x0) * h / 24, Y = v => y0 - (y0 - y1) * v / .8;
  const ax = inG(g, lt, 2.6, .6, 0);
  T(ax, x0, 300, 16, 'MEAN DAILY PV OUTPUT (kW per kWp, 2020)', { w: 700, c: C.muted, ls: 2 });
  E('line', { x1: x0, x2: x1, y1: y0, y2: y0, stroke: C.ink2, 'stroke-width': 2 }, ax);
  [0, 6, 12, 18, 24].forEach(h => T(ax, X(h), y0 + 26, 15, `${String(h).padStart(2, '0')}:00`, { a: 'middle', c: C.muted }));
  [['riyadh', C.maroon, 3.0], ['neom', NEO, 3.8]].forEach(([k, col, at]) => {
    const f = hourly(DATA.site_daily[k]);
    const pts = sample(f, 0, 24, 160).map(q => [X(q[0]), Y(q[1])]);
    drawP(g, poly(pts), P(lt, at, 1.4, eIO), { stroke: col, 'stroke-width': 4 });
  });
  const ll = inG(g, lt, 5.2, .6, 0);
  T(ll, X(9.2), Y(.62), 17, 'Riyadh', { a: 'end', w: 800, c: C.maroon });
  T(ll, X(16.4), Y(.5), 17, 'NEOM', { w: 800, c: NEO });
  // monthly capacity factor
  const m0 = 880, m1 = 1820, b0 = 900, b1 = 690, MY = v => b0 - (b0 - b1) * (v - 15) / 10;
  const mg = inG(g, lt, 5.6, .6, 0);
  T(mg, m0, 668, 16, 'MONTHLY CAPACITY FACTOR (%)', { w: 700, c: C.muted, ls: 2 });
  E('line', { x1: m0, x2: m1, y1: b0, y2: b0, stroke: C.ink2, 'stroke-width': 2 }, mg);
  const bw = (m1 - m0) / 12;
  DATA.site_monthly.riyadh.forEach((r, i) => {
    const nm = DATA.site_monthly.neom[i], u = P(lt, 5.8 + i * .08, .6, eIO), x = m0 + i * bw;
    E('rect', { x: x + 8, y: MY(15 + (r.pv_cf_pct - 15) * u), width: bw / 2 - 10, height: (r.pv_cf_pct - 15) * u * (b0 - b1) / 10, fill: C.maroon }, g);
    E('rect', { x: x + bw / 2 + 2, y: MY(15 + (nm.pv_cf_pct - 15) * u), width: bw / 2 - 10, height: (nm.pv_cf_pct - 15) * u * (b0 - b1) / 10, fill: NEO }, g);
    T(mg, x + bw / 2, b0 + 22, 14, 'JFMAMJJASOND'[i], { a: 'middle', c: C.muted, w: 700 });
  });
  T(mg, m0 - 8, MY(25) + 5, 13, '25', { a: 'end', c: C.muted }); T(mg, m0 - 8, MY(15) + 5, 13, '15', { a: 'end', c: C.muted });
  cap(g, lt, 10.6, 'Slightly sunnier, and later in the day — what does that change for displacement?');
}

// ------------------------------------------------------------ NEOM 2: results
function sNeomResults(g, lt) {
  head(g, lt, 'CASE 2 · NEOM RESULTS', 'The same story — with a slightly lower ceiling');
  const S = DATA.sites, x0 = 190, x1 = 1000, y0 = 840, y1 = 320, X = v => x0 + (x1 - x0) * v / 3.2, Y = c => y0 - (y0 - y1) * (c - 40) / 60;
  const ax = inG(g, lt, .3, .6, 0);
  for (const c of [40, 50, 60, 70, 80, 90, 100]) { E('line', { x1: x0, x2: x1, y1: Y(c), y2: Y(c), stroke: c === 40 ? C.ink2 : C.faint, 'stroke-width': c === 40 ? 2 : 1.5 }, ax); T(ax, x0 - 10, Y(c) + 6, 15, `${c}%`, { a: 'end', c: C.muted }); }
  for (const v of [0, 1, 2, 3]) T(ax, X(v), y0 + 28, 15, v.toFixed(1), { a: 'middle', c: C.muted });
  T(ax, (x0 + x1) / 2, y0 + 58, 16, 'Contracted flexible power / data-center load (D = 8 h)', { a: 'middle', c: C.ink2, w: 600 });
  T(ax, x0 - 10, y1 - 22, 15, 'Displacement', { a: 'end', c: C.muted, w: 700 });
  [['riyadh', C.maroon, .8], ['neom', NEO, 2.4]].forEach(([k, col, at]) => {
    const pts = DATA.site_curves[k], f = mono(pts.map(q => q[0]), pts.map(q => q[1]));
    drawP(g, poly(sample(f, 0, 3.2, 200).map(q => [X(q[0]), Y(q[1])])), P(lt, at, 1.8, eIO), { stroke: col, 'stroke-width': 4.5 });
  });
  const an = inG(g, lt, 4.4, .6, 0);
  [['riyadh', C.maroon, -1], ['neom', NEO, 1]].forEach(([k, col, sgn]) => {
    const s = S[k], fx = s.flex_MW_base / 100, BX = DATA.BX;
    E('line', { x1: X(0), x2: X(3.2), y1: Y(s.max_eef_cfe_pct), y2: Y(s.max_eef_cfe_pct), stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '4 5' }, an);
    T(an, X(3.2), Y(s.max_eef_cfe_pct) + (sgn < 0 ? -10 : 22), 15, `ceiling ${fmt(s.max_eef_cfe_pct, 1)}%`, { a: 'end', w: 700, c: col });
    if (k !== 'riyadh') return;
    E('line', { x1: X(fx), x2: X(fx), y1: Y(BX), y2: y0, stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }, an);
    E('circle', { cx: X(fx), cy: Y(BX), r: 7, fill: col, stroke: '#fff', 'stroke-width': 2.5 }, an);
    T(an, X(fx) + 12, Y(BX) + 40, 15, `Riyadh ${BX}%: ${fmt(s.flex_MW_base)} MW`, { a: 'start', w: 700, c: col });
  });
  legend(ax, 620, y0 - 26, [['Riyadh', C.maroon, 'line'], ['NEOM', NEO, 'line']], 16);
  const amg = inG(g, lt, 4.8, .6, 0);
  T(amg, X(1.75), Y(53), 15, 'Annual matching alone:', { c: C.ink2, w: 600 });
  TR(amg, X(1.75), Y(49.5), 15, [[`Riyadh ${fmt(S.riyadh.am_cfe_pct, 1)}%`, { c: C.maroon, w: 700 }], ['  ·  ', { c: C.muted }], [`NEOM ${fmt(S.neom.am_cfe_pct, 1)}%`, { c: NEO, w: 700 }]]);
  // NEOM monthly matching
  const mx0 = 1120, mx1 = 1820, my0 = 740, my1 = 320, MX = m => mx0 + (mx1 - mx0) * (m - 1) / 11, MY = c => my0 - (my0 - my1) * (c - 30) / 70;
  const mg = inG(g, lt, 5.2, .6, 0);
  T(mg, mx0 - 20, 300, 16, `NEOM · MONTHLY DISPLACEMENT AT ${DATA.BX}% (PV × 1.25)`, { w: 700, c: C.muted, ls: 2 });
  for (const c of [30, 50, 70, 90, 100]) { E('line', { x1: mx0 - 10, x2: mx1 + 10, y1: MY(c), y2: MY(c), stroke: c === 30 ? C.ink2 : C.faint, 'stroke-width': c === 30 ? 2 : 1.5 }, mg); T(mg, mx0 - 20, MY(c) + 5, 13, `${c}%`, { a: 'end', c: C.muted }); }
  'JFMAMJJASOND'.split('').forEach((l, i) => T(mg, MX(i + 1), my0 + 24, 14, l, { a: 'middle', c: C.muted, w: 700 }));
  const NM = DATA.site_monthly.neom;
  [['AM', C.am, 5.4], ['BESS', C.bess, 5.9], ['EEF', NEO, 6.4]].forEach(([k, col, at]) => {
    const pts = NM.map(r => [MX(r.month), MY(r[k])]);
    const u = P(lt, at, 1.2, eIO);
    drawP(g, poly(pts), u, { stroke: col, 'stroke-width': k === 'EEF' ? 4.5 : 3, 'stroke-dasharray': k === 'BESS' && u >= 1 ? '7 5' : null });
    if (u >= 1) pts.forEach(q => E('circle', { cx: q[0], cy: q[1], r: 4, fill: col }, g));
  });
  legend(mg, mx0, my0 + 60, [['EEF', NEO, 'line'], ['RE+BESS', C.bess, 'dash'], ['AM', C.am, 'line']], 15);
  const ng = inG(g, lt, 8.2, .7, 8);
  E('rect', { x: 1110, y: 838, width: 730, height: 72, rx: 12, fill: NEOL }, ng);
  TP(ng, 1132, 868, 18, `With PV = annual use NEOM tops out at ${fmt(S.neom.max_eef_cfe_pct, 1)}%; ${DATA.BX}% takes PV × 1.25 and the window from 09:00 — ${fmt(S.neom.flex_MW_base)} MW.`, 690, { c: C.ink, w: 600, lh: 24 });
  cap(g, lt, 9.6, `Later sun lifts annual matching to ${fmt(S.neom.am_cfe_pct, 1)}%; with PV × 1.25, ${DATA.BX}% needs ${fmt(S.neom.flex_MW_base)} MW of flexible load per 100 MW.`);
}

// ------------------------------------------------------------ NEOM 3: pillars and the 1.5-GW campus
function sNeomScale(g, lt) {
  head(g, lt, `CASE 2 · NEOM AT ${DATA.BX}% AND AT CAMPUS SCALE`, 'What EEF would mean for the 1.5-GW Oxagon campus');
  const S = DATA.sites, R = Object.fromEntries(DATA.site_pillars.riyadh.map(p => [p.config, p])), N = Object.fromEntries(DATA.site_pillars.neom.map(p => [p.config, p]));
  const hg = inG(g, lt, .4, .6, 0);
  T(hg, 610, 316, 19, 'Riyadh', { a: 'middle', w: 800, c: C.maroon });
  T(hg, 800, 316, 19, 'NEOM', { a: 'middle', w: 800, c: NEO });
  T(hg, 80, 316, 14, 'PER 100 MW OF DATA CENTER', { w: 700, c: C.muted, ls: 2 });
  E('line', { x1: 80, x2: 900, y1: 332, y2: 332, stroke: C.rule, 'stroke-width': 2 }, hg);
  const rows = [
    ['Annual matching alone', `${fmt(S.riyadh.am_cfe_pct, 1)}%`, `${fmt(S.neom.am_cfe_pct, 1)}%`],
    [`Flexibility for ${DATA.BX}%`, `${fmt(S.riyadh.flex_MW_base)} MW`, `${fmt(S.neom.flex_MW_base)} MW*`],
    [`Battery for ${DATA.BX}%`, `${fmt(S.riyadh.bess_MWh_base)} MWh`, `${fmt(S.neom.bess_MWh_base)} MWh*`],
    ['Maximum EEF displacement', `${fmt(S.riyadh.max_eef_cfe_pct, 1)}%`, `${fmt(S.neom.max_eef_cfe_pct, 1)}%`],
    ['Emissions: AM → EEF (kt/yr)', `${fmt(R.AM.emissions_kt)} → ${fmt(R.EEF.emissions_kt, 1)}`, `${fmt(N.AM.emissions_kt)} → ${fmt(N.EEF.emissions_kt, 1)}`],
    ['Cost: EEF vs. battery (US$ M/yr)', `${fmt(R.EEF.cost_mid_MUSD, 1)} vs ${fmt(R['RE+BESS'].cost_mid_MUSD, 1)}`, `${fmt(N.EEF.cost_mid_MUSD, 1)} vs ${fmt(N['RE+BESS'].cost_mid_MUSD, 1)}`],
    ['Break-even price (US$/MWh)', fmt(S.riyadh.breakeven_mid_base, 1), fmt(S.neom.breakeven_mid_base, 1)],
  ];
  rows.forEach(([lab, a, b], i) => {
    const y = 380 + i * 72, rg = inG(g, lt, .8 + i * .5, .6, 0, -24);
    if (i % 2 === 0) E('rect', { x: 80, y: y - 40, width: 820, height: 66, rx: 8, fill: C.faint, opacity: .6 }, rg);
    T(rg, 100, y, 18, lab, { c: C.ink2 });
    T(rg, 610, y + 2, 20, a, { a: 'middle', f: F.slab, w: 700 });
    T(rg, 800, y + 2, 20, b, { a: 'middle', f: F.slab, w: 700, c: NEO });
  });
  const k = 15, n = S.neom, nb = N['RE+BESS'], ne = N.EEF;
  const sg = inG(g, lt, 5.0, .7, 0);
  E('rect', { x: 980, y: 290, width: 860, height: 56, rx: 12, fill: NEO }, sg);
  T(sg, 1004, 326, 19, 'SCALED TO THE 1.5-GW OXAGON CAMPUS  (× 15, linear model)', { w: 800, c: '#fff', ls: 1 });
  const tiles = [[`≈ ${fmt(n.flex_MW_base * k / 1000, 1)} GW`, `of contracted flexibility for ${DATA.BX}% displacement`],
    [`≈ ${fmt(n.bess_MWh_base * k / 1000, 1)} GWh`, 'of batteries avoided'],
    [`≈ ${fmt((N.AM.emissions_kt - ne.emissions_kt) * k / 1000, 1)} Mt CO₂`, 'per year below annual matching (hourly accounting)'],
    [`≈ US$${fmt(ne.cost_mid_MUSD * k)} M`, `per year, vs. ≈ US$${fmt(nb.cost_mid_MUSD * k)} M for storage (mid case)`]];
  tiles.forEach(([big, txt], i) => {
    const x = 980 + (i % 2) * 440, y = 370 + Math.floor(i / 2) * 230, tg2 = inG(g, lt, 5.6 + i * .7, .7, 20);
    card(tg2, x, y, 420, 206);
    T(tg2, x + 28, y + 86, 46, big, { f: F.slab, w: 700, c: NEO });
    TP(tg2, x + 28, y + 132, 18, txt, 370, { c: C.ink2, lh: 25 });
  });
  const cv = inG(g, lt, 9.0, .7, 0);
  TP(cv, 980, 870, 17, '* NEOM at 90% uses PV × 1.25 and the window from 09:00. Linear scale-up of the 100-MW results; the flexible load can sit anywhere on the national grid.', 860, { it: true, c: C.muted });
  cap(g, lt, 10.4, `At NEOM, EEF again pairs grid reliability with battery-level emissions — at about ${fmt(100 * ne.cost_mid_MUSD / nb.cost_mid_MUSD)}% of the storage cost.`);
}

// ------------------------------------------------------------ expected 1: control (RQ2)
function sExpControl(g, lt) {
  head(g, lt, 'EXPECTED RESULTS · RQ2 · CHAPTER 4', 'Control should keep displacement near the planning bound');
  const x0 = 360, x1 = 1180, X = v => x0 + (x1 - x0) * (v - 30) / 60, axY = 780;
  const ax = inG(g, lt, .4, .6, 0);
  E('line', { x1: x0, x2: x1, y1: axY, y2: axY, stroke: C.ink2, 'stroke-width': 2 }, ax);
  for (const v of [30, 40, 50, 60, 70, 80, 90]) { E('line', { x1: X(v), x2: X(v), y1: axY, y2: axY + 8, stroke: C.ink2, 'stroke-width': 2 }, ax); T(ax, X(v), axY + 30, 15, `${v}%`, { a: 'middle', c: C.muted }); }
  T(ax, (x0 + x1) / 2, axY + 60, 16, `Annual displacement (Riyadh, sized for ${DATA.BX}%)`, { a: 'middle', c: C.ink2, w: 600 });
  const bars = [['Planning model', 'perfect foresight · computed', DATA.BX, 'solid', .9], ['Day-ahead + intraday MPC', 'expected: close to the bound', DATA.BX, 'open', 2.4], ['Day-ahead schedule only', 'expected: lower', DATA.BX, 'open', 3.6], ['Flexible loads deliver nothing', 'worst case = annual matching · computed', 40.4, 'floor', 4.8]];
  bars.forEach(([lab, sub, v, kind, at], i) => {
    const y = 320 + i * 108, bg = inG(g, lt, at, .7, 0, -20);
    T(bg, 80, y + 26, 19, lab, { w: 700 });
    T(bg, 80, y + 50, 15, sub, { c: C.muted, it: true });
    const u = P(lt, at + .2, 1.0, eIO);
    if (kind === 'solid') E('rect', { x: x0, y: y + 6, width: (X(v) - x0) * u, height: 46, rx: 6, fill: C.maroon }, g);
    if (kind === 'floor') E('rect', { x: x0, y: y + 6, width: (X(v) - x0) * u, height: 46, rx: 6, fill: C.am }, g);
    if (kind === 'open') {
      E('rect', { x: x0, y: y + 6, width: (X(40.4) - x0) * u, height: 46, rx: 6, fill: C.am }, g);
      E('rect', { x: X(40.4), y: y + 6, width: (X(v) - X(40.4)) * u, height: 46, rx: 6, fill: 'url(#hM)', stroke: C.maroon, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: .8 }, g);
      if (u >= 1) T(g, X(v) - 40, y + 40, 26, '?', { a: 'middle', f: F.slab, w: 700, c: C.maroon });
    }
    if (u >= 1 && kind !== 'open') T(g, X(v) + 12, y + 38, 20, `${fmt(v, 1)}%`, { f: F.slab, w: 700, c: kind === 'floor' ? C.grid : C.maroon });
  });
  const rg = inG(g, lt, 6.2, .8, 0, 30);
  card(rg, 1290, 300, 550, 590);
  T(rg, 1320, 348, 16, 'CHAPTER 4 WILL MEASURE', { w: 800, c: C.maroon, ls: 3 });
  ['PV and load-availability forecast errors (day-ahead, intraday)', 'Cheapest-first day-ahead dispatch with network checks', 'Intraday MPC re-dispatch of the flexible loads', 'Matching lost vs. forecast error — and what MPC recovers'].forEach((t, i) => {
    E('circle', { cx: 1334, cy: 398 + i * 84, r: 6, fill: C.maroon }, rg);
    TP(rg, 1356, 404 + i * 84, 19, t, 450, { lh: 25 });
  });
  E('rect', { x: 1310, y: 760, width: 510, height: 104, rx: 12, fill: C.maroonT }, rg);
  ico(rg, 'shield', 1360, 812, .5, C.maroon, 5);
  TP(rg, 1404, 800, 18, 'In every case the data center stays 100% grid-supplied — only displacement is at stake.', 400, { w: 700, c: C.maroon, lh: 24 });
  cap(g, lt, 8.4, 'Both bounds are computed; where operational control lands between them is what Chapter 4 measures.');
}

// ------------------------------------------------------------ expected 2: decision maps (RQ3)
function sExpDecision(g, lt) {
  head(g, lt, 'EXPECTED RESULTS · RQ3 · CHAPTER 5', 'A first slice of the decision map: when does EEF win?');
  const dm = DATA.dmap, x0 = 200, x1 = 1220, y0 = 860, y1 = 310, X = c => x0 + (x1 - x0) * (c - 100) / 300, Y = p => y0 - (y0 - y1) * p / 180;
  const ax = inG(g, lt, .3, .6, 0);
  for (const v of [0, 30, 60, 90, 120, 150, 180]) { E('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), stroke: v ? C.faint : C.ink2, 'stroke-width': v ? 1.5 : 2 }, ax); T(ax, x0 - 12, Y(v) + 6, 15, v, { a: 'end', c: C.muted }); }
  for (const v of [100, 150, 200, 250, 300, 350, 400]) T(ax, X(v), y0 + 28, 15, v, { a: 'middle', c: C.muted });
  T(ax, (x0 + x1) / 2, y0 + 58, 16, 'Battery capital cost (US$/kWh)', { a: 'middle', c: C.ink2, w: 600 });
  T(ax, x0 - 12, y1 - 20, 15, 'Flexibility price (US$/MWh shifted)', { c: C.muted, w: 700 });
  const l80 = dm[String(DATA.BX)], u = P(lt, .8, 1.6, eIO);
  if (u > 0) {
    const line = l80.map(q => [X(q[0]), Y(q[1])]);
    E('path', { d: poly(line) + ` L${X(400)},${Y(0)} L${X(100)},${Y(0)} Z`, fill: C.maroonT, opacity: (u * .9).toFixed(3) }, g);
    E('path', { d: poly(line) + ` L${X(400)},${Y(180)} L${X(100)},${Y(180)} Z`, fill: C.bessL, opacity: (u * .7).toFixed(3) }, g);
  }
  [['60', C.maroonL, 2.6], ['90', C.maroon2, 3.0]].forEach(([k, col, at]) => drawP(g, poly(dm[k].map(q => [X(q[0]), Y(q[1])])), P(lt, at, 1.2, eIO), { stroke: col, 'stroke-width': 2, 'stroke-dasharray': '6 5' }));
  drawP(g, poly(l80.map(q => [X(q[0]), Y(q[1])])), P(lt, 1.6, 1.4, eIO), { stroke: C.maroon, 'stroke-width': 4.5 });
  const zl = inG(g, lt, 2.4, .6, 0);
  T(zl, X(330), Y(40), 24, 'EEF cheaper', { a: 'middle', w: 800, c: C.maroon });
  T(zl, X(160), Y(140), 24, 'battery cheaper', { a: 'middle', w: 800, c: C.bess });
  T(zl, X(400) - 6, Y(l80[l80.length - 1][1]) - 10, 15, `${DATA.BX}%`, { a: 'end', w: 800, c: C.maroon });
  const nr = inG(g, lt, 4.0, .6, 0);
  [[124, 'low'], [207, 'mid'], [338, 'high']].forEach(([c, lab]) => { E('line', { x1: X(c), x2: X(c), y1: y0, y2: y1 + 30, stroke: C.ink2, 'stroke-width': 1.2, 'stroke-dasharray': '2 5' }, nr); T(nr, X(c), y1 + 20, 14, `NREL ${lab}`, { a: 'middle', c: C.ink2, w: 600 }); });
  const fb = inG(g, lt, 5.0, .6, 0);
  E('rect', { x: x0, y: Y(75), width: x1 - x0, height: Y(25) - Y(75), fill: C.maroon, opacity: .07 }, fb);
  T(fb, x0 + 10, Y(75) - 8, 14, 'assumed flexibility price US$25–75', { c: C.maroon, w: 600, it: true });
  const at207 = l80.reduce((a, q) => Math.abs(q[0] - 207) < Math.abs(a[0] - 207) ? q : a);
  const rg = inG(g, lt, 6.0, .8, 0, 30);
  card(rg, 1320, 300, 520, 300);
  T(rg, 1350, 346, 16, `COMPUTED (RIYADH, ${DATA.BX}%)`, { w: 800, c: C.maroon, ls: 3 });
  TP(rg, 1350, 386, 20, `The boundary rises linearly with battery cost: ≈ US$${fmt(l80[0][1])}/MWh at US$100/kWh → ≈ US$${fmt(l80[l80.length - 1][1])}/MWh at US$400/kWh.`, 460, { lh: 28 });
  TP(rg, 1350, 512, 18, 'The target barely moves it (60%, 80%, 90% lines).', 460, { c: C.muted, lh: 25 });
  const ng = inG(g, lt, 7.6, .8, 0, 30);
  card(ng, 1320, 624, 520, 270, { fill: C.maroonT, stroke: C.maroonL });
  T(ng, 1350, 670, 16, 'CHAPTER 5 ADDS', { w: 800, c: C.maroon, ls: 3 });
  ['PV price-to-tariff ratio', 'Available flexibility and its cost curve', 'Single-buyer vs. liberalized markets', 'Contract terms and settlement rules'].forEach((t, i) => {
    E('circle', { cx: 1360, cy: 706 + i * 44, r: 5, fill: C.maroon }, ng);
    T(ng, 1378, 712 + i * 44, 19, t, { c: C.ink });
  });
  cap(g, lt, 9.0, 'Each decision map answers one question: given these conditions, which supply configuration wins?');
}

// ------------------------------------------------------------ expected 3: saturation (RQ4)
function sExpSaturation(g, lt) {
  head(g, lt, 'EXPECTED RESULTS · RQ4 · CHAPTER 6', 'How far can external flexibility go?');
  source(g, lt, .5, 'Model results (this work); DR potential: KAPSARC (2026)');
  const k80 = DATA.sites.riyadh.flex_MW_80 / 100, k90 = DATA.sites.riyadh.flex_MW_90 / 100;
  const x0 = 200, x1 = 1220, y0 = 860, y1 = 320, X = v => x0 + (x1 - x0) * v / 25, Y = v => y0 - (y0 - y1) * v / 35;
  const ax = inG(g, lt, .3, .6, 0);
  for (const v of [0, 10, 20, 30]) { E('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), stroke: v ? C.faint : C.ink2, 'stroke-width': v ? 1.5 : 2 }, ax); T(ax, x0 - 12, Y(v) + 6, 15, v, { a: 'end', c: C.muted }); }
  for (const v of [0, 5, 10, 15, 20, 25]) T(ax, X(v), y0 + 28, 15, v, { a: 'middle', c: C.muted });
  T(ax, (x0 + x1) / 2, y0 + 58, 16, 'Data-center capacity (GW)', { a: 'middle', c: C.ink2, w: 600 });
  T(ax, x0 - 12, y1 - 20, 15, 'Flexibility needed (GW)', { c: C.muted, w: 700 });
  const bu = P(lt, .8, 1.0, eIO);
  E('rect', { x: x0, y: Y(29.9), width: (x1 - x0) * bu, height: Y(7.1) - Y(29.9), fill: 'url(#hG)', opacity: .8 }, g);
  const bl = inG(g, lt, 1.4, .6, 0);
  T(bl, x0 + 12, Y(29.9) - 10, 16, 'Industrial DR potential 2030: 7.1–29.9 GW', { w: 700, c: C.grid });
  const line = (kk, col, at) => drawP(g, `M${X(0)},${Y(0)} L${X(Math.min(25, 35 / kk))},${Y(Math.min(35, 25 * kk))}`, P(lt, at, 1.4, eIO), { stroke: col, 'stroke-width': 4.5 });
  line(k80, C.maroon, 2.2); line(k90, C.maroon2, 3.0);
  const ll = inG(g, lt, 3.6, .6, 0);
  pill(ll, X(17) + 12, Y(17 * k80) + 34, `80%: ${fmt(k80, 2)} × load`, { s: 16, fill: C.bg, stroke: C.maroon });
  T(ll, X(16.6), Y(34.0) + 4, 17, `90%: ${fmt(k90, 2)} × load`, { a: 'end', w: 800, c: C.maroon2 });
  const sat = inG(g, lt, 4.8, .7, 0);
  const a = 7.1 / k90, b = 29.9 / k90;
  E('rect', { x: X(a), y: y1, width: X(b) - X(a), height: y0 - y1, fill: C.maroon, opacity: .06 }, sat);
  [[a, 7.1], [b, 29.9]].forEach(([xv, yv]) => { E('line', { x1: X(xv), x2: X(xv), y1: Y(yv), y2: y0, stroke: C.maroon, 'stroke-width': 1.5, 'stroke-dasharray': '4 5' }, sat); E('circle', { cx: X(xv), cy: Y(yv), r: 7, fill: C.maroon, stroke: '#fff', 'stroke-width': 2.5 }, sat); T(sat, X(xv), y0 - 12, 15, `${fmt(xv, 1)} GW`, { a: 'middle', w: 800, c: C.maroon }); });
  T(sat, (X(a) + X(b)) / 2, Y(4), 16, '90% saturates somewhere here (first-order)', { a: 'middle', w: 700, c: C.maroon, it: true });
  const tg = inG(g, lt, 6.2, .7, 0);
  E('line', { x1: X(1.5), x2: X(1.5), y1: y0, y2: Y(15.5), stroke: NEO, 'stroke-width': 2.5 }, tg);
  T(tg, X(1.5) + 8, Y(18), 15, '1.5 GW — national target', { w: 800, c: NEO });
  T(tg, X(1.5) + 8, Y(16.4), 15, '(also the Oxagon campus)', { c: NEO });
  const rg = inG(g, lt, 7.0, .8, 0, 30);
  card(rg, 1320, 300, 520, 300);
  T(rg, 1350, 346, 16, 'FIRST-ORDER ESTIMATE', { w: 800, c: C.maroon, ls: 3 });
  TP(rg, 1350, 386, 20, `1.5 GW of data centers needs ≈ ${fmt(1.5 * k80, 1)} GW (80%) or ${fmt(1.5 * k90, 1)} GW (90%) of flexibility — below even the low potential estimate.`, 460, { lh: 28 });
  TP(rg, 1350, 514, 18, `90% would saturate between ≈ ${fmt(a, 1)} and ≈ ${fmt(b, 0)} GW of data centers.`, 460, { c: C.ink2, lh: 25 });
  const ng = inG(g, lt, 8.6, .8, 0, 30);
  card(ng, 1320, 624, 520, 270, { fill: C.maroonT, stroke: C.maroonL });
  T(ng, 1350, 670, 16, 'CHAPTER 6 REPLACES THIS WITH', { w: 800, c: C.maroon, ls: 3 });
  ['Flexibility whose value declines with use', 'Regional pools and network limits', 'Expansion pathway as capacity grows', 'Best mix beyond saturation: EEF + storage + PV'].forEach((t, i) => {
    E('circle', { cx: 1360, cy: 706 + i * 44, r: 5, fill: C.maroon }, ng);
    T(ng, 1378, 712 + i * 44, 19, t, { c: C.ink });
  });
  cap(g, lt, 10.2, 'The DR potential was assessed for peak shaving, not daily shifting — so these limits are an upper bound to be tested.', { s: 25 });
}

// ------------------------------------------------------------ expected 4: hypotheses
function sExpHypotheses(g, lt) {
  head(g, lt, 'EXPECTED RESULTS', 'Four hypotheses the remaining chapters will test');
  const H = [
    ['H1', 'Chapter 4 · RQ2', 'With day-ahead scheduling and intraday MPC, EEF keeps most of its planned displacement — and the data center’s supply is never at risk.'],
    ['H2', 'Chapter 5 · RQ3', 'EEF beats storage wherever flexibility costs less than the battery’s annualized cost per MWh shifted — a boundary that moves with battery and PV prices.'],
    ['H3', 'Chapter 6 · RQ4', 'External flexibility saturates only at multi-GW data-center scale; beyond it, a hybrid of EEF and storage is least-cost.'],
    ['H4', 'Chapters 3–6', 'The framework transfers to other sites and to both single-buyer and liberalized markets with the same accounting rule.'],
  ];
  H.forEach(([id, ch, txt], i) => {
    const x = 80 + (i % 2) * 890, y = 290 + Math.floor(i / 2) * 320, cg = inG(g, lt, .8 + i * 1.4, .8, 24);
    card(cg, x, y, 870, 290);
    E('rect', { x, y, width: 8, height: 290, rx: 3, fill: C.maroon }, cg);
    T(cg, x + 40, y + 76, 56, id, { f: F.slab, w: 700, c: C.maroon });
    pill(cg, x + 150, y + 58, ch, { s: 16 });
    TP(cg, x + 40, y + 140, 24, txt, 790, { lh: 34 });
  });
  cap(g, lt, 7.6, 'Each hypothesis comes with a measurable test — and the preliminary results already bound the answers.');
}
