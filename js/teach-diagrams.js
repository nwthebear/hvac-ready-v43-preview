/* Detailed, animated lesson diagrams (SVG + CSS). One visual per step. */
(function () {
  const V = window.TeachViz = window.TeachViz || {};
  const reduced = () => !!(window.App && App.reduced && App.reduced());

  V.svg = (name, es) => {
    const fn = V[name];
    if (!fn) return "";
    return `<div class="teach-viz" data-viz="${name}">${fn(!!es)}</div>`;
  };

  V.heat = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "El calor siempre va de lo caliente a lo frío", c: "Conducción", v: "Convección", r: "Radiación",
          cp1: "La sartén calienta", cp2: "el agua por contacto",
          vp1: "El aire caliente sube", vp2: "y se lleva el calor",
          rp1: "El sol calienta", rp2: "sin tocar" }
      : { t: "Heat always moves from hot to cold", c: "Conduction", v: "Convection", r: "Radiation",
          cp1: "The pan heats the", cp2: "water by touch",
          vp1: "Warm air rises and", vp2: "carries heat away",
          rp1: "The sun warms you", rp2: "without touching" };
    return `<svg viewBox="0 0 720 420" role="img" aria-label="${L.t}">
      <defs>
        <linearGradient id="thSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#243044"/><stop offset="1" stop-color="#15181e"/></linearGradient>
        <linearGradient id="thPan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8e96"/><stop offset="1" stop-color="#3a3d44"/></linearGradient>
        <style>
          .th-wrap { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
          .th-title { fill: #E9E1CF; font-size: 22px; font-weight: 700; }
          .th-h { fill: #FF9442; font-size: 24px; font-weight: 800; letter-spacing: .04em; }
          .th-p { fill: #C9BBA4; font-size: 20px; }
          ${a ? `
          @keyframes thBoil { 50% { transform: translateY(-3px); } }
          @keyframes thRise { 0% { transform: translateY(18px); opacity: 0; } 30% { opacity: .9; } 100% { transform: translateY(-32px); opacity: 0; } }
          @keyframes thRay { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
          .th-steam { animation: thBoil 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          .th-b1 { animation: thRise 2.4s ease-out infinite; }
          .th-b2 { animation: thRise 2.4s ease-out .8s infinite; }
          .th-b3 { animation: thRise 2.4s ease-out 1.4s infinite; }
          .th-ray { animation: thRay 2.2s ease-in-out infinite; }
          ` : ""}
        </style>
      </defs>
      <rect width="720" height="420" rx="16" fill="url(#thSky)"/>
      <text class="th-title" x="28" y="32">${L.t}</text>
      <!-- conduction -->
      <g transform="translate(24,56)">
        <rect width="216" height="340" rx="14" fill="#1a1e26"/>
        <text class="th-h" x="108" y="28" text-anchor="middle">${L.c}</text>
        <ellipse cx="108" cy="250" rx="58" ry="11" fill="#000" opacity=".35"/>
        <rect x="48" y="214" width="120" height="16" rx="3" fill="url(#thPan)"/>
        <path d="M48 214c0-26 26-44 60-44s60 18 60 44" fill="#4a8fb0"/>
        <path class="th-steam" d="M84 172c0-12 9-12 9-24" fill="none" stroke="#cfe8f4" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <path class="th-steam" d="M108 164c0-14 9-14 9-26" fill="none" stroke="#cfe8f4" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <path class="th-steam" d="M132 172c0-12 9-12 9-24" fill="none" stroke="#cfe8f4" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <path d="M70 230 l8 20 M90 230 l4 22 M108 228 l0 24 M126 230 l-4 22 M146 230 l-8 20" stroke="#FF9442" stroke-width="3" stroke-linecap="round" opacity=".85"/>
        <text class="th-p" x="108" y="292" text-anchor="middle">${L.cp1}</text>
        <text class="th-p" x="108" y="314" text-anchor="middle">${L.cp2}</text>
      </g>
      <!-- convection -->
      <g transform="translate(252,56)">
        <rect width="216" height="340" rx="14" fill="#1a1e26"/>
        <text class="th-h" x="108" y="28" text-anchor="middle">${L.v}</text>
        <rect x="58" y="70" width="100" height="150" rx="8" fill="#222833" stroke="#5a6474"/>
        <path d="M78 200 C88 150 88 120 108 90 C128 120 128 150 138 200" fill="none" stroke="#FF9442" stroke-width="2.5" opacity=".7"/>
        <circle class="th-b1" cx="96" cy="180" r="6" fill="#FF9442" opacity=".85"/>
        <circle class="th-b2" cx="108" cy="170" r="5" fill="#FFB347" opacity=".85"/>
        <circle class="th-b3" cx="122" cy="184" r="6" fill="#FF9442" opacity=".85"/>
        <text class="th-p" x="108" y="292" text-anchor="middle">${L.vp1}</text>
        <text class="th-p" x="108" y="314" text-anchor="middle">${L.vp2}</text>
      </g>
      <!-- radiation -->
      <g transform="translate(480,56)">
        <rect width="216" height="340" rx="14" fill="#1a1e26"/>
        <text class="th-h" x="108" y="28" text-anchor="middle">${L.r}</text>
        <circle cx="108" cy="150" r="28" fill="#F2C14A"/>
        <g class="th-ray" stroke="#F2C14A" stroke-width="3" stroke-linecap="round">
          <path d="M108 104v-18M108 196v18M62 150h-18M172 150h18M75 117l-14-14M141 183l14 14M141 117l14-14M75 183l-14 14"/>
        </g>
        <text class="th-p" x="108" y="292" text-anchor="middle">${L.rp1}</text>
        <text class="th-p" x="108" y="314" text-anchor="middle">${L.rp2}</text>
      </g>
    </svg>`;
  };

  V.cycle = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "El ciclo: absorber calor adentro, rechazarlo afuera",
          hi: "LADO DE ALTA", lo: "LADO DE BAJA",
          co: "Compresor", cd: "Condensador", cd2: "(afuera)",
          tx: "Dispositivo de", tx2: "expansión",
          ev: "Evaporador", ev2: "(adentro)",
          hot: "Vapor caliente", hot2: "a alta presión",
          liq: "Líquido tibio", liq2: "a alta presión",
          mix: "Mezcla fría", mix2: "a baja presión",
          vap: "Vapor frío", vap2: "a baja presión" }
      : { t: "The cycle: soak up heat indoors, dump it outdoors",
          hi: "HIGH SIDE", lo: "LOW SIDE",
          co: "Compressor", cd: "Condenser", cd2: "(outside)",
          tx: "Metering", tx2: "device",
          ev: "Evaporator", ev2: "(inside)",
          hot: "Hot high-pressure", hot2: "vapor",
          liq: "Warm high-pressure", liq2: "liquid",
          mix: "Cold low-pressure", mix2: "mix",
          vap: "Cool low-pressure", vap2: "vapor" };
    const motion = (path, color, delay, dur) => a
      ? `<circle r="6" fill="${color}" opacity="0.95">
          <animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" path="${path}"/>
        </circle>
        <circle r="6" fill="${color}" opacity="0.95">
          <animateMotion dur="${dur}s" begin="${(delay + dur/2).toFixed(2)}s" repeatCount="indefinite" path="${path}"/>
        </circle>`
      : "";
    /* Clockwise: evap (TL) → compressor (TR) → condenser (BR) → metering (BL) → evap.
       Boxes 160x150 with labels inside the bottom: evap (70,100), comp (490,100),
       cond (490,390), meter (70,390). Pipe midlines: y=165 and y=465; x=150 and x=570.
    */
    const pTop = "M230 172 H490";
    const pRight = "M570 250 V390";
    const pBot = "M490 465 H230";
    const pLeft = "M150 390 V250";
    return `<svg viewBox="0 0 720 620" role="img" aria-label="${L.t}">
      <defs>
        <linearGradient id="cyBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a222c"/><stop offset="1" stop-color="#12151a"/></linearGradient>
        <marker id="cyArrC" viewBox="0 0 10 8" refX="8" refY="4" markerWidth="6" markerHeight="5" orient="auto"><path d="M0 0 L10 4 L0 8 Z" fill="#5FB8DC"/></marker>
        <marker id="cyArrH" viewBox="0 0 10 8" refX="8" refY="4" markerWidth="6" markerHeight="5" orient="auto"><path d="M0 0 L10 4 L0 8 Z" fill="#FF9442"/></marker>
        <style>
          .cy { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
          .cy-t { fill: #E9E1CF; font-size: 22px; font-weight: 700; }
          .cy-lab { fill: #F3F0E4; font-size: 24px; font-weight: 800; }
          .cy-sub { fill: #B9AE98; font-size: 20px; font-weight: 600; }
          .cy-state { fill: #E9E1CF; font-size: 22px; font-weight: 700; }
          .cy-side { font-size: 20px; font-weight: 800; letter-spacing: .1em; }
          ${a ? `
          @keyframes cySpin { to { transform: rotate(360deg); } }
          .cy-fan { animation: cySpin 3.2s linear infinite; transform-box: fill-box; transform-origin: center; }
          ` : ""}
        </style>
      </defs>
      <rect width="720" height="620" rx="16" fill="url(#cyBg)"/>
      <text class="cy-t" x="28" y="32">${L.t}</text>
      <text class="cy-side" x="80" y="62" fill="#5FB8DC">${L.lo}</text>
      <text class="cy-side" x="520" y="62" fill="#FF9442">${L.hi}</text>

      <!-- pipes (under the components' ports) -->
      <path d="${pTop}" fill="none" stroke="#5FB8DC" stroke-width="8" stroke-linecap="round" marker-end="url(#cyArrC)"/>
      <path d="${pRight}" fill="none" stroke="#FF9442" stroke-width="8" stroke-linecap="round" marker-end="url(#cyArrH)"/>
      <path d="${pBot}" fill="none" stroke="#FF9442" stroke-width="8" stroke-linecap="round" marker-end="url(#cyArrH)"/>
      <path d="${pLeft}" fill="none" stroke="#5FB8DC" stroke-width="8" stroke-linecap="round" marker-end="url(#cyArrC)"/>

      ${motion(pTop, "#7ecceb", 0, 3.2)}
      ${motion(pRight, "#FF9442", 0.4, 2.8)}
      ${motion(pBot, "#E8893A", 0.2, 3.2)}
      ${motion(pLeft, "#5FB8DC", 0.6, 2.8)}

      <!-- Evaporator (indoor coil) — top left -->
      <g transform="translate(70,100)">
        <rect width="160" height="150" rx="12" fill="#16303a" stroke="#5FB8DC" stroke-width="2"/>
        <path d="M18 16 h90 M18 32 h90 M18 48 h90 M18 64 h90 M18 80 h90" stroke="#8fd0ea" stroke-width="3" opacity=".85"/>
        <g transform="translate(130,48)"><g class="cy-fan">
          <circle r="16" fill="#1a2830" stroke="#cfe8f4" stroke-width="1.5"/>
          <path d="M0-12 Q6-2 0 0 Q-6-2 0-12 M0 12 Q6 2 0 0 Q-6 2 0 12 M-12 0 Q-2 6 0 0 Q-2-6 -12 0 M12 0 Q2 6 0 0 Q2-6 12 0" fill="#cfe8f4" opacity=".9"/>
        </g></g>
        <text class="cy-lab" x="80" y="122" text-anchor="middle">${L.ev}</text>
        <text class="cy-sub" x="80" y="138" text-anchor="middle">${L.ev2}</text>
      </g>

      <!-- Compressor — top right, its own component -->
      <g transform="translate(490,100)">
        <rect width="160" height="150" rx="12" fill="#2a2d33" stroke="#C9B48F" stroke-width="2"/>
        <ellipse cx="80" cy="64" rx="38" ry="40" fill="#1c1e22" stroke="#C9B48F" stroke-width="2"/>
        <rect x="72" y="16" width="16" height="18" rx="2" fill="#8b8579"/>
        <circle cx="80" cy="64" r="11" fill="#C9B48F"/>
        <path d="M80 64 l0 -24 M80 64 l20 12 M80 64 l-20 12" stroke="#1c1e22" stroke-width="3" stroke-linecap="round"/>
        <text class="cy-lab" x="80" y="130" text-anchor="middle">${L.co}</text>
      </g>

      <!-- Condenser (outdoor coil) — bottom right -->
      <g transform="translate(490,390)">
        <rect width="160" height="150" rx="12" fill="#3a241c" stroke="#E2574A" stroke-width="2"/>
        <path d="M18 16 h90 M18 32 h90 M18 48 h90 M18 64 h90 M18 80 h90" stroke="#FF9442" stroke-width="3" opacity=".85"/>
        <g transform="translate(134,48)"><g class="cy-fan">
          <circle r="16" fill="#2a1a14" stroke="#FFD0A8" stroke-width="1.5"/>
          <path d="M0-12 Q6-2 0 0 Q-6-2 0-12 M0 12 Q6 2 0 0 Q-6 2 0 12 M-12 0 Q-2 6 0 0 Q-2-6 -12 0 M12 0 Q2 6 0 0 Q2-6 12 0" fill="#FFD0A8" opacity=".9"/>
        </g></g>
        <text class="cy-lab" x="80" y="122" text-anchor="middle">${L.cd}</text>
        <text class="cy-sub" x="80" y="138" text-anchor="middle">${L.cd2}</text>
      </g>

      <!-- Metering device — bottom left, clearly separate from the compressor -->
      <g transform="translate(70,390)">
        <rect width="160" height="150" rx="12" fill="#2a2418" stroke="#C9B48F" stroke-width="2"/>
        <path d="M28 56 H64" stroke="#E8893A" stroke-width="8" stroke-linecap="round"/>
        <path d="M64 36 L112 56 L64 76 Z" fill="#81613C" stroke="#E8D6AA" stroke-width="2"/>
        <path d="M112 56 H134" stroke="#5FB8DC" stroke-width="8" stroke-linecap="round"/>
        <circle cx="64" cy="56" r="5" fill="#E8D6AA"/>
        <text class="cy-lab" x="80" y="122" text-anchor="middle">${L.tx}</text>
        <text class="cy-sub" x="80" y="138" text-anchor="middle">${L.tx2}</text>
      </g>

      <!-- State labels sit in the gaps, never on the pipes or component names -->
      <text class="cy-state" x="360" y="128" text-anchor="middle" fill="#9bd3ea">${L.vap}</text>
      <text class="cy-state" x="360" y="150" text-anchor="middle" fill="#9bd3ea">${L.vap2}</text>

      <text class="cy-state" x="688" y="308" text-anchor="end" fill="#FFB347">${L.hot}</text>
      <text class="cy-state" x="688" y="324" text-anchor="end" fill="#FFB347">${L.hot2}</text>

      <text class="cy-state" x="360" y="504" text-anchor="middle" fill="#FFB347">${L.liq}</text>
      <text class="cy-state" x="360" y="526" text-anchor="middle" fill="#FFB347">${L.liq2}</text>

      <text class="cy-state" x="14" y="308" fill="#9bd3ea">${L.mix}</text>
      <text class="cy-state" x="14" y="324" fill="#9bd3ea">${L.mix2}</text>
    </svg>`;
  };

  V.airflow = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "El aire entra, se trata y vuelve a las habitaciones", ret: "Retorno", fil: "Filtro", bl: "Soplador", hx: "Serpentín", cab: "Manejadora de aire", sup: "Suministro", rm: "Habitación" }
      : { t: "Air comes back, gets treated, and goes out to the rooms", ret: "Return", fil: "Filter", bl: "Blower", hx: "Coil / heat exchanger", cab: "Air handler cabinet", sup: "Supply", rm: "Room" };
    const path = "M78 200 H168 H210 H300 H410 H520 V130 H640";
    return `<svg viewBox="0 0 720 400" role="img" aria-label="${L.t}">
      <defs>
        <linearGradient id="afBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2018"/><stop offset="1" stop-color="#121510"/></linearGradient>
        <marker id="afArr" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="8" markerHeight="7" orient="auto"><path d="M0 0 L10 4 L0 8 Z" fill="#8DB255"/></marker>
        <style>
          .af-t { fill: #E9E1CF; font-size: 28px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
          .af-l { fill: #E9E1CF; font-size: 24px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
          .af-s { fill: #B9AE98; font-size: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
          ${a ? `@keyframes afSpin { to { transform: rotate(360deg); } }
          .af-fan { animation: afSpin 2.4s linear infinite; transform-box: fill-box; transform-origin: center; }` : ""}
        </style>
      </defs>
      <rect width="720" height="400" rx="16" fill="url(#afBg)"/>
      <text class="af-t" x="28" y="28">${es ? "El aire entra, se trata" : "Air comes back, gets treated,"}</text>
      <text class="af-t" x="28" y="52">${es ? "y vuelve a las habitaciones" : "and goes out to the rooms"}</text>
      <!-- return duct -->
      <path d="M20 160 h90 v80 h-90 z" fill="#2a2c28" stroke="#8b8579" stroke-width="2"/>
      <path d="M32 176 h66 M32 192 h66 M32 208 h66 M32 224 h66" stroke="#C9B48F" stroke-width="2"/>
      <text class="af-l" x="65" y="270" text-anchor="middle">${L.ret}</text>
      <!-- cabinet -->
      <rect x="130" y="108" width="310" height="196" rx="10" fill="#1c1e1a" stroke="#8b8579" stroke-width="2"/>
      <text class="af-s" x="285" y="100" text-anchor="middle">${L.cab}</text>
      <!-- filter, pleated -->
      <g transform="translate(148,124)">
        <rect width="36" height="152" rx="3" fill="#2d3826" stroke="#8DB255" stroke-width="2"/>
        <path d="M6 8 l24 12 v20 l-24 12 v20 l24 12 v20 l-24 12 v20 l24 12 v16" fill="none" stroke="#8DB255" stroke-width="1.8"/>
        <text class="af-l" x="18" y="196" text-anchor="middle">${L.fil}</text>
      </g>
      <!-- blower squirrel cage -->
      <g transform="translate(210,148)">
        <circle cx="44" cy="64" r="44" fill="#222" stroke="#C9B48F" stroke-width="2"/>
        <g class="af-fan">
          <path d="M44 28 Q58 52 44 64 Q30 52 44 28 M44 100 Q58 76 44 64 Q30 76 44 100 M8 64 Q32 50 44 64 Q32 78 8 64 M80 64 Q56 50 44 64 Q56 78 80 64" fill="#C9B48F"/>
        </g>
        <circle cx="44" cy="64" r="8" fill="#1c1e1a" stroke="#C9B48F"/>
        <text class="af-l" x="44" y="172" text-anchor="middle">${L.bl}</text>
      </g>
      <!-- coil, A-coil style slab with fins -->
      <g transform="translate(316,124)">
        <rect width="108" height="152" rx="6" fill="#1a2a32" stroke="#5FB8DC" stroke-width="2"/>
        <path d="M14 16 L54 76 L94 16" fill="none" stroke="#5FB8DC" stroke-width="3"/>
        <path d="M14 136 L54 76 L94 136" fill="none" stroke="#5FB8DC" stroke-width="3"/>
        <path d="M22 28 h24 M22 44 h24 M22 60 h20 M62 28 h24 M62 44 h24 M62 60 h20 M22 92 h20 M22 108 h24 M22 124 h24 M62 92 h20 M62 108 h24 M62 124 h24" stroke="#8fd0ea" stroke-width="2" opacity=".8"/>
        <text class="af-l" x="54" y="196" text-anchor="middle">${es ? "Serpentín" : "Coil"}</text>
      </g>
      <!-- supply duct up to a room register -->
      <path d="M440 168 h90 v-70 h150" fill="none" stroke="#8b8579" stroke-width="28" stroke-linejoin="miter" stroke-linecap="butt"/>
      <path d="M440 168 h90 v-70 h150" fill="none" stroke="#2a2c28" stroke-width="22"/>
      <g transform="translate(620,70)">
        <rect x="0" y="0" width="84" height="56" rx="4" fill="#2a2c28" stroke="#8b8579" stroke-width="2"/>
        <path d="M10 14 h64 M10 24 h64 M10 34 h64 M10 44 h64" stroke="#C9B48F" stroke-width="2"/>
        <text class="af-l" x="42" y="80" text-anchor="middle">${L.sup}</text>
      </g>
      <path d="${path}" fill="none" stroke="#8DB255" stroke-width="2" stroke-dasharray="6 8" opacity=".55" marker-end="url(#afArr)"/>
      ${a ? `
      <circle r="6" fill="#9bd3ea"><animateMotion dur="5s" repeatCount="indefinite" path="${path}"/></circle>
      <circle r="6" fill="#8DB255"><animateMotion dur="5s" begin="1.6s" repeatCount="indefinite" path="${path}"/></circle>
      <circle r="6" fill="#9bd3ea"><animateMotion dur="5s" begin="3.2s" repeatCount="indefinite" path="${path}"/></circle>
      ` : ""}
    </svg>`;
  };

  V.pt = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "Más presión, más alto el punto de ebullición", lo: "Baja presión", lo2: "hierve frío", hi: "Alta presión", hi2: "hierve caliente", pot: "Como una olla a presión" }
      : { t: "Higher pressure, higher boiling point", lo: "Low pressure", lo2: "boils cold", hi: "High pressure", hi2: "boils hot", pot: "Like a pressure cooker" };
    return `<svg viewBox="0 0 720 380" role="img" aria-label="${L.t}">
      <defs>
        <style>
          .pt-t { fill:#E9E1CF; font-size:22px; font-weight:700; font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
          .pt-l { fill:#E9E1CF; font-size:24px; font-weight:700; font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
          .pt-s { fill:#B9AE98; font-size:20px; font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
          ${a ? `@keyframes ptBub { 0%{transform:translateY(0);opacity:.9} 100%{transform:translateY(-46px);opacity:0} }
          .pt-b { animation: ptBub 1.8s ease-out infinite; transform-box: fill-box; }
          .pt-b2 { animation-delay:.6s; } .pt-b3 { animation-delay:1.1s; }` : ""}
        </style>
      </defs>
      <rect width="720" height="380" rx="16" fill="#14171c"/>
      <text class="pt-t" x="28" y="32">${L.t}</text>
      <g transform="translate(80,70)">
        <rect width="240" height="280" rx="14" fill="#1a1e26"/>
        <rect x="50" y="50" width="140" height="120" rx="8" fill="#1a2a32" stroke="#5FB8DC" stroke-width="3"/>
        <rect x="50" y="140" width="140" height="30" fill="#5FB8DC" opacity=".4"/>
        <circle class="pt-b" cx="90" cy="154" r="6" fill="#9bd3ea"/>
        <circle class="pt-b pt-b2" cx="120" cy="158" r="5" fill="#9bd3ea"/>
        <circle class="pt-b pt-b3" cx="150" cy="152" r="6" fill="#9bd3ea"/>
        <text class="pt-l" x="120" y="216" text-anchor="middle">${L.lo}</text>
        <text class="pt-s" x="120" y="236" text-anchor="middle">${L.lo2}</text>
      </g>
      <g transform="translate(400,70)">
        <rect width="240" height="280" rx="14" fill="#1a1e26"/>
        <path d="M70 70 h100 a16 16 0 0 1 16 16 v90 H54 V86 a16 16 0 0 1 16-16z" fill="#2a2018" stroke="#FF9442" stroke-width="3"/>
        <path d="M100 70 v-18 h40 v18" fill="none" stroke="#FF9442" stroke-width="4" stroke-linejoin="round"/>
        <rect x="54" y="148" width="132" height="28" fill="#FF7A1A" opacity=".35"/>
        <circle class="pt-b" cx="100" cy="166" r="4" fill="#FFB347"/>
        <circle class="pt-b pt-b2" cx="130" cy="164" r="5" fill="#FFB347"/>
        <text class="pt-l" x="120" y="216" text-anchor="middle">${L.hi}</text>
        <text class="pt-s" x="120" y="236" text-anchor="middle">${L.hi2}</text>
        <text class="pt-s" x="120" y="256" text-anchor="middle">${L.pot}</text>
      </g>
    </svg>`;
  };

  V.loto = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "Corta, bloquea, etiqueta… y luego comprueba que está muerto",
          s1: "1. Abre el", s1b: "desconectador",
          s2: "2. Candado", s2b: "y etiqueta",
          s3: "3. Mide", s3b: "vivo–muerto–vivo" }
      : { t: "Kill it, lock it, tag it — then prove it's dead",
          s1: "1. Open the", s1b: "disconnect",
          s2: "2. Lock", s2b: "and tag",
          s3: "3. Meter:", s3b: "live–dead–live" };
    return `<svg viewBox="0 0 720 360" role="img" aria-label="${L.t}">
      <defs>
        <style>
          .lo-t { fill:#E9E1CF; font-size:22px; font-weight:700; font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
          .lo-l { fill:#E9E1CF; font-size:24px; font-weight:700; font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
          .lo-s { fill:#C9B48F; font-size:20px; font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
          ${a ? `@keyframes loPull { 0%,30%{transform:translateY(0)} 60%,100%{transform:translateY(28px)} }
          .lo-h { animation: loPull 3s ease-in-out infinite; transform-box: fill-box; }` : ""}
        </style>
      </defs>
      <rect width="720" height="360" rx="16" fill="#161513"/>
      <text class="lo-t" x="28" y="32">${L.t}</text>
      <g transform="translate(40,70)">
        <rect width="200" height="220" rx="14" fill="#1a1e26"/>
        <rect x="40" y="24" width="120" height="130" rx="8" fill="#2a2b2e" stroke="#8b8579"/>
        <rect class="lo-h" x="80" y="44" width="40" height="24" rx="4" fill="#E2574A"/>
        <text class="lo-l" x="100" y="186" text-anchor="middle">${L.s1}</text>
        <text class="lo-s" x="100" y="206" text-anchor="middle">${L.s1b}</text>
      </g>
      <g transform="translate(260,70)">
        <rect width="200" height="220" rx="14" fill="#1a1e26"/>
        <path d="M100 50 a28 28 0 0 1 0 56" fill="none" stroke="#D9AE48" stroke-width="9" stroke-linecap="round"/>
        <rect x="70" y="100" width="60" height="48" rx="6" fill="#D9AE48"/>
        <rect x="118" y="88" width="36" height="22" rx="3" fill="#F3F0E4"/>
        <text class="lo-l" x="100" y="186" text-anchor="middle">${L.s2}</text>
        <text class="lo-s" x="100" y="206" text-anchor="middle">${L.s2b}</text>
      </g>
      <g transform="translate(480,70)">
        <rect width="200" height="220" rx="14" fill="#1a1e26"/>
        <rect x="65" y="28" width="70" height="108" rx="8" fill="#1a1b1d" stroke="#8DB255" stroke-width="3"/>
        <path d="M86 108 h10 l8-44 8 44 h10" fill="none" stroke="#8DB255" stroke-width="3"/>
        <text class="lo-l" x="100" y="186" text-anchor="middle">${L.s3}</text>
        <text class="lo-s" x="100" y="206" text-anchor="middle">${L.s3b}</text>
      </g>
    </svg>`;
  };
})();
