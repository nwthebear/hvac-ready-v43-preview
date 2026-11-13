/* Detailed catalog-style SVG illustrations for tools and components.
   Overrides toolSVG / compSVG. Original artwork. ViewBox stays 0 0 120 90. */
(function () {
  let n = 0;
  const uid = () => "il" + (++n);
  const svg = inner => `<svg viewBox="0 0 120 90" class="comp-svg" role="img">${inner}</svg>`;

  function pal(id) {
    return `<defs>
      <linearGradient id="${id}st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3f6"/><stop offset=".2" stop-color="#a8b2ba"/><stop offset=".5" stop-color="#6d767e"/><stop offset=".8" stop-color="#3a4249"/><stop offset="1" stop-color="#1a1f24"/></linearGradient>
      <linearGradient id="${id}sth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c3339"/><stop offset=".3" stop-color="#d5dee6"/><stop offset=".55" stop-color="#8e99a2"/><stop offset="1" stop-color="#252b30"/></linearGradient>
      <linearGradient id="${id}br" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#ffe7b0"/><stop offset=".25" stop-color="#e0b05a"/><stop offset=".55" stop-color="#b07a28"/><stop offset="1" stop-color="#6a4210"/></linearGradient>
      <linearGradient id="${id}cu" x1="0" y1="0" x2=".15" y2="1"><stop offset="0" stop-color="#f3c78a"/><stop offset=".4" stop-color="#c87a3a"/><stop offset="1" stop-color="#7a3e14"/></linearGradient>
      <linearGradient id="${id}or" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd08a"/><stop offset=".35" stop-color="#ff9800"/><stop offset="1" stop-color="#e65100"/></linearGradient>
      <linearGradient id="${id}orh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c05600"/><stop offset=".4" stop-color="#ffcc80"/><stop offset="1" stop-color="#bf360c"/></linearGradient>
      <linearGradient id="${id}bk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6168"/><stop offset=".4" stop-color="#2a2f34"/><stop offset="1" stop-color="#0e1114"/></linearGradient>
      <linearGradient id="${id}yl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9a000"/><stop offset=".4" stop-color="#ffe566"/><stop offset=".7" stop-color="#f5c400"/><stop offset="1" stop-color="#8a6a00"/></linearGradient>
      <linearGradient id="${id}bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#81d4fa"/><stop offset="1" stop-color="#01579b"/></linearGradient>
      <linearGradient id="${id}rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef9a9a"/><stop offset="1" stop-color="#b71c1c"/></linearGradient>
      <linearGradient id="${id}gn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a5d6a7"/><stop offset="1" stop-color="#1b5e20"/></linearGradient>
      <radialGradient id="${id}dm" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#f2f5f7"/><stop offset=".35" stop-color="#8a949c"/><stop offset="1" stop-color="#2a3136"/></radialGradient>
      <radialGradient id="${id}fl" cx=".45" cy=".5" r=".8"><stop offset="0" stop-color="#fffde7"/><stop offset=".3" stop-color="#ffd54f"/><stop offset=".65" stop-color="#ff6d00"/><stop offset="1" stop-color="#1e88e5" stop-opacity=".15"/></radialGradient>
      <linearGradient id="${id}sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="${id}sh" x="-25%" y="-15%" width="150%" height="150%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.1" flood-color="#000" flood-opacity=".42"/></filter>
    </defs>`;
  }
  const ground = (cx=60, cy=84, rx=34) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="4.4" fill="#000" opacity=".32"/>`;
  const shine = (x,y,w,h,r=2,o=.32) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" opacity="${o}"/>`;
  /* Name labels are for lessons/catalogs only. Games and identify quizzes pass { labels: false }. */
  let showNames = true;
  const nameOnly = html => showNames ? html : "";
  function withLabels(on, fn) {
    const prev = showNames;
    showNames = on;
    try { return fn(); } finally { showNames = prev; }
  }

  const COMP = {
    compressor() {
      const id = uid();
      return `${pal(id)}${ground(60,85,32)}
        <rect x="30" y="74" width="16" height="7" rx="1.5" fill="url(#${id}bk)" filter="url(#${id}sh)"/>
        <rect x="74" y="74" width="16" height="7" rx="1.5" fill="url(#${id}bk)"/>
        <circle cx="38" cy="77.5" r="1.6" fill="#c5cdd3"/><circle cx="82" cy="77.5" r="1.6" fill="#c5cdd3"/>
        <g filter="url(#${id}sh)">
          <rect x="36" y="26" width="48" height="50" rx="8" fill="url(#${id}st)" stroke="#1a1f24" stroke-width="1.1"/>
          <ellipse cx="60" cy="26" rx="24" ry="11" fill="url(#${id}dm)" stroke="#1a1f24" stroke-width="1.1"/>
          <ellipse cx="56" cy="22" rx="11" ry="4" fill="#fff" opacity=".35"/>
          <rect x="37" y="40" width="5" height="30" rx="2" fill="#fff" opacity=".18"/>
        </g>
        <ellipse cx="60" cy="32" rx="22" ry="3" fill="#000" opacity=".18"/>
        <rect x="48" y="58" width="24" height="10" rx="1.2" fill="#1c2228" stroke="#8a9198" stroke-width=".4"/>
        <text x="60" y="65" text-anchor="middle" font-size="5" font-weight="800" fill="#d7dde2">HERM</text>
        <g filter="url(#${id}sh)">
          <rect x="78" y="42" width="22" height="20" rx="2" fill="url(#${id}bk)" stroke="#0a0c0e" stroke-width=".7"/>
          <rect x="80" y="44" width="18" height="8" rx="1" fill="#111"/>
          <circle cx="84" cy="48" r="1.7" fill="#cfd8dc"/><circle cx="89" cy="48" r="1.7" fill="#cfd8dc"/><circle cx="94" cy="48" r="1.7" fill="#cfd8dc"/>
          <text x="84" y="59" text-anchor="middle" font-size="4.2" font-weight="700" fill="#bbb">C</text>
          <text x="89" y="59" text-anchor="middle" font-size="4.2" font-weight="700" fill="#bbb">R</text>
          <text x="94" y="59" text-anchor="middle" font-size="4.2" font-weight="700" fill="#bbb">S</text>
        </g>
        <rect x="14" y="54" width="24" height="10" rx="4" fill="#1a1a1a"/>
        <rect x="14" y="55.5" width="24" height="3" rx="1" fill="#4fc3f7" opacity=".35"/>
        <rect x="10" y="55" width="7" height="8" rx="1.5" fill="url(#${id}cu)"/>
        <text x="24" y="52" text-anchor="middle" font-size="5" font-weight="800" fill="#89c4e8">SUCT</text>
        <path d="M58 18 v-6 h18 v7" fill="none" stroke="url(#${id}cu)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="72" y="10" width="8" height="7" rx="1" fill="url(#${id}cu)" stroke="#6a3e14" stroke-width=".4"/>
        <text x="80" y="9" text-anchor="middle" font-size="5" font-weight="800" fill="#f0a070">DISCH</text>`;
    },
    condenser() {
      const id = uid();
      return `${pal(id)}${ground(60,85,40)}
        <g filter="url(#${id}sh)">
          <rect x="16" y="20" width="88" height="58" rx="3" fill="url(#${id}bk)" stroke="#111" stroke-width="1.3"/>
          <rect x="22.0" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="27.2" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="32.4" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="37.6" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="42.8" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="48.0" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="53.2" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="58.4" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="63.6" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="68.8" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="74.0" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="79.2" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="84.4" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="89.6" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/><rect x="94.8" y="26" width="2.8" height="46" rx=".4" fill="#b7c0c8"/>
          <rect x="20" y="26" width="80" height="46" fill="#ff8a3d" opacity=".2"/>
          <rect x="18" y="22" width="4" height="52" fill="#3a4249"/>
          <rect x="98" y="22" width="4" height="52" fill="#3a4249"/>
        </g>
        <circle cx="60" cy="22" r="17" fill="#1c2228" stroke="#4a5560" stroke-width="2.6"/>
        <ellipse cx="60" cy="12.5" rx="3.6" ry="10" fill="url(#${id}sth)" transform="rotate(0 60 22)"/>
        <ellipse cx="60" cy="12.5" rx="3.6" ry="10" fill="url(#${id}sth)" transform="rotate(120 60 22)"/>
        <ellipse cx="60" cy="12.5" rx="3.6" ry="10" fill="url(#${id}sth)" transform="rotate(240 60 22)"/>
        <circle cx="60" cy="22" r="3" fill="#88929a" stroke="#222" stroke-width=".5"/>
        <rect x="16" y="76" width="88" height="6" rx="1" fill="#6d7378"/>
        <rect x="92" y="50" width="10" height="6" rx="1" fill="url(#${id}cu)"/>
        ${nameOnly(`<text x="60" y="88" text-anchor="middle" font-size="5.5" font-weight="700" fill="#9aa3a8">CONDENSER</text>`)}`;
    },
    evaporator() {
      const id = uid();
      return `${pal(id)}${ground(60,85,40)}
        <g filter="url(#${id}sh)">
          <rect x="16" y="70" width="88" height="8" rx="1.5" fill="url(#${id}st)"/>
          <path d="M22 70 L60 16 L98 70" fill="#2a3a44" stroke="#1c2228" stroke-width="1.2"/>
          <path d="M28 68 L60 20 L92 68" fill="none" stroke="#8fd8f0" stroke-width="1.5" opacity=".9"/><path d="M30 68 L60 23 L90 68" fill="none" stroke="#8fd8f0" stroke-width="1.5" opacity=".9"/><path d="M32 68 L60 26 L88 68" fill="none" stroke="#8fd8f0" stroke-width="1.5" opacity=".9"/><path d="M34 68 L60 29 L86 68" fill="none" stroke="#8fd8f0" stroke-width="1.5" opacity=".9"/><path d="M36 68 L60 32 L84 68" fill="none" stroke="#8fd8f0" stroke-width="1.5" opacity=".9"/><path d="M38 68 L60 35 L82 68" fill="none" stroke="#8fd8f0" stroke-width="1.5" opacity=".9"/><path d="M40 68 L60 38 L80 68" fill="none" stroke="#8fd8f0" stroke-width="1.5" opacity=".9"/><path d="M42 68 L60 41 L78 68" fill="none" stroke="#8fd8f0" stroke-width="1.5" opacity=".9"/>
          <path d="M22 70 L60 16 L98 70" fill="#7ad0f0" opacity=".18"/>
        </g>
        <rect x="18" y="70" width="84" height="6" rx="1" fill="#b0b8be"/>
        <rect x="50" y="12" width="10" height="8" rx="1.5" fill="url(#${id}br)" stroke="#6a3a12" stroke-width=".5"/>
        <rect x="22" y="74" width="14" height="4" rx="1" fill="#6aa0b4"/>
        ${nameOnly(`<text x="60" y="88" text-anchor="middle" font-size="5.5" font-weight="700" fill="#9aa3a8">A-COIL EVAP</text>`)}`;
    },
    txv() {
      const id = uid();
      return `${pal(id)}${ground(60,85,38)}
        <rect x="6" y="50" width="38" height="8" rx="2" fill="url(#${id}cu)"/>
        <rect x="76" y="50" width="38" height="9" rx="2" fill="url(#${id}cu)"/>
        <g filter="url(#${id}sh)">
          <rect x="42" y="42" width="36" height="26" rx="4" fill="url(#${id}br)" stroke="#6a3a12" stroke-width=".9"/>
          ${shine(46,45,8,18,2,.28)}
          <circle cx="60" cy="28" r="14" fill="url(#${id}br)" stroke="#6a3a12" stroke-width="1.1"/>
          <circle cx="60" cy="28" r="7" fill="#f0d7a0"/>
          <circle cx="57" cy="25" r="3" fill="#fff" opacity=".4"/>
        </g>
        <path d="M60 14 C82 4 100 14 108 28" fill="none" stroke="url(#${id}cu)" stroke-width="2.4" stroke-linecap="round"/>
        <rect x="102" y="24" width="14" height="24" rx="5" fill="url(#${id}cu)" stroke="#6a3a12" stroke-width=".6"/>
        <text x="109" y="38" text-anchor="middle" font-size="4.6" font-weight="800" fill="#3a220c">BULB</text>
        <path d="M74 60 L94 74 L112 74" fill="none" stroke="#8d4e1f" stroke-width="1.8" stroke-linecap="round"/>
        ${nameOnly(`<text x="60" y="59" text-anchor="middle" font-size="8" font-weight="800" fill="#3a220c">TXV</text>`)}`;
    },
    piston() {
      const id = uid();
      return `${pal(id)}${ground(60,82,40)}
        <rect x="6" y="40" width="108" height="14" rx="4" fill="url(#${id}cu)" stroke="#6a3e14" stroke-width=".7"/>
        ${shine(10,42,20,5,2,.3)}
        <g filter="url(#${id}sh)">
          <rect x="44" y="30" width="32" height="34" rx="4" fill="url(#${id}br)" stroke="#6a3a12" stroke-width=".9"/>
          <circle cx="60" cy="47" r="8" fill="#2a2420"/>
          <circle cx="60" cy="47" r="3.2" fill="#e8c896"/>
        </g>
        ${nameOnly(`<text x="60" y="76" text-anchor="middle" font-size="6.5" font-weight="800" fill="#c9a06a">PISTON / ORIFICE</text>`)}`;
    },
    eev() {
      const id = uid();
      return `${pal(id)}${ground(60,85,40)}
        <rect x="6" y="58" width="108" height="10" rx="2" fill="url(#${id}cu)"/>
        <rect x="46" y="50" width="28" height="22" rx="3" fill="url(#${id}br)"/>
        <g filter="url(#${id}sh)">
          <rect x="40" y="14" width="40" height="38" rx="5" fill="url(#${id}bk)" stroke="#111" stroke-width=".8"/>
          ${shine(44,18,8,28,2,.2)}
          <rect x="54" y="6" width="12" height="12" rx="2" fill="#f0c040" stroke="#8a6a00" stroke-width=".5"/>
        </g>
        <path d="M66 8 C90 2 104 16 112 24" fill="none" stroke="#e53935" stroke-width="2.6" stroke-linecap="round"/>
        ${nameOnly(`<text x="60" y="38" text-anchor="middle" font-size="8" font-weight="800" fill="#e8eef2">EEV</text>`)}`;
    },
    reversing() {
      const id = uid();
      return `${pal(id)}${ground(60,85,36)}
        <g filter="url(#${id}sh)">
          <rect x="20" y="34" width="80" height="26" rx="12" fill="url(#${id}br)" stroke="#6a3a12" stroke-width="1.1"/>
          ${shine(28,38,16,8,4,.3)}
        </g>
        <rect x="28" y="60" width="10" height="18" rx="1" fill="url(#${id}cu)"/>
        <rect x="55" y="60" width="10" height="18" rx="1" fill="url(#${id}cu)"/>
        <rect x="82" y="60" width="10" height="18" rx="1" fill="url(#${id}cu)"/>
        <rect x="55" y="10" width="10" height="24" rx="1" fill="url(#${id}cu)"/>
        <rect x="22" y="18" width="26" height="18" rx="3" fill="url(#${id}bk)" stroke="#111" stroke-width=".6"/>
        ${nameOnly(`<text x="35" y="30" text-anchor="middle" font-size="6" font-weight="800" fill="#d7dde2">SOL</text>`)}
        ${nameOnly(`<text x="60" y="51" text-anchor="middle" font-size="8" font-weight="800" fill="#3a220c">REV</text>`)}
        <text x="33" y="84" text-anchor="middle" font-size="4.5" fill="#c9a06a">E</text>
        <text x="60" y="84" text-anchor="middle" font-size="4.5" fill="#c9a06a">S</text>
        <text x="87" y="84" text-anchor="middle" font-size="4.5" fill="#c9a06a">C</text>`;
    },
    drier() {
      const id = uid();
      return `${pal(id)}${ground(60,82,38)}
        <rect x="6" y="42" width="24" height="8" rx="2" fill="url(#${id}cu)"/>
        <rect x="90" y="42" width="24" height="8" rx="2" fill="url(#${id}cu)"/>
        <g filter="url(#${id}sh)">
          <rect x="28" y="28" width="64" height="36" rx="14" fill="url(#${id}st)" stroke="#1a1f24" stroke-width="1"/>
          <rect x="28" y="28" width="20" height="36" rx="14" fill="#1565c0"/>
          ${shine(50,32,8,24,3,.28)}
        </g>
        <path d="M70 46 L84 46 M80 41 L88 46 L80 51" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        ${nameOnly(`<text x="60" y="76" text-anchor="middle" font-size="6.5" font-weight="800" fill="#8ab4d8">FILTER DRIER</text>`)}`;
    },
    accumulator() {
      const id = uid();
      return `${pal(id)}${ground(60,85,24)}
        <g filter="url(#${id}sh)">
          <rect x="38" y="16" width="44" height="64" rx="20" fill="url(#${id}st)" stroke="#1c2228" stroke-width="1.2"/>
          <ellipse cx="60" cy="16" rx="22" ry="10" fill="url(#${id}dm)" stroke="#1c2228" stroke-width="1.2"/>
          ${shine(42,28,6,36,3,.25)}
        </g>
        <rect x="46" y="4" width="8" height="16" rx="1" fill="url(#${id}cu)"/>
        <rect x="66" y="4" width="8" height="16" rx="1" fill="url(#${id}cu)"/>
        ${nameOnly(`<text x="60" y="52" text-anchor="middle" font-size="6" font-weight="800" fill="#d7dde2">ACCUM</text>`)}`;
    },
    contactor() {
      const id = uid();
      return `${pal(id)}${ground(60,85,30)}
        <g filter="url(#${id}sh)">
          <rect x="26" y="8" width="68" height="74" rx="4" fill="#f3f0e8" stroke="#37474f" stroke-width="1.6"/>
          <path d="M94 12 v66 a4 4 0 0 1 -4 4" fill="#c5c0b4"/>
          <rect x="34" y="32" width="52" height="26" rx="2" fill="#f5c400" stroke="#b8860b" stroke-width=".7"/>
          ${shine(38,35,12,6,1,.35)}
          <text x="60" y="49" text-anchor="middle" font-size="8" font-weight="800" fill="#3a2a00">24V COIL</text>
        </g>
        <circle cx="42" cy="20" r="4" fill="#b0bec5" stroke="#455a64" stroke-width=".7"/><circle cx="42" cy="20" r="1.5" fill="#eceff1"/><circle cx="60" cy="20" r="4" fill="#b0bec5" stroke="#455a64" stroke-width=".7"/><circle cx="60" cy="20" r="1.5" fill="#eceff1"/><circle cx="78" cy="20" r="4" fill="#b0bec5" stroke="#455a64" stroke-width=".7"/><circle cx="78" cy="20" r="1.5" fill="#eceff1"/><circle cx="42" cy="72" r="4" fill="#b0bec5" stroke="#455a64" stroke-width=".7"/><circle cx="42" cy="72" r="1.5" fill="#eceff1"/><circle cx="60" cy="72" r="4" fill="#b0bec5" stroke="#455a64" stroke-width=".7"/><circle cx="60" cy="72" r="1.5" fill="#eceff1"/><circle cx="78" cy="72" r="4" fill="#b0bec5" stroke="#455a64" stroke-width=".7"/><circle cx="78" cy="72" r="1.5" fill="#eceff1"/>
        <text x="42" y="14" text-anchor="middle" font-size="4.5" font-weight="700" fill="#546e7a">L1</text>
        <text x="60" y="14" text-anchor="middle" font-size="4.5" font-weight="700" fill="#546e7a">L2</text>
        <text x="78" y="14" text-anchor="middle" font-size="4.5" font-weight="700" fill="#546e7a">T1</text>`;
    },
    capacitor() {
      const id = uid();
      return `${pal(id)}${ground(60,85,26)}
        <g filter="url(#${id}sh)">
          <ellipse cx="64" cy="78" rx="26" ry="7" fill="#6a737b"/>
          <path d="M38 78 L38 28 Q38 16 60 16 Q86 16 90 28 L90 78 Q86 86 60 86 Q38 86 38 78Z" fill="url(#${id}sth)" stroke="#2a3136" stroke-width="1"/>
          ${shine(46,26,7,44,3,.28)}
        </g>
        <rect x="48" y="40" width="32" height="26" rx="2" fill="#f4f6f8" stroke="#bbb" stroke-width=".4"/>
        <text x="64" y="51" text-anchor="middle" font-size="7" font-weight="800" fill="#212121">45/5 µF</text>
        <text x="64" y="60" text-anchor="middle" font-size="5" font-weight="700" fill="#546e7a">370 / 440V</text>
        <rect x="44" y="10" width="44" height="16" rx="3" fill="url(#${id}bk)" stroke="#111" stroke-width=".6"/>
        <circle cx="54" cy="18" r="3.2" fill="#8D6E63" stroke="#4e342e" stroke-width=".6"/>
        <circle cx="66" cy="18" r="3.2" fill="#eceff1" stroke="#90a4ae" stroke-width=".6"/>
        <circle cx="78" cy="18" r="3.2" fill="#f9a825" stroke="#f57f17" stroke-width=".6"/>
        <circle cx="54" cy="18" r="1.1" fill="#333"/><circle cx="66" cy="18" r="1.1" fill="#333"/><circle cx="78" cy="18" r="1.1" fill="#333"/>
        <text x="54" y="9" text-anchor="middle" font-size="4.6" font-weight="800" fill="#e8dcc0">HERM</text>
        <text x="66" y="9" text-anchor="middle" font-size="4.6" font-weight="800" fill="#e8dcc0">C</text>
        <text x="78" y="9" text-anchor="middle" font-size="4.6" font-weight="800" fill="#e8dcc0">FAN</text>`;
    },
    thermostat() {
      const id = uid();
      return `${pal(id)}${ground(62,86,28)}
        <rect x="28" y="10" width="66" height="70" rx="6" fill="#c5c0b6" opacity=".55"/>
        <g filter="url(#${id}sh)">
          <path d="M30 12 h56 a8 8 0 0 1 8 8 v54 a8 8 0 0 1 -8 8 h-56 a8 8 0 0 1 -8 -8 v-54 a8 8 0 0 1 8 -8z" fill="#f3f1ea" stroke="#6d7178" stroke-width="1.3"/>
          <path d="M86 16 v56 a6 6 0 0 1 -4 5" fill="none" stroke="#b0aaa0" stroke-width="3"/>
          <rect x="38" y="20" width="44" height="32" rx="3" fill="#0e1a14" stroke="#1a1f24" stroke-width=".8"/>
          <rect x="40" y="22" width="40" height="28" rx="2" fill="#14301c"/>
          <text x="60" y="40" text-anchor="middle" font-size="14" font-weight="800" fill="#7CF0A0">72°</text>
          <text x="48" y="48" text-anchor="middle" font-size="4.4" font-weight="700" fill="#5D8A68">HEAT</text>
          <text x="70" y="48" text-anchor="middle" font-size="4.4" font-weight="700" fill="#5D8A68">AUTO</text>
        </g>
        <circle cx="46" cy="64" r="6.2" fill="#ecebe4" stroke="#8a8880" stroke-width="1.1"/>
        <circle cx="74" cy="64" r="6.2" fill="#ecebe4" stroke="#8a8880" stroke-width="1.1"/>
        <path d="M43 64 h6 M46 61 v6" stroke="#455a64" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M74 61.5 l3.2 5 h-6.4z" fill="#455a64"/>
        <text x="60" y="78" text-anchor="middle" font-size="5" font-weight="700" fill="#78909c">SYSTEM  ·  FAN</text>`;
    }
  };

  /* ===================== TOOLS ===================== */
  const TOOL = {
    "fin-comb"() {
      const id = uid();
      return `${pal(id)}${ground(70,85,40)}
        <g filter="url(#${id}sh)">
          <!-- contoured handle with grip ribs -->
          <path d="M8 38 C8 30 18 28 30 30 C44 32 50 34 52 28 h12 v34 h-12 C50 58 44 60 30 62 C18 64 8 60 8 52 Z" fill="url(#${id}or)" stroke="#bf360c" stroke-width=".9"/>
          <line x1="18.0" y1="40" x2="18.0" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="20.2" y1="40" x2="20.2" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="22.4" y1="40" x2="22.4" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="24.6" y1="40" x2="24.6" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="26.8" y1="40" x2="26.8" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="29.0" y1="40" x2="29.0" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="31.2" y1="40" x2="31.2" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="33.4" y1="40" x2="33.4" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="35.6" y1="40" x2="35.6" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="37.8" y1="40" x2="37.8" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="40.0" y1="40" x2="40.0" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="42.2" y1="40" x2="42.2" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="44.4" y1="40" x2="44.4" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/><line x1="46.6" y1="40" x2="46.6" y2="54" stroke="#bf360c" stroke-width="0.7" opacity=".45"/>
          ${shine(14,34,16,5,2,.35)}
          <!-- ferrule -->
          <rect x="52" y="28" width="12" height="34" rx="2" fill="url(#${id}st)" stroke="#2a3136" stroke-width=".6"/>
          ${shine(54,31,3,26,1,.3)}
          <!-- teeth with tapered profiles -->
          <path d="M62.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M62.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M67.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M67.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M72.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M72.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M77.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M77.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M82.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M82.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M87.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M87.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M92.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M92.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M97.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M97.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M102.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M102.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/><path d="M107.0 30 l2.2 0 l0.6 36 l-3.4 0 z" fill="#cfd8dc" stroke="#455a64" stroke-width=".35"/><path d="M107.4 32 l0.7 0 l0.3 30" stroke="#fff" stroke-width=".5" opacity=".45"/>
        </g>
        <path d="M64 28 q28 -12 54 4" fill="none" stroke="#90a4ae" stroke-width="1.3" opacity=".55"/>
        ${nameOnly(`<text x="60" y="16" text-anchor="middle" font-size="6.5" font-weight="800" fill="#e8dcc0">FIN COMB</text>`)}
        <text x="90" y="78" text-anchor="middle" font-size="5.2" font-weight="700" fill="#9aa3a8">14–20 FPI</text>`;
    },
    "torch-map"() {
      const id = uid();
      return `${pal(id)}${ground(52,85,36)}
        <!-- MAP cylinder (yellow, 3/4) -->
        <g filter="url(#${id}sh)">
          <ellipse cx="32" cy="78" rx="16" ry="5" fill="#6a5a00"/>
          <path d="M16 78 L16 36 Q16 24 32 22 Q48 24 48 36 L48 78 Q48 84 32 84 Q16 84 16 78Z" fill="url(#${id}yl)" stroke="#7a6500" stroke-width=".9"/>
          ${shine(20,38,5,30,2,.35)}
          <ellipse cx="32" cy="36" rx="16" ry="7" fill="#ffe566" stroke="#7a6500" stroke-width=".8"/>
          <ellipse cx="30" cy="34" rx="7" ry="2.6" fill="#fff" opacity=".3"/>
          <rect x="24" y="48" width="16" height="14" rx="1.5" fill="#1a237e"/>
          ${nameOnly(`<text x="32" y="58" text-anchor="middle" font-size="6" font-weight="800" fill="#fff59d">MAP</text>`)}
        </g>
        <!-- valve + knurled knob -->
        <rect x="28" y="16" width="8" height="10" fill="url(#${id}br)" stroke="#6a4210" stroke-width=".5"/>
        <circle cx="32" cy="14" r="6" fill="url(#${id}br)" stroke="#6a4210" stroke-width=".6"/>
        <line x1="38.0" y1="14.0" x2="35.5" y2="14.0" stroke="#6a4210" stroke-width=".6"/><line x1="37.2" y1="17.0" x2="35.0" y2="15.8" stroke="#6a4210" stroke-width=".6"/><line x1="35.0" y1="19.2" x2="33.8" y2="17.0" stroke="#6a4210" stroke-width=".6"/><line x1="32.0" y1="20.0" x2="32.0" y2="17.5" stroke="#6a4210" stroke-width=".6"/><line x1="29.0" y1="19.2" x2="30.2" y2="17.0" stroke="#6a4210" stroke-width=".6"/><line x1="26.8" y1="17.0" x2="29.0" y2="15.8" stroke="#6a4210" stroke-width=".6"/><line x1="26.0" y1="14.0" x2="28.5" y2="14.0" stroke="#6a4210" stroke-width=".6"/><line x1="26.8" y1="11.0" x2="29.0" y2="12.2" stroke="#6a4210" stroke-width=".6"/><line x1="29.0" y1="8.8" x2="30.2" y2="11.0" stroke="#6a4210" stroke-width=".6"/><line x1="32.0" y1="8.0" x2="32.0" y2="10.5" stroke="#6a4210" stroke-width=".6"/><line x1="35.0" y1="8.8" x2="33.8" y2="11.0" stroke="#6a4210" stroke-width=".6"/><line x1="37.2" y1="11.0" x2="35.0" y2="12.2" stroke="#6a4210" stroke-width=".6"/>
        <circle cx="32" cy="14" r="2.2" fill="#ffe7b0"/>
        <!-- torch neck, trigger, brass tip, flame -->
        <path d="M36 20 C58 16 70 28 78 40" fill="none" stroke="url(#${id}st)" stroke-width="5" stroke-linecap="round"/>
        <path d="M70 34 l8 10 6 -2" fill="none" stroke="url(#${id}bk)" stroke-width="3.2" stroke-linecap="round"/>
        <rect x="76" y="38" width="8" height="10" rx="1" fill="url(#${id}bk)"/>
        <rect x="82" y="40" width="16" height="6" rx="1" fill="url(#${id}br)" stroke="#6a4210" stroke-width=".5"/>
        <ellipse cx="108" cy="43" rx="12" ry="8" fill="url(#${id}fl)"/>
        <ellipse cx="102" cy="43" rx="5" ry="3.2" fill="#fffde7"/>
        ${nameOnly(`<text x="70" y="16" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">MAP TORCH</text>`)}`;
    },
    "torch-oxy"() {
      const id = uid();
      return `${pal(id)}${ground(60,85,40)}
        <g filter="url(#${id}sh)">
          <!-- twin valves (green O2 / red fuel) on a brass mixer -->
          <rect x="14" y="40" width="52" height="14" rx="4" fill="url(#${id}br)" stroke="#6a4210" stroke-width=".8"/>
          ${shine(18,42,14,4,2,.35)}
          <circle cx="26" cy="32" r="8" fill="url(#${id}gn)" stroke="#1b5e20" stroke-width=".8"/>
          <circle cx="26" cy="32" r="3" fill="#c8e6c9"/>
          <circle cx="48" cy="32" r="8" fill="url(#${id}rd)" stroke="#b71c1c" stroke-width=".8"/>
          <circle cx="48" cy="32" r="3" fill="#ffcdd2"/>
          <text x="26" y="24" text-anchor="middle" font-size="4.5" font-weight="800" fill="#c8e6c9">O2</text>
          <text x="48" y="24" text-anchor="middle" font-size="4.5" font-weight="800" fill="#ffcdd2">FUEL</text>
          <!-- handle -->
          <path d="M22 54 L16 80" stroke="url(#${id}bk)" stroke-width="8" stroke-linecap="round"/>
          ${shine(18,58,3,14,1,.25)}
          <!-- mixing tube + brass tip -->
          <rect x="64" y="42" width="28" height="10" rx="2" fill="url(#${id}st)" stroke="#2a3136" stroke-width=".6"/>
          <rect x="90" y="43" width="12" height="8" rx="1" fill="url(#${id}br)"/>
        </g>
        <ellipse cx="112" cy="47" rx="10" ry="7" fill="url(#${id}fl)"/>
        <ellipse cx="106" cy="47" rx="4" ry="2.6" fill="#fffde7"/>
        ${nameOnly(`<text x="60" y="14" text-anchor="middle" font-size="6" font-weight="800" fill="#e8dcc0">OXY-ACETYLENE</text>`)}`;
    },
    "torch-air"() {
      const id = uid();
      return `${pal(id)}${ground(60,85,38)}
        <g filter="url(#${id}sh)">
          <rect x="10" y="36" width="44" height="16" rx="5" fill="url(#${id}or)" stroke="#bf360c" stroke-width=".8"/>
          ${shine(14,39,14,5,2,.35)}
          <path d="M22 52 L16 80" stroke="url(#${id}bk)" stroke-width="8" stroke-linecap="round"/>
          <rect x="52" y="38" width="30" height="12" rx="2" fill="url(#${id}st)"/>
          <circle cx="58" cy="30" r="6" fill="url(#${id}br)" stroke="#6a4210" stroke-width=".6"/>
          <rect x="80" y="40" width="14" height="8" rx="1" fill="url(#${id}br)"/>
        </g>
        <ellipse cx="106" cy="44" rx="12" ry="8" fill="url(#${id}fl)"/>
        <ellipse cx="100" cy="44" rx="4.5" ry="3" fill="#fffde7"/>
        ${nameOnly(`<text x="60" y="16" text-anchor="middle" font-size="6" font-weight="800" fill="#e8dcc0">AIR-ACETYLENE</text>`)}`;
    },

    flaring() {
      const id = uid();
      return `${pal(id)}${ground(60,85,40)}
        <g filter="url(#${id}sh)">
          <rect x="6" y="56" width="108" height="16" rx="3" fill="url(#${id}sth)" stroke="#2b3338" stroke-width=".8"/>
          ${shine(10,58,24,4,2,.3)}
        </g>
        <circle cx="22" cy="64" r="4.5" fill="#1c2226" stroke="#cfd6db" stroke-width=".6"/>
        <circle cx="38" cy="64" r="4.5" fill="#1c2226" stroke="#cfd6db" stroke-width=".6"/>
        <circle cx="54" cy="64" r="6" fill="#1c2226" stroke="#e8c27a" stroke-width="1.1"/>
        <circle cx="72" cy="64" r="4.5" fill="#1c2226" stroke="#cfd6db" stroke-width=".6"/>
        <circle cx="88" cy="64" r="4.5" fill="#1c2226" stroke="#cfd6db" stroke-width=".6"/>
        <circle cx="104" cy="64" r="4.5" fill="#1c2226" stroke="#cfd6db" stroke-width=".6"/>
        <g filter="url(#${id}sh)">
          <path d="M42 56 v-16 h8 v-10 h20 v10 h8 v16" fill="url(#${id}br)" stroke="#3d2a14" stroke-width=".8"/>
          <rect x="52" y="12" width="16" height="20" rx="1.5" fill="url(#${id}br)" stroke="#5a3a1c" stroke-width=".6"/>
          <circle cx="60" cy="14" r="3.4" fill="#eee3c8"/>
          <path d="M60 14 l2.4 -7 M60 14 l-2.4 -7" stroke="#8a6a30" stroke-width="1.2"/>
        </g>
        <path d="M60 36 v18" stroke="#b08a40" stroke-width="2.2"/>
        <polygon points="55,52 65,52 60,64" fill="#d7c08a"/>
        ${nameOnly(`<text x="60" y="10" text-anchor="middle" font-size="6.2" font-weight="800" fill="#e8dcc0">45° FLARE</text>`)}`;
    },
    swaging() {
      const id = uid();
      return `${pal(id)}${ground(60,85,36)}
        <g filter="url(#${id}sh)">
          <rect x="14" y="8" width="16" height="60" rx="5" fill="url(#${id}orh)" stroke="#5a3e16" stroke-width=".8"/>
          ${shine(17,12,5,50,2,.3)}
          <path d="M30 22 h20 l8 8 v20 l-8 8 h-20z" fill="url(#${id}st)" stroke="#2c3438" stroke-width=".8"/>
          <circle cx="48" cy="40" r="5.5" fill="#1c2226" stroke="#c5cdd3" stroke-width=".6"/>
          <rect x="58" y="28" width="46" height="24" rx="11" fill="url(#${id}cu)" stroke="#6a3e14" stroke-width=".8"/>
          ${shine(70,32,16,6,3,.3)}
        </g>
        ${nameOnly(`<text x="80" y="70" text-anchor="middle" font-size="6.2" font-weight="800" fill="#e8dcc0">SWAGE</text>`)}`;
    },
    bender() {
      const id = uid();
      return `${pal(id)}${ground(62,85,40)}
        <path d="M16 72 L50 22" stroke="url(#${id}orh)" stroke-width="9" stroke-linecap="round"/>
        <path d="M20 70 L50 24" stroke="#fff" stroke-width="1.7" opacity=".28" stroke-linecap="round"/>
        <path d="M70 16 L106 22" stroke="url(#${id}orh)" stroke-width="9" stroke-linecap="round"/>
        <path d="M94 14 h16 v11 h-8z" fill="url(#${id}br)" stroke="#5a3a1c" stroke-width=".6"/>
        <g filter="url(#${id}sh)">
          <path d="M48 28 a22 22 0 0 0 36 26" fill="none" stroke="url(#${id}st)" stroke-width="11"/>
          <path d="M50 28 a20 20 0 0 0 32 24" fill="none" stroke="url(#${id}cu)" stroke-width="5"/>
        </g>
        <circle cx="68" cy="48" r="5.5" fill="#2a3136" stroke="#d0d6db" stroke-width=".8"/>
        ${nameOnly(`<text x="60" y="12" text-anchor="middle" font-size="6.2" font-weight="800" fill="#e8dcc0">TUBE BENDER</text>`)}`;
    },
    deburr() {
      const id = uid();
      return `${pal(id)}${ground(60,85,26)}
        <defs><linearGradient id="${id}rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fc3f7"/><stop offset=".5" stop-color="#0277bd"/><stop offset="1" stop-color="#c62828"/></linearGradient></defs>
        <g filter="url(#${id}sh)">
          <rect x="50" y="8" width="20" height="70" rx="9" fill="url(#${id}rb)" stroke="#153a4a" stroke-width=".8"/>
          ${shine(54,12,5,60,2,.3)}
        </g>
        <circle cx="60" cy="8" r="7" fill="#cfd8dc" stroke="#455a64" stroke-width=".8"/>
        <path d="M56 8 l8 0 l-4 -7z" fill="#b0bec5"/>
        <circle cx="60" cy="78" r="8" fill="#eceff1" stroke="#455a64" stroke-width=".8"/>
        <path d="M60 72 l3.5 9 h-7z" fill="#78909c"/>
        ${nameOnly(`<text x="82" y="46" font-size="6.2" font-weight="800" fill="#e8dcc0">REAMER</text>`)}`;
    },
    "pinch-off"() {
      const id = uid();
      return `${pal(id)}${ground(60,85,36)}
        <path d="M20 82 L48 46" stroke="url(#${id}orh)" stroke-width="9" stroke-linecap="round"/>
        <path d="M50 82 L70 48" stroke="url(#${id}orh)" stroke-width="9" stroke-linecap="round"/>
        <path d="M22 80 L48 46" stroke="#fff" stroke-width="1.5" opacity=".28" stroke-linecap="round"/>
        <g filter="url(#${id}sh)">
          <path d="M44 46 L58 20 L80 28 L74 50 Z" fill="url(#${id}st)" stroke="#2c3438" stroke-width=".8"/>
          <path d="M58 20 L80 28 L76 46 L62 42 Z" fill="#9aa5ad"/>
        </g>
        <rect x="86" y="28" width="22" height="10" rx="4" fill="url(#${id}cu)" stroke="#6a3e14" stroke-width=".7"/>
        <path d="M86 33 h-12" stroke="url(#${id}cu)" stroke-width="5" stroke-linecap="round"/>
        ${nameOnly(`<text x="64" y="14" text-anchor="middle" font-size="6.2" font-weight="800" fill="#e8dcc0">PINCH-OFF</text>`)}`;
    },
    crimper() {
      const id = uid();
      return `${pal(id)}${ground(60,85,38)}
        <path d="M16 80 L50 40" stroke="url(#${id}orh)" stroke-width="8.5" stroke-linecap="round"/>
        <path d="M46 82 L70 44" stroke="url(#${id}orh)" stroke-width="8.5" stroke-linecap="round"/>
        <path d="M18 78 L50 40" stroke="#fff" stroke-width="1.5" opacity=".28" stroke-linecap="round"/>
        <g filter="url(#${id}sh)">
          <path d="M48 42 L78 20 L94 30 L72 50 Z" fill="url(#${id}st)" stroke="#37474f" stroke-width=".8"/>
          <path d="M62 36 L86 18 L96 28 L76 46 Z" fill="#90a4ae" stroke="#37474f" stroke-width=".7"/>
        </g>
        <circle cx="64" cy="44" r="3.2" fill="#263238"/>
        <rect x="78" y="22" width="7" height="6" rx="1" fill="#e53935"/>
        <rect x="86" y="19" width="7" height="6" rx="1" fill="#fdd835"/>
        <rect x="94" y="17" width="7" height="6" rx="1" fill="#1e88e5"/>
        ${nameOnly(`<text x="62" y="12" text-anchor="middle" font-size="6.5" font-weight="800" fill="#e8dcc0">CRIMPER</text>`)}`;
    },
    "press-tool"() {
      const id = uid();
      return `${pal(id)}${ground(60,85,36)}
        <g filter="url(#${id}sh)">
          <rect x="12" y="26" width="54" height="30" rx="6" fill="url(#${id}or)" stroke="#b71c1c" stroke-width=".9"/>
          ${shine(16,30,14,8,2,.3)}
          <rect x="34" y="32" width="24" height="12" rx="2" fill="#263238"/>
          ${nameOnly(`<text x="46" y="41" text-anchor="middle" font-size="6" font-weight="800" fill="#c8f7c0">PRESS</text>`)}
          <rect x="20" y="54" width="16" height="18" rx="3" fill="#37474f"/>
          <circle cx="28" cy="72" r="8" fill="#263238" stroke="#90a4ae" stroke-width="1.5"/>
          <path d="M64 32 h12 l8 8 v10 l-8 8 h-12z" fill="url(#${id}st)" stroke="#263238" stroke-width=".8"/>
          <circle cx="94" cy="48" r="13" fill="none" stroke="url(#${id}st)" stroke-width="6"/>
          <circle cx="94" cy="48" r="6" fill="url(#${id}cu)"/>
        </g>
        ${nameOnly(`<text x="70" y="14" text-anchor="middle" font-size="6.2" font-weight="800" fill="#e8dcc0">PRESS TOOL</text>`)}`;
    },
    "staple-gun"() {
      const id = uid();
      return `${pal(id)}${ground(60,85,36)}
        <g filter="url(#${id}sh)">
          <path d="M18 28 h72 a6 6 0 0 1 6 6 v16 h-28 v16 a8 8 0 0 1 -8 8 h-20 a8 8 0 0 1 -8 -8 v-16 h-14 a6 6 0 0 1 -6 -6 v-10 a6 6 0 0 1 6 -6z" fill="url(#${id}or)" stroke="#bf360c" stroke-width=".9"/>
          ${shine(26,34,50,7,2,.35)}
          <rect x="70" y="46" width="28" height="10" rx="1" fill="#37474f"/>
          <path d="M78 46 v-8 h12 v8" fill="#546e7a"/>
          <rect x="74" y="48" width="3" height="6" fill="#cfd8dc"/><rect x="80" y="48" width="3" height="6" fill="#cfd8dc"/><rect x="86" y="48" width="3" height="6" fill="#cfd8dc"/><rect x="92" y="48" width="3" height="6" fill="#cfd8dc"/>
          <path d="M42 52 v18" stroke="#5d4037" stroke-width="3.2" stroke-linecap="round"/>
        </g>
        ${nameOnly(`<text x="60" y="18" text-anchor="middle" font-size="6.2" font-weight="800" fill="#e8dcc0">STAPLE GUN</text>`)}`;
    },
    "coil-sprayer"() {
      const id = uid();
      return `${pal(id)}${ground(50,85,28)}
        <g filter="url(#${id}sh)">
          <path d="M30 32 h38 a6 6 0 0 1 6 6 v40 a10 10 0 0 1 -10 10 h-30 a10 10 0 0 1 -10 -10 v-40 a6 6 0 0 1 6 -6z" fill="url(#${id}bl)" stroke="#01579b" stroke-width=".9"/>
          ${shine(34,36,12,34,3,.28)}
          <rect x="42" y="12" width="16" height="22" rx="3" fill="#0277bd" stroke="#015079" stroke-width=".7"/>
          <circle cx="50" cy="16" r="3.2" fill="#4fc3f7"/>
        </g>
        <path d="M58 20 C80 8 98 18 106 14" fill="none" stroke="#01579b" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="108" cy="14" r="3.4" fill="#81d4fa"/><circle cx="102" cy="24" r="2" fill="#81d4fa" opacity=".8"/>
        ${nameOnly(`<text x="50" y="66" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e3f2fd">COIL CLEANER</text>`)}`;
    },
    "gauge-analog"() {
      const id = uid();
      return `${pal(id)}${ground(60,85,36)}
        <g filter="url(#${id}sh)">
          <ellipse cx="36" cy="40" rx="24" ry="24" fill="#f4f1ea" stroke="#1565c0" stroke-width="5"/>
          <ellipse cx="84" cy="40" rx="24" ry="24" fill="#f4f1ea" stroke="#c62828" stroke-width="5"/>
        </g>
        <path d="M36 40 L50 26 M84 40 L70 26" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="36" cy="40" r="3" fill="#1a1a1a"/><circle cx="84" cy="40" r="3" fill="#1a1a1a"/>
        <rect x="26" y="66" width="68" height="14" rx="3" fill="url(#${id}st)"/>
        <circle cx="42" cy="73" r="3" fill="#1565c0"/><circle cx="78" cy="73" r="3" fill="#c62828"/>
        <text x="36" y="16" text-anchor="middle" font-size="5.5" font-weight="800" fill="#90caf9">LO</text>
        <text x="84" y="16" text-anchor="middle" font-size="5.5" font-weight="800" fill="#ef9a9a">HI</text>`;
    },
    "gauge-digital"() { return TOOL._digital("R-410A", "SH 11°"); },
    micron() { return TOOL._digital("MICRON", "250"); },
    manometer() { return TOOL._digital("in. w.c.", "0.48"); },
    combustion() { return TOOL._digital("CO", "12 ppm"); },
    _digital(a, b) {
      const id = uid();
      return `${pal(id)}${ground(60,85,28)}
        <g filter="url(#${id}sh)">
          <rect x="24" y="6" width="72" height="74" rx="8" fill="url(#${id}st)" stroke="#263238" stroke-width="1.4"/>
          ${shine(28,10,10,60,3,.2)}
          <rect x="32" y="14" width="56" height="34" rx="3" fill="#0b1f12" stroke="#1b5e20" stroke-width=".6"/>
        </g>
        <text x="60" y="30" text-anchor="middle" font-size="8" font-weight="800" fill="#7CF0A0">${a}</text>
        <text x="60" y="42" text-anchor="middle" font-size="10" font-weight="700" fill="#C8F7C0">${b}</text>
        <circle cx="42" cy="64" r="6" fill="#90a4ae"/><circle cx="78" cy="64" r="6" fill="#90a4ae"/>
        <rect x="30" y="72" width="14" height="6" rx="1" fill="#1565c0"/><rect x="76" y="72" width="14" height="6" rx="1" fill="#c62828"/>`;
    },
    hoses() {
      const id = uid();
      return `${pal(id)}${ground(60,85,40)}
        <path d="M10 72 Q40 10 62 46 T112 22" stroke="#c62828" stroke-width="7.5" fill="none" stroke-linecap="round"/>
        <path d="M10 80 Q44 28 66 58 T112 44" stroke="#1565c0" stroke-width="7.5" fill="none" stroke-linecap="round"/>
        <path d="M10 62 Q36 2 62 32 T112 8" stroke="#f9a825" stroke-width="7.5" fill="none" stroke-linecap="round"/>
        <rect x="4" y="58" width="10" height="26" rx="2" fill="url(#${id}st)"/>
        <rect x="106" y="4" width="10" height="48" rx="2" fill="url(#${id}st)"/>
        <text x="60" y="88" text-anchor="middle" font-size="5.5" font-weight="700" fill="#9aa3a8">R / Y / B HOSES</text>`;
    },
    "core-tool"() { return TOOL._core("CORE"); },
    "schrader-tool"() { return TOOL._core("SCHRADER"); },
    piercing() { return TOOL._core("PIERCE"); },
    _core(label) {
      const id = uid();
      return `${pal(id)}${ground(60,85,24)}
        <g filter="url(#${id}sh)">
          <rect x="50" y="8" width="20" height="58" rx="4" fill="url(#${id}st)" stroke="#263238" stroke-width=".8"/>
          ${shine(53,12,5,48,2,.28)}
          <rect x="38" y="62" width="44" height="16" rx="4" fill="url(#${id}br)" stroke="#5a3a1c" stroke-width=".7"/>
        </g>
        <path d="M60 2 L60 12" stroke="#263238" stroke-width="4" stroke-linecap="round"/>
        <circle cx="60" cy="36" r="6" fill="#fdd835" stroke="#8a6a00" stroke-width=".5"/>
        ${nameOnly(`<text x="60" y="88" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">${label}</text>`)}`;
    },
    "vacuum-pump"() { return TOOL._pump("VACUUM"); },
    recovery() { return TOOL._pump("RECOVERY"); },
    "condensate-vac"() { return TOOL._pump("COND. VAC"); },
    _pump(label) {
      const id = uid();
      return `${pal(id)}${ground(60,85,40)}
        <rect x="12" y="76" width="96" height="6" rx="1" fill="#263238"/>
        <g filter="url(#${id}sh)">
          <rect x="14" y="30" width="92" height="46" rx="6" fill="url(#${id}or)" stroke="#bf360c" stroke-width="1"/>
          ${shine(20,34,16,12,3,.3)}
          <rect x="22" y="14" width="38" height="18" rx="3" fill="#37474f"/>
          <circle cx="88" cy="54" r="14" fill="#37474f"/><circle cx="88" cy="54" r="7" fill="#90a4ae"/>
        </g>
        ${nameOnly(`<text x="50" y="58" text-anchor="middle" font-size="7.5" font-weight="800" fill="#fff3e0">${label}</text>`)}`;
    },
    cylinder() {
      const id = uid();
      return `${pal(id)}${ground(60,85,24)}
        <g filter="url(#${id}sh)">
          <rect x="38" y="22" width="44" height="58" rx="16" fill="url(#${id}st)" stroke="#455a64" stroke-width="1"/>
          <path d="M38 40 Q38 22 60 20 Q82 22 82 40 Z" fill="url(#${id}yl)"/>
          <rect x="50" y="6" width="20" height="16" rx="3" fill="#616161"/>
          <circle cx="60" cy="8" r="4" fill="url(#${id}br)"/>
          ${shine(44,44,6,24,2,.25)}
        </g>
        ${nameOnly(`<text x="60" y="88" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">CYLINDER</text>`)}`;
    },
    scale() {
      const id = uid();
      return `${pal(id)}${ground(60,85,38)}
        <g filter="url(#${id}sh)">
          <rect x="14" y="50" width="92" height="26" rx="5" fill="url(#${id}bk)" stroke="#111" stroke-width=".7"/>
          <rect x="40" y="58" width="40" height="12" rx="2" fill="#0b1f12"/>
          <text x="60" y="67" text-anchor="middle" font-size="8" font-weight="800" fill="#7CF0A0">12.40 lb</text>
          <rect x="44" y="14" width="32" height="36" rx="8" fill="url(#${id}gn)" stroke="#1b5e20" stroke-width=".7"/>
          ${shine(48,18,8,16,3,.3)}
        </g>`;
    },
    "leak-electronic"() { return TOOL._detector("sniff", "ELECTRONIC"); },
    "leak-ultrasonic"() { return TOOL._detector("ear", "ULTRASONIC"); },
    "co-detector"() { return TOOL._detector("co", "CO DETECTOR"); },
    _detector(kind, label) {
      const id = uid();
      return `${pal(id)}${ground(60,85,24)}
        <g filter="url(#${id}sh)">
          <rect x="42" y="28" width="36" height="54" rx="8" fill="url(#${id}yl)" stroke="#8a6a00" stroke-width=".8"/>
          ${shine(46,32,8,40,3,.3)}
          <circle cx="60" cy="46" r="7" fill="${kind==="co"?"#e53935":"#43a047"}" stroke="#222" stroke-width=".5"/>
        </g>
        <path d="M60 28 Q60 8 98 6" stroke="#455a64" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="100" cy="6" r="4" fill="#e53935"/>
        ${nameOnly(`<text x="60" y="16" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">${label}</text>`)}`;
    },
    bubbles() { return TOOL._bottle("#29b6f6", "BUBBLES"); },
    "uv-dye"() { return TOOL._bottle("#8e24aa", "UV DYE"); },
    _bottle(color, label) {
      const id = uid();
      return `${pal(id)}${ground(60,85,22)}
        <g filter="url(#${id}sh)">
          <rect x="40" y="28" width="40" height="54" rx="8" fill="${color}" stroke="#01579b" stroke-width=".7"/>
          ${shine(44,32,8,36,3,.3)}
          <rect x="52" y="12" width="16" height="18" rx="2" fill="#0277bd"/>
        </g>
        ${nameOnly(`<text x="60" y="58" text-anchor="middle" font-size="6" font-weight="800" fill="#fff">${label}</text>`)}`;
    },
    "n2-regulator"() {
      const id = uid();
      return `${pal(id)}${ground(60,85,30)}
        <g filter="url(#${id}sh)">
          <circle cx="54" cy="40" r="20" fill="#f4f1ea" stroke="#455a64" stroke-width="4"/>
          <path d="M54 40 L66 28" stroke="#e53935" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="54" cy="40" r="3" fill="#1a1a1a"/>
        </g>
        <rect x="46" y="60" width="16" height="22" fill="url(#${id}st)"/>
        <rect x="74" y="34" width="30" height="10" rx="2" fill="url(#${id}st)"/>
        <rect x="38" y="6" width="32" height="12" rx="3" fill="url(#${id}bk)"/>
        ${nameOnly(`<text x="54" y="16" text-anchor="middle" font-size="5.5" font-weight="800" fill="#d7dde2">N₂</text>`)}`;
    },
    cutter() { return TOOL._cutter("TUBE CUTTER"); },
    "mini-cutter"() { return TOOL._cutter("MINI CUTTER"); },
    "tstat-strip"() { return TOOL._cutter("STRIPPER"); },
    _cutter(label) {
      const id = uid();
      return `${pal(id)}${ground(60,85,36)}
        <g filter="url(#${id}sh)">
          <circle cx="44" cy="44" r="24" fill="none" stroke="#e53935" stroke-width="9"/>
          <circle cx="44" cy="22" r="7" fill="#cfd8dc" stroke="#455a64" stroke-width="1.6"/>
          <rect x="66" y="38" width="44" height="12" rx="5" fill="#e53935"/>
          ${shine(72,40,16,4,2,.3)}
        </g>
        <rect x="6" y="40" width="70" height="8" rx="2" fill="url(#${id}cu)" opacity=".85"/>
        ${nameOnly(`<text x="70" y="16" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">${label}</text>`)}`;
    },
    multimeter() { return TOOL._meter("24.1 V"); },
    _meter(readout) {
      const id = uid();
      return `${pal(id)}${ground(60,86,24)}
        <g filter="url(#${id}sh)">
          <rect x="32" y="10" width="56" height="68" rx="6" fill="#2a2f34" stroke="#111" stroke-width="1"/>
          <rect x="32" y="10" width="8" height="68" rx="2" fill="url(#${id}yl)"/>
          <rect x="44" y="18" width="38" height="24" rx="2" fill="#102018"/>
        </g>
        <text x="63" y="35" text-anchor="middle" font-size="10" font-weight="800" fill="#7CF0A0">${readout}</text>
        <circle cx="50" cy="52" r="6" fill="#455a64"/><circle cx="50" cy="52" r="2.4" fill="#cfd8dc"/>
        <circle cx="70" cy="52" r="6" fill="#455a64"/><circle cx="70" cy="52" r="2.4" fill="#cfd8dc"/>
        <rect x="46" y="64" width="8" height="8" rx="1" fill="#c62828"/>
        <rect x="66" y="64" width="8" height="8" rx="1" fill="#000"/>
        <path d="M50 72 L22 86" stroke="#c62828" stroke-width="1.6"/>
        <path d="M70 72 L98 86" stroke="#111" stroke-width="1.6"/>`;
    },
    "clamp-meter"() {
      const id = uid();
      return `${pal(id)}${ground(60,86,24)}
        <!-- open C-clamp jaw with a visible gap on the left -->
        <path d="M50 34 L50 14 C50 4 86 4 86 22 L86 34" fill="none" stroke="url(#${id}st)" stroke-width="8" stroke-linecap="round"/>
        <path d="M56 34 L56 16 C56 10 80 10 80 22 L80 34" fill="none" stroke="#1a1f24" stroke-width="3"/>
        <path d="M44 34 C28 28 24 8 44 8" fill="none" stroke="url(#${id}st)" stroke-width="8" stroke-linecap="round"/>
        <g filter="url(#${id}sh)">
          <rect x="36" y="32" width="48" height="50" rx="6" fill="#2a2f34" stroke="#111" stroke-width="1"/>
          <rect x="36" y="32" width="8" height="50" rx="2" fill="url(#${id}yl)"/>
          <rect x="48" y="40" width="30" height="20" rx="2" fill="#102018"/>
        </g>
        <text x="63" y="54" text-anchor="middle" font-size="9" font-weight="800" fill="#7CF0A0">12.4 A</text>
        <rect x="54" y="66" width="16" height="8" rx="2" fill="#f9a825"/>
        <circle cx="62" cy="74" r="3" fill="#455a64"/>`;
    },
    thermometers() { return TOOL._probe("TEMP"); },
    psychrometer() { return TOOL._probe("WBT / DBT"); },
    "static-probe"() { return TOOL._probe("STATIC"); },
    _probe(label) {
      const id = uid();
      return `${pal(id)}${ground(50,85,24)}
        <g filter="url(#${id}sh)">
          <rect x="22" y="28" width="40" height="52" rx="8" fill="#26a69a" stroke="#00695c" stroke-width=".8"/>
          <rect x="28" y="36" width="28" height="16" rx="2" fill="#e0f2f1"/>
        </g>
        <text x="42" y="48" text-anchor="middle" font-size="6" font-weight="800" fill="#004d40">72.4°</text>
        <path d="M62 54 L110 28" stroke="#90a4ae" stroke-width="4" stroke-linecap="round"/>
        <circle cx="110" cy="28" r="4.5" fill="#e53935"/>
        ${nameOnly(`<text x="42" y="16" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">${label}</text>`)}`;
    },
    anemometer() {
      const id = uid();
      return `${pal(id)}${ground(60,85,26)}
        <g filter="url(#${id}sh)">
          <circle cx="60" cy="38" r="28" fill="#e0f2f1" stroke="#00897b" stroke-width="4"/>
        </g>
        <ellipse cx="60" cy="22" rx="7" ry="14" fill="#26a69a" transform="rotate(0 60 38)"/>
        <ellipse cx="60" cy="22" rx="7" ry="14" fill="#26a69a" transform="rotate(120 60 38)"/>
        <ellipse cx="60" cy="22" rx="7" ry="14" fill="#26a69a" transform="rotate(240 60 38)"/>
        <circle cx="60" cy="38" r="4" fill="#004d40"/>
        <rect x="55" y="66" width="10" height="18" rx="2" fill="#455a64"/>
        ${nameOnly(`<text x="60" y="88" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">ANEMOMETER</text>`)}`;
    },
    "svc-wrench"() { return TOOL._wrench("SERVICE"); },
    "hex-set"() { return TOOL._wrench("HEX KEYS"); },
    "nut-drivers"() { return TOOL._wrench("NUT DRIVER"); },
    _wrench(label) {
      const id = uid();
      return `${pal(id)}${ground(60,85,36)}
        <path d="M18 72 L74 22" stroke="url(#${id}sth)" stroke-width="12" stroke-linecap="round"/>
        <path d="M22 68 L72 24" stroke="#fff" stroke-width="1.8" opacity=".25" stroke-linecap="round"/>
        <g filter="url(#${id}sh)">
          <circle cx="84" cy="16" r="14" fill="url(#${id}st)" stroke="#2a3136" stroke-width=".7"/>
          <rect x="78" y="4" width="12" height="12" rx="1" fill="#1c2228"/>
        </g>
        ${nameOnly(`<text x="60" y="88" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">${label}</text>`)}`;
    },
    "duct-crimper"() { return TOOL._snips("DUCT CRIMPER"); },
    snips() { return TOOL._snips("SNIPS"); },
    _snips(label) {
      const id = uid();
      return `${pal(id)}${ground(60,85,32)}
        <path d="M28 14 L64 50 L32 86" stroke="#e53935" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M92 14 L56 50 L88 86" stroke="#43a047" stroke-width="9" fill="none" stroke-linecap="round"/>
        <circle cx="60" cy="50" r="5.5" fill="#263238" stroke="#cfd8dc" stroke-width=".8"/>
        ${nameOnly(`<text x="60" y="16" text-anchor="middle" font-size="5.5" font-weight="800" fill="#e8dcc0">${label}</text>`)}`;
    }
  };

  // aliases already defined as own keys

  /* Photoreal studio set (img/illust/*.webp). Photos have no item-name typography,
     so identify games stay unlabeled even when callers forget { labels: false }.
     Lessons and catalogs print the name beside the art in HTML. SVG remains the fallback. */
  const PHOTOS = new Set([
    "compressor","condenser","evaporator","txv","piston","eev","reversing","drier","accumulator","contactor","capacitor","thermostat",
    "gauge-analog","gauge-digital","hoses","core-tool","schrader-tool","vacuum-pump","micron","recovery","cylinder","scale",
    "leak-electronic","leak-ultrasonic","bubbles","uv-dye","n2-regulator","flaring","swaging","cutter","mini-cutter","bender","deburr",
    "torch-oxy","torch-air","torch-map","pinch-off","piercing","clamp-meter","multimeter","manometer","combustion","co-detector",
    "thermometers","psychrometer","anemometer","static-probe","fin-comb","coil-sprayer","condensate-vac","svc-wrench","hex-set",
    "nut-drivers","crimper","press-tool","duct-crimper","snips","staple-gun","tstat-strip"
  ]);
  const photoTag = id => `<img class="comp-svg comp-photo" alt="" src="img/illust/${id}.webp" width="512" height="512" decoding="async">`;

  const labeled = opts => !(opts && opts.labels === false);
  const svgComp = (id, opts) => withLabels(labeled(opts), () => svg((COMP[id] || (() => ""))()));
  window.compSVG = (id, opts) => PHOTOS.has(id) ? photoTag(id) : svgComp(id, opts);
  window.toolSVG = (id, opts) => {
    if (PHOTOS.has(id)) return photoTag(id);
    return withLabels(labeled(opts), () => {
      const fn = TOOL[id];
      if (fn) return svg(fn());
      const t = (window.TOOLS || []).find(x => x.id === id);
      const g = t && t.g;
      if (!fn && !TOOL[g]) {
        const idu = uid();
        return svg(`${pal(idu)}${ground()}`);
      }
      return svg((TOOL[g] || fn)());
    });
  };
})();
