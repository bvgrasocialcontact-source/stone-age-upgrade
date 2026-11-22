// Stone Age Upgrade — EP kit: reusable backgrounds, props and HUD pieces (Style 1).
// Load after sau.js + pen.js + characters.js. All sizes in 1080p units (u = 1 at 1920x1080).
(function () {
  const { el, set, hash, clamp, p, E, BRAND: B } = SAU;
  const ROUGH = (seed, extra = {}) => Object.assign({ seed, stroke: B.ink, strokeWidth: 3, roughness: 1, bowing: .5 }, extra);
  // Claude's own look (colours only — NO Anthropic/Claude logo without Anthropic's written approval)
  const CL = SAU.CL = { orange: '#D97757', orangeDeep: '#C15F3C', cream: '#FAF9F5', paper: '#F0EEE6', line: '#E3DFD3', dark: '#141413', text: '#3D3929', mid: '#8A877D', green: '#788C5D', blue: '#6A9BCC',
    serif: '"Lora", Georgia, serif', sans: '"Poppins", "Inter", sans-serif' };

  // ---------- shared <defs> ----------
  SAU.kitDefs = function (svg) {
    const d = el('defs', {}, svg);
    d.innerHTML = `
      <filter id="kGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="kGlowBig" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="kBlur"><feGaussianBlur stdDeviation="10"/></filter>
      <radialGradient id="kFireLight"><stop offset="0" stop-color="#FFB45A" stop-opacity=".55"/><stop offset=".45" stop-color="#E2572C" stop-opacity=".18"/><stop offset="1" stop-color="#E2572C" stop-opacity="0"/></radialGradient>
      <radialGradient id="kTechLight"><stop offset="0" stop-color="#3DF5FF" stop-opacity=".6"/><stop offset=".5" stop-color="#3DF5FF" stop-opacity=".15"/><stop offset="1" stop-color="#3DF5FF" stop-opacity="0"/></radialGradient>
      <radialGradient id="kClaudeLight"><stop offset="0" stop-color="#FFE9D6" stop-opacity=".7"/><stop offset=".45" stop-color="#D97757" stop-opacity=".2"/><stop offset="1" stop-color="#D97757" stop-opacity="0"/></radialGradient>
      <filter id="kGlowWarm" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id="kHole"><stop offset="0" stop-color="#000"/><stop offset=".55" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <radialGradient id="kVig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#1E1612" stop-opacity="0"/><stop offset="1" stop-color="#1E1612" stop-opacity=".5"/></radialGradient>
      <linearGradient id="kNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141826"/><stop offset=".7" stop-color="#2A2230"/><stop offset="1" stop-color="#3B2A2A"/></linearGradient>
      <linearGradient id="kCityNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07131C"/><stop offset=".7" stop-color="#0E2A36"/><stop offset="1" stop-color="#123843"/></linearGradient>`;
    return d;
  };

  // ---------- camera ----------
  // focus point (fx,fy) is placed at screen centre offset (ox,oy) with zoom z
  SAU.cam = (g, W, H, fx, fy, z, shake = 0, t = 0) => {
    const sx = shake ? (hash(t * 91.7) - .5) * shake : 0, sy = shake ? (hash(t * 53.3 + 4) - .5) * shake : 0;
    set(g, { transform: `translate(${W / 2 + sx},${H / 2 + sy}) scale(${z}) translate(${-fx},${-fy})` });
  };

  // ---------- night camp background ----------
  SAU.drawNightCamp = function (rc, seed, g, W, H, horizon) {
    const P = SAU.makePen(1, rc, g, { seed, sw: 3 });
    // distant hills (no fixed region: generic grassland ridge)
    P.shape(`M -40 ${horizon} L ${W * .08} ${horizon - 70} L ${W * .2} ${horizon - 95} L ${W * .33} ${horizon - 40} L ${W * .5} ${horizon - 60} L ${W * .62} ${horizon - 120} L ${W * .78} ${horizon - 85} L ${W * .9} ${horizon - 110} L ${W + 40} ${horizon - 60} L ${W + 40} ${horizon} Z`, '#2B2129', 3);
    // acacia silhouette
    const tx = W * .82, ty = horizon - 60;
    P.shape(`M ${tx - 8} ${ty} L ${tx - 4} ${ty - 120} L ${tx - 40} ${ty - 170} L ${tx - 30} ${ty - 176} L ${tx + 2} ${ty - 136} L ${tx + 30} ${ty - 186} L ${tx + 40} ${ty - 180} L ${tx + 10} ${ty - 120} L ${tx + 10} ${ty} Z`, '#1B1519', 3);
    P.shape(`M ${tx - 150} ${ty - 170} Q ${tx - 60} ${ty - 230} ${tx + 10} ${ty - 205} Q ${tx + 90} ${ty - 240} ${tx + 160} ${ty - 180} Q ${tx + 10} ${ty - 160} ${tx - 150} ${ty - 170} Z`, '#1B1519', 3);
    // ground
    P.shape(`M -40 ${horizon} L ${W + 40} ${horizon} L ${W + 40} ${H + 40} L -40 ${H + 40} Z`, '#4A3326', 3);
    for (let i = 0; i < 16; i++) {
      const x = hash(i + 3) * W, y = horizon + 30 + hash(i + 17) * (H - horizon - 40);
      P.stroke(`M ${x} ${y} l ${30 + hash(i + 5) * 70} ${(hash(i) - .5) * 6}`, '#33231A', 3);
    }
    // grass tufts
    for (let i = 0; i < 10; i++) {
      const x = hash(i * 7 + 1) * W, y = horizon + 10 + hash(i * 3 + 2) * (H - horizon - 20);
      P.stroke(`M ${x} ${y} l -8 -26 M ${x + 6} ${y} l 2 -34 M ${x + 12} ${y} l 12 -24`, '#2A1C14', 3);
    }
  };
  SAU.drawStars = function (g, W, H, n = 70) {
    for (let i = 0; i < n; i++) el('circle', { cx: hash(i * 3.3) * W, cy: hash(i * 7.1) * H * .55, r: .8 + hash(i * 1.9) * 2.2, fill: '#F3E6CF', opacity: .35 + hash(i) * .5, class: 'star', 'data-i': i }, g);
  };
  SAU.twinkle = (g, t) => g.querySelectorAll('.star').forEach(s => { const i = +s.dataset.i; s.setAttribute('opacity', .25 + .6 * (0.5 + 0.5 * Math.sin(t * (1 + hash(i) * 3) + i))); });

  // ---------- campfire (intensity 0..1.2) ----------
  SAU.drawCampfire = function (rc, seed, g, x, y, k = 1) {
    // stone ring
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (i / 8), sx = x + Math.cos(a) * 96 - 0, sy = y + 10 + Math.sin(a) * 14 * (i % 2 ? 1 : .6);
      g.appendChild(rc.ellipse(sx, sy, 38, 24, ROUGH(seed + i, { fill: i % 2 ? '#6B5A4E' : '#5A4A40', fillStyle: 'solid', strokeWidth: 3 })));
    }
    for (let i = 0; i < 4; i++) {
      const a = -0.7 + i * 0.47;
      g.appendChild(rc.line(x - Math.cos(a) * 70, y + 14, x + Math.cos(a) * 70, y - 6, ROUGH(seed + 20 + i, { stroke: '#2B1A12', strokeWidth: 12, roughness: 1.2 })));
    }
    // embers
    for (let i = 0; i < 7; i++) g.appendChild(rc.circle(x - 50 + i * 17, y + 2 + hash(seed + i) * 6, 9, ROUGH(seed + 40 + i, { fill: hash(seed * 1.3 + i) > .5 ? '#FF7A2F' : '#C8401E', fillStyle: 'solid', strokeWidth: 1.5 })));
    if (k <= 0.02) return;
    const fl = (s, h, col) => {
      const j = (hash(seed * 3.1 + s) - .5) * 14, hh = h * k * (0.8 + hash(seed + s) * .35), ss = s * (0.6 + 0.4 * k);
      return rc.path(`M ${x - ss} ${y} Q ${x - ss * .9 + j} ${y - hh * .5} ${x + j} ${y - hh} Q ${x + ss * .9 + j} ${y - hh * .5} ${x + ss} ${y} Z`, ROUGH(seed, { fill: col, fillStyle: 'solid', strokeWidth: 2.5, roughness: .8 }));
    };
    g.appendChild(fl(58, 160, '#E2572C'));
    g.appendChild(fl(38, 110, '#F59B2F'));
    g.appendChild(fl(18, 64, '#FFE07A'));
  };
  // drifting sparks (deterministic by t)
  SAU.sparks = function (g, x, y, t, n = 10, k = 1) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (let i = 0; i < n; i++) {
      const life = 1.6 + hash(i) * 1.2, ph = ((t + hash(i * 3) * life) % life) / life;
      const sx = x + (hash(i * 5) - .5) * 80 + Math.sin(t * 2 + i) * 18 * ph, sy = y - 40 - ph * (160 + hash(i * 7) * 140) * k;
      el('circle', { cx: sx, cy: sy, r: 2.5 + hash(i * 2) * 2.5, fill: ph < .5 ? '#FFE07A' : '#FF7A2F', opacity: (1 - ph) * k }, g);
    }
  };

  // ---------- lighting overlay: darkness with light holes ----------
  // lights: [{x,y,r,k}] in screen space
  SAU.makeDarkness = function (svg, W, H, color = '#0B0A12', id = 'kDarkMask') {
    const defs = svg.querySelector('defs');
    const mask = el('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
    el('rect', { width: W, height: H, fill: '#fff' }, mask);
    const holes = el('g', {}, mask);
    const rect = el('rect', { width: W, height: H, fill: color, mask: `url(#${id})` }, svg);
    return {
      node: rect,
      update(lights, opacity) {
        while (holes.firstChild) holes.removeChild(holes.firstChild);
        lights.forEach(l => el('circle', { cx: l.x, cy: l.y, r: l.r, fill: 'url(#kHole)', opacity: l.k ?? 1 }, holes));
        set(rect, { opacity });
      },
    };
  };

  // ---------- phone prop (close-up) — Claude app look (no logo) ----------
  // centred at (0,0); w = width.
  SAU.makePhoneCloseup = function (parent, w = 620) {
    const h = w * 1.95, root = el('g', {}, parent);
    const body = el('g', {}, root);
    const scr = el('g', {}, root);
    const sw = w - 56, sh = h - 70;
    el('rect', { x: -sw / 2, y: -sh / 2, width: sw, height: sh, rx: 34, fill: '#0C0B0A' }, scr);
    const glow = el('rect', { x: -sw / 2, y: -sh / 2, width: sw, height: sh, rx: 34, fill: '#FFE9D6', opacity: 0, filter: 'url(#kGlowBig)' }, scr);
    const ui = el('g', {}, scr);
    el('rect', { x: -sw / 2, y: -sh / 2, width: sw, height: sh, rx: 34, fill: CL.cream }, ui);
    // status bar
    const status = el('g', {}, ui);
    el('text', { x: -sw / 2 + 40, y: -sh / 2 + 60, fill: CL.dark, 'font-family': B.fontUI, 'font-weight': 700, 'font-size': 30 }, status).textContent = '??:??';
    const bars = el('g', { transform: `translate(${sw / 2 - 360},${-sh / 2 + 36})` }, status);
    [0, 1, 2, 3].forEach(i => el('rect', { x: i * 14, y: 24 - i * 7, width: 9, height: 6 + i * 7, rx: 2, fill: CL.dark, opacity: .18 }, bars));
    el('text', { x: 66, y: 24, fill: CL.mid, 'font-family': B.fontUI, 'font-weight': 600, 'font-size': 22 }, bars).textContent = 'No service';
    const batt = el('g', { transform: `translate(${sw / 2 - 96},${-sh / 2 + 38})` }, status);
    el('rect', { width: 54, height: 26, rx: 6, fill: 'none', stroke: CL.dark, 'stroke-width': 3 }, batt);
    const battFill = el('rect', { x: 5, y: 5, width: 44, height: 16, rx: 3, fill: '#5FA55A' }, batt);
    el('rect', { x: 56, y: 8, width: 5, height: 10, rx: 2, fill: CL.dark }, batt);
    const battT = el('text', { x: -10, y: 21, 'text-anchor': 'end', fill: CL.dark, 'font-family': B.fontUI, 'font-weight': 700, 'font-size': 24 }, batt);
    // app header: name as plain text (nominative use), menu + new-chat glyphs
    el('path', { d: `M ${-sw / 2 + 44} ${-sh / 2 + 128} h 34 M ${-sw / 2 + 44} ${-sh / 2 + 140} h 26`, stroke: CL.text, 'stroke-width': 4, 'stroke-linecap': 'round' }, ui);
    el('text', { x: 0, y: -sh / 2 + 146, 'text-anchor': 'middle', fill: CL.dark, 'font-family': CL.sans, 'font-weight': 500, 'font-size': 34 }, ui).textContent = 'Claude';
    el('path', { d: `M ${sw / 2 - 74} ${-sh / 2 + 118} v 30 M ${sw / 2 - 89} ${-sh / 2 + 133} h 30`, stroke: CL.text, 'stroke-width': 4, 'stroke-linecap': 'round' }, ui);
    el('line', { x1: -sw / 2, y1: -sh / 2 + 182, x2: sw / 2, y2: -sh / 2 + 182, stroke: CL.line, 'stroke-width': 2 }, ui);
    // greeting (serif, like the app's warm greeting)
    const text = el('text', { x: 0, y: -sh * .02, 'text-anchor': 'middle', fill: CL.dark, 'font-family': CL.serif, 'font-weight': 500, 'font-size': 50 }, ui);
    const caret = el('rect', { width: 4, height: 50, fill: CL.orange }, ui);
    // input box + orange send button
    el('rect', { x: -sw / 2 + 30, y: sh / 2 - 190, width: sw - 60, height: 150, rx: 30, fill: '#FFFFFF', stroke: CL.line, 'stroke-width': 3 }, ui);
    el('text', { x: -sw / 2 + 64, y: sh / 2 - 132, fill: CL.mid, 'font-family': CL.sans, 'font-size': 28 }, ui).textContent = 'Ask Claude anything…';
    el('text', { x: -sw / 2 + 64, y: sh / 2 - 66, fill: CL.mid, 'font-family': CL.sans, 'font-size': 40 }, ui).textContent = '+';
    el('rect', { x: sw / 2 - 118, y: sh / 2 - 112, width: 60, height: 54, rx: 14, fill: CL.orange }, ui);
    el('path', { d: `M ${sw / 2 - 88} ${sh / 2 - 70} v -28 M ${sw / 2 - 100} ${sh / 2 - 86} l 12 -12 l 12 12`, stroke: '#fff', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ui);
    return {
      root, body, sw, sh, w, h, glow, ui, battT, battFill,
      drawBody(rc, seed) {
        while (body.firstChild) body.removeChild(body.firstChild);
        const P = SAU.makePen(1, rc, body, { seed, sw: 6 });
        P.shape(SAU.rrectPath(-w / 2, -h / 2, w, h, 70), '#20262B', 7);
        P.shape(SAU.rrectPath(-w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 56), '#2E363C', 3);
      },
      setText(s, showCaret, t) {
        while (text.firstChild) text.removeChild(text.firstChild);
        const words = s.split(' '), lines = [''];
        const probe = el('tspan', {}, text);
        for (const wd of words) { const tryL = (lines[lines.length - 1] + ' ' + wd).trim(); probe.textContent = tryL; if (probe.getComputedTextLength() > sw - 110 && lines[lines.length - 1]) lines.push(wd); else lines[lines.length - 1] = tryL; }
        text.removeChild(probe);
        lines.forEach((ln, i) => { const ts = el('tspan', { x: 0, dy: i ? 64 : 0 }, text); ts.textContent = ln; });
        const last = text.lastChild, bb = last ? last.getComputedTextLength() : 0;
        set(caret, { x: bb / 2 + 8, y: -sh * .02 - 42 + (lines.length - 1) * 64, opacity: showCaret && Math.floor(t * 2.5) % 2 === 0 ? 1 : 0 });
      },
      setBattery(pct) { battT.textContent = Math.round(pct) + '%'; set(battFill, { width: 44 * pct / 100, fill: pct > 20 ? '#5FA55A' : '#D9472B' }); },
    };
  };

  // ---------- neon stone city ("TODAY?" world, thumbnail P2 right side) ----------
  SAU.drawStoneCity = function (rc, seed, g, W, H, t = 0) {
    el('rect', { x: -40, y: -40, width: W + 80, height: H + 80, fill: 'url(#kCityNight)' }, g);
    const ground = H * .8;
    const blds = [[-.02, .2, .42], [.17, .16, .62], [.31, .14, .36], [.43, .2, .74], [.62, .15, .48], [.75, .18, .66], [.92, .14, .4]];
    blds.forEach(([x0, w0, h0], i) => {
      const x = x0 * W, w = w0 * W, h = h0 * H, top = ground - h;
      g.appendChild(rc.path(`M ${x} ${ground} L ${x} ${top + 40} Q ${x + w / 2} ${top - 30} ${x + w} ${top + 40} L ${x + w} ${ground} Z`, ROUGH(seed + i, { fill: i % 2 ? '#6E5E52' : '#7C6A5C', fillStyle: 'solid', strokeWidth: 4 })));
      const cols = Math.max(2, Math.floor(w / 70)), rows = Math.floor((h - 90) / 80);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (hash(i * 31 + r * 7 + c * 3) < .3) continue;
        const on = hash(i * 13 + r * 5 + c + Math.floor(t * 2) * .0) > .1;
        el('rect', { x: x + 26 + c * ((w - 52) / cols) + 6, y: top + 70 + r * 80, width: 28, height: 36, rx: 4, fill: B.tech, opacity: on ? .95 : .25, filter: 'url(#kGlow)' }, g);
      }
    });
    g.appendChild(rc.rectangle(-40, ground, W + 80, H - ground + 40, ROUGH(seed + 50, { fill: '#2A2D30', fillStyle: 'solid', strokeWidth: 4 })));
    // hover-stone vehicle trails
    for (let i = 0; i < 3; i++) el('path', { d: `M ${-100} ${H * (.3 + i * .09)} Q ${W * .5} ${H * (.24 + i * .08)} ${W + 100} ${H * (.32 + i * .09)}`, stroke: B.tech, 'stroke-width': 3, fill: 'none', opacity: .5, 'stroke-dasharray': '40 60', 'stroke-dashoffset': -t * 600 * (1 + i * .3) }, g);
  };

  // ---------- HUD: year panel ----------
  SAU.makeYearPanel = function (parent, x = 40, y = 40) {
    const g = el('g', { transform: `translate(${x},${y})` }, parent);
    el('rect', { width: 460, height: 150, rx: 14, fill: '#2A1C15', opacity: .92 }, g);
    el('rect', { x: 1.5, y: 1.5, width: 457, height: 147, rx: 13, fill: 'none', stroke: B.sand, 'stroke-opacity': .35, 'stroke-width': 2 }, g);
    el('text', { x: 26, y: 44, fill: B.sand, 'font-family': B.fontUI, 'font-weight': 700, 'font-size': 22, 'letter-spacing': 4 }, g).textContent = 'YEAR';
    const yearT = el('text', { x: 24, y: 114, fill: B.bone, 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 64 }, g);
    const tagT = el('text', { x: 434, y: 44, 'text-anchor': 'end', fill: B.tech, 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 24, filter: 'url(#kGlow)' }, g);
    return { g, set(yearStr, tag) { yearT.textContent = yearStr; tagT.textContent = tag; } };
  };
  // small stat line panel (label + value), e.g. FIRE 18%
  SAU.makeStatPanel = function (parent, x, y, rows, w = 420) {
    const g = el('g', { transform: `translate(${x},${y})` }, parent);
    const h = 30 + rows.length * 56;
    el('rect', { width: w, height: h, rx: 14, fill: '#2A1C15', opacity: .92 }, g);
    el('rect', { x: 1.5, y: 1.5, width: w - 3, height: h - 3, rx: 13, fill: 'none', stroke: B.sand, 'stroke-opacity': .35, 'stroke-width': 2 }, g);
    const vals = rows.map((r, i) => {
      el('text', { x: 24, y: 52 + i * 56, fill: B.sand, 'font-family': B.fontUI, 'font-weight': 700, 'font-size': 20, 'letter-spacing': 3 }, g).textContent = r;
      return el('text', { x: w - 24, y: 54 + i * 56, 'text-anchor': 'end', fill: B.bone, 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 32 }, g);
    });
    return { g, vals, set(i, s, color) { vals[i].textContent = s; if (color) set(vals[i], { fill: color }); } };
  };

  // ---------- Real Fact card ----------
  SAU.makeFactCard = function (parent, text, w = 980) {
    const g = el('g', {}, parent);
    el('rect', { x: 6, y: 8, width: w, height: 92, rx: 12, fill: '#000', opacity: .25 }, g);
    el('rect', { width: w, height: 92, rx: 12, fill: B.bone }, g);
    el('rect', { width: 12, height: 92, rx: 6, fill: B.ochre }, g);
    el('text', { x: 34, y: 37, fill: B.rust, 'font-family': B.fontUI, 'font-weight': 700, 'font-size': 18, 'letter-spacing': 3 }, g).textContent = 'REAL FACT';
    el('text', { x: 34, y: 72, fill: B.ink, 'font-family': B.fontUI, 'font-weight': 600, 'font-size': 28 }, g).textContent = text;
    return g;
  };

  // ---------- callout label (Claude style: cream card, orange accent, no logo) ----------
  SAU.makeCallout = function (parent, title, sub) {
    const g = el('g', {}, parent);
    const line = el('path', { fill: 'none', stroke: CL.orange, 'stroke-width': 5, 'stroke-linecap': 'round', filter: 'url(#kGlowWarm)' }, g);
    const box = el('g', {}, g);
    const bw = Math.max(300, title.length * 28 + 80);
    el('rect', { x: 6, y: 8, width: bw, height: sub ? 112 : 76, rx: 14, fill: '#000', opacity: .3 }, box);
    el('rect', { width: bw, height: sub ? 112 : 76, rx: 14, fill: CL.cream, stroke: CL.orange, 'stroke-width': 4 }, box);
    el('rect', { x: 0, y: 0, width: 12, height: sub ? 112 : 76, rx: 6, fill: CL.orange }, box);
    el('text', { x: 32, y: 52, fill: CL.dark, 'font-family': CL.serif, 'font-weight': 600, 'font-size': 44 }, box).textContent = title;
    if (sub) el('text', { x: 33, y: 92, fill: CL.orangeDeep, 'font-family': CL.sans, 'font-weight': 500, 'font-size': 24 }, box).textContent = sub;
    return { g, box, line, bw };
  };

  // ---------- thought / question bubble ----------
  SAU.drawQuestionBubble = function (rc, seed, g, r = 90) {
    g.appendChild(rc.circle(-r * .9, r * 1.35, r * .28, ROUGH(seed, { fill: B.bone, fillStyle: 'solid' })));
    g.appendChild(rc.circle(-r * .55, r * .95, r * .4, ROUGH(seed + 1, { fill: B.bone, fillStyle: 'solid' })));
    g.appendChild(rc.circle(0, 0, r * 2, ROUGH(seed + 2, { fill: B.bone, fillStyle: 'solid', strokeWidth: 4 })));
  };

  // ---------- stamp card (e.g. PROBLEMS: 4) ----------
  SAU.makeStamp = function (parent, label, w = 760, h = 200) {
    const g = el('g', {}, parent);
    const bg = el('g', {}, g);
    const lab = el('text', { x: -w / 2 + 50, y: 30, fill: B.bone, 'font-family': B.fontDisplay, 'font-size': 86 }, g);
    lab.textContent = label;
    const num = el('text', { x: w / 2 - 50, y: 36, 'text-anchor': 'end', fill: '#FFD36B', 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 128 }, g);
    return {
      g, num,
      draw(rc, seed) {
        while (bg.firstChild) bg.removeChild(bg.firstChild);
        const sg = el('g', { opacity: .35 }, bg);
        sg.appendChild(rc.rectangle(-w / 2 + 10, -h / 2 + 14, w, h, ROUGH(seed + 9, { fill: '#000', fillStyle: 'solid', stroke: 'none', strokeWidth: 0, roughness: 1.5 })));
        bg.appendChild(rc.rectangle(-w / 2, -h / 2, w, h, ROUGH(seed, { fill: B.rust, fillStyle: 'solid', strokeWidth: 6, roughness: 1.6 })));
        bg.appendChild(rc.rectangle(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, ROUGH(seed + 1, { stroke: B.bone, strokeWidth: 3, roughness: 2 })));
      },
    };
  };

  // ---------- simple line icons (neon), centred, ~80px ----------
  SAU.ICONS = {
    sun: 'M 0 -22 A 22 22 0 1 1 0 22 A 22 22 0 1 1 0 -22 M 0 -46 V -32 M 0 32 V 46 M -46 0 H -32 M 32 0 H 46 M -33 -33 L -23 -23 M 23 23 L 33 33 M -33 33 L -23 23 M 23 -23 L 33 -33',
    star: 'M 0 -40 L 11 -12 L 40 -12 L 17 6 L 26 36 L 0 18 L -26 36 L -17 6 L -40 -12 L -11 -12 Z',
    fish: 'M -40 0 Q -10 -30 24 0 Q -10 30 -40 0 Z M 24 0 L 42 -16 L 42 16 Z',
    leaf: 'M -34 30 Q -40 -30 34 -34 Q 30 34 -34 30 Z M -34 30 L 20 -20',
    drop: 'M 0 -40 Q 30 0 24 18 A 24 24 0 0 1 -24 18 Q -30 0 0 -40 Z',
    math: 'M -36 -20 H -8 M -22 -34 V -6 M 10 -20 H 38 M -36 22 H -8 M 10 14 H 38 M 10 28 H 38',
    moon: 'M 14 -38 A 40 40 0 1 0 14 38 A 30 30 0 1 1 14 -38 Z',
    atom: 'M -40 0 A 40 14 0 1 0 40 0 A 40 14 0 1 0 -40 0 M -20 -35 A 40 14 60 1 0 20 35 A 40 14 60 1 0 -20 -35 M 20 -35 A 40 14 -60 1 0 -20 35 A 40 14 -60 1 0 20 -35',
  };
})();

