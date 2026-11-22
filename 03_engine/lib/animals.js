// Period animals, facing left, feet at (0,0). Style-agnostic via pen.
(function () {
  const C = () => SAU.CHAR;
  SAU.drawGazelle = function (P) {
    const c = C(), coat = '#C8894E', dark = '#3B2418';
    [[-82, -116], [-58, -116], [70, -116], [94, -116]].forEach(([x, y], i) => P.shape(SAU.rrectPath(x - 6, y, 12, 116, 5), i % 2 ? '#B57A42' : coat, 3));
    P.shape('M -110 -150 Q -120 -204 -60 -208 L 84 -202 Q 132 -196 126 -150 Q 120 -112 80 -112 L -70 -112 Q -112 -116 -110 -150 Z', coat);
    P.shape('M -92 -126 Q 0 -104 104 -126 L 98 -114 Q 0 -98 -86 -114 Z', c.bone, 2.5);
    P.stroke('M -98 -142 Q 0 -128 112 -144', dark, 6);
    P.shape('M 122 -184 Q 146 -178 140 -150 Q 132 -160 120 -166 Z', coat, 3);
    P.shape('M -96 -186 L -132 -272 L -104 -284 L -72 -196 Z', coat);
    P.shape('M -142 -292 Q -150 -262 -176 -252 Q -188 -244 -180 -236 Q -150 -238 -112 -262 Q -100 -292 -122 -300 Z', coat);
    P.ellipse(-110, -298, 7, 16, coat, 3);
    P.stroke('M -126 -298 Q -124 -352 -100 -372', dark, 6); P.stroke('M -116 -296 Q -110 -348 -86 -364', dark, 6);
    P.ellipse(-140, -278, 5, 5, c.ink, 1);
    P.stroke('M -128 -270 Q -150 -262 -168 -254', dark, 3);
  };
  SAU.drawZebra = function (P) {
    const c = C(), ink = c.ink, coat = c.bone;
    [[-100, -132], [-70, -132], [92, -132], [122, -132]].forEach(([x, y]) => {
      P.shape(SAU.rrectPath(x - 9, y, 18, 132, 6), coat, 3.5);
      [y + 28, y + 56, y + 84].forEach(yy => P.stroke(`M ${x - 9} ${yy} L ${x + 9} ${yy + 4}`, ink, 5));
      P.shape(SAU.rrectPath(x - 10, -14, 20, 14, 4), ink, 2);
    });
    P.shape('M -130 -172 Q -142 -232 -70 -238 L 100 -232 Q 160 -226 152 -166 Q 146 -126 100 -126 L -92 -126 Q -132 -130 -130 -172 Z', coat);
    [-80, -45, -10, 25, 60, 95, 125].forEach((x, i) => P.stroke(`M ${x} -234 Q ${x + 12} -190 ${x - 4} ${-134 - (i % 2) * 6}`, ink, 8));
    P.shape('M 148 -210 Q 176 -196 170 -150 Q 162 -170 150 -182 Z', coat, 3);
    P.shape('M -110 -216 L -162 -302 Q -150 -322 -120 -312 L -66 -226 Z', coat);
    [-280, -256, -232].forEach(y => P.stroke(`M ${-156 + (y + 280) * .55} ${y} L ${-120 + (y + 280) * .55} ${y + 8}`, ink, 7));
    P.stroke('M -160 -312 L -150 -326 L -142 -310 L -132 -322 L -124 -304 L -112 -312 L -104 -290 L -92 -296 L -88 -272 L -76 -276 L -74 -252', ink, 5);
    P.shape('M -166 -308 Q -206 -272 -218 -236 Q -214 -214 -192 -220 Q -170 -250 -128 -302 Z', coat);
    P.shape('M -218 -236 Q -214 -214 -192 -220 Q -196 -232 -206 -244 Z', ink, 2);
    P.ellipse(-140, -304, 8, 18, coat, 3);
    P.ellipse(-162, -284, 5, 5, ink, 1);
    P.stroke('M -186 -262 L -164 -276', ink, 6);
  };
  SAU.drawOstrich = function (P) {
    const c = C(), leg = '#D9A08A', black = '#2B1A12';
    P.shape('M -20 -176 L -40 -92 L -26 -90 L 0 -176 Z', leg, 3); P.shape('M -38 -94 L -48 -6 L -34 -6 L -26 -94 Z', leg, 3);
    P.shape('M -56 -8 L -18 -8 L -16 2 L -60 2 Z', leg, 3);
    P.shape('M 26 -176 L 38 -92 L 52 -94 L 44 -176 Z', leg, 3); P.shape('M 38 -94 L 30 -6 L 44 -6 L 52 -94 Z', leg, 3);
    P.shape('M 12 -8 L 50 -8 L 52 2 L 8 2 Z', leg, 3);
    P.shape('M -96 -208 Q -104 -290 -12 -296 Q 92 -292 104 -228 Q 98 -172 22 -168 Q -74 -168 -96 -208 Z', black);
    P.shape('M 94 -262 Q 150 -280 140 -222 Q 120 -208 98 -224 Z', c.bone, 3.5);
    P.shape('M 40 -250 Q 90 -246 104 -216 Q 70 -222 40 -232 Z', c.bone, 3);
    P.shape('M -66 -270 Q -80 -380 -60 -446 L -44 -446 Q -60 -380 -46 -272 Z', leg);
    P.ellipse(-50, -456, 24, 17, '#C9907A');
    P.shape('M -72 -456 L -100 -450 L -72 -444 Z', '#B07A5A', 3);
    P.ellipse(-46, -462, 9, 9, c.eyeW, 2.5); P.ellipse(-48, -462, 4, 4, c.ink, 1);
    P.stroke('M -56 -472 Q -46 -480 -36 -472', c.ink, 3);
  };
})();
