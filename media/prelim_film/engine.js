// Prelim film engine: palette, drawing helpers, icons and the persistent chrome.
// Every frame is rebuilt from scratch by render(t), so a frame depends only on t.
const NS = 'http://www.w3.org/2000/svg';
const W = 1920, H = 1080;
const C = {
  bg: '#FAF8F5', paper: '#FFFFFF', ink: '#1E1E1E', ink2: '#454545', muted: '#707373', rule: '#D8D4CE', faint: '#ECE8E2',
  maroon: '#500000', maroonD: '#3C0000', maroon2: '#7A2A2A', maroonL: '#B98585', maroonT: '#F2E7E7',
  sun: '#D9962B', sunD: '#9A6512', sunL: '#F5DDAE', dc: '#2F3337', bess: '#4F6D8F', bessL: '#D3DDE8',
  grid: '#5E6163', am: '#A9ABAD', white: '#FFFFFF',
};
const F = { slab: "'Roboto Slab', Georgia, serif", sans: "'Open Sans', Arial, sans-serif" };
const DAY = (window.DATA && DATA.days) ? DATA.days['summer (Jul 15)'] : null;

const svg = document.getElementById('film');

// ---------------------------------------------------------------- DOM helpers
function E(tag, a, p, txt) {
  const e = document.createElementNS(NS, tag);
  if (a) for (const k in a) if (a[k] !== undefined && a[k] !== null) e.setAttribute(k, a[k]);
  if (txt !== undefined) e.textContent = txt;
  (p || stage).appendChild(e);
  return e;
}
const G = (p, a) => E('g', a || {}, p);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const eIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eOut = x => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
const eBack = x => { x = clamp(x); const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const P = (lt, a, d = .6, f = eOut) => f((lt - a) / d);
const fmt = (v, d = 0) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// persistent layers: defs, the stage that is cleared every frame, and a hidden text measurer
const defs = E('defs', {}, svg);
const stage = E('g', {}, svg);
const meas = E('text', { x: -5000, y: -5000, opacity: 0 }, svg);

// group that fades/slides in at local time a
function inG(p, lt, a, d = .7, dy = 22, dx = 0) {
  const u = P(lt, a, d);
  const g = G(p, { opacity: u.toFixed(3), transform: `translate(${(1 - u) * dx} ${(1 - u) * dy})` });
  if (u <= 0) g.setAttribute('display', 'none');
  return g;
}
// group visible between a and b (fades in and out)
function winG(p, lt, a, b, d = .5) {
  const u = Math.min(P(lt, a, d), 1 - P(lt, b - d, d, eIO));
  const g = G(p, { opacity: clamp(u).toFixed(3) });
  if (u <= 0) g.setAttribute('display', 'none');
  return g;
}
function popG(p, lt, a, x, y, d = .55) {
  const u = P(lt, a, d, eBack), s = Math.max(0.001, u);
  const g = G(p, { transform: `translate(${x} ${y}) scale(${s.toFixed(4)})`, opacity: clamp(u * 1.6).toFixed(3) });
  if (u <= 0) g.setAttribute('display', 'none');
  return g;
}

// ---------------------------------------------------------------- text
function T(p, x, y, s, str, o = {}) {
  const a = { x, y, 'font-size': s, 'font-family': o.f || F.sans, 'font-weight': o.w || 400, fill: o.c || C.ink };
  if (o.a) a['text-anchor'] = o.a;
  if (o.ls) a['letter-spacing'] = o.ls;
  if (o.op != null) a.opacity = o.op;
  if (o.it) a['font-style'] = 'italic';
  if (o.db) a['dominant-baseline'] = o.db;
  return E('text', a, p, str);
}
// inline runs: [[text, {c, w, f, it}], ...]
function TR(p, x, y, s, runs, o = {}) {
  const t = T(p, x, y, s, '', o);
  for (const [str, ro = {}] of runs) {
    const a = {};
    if (ro.c) a.fill = ro.c;
    if (ro.w) a['font-weight'] = ro.w;
    if (ro.f) a['font-family'] = ro.f;
    if (ro.it) a['font-style'] = 'italic';
    if (ro.s) a['font-size'] = ro.s;
    if (ro.dy) a.dy = ro.dy;
    E('tspan', a, t, str);
  }
  return t;
}
const _mc = {};
function tw(str, s, w = 400, f = F.sans) {
  const k = `${str}|${s}|${w}|${f}`;
  if (_mc[k] != null) return _mc[k];
  meas.setAttribute('font-size', s); meas.setAttribute('font-weight', w); meas.setAttribute('font-family', f);
  meas.textContent = str;
  return (_mc[k] = meas.getComputedTextLength());
}
function wrap(str, s, maxW, w = 400, f = F.sans) {
  const out = [];
  for (const para of String(str).split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const t = line ? line + ' ' + word : word;
      if (line && tw(t, s, w, f) > maxW) { out.push(line); line = word; } else line = t;
    }
    out.push(line);
  }
  return out;
}
// wrapped paragraph; returns its height
function TP(p, x, y, s, str, maxW, o = {}) {
  const lines = wrap(str, s, maxW, o.w || 400, o.f || F.sans);
  const lh = o.lh || s * 1.38;
  lines.forEach((l, i) => T(p, x, y + i * lh, s, l, o));
  return lines.length * lh;
}

