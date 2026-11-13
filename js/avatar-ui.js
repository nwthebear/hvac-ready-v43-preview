/* Character customizer: used in onboarding (step 2) and #/avatar (from Settings). */
(function () {
  const A = window.App, S = A.S, D = window.AVATAR_DATA, esc = A.esc, $ = s => document.querySelector(s);
  const L = (en, es) => (S.lang === "es" ? es : en);
  const NAMES = {
    a: ["Style A", "Estilo A"], b: ["Style B", "Estilo B"], ponytail: ["Ponytail", "Cola de caballo"], braids: ["Braids", "Trenzas"], short: ["Short", "Corto"], buzz: ["Buzz", "Rapado"], curly: ["Curly", "Rizado"], long: ["Long", "Largo"], bun: ["Bun", "Chongo"], none: ["None", "Nada"],
    stubble: ["Stubble", "Barba de días"], mustache: ["Mustache", "Bigote"], goatee: ["Goatee", "Candado"], beard: ["Full beard", "Barba"], fumanchu: ["Fu Manchu", "Fu Manchú"], newhat: ["Fresh-out-the-box hard hat", "Casco recién estrenado"], new: ["Brand-new shiny", "Nuevecitas"], newbelt: ["Brand-new tool belt", "Cinturón nuevecito"],
    hardhat: ["Hard hat", "Casco"], ballcap: ["Ball cap", "Gorra"], backwards: ["Backwards cap", "Gorra al revés"], beanie: ["Beanie", "Gorro"],
    tee: ["T-shirt", "Playera"], work: ["Work shirt", "Camisa de trabajo"], hivis: ["Hi-vis vest", "Chaleco reflejante"], hoodie: ["Hoodie", "Sudadera"],
    cargo: ["Cargo", "Cargo"], brown: ["Brown", "Café"], black: ["Black", "Negras"], tan: ["Tan", "Arena"],
    wrench: ["Wrench", "Llave"], gauges: ["Gauges", "Manómetros"], drill: ["Drill", "Taladro"], clipboard: ["Clipboard", "Tabla"]
  };
  const G = () => window.AVATAR_GEAR || [];
  const gearOf = v => G().find(g => g.id === v), unlocked = id => A.gearUnlocked ? A.gearUnlocked(id) : false;
  /* show earned gear always; locked gear only for the ladder you are on (homeowner vs tech) */
  const GV = () => { const ho = !!(A.isHomeowner && A.isHomeowner()); return G().filter(g => unlocked(g.id) || !!g.home === ho); };
  const nm = (k, v) => { const g = gearOf(v); if (g) return tx(g.name); if (k === "pants" && v === "work") return L("Work pants", "Pantalón de trabajo"); if (k === "tool" && v === "none") return L("Empty hands", "Manos libres"); const n = NAMES[v]; return n ? L(n[0], n[1]) : v; };
  const TABS = [["face", L("Face", "Cara")], ["head", L("Headwear", "Cabeza")], ["outfit", L("Outfit", "Ropa")], ["tool", L("Tool", "Herramienta")], ["gear", L("Gear", "Equipo")]];
  const cfg = () => (S.avatar = normalizeAvatar(S.avatar));
  /* gear for this slot is appended to the chip list; locked gear shows a lock and its how-to-unlock text */
  const chips = (k, list) => { const all = list.concat(GV().filter(g => g.slot === k).map(g => g.id));
    return `<div class="ave-chips">${all.map(v => { const g = gearOf(v), lock = g && !unlocked(v);
      return lock ? `<button class="ave-chip locked" disabled title="${esc(tx(g.how))}" aria-label="${esc(nm(k, v) + " — " + L("Locked", "Bloqueado") + ": " + tx(g.how))}">${ico("lock", 12)} ${esc(nm(k, v))}</button>`
        : `<button class="ave-chip ${cfg()[k] === v ? "sel" : ""} ${g ? "gear" : ""}" data-ak="${k}" data-avv="${v}" aria-pressed="${cfg()[k] === v}">${g ? g.icon + " " : ""}${esc(nm(k, v))}</button>`; }).join("")}</div>`; };
  const gearPanel = () => `<p class="sm muted">${L("Earned gear. Tap an unlocked item to put it on or take it off.", "Equipo ganado. Toca un objeto desbloqueado para ponértelo o quitártelo.")}</p><div class="gear-grid">${GV().map(g => { const u = unlocked(g.id), on = cfg()[g.slot] === g.id;
      const prev = Object.assign({}, cfg(), { [g.slot]: g.id }, g.slot === "shades" ? { glasses: false } : {});
      return `<button class="gear-card ${u ? "" : "locked"} ${on ? "sel" : ""}" ${u ? `data-gear="${g.id}"` : "disabled"} aria-pressed="${on}"><span class="gear-prev">${avatarSVG(prev, g.slot === "head" || g.slot === "shades" ? 60 : 92, { mode: g.slot === "head" || g.slot === "shades" ? "bust" : "full" })}${u ? "" : `<span class="gear-lock">${ico("lock", 18)}</span>`}</span>
        <b>${g.icon} ${esc(tx(g.name))}</b><span class="sm muted">${esc(tx(u ? g.desc : g.how))}</span>${u ? `<span class="chip sm ${on ? "ok" : ""}">${on ? L("Wearing", "Puesto") : L("Tap to wear", "Toca para usar")}</span>` : `<span class="chip sm">${L("How to unlock", "Cómo desbloquear")}</span>`}</button>`; }).join("")}</div>`;
  const sw = (k, list, label) => `<div class="ave-sw" role="group" aria-label="${esc(label)}">${list.map(c => `<button class="swatch ${String(cfg()[k]).toLowerCase() === c.toLowerCase() ? "sel" : ""}" style="--c:${c}" data-ak="${k}" data-avv="${c}" aria-label="${esc(label)} ${c}"></button>`).join("")}</div>`;
  const row = (label, inner) => `<div class="ave-row"><div class="ave-lbl">${label}</div>${inner}</div>`;
  const panel = tab => { const c = cfg();
    if (tab === "face") return row(L("Body style", "Estilo de cuerpo"), chips("body", D.OPT.body)) + row(L("Skin tone", "Tono de piel"), sw("skin", D.SKINS, L("Skin tone", "Tono de piel"))) + row(L("Hair", "Cabello"), chips("hair", D.OPT.hair)) + (c.hair !== "none" || c.facial !== "none" ? row(L("Hair color", "Color de cabello"), sw("hairColor", D.HAIR_COLORS, L("Hair color", "Color de cabello"))) : "") + row(L("Facial hair", "Vello facial"), chips("facial", D.OPT.facial)) +
      (c.facial !== "stubble" && c.facial !== "beard" ? `<label class="switch-row"><span>${L("Five o'clock shadow", "Sombra de barba")}</span><input type="checkbox" class="switch" id="aveSh" ${c.shadow ? "checked" : ""}></label>` : "") +
      `<label class="switch-row"><span>${L("Safety glasses", "Lentes de seguridad")}</span><input type="checkbox" class="switch" id="aveGl" ${c.glasses ? "checked" : ""}></label>`;
    if (tab === "head") return row(L("Headwear", "En la cabeza"), chips("head", D.OPT.head)) + (c.head !== "none" ? row(L("Color", "Color"), sw("headColor", D.HAT_COLORS, L("Headwear color", "Color"))) : "");
    if (tab === "outfit") return row(L("Top", "Arriba"), chips("top", D.OPT.top)) + row(c.top === "hivis" ? L("Vest color", "Color del chaleco") : L("Shirt color", "Color de la camisa"), sw("topColor", c.top === "hivis" ? D.HIVIS : D.COLORS, L("Top color", "Color"))) +
      row(L("Pants", "Pantalón"), chips("pants", D.OPT.pants) + sw("pantsColor", D.PANTS, L("Pants color", "Color del pantalón"))) + row(L("Work boots", "Botas"), chips("boots", D.OPT.boots)) + row(L("Belt", "Cinturón"), chips("belt", ["none", "newbelt"])) + row(L("Sunglasses", "Lentes de sol"), chips("shades", ["none"])) + `<label class="switch-row"><span>${L("Lanyard with cert badge", "Gafete con certificación")}</span><input type="checkbox" class="switch" id="aveLy" ${c.lanyard ? "checked" : ""}></label>`;
    if (tab === "gear") return gearPanel();
    return row(L("Held tool", "En la mano"), chips("tool", D.OPT.tool));
  };
  if (S.avatar && typeof S.avatar !== "object") { S.avatar = normalizeAvatar(S.avatar); A.save(); } /* migrate old round-face ids */
  A.aveTab = A.aveTab || "face";
  A.avatarEditor = () => `<div class="ave">
    <div class="ave-stage"><div class="ave-prev" id="avePrev">${avatarSVG(cfg(), 210)}</div>
      <button class="btn ave-rnd" id="aveRnd" aria-label="${L("Randomize", "Al azar")}">${ico("dice", 18)} ${L("Randomize", "Al azar")}</button></div>
    <div class="ave-presets" role="list">${D.PRESETS.map(p => `<button class="ave-preset" data-preset="${p.id}" role="listitem">${avatarSVG(p.cfg, 54, { mode: "bust" })}<span>${esc(tx(p.name))}</span></button>`).join("")}</div>
    <div class="seg scroll ave-tabs">${TABS.map(([k, l]) => `<button data-avetab="${k}" class="${A.aveTab === k ? "sel" : ""}">${l}</button>`).join("")}</div>
    <div class="ave-panel" id="avePanel">${panel(A.aveTab)}</div></div>`;
  A.bindAvatarEditor = () => {
    const root = document.querySelector(".ave"); if (!root) return;
    const refresh = (bounce) => { A.save(); $("#avePrev").innerHTML = avatarSVG(cfg(), 210); $("#avePanel").innerHTML = panel(A.aveTab); bindPanel(); if (bounce && !A.reduced()) { const p = $("#avePrev"); p.classList.remove("pop"); void p.offsetWidth; p.classList.add("pop"); } };
    const bindPanel = () => {
      root.querySelectorAll("[data-ak]").forEach(b => b.onclick = () => { cfg()[b.dataset.ak] = b.dataset.avv; if (b.dataset.ak === "top") { const c = cfg(), hv = D.HIVIS.includes(c.topColor); if (c.top === "hivis" && !hv) c.topColor = D.HIVIS[0]; if (c.top !== "hivis" && hv) c.topColor = D.COLORS[0]; } Sound.sfx("tap"); refresh(true); });
      root.querySelectorAll("[data-gear]").forEach(b => b.onclick = () => { const g = gearOf(b.dataset.gear), c = cfg(); const def = { head: "hardhat", tool: "none", pants: "work", belt: "none", shades: "none" }[g.slot];
        c[g.slot] = c[g.slot] === g.id ? def : g.id; Sound.sfx("tap"); refresh(true); });
      const gl = $("#aveGl"); if (gl) gl.onchange = () => { cfg().glasses = gl.checked; refresh(true); }; const sh = $("#aveSh"); if (sh) sh.onchange = () => { cfg().shadow = sh.checked; refresh(true); }; const ly = $("#aveLy"); if (ly) ly.onchange = () => { cfg().lanyard = ly.checked; refresh(true); };
    };
    bindPanel();
    root.querySelectorAll("[data-avetab]").forEach(b => b.onclick = () => { A.aveTab = b.dataset.avetab; root.querySelectorAll("[data-avetab]").forEach(x => x.classList.toggle("sel", x === b)); $("#avePanel").innerHTML = panel(A.aveTab); bindPanel(); });
    root.querySelectorAll("[data-preset]").forEach(b => b.onclick = () => { S.avatar = Object.assign({}, D.PRESETS.find(p => p.id === b.dataset.preset).cfg); Sound.sfx("hop"); refresh(true); });
    $("#aveRnd").onclick = () => { S.avatar = randomAvatar(); Sound.sfx("hop"); refresh(true); };
  };
  window.V = window.V || {};
  A.views.avatar = () => `<main class="page">${A.head(L("Your character", "Tu personaje"), "#/settings")}${A.avatarEditor()}<a class="btn primary big full mt" href="#/settings">${L("Done", "Listo")}</a></main>`;
  A.bind.avatar = () => A.bindAvatarEditor();
})();
