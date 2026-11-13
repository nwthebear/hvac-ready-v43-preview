/* GAME ART: illustrated SVG scenes for the training games (line-art / black / FDE / amber).
   Pure SVG strings + one canvas renderer (Rooftop Run). Loaded after games-core.js; games call TG.ART.*. */
(function () {
  const TG = window.App.TG, L = (en, es) => (window.App.S.lang === "es" ? es : en);
  let uid = 0; const U = p => p + (++uid);
  const grid = id => `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#C9A876" stroke-opacity=".07" stroke-width=".6"/></pattern>`;
  const coverBg = (g, p, a = "#2a2721", b = "#121213") => `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>${grid(p)}</defs><rect width="160" height="96" fill="url(#${g})"/><rect width="160" height="96" fill="url(#${p})"/>`;
  const screw = (x, y, r = 4, rot = 30) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="url(#scrG)" stroke="#3b2f1c" stroke-width=".6"/><path d="M${-r * .7} 0H${r * .7}" stroke="#4a3a20" stroke-width="${r * .28}" transform="rotate(${rot})"/></g>`;
  const scrDefs = `<radialGradient id="scrG" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF1C9"/><stop offset=".45" stop-color="#D2A54E"/><stop offset="1" stop-color="#7A5A22"/></radialGradient>`;

  /* ---------- hub cover art (160x96) ---------- */
  const COV = {
    thermostat: () => { const g = U("cg"), p = U("cp"); return `${coverBg(g, p)}
      <defs>${scrDefs}</defs><rect x="6" y="10" width="40" height="76" rx="3" fill="#3a352c" stroke="#5E4A30"/><ellipse cx="26" cy="48" rx="8" ry="14" fill="#0b0b0c"/>
      ${[["#E84A3A", 0], ["#F2F0E6", 1], ["#4CAF50", 2], ["#F2C230", 3], ["#3A7BD5", 4]].map(([c, i]) => `<path d="M26 ${42 + i * 3}C${44 + i * 3} ${30 + i * 7} ${52} ${74 - i * 6} ${70 + i * 2} ${26 + i * 10}" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${70 + i * 2}" cy="${26 + i * 10}" r="1.6" fill="#E3A35A"/>`).join("")}
      <rect x="78" y="14" width="74" height="68" rx="12" fill="#22201c" stroke="#C9A876" stroke-width="1.2"/><rect x="86" y="22" width="58" height="52" rx="8" fill="#151515" stroke="#5E4A30"/>
      ${[0, 1, 2, 3].map(i => screw(96 + i * 13, 64, 3.6, 20 + i * 25)).join("")}<text x="115" y="44" text-anchor="middle" font-size="16" font-weight="800" fill="#FFB547" font-family="system-ui">72°</text><circle cx="140" cy="28" r="2" fill="#FF7A1A"/>`; },
    braze: () => { const g = U("cg"), p = U("cp"), f = U("fl"), c = U("cu"); return `${coverBg(g, p)}
      <defs><linearGradient id="${c}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7B27A"/><stop offset=".5" stop-color="#B8642E"/><stop offset="1" stop-color="#5E2E12"/></linearGradient>
      <radialGradient id="${f}" cx=".85" cy=".5" r=".9"><stop offset="0" stop-color="#E8F6FF"/><stop offset=".3" stop-color="#5FB8DC"/><stop offset=".7" stop-color="#FF9A3A" stop-opacity=".8"/><stop offset="1" stop-color="#FF7A1A" stop-opacity="0"/></radialGradient>
      <radialGradient id="${f}h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF8A2A" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A2A" stop-opacity="0"/></radialGradient></defs>
      <rect x="4" y="50" width="96" height="16" rx="2" fill="url(#${c})"/><rect x="82" y="45" width="44" height="26" rx="3" fill="url(#${c})"/><circle cx="84" cy="58" r="22" fill="url(#${f}h)"/>
      <path d="M82 45v26" stroke="#FFD98A" stroke-width="2.2"/><path d="M8 53h86" stroke="#FFE3C0" stroke-opacity=".6" stroke-width="1.2"/>
      <g transform="translate(118 26) rotate(28)"><rect x="0" y="-4" width="44" height="8" rx="2" fill="#6b6b6b" stroke="#2a2a2a"/><ellipse cx="-12" cy="0" rx="16" ry="5" fill="url(#${f})"/><ellipse cx="-6" cy="0" rx="6" ry="2" fill="#E8F6FF"/></g>
      ${[[70, 40], [96, 36], [104, 78], [64, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#FFC23D"/>`).join("")}`; },
    wireitup: () => { const g = U("cg"), p = U("cp"), s = U("st"); return `${coverBg(g, p)}
      <defs>${scrDefs}<linearGradient id="${s}" x1="0" x2="1"><stop offset="0" stop-color="#9aa0a6"/><stop offset=".5" stop-color="#E6E8EA"/><stop offset="1" stop-color="#7d8288"/></linearGradient></defs>
      <rect x="10" y="12" width="62" height="72" rx="4" fill="#3b3a36" stroke="#C9A876"/><rect x="18" y="38" width="46" height="20" rx="2" fill="#24231f" stroke="#5E4A30"/><text x="41" y="51" text-anchor="middle" font-size="7" fill="#C9A876" font-family="system-ui">COIL</text>
      ${[22, 60].map(x => screw(x, 24, 4) + screw(x, 72, 4)).join("")}<rect x="96" y="20" width="44" height="60" rx="7" fill="url(#${s})" stroke="#2a2a2a"/><ellipse cx="118" cy="20" rx="22" ry="6" fill="#d9dcde" stroke="#555"/>
      ${[[106, "H"], [118, "C"], [130, "F"]].map(([x, t]) => `<rect x="${x - 3}" y="14" width="6" height="7" rx="1" fill="#C9A876"/><text x="${x}" y="32" text-anchor="middle" font-size="6" font-weight="700" fill="#333" font-family="system-ui">${t}</text>`).join("")}
      <path d="M60 24C84 4 96 10 106 15" stroke="#E84A3A" stroke-width="2.2" fill="none"/><path d="M60 72C88 92 116 60 118 18" stroke="#F2C230" stroke-width="2.2" fill="none"/><path d="M22 72C30 92 140 96 130 18" stroke="#3A7BD5" stroke-width="2.2" fill="none"/>`; },
    gauges: () => { const g = U("cg"), p = U("cp"); const ga = (x, col, a) => `<g transform="translate(${x} 46)"><circle r="27" fill="#1a1a1a" stroke="${col}" stroke-width="3"/><circle r="22" fill="#EDE6D3"/>${Array.from({ length: 9 }, (_, i) => { const t = (-225 + i * 33.75) * Math.PI / 180; return `<line x1="${Math.cos(t) * 21}" y1="${Math.sin(t) * 21}" x2="${Math.cos(t) * 17}" y2="${Math.sin(t) * 17}" stroke="#333" stroke-width="1"/>`; }).join("")}<path d="M0 0L0 -18" stroke="#B3261E" stroke-width="1.8" transform="rotate(${a})"/><circle r="2.4" fill="#222"/><path d="M-16 -12a22 22 0 0 1 20 -10" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/></g>`;
      return `${coverBg(g, p)}<rect x="22" y="70" width="116" height="16" rx="5" fill="#2e2c27" stroke="#5E4A30"/>${ga(46, "#3A7BD5", -30)}${ga(114, "#C0392B", 50)}<path d="M40 86c0 6-10 6-14 10M120 86c0 6 10 6 14 10M80 86v10" stroke="#3A7BD5" stroke-width="3" fill="none"/><path d="M120 86c0 6 10 6 14 10" stroke="#C0392B" stroke-width="3" fill="none"/><path d="M80 86v10" stroke="#F2C230" stroke-width="3"/>`; },
    leak: () => { const g = U("cg"), p = U("cp"), c = U("cu"); return `${coverBg(g, p)}
      <defs><linearGradient id="${c}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7B27A"/><stop offset=".5" stop-color="#B8642E"/><stop offset="1" stop-color="#5E2E12"/></linearGradient></defs>
      <rect x="0" y="54" width="160" height="10" fill="url(#${c})"/><path d="M58 50h16l4 4v10l-4 4H58l-4-4V54z" fill="#C9A060" stroke="#6b4a1e"/>${[[62, 44, 3], [70, 38, 2], [66, 30, 4], [74, 24, 2.4], [60, 20, 1.8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9fd4f0" fill-opacity=".25" stroke="#BFE6FF" stroke-width=".8"/>`).join("")}
      <g transform="translate(112 14) rotate(20)"><rect x="0" y="0" width="22" height="40" rx="5" fill="#2b2b2b" stroke="#C9A876"/><rect x="4" y="6" width="14" height="10" rx="2" fill="#0f2a1a"/>${[0, 1, 2, 3].map(i => `<rect x="${5 + i * 3.3}" y="${13 - i * 2}" width="2.2" height="${2 + i * 2}" fill="${i > 2 ? "#FF7A1A" : "#7CFF9B"}"/>`).join("")}<path d="M11 40C11 52 -6 50 -30 40" stroke="#888" stroke-width="2" fill="none"/></g>
      <path d="M86 24q6-6 12 0M84 18q10-10 20 0" stroke="#FFB547" stroke-width="1.4" fill="none"/>`; },
    vacuum: () => { const g = U("cg"), p = U("cp"); return `${coverBg(g, p)}
      <rect x="10" y="44" width="70" height="36" rx="6" fill="#B5462A" stroke="#2a1a10"/><rect x="18" y="36" width="40" height="12" rx="3" fill="#333"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${20 + i * 6} 50v24" stroke="#7a2c18" stroke-width="2"/>`).join("")}<circle cx="68" cy="62" r="7" fill="#e8d9a8" stroke="#333"/><rect x="6" y="80" width="78" height="5" rx="2" fill="#222"/>
      <path d="M80 54C104 54 100 26 120 26" stroke="#F2C230" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="104" y="12" width="48" height="40" rx="6" fill="#1d1d1d" stroke="#C9A876"/><rect x="109" y="17" width="38" height="18" rx="2" fill="#0f2a1a"/><text x="128" y="31" text-anchor="middle" font-size="10" font-weight="800" fill="#7CFF9B" font-family="ui-monospace,monospace">412</text>
      <path d="M110 48C116 38 124 44 130 46S142 47 146 47" stroke="#FFB547" stroke-width="1.2" fill="none"/>`; },
    rooftop: () => { const g = U("cg"), p = U("cp"); return `${coverBg(g, p, "#6a3f22", "#1a1614")}
      <path d="M0 44h12V30h10v14h8V20h14v24h10V34h12v10h20V26h10v18h14V36h12v8h18v52H0z" fill="#121213" opacity=".85"/><path d="M118 0v30M118 6H70M118 6h30" stroke="#C9A876" stroke-width="1.4"/><path d="M80 6v18" stroke="#888" stroke-width=".8"/><path d="M76 24h8l-4 6z" fill="#FFB547"/>
      <rect x="0" y="62" width="160" height="34" fill="#3a352c"/><rect x="0" y="58" width="160" height="5" fill="#5E4A30"/><rect x="88" y="44" width="56" height="30" rx="2" fill="#9A9C98" stroke="#2a2a2a"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${94 + i * 9} 48v22" stroke="#6b6d6a" stroke-width="2"/>`).join("")}<circle cx="132" cy="56" r="7" fill="#555" stroke="#2a2a2a"/>
      <g transform="translate(34 50)"><circle r="6" fill="#FFC72C"/><rect x="-5" y="5" width="10" height="14" rx="2" fill="#0E1B2C"/></g><rect x="60" y="74" width="5" height="9" rx="1" fill="#6FB6E0"/>`; },
    boss: () => { const g = U("cg"), p = U("cp"); return `${coverBg(g, p, "#2b2420", "#121213")}
      <rect x="70" y="40" width="80" height="40" rx="6" fill="#EDE6D3" stroke="#2a2a2a"/><rect x="128" y="46" width="18" height="14" rx="2" fill="#3a5068"/><circle cx="90" cy="82" r="7" fill="#222"/><circle cx="134" cy="82" r="7" fill="#222"/><text x="100" y="64" text-anchor="middle" font-size="8" font-weight="800" fill="#B5462A" font-family="system-ui">HVAC</text>
      <g transform="translate(40 52)"><path d="M-20 44c0-18 8-26 20-26s20 8 20 26z" fill="#4b5340"/><circle r="14" fill="#C68642"/><path d="M-17 -4a17 14 0 0 1 34 0z" fill="#FFC72C"/><rect x="-19" y="-5" width="38" height="4" rx="2" fill="#E0A800"/><path d="M-9 8q9 7 18 0" stroke="#EDE6D3" stroke-width="4" fill="none"/></g>
      <text x="150" y="22" text-anchor="end" font-size="12" font-weight="900" fill="#FF7A1A" font-family="system-ui">5 CALLS</text>`; }
  };
  const PCOV = { thermostat: "thermostat", braze: "torch-map", wireitup: "contactor", gauges: "gauge-analog", leak: "leak-electronic", vacuum: "vacuum-pump", rooftop: "condenser", boss: "compressor" };
  TG.ART = { cover: slug => PCOV[slug]
    ? `<span class="tg-cover-photo"><img src="img/illust/${PCOV[slug]}.webp" alt="" aria-hidden="true"></span>`
    : `<svg class="tg-cover" viewBox="0 0 160 96" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(COV[slug] || COV.boss)()}</svg>` };
})();

/* ---------- Thermostat / Wire It Up parts ---------- */
(function () {
  const TG = window.App.TG, ART = TG.ART;
  const CURLS = ["M2 10C10 2 14 18 22 10S34 4 40 10", "M2 12C8 4 16 4 20 11S32 18 40 10", "M2 8C12 16 16 2 24 9S34 14 40 10", "M2 11C9 18 15 2 23 8S35 13 40 10", "M2 9C10 14 14 4 21 12S33 6 40 10"];
  /* wire curling out of the wall: insulated jacket + stripped copper tip at the right edge (the drag anchor) */
  ART.curl = i => `<svg class="tw-curl" viewBox="0 0 50 20" preserveAspectRatio="none" aria-hidden="true"><path d="${CURLS[i % CURLS.length]}" class="cu-sh"/><path d="${CURLS[i % CURLS.length]}" class="cu-ins"/><path d="${CURLS[i % CURLS.length]}" class="cu-hl"/><path d="M40 10h9" class="cu-cu"/></svg>`;
  /* little house cutaway: attic duct + furnace with burner & blower, condenser outside, sky; keeps the hs-* hooks */
  ART.house = () => `<svg class="tw-house art" viewBox="0 0 150 92" aria-hidden="true"><defs>
      <linearGradient id="hsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3442"/><stop offset="1" stop-color="#4a3a2a"/></linearGradient>
      <linearGradient id="hsWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a342b"/><stop offset="1" stop-color="#262320"/></linearGradient>
      <radialGradient id="hsGlowW" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF8A2A" stop-opacity=".5"/><stop offset="1" stop-color="#FF8A2A" stop-opacity="0"/></radialGradient>
      <radialGradient id="hsGlowC" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#6FC3F0" stop-opacity=".5"/><stop offset="1" stop-color="#6FC3F0" stop-opacity="0"/></radialGradient></defs>
    <rect width="150" height="92" rx="8" fill="url(#hsSky)" class="hs-bg"/><circle cx="128" cy="14" r="5" fill="#EDE6D3" opacity=".7"/><rect y="84" width="150" height="8" fill="#2c2a22"/>
    <path d="M6 46L48 14l42 32v40H6z" fill="url(#hsWall)" stroke="#C9A876" stroke-width="1.4" stroke-linejoin="round"/><path d="M2 48L48 12l46 36" fill="none" stroke="#8A6A3C" stroke-width="3" stroke-linecap="round"/>
    <rect x="16" y="56" width="16" height="14" rx="1" fill="#1b2430" stroke="#C9A876" stroke-width="1"/><path d="M24 56v14M16 63h16" stroke="#C9A876" stroke-width=".8"/>
    <ellipse class="hs-glow-w" cx="30" cy="40" rx="26" ry="16" fill="url(#hsGlowW)"/><ellipse class="hs-glow-c" cx="30" cy="40" rx="26" ry="16" fill="url(#hsGlowC)"/>
    <path d="M44 40H18v6" fill="none" stroke="#8b8f94" stroke-width="3"/><path d="M62 54V40H46" fill="none" stroke="#8b8f94" stroke-width="3"/>
    <rect x="54" y="54" width="22" height="30" rx="2" fill="#4a4740" stroke="#C9A876" stroke-width="1"/><rect x="57" y="72" width="16" height="9" rx="1" fill="#1a1a1a"/>
    <g class="hs-flame"><path d="M65 80c-5-3-2-8 0-10 1 3 4 4 4 7 0 2-2 3-4 3z"/><path d="M61 80c-2-2-1-4 0-5 1 2 2 2 2 4z"/><path d="M69 80c2-2 1-4 0-5-1 2-2 2-2 4z"/></g>
    <g class="hs-blower" transform="translate(65 62)"><circle r="6" class="hs-line" fill="#2a2824"/><g class="hs-blades"><path d="M0-5v10M-5 0h10M-3.5-3.5l7 7M3.5-3.5l-7 7"/></g></g>
    <rect x="102" y="58" width="40" height="26" rx="3" fill="#8f918d" stroke="#2a2a2a" stroke-width="1"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${106 + i * 6} 61v20" stroke="#6b6d6a" stroke-width="1.6"/>`).join("")}
    <g class="hs-ofan" transform="translate(122 71)"><circle r="10" fill="#3a3a38" stroke="#2a2a2a" class="hs-line"/><g class="hs-blades"><path d="M0-9v18M-9 0h18M-6-6l12 12M6-6l-12 12"/></g></g>
    <path d="M90 76h12" stroke="#E3A35A" stroke-width="2"/><path d="M90 80h12" stroke="#111" stroke-width="3"/>
    <g class="hs-air hs-cold"><path d="M14 36q6-4 12 0t12 0"/><path d="M16 28q6-4 12 0t12 0"/></g><g class="hs-air hs-warm"><path d="M14 36q6-4 12 0t12 0"/><path d="M16 28q6-4 12 0t12 0"/></g>
    <g class="hs-fuse" transform="translate(65 48)"><path d="M-8-6l4 4-3 2 6 6M4-8l-2 5 4 1-3 6"/></g><g class="hs-x"><path d="M112 22l16 16M128 22l-16 16"/></g>
    <rect x="34" y="60" width="7" height="9" rx="1.5" fill="#1f1f1f" stroke="#C9A876" stroke-width=".8" class="hs-stat"/><circle cx="37.5" cy="64" r="1.6" class="hs-led"/></svg>`;
})();

/* ---------- Leak Hunter system ---------- */
(function () {
  const TG = window.App.TG, ART = TG.ART;
  const nut = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" class="lm-fit"><path d="M-6 -4L0 -7.5 6 -4V4L0 7.5-6 4Z" fill="url(#lmBr)" stroke="#5a4218" stroke-width=".7"/><path d="M-3-1.5h6" stroke="#fff6" stroke-width=".8"/></g>`;
  ART.leakMap = L => `<svg viewBox="0 0 360 220" class="lh-map art" aria-hidden="true"><defs>
      <linearGradient id="lmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2833"/><stop offset="1" stop-color="#2a2620"/></linearGradient>
      <linearGradient id="lmCu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7B27A"/><stop offset=".5" stop-color="#B8642E"/><stop offset="1" stop-color="#6E3514"/></linearGradient>
      <linearGradient id="lmBr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D38A"/><stop offset=".6" stop-color="#B8892E"/><stop offset="1" stop-color="#6b4f17"/></linearGradient>
      <linearGradient id="lmCab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d807c"/><stop offset=".5" stop-color="#a9aca7"/><stop offset="1" stop-color="#6b6e6a"/></linearGradient>
      <pattern id="lmFin" width="3" height="6" patternUnits="userSpaceOnUse"><path d="M1.5 0v6" stroke="#4b4e4b" stroke-width="1"/></pattern>
      <pattern id="lmIns" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#1d1d1d"/><path d="M0 6L6 0" stroke="#2c2c2c" stroke-width="1"/></pattern></defs>
    <rect width="360" height="220" fill="url(#lmSky)"/><rect y="208" width="360" height="12" fill="#2b2a22"/><path d="M0 208h190" stroke="#4a4436" stroke-width="2"/>
    <path d="M190 220V40L262 8l98 38v174z" fill="#2b2824" stroke="#5E4A30" stroke-width="1.5"/><path d="M186 42L262 6l102 40" fill="none" stroke="#8A6A3C" stroke-width="4" stroke-linecap="round"/>
    <path d="M196 104h164" stroke="#5E4A30" stroke-width="2" stroke-dasharray="2 4"/><text x="352" y="100" text-anchor="end" class="lm-t sm">${L("attic", "ático")}</text>
    ${[0, 1, 2].map(i => `<path d="M${214 + i * 46} 104l24-30" stroke="#4a3d2a" stroke-width="5"/>`).join("")}
    <g class="lm-cond"><rect x="6" y="98" width="88" height="110" rx="5" fill="url(#lmCab)" stroke="#2a2a2a"/><rect x="12" y="112" width="76" height="90" fill="url(#lmFin)" opacity=".85"/>
      <rect x="12" y="100" width="76" height="10" rx="2" fill="#3b3d3b"/><circle cx="50" cy="104" r="1" fill="#777"/>
      <rect x="20" y="124" width="38" height="58" rx="10" fill="#2c2f2f" stroke="#555" class="lm-comp"/><path d="M28 130h22" stroke="#555" stroke-width="2"/>
      <path d="M43 124v-12h26v42" fill="none" stroke="url(#lmCu)" stroke-width="3.2" stroke-linecap="round"/><rect x="40" y="132" width="6" height="8" rx="1" fill="#C9A060" stroke="#5a4218" stroke-width=".6"/>
      <text x="50" y="216" text-anchor="middle" class="lm-t">${L("Condenser", "Condensadora")}</text></g>
    <g><path d="M25 98V84" stroke="url(#lmCu)" stroke-width="2.4"/><rect x="18" y="76" width="14" height="10" rx="3" fill="#3a3a3a" stroke="#888" stroke-width=".8"/><path d="M22 76v-4M28 76v-4" stroke="#B8642E" stroke-width="1.2"/><text x="36" y="80" class="lm-t sm">${L("press. switch", "presostato")}</text></g>
    <g><path d="M88 100c8-10 0-14 9-21 8-6 2-12 10-16" fill="none" stroke="url(#lmCu)" stroke-width="1.6"/><text x="104" y="64" class="lm-t sm">${L("cap tube", "tubo capilar")}</text></g>
    <path d="M72 147H118l8 6h40l24 0V96h19v-36h52" fill="none" stroke="url(#lmIns)" stroke-width="9" stroke-linejoin="round"/>
    <path d="M72 158H118l8 -4h52l12 0V100h23v-44h48" fill="none" stroke="url(#lmCu)" stroke-width="3.6" stroke-linejoin="round"/>
    <rect x="66" y="142" width="12" height="20" rx="2" fill="url(#lmBr)" stroke="#5a4218" stroke-width=".8"/><rect x="62" y="150" width="6" height="6" rx="1" fill="#333"/>
    ${nut(119, 146)}${nut(119, 158, .9)}<rect x="160" y="160" width="14" height="40" fill="#6b5232" stroke="#3b2d1a"/><text x="167" y="212" text-anchor="middle" class="lm-t sm">${L("rub point", "roce")}</text>
    <g transform="translate(209 92)"><rect x="-6" y="-3" width="12" height="9" rx="2" fill="url(#lmCu)" stroke="#6E3514" stroke-width=".6"/><path d="M-6 -1h12" stroke="#E8C773" stroke-width="1.6"/></g>
    <g class="lm-evap"><rect x="262" y="40" width="86" height="58" rx="5" fill="#3a3833" stroke="#C9A876" stroke-width="1.2"/><path d="M270 92L305 46 340 92" fill="none" stroke="#8a9196" stroke-width="5"/><path d="M270 92L305 46 340 92" fill="none" stroke="url(#lmFin)" stroke-width="5"/>
      <path d="M305 46v-2" stroke="#B8642E" stroke-width="2"/><circle cx="288" cy="56" r="4" fill="url(#lmBr)" stroke="#5a4218" stroke-width=".6"/><text x="305" y="112" text-anchor="middle" class="lm-t">${L("Evap coil (attic)", "Evaporador (ático)")}</text></g>
    <g class="lm-hot">${[[43, 136], [72, 154], [119, 145], [166, 154], [209, 92], [25, 88], [97, 79], [302, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" />`).join("")}</g>
    <g id="lhSpot" class="lh-spot"><circle r="10"/></g><g id="lhOil" class="lh-oil"><ellipse rx="34" ry="14"/></g><g id="lhBub" class="lh-bub"></g>
    <g id="lhProbe" class="lh-probe"><path d="M0 0L18 34" class="lh-wand"/><circle r="14"/><circle r="3"/></g><g id="lhMarks"></g></svg>`;
})();

/* ---------- Vacuum Pump Rush scene ---------- */
(function () {
  const TG = window.App.TG, ART = TG.ART;
  ART.vacScene = L => `<svg class="vp-scene" viewBox="0 0 300 120" aria-hidden="true"><defs>
      <linearGradient id="vpBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E06A3A"/><stop offset="1" stop-color="#8E3418"/></linearGradient>
      <linearGradient id="vpMot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b6e70"/><stop offset=".5" stop-color="#3a3c3e"/><stop offset="1" stop-color="#202122"/></linearGradient>
      <linearGradient id="vpCab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d807c"/><stop offset=".5" stop-color="#a9aca7"/><stop offset="1" stop-color="#6b6e6a"/></linearGradient>
      <pattern id="vpFin" width="3" height="6" patternUnits="userSpaceOnUse"><path d="M1.5 0v6" stroke="#4b4e4b"/></pattern></defs>
    <rect width="300" height="120" fill="#17181b"/><rect y="104" width="300" height="16" fill="#2b2a22"/><path d="M0 104h300" stroke="#4a4436"/>
    <g class="vp-pump"><rect x="14" y="62" width="96" height="40" rx="8" fill="url(#vpBody)" stroke="#2a1208"/><rect x="20" y="48" width="56" height="20" rx="6" fill="url(#vpMot)"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${26 + i * 7} 50v16" stroke="#1a1a1a" stroke-width="1.6"/>`).join("")}
      <rect x="40" y="38" width="20" height="10" rx="2" fill="#2a2a2a"/><path d="M44 38q6-8 12 0" fill="none" stroke="#444" stroke-width="3"/>
      <circle cx="94" cy="80" r="9" fill="#d9c98a" stroke="#333" stroke-width="1.4" class="vp-oil"/><path d="M87 82h14" stroke="#8a6a1a" stroke-width="3" opacity=".6"/>
      <g class="vp-fly" transform="translate(116 82)"><circle r="12" fill="#2b2b2b" stroke="#555" stroke-width="1.5"/><g class="vp-fly-s"><path d="M0-10v20M-10 0h20" stroke="#777" stroke-width="2"/></g></g>
      <rect x="10" y="100" width="104" height="6" rx="3" fill="#111"/><text x="62" y="96" text-anchor="middle" class="vp-t">${L("PUMP", "BOMBA")}</text></g>
    <path d="M110 66C150 66 150 30 180 30" class="vp-hose big" /><path d="M110 66C150 66 150 30 180 30" class="vp-hose-flow"/>
    <g transform="translate(180 22)"><rect x="0" y="0" width="22" height="16" rx="3" fill="#C9A060" stroke="#5a4218"/><circle cx="11" cy="8" r="4" fill="#2C6CC4"/><text x="11" y="-3" text-anchor="middle" class="vp-t sm">${L("core tool", "saca-núcleos")}</text></g>
    <path d="M202 30C226 30 222 60 236 62" class="vp-hose big"/><path d="M202 30C226 30 222 60 236 62" class="vp-hose-flow"/>
    <g><rect x="232" y="44" width="62" height="60" rx="4" fill="url(#vpCab)" stroke="#2a2a2a"/><rect x="236" y="54" width="54" height="46" fill="url(#vpFin)" opacity=".8"/><rect x="230" y="58" width="10" height="12" rx="2" fill="#C9A060" stroke="#5a4218"/><text x="263" y="114" text-anchor="middle" class="vp-t sm">${L("service valve", "válvula de servicio")}</text></g>
    <path d="M196 38C196 70 170 74 160 86" class="vp-hose thin"/><rect x="140" y="80" width="40" height="22" rx="4" fill="#1d1d1d" stroke="#C9A876"/><rect x="144" y="84" width="32" height="10" rx="1.5" fill="#0f2a1a"/><text x="160" y="92" text-anchor="middle" class="vp-t lcd" id="vpMicMini">ATM</text></svg>`;
})();

/* ---------- Rooftop Run canvas renderer ---------- */
(function () {
  const TG = window.App.TG, ART = TG.ART;
  ART.roofR = ctx => {
    let w = 0, h = 0, far = null, near = null, roofTop = 0, pat = null;
    const mk = (W, H) => { const c = document.createElement("canvas"); c.width = W; c.height = H; return [c, c.getContext("2d")]; };
    function skyline(W, H, col, seed, minH, maxH, win) { const [c, g] = mk(W, H); let x = 0, s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      g.fillStyle = col; while (x < W) { const bw = 14 + rnd() * 30, bh = minH + rnd() * (maxH - minH); g.fillRect(x, H - bh, bw, bh); if (rnd() < .3) g.fillRect(x + bw / 2 - 1, H - bh - 8, 2, 8);
        if (win) { g.fillStyle = "rgba(255,190,90,.55)"; for (let yy = H - bh + 4; yy < H - 4; yy += 6) for (let xx = x + 3; xx < x + bw - 3; xx += 5) if (rnd() < .18) g.fillRect(xx, yy, 2, 2); g.fillStyle = col; } x += bw + 2; } return c; }
    function resize(W, H) { w = W; h = H; roofTop = Math.round(h * .2); far = skyline(w * 2, roofTop, "#3a2a24", 7, roofTop * .25, roofTop * .7, false); near = skyline(w * 2, roofTop, "#17120f", 3, roofTop * .35, roofTop * .95, true);
      const [pc, pg] = mk(48, 48); pg.fillStyle = "#3b3833"; pg.fillRect(0, 0, 48, 48); pg.fillStyle = "rgba(255,255,255,.025)"; for (let i = 0; i < 40; i++) pg.fillRect(Math.random() * 48, Math.random() * 48, 1.5, 1.5); pg.fillStyle = "rgba(0,0,0,.25)"; pg.fillRect(0, 46, 48, 2); pat = ctx.createPattern(pc, "repeat"); }
    const DECOR = ["vent", "boot", "drain", "curb", "boot", "vent", "conduit"];
    function bg(t, scroll, lx, dist) {
      const sky = ctx.createLinearGradient(0, 0, 0, roofTop); sky.addColorStop(0, "#2a2338"); sky.addColorStop(.55, "#8a4a2a"); sky.addColorStop(1, "#D98A3A"); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, roofTop);
      ctx.fillStyle = "rgba(255,210,140,.9)"; ctx.beginPath(); ctx.arc(w * .78, roofTop * .78, roofTop * .22, 0, 7); ctx.fill();
      const fo = -((t * 4 + lx * 8) % w), no = -((t * 9 + lx * 20) % w); ctx.drawImage(far, fo, 0); ctx.drawImage(far, fo + w * 2 - 1, 0); ctx.drawImage(near, no, 0); ctx.drawImage(near, no + w * 2 - 1, 0);
      /* tower crane + swinging hook */
      const cx = w * .3 - lx * 10; ctx.strokeStyle = "#1a1412"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, roofTop); ctx.lineTo(cx, 6); ctx.moveTo(cx - 30, 10); ctx.lineTo(cx + 90, 10); ctx.stroke();
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(cx - 3, roofTop - i * 9); ctx.lineTo(cx + 3, roofTop - i * 9 - 9); ctx.stroke(); }
      const sw = Math.sin(t * 1.3) * 6, hx = cx + 60; ctx.strokeStyle = "#2a2220"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx, 10); ctx.lineTo(hx + sw, roofTop * .62); ctx.stroke(); ctx.fillStyle = "#FFB547"; ctx.beginPath(); ctx.moveTo(hx + sw - 4, roofTop * .62); ctx.lineTo(hx + sw + 4, roofTop * .62); ctx.lineTo(hx + sw, roofTop * .62 + 7); ctx.fill();
      /* roof membrane, seams, parapets */
      ctx.save(); ctx.translate(0, scroll % 48); ctx.fillStyle = pat; ctx.fillRect(0, roofTop - 48, w, h - roofTop + 48); ctx.restore();
      const pw = 16; const pgr = ctx.createLinearGradient(0, 0, pw, 0); pgr.addColorStop(0, "#6b5a44"); pgr.addColorStop(1, "#3e3427");
      ctx.fillStyle = pgr; ctx.fillRect(0, roofTop, pw, h - roofTop); ctx.save(); ctx.translate(w, 0); ctx.scale(-1, 1); ctx.fillRect(0, roofTop, pw, h - roofTop); ctx.restore();
      ctx.fillStyle = "#9a8a6c"; ctx.fillRect(pw - 3, roofTop, 3, h - roofTop); ctx.fillRect(w - pw, roofTop, 3, h - roofTop);
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(pw, roofTop, 6, h - roofTop); ctx.fillRect(w - pw - 6, roofTop, 6, h - roofTop);
      const g2 = ctx.createLinearGradient(0, roofTop, 0, roofTop + 30); g2.addColorStop(0, "rgba(0,0,0,.55)"); g2.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g2; ctx.fillRect(0, roofTop, w, 30);
      /* side decor scrolling with the roof */
      const sp = 150, off = scroll2 % sp; for (let k = -1; k < h / sp + 1; k++) { const y = roofTop + k * sp + off, id = Math.floor((dist * 12 - k * sp) / sp), d = DECOR[((id % DECOR.length) + DECOR.length) % DECOR.length], left = id % 2 === 0, x = left ? pw + 16 : w - pw - 16; drawDecor(d, x, y); }
    }
    let scroll2 = 0; const setScroll = s => { scroll2 = s; };
    function drawDecor(d, x, y) { ctx.save(); ctx.translate(x, y);
      if (d === "vent") { ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(3, 4, 9, 5, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#8f918d"; ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fill(); ctx.fillStyle = "#5c5e5b"; ctx.beginPath(); ctx.arc(0, 0, 4, 0, 7); ctx.fill(); }
      else if (d === "boot") { ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill(); ctx.fillStyle = "#777"; ctx.beginPath(); ctx.arc(0, 0, 3, 0, 7); ctx.fill(); }
      else if (d === "drain") { ctx.fillStyle = "#1a1a1a"; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill(); ctx.strokeStyle = "#666"; ctx.lineWidth = 1; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-5, i * 3); ctx.lineTo(5, i * 3); ctx.stroke(); } }
      else if (d === "curb") { ctx.fillStyle = "#575a57"; ctx.fillRect(-12, -10, 24, 20); ctx.strokeStyle = "#8f918d"; ctx.strokeRect(-12, -10, 24, 20); }
      else { ctx.strokeStyle = "#7a7c7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, 30); ctx.stroke(); }
      ctx.restore(); }
    function item(it, x) { const z = it.z || 0; ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(x + 2, it.y + 10, 9 - z * .05, 4, 0, 0, 7); ctx.fill(); ctx.save(); ctx.translate(x, it.y - z); ctx.rotate(z * .03);
      if (it.k === "water") { ctx.fillStyle = "#6FB6E0"; ctx.beginPath(); ctx.roundRect(-6, -12, 12, 22, 3); ctx.fill(); ctx.fillStyle = "#E9F6FF"; ctx.fillRect(-6, -4, 12, 6); ctx.fillStyle = "#2C6CC4"; ctx.fillRect(-3, -16, 6, 4); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(-4, -10, 2, 14); }
      else { ctx.strokeStyle = "#C9CCCF"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-7, 7); ctx.lineTo(5, -5); ctx.stroke(); ctx.fillStyle = "#C9CCCF"; ctx.beginPath(); ctx.arc(6, -6, 5, 0, 7); ctx.fill(); ctx.fillStyle = "#3b3833"; ctx.beginPath(); ctx.arc(8, -8, 2.6, 0, 7); ctx.fill(); ctx.fillStyle = "#E0B020"; ctx.beginPath(); ctx.arc(-7, 7, 2.5, 0, 7); ctx.fill(); }
      ctx.restore(); }
    function hz(y, type, HZ) { ctx.save(); ctx.translate(0, y); const c = HZ[type] || "#FFB547";
      if (type === "edge") { ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(0, -26, w, 26); ctx.fillStyle = c; for (let x = 0; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 12, 0); ctx.lineTo(x + 24, -26); ctx.lineTo(x + 12, -26); ctx.fill(); } ctx.fillStyle = "#fff"; ctx.font = "800 11px system-ui"; ctx.textAlign = "center"; ctx.fillText("UNPROTECTED EDGE", w / 2, -9); }
      else if (type === "skylight") { ctx.fillStyle = "#1b2a36"; ctx.fillRect(w / 2 - 50, -44, 100, 44); ctx.strokeStyle = "#8fb8d0"; ctx.lineWidth = 3; ctx.strokeRect(w / 2 - 50, -44, 100, 44); ctx.strokeStyle = "rgba(200,230,255,.5)"; ctx.lineWidth = 1; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(w / 2 - 50 + i * 20, -44); ctx.lineTo(w / 2 - 50 + i * 20, 0); ctx.stroke(); } ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.moveTo(w / 2 - 44, -40); ctx.lineTo(w / 2 - 20, -40); ctx.lineTo(w / 2 - 40, -4); ctx.fill(); }
      else if (type === "powerline") { ctx.strokeStyle = "#111"; ctx.lineWidth = 2.5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(0, -30 + i * 10); ctx.quadraticCurveTo(w / 2, -6 + i * 10, w, -30 + i * 10); ctx.stroke(); } ctx.fillStyle = c; ctx.beginPath(); ctx.arc(w / 2, -12, 10, 0, 7); ctx.fill(); ctx.fillStyle = "#111"; ctx.font = "900 13px system-ui"; ctx.textAlign = "center"; ctx.fillText("⚡", w / 2, -7); }
      else if (type === "crane") { ctx.strokeStyle = "#2a2220"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w / 2 - 20, -110); ctx.lineTo(w / 2 - 30, -50); ctx.moveTo(w / 2 + 20, -110); ctx.lineTo(w / 2 + 30, -50); ctx.stroke(); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(w / 2, 0, 46, 10, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#8f918d"; ctx.fillRect(w / 2 - 36, -56, 72, 40); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.strokeRect(w / 2 - 36, -56, 72, 40); ctx.fillStyle = "#6b6d6a"; for (let i = 0; i < 6; i++) ctx.fillRect(w / 2 - 32 + i * 12, -52, 3, 32); }
      else if (type === "ladder") { ctx.strokeStyle = "#E0B020"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(w - 62, -80); ctx.lineTo(w - 62, 0); ctx.moveTo(w - 34, -80); ctx.lineTo(w - 34, 0); ctx.stroke(); ctx.lineWidth = 3; for (let i = 1; i < 7; i++) { ctx.beginPath(); ctx.moveTo(w - 62, -80 + i * 11); ctx.lineTo(w - 34, -80 + i * 11); ctx.stroke(); } }
      else if (type === "box") { ctx.fillStyle = "#575a57"; ctx.fillRect(w / 2 - 24, -48, 48, 48); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.strokeRect(w / 2 - 24, -48, 48, 48); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(w / 2 - 4, -40); ctx.lineTo(w / 2 - 12, -22); ctx.lineTo(w / 2 + 2, -24); ctx.lineTo(w / 2 - 4, -8); ctx.lineTo(w / 2 + 12, -28); ctx.lineTo(w / 2, -26); ctx.lineTo(w / 2 + 6, -40); ctx.fill(); }
      else if (type === "sun") { const g = ctx.createRadialGradient(w / 2, -30, 4, w / 2, -30, 60); g.addColorStop(0, "rgba(255,200,80,.9)"); g.addColorStop(1, "rgba(255,120,30,0)"); ctx.fillStyle = g; ctx.fillRect(w / 2 - 60, -90, 120, 120); ctx.fillStyle = "#FFC23D"; ctx.beginPath(); ctx.arc(w / 2, -30, 16, 0, 7); ctx.fill(); }
      ctx.restore(); }
    return { resize, bg, item, hz, setScroll, get top() { return roofTop; } };
  };
})();
