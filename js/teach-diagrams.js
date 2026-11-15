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
      ? { t: "El calor siempre va de lo caliente a lo frío", c: "Conducción", v: "Convección", r: "Radiación", cp: "La sartén calienta el agua por contacto", vp: "El aire caliente sube y se lleva el calor", rp: "El sol calienta sin tocar" }
      : { t: "Heat always moves from hot to cold", c: "Conduction", v: "Convection", r: "Radiation", cp: "The pan heats the water by touch", vp: "Warm air rises and carries heat away", rp: "The sun warms you without touching" };
    return `<svg viewBox="0 0 640 340" role="img" aria-label="${L.t}">
      <defs>
        <linearGradient id="thSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#243044"/><stop offset="1" stop-color="#15181e"/></linearGradient>
        <linearGradient id="thPan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8e96"/><stop offset="1" stop-color="#3a3d44"/></linearGradient>
        <radialGradient id="thFlame" cx="50%" cy="80%" r="70%"><stop offset="0" stop-color="#FFB347"/><stop offset="1" stop-color="#E2574A" stop-opacity=".1"/></radialGradient>
        <style>
          .th-wrap { font-family: -apple-system, sans-serif; }
          .th-title { fill: #E9E1CF; font-size: 15px; font-weight: 700; }
          .th-h { fill: #FF9442; font-size: 13px; font-weight: 800; letter-spacing: .04em; }
          .th-p { fill: #B9AE98; font-size: 11px; }
          .th-wave { fill: none; stroke: #5FB8DC; stroke-width: 2; }
          .th-rise { fill: #FF9442; opacity: .85; }
          ${a ? `
          @keyframes thBoil { 50% { transform: translateY(-3px); } }
          @keyframes thRise { 0% { transform: translateY(18px); opacity: 0; } 30% { opacity: .9; } 100% { transform: translateY(-28px); opacity: 0; } }
          @keyframes thRay { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
          .th-steam { animation: thBoil 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          .th-b1 { animation: thRise 2.4s ease-out infinite; }
          .th-b2 { animation: thRise 2.4s ease-out .8s infinite; }
          .th-b3 { animation: thRise 2.4s ease-out 1.4s infinite; }
          .th-ray { animation: thRay 2.2s ease-in-out infinite; }
          ` : ""}
        </style>
      </defs>
      <rect width="640" height="340" rx="14" fill="url(#thSky)"/>
      <text class="th-title" x="24" y="28">${L.t}</text>
      <!-- conduction -->
      <g transform="translate(20,48)">
        <text class="th-h" x="10" y="18">${L.c}</text>
        <ellipse cx="90" cy="168" rx="54" ry="10" fill="#000" opacity=".35"/>
        <rect x="40" y="132" width="100" height="14" rx="3" fill="url(#thPan)"/>
        <path d="M40 132c0-22 22-38 50-38s50 16 50 38" fill="#4a8fb0"/>
        <path class="th-steam" d="M70 96c0-10 8-10 8-20" fill="none" stroke="#cfe8f4" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <path class="th-steam" d="M90 90c0-12 8-12 8-22" fill="none" stroke="#cfe8f4" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <path class="th-steam" d="M110 96c0-10 8-10 8-20" fill="none" stroke="#cfe8f4" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <rect x="36" y="146" width="108" height="10" rx="2" fill="#2a2c30"/>
        <g fill="url(#thFlame)">
          <ellipse cx="60" cy="172" rx="10" ry="16"/><ellipse cx="90" cy="174" rx="12" ry="18"/><ellipse cx="120" cy="172" rx="10" ry="16"/>
        </g>
        <text class="th-p" x="10" y="210">${L.cp}</text>
      </g>
      <!-- convection -->
      <g transform="translate(220,48)">
        <text class="th-h" x="10" y="18">${L.v}</text>
        <rect x="50" y="70" width="110" height="120" rx="8" fill="#1c222b" stroke="#3a4452"/>
        <circle class="th-b1 th-rise" cx="80" cy="150" r="6"/>
        <circle class="th-b2 th-rise" cx="105" cy="155" r="5"/>
        <circle class="th-b3 th-rise" cx="130" cy="148" r="6"/>
        <path d="M70 170c20-30 50-30 70 0" fill="none" stroke="#FF7A1A" stroke-width="2" opacity=".5"/>
        <text class="th-p" x="10" y="210">${L.vp}</text>
      </g>
      <!-- radiation -->
      <g transform="translate(430,48)">
        <text class="th-h" x="10" y="18">${L.r}</text>
        <circle cx="95" cy="110" r="22" fill="#F2C14E"/>
        <g class="th-ray" stroke="#F2C14E" stroke-width="3" stroke-linecap="round" fill="none">
          <path d="M95 74v-16M95 162v16M59 110h-16M147 110h16M70 85l-12-12M120 135l12 12M120 85l12-12M70 135l-12 12"/>
        </g>
        <text class="th-p" x="4" y="210">${L.rp}</text>
      </g>
    </svg>`;
  };

  V.cycle = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "El ciclo: absorber calor adentro, rechazarlo afuera", hi: "LADO ALTO", lo: "LADO BAJO", co: "Compresor", cd: "Condensador (afuera)", tx: "Expansión", ev: "Evaporador (adentro)", hot: "vapor caliente, alta P", liq: "líquido, alta P", mix: "mezcla fría, baja P", vap: "vapor, baja P" }
      : { t: "The cycle: soak up heat indoors, dump it outdoors", hi: "HIGH SIDE", lo: "LOW SIDE", co: "Compressor", cd: "Condenser (outside)", tx: "Metering device", ev: "Evaporator (inside)", hot: "hot vapor, high P", liq: "liquid, high P", mix: "cold mix, low P", vap: "vapor, low P" };
    return `<svg viewBox="0 0 640 400" role="img" aria-label="${L.t}">
      <defs>
        <linearGradient id="cyBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a222c"/><stop offset="1" stop-color="#12151a"/></linearGradient>
        <linearGradient id="cyHot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E2574A"/><stop offset="1" stop-color="#FF9442"/></linearGradient>
        <linearGradient id="cyCold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5FB8DC"/><stop offset="1" stop-color="#9bd3ea"/></linearGradient>
        <filter id="cyGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <style>
          .cy { font-family: -apple-system, sans-serif; }
          .cy-t { fill: #E9E1CF; font-size: 15px; font-weight: 700; }
          .cy-lab { fill: #E9E1CF; font-size: 12px; font-weight: 800; }
          .cy-sub { fill: #B9AE98; font-size: 10px; }
          .cy-side { font-size: 11px; font-weight: 800; letter-spacing: .08em; }
          ${a ? `
          @keyframes cyFlow { to { stroke-dashoffset: -80; } }
          @keyframes cySpin { to { transform: rotate(360deg); } }
          .cy-hot { stroke-dasharray: 8 10; animation: cyFlow 1.6s linear infinite; }
          .cy-cold { stroke-dasharray: 8 10; animation: cyFlow 1.8s linear infinite; }
          .cy-fan { animation: cySpin 3.2s linear infinite; transform-box: fill-box; transform-origin: center; }
          ` : ""}
        </style>
      </defs>
      <rect width="640" height="400" rx="14" fill="url(#cyBg)"/>
      <text class="cy-t" x="24" y="28">${L.t}</text>
      <text class="cy-side" x="430" y="52" fill="#FF9442">${L.hi}</text>
      <text class="cy-side" x="70" y="52" fill="#5FB8DC">${L.lo}</text>

      <!-- pipes -->
      <path class="cy-hot" d="M320 120 H520 V250 H400" fill="none" stroke="url(#cyHot)" stroke-width="8" stroke-linecap="round"/>
      <path class="cy-hot" d="M400 250 H320" fill="none" stroke="url(#cyHot)" stroke-width="8"/>
      <path class="cy-cold" d="M280 250 H140 V120 H300" fill="none" stroke="url(#cyCold)" stroke-width="8" stroke-linecap="round"/>

      <!-- compressor -->
      <g transform="translate(268,200)">
        <rect x="0" y="0" width="104" height="88" rx="12" fill="#2a2d33" stroke="#8b8579" stroke-width="2"/>
        <circle class="cy-fan" cx="52" cy="44" r="22" fill="none" stroke="#C9B48F" stroke-width="3"/>
        <circle cx="52" cy="44" r="6" fill="#C9B48F"/>
        <text class="cy-lab" x="52" y="108" text-anchor="middle">${L.co}</text>
      </g>
      <!-- condenser -->
      <g transform="translate(470,90)">
        <rect x="0" y="0" width="90" height="70" rx="8" fill="#3a241c" stroke="#E2574A" stroke-width="2"/>
        <path d="M10 12h70M10 24h70M10 36h70M10 48h70M10 60h70" stroke="#FF9442" stroke-width="2" opacity=".7"/>
        <g class="cy-fan" transform="translate(45,35)"><circle r="10" fill="none" stroke="#E9E1CF" stroke-width="2"/><path d="M0-8l3 8-3 8-3-8z" fill="#E9E1CF"/></g>
        <text class="cy-lab" x="45" y="92" text-anchor="middle">${L.cd}</text>
        <text class="cy-sub" x="45" y="106" text-anchor="middle">${L.hot}</text>
      </g>
      <!-- metering -->
      <g transform="translate(292,238)">
        <path d="M0 12 L36 0 L36 24 Z" fill="#81613C" stroke="#C9B48F"/>
        <text class="cy-lab" x="18" y="44" text-anchor="middle">${L.tx}</text>
        <text class="cy-sub" x="18" y="58" text-anchor="middle">${L.liq} →</text>
      </g>
      <!-- evaporator -->
      <g transform="translate(80,90)">
        <rect x="0" y="0" width="90" height="70" rx="8" fill="#16303a" stroke="#5FB8DC" stroke-width="2"/>
        <path d="M10 12h70M10 24h70M10 36h70M10 48h70M10 60h70" stroke="#9bd3ea" stroke-width="2" opacity=".75"/>
        <text class="cy-lab" x="45" y="92" text-anchor="middle">${L.ev}</text>
        <text class="cy-sub" x="45" y="106" text-anchor="middle">${L.mix}</text>
      </g>
      <text class="cy-sub" x="400" y="110">${L.hot}</text>
      <text class="cy-sub" x="160" y="110">${L.vap}</text>
    </svg>`;
  };

  V.airflow = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "El aire entra, se trata y vuelve a la casa", ret: "Retorno", fil: "Filtro", bl: "Soplador", hx: "Serpentín / intercambiador", sup: "Suministro", rm: "Habitación" }
      : { t: "Air comes back, gets treated, and goes out to the rooms", ret: "Return", fil: "Filter", bl: "Blower", hx: "Coil / heat exchanger", sup: "Supply", rm: "Room" };
    return `<svg viewBox="0 0 640 320" role="img" aria-label="${L.t}">
      <defs>
        <linearGradient id="afBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2018"/><stop offset="1" stop-color="#121510"/></linearGradient>
        <style>
          .af-t { fill: #E9E1CF; font-size: 15px; font-weight: 700; font-family: -apple-system, sans-serif; }
          .af-l { fill: #C9B48F; font-size: 11px; font-weight: 700; font-family: -apple-system, sans-serif; }
          ${a ? `
          @keyframes afDot { 0% { offset-distance: 0%; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } }
          .af-p { offset-path: path('M70 170 H170 H230 H330 H470 V110 H580'); animation: afDot 5s linear infinite; }
          .af-p2 { animation-delay: 1.6s; }
          .af-p3 { animation-delay: 3.2s; }
          ` : ""}
        </style>
      </defs>
      <rect width="640" height="320" rx="14" fill="url(#afBg)"/>
      <text class="af-t" x="24" y="28">${L.t}</text>
      <!-- return grille -->
      <g transform="translate(40,120)">
        <rect width="70" height="90" rx="6" fill="#2a2c28" stroke="#8b8579"/>
        <path d="M10 18h50M10 32h50M10 46h50M10 60h50M10 74h50" stroke="#C9B48F" stroke-width="2"/>
        <text class="af-l" x="35" y="112" text-anchor="middle">${L.ret}</text>
      </g>
      <!-- filter -->
      <g transform="translate(150,125)">
        <rect width="28" height="80" rx="3" fill="#3d4a30" stroke="#8DB255"/>
        <path d="M4 8l20 12V68L4 80" fill="none" stroke="#8DB255" stroke-width="1.5"/>
        <text class="af-l" x="14" y="108" text-anchor="middle">${L.fil}</text>
      </g>
      <!-- blower -->
      <g transform="translate(210,130)">
        <circle cx="30" cy="40" r="32" fill="#222" stroke="#C9B48F" stroke-width="2"/>
        <path d="M30 16l8 24-8 24-8-24z" fill="#C9B48F"/>
        <text class="af-l" x="30" y="104" text-anchor="middle">${L.bl}</text>
      </g>
      <!-- coil -->
      <g transform="translate(300,120)">
        <rect width="80" height="90" rx="6" fill="#1a2a32" stroke="#5FB8DC"/>
        <path d="M8 16h64M8 32h64M8 48h64M8 64h64M8 80h64" stroke="#5FB8DC" stroke-width="2"/>
        <text class="af-l" x="40" y="118" text-anchor="middle">${L.hx}</text>
      </g>
      <!-- supply plenum + room -->
      <path d="M400 140 h80 v-50 h80" fill="none" stroke="#8b8579" stroke-width="16" stroke-linecap="square"/>
      <g transform="translate(540,70)">
        <rect width="70" height="50" rx="4" fill="#2a2c28" stroke="#8b8579"/>
        <path d="M10 14h50M10 24h50M10 34h50" stroke="#C9B48F"/>
        <text class="af-l" x="35" y="72" text-anchor="middle">${L.sup}</text>
      </g>
      <circle class="af-p" r="5" fill="#9bd3ea"/>
      <circle class="af-p af-p2" r="5" fill="#8DB255"/>
      <circle class="af-p af-p3" r="5" fill="#9bd3ea"/>
    </svg>`;
  };

  V.pt = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "Más presión, más alto el punto de ebullición", lo: "Baja P — hierve frío", hi: "Alta P — hierve caliente", pot: "Olla a presión" }
      : { t: "Higher pressure, higher boiling point", lo: "Low P — boils cold", hi: "High P — boils hot", pot: "Pressure cooker" };
    return `<svg viewBox="0 0 640 300" role="img" aria-label="${L.t}">
      <defs>
        <style>
          .pt-t { fill:#E9E1CF; font-size:15px; font-weight:700; font-family:-apple-system,sans-serif; }
          .pt-l { fill:#B9AE98; font-size:12px; font-weight:700; font-family:-apple-system,sans-serif; }
          ${a ? `@keyframes ptBub { 0%{transform:translateY(0);opacity:.9} 100%{transform:translateY(-40px);opacity:0} }
          .pt-b { animation: ptBub 1.8s ease-out infinite; transform-box: fill-box; }
          .pt-b2 { animation-delay:.6s; } .pt-b3 { animation-delay:1.1s; }` : ""}
        </style>
      </defs>
      <rect width="640" height="300" rx="14" fill="#14171c"/>
      <text class="pt-t" x="24" y="30">${L.t}</text>
      <g transform="translate(80,70)">
        <rect x="40" y="40" width="140" height="110" rx="8" fill="#1a2a32" stroke="#5FB8DC" stroke-width="3"/>
        <rect x="40" y="130" width="140" height="20" fill="#5FB8DC" opacity=".4"/>
        <circle class="pt-b" cx="80" cy="140" r="6" fill="#9bd3ea"/>
        <circle class="pt-b pt-b2" cx="110" cy="145" r="5" fill="#9bd3ea"/>
        <circle class="pt-b pt-b3" cx="140" cy="138" r="6" fill="#9bd3ea"/>
        <text class="pt-l" x="110" y="180" text-anchor="middle">${L.lo}</text>
      </g>
      <g transform="translate(360,60)">
        <path d="M70 40h80a20 20 0 0 1 20 20v100H50V60a20 20 0 0 1 20-20z" fill="#2a2018" stroke="#FF9442" stroke-width="3"/>
        <path d="M90 40v-16h40v16" fill="none" stroke="#FF9442" stroke-width="4"/>
        <rect x="50" y="130" width="120" height="30" fill="#FF7A1A" opacity=".35"/>
        <circle class="pt-b" cx="90" cy="150" r="4" fill="#FFB347"/>
        <circle class="pt-b pt-b2" cx="120" cy="148" r="5" fill="#FFB347"/>
        <text class="pt-l" x="110" y="200" text-anchor="middle">${L.hi} · ${L.pot}</text>
      </g>
    </svg>`;
  };

  V.loto = es => {
    const a = reduced() ? "" : "anim";
    const L = es
      ? { t: "Corta, bloquea, etiqueta… y luego comprueba que está muerto", s1: "1. Desconecta", s2: "2. Candado y etiqueta", s3: "3. Mide (vivo-muerto-vivo)" }
      : { t: "Kill it, lock it, tag it — then prove it's dead", s1: "1. Open the disconnect", s2: "2. Lock and tag", s3: "3. Meter: live-dead-live" };
    return `<svg viewBox="0 0 640 280" role="img" aria-label="${L.t}">
      <defs>
        <style>
          .lo-t { fill:#E9E1CF; font-size:15px; font-weight:700; font-family:-apple-system,sans-serif; }
          .lo-l { fill:#C9B48F; font-size:12px; font-weight:700; font-family:-apple-system,sans-serif; }
          ${a ? `@keyframes loPull { 0%,30%{transform:translateY(0)} 60%,100%{transform:translateY(28px)} }
          .lo-h { animation: loPull 3s ease-in-out infinite; transform-box: fill-box; }` : ""}
        </style>
      </defs>
      <rect width="640" height="280" rx="14" fill="#161513"/>
      <text class="lo-t" x="24" y="28">${L.t}</text>
      <g transform="translate(40,60)">
        <rect width="140" height="150" rx="8" fill="#2a2b2e" stroke="#8b8579"/>
        <rect class="lo-h" x="50" y="30" width="40" height="24" rx="4" fill="#E2574A"/>
        <text class="lo-l" x="70" y="176" text-anchor="middle">${L.s1}</text>
      </g>
      <g transform="translate(250,70)">
        <path d="M70 40a24 24 0 0 1 0 48" fill="none" stroke="#D9AE48" stroke-width="8"/>
        <rect x="40" y="80" width="60" height="50" rx="6" fill="#D9AE48"/>
        <text class="lo-l" x="70" y="166" text-anchor="middle">${L.s2}</text>
      </g>
      <g transform="translate(460,70)">
        <rect width="70" height="100" rx="8" fill="#1a1b1d" stroke="#8DB255" stroke-width="3"/>
        <path d="M20 80h10l8-40 8 40h10" fill="none" stroke="#8DB255" stroke-width="3"/>
        <text class="lo-l" x="70" y="166">${L.s3}</text>
      </g>
    </svg>`;
  };
})();
