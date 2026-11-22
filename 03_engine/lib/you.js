// "You" — rigged cut-out character (Style 1 default). Local coords: feet at (0,0), y up negative.
// const you = SAU.makeYou(parentGroup, rc, { style: 1, seed: 7 });
// you.pose({ x, y, scale, armL, armR, legL, legR, head, bob, expr, blink, look, holding }, t)
(function () {
  const C = () => SAU.CHAR;
  const { el, set } = SAU;

  const FACES = {
    neutral:  { brows: ['M -68 -448 Q -40 -458 -14 -450', 'M 14 -450 Q 40 -458 68 -448'], ery: 30, pr: 12, mouth: 'line' },
    smile:    { brows: ['M -68 -452 Q -40 -466 -14 -454', 'M 14 -454 Q 40 -466 68 -452'], ery: 30, pr: 12, mouth: 'smile' },
    shock:    { brows: ['M -70 -464 Q -42 -486 -14 -468', 'M 14 -468 Q 42 -486 70 -464'], ery: 36, pr: 8,  mouth: 'o' },
    smug:     { brows: ['M -68 -466 Q -40 -482 -14 -464', 'M 14 -446 Q 40 -452 68 -446'], ery: 26, pr: 12, mouth: 'smirk', lids: true },
    scared:   { brows: ['M -68 -452 Q -40 -470 -14 -476', 'M 14 -476 Q 40 -470 68 -452'], ery: 36, pr: 7,  mouth: 'wobble' },
    thinking: { brows: ['M -68 -460 Q -40 -474 -14 -462', 'M 14 -448 Q 40 -454 68 -448'], ery: 30, pr: 11, mouth: 'side', look: [10, -10] },
    angry:    { brows: ['M -68 -462 Q -40 -452 -12 -438', 'M 12 -438 Q 40 -452 68 -462'], ery: 28, pr: 12, mouth: 'frown' },
  };

  SAU.makeYou = function (parent, rc, o = {}) {
    const style = o.style || 1, variant = o.variant || 'A';
    const root = el('g', {}, parent);
    const legL = el('g', {}, root), legR = el('g', {}, root);
    const armL = el('g', {}, root), armRback = el('g', {}, root);
    const torso = el('g', {}, root);
    const head = el('g', {}, root);
    const headBase = el('g', {}, head), face = el('g', {}, head);
    const armRfront = el('g', {}, root);
    let lastSeed = -1, lastFace = '', baseSeed = o.seed || 7;

    const pen = (g, s) => SAU.makePen(style, rc, g, { seed: s, sw: 4 });
    const clear = g => { while (g.firstChild) g.removeChild(g.firstChild); };

    function drawStatic(seed) {
      [legL, legR, armL, armRback, torso, headBase, armRfront].forEach(clear);
      const c = Object.assign({}, C(), o.colors || {});
      const leg = 'M -21 0 L -25 124 Q -25 135 -14 135 L 24 135 Q 33 135 28 125 L 20 0 Z';
      pen(legL, seed + 1).shape(leg, c.skin);
      pen(legR, seed + 2).shape(leg, c.skin);
      set(legL.firstChild || legL, {}); // noop
      const arm = 'M -17 0 Q -24 70 -15 128 Q -12 146 4 146 Q 20 144 15 126 Q 9 70 17 0 Z';
      const pl = pen(armL, seed + 3); pl.shape(arm, c.skin); pl.ellipse(0, 146, 19, 19, c.skin);
      const pr = pen(armRback, seed + 4); pr.shape(arm, c.skin); pr.ellipse(0, 146, 19, 19, c.skin);
      const pt = pen(torso, seed + 5);
      pt.shape('M -24 -318 L -26 -280 L 26 -280 L 24 -318 Z', c.skinDark);
      pt.shape('M -60 -300 Q -98 -296 -100 -252 Q -96 -200 -84 -170 Q -100 -140 -96 -118 L -72 -100 L -48 -124 L -22 -98 L 4 -122 L 30 -98 L 56 -124 L 80 -102 L 97 -118 Q 100 -140 84 -170 Q 96 -200 100 -252 Q 98 -296 60 -300 Q 0 -288 -60 -300 Z', c.hide);
      pt.ellipse(-40, -200, 14, 9, c.hideDark, 2); pt.ellipse(30, -160, 11, 7, c.hideDark, 2); pt.ellipse(50, -240, 9, 6, c.hideDark, 2);
      pt.stroke('M -96 -150 Q 0 -138 97 -150', c.ink, 3);
      const ph = pen(headBase, seed + 6);
      ph.ellipse(-106, -404, 18, 26, c.skin); ph.ellipse(106, -404, 18, 26, c.skin);
      ph.shape('M -104 -404 Q -110 -505 0 -512 Q 110 -505 104 -404 Q 98 -324 0 -306 Q -98 -324 -104 -404 Z', c.skin);
      const hs = o.hair || (variant === 'A' ? 'tuft' : 'short');
      if (hs === 'tuft') ph.shape('M -108 -420 Q -116 -500 -46 -522 L -72 -572 L -16 -536 L -4 -596 L 24 -536 L 76 -578 L 54 -518 Q 116 -500 108 -420 Q 92 -470 0 -480 Q -92 -470 -108 -420 Z', c.hair);
      if (hs === 'short') ph.shape('M -108 -418 Q -112 -514 0 -522 Q 112 -514 108 -418 Q 94 -472 0 -480 Q -94 -472 -108 -418 Z', c.hair);
      if (hs === 'long') ph.shape('M -116 -330 Q -134 -520 0 -530 Q 134 -520 116 -330 L 100 -350 Q 100 -468 0 -480 Q -100 -468 -100 -350 Z', c.hair);
      if (hs === 'bun') { ph.shape('M -108 -418 Q -112 -514 0 -522 Q 112 -514 108 -418 Q 94 -472 0 -480 Q -94 -472 -108 -418 Z', c.hair); ph.ellipse(0, -540, 46, 34, c.hair); }
      if (hs === 'wild') ph.shape('M -122 -380 Q -150 -470 -100 -520 Q -60 -560 0 -548 Q 70 -566 110 -520 Q 152 -470 122 -380 Q 112 -440 80 -470 Q 0 -500 -80 -470 Q -112 -440 -122 -380 Z', c.hair);
      if (o.brow) ph.shape('M -96 -436 Q -50 -470 0 -452 Q 50 -470 96 -436 Q 50 -446 0 -432 Q -50 -446 -96 -436 Z', c.skinDark, 3);
      if (o.beard) ph.shape('M -96 -380 Q -100 -300 -40 -262 Q 0 -246 40 -262 Q 100 -300 96 -380 Q 80 -330 40 -322 Q 0 -340 -40 -322 Q -80 -330 -96 -380 Z', o.beardColor || c.hair);
      if (o.feather) { ph.shape('M 60 -500 Q 110 -600 150 -640 Q 120 -560 80 -490 Z', '#D9C9A8', 3); ph.stroke('M 64 -498 Q 110 -580 146 -632', c.ink, 2); ph.shape('M -106 -462 Q 0 -500 106 -462 L 104 -444 Q 0 -482 -104 -444 Z', c.ochreRed, 3); }
      if (o.necklace) { const pn = pen(torso, seed + 9); pn.stroke('M -52 -296 Q 0 -246 52 -296', c.ink, 3); [[-38,-278],[-20,-264],[20,-264],[38,-278]].forEach(([x,y]) => pn.shape(SAU.rrectPath(x-5,y-9,10,18,4), c.bone, 2.5)); pn.shape('M -9 -262 L 9 -262 L 0 -228 Z', c.bone, 3); }
      // front (holding) arm with device
      const pf = pen(armRfront, seed + 8);
      pf.shape(SAU.rrectPath(18, -272, 54, 88, 10), '#20262B', 4);
      pf.shape(SAU.rrectPath(25, -264, 40, 72, 6), c.tech, 2);
      pf.shape('M 76 -284 Q 128 -256 124 -200 Q 120 -172 94 -178 L 58 -190 Q 42 -198 50 -212 L 90 -210 Q 96 -238 62 -266 Z', c.skin);
      pf.ellipse(54, -202, 21, 19, c.skin);
    }

    function drawFace(seed, expr, blink, look) {
      clear(face);
      const c = Object.assign({}, C(), o.colors || {}), f = FACES[expr] || FACES.neutral, P = pen(face, seed + 20);
      const lx = (look ? look[0] : 0) + (f.look ? f.look[0] : 0), ly = (look ? look[1] : 0) + (f.look ? f.look[1] : 0);
      if (o.wrinkles) { P.stroke('M -78 -396 Q -70 -390 -62 -396', c.skinDark, 3); P.stroke('M 62 -396 Q 70 -390 78 -396', c.skinDark, 3); P.stroke('M -30 -470 Q 0 -476 30 -470', c.skinDark, 3); }
      if (blink) {
        P.stroke('M -64 -410 Q -40 -398 -16 -410', c.ink, 5); P.stroke('M 16 -410 Q 40 -398 64 -410', c.ink, 5);
      } else {
        P.ellipse(-40, -410, 26, f.ery, c.eyeW, 3.5); P.ellipse(40, -410, 26, f.ery, c.eyeW, 3.5);
        P.ellipse(-38 + lx, -410 + ly, f.pr, f.pr, c.ink, 1); P.ellipse(42 + lx, -410 + ly, f.pr, f.pr, c.ink, 1);
        if (f.lids) { P.shape('M -67 -414 Q -40 -446 -13 -414 Z', c.skin, 3); P.shape('M 13 -414 Q 40 -446 67 -414 Z', c.skin, 3); }
      }
      P.stroke(f.brows[0], c.hair, 9); P.stroke(f.brows[1], c.hair, 9);
      P.shape('M -6 -394 Q -20 -362 -2 -356 Q 16 -358 12 -374', c.skinDark, 3);
      const m = f.mouth;
      if (m === 'o') P.ellipse(0, -334, 17, 23, c.mouth, 3.5);
      else if (m === 'smile') P.shape('M -36 -342 Q 0 -300 36 -342 Q 0 -330 -36 -342 Z', c.mouth, 3.5);
      else if (m === 'smirk') P.stroke('M -24 -334 Q 6 -330 30 -346', c.ink, 5);
      else if (m === 'wobble') { P.shape('M -30 -330 Q -15 -342 0 -330 Q 15 -342 30 -330 L 30 -322 Q 0 -316 -30 -322 Z', c.eyeW, 3.5); }
      else if (m === 'side') P.stroke('M 6 -334 Q 20 -338 32 -334', c.ink, 5);
      else if (m === 'frown') P.stroke('M -28 -326 Q 0 -342 28 -326', c.ink, 5);
      else P.stroke('M -26 -336 Q 0 -328 26 -336', c.ink, 4);
    }

    return {
      root,
      pose(p = {}, t = 0) {
        const boilSeed = baseSeed + Math.floor(t / 0.125) * 37;
        if (boilSeed !== lastSeed) { drawStatic(boilSeed); lastSeed = boilSeed; lastFace = ''; }
        const fk = `${p.expr}|${!!p.blink}|${p.look}`;
        if (fk !== lastFace) { drawFace(boilSeed, p.expr || 'neutral', p.blink, p.look); lastFace = fk; }
        const bob = p.bob || 0;
        set(root, { transform: `translate(${p.x || 0},${(p.y || 0)}) scale(${p.scale || 1}) ${p.flip ? 'scale(-1,1)' : ''}` });
        set(legL, { transform: `translate(-35,-135) rotate(${p.legL || 0}) scale(-1,1)` });
        set(legR, { transform: `translate(35,-135) rotate(${p.legR || 0})` });
        set(torso, { transform: `translate(0,${bob})` });
        set(armL, { transform: `translate(-80,${-282 + bob}) rotate(${10 + (p.armL || 0)})` });
        set(armRback, { transform: `translate(80,${-282 + bob}) rotate(${-10 - (p.armR || 0)})`, display: p.holding ? 'none' : 'inline' });
        set(armRfront, { transform: `translate(0,${bob})`, display: p.holding ? 'inline' : 'none' });
        set(head, { transform: `translate(0,${bob}) rotate(${p.head || 0} 0 -300)` });
      },
    };
  };
})();
