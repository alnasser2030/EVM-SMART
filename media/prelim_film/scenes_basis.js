// Why self-supply does not scale (SERA rules), why linear programming, and the 25-year cost basis.

// ------------------------------------------------------------ problem: self-supply under SERA's framework
function sSelfSupply(g, lt) {
  head(g, lt, 'WHY SELF-SUPPLY DOES NOT SCALE', 'SERA’s self-consumption rules — and a real off-grid design');
  source(g, lt, .5, 'SERA ERD-TA-004 V02/23 (2023) and its Nov 2026 update; industry PV design, Riyadh (2024)');
  const rules = [
    ['Same premises only', 'generation and consumption at the same facility, in all cases', 'Art. 3-5'],
    ['Size cap per facility', '30 MW (2023) → 50 MW (Nov 2026 update)', 'Art. 5-1'],
    ['Capped by the contracted load', 'connected PV capacity ≤ the facility’s contracted load', 'Art. 5-1(c)'],
    ['Net billing per metering period', 'self-consumed only within the same period; surplus credited at a SERA-set price, valid 12 months', 'Art. 8'],
    ['National ceiling', 'transmission-connected self-consumption ≤ 3% of last year’s national peak', 'Art. 11-1'],
    ['Storage allowed, but on site', 'integrated, ≤ the PV’s capacity, for self-consumption only', 'Art. 11-4'],
  ];
  const hg = inG(g, lt, .4, .6, 0);
  T(hg, 80, 288, 16, 'SERA SELF-CONSUMPTION FRAMEWORK', { w: 800, c: C.maroon, ls: 3 });
  rules.forEach(([t1, t2, art], i) => {
    const y = 306 + i * 100, rg = inG(g, lt, .7 + i * .7, .6, 0, -24);
    card(rg, 80, y, 960, 88, { flat: true });
    T(rg, 104, y + 36, 21, t1, { w: 800 });
    TP(rg, 104, y + 64, 16, t2, 760, { c: C.ink2, lh: 20 });
    pill(rg, 1016 - tw(art, 14, 700) - 26, y + 30, art, { s: 14, w: 700, fill: C.faint, c: C.muted });
  });
  // PV needed per 100 MW of constant load
  const x0 = 1120, x1 = 1800, X = v => x0 + (x1 - x0) * v / 950;
  const cg = inG(g, lt, 4.6, .6, 0);
  T(cg, 1100, 288, 16, 'PV PER 100 MW OF CONSTANT LOAD (MWp)', { w: 800, c: C.maroon, ls: 2 });
  const bars = [
    ['Allowed on site (2023)', 30, C.am, ''], ['Allowed on site (2026)', 50, C.am, ''],
    ['Annual matching — the EEF plant', 477, C.sun, 'all output exported, nothing wasted'],
    ['Off-grid PV + battery design', 912, C.bess, '9.1 kWp per kW · 46% of PV curtailed · large battery'],
  ];
  bars.forEach(([lab, v, col, note], i) => {
    const y = 330 + i * 134, at = 5.0 + i * .7, u = P(lt, at, 1.0, eIO);
    const lg = inG(g, lt, at, .5, 0);
    T(lg, 1100, y + 18, 18, lab, { w: 700, c: C.ink });
    E('rect', { x: x0 - 20, y: y + 30, width: Math.max(2, (X(v) - x0 + 20) * u), height: 40, rx: 4, fill: col }, g);
    const vg = inG(g, lt, at + .8, .5, 0);
    const vx = Math.min(X(v) + 10, 1730);
    T(vg, v > 700 ? X(v) - 12 : vx, y + 58, 20, fmt(v), { a: v > 700 ? 'end' : 'start', f: F.slab, w: 700, c: v > 700 ? '#fff' : col === C.am ? C.grid : C.sunD });
    if (note) T(vg, 1100, y + 96, 15, note, { c: C.ink2, it: true });
  });
  cap(g, lt, 9.6, 'Self-supply is capped by size and by premises — a 100-MW AI campus needs the grid, and that is where EEF works.', { s: 25, y: 972 });
}

