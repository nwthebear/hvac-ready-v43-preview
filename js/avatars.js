/* Original layered SVG work-crew figures (blocky toy style, our own proportions).
   avatarSVG(cfgOrPresetId, size, { mode: "full" | "bust", frozen }) → markup.
   Config is plain data so it saves in localStorage and can sync to a backend later. */
(function () {
  const SKINS = ["#FAD9C1", "#F2C4A0", "#E3AA7F", "#C98B5F", "#A86B47", "#83502F", "#603A24", "#43291B"];
  const HAIR_COLORS = ["#1F1A17", "#4A2F1D", "#7A4B26", "#B8823F", "#E1C07A", "#A6402A", "#9AA0A6", "#E9E6DF"];
  const COLORS = ["#1E5AA8", "#0E1B2C", "#C62828", "#2E7D32", "#F57C00", "#6A3FA0", "#546E7A", "#ECEFF1", "#8D6E63", "#00838F"];
  const HAT_COLORS = ["#FFFFFF", "#FFC72C", "#FF7A1A", "#1E6FD9", "#2E9E4F", "#D32F2F", "#0E1B2C"];
  const HIVIS = ["#D7F22C", "#FF7A1A", "#FFE23B"];
  const PANTS = ["#35537F", "#8C7A57", "#5B6A45", "#2E3338", "#6D4C41"];
  const BOOTS = { brown: "#7A4A28", black: "#2A2A2C", tan: "#B78A52", new: "#D9A24E" };
  const OPT = {
    body: ["a", "b"], hair: ["short", "buzz", "curly", "long", "bun", "ponytail", "braids", "none"], facial: ["none", "stubble", "mustache", "goatee", "beard", "fumanchu"],
    head: ["hardhat", "newhat", "ballcap", "backwards", "beanie", "none"], top: ["tee", "work", "hivis", "hoodie"],
    pants: ["work", "cargo"], boots: ["brown", "black", "tan", "new"], tool: ["none", "wrench", "gauges", "drill", "clipboard"]
  };
  const DEF = { skin: SKINS[2], hair: "short", hairColor: HAIR_COLORS[1], facial: "none", glasses: true, head: "hardhat", headColor: HAT_COLORS[1], top: "tee", topColor: COLORS[0], pantsColor: PANTS[0], pants: "work", boots: "brown", tool: "wrench", shades: "none", belt: "none", body: "a", lanyard: false, shadow: false };
  const PRESETS = [
    { id: "service", name: { en: "Service Tech", es: "Técnico de servicio" }, cfg: { skin: SKINS[2], hair: "short", hairColor: HAIR_COLORS[1], facial: "stubble", glasses: true, head: "ballcap", headColor: HAT_COLORS[3], top: "work", topColor: COLORS[1], pants: "work", pantsColor: PANTS[1], boots: "brown", tool: "gauges" } },
    { id: "installer", name: { en: "Installer", es: "Instalador" }, cfg: { skin: SKINS[4], hair: "buzz", hairColor: HAIR_COLORS[0], facial: "goatee", glasses: true, head: "hardhat", headColor: HAT_COLORS[0], top: "hivis", topColor: HIVIS[1], pants: "cargo", pantsColor: PANTS[2], boots: "black", tool: "drill" } },
    { id: "apprentice", name: { en: "Apprentice", es: "Aprendiz" }, cfg: { skin: SKINS[1], hair: "curly", hairColor: HAIR_COLORS[5], facial: "none", glasses: true, head: "beanie", headColor: HAT_COLORS[2], top: "hoodie", topColor: COLORS[6], pants: "work", pantsColor: PANTS[0], boots: "tan", tool: "wrench" } },
    { id: "commercial", name: { en: "Commercial Tech", es: "Técnica comercial" }, cfg: { body: "b", skin: SKINS[5], hair: "bun", hairColor: HAIR_COLORS[0], facial: "none", glasses: true, head: "hardhat", headColor: HAT_COLORS[3], top: "hivis", topColor: HIVIS[0], pants: "work", pantsColor: PANTS[3], boots: "black", tool: "clipboard" } },
    { id: "foreman", name: { en: "Foreman", es: "Mayordomo" }, cfg: { skin: SKINS[0], hair: "short", hairColor: HAIR_COLORS[6], facial: "mustache", shadow: true, glasses: false, head: "hardhat", headColor: HAT_COLORS[0], top: "work", topColor: COLORS[0], pants: "work", pantsColor: PANTS[1], boots: "brown", tool: "clipboard" } },
    { id: "rookie", name: { en: "Day-One Rookie", es: "Novato de primer día" }, cfg: { skin: SKINS[1], hair: "short", hairColor: HAIR_COLORS[3], facial: "none", glasses: true, head: "newhat", headColor: HAT_COLORS[4], top: "hivis", topColor: HIVIS[2], pants: "work", pantsColor: PANTS[0], boots: "new", tool: "clipboard", belt: "newbelt", lanyard: true, shades: "none" } },
    { id: "lead", name: { en: "Lead Tech", es: "Técnica líder" }, cfg: { body: "b", skin: SKINS[6], hair: "ponytail", hairColor: HAIR_COLORS[0], facial: "none", glasses: true, head: "ballcap", headColor: HAT_COLORS[1], top: "work", topColor: COLORS[9], pants: "work", pantsColor: PANTS[3], boots: "black", tool: "gauges" } },
    { id: "classic", name: { en: "Classic Tech", es: "Técnico clásico" }, cfg: { skin: SKINS[3], hair: "short", hairColor: HAIR_COLORS[0], facial: "fumanchu", shadow: true, glasses: false, head: "ballcap", headColor: HAT_COLORS[6], top: "work", topColor: COLORS[8], pants: "work", pantsColor: PANTS[3], boots: "black", tool: "gauges" } },
    { id: "veteran", name: { en: "Veteran", es: "Veterano" }, cfg: { skin: SKINS[7], hair: "none", hairColor: HAIR_COLORS[0], facial: "beard", glasses: true, head: "hardhat", headColor: HAT_COLORS[2], top: "tee", topColor: COLORS[1], pants: "cargo", pantsColor: PANTS[4], boots: "brown", tool: "wrench" } }
  ];
  /* old round-face avatar ids → closest new preset (keeps returning users' look in spirit) */
  const LEGACY = { hardhat: "installer", wrench: "service", gauge: "service", flame: "apprentice", snow: "commercial", goggles: "lead", bolt: "rookie", fan: "apprentice", toolbox: "foreman", thermo: "lead", cap: "rookie", robot: "veteran" };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  window.normalizeAvatar = v => {
    if (v && typeof v === "object") return Object.assign({}, DEF, v);
    const p = PRESETS.find(x => x.id === (LEGACY[v] || v)); return Object.assign({}, DEF, p ? p.cfg : {});
  };
  window.randomAvatar = () => { const top = pick(OPT.top); return { body: pick(OPT.body), skin: pick(SKINS), hair: pick(OPT.hair), hairColor: pick(HAIR_COLORS), facial: Math.random() < .5 ? "none" : pick(OPT.facial), glasses: Math.random() < .6, head: pick(OPT.head), headColor: pick(HAT_COLORS), top, topColor: top === "hivis" ? pick(HIVIS) : pick(COLORS), pants: pick(OPT.pants), pantsColor: pick(PANTS), boots: pick(OPT.boots), tool: pick(OPT.tool) }; };
  window.AVATAR_DATA = { SKINS, HAIR_COLORS, COLORS, HAT_COLORS, HIVIS, PANTS, OPT, PRESETS, DEF };
  window.AVATARS = PRESETS.map(p => ({ id: p.id, name: p.name })); // kept for older code paths

  const hex = h => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const mix = (h, t, a) => { const c = hex(h), d = t === "w" ? [255, 255, 255] : [0, 0, 0]; return "#" + c.map((v, i) => Math.round(v + (d[i] - v) * a).toString(16).padStart(2, "0")).join(""); };
  const dk = (h, a = .22) => mix(h, "k", a), lt = (h, a = .2) => mix(h, "w", a);
  const lum = h => { const [r, g, b] = hex(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  const rr = (x, y, w, h, r) => `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
  let N = 0;

  window.avatarSVG = function (input, size = 64, opts = {}) {
    const c = normalizeAvatar(input), id = "av" + (++N), mode = opts.mode || "full";
    const OL = `stroke="rgba(16,24,36,.42)" stroke-width="1.1" stroke-linejoin="round"`;
    const SH = `url(#${id}s)`; // shared side-shading overlay
    const part = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${OL} ${extra}/><path d="${d}" fill="${SH}" pointer-events="none"/>`;
    const skin = c.skin, skinD = dk(skin, .16), hairC = c.hairColor;
    const sleeveLong = c.top === "work" || c.top === "hoodie";
    const shirt = c.top === "hivis" ? "#3A4650" : c.topColor;
    // ---- legs + boots
    const pc = c.pantsColor, bc = BOOTS[c.boots] || BOOTS.brown;
    const leg = (x, cls) => `<g class="${cls}">${part(rr(x, 99, 18, 33, 4), pc)}${c.pants === "cargo" ? `<path d="${rr(x + (cls.includes("L") ? 1 : 9), 110, 8, 9, 2)}" fill="${dk(pc, .14)}" ${OL}/>` : `<path d="M${x + 9} 102v26" stroke="${dk(pc, .25)}" stroke-width=".8" opacity=".6"/>`}
      <g class="av-boot">${part(`M${x - 2} 131h20q3 0 3 3v5q0 2-2 2h-21q-2 0-2-2v-6q0-2 2-2z`, bc)}<path d="M${x - 2} 138.5h23" stroke="${dk(bc, .4)}" stroke-width="2.6"/><path d="M${x + 4} 132.5l6 0M${x + 4} 135l6 0" stroke="${lt(bc, .35)}" stroke-width=".9"/>${c.boots === "new" ? `<path d="M${x + 12} 132.6q4 .2 5.2 3" stroke="#fff" stroke-opacity=".85" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M${x} 132.8h2.5" stroke="#fff" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/><path d="M${x - 2} 138.5h23" stroke="#F4EBDD" stroke-width="2.6"/><path d="M${x + 18.5} 129.5l.7 1.5 1.6.3-1.2 1 .3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1 1.6-.3z" fill="#FFF8D6"/>` : ""}</g></g>`;
    const legs = leg(31, "av-legL") + leg(51, "av-legR");
    // ---- torso
    const B = c.body === "b"; /* Style B: slightly tapered torso, softer face; same joints so every outfit/gear fits both */
    const torsoD = B ? "M31.5 58q0-4 4-4h29q4 0 4 4l-3.4 20 2.4 21h-35l2.4-21z" : "M30 58q0-4 4-4h32q4 0 4 4l-1.5 41h-37z";
    let torso = part(torsoD, shirt);
    if (c.top === "tee") torso += `<path d="M43 54q7 6 14 0" fill="none" stroke="${dk(shirt, .3)}" stroke-width="2"/>`;
    if (c.top === "work") torso += `<path d="M42 54l8 8 8-8" fill="${lt(shirt, .12)}" ${OL}/><path d="M50 62v36" stroke="${dk(shirt, .3)}" stroke-width="1"/>${[68, 76, 84, 92].map(y => `<circle cx="50" cy="${y}" r="1" fill="${dk(shirt, .4)}"/>`).join("")}<path d="${rr(35, 66, 10, 8, 1.5)}" fill="${dk(shirt, .08)}" ${OL}/><path d="${rr(55, 66, 10, 8, 1.5)}" fill="${dk(shirt, .08)}" ${OL}/>`;
    if (c.top === "hoodie") torso += `<path d="M36 55q14 10 28 0q0 6-14 9q-14-3-14-9z" fill="${dk(shirt, .18)}" ${OL}/><path d="M46 62v10M54 62v10" stroke="${lt(shirt, .5)}" stroke-width="1.2" stroke-linecap="round"/><path d="M38 84q12-5 24 0v10h-24z" fill="${dk(shirt, .1)}" ${OL}/>`;
    if (c.top === "hivis") { const v = c.topColor; torso += `<path d="M30 58q0-4 4-4h7l9 16 9-16h7q4 0 4 4l-1.5 41h-37z" fill="${v}" ${OL}/><path d="M30 58q0-4 4-4h7l9 16 9-16h7q4 0 4 4l-1.5 41h-37z" fill="${SH}"/>
      <path d="M31 82h38M31 90h38" stroke="#E7ECEF" stroke-width="3.4"/><path d="M31 82h38M31 90h38" stroke="#AEB8BE" stroke-width=".8" stroke-dasharray="2 2"/><path d="M37 55l9 17M63 55l-9 17" stroke="#E7ECEF" stroke-width="2.6"/>`; }
    // belt
    torso += `<path d="${rr(30, 95, 40, 6, 1.5)}" fill="#2B2620"/><path d="${rr(46, 95.5, 8, 5, 1)}" fill="#C9A54A" stroke="#7d6420" stroke-width=".6"/>`;
    if (c.pants === "crackproof") torso += `<path d="M31 80h38l-.6 19h-36.8z" fill="${pc}" ${OL}/><path d="M31 80h38l-.6 19h-36.8z" fill="${SH}"/><path d="M36 80L38 55M64 80L62 55" stroke="${dk(pc, .25)}" stroke-width="3.2" stroke-linecap="round"/><circle cx="37" cy="81" r="1.6" fill="#C9A54A"/><circle cx="63" cy="81" r="1.6" fill="#C9A54A"/><path d="${rr(43, 84, 14, 9, 1.5)}" fill="${dk(pc, .1)}" ${OL}/><path d="M33 96h34" stroke="${lt(pc, .25)}" stroke-width="1" stroke-dasharray="2 1.5"/>`;
    if (c.belt === "toolbelt") torso += `<path d="${rr(29, 94, 42, 7, 2)}" fill="#6B4A2B" ${OL}/><path d="M24 97h12l-1 15q0 3-3 3h-6q-3 0-3-3z" fill="#8A6038" ${OL}/><path d="M64 97h12l-1 15q0 3-3 3h-6q-3 0-3-3z" fill="#8A6038" ${OL}/><path d="M27 103h7M67 103h7" stroke="#5A3D22" stroke-width="1"/><path d="M28 97v-6M31 97v-8" stroke="#9AA7B0" stroke-width="1.8"/><path d="M68 97v-5" stroke="#F2C230" stroke-width="2.2"/><path d="M72 97v-7" stroke="#455A64" stroke-width="1.6"/><path d="M25 108l2 1M70 110l2-1" stroke="#C9A980" stroke-width=".8"/>`;
    if (c.belt === "newbelt") torso += `<path d="${rr(29, 94, 42, 7, 2)}" fill="#C08A4E" ${OL}/><path d="${rr(46, 95, 8, 5, 1)}" fill="#E3E8EC" stroke="#8D99A3" stroke-width=".6"/><path d="M24 97h12l-1 15q0 3-3 3h-6q-3 0-3-3z" fill="#D6A162" ${OL}/><path d="M64 97h12l-1 15q0 3-3 3h-6q-3 0-3-3z" fill="#D6A162" ${OL}/><path d="M26 99q4-1 6 0M66 99q4-1 6 0" stroke="#fff" stroke-opacity=".55" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M30 97v-5" stroke="#E53935" stroke-width="2.2"/><path d="M76 104l4 3" stroke="#B0BEC5" stroke-width=".7"/><path d="M79 105.5l5.5 2.2-1.6 4-5.5-2.2z" fill="#FFF3C4" stroke="#8D6E63" stroke-width=".6"/><circle cx="79.6" cy="106.6" r=".6" fill="#8D6E63"/>`;
    if (c.lanyard) torso += `<path d="M42 55l6 18M58 55l-6 18" stroke="#1E6FD9" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M48.5 72h3v2.5h-3z" fill="#9AA7B0"/><g transform="rotate(-4 50 80)"><path d="${rr(43.5, 74, 13, 15, 1.6)}" fill="#FAFAF5" ${OL}/><path d="${rr(43.5, 74, 13, 3.6, 1.2)}" fill="#2E9E4F"/><path d="${rr(45.3, 78.8, 4.4, 5, .8)}" fill="#CFD8DC"/><circle cx="47.5" cy="80.4" r="1.2" fill="#90A4AE"/><path d="M51 80h4M51 82h3" stroke="#90A4AE" stroke-width=".8"/><path d="M45.5 86.4h9" stroke="#2E9E4F" stroke-width="1.2"/><path d="M53.6 84.2l.6 1.2 1.3.2-1 .9.3 1.3-1.2-.6-1.2.6.3-1.3-1-.9 1.3-.2z" fill="#F2C230"/></g>`;
    // ---- arms (arm group pivots at shoulder)
    const arm = (side) => { const L = side === "L", x = L ? 18 : 70, rot = L ? 7 : -7, px = L ? 27 : 73;
      const sl = sleeveLong ? part(rr(x, 57, 12, 33, 6), shirt) + `<path d="${rr(x, 85, 12, 5, 2)}" fill="${dk(shirt, .2)}" ${OL}/>` : part(rr(x, 57, 12, 33, 6), skin) + part(`M${x} 63q0-6 6-6q6 0 6 6v8h-12z`, shirt);
      const hand = `<g class="av-hand">${part(`M${x - .5} 89q0-3 3-3h7q3 0 3 3v4q0 5-6.5 5q-6.5 0-6.5-5z`, skin)}<path d="M${x + 2.5} 92.5h7" stroke="${skinD}" stroke-width=".9" stroke-linecap="round"/></g>`;
      return `<g class="av-arm${side}" style="transform-origin:${px}px 60px"><g transform="rotate(${rot} ${px} 60)">${sl}${hand}${toolFor(side)}</g></g>`; };
    const toolFor = side => {
      if (c.tool === "clipboard" && side === "L") return `<g transform="translate(9 78) rotate(-8)"><path d="${rr(0, 0, 17, 22, 2)}" fill="#A0703D" ${OL}/><path d="${rr(2.5, 3.5, 12, 16, 1)}" fill="#FAFAF5"/><path d="M5 8h7M5 11h7M5 14h5" stroke="#90A4AE" stroke-width="1"/><path d="${rr(5.5, -1.5, 6, 4, 1)}" fill="#B0BEC5" ${OL}/></g>`;
      if (side !== "R") return "";
      if (c.tool === "wrench") return `<g transform="translate(79 93) rotate(14)"><path d="${rr(-2.2, -24, 4.4, 26, 2)}" fill="#9AA7B0" ${OL}/><path d="M-6 -27a6 6 0 1 1 12 0l-2.6 0v-4.5h-6.8v4.5z" fill="#B7C2C9" ${OL}/></g>`;
      if (c.tool === "gauges") return `<g transform="translate(70 84)"><path d="${rr(0, 6, 22, 9, 3)}" fill="#37474F" ${OL}/><circle cx="6" cy="5" r="6" fill="#1E88E5" ${OL}/><circle cx="6" cy="5" r="4" fill="#fff"/><path d="M6 5l2-2.5" stroke="#263238" stroke-width="1"/><circle cx="17" cy="5" r="6" fill="#E53935" ${OL}/><circle cx="17" cy="5" r="4" fill="#fff"/><path d="M17 5l-2-2.5" stroke="#263238" stroke-width="1"/></g>`;
      if (c.tool === "thermos") return `<g transform="translate(73 76) rotate(6)"><path d="${rr(0, 4, 13, 24, 3)}" fill="#3F6B4A" ${OL}/><path d="M2 10h9M2 22h9" stroke="#2C4C34" stroke-width="1.1"/><path d="M4 14q2 1 1 4" stroke="#7FA487" stroke-width="1" fill="none"/><path d="M9 6l2 3" stroke="#2C4C34" stroke-width="1"/><path d="${rr(1.5, -1, 10, 6, 2)}" fill="#2E3338" ${OL}/><path d="M13 9q4 1 4 6t-4 6" fill="none" stroke="#2E3338" stroke-width="2"/></g>`;
      if (c.tool === "diymug") return `<g transform="translate(73 82)"><path d="${rr(0, 0, 12, 14, 2)}" fill="#E8E2D2" ${OL}/><path d="M12 3.5q5 0 5 4t-5 4" fill="none" stroke="#1D1F1C" stroke-width="1.6"/><path d="M2 5h8" stroke="#C0612B" stroke-width="1.6"/><path d="M3 -2q1-2 0-4M7 -2q1-2 0-4" stroke="#B9AE98" stroke-width="1" fill="none"/></g>`;
      if (c.tool === "bbqtongs") return `<g transform="translate(77 90) rotate(18)"><path d="M-1 -2l-3 -26M2 -2l4 -26" stroke="#B0BEC5" stroke-width="2.2" stroke-linecap="round"/><path d="${rr(-3, -3, 7, 10, 2)}" fill="#2B2B2B" ${OL}/><path d="M-5 -29l3 -1M5 -29l3 1" stroke="#90A4AE" stroke-width="2" stroke-linecap="round"/></g>`;
      if (c.tool === "energycan") return `<g transform="translate(74 82)"><path d="${rr(0, 0, 10, 17, 2)}" fill="#1D1F1C" ${OL}/><path d="M0 5h10v4H0z" fill="#9BE22D"/><path d="M3 11l2-2 1 3 2-3" stroke="#9BE22D" stroke-width="1" fill="none"/><path d="M1 0h8" stroke="#B0BEC5" stroke-width="1.6"/></g>`;
      if (c.tool === "luckydriver") return `<g transform="translate(78 94) rotate(12)"><path d="${rr(-3, -12, 6, 13, 2.5)}" fill="#F2C230" ${OL}/><path d="M-3 -8h6M-3 -4h6" stroke="#1D1F1C" stroke-width="1.6"/><path d="M-3 -10.5h6" stroke="#C0C7CC" stroke-width="2" opacity=".8"/><path d="M-1 -12v-15h2v15z" fill="#B7C2C9" ${OL}/><path d="M-1.6 -27h3.2l-1.6 -3z" fill="#9AA7B0"/></g>`;
      if (c.tool === "drill") return `<g transform="translate(72 80)"><path d="M0 2q0-3 3-3h14q3 0 3 3v4q0 3-3 3h-14z" fill="#F57C00" ${OL}/><path d="M20 2.5h5v3h-5z" fill="#455A64"/><path d="M25 3.5h5v1h-5z" fill="#B0BEC5"/><path d="M6 9h7l-1 11h-5z" fill="#263238" ${OL}/><path d="${rr(4, 19, 11, 6, 1.5)}" fill="#37474F" ${OL}/></g>`;
      return "";
    };
    // ---- head
    const head = `<path d="M44 49h12v8h-12z" fill="${skinD}"/>${part(rr(26.5, 26, 5, 10, 2.5), skin)}${part(rr(68.5, 26, 5, 10, 2.5), skin)}${part(B ? rr(30, 11, 40, 40, 16) : rr(29, 11, 42, 40, 13), skin)}<path d="M33 16q4-3 9-3" stroke="#fff" stroke-opacity=".45" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    const hairBack = c.hair === "long" ? part(rr(26, 18, 9, 34, 4.5), hairC) + part(rr(65, 18, 9, 34, 4.5), hairC)
      : c.hair === "ponytail" ? part("M66 17q12 1 13 15q1 13-5 22q-1-11-5-18q-3-6-5-12z", hairC) + `<path d="${rr(65.5, 16.5, 6, 5, 2)}" fill="${dk(hairC, .35)}"/>`
      : c.hair === "braids" ? [27, 73].map(x => [30, 37, 44, 51].map((y, i) => `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="4.2" fill="${hairC}" ${OL}/>`).join("") + `<path d="M${x - 2} 55.5h4" stroke="${dk(hairC, .4)}" stroke-width="2"/><path d="M${x} 56v4" stroke="${hairC}" stroke-width="2.4" stroke-linecap="round"/>`).join("") : "";
    const hairTop = { short: `M29 25q0-14 21-14q21 0 21 14v-1q-6-5-14-5l-2 3-3-3q-8 0-14 2q-6 2-9 4z`, buzz: `M30 22q2-11 20-11q18 0 20 11q-8-5-20-5q-12 0-20 5z`, curly: "", long: `M28 27q0-16 22-16q22 0 22 16q-9-8-22-8q-13 0-22 8z`, bun: `M29 25q0-14 21-14q21 0 21 14q-8-7-21-7q-13 0-21 7z`, ponytail: `M29 25q0-14 21-14q21 0 21 14q-9-7-21-7q-12 0-21 7z`, braids: `M29 26q0-15 21-15q21 0 21 15q-4-6-10-7l-11 4-11-4q-6 1-10 7z`, none: "" }[c.hair];
    const backFirst = c.hair === "ponytail" || c.hair === "braids"; let hair = backFirst ? "" : hairBack;
    if (c.hair === "curly") hair += [32, 38, 44, 50, 56, 62, 68].map((x, i) => `<circle cx="${x}" cy="${15 + (i % 2) * 2}" r="5.5" fill="${hairC}" ${OL}/>`).join("") + [35, 65].map(x => `<circle cx="${x}" cy="22" r="4" fill="${hairC}"/>`).join("");
    else if (hairTop) hair += part(hairTop, hairC, c.hair === "buzz" ? `fill-opacity=".8"` : "");
    if (c.hair === "bun") hair += part("M44 8a6 6 0 1 1 12 0a6 6 0 1 1-12 0z", hairC);
    if (c.hair !== "none" && c.hair !== "curly") hair += `<path d="M29.5 26h3v7h-3zM67.5 26h3v7h-3z" fill="${hairC}" opacity=".9"/>`;
    // face
    const browY = 27;
    let face = `<path d="M38 ${browY}q4-2 8 0M54 ${browY}q4-2 8 0" stroke="${c.hair === "none" ? dk(skin, .45) : dk(hairC, .1)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <ellipse cx="42" cy="33" rx="2.6" ry="3.1" fill="#1B2230"/><ellipse cx="58" cy="33" rx="2.6" ry="3.1" fill="#1B2230"/><circle cx="43" cy="32" r=".9" fill="#fff"/><circle cx="59" cy="32" r=".9" fill="#fff"/>
      <circle cx="37" cy="40" r="3" fill="#FF8A80" opacity=".28"/><circle cx="63" cy="40" r="3" fill="#FF8A80" opacity=".28"/>
      <path d="M44.5 41.5q5.5 4.5 11 0" stroke="#3A2320" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    if (B) face += `<path d="M39 30.6l-1.6-1.4M61 30.6l1.6-1.4" stroke="#1B2230" stroke-width="1.1" stroke-linecap="round"/>`;
    const fh = dk(hairC === "#E9E6DF" ? "#C9C5BD" : hairC, 0);
    if (c.facial === "stubble") face += `<path d="M31 38q1 12 12 12h14q11 0 12-12q-3 6-9 6q-5-3-10-3q-5 0-10 3q-6 0-9-6z" fill="${fh}" opacity=".22"/>`;
    if (c.shadow && c.facial !== "stubble" && c.facial !== "beard") face += `<path d="M30.5 33q.5 13 12.5 17h14q12-4 12.5-17q-2 7-8 9.5q-5-2.6-11.5-2.6q-6.5 0-11.5 2.6q-6-2.5-8-9.5z" fill="${fh}" opacity=".27"/><path d="M33 40l.6 1M36 44l.6.8M64 44l.6-.8M67 40l.6-1M40 47.5l.5.5M60 47.5l.5-.5M44 49.5h.8M55.5 49.5h.8" stroke="${fh}" stroke-opacity=".35" stroke-width=".7" stroke-linecap="round"/>`;
    if (c.facial === "beard") face += part("M30 34v4q0 13 13 13h14q13 0 13-13v-4q-3 7-10 8q-4-3-10-3q-6 0-10 3q-7-1-10-8z", fh) + `<path d="M45 43.5q5 2.5 10 0" stroke="#3A2320" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    if (c.facial === "mustache" || c.facial === "goatee" || c.facial === "beard") face += `<path d="M42.5 40q7.5-4 15 0q-2 2.6-7.5 1.2q-5.5 1.4-7.5-1.2z" fill="${fh}" ${OL}/>`;
    if (c.facial === "fumanchu") { const fmp = "M50 38.8q-4-1.4-7.6.2q-1.6.8-1.9 2.6l-.5 11.2q0 1.5 1.1 1.5q1.1 0 1.1-1.5l.4-9.8q.3-1.4 1.8-1.6q3-.4 5.6.2z"; face += `<path d="${fmp}" fill="${fh}" ${OL}/><path d="${fmp}" fill="${fh}" ${OL} transform="matrix(-1 0 0 1 100 0)"/><path d="M43.5 39.7q3-.9 5.5.1" stroke="#fff" stroke-opacity=".25" stroke-width=".8" fill="none" stroke-linecap="round"/>`; }
    if (c.facial === "goatee") face += `<path d="${rr(46, 44.5, 8, 6.5, 3)}" fill="${fh}" ${OL}/>`;
    if (c.glasses && c.shades !== "gasshades") face += `<path d="M30.5 32.5h3M66.5 32.5h3" stroke="#263238" stroke-width="1.6"/><path d="${rr(33, 28.5, 34, 9, 4)}" fill="#9AD8F5" fill-opacity=".38" stroke="#263238" stroke-width="1.4"/><path d="M36 30.5l6 0" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`;
    if (c.shades === "gasshades") face += `<path d="M29.5 31.5h4M66.5 31.5h4" stroke="#1D1F1C" stroke-width="1.8"/><path d="M33 28h15q1 0 1 1.5q-.5 6-7.5 6.5q-8 0-8.5-6.5q0-1.5 0-1.5zM52 28h15q0 0 0 1.5q-.5 6.5-8.5 6.5q-7-.5-7.5-6.5q0-1.5 1-1.5z" fill="#1F2A30" stroke="#0E1316" stroke-width="1.3"/><path d="M49 29.5h2" stroke="#0E1316" stroke-width="1.4"/><path d="M35.5 29.5l5 0M54.5 29.5l4 0" stroke="#7FD3E8" stroke-width="1" opacity=".7"/><path d="${rr(60.5, 31, 5, 3, .6)}" fill="#FF7A1A"/>`;
    // headwear
    const hc = c.headColor; let hat = "";
    if (c.head === "hardhat") hat = part("M27 24q0-20 23-20q23 0 23 20z", hc) + `<path d="${rr(46.5, 3.5, 7, 20, 3.5)}" fill="${lt(hc, .25)}" ${OL}/>` + part(rr(22, 21.5, 56, 6, 3), dk(hc, .12)) + `<path d="M33 12q5-5 12-6" stroke="#fff" stroke-opacity=".5" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    if (c.head === "newhat") hat = part("M27 24q0-20 23-20q23 0 23 20z", hc) + `<path d="${rr(46.5, 3.5, 7, 20, 3.5)}" fill="${lt(hc, .3)}" ${OL}/>` + part(rr(22, 21.5, 56, 6, 3), dk(hc, .1)) + `<path d="M32 13q5-6 13-7.5" stroke="#fff" stroke-opacity=".85" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M59 8q4 1.5 6.5 5" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="${rr(56, 12, 11, 6.5, 1.4)}" fill="#FAFAF5" stroke="#455A64" stroke-width=".7"/><path d="M58 15.2h7" stroke="#2E9E4F" stroke-width="1.4"/><path d="M72 23.5l3.5 5" stroke="#B0BEC5" stroke-width=".7"/><path d="M74 28.2l5 1-1 4.6-5-1z" fill="#FFF3C4" stroke="#8D6E63" stroke-width=".6"/><circle cx="74.6" cy="29.2" r=".6" fill="#8D6E63"/><path d="M40 6.5l.8 1.7 1.8.3-1.3 1.2.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3z" fill="#FFFDF0"/>`;
    if (c.head === "goldhat") { const g = "#D9AE48"; hat = part("M27 24q0-20 23-20q23 0 23 20z", g) + `<path d="${rr(46.5, 3.5, 7, 20, 3.5)}" fill="#F3D27A" ${OL}/>` + part(rr(22, 21.5, 56, 6, 3), "#B58A2C") + `<path d="M32 13q6-6 14-7" stroke="#FFF6D8" stroke-opacity=".8" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M62 10l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="#FFF3D0"/>`; }
    if (c.head === "ballcap") hat = part("M28 23q0-16 22-16q22 0 22 16z", hc) + part("M25 22q25-5 50 0l3 5q-28-3-56 0z", dk(hc, .15)) + `<circle cx="50" cy="7.5" r="2" fill="${dk(hc, .25)}"/><path d="M50 8v14" stroke="${dk(hc, .2)}" stroke-width=".8"/>`;
    if (c.head === "backwards") hat = part("M37 9q13-8 26 0l-1 3q-12-6-24 0z", dk(hc, .2)) + part("M28 24q0-16 22-16q22 0 22 16z", hc) + `<path d="M43 24q0-6 7-6q7 0 7 6z" fill="${c.hair === "none" ? skin : hairC}" ${OL}/><path d="M41 24.5h18" stroke="${dk(hc, .3)}" stroke-width="2"/>`;
    if (c.head === "beanie") hat = part("M28 25q0-21 22-21q22 0 22 21z", hc) + part(rr(27, 19, 46, 8, 4), dk(hc, .14)) + [33, 39, 45, 51, 57, 63].map(x => `<path d="M${x + 2} 20v6" stroke="${dk(hc, .3)}" stroke-width=".8"/>`).join("") + `<circle cx="50" cy="4" r="4" fill="${lt(hc, .25)}" ${OL}/>`;
    const headG = `<g class="av-head">${backFirst ? hairBack : ""}${head}${c.head === "none" ? hair : (c.hair === "long" ? hairBack : "") + `<path d="M29.5 24h3v9h-3zM67.5 24h3v9h-3z" fill="${hairC}" opacity="${c.hair === "none" ? 0 : .9}"/>`}${face}${hat}</g>`;
    const defs = `<defs><linearGradient id="${id}s" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
      <linearGradient id="${id}i" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#bfe8ff" stop-opacity=".4"/><stop offset="1" stop-color="#7fcff5" stop-opacity=".6"/></linearGradient></defs>`;
    const ice = opts.frozen ? `<g class="av-ice"><path d="${rr(12, 1, 76, 143, 9)}" fill="url(#${id}i)" stroke="#fff" stroke-width="2"/><path d="M20 14l10-8M22 30l18-16M70 120l10-8M64 136l18-14" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/></g>` : "";
    const body = `${defs}<ellipse cx="50" cy="145" rx="25" ry="3.2" fill="#000" opacity=".16" class="av-shadow"/><g class="av-body">${legs}${arm("L")}${torso}${arm("R")}${headG}</g>${ice}`;
    if (mode === "bust") return `<svg class="avatar-svg av-bust ${opts.cls || ""}" width="${size}" height="${size}" viewBox="10 -10 80 90" aria-hidden="true">${body}</svg>`;
    return `<svg class="avatar-svg av-full ${opts.cls || ""}" width="${Math.round(size * 100 / 150)}" height="${size}" viewBox="0 -8 100 166" aria-hidden="true">${body}</svg>`;
  };
})();
