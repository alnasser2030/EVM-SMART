// How much of the data center's use is shifted, and the full bill including PV sales.

// ------------------------------------------------------------ results: how much of the DC's use is shifted
function sShiftSplit(g, lt) {
  head(g, lt, 'HOW MUCH IS SHIFTED?', 'Not 100% — the model picks the least flexibility that meets the target');
  const am = DATA.baseline.am_cfe, tg = Object.fromEntries(DATA.targets.map(t => [t.X, t]));
  const rows = [['60%', tg[60].shifted_GWh / 8.76, `Pᶠ = ${fmt(tg[60].flex_MW)} MW`], ['80%', tg[80].shifted_GWh / 8.76, `Pᶠ = ${fmt(tg[80].flex_MW)} MW`],
    ['90%', tg[90].shifted_GWh / 8.76, `Pᶠ = ${fmt(tg[90].flex_MW)} MW`], ['max', DATA.sites.riyadh.max_eef_cfe_pct - DATA.sites.riyadh.am_cfe_pct, 'unlimited Pᶠ']];
  const x0 = 240, w = 820;
  const hg = inG(g, lt, .3, .6, 0);
  T(hg, 80, 300, 16, 'THE DATA CENTER’S 876 GWh/yr, BY DISPLACEMENT TARGET', { w: 800, c: C.muted, ls: 2 });
  legend(hg, 240, 890, [['netted in the same hour', C.sun], ['shifted by the flexible loads', C.maroon], ['still from the grid mix', C.am]], 17);
  rows.forEach(([lab, sh, pf], i) => {
    const y = 336 + i * 130, at = .8 + i * 1.1, u = P(lt, at, 1.4, eIO);
    const lg = inG(g, lt, at, .5, 0);
    T(lg, 80, y + 44, 36, lab, { f: F.slab, w: 700, c: i === 2 ? C.maroon : C.ink });
    T(lg, 80, y + 72, 15, pf, { c: C.muted });
    const segs = [[am, C.sun], [sh, C.maroon], [100 - am - sh, C.am]];
    let x = x0;
    segs.forEach(([v, col], k) => {
      const ww = w * v / 100 * u;
      E('rect', { x, y: y + 14, width: Math.max(0, ww - 3), height: 58, rx: 6, fill: col, opacity: k === 2 ? .55 : 1 }, g);
      const vg = inG(g, lt, at + 1.2, .5, 0);
      if (v > 6) T(vg, x + w * v / 100 / 2, y + 51, 19, `${fmt(v, 1)}%`, { a: 'middle', w: 800, c: k === 2 ? C.ink2 : '#fff' });
      x += w * v / 100 * u;
    });
    if (i === 2) { const hl = inG(g, lt, at + 1.6, .5, 0); E('rect', { x: x0 - 6, y: y + 8, width: w + 12, height: 70, rx: 9, fill: 'none', stroke: C.maroon, 'stroke-width': 3 }, hl); }
  });
  const rg = inG(g, lt, 5.6, .8, 0, 30);
  card(rg, 1150, 290, 690, 620, { fill: C.paper });
  T(rg, 1180, 336, 16, 'HOW THE THREE PILLARS ARE MET', { w: 800, c: C.maroon, ls: 2 });
  [['shield', 'Reliability — 100% always', 'the data center never depends on the shift'],
    ['leaf', 'Emissions — set by the target X', '85–97% works; 90% is the base case'],
    ['cost', 'Cost — minimized for that X', 'the LP finds the smallest Pᶠ that delivers it']].forEach(([ik, a, b], i) => {
    const y = 388 + i * 84;
    ico(rg, ik, 1202, y + 4, .34, C.maroon, 6);
    T(rg, 1236, y, 20, a, { w: 800 });
    T(rg, 1236, y + 26, 16, b, { c: C.ink2 });
  });
  EQN(rg, 'obj', 1180, 636, eqH('obj', 22), C.ink);
  T(rg, 1180, 736, 16, 'WHY NOT 100%?', { w: 800, c: C.maroon, ls: 2 });
  ['short winter days — dusty or cloudy days are only ≈ 14 a year', '5% of the shifted energy is lost (η = 0.95)', 'every extra point needs more contracted flexibility'].forEach((t, i) => {
    E('circle', { cx: 1190, cy: 764 + i * 34, r: 5, fill: C.maroon }, rg);
    T(rg, 1206, 770 + i * 34, 17, t, { c: C.ink });
  });
  cap(g, lt, 8.4, 'At 90%: 40% is netted within the hour, 50% is shifted by the loads, 10% still comes from the grid mix.', { y: 972 });
}