// ------------------------------------------------------------ methodology: why linear programming
function sWhyLP(g, lt) {
  head(g, lt, 'WHY LINEAR PROGRAMMING?', 'The right tool for a planning question');
  const reasons = [
    ['check', 'The physics is linear', 'Energy balance, power limits and the shifted-energy account are all linear in the hourly variables — no on/off decisions at the planning stage.'],
    ['shield', 'A guaranteed global optimum', 'The answer is the true minimum flexibility or battery for the target, not a local guess or a heuristic estimate.'],
    ['search', 'One exact question per run', 'Max displacement for a given Pᶠ; min Pᶠ or min battery E for a target X — the break-even price follows directly.'],
    ['clock', 'Fast at full hourly resolution', '8,760 hours, ≈ 26,000 variables: 0.2–1.6 s per run with HiGHS, so hundreds of runs for sweeps and two sites.'],
    ['node', 'Fair and reproducible', 'Battery and EEF are sized by the same method, on the same data, with an open solver.'],
  ];
  reasons.forEach(([ik, t1, t2], i) => {
    const y = 290 + i * 124, rg = inG(g, lt, .7 + i * 1.0, .7, 0, -30);
    card(rg, 80, y, 1000, 110);
    E('circle', { cx: 140, cy: y + 55, r: 34, fill: C.maroonT }, rg);
    ico(rg, ik, 140, y + 55, .44, C.maroon, 5.5);
    T(rg, 196, y + 42, 22, t1, { w: 800 });
    TP(rg, 196, y + 72, 17, t2, 850, { c: C.ink2, lh: 22 });
  });
  const alts = [
    ['MILP', 'on/off decisions, discrete unit sizes', 'not needed for sizing — kept for later'],
    ['Stochastic / robust', 'forecast and availability uncertainty', 'Chapter 4, with MPC'],
    ['Metaheuristics (GA, PSO)', 'no optimality guarantee', 'not used'],
    ['Simulation tools', 'evaluate a given design; do not find the minimum', 'used to cross-check'],
  ];
  const ag = inG(g, lt, 5.6, .7, 0, 30);
  card(ag, 1160, 290, 680, 600, { fill: C.paper });
  T(ag, 1190, 334, 16, 'ALTERNATIVES — AND WHERE THEY FIT', { w: 800, c: C.maroon, ls: 2 });
  alts.forEach(([m, why, where], i) => {
    const y = 380 + i * 112;
    E('line', { x1: 1190, x2: 1810, y1: y - 18, y2: y - 18, stroke: C.rule, 'stroke-width': 1.2 }, ag);
    T(ag, 1190, y + 10, 20, m, { w: 800 });
    T(ag, 1190, y + 38, 16, why, { c: C.muted });
    pill(ag, 1190, y + 66, where, { s: 14, fill: i === 1 ? C.maroonT : C.faint, c: i === 1 ? C.maroon : C.ink2 });
  });
  E('rect', { x: 1180, y: 832, width: 640, height: 44, rx: 10, fill: C.maroonT }, ag);
  T(ag, 1500, 860, 15, 'Limitation: perfect foresight → an upper bound; Ch. 4 removes it', { a: 'middle', w: 700, c: C.maroon });
  cap(g, lt, 7.8, 'Linear physics, a guaranteed optimum and seconds per run — every number shown is the true minimum under its assumptions.', { s: 25, y: 972 });
}

