// Style-agnostic drawing "pen": the same geometry renders as
// 1 = hand-drawn (rough.js, outlines), 2 = paper cut-out (no outlines, drop shadows), 3 = clean vector.
(function () {
  const { el } = SAU;
  const INK = '#1E1612';
  SAU.makePen = function (style, rc, parent, opts = {}) {
    let seed = opts.seed || 1;
    const sw0 = opts.sw || 4;
    const g = () => parent;
    return {
      style,
      shape(d, fill, sw = sw0, extra = {}) {
        seed++;
        if (style === 1) {
          const n = rc.path(d, { seed, fill, fillStyle: 'solid', stroke: INK, strokeWidth: sw, roughness: extra.rough ?? .9, bowing: .5 });
          g().appendChild(n); return n;
        }
        if (style === 2) return el('path', { d, fill, filter: extra.noShadow ? '' : 'url(#paperShadow)' }, g());
        return el('path', { d, fill, stroke: INK, 'stroke-width': sw * 1.1, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g());
      },
      stroke(d, color = INK, sw = sw0) {
        seed++;
        if (style === 1) { const n = rc.path(d, { seed, stroke: color, strokeWidth: sw, roughness: .7, bowing: .4 }); g().appendChild(n); return n; }
        return el('path', { d, fill: 'none', stroke: color, 'stroke-width': style === 2 ? sw * 1.2 : sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g());
      },
      ellipse(cx, cy, rx, ry, fill, sw = sw0, extra = {}) {
        return this.shape(SAU.ellipsePath(cx, cy, rx, ry), fill, sw, extra);
      },
      group(attrs = {}) { const n = el('g', attrs, g()); return SAU.makePen(style, rc, n, { seed: seed + 100, sw: sw0 }); },
      node: parent,
    };
  };
  SAU.ellipsePath = (cx, cy, rx, ry) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
  SAU.rrectPath = (x, y, w, h, r) => `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
})();
