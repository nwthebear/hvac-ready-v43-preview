/* Inline SVG charts (no external libs): P/T chart, SH/SC visual, rings, bars, lines. */
(function () {
  /* Saturation pressure (psig) vs temperature (°F) from js/pt-data.js (CoolProp-generated). Dew curve for blends. */
  window.PT_DATA = {}; window.PT_BUB = {};
  Object.entries(window.PT_REF.data).forEach(([r, d]) => { const T = window.PT_REF.meta.temps; PT_DATA[r] = T.map((t, i) => [t, d.dew[i]]).filter(p => p[0] >= -20 && p[0] <= 130); PT_BUB[r] = T.map((t, i) => [t, d.bubble[i]]); });
  const interp = (arr, x, xi, yi) => { for (let i = 1; i < arr.length; i++) if (x <= arr[i][xi]) { const a = arr[i - 1], b = arr[i], f = (x - a[xi]) / (b[xi] - a[xi]); return a[yi] + f * (b[yi] - a[yi]); } return arr[arr.length - 1][yi]; };
  window.satTemp = (ref, psig, kind) => interp(kind === "bubble" ? PT_BUB[ref] : PT_DATA[ref], psig, 1, 0);
  window.satPress = (ref, f, kind) => interp(kind === "bubble" ? PT_BUB[ref] : PT_DATA[ref], f, 0, 1);

  window.ptChartSVG = function (ref, markP) {
    const d = PT_DATA[ref], W = 320, H = 210, pl = 40, pb = 28, maxP = Math.ceil(Math.max(...d.map(p => p[1])) / 100) * 100, minT = -20, maxT = 130;
    const X = tt => pl + (tt - minT) / (maxT - minT) * (W - pl - 10), Y = p => H - pb - p / maxP * (H - pb - 10);
    const path = d.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1)).join(" ");
    let mk = ""; if (markP != null) { const tt = satTemp(ref, markP); mk = `<line x1="${pl}" y1="${Y(markP)}" x2="${X(tt)}" y2="${Y(markP)}" class="ch-guide"/><line x1="${X(tt)}" y1="${Y(markP)}" x2="${X(tt)}" y2="${H - pb}" class="ch-guide"/><circle cx="${X(tt)}" cy="${Y(markP)}" r="6" class="ch-dot"/><text x="${X(tt) + 8}" y="${Y(markP) - 8}" class="ch-lbl strong">${Math.round(markP)} psig → ${tt.toFixed(0)}°F</text>`; }
    const gridY = Array.from({ length: maxP / 100 + 1 }, (_, i) => i * 100).filter(p => maxP <= 400 || p % 200 === 0 || p === 0).map(p => `<line x1="${pl}" x2="${W - 10}" y1="${Y(p)}" y2="${Y(p)}" class="ch-grid"/><text x="${pl - 6}" y="${Y(p) + 4}" text-anchor="end" class="ch-lbl">${p}</text>`).join("");
    const gridX = [-20, 10, 40, 70, 100, 130].map(tt => `<text x="${X(tt)}" y="${H - 10}" text-anchor="middle" class="ch-lbl">${tt}°</text>`).join("");
    return `<svg viewBox="0 0 ${W} ${H}" class="chart">${gridY}${gridX}<path d="${path}" class="ch-line"/>${mk}<text x="${W - 12}" y="20" text-anchor="end" class="ch-lbl strong">${ref}</text></svg>`;
  };
  window.ringSVG = (pct, size = 64, label = "") => { const r = size / 2 - 6, c = 2 * Math.PI * r; return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}" transform="rotate(-90 ${size / 2} ${size / 2})"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" class="ring-t">${label || pct + "%"}</text></svg>`; };
  window.barsSVG = (vals, labels) => { const W = 320, H = 120, max = Math.max(1, ...vals), bw = (W - 20) / vals.length; return `<svg viewBox="0 0 ${W} ${H}" class="chart">${vals.map((v, i) => { const h = v / max * (H - 30); return `<rect x="${10 + i * bw + 2}" y="${H - 18 - h}" width="${bw - 4}" height="${Math.max(h, 1)}" rx="3" class="ch-bar"/><text x="${10 + i * bw + bw / 2}" y="${H - 5}" text-anchor="middle" class="ch-lbl sm">${labels[i]}</text>`; }).join("")}</svg>`; };
  window.lineSVG = (vals) => { const W = 320, H = 120; if (!vals.length) return ""; const X = i => 20 + i * (W - 40) / Math.max(1, vals.length - 1), Y = v => H - 15 - v / 100 * (H - 30); return `<svg viewBox="0 0 ${W} ${H}" class="chart"><line x1="20" x2="${W - 20}" y1="${Y(70)}" y2="${Y(70)}" class="ch-guide"/><text x="${W - 20}" y="${Y(70) - 4}" text-anchor="end" class="ch-lbl sm">70%</text><path d="${vals.map((v, i) => (i ? "L" : "M") + X(i) + " " + Y(v)).join(" ")}" class="ch-line"/>${vals.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="4" class="ch-dot"/>`).join("")}</svg>`; };
})();
