// Stone Age Upgrade — EP kit: reusable backgrounds, props and HUD pieces (Style 1).
// Load after sau.js + pen.js + characters.js. All sizes in 1080p units (u = 1 at 1920x1080).
(function () {
  const { el, set, hash, clamp, p, E, BRAND: B } = SAU;
  const ROUGH = (seed, extra = {}) => Object.assign({ seed, stroke: B.ink, strokeWidth: 3, roughness: 1, bowing: .5 }, extra);

  // ---------- shared <defs> ----------
  SAU.kitDefs = function (svg) {
    const d = el('defs', {}, svg);
    d.innerHTML = `
      <filter id="kGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="kGlowBig" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="kBlur"><feGaussianBlur stdDeviation="10"/></filter>
      <radialGradient id="kFireLight"><stop offset="0" stop-color="#FFB45A" stop-opacity=".55"/><stop offset=".45" stop-color="#E2572C" stop-opacity=".18"/><stop offset="1" stop-color="#E2572C" stop-opacity="0"/></radialGradient>
      <radialGradient id="kTechLight"><stop offset="0" stop-color="#3DF5FF" stop-opacity=".6"/><stop offset=".5" stop-color="#3DF5FF" stop-opacity=".15"/><stop offset="1" stop-color="#3DF5FF" stop-opacity="0"/></radialGradient>
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

  // ---------- phone prop (close-up) ----------
  // centred at (0,0); w = width. returns { root, screen, text, status }
  SAU.makePhoneCloseup = function (parent, w = 620) {
    const h = w * 1.95, root = el('g', {}, parent);
    const body = el('g', {}, root);
    const scr = el('g', {}, root);
    const sw = w - 56, sh = h - 70;
    el('rect', { x: -sw / 2, y: -sh / 2, width: sw, height: sh, rx: 34, fill: '#081316' }, scr);
    const glow = el('rect', { x: -sw / 2, y: -sh / 2, width: sw, height: sh, rx: 34, fill: B.tech, opacity: .0, filter: 'url(#kGlowBig)' }, scr);
    const ui = el('g', {}, scr);
    // status bar
    const status = el('g', {}, ui);
    const tm = el('text', { x: -sw / 2 + 40, y: -sh / 2 + 60, fill: B.bone, 'font-family': B.fontUI, 'font-weight': 700, 'font-size': 30 }, status);
    tm.textContent = '??:??';
    const bars = el('g', { transform: `translate(${sw / 2 - 360},${-sh / 2 + 36})` }, status);
    [0, 1, 2, 3].forEach(i => el('rect', { x: i * 14, y: 24 - i * 7, width: 9, height: 6 + i * 7, rx: 2, fill: B.bone, opacity: .22 }, bars));
    el('text', { x: 66, y: 24, fill: B.bone, opacity: .6, 'font-family': B.fontUI, 'font-weight': 600, 'font-size': 22 }, bars).textContent = 'No service';
    const batt = el('g', { transform: `translate(${sw / 2 - 96},${-sh / 2 + 38})` }, status);
    el('rect', { width: 54, height: 26, rx: 6, fill: 'none', stroke: B.bone, 'stroke-width': 3 }, batt);
    const battFill = el('rect', { x: 5, y: 5, width: 44, height: 16, rx: 3, fill: '#7CF29A' }, batt);
    el('rect', { x: 56, y: 8, width: 5, height: 10, rx: 2, fill: B.bone }, batt);
    const battT = el('text', { x: -10, y: 21, 'text-anchor': 'end', fill: B.bone, 'font-family': B.fontUI, 'font-weight': 700, 'font-size': 24 }, batt);
    // generic assistant: sparkle mark (not a brand logo) + one line
    const mark = el('g', { transform: `translate(0,${-sh * .14})` }, ui);
    el('path', { d: 'M 0 -64 C 8 -14 14 -8 64 0 C 14 8 8 14 0 64 C -8 14 -14 8 -64 0 C -14 -8 -8 -14 0 -64 Z', fill: B.tech, filter: 'url(#kGlow)' }, mark);
    const text = el('text', { x: 0, y: sh * .03, 'text-anchor': 'middle', fill: B.bone, 'font-family': B.fontUI, 'font-weight': 600, 'font-size': 44 }, ui);
    const caret = el('rect', { width: 4, height: 46, fill: B.tech }, ui);
    // input box
    el('rect', { x: -sw / 2 + 36, y: sh / 2 - 150, width: sw - 72, height: 96, rx: 48, fill: '#13262B', stroke: B.techDeep, 'stroke-width': 3 }, ui);
    el('text', { x: -sw / 2 + 76, y: sh / 2 - 90, fill: B.bone, opacity: .4, 'font-family': B.fontUI, 'font-size': 30 }, ui).textContent = 'Ask anything…';
    return {
      root, body, sw, sh, w, h, glow, ui, battT, battFill,
      drawBody(rc, seed) {
        while (body.firstChild) body.removeChild(body.firstChild);
        const P = SAU.makePen(1, rc, body, { seed, sw: 6 });
        P.shape(SAU.rrectPath(-w / 2, -h / 2, w, h, 70), '#20262B', 7);
        P.shape(SAU.rrectPath(-w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 56), '#2E363C', 3);
      },
      setText(s, showCaret, t) {
        // wraps to lines that fit the screen
        while (text.firstChild) text.removeChild(text.firstChild);
        const words = s.split(' '), lines = ['']; text.textContent = '';
        const probe = el('tspan', {}, text);
        for (const wd of words) { const tryL = (lines[lines.length - 1] + ' ' + wd).trim(); probe.textContent = tryL; if (probe.getComputedTextLength() > sw - 90 && lines[lines.length - 1]) lines.push(wd); else lines[lines.length - 1] = tryL; }
        text.removeChild(probe);
        lines.forEach((ln, i) => { const ts = el('tspan', { x: 0, dy: i ? 58 : 0 }, text); ts.textContent = ln; });
        const last = text.lastChild, bb = last ? last.getComputedTextLength() : 0;
        set(caret, { x: bb / 2 + 6, y: sh * .03 - 38 + (lines.length - 1) * 58, opacity: showCaret && Math.floor(t * 2.5) % 2 === 0 ? 1 : 0 });
      },
      setBattery(pct) { battT.textContent = Math.round(pct) + '%'; set(battFill, { width: 44 * pct / 100, fill: pct > 20 ? '#7CF29A' : '#FF5A3D' }); },
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

  // ---------- neon callout label ----------
  SAU.makeCallout = function (parent, title, sub) {
    const g = el('g', {}, parent);
    const line = el('path', { fill: 'none', stroke: B.tech, 'stroke-width': 4, 'stroke-linecap': 'round', filter: 'url(#kGlow)' }, g);
    const box = el('g', {}, g);
    const bw = Math.max(260, title.length * 30 + 60);
    el('rect', { width: bw, height: sub ? 104 : 70, rx: 12, fill: '#0E1416', stroke: B.tech, 'stroke-width': 3, filter: 'url(#kGlow)' }, box);
    el('text', { x: 24, y: 48, fill: B.tech, 'font-family': B.fontDisplay, 'font-size': 38 }, box).textContent = title;
    if (sub) el('text', { x: 24, y: 86, fill: B.bone, 'font-family': B.fontUI, 'font-weight': 600, 'font-size': 24 }, box).textContent = sub;
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
