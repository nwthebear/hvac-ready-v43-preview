/* POST-CAP content + unlockable avatar gear. All data lives at the top of this file (EN/ES).
   - Cross-trade side paths (Electrical, Plumbing) unlock at Old Timer; each has its own short rank ladder. Lessons are
     "coming soon" except the existing HVAC-side electrical/plumbing guides, which are reused.
   - Avatar gear unlocks from milestones (rank-ups, streaks, exam passes, the cap) and is equipped in the customizer. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views, $ = s => document.querySelector(s);
  const T = (en, es) => ({ en, es }), L = (en, es) => (S.lang === "es" ? es : en);
  /* tech gear only on the tech ladder; a rank id that isn't on the current ladder is LOCKED (findIndex -1 used to mean "unlocked for everyone") */
  const isHome = () => !!(A.isHomeowner && A.isHomeowner());
  const rankAt = id => { if (isHome()) return false; const i = window.RANKS.findIndex(r => r.id === id); return i >= 0 && A.rank().i >= i; };
  const homeRankAt = id => { if (!isHome()) return false; const i = window.RANKS.findIndex(r => r.id === id); return i >= 0 && A.rank().i >= i; };
  A.capped = () => !(A.isHomeowner && A.isHomeowner()) && A.rank().i >= window.RANKS.length - 1;

  /* ---------- data: side paths ---------- */
  window.SIDE_PATHS = [
    { id: "electrical", icon: "bolt", title: T("Electrical", "Electricidad"), sub: T("Cross-trade side path", "Ruta alterna de otro oficio"), lessons: ["electrical"], badge: "x-sparky",
      ranks: [
        { icon: "🧵", name: T("Wire Puller", "Jalacables"), line: T("Pulls wire. Mostly pulls a muscle.", "Jala cable. Más bien se jala un músculo.") },
        { icon: "📦", name: T("Box Stuffer", "Retacador de Cajas"), line: T("Can fit twelve wires in a box rated for eight. Shouldn't.", "Mete doce cables en una caja para ocho. No debería.") },
        { icon: "🔦", name: T("Panel Peeker", "Asomador de Tableros"), line: T("Opened a panel once. Closed it again, respectfully.", "Abrió un tablero una vez. Lo cerró con respeto.") },
        { icon: "🔌", name: T("Breaker Whisperer", "Susurrador de Breakers"), line: T("Finds the right breaker on the first try. Nobody believes it.", "Encuentra el breaker correcto al primer intento. Nadie le cree.") },
        { icon: "⚡", name: T("Sparky-ish", "Casi Electricista"), line: T("Knows hot from neutral. Tests it anyway.", "Distingue fase de neutro. Igual lo mide.") }
      ] },
    { id: "plumbing", icon: "drop", title: T("Plumbing", "Plomería"), sub: T("Cross-trade side path", "Ruta alterna de otro oficio"), lessons: ["plumbing"], badge: "x-hot",
      ranks: [
        { icon: "🪠", name: T("Pipe Hauler", "Cargatubos"), line: T("Carries the pipe. Also carries the blame.", "Carga el tubo. También carga la culpa.") },
        { icon: "🧴", name: T("Dope Slinger", "El del Sellador"), line: T("Puts thread sealant on everything, including himself.", "Le pone sellador de rosca a todo, incluso a sí mismo.") },
        { icon: "🌀", name: T("Trap Setter", "Pone Trampas"), line: T("Knows what a P-trap is for. Wishes he didn't.", "Sabe para qué es el sifón. Quisiera no saberlo.") },
        { icon: "🔥", name: T("Sweat Joint Pro", "Pro de la Soldadura"), line: T("Sweats copper. Also just sweats.", "Suelda cobre. Y también nada más suda.") },
        { icon: "👑", name: T("Drain King", "Rey del Drenaje"), line: T("Has seen what is in the drain. Does not talk about it.", "Ha visto lo que hay en el drenaje. No habla de eso.") }
      ] }
  ];
  A.sideDone = id => { const p = SIDE_PATHS.find(x => x.id === id); return !!p && A.capped() && p.lessons.every(l => A.isDone("guide:" + l)); };

  /* ---------- data: cross-trade badges ---------- */
  window.BADGES.push(
    { id: "x-sparky", icon: "⚡", rule: { side: "electrical" }, name: T("Sparky-ish", "Casi Electricista"), desc: T("Finished the Electrical side path. Still calls an electrician for the panel.", "Terminaste la ruta de Electricidad. Igual llamas al electricista para el tablero.") },
    { id: "x-hot", icon: "🚰", rule: { side: "plumbing" }, name: T("Knows Which Way Is Hot", "Sabe Cuál Es la Caliente"), desc: T("Finished the Plumbing side path. Left is hot. Usually.", "Terminaste la ruta de Plomería. La izquierda es la caliente. Casi siempre.") },
    { id: "x-jack", icon: "🃏", rule: { sideAll: true }, name: T("Jack of All Trades", "Todólogo"), desc: T("Finished both side paths. Master of the coffee run.", "Terminaste ambas rutas alternas. Maestro de ir por el café.") }
  );
  const met0 = A.badgeMet; A.badgeMet = b => b.rule.side ? A.sideDone(b.rule.side) : b.rule.sideAll ? SIDE_PATHS.every(p => A.sideDone(p.id)) : met0(b);

  /* ---------- data: unlockable avatar gear ---------- */
  const examPassed = () => Object.keys(S.boosted || {}).some(k => /^(epa|placement):/.test(k)) || Object.entries(S.quiz || {}).some(([k, v]) => /^epa:/.test(k) && (v.best || 0) >= 70);
  const rooftopDone = () => { const pl = A.plan(); if (!pl) return false; const st = A.progress(pl).stages.find(x => x.id === "months_3_6"); return !!st && st.total > 0 && st.done === st.total; };
  /* slot = avatar field it sets; big:true = full victory-scene unlock moment */
  window.AVATAR_GEAR = [
    { id: "energycan", slot: "tool", icon: "🥫", name: T("Energy-drink can", "Lata de bebida energética"), desc: T("Breakfast.", "Desayuno."), how: T("Reach the Helper rank.", "Llega al rango Ayudante."), test: () => rankAt("helper") },
    { id: "thermos", slot: "tool", icon: "🫖", name: T("Beat-Up Thermos", "Termo madreado"), desc: T("Dented in four places. Keeps coffee hot for eleven hours. Older than you.", "Abollado en cuatro partes. Mantiene el café caliente once horas. Es más viejo que tú."), how: T("Reach the Crew Member rank.", "Llega al rango Miembro de la Cuadrilla."), test: () => rankAt("crew") },
    { id: "luckydriver", slot: "tool", icon: "🪛", name: T("Lucky screwdriver", "Desarmador de la suerte"), desc: T("Never washed. Never lost. Never lent.", "Nunca lavado. Nunca perdido. Nunca prestado."), how: T("Pass your first practice exam (an EPA section or a module test-out).", "Aprueba tu primer examen de práctica (una sección EPA o una prueba de módulo)."), test: () => !isHome() && examPassed() },
    { id: "toolbelt", slot: "belt", icon: "🧰", name: T("Worn tool belt", "Cinturón de herramientas gastado"), desc: T("Broken in. Smells like brass and regret.", "Ya amoldado. Huele a latón y a arrepentimiento."), how: T("Reach the Tech rank.", "Llega al rango Técnico."), test: () => rankAt("tech") },
    { id: "gasshades", slot: "shades", icon: "🕶️", name: T("Gas Station Sunglasses", "Lentes de gasolinera"), desc: T("$9.99 at the counter, next to the jerky. Polarized, allegedly. Not safety glasses.", "$9.99 en el mostrador, junto a la carne seca. Polarizados, supuestamente. No son lentes de seguridad."), how: T("Finish the Rooftop zone on your trail map.", "Termina la zona de La Azotea en tu mapa."), test: () => !isHome() && rooftopDone() },
    { id: "crackproof", slot: "pants", icon: "👖", big: true, name: T("Butt Crack-Proof Pants", "Pantalones Anti-Raja"), desc: T("High-rise, triple-stitched, suspender-backed. Rated for crawl spaces, attics and bending over a condenser in front of the homeowner. The homeowner thanks you.", "Tiro alto, triple costura y tirantes. Certificados para sótanos, áticos y agacharse frente al condensador con el cliente mirando. El cliente te lo agradece."), how: T("Reach The Boss rank.", "Llega al rango El Patrón."), test: () => rankAt("boss") },
    { id: "goldhat", slot: "head", icon: "⛑️", big: true, name: T("Gold Hard Hat", "Casco dorado"), desc: T("Not real gold. Still gets you out of carrying the ladder.", "No es oro de verdad. Igual te salva de cargar la escalera."), how: T("Reach Old Timer, the top rank.", "Llega a Veterano, el rango más alto."), test: () => A.capped() },
    { id: "diymug", slot: "tool", icon: "☕", home: true, name: T("World's Okayest DIYer Mug", "Taza del DIY Más o Menos"), desc: T("Holds coffee and the filter size, written on the bottom in marker.", "Le cabe café y la medida del filtro, escrita abajo con plumón."), how: T("Homeowner path: reach Knows Where the Filter Is.", "Ruta de propietario: llega a Sabe Dónde Está el Filtro."), test: () => homeRankAt("filter-finder") },
    { id: "bbqtongs", slot: "tool", icon: "🍖", home: true, name: T("BBQ Tongs", "Pinzas de Asador"), desc: T("For flipping burgers and pointing at the condenser while explaining things.", "Para voltear la carne y señalar el condensador mientras explicas."), how: T("Homeowner path: reach Can Talk Shop at the BBQ.", "Ruta de propietario: llega a Ya Habla del Oficio en la Carne Asada."), test: () => homeRankAt("bbq") }
  ];

  A.gearUnlocked = id => !!(S.gear || {})[id];
  A.gearFor = value => AVATAR_GEAR.find(g => g.id === value);
  /* celebrate each unlock: unlock sound + haptic + a toast with the item on your avatar; waits for open overlays */
  A.checkGear = () => {
    S.bestStreak = Math.max(S.bestStreak || 0, S.streak.count || 0);
    const nw = AVATAR_GEAR.filter(g => !A.gearUnlocked(g.id) && g.test()).sort((a, b) => (b.big ? 1 : 0) - (a.big ? 1 : 0)); if (!nw.length) return [];
    S.gear = S.gear || {}; nw.forEach(g => S.gear[g.id] = Date.now()); A.save();
    let k = 0; const show = () => { if (document.querySelector(".vic, .celebrate-ov") && k++ < 120) return setTimeout(show, 500);
      nw.forEach((g, i) => setTimeout(() => { const prev = Object.assign({}, normalizeAvatar(S.avatar), { [g.slot]: g.id });
        if (g.big && A.victory) { A.victory({ kind: "gear", title: `${g.icon} ${tx(g.name)}`, sub: tx(g.desc), avatar: prev, goLabel: L("Put them on", "Ponérmelos"), onContinue: () => { S.avatar = prev; A.save(); A.render && A.render(); } }); return; } /* the victory scene plays the unlock sound on its landing beat */
        if (A.gearToast) return A.gearToast(g, prev);
        Sound.sfx("unlock"); A.haptic("unlock");
        A.toast(`<span class="gear-toast">${avatarSVG(prev, 64, { mode: "bust" })}<span><b>${L("Gear unlocked", "Equipo desbloqueado")}: ${esc(tx(g.name))}</b><span class="sm block">${L("Equip it in Your character.", "Póntelo en Tu personaje.")}</span></span></span>`, "levelup gear"); }, i * 2900 + (i && nw[0].big ? 5200 : 0))); };
    setTimeout(show, 700); return nw;
  };
  const addXP0 = A.addXP; A.addXP = n => { addXP0(n); setTimeout(A.checkGear, 1600); };
  window.addEventListener("hashchange", () => setTimeout(A.checkGear, 1500));
  setTimeout(() => A.onboarded && A.checkGear(), 2500);

  /* ---------- side path view ---------- */
  V.side = ([id]) => {
    const p = SIDE_PATHS.find(x => x.id === id); if (!p) return V.notfound(); const open = A.capped(), done = A.sideDone(id), b = BADGES.find(x => x.id === p.badge);
    return `<main class="page side-path">${A.head(tx(p.title), "#/board")}
      <section class="card side-hero ${open ? "" : "locked"}"><div class="row gap"><span class="side-ico">${ico(open ? p.icon : "lock", 30)}</span><div><div class="eyebrow">${esc(tx(p.sub))}</div><h2>${esc(tx(p.title))}</h2>
        <div class="sm ${open ? "ok" : "muted"}">${open ? (done ? L("Completed", "Completada") : L("Unlocked", "Desbloqueada")) : L("Unlocks when you reach Old Timer", "Se desbloquea al llegar a Veterano")}</div></div></div></section>
      <section class="card soon-card"><span class="chip">${L("Coming soon", "Próximamente")}</span><h3>${L("Full side path in the works", "La ruta completa está en camino")}</h3>
        <p class="sm muted">${L("For now, start with the HVAC-side lesson below. More lessons land here later.", "Por ahora, empieza con la lección del lado HVAC de abajo. Más lecciones llegarán aquí después.")}</p>
        ${p.lessons.map(l => A.guideCard ? A.guideCard(l) : "").join("")}</section>
      <h3 class="sec-h">${L("Side-path ranks", "Rangos de la ruta")}</h3>
      <div class="card-list">${p.ranks.map((r, i) => `<div class="list-card side-rank ${open && i === 0 ? "on" : ""}"><span class="lc-ico">${r.icon}</span><span class="grow"><b>${i + 1}. ${esc(tx(r.name))}</b><span class="sm muted block">${esc(tx(r.line))}</span></span>${open && i === 0 ? ico("check", 18, "ok") : ico("lock", 16, "muted")}</div>`).join("")}</div>
      ${b ? `<div class="card tight row gap mt"><span style="font-size:28px">${b.icon}</span><div><b>${esc(tx(b.name))}</b><div class="sm muted">${esc(tx(b.desc))}</div></div>${S.badges[b.id] ? ico("check", 18, "ok") : ""}</div>` : ""}
    </main>`;
  };
  A.bind.side = () => {};
})();
