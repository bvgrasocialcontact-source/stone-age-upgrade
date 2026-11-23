// Stone Age Upgrade — EP02 (car) kit. Load after kit.js.
// Everything is drawn in our own style; NO real car logos/designs (the car's badge is always covered in mud).
(function () {
  const { el, set, hash, BRAND: B } = SAU;
  const R = (seed, extra = {}) => Object.assign({ seed, stroke: B.ink, strokeWidth: 3, roughness: 1, bowing: .5 }, extra);
  const RED = '#D23B2E', RED_D = '#A82A22', GLASS = '#BFD4D8', TIRE = '#2B2622', RIM = '#B9B2A6', MUD = '#6A4428';
  SAU.CAR = { RED, RED_D, GLASS, TIRE, RIM, MUD };

  // ---------- the car (side view, facing right, origin = ground centre). ~580px long at s=1 ----------
  // variant: normal | rock | convertible | legs | swim | flying | wood | flat (rear tyre flat)
  const BODY = 'M -280 -64 L -282 -150 Q -280 -172 -250 -178 L -160 -186 L -104 -270 Q -92 -288 -60 -290 L 118 -290 Q 150 -288 170 -264 L 222 -192 L 268 -182 Q 292 -176 292 -150 L 292 -64 Q 292 -46 274 -46 L -264 -46 Q -282 -46 -280 -64 Z';
  const BODY_LOW = 'M -280 -64 L -282 -150 Q -280 -172 -250 -178 L 268 -182 Q 292 -176 292 -150 L 292 -64 Q 292 -46 274 -46 L -264 -46 Q -282 -46 -280 -64 Z';
  SAU.WHEELS = [-168, 176];
  SAU.drawCarBody = function (P, o = {}) {
    const v = o.variant || 'normal';
    const col = v === 'rock' ? '#8E7F72' : v === 'wood' ? '#B07A44' : (o.color || RED);
    const dark = v === 'rock' ? '#6E6258' : v === 'wood' ? '#8A5A2E' : RED_D;
    // wheel arches
    SAU.WHEELS.forEach(x => P.ellipse(x, -50, 84, 80, '#1E1612', 2));
    if (v === 'legs') { // four chunky stone-age legs instead of wheels
      [[-210, 1], [-120, -1], [130, 1], [220, -1]].forEach(([x, k]) => { const sw = (o.step || 0) * k; P.shape(`M ${x - 20} -60 L ${x - 24 + sw} 40 L ${x + 18 + sw} 40 L ${x + 20} -60 Z`, '#8A5A3A', 3); P.shape(`M ${x - 34 + sw} 40 L ${x + 30 + sw} 40 L ${x + 30 + sw} 56 L ${x - 34 + sw} 56 Z`, '#6E4428', 3); });
    }
    P.shape(v === 'convertible' ? BODY_LOW : BODY, col, 4);
    if (v === 'convertible') { // squashed roof bits
      P.shape('M -150 -184 L -90 -204 L 60 -200 L 160 -186 Z', dark, 3);
    } else {
      P.shape('M -92 -268 L -34 -268 L -34 -194 L -134 -194 Z', v === 'rock' ? '#7A6E64' : GLASS, 3);
      P.shape('M -14 -268 L 112 -268 Q 132 -266 146 -248 L 182 -194 L -14 -194 Z', v === 'rock' ? '#7A6E64' : GLASS, 3);
      if (v !== 'rock' && v !== 'wood') P.stroke('M 10 -258 L 40 -206 M 40 -258 L 70 -206', '#FFFFFF', 3); // shine
    }
    // doors & details
    P.stroke('M -24 -192 L -24 -62', dark, 3); P.stroke('M 186 -184 L 186 -70', dark, 3); P.stroke('M -150 -182 L -150 -70', dark, 3);
    P.shape(SAU.rrectPath(-90, -160, 34, 10, 4), dark, 2); P.shape(SAU.rrectPath(110, -160, 34, 10, 4), dark, 2);
    P.shape(SAU.rrectPath(-292, -110, 24, 50, 8), '#4A4440', 3); P.shape(SAU.rrectPath(280, -104, 26, 46, 8), '#4A4440', 3); // bumpers
    P.ellipse(278, -150, 13, 18, o.lights ? '#FFF3B0' : '#FFE9A8', 2.5); // headlight
    P.shape(SAU.rrectPath(-284, -156, 14, 30, 4), '#E06A4A', 2.5); // taillight
    if (v !== 'wood') { // the badge — forever covered in mud
      P.shape('M 268 -122 Q 280 -140 296 -128 Q 310 -116 298 -100 Q 290 -88 274 -96 Q 258 -106 268 -122 Z', MUD, 2.5);
      P.ellipse(300, -94, 6, 5, MUD, 1.5); P.ellipse(262, -88, 5, 4, MUD, 1.5);
    }
    // mud splashes on the sill
    [[-230, -70, 22, 8], [-60, -66, 30, 7], [90, -70, 18, 6], [236, -68, 20, 7]].forEach(([x, y, rx, ry]) => P.ellipse(x, y, rx, ry, MUD, 1.5));
    if (o.dents) for (let i = 0; i < o.dents; i++) P.stroke(`M ${250 - i * 30} ${-170 + i * 8} q 12 10 4 22`, dark, 3);
    if (v === 'swim') { P.shape('M -300 -90 L -360 -130 L -350 -60 Z', '#3E8C9A', 3); P.shape('M 40 -290 L 70 -350 L 110 -290 Z', '#3E8C9A', 3); }
    if (v === 'flying') { P.shape('M -60 -150 L -230 -250 L -260 -236 L -120 -120 Z', '#E8E2D6', 3); P.shape('M 60 -150 L 220 -246 L 250 -232 L 120 -120 Z', '#F3E6CF', 3); }
    if (v === 'rock') { [[-200, -120], [20, -230], [180, -120], [-60, -100]].forEach(([x, y], i) => P.ellipse(x, y, 26 + i * 4, 14, '#6F8F4E', 1.5)); }
  };
  SAU.drawWheel = function (P, r = 62, flat = false) {
    if (flat) { P.shape(`M ${-r} 6 Q ${-r} ${-r * .8} 0 ${-r * .82} Q ${r} ${-r * .8} ${r} 6 Q ${r} ${r * .5} 0 ${r * .55} Q ${-r} ${r * .5} ${-r} 6 Z`, TIRE, 4); P.ellipse(0, -2, r * .45, r * .42, RIM, 3); return; }
    P.ellipse(0, 0, r, r, TIRE, 4); P.ellipse(0, 0, r * .55, r * .55, RIM, 3); P.ellipse(0, 0, r * .14, r * .14, '#6E6A64', 2);
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; P.stroke(`M ${Math.cos(a) * r * .14} ${Math.sin(a) * r * .14} L ${Math.cos(a) * r * .5} ${Math.sin(a) * r * .5}`, '#6E6A64', 4); }
  };
  // car object: body boils, wheels rotate by distance. update(t, {x,y,s,flip,tilt,dist,variant,...})
  SAU.makeCar = function (parent, rc, o0 = {}) {
    const g = el('g', {}, parent), shadow = el('ellipse', { cx: 0, cy: 4, rx: 300, ry: 18, fill: '#000', opacity: .18 }, g);
    const tilt = el('g', {}, g), body = el('g', {}, tilt);
    const wheels = SAU.WHEELS.map(x => { const a = el('g', { transform: `translate(${x},-50)` }, tilt); const b = el('g', {}, a); return { a, b }; });
    const fx = el('g', {}, g);
    let last = '';
    return {
      g, fx,
      update(t, o = {}) {
        const s = o.s ?? 1, f = o.flip ? -1 : 1, v = o.variant || o0.variant || 'normal';
        set(g, { transform: `translate(${o.x ?? 0},${o.y ?? 0}) scale(${s * f},${s})`, display: o.hide ? 'none' : 'inline', opacity: o.opacity ?? 1 });
        set(tilt, { transform: `translate(0,${o.bounce || 0}) rotate(${o.tilt || 0},0,-50)` });
        set(shadow, { opacity: v === 'flying' ? .08 : .18 });
        const key = v + (o.dents || 0) + (o.flat ? 'f' : '') + (o.lights ? 'l' : '') + (o.color || '');
        if (key !== last) { body.__seed = -1; wheels.forEach(w => (w.b.__seed = -1)); last = key; }
        SAU.boil(body, (r, sd, gg) => SAU.drawCarBody(SAU.makePen(1, r, gg, { seed: sd * 7 + 1, sw: 3.5 }), { variant: v, dents: o.dents, lights: o.lights, color: o.color, step: Math.sin((o.dist || 0) / 40) * 18 }), t, .125);
        const ang = ((o.dist || 0) / 62) * 180 / Math.PI;
        wheels.forEach((w, i) => {
          set(w.a, { display: v === 'legs' || v === 'swim' ? 'none' : 'inline' });
          set(w.b, { transform: `rotate(${o.flat && i === 0 ? 0 : ang})` });
          SAU.boil(w.b, (r, sd, gg) => SAU.drawWheel(SAU.makePen(1, r, gg, { seed: sd * 5 + i, sw: 3 }), 62, o.flat && i === 0), t, .125);
        });
      },
    };
  };

  // ---------- savanna strip (for driving scenes). Draws [x0,x1] at ground y ----------
  SAU.drawSavannaStrip = function (rc, seed, g, x0, x1, gy, dense = 1) {
    const P = SAU.makePen(1, rc, g, { seed, sw: 3 });
    for (let x = x0; x < x1; x += 70) {
      const k = hash(Math.floor(x / 70) * 3.1);
      if (k < .5 * dense) P.stroke(`M ${x} ${gy} l -8 -26 M ${x + 6} ${gy} l 2 -32 M ${x + 12} ${gy} l 10 -24`, '#8A6A34', 3);
      if (k > .93) P.ellipse(x, gy - 10, 34, 18, '#9A8C7C', 3);
    }
  };
  SAU.drawAcacia = function (P, x, y, s = 1) {
    P.shape(`M ${x - 14 * s} ${y} L ${x - 6 * s} ${y - 170 * s} L ${x - 60 * s} ${y - 230 * s} L ${x - 48 * s} ${y - 236 * s} L ${x} ${y - 190 * s} L ${x + 44 * s} ${y - 240 * s} L ${x + 58 * s} ${y - 232 * s} L ${x + 12 * s} ${y - 168 * s} L ${x + 16 * s} ${y} Z`, '#6B4A30', 3);
    P.shape(`M ${x - 180 * s} ${y - 230 * s} Q ${x - 160 * s} ${y - 300 * s} ${x} ${y - 300 * s} Q ${x + 170 * s} ${y - 300 * s} ${x + 190 * s} ${y - 236 * s} Q ${x} ${y - 214 * s} ${x - 180 * s} ${y - 230 * s} Z`, '#7A8A3E', 3.5);
  };
  SAU.drawTermite = function (P, x, y, s = 1) {
    P.shape(`M ${x - 70 * s} ${y} Q ${x - 50 * s} ${y - 80 * s} ${x - 24 * s} ${y - 150 * s} Q ${x - 10 * s} ${y - 200 * s} ${x + 6 * s} ${y - 160 * s} Q ${x + 30 * s} ${y - 90 * s} ${x + 70 * s} ${y} Z`, '#B2683A', 3);
    P.stroke(`M ${x - 30 * s} ${y - 60 * s} q 10 -10 20 0 M ${x + 10 * s} ${y - 110 * s} q 8 -8 16 0`, '#8A4A26', 2.5);
  };
  SAU.drawRhino = function (P) { // facing left, origin ground centre ~360 long
    const c = '#8C8680';
    [[-110, 1], [-60, 1], [80, 1], [128, 1]].forEach(([x]) => P.shape(SAU.rrectPath(x - 18, -90, 36, 90, 10), '#7A746E', 3));
    P.shape('M -170 -120 Q -180 -220 -40 -230 Q 120 -236 170 -170 Q 190 -110 150 -80 L -150 -80 Q -176 -90 -170 -120 Z', c, 3.5);
    P.shape('M -150 -150 Q -230 -160 -250 -110 Q -250 -80 -200 -80 L -150 -90 Z', c, 3.5);
    P.shape('M -238 -120 L -262 -196 L -220 -132 Z', '#E8E0D0', 3); P.shape('M -200 -150 L -210 -186 L -190 -152 Z', '#E8E0D0', 2.5);
    P.ellipse(-182, -138, 7, 7, '#FFF', 2); P.ellipse(-184, -138, 3, 3, B.ink, 1);
    P.stroke('M -196 -158 L -170 -150', B.ink, 4); // angry brow
    P.shape('M -150 -200 L -140 -232 L -126 -204 Z', c, 2.5);
  };
  SAU.drawRiver = function (P, x0, x1, y) { P.shape(`M ${x0} ${y} Q ${(x0 + x1) / 2} ${y - 18} ${x1} ${y} L ${x1} ${y + 40} Q ${(x0 + x1) / 2} ${y + 58} ${x0} ${y + 40} Z`, '#5FA3B0', 3); P.stroke(`M ${x0 + 40} ${y + 18} q 30 -8 60 0 M ${x1 - 140} ${y + 22} q 30 -8 60 0`, '#E8F4F2', 3); };

  // ---------- props ----------
  SAU.drawSteeringWheel = function (P, r = 200, snake = 0) {
    P.ellipse(0, 0, r, r, '#2B2622', 6); P.ellipse(0, 0, r * .8, r * .8, '#E9C9A0', 3);
    P.shape(`M ${-r * .8} -10 L ${r * .8} -10 L ${r * .8} 20 L ${-r * .8} 20 Z`, '#2B2622', 3); P.shape(`M -24 10 L 24 10 L 18 ${r * .8} L -18 ${r * .8} Z`, '#2B2622', 3);
    P.ellipse(0, 4, r * .22, r * .22, '#4A4440', 4);
    if (snake > 0) { // snake face on the rim (top), eyes + tongue
      P.ellipse(-30, -r + 4, 16, 16, '#FFF', 2.5); P.ellipse(30, -r + 4, 16, 16, '#FFF', 2.5);
      P.ellipse(-28, -r + 6, 6, 9, B.ink, 1); P.ellipse(32, -r + 6, 6, 9, B.ink, 1);
      P.shape(`M -4 ${-r + 24} L -4 ${-r + 24 + 40 * snake} L -16 ${-r + 34 + 44 * snake} M 4 ${-r + 24} L 4 ${-r + 24 + 40 * snake} L 16 ${-r + 34 + 44 * snake}`, '#D23B2E', 3);
    }
  };
  SAU.drawFuelGauge = function (P, k, r = 170) { // k: 1 = full, 0 = empty
    P.shape(`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 Z`, '#1E1A17', 5);
    for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; P.stroke(`M ${Math.cos(a) * r * .78} ${Math.sin(a) * r * .78} L ${Math.cos(a) * r * .92} ${Math.sin(a) * r * .92}`, '#F3E6CF', 4); }
    const a = Math.PI + k * Math.PI; P.stroke(`M 0 0 L ${Math.cos(a) * r * .74} ${Math.sin(a) * r * .74}`, '#FF5A3C', 8); P.ellipse(0, 0, 14, 14, '#4A4440', 3);
  };
  SAU.drawManual = function (P, w = 520, h = 360, page = 0) { // open owner's manual
    P.shape(`M 0 0 L ${-w} -20 L ${-w} ${h} L 0 ${h + 20} Z`, '#F3E6CF', 4); P.shape(`M 0 0 L ${w} -20 L ${w} ${h} L 0 ${h + 20} Z`, '#F7EEDC', 4);
    for (let i = 0; i < 6; i++) P.stroke(`M ${-w + 40} ${40 + i * 22} L ${-60} ${44 + i * 22}`, '#B9A98E', 3); // unreadable text
    for (let i = 0; i < 4; i++) P.stroke(`M ${-w + 40} ${230 + i * 22} L ${-120} ${234 + i * 22}`, '#B9A98E', 3);
    return { cx: w / 2, cy: h / 2 };
  };
  SAU.drawCup = function (P, x, y, s = 1) { P.shape(`M ${x - 26 * s} ${y - 70 * s} L ${x + 26 * s} ${y - 70 * s} L ${x + 20 * s} ${y} L ${x - 20 * s} ${y} Z`, '#B07A44', 3); P.ellipse(x, y - 70 * s, 26 * s, 8 * s, '#8A5A2E', 2.5); };
  SAU.drawCart = function (P, o = {}) { // wooden cart, facing right, origin ground centre, 2 visible wheels
    P.shape('M -200 -80 L 200 -80 L 210 -180 L -210 -180 Z', '#B07A44', 4);
    P.stroke('M -200 -130 L 200 -130 M -100 -180 L -100 -80 M 0 -180 L 0 -80 M 100 -180 L 100 -80', '#8A5A2E', 3);
    [-130, 130].forEach(x => { P.ellipse(x, -46, 46, 46, '#9A6A3A', 4); P.ellipse(x, -46, 10, 10, '#6E4428', 2.5); });
    if (o.rope) P.stroke('M 200 -140 Q 280 -150 360 -210', '#C9A872', 4);
  };
  SAU.drawSlab = function (P, w = 360, h = 460) { P.shape(SAU.rrectPath(-w / 2, -h, w, h, 30), '#9A8C7C', 5); P.shape(SAU.rrectPath(-w / 2 + 24, -h + 24, w - 48, h - 48, 20), '#A99B8A', 3); };
  SAU.drawTrafficUg = function (P, phase) { // red stone (left hand up) / green leaf (right hand up); phase 0 red, 1 green
    P.ellipse(-150, -470 - (1 - phase) * 60, 40, 34, '#C8362E', 3.5);
    P.shape(`M 150 ${-470 - phase * 60} Q 200 ${-540 - phase * 60} 160 ${-600 - phase * 60} Q 110 ${-540 - phase * 60} 150 ${-470 - phase * 60} Z`, '#4E9A3E', 3.5);
  };
  SAU.drawOilDerrick = function (P, x, y, s = 1) {
    P.shape(`M ${x - 80 * s} ${y} L ${x - 14 * s} ${y - 320 * s} L ${x + 14 * s} ${y - 320 * s} L ${x + 80 * s} ${y} Z`, 'none', 4);
    for (let i = 1; i < 5; i++) { const yy = y - i * 64 * s, k = 1 - i / 5; P.stroke(`M ${x - 80 * s * k - 14 * s * (1 - k)} ${yy} L ${x + 80 * s * k + 14 * s * (1 - k)} ${yy}`, B.ink, 3); }
    P.ellipse(x, y + 6, 130 * s, 22 * s, '#1A1412', 3);
  };
  SAU.drawGlobe = function (P, r = 300) {
    P.ellipse(0, 0, r, r, '#4F8FB0', 5);
    P.shape(`M ${-r * .6} ${-r * .4} Q ${-r * .2} ${-r * .7} ${r * .1} ${-r * .4} Q ${r * .3} ${-r * .1} ${-r * .1} ${r * .1} Q ${-r * .5} ${r * .1} ${-r * .6} ${-r * .4} Z`, '#8AA05A', 3);
    P.shape(`M ${r * .2} ${r * .2} Q ${r * .6} ${r * .1} ${r * .7} ${r * .4} Q ${r * .5} ${r * .7} ${r * .2} ${r * .55} Z`, '#8AA05A', 3);
  };

  // ---------- channel-style (neon) update toast — NOT Claude styled ----------
  SAU.makeNeonToast = function (parent, title, sub) {
    const w = 680, h = 176, g = el('g', {}, parent);
    el('rect', { x: 8, y: 10, width: w, height: h, rx: 22, fill: '#000', opacity: .35 }, g);
    el('rect', { width: w, height: h, rx: 22, fill: '#120C09' }, g);
    el('rect', { width: w, height: h, rx: 22, fill: 'none', stroke: B.tech, 'stroke-width': 4, filter: 'url(#kGlow)' }, g);
    const head = el('text', { x: 36, y: 54, fill: B.tech, 'font-family': B.fontUI, 'font-weight': 800, 'font-size': 24, 'letter-spacing': 4 }, g);
    el('text', { x: 34, y: 108, fill: B.bone, 'font-family': B.fontDisplay, 'font-size': 52 }, g).textContent = title;
    el('text', { x: w - 34, y: 108, 'text-anchor': 'end', fill: B.sand, 'font-family': B.fontUI, 'font-weight': 600, 'font-size': 24 }, g).textContent = sub;
    el('rect', { x: 36, y: 132, width: w - 72, height: 16, rx: 8, fill: '#2A1C15', stroke: B.tech, 'stroke-opacity': .4 }, g);
    const bar = el('rect', { x: 36, y: 132, width: 0, height: 16, rx: 8, fill: B.tech, filter: 'url(#kGlow)' }, g);
    const pct = el('text', { x: w - 34, y: 54, 'text-anchor': 'end', fill: B.sand, 'font-family': B.fontMono, 'font-weight': 700, 'font-size': 24 }, g);
    return { g, w, h, set(k) { set(bar, { width: (w - 72) * k }); head.textContent = k <= 0 ? 'UPDATE AVAILABLE' : k < 1 ? 'INSTALLING...' : 'INSTALLED  ✓'; pct.textContent = k <= 0 ? '' : Math.round(k * 100) + '%'; } };
  };
  // big centred caption card (bone paper, ink text)
  SAU.makeBigCard = function (parent, size = 84) {
    const g = el('g', {}, parent), bg = el('g', {}, g);
    const t1 = el('text', { 'text-anchor': 'middle', y: size * .35, fill: B.ink, 'font-family': B.fontDisplay, 'font-size': size }, g);
    const t2 = el('text', { 'text-anchor': 'middle', y: size * .35 + 58, fill: B.rust, 'font-family': B.fontUI, 'font-weight': 700, 'font-size': 34 }, g);
    return {
      g, set(a, b = '') { t1.textContent = a; t2.textContent = b; },
      draw(rc, seed, w = 900, h = 220) { while (bg.firstChild) bg.removeChild(bg.firstChild); bg.appendChild(rc.rectangle(-w / 2 + 10, -h / 2 + 14, w, h, R(seed + 2, { fill: '#000', fillStyle: 'solid', stroke: 'none', roughness: 1.4 }))).setAttribute('opacity', .3); bg.appendChild(rc.rectangle(-w / 2, -h / 2, w, h, R(seed, { fill: B.bone, fillStyle: 'solid', strokeWidth: 5, roughness: 1.4 }))); },
    };
  };
  SAU.dust = function (g, x, y, t, n = 5, k = 1) { // puffs behind a moving thing
    for (let i = 0; i < n; i++) { const a = ((t * 3 + i / n) % 1); el('circle', { cx: x - a * 160 * k, cy: y - a * 40 - hash(i) * 10, r: 14 + a * 40, fill: '#D9B98A', opacity: (1 - a) * .55 }, g); }
  };
  SAU.speedLines = function (g, x, y, t, n = 6, len = 220) {
    for (let i = 0; i < n; i++) { const yy = y - 40 - i * 40, o = ((t * 4 + i * .37) % 1); el('path', { d: `M ${x - 60 - o * 200} ${yy} l ${-len} 0`, stroke: B.ink, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: .45 * (1 - o) }, g); }
  };
})();
