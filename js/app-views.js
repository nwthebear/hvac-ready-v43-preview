/* Views + router. */
(function () {
  const A = window.App, S = A.S, esc = A.esc;
  const $ = s => document.querySelector(s);
  const V = A.views = {}; A.bind = A.bind || {};
  const head = (title, back = "#/home", extra = "") => `<header class="topbar"><a class="iconbtn" href="${back}" aria-label="${t("back")}">${ico("back")}</a><h1>${esc(title)}</h1>${extra}<span class="topbar-slot"></span></header>`;
  A.head = head;
  const icoFor = (id, fallback = "book") => ico((window.CONTENT_ICON || {})[id] || fallback);
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;

  /* ---------- onboarding ---------- */
  V.onboard = () => {
    const step = A.obStep != null ? A.obStep : (S.lang ? (S.name ? 2 : 1) : 0), es = S.lang === "es";
    let body = "";
    if (step === 0) body = `<div class="hero-ob"><img class="ob-icon" src="img/logo.png" alt="" width="88" height="88"><h1>HVAC Ready</h1><p class="muted">Learn. Master your trade. Make more. Have fun doing it.<br>Aprende. Domina tu oficio. Gana más. Diviértete haciéndolo.</p></div>
      <h2 class="center">Choose your language · Elige tu idioma</h2>
      <div class="stack"><button class="btn choice big lang-btn" data-lang="en"><span class="lang-badge">EN</span><span class="grow left">English</span></button><button class="btn choice big lang-btn" data-lang="es"><span class="lang-badge">ES</span><span class="grow left">Español</span></button></div>`;
    if (step === 1) body = `<h2>${t("yourName")}</h2><input id="nm" class="input big" maxlength="24" placeholder="${t("namePh")}" value="${esc(S.name)}" autocomplete="given-name"><p class="sm muted name-note" id="nmNote" hidden>${es ? "Te llamaremos Técnico. Lo puedes cambiar en Ajustes." : "We'll call you Tech. Change it in Settings."}</p>
      <button class="btn primary big full" id="nx">${t("next")}</button>
      <details class="ob-company"><summary class="sm muted">${es ? "¿Tienes un código de empresa? (opcional)" : "Have a company code? (optional)"}</summary><div class="row gap mt"><input id="obCo" class="input" maxlength="24" placeholder="${es ? "Código" : "Code"}" autocapitalize="characters" value="${esc(S.companyCode || "")}"><button class="btn" id="obCoGo">${es ? "Usar" : "Apply"}</button></div><p class="sm muted" id="obCoMsg">${es ? "Puedes saltarlo y agregarlo después en Ajustes." : "You can skip this and add it later in Settings."}</p></details>`;
    if (step === 2) body = `<h2>${t("pickAvatar")}</h2><p class="muted sm">${es ? "Elige uno listo o arma el tuyo. Lo puedes cambiar después desde Inicio o Ajustes." : "Pick a preset or build your own. You can change it later from Home or Settings."}</p>${A.avatarEditor()}
      <div class="ob-foot"><button class="btn primary big full" id="go">${t("start")}</button></div>`;
    const bar = step ? `<div class="ob-top"><button class="iconbtn ob-back" id="obBack" aria-label="${t("back")}">${ico("back")}</button><div class="ob-progress"><span style="width:${step === 1 ? 50 : 100}%"></span></div><span class="topbar-slot"></span></div>` : `<div class="ob-top ob-top-lang"><span class="topbar-slot"></span></div>`;
    return `<main class="page onboard step-${step}">${bar}${body}</main>`;
  };
  A.bind.onboard = () => {
    document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { S.lang = b.dataset.lang; A.save(); A.obStep = 1; A.render(); });
    const back = $("#obBack"); if (back) back.onclick = () => { const st = A.obStep != null ? A.obStep : (S.lang ? (S.name ? 2 : 1) : 0); if (st === 2) { A.obStep = 1; } else { A.obStep = 0; } A.render(); };
    const nx = $("#nx"); if (nx) { const nm = $("#nm"), note = $("#nmNote"); if (!matchMedia("(pointer: coarse)").matches) nm.focus();
      nm.oninput = () => { note.hidden = true; nx.textContent = t("next"); };
      nx.onclick = () => { const v = nm.value.trim();
        if (!v && note.hidden) { note.hidden = false; nx.textContent = S.lang === "es" ? "Seguir como Técnico" : "Continue as Tech"; return; }
        S.name = v || (S.lang === "es" ? "Técnico" : "Tech"); S.nameDefaulted = !v; A.save(); A.obStep = 2; A.render(); };
      nm.onkeydown = e => { if (e.key === "Enter") nx.click(); };
      const cg = $("#obCoGo"); if (cg) cg.onclick = () => { const r = A.applyCompanyCode ? A.applyCompanyCode($("#obCo").value) : null; if (r) $("#obCoMsg").textContent = r; }; }
    A.bindAvatarEditor && A.bindAvatarEditor();
    const go = $("#go"); if (go) go.onclick = () => { S.avatar = normalizeAvatar(S.avatar); S.onboarded = true; A.save(); A.obStep = null;
      if (A.firstRun && !S.ceremonySeen) A.firstRun(() => A.go("#/match")); else A.go("#/match"); };
  };
  function logo() { return `<img class="logo" src="img/logo.png" alt="">`; }
  A.logo = logo;
  const heroBench = (ids) => `<div class="hero-bench" aria-hidden="true">${ids.map(id => `<img src="img/illust/${id}.webp" alt="">`).join("")}</div>`;

  /* ---------- home ---------- */
  V.home = () => {
    const plan = A.plan(), rk = A.rank();
    let cont = "";
    if (plan) {
      const pr = A.progress(plan), nm = A.nextModule(plan);
      const lastR = S.last && typeof S.last.route === "string" && S.last.route !== "#/home" ? S.last : null; /* guard: a stale/empty S.last ({}) used to throw "reading 'match'" on load */
      const es = S.lang === "es", lastDone = lastR && (() => { const m = lastR.route.match(/^#\/(guide|skill|module)\/(.+)$/); return m && A.isDone(m[1] + ":" + m[2]); })(), lastOther = lastR && !lastDone && (!nm || lastR.route !== A.moduleRoute(nm)) ? lastR : null;
      cont = `<section class="card hero-card illustrated">
        <div class="row between gap"><div class="grow"><div class="eyebrow">${nm ? (es ? "Sigue en tu ruta" : "Up next on your path") : t("completed")}</div>
        <h2>${esc(nm ? tx(nm.title) : tx(PATH_LABELS[plan.pathId]))}</h2>
        <div class="muted sm">${esc(tx(PATH_LABELS[plan.pathId]))}${nm ? " · " + esc(tx(STAGE_LABELS[nm.stage] || "")) : ""}</div></div><div class="hc-ring">${ringSVG(pr.pct, 84)}<span class="hc-av">${avatarSVG(S.avatar, 46, { mode: "bust" })}</span><b class="hc-pct">${pr.pct}%</b></div></div>
        <a class="btn primary big full" href="${nm ? A.moduleRoute(nm) : "#/board"}">${ico("play", 18)} ${nm ? (pr.done ? t("continue") : (es ? "Empezar" : "Start")) : (es ? "Ver tablero" : "See board")}</a>
        ${heroBench(["thermostat","gauge-analog","hoses"])}
        ${lastOther ? `<a class="link-row" href="${lastOther.route}">${ico("history", 18)}<span class="grow">${es ? "Retomar" : "Pick up where you left off"}: <b>${esc(lastOther.title)}</b></span></a>` : ""}
        ${A.reviewCount && A.reviewCount() ? `<a class="link-row" href="#/review">${ico("target", 18)}<span class="grow">${es ? "Repaso pendiente" : "Review queue"}</span><span class="pill-n">${A.reviewCount()}</span></a>` : ""}
        </section>`;
    } else cont = `<a class="card hero-card cta illustrated" href="#/match"><div class="hero-cta-row"><div class="hero-cta-copy"><div class="eyebrow">${t("startHere")}</div><h2>${t("matchPath")}</h2><p class="muted">${t("matchSub", { n: MATCH_QUESTIONS.length })}</p></div><div class="hero-cta-art" aria-hidden="true"><img src="img/illust/thermostat.webp" alt=""></div></div><span class="btn primary big full">${ico("route", 18)} ${t("matchPath")}</span></a>`;
    const es0 = S.lang === "es";
    const pathRow = plan ? `<a class="path-row" href="#/path">${ico("route", 18)}<span class="grow"><b>${es0 ? "Tu ruta" : "Your path"}</b><span class="sm muted block">${esc(tx(PATH_LABELS[plan.pathId]))}</span></span><span class="muted">${A.progress(plan).done}/${A.progress(plan).total} · ${A.progress(plan).pct}%</span>${ico("arrow", 16, "muted")}</a>` : "";
    return `<main class="page home">
      <div class="brand-spot"><img src="img/logo.png" alt=""><span>HVAC Ready</span><span class="topbar-slot"></span></div>
      <section class="greet greet-compact"><a class="greet-av" href="#/avatar" aria-label="${es0 ? "Editar personaje" : "Edit character"}">${avatarSVG(S.avatar, 72)}</a><div class="grow"><div class="muted sm">${t("hi")},</div><h1>${esc(S.name)}</h1>
        <div class="rankline">${rk.r.icon} <b>${esc(A.rankName(rk.r, true))}</b><span class="muted"> · ${S.xp} XP</span></div><div class="xpbar"><span style="width:${rk.pct}%"></span></div></div>
        <div class="streak" data-tier="${S.streak.count >= 30 ? 4 : S.streak.count >= 14 ? 3 : S.streak.count >= 7 ? 2 : S.streak.count >= 3 ? 1 : 0}" style="--fl:${(1 + Math.min(S.streak.count, 30) / 30 * 0.7).toFixed(2)}" title="${t("streak")}">${ico("fire", 20)}<b>${S.streak.count}</b></div></section>
      ${cont}
      ${pathRow}
      <!--a2hs-->
      ${A.saying("tip")}
    </main>`;
  };

  /* ---------- Match My Path ---------- */
  V.match = () => {
    const i = A.mIdx || 0, Q = MATCH_QUESTIONS[i], ans = A.mAns || (A.mAns = Object.assign({}, S.profile || {}));
    const val = ans[Q.key];
    return `<main class="page match">${head(t("matchPath"), i ? "#/match" : "#/home")}
      <div class="ob-progress"><span style="width:${pct(i + 1, MATCH_QUESTIONS.length)}%"></span></div>
      <div class="muted sm center">${t("questionOf", { n: i + 1, t: MATCH_QUESTIONS.length })}</div>
      <div class="match-av">${avatarSVG(S.avatar, 56, { mode: "bust" })}</div>
      <h2 class="center qtext">${esc(tx(Q.q))}</h2>${Q.hint ? `<p class="muted center">${esc(tx(Q.hint))}</p>` : ""}
      <div class="choices ${Q.type}">${Q.options.map(o => { const sel = Q.type === "multi" ? (val || []).includes(o.value) : val === o.value; return `<button class="btn choice ${sel ? "sel" : ""}" data-v="${o.value}"><span class="ch-ico">${o.icon}</span><span>${esc(tx(o.label))}</span>${sel ? ico("check", 18, "ck") : ""}</button>`; }).join("")}</div>
      <div class="row gap sticky-cta">${i ? `<button class="btn big" id="mb">${t("back")}</button>` : ""}<button class="btn primary big grow" id="mn" ${val && (!Array.isArray(val) || val.length) ? "" : "disabled"}>${i === MATCH_QUESTIONS.length - 1 ? t("seeResults") : t("next")}</button></div></main>`;
  };
  A.bind.match = () => {
    const i = A.mIdx || 0, Q = MATCH_QUESTIONS[i], ans = A.mAns;
    document.querySelectorAll("[data-v]").forEach(b => b.onclick = () => {
      Sound.sfx("tap"); const v = b.dataset.v;
      if (Q.type === "multi") { let cur = ans[Q.key] || []; const opt = Q.options.find(o => o.value === v);
        if (cur.includes(v)) cur = cur.filter(x => x !== v); else cur = opt.exclusive ? [v] : cur.filter(x => !Q.options.find(o => o.value === x).exclusive).concat(v); ans[Q.key] = cur; A.render(); }
      else { ans[Q.key] = v; A.render(); setTimeout(() => $("#mn") && $("#mn").click(), 220); }
    });
    $("#mn").onclick = () => { if (i < MATCH_QUESTIONS.length - 1) { A.mIdx = i + 1; A.render(); } else { S.profile = Object.assign({}, ans); A.save(); A.mIdx = 0; A.mAns = null; A.addXP(30); Sound.sfx("levelup"); A.go("#/path?new=1"); } };
    const mb = $("#mb"); if (mb) mb.onclick = () => { A.mIdx = i - 1; A.render(); };
  };

  /* ---------- Path results / plan ---------- */
  V.path = (p, qs) => {
    const plan = A.plan(); if (!plan) return V.match();
    const pr = A.progress(plan), es = S.lang === "es", f = plan.facts;
    const nm = A.nextModule(plan);
    const steps = [];
    if (nm) steps.push((es ? "Ahora: " : "Now: ") + tx(nm.title));
    const n2 = A.boardModules(plan).filter(m => m.status !== "optional" && !A.moduleDone(m) && m !== nm).slice(0, 2); n2.forEach(m => steps.push((es ? "Luego: " : "Then: ") + tx(m.title)));
    const cDue = plan.certs.find(c => c.status === "todo" && c.id !== "employer_osha_hazard_training" && c.id !== "state_license"); if (cDue) steps.push((es ? "Certificación: " : "Certification: ") + certTitleEs(cDue).split("(")[0].trim() + " — " + tx(cDue.when));
    steps.push((es ? "En el trabajo: " : "On the job: ") + plan.tasks.earliest.slice(0, 2).map(esTask).join("; "));
    if (plan.blockedIndependent) steps.push(es ? "Sin EPA 608: no hagas recuperación, carga ni manómetros por tu cuenta (solo con supervisión)." : "No EPA 608 yet: no recovery, charging or gauge work on your own — supervised only.");
    const stLabel = s => tx(STAGE_LABELS[s]);
    return `<main class="page">${head(qs.new ? t("resultsTitle") : t("yourPath"))}
      <section class="card result-hero"><div class="row gap">${avatarSVG(S.avatar, 100)}<div><div class="eyebrow">${t("yourPath")}</div><h2>${esc(tx(PATH_LABELS[plan.pathId]))}${plan.salesAddOn ? ` <span class="chip">+ ${esc(tx(PATH_LABELS.sales_track))}</span>` : ""}</h2>
        <div class="muted sm">${es ? "Empiezas en" : "You start at"}: <b>${esc(stLabel(plan.startStage))}</b></div></div></div>
        <div class="row between mt"><div>${ringSVG(pr.pct, 60)}</div><div class="grow pad-l"><div class="sm muted">${es ? "Progreso total" : "Overall progress"}</div><b>${pr.done} / ${pr.total}</b> ${es ? "módulos" : "modules"}</div><a class="btn" href="#/board">${ico("dice", 18)} ${es ? "Tablero" : "Board"}</a></div>${nm ? `<a class="btn primary big full" href="${A.moduleRoute(nm)}">${ico("play", 18)} ${pr.done ? (es ? "Continuar" : "Continue") : (es ? "Empezar" : "Start")}: ${esc(tx(nm.title))}</a>` : ""}</section>
      <div class="note">${ico("info", 18)} ${es ? "El calendario es una guía, no un estándar. Avanzas al completar módulos y aprobar los repasos." : "The calendar is a guide, not a standard. You move ahead by completing modules and passing quick checks."}</div>
      <h3 class="sec-h">${t("nextSteps")}</h3><ol class="steps">${steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <h3 class="sec-h">${es ? "Tu secuencia" : "Your sequence"}</h3>
      ${plan.stages.map(s => { const sp = pr.stages.find(x => x.id === s.id); return `<details class="stage" ${s.id === (nm || {}).stage ? "open" : ""}><summary><span class="stage-name">${esc(stLabel(s.id))}</span>${sp ? `<span class="mini-bar"><span style="width:${sp.pct}%"></span></span><span class="muted sm">${sp.done}/${sp.total}</span>` : ""}</summary>
        <ul class="mod-list">${s.modules.map(m => modRow(m, plan)).join("")}</ul></details>`; }).join("")}
      ${A.chp5Readiness ? A.chp5Readiness(plan) : ""}
      <h3 class="sec-h">${es ? "Certificaciones y cuándo" : "Certifications & timing"}</h3>
      <div class="cert-timeline">${plan.certs.map(c => `<div class="ct ${c.status}"><span class="ct-dot">${c.status === "have" ? ico("check", 14) : ""}</span><div><b>${esc(certTitleEs(c))}</b><div class="sm">${esc(tx(c.when))}${c.status === "have" ? ` · <span class="ok">${es ? "Ya la tienes" : "You have this"}</span>` : ""}</div>${c.note ? `<div class="sm warn">${esc(tx(c.note))}</div>` : ""}</div></div>`).join("")}</div>
      <h3 class="sec-h">${es ? "Primeras tareas en el trabajo" : "First on-the-job tasks"}</h3>
      ${taskBlock(plan.tasks, es)}${plan.salesTasks ? `<h4>${esc(tx(PATH_LABELS.sales_track))}</h4>${taskBlock(plan.salesTasks, es)}` : ""}
      <h3 class="sec-h">${t("starterKit")}</h3><div class="kit-row">${(STARTER_KITS[plan.pathId] || []).slice(0, 8).map(id => `<a class="kit-chip" href="#/tool/${id}">${toolSVG(id)}<span>${esc(tx(TOOLS.find(x => x.id === id).name))}</span></a>`).join("")}</div><a class="btn ghost full" href="#/gear">${ico("cart", 18)} ${t("gear")}</a>
      <p class="muted sm mt">${es ? "Reglas aplicadas" : "Rules applied"}: ${plan.fired.join(", ")} · <a href="#/credits">${es ? "Fuentes y créditos" : "Sources & credits"}</a></p>
      <a class="btn ghost full mt" href="#/match">${ico("route", 18)} ${t("retakeMatch")}</a>
    </main>`;
  };
  function taskBlock(tk, es) { return `<div class="task-cols"><div class="card tight"><h4 class="ok">${ico("check", 16)} ${es ? "Desde ya (supervisado)" : "Start with (supervised)"}</h4><ul>${tk.earliest.map(x => `<li>${esc(esTask(x))}</li>`).join("")}</ul></div><div class="card tight"><h4>${ico("flag", 16)} ${es ? "Después de fundamentos + 608" : "After fundamentals + 608"}</h4><ul>${tk.after.map(x => `<li>${esc(esTask(x))}</li>`).join("")}</ul></div><div class="card tight"><h4 class="warn">${ico("lock", 16)} ${es ? "Todavía no" : "Not yet"}</h4><ul>${tk.defer.map(x => `<li>${esc(esTask(x))}</li>`).join("")}</ul></div></div>`; }
  function modRow(m, plan) {
    const done = A.moduleDone(m), open = A.gateOpen(m, plan), es = S.lang === "es";
    const st = { core: "", short: es ? "Repaso corto" : "Short refresher", optional: es ? "Opcional" : "Optional", review: es ? "Repaso / probar" : "Review / test out", skip: es ? "Omitido" : "Skipped", later: es ? "Más adelante" : "Later" }[m.status];
    return `<li><a class="mod ${m.status} ${done ? "done" : ""} ${open ? "" : "locked"}" href="#/module/${m.id}"><span class="mod-ico">${done ? ico("check", 18) : open ? ico(m.links.length ? "book" : "hardhat", 18) : ico("lock", 18)}</span><span class="grow">${esc(tx(m.title))}${st ? ` <em class="chip sm">${st}</em>` : ""}${A.chp5Badges ? A.chp5Badges(m.id) : ""}</span>${ico("arrow", 16, "muted")}</a></li>`;
  }

  /* research-only caveats stay in the data file, not on screen */
  A.cleanNote = n => (n || "").split(/(?<=\.)\s+/).filter(x => !/uncertaint|not (fully )?researched|not fully inventoried|discrepanc/i.test(x)).join(" ").trim();
  A.refsBlock = (refs, title) => !refs || !refs.length ? "" : `<section class="card refs"><h3>${ico("book", 18)} ${esc(title || (S.lang === "es" ? "Fuentes" : "Sources"))}</h3><ul class="sm refs-list">${refs.map(r => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a></li>`).join("")}</ul></section>`;
  /* ---------- module detail ---------- */
  V.module = ([id]) => {
    const plan = A.plan(); const m = plan && plan.modules.find(x => x.id === id); if (!m) return V.notfound();
    const es = S.lang === "es", done = A.moduleDone(m), open = A.gateOpen(m, plan);
    const linkCard = ([type, lid]) => {
      let title, href, icon;
      if (type === "guide") { const g = LESSONS[lid]; title = tx(g.title); href = "#/guide/" + lid; icon = icoFor(lid); }
      if (type === "skill") { const s = SKILLS.find(x => x.id === lid); title = tx(s.title); href = "#/skill/" + lid; icon = ico("hand"); }
      if (type === "quiz") { title = "EPA 608 " + tx(EPA_SECTIONS.find(x => x.id === lid).title) + (es ? " — quiz" : " — practice quiz"); href = "#/epa/" + lid; icon = icoFor(lid); }
      if (type === "dayone") { title = es ? "Supervivencia del Día Uno (lee 5 tarjetas)" : "Day One Survival (read 5 cards)"; href = "#/dayone"; icon = ico("lightbulb"); }
      const ok = A.linkDone([type, lid]);
      return `<a class="list-card ${ok ? "done" : ""}" href="${href}"><span class="lc-ico">${icon}</span><span class="grow">${esc(title)}</span>${ok ? ico("check", 18, "ok") : ico("arrow", 18)}</a>`;
    };
    const startCta = (() => { const nx = m.links.find(l => !A.linkDone(l)); if (!nx || !open || done) return ""; if (m.status === "review") return `<button class="btn primary big full lesson-start" id="testoutTop">${ico("target", 18)} ${es ? "Ya lo sabes? Prueba rápida para saltarlo" : "Already know this? Quick check to skip it"}</button>`; const tmp = document.createElement("div"); tmp.innerHTML = linkCard(nx); const a = tmp.firstElementChild; return `<a class="btn primary big full lesson-start" href="${a.getAttribute("href")}">${ico("play", 18)} ${es ? "Empezar" : "Start"}: ${esc(a.textContent.trim())}</a>`; })();
    return `<main class="page has-lesson-foot">${head(tx(m.title), "#/path")}
      ${!open ? `<div class="note warn">${ico("lock", 18)} ${{ walkthrough: es ? "Se desbloquea cuando completes una llamada/instalación completa supervisada." : "Unlocks after you complete a consistent maintenance or install walkthrough.", options: es ? "Se desbloquea después de 'Presentar opciones'." : "Unlocks after 'Presenting options'.", foundation: es ? "Se desbloquea al terminar los fundamentos." : "Unlocks after the foundation modules." }[m.gate]}</div>` : ""}
      ${m.gate === "epa" ? `<div class="note warn">${ico("shield", 18)} ${es ? "Requiere EPA 608 o supervisión cercana y continua (40 CFR 82.161). Estudia libremente; practica en equipos solo con supervisión." : "Requires EPA 608 or close, continual supervision (40 CFR 82.161). Study freely; do the hands-on part only with supervision."}</div>` : ""}
      <div class="card"><div class="row between"><span class="chip">${esc(tx(STAGE_LABELS[m.stage]))}</span>${done ? `<span class="chip ok">${ico("check", 14)} ${t("completed")}</span>` : ""}</div>
        ${m.notes.map(n => `<div class="sm info-line">${ico("info", 14)} ${esc(tx(n))}</div>`).join("")}
        <h4>${es ? "Temas" : "Topics"}</h4><div class="chips">${(m.m.topics || []).map(x => `<span class="chip">${esc(esTopic(x))}</span>`).join("")}</div>
        ${m.m.ojt_tasks ? `<h4>${es ? "Tareas en el trabajo" : "On-the-job tasks"}</h4><ul>${m.m.ojt_tasks.map(x => `<li>${esc(esTopic(x))}</li>`).join("")}</ul>` : ""}
        ${(() => { const ov = (window.MODULE_NOTE_OVERRIDE || {})[m.id]; const n = ov ? tx(ov) : A.cleanNote(m.m.notes); return n ? `<p class="muted sm">${esc(ov ? n : esTopic(n))}</p>` : ""; })()}</div>
      ${m.links.length ? `<h3 class="sec-h">${es ? "Estudia en la app" : "Study in the app"}</h3>${m.links.map(linkCard).join("")}
        ${!done && open ? `<button class="btn full mt" id="testout">${ico("target", 18)} ${es ? "Probar conocimiento (saltar si apruebas)" : "Test out (skip if you pass)"}</button>` : ""}` : ""}
      ${!done && open && !m.links.length ? `<button class="btn primary full mt" id="markdone">${ico("check", 18)} ${es ? "Marcar como listo" : "Mark complete"}</button>` : ""}
      ${m.m.sources && m.m.sources.length ? A.refsBlock(m.m.sources.map(u => ({ url: u, title: u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").slice(0, 60) })), es ? "Fuentes del plan" : "Where this module comes from") : ""}
      ${startCta ? `<div class="lesson-foot">${startCta}</div>` : ""}
    </main>`;
  };
  A.bind.module = ([id]) => {
    const plan = A.plan(); const m = plan.modules.find(x => x.id === id);
    const md = $("#markdone"); if (md) md.onclick = () => { S.lastModulePrev = A.nextModule(plan) ? A.nextModule(plan).id : null; S.done["module:" + id] = Date.now(); S.lastModule = id; A.addXP(XP_RULES.moduleSignoff); A.log("module", id, m.m.title); A.save(); A.celebrate({ title: tx(m.title) }); };
    const to = $("#testout"); if (to) to.onclick = () => A.startPlacement(m); const tt = $("#testoutTop"); if (tt) tt.onclick = () => A.startPlacement(m);
  };

  /* ---------- game board: now the winding trail map in js/trail.js (V.board / A.bind.board) ---------- */

  /* ---------- library / guide ---------- */
  const dirCard = (href, icon, title, sub) => `<a class="list-card" href="${href}"><span class="lc-ico">${ico(icon)}</span><span class="grow"><b>${title}</b>${sub ? `<span class="sm muted block">${sub}</span>` : ""}</span>${ico("arrow", 18)}</a>`;
  A.dirCard = dirCard;
  V.library = () => { const es = S.lang === "es";
    const work = [
      ["#/epa", "globe", t("epa"), es ? "Core, I, II y III" : "Core, I, II & III"],
      ["#/dayone", "lightbulb", es ? "Día Uno" : "Day One", es ? "Primer día en camioneta" : "First day on a truck"],
      ["#/skills", "hand", es ? "Práctica" : "Hands-On", es ? "Paso a paso" : "Step by step"],
      ["#/tools", "cog", es ? "Herramientas" : "Tools Guide", es ? "Qué es cada una" : "What each tool is for"],
      ["#/field", "gauge", es ? "Campo" : "Field Tools", es ? "Calculadoras offline" : "Offline calculators"]
    ];
    return `<main class="page">${head(t("learn"))}
    <h3 class="sec-h">${es ? "Taller" : "Workshop"}</h3>
    <div class="workshop-grid">${work.map(([h, i, title, sub]) => `<a href="${h}"><span class="wk-ico">${ico(i, 20)}</span><b>${title}</b><small>${sub}</small></a>`).join("")}</div>
    ${GUIDE_GROUPS.map(g => `<h3 class="sec-h">${esc(tx(g.title))}</h3><div class="card-list">${g.track ? `<a class="list-card" href="${g.track}"><span class="lc-ico">${ico("map")}</span><span class="grow"><b>${es ? "Ver los 5 exámenes y sus áreas" : "See all 5 exams and their domains"}</b></span>${ico("arrow", 18)}</a>` : ""}${g.guides.map(id => guideCard(id)).join("")}</div>`).join("")}
    <h3 class="sec-h">${es ? "Consulta" : "Reference"}</h3>
    <div class="card-list">${dirCard("#/glossary", "list", es ? "Glosario" : "Glossary")}${dirCard("#/charts", "cycle", es ? "Gráficas P/T y SH/SC" : "P/T & SH/SC charts")}${dirCard("#/models", "box", es ? "Modelos 3D" : "3D models")}</div></main>`; };
  function guideCard(id) { const g = LESSONS[id]; const d = A.isDone("guide:" + id); return `<a class="list-card ${d ? "done" : ""}" href="#/guide/${id}"><span class="lc-ico">${icoFor(id)}</span><span class="grow"><b>${esc(tx(g.title))}</b><span class="sm muted block">${g.minutes} ${t("minutes")}${g.enOnly && S.lang === "es" ? " · EN" : ""}</span></span>${d ? ico("check", 18, "ok") : ico("arrow", 18)}</a>`; }
  A.guideCard = guideCard;

  const cardsBlock = c => `<div class="insight">${[["tip", "lightbulb", t("tip")], ["analogy", "cycle", t("analogy")], ["example", "hardhat", t("example")]].map(([k, i, l]) => c[k] ? `<details class="ins ${k}"><summary>${ico(i, 20)} <b>${l}</b><span class="muted sm grow right">${t("tapToOpen")}</span></summary><p>${esc(tx(c[k]))}</p></details>` : "").join("")}</div>`;
  A.cardsBlock = cardsBlock;
  V.guide = ([id]) => {
    const g = LESSONS[id]; if (!g) return V.notfound(); const es = S.lang === "es";
    const labels = es ? { condenser: "Condensador", condenserSub: "rechaza calor", compressor: "Compresor", metering: "Expansión", meteringSub: "baja presión", evaporator: "Evaporador", evaporatorSub: "absorbe calor", high: "LADO ALTO", low: "LADO BAJO" } : {};
    const kp = g.keyPoints && (g.keyPoints[S.lang] && g.keyPoints[S.lang].length ? g.keyPoints[S.lang] : g.keyPoints.en);
    const quizSec = g.quizLink;
    const BANNER = { safety: ["co-detector","combustion","multimeter"], cycle: ["compressor","condenser","evaporator"], components: ["thermostat","capacitor","contactor"], tools: ["gauge-analog","hoses","vacuum-pump"], ch5: ["capacitor","txv","thermostat"] };
    const ban = BANNER[id] || ["thermostat","gauge-analog","hoses"];
    return `<main class="page guide has-lesson-foot">${head(tx(g.title), "#/library")}
      <div class="guide-banner" aria-hidden="true">${ban.map(pid => `<img src="img/illust/${pid}.webp" alt="">`).join("")}</div>
      ${g.imageSlot ? `<div class="hero-img">${slotImg(g.imageSlot.replace("img/", "").replace(".jpg", ""))}</div>` : ""}
      ${A.esNote(g.intro)}${g.placeholder ? `<div class="note warn">${ico("info", 18)} ${esc(tx(g.placeholder))}</div>` : ""}${g.note ? `<div class="note">${ico("shield", 18)} ${esc(tx(g.note))}</div>` : ""}
      <section class="card"><h3>${t("summary")}</h3><p>${esc(tx(g.intro))}</p>${g.terms ? `<h4>${t("keyTerms")}</h4><div class="chips">${g.terms.map(x => `<span class="chip">${esc(tx(x))}</span>`).join("")}</div>` : ""}</section>
      ${g.diagram === "cycle" ? `<section class="card"><h3>${es ? "Ciclo animado" : "Animated cycle"}</h3><p class="sm muted">${t("tapPart")}</p><div id="cyc">${cycleSVG(labels, { animate: !A.reduced() })}</div><div id="partInfo" class="part-info"></div><a class="btn ghost full" href="#/models">${ico("box", 18)} ${es ? "Ver modelo 3D" : "View 3D model"}</a></section>` : ""}
      ${g.diagram === "pt" || id === "ch5" ? `<section class="card"><h3>${es ? "Explorador P/T y SH/SC" : "P/T and SH/SC explorer"}</h3>${A.shscWidget()}</section>` : ""}
      <h3 class="sec-h">${t("stepByStep")}</h3>
      <ol class="step-list">${(g.sections || []).map(s => `<li class="card tight"><h4>${esc(tx(s.h))}</h4><p>${esc(tx(s.p))}</p></li>`).join("")}</ol>
      ${g.recognition ? `<section class="card"><h3>${t("recognition")}</h3><div class="comp-grid">${COMPONENTS.map(c => `<button class="comp" data-comp="${c.id}">${compSVG(c.id)}<span>${esc(tx(c.name))}</span></button>`).join("")}</div><div id="compInfo" class="part-info"></div><a class="btn full" href="#/play/recog">${ico("target", 18)} ${t("tapTo")} — quiz</a></section>` : ""}
      ${kp ? `<section class="card"><h3>${t("keyPoints")}</h3><ul class="checks">${kp.map(x => `<li>${ico("check", 16, "ok")} ${esc(x)}</li>`).join("")}</ul></section>` : ""}
      ${g.cards ? cardsBlock(g.cards) : ""}
      ${A.saying("tip")}
      ${g.refs ? A.refsBlock(g.refs, es ? "Fuentes verificadas" : "Checked against") : ""}
      ${A.isDone("guide:" + id) ? `<div class="center ok mt">${ico("check", 18)} ${t("completed")}</div>` : ""}
      <div class="lesson-foot">
        <a class="video-cta lesson-start" href="#/video/guide/${id}"><span class="play-ico">${ico("play", 26)}</span><span><b>${t("watchLesson")}</b><span class="sm block">${(g.sections || []).length + 3} ${es ? "diapositivas" : "slides"} · ${es ? "narración opcional" : "optional narration"}</span></span>${A.isDone("video:guide:" + id) ? ico("check", 20, "ok") : ""}</a>
        ${g.check && g.check.length ? `<button type="button" class="btn primary big full js-start-check lesson-start" id="chk">${ico("target", 18)} ${t("startCheck")} (${g.check.length})</button>` : ""}
        ${quizSec ? `<a class="btn primary big full lesson-start" href="#/epa/${quizSec}">${ico("target", 18)} ${t("practiceQuiz")}</a><button class="btn full" id="mkdone">${ico("check", 18)} ${t("markDone")}</button>` : ""}
      </div>
    </main>`;
  };
  A.bind.guide = ([id]) => {
    const g = LESSONS[id];
    document.querySelectorAll(".js-start-check").forEach(chk => { chk.onclick = () => A.startQuiz({ key: "check:guide:" + id, title: tx(g.title), questions: g.check, timer: false, onPass: () => A.markDone("guide:" + id, XP_RULES.guide) }); });
    const md = $("#mkdone"); if (md) md.onclick = () => { A.markDone("guide:" + id, XP_RULES.guide); A.log("guide", id, g.title); A.celebrate({ title: tx(g.title) }); };
    const es = S.lang === "es";
    const PART = { condenser: es ? "Condensador (unidad exterior): el vapor caliente de alta presión entrega calor al aire de afuera y se condensa a líquido. El ventilador mueve aire por el serpentín." : "Condenser (outdoor unit): hot high-pressure vapor gives its heat to outdoor air and condenses to liquid. The fan pulls air through the coil.", compressor: es ? "Compresor hermético: toma vapor de baja presión por la succión y lo comprime a vapor caliente de alta presión por la descarga. Es la bomba del sistema." : "Hermetic compressor: takes in low-pressure suction vapor and squeezes it into hot high-pressure discharge vapor. It's the pump of the system.", metering: es ? "TXV (y filtro deshidratador en la línea de líquido): el deshidratador atrapa humedad y suciedad; la TXV baja la presión para que el líquido salga frío hacia el evaporador. El bulbo va sujeto a la línea de succión." : "TXV (and the liquid-line filter drier): the drier catches moisture and debris; the TXV drops the pressure so the liquid leaves cold into the evaporator. The bulb straps to the suction line.", evaporator: es ? "Evaporador (serpentín en A, interior): el refrigerante a baja presión hierve y absorbe calor del aire de la casa. El vapor vuelve al compresor por la línea de succión aislada." : "Evaporator (indoor A-coil): low-pressure refrigerant boils and soaks up heat from the house air. Vapor returns to the compressor through the insulated suction line." };
    document.querySelectorAll("#cyc [data-part]").forEach(p => p.onclick = () => { Sound.sfx("tap"); document.querySelectorAll("#cyc .part").forEach(x => x.classList.remove("sel")); p.classList.add("sel"); $("#partInfo").innerHTML = `<b>${ico("info", 16)}</b> ${esc(PART[p.dataset.part])}`; });
    document.querySelectorAll("[data-comp]").forEach(b => b.onclick = () => { Sound.sfx("tap"); const c = COMPONENTS.find(x => x.id === b.dataset.comp); $("#compInfo").innerHTML = `<b>${esc(tx(c.name))}</b>: ${esc(tx(c.info))}`; });
    A.bindShsc();
  };

  /* SH/SC + P/T widget */
  A.shscWidget = () => `<div class="shsc"><div class="seg" id="refSeg">${["R-410A", "R-22"].map((r, i) => `<button class="${i ? "" : "sel"}" data-ref="${r}">${r}</button>`).join("")}</div>
    <div id="ptc"></div>
    <label class="sm">${S.lang === "es" ? "Presión de succión" : "Suction pressure"} <b id="spv"></b><input type="range" id="sp" min="40" max="160" value="118"></label>
    <label class="sm">${S.lang === "es" ? "Temp. línea de succión" : "Suction line temp"} <b id="stv"></b><input type="range" id="st" min="20" max="80" value="50"></label>
    <div class="gauge-row"><div id="shBox" class="meter-box"></div></div>
    <label class="sm">${S.lang === "es" ? "Presión de líquido" : "Liquid line pressure"} <b id="lpv"></b><input type="range" id="lp" min="150" max="450" value="317"></label>
    <label class="sm">${S.lang === "es" ? "Temp. línea de líquido" : "Liquid line temp"} <b id="ltv"></b><input type="range" id="lt" min="60" max="125" value="90"></label>
    <div class="gauge-row"><div id="scBox" class="meter-box"></div></div><p class="muted sm">${S.lang === "es" ? "Valores aproximados para aprender. Usa los datos de tu manómetro y del fabricante." : "Approximate values for learning. Use your gauge and the manufacturer's data on the job."}</p></div>`;
  A.bindShsc = () => {
    if (!$("#ptc")) return; let ref = "R-410A";
    const bar = (v, max, label, good) => `<div class="mb-top"><b>${label}</b><span class="big">${v.toFixed(0)}°F</span></div><div class="mbar"><span style="width:${Math.max(0, Math.min(100, v / max * 100))}%" class="${good ? "good" : "bad"}"></span></div>`;
    const upd = () => {
      const sp = +$("#sp").value, st = +$("#st").value, lp = +$("#lp").value, lt = +$("#lt").value;
      const ss = satTemp(ref, sp), ls = satTemp(ref, lp), sh = st - ss, sc = ls - lt;
      $("#spv").textContent = sp + " psig (" + ss.toFixed(0) + "°F sat)"; $("#stv").textContent = st + "°F"; $("#lpv").textContent = lp + " psig (" + ls.toFixed(0) + "°F sat)"; $("#ltv").textContent = lt + "°F";
      $("#ptc").innerHTML = ptChartSVG(ref, sp);
      $("#shBox").innerHTML = bar(sh, 30, (S.lang === "es" ? "Sobrecalentamiento" : "Superheat") + " = " + st + " − " + ss.toFixed(0), sh > 3 && sh < 20);
      $("#scBox").innerHTML = bar(sc, 25, (S.lang === "es" ? "Subenfriamiento" : "Subcooling") + " = " + ls.toFixed(0) + " − " + lt, sc > 3 && sc < 18);
    };
    document.querySelectorAll("[data-ref]").forEach(b => b.onclick = () => { ref = b.dataset.ref; document.querySelectorAll("[data-ref]").forEach(x => x.classList.toggle("sel", x === b)); const [lo, hi, v1, v2] = ref === "R-22" ? [20, 110, 68, 196] : [40, 160, 118, 317]; $("#sp").min = lo; $("#sp").max = hi; $("#sp").value = v1; $("#lp").min = ref === "R-22" ? 100 : 150; $("#lp").max = ref === "R-22" ? 300 : 450; $("#lp").value = v2; upd(); });
    ["sp", "st", "lp", "lt"].forEach(i => $("#" + i).oninput = upd); upd();
  };
  V.charts = () => `<main class="page">${head(S.lang === "es" ? "Gráficas P/T y SH/SC" : "P/T & SH/SC charts")}<section class="card">${A.shscWidget()}</section></main>`;
  A.bind.charts = () => A.bindShsc();

  /* ---------- skills ---------- */
  V.skills = () => { const plan = A.plan(); const tag = plan ? (plan.pathId.startsWith("res") ? "residential" : "commercial") : null;
    return `<main class="page">${head(t("handsOn"))}<div class="card-list">${SKILLS.map(s => { const d = A.isDone("skill:" + s.id); const mine = tag && s.tags.includes(tag); return `<a class="list-card ${d ? "done" : ""}" href="#/skill/${s.id}"><span class="lc-ico">${ico("hand")}</span><span class="grow"><b>${esc(tx(s.title))}</b>${mine ? `<span class="chip sm">${t("myPath")}</span>` : ""}</span>${d ? ico("check", 18, "ok") : ico("arrow", 18)}</a>`; }).join("")}</div></main>`; };
  V.skill = ([id]) => { const s = SKILLS.find(x => x.id === id); if (!s) return V.notfound(); const es = S.lang === "es";
    return `<main class="page has-lesson-foot">${head(tx(s.title), "#/skills")}${A.esNote(s.title)}
      <section class="card"><p>${esc(tx(s.intro))}</p></section>
      <section class="card warn-card"><h3>${ico("shield", 20)} ${t("safetyNotes")}</h3><ul>${s.safety.map(x => `<li>${esc(esTopic(x))}</li>`).join("")}</ul></section>
      <h3 class="sec-h">${t("stepByStep")}</h3><ol class="step-list num">${s.steps.map(x => `<li class="card tight">${esc(esTopic(x))}</li>`).join("")}</ol>
      <section class="card"><h3>${ico("close", 20)} ${t("mistakes")}</h3><ul>${s.mistakes.map(x => `<li>${esc(esTopic(x))}</li>`).join("")}</ul></section>
      ${cardsBlock(s.cards)}
      <div class="lesson-foot"><a class="btn primary big full lesson-start" href="#/video/skill/${id}">${ico("play", 18)} ${t("watchLesson")}</a><button type="button" class="btn primary big full js-start-check lesson-start" id="chkFoot">${ico("target", 18)} ${t("startCheck")} (${s.check.length})</button></div>${A.isDone("skill:" + id) ? `<div class="center ok mt">${ico("check", 18)} ${t("completed")}</div>` : ""}</main>`; };
  A.bind.skill = ([id]) => { const s = SKILLS.find(x => x.id === id); document.querySelectorAll(".js-start-check").forEach(b => { b.onclick = () => A.startQuiz({ key: "check:skill:" + id, title: tx(s.title), questions: s.check, timer: false, onPass: () => A.markDone("skill:" + id, XP_RULES.skill) }); }); };

  /* ---------- Day One ---------- */
  V.dayone = ([id]) => { const es = S.lang === "es"; const qv = A.d1q || "";
    const list = DAY_ONE.filter(c => !qv || (tx(c.q) + " " + tx(c.a) + " " + c.tags).toLowerCase().includes(qv.toLowerCase()));
    return `<main class="page">${head(es ? "Supervivencia del Día Uno" : "Day One Survival")}
      <p class="muted">${es ? "Lo básico que todos buscan. Cero conocimiento previo." : "The everyday basics everyone looks up. Zero experience needed."}</p>
      <div class="search">${ico("search", 18)}<input id="d1s" placeholder="${es ? "Buscar: cinta, breaker, filtro…" : "Search: tape, breaker, filter…"}" value="${esc(qv)}"></div>
      <div class="qa-list">${list.map(c => `<details class="qa" id="qa-${c.id}" ${id === c.id ? "open" : ""} data-id="${c.id}"><summary><span class="qa-ico">${c.icon}</span><b class="grow">${esc(tx(c.q))}</b>${S.dayoneSeen[c.id] ? ico("check", 16, "ok") : ""}</summary><p>${esc(tx(c.a))}</p></details>`).join("") || `<div class="empty">${ico("search", 40)}<p>${es ? "Nada encontrado. Pregúntale al Coach." : "Nothing found. Try asking the Coach."}</p><a class="btn" href="#/coach">${t("coach")}</a></div>`}</div>
      <p class="muted sm center">${Object.keys(S.dayoneSeen).length}/${DAY_ONE.length} ${es ? "leídas" : "read"}</p></main>`; };
  A.bind.dayone = ([id]) => {
    const inp = $("#d1s"); inp.oninput = () => { A.d1q = inp.value; const pos = inp.selectionStart; A.render(); const n = $("#d1s"); n.focus(); n.setSelectionRange(pos, pos); };
    document.querySelectorAll(".qa").forEach(d => d.addEventListener("toggle", () => { if (d.open && !S.dayoneSeen[d.dataset.id]) { S.dayoneSeen[d.dataset.id] = Date.now(); A.addXP(XP_RULES.dayone); A.save(); const nb = A.checkBadges(); nb.forEach(b => A.toast(`${b.icon} ${tx(b.name)}`, "badge")); if (Object.keys(S.dayoneSeen).length === 5) { A.syncModules(); A.celebrate({ title: S.lang === "es" ? "¡Día Uno superado!" : "Day One survived!" }); } } }));
    if (id) { const el = $("#qa-" + id); el && el.scrollIntoView({ block: "center" }); }
  };

  /* ---------- tools ---------- */
  V.tools = () => { const plan = A.plan(); const pk = plan ? { residential_service_tech: "rs", residential_installer: "ri", commercial_service_tech: "cs", commercial_installer: "ci" }[plan.pathId] : null; const f = A.toolFilter || "all"; const es = S.lang === "es";
    const list = TOOLS.filter(x => f === "all" || x.paths.includes(f));
    return `<main class="page tools-gallery">${head(es ? "Herramientas especializadas" : "Specialized HVAC Tools")}
      <p class="tools-lead muted sm">${es ? "Toca una foto para ver qué es, qué hace, cuándo la toma un técnico y un consejo." : "Tap a picture to see what it is, what it does, when a tech grabs it, and one tip."}</p>
      <div class="seg scroll">${[["all", es ? "Todas" : "All"], ["rs", es ? "Serv. resid." : "Res. service"], ["ri", es ? "Inst. resid." : "Res. install"], ["cs", es ? "Serv. com." : "Com. service"], ["ci", es ? "Inst. com." : "Com. install"]].map(([k, l]) => `<button data-tf="${k}" class="${f === k ? "sel" : ""}">${l}${k === pk ? " ★" : ""}</button>`).join("")}</div>
      <div class="tool-grid">${list.map(x => `<a class="tool-card" href="#/tool/${x.id}">${toolSVG(x.id)}<span>${esc(tx(x.name))}</span>${S.toolsSeen[x.id] ? `<i class="seen">${ico("check", 14)}</i>` : ""}</a>`).join("")}</div>
    </main>`; };
  A.bind.tools = () => document.querySelectorAll("[data-tf]").forEach(b => b.onclick = () => { A.toolFilter = b.dataset.tf; A.render(); });
  V.tool = ([id]) => { const x = TOOLS.find(y => y.id === id); if (!x) return V.notfound(); const es = S.lang === "es";
    if (!S.toolsSeen[id]) { S.toolsSeen[id] = Date.now(); A.save(); setTimeout(() => A.checkBadges().forEach(b => A.toast(`${b.icon} ${tx(b.name)}`, "badge")), 300); }
    return `<main class="page tool-learn">${head(tx(x.name), "#/tools")}
      <div class="tool-hero">${toolSVG(id)}</div>
      <article class="tool-sheet card">
        <section class="tool-fact"><h4>${es ? "Qué es" : "What it is"}</h4><p>${esc(tx(x.what))}</p></section>
        <section class="tool-fact"><h4>${es ? "Qué hace" : "What it does"}</h4><p>${esc(tx(x.use))}</p></section>
        <section class="tool-fact"><h4>${es ? "Cuándo la toma un técnico" : "When a tech grabs it"}</h4><p>${esc(tx(x.when))}</p></section>
        <section class="tool-fact tip"><h4>${es ? "Un consejo" : "One tip"}</h4><p>${esc(tx(x.tip))}</p></section>
      </article>
    </main>`; };

  /* ---------- EPA ---------- */
  V.epa = ([sec]) => { const es = S.lang === "es";
    if (!sec) return `<main class="page">${head("EPA 608")}<div class="note">${ico("info", 18)} ${t("epaDisclaimer")}</div>
      ${window.REG_NOTES ? `<div class="note warn epa-bank">${ico("calendar", 18)} <span>${esc(tx(REG_NOTES.epa608bank.text))} ${REG_NOTES.epa608bank.refs.map(r => `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title.split(" — ")[0])}</a>`).join(" · ")}</span></div>` : ""}
      ${EPA_SECTIONS.map((s, i) => { const b = A.quizBest("epa:" + s.id); return `<a class="card epa-card ${i === 0 ? "featured" : ""}" href="#/epa/${s.id}"><div class="row gap"><span class="lc-ico big">${icoFor(s.id)}</span><div class="grow"><h3>${esc(tx(s.title))}${i === 0 ? ` <span class="chip orange">${t("defaultStart")}</span>` : ""}</h3><div class="sm muted">${esc(tx(s.sub))}</div>${s.status === "preview" ? `<div class="sm warn">${t("comingSoon")}</div>` : ""}</div>${b != null ? ringSVG(b, 52) : `<span class="sm muted">${t("notTaken")}</span>`}</div></a>`; }).join("")}
      <p class="sm muted">${es ? "Fuente: 40 CFR Parte 82, Subparte F (eCFR) y los temas públicos del examen de la EPA. La EPA también regula los HFC bajo 40 CFR Parte 84 (Ley AIM)." : "Source: 40 CFR Part 82, Subpart F (eCFR) and EPA's public test topics. EPA also regulates HFCs under 40 CFR Part 84 (AIM Act)."} <a href="https://www.ecfr.gov/current/title-40/chapter-I/subchapter-C/part-82/subpart-F" target="_blank" rel="noopener">ecfr.gov</a></p>
      ${window.REG_NOTES ? `<details class="card tight"><summary><b>${ico("info", 16)} ${es ? "R-410A y la Ley AIM: qué está vigente" : "R-410A and the AIM Act: what's current"}</b></summary><p class="sm">${esc(tx(REG_NOTES.r410a.long))}</p>${A.refsBlock(REG_NOTES.r410a.refs)}</details>` : ""}</main>`;
    const s = EPA_SECTIONS.find(x => x.id === sec); if (!s) return V.notfound(); const qs = EPA_QUESTIONS[sec]; const b = A.quizBest("epa:" + sec);
    const gid = { core: "epa-core-guide", type1: "epa-t1-guide", type2: "epa-t2-guide", type3: "epa-t3-guide" }[sec];
    return `<main class="page has-lesson-foot">${head("EPA 608 " + tx(s.title), "#/epa")}
      <section class="card center">${b != null ? ringSVG(b, 96) : `<div class="lc-ico huge">${ico({ core: "shield", type1: "box", type2: "snow", type3: "cycle" }[sec] || "shield", 38)}</div>`}<h2>${esc(tx(s.title))}</h2><p class="muted">${esc(tx(s.sub))}</p><p class="sm">${Math.min(25, qs.length)} ${es ? "preguntas por intento, de un banco de" : "questions per attempt, from a bank of"} ${qs.length} · ${t("passNote")}</p>
      ${(S.quiz["epa:" + sec] || {}).attempts ? `<p class="sm muted">${es ? "Intentos" : "Attempts"}: ${S.quiz["epa:" + sec].attempts}</p>` : ""}</section>
      <a class="list-card" href="#/guide/${gid}"><span class="lc-ico">${ico("book")}</span><span class="grow">${t("studyFirst")}</span>${A.isDone("guide:" + gid) ? ico("check", 18, "ok") : ico("arrow", 18)}</a>
      <div class="seg"><button data-tm="1" class="${S.settings.timer ? "sel" : ""}">${ico("clock", 16)} ${t("timerMode")}</button><button data-tm="0" class="${S.settings.timer ? "" : "sel"}">${t("relaxed")}</button></div>
      <div class="note sm">${t("epaDisclaimer")}</div>
      <div class="lesson-foot"><button class="btn primary big full lesson-start" id="sq">${ico("play", 18)} ${t("startQuiz")}</button></div></main>`; };
  A.bind.epa = ([sec]) => { if (!sec) return; document.querySelectorAll("[data-tm]").forEach(b => b.onclick = () => { S.settings.timer = b.dataset.tm === "1"; A.save(); A.render(); });
    $("#sq").onclick = () => A.startQuiz({ key: "epa:" + sec, title: "EPA 608 " + tx(EPA_SECTIONS.find(x => x.id === sec).title), questions: EPA_QUESTIONS[sec], take: 25, timer: S.settings.timer, epa: true }); };

  /* ---------- glossary ---------- */
  V.glossary = () => `<main class="page">${head(S.lang === "es" ? "Glosario" : "Glossary", "#/library")}${GLOSSARY.map(g => `<section class="card tight"><h4>${esc(tx(g.t))}</h4><p>${esc(tx(g.d))}</p></section>`).join("")}</main>`;

  /* ---------- gear ---------- */
  V.gear = () => { const es = S.lang === "es", cat = A.gearCat || "kit", plan = A.plan(); const pid = plan ? plan.pathId : "residential_service_tech";
    const kit = STARTER_KITS[pid] || []; const have = kit.filter(id => S.kit[id]).length;
    return `<main class="page">${head(t("gear"), "#/more")}
      <div class="seg scroll"><button data-gc="kit" class="${cat === "kit" ? "sel" : ""}">${t("starterKit")}</button>${GEAR_CATEGORIES.map(c => `<button data-gc="${c.id}" class="${cat === c.id ? "sel" : ""}">${esc(tx(c.title))}</button>`).join("")}<button data-gc="deals" class="${cat === "deals" ? "sel" : ""}">${es ? "Ofertas" : "Deals"}</button></div>
      ${cat === "kit" ? `<section class="card tight row between"><div><b>${esc(tx(PATH_LABELS[pid]))}</b><div class="sm muted">${have}/${kit.length} ${es ? "listos" : "ready"}</div></div>${ringSVG(pct(have, kit.length), 52)}</section>
        <div class="kit-list">${kit.map(id => { const x = TOOLS.find(y => y.id === id); return `<label class="kit-item ${S.kit[id] ? "have" : ""}"><input type="checkbox" data-kit="${id}" ${S.kit[id] ? "checked" : ""}><span class="kit-svg">${toolSVG(id)}</span><span class="grow">${esc(tx(x.name))}</span><a href="#/tool/${id}" class="iconbtn sm">${ico("info", 18)}</a></label>`; }).join("")}</div>` : ""}
      ${GEAR_CATEGORIES.filter(c => c.id === cat).map(c => `<section class="card"><ul class="checks">${c.items.map(i => `<li>${ico("check", 16)} ${esc(tx(i))}</li>`).join("")}</ul></section>`).join("")}
      ${cat === "deals" ? DEALS.map(d => `<section class="card deal ${d.placeholder ? "placeholder" : ""}">${d.placeholder ? `<span class="chip warn">${t("exampleBadge")}</span>` : ""}<div class="row gap"><span class="deal-logo">${esc(d.logo)}</span><div class="grow"><h3>${esc(d.partner)}</h3><p class="sm">${esc(tx(d.blurb))}</p></div></div><div class="row between sm"><span>${t("code")}: <code>${esc(d.discountCode)}</code></span><span class="muted">${t("expires")}: ${esc(d.expiry)}</span></div>${d.link && !d.placeholder ? `<a class="btn primary full" href="${esc(d.link)}" target="_blank" rel="noopener">${es ? "Ver oferta" : "View deal"}</a>` : ""}</section>`).join("") + `<section class="card partner"><h3>${ico("tag", 20)} ${t("becomePartner")}</h3><p>${t("partnerBlurb")}</p></section>` : ""}
      <p class="muted sm">${t("gearNote")}</p></main>`; };
  A.bind.gear = () => { document.querySelectorAll("[data-gc]").forEach(b => b.onclick = () => { A.gearCat = b.dataset.gc; A.render(); }); document.querySelectorAll("[data-kit]").forEach(c => c.onchange = () => { S.kit[c.dataset.kit] = c.checked; A.save(); A.render(); }); };

  /* ---------- More hub ---------- */
  V.more = () => {
    const es = S.lang === "es", rk = A.rank();
    const nRev = A.reviewCount && A.reviewCount();
    const row = (href, icon, title, sub, extra) => `<a class="list-card" href="${href}"><span class="lc-ico">${ico(icon)}</span><span class="grow"><b>${title}</b>${sub ? `<span class="sm muted block">${sub}</span>` : ""}</span>${extra || ""}${ico("arrow", 18)}</a>`;
    return `<main class="page more-hub">${head(t("more"))}
      <a class="list-card more-profile" href="#/avatar"><span class="set-av">${avatarSVG(S.avatar, 72)}</span><span class="grow"><b>${esc(S.name)}</b><span class="sm muted block">${rk.r.icon} ${esc(A.rankName(rk.r, true))} · ${S.xp} XP</span></span>${ico("arrow", 18)}</a>
      <h3 class="sec-h">${es ? "Progreso" : "Progress"}</h3>
      <div class="card-list">${row("#/achievements", "trophy", es ? "Logros" : "Achievements", es ? "Rango, insignias e historial" : "Rank, badges and history")}${row("#/certs", "cert", t("certificates"), es ? "Certificados de práctica de HVAC Ready" : "HVAC Ready practice certificates")}${row("#/review", "target", es ? "Repaso" : "Review queue", es ? "Preguntas que te volviste a encontrar" : "Questions to come back to", nRev ? `<span class="pill-n">${nRev}</span>` : "")}</div>
      <h3 class="sec-h">${es ? "Equipo" : "Shop"}</h3>
      <div class="card-list">${row("#/gear", "cart", t("gear"), es ? "Kit inicial y ofertas de ejemplo" : "Starter kit and sample deals")}${S.settings.company ? row("#/company", "user", es ? "Empresa" : "Company", es ? "Panel demo en este dispositivo" : "Demo dashboard on this device") : ""}</div>
      <h3 class="sec-h">${es ? "App" : "App"}</h3>
      <div class="card-list">${row("#/settings", "cog", t("settings"), es ? "Idioma, sonido, respaldo y más" : "Language, sound, backup and more")}${row("#/credits", "info", es ? "Fuentes y créditos" : "Sources & credits")}</div>
    </main>`;
  };

  /* ---------- achievements ---------- */
  V.achievements = () => { const es = S.lang === "es", rk = A.rank(); A.checkBadges();
    const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return d; });
    const xpDay = days.map(d => S.history.filter(h => new Date(h.t).toDateString() === d.toDateString()).length);
    const scores = S.history.filter(h => h.type === "quiz" && h.total).slice(0, 12).reverse().map(h => Math.round(100 * h.score / h.total));
    const nb = Object.keys(S.badges).length;
    return `<main class="page">${head(es ? "Logros" : "Achievements", "#/more")}
      <section class="card rank-card"><div class="row gap">${avatarSVG(S.avatar, 100)}<div class="grow"><div class="eyebrow">${t("level")} ${rk.i + 1}</div><h2>${rk.r.icon} ${esc(A.rankName(rk.r, true))}</h2><p class="sm muted rank-tag">${esc(tx(rk.r.line))}</p><div class="xpbar"><span style="width:${rk.pct}%"></span></div><div class="sm muted">${S.xp} XP${rk.next ? ` · ${rk.next.xp - S.xp} ${es ? "para" : "to"} ${esc(tx(rk.next))}` : ""}</div></div></div>
        <div class="stats">${[[ico("fire", 18), S.streak.count, t("dayStreak")], [ico("target", 18), S.quizzes, es ? "quizzes" : "quizzes"], [ico("game", 18), S.games, es ? "juegos" : "games"], [ico("medal", 18), nb + "/" + BADGES.filter(b => !b.hidden || S.badges[b.id]).length, es ? "insignias" : "badges"], [ico("bolt", 18), S.bestRow || 0, es ? "mejor racha" : "best in a row"]].map(([i, v, l]) => `<div>${i}<b>${v}</b><span>${l}</span></div>`).join("")}</div></section>
      <h3 class="sec-h">${es ? "Escalera de rangos" : "Rank ladder"}</h3><div class="ranks">${RANKS.map((r, i) => `<span class="rk ${i <= rk.i ? "on" : ""}" title="${r.xp} XP · ${esc(tx(r.line))}">${r.icon}<small>${esc(tx(r))}</small></span>`).join("")}</div>
      <h3 class="sec-h">${es ? "Actividad (14 días)" : "Activity (14 days)"}</h3><section class="card tight">${barsSVG(xpDay, days.map(d => d.getDate()))}</section>
      ${scores.length ? `<h3 class="sec-h">${es ? "Puntajes recientes" : "Recent quiz scores"}</h3><section class="card tight">${lineSVG(scores)}</section>` : ""}
      <h3 class="sec-h">${es ? "Insignias" : "Badges"}</h3>${nb ? "" : `<div class="empty fun sm-empty">${ico("medal", 34)}<p><b>${es ? "Aún no tienes insignias." : "No badges yet."}</b> ${es ? "Hasta el perro tiene una." : "Even the dog has one."}</p></div>`}<div class="badge-grid">${BADGES.filter(b => !b.hidden || S.badges[b.id]).map(b => { const on = S.badges[b.id]; return `<div class="badge-c ${on ? "on" : ""}"><span class="b-ico">${on ? b.icon : ico("lock", 22)}</span><b>${esc(tx(b.name))}</b><small>${esc(tx(b.desc))}</small>${on ? `<small class="muted">${new Date(on).toLocaleDateString()}</small>` : ""}</div>`; }).join("")}</div>
      <h3 class="sec-h">${es ? "Historial" : "History"}</h3>${S.history.length ? `<ul class="history">${S.history.slice(0, 40).map(h => `<li><span class="h-type">${ico({ quiz: "target", game: "game", guide: "book", video: "video", module: "flag", skill: "hand" }[h.type] || "star", 16)}</span><span class="grow">${esc(h.title)}${h.total ? ` · <b>${h.score}/${h.total}</b>` : h.score != null ? ` · <b>${h.score}</b>` : ""}</span><time class="muted sm">${new Date(h.t).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time></li>`).join("")}</ul>` : `<div class="empty fun">${ico("history", 40)}<p><b>${es ? "Nada en el historial todavía." : "No history yet."}</b><br>${es ? "Hasta el chalán ya hizo un quiz. Te toca." : "Even the shop helper took a quiz. Your turn."}</p><a class="btn primary" href="#/epa/core">EPA 608 Core</a></div>`}
    </main>`; };

  /* ---------- certificates ---------- */
  V.certs = () => { const nc = A.checkCerts(); if (nc.length && A.victory) setTimeout(() => A.victory({ kind: "cert", title: tx(nc[0].title) }), 300); const es = S.lang === "es"; return `<main class="page">${head(t("certificates"), "#/more")}<div class="note">${ico("info", 18)} ${t("certPractice")}</div>
    <div class="card-list">${A.CERTS.map(c => { const on = S.certs[c.id]; return `<a class="list-card ${on ? "done" : "locked"}" href="${on ? "#/cert/" + c.id : "#/certs"}"><span class="lc-ico">${on ? ico("cert") : ico("lock")}</span><span class="grow"><b>${esc(tx(c.title))}</b><span class="sm muted block">${on ? t("earned") + " " + new Date(on).toLocaleDateString() : t("locked")}</span></span>${on ? ico("arrow", 18) : ""}</a>`; }).join("")}</div></main>`; };
  V.cert = ([id]) => { const c = A.CERTS.find(x => x.id === id); const on = S.certs[id]; if (!c || !on) return V.certs(); const plan = A.plan(), es = S.lang === "es";
    return `<main class="page">${head(t("certTitle"), "#/certs", `<button class="iconbtn" onclick="window.print()" aria-label="${t("print")}">${ico("cert")}</button>`)}
      <div class="certificate"><div class="cert-border"><div class="cert-top">${A.logo()}<span>HVAC Ready</span></div><div class="eyebrow">${t("certTitle")}</div><div class="cert-av">${avatarSVG(S.avatar, 140)}</div>
      <div class="muted">${t("awardedTo")}</div><h1 class="cert-name">${esc(S.name)}</h1><div class="muted">${t("forCompleting")}</div><h2>${esc(tx(c.title))}</h2>
      ${plan ? `<div class="sm">${esc(tx(PATH_LABELS[plan.pathId]))}</div>` : ""}<div class="cert-date">${new Date(on).toLocaleDateString(S.lang === "es" ? "es-MX" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</div><div class="cert-id">${es ? "ID del certificado" : "Certificate ID"}: <b>${A.certId(id)}</b></div>
      <div class="cert-seal">${ico("medal", 40)}</div><p class="sm muted">${t("certPractice")} ${S.lang === "es" ? "No es EPA, NATE, OSHA ni licencia estatal." : "Not an EPA, NATE, OSHA or state credential."}</p></div></div>
      <button class="btn primary big full" onclick="window.print()">${t("print")}</button></main>`; };

  /* ---------- settings ---------- */
  V.settings = () => { const es = S.lang === "es", c = Coach.cfg(); return `<main class="page">${head(t("settings"), "#/more")}
    <section class="card brand-about"><img src="img/logo.png" alt="" width="64" height="64"><div class="grow"><span class="brand-name">HVAC Ready</span><p class="sm muted brand-tag">${esc(t("tagline"))}</p><p class="sm">${es ? "Hecha por un técnico de HVAC que empezó de cero y sin buenos recursos — para quien entra en frío, y para quien ya está en el campo y quiere subir de abajo hasta arriba." : "Built by an HVAC tech who started with nothing and no good resources — made for anyone coming in cold, and anyone already in the field who wants to climb from the bottom to the top."}</p></div></section>
    <section class="card"><h3>${t("language")}</h3><div class="seg"><button data-set-lang="en" class="${S.lang === "en" ? "sel" : ""}">English</button><button data-set-lang="es" class="${S.lang === "es" ? "sel" : ""}">Español</button></div></section>
    <section class="card"><h3>${t("name")} & ${t("avatar")}</h3><input class="input" id="sn" value="${esc(S.name)}" maxlength="24"><a class="list-card mt" href="#/avatar"><span class="set-av">${avatarSVG(S.avatar, 72)}</span><span class="grow"><b>${es ? "Editar personaje" : "Edit character"}</b><span class="sm muted block">${es ? "Piel, cabello, casco, ropa, botas y herramienta" : "Skin, hair, hard hat, outfit, boots and tool"}</span></span>${ico("arrow", 18)}</a></section>
    <section class="card"><h3>${ico("cog", 20)} ${t("sound")}</h3><div id="setSound">${A.soundControls ? A.soundControls("ss") : ""}</div></section><section class="card"><h3>${es ? "Juego y pantalla" : "Play & display"}</h3>
      <div class="appear-row"><span>${ico("sun", 18)} ${es ? "Apariencia" : "Appearance"}<small class="block muted">${es ? "Automático sigue el modo de tu teléfono" : "Auto follows your phone's setting"}</small></span>
      <div class="seg sm appear-seg" role="radiogroup" aria-label="${es ? "Apariencia" : "Appearance"}">${[["dark", es ? "Oscuro" : "Dark"], ["light", es ? "Claro" : "Light"], ["auto", es ? "Auto" : "Auto"]].map(([k, l]) => `<button role="radio" aria-checked="${A.appearance() === k}" data-appear="${k}" class="${A.appearance() === k ? "sel" : ""}">${l}</button>`).join("")}</div></div>${[["timer", t("timerMode")], ["narration", t("narration")], ["reduceMotion", es ? "Reducir animaciones" : "Reduce motion"]].map(([k, l]) => `<label class="switch-row"><span>${l}</span><input type="checkbox" class="switch" data-setk="${k}" ${((k === "dark" || k === "uiClicks") ? S.settings[k] !== false : S.settings[k]) ? "checked" : ""}></label>`).join("")}</section>
    <section class="card"><h3>${ico("chat", 20)} ${t("aiSettings")}</h3><p class="sm muted">${t("aiHelp")}</p>
      <label class="sm">${t("endpoint")}<input class="input" id="aiE" placeholder="https://your-server.example.com/v1/chat/completions" value="${esc(c.endpoint || "")}"></label>
      <label class="sm">${t("apiKey")}<input class="input" id="aiK" type="password" autocomplete="off" placeholder="sk-…" value="${esc(c.apiKey || "")}"></label>
      <label class="sm">${t("model")}<input class="input" id="aiM" placeholder="model-name" value="${esc(c.model || "")}"></label>
      <div class="row gap"><button class="btn primary" id="aiS">${t("save")}</button><button class="btn" id="aiX">${es ? "Borrar" : "Clear"}</button></div></section>
    ${S.ownerUnlocked ? `<section class="card owner-card"><label class="switch-row"><span>${es ? "Modo propietario" : "Owner mode"}<small class="block muted">${es ? "Desbloquea todos los juegos y niveles de arcade en este dispositivo." : "Unlocks every arcade game and level on this device."}</small></span><input type="checkbox" class="switch" id="ownerMode" ${S.ownerMode ? "checked" : ""}></label></section>` : ""}
    <section class="card"><a class="list-card" href="#/credits"><span class="lc-ico">${ico("info")}</span><span class="grow">${es ? "Fuentes y créditos" : "Sources & credits"}</span>${ico("arrow", 18)}</a><p class="sm muted">${t("privacy")}</p><button class="btn danger full" id="rst">${t("resetAll")}</button></section></main>`; };
  A.bind.settings = () => {
    document.querySelectorAll("[data-set-lang]").forEach(b => b.onclick = () => { S.lang = b.dataset.setLang; if (S.lang === "es") S.usedEs = true; A.save(); Coach.rebuild(); A.render(); });
    $("#sn").onchange = e => { S.name = e.target.value.trim() || S.name; A.save(); };
    document.querySelectorAll("[data-appear]").forEach(b => b.onclick = () => { S.settings.appearance = b.dataset.appear; A.save(); A.applySettings(); Sound.sfx("toggle"); document.querySelectorAll("[data-appear]").forEach(x => { const on = x === b; x.classList.toggle("sel", on); x.setAttribute("aria-checked", on); }); });
    document.querySelectorAll("[data-setk]").forEach(c => c.onchange = () => { S.settings[c.dataset.setk] = c.checked; A.save(); A.applySettings(); });
    const ss = $("#setSound"), paintSS = () => { ss.innerHTML = A.soundControls("ss"); A.bindSoundControls(ss, paintSS); }; if (ss && A.bindSoundControls) A.bindSoundControls(ss, paintSS);
    $("#aiS").onclick = () => { Coach.saveCfg({ endpoint: $("#aiE").value.trim(), apiKey: $("#aiK").value.trim(), model: $("#aiM").value.trim() }); A.toast(t("saved")); };
    $("#aiX").onclick = () => { Coach.saveCfg({}); A.render(); };
    const om = $("#ownerMode");
    if (om) om.onchange = () => { S.ownerMode = !!om.checked; A.save(); A.syncOwnerUnlock && A.syncOwnerUnlock(); Sound.sfx && Sound.sfx("toggle"); };
    $("#rst").onclick = () => { if (confirm(t("resetConfirm"))) { localStorage.removeItem(A.KEY); location.hash = ""; location.reload(); } };
  };

  /* ---------- credits ---------- */
  V.credits = () => { const P = window.PROGRESSION, es = S.lang === "es"; return `<main class="page">${head(es ? "Fuentes y créditos" : "Sources & credits", "#/settings")}
    <section class="card"><p>${esc(tx(CREDITS_NOTE))}</p></section>
    <h3 class="sec-h">${es ? "Advertencias de la investigación" : "Research caveats"}</h3><section class="card"><ul class="sm">${P.meta.caveats.map(c => `<li>${esc(c)}</li>`).join("")}</ul></section>
    <h3 class="sec-h">${es ? "Fuentes" : "Sources"}</h3><section class="card"><ul class="sources">${P.sources.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title || s.id)}</a><span class="muted sm block">${esc(s.url.replace(/^https?:\/\//, "").slice(0, 70))}</span></li>`).join("")}</ul></section>
    <section class="card sm"><b>${es ? "Software" : "Software"}</b><p>three.js (MIT) — vendor/three. ${es ? "Música y efectos generados con Web Audio API; contenido, ilustraciones y preguntas originales." : "Music and sound effects generated with the Web Audio API; content, illustrations and questions are original."}</p><p>${es ? "No afiliado con EPA, NATE, ESCO/HVAC Excellence, NCCER, ACCA, OSHA ni HVAC School." : "Not affiliated with EPA, NATE, ESCO/HVAC Excellence, NCCER, ACCA, OSHA or HVAC School."}</p></section></main>`; };

  /* ---------- 3D models ---------- */
  V.models = () => { const es = S.lang === "es", which = A.model3d || "split";
    const tabs = [
      ["split", es ? "Sistema dividido" : "Split system"],
      ["cycle", es ? "Ciclo 3D" : "3D cycle"],
      ["compressor", es ? "Compresor (corte)" : "Compressor cutaway"],
      ["txv", "TXV"],
      ["coils", es ? "Serpentines" : "Coils"],
      ["furnace", es ? "Horno (corte)" : "Furnace cutaway"]
    ];
    const labelsOn = A.modelLabels !== false;
    return `<main class="page">${head(es ? "Modelos 3D" : "3D Models")}
    <div class="m3d-tabs" role="tablist" aria-label="${es ? "Modelos" : "Models"}">${tabs.map(([id, lab]) => `<button type="button" role="tab" aria-selected="${which === id}" data-m="${id}" class="${which === id ? "sel" : ""}">${lab}</button>`).join("")}</div>
    <div class="m3d-well"><div class="m3d${labelsOn ? "" : " labels-off"}" id="m3d"><div class="m3d-loading">${A.saying("loading")}</div></div></div>
    <div class="m3d-tools"><p class="sm muted hint">${es ? "Arrastra para girar · pellizca para acercar · toca una etiqueta" : "Drag to rotate · pinch to zoom · tap a label"}</p>
    <button type="button" class="btn sm" id="m3dLabels" aria-pressed="${labelsOn}">${labelsOn ? (es ? "Ocultar etiquetas" : "Hide labels") : (es ? "Mostrar etiquetas" : "Show labels")}</button></div>
    <div id="m3dInfo" class="part-info"></div></main>`; };
  const M3D_INFO = {
    condenser: ["Condenser coil — rejects heat outdoors", "Serpentín condensador: rechaza calor afuera"], compressor: ["Compressor — the pump of the system", "Compresor: la bomba del sistema"], contactor: ["Control panel — contactor + capacitor live here", "Panel de control: aquí van el contactor y el capacitor"],
    evaporator: ["Evaporator A-coil — absorbs indoor heat", "Serpentín evaporador en A: absorbe calor interior"], txv: ["TXV — meters refrigerant into the coil", "TXV: dosifica refrigerante al serpentín"], blower: ["Blower — moves air across the coil", "Soplador: mueve aire por el serpentín"], filter: ["Filter — protects coil and blower", "Filtro: protege serpentín y soplador"],
    suction: ["Suction line (large, insulated, cool vapor)", "Línea de succión (gruesa, aislada, vapor frío)"], liquid: ["Liquid line (small, warm liquid)", "Línea de líquido (delgada, líquido tibio)"],
    scrolls: ["Scrolls — one fixed, one orbiting, squeezing vapor toward the center", "Espirales: una fija y una orbitante que comprimen el vapor hacia el centro"], motor: ["Motor windings — drive the shaft", "Devanados — mueven la flecha"], shaft: ["Crankshaft — drives the orbiting scroll", "Cigüeñal — mueve la espiral orbitante"], suctionPort: ["Suction inlet — cool vapor in", "Entrada de succión — vapor frío"], dischargePort: ["Discharge outlet — hot gas out", "Salida de descarga — gas caliente"], terminals: ["Terminals C, S, R", "Terminales C, S, R"],
    powerHead: ["Power head — diaphragm moves the pin", "Cabeza de poder: el diafragma mueve la aguja"], bulb: ["Sensing bulb — strapped to the suction line", "Bulbo sensor: sujeto a la línea de succión"], capillary: ["Capillary tube — carries bulb pressure", "Tubo capilar: transmite la presión del bulbo"], pin: ["Pin / needle — opens or closes the port", "Aguja — abre o cierra el orificio"], inlet: ["Inlet — warm high-pressure liquid", "Entrada — líquido tibio de alta presión"], outlet: ["Outlet — cold low-pressure mix to the evaporator", "Salida — mezcla fría de baja presión al evaporador"], equalizer: ["External equalizer line", "Línea igualadora externa"],
    diaphragm: ["Diaphragm — bulb pressure pushes against the spring", "Diafragma: la presión del bulbo empuja contra el resorte"], spring: ["Superheat spring — sets the opening force", "Resorte de sobrecalentamiento: fija la fuerza de apertura"], orifice: ["Orifice — the metering port the needle seats in", "Orificio: el puerto de dosificación donde sienta la aguja"],
    aCoil: ["Evaporator A-coil — two slabs in an A, absorbs indoor heat", "Serpentín en A: dos bancos en A, absorbe calor interior"], condCoil: ["Condenser coil — fin-and-tube bank that rejects heat outdoors", "Serpentín condensador: banco aleteado que rechaza calor afuera"], fins: ["Aluminum fins — add surface area for heat transfer", "Aletas de aluminio: agregan superficie de intercambio"], tubes: ["Copper tubes — refrigerant path through the coil", "Tubos de cobre: el recorrido del refrigerante"], distributor: ["Distributor — feeds each evaporator circuit evenly", "Distribuidor: alimenta por igual cada circuito del evaporador"], header: ["Header / manifold — collects the circuits", "Colector: reúne los circuitos"],
    heatExchanger: ["Heat exchanger — hot flue gas inside, supply air outside", "Intercambiador: gases calientes adentro, aire de impulsión afuera"], burners: ["Inshot burners — flame shoots into the exchanger tubes", "Quemadores inshot: la llama entra a los tubos"], inducer: ["Inducer — pulls combustion gases through the exchanger", "Inductor: jala los gases por el intercambiador"], gasValve: ["Gas valve — meters fuel to the burners", "Válvula de gas: dosifica el combustible"], limit: ["Limit switch — opens if the heat exchanger overheats", "Límite: abre si el intercambiador se sobrecalienta"], flue: ["Flue collar — exhaust to the vent", "Collarín de chimenea: salida al ducto"],
    metering: ["Metering device — drops pressure into the evaporator", "Dispositivo de expansión: baja la presión hacia el evaporador"]
  };
  A.bind.models = () => {
    document.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { A.model3d = b.dataset.m; A.render(); });
    const labBtn = document.getElementById("m3dLabels");
    if (labBtn) labBtn.onclick = () => { A.modelLabels = A.modelLabels === false; const on = A.modelLabels !== false; const el = document.getElementById("m3d"); if (el) el.classList.toggle("labels-off", !on); labBtn.setAttribute("aria-pressed", on); labBtn.textContent = on ? (S.lang === "es" ? "Ocultar etiquetas" : "Hide labels") : (S.lang === "es" ? "Mostrar etiquetas" : "Show labels"); if (A.dispose3d && A.dispose3d.setLabelsVisible) A.dispose3d.setLabelsVisible(on); };
    const el = $("#m3d"), which = A.model3d || "split", i = S.lang === "es" ? 1 : 0;
    const labels = {}; Object.entries(M3D_INFO).forEach(([k, v]) => labels[k] = v[i].split(/ [—:(]/)[0].replace(/ (coil|A-coil)$/, ""));
    const pick = id => { Sound.sfx("tap"); $("#m3dInfo").innerHTML = `${ico("info", 16)} ${esc(M3D_INFO[id][i])}`; };
    const gl = (() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } })();
    const fallback = () => { const cycleIds = { split: 1, cycle: 1 }; el.innerHTML = cycleIds[which] ? cycleSVG(S.lang === "es" ? { condenser: "Condensador", compressor: "Compresor", metering: "Expansión", evaporator: "Evaporador" } : {}, { animate: !A.reduced() }) : `<div class="center">${compSVG(which === "txv" ? "txv" : which === "coils" ? "evaporator" : "compressor")}</div>`; el.classList.add("flat"); };
    if (!gl) return fallback();
    if (A.dispose3d) { try { A.dispose3d(); } catch (e) {} A.dispose3d = null; }
    import("./models3d.js").then(m => { if (!document.body.contains(el)) return; el.innerHTML = ""; A.dispose3d = m.mount(el, which, labels, pick); }).catch(fallback);
  };

  V.notfound = () => `<main class="page">${head("—")}<div class="empty">${ico("search", 40)}<p>${S.lang === "es" ? "No encontramos esa página." : "We couldn't find that page."}</p><a class="btn primary" href="#/home">${t("home")}</a></div></main>`;
})();
