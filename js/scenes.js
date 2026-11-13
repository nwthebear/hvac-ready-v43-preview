/* Section backdrops: layered SVG HVAC scenes (dimmed + blurred by CSS).
   If a photo for a scene key is listed in IMAGES_READY, it's used instead. */
(function () {
  const sky = (id, a, b, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  const rtu = (x, y, w, h) => `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="4" fill="#2b2a28"/><rect y="0" width="${w}" height="6" fill="#3a3834"/>${Array.from({ length: Math.floor(w / 9) }, (_, i) => `<rect x="${6 + i * 9}" y="${h * .3}" width="5" height="${h * .55}" fill="#1a1918"/>`).join("")}<ellipse cx="${w * .7}" cy="-2" rx="${w * .18}" ry="5" fill="#1d1c1b"/><rect x="${w * .7 - 2}" y="-10" width="4" height="8" fill="#1d1c1b"/></g>`;
  const condenser = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect width="110" height="100" rx="8" fill="#2c2b29"/><rect x="6" y="10" width="98" height="84" rx="4" fill="#1d1c1a"/>${Array.from({ length: 11 }, (_, i) => `<rect x="${10 + i * 8.6}" y="14" width="3" height="76" fill="#33312d"/>`).join("")}<ellipse cx="55" cy="2" rx="44" ry="8" fill="#232220"/><circle cx="55" cy="2" r="6" fill="#3d3a35"/><rect x="100" y="70" width="18" height="10" fill="#57524a"/></g>`;
  const S = {
    rooftop: `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice"><defs>${sky("g1", "#140f12", "#5a2a1c", "#c8641f")}<radialGradient id="sun"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient></defs>
      <rect width="800" height="600" fill="url(#g1)"/><circle cx="560" cy="350" r="140" fill="url(#sun)" opacity=".7"/><circle cx="560" cy="360" r="46" fill="#ffae4a" opacity=".85"/>
      <path d="M0 360h40v-60h30v40h25v-90h40v110h30v-50h45v70h20v-120h35v120h30v-40h40v60h30v-80h50v80h35v-30h40v50h45v-100h30v100h40v-50h45v60h35v-70h40v80h45v-40h40v60h0v240h-800z" fill="#1a1412" opacity=".9"/>
      <rect y="420" width="800" height="180" fill="#121112"/><rect y="414" width="800" height="10" fill="#2a2522"/>
      ${rtu(60, 340, 170, 80)}${rtu(300, 360, 120, 60)}${rtu(520, 330, 200, 90)}<path d="M240 400h50v-30h10v30" stroke="#2b2a28" stroke-width="6" fill="none"/><rect x="455" y="300" width="14" height="120" fill="#1d1c1b"/><rect x="449" y="296" width="26" height="10" fill="#2b2a28"/></svg>`,
    mechroom: `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><defs>${sky("g2", "#141516", "#1c1d1f", "#26231f")}<radialGradient id="lamp"><stop offset="0" stop-color="#ffb347" stop-opacity=".55"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>
      <rect width="800" height="600" fill="url(#g2)"/><circle cx="400" cy="70" r="260" fill="url(#lamp)"/><path d="M400 0v50" stroke="#333" stroke-width="3"/><path d="M385 50h30l-6 22h-18z" fill="#3a3632"/><circle cx="400" cy="78" r="8" fill="#ffcf7a"/>
      ${[130, 170, 210].map((y, i) => `<rect x="0" y="${y}" width="800" height="${18 - i * 3}" fill="${["#3b3a36", "#5a4a35", "#2f3a2c"][i]}"/>${[120, 360, 600].map(x => `<rect x="${x}" y="${y - 4}" width="10" height="${26 - i * 3}" fill="#22211f"/>`).join("")}`).join("")}
      <rect x="560" y="120" width="16" height="480" fill="#3b3a36"/><circle cx="568" cy="300" r="26" fill="none" stroke="#7E6A4F" stroke-width="6"/><path d="M542 300h52M568 274v52" stroke="#7E6A4F" stroke-width="4"/>
      <rect x="80" y="300" width="300" height="230" rx="10" fill="#26292a"/><rect x="100" y="320" width="120" height="70" rx="4" fill="#1b1d1e"/><circle cx="300" cy="360" r="30" fill="#1b1d1e" stroke="#4a4740"/><path d="M300 360l14-12" stroke="#FF7A1A" stroke-width="3"/>
      <rect x="640" y="380" width="120" height="150" rx="8" fill="#2c2b29"/><rect y="530" width="800" height="70" fill="#141413"/></svg>`,
    attic: `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><defs>${sky("g3", "#0f0e0d", "#1f1a15", "#2b231a")}<linearGradient id="beam" x1="0" x2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient></defs>
      <rect width="800" height="600" fill="url(#g3)"/><path d="M0 440L400 40L800 440" fill="none" stroke="#3a2f22" stroke-width="22"/>${[-300, -200, -100, 0, 100, 200, 300].map(d => `<path d="M${400 + d} ${40 + Math.abs(d)}V440" stroke="#2e261c" stroke-width="10"/>`).join("")}
      <path d="M690 120L360 470L300 470L650 90z" fill="url(#beam)"/><rect x="680" y="90" width="40" height="50" fill="#4a3d2c"/>
      <rect x="250" y="320" width="170" height="130" rx="6" fill="#2b2a28"/><path d="M420 350c80 0 90 60 170 60s100-40 210-40" stroke="#5f5a52" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M420 350c80 0 90 60 170 60s100-40 210-40" stroke="#4a463f" stroke-width="34" stroke-dasharray="3 9" fill="none"/>
      <path d="M0 470q40-30 80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0V600H0z" fill="#6b4f36"/><path d="M0 500q40-25 80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0V600H0z" fill="#5a412c"/></svg>`,
    truck: `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice"><defs>${sky("g4", "#0e1013", "#1c2026", "#3a3026")}<radialGradient id="sl"><stop offset="0" stop-color="#ffbf66" stop-opacity=".5"/><stop offset="1" stop-color="#ffbf66" stop-opacity="0"/></radialGradient></defs>
      <rect width="800" height="600" fill="url(#g4)"/><circle cx="660" cy="170" r="200" fill="url(#sl)"/><rect x="655" y="160" width="8" height="330" fill="#2a2a2a"/><path d="M630 160h40" stroke="#2a2a2a" stroke-width="8"/><ellipse cx="636" cy="168" rx="16" ry="5" fill="#ffd28a"/>
      <g transform="translate(90 290)"><path d="M0 40q0-30 30-30h330q30 0 40 20l60 70q20 4 20 30v60H0z" fill="#2a2926"/><path d="M370 20l50 60h-60V20z" fill="#3d4650" opacity=".8"/><rect x="20" y="0" width="330" height="10" fill="#3a3834"/>${[40, 120, 200, 280].map(x => `<rect x="${x}" y="-14" width="6" height="16" fill="#3a3834"/>`).join("")}<rect x="30" y="-20" width="320" height="8" fill="#55504a"/><rect x="40" y="60" width="220" height="70" rx="4" fill="#7E6A4F" opacity=".55"/><text x="60" y="106" font-family="Arial" font-weight="800" font-size="30" fill="#1b1a18" opacity=".7">HVAC SERVICE</text>
      <circle cx="90" cy="190" r="34" fill="#111"/><circle cx="90" cy="190" r="14" fill="#444"/><circle cx="390" cy="190" r="34" fill="#111"/><circle cx="390" cy="190" r="14" fill="#444"/></g><rect y="510" width="800" height="90" fill="#141414"/><path d="M0 540h800" stroke="#5a503f" stroke-width="3" stroke-dasharray="40 30"/></svg>`,
    yard: `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice"><defs>${sky("g5", "#15111a", "#3b2420", "#8a4a22")}<pattern id="chain" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 8l8-8l8 8l-8 8z" fill="none" stroke="#6b6156" stroke-width="1.2" opacity=".55"/></pattern></defs>
      <rect width="800" height="600" fill="url(#g5)"/><rect y="250" width="800" height="200" fill="url(#chain)"/>${[0, 160, 320, 480, 640, 800].map(x => `<rect x="${x - 4}" y="240" width="8" height="220" fill="#3a352f"/>`).join("")}<rect y="244" width="800" height="6" fill="#3a352f"/>
      ${condenser(60, 360, 1.1)}${condenser(240, 370, 1)}${condenser(410, 360, 1.1)}${condenser(600, 375, .95)}<rect y="470" width="800" height="130" fill="#1b1a18"/>${Array.from({ length: 90 }, (_, i) => `<circle cx="${(i * 97) % 800}" cy="${480 + (i * 37) % 110}" r="${1 + (i % 3)}" fill="#3b372f"/>`).join("")}</svg>`
  };
  /* route → semantic backdrop key (img/ registry in js/images.js); SVG scene is only the offline fallback */
  const BG = { home: "home", onboard: "home", match: "home", path: "home", module: "home",
    quiz: "quiz", epa: "quiz",
    library: "lesson", guide: "lesson", video: "lesson", glossary: "lesson", charts: "lesson", models: "lesson", skills: "lesson", skill: "lesson", tools: "lesson", tool: "lesson", dayone: "lesson", field: "lesson", gear: "lesson", coach: "lesson", credits: "lesson", settings: "lesson", avatar: "lesson",
    board: "map", arcade: "arcade", play: "arcade", sim: "arcade",
    achievements: "results", certs: "results", cert: "results", company: "results" };
  const FALLBACK = { home: "rooftop", quiz: "mechroom", lesson: "mechroom", map: "truck", arcade: "yard", results: "attic" };
  const MAP = BG;
  window.SCENES = S; window.SCENE_FOR_ROUTE = MAP;
  let cur = null;
  window.setScene = route => {
    const key = BG[route] || "home"; if (key === cur) return; cur = key;
    const el = document.getElementById("scene"); if (!el) return;
    const slot = "bg-" + key, ready = k => window.IMAGES_READY && window.IMAGES_READY.includes(k) && window.IMAGE_SLOTS && window.IMAGE_SLOTS[k];
    const ph = ready(slot), wide = ready(slot + "-wide");
    el.dataset.bg = key;
    el.innerHTML = ph ? `<div class="sc-photo"><picture>${wide ? `<source media="(min-aspect-ratio: 1/1)" srcset="${wide.file}">` : ""}<img src="${ph.file}" alt="" decoding="async" onerror="this.closest('#scene').innerHTML = window.SCENES['${FALLBACK[key]}'] ? '<div class=&quot;sc-art&quot;>' + window.SCENES['${FALLBACK[key]}'] + '</div>' : ''"></picture></div>`
      : `<div class="sc-art">${S[FALLBACK[key]]}</div>`;
  };
})();
