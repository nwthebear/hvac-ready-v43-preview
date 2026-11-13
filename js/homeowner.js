/* Homeowner path: a short, friendly track for moms, dads and the curious.
   - Match My Path option (goal "homeowner") + a shortcut on question 1
   - 3-zone trail (The Shop → The Backyard → The Attic), reusing the zone art + color-in
   - its own rank ladder (window.RANKS becomes a getter that swaps ladders)
   - gentle games unlock by zone; tech-only games show "On the tech paths"
   - switching back to any tech path keeps XP, lessons, badges and history (nothing is reset) */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views, $ = s => document.querySelector(s);
  const T = (en, es) => ({ en, es });
  const L = (en, es) => (S.lang === "es" ? es : en);
  const isHome = A.isHomeowner = () => !!(S.profile && S.profile.goal === "homeowner");

  /* ---------- labels, zones ---------- */
  window.PATH_LABELS.homeowner = T("Homeowner", "Propietario");
  Object.assign(window.STAGE_LABELS, { home_shop: T("Zone 1", "Zona 1"), home_yard: T("Zone 2", "Zona 2"), home_attic: T("Zone 3", "Zona 3") });
  Object.assign(window.TRAIL_ZONES, {
    home_shop: { scene: "week_1", name: T("The Shop", "El Taller"), boss: T("Name That Box", "¿Qué Caja Es?"), line: T("Everything here has a name. Most of it is 'the thing'.", "Todo aquí tiene nombre. Casi todo se llama 'la cosa'.") },
    home_yard: { scene: "days_61_90", name: T("The Backyard", "El Patio"), boss: T("Cottonwood Season", "Temporada de Pelusa"), line: T("The dog has supervised every repair.", "El perro ha supervisado cada reparación.") },
    home_attic: { scene: "days_31_60", name: T("The Attic", "El Ático"), boss: T("The Mystery Drip", "La Gotera Misteriosa"), line: T("Hydrate. It is 130°F up here.", "Hidrátate. Aquí arriba hace 130°F.") }
  });
  const ZONES = [["home_shop", ["home-cycle", "home-parts", "home-safety"]], ["home_yard", ["home-outdoor", "home-thermostat", "home-tech"]], ["home_attic", ["home-filters", "home-problems", "home-callpro"]]];

  /* ---------- Match My Path ---------- */
  const goalQ = window.MATCH_QUESTIONS.find(q => q.key === "goal");
  if (goalQ && !goalQ.options.find(o => o.value === "homeowner")) goalQ.options.push({ value: "homeowner", icon: "🏡", label: T("Homeowner — just curious", "Propietario: solo por curiosidad") });

  /* ---------- rank ladder ---------- */
  const TECH_RANKS = window.RANKS;
  const HOME_RANKS = window.HOME_RANKS = [
    { id: "homeowner", xp: 0, icon: "🏡", en: "Homeowner", es: "Propietario", line: T("Owns a thermostat. Has opinions about it.", "Tiene un termostato. Y opiniones sobre él.") },
    { id: "filter-finder", xp: 400, icon: "🌬️", en: "Knows Where the Filter Is", es: "Sabe Dónde Está el Filtro", line: T("Found it behind the return grille. Mentioned it at dinner. Twice.", "Lo encontró detrás de la rejilla de retorno. Lo contó en la cena. Dos veces.") },
    { id: "bbq", xp: 1100, icon: "🍖", en: "Can Talk Shop at the BBQ", es: "Ya Habla del Oficio en la Carne Asada", line: T("Said 'condensate drain' out loud. Nobody argued.", "Dijo «drenaje de condensado» en voz alta. Nadie le discutió.") }
  ];
  Object.defineProperty(window, "RANKS", { configurable: true, get: () => (isHome() ? HOME_RANKS : TECH_RANKS), set: v => { /* keep the tech list replaceable */ TECH_RANKS.length = 0; TECH_RANKS.push(...v); } });

  /* ---------- plan ---------- */
  const PE = window.PathEngine, build0 = PE.buildPlan;
  PE.buildPlan = p => {
    if (!p || p.goal !== "homeowner") return build0(p);
    let idx = 0; const mods = [];
    ZONES.forEach(([st, ids]) => ids.forEach(lid => { const g = window.LESSONS[lid];
      mods.push({ id: "HOME-" + lid, m: { id: "HOME-" + lid, title: g.title.en, topics: [] }, idx: idx++, stage: st, status: "core", notes: [], gate: null, title: { en: g.title.en, es: g.title.es }, links: [["guide", lid]], boost: 0, lesson: lid }); }));
    const stages = ZONES.map(([id]) => ({ id, label: window.STAGE_LABELS[id], modules: mods.filter(m => m.stage === id) }));
    return { profile: p, pathId: "homeowner", homeowner: true, salesAddOn: false, startStage: "home_shop", stages, modules: mods, certs: [], fired: [],
      tasks: { earliest: [], next: [], later: [] }, salesTasks: null, blockedIndependent: false, facts: { certs: new Set(), eq: new Set() } };
  };

  /* ---------- game unlocks ---------- */
  const HOME_GAMES = { freeze: "home_shop", thermostat_wiring: "home_yard", gauge_reader: "home_attic" };
  A.homeUnlock = id => { if (!isHome()) return null; const z = HOME_GAMES[id]; return z ? { type: "zoneComplete", zone: z } : { type: "tech" }; };
  const zoneDone = zid => { const plan = A.plan(); if (!plan) return false; const s = A.progress(plan).stages.find(x => x.id === zid); return !!s && s.pct === 100; };
  A.homeArcade = games => isHome() ? games.filter(g => g[0] === "freeze" || g[0] === "match") : games;
  /* Don't Freeze: locked for homeowners until The Shop is done */
  const arc0 = V.arcade;
  V.arcade = (args) => { let h = arc0(args); const g = args && args[0];
    if (isHome() && !A.TG.devUnlockAll && !zoneDone("home_shop")) {
      if (g === "freeze") { setTimeout(() => A.go("#/arcade"), 0); return `<main class="page"></main>`; }
      if (!g) h = h.replace(/<a class="game-card g-freeze" href="#\/arcade\/freeze">([\s\S]*?)<\/a>/, (m, inner) => `<div class="game-card g-freeze locked" aria-disabled="true">${inner.replace(/<span class="g-hi">[\s\S]*?<\/span>/, "")}<span class="g-hi">${ico("lock", 14)} ${esc(L("Finish The Shop on your trail map", "Termina El Taller en tu mapa"))}</span></div>`);
    }
    if (isHome() && !g) h = h.replace('<div class="game-grid">', `<div class="note">${ico("info", 18)} ${esc(L("Starter: Tool Match is open from day one — tap tools to their names, no wiring required. Other games unlock as you finish each zone: The Shop → Don't Freeze, The Backyard → Thermostat Wiring, The Attic → Gauge Reader.", "Inicio: Emparejar Herramientas está abierto desde el primer día — toca cada herramienta y su nombre, sin cableado. Los demás se desbloquean al terminar cada zona: El Taller → No Te Congeles, El Patio → Cableado de Termostato, El Ático → Lector de Manómetros."))}</div><div class="game-grid">`);
    return h; };
  const freezeLocked = () => isHome() && !A.TG.devUnlockAll && !zoneDone("home_shop");
  const barc0 = A.bind.arcade; A.bind.arcade = args => { if (args && args[0] === "freeze" && freezeLocked()) return; return barc0(args); }; /* the Don't Freeze unlock rides the normal zone-complete banner + color-in */

  /* ---------- modules open straight into the friendly lesson ---------- */
  const mod0 = V.module, bmod0 = A.bind.module;
  const homeLesson = id => { const m = /^HOME-(.+)$/.exec(id || ""); return m && window.LESSONS[m[1]] ? m[1] : null; };
  V.module = args => { const lid = homeLesson(args[0]); if (!lid) return mod0(args);
    return V.guide([lid]).replace(/href="#\/library"/, 'href="#/board"'); };
  A.bind.module = args => { const lid = homeLesson(args[0]); if (!lid) return bmod0(args); A.bind.guide([lid]); };
  /* back link on home lessons goes to the trail, not the trainee library */
  const guide0 = V.guide;
  V.guide = args => { const h = guide0(args); return (window.HOME_LESSON_IDS || []).includes(args[0]) ? h.replace(/href="#\/library"/, 'href="#/board"') : h; };

  /* ---------- home: hide exam / trainee tiles ---------- */
  const home0 = V.home;
  V.home = args => { let h = home0(args); if (!isHome()) return h;
    ["#/epa", "#/dayone", "#/certs", "#/company"].forEach(r => { h = h.replace(new RegExp(`<a class="tile" href="${r.replace(/\//g, "\\/")}">[\\s\\S]*?<\\/a>`), ""); });
    return h.replace(/(<a class="btn ghost full" href="#\/match">[\s\S]*?<\/svg>)\s*[^<]*(<\/a>)/, `$1 ${esc(L("Switch to a tech path (keeps your XP)", "Cambiar a una ruta técnica (conservas tu XP)"))}$2`); };

  /* ---------- path page ---------- */
  const path0 = V.path;
  V.path = (p, qs) => {
    const plan = A.plan(); if (!plan || !plan.homeowner) return path0(p, qs);
    const pr = A.progress(plan), nm = A.nextModule(plan), rk = A.rank(), es = S.lang === "es";
    const zone = id => window.TRAIL_ZONES[id];
    const GAME_N = { freeze: L("Don't Freeze!", "¡No Te Congeles!"), thermostat_wiring: L("Thermostat Wiring", "Cableado de Termostato"), gauge_reader: L("Gauge Reader", "Lector de Manómetros") };
    const zoneCards = plan.stages.map((s, k) => { const sp = pr.stages.find(x => x.id === s.id) || { done: 0, total: 0, pct: 0 }, game = Object.keys(HOME_GAMES).find(g => HOME_GAMES[g] === s.id);
      return `<section class="card ho-zone ${sp.pct === 100 ? "done" : ""}"><div class="row between"><div><div class="eyebrow">${esc(tx(window.STAGE_LABELS[s.id]))}</div><h3>${esc(tx(zone(s.id).name))}</h3></div><span class="chip ${sp.pct === 100 ? "ok" : ""}">${sp.done}/${sp.total}</span></div>
        <div class="mini-bar"><span style="width:${sp.pct}%"></span></div>
        <ul class="mod-list">${s.modules.map(m => { const d = A.moduleDone(m), g = window.LESSONS[m.lesson]; return `<li><a class="mod ${d ? "done" : ""}" href="#/module/${m.id}"><span class="mod-ico">${d ? ico("check", 18) : `<span class="ho-emo">${g.icon}</span>`}</span><span class="grow">${esc(tx(m.title))}<span class="sm muted block">${g.minutes} min · ${g.check.length} ${es ? "preguntas" : "questions"}</span></span>${ico("arrow", 16)}</a></li>`; }).join("")}</ul>
        ${game ? `<div class="sm ho-unlock">${ico(sp.pct === 100 ? "game" : "lock", 15)} ${sp.pct === 100 ? `<a href="#/arcade${game === "freeze" ? "/freeze" : ""}">${esc(L("Unlocked: ", "Desbloqueado: ") + GAME_N[game])}</a>` : esc(L("Finish to unlock ", "Termínala para desbloquear ") + GAME_N[game])}</div>` : ""}</section>`; }).join("");
    return `<main class="page homepath">${A.head(qs && qs.new ? t("resultsTitle") : t("yourPath"))}
      <section class="card result-hero"><div class="row gap">${avatarSVG(S.avatar, 100)}<div><div class="eyebrow">${t("yourPath")}</div><h2>${esc(tx(window.PATH_LABELS.homeowner))}</h2>
        <div class="muted sm">${esc(L("Plain-English lessons for curious people. No exams, no jargon you didn't ask for.", "Lecciones en lenguaje sencillo para gente curiosa. Sin exámenes ni palabras raras que no pediste."))}</div></div></div>
        <div class="row between mt"><div>${ringSVG(pr.pct, 60)}</div><div class="grow pad-l"><div class="sm muted">${es ? "Progreso" : "Progress"}</div><b>${pr.done} / ${pr.total}</b> ${es ? "lecciones" : "lessons"}</div><a class="btn" href="#/board">${ico("route", 18)} ${es ? "Mapa" : "Trail map"}</a></div>
        ${nm ? `<a class="btn primary big full mt" href="#/module/${nm.id}">${ico("play", 18)} ${esc((pr.done ? L("Continue: ", "Sigue: ") : L("Start: ", "Empieza: ")) + tx(nm.title))}</a>` : ""}</section>
      <h3 class="sec-h">${es ? "Tu escalera" : "Your ladder"}</h3>
      <div class="ho-ladder">${HOME_RANKS.map((r, i) => `<div class="ho-rk ${i <= rk.i ? "on" : ""}"><span class="ho-rk-ico">${r.icon}</span><div class="grow"><b>${esc(tx(r))}</b><span class="sm muted block">${esc(tx(r.line))}</span></div><span class="sm muted">${r.xp} XP</span></div>`).join("")}</div>
      <h3 class="sec-h">${es ? "Tu ruta: 3 zonas" : "Your route: 3 zones"}</h3>${zoneCards}
      <section class="card ho-switch"><h3>${ico("hardhat", 20)} ${esc(L("Thinking about the trade?", "¿Te está llamando el oficio?"))}</h3>
        <p class="sm">${esc(L("Switch to a full tech path anytime. Your XP, finished lessons, badges and game scores all come with you.", "Cambia a una ruta técnica completa cuando quieras. Tu XP, lecciones terminadas, insignias y puntajes se vienen contigo."))}</p>
        <button class="btn full" id="hoSwitch">${ico("route", 18)} ${esc(L("Switch to a tech path", "Cambiar a una ruta técnica"))}</button></section>
    </main>`;
  };
  A.bind.path = (b0 => (p, qs) => { if (b0) b0(p, qs); const sw = $("#hoSwitch"); if (sw) sw.onclick = () => { A.mIdx = 0; A.mAns = Object.assign({}, S.profile, { goal: undefined }); A.go("#/match"); }; })(A.bind.path);

  /* ---------- Match view: homeowner shortcut on question 1 ---------- */
  const match0 = V.match, bmatch0 = A.bind.match;
  const finishHome = () => { const prev = S.profile && S.profile.goal; S.profile = Object.assign({}, A.mAns || {}, { goal: "homeowner" }); A.mIdx = 0; A.mAns = null; if (prev !== "homeowner") A.addXP(30); A.save(); Sound.sfx("levelup"); A.go("#/path?new=1"); };
  V.match = args => { const h = match0(args); if ((A.mIdx || 0) !== 0) return h;
    return h.replace(/(<div class="row gap sticky-cta">)/, `<button class="btn ghost full ho-short" id="hoShort"><span class="ch-ico">🏡</span><span class="grow left"><b>${esc(L("I'm a homeowner", "Soy propietario"))}</b><span class="sm muted block">${esc(L("…or skip if you're just curious. Short lessons, no exams.", "…o sáltalo si solo tienes curiosidad. Lecciones cortas, sin exámenes."))}</span></span></button>$1`); };
  A.bind.match = args => { bmatch0(args); const hs = $("#hoShort"); if (hs) hs.onclick = finishHome;
    const Q = window.MATCH_QUESTIONS[A.mIdx || 0]; if (Q && Q.key === "goal") { const b = document.querySelector('[data-v="homeowner"]'); if (b) b.onclick = () => { Sound.sfx("tap"); finishHome(); }; } };
})();