// ================= Act 2 additions =================
(function () {
  const { el, set, hash, BRAND: B } = SAU;
  const CL = SAU.CL;
  const ROUGH = (seed, extra = {}) => Object.assign({ seed, stroke: B.ink, strokeWidth: 3, roughness: 1, bowing: .5 }, extra);

  // "PROBLEM #n" banner (top centre). set(n,label)
  SAU.makeProblemCard = function (parent) {
    const g = el('g', {}, parent), bg = el('g', {}, g);
    const small = el('text', { x: 0, y: -28, 'text-anchor': 'middle', fill: '#FFD36B', 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 34, 'letter-spacing': 6 }, g);
    const big = el('text', { x: 0, y: 46, 'text-anchor': 'middle', fill: B.bone, 'font-family': B.fontDisplay, 'font-size': 76 }, g);
    return {
      g, set(n, label) { small.textContent = 'PROBLEM #' + n; big.textContent = label; },
      draw(rc, seed, w = 620) {
        while (bg.firstChild) bg.removeChild(bg.firstChild);
        const sg = el('g', { opacity: .35 }, bg);
        sg.appendChild(rc.rectangle(-w / 2 + 10, -78, w, 160, ROUGH(seed + 3, { fill: '#000', fillStyle: 'solid', stroke: 'none' })));
        bg.appendChild(rc.rectangle(-w / 2, -88, w, 160, ROUGH(seed, { fill: B.rust, fillStyle: 'solid', strokeWidth: 5, roughness: 1.5 })));
      },
    };
  };

  // update toast (Claude style: dark card, orange accents, no logo)
  SAU.makeToast = function (parent, title = 'Claude v1.0', sub = 'for Homo sapiens') {
    const w = 660, h = 176, g = el('g', {}, parent);
    el('rect', { x: 8, y: 10, width: w, height: h, rx: 20, fill: '#000', opacity: .35 }, g);
    el('rect', { width: w, height: h, rx: 20, fill: CL.dark }, g);
    el('rect', { width: w, height: h, rx: 20, fill: 'none', stroke: CL.orange, 'stroke-width': 3 }, g);
    el('circle', { cx: 56, cy: 84, r: 30, fill: CL.orange }, g);
    el('path', { d: 'M 56 100 L 56 68 M 42 82 L 56 66 L 70 82', stroke: '#fff', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const head = el('text', { x: 110, y: 56, fill: CL.orange, 'font-family': CL.sans, 'font-weight': 700, 'font-size': 22, 'letter-spacing': 3 }, g);
    el('text', { x: 110, y: 102, fill: CL.cream, 'font-family': CL.serif, 'font-weight': 600, 'font-size': 40 }, g).textContent = title;
    el('text', { x: 360, y: 102, fill: '#B0AEA5', 'font-family': CL.sans, 'font-size': 22 }, g).textContent = sub;
    el('rect', { x: 110, y: 128, width: 510, height: 14, rx: 7, fill: '#2B2A27' }, g);
    const bar = el('rect', { x: 110, y: 128, width: 0, height: 14, rx: 7, fill: CL.orange }, g);
    const pct = el('text', { x: 620, y: 56, 'text-anchor': 'end', fill: '#B0AEA5', 'font-family': B.fontMono, 'font-size': 22 }, g);
    return { g, w, h, set(k) { set(bar, { width: 510 * k }); head.textContent = k <= 0 ? 'UPDATE AVAILABLE' : k < 1 ? 'INSTALLING...' : 'INSTALLED  ✓'; pct.textContent = k <= 0 ? '' : Math.round(k * 100) + '%'; } };
  };

  // server room (data centre) filling a w×h panel
  SAU.drawServerRoom = function (rc, seed, g, w, h, t) {
    el('rect', { width: w, height: h, fill: '#0A1418' }, g);
    // floor perspective
    g.appendChild(rc.polygon([[0, h * .78], [w, h * .78], [w, h], [0, h]], ROUGH(seed, { fill: '#121E22', fillStyle: 'solid', strokeWidth: 3 })));
    const n = 5, rw = w / (n + 1.2);
    for (let i = 0; i < n; i++) {
      const x = rw * .6 + i * rw * 1.04, y = h * .14, rh = h * .66;
      g.appendChild(rc.rectangle(x, y, rw * .86, rh, ROUGH(seed + i, { fill: '#1C2A30', fillStyle: 'solid', strokeWidth: 3 })));
      for (let r = 0; r < 9; r++) {
        const ry = y + 22 + r * (rh - 30) / 9;
        g.appendChild(rc.line(x + 10, ry + 26, x + rw * .86 - 10, ry + 26, ROUGH(seed + i * 9 + r, { stroke: '#0A1418', strokeWidth: 2 })));
        for (let l = 0; l < 3; l++) {
          const on = hash(i * 31 + r * 7 + l + Math.floor(t * (6 + l * 3)) * 13) > .45;
          el('circle', { cx: x + 18 + l * 16, cy: ry + 12, r: 4, fill: l === 2 ? '#7CF29A' : B.tech, opacity: on ? 1 : .15, filter: on ? 'url(#kGlow)' : '' }, g);
        }
      }
    }
    el('text', { x: w / 2, y: h * .93, 'text-anchor': 'middle', fill: B.tech, 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 34, 'letter-spacing': 6, filter: 'url(#kGlow)' }, g).textContent = 'DATA CENTER';
  };

  // valley with two cliffs (characters added by scene)
  SAU.drawValley = function (rc, seed, g, w, h) {
    el('rect', { width: w, height: h, fill: '#E9A35C' }, g);
    el('rect', { y: h * .45, width: w, height: h * .55, fill: '#F2C27F' }, g);
    g.appendChild(rc.polygon([[-20, h * .52], [w * .3, h * .5], [w * .38, h + 20], [-20, h + 20]], ROUGH(seed, { fill: '#B8693E', fillStyle: 'solid', strokeWidth: 4, roughness: 1.6 })));
    g.appendChild(rc.polygon([[w + 20, h * .5], [w * .7, h * .48], [w * .62, h + 20], [w + 20, h + 20]], ROUGH(seed + 1, { fill: '#A85E36', fillStyle: 'solid', strokeWidth: 4, roughness: 1.6 })));
    g.appendChild(rc.polygon([[w * .36, h + 20], [w * .5, h * .86], [w * .64, h + 20]], ROUGH(seed + 2, { fill: '#7E4A2E', fillStyle: 'solid', strokeWidth: 3 })));
    for (let i = 0; i < 5; i++) g.appendChild(rc.line(w * (.05 + i * .05), h * (.6 + i * .07), w * (.15 + i * .04), h * (.6 + i * .07), ROUGH(seed + 9 + i, { stroke: '#8C4A2A', strokeWidth: 2, roughness: 2 })));
  };

  // generic dinosaur silhouette (long-neck sauropod, no franchise look), feet at (0,0), faces right
  SAU.drawDino = function (rc, seed, g, fill = '#3B2418') {
    const d = 'M -260 -150 Q -330 -170 -380 -120 Q -340 -150 -280 -120 Q -250 -230 -120 -240 Q 0 -250 80 -200 Q 130 -260 160 -360 Q 175 -420 220 -430 Q 262 -432 262 -405 Q 250 -390 215 -395 Q 196 -330 170 -230 Q 160 -180 130 -150 L 130 0 L 90 0 L 80 -110 L 0 -110 L -10 0 L -50 0 L -60 -110 L -130 -110 L -140 0 L -180 0 L -190 -120 Q -230 -120 -260 -150 Z';
    g.appendChild(rc.path(d, ROUGH(seed, { fill, fillStyle: 'solid', strokeWidth: 4 })));
  };

  // little flame with a polite face (for thought bubbles)
  SAU.drawPoliteFlame = function (rc, seed, g) {
    g.appendChild(rc.path('M -40 30 Q -50 -20 0 -70 Q 50 -20 40 30 Q 0 46 -40 30 Z', ROUGH(seed, { fill: '#F59B2F', fillStyle: 'solid' })));
    g.appendChild(rc.path('M -20 30 Q -24 0 0 -30 Q 24 0 20 30 Q 0 38 -20 30 Z', ROUGH(seed + 1, { fill: '#FFE07A', fillStyle: 'solid', strokeWidth: 2 })));
    el('circle', { cx: -10, cy: 8, r: 4, fill: B.ink }, g); el('circle', { cx: 10, cy: 8, r: 4, fill: B.ink }, g);
    el('path', { d: 'M -8 20 Q 0 26 8 20', stroke: B.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g);
    // tiny bow tie = very polite
    el('path', { d: 'M -16 40 L -2 46 L -16 52 Z M 16 40 L 2 46 L 16 52 Z', fill: B.rust, stroke: B.ink, 'stroke-width': 2 }, g);
  };

  // stone overlay for a dead phone (world coords of phone centre)
  SAU.drawPhoneRock = function (rc, seed, g, x, y, s = 1) {
    g.appendChild(rc.path(`M ${x - 34 * s} ${y + 30 * s} Q ${x - 44 * s} ${y - 20 * s} ${x - 24 * s} ${y - 46 * s} Q ${x + 6 * s} ${y - 60 * s} ${x + 30 * s} ${y - 40 * s} Q ${x + 44 * s} ${y} ${x + 34 * s} ${y + 32 * s} Q ${x} ${y + 48 * s} ${x - 34 * s} ${y + 30 * s} Z`, ROUGH(seed, { fill: '#8A847C', fillStyle: 'solid', strokeWidth: 3 })));
    g.appendChild(rc.line(x - 14 * s, y - 20 * s, x + 6 * s, y - 4 * s, ROUGH(seed + 1, { stroke: '#5E5852', strokeWidth: 2 })));
    g.appendChild(rc.line(x + 10 * s, y + 10 * s, x + 20 * s, y + 22 * s, ROUGH(seed + 2, { stroke: '#5E5852', strokeWidth: 2 })));
  };
})();

// ================= Act 3 additions =================
(function () {
  const { el, set, hash, clamp, BRAND: B } = SAU;
  const CL = SAU.CL;
  const R = (seed, extra = {}) => Object.assign({ seed, stroke: B.ink, strokeWidth: 3, roughness: 1, bowing: .5 }, extra);

  // EP01 cast (same as 03_assets/cast_ep01.png) — use with SAU.makeYou(parent, rc, SAU.CAST.chief)
  SAU.CAST = {
    you: { variant: 'A', colors: { tech: '#FBEFE2' } },
    chief: { hair: 'wild', beard: true, feather: true, necklace: true, colors: { skin: '#7A4E33', skinDark: '#5E3A24', hide: '#8E5A34' } },
    cousin: { hair: 'short', colors: { skin: '#9A6544', skinDark: '#7A4A2E', hide: '#B88A58' } },
    grandma: { hair: 'bun', wrinkles: true, colors: { hair: '#E8E2D6', skin: '#7E5236', skinDark: '#5E3A24', hide: '#9C6B44' } },
    neanderthal: { hair: 'long', brow: true, beard: true, beardColor: '#8A4A28', colors: { hair: '#8A4A28', skin: '#C99A78', skinDark: '#A57A58', hide: '#7A6450' } },
    brother: { hair: 'wild', necklace: true, colors: { skin: '#946044', skinDark: '#734628', hide: '#A9784C' } },
  };

  // day camp (warm morning savanna, no fixed region)
  SAU.drawDayCamp = function (rc, seed, g, W, H, horizon) {
    const P = SAU.makePen(1, rc, g, { seed, sw: 3 });
    P.ellipse(W * .82, horizon - 300, 95, 95, '#FFE7B0', 3);
    P.shape(`M ${-W} ${horizon} L ${-W * .4} ${horizon - 90} L ${W * .1} ${horizon - 80} L ${W * .22} ${horizon - 100} L ${W * .34} ${horizon - 40} L ${W * .5} ${horizon - 70} L ${W * .63} ${horizon - 130} L ${W * .78} ${horizon - 90} L ${W * .9} ${horizon - 115} L ${W * 1.4} ${horizon - 70} L ${W * 2} ${horizon - 60} L ${W * 2} ${horizon} Z`, '#C88A5A', 3);
    const tx = W * .9, ty = horizon - 40;
    P.shape(`M ${tx - 8} ${ty} L ${tx - 4} ${ty - 120} L ${tx - 40} ${ty - 170} L ${tx - 30} ${ty - 176} L ${tx + 2} ${ty - 136} L ${tx + 30} ${ty - 186} L ${tx + 40} ${ty - 180} L ${tx + 10} ${ty - 120} L ${tx + 10} ${ty} Z`, '#6B4A33', 3);
    P.shape(`M ${tx - 150} ${ty - 170} Q ${tx - 60} ${ty - 230} ${tx + 10} ${ty - 205} Q ${tx + 90} ${ty - 240} ${tx + 160} ${ty - 180} Q ${tx + 10} ${ty - 160} ${tx - 150} ${ty - 170} Z`, '#7E8A4A', 3);
    P.shape(`M ${-W} ${horizon} L ${W * 2} ${horizon} L ${W * 2} ${H * 2} L ${-W} ${H * 2} Z`, '#D9A566', 3);
    // branch shelter
    const sx = W * .12, sy = horizon + 40;
    P.shape(`M ${sx - 120} ${sy + 60} L ${sx} ${sy - 120} L ${sx + 140} ${sy + 60} Z`, '#9C7448', 3);
    for (let i = 0; i < 6; i++) P.stroke(`M ${sx - 100 + i * 40} ${sy + 60} L ${sx - 4 + i * 2} ${sy - 110}`, '#6B4A33', 3);
    for (let i = 0; i < 14; i++) { const x = hash(i + 3) * W, y = horizon + 40 + hash(i + 17) * (H - horizon - 60); P.stroke(`M ${x} ${y} l ${30 + hash(i + 5) * 70} 0`, '#B8834C', 3); }
    for (let i = 0; i < 9; i++) { const x = hash(i * 7 + 1) * W, y = horizon + 20 + hash(i * 3 + 2) * (H - horizon - 40); P.stroke(`M ${x} ${y} l -8 -26 M ${x + 6} ${y} l 2 -34 M ${x + 12} ${y} l 12 -24`, '#8C6A3A', 3); }
  };
  // background crowd: simple silhouettes (tribe of ~30)
  SAU.drawCrowd = function (rc, seed, g, xs, y, s = 1, col = '#5A3A26') {
    xs.forEach((x, i) => {
      const h = (150 + hash(i * 5.1) * 40) * s, bob = 0;
      g.appendChild(rc.path(`M ${x - 34 * s} ${y} L ${x - 30 * s} ${y - h * .55} Q ${x} ${y - h * .66} ${x + 30 * s} ${y - h * .55} L ${x + 34 * s} ${y} Z`, R(seed + i, { fill: col, fillStyle: 'solid', strokeWidth: 2.5 })));
      g.appendChild(rc.circle(x, y - h * .78 + bob, 46 * s, R(seed + 40 + i, { fill: col, fillStyle: 'solid', strokeWidth: 2.5 })));
    });
  };

  // Claude chat window (Claude look, no logo). msgs: [{t, who:'you'|'claude', text}]
  SAU.makeChatWindow = function (parent, w = 640, h = 640) {
    const g = el('g', {}, parent);
    el('rect', { x: 8, y: 12, width: w, height: h, rx: 28, fill: '#000', opacity: .3 }, g);
    el('rect', { width: w, height: h, rx: 28, fill: CL.cream, stroke: '#20262B', 'stroke-width': 10 }, g);
    el('text', { x: w / 2, y: 58, 'text-anchor': 'middle', fill: CL.dark, 'font-family': CL.sans, 'font-weight': 500, 'font-size': 30 }, g).textContent = 'Claude';
    el('line', { x1: 0, y1: 86, x2: w, y2: 86, stroke: CL.line, 'stroke-width': 2 }, g);
    const body = el('g', {}, g);
    return {
      g, w, h,
      show(msgs, t) {
        while (body.firstChild) body.removeChild(body.firstChild);
        const vis = msgs.filter(m => t >= m.t).slice(-4);
        let y = 120;
        vis.forEach(m => {
          const k = clamp((t - m.t) / .25);
          const mine = m.who === 'you';
          const fs = m.size || (mine ? 34 : 40);
          const tx = el('text', { 'font-family': mine ? CL.sans : CL.serif, 'font-weight': mine ? 500 : 500, 'font-size': fs, fill: CL.dark }, body);
          tx.textContent = m.text;
          const tw = Math.min(w - 120, tx.getComputedTextLength());
          const bw = tw + 56, bh = fs + 40, bx = mine ? w - 30 - bw : 30;
          const bub = el('rect', { x: bx, y: y + (1 - k) * 20, width: bw, height: bh, rx: 22, fill: mine ? '#E8E4D8' : '#FFFFFF', stroke: mine ? 'none' : CL.line, 'stroke-width': 2, opacity: k }, body);
          body.insertBefore(bub, tx);
          set(tx, { x: bx + 28, y: y + (1 - k) * 20 + bh / 2 + fs * .35, opacity: k });
          if (!mine) el('circle', { cx: bx + 12, cy: y + bh + 18, r: 0, fill: CL.orange }, body);
          y += bh + 26;
        });
      },
    };
  };

  // Claude note card (cream, orange bar, serif)
  SAU.makeClaudeNote = function (parent, lines, w = 620, fs = 44) {
    const g = el('g', {}, parent), h = 90 + lines.length * (fs + 14);
    el('rect', { x: 8, y: 10, width: w, height: h, rx: 18, fill: '#000', opacity: .3 }, g);
    el('rect', { width: w, height: h, rx: 18, fill: CL.cream, stroke: CL.orange, 'stroke-width': 4 }, g);
    el('rect', { width: 14, height: h, rx: 7, fill: CL.orange }, g);
    el('text', { x: 40, y: 52, fill: CL.orangeDeep, 'font-family': CL.sans, 'font-weight': 700, 'font-size': 24, 'letter-spacing': 2 }, g).textContent = 'NOTE FROM CLAUDE';
    lines.forEach((ln, i) => { el('text', { x: 40, y: 104 + i * (fs + 14), fill: CL.dark, 'font-family': CL.serif, 'font-weight': 500, 'font-size': fs }, g).textContent = ln; });
    return { g, w, h };
  };

  // Claude Code terminal panel (dark, orange accents; header is plain text, no logo)
  SAU.makeCodePanel = function (parent, w = 760, h = 420) {
    const g = el('g', {}, parent);
    el('rect', { x: 8, y: 12, width: w, height: h, rx: 18, fill: '#000', opacity: .35 }, g);
    el('rect', { width: w, height: h, rx: 18, fill: CL.dark }, g);
    el('rect', { width: w, height: h, rx: 18, fill: 'none', stroke: CL.orange, 'stroke-width': 3 }, g);
    [0, 1, 2].forEach(i => el('circle', { cx: 32 + i * 26, cy: 30, r: 8, fill: ['#5A5955', '#5A5955', '#5A5955'][i] }, g));
    el('text', { x: w / 2, y: 38, 'text-anchor': 'middle', fill: '#B0AEA5', 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 24 }, g).textContent = 'Claude Code';
    el('line', { x1: 0, y1: 58, x2: w, y2: 58, stroke: '#2B2A27', 'stroke-width': 2 }, g);
    const body = el('g', {}, g);
    return {
      g, w, h,
      // lines: [{t, text, kind:'prompt'|'out'|'ok'}], typed at cps chars/s
      show(lines, t, cps = 30) {
        while (body.firstChild) body.removeChild(body.firstChild);
        let y = 100;
        lines.filter(l => t >= l.t).slice(-8).forEach(l => {
          const n = l.kind === 'prompt' ? Math.floor((t - l.t) * cps) : l.text.length;
          const col = l.kind === 'prompt' ? CL.cream : l.kind === 'ok' ? '#8FCB7A' : '#B0AEA5';
          if (l.kind === 'prompt') el('text', { x: 28, y, fill: CL.orange, 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 30 }, body).textContent = '>';
          el('text', { x: l.kind === 'prompt' ? 58 : 58, y, fill: col, 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 28 }, body).textContent = (l.kind === 'out' ? '● ' : l.kind === 'ok' ? '✓ ' : '') + l.text.slice(0, n);
          y += 44;
        });
      },
    };
  };

  // stone tablet (agenda etc.)
  SAU.drawTablet = function (rc, seed, g, w, h) {
    g.appendChild(rc.path(`M ${-w / 2} ${-h / 2 + 30} Q ${-w / 2} ${-h / 2} ${-w / 2 + 40} ${-h / 2} L ${w / 2 - 30} ${-h / 2 + 8} Q ${w / 2} ${-h / 2 + 12} ${w / 2 - 6} ${-h / 2 + 50} L ${w / 2} ${h / 2 - 30} Q ${w / 2 - 4} ${h / 2} ${w / 2 - 40} ${h / 2} L ${-w / 2 + 30} ${h / 2 - 6} Q ${-w / 2} ${h / 2 - 10} ${-w / 2 + 6} ${h / 2 - 50} Z`, R(seed, { fill: '#A79C8E', fillStyle: 'solid', strokeWidth: 5 })));
    for (let i = 0; i < 5; i++) g.appendChild(rc.line(-w / 2 + 30 + hash(i) * w * .7, -h / 2 + 30 + hash(i + 3) * h * .8, -w / 2 + 60 + hash(i) * w * .7, -h / 2 + 40 + hash(i + 3) * h * .8, R(seed + i, { stroke: '#857A6C', strokeWidth: 2 })));
  };

  // explosion burst at (0,0), k = 0..1
  SAU.drawBoom = function (rc, seed, g, k, r = 180) {
    const n = 12, pts = [];
    for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2, rr = (i % 2 ? .5 : 1) * r * (.6 + .4 * k) * (0.85 + hash(i + seed * .01) * .3); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    g.appendChild(rc.polygon(pts, R(seed, { fill: '#FFB43C', fillStyle: 'solid', strokeWidth: 5 })));
    g.appendChild(rc.polygon(pts.map(([x, y]) => [x * .55, y * .55]), R(seed + 1, { fill: '#FFF1A8', fillStyle: 'solid', strokeWidth: 3 })));
  };

  // bee
  SAU.drawBee = function (rc, seed, g) {
    g.appendChild(rc.ellipse(0, 0, 44, 30, R(seed, { fill: '#F2C230', fillStyle: 'solid' })));
    g.appendChild(rc.line(-6, -14, -6, 14, R(seed + 1, { strokeWidth: 5 })));
    g.appendChild(rc.line(8, -13, 8, 13, R(seed + 2, { strokeWidth: 5 })));
    g.appendChild(rc.ellipse(-4, -22, 26, 18, R(seed + 3, { fill: '#F3F7FF', fillStyle: 'solid', strokeWidth: 2 })));
    g.appendChild(rc.ellipse(10, -20, 22, 16, R(seed + 4, { fill: '#F3F7FF', fillStyle: 'solid', strokeWidth: 2 })));
  };

  // microbe
  SAU.drawMicrobe = function (rc, seed, g, col = '#7DA05A') {
    g.appendChild(rc.ellipse(0, 0, 70, 52, R(seed, { fill: col, fillStyle: 'solid' })));
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; g.appendChild(rc.line(Math.cos(a) * 34, Math.sin(a) * 25, Math.cos(a) * 50, Math.sin(a) * 38, R(seed + i, { strokeWidth: 3 }))); }
    el('circle', { cx: -10, cy: -4, r: 5, fill: B.ink }, g); el('circle', { cx: 10, cy: -4, r: 5, fill: B.ink }, g);
    el('path', { d: 'M -10 10 Q 0 4 10 10', stroke: B.ink, 'stroke-width': 3, fill: 'none' }, g);
  };

  // bone with n tally notches (0..maxN)
  SAU.drawTallyBone = function (rc, seed, g, n, w = 520) {
    g.appendChild(rc.path(`M ${-w / 2 + 30} -22 L ${w / 2 - 30} -22 Q ${w / 2} -60 ${w / 2 + 20} -26 Q ${w / 2 + 34} 0 ${w / 2 + 20} 26 Q ${w / 2} 60 ${w / 2 - 30} 22 L ${-w / 2 + 30} 22 Q ${-w / 2} 60 ${-w / 2 - 20} 26 Q ${-w / 2 - 34} 0 ${-w / 2 - 20} -26 Q ${-w / 2} -60 ${-w / 2 + 30} -22 Z`, R(seed, { fill: '#EFE3C8', fillStyle: 'solid', strokeWidth: 4 })));
    for (let i = 0; i < n; i++) { const x = -w / 2 + 50 + i * ((w - 100) / 24); g.appendChild(rc.line(x, -16, x + 4, 16, R(seed + 10 + i, { stroke: '#6B4A33', strokeWidth: 4 }))); }
  };

  // honey pot
  SAU.drawHoney = function (rc, seed, g) {
    g.appendChild(rc.path('M -60 -40 Q -80 60 0 70 Q 80 60 60 -40 Z', R(seed, { fill: '#B8763C', fillStyle: 'solid' })));
    g.appendChild(rc.ellipse(0, -40, 124, 30, R(seed + 1, { fill: '#F2A922', fillStyle: 'solid' })));
    g.appendChild(rc.path('M -20 -40 Q -24 0 -10 10 Q 0 -10 0 -40 Z', R(seed + 2, { fill: '#F2A922', fillStyle: 'solid', strokeWidth: 2 })));
  };
})();