// ---------------------------------------------------------------- paths
function drawP(p, d, u, a) {
  const e = E('path', Object.assign({ d, fill: 'none' }, a), p);
  if (u <= 0) { e.setAttribute('opacity', 0); return e; }
  if (u < 1) { const L = e.getTotalLength(); e.setAttribute('stroke-dasharray', `${L} ${L}`); e.setAttribute('stroke-dashoffset', L * (1 - u)); }
  return e;
}
const poly = pts => 'M' + pts.map(q => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' L');
// monotone cubic interpolation (Fritsch–Carlson)
function mono(xs, ys) {
  const n = xs.length, d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) d[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return x => {
    x = clamp(x, xs[0], xs[n - 1]);
    let i = 0; while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}
// hourly profile (value for hour h placed at h+0.5) -> smooth function of hour in [0,24]
function hourly(arr) {
  const xs = [0], ys = [arr[0]];
  arr.forEach((v, i) => { xs.push(i + .5); ys.push(v); });
  xs.push(24); ys.push(arr[arr.length - 1]);
  const f = mono(xs, ys);
  return h => Math.max(0, f(h));
}
const PV = DAY ? hourly(DAY.pv) : (h => 0);
function sample(f, a, b, n = 160) { const out = []; for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; out.push([x, f(x)]); } return out; }

// ---------------------------------------------------------------- equations (MathJax SVG)
const _eq = {};
function EQN(p, key, x, y, hPx, color = C.ink) {
  const q = window.EQ[key];
  if (!_eq[key]) _eq[key] = new DOMParser().parseFromString(q.svg, 'image/svg+xml').documentElement;
  const node = document.importNode(_eq[key], true);
  const [vx, vy, vw, vh] = q.vb;
  const wPx = hPx * vw / vh;
  node.setAttribute('x', x); node.setAttribute('y', y); node.setAttribute('width', wPx); node.setAttribute('height', hPx);
  node.removeAttribute('style');
  node.setAttribute('color', color);
  node.style.color = color;
  p.appendChild(node);
  return wPx;
}
// height in px of an equation for a given em size
const eqH = (key, em) => window.EQ[key].vb[3] / 1000 * em;

