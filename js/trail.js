/* Path board as a vertical WINDING TRAIL MAP: one line-art zone per stage, round module nodes on a dashed trail,
   a BOSS checkpoint node closing each zone, and the avatar hopping node to node (crouch → arc → squash + dust).
   Replaces the old tile grid. Ranks stay data-driven in window.RANKS (achievements.js) via App.rank() / App.rankName(). */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views, $ = s => document.querySelector(s);
  const W = 360, BANNER = 66, GAP = 92, PAD_TOP = 44, PAD_END = 46;
  const T = (en, es) => ({ en, es });
  /* zone themes per stage (EN/ES) — edit here */
  window.TRAIL_ZONES = {
    week_1: { name: T("The Shop", "El Taller"), boss: T("The Walk-Around", "La Revisión Final"), line: T("", "") },
    first_30_days: { name: T("The Basement", "El Sótano"), boss: T("Lights Out", "Luces Fuera"), line: T("", "") },
    days_31_60: { name: T("The Attic", "El Ático"), boss: T("Attic in August", "Ático en Agosto"), line: T("Hydrate. It is 130°F up here.", "Hidrátate. Aquí arriba hace 130°F.") },
    days_61_90: { name: T("The Backyard", "El Patio"), boss: T("The Dog Was Not Friendly", "El Perro No Era Amigable"), line: T("", "") },
    months_3_6: { name: T("The Rooftop", "La Azotea"), boss: T("Crane Day", "Día de Grúa"), line: T("Tie off. Gravity is undefeated.", "Asegúrate. La gravedad nunca pierde.") },
    months_6_12: { name: T("The Plant Room", "El Cuarto de Máquinas"), boss: T("The Chiller", "El Chiller"), line: T("", "") },
    year_2_plus: { name: T("The Supply House", "La Casa de Suministros"), boss: T("Counter Guy Knows Your Name", "El del Mostrador Ya Te Conoce"), line: T("", "") }
  };

  /* subtle line-art scenery, drawn in a 360 × h zone box (stroke = currentColor) */
  const SCENE = {
    week_1: h => `<g transform="translate(14 ${h * .42})"><path d="M0 40h70l14 -16h26l14 16v18H0z M84 24v16 M100 24v16"/><circle cx="22" cy="60" r="8"/><circle cx="100" cy="60" r="8"/><path d="M6 20h108 M10 20v-8h100v8 M14 12v8 M26 12v8 M38 12v8 M50 12v8 M62 12v8 M74 12v8 M86 12v8 M98 12v8"/><path d="M8 30h22v10H8z"/></g>
      <g transform="translate(244 ${h * .2})"><path d="M0 70V20l50 -20 50 20v50z M18 70V36h44v34 M18 44h44 M18 52h44 M18 60h44 M72 36h16v14H72z"/></g>`,
    first_30_days: h => `<g transform="translate(18 ${h * .3})"><path d="M0 20h56v86H0z M6 30h44 M6 36h44 M6 42h44 M10 70h36v26H10z M28 20V0 M28 0h40"/><path d="M56 40h40v18H56 M72 40v-10h14v10 M96 49h30"/></g>
      <g transform="translate(250 ${h * .55})"><path d="M0 80l16 -16 M16 64h16l16 -16h16l16 -16h16 M0 80h96"/><path d="M60 0h40v26H60z M66 8h28 M66 16h28"/></g>`,
    days_31_60: h => `<g transform="translate(0 ${h * .12})"><path d="M0 60L60 10 120 60z M30 60L60 10 M90 60L60 10 M60 10v50 M120 60L180 10 240 60z M150 60l30 -50 M210 60l-30 -50 M180 10v50 M240 60L300 10 360 60z M270 60l30 -50 M330 60l-30 -50 M300 10v50"/></g>
      <g transform="translate(12 ${h * .6})"><path d="M0 0h60v40H0z M8 10h44 M8 18h44 M60 20c20 0 20 -14 40 -14s20 14 40 14s20 -14 40 -14"/><path d="M70 14v12 M84 9v12 M98 6v12 M112 12v12 M126 18v12 M140 12v12"/></g>`,
    days_61_90: h => `<g transform="translate(250 ${h * .38})"><path d="M0 18h84v70H0z M-6 88h96 M8 26v54 M14 26v54 M20 26v54 M64 26v54 M70 26v54 M76 26v54"/><circle cx="42" cy="18" r="20"/><path d="M42 -2v40 M22 18h40"/><path d="M0 60c-30 0 -40 -20 -70 -20 M0 66c-34 0 -44 -20 -70 -20"/></g>
      <g transform="translate(6 ${h * .2})"><path d="M0 60V10l6 -6 6 6v50 M18 60V10l6 -6 6 6v50 M36 60V10l6 -6 6 6v50 M54 60V10l6 -6 6 6v50 M0 22h66 M0 46h66"/></g>`,
    months_3_6: h => `<g transform="translate(0 ${h * .1})"><path d="M0 80V50h22v30 M22 80V30h18v50 M40 80V56h26v24 M300 80V40h20v40 M320 80V20h22v60 M342 80V52h18v28 M28 40h4 M28 50h4 M326 30h4 M326 44h4"/></g>
      <g transform="translate(220 ${h * .3})"><path d="M30 120V0 M22 120V8 M22 8h8 M22 30l8 -8 M22 50l8 -8 M22 70l8 -8 M22 90l8 -8 M0 0h130 M30 0l20 -14h-28z M120 0v40 M114 40h12v8h-12z"/></g>
      <g transform="translate(16 ${h * .62})"><path d="M0 50V10h110v40z M0 10l10 -10h90l10 10 M14 20h20v20H14z"/><circle cx="62" cy="28" r="10"/><circle cx="92" cy="28" r="10"/></g>`,
    months_6_12: h => `<g transform="translate(12 ${h * .3})"><rect x="0" y="0" width="120" height="44" rx="22"/><path d="M22 0v44 M98 0v44 M10 44v14 M110 44v14 M0 58h120"/></g>
      <g transform="translate(0 ${h * .62})"><path d="M0 10h360 M0 22h360 M80 4v24 M90 4v24 M200 4v24 M210 4v24 M300 22v40 M312 22v40 M296 62h20"/></g>
      <g transform="translate(270 ${h * .18})"><path d="M0 80V0h70v80z M10 12h50v20H10z M35 0v-20 M28 -20h14"/><circle cx="35" cy="56" r="10"/></g>`,
    year_2_plus: h => `<g transform="translate(14 ${h * .42})"><path d="M0 40h100 M8 40v30 M92 40v30 M30 16h40v24H30z M44 40v-4h12v4"/><path d="M110 70V20 M118 70V20 M110 30h8 M110 45h8 M110 60h8"/></g>
      <g transform="translate(236 ${h * .2})"><path d="M0 100V0 M110 100V0 M0 30h110 M0 64h110 M0 98h110 M8 12h20v18H8z M34 16h18v14H34z M60 8h22v22H60z M12 44h26v20H12z M48 48h20v16H48z M76 42h26v22H76z M18 80h22v18H18z M54 76h24v22H54z"/><path d="M20 -16h70v12H20z"/></g>`
  };
  /* full-color versions of each zone (same placement as SCENE). Drawn under the same line art inked on top, revealed by a
     radial clip sweep from the boss node when the zone is complete. Palette: black/FDE base, warm lamp light, copper, steel. */
  const DEFS = `<defs><pattern id="tzGrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#86B3D6" stroke-opacity=".07" stroke-width="1"/></pattern>
    <linearGradient id="tzWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2c1d" stop-opacity=".94"/><stop offset=".6" stop-color="#231c15" stop-opacity=".94"/><stop offset="1" stop-color="#16130f" stop-opacity=".94"/></linearGradient>
    <radialGradient id="tzLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFB55A" stop-opacity=".55"/><stop offset=".45" stop-color="#FF8A2A" stop-opacity=".16"/><stop offset="1" stop-color="#FF7A1A" stop-opacity="0"/></radialGradient>
    <linearGradient id="tzSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9bec3"/><stop offset="1" stop-color="#6a7076"/></linearGradient>
    <linearGradient id="tzCopper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9A86A"/><stop offset="1" stop-color="#9A5A2A"/></linearGradient>
    <linearGradient id="tzWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C29360"/><stop offset="1" stop-color="#7A5530"/></linearGradient>
    <linearGradient id="tzVan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ECE3CF"/><stop offset="1" stop-color="#B9AC92"/></linearGradient>
    <linearGradient id="tzSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2433"/><stop offset=".7" stop-color="#5a3826"/><stop offset="1" stop-color="#C46A2A"/></linearGradient>
    <linearGradient id="tzGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E7F45"/><stop offset="1" stop-color="#3E4A2A"/></linearGradient>
  </defs>`;
  const lamp = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#tzLamp)"/>`;
  const COLOR = {
    week_1: h => `${lamp(300, h * .3, 120)}${lamp(80, h * .5, 110)}<g transform="translate(14 ${h * .42})">
        <path d="M0 40h70l14 -16h26l14 16v18H0z" fill="url(#tzVan)"/><path d="M84 26h24l12 14H84z" fill="#5FB8DC" opacity=".55"/><rect x="0" y="44" width="124" height="5" fill="#FF7A1A"/><path d="M8 30h22v10H8z" fill="#2a2b2e"/>
        <circle cx="22" cy="60" r="8" fill="#161616"/><circle cx="22" cy="60" r="3" fill="#8b8579"/><circle cx="100" cy="60" r="8" fill="#161616"/><circle cx="100" cy="60" r="3" fill="#8b8579"/>
        <path d="M6 20h108v-8H6z" fill="#3b3d41" opacity=".8"/><rect x="20" y="13" width="80" height="4" fill="url(#tzCopper)"/><circle cx="118" cy="50" r="2.6" fill="#FFD27A"/></g>
      <g transform="translate(244 ${h * .2})"><path d="M0 70V20l50 -20 50 20v50z" fill="#4B5340"/><path d="M0 20l50 -20 50 20" fill="none" stroke="#7E6A4F" stroke-width="5"/><path d="M18 70V36h44v34z" fill="#8b8579"/><path d="M18 44h44M18 52h44M18 60h44" stroke="#5f5a50" stroke-width="2"/><rect x="72" y="36" width="16" height="14" fill="#FFB347"/><rect x="72" y="36" width="16" height="14" fill="url(#tzLamp)"/></g>`,
    first_30_days: h => `${lamp(60, h * .45, 120)}<g transform="translate(18 ${h * .3})">
        <rect x="0" y="20" width="56" height="86" rx="2" fill="url(#tzSteel)"/><rect x="10" y="70" width="36" height="26" fill="#1c1c1e"/><path d="M14 92q6 -12 10 -4q4 -14 10 -2q4 -8 8 4z" fill="#FF8A2A"/><path d="M14 92q6 -8 10 -2q4 -8 10 0q4 -4 8 2z" fill="#5FB8DC" opacity=".7"/>
        <rect x="24" y="0" width="8" height="20" fill="#9aa3ad"/><rect x="28" y="-3" width="40" height="6" fill="#9aa3ad"/><path d="M56 40h40v18H56z" fill="#a9b0b7"/><rect x="72" y="30" width="14" height="10" fill="#8b9198"/><rect x="96" y="45" width="30" height="8" fill="url(#tzCopper)"/></g>
      <g transform="translate(250 ${h * .55})"><path d="M0 80l16 -16h16l16 -16h16l16 -16h16v48H0z" fill="url(#tzWood)"/><rect x="60" y="0" width="40" height="26" rx="2" fill="#3b3d41"/><path d="M66 8h28M66 16h28" stroke="#E3A72F" stroke-width="2"/><circle cx="96" cy="4" r="1.6" fill="#8DB255"/></g>`,
    days_31_60: h => `<rect x="0" y="${h * .12 - 20}" width="360" height="100" fill="#3a2414" opacity=".5"/>${lamp(180, h * .2, 160)}<g transform="translate(0 ${h * .12})" fill="url(#tzWood)" opacity=".9">
        <path d="M0 60L60 10 120 60h-8L60 18 8 60z"/><path d="M120 60L180 10 240 60h-8L180 18 128 60z"/><path d="M240 60L300 10 360 60h-8L300 18 248 60z"/><rect x="58" y="10" width="4" height="50"/><rect x="178" y="10" width="4" height="50"/><rect x="298" y="10" width="4" height="50"/><rect x="0" y="58" width="360" height="5" fill="#7A5530"/></g>
      <rect x="0" y="${h * .12 + 63}" width="360" height="14" fill="#E8C98A" opacity=".35"/>
      <g transform="translate(12 ${h * .6})"><rect x="0" y="0" width="60" height="40" rx="2" fill="url(#tzSteel)"/><path d="M8 10h44M8 18h44" stroke="#4a4f55" stroke-width="2"/><path d="M60 20c20 0 20 -14 40 -14s20 14 40 14s20 -14 40 -14" fill="none" stroke="#CFC6B4" stroke-width="12" stroke-linecap="round"/><path d="M60 20c20 0 20 -14 40 -14s20 14 40 14s20 -14 40 -14" fill="none" stroke="#efe8da" stroke-width="3" stroke-linecap="round" opacity=".6"/></g>`,
    days_61_90: h => `<rect x="0" y="${h * .38 + 84}" width="360" height="26" fill="url(#tzGrass)"/>${lamp(290, h * .4, 120)}<g transform="translate(250 ${h * .38})">
        <rect x="0" y="18" width="84" height="70" rx="3" fill="url(#tzSteel)"/><path d="M8 26v54M14 26v54M20 26v54M64 26v54M70 26v54M76 26v54" stroke="#565b61" stroke-width="2"/><rect x="-6" y="86" width="96" height="6" fill="#8b8579"/>
        <circle cx="42" cy="18" r="20" fill="#1f2023"/><circle cx="42" cy="18" r="20" fill="none" stroke="#9aa3ad" stroke-width="3"/><path d="M42 -2v40M22 18h40" stroke="#6a7076" stroke-width="3"/><circle cx="42" cy="18" r="4" fill="#9aa3ad"/>
        <path d="M0 60c-30 0 -40 -20 -70 -20" fill="none" stroke="url(#tzCopper)" stroke-width="5"/><path d="M0 66c-34 0 -44 -20 -70 -20" fill="none" stroke="#1d1d1d" stroke-width="7"/></g>
      <g transform="translate(6 ${h * .2})" fill="url(#tzWood)"><path d="M0 60V10l6 -6 6 6v50z"/><path d="M18 60V10l6 -6 6 6v50z"/><path d="M36 60V10l6 -6 6 6v50z"/><path d="M54 60V10l6 -6 6 6v50z"/><rect x="0" y="20" width="66" height="4" fill="#7A5530"/><rect x="0" y="44" width="66" height="4" fill="#7A5530"/></g>`,
    months_3_6: h => `<rect x="0" y="${h * .1 - 30}" width="360" height="${h * .3 + 30}" fill="url(#tzSky)" opacity=".85"/><g transform="translate(0 ${h * .1})" fill="#1d232b">
        <path d="M0 80V50h22v30z"/><path d="M22 80V30h18v50z"/><path d="M40 80V56h26v24z"/><path d="M300 80V40h20v40z"/><path d="M320 80V20h22v60z"/><path d="M342 80V52h18v28z"/>
        <g fill="#FFB347"><rect x="27" y="38" width="5" height="4"/><rect x="27" y="48" width="5" height="4"/><rect x="326" y="28" width="5" height="4"/><rect x="326" y="42" width="5" height="4"/><rect x="333" y="56" width="5" height="4"/><rect x="6" y="58" width="4" height="4"/></g></g>
      <g transform="translate(220 ${h * .3})"><path d="M22 120V8h8v112z" fill="#E8C34A"/><path d="M22 30l8 -8M22 50l8 -8M22 70l8 -8M22 90l8 -8" stroke="#8a6d16" stroke-width="2"/><rect x="0" y="-3" width="130" height="6" fill="#E8C34A"/><path d="M30 0l20 -14h-28z" fill="#c9a42e"/><path d="M120 0v40" stroke="#2a2b2e" stroke-width="2"/><rect x="114" y="40" width="12" height="8" fill="#FF7A1A"/></g>
      ${lamp(70, h * .66, 90)}<g transform="translate(16 ${h * .62})"><path d="M0 50V10h110v40z" fill="url(#tzSteel)"/><path d="M0 10l10 -10h90l10 10z" fill="#c7ccd1"/><rect x="14" y="20" width="20" height="20" fill="#3b3d41"/><circle cx="62" cy="28" r="10" fill="#1f2023"/><circle cx="92" cy="28" r="10" fill="#1f2023"/><path d="M57 28h10M62 23v10M87 28h10M92 23v10" stroke="#8b9198" stroke-width="2"/></g>`,
    months_6_12: h => `${lamp(72, h * .34, 130)}<g transform="translate(12 ${h * .3})"><rect x="0" y="0" width="120" height="44" rx="22" fill="#4A6178"/><rect x="0" y="0" width="120" height="14" rx="7" fill="#6b84a0" opacity=".5"/><rect x="18" y="-2" width="8" height="48" rx="2" fill="url(#tzCopper)"/><rect x="94" y="-2" width="8" height="48" rx="2" fill="url(#tzCopper)"/><path d="M10 44v14M110 44v14" stroke="#3b3d41" stroke-width="4"/><rect x="0" y="56" width="120" height="4" fill="#3b3d41"/></g>
      <g transform="translate(0 ${h * .62})"><rect x="0" y="7" width="360" height="7" fill="#2f5f98"/><rect x="0" y="19" width="360" height="7" fill="#a5392c"/><g fill="#9aa3ad"><rect x="79" y="4" width="3" height="24"/><rect x="89" y="4" width="3" height="24"/><rect x="199" y="4" width="3" height="24"/><rect x="209" y="4" width="3" height="24"/></g><rect x="300" y="22" width="12" height="40" fill="#a5392c"/><rect x="296" y="60" width="20" height="4" fill="#3b3d41"/></g>
      <g transform="translate(270 ${h * .18})"><rect x="0" y="0" width="70" height="80" rx="2" fill="#2f3237"/><rect x="10" y="12" width="50" height="20" fill="#0b1a10"/><path d="M14 22h10M28 22h6M38 22h16" stroke="#8fe28a" stroke-width="2"/><rect x="33" y="-20" width="4" height="20" fill="#9aa3ad"/><circle cx="35" cy="56" r="10" fill="#E3A72F"/><circle cx="35" cy="56" r="4" fill="#5a3a10"/>${""}</g>`,
    year_2_plus: h => `${lamp(64, h * .4, 120)}${lamp(290, h * .3, 120)}<g transform="translate(14 ${h * .42})"><rect x="0" y="38" width="100" height="6" fill="url(#tzWood)"/><rect x="8" y="44" width="84" height="26" fill="#5c4630"/><rect x="30" y="16" width="40" height="24" rx="2" fill="#2a2b2e"/><rect x="34" y="20" width="32" height="12" fill="#5FB8DC" opacity=".6"/><g fill="#9aa3ad"><rect x="110" y="20" width="3" height="50"/><rect x="118" y="20" width="3" height="50"/></g></g>
      <g transform="translate(236 ${h * .2})"><g fill="#3b3d41"><rect x="-1" y="0" width="3" height="100"/><rect x="109" y="0" width="3" height="100"/><rect x="0" y="29" width="110" height="3"/><rect x="0" y="63" width="110" height="3"/><rect x="0" y="97" width="110" height="3"/></g>
        <rect x="8" y="12" width="20" height="18" fill="#C9A876"/><rect x="34" y="16" width="18" height="14" fill="#FF7A1A"/><rect x="60" y="8" width="22" height="22" fill="#8b8579"/><rect x="12" y="44" width="26" height="20" fill="#5D6A3F"/><rect x="48" y="48" width="20" height="16" fill="#C9A876"/><rect x="76" y="42" width="26" height="22" fill="#4A6178"/><rect x="18" y="80" width="22" height="18" fill="#A9521F"/><rect x="54" y="76" width="24" height="22" fill="#C9A876"/>
        <rect x="20" y="-16" width="70" height="12" rx="2" fill="#FF7A1A"/><path d="M28 -10h54" stroke="#141210" stroke-width="2"/></g>`
  };
  const zk = id => ((window.TRAIL_ZONES[id] || {}).scene) || id;
  const zoneOf = id => window.TRAIL_ZONES[id] || { name: STAGE_LABELS[id] || T(id, id), line: T("", "") };

  /* layout: banner, then nodes winding left/right; boss node centered at the end of each zone */
  function layout(plan) {
    const mods = A.boardModules(plan); const zones = []; let y = 0, k = 0;
    plan.stages.forEach(st => { const ms = mods.filter(m => m.stage === st.id); if (!ms.length) return;
      const z = { id: st.id, top: y, nodes: [] }; y += BANNER + PAD_TOP;
      ms.forEach((m, j) => { const boss = j === ms.length - 1; const x = boss ? W / 2 : W / 2 + 104 * Math.sin(k * 1.15 + .6); z.nodes.push({ m, x, y, boss, i: mods.indexOf(m) }); y += boss ? GAP + 16 : GAP; k++; });
      y += PAD_END - GAP + 40; z.h = y - z.top; zones.push(z); });
    const side = { top: y, nodes: (window.SIDE_PATHS || []).map((p, j, a) => ({ p, x: a.length > 1 ? 100 + j * 160 : W / 2, y: y + BANNER + 70 })) };
    if (side.nodes.length) y += BANNER + 170;
    return { mods, zones, side, H: y + 30, nodes: zones.flatMap(z => z.nodes) };
  }
  /* smooth Catmull-Rom path through node centers */
  const pathD = pts => { if (!pts.length) return ""; let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; }
    return d; };

  V.board = () => {
    const plan = A.plan(); if (!plan) return V.match();
    const es = S.lang === "es", pr = A.progress(plan), rk = A.rank(), cur = A.nextModule(plan);
    const L = layout(plan), pts = L.nodes.map(n => [n.x, n.y]), curN = L.nodes.find(n => n.m === cur), doneUpTo = curN ? L.nodes.indexOf(curN) : L.nodes.length - 1;
    const pct = v => (v / W * 100).toFixed(3) + "%", pctY = v => (v / L.H * 100).toFixed(3) + "%";
    /* blueprint until the zone is complete; complete + already celebrated = full color; complete but not yet celebrated = color
       layer clipped to r=0, revealed by A.zoneColorIn from the boss node (bind). */
    S.zColor = S.zColor || {};
    const zoneDoneIds = new Set(pr.stages.filter(s => s.pct === 100).map(s => s.id));
    const zonesSvg = DEFS + L.zones.map(z => { const h = z.h - BANNER, sc = (SCENE[zk(z.id)] || (() => ""))(h), done = zoneDoneIds.has(z.id), shown = done && S.zColor[z.id], boss = z.nodes[z.nodes.length - 1];
      const cy = boss ? boss.y - z.top - BANNER : h / 2, cx = boss ? boss.x : W / 2, R = Math.ceil(Math.hypot(W, h + BANNER) + 20);
      return `<g class="tz-zone ${shown ? "colored" : done ? "pending" : ""}" data-z="${z.id}" data-r="${R}" transform="translate(0 ${z.top + BANNER})">
        <rect class="tz-band" x="0" y="${-BANNER}" width="${W}" height="${z.h}" />
        <g class="tz-scene tz-blue">${sc}</g>
        ${COLOR[zk(z.id)] ? `<clipPath id="tzc-${z.id}"><circle cx="${cx}" cy="${cy}" r="${shown ? R : 0}"/></clipPath>
        <g class="tz-color" clip-path="url(#tzc-${z.id})"><rect x="0" y="${-BANNER}" width="${W}" height="${z.h}" fill="url(#tzWash)"/>${COLOR[zk(z.id)](h)}<g class="tz-ink">${sc}</g></g>
        <circle class="tz-ring" cx="${cx}" cy="${cy}" r="0"/>` : ""}</g>`; }).join("");
    const banners = L.zones.map(z => { const zz = zoneOf(z.id), sp = pr.stages.find(s => s.id === z.id) || { done: 0, total: 0, pct: 0 };
      return `<div class="tz-banner" style="top:${pctY(z.top)}"><div class="tz-b-in"><span class="tz-stage">${esc(tx(STAGE_LABELS[z.id]))}</span><b>${esc(tx(zz.name))}</b>${tx(zz.line) ? `<span class="tz-line">${esc(tx(zz.line))}</span>` : ""}</div><span class="tz-prog">${sp.pct === 100 ? ico("check", 14) : ""}${sp.done}/${sp.total}</span></div>`; }).join("");
    const nodes = L.nodes.map(n => { const m = n.m, done = A.moduleDone(m), open = A.gateOpen(m, plan), isCur = m === cur, right = n.x <= W / 2;
      const cls = ["tnode", done ? "done" : "", zoneDoneIds.has(m.stage) && S.zColor[m.stage] ? "zlit" : "", isCur ? "cur" : "", open ? "" : "locked", n.boss ? "boss" : "", m.status === "optional" ? "optional" : ""].join(" ");
      const icon = done ? "check" : !open ? "lock" : n.boss ? "gate" : (m.links.length ? "book" : "hardhat");
      return `<a class="${cls}" data-i="${n.i}" style="left:${pct(n.x)};top:${pctY(n.y)}" href="#/module/${m.id}" aria-label="${esc((n.i + 1) + ". " + tx(m.title))}">
        <span class="tn-ico">${ico(icon, n.boss ? 26 : 20)}</span><span class="tn-num">${n.i + 1}</span>
        <span class="tn-label ${n.boss ? "c" : right ? "r" : "l"}">${n.boss ? `<em>${es ? "Jefe" : "Boss"} · ${esc(tx(zoneOf(m.stage).boss || T("Checkpoint", "Punto de control")))}</em>` : ""}${esc(tx(m.title))}</span></a>`; }).join("");
    const capped = A.capped ? A.capped() : false;
    const sideHtml = L.side.nodes.length ? `<div class="tz-banner side-banner" style="top:${pctY(L.side.top)}"><div class="tz-b-in"><span class="tz-stage">${es ? "Después del tope" : "Past the cap"}</span><b>${es ? "Rutas alternas" : "Side paths"}</b><span class="tz-line">${capped ? (es ? "Electricidad y plomería, desbloqueadas." : "Electrical and plumbing, unlocked.") : (es ? "Se desbloquean al llegar a Veterano." : "Unlock at Old Timer.")}</span></div>${ico(capped ? "check" : "lock", 18)}</div>`
      + L.side.nodes.map(sn => `<a class="tnode side ${capped ? "" : "locked"}" style="left:${pct(sn.x)};top:${pctY(sn.y)}" href="#/side/${sn.p.id}" aria-label="${esc(tx(sn.p.title))}"><span class="tn-ico">${ico(capped ? sn.p.icon : "lock", 22)}</span><span class="tn-label c"><em>${es ? "Ruta alterna" : "Side path"}</em>${esc(tx(sn.p.title))}</span></a>`).join("") : "";
    return `<main class="page trail-page">${A.head(es ? "Mapa de tu ruta" : "Path trail map", "#/home")}
      <section class="card tight trail-head"><div class="row between"><div class="row gap-s">${ringSVG(pr.pct, 46)}<div><b>${pr.pct}%</b> <span class="sm muted">${pr.done}/${pr.total}</span><div class="sm muted">${esc(tx(PATH_LABELS[plan.pathId]))}</div></div></div>
        <span class="chip rank-chip" title="XP ${S.xp}">${rk.r.icon} ${esc(A.rankName(rk.r, true))}</span></div>
        <div class="trail-stages">${pr.stages.map(s => `<a href="#/board" data-zone="${s.id}" class="ts ${s.pct === 100 ? "full" : ""}" title="${esc(tx(STAGE_LABELS[s.id]))} ${s.pct}%"><span style="width:${s.pct}%"></span></a>`).join("")}</div></section>
      <div class="trail-wrap" id="trailWrap"><div class="trail" id="trail" style="aspect-ratio:${W} / ${L.H}">
        <svg class="trail-svg" viewBox="0 0 ${W} ${L.H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${zonesSvg}
          <path class="trail-path" d="${pathD(pts)}"/>${L.side.nodes.map(sn => { const last = pts[pts.length - 1] || [W / 2, 0]; return `<path class="trail-path side-branch" d="M${last[0]} ${last[1]} C${last[0]} ${(last[1] + sn.y) / 2} ${sn.x} ${(last[1] + sn.y) / 2} ${sn.x} ${sn.y}"/>`; }).join("")}<path class="trail-done" d="${pathD(pts.slice(0, doneUpTo + 1))}"/></svg>
        ${banners}${nodes}${sideHtml}<div class="token" id="token">${avatarSVG(S.avatar, 60)}</div></div></div>
      ${cur ? `<a class="btn primary big full sticky-cta" href="#/module/${cur.id}">${ico("play", 18)} ${es ? "Siguiente" : "Next"}: ${esc(tx(cur.title))}</a>` : `<div class="empty">${ico("trophy", 40)}<p>${es ? "¡Ruta completa!" : "Path complete!"}</p></div>`}
    </main>`;
  };

  A.bind.board = () => {
    const plan = A.plan(); if (!plan) return; const mods = A.boardModules(plan);
    const cur = A.nextModule(plan); const curIdx = cur ? mods.indexOf(cur) : mods.length - 1;
    const bf = A.boardFrom; A.boardFrom = null;
    const tok = $("#token"), trail = $("#trail"), wrap = $("#trailWrap"); if (!tok || !trail) return;
    const nodeEl = i => trail.querySelector(`.tnode[data-i="${i}"]`);
    const posOf = i => { const el = nodeEl(i); return el ? [el.offsetLeft + el.offsetWidth / 2 - 20, el.offsetTop - 50] : null; };
    let at = null; const Tr = (x, y) => `translate(${x}px, ${y}px)`;
    const place = (i, slide) => { const p = posOf(i); if (!p) return; tok.style.transition = slide ? "transform .45s ease-in-out" : "none"; tok.style.transform = Tr(p[0], p[1]); at = p; };
    /* real jump: crouch, then a true ballistic arc, squash on landing + dust puff + soft tap.
       Compositor-only WAAPI: the token travels x/y linearly while an inner wrapper rises and falls on the two exact
       parabola halves (cubic-bezier(.33,.66,.66,1) up, (.33,0,.66,.34) down = y = 4h·s(1−s)). A follow camera keeps the
       token below the sticky progress header during the whole flight; the token rides above the in-trail zone banners. */
    let air = tok.querySelector(".tok-air"); if (!air) { air = document.createElement("span"); air.className = "tok-air"; while (tok.firstChild) air.appendChild(tok.firstChild); tok.appendChild(air); }
    const headBottom = () => { let b = 0; document.querySelectorAll(".topbar, .trail-head").forEach(e => { const r = e.getBoundingClientRect(); if (r.height && getComputedStyle(e).position === "sticky") b = Math.max(b, r.bottom); }); return b; };
    let cam = 0, flying = 0;
    const camera = () => { cancelAnimationFrame(cam); let last = performance.now();
      const f = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; const r = air.getBoundingClientRect(), hb = headBottom() + 14, vh = window.innerHeight;
        const want = hb + (vh - hb) * 0.32; /* keep the token in the upper-middle band, ahead of the next node */
        let dy = r.top - want; if (r.top < hb) dy = r.top - hb - 6; /* never tuck under the header */
        if (Math.abs(dy) > 1) window.scrollBy(0, r.top < hb ? dy : dy * (1 - Math.exp(-dt * 7)));
        if (flying > 0 || Math.abs(dy) > 2) cam = requestAnimationFrame(f); };
      cam = requestAnimationFrame(f); };
    const hop = (i, dur) => new Promise(res => {
      const p = posOf(i); if (!p || !at) { place(i); return res(); } const [x0, y0] = at, [x1, y1] = p; at = p;
      const h = Math.min(58, 30 + Math.hypot(x1 - x0, y1 - y0) * 0.16), A0 = 0.18, A1 = 0.8, M = (A0 + A1) / 2;
      tok.style.transition = "none"; tok.style.transform = Tr(x1, y1); tok.classList.add("flying"); flying++; camera();
      const a = tok.animate([{ offset: 0, transform: Tr(x0, y0) }, { offset: A0, transform: Tr(x0, y0), easing: "linear" }, { offset: A1, transform: Tr(x1, y1) }, { offset: 1, transform: Tr(x1, y1) }], { duration: dur });
      air.animate([{ offset: 0, transform: "translateY(0)" }, { offset: A0, transform: "translateY(0)", easing: "cubic-bezier(.33,.66,.66,1)" }, { offset: M, transform: `translateY(${-h}px)`, easing: "cubic-bezier(.33,0,.66,.34)" }, { offset: A1, transform: "translateY(0)" }, { offset: 1, transform: "translateY(0)" }], { duration: dur });
      const svg = tok.querySelector(".avatar-svg"); if (svg) { svg.style.transformOrigin = "50% 100%";
        svg.animate([{ transform: "scale(1,1)", offset: 0 }, { transform: "scale(1.16,.8)", offset: A0 * .85, easing: "cubic-bezier(.2,.9,.3,1.3)" }, { transform: "scale(.9,1.12)", offset: A0 + .1 }, { transform: "scale(1,1)", offset: M }, { transform: "scale(.95,1.05)", offset: A1 - .02 }, { transform: "scale(1.2,.78)", offset: A1 + .05, easing: "cubic-bezier(.3,1.4,.5,1)" }, { transform: "scale(1,1)", offset: 1 }], { duration: dur }); }
      tok.classList.remove("hop"); void tok.offsetWidth; tok.classList.add("hop"); Sound.sfx("hop");
      setTimeout(() => { Sound.sfx("land"); const d = document.createElement("div"); d.className = "dust"; d.style.left = (x1 + 20) + "px"; d.style.top = (y1 + 58) + "px"; d.innerHTML = "<b></b><i></i><i></i><i></i><i></i><i></i>"; trail.appendChild(d); setTimeout(() => d.remove(), 760); }, dur * A1);
      const done = () => { flying = Math.max(0, flying - 1); if (!flying) tok.classList.remove("flying"); res(); }; a.onfinish = done; a.oncancel = done;
    });
    A.boardHop = hop; /* exposed for QA */
    /* ZONE COLOR-IN: a finished zone (all nodes + boss) floods from blueprint to full color in a 1.2 s radial sweep from the
       boss node, with a light ring, a rising chime + shimmer, glowing nodes and a "Zone: Complete" banner. Reduced motion = instant. */
    const LZ = layout(plan), prZ = A.progress(plan), zDone = new Set(prZ.stages.filter(s => s.pct === 100).map(s => s.id)); S.zColor = S.zColor || {};
    const zoneBanner = id => new Promise(res => { const es = S.lang === "es", zz = zoneOf(id); document.querySelectorAll(".tz-complete").forEach(x => x.remove());
      const d = document.createElement("div"); d.className = "tz-complete"; d.setAttribute("role", "status");
      d.innerHTML = `<span class="tzc-ico">${ico("trophy", 22)}</span><div><small>${esc(tx(STAGE_LABELS[id] || T("", "")))}</small><b>${esc(tx(zz.name))}: ${es ? "Completo" : "Complete"}</b></div>`;
      document.body.appendChild(d); requestAnimationFrame(() => d.classList.add("in")); setTimeout(() => { d.classList.remove("in"); d.classList.add("out"); setTimeout(() => d.remove(), 450); }, 2400); setTimeout(res, 1500); });
    const zoneColorIn = (id, opts = {}) => new Promise(res => {
      const g = trail.querySelector(`.tz-zone[data-z="${id}"]`), circ = g && g.querySelector("clipPath circle"); if (!g || !circ) return res();
      const R = +g.dataset.r, ring = g.querySelector(".tz-ring"), z = LZ.zones.find(x => x.id === id), idxs = z ? z.nodes.map(n => n.i) : [];
      S.zColor[id] = Date.now(); A.save();
      const lightNodes = stagger => idxs.forEach((i, k) => { const el = nodeEl(i); if (!el) return; setTimeout(() => { el.classList.add("zlit"); if (stagger) { el.classList.remove("zlit-in"); void el.offsetWidth; el.classList.add("zlit-in"); } }, stagger ? k * 60 : 0); });
      const finish = () => { g.classList.remove("pending"); g.classList.add("colored"); circ.setAttribute("r", R); };
      if (opts.silent) { finish(); lightNodes(false); return res(); }
      if (A.reduced()) { finish(); lightNodes(false); Sound.sfx("zonechime"); return zoneBanner(id).then(res); }
      const bossEl = z && nodeEl(z.nodes[z.nodes.length - 1].i); if (bossEl && !opts.noScroll) bossEl.scrollIntoView({ block: "center", behavior: "smooth" });
      setTimeout(() => { g.classList.add("sweeping"); Sound.sfx("zonechime"); A.haptic && A.haptic("unlock"); const t0 = performance.now(), DUR = 1200;
        if (bossEl) { bossEl.classList.remove("zlit-in"); void bossEl.offsetWidth; bossEl.classList.add("zlit", "zlit-in"); }
        const f = now => { const k = Math.max(0, Math.min(1, (now - t0) / DUR)), e = 1 - Math.pow(1 - k, 3); circ.setAttribute("r", (R * e).toFixed(1));
          if (ring) { ring.setAttribute("r", (R * Math.min(1, e * 1.04)).toFixed(1)); ring.style.opacity = (1 - k) * 0.9; }
          if (k < 1) requestAnimationFrame(f); else { finish(); g.classList.remove("sweeping"); if (ring) ring.style.opacity = 0; } };
        requestAnimationFrame(f); setTimeout(() => lightNodes(true), 350); setTimeout(() => zoneBanner(id).then(res), 700); }, bossEl && !opts.noScroll ? 520 : 60);
    });
    A.zoneColorIn = zoneColorIn; /* exposed for QA / montage */
    const runColor = () => { const pend = LZ.zones.filter(z => zDone.has(z.id) && !S.zColor[z.id]).map(z => z.id); if (!pend.length) return Promise.resolve();
      pend.slice(0, -1).forEach(id => zoneColorIn(id, { silent: true })); return zoneColorIn(pend[pend.length - 1]); };
    const fromIdx = bf && bf.mod ? Math.max(0, mods.findIndex(m => m.id === bf.mod)) : curIdx;
    place(fromIdx, false);
    const center = (i, smooth) => { const el = nodeEl(i); if (el) el.scrollIntoView({ block: "center", behavior: smooth && !A.reduced() ? "smooth" : "auto" }); };
    document.querySelectorAll(".trail-stages [data-zone]").forEach(a => a.onclick = e => { e.preventDefault(); const z = [...document.querySelectorAll(".tz-banner")][[...a.parentNode.children].indexOf(a)]; if (z) z.scrollIntoView({ block: "start", behavior: A.reduced() ? "auto" : "smooth" }); });
    if (!(bf && fromIdx !== curIdx)) { center(curIdx, false); setTimeout(runColor, 700); return; }
    let steps = []; for (let i = fromIdx + 1; i <= curIdx; i++) steps.push(i);
    if (A.reduced()) { center(curIdx, false); setTimeout(() => place(curIdx, true), 400); setTimeout(runColor, 600); return; }
    /* completion: zoom out around the token, settle back in, then hop one node per step (~1.5 s cap) */
    center(fromIdx, false);
    const el = nodeEl(fromIdx); if (el) wrap.style.transformOrigin = `50% ${el.offsetTop + el.offsetHeight / 2}px`;
    requestAnimationFrame(() => wrap.classList.add("zoomed-out"));
    setTimeout(() => wrap.classList.remove("zoomed-out"), 1000);
    if (steps.length > 6) { const skip = steps[steps.length - 7]; steps = steps.slice(-6); setTimeout(() => place(skip, false), 1480); }
    const dur = Math.max(230, Math.min(520, 1400 / steps.length)); /* one hop per node, ≤ ~1.5 s total */
    /* the follow camera (not scrollIntoView) leads the hops, so the first apex never slides under the sticky header */
    setTimeout(() => { steps.reduce((pr, i) => pr.then(() => hop(i, dur)), Promise.resolve()).then(() => setTimeout(runColor, 250)); }, 1550);
  };
})();