// ------------------------------------------------------------ results: the data center's full bill, with PV sales
function sFullBill(g, lt) {
  head(g, lt, 'THE FULL BILL', `Including the PV sales — per 100 MW at ${DATA.BX}% displacement`);
  const PL = Object.fromEntries(DATA.pillars.map(p => [p.config, p]));
  const buy = 42.048, pv = 11.91, cfgs = [['GRID', 0, 0], ['AM', pv, 0], ['RE+BESS', pv, PL['RE+BESS'].cost_mid], ['EEF', pv, PL.EEF.cost_mid]];
  const z = 740, s = 4.6, Y = v => z - v * s, cxs = [300, 520, 740, 960], bw = 130;
  const ax = inG(g, lt, .3, .6, 0);
  for (const v of [-10, 0, 20, 40, 60, 80, 100]) { E('line', { x1: 160, x2: 1060, y1: Y(v), y2: Y(v), stroke: v ? C.faint : C.ink2, 'stroke-width': v ? 1.5 : 2 }, ax); T(ax, 150, Y(v) + 5, 14, v, { a: 'end', c: C.muted }); }
  T(ax, 150, Y(100) - 22, 14, 'US$ M / yr', { a: 'end', c: C.muted, w: 700 });
  legend(ax, 160, 900, [['grid purchases (tariff)', C.am], ['PV plant cost', C.sunL], ['PV sales', C.sun], ['displacement cost', C.maroon]], 16);
  cfgs.forEach(([k, pvc, hm], i) => {
    const x = cxs[i] - bw / 2, at = .8 + i * 1.0, u = P(lt, at, 1.2, eIO);
    const lg = inG(g, lt, at, .5, 0);
    T(lg, cxs[i], 860, 19, k, { a: 'middle', w: 800, c: inkOf(k) });
    let top = 0;
    [[buy, C.am], [pvc, C.sunL], [hm, k === 'EEF' ? C.maroon : C.bess]].forEach(([v, col]) => {
      if (v <= 0) return;
      E('rect', { x, y: Y(top + v * u), width: bw, height: v * s * u, fill: col, opacity: col === C.am ? .6 : 1 }, g);
      top += v * u;
    });
    if (pvc > 0) E('rect', { x, y: z, width: bw, height: pvc * s * u, fill: C.sun }, g);
    const net = buy + hm;
    const ng = inG(g, lt, at + 1.4, .5, 6);
    E('line', { x1: x - 10, x2: x + bw + 10, y1: Y(net), y2: Y(net), stroke: C.ink, 'stroke-width': 3 }, ng);
    T(ng, cxs[i], Y(buy + pvc + hm) - 40, 24, fmt(net, 1), { a: 'middle', f: F.slab, w: 700, c: inkOf(k) });
    T(ng, cxs[i], Y(buy + pvc + hm) - 16, 14, `net · US$${fmt(net * 1000 / 876, 1)}/MWh`, { a: 'middle', c: C.ink2, w: 600 });
    if (pvc > 0) T(ng, cxs[i], z + pvc * s + 18, 13, `−${fmt(pvc, 1)} sales`, { a: 'middle', c: C.sunD, w: 700 });
  });
  const rg = inG(g, lt, 5.6, .8, 0, 30);
  card(rg, 1130, 290, 710, 620, { fill: C.paper });
  T(rg, 1160, 336, 16, 'WHAT SELLING THE PV DOES', { w: 800, c: C.maroon, ls: 2 });
  [['All 876 GWh/yr sold to SPPC', '≈ US$11.9 M/yr at US$13.6/MWh (NREP range US$11–17/MWh: US$9.6–14.9 M)'],
    ['It pays back the PV plant', 'at NREP-level prices, sales ≈ the plant’s cost, so the net is ≈ 0 (bars above)'],
    ['A margin is a bonus', 'every US$1/MWh sold above your PV cost = US$0.9 M/yr off the bill'],
    ['It does not change the winner', 'the same PV sits in AM, RE+BESS and EEF, so all three drop equally'],
    ['Cost per tonne avoided vs. AM', `EEF ≈ US$${fmt(PL.EEF.cost_mid * 1e3 / (PL.AM.em_kt - PL.EEF.em_kt))}/t CO₂ · battery ≈ US$${fmt(PL['RE+BESS'].cost_mid * 1e3 / (PL.AM.em_kt - PL['RE+BESS'].em_kt))}/t CO₂`]].forEach(([a, b], i) => {
    const y = 388 + i * 100;
    okMark(rg, 1172, y - 6, 11, i === 4 ? C.maroon : C.sunD);
    T(rg, 1194, y, 20, a, { w: 800 });
    TP(rg, 1194, y + 28, 16, b, 620, { c: C.ink2, lh: 21 });
  });
  const ag = inG(g, lt, 7.6, .6, 0);
  TP(ag, 1160, 868, 14, 'No export price is published for this case: US$13.6/MWh is an assumption, and a PV purchase-price rule is proposed for SERA’s framework.', 650, { c: C.muted, it: true, lh: 19 });
  cap(g, lt, 8.6, 'Selling the PV pays for the PV; EEF then covers the night for ≈ 45% less per tonne than a battery.', { y: 972 });
}
