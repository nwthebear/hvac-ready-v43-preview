/* Textbook-accurate SVG diagrams: component icons + animated refrigeration cycle.
   Original artwork. data-part ids stay compressor / condenser / metering / evaporator. */
(function () {
  let n = 0;
  const uid = p => p + (++n);
  const svg = (inner, vb = "0 0 120 90") => `<svg viewBox="${vb}" class="comp-svg" role="img">${inner}</svg>`;

  function defs(id, extras = "") {
    return `<defs>
      <linearGradient id="${id}steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa3ab"/><stop offset=".45" stop-color="#5d6770"/><stop offset="1" stop-color="#2d343a"/></linearGradient>
      <linearGradient id="${id}brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0c989"/><stop offset=".5" stop-color="#b87333"/><stop offset="1" stop-color="#7a4a1a"/></linearGradient>
      <linearGradient id="${id}cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0a46a"/><stop offset="1" stop-color="#8d4e1f"/></linearGradient>
      <linearGradient id="${id}alu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d7e0e8"/><stop offset="1" stop-color="#8a969e"/></linearGradient>
      <linearGradient id="${id}dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5560"/><stop offset="1" stop-color="#1c2228"/></linearGradient>
      <radialGradient id="${id}dome" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#c5cdd3"/><stop offset=".55" stop-color="#5a646c"/><stop offset="1" stop-color="#2a3136"/></radialGradient>
      ${extras}
    </defs>`;
  }

  const ICONS = {
    compressor(id) {
      return `${defs(id)}
        <ellipse cx="60" cy="84" rx="28" ry="4" fill="#000" opacity=".22"/>
        <rect x="38" y="78" width="16" height="6" rx="1" fill="url(#${id}dk)"/>
        <rect x="66" y="78" width="16" height="6" rx="1" fill="url(#${id}dk)"/>
        <rect x="40" y="28" width="40" height="52" rx="6" fill="url(#${id}steel)" stroke="#1c2228" stroke-width="1.2"/>
        <ellipse cx="60" cy="28" rx="20" ry="10" fill="url(#${id}dome)" stroke="#1c2228" stroke-width="1.2"/>
        <ellipse cx="60" cy="24" rx="10" ry="3.5" fill="#cfd6db" opacity=".7"/>
        <rect x="44" y="44" width="18" height="14" rx="2" fill="url(#${id}dk)" stroke="#111" stroke-width=".6"/>
        <circle cx="49" cy="51" r="1.6" fill="#cfd6db"/><circle cx="55" cy="51" r="1.6" fill="#cfd6db"/><circle cx="61" cy="51" r="1.6" fill="#cfd6db"/>
        <text x="53" y="70" font-size="5.5" text-anchor="middle" fill="#d7dde2" font-weight="700">HERM</text>
        <rect x="18" y="58" width="22" height="7" rx="1.5" fill="url(#${id}cu)"/>
        <rect x="16" y="56" width="6" height="11" rx="1" fill="#2a2a2a"/>
        <rect x="80" y="36" width="22" height="5" rx="1" fill="url(#${id}cu)"/>
        <text x="22" y="54" font-size="5" fill="#89c4e8" font-weight="700">SUCT</text>
        <text x="86" y="32" font-size="5" fill="#f0a070" font-weight="700">DISCH</text>`;
    },
    condenser(id) {
      return `${defs(id, `<linearGradient id="${id}hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb074"/><stop offset="1" stop-color="#e8592a"/></linearGradient>`)}
        <rect x="18" y="78" width="84" height="6" rx="1" fill="#6d7378"/>
        <rect x="20" y="22" width="80" height="58" rx="3" fill="url(#${id}dk)" stroke="#1a1f24" stroke-width="1.4"/>
        ${Array.from({length: 14}, (_, i) => `<rect x="${24+i*5.2}" y="26" width="2.6" height="48" fill="#9aa7b0"/>`).join("")}
        <rect x="22" y="26" width="76" height="48" fill="url(#${id}hot)" opacity=".28"/>
        <circle cx="60" cy="22" r="16" fill="none" stroke="#3a434c" stroke-width="3"/>
        <circle cx="60" cy="22" r="13" fill="#1c2228"/>
        ${[0,1,2].map(i => `<ellipse cx="60" cy="13" rx="3.2" ry="9" fill="#c5cdd3" transform="rotate(${i*120} 60 22)"/>`).join("")}
        <circle cx="60" cy="22" r="2.4" fill="#88929a"/>
        <rect x="86" y="48" width="8" height="6" rx="1" fill="url(#${id}cu)"/>
        <rect x="86" y="58" width="10" height="7" rx="1" fill="#1a1a1a"/>`;
    },
    evaporator(id) {
      return `${defs(id, `<linearGradient id="${id}cold" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7ad0f0"/><stop offset="1" stop-color="#e8f7fc"/></linearGradient>`)}
        <rect x="18" y="78" width="84" height="6" rx="1" fill="#8a9197"/>
        <path d="M24 78 L60 18 L96 78" fill="none" stroke="#4a5560" stroke-width="3.2" stroke-linejoin="round"/>
        ${[0,1,2,3,4,5,6].map(i => { const y=72-i*7.5; const w=10+i*5.2; return `<line x1="${60-w}" y1="${y}" x2="${60+w}" y2="${y}" stroke="#7ec8e0" stroke-width="2.2"/>`; }).join("")}
        <path d="M24 78 L60 18 L96 78" fill="url(#${id}cold)" opacity=".35"/>
        <rect x="16" y="76" width="88" height="6" rx="1" fill="#b0b8be"/>
        <rect x="22" y="80" width="16" height="4" rx="1" fill="#6aa0b4"/>
        <rect x="50" y="14" width="8" height="8" rx="1" fill="url(#${id}brass)"/>`;
    },
    txv(id) {
      return `${defs(id)}
        <rect x="12" y="48" width="36" height="8" rx="2" fill="url(#${id}cu)"/>
        <rect x="72" y="48" width="36" height="10" rx="2" fill="url(#${id}cu)"/>
        <rect x="44" y="40" width="32" height="26" rx="3" fill="url(#${id}brass)" stroke="#6a3a12" stroke-width=".8"/>
        <circle cx="60" cy="28" r="13" fill="url(#${id}brass)" stroke="#6a3a12" stroke-width="1"/>
        <circle cx="60" cy="28" r="6" fill="#d7b07a"/>
        <path d="M60 15 C78 8 96 16 104 28" fill="none" stroke="url(#${id}cu)" stroke-width="2"/>
        <rect x="100" y="24" width="14" height="22" rx="4" fill="url(#${id}cu)" stroke="#6a3a12" stroke-width=".6"/>
        <text x="107" y="37" font-size="5" text-anchor="middle" fill="#3a220c" font-weight="700">BULB</text>
        <path d="M72 58 L92 70 L108 70" fill="none" stroke="#8d4e1f" stroke-width="1.6"/>
        <text x="60" y="57" font-size="7" text-anchor="middle" fill="#3a220c" font-weight="800">TXV</text>`;
    },
    piston(id) {
      return `${defs(id)}
        <rect x="8" y="40" width="104" height="12" rx="3" fill="url(#${id}cu)"/>
        <rect x="46" y="32" width="28" height="28" rx="4" fill="url(#${id}brass)" stroke="#6a3a12" stroke-width=".8"/>
        <circle cx="60" cy="46" r="6" fill="#2a2420"/><circle cx="60" cy="46" r="2.4" fill="#e8c896"/>
        <text x="60" y="72" font-size="7" text-anchor="middle" fill="#8d6e4a" font-weight="700">ORIFICE</text>`;
    },
    eev(id) {
      return `${defs(id)}
        <rect x="8" y="56" width="104" height="10" rx="2" fill="url(#${id}cu)"/>
        <rect x="46" y="48" width="28" height="26" rx="3" fill="url(#${id}brass)"/>
        <rect x="42" y="16" width="36" height="34" rx="5" fill="url(#${id}dk)" stroke="#111" stroke-width=".8"/>
        <rect x="56" y="6" width="8" height="12" rx="1" fill="#f0c040"/>
        <path d="M64 8 C86 4 100 16 108 22" fill="none" stroke="#e53935" stroke-width="2.4"/>
        <text x="60" y="36" font-size="8" text-anchor="middle" fill="#e8eef2" font-weight="800">EEV</text>`;
    },
    reversing(id) {
      return `${defs(id)}
        <rect x="22" y="34" width="76" height="26" rx="12" fill="url(#${id}brass)" stroke="#6a3a12" stroke-width="1"/>
        <rect x="30" y="60" width="8" height="20" fill="url(#${id}cu)"/>
        <rect x="56" y="60" width="8" height="20" fill="url(#${id}cu)"/>
        <rect x="82" y="60" width="8" height="20" fill="url(#${id}cu)"/>
        <rect x="56" y="10" width="8" height="24" fill="url(#${id}cu)"/>
        <rect x="26" y="20" width="22" height="16" rx="3" fill="url(#${id}dk)"/>
        <text x="37" y="31" font-size="6" text-anchor="middle" fill="#d7dde2" font-weight="700">SOL</text>
        <text x="60" y="50" font-size="7" text-anchor="middle" fill="#3a220c" font-weight="800">REV</text>`;
    },
    drier(id) {
      return `${defs(id)}
        <rect x="10" y="42" width="22" height="8" rx="2" fill="url(#${id}cu)"/>
        <rect x="88" y="42" width="22" height="8" rx="2" fill="url(#${id}cu)"/>
        <rect x="30" y="30" width="60" height="32" rx="12" fill="url(#${id}dk)" stroke="#1a1f24" stroke-width="1"/>
        <rect x="30" y="30" width="18" height="32" rx="12" fill="#1565c0" opacity=".9"/>
        <path d="M68 46 L80 46 M76 41 L84 46 L76 51" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <text x="52" y="72" font-size="6.5" text-anchor="middle" fill="#8ab4d8" font-weight="700">LIQ →</text>`;
    },
    accumulator(id) {
      return `${defs(id)}
        <rect x="40" y="16" width="40" height="64" rx="18" fill="url(#${id}steel)" stroke="#1c2228" stroke-width="1.2"/>
        <rect x="48" y="6" width="8" height="16" fill="url(#${id}cu)"/>
        <rect x="64" y="6" width="8" height="16" fill="url(#${id}cu)"/>
        <ellipse cx="60" cy="22" rx="14" ry="5" fill="#000" opacity=".15"/>
        <text x="60" y="50" font-size="6" text-anchor="middle" fill="#d7dde2" font-weight="700">ACCUM</text>`;
    },
    contactor(id) {
      return `${defs(id)}
        <rect x="28" y="10" width="64" height="72" rx="4" fill="#eceff1" stroke="#37474f" stroke-width="1.6"/>
        <rect x="36" y="32" width="48" height="24" rx="2" fill="#f5c400" stroke="#b8860b" stroke-width=".6"/>
        <text x="60" y="47" font-size="7" text-anchor="middle" fill="#3a2a00" font-weight="800">24V</text>
        ${[42,60,78].map(x=>`<circle cx="${x}" cy="20" r="3.6" fill="#90a4ae" stroke="#455a64" stroke-width=".6"/><circle cx="${x}" cy="70" r="3.6" fill="#90a4ae" stroke="#455a64" stroke-width=".6"/>`).join("")}
        <text x="60" y="62" font-size="5.5" text-anchor="middle" fill="#546e7a" font-weight="700">L1  L2  T</text>`;
    },
    capacitor(id) {
      return `${defs(id)}
        <rect x="36" y="22" width="48" height="60" rx="9" fill="url(#${id}steel)" stroke="#1c2228" stroke-width="1"/>
        <ellipse cx="60" cy="22" rx="24" ry="8" fill="#c5cdd3" stroke="#1c2228" stroke-width="1"/>
        <text x="60" y="26" font-size="5.5" text-anchor="middle" fill="#212121" font-weight="700">HERM  C  FAN</text>
        <rect x="44" y="42" width="32" height="22" rx="2" fill="#f4f6f8"/>
        <text x="60" y="56" font-size="8" text-anchor="middle" fill="#212121" font-weight="800">45/5µF</text>
        <circle cx="48" cy="74" r="2.2" fill="#c62828"/><circle cx="60" cy="74" r="2.2" fill="#1565c0"/><circle cx="72" cy="74" r="2.2" fill="#f9a825"/>`;
    },
    thermostat(id) {
      return `${defs(id)}
        <rect x="26" y="10" width="68" height="72" rx="10" fill="#f6f4ef" stroke="#4a5560" stroke-width="1.6"/>
        <rect x="34" y="20" width="52" height="30" rx="4" fill="#1a1f24"/>
        <text x="60" y="40" font-size="14" text-anchor="middle" fill="#4fc3f7" font-weight="800">72°</text>
        <circle cx="46" cy="66" r="6" fill="#eceff1" stroke="#78909c" stroke-width="1.2"/>
        <circle cx="74" cy="66" r="6" fill="#eceff1" stroke="#78909c" stroke-width="1.2"/>
        <text x="46" y="69" font-size="7" text-anchor="middle" fill="#455a64">−</text>
        <text x="74" y="69" font-size="7" text-anchor="middle" fill="#455a64">+</text>
        <text x="60" y="58" font-size="5.5" text-anchor="middle" fill="#78909c" font-weight="700">HEAT / COOL</text>`;
    }
  };

  window.compSVG = id => {
    const fn = ICONS[id];
    return svg(fn ? fn(uid("c")) : "");
  };

  /* ---- Animated, textbook refrigeration cycle ---- */
  window.cycleSVG = function (labels, opts = {}) {
    const L = labels || {};
    const id = uid("cyc");
    const anim = !!opts.animate;
    /* Flow path around the plant, clockwise from compressor discharge:
       compressor top → condenser → drier/TXV → evaporator → suction → compressor */
    const flow = "M70 118 C70 70 70 58 132 52 C190 46 250 48 268 70 C280 88 280 150 270 176 C250 210 200 228 150 230 C100 232 62 210 58 170 C54 140 58 132 70 118";
    return `<svg viewBox="0 0 408 300" class="cycle-svg ${anim ? "animate" : ""}" role="img" aria-label="Refrigeration cycle">
      <defs>
        <linearGradient id="${id}hot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8a3d"/><stop offset="1" stop-color="#ffd08a"/></linearGradient>
        <linearGradient id="${id}cold" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#2aa8d6"/><stop offset="1" stop-color="#9be7ff"/></linearGradient>
        <linearGradient id="${id}cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0a46a"/><stop offset="1" stop-color="#8d4e1f"/></linearGradient>
        <linearGradient id="${id}steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa3ab"/><stop offset="1" stop-color="#3a434c"/></linearGradient>
        <linearGradient id="${id}brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0c989"/><stop offset="1" stop-color="#7a4a1a"/></linearGradient>
        <filter id="${id}glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <!-- high / low bands -->
      <rect x="8" y="8" width="384" height="128" rx="14" fill="#ff8a3d" opacity=".06"/>
      <rect x="8" y="164" width="384" height="128" rx="14" fill="#2aa8d6" opacity=".07"/>
      <text x="200" y="22" text-anchor="middle" class="ps">${L.high || "HIGH SIDE  ·  high pressure"}</text>
      <text x="200" y="284" text-anchor="middle" class="ps">${L.low || "LOW SIDE  ·  low pressure"}</text>

      <!-- pipes: discharge (hot, small), liquid (copper, small), suction (insulated, large) -->
      <path d="M86 100 C86 58 140 44 220 44 C260 44 290 58 300 86" fill="none" stroke="url(#${id}hot)" stroke-width="5" stroke-linecap="round"/>
      <path d="M314 118 C314 160 300 176 250 176 C220 176 200 176 188 176" fill="none" stroke="url(#${id}cu)" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M150 210 C90 210 62 200 58 168 C54 140 62 128 78 128" fill="none" stroke="#1a1a1a" stroke-width="10" stroke-linecap="round"/>
      <path d="M150 210 C90 210 62 200 58 168 C54 140 62 128 78 128" fill="none" stroke="#4fc3f7" stroke-width="4" stroke-linecap="round" opacity=".55"/>

      ${anim ? [0,1,2,3,4,5,6,7].map(i => `<circle r="4.2" fill="${i%2?"#fff6e8":"#e8f7ff"}" stroke="#1d2433" stroke-width="1.1" filter="url(#${id}glow)"><animateMotion dur="7.5s" begin="-${i*0.94}s" repeatCount="indefinite" path="${flow}"/></circle>`).join("") : ""}

      <!-- CONDENSER (outdoor unit, top right) -->
      <g data-part="condenser" class="part">
        <rect x="200" y="28" width="140" height="78" rx="6" fill="url(#${id}steel)" stroke="#2a3136" stroke-width="1.4"/>
        ${Array.from({length: 16}, (_, i) => `<rect x="${208+i*8}" y="36" width="3.2" height="54" fill="#c5a080" opacity=".85"/>`).join("")}
        <rect x="206" y="36" width="128" height="54" fill="url(#${id}hot)" opacity=".25"/>
        <circle cx="270" cy="36" r="16" fill="#1c2228" stroke="#4a5560" stroke-width="2.4"/>
        ${[0,1,2].map(i => `<ellipse cx="270" cy="27" rx="3.4" ry="9" fill="#c5cdd3" transform="rotate(${i*120} 270 36)"/>`).join("")}
        <circle cx="270" cy="36" r="2.6" fill="#9aa3ab"/>
        <text x="270" y="84" text-anchor="middle" class="pl light">${L.condenser || "Condenser"}</text>
        <text x="270" y="96" text-anchor="middle" class="ps light">${L.condenserSub || "rejects heat  ·  vapor → liquid"}</text>
      </g>

      <!-- COMPRESSOR (hermetic can, left) -->
      <g data-part="compressor" class="part">
        <ellipse cx="70" cy="168" rx="28" ry="5" fill="#000" opacity=".2"/>
        <rect x="48" y="108" width="44" height="58" rx="8" fill="url(#${id}steel)" stroke="#1c2228" stroke-width="1.3"/>
        <ellipse cx="70" cy="108" rx="22" ry="11" fill="url(#${id}steel)" stroke="#1c2228" stroke-width="1.3"/>
        <ellipse cx="70" cy="104" rx="10" ry="3.4" fill="#cfd6db" opacity=".65"/>
        <rect x="52" y="128" width="16" height="12" rx="1.5" fill="#2a3136"/>
        <text x="70" y="150" text-anchor="middle" class="pl light" style="font-size:10px">${L.compressor || "Compressor"}</text>
      </g>

      <!-- Filter drier + TXV (metering) on the right -->
      <g data-part="metering" class="part">
        <rect x="300" y="128" width="22" height="14" rx="6" fill="#1565c0" stroke="#0d47a1" stroke-width=".8"/>
        <text x="296" y="138" text-anchor="end" class="ps">drier</text>
        <rect x="248" y="160" width="36" height="28" rx="4" fill="url(#${id}brass)" stroke="#6a3a12" stroke-width="1"/>
        <circle cx="266" cy="154" r="10" fill="url(#${id}brass)" stroke="#6a3a12" stroke-width="1"/>
        <path d="M266 144 C286 132 300 150 308 168" fill="none" stroke="url(#${id}cu)" stroke-width="1.8"/>
        <rect x="304" y="164" width="12" height="18" rx="4" fill="url(#${id}cu)"/>
        <text x="266" y="178" text-anchor="middle" class="pl light" style="font-size:10px">${L.metering || "TXV"}</text>
        <text x="248" y="204" text-anchor="start" class="ps">${L.meteringSub || "drops pressure"}</text>
      </g>

      <!-- EVAPORATOR A-coil (bottom) -->
      <g data-part="evaporator" class="part">
        <rect x="118" y="188" width="120" height="58" rx="6" fill="#2a3a44" stroke="#1c2228" stroke-width="1.2"/>
        <path d="M130 238 L178 198 L226 238" fill="none" stroke="#7ec8e0" stroke-width="3.2"/>
        ${[0,1,2,3,4].map(i => `<line x1="${140+i*6}" y1="${232-i*7}" x2="${216-i*6}" y2="${232-i*7}" stroke="#9be7ff" stroke-width="1.8"/>`).join("")}
        <rect x="122" y="236" width="112" height="6" rx="1" fill="#8aa0ac"/>
        <text x="178" y="226" text-anchor="middle" class="pl light">${L.evaporator || "Evaporator"}</text>
        <text x="178" y="248" text-anchor="middle" class="ps light">${L.evaporatorSub || "absorbs heat  ·  liquid → vapor"}</text>
      </g>

      <!-- state callouts -->
      <text x="150" y="38" class="state hot">hot gas</text>
      <text x="384" y="108" class="state liq" transform="rotate(90 384 108)">high-pressure liquid</text>
      <text x="188" y="168" class="state mix">two-phase</text>
      <text x="28" y="200" class="state vap">suction vapor</text>
    </svg>`;
  };
})();
