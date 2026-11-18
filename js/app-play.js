/* Quiz engine, slide-video player, recognition quiz, coach chat, router + init. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views;
  const $ = s => document.querySelector(s);
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  A.shuffle = shuffle;

  /* Why-it's-right, why-that-was-wrong (by original answer index), and a field tip. */
  A.quizExplain = (q, ok, origPicked) => {
    const es = S.lang === "es";
    const why = tx(q.why) || "";
    const tip = tx(q.tip) || "";
    let wrong = "";
    if (!ok && origPicked != null && q.wrong && q.wrong[origPicked]) wrong = tx(q.wrong[origPicked]) || "";
    const rightL = es ? "Por qué es correcta" : "Why it's right";
    const wrongL = es ? "Por qué esa no" : "Why that was wrong";
    const tipL = es ? "Consejo de campo" : "Field tip";
    return `${why ? `<p class="sm"><b>${rightL}:</b> ${esc(why)}${q.ref ? ` <span class="ref">${esc(q.ref)}</span>` : ""}</p>` : ""}` +
      `${wrong ? `<p class="sm"><b>${wrongL}:</b> ${esc(wrong)}</p>` : ""}` +
      `${tip ? `<p class="sm tip-line"><b>${tipL}:</b> ${esc(tip)}</p>` : ""}`;
  };

  /* ---------- quiz engine (game-like) ---------- */
  let Q = null;
  A.quizState = () => Q;
  A.startQuiz = cfg => {
    Sound.resetStreak && Sound.resetStreak(); Q = Object.assign({ i: 0, score: 0, points: 0, streak: 0, best: 0, missed: [], timer: false, secs: 20 }, cfg);
    Q.items = shuffle(cfg.questions).slice(0, cfg.take || 999).map(q => { const order = shuffle(q.a.map((_, i) => i)); return { q, order, correct: order.indexOf(q.c) }; });
    Sound.playMusic(cfg.music || (/^(placement|epa):/.test(cfg.key || "") ? "exam" : "quiz")); A.go("#/quiz");
  };
  A.startPlacement = m => {
    const qs = []; m.links.forEach(([type, id]) => { if (type === "guide") qs.push(...(LESSONS[id].check || [])); if (type === "skill") qs.push(...SKILLS.find(s => s.id === id).check); if (type === "quiz") qs.push(...EPA_QUESTIONS[id].slice(0, 6)); });
    if (!qs.length) return A.toast(S.lang === "es" ? "No hay preguntas para este módulo." : "No questions for this module.");
    A.startQuiz({ key: "placement:" + m.id, title: (S.lang === "es" ? "Prueba: " : "Test out: ") + tx(m.title), questions: shuffle(qs).slice(0, 8), timer: false,
      onPass: () => { m.links.forEach(([type, id]) => { if (type === "guide" || type === "skill") A.markDone(type + ":" + id); }); S.done["module:" + m.id] = Date.now(); A.save(); } });
  };
  V.quiz = () => {
    if (!Q) return V.home();
    if (Q.i >= Q.items.length) return quizEnd();
    const it = Q.items[Q.i], es = S.lang === "es";
    return `<main class="page quiz">
      <div class="quiz-pin">
      <header class="quiz-top"><a class="iconbtn" href="#/home" id="qx" aria-label="${t("close")}">${ico("close")}</a><div class="qprog"><span style="width:${100 * Q.i / Q.items.length}%"></span></div><span class="qnum">${Q.i + 1}/${Q.items.length}</span><span class="topbar-slot"></span></header>
      <div class="quiz-hud"><span class="hud-pts">${ico("star", 16)} ${Q.points}</span>${Q.streak > 1 ? `<span class="hud-streak">${ico("fire", 16)} ×${Q.streak}</span>` : "<span></span>"}${Q.timer ? `<span class="timer" id="tmr"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="ring-bg"/><circle cx="18" cy="18" r="15" class="ring-fg" id="tmrc" stroke-dasharray="94.2" stroke-dashoffset="0" transform="rotate(-90 18 18)"/></svg><b id="tmrt">${Q.secs}</b></span>` : ""}</div>
      <h2 class="qtext">${esc(tx(it.q.q))}</h2>${A.esNote(it.q.q)}
      </div>
      <div class="answers">${it.order.map((oi, k) => `<button class="ans a${k}" data-k="${k}"><span class="ans-shape">${["▲", "◆", "●", "■"][k]}</span><span>${esc(tx(it.q.a[oi]))}</span></button>`).join("")}</div>
      <div id="fb"></div></main>`;
  };
  let tmr = null;
  A.quizItem = () => (Q && Q.items && Q.i < Q.items.length ? Q.items[Q.i] : null); /* used by the PT chart sheet */
  A.bind.quiz = () => {
    if (!Q || Q.i >= Q.items.length) { const ag = $("#again"); if (ag) ag.onclick = () => A.startQuiz(Q.orig || Q); const rv = $("#rev"); return; }
    $("#qx").onclick = e => { e.preventDefault(); clearInterval(tmr); Sound.stopMusic(); Q = null; history.back(); };
    const it = Q.items[Q.i]; let left = Q.secs, answered = false; const t0 = Date.now();
    const answer = k => {
      if (answered) return; answered = true; clearInterval(tmr);
      const ok = k === it.correct, tl = Math.max(0, Q.secs - (Date.now() - t0) / 1000);
      document.querySelectorAll(".ans").forEach((b, j) => { b.disabled = true; if (j === it.correct) b.classList.add("right"); else if (j === k) b.classList.add("wrongp"); else b.classList.add("dim"); });
      if (ok) { Q.score++; Q.streak++; Q.best = Math.max(Q.best, Q.streak); const p = 500 + Math.round(500 * (Q.timer ? tl / Q.secs : 1)) + (Q.streak > 1 ? Q.streak * 50 : 0); Q.points += p; Sound.sfx("correct", { streak: Q.streak }); A.onStreak(Q.streak); A.reviewMark && A.reviewMark(it.q, true); if (!A.reduced()) burstMini(); }
      else { Q.streak = 0; it.pickedOrig = k == null ? null : it.order[k]; Q.missed.push(it); Sound.sfx("wrong"); A.reviewMark && A.reviewMark(it.q, false); }
      const origPicked = k == null ? null : it.order[k];
      $("#fb").innerHTML = `<div class="feedback ${ok ? "ok" : "bad"}"><h3>${ok ? ico("check", 22) + " " + t("correct") : k == null ? ico("clock", 22) + " " + t("timeUp") : ico("close", 22) + " " + t("wrong")}</h3>
        ${!ok ? `<p class="sm"><b>${t("isAnswer")}</b> ${esc(tx(it.q.a[it.q.c]))}</p>` : ""}${A.quizExplain(it.q, ok, origPicked)}${A.saying(ok ? "correct" : "wrong")}
        <button class="btn primary big full" id="qn">${Q.i === Q.items.length - 1 ? t("finish") : t("continue")} ${ico("arrow", 18)}</button></div>`;
      $("#qn").onclick = () => { Q.i++; A.render(); }; $("#qn").focus({ preventScroll: true }); A.revealQuizContinue($("#qn"));
    };
    document.querySelectorAll(".ans").forEach(b => b.onclick = () => answer(+b.dataset.k));
    if (Q.timer) tmr = setInterval(() => { left -= 1; const el = $("#tmrt"); if (!el) return clearInterval(tmr); el.textContent = left; $("#tmrc").style.strokeDashoffset = 94.2 * (1 - left / Q.secs); if (left <= 5 && left > 0) { Sound.sfx("tick"); $("#tmr").classList.add("hurry"); } if (left <= 0) answer(null); }, 1000);
  };
  function burstMini() { const b = document.querySelector(".ans.right"); if (b) A.sparkAt(b, 14); }
  function quizEnd() {
    Sound.stopMusic(); const pctv = Math.round(100 * Q.score / Q.items.length), pass = pctv >= A.passPct(Q.key), es = S.lang === "es";
    if (!Q.recorded) {
      Q.recorded = true; Q.xp0 = S.xp; const rec = S.quiz[Q.key] || { attempts: 0 }; rec.attempts++; rec.best = Math.max(rec.best || 0, pctv); rec.last = pctv; S.quiz[Q.key] = rec;
      S.quizzes++; if (pctv === 100) S.perfect++; A.addXP(Q.score * XP_RULES.quizPerCorrect + (pass ? XP_RULES.quizPass : 0));
      A.log("quiz", Q.key, Q.title, Q.score, Q.items.length); A.save(); Q.xp1 = S.xp;
      if (pass && Q.onPass) Q.onPass();
      if (pass) { const boost = /^placement:/.test(Q.key) ? XP_RULES.testOutPass : /^epa:/.test(Q.key) ? XP_RULES.epaPass : /^check:guide:(ch5|chp5-)/.test(Q.key) ? XP_RULES.chp5Pass : 0; if (boost && !(S.boosted || (S.boosted = {}))[Q.key]) { S.boosted[Q.key] = 1; A.addXP(boost); } A.awardStar && A.awardStar(Q.key); }
      if (!pass) setTimeout(() => Sound.sfx("wahwah"), 300);
      if (!pass && !/^(placement|epa):/.test(Q.key)) setTimeout(() => Sound.sting && Sound.sting("finished"), 1000);
      if (pass) setTimeout(() => A.celebrate({ title: Q.title, sub: `${pctv}% · ${Q.points} ${t("points").toLowerCase()}`, again: () => A.startQuiz({ ...Q.orig0 }), examPass: /^(placement|epa):/.test(Q.key) }), 450);
    }
    return `<main class="page quiz-end">${A.head(Q.title, "#/home")}<section class="card center">${ringSVG(pctv, 120)}<h2>${pass ? t("passed") : t("keepGoing")}</h2>${(() => { const n = pctv >= 100 ? 3 : pctv >= 80 ? 2 : pctv >= 60 ? 1 : 0; return `<div class="res-stars" data-n="${n}" aria-label="${n}/3">${[0, 1, 2].map(i => `<span class="rs ${i < n ? "on" : ""}">${ico("star", 30)}</span>`).join("")}</div>`; })()}<p><b class="cnt" data-to="${Q.score}">${Q.score}</b>/${Q.items.length} · <b class="cnt" data-to="${Q.points}">${Q.points}</b> ${t("points")} · ${ico("fire", 14)} ${Q.best}</p>${Q.key.startsWith("epa:") ? `<p class="sm muted">${t("passNote")}</p>` : ""}${(() => { const x0 = Q.xp0 ?? S.xp, x1 = Q.xp1 ?? S.xp, r1 = A.rank(x1); return `<div class="res-xp" data-x0="${x0}" data-x1="${x1}"><div class="row between sm"><b class="rx-name">${esc(A.rankName(r1.r, true))}</b><span class="muted">+<b class="cnt" data-to="${x1 - x0}">${x1 - x0}</b> XP</span></div><div class="xpbar"><span style="width:${r1.pct}%"></span></div><div class="rx-up" hidden>${es ? "¡Subiste de rango!" : "Rank up!"}</div></div>`; })()}${Q.quip ?? (Q.quip = A.resultsQuip(Q.items.length))}</section>
      ${Q.missed.length ? `<h3 class="sec-h">${t("reviewMissed")}</h3><a class="link-row" href="#/review">${ico("target", 18)}<span class="grow">${S.lang === "es" ? "Se agregaron a tu Repaso: vuelven mañana, en 3 días y en una semana" : "Added to your Review queue: back tomorrow, in 3 days, then a week"}</span>${ico("next", 16)}</a>${Q.missed.map(m => `<section class="card tight"><b>${esc(tx(m.q.q))}</b><p class="sm ok">${ico("check", 14)} ${esc(tx(m.q.a[m.q.c]))}</p>${A.quizExplain(m.q, false, (m.pickedOrig != null ? m.pickedOrig : null))}</section>`).join("")}` : ""}
      ${(() => { const pl = A.plan(), nm = pl && A.nextModule(pl); return pass && nm ? `<a class="btn primary big full" href="${A.moduleRoute(nm)}">${ico("play", 18)} ${es ? "Siguiente" : "Next"}: ${esc(tx(nm.title))}</a><button class="btn full" id="again">${t("tryAgain")}</button>` : `<button class="btn primary big full" id="again">${t("tryAgain")}</button><a class="btn full" href="#/home">${t("home")}</a>`; })()}</main>`;
  }
  const _start = A.startQuiz; A.startQuiz = cfg => { _start(cfg); Q.orig0 = cfg; Q.orig = cfg; };

  /* ---------- slide-video player ---------- */
  let VP = null;
  function buildSlides(kind, id) {
    const es = S.lang === "es";
    if (kind === "guide") { const g = LESSONS[id]; const sl = [{ h: tx(g.title), p: tx(g.intro), art: "title" }];
      (g.sections || []).forEach((s, i) => sl.push({ h: tx(s.h), p: tx(s.p), art: g.diagram === "cycle" ? "cycle" : id === "components" ? "comp" : "icon", n: i }));
      if (g.cards) sl.push({ h: t("analogy"), p: tx(g.cards.analogy), art: "bulb" }, { h: t("example"), p: tx(g.cards.example), art: "hardhat" });
      const kp = g.keyPoints && (g.keyPoints[S.lang] && g.keyPoints[S.lang].length ? g.keyPoints[S.lang] : g.keyPoints.en); if (kp) sl.push({ h: t("keyPoints"), p: kp.join(" • "), art: "check" });
      return { title: tx(g.title), slides: sl, videoUrl: g.videoUrl, back: "#/guide/" + id, icon: (window.CONTENT_ICON || {})[id] || "book" }; }
    const s = SKILLS.find(x => x.id === id); const sl = [{ h: tx(s.title), p: tx(s.intro), art: "title" }, { h: t("safetyNotes"), p: s.safety.map(esTopic).join(" "), art: "shield" }];
    s.steps.forEach((x, i) => sl.push({ h: (es ? "Paso " : "Step ") + (i + 1), p: esTopic(x), art: "tool", n: i }));
    sl.push({ h: t("mistakes"), p: s.mistakes.map(esTopic).join(" "), art: "warn" }, { h: t("tip"), p: tx(s.cards.tip), art: "bulb" });
    return { title: tx(s.title), slides: sl, videoUrl: s.videoUrl, back: "#/skill/" + id, icon: "hand" };
  }
  const COMP_IDS = ["compressor", "condenser", "evaporator", "txv", "contactor", "capacitor", "thermostat", "drier"];
  function art(sl, deck) {
    if (sl.art === "cycle") return cycleSVG({}, { animate: !A.reduced() });
    if (sl.art === "comp") return `<div class="art-pop">${compSVG(COMP_IDS[sl.n % COMP_IDS.length])}</div>`;
    const m = { title: deck.icon, shield: "shield", bulb: "lightbulb", hardhat: "hardhat", check: "check", warn: "close", tool: "wrench", icon: deck.icon }[sl.art] || "book";
    return `<div class="art-icon">${ico(m, 96)}</div>${sl.n != null ? `<div class="art-num">${sl.n + 1}</div>` : ""}`;
  }
  V.video = ([kind, id]) => {
    const deck = buildSlides(kind, id); VP = VP && VP.key === kind + id ? VP : { key: kind + id, kind, id, i: 0, playing: true, deck };
    VP.deck = deck; const es = S.lang === "es";
    if (deck.videoUrl) return `<main class="page">${A.head(deck.title, deck.back)}<div class="video-real">${/youtube|vimeo/.test(deck.videoUrl) ? `<iframe src="${esc(deck.videoUrl)}" allowfullscreen></iframe>` : `<video src="${esc(deck.videoUrl)}" controls playsinline></video>`}</div><button class="btn primary full" id="vdone">${t("markDone")}</button></main>`;
    const sl = deck.slides[VP.i];
    return `<main class="page video">${A.head(deck.title, deck.back)}
      <div class="player"><div class="slide" id="slide"><div class="slide-art">${art(sl, deck)}</div><h2>${esc(sl.h)}</h2><p>${esc(sl.p)}</p></div>
      <div class="vp-bar"><span id="vpfill"></span></div>
      <div class="vp-dots">${deck.slides.map((_, i) => `<i class="${i === VP.i ? "on" : i < VP.i ? "past" : ""}"></i>`).join("")}</div>
      <div class="vp-ctl"><button class="iconbtn" id="vprev" aria-label="prev">${ico("prev")}</button><button class="iconbtn big primary" id="vplay" aria-label="play">${ico(VP.playing ? "pause" : "play", 28)}</button><button class="iconbtn" id="vnext" aria-label="next">${ico("next")}</button>
      <button class="iconbtn ${S.settings.narration ? "on" : ""}" id="vnar" aria-label="${t("narration")}" title="${t("narration")}">${ico(S.settings.narration ? "sound" : "mute")}</button></div></div>
      <p class="sm muted center">${VP.i + 1}/${deck.slides.length} · ${es ? "Lección animada generada de la guía. Espacio para video real en el futuro." : "Animated lesson generated from the guide. A real video can be dropped in later (videoUrl)."}</p></main>`;
  };
  let vpTimer = null, vpRaf = null;
  A.bind.video = () => {
    const vd = $("#vdone"); if (vd) { vd.onclick = finishVideo; return; }
    const deck = VP.deck, sl = deck.slides[VP.i]; clearTimeout(vpTimer); cancelAnimationFrame(vpRaf); speechSynthesis && speechSynthesis.cancel();
    const go = d => { const n = VP.i + d; if (n >= deck.slides.length) return finishVideo(); VP.i = Math.max(0, n); A.render(); };
    $("#vprev").onclick = () => go(-1); $("#vnext").onclick = () => go(1);
    $("#vplay").onclick = () => { VP.playing = !VP.playing; A.render(); };
    $("#vnar").onclick = () => { S.settings.narration = !S.settings.narration; A.save(); A.render(); };
    if (!A.reduced()) $("#slide").classList.add("enter");
    if (!VP.playing) return;
    const dur = Math.max(4500, (sl.h.length + sl.p.length) * 55); const t0 = performance.now();
    const fill = () => { const f = Math.min(1, (performance.now() - t0) / dur); const el = $("#vpfill"); if (!el) return; el.style.width = f * 100 + "%"; if (f < 1) vpRaf = requestAnimationFrame(fill); };
    if (S.settings.narration && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(sl.h + ". " + sl.p); u.lang = S.lang === "es" ? "es-MX" : "en-US"; u.rate = 1.0;
      const vs = speechSynthesis.getVoices().filter(v => v.lang.startsWith(S.lang)); if (vs.length) u.voice = vs[0];
      u.onend = () => { if (location.hash.startsWith("#/video")) vpTimer = setTimeout(() => go(1), 600); }; speechSynthesis.speak(u);
      const el = $("#vpfill"); el.classList.add("indet");
    } else { vpRaf = requestAnimationFrame(fill); vpTimer = setTimeout(() => go(1), dur); }
  };
  function finishVideo() {
    clearTimeout(vpTimer); window.speechSynthesis && speechSynthesis.cancel(); const key = "video:" + VP.kind + ":" + VP.id;
    if (!S.done[key]) { S.videos++; A.markDone(key, XP_RULES.video); A.log("video", key, VP.deck.title); }
    const back = VP.deck.back, title = VP.deck.title; VP = null; A.celebrate({ title, onDone: () => A.go(back) });
  }

  /* ---------- recognition quiz (tap to identify) ---------- */
  V.play = ([what]) => { if (what === "recog") { const qs = shuffle(COMPONENTS).slice(0, 8).map(c => { const wrong = shuffle(COMPONENTS.filter(x => x.id !== c.id)).slice(0, 3); return { q: { en: "Which component is this?", es: "¿Qué componente es este?" }, img: c.id, a: [c.name, ...wrong.map(w => w.name)], c: 0, why: c.info }; });
      setTimeout(() => A.startQuiz({ key: "recog", title: t("recognition"), questions: qs, timer: S.settings.timer, onPass: () => A.markDone("guide:components", XP_RULES.guide) }), 0); return `<main class="page"></main>`; } return V.notfound(); };
  const _qv = V.quiz; V.quiz = () => { const h = _qv(); if (Q && Q.i < Q.items.length && Q.items[Q.i].q.img) return h.replace('<div class="answers">', `<div class="q-img">${compSVG(Q.items[Q.i].q.img, { labels: false })}</div><div class="answers">`); return h; };

  /* ---------- coach chat ---------- */
  const chat = A.chat = A.chat || [];
  V.coach = () => { const es = S.lang === "es", online = !!Coach.cfg().endpoint;
    const sugg = es ? ["¿Qué es el sobrecalentamiento?", "¿Cómo cambio un filtro?", "¿Cómo pruebo un capacitor?", "¿Qué es la regeneración?", "¿Cómo reinicio un breaker?", "¿Por qué fluir nitrógeno al soldar?"] : ["What is superheat?", "How do I change an air filter?", "How do I test a capacitor?", "What does reclaim mean?", "How do I flip a breaker?", "Why flow nitrogen when brazing?"];
    return `<main class="page coach">${A.head(t("coachTitle"), "#/home", `<a class="iconbtn" href="#/settings" aria-label="${t("settings")}">${ico("settings")}</a>`)}
      <div class="chat" id="chat"><div class="msg bot"><span class="mav">${ico("hardhat", 20)}</span><div class="bubble">${online ? t("coachIntroAI") : t("coachIntro")}</div></div>
      ${chat.map(m => `<div class="msg ${m.role === "user" ? "me" : "bot"}">${m.role === "user" ? "" : `<span class="mav">${ico("hardhat", 20)}</span>`}<div class="bubble">${m.html || esc(m.content)}</div></div>`).join("")}</div>
      <div class="sugg">${sugg.map(s => `<button class="chip btnchip" data-s="${esc(s)}">${esc(s)}</button>`).join("")}</div>
      <form class="composer" id="cf"><input id="ci" placeholder="${t("askPh")}" autocomplete="off"><button class="iconbtn primary" aria-label="${t("send")}">${ico("send")}</button></form></main>`; };
  A.bind.coach = () => {
    const box = $("#chat"); box.scrollTop = box.scrollHeight;
    const send = async q => {
      if (!q.trim()) return; chat.push({ role: "user", content: q }); S.coachAsked++; A.save(); A.render(); const typing = document.createElement("div"); typing.className = "msg bot"; typing.innerHTML = `<span class="mav">${ico("hardhat", 20)}</span><div class="bubble typing"><i></i><i></i><i></i></div>`; $("#chat").appendChild(typing); $("#chat").scrollTop = 1e6;
      let html;
      const offline = hits => hits.length ? `<b>${t("coachFrom")}</b>${hits.slice(0, 3).map(h => `<div class="hit"><b>${esc(tx(h.title))}</b><p>${esc(tx(h.body).slice(0, 280))}${tx(h.body).length > 280 ? "…" : ""}</p><a href="${h.link}">${t("openLesson")} · ${esc(h.kind)} ${ico("arrow", 14)}</a></div>`).join("")}` : t("coachNoMatch");
      try { const r = await Coach.ask(q, chat.filter(m => !m.html).slice(0, -1).map(m => ({ role: m.role, content: m.content })), S.lang);
        html = r.offline ? offline(r.hits) : esc(r.text).replace(/\n/g, "<br>") + (r.hits.length ? `<div class="hit-links">${r.hits.slice(0, 2).map(h => `<a href="${h.link}">${esc(tx(h.title))}</a>`).join(" · ")}</div>` : ""); }
      catch (e) { html = `<div class="sm warn">${t("aiError")}</div>` + offline(Coach.search(q)); }
      chat.push({ role: "assistant", content: html.replace(/<[^>]+>/g, " ").slice(0, 600), html }); A.checkBadges().forEach(b => A.toast(`${b.icon} ${tx(b.name)}`, "badge")); A.render();
    };
    $("#cf").onsubmit = e => { e.preventDefault(); send($("#ci").value); };
    document.querySelectorAll("[data-s]").forEach(b => b.onclick = () => send(b.dataset.s));
  };

  /* ---------- router ---------- */
  const ROUTES = [["home", /^#\/(?:home)?$/], ["onboard", /^#\/onboard$/], ["match", /^#\/match$/], ["path", /^#\/path$/], ["module", /^#\/module\/(.+)$/], ["board", /^#\/board$/],
    ["library", /^#\/library$/], ["guide", /^#\/guide\/(.+)$/], ["skills", /^#\/skills$/], ["skill", /^#\/skill\/(.+)$/], ["dayone", /^#\/dayone(?:\/(.+))?$/], ["tools", /^#\/tools$/], ["tool", /^#\/tool\/(.+)$/],
    ["epa", /^#\/epa(?:\/(.+))?$/], ["quiz", /^#\/quiz$/], ["video", /^#\/video\/(guide|skill)\/(.+)$/], ["play", /^#\/play\/(.+)$/], ["arcade", /^#\/arcade(?:\/(.+))?$/], ["coach", /^#\/coach$/],
    ["gear", /^#\/gear$/], ["more", /^#\/more$/], ["achievements", /^#\/achievements$/], ["certs", /^#\/certs$/], ["cert", /^#\/cert\/(.+)$/], ["settings", /^#\/settings$/], ["credits", /^#\/credits$/], ["glossary", /^#\/glossary$/], ["charts", /^#\/charts$/], ["models", /^#\/models$/], ["field", /^#\/field(?:\/(.+))?$/], ["sim", /^#\/sim(?:\/(.+))?$/], ["company", /^#\/company(?:\/(.+))?$/], ["avatar", /^#\/avatar$/], ["review", /^#\/review$/], ["chp5", /^#\/chp5$/], ["side", /^#\/side\/(.+)$/]];
  const NAV = [["home", "#/home", "home", "home match path module board"], ["learn", "#/library", "book", "library guide skills skill dayone tools tool epa video glossary charts models field chp5 side"], ["arcade", "#/arcade", "game", "arcade sim"], ["coach", "#/coach", "chat", "coach"], ["more", "#/more", "grid", "more achievements certs cert settings gear credits company avatar review"]];
  const TITLES = { guide: p => tx(LESSONS[p[0]] && LESSONS[p[0]].title), skill: p => tx((SKILLS.find(s => s.id === p[0]) || {}).title), module: p => { const pl = A.plan(); const m = pl && pl.modules.find(x => x.id === p[0]); return m ? tx(m.title) : ""; }, epa: p => p[0] ? "EPA 608 " + tx((EPA_SECTIONS.find(s => s.id === p[0]) || {}).title) : "", tool: p => tx((TOOLS.find(x => x.id === p[0]) || {}).name) };
  /* route → music: menu/home "chill", study "study", sim "sim"; quiz + arcade games start their own track */
  A.routeMusic = (name = (A._route || {}).name, params = (A._route || {}).params || []) => {
    const STUDY = ["library", "guide", "skills", "skill", "dayone", "tools", "tool", "video", "glossary", "charts", "models", "field", "board", "path", "module", "chp5", "side"];
    if ((name === "arcade" && !params[0]) || name === "home" || name === "match") Sound.playMusic("chill");
    else if (name === "sim") Sound.playMusic("sim");
    else if (STUDY.includes(name)) Sound.playMusic("study");
    else if (name === "arcade" && params[0]) Sound.playMusic("arcade");
    else if (name !== "quiz") Sound.stopMusic(); };
  A.resetQuizScroll = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const view = document.getElementById("view");
    if (view) view.scrollTop = 0;
    const body = document.querySelector(".page-body, .teach-body");
    if (body) body.scrollTop = 0;
  };
  /* Wrap everything above a bottom action bar so the bar stays in the visible shell. */
  A.pinActionFooter = () => {
    const page = document.querySelector("main.page");
    if (!page || page.classList.contains("teach") || page.querySelector(":scope > .page-body")) return;
    const foot = page.querySelector(":scope > .lesson-foot, :scope > .ob-foot, :scope > .sticky-cta");
    if (!foot) return;
    const keep = { topbar: 1, "ob-top": 1, "teach-top": 1, "teach-prog": 1, "teach-foot": 1, "teach-body": 1, "quiz-pin": 1 };
    const move = [];
    Array.from(page.children).forEach(el => {
      if (el === foot) return;
      let hold = false;
      el.classList.forEach(c => { if (keep[c]) hold = true; });
      if (!hold) move.push(el);
    });
    if (!move.length) return;
    const wrap = document.createElement("div");
    wrap.className = "page-body";
    foot.before(wrap);
    move.forEach(n => wrap.appendChild(n));
  };
  A.pinQuizQuestion = () => {
    const page = document.querySelector(".page.quiz");
    const pin = document.querySelector(".quiz-pin");
    if (!page || !pin) return;
    const apply = () => page.style.setProperty("--quiz-pin-h", Math.ceil(pin.getBoundingClientRect().height) + "px");
    apply();
    if (typeof ResizeObserver !== "undefined") {
      if (A._quizPinRO) A._quizPinRO.disconnect();
      A._quizPinRO = new ResizeObserver(apply);
      A._quizPinRO.observe(pin);
    }
  };
  /* Scroll just enough to show Continue; the pinned question stays on screen. */
  A.revealQuizContinue = btn => {
    if (!btn) return;
    const vv = window.visualViewport;
    const room = ((vv ? vv.offsetTop + vv.height : window.innerHeight) - 12);
    const br = btn.getBoundingClientRect();
    if (br.bottom <= room) return;
    const delta = br.bottom - room;
    const scroller = document.querySelector(".page.quiz .answers") || document.getElementById("view") || window;
    const opts = { top: delta, left: 0, behavior: A.reduced() ? "auto" : "smooth" };
    if (scroller === window) window.scrollBy(opts);
    else scroller.scrollBy(opts);
  };
  A.render = () => {
    let h = location.hash.split("?")[0] || "#/home"; const qs = Object.fromEntries(new URLSearchParams(location.hash.split("?")[1] || ""));
    if (!S.onboarded && h !== "#/onboard") h = "#/onboard";
    document.querySelectorAll(".celebrate-ov, .fx-canvas, .fx-burst").forEach(x => x.remove());
    /* a victory scene from a previous screen must not follow you to the next route */
    if (A._lastRoute && A._lastRoute !== h) document.querySelectorAll(".vic").forEach(x => { if (x._close) x._close(); else x.remove(); Sound.stopSting && Sound.stopSting(); document.body.classList.remove("vic-open"); });
    if (A.dispose3d) { A.dispose3d(); A.dispose3d = null; }
    if (h !== "#/quiz") clearInterval(tmr);
    if (!h.startsWith("#/video")) { clearTimeout(vpTimer); window.speechSynthesis && speechSynthesis.cancel(); }
    if (!h.startsWith("#/arcade")) A.arcadeStop && A.arcadeStop();
    let name = "notfound", params = [];
    for (const [n, re] of ROUTES) { const m = h.match(re); if (m) { name = n; params = m.slice(1).filter(x => x !== undefined); break; } }
    window.setScene && setScene(name);
    { const grp = (NAV.find(n => n[3].split(" ").includes(name)) || [name])[0]; if (A._lastRoute && A._lastRoute !== h) { const quiet = name === "guide" || (A._lastRoute || "").indexOf("#/guide/") === 0; if (!quiet) Sound.sfx(A._lastGrp && A._lastGrp !== grp ? "whoosh" : "page"); } A._lastRoute = h; A._lastGrp = grp; }
    A._route = { name, params }; A.routeMusic(name, params);
    const view = document.getElementById("view");
    const snd = document.getElementById("snd");
    if (snd && view.contains(snd)) document.body.appendChild(snd);
    view.innerHTML = (V[name] || V.notfound)(params, qs);
    A.pinActionFooter();
    view.classList.remove("in"); void view.offsetWidth; if (!A.reduced() && name !== "quiz" && name !== "match" && name !== "guide") view.classList.add("in");
    const full = ["onboard", "quiz", "video", "match", "guide"].includes(name) || (name === "arcade" && params[0]);
    document.body.classList.toggle("nonav", !!full);
    document.body.classList.toggle("is-teach", name === "guide");
    document.getElementById("nav").style.display = full ? "none" : "";
    document.getElementById("nav").innerHTML = NAV.map(([k, href, i, act]) => `<a href="${href}" class="${act.split(" ").includes(name) ? "act" : ""}">${ico(i, 22)}<span>${t(k)}</span></a>`).join("");
    if (A.bind[name]) A.bind[name](params, qs);
    A.placeSoundBtn();
    if (["guide", "skill", "module", "epa", "tool"].includes(name) && params[0]) { const title = TITLES[name](params); if (title) { S.last = { route: h, title }; A.save(); } }
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    A.resetQuizScroll();
    if (name === "quiz") A.pinQuizQuestion();
    if (name === "quiz" || name === "match" || name === "guide") {
      requestAnimationFrame(() => { A.resetQuizScroll(); requestAnimationFrame(A.resetQuizScroll); });
      setTimeout(A.resetQuizScroll, 60);
      setTimeout(A.resetQuizScroll, 180);
    }
    document.documentElement.lang = S.lang || "en";
  };
  /* Answer feedback: check-mark slam / X shake near the tapped answer + haptics. Sound comes from Sound.sfx. */
  let lastTap = null;
  /* UI SFX only on a real tap (pointerup with almost no movement). pointerdown-on-scroll
     on iOS was firing the click beep whenever the user flicked a list. */
  let _ptrSfx = null;
  const _sfxSel = ".ans, [data-tf], .m-pic, .m-name, .sim-test, .ave-chip, .swatch, button, .btn, .list-card, .tile, .chip, .ave-preset";
  const _sfxQuiet = "input.switch, #nav a, .seg button, #intro-start, #intro-ov";
  document.addEventListener("pointerdown", e => {
    if (e.target.closest(_sfxQuiet)) { _ptrSfx = null; return; }
    const b = e.target.closest(_sfxSel);
    if (!b || b.disabled) { _ptrSfx = null; return; }
    _ptrSfx = { id: e.pointerId, x: e.clientX, y: e.clientY, el: b };
  }, { passive: true, capture: true });
  const _ptrClear = e => { if (_ptrSfx && (!e || e.pointerId === _ptrSfx.id)) _ptrSfx = null; };
  document.addEventListener("pointercancel", _ptrClear, { passive: true, capture: true });
  document.addEventListener("pointerup", e => {
    const p = _ptrSfx; _ptrSfx = null;
    if (!p || e.pointerId !== p.id) return;
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) return; /* scroll / drag */
    const b = p.el;
    if (!b || !document.contains(b) || b.disabled) return;
    const isAns = b.matches(".ans, [data-tf], .m-pic, .m-name, .sim-test, .ave-chip, .swatch");
    if (isAns) { lastTap = b; Sound.sfx("click"); A.haptic("tap"); }
    else Sound.sfx("btn");
  }, { passive: true, capture: true });
  /* Reliable touch tap for games: fires once on pointerup without a drag. */
  A.bindTap = (els, fn) => {
    const list = typeof els === "string" ? document.querySelectorAll(els) : els;
    (list.forEach ? list : [list]).forEach(el => {
      if (!el || el._tapBound) return; el._tapBound = true;
      el.style.touchAction = el.style.touchAction || "manipulation";
      let st = null;
      el.addEventListener("pointerdown", e => { if (el.disabled) return; st = { id: e.pointerId, x: e.clientX, y: e.clientY }; }, { passive: true });
      el.addEventListener("pointercancel", () => { st = null; }, { passive: true });
      el.addEventListener("pointerup", e => {
        const s = st; st = null;
        if (!s || e.pointerId !== s.id || el.disabled) return;
        if (Math.hypot(e.clientX - s.x, e.clientY - s.y) > 12) return;
        fn(el, e);
      });
    });
  };
  document.addEventListener("change", e => { if (e.target.matches("input.switch")) Sound.sfx("toggle"); }, true);
  document.addEventListener("click", e => { if (e.target.closest(".seg button")) Sound.sfx("toggle"); }, true);
  A.sparkAt = (el, n = 12) => {
    if (!el || A.reduced && A.reduced()) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i");
      s.className = "spark s" + (i % 3);
      s.style.left = (r.left + r.width / 2) + "px";
      s.style.top = (r.top + r.height / 2) + "px";
      s.style.setProperty("--dx", ((Math.random() - 0.5) * 220).toFixed(1) + "px");
      s.style.setProperty("--dy", ((Math.random() - 0.85) * 180).toFixed(1) + "px");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  };
  A.feedbackFx = ok => {
    A.haptic(ok ? "correct" : "wrong");
    const r = lastTap && document.contains(lastTap) ? lastTap.getBoundingClientRect() : null;
    /* Small corner badge — never a 96px stamp over the name label. */
    const x = r ? Math.min(innerWidth - 14, r.right - 12) : innerWidth / 2, y = r ? r.top + 12 : innerHeight / 2;
    const m = document.createElement("div"); m.className = "fx-mark " + (ok ? "good" : "bad"); m.style.left = x + "px"; m.style.top = y + "px";
    m.innerHTML = ok ? `<svg viewBox="0 0 96 96"><circle cx="48" cy="48" r="42" fill="#5D6A3F" stroke="#C9E08A" stroke-width="4"/><path d="M28 50l14 14 26-30" fill="none" stroke="#F3F0E4" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : `<svg viewBox="0 0 96 96"><circle cx="48" cy="48" r="42" fill="#8E2A20" stroke="#FF8A7A" stroke-width="4"/><path d="M32 32l32 32M64 32l-32 32" fill="none" stroke="#F3F0E4" stroke-width="10" stroke-linecap="round"/></svg>`;
    document.body.appendChild(m); setTimeout(() => m.remove(), A.reduced() ? 400 : 700); lastTap = null;
  };
  { const _sfx = Sound.sfx; Sound.sfx = (n, o) => { if (n === "correct" || n === "wrong") A.feedbackFx(n === "correct"); return _sfx(n, o); }; }
  A.applySettings = () => { Sound.setSound(S.settings.sound); Sound.setVolumes && Sound.setVolumes(S.settings.vol || {}); Sound.setMusic(S.settings.music !== false && !S.settings.gameDay && (S.settings.vol || {}).music !== 0); /* game-day mode: music off, SFX on */ Sound.setUi(S.settings.uiClicks !== false); document.body.classList.toggle("reduce-motion", !!S.settings.reduceMotion); A.applyTheme(); };
  /* Appearance: dark (tactical, default) / light (warm sand, never white) / auto (prefers-color-scheme). Migrates the old dark switch. */
  if (!S.settings.appearance) S.settings.appearance = S.settings.dark === false ? "light" : "dark";
  A.appearance = () => S.settings.appearance || "dark";
  const mqDark = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
  A.applyTheme = () => { const a = A.appearance(), th = a === "auto" ? (mqDark && !mqDark.matches ? "light" : "dark") : a; document.documentElement.dataset.theme = th;
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", th === "light" ? "#CBB994" : "#0f1011"); return th; };
  if (mqDark) (mqDark.addEventListener ? mqDark.addEventListener("change", () => A.appearance() === "auto" && A.applyTheme()) : mqDark.addListener(() => A.appearance() === "auto" && A.applyTheme()));

  /* ---------- sound toggle (persisted) ---------- */
  /* top-right cog: opens the Sound panel (sound-panel.js). A small slashed-speaker badge shows when sound is muted. */
  A.placeSoundBtn = () => {
    const fab = document.getElementById("snd"); if (!fab) return;
    if (fab.parentElement !== document.body) document.body.appendChild(fab);
    const slot = document.querySelector(".topbar-slot");
    if (slot) { slot.appendChild(fab); fab.classList.add("in-bar"); }
    else fab.classList.remove("in-bar");
  };
    function soundBtn() { const b = document.getElementById("snd"); b.innerHTML = ico("cog", 21) + (S.settings.sound ? "" : `<span class="snd-badge">${ico("mute", 12)}</span>`); b.classList.toggle("muted", !S.settings.sound); b.setAttribute("aria-label", S.lang === "es" ? "Ajustes de sonido" : "Sound settings"); b.setAttribute("aria-haspopup", "dialog"); }
  A.soundBtn = soundBtn;
  window.addEventListener("hashchange", A.render);
  document.addEventListener("pointerdown", () => Sound.unlock(), { once: false, passive: true });
  document.addEventListener("DOMContentLoaded", () => {
    A.applySettings(); A.normalizeStreak && A.normalizeStreak(); A.consumeOwnerKey && A.consumeOwnerKey(); A.render(); soundBtn();
    document.getElementById("snd").onclick = () => { Sound.unlock(); if (A.openSoundSheet) A.openSoundSheet(); };
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
  });
})();
