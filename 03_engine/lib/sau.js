// Stone Age Upgrade — scene runtime (loaded inside the page)
(function () {
  const q = new URLSearchParams(location.search);
  const W = +q.get('w') || 1920, H = +q.get('h') || 1080;
  const PORTRAIT = H > W;

  const BRAND = {
    ink: '#1E1612', earth: '#3B2418', ochre: '#C8763A', rust: '#9E4A26',
    sand: '#E8C48A', bone: '#F3E6CF', sky: '#F2B872', dusk: '#7A3B2E',
    tech: '#3DF5FF', techDeep: '#0E6F7A',
    fontDisplay: '"Archivo Black", "Anton", sans-serif',
    fontUI: '"Inter", "DM Sans", sans-serif',
    fontMono: '"Anonymous Pro", "DejaVu Sans Mono", monospace',
  };

  // ---------- math / easing ----------
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const E = {
    linear: k => k,
    inOut: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
    out: k => 1 - Math.pow(1 - k, 3),
    in: k => k * k * k,
    back: k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    elastic: k => k === 0 || k === 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * (2 * Math.PI) / 3) + 1,
  };
  // progress of t inside [a,b] with easing
  const p = (t, a, b, ease = E.inOut) => ease(clamp((t - a) / (b - a)));
  // value tween
  const tw = (t, a, b, v0, v1, ease) => lerp(v0, v1, p(t, a, b, ease));
  // deterministic noise
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  // ---------- svg helpers ----------
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const set = (e, attrs) => { for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

  // "line boil": hand-drawn shapes re-drawn with a new seed every N frames
  let rsvg = null;
  const boil = (group, drawFn, t, every = 0.125) => {
    const seed = Math.floor(t / every) + 1;
    if (group.__seed === seed) return;
    group.__seed = seed;
    while (group.firstChild) group.removeChild(group.firstChild);
    drawFn(rsvg, seed, group);
  };

  // number formatting
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const year = y => y < 0 ? fmt(-y) + ' BC' : fmt(y) + ' AD';

  window.SAU = {
    W, H, PORTRAIT, BRAND, E, clamp, lerp, p, tw, hash, el, set, boil, fmt, year,
    duration: 5, ready: false,
    init(fn) {
      const svg = el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` });
      document.body.appendChild(svg);
      rsvg = rough.svg(svg);
      this.svg = svg;
      const ctx = fn(svg, this) || {};
      this.seek = t => ctx.update(t);
      document.fonts.ready.then(() => { this.seek(0); this.ready = true; });
    },
    seek() {},
  };
})();
// canvas-generated noise textures (fast, rasterized once)
SAU.noiseURL = function (w, h, alpha, seed, blotchy) {
  const c = document.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(h);
  const g = c.getContext('2d'); const d = g.createImageData(c.width, c.height);
  let s = seed * 9301 + 49297;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < d.data.length; i += 4) {
    const v = rnd(); const dark = v < .5;
    d.data[i] = dark ? 20 : 250; d.data[i+1] = dark ? 14 : 235; d.data[i+2] = dark ? 10 : 210;
    d.data[i+3] = Math.floor(Math.abs(v - .5) * 2 * 255 * alpha);
  }
  g.putImageData(d, 0, 0);
  if (blotchy) { g.globalAlpha = .25; for (let k = 0; k < 40; k++) { g.fillStyle = rnd() < .5 ? '#000' : '#fff'; g.beginPath(); g.arc(rnd()*w, rnd()*h, 4 + rnd()*18, 0, 7); g.fill(); } }
  return c.toDataURL('image/png');
};