// ------------------------------------------------------------ methodology: 25-year project, annual cost basis
function sLifetime(g, lt) {
  head(g, lt, 'COST BASIS', 'A 25-year project, reported as a cost per year — at 90% displacement');
  const x0 = 420, x1 = 1180, X = yv => x0 + (x1 - x0) * yv / 25;
  const ax = inG(g, lt, .3, .6, 0);
  E('line', { x1: x0, x2: x1, y1: 690, y2: 690, stroke: C.ink2, 'stroke-width': 2 }, ax);
  for (const yv of [0, 5, 10, 15, 20, 25]) { E('line', { x1: X(yv), x2: X(yv), y1: 690, y2: 698, stroke: C.ink2, 'stroke-width': 2 }, ax); T(ax, X(yv), 722, 15, `yr ${yv}`, { a: 'middle', c: C.muted }); }
  T(ax, x1, 752, 15, 'horizon = PV plant life (25 years)', { a: 'end', w: 700, c: C.maroon });
  const rows = [
    ['PV plant', 'same 477 MWp in AM, RE+BESS, EEF', C.sun, 'bar', .6, 'cancels'],
    ['Grid tariff', '876 GWh/yr at the same price in all four', C.am, 'ticks', 1.4, 'cancels'],
    ['Battery (RE+BESS)', 'bought at yr 0, replaced at yr 15', C.bess, 'battery', 2.2, 'US$38.7 M/yr'],
    ['EEF contract', 'paid each year per MWh shifted — no capital', C.maroon, 'ticks', 3.0, 'US$21.7 M/yr'],
  ];
  rows.forEach(([nm, sub, col, kind, at, res], i) => {
    const y = 300 + i * 96, rg = inG(g, lt, at, .6, 0, -20), u = P(lt, at + .2, 1.2, eIO);
    T(rg, 80, y + 24, 20, nm, { w: 800 });
    T(rg, 80, y + 48, 15, sub, { c: C.muted });
    if (kind === 'bar') E('rect', { x: x0, y: y + 10, width: (x1 - x0) * u, height: 34, rx: 5, fill: col, opacity: .85 }, g);
    if (kind === 'ticks') for (let k = 0; k < 25 * u; k++) E('rect', { x: X(k) + 4, y: y + 12, width: (x1 - x0) / 25 - 8, height: 30, rx: 3, fill: col, opacity: col === C.am ? .6 : .9 }, g);
    if (kind === 'battery') {
      E('rect', { x: x0, y: y + 10, width: (X(15) - x0) * clamp(u * 25 / 15), height: 34, rx: 5, fill: col }, g);
      if (u > .6) E('rect', { x: X(15) + 2, y: y + 10, width: (X(25) - X(15) - 2) * clamp((u - .6) / .4), height: 34, rx: 5, fill: col, opacity: .75 }, g);
      const mg = inG(g, lt, at + 1.4, .5, 0);
      T(mg, X(0) + 10, y + 33, 14, 'buy US$273.1 M', { w: 700, c: '#fff' });
      T(mg, X(15) + 10, y + 33, 14, 'replace', { w: 700, c: '#fff' });
      E('line', { x1: X(25), x2: X(25), y1: y + 4, y2: y + 50, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '3 3' }, mg);
      T(mg, X(25) - 6, y + 66, 13, '5 yr of life left → salvage', { a: 'end', c: C.ink2, it: true });
    }
    const pg = inG(g, lt, at + 1.2, .5, 0);
    pill(pg, 1200, y + 27, res, { s: 16, w: 800, fill: res === 'cancels' ? C.faint : col === C.bess ? C.bessL : C.maroonT, c: res === 'cancels' ? C.muted : col === C.bess ? C.bess : C.maroon });
  });
  const eg = inG(g, lt, 5.4, .7, 0, -20);
  E('rect', { x: 80, y: 790, width: 1300, height: 120, rx: 14, fill: C.paper, stroke: C.rule, 'stroke-width': 1.5 }, eg);
  EQN(eg, 'crf', 110, 806, eqH('crf', 30), C.ink);
  TP(eg, 830, 832, 17, '8%, n = 15 yr → CRF = 0.1168; φ = 2.5% O&M. 1,320 MWh × US$207/kWh × 0.1418 = US$38.7 M/yr', 530, { c: C.ink2, lh: 23 });
  const rg = inG(g, lt, 7.2, .8, 0, 30);
  E('rect', { x: 1440, y: 290, width: 400, height: 620, rx: 16, fill: C.maroon, filter: 'url(#sh)' }, rg);
  T(rg, 1470, 340, 16, 'CHECKED OVER 25 YEARS', { w: 800, c: '#fff', ls: 2, op: .85 });
  TP(rg, 1470, 386, 18, 'Explicit cash flows, battery replaced at year 15, salvage at year 25:', 340, { c: '#fff', lh: 25 });
  T(rg, 1470, 486, 38, 'US$39.1 M/yr', { f: F.slab, w: 700, c: '#fff' });
  T(rg, 1470, 514, 16, '(+1% vs. the annualized US$38.7 M)', { c: '#fff', op: .8 });
  T(rg, 1470, 580, 16, 'PRESENT VALUE, 25 YR AT 8%', { w: 800, c: '#fff', ls: 2, op: .85 });
  T(rg, 1470, 628, 30, 'Battery ≈ US$419 M', { f: F.slab, w: 700, c: '#fff' });
  T(rg, 1470, 672, 30, 'EEF ≈ US$232 M', { f: F.slab, w: 700, c: '#fff' });
  TP(rg, 1470, 740, 15, 'Next: PV and battery degradation, price escalation, discount rate 6/8/10% and 20/30-year horizons.', 340, { c: '#fff', op: .85, lh: 21 });
  cap(g, lt, 9.0, 'What all options share cancels out — the comparison is the yearly cost of covering the night.', { y: 972 });
}