// ---------------------------------------------------------------- defs
(function makeDefs() {
  const pat = (id, color, w = 2, gap = 9, bg) => {
    const p = E('pattern', { id, width: gap, height: gap, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    if (bg) E('rect', { width: gap, height: gap, fill: bg }, p);
    E('line', { x1: 0, y1: 0, x2: 0, y2: gap, stroke: color, 'stroke-width': w }, p);
  };
  pat('hM', C.maroon, 2.2, 10, C.maroonT);
  pat('hG', '#9a9c9e', 2, 10, '#EFEDEA');
  pat('hS', C.sun, 2, 10, C.sunL);
  pat('hB', C.bess, 2, 10, C.bessL);
  pat('hW', 'rgba(255,255,255,.35)', 2, 12);
  const f = E('filter', { id: 'sh', x: '-10%', y: '-10%', width: '120%', height: '130%' }, defs);
  E('feDropShadow', { dx: 0, dy: 6, stdDeviation: 10, 'flood-color': '#3a1a1a', 'flood-opacity': .10 }, f);
  const g1 = E('linearGradient', { id: 'gSun', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  E('stop', { offset: 0, 'stop-color': '#E8AE4A', 'stop-opacity': .95 }, g1);
  E('stop', { offset: 1, 'stop-color': '#F6E2B8', 'stop-opacity': .75 }, g1);
  const g2 = E('linearGradient', { id: 'gMar', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  E('stop', { offset: 0, 'stop-color': '#6A1010' }, g2);
  E('stop', { offset: 1, 'stop-color': '#3C0000' }, g2);
  const g3 = E('radialGradient', { id: 'gGlow' }, defs);
  E('stop', { offset: 0, 'stop-color': C.maroon, 'stop-opacity': .45 }, g3);
  E('stop', { offset: 1, 'stop-color': C.maroon, 'stop-opacity': 0 }, g3);
  const g4 = E('radialGradient', { id: 'gGlowS' }, defs);
  E('stop', { offset: 0, 'stop-color': '#F2B64A', 'stop-opacity': .55 }, g4);
  E('stop', { offset: 1, 'stop-color': '#F2B64A', 'stop-opacity': 0 }, g4);
})();

// ---------------------------------------------------------------- icons (drawn in a 100x100 box, centred at 0,0)
function ico(p, kind, x, y, s = 1, col = C.maroon, sw = 4) {
  const g = G(p, { transform: `translate(${x} ${y}) scale(${s})`, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const L = (d, a) => E('path', Object.assign({ d }, a || {}), g);
  switch (kind) {
    case 'sun':
      E('circle', { r: 20, fill: col, stroke: 'none' }, g);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; L(`M${30 * Math.cos(a)},${30 * Math.sin(a)} L${42 * Math.cos(a)},${42 * Math.sin(a)}`); }
      break;
    case 'pv':
      L('M-44,14 L-26,-26 L44,-26 L26,14 Z');
      L('M-35,-6 L35,-6'); L('M-9,-26 L-21,14'); L('M17,-26 L5,14');
      L('M0,14 L0,40'); L('M-18,40 L18,40');
      break;
    case 'dc':
      L('M-40,-42 H40 V44 H-40 Z');
      for (const cx of [-22, 0, 22]) { L(`M${cx - 7},-30 V34`); L(`M${cx + 7},-30 V34`); }
      for (const cx of [-22, 0, 22]) for (const cy of [-20, -4, 12, 28]) E('circle', { cx, cy, r: 2.2, fill: col, stroke: 'none' }, g);
      break;
    case 'pylon':
      L('M-26,44 L-6,-40 L6,-40 L26,44'); L('M-34,-26 H34'); L('M-28,-8 H28');
      L('M-16,4 L14,30'); L('M16,4 L-14,30'); L('M-11,-26 L9,-8'); L('M11,-26 L-9,-8');
      break;
    case 'battery':
      L('M-40,-24 H34 V24 H-40 Z'); L('M34,-10 H42 V10 H34');
      E('rect', { x: -32, y: -16, width: 22, height: 32, fill: col, stroke: 'none' }, g);
      E('rect', { x: -6, y: -16, width: 22, height: 32, fill: col, stroke: 'none', opacity: .5 }, g);
      break;
    case 'desal':
      L('M0,-42 C14,-22 26,-8 26,8 A26,26 0 0 1 -26,8 C-26,-8 -14,-22 0,-42 Z');
      L('M-14,12 Q-7,6 0,12 T14,12');
      L('M-46,40 Q-34,32 -22,40 T2,40 T26,40 T50,40');
      break;
    case 'cool':
      for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; L(`M${-24 * Math.cos(a) - 14},${-24 * Math.sin(a) - 8} L${24 * Math.cos(a) - 14},${24 * Math.sin(a) - 8}`); }
      L('M22,-24 H46 V40 H22 Z'); L('M22,-8 H46'); L('M22,8 H46');
      break;
    case 'pump':
      E('circle', { cx: -6, cy: 6, r: 24 }, g);
      L('M-6,6 L-6,-12'); L('M-6,6 L10,14'); L('M-6,6 L-22,14');
      L('M18,-6 H48'); L('M-48,18 H-30');
      L('M40,14 C44,20 46,24 46,28 A6,6 0 0 1 34,28 C34,24 36,20 40,14 Z');
      break;
    case 'factory':
      L('M-46,42 V-6 L-22,6 V-6 L2,6 V-6 L26,6 V-36 H40 V42 Z');
      L('M-34,24 H-24'); L('M-10,24 H0'); L('M14,24 H24');
      break;
    case 'shield':
      L('M0,-44 L36,-30 V2 C36,24 18,38 0,46 C-18,38 -36,24 -36,2 V-30 Z'); L('M-16,2 L-4,14 L18,-10');
      break;
    case 'leaf':
      E('circle', { r: 36 }, g); L('M0,0 V-22'); L('M0,0 L16,10');
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; L(`M${30 * Math.cos(a)},${30 * Math.sin(a)} L${36 * Math.cos(a)},${36 * Math.sin(a)}`); }
      break;
    case 'cost':
      E('circle', { r: 38 }, g);
      L('M14,-16 C10,-24 -14,-26 -16,-12 C-18,2 16,0 16,14 C16,28 -10,28 -16,18'); L('M0,-30 V30');
      break;
    case 'node':
      E('circle', { r: 12, fill: col, stroke: 'none' }, g);
      for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; L(`M${14 * Math.cos(a)},${14 * Math.sin(a)} L${32 * Math.cos(a)},${32 * Math.sin(a)}`); E('circle', { cx: 38 * Math.cos(a), cy: 38 * Math.sin(a), r: 7 }, g); }
      break;
    case 'doc':
      L('M-30,-42 H18 L32,-28 V42 H-30 Z'); L('M18,-42 V-28 H32'); L('M-18,-14 H18'); L('M-18,0 H18'); L('M-18,14 H6');
      E('circle', { cx: 14, cy: 28, r: 10 }, g);
      break;
    case 'clock':
      E('circle', { r: 38 }, g); L('M0,0 V-24'); L('M0,0 L18,0');
      break;
    case 'search':
      E('circle', { cx: -8, cy: -8, r: 26 }, g); L('M12,12 L38,38');
      break;
    case 'check':
      L('M-24,2 L-6,20 L26,-18');
      break;
  }
  return g;
}

// ---------------------------------------------------------------- recurring layout pieces
function head(p, lt, kicker, title, o = {}) {
  const g = inG(p, lt, o.at != null ? o.at : .1, .8, 16);
  T(g, 80, 150, 18, kicker, { w: 700, c: C.maroon, ls: 4 });
  const lines = Array.isArray(title) ? title : [title];
  lines.forEach((l, i) => T(g, 80, 214 + i * 60, o.size || 50, l, { f: F.slab, w: 600 }));
  return g;
}
function cap(p, lt, a, str, o = {}) {
  const g = inG(p, lt, a, .8, 10);
  const lines = String(str).split('\n');
  const y0 = (o.y || 968) - (lines.length - 1) * 36;
  lines.forEach((l, i) => T(g, 960, y0 + i * 36, o.s || 27, l, { a: 'middle', c: o.c || C.ink2 }));
  return g;
}
function source(p, lt, a, str) {
  const g = inG(p, lt, a, .8, 0);
  T(g, 1840, 108, 15, str, { a: 'end', c: C.muted, it: true });
  return g;
}
function card(p, x, y, w, h, o = {}) {
  return E('rect', { x, y, width: w, height: h, rx: o.rx != null ? o.rx : 14, fill: o.fill || C.paper, stroke: o.stroke || C.rule, 'stroke-width': o.sw || 1.5, filter: o.flat ? null : 'url(#sh)' }, p);
}
function pill(p, x, y, str, o = {}) {
  const s = o.s || 19, w = tw(str, s, o.w || 600) + 2 * (o.px || 16), h = s + 2 * (o.py || 9);
  const g = G(p);
  E('rect', { x: o.a === 'middle' ? x - w / 2 : x, y: y - h / 2, width: w, height: h, rx: h / 2, fill: o.fill || C.maroonT, stroke: o.stroke || 'none', 'stroke-width': 1.5 }, g);
  T(g, o.a === 'middle' ? x : x + w / 2, y + s * .36, s, str, { a: 'middle', w: o.w || 600, c: o.c || C.maroon });
  return w;
}
function arrowHead(p, x, y, ang, s = 12, col = C.maroon) {
  const a1 = ang + Math.PI * .82, a2 = ang - Math.PI * .82;
  E('path', { d: `M${x},${y} L${x + s * Math.cos(a1)},${y + s * Math.sin(a1)} L${x + s * Math.cos(a2)},${y + s * Math.sin(a2)} Z`, fill: col }, p);
}
// moving dots along a path element
function particles(p, pathEl, lt, n, speed, col, r = 6, op = 1) {
  const L = pathEl.getTotalLength();
  for (let i = 0; i < n; i++) {
    const f = ((lt * speed / L) + i / n) % 1;
    const q = pathEl.getPointAtLength(f * L);
    const edge = Math.min(f / .08, (1 - f) / .08, 1);
    E('circle', { cx: q.x, cy: q.y, r, fill: col, opacity: (op * edge).toFixed(3) }, p);
  }
}

// ---------------------------------------------------------------- chrome
const SECTIONS = [
  ['01', 'Motivation'], ['02', 'Problem'], ['03', 'State of the Art'], ['04', 'Questions & Objectives'],
  ['05', 'Methodology'], ['06', 'Results: Riyadh'], ['07', 'Case: NEOM'], ['08', 'Implementation in KSA'],
  ['09', 'Expected Results'], ['10', 'Research Plan'], ['11', 'Contributions & Conclusion'],
];
function chrome(t, sc, alpha) {
  const g = G(stage, { opacity: alpha.toFixed(3) });
  E('rect', { x: 80, y: 58, width: 12, height: 12, fill: C.maroon }, g);
  if (sc.sec > 0) {
    const [n, name] = SECTIONS[sc.sec - 1];
    T(g, 104, 70, 16, n, { w: 700, c: C.maroon, ls: 3 });
    T(g, 140, 70, 16, name.toUpperCase(), { w: 600, c: C.muted, ls: 3 });
  } else T(g, 104, 70, 16, sc.label || '', { w: 600, c: C.muted, ls: 3 });
  T(g, 1840, 70, 15, 'PHD PRELIMINARY EXAMINATION', { a: 'end', w: 600, c: C.muted, ls: 3 });
  // progress track with section stops
  const x0 = 80, x1 = 1840, y = 1022, X = tt => x0 + (x1 - x0) * tt / T_END;
  E('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: C.rule, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
  E('line', { x1: x0, x2: X(t), y1: y, y2: y, stroke: C.maroon, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
  for (const s of SECTION_STARTS) E('circle', { cx: X(s.t), cy: y, r: 5, fill: t >= s.t ? C.maroon : C.bg, stroke: t >= s.t ? C.maroon : C.rule, 'stroke-width': 2 }, g);
  T(g, 80, 1056, 15, 'ALI NASSER  ·  ECEN  ·  TEXAS A&M UNIVERSITY', { w: 600, c: C.muted, ls: 2 });
  if (sc.sec > 0) T(g, 1840, 1056, 15, `${SECTIONS[sc.sec - 1][0]} / ${SECTIONS.length}`, { a: 'end', w: 700, c: C.maroon, ls: 2 });
}

// ---------------------------------------------------------------- timeline
let SC = [], T_END = 0, SECTION_STARTS = [];
function buildTimeline(defsList) {
  let t = 0;
  SC = defsList.map(([id, dur, sec, draw, o = {}]) => { const s = Object.assign({ id, a: t, b: t + dur, dur, sec, draw }, o); t += dur; return s; });
  T_END = t;
  SECTION_STARTS = [];
  SC.forEach(s => { if (s.card) SECTION_STARTS.push({ t: s.a, sec: s.sec }); });
}
function sceneIndex(t) {
  for (let i = 0; i < SC.length; i++) if (t < SC[i].b) return i;
  return SC.length - 1;
}
function render(t) {
  t = clamp(t, 0, T_END - 1e-6);
  stage.replaceChildren();
  E('rect', { width: W, height: H, fill: C.bg }, stage);
  const i = sceneIndex(t), sc = SC[i], lt = t - sc.a, dur = sc.dur;
  const root = G(stage);
  if (!sc.card && sc.fade !== false) {
    const fi = sc.fadeIn === false ? 1 : eIO(lt / .45), fo = eIO((dur - lt) / .45);
    root.setAttribute('opacity', Math.min(fi, fo).toFixed(3));
  }
  if (sc.cam !== false && !sc.card) {
    const k = 1 + .016 * lt / dur;
    root.setAttribute('transform', `translate(960 540) scale(${k.toFixed(5)}) translate(-960 -540)`);
  }
  sc.draw(root, lt, dur);
  if (sc.chrome !== false && !sc.card) {
    const prev = SC[i - 1], next = SC[i + 1];
    const hasC = s => s && s.chrome !== false && !s.card;
    let al = 1;
    if (!hasC(prev)) al = Math.min(al, eIO(lt / .6));
    if (!hasC(next)) al = Math.min(al, eIO((dur - lt) / .6));
    chrome(t, sc, al);
  }
  window.__T__ = t;
}

// chapter card: maroon panel wipes in, holds, wipes out
function chapterCard(n, title, sub) {
  return (g, lt, dur) => {
    const inU = eIO(lt / .5), outU = eIO((lt - (dur - .5)) / .5);
    const x = -W * (1 - inU) + W * outU;
    const cg = G(g, { transform: `translate(${x.toFixed(1)} 0)` });
    E('rect', { width: W, height: H, fill: C.maroon }, cg);
    E('rect', { x: outU > 0 ? 0 : W - 16, width: 16, height: H, fill: C.maroonD }, cg);
    T(cg, 1840, 860, 420, n, { a: 'end', f: F.slab, w: 700, c: '#fff', op: .07 });
    const tu = P(lt, .35, .8);
    const tg = G(cg, { opacity: tu.toFixed(3), transform: `translate(${(-(1 - tu) * 50).toFixed(1)} 0)` });
    T(tg, 150, 470, 22, `${n}  /  ${SECTIONS.length}`, { w: 700, c: '#fff', ls: 6, op: .7 });
    T(tg, 144, 575, 96, title, { w: 800, c: '#fff' });
    drawP(tg, 'M150,622 H470', P(lt, .7, .9), { stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round' });
    if (sub) T(tg, 150, 690, 32, sub, { w: 300, c: '#fff', op: .88 });
  };
}
