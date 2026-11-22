// Stone Age Upgrade — character library. Local coords: feet at (0,0), y up is negative.
(function () {
  const C = {
    skin: '#8B5A3C', skinDark: '#6E4429', hair: '#2B1A12', hide: '#A8784A', hideDark: '#7E5533',
    bone: '#F1E4C8', ochreRed: '#B5441F', ink: '#1E1612', eyeW: '#FBF4E6', mouth: '#3A1410',
    tech: '#3DF5FF', techDeep: '#0E6F7A',
  };
  SAU.CHAR = C;

  // You — the viewer's avatar. variant: 'A' tuft | 'B' bone necklace | 'C' ochre paint
  SAU.drawYou = function (pen, o = {}) {
    const v = o.variant || 'A', ex = o.expr || 'neutral', hold = !!o.holding;
    const P = pen;
    // legs
    P.shape('M -55 -135 L -62 -10 Q -62 0 -50 0 L -12 0 Q -4 0 -8 -10 L -14 -135 Z', C.skin);
    P.shape('M 14 -135 L 8 -10 Q 4 0 12 0 L 50 0 Q 62 0 62 -10 L 55 -135 Z', C.skin);
    // left arm (hanging)
    P.shape('M -76 -282 Q -122 -232 -120 -162 Q -119 -142 -102 -142 Q -88 -145 -92 -166 Q -96 -222 -58 -262 Z', C.skin);
    P.ellipse(-108, -140, 19, 19, C.skin);
    if (!hold) {
      P.shape('M 76 -282 Q 122 -232 120 -162 Q 119 -142 102 -142 Q 88 -145 92 -166 Q 96 -222 58 -262 Z', C.skin);
      P.ellipse(108, -140, 19, 19, C.skin);
    }
    // neck
    P.shape('M -24 -318 L -26 -280 L 26 -280 L 24 -318 Z', C.skinDark);
    // hide tunic with jagged hem, one shoulder strap
    P.shape('M -60 -300 Q -98 -296 -100 -252 Q -96 -200 -84 -170 Q -100 -140 -96 -118 L -72 -100 L -48 -124 L -22 -98 L 4 -122 L 30 -98 L 56 -124 L 80 -102 L 97 -118 Q 100 -140 84 -170 Q 96 -200 100 -252 Q 98 -296 60 -300 Q 0 -288 -60 -300 Z', C.hide);
    P.ellipse(-40, -200, 14, 9, C.hideDark, 2); P.ellipse(30, -160, 11, 7, C.hideDark, 2); P.ellipse(50, -240, 9, 6, C.hideDark, 2);
    P.stroke('M -96 -150 Q 0 -138 97 -150', C.ink, 3); // belt line
    if (v === 'B') { // bone necklace
      P.stroke('M -52 -296 Q 0 -246 52 -296', C.ink, 3);
      [[-38, -278], [-20, -264], [20, -264], [38, -278]].forEach(([x, y]) => P.shape(SAU.rrectPath(x - 5, y - 9, 10, 18, 4), C.bone, 2.5));
      P.shape('M -9 -262 L 9 -262 L 0 -228 Z', C.bone, 3);
    }
    // head
    P.ellipse(-106, -404, 18, 26, C.skin); P.ellipse(106, -404, 18, 26, C.skin);
    P.shape('M -104 -404 Q -110 -505 0 -512 Q 110 -505 104 -404 Q 98 -324 0 -306 Q -98 -324 -104 -404 Z', C.skin);
    // hair
    if (v === 'A') P.shape('M -108 -420 Q -116 -500 -46 -522 L -72 -572 L -16 -536 L -4 -596 L 24 -536 L 76 -578 L 54 -518 Q 116 -500 108 -420 Q 92 -470 0 -480 Q -92 -470 -108 -420 Z', C.hair);
    if (v === 'B') {
      P.shape('M -108 -418 Q -112 -514 0 -522 Q 112 -514 108 -418 Q 94 -472 0 -480 Q -94 -472 -108 -418 Z', C.hair);
      P.shape('M -106 -462 Q 0 -500 106 -462 L 104 -444 Q 0 -482 -104 -444 Z', C.ochreRed, 3);
    }
    if (v === 'C') P.shape('M -114 -372 Q -128 -518 0 -526 Q 128 -518 114 -372 L 100 -386 Q 100 -468 0 -478 Q -100 -468 -100 -386 Z', C.hair);
    // face
    const shock = ex === 'shock', smile = ex === 'smile';
    const ery = shock ? 36 : 30;
    P.ellipse(-40, -410, 26, ery, C.eyeW, 3.5); P.ellipse(40, -410, 26, ery, C.eyeW, 3.5);
    const pr = shock ? 8 : 12, py = o.look === 'down' ? -400 : -410, px = o.look === 'right' ? 8 : 0;
    P.ellipse(-38 + px, py, pr, pr, C.ink, 1); P.ellipse(42 + px, py, pr, pr, C.ink, 1);
    if (shock) { P.stroke('M -70 -462 Q -42 -484 -14 -466', C.hair, 9); P.stroke('M 14 -466 Q 42 -484 70 -462', C.hair, 9); }
    else if (smile) { P.stroke('M -68 -450 Q -40 -464 -14 -452', C.hair, 9); P.stroke('M 14 -452 Q 40 -464 68 -450', C.hair, 9); }
    else { P.stroke('M -68 -448 Q -40 -458 -14 -450', C.hair, 9); P.stroke('M 14 -450 Q 40 -458 68 -448', C.hair, 9); }
    P.shape('M -6 -394 Q -20 -362 -2 -356 Q 16 -358 12 -374', C.skinDark, 3);
    if (shock) P.ellipse(0, -334, 17, 23, C.mouth, 3.5);
    else if (smile) P.shape('M -36 -342 Q 0 -300 36 -342 Q 0 -330 -36 -342 Z', C.mouth, 3.5);
    else P.stroke('M -26 -336 Q 0 -328 26 -336', C.ink, 4);
    if (v === 'C') { // ochre paint stripes
      P.stroke('M -86 -386 L -58 -378', C.ochreRed, 8); P.stroke('M -84 -366 L -58 -360', C.ochreRed, 8);
      P.stroke('M 86 -386 L 58 -378', C.ochreRed, 8); P.stroke('M 84 -366 L 58 -360', C.ochreRed, 8);
    }
    // right arm holding a glowing device
    if (hold) {
      P.shape(SAU.rrectPath(18, -272, 54, 88, 10), '#20262B', 4);
      P.shape(SAU.rrectPath(25, -264, 40, 72, 6), C.tech, 2, { noShadow: true });
      P.shape('M 76 -284 Q 128 -256 124 -200 Q 120 -172 94 -178 L 58 -190 Q 42 -198 50 -212 L 90 -210 Q 96 -238 62 -266 Z', C.skin);
      P.ellipse(54, -202, 21, 19, C.skin);
    }
  };

  // Woolly mammoth, facing left. Feet at (0,0).
  SAU.drawMammoth = function (pen) {
    const P = pen, fur = '#6B4630', furD = '#4E3222';
    P.shape(SAU.rrectPath(150, -150, 52, 150, 14), furD);
    P.shape(SAU.rrectPath(-88, -140, 52, 140, 14), furD);
    P.shape('M -172 -132 Q -204 -300 -44 -342 Q 138 -372 212 -252 Q 240 -170 200 -112 L 180 -128 L 160 -100 L 138 -124 L 112 -96 L 90 -120 L 62 -94 L 40 -118 L 14 -92 L -10 -116 L -36 -90 L -60 -114 L -86 -92 L -110 -118 L -136 -96 L -156 -122 L -172 -100 Z', fur);
    P.shape(SAU.rrectPath(-162, -150, 54, 150, 14), fur);
    P.shape(SAU.rrectPath(86, -140, 54, 140, 14), fur);
    P.shape('M -150 -200 Q -232 -232 -232 -332 Q -222 -424 -128 -404 Q -68 -382 -80 -300 Q -92 -230 -150 -200 Z', fur);
    P.shape('M -226 -298 Q -282 -200 -252 -88 Q -242 -58 -214 -74 Q -232 -112 -216 -200 Q -206 -250 -190 -270 Z', fur);
    P.shape('M -206 -256 Q -304 -240 -288 -140 Q -280 -116 -262 -128 Q -276 -220 -200 -236 Z', SAU.CHAR.bone, 3.5);
    P.ellipse(-176, -322, 7, 7, SAU.CHAR.ink, 1);
    P.stroke('M -20 -330 Q -10 -300 -24 -270', furD, 4); P.stroke('M 60 -340 Q 70 -310 56 -280', furD, 4); P.stroke('M 140 -310 Q 148 -280 136 -250', furD, 4);
  };

  // Campfire at (0,0)
  SAU.drawFire = function (pen, k = 1) {
    const P = pen;
    P.shape('M -80 6 L 70 -14 L 76 2 L -74 22 Z', '#4A2E1E', 4);
    P.shape('M -70 -14 L 80 6 L 74 22 L -76 2 Z', '#5A3826', 4);
    const fl = (s, h, col) => P.shape(`M ${-s} 0 Q ${-s * .9} ${-h * .5} 0 ${-h} Q ${s * .9} ${-h * .5} ${s} 0 Z`, col, 3, { noShadow: true });
    fl(56, 160 * k, '#E2572C'); fl(36, 112 * k, '#F59B2F'); fl(18, 66 * k, '#FFE07A');
  };
})();