// ------------------------------------------------------------ conclusion: the verdict scorecard
function sVerdict(g, lt) {
  head(g, lt, 'THE VERDICT', 'Which configuration wins? — three pillars at 90% displacement');
  const p9 = DATA.disp.sites.riyadh.find(p => p.X === 90), em9 = fmt(.1 * 497.6, 1);
  const cols = [['shield', 'Reliability', 'data-center load served'], ['leaf', 'Emissions', 'displacement · kt CO₂/yr'], ['cost', 'Cost (25 yr)', 'US$/MWh, grid room + carbon counted']];
  const cx = i => 640 + i * 330, cw = 300;
  const hg = inG(g, lt, .4, .6, 0);
  cols.forEach(([ik, t1, t2], i) => {
    ico(hg, ik, cx(i) + 34, 300, .36, C.maroon, 5.5);
    T(hg, cx(i) + 64, 300, 21, t1, { w: 800, c: C.maroon });
    T(hg, cx(i) + 64, 324, 14, t2, { c: C.muted });
  });
  T(hg, 1660, 300, 21, 'All three?', { w: 800, c: C.maroon });
  const rows = [
    ['GRID', 'today’s default', [[1, '100%'], [0, '0% · 497.6'], [0, `US$${fmt(p9.grid, 1)} — new load at night`]], 0],
    ['AM', 'today’s I-REC claim', [[1, '100%'], [0, '40.4% · 296.4'], [0, `US$${fmt(p9.am, 1)} — clean on paper`]], 0],
    ['RE+BESS', 'PV + battery', [[1, '100%'], [1, `90% · ${em9}`], [0, `US$${fmt(p9.bess, 1)} + ≈ 1.3 GWh battery`]], 0],
    ['EEF', 'this work', [[1, '100%'], [1, `90% · ${em9}`], [1, `US$${fmt(p9.eef, 1)} — lowest, no storage`]], 1],
  ];
  rows.forEach(([k, sub, cells, win], r) => {
    const y = 360 + r * 118, at = 1.0 + r * 1.6, rg = inG(g, lt, at, .7, 0, -30);
    const winU = win ? P(lt, at + 2.6, .8, eIO) : 0;
    E('rect', { x: 80, y, width: 1760, height: 100, rx: 14, fill: win ? C.maroonT : C.paper, stroke: win ? C.maroon : C.rule, 'stroke-width': win ? 2 + 2 * winU : 1.5, filter: 'url(#sh)' }, rg);
    E('rect', { x: 80, y, width: 10, height: 100, rx: 4, fill: CC[k] }, rg);
    T(rg, 116, y + 50, 30, k, { f: F.slab, w: 700, c: inkOf(k) });
    T(rg, 116, y + 78, 15, sub, { c: C.muted, it: true });
    cells.forEach(([ok, txt], i) => {
      const mu = P(lt, at + .4 + i * .25, .5, eBack);
      if (mu > 0) { const mg = G(rg, { transform: `translate(${cx(i) + 30} ${y + 50}) scale(${Math.max(.01, mu).toFixed(3)})` }); (ok ? okMark : xMark)(mg, 0, 0, 20, ok ? C.maroon : C.am); }
      TP(rg, cx(i) + 62, y + (wrap(txt, 17, cw - 70, 600).length > 1 ? 44 : 56), 17, txt, cw - 70, { w: 600, c: ok ? C.ink : C.muted, lh: 21 });
    });
    const all = cells.every(c => c[0]);
    const au = P(lt, at + 1.2, .5, eBack);
    if (au > 0) { const ag = G(rg, { transform: `translate(1690 ${y + 50}) scale(${Math.max(.01, au).toFixed(3)})` }); (all ? okMark : xMark)(ag, 0, 0, 26, all ? C.maroon : C.am); }
    if (win && winU > 0) {
      const wg = G(g, { opacity: winU.toFixed(3), transform: `translate(${(1 - winU) * 30} 0)` });
      E('rect', { x: 1730, y: y + 30, width: 96, height: 40, rx: 20, fill: C.maroon }, wg);
      T(wg, 1778, y + 57, 17, 'WINNER', { a: 'middle', w: 800, c: '#fff', ls: 1 });
    }
  });
  const ng = inG(g, lt, 8.6, .8, 10);
  E('rect', { x: 80, y: 842, width: 1760, height: 84, rx: 14, fill: C.maroon }, ng);
  TR(ng, 110, 878, 22, [['EEF is the only configuration that meets all three pillars at once ', { w: 800 }], ['— in Riyadh and at NEOM.', {}]], { c: '#fff' });
  T(ng, 110, 910, 17, `Costs on top of the US$48/MWh tariff, with grid reinforcement and carbon valued. On the bill alone, EEF wins if SPPC buys its PV at ≈ US$${fmt(p9.pv_bill, 0)}/MWh.`, { c: '#fff', op: .9 });
}
