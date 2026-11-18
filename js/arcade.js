/* Arcade: Component Match, Don't Freeze, Braze, Gauge Reader, Thermostat Wiring.
   Lightning, Fix, Daily stay implemented but are hidden from every menu. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views, $ = s => document.querySelector(s), sh = a => A.shuffle(a);
  const TOPICS = () => [["all", t("allTopics")], ["path", t("myPath")], ["core", "EPA Core"], ["type1", "Type I"], ["type2", "Type II"], ["type3", "Type III"], ["guides", t("studyGuides")], ["skills", t("handsOn")]];
  function pool(topic) {
    const g = Object.values(LESSONS).flatMap(x => x.check || []), sk = SKILLS.flatMap(x => x.check), epa = Object.values(EPA_QUESTIONS).flat();
    if (["core", "type1", "type2", "type3"].includes(topic)) return EPA_QUESTIONS[topic];
    if (topic === "guides") return g; if (topic === "skills") return sk;
    if (topic === "path") { const plan = A.plan(); if (plan) { const qs = []; plan.modules.filter(m => m.status !== "skip").forEach(m => m.links.forEach(([ty, id]) => { if (ty === "guide") qs.push(...(LESSONS[id].check || [])); if (ty === "skill") qs.push(...SKILLS.find(s => s.id === id).check); if (ty === "quiz") qs.push(...EPA_QUESTIONS[id]); })); if (qs.length >= 8) return [...new Set(qs)]; } }
    return g.concat(sk, epa);
  }
  const usable = q => S.lang !== "es" || (q.q.es && q.q.es.length) || true;
  let stopFns = []; A.arcadeStop = () => { stopFns.forEach(f => f()); stopFns = []; A.tgStop && A.tgStop(); };
  const hi = g => S.high[g] || 0;
  function finish(game, score, title, extra = "") {
    A.arcadeStop(); Sound.stopMusic(); if (extra === t("frozen")) setTimeout(() => Sound.sfx("wahwah"), 350); S.games++; const nh = score > hi(game); if (nh) S.high[game] = score; A.addXP(score / 100 * XP_RULES.gamePer100 + 10); A.log("game", game, title, score); A.save();
    $("#stage").innerHTML = `<div class="game-over"><div class="go-av">${avatarSVG(S.avatar, 120, { frozen: extra === t("frozen"), cls: extra === t("frozen") ? "" : "av-cheer" })}</div><h2>${extra || title}</h2><div class="go-score">${score}</div>${nh ? `<div class="pill gold">${ico("trophy", 16)} ${t("newHigh")}</div>` : `<div class="muted">${t("highScore")}: ${hi(game)}</div>`}${extra === t("frozen") ? (nh ? A.saying("highscore") || A.saying("gameover") : A.saying("gameover")) : ""}
      <button class="btn primary big full" id="again">${t("playAgain")}</button><a class="btn full" href="#/arcade">${t("arcade")}</a></div>`;
    $("#again").onclick = () => A.render();
    setTimeout(() => A.celebrate({ title, sub: `${score} ${t("points").toLowerCase()}${nh ? " · " + t("newHigh") : ""}`, showBoard: false }), 500);
  }
  const GAMES = [
    ["match", "cog", "compMatch", "compMatchSub"],
    ["freeze", "snow", "dontFreeze", "dontFreezeSub"],
    ["braze", "flame", "brazeMaster", "brazeMasterSub"],
    ["gauges", "gauge", "gaugeReader", "gaugeReaderSub"],
    ["thermostat", "cog", "tstatWiring", "tstatWiringSub"]
  ];
  const ART = { match:"thermostat", freeze:"cylinder", braze:"torch-oxy", gauges:"gauge-analog", thermostat:"thermostat" };
  const HIDDEN = { lightning:1, fix:1, daily:1 };
  function gameTitle(id, key) {
    if (A.TG && A.TG.bySlug[id]) { const d = A.TG.bySlug[id], g = A.TG.game(d.id); if (g) return tx(g.name); }
    try { const s = t(key); if (s && s !== key) return s; } catch (e) {}
    return ({ brazeMaster:"Braze Master", brazeMasterSub:"Heat the tube, then feed the rod", gaugeReader:"Gauge Reader", gaugeReaderSub:"Read the gauges and make the call", tstatWiring:"Thermostat Wiring", tstatWiringSub:"Land each wire, then power on" })[key] || key;
  }

  V.arcade = ([g]) => {
    if (!g) { const tp = A.arcTopic || (A.plan() ? "path" : "all");
      return `<main class="page">${A.head(t("arcade"))}<p class="muted">${t("arcadeSub")}</p>${A.arcQuip ?? (A.arcQuip = A.saying("arcade"))}
        <div class="game-grid arcade-lineup">${(A.homeArcade ? A.homeArcade(GAMES) : GAMES).map(([id, i, n, sub]) => {
          const def = A.TG && A.TG.bySlug[id], locked = def && !(A.TG.isUnlocked(def.id));
          const title = gameTitle(id, n), subT = def ? esc(tx(def.tag)) : (gameTitle(id, sub));
          const inner = `<img class="g-art" src="img/illust/${ART[id] || "thermostat"}.webp" alt="" aria-hidden="true"><span class="g-ico">${ico(i, 34)}</span><b>${esc(title)}${id === "match" ? ` <span class="tg-starter">${S.lang === "es" ? "Inicio" : "Starter"}</span>` : ""}</b><small>${subT}</small>${locked ? `<span class="tg-lock">${ico("lock", 14)}</span><span class="g-hi sm">${esc(A.TG.unlockText(def.id))}</span>` : `<span class="g-hi">${ico("trophy", 14)} ${hi(def ? "tg:" + def.id : id)}</span>`}`;
          return locked ? `<div class="game-card g-${id} locked" aria-disabled="true">${inner}</div>` : `<a class="game-card g-${id}" href="#/arcade/${id}">${inner}</a>`;
        }).join("")}</div>
        <a class="list-card mt" href="#/sim"><span class="lc-ico">${ico("wrench")}</span><span class="grow"><b>${S.lang === "es" ? "Simulador de diagnóstico" : "Troubleshooting Simulator"}</b><span class="sm muted block">${S.lang === "es" ? "Llamadas reales: elige pruebas, lee lecturas y decide" : "Real calls: pick tests, read the numbers, make the call"}</span></span>${ico("arrow", 18)}</a>
        </main>`; }
    const tgT = A.TG && A.TG.title(g), known = GAMES.find(x => x[0] === g);
    if (!tgT && !known) { setTimeout(() => A.go("#/arcade"), 0); return `<main class="page"></main>`; }
    return `<main class="page game${tgT ? " tg-page" : ""}${!tgT && known && known[0] === "match" ? " match-page" : ""}">${A.head(tgT || t(known[2]), "#/arcade")}<div id="stage" class="game-stage"></div></main>`;
  };
  A.bind.arcade = ([g]) => {
    if (!g) return;
    if (A.TG && A.TG.bySlug[g]) { A.tgStop && A.tgStop(); A.TG.start(g); return; }
    if (!GAMES.find(x => x[0] === g)) return;
    A.arcTopic = A.arcTopic || (A.plan() ? "path" : "all"); Sound.playMusic("arcade");
    ({ freeze, lightning, match, fix, daily })[g]();
  };
  const qText = q => esc(tx(q.q));

  /* ---- Don't Freeze! ---- */
  function freeze() {
    const N = 10, qs = sh(pool(A.arcTopic)).slice(0, N); let i = 0, water = 0, score = 0, streak = 0, tm;
    const MAXW = 3;
    $("#stage").innerHTML = `<div class="freeze"><div class="fz-scene" id="fz"><div class="fz-sky"></div>${[...Array(N + 1)].map((_, k) => `<div class="fz-block" style="--k:${k}"></div>`).join("")}<div class="fz-av" id="fzav">${avatarSVG(S.avatar, 66)}</div><div class="fz-water" id="fzw"></div></div>
      <div class="quiz-hud"><span class="hud-pts">${ico("star", 16)} <b id="fzs">0</b></span><span class="hud-streak" id="fzk"></span><span id="fzt">${GameTimer.markup(15, "gtimer-lg")}</span></div><div id="fzq"></div></div>`;
    const upd = () => { $("#fzav").style.setProperty("--k", i); $("#fzw").style.height = (14 + water * 22) + "%"; $("#fz").style.setProperty("--ice", water / MAXW); $("#fzs").textContent = score; $("#fzk").innerHTML = streak > 1 ? ico("fire", 14) + " ×" + streak : ""; };
    const ask = () => {
      upd(); if (water >= MAXW) { Sound.sfx("freeze"); $("#fzav").classList.add("frozen"); $("#fzav").innerHTML = avatarSVG(S.avatar, 66, { frozen: true }); return setTimeout(() => finish("freeze", score, t("dontFreeze"), t("frozen")), 900); }
      if (i >= N || i >= qs.length) { Sound.sfx("fanfare"); return finish("freeze", score + 1000, t("dontFreeze"), t("survived")); }
      const q = qs[i], order = sh(q.a.map((_, k) => k)); let left = 15, done = false;
      $("#fzq").innerHTML = `<h3 class="qtext sm">${qText(q)}</h3><div class="answers compact">${order.map((oi, k) => `<button class="ans a${k}" data-k="${oi}"><span class="ans-shape">${["▲", "◆", "●", "■"][k]}</span><span>${esc(tx(q.a[oi]))}</span></button>`).join("")}</div>`;
      const res = ok => { if (done) return; done = true; tm && tm.stop && tm.stop();
        document.querySelectorAll("#fzq .ans").forEach(b => { b.disabled = true; if (+b.dataset.k === q.c) b.classList.add("right"); });
        if (ok) { streak++; score += 300 + left * 20 + streak * 40; i++; Sound.sfx("jump"); $("#fzav").classList.remove("jump"); void $("#fzav").offsetWidth; $("#fzav").classList.add("jump"); if (water > 0 && streak % 3 === 0) water--; }
        else { streak = 0; water++; Sound.sfx("splash"); const av = $("#fzav"); av.classList.remove("shiver"); void av.offsetWidth; av.classList.add("shiver"); $("#fz").classList.add("shake"); setTimeout(() => $("#fz") && $("#fz").classList.remove("shake"), 400); i++; }
        setTimeout(() => $("#fzq") && ask(), ok ? 650 : 1100); };
      A.bindTap(document.querySelectorAll("#fzq .ans"), b => res(+b.dataset.k === q.c));
      const slot = $("#fzt"); if (slot) slot.innerHTML = GameTimer.markup(15, "gtimer-lg");
      tm = GameTimer.start({ el: "#fzt .gtimer", total: 15, setLeft: v => { left = v; }, onDone: () => res(false) });
    };
    stopFns.push(() => tm && tm.stop && tm.stop()); ask();
  }
  /* ---- Lightning Round ---- */
  function lightning() {
    const qs = sh(pool(A.arcTopic)); let left = 60, score = 0, streak = 0, n = 0, cur, tm;
    $("#stage").innerHTML = `<div class="lightning"><div class="quiz-hud"><span class="hud-pts">${ico("star", 16)} <b id="ls">0</b></span><span class="hud-streak" id="lk"></span><span class="timer big" id="lt">60</span></div><div class="tf-card" id="tf"></div><div class="tf-btns"><button class="btn big tf-t" data-tf="1">${ico("check", 22)} ${t("trueW")}</button><button class="btn big tf-f" data-tf="0">${ico("close", 22)} ${t("falseW")}</button></div></div>`;
    const next = () => { const q = qs[n++ % qs.length]; const truth = Math.random() < 0.5; const ai = truth ? q.c : sh(q.a.map((_, k) => k).filter(k => k !== q.c))[0]; cur = { truth }; $("#tf").innerHTML = `<p class="muted sm">${qText(q)}</p><h3>${t("isAnswer")} ${esc(tx(q.a[ai]))}</h3>`; $("#tf").classList.remove("pop"); void $("#tf").offsetWidth; $("#tf").classList.add("pop"); };
    A.bindTap(document.querySelectorAll("[data-tf]"), b => { const ok = (b.dataset.tf === "1") === cur.truth; if (ok) { streak++; score += 100 + streak * 10; Sound.sfx("correct", { streak }); A.onStreak(streak); } else { streak = 0; left = Math.max(0, left - 3); Sound.sfx("wrong"); $("#tf").classList.add("shake"); } $("#ls").textContent = score; $("#lk").innerHTML = streak > 1 ? ico("fire", 14) + " ×" + streak : ""; next(); });
    tm = setInterval(() => { left--; const el = $("#lt"); if (!el) return clearInterval(tm); el.textContent = left; if (left <= 10) { Sound.sfx("tick"); el.classList.add("hurry"); } if (left <= 0) { clearInterval(tm); finish("lightning", score, t("lightning")); } }, 1000);
    stopFns.push(() => clearInterval(tm)); next();
  }
  /* ---- Component / Tool Match ----
     First tap selects (clear highlight). Second tap on the other column locks in:
     correct pair = green glow, stays matched, counts; wrong pair = brief red flash, reset.
     Uses pointerup (A.bindTap) so iOS touch is reliable. */
  function match() {
    let round = 0, score = 0, streak = 0, clock; const t0 = Date.now();
    const items = sh(COMPONENTS.map(c => ({ id: "c:" + c.id, name: c.name, svg: compSVG(c.id, { labels: false }) })).concat(sh(TOOLS).slice(0, 12).map(x => ({ id: "t:" + x.id, name: x.name, svg: toolSVG(x.id, { labels: false }) }))));
    const play = () => {
      if (round >= 3) { if (clock) clock.stop(); const secs = Math.round((Date.now() - t0) / 1000); return finish("match", Math.max(100, score + 1500 - secs * 10), t("compMatch"), t("matched")); }
      const set = items.slice(round * 4, round * 4 + 4); let sel = null, left = set.length, busy = false;
      const hint = S.lang === "es"
        ? (round === 0 ? "Estás en la camioneta. Toca una foto, luego el nombre que le va. Un par a la vez — sin trucos." : `${t("round")} ${round + 1}/3`)
        : (round === 0 ? "You're at the truck. Tap a picture, then the name that goes with it. One pair at a time — no trick questions." : `${t("round")} ${round + 1}/3`);
      $("#stage").innerHTML = `<div class="matchg"><div class="quiz-hud"><span class="hud-pts">${ico("star", 16)} <b id="mzs">${score}</b></span><span id="mzt">${GameTimer.markup(30, "gtimer-lg")}</span></div><p class="tg-goal">${hint}</p><div class="m-cols"><div>${sh(set).map(x => `<button type="button" class="m-pic" data-col="pic" data-id="${x.id}">${x.svg}</button>`).join("")}</div><div>${sh(set).map(x => `<button type="button" class="m-name" data-col="name" data-id="${x.id}">${esc(tx(x.name))}</button>`).join("")}</div></div></div>`;
      if (clock) clock.stop();
      clock = GameTimer.start({ el: "#mzt .gtimer", total: 30, onDone: () => { if (busy) return; finish("match", Math.max(100, score), t("compMatch")); } });
      const clearSel = () => { document.querySelectorAll(".m-pic.sel, .m-name.sel").forEach(x => x.classList.remove("sel")); sel = null; };
      const onTile = el => {
        if (busy || el.disabled || el.classList.contains("matched")) return;
        if (sel === el) { clearSel(); return; }
        if (!sel) { el.classList.add("sel"); sel = el; return; }
        if (sel.dataset.col === el.dataset.col) { clearSel(); el.classList.add("sel"); sel = el; return; }
        /* second tap on the other column — lock in */
        const a = sel, b = el; busy = true;
        if (a.dataset.id === b.dataset.id) {
          streak++; score += 250;
          [a, b].forEach(x => { x.classList.remove("sel", "nope"); x.classList.add("matched", "pop"); x.disabled = true; A.sparkAt && A.sparkAt(x, 8); });
          Sound.sfx("correct", { streak }); A.onStreak(streak);
          sel = null; busy = false;
          const hp = document.querySelector("#mzs"); if (hp) hp.textContent = score;
          if (--left === 0) { if (clock) clock.stop(); round++; setTimeout(play, 650); }
        } else {
          streak = 0; score = Math.max(0, score - 50);
          [a, b].forEach(x => { x.classList.remove("sel"); x.classList.add("nope"); });
          Sound.sfx("wrong");
          const hp = document.querySelector("#mzs"); if (hp) hp.textContent = score;
          setTimeout(() => { [a, b].forEach(x => x.classList.remove("nope", "sel")); sel = null; busy = false; }, 450);
        }
      };
      A.bindTap(document.querySelectorAll(".m-pic, .m-name"), onTile);
    };
    stopFns.push(() => clock && clock.stop && clock.stop()); play();
  }
  /* ---- Fix the System ---- */
  function fix() {
    const qs = sh(SCENARIOS).slice(0, 6); let i = 0, score = 0, streak = 0, tm;
    const ask = () => {
      if (i >= qs.length) return finish("fix", score, t("fixSystem"));
      const sc = qs[i], order = sh(sc.a.map((_, k) => k)); let left = 25, done = false;
      $("#stage").innerHTML = `<div class="fixg"><div class="quiz-hud"><span class="hud-pts">${ico("star", 16)} ${score}</span><span>${i + 1}/${qs.length}</span><span class="timer" id="ft">${left}</span></div>
        <div class="ticket"><div class="ticket-h">${ico("wrench", 18)} ${S.lang === "es" ? "Orden de servicio" : "Service ticket"} #${1000 + i * 37}</div><p>${esc(tx(sc.s))}</p></div>
        <h3>${S.lang === "es" ? "¿Causa más probable?" : "Most likely cause?"}</h3><div class="answers">${order.map((oi, k) => `<button class="ans a${k}" data-k="${oi}"><span class="ans-shape">${["▲", "◆", "●", "■"][k]}</span><span>${esc(tx(sc.a[oi]))}</span></button>`).join("")}</div><div id="ffb"></div></div>`;
      const res = k => { if (done) return; done = true; clearInterval(tm); const ok = k === sc.c; document.querySelectorAll(".ans").forEach(b => { b.disabled = true; if (+b.dataset.k === sc.c) b.classList.add("right"); else if (+b.dataset.k === k) b.classList.add("wrongp"); });
        if (ok) { streak++; score += 400 + left * 15 + streak * 50; Sound.sfx("correct", { streak }); A.onStreak(streak); } else { streak = 0; Sound.sfx("wrong"); }
        $("#ffb").innerHTML = `<div class="feedback ${ok ? "ok" : "bad"}"><p class="sm">${esc(tx(sc.why))}</p>${A.saying(ok ? "correct" : "wrong")}<button class="btn primary full" id="fn">${t("continue")}</button></div>`; $("#fn").onclick = () => { i++; ask(); }; };
      A.bindTap(document.querySelectorAll(".ans"), b => res(+b.dataset.k));
      tm = setInterval(() => { left--; const el = $("#ft"); if (!el) return clearInterval(tm); el.textContent = left; if (left <= 5) Sound.sfx("tick"); if (left <= 0) res(-1); }, 1000);
    };
    stopFns.push(() => clearInterval(tm)); ask();
  }
  /* ---- Daily Challenge (seeded by date, once per day, double points) ---- */
  function daily() {
    const td = A.today(); if (S.daily[td] != null) { $("#stage").innerHTML = `<div class="empty">${ico("calendar", 44)}<h3>${t("dailyDone")}</h3><div class="go-score">${S.daily[td]}</div><a class="btn" href="#/arcade">${t("arcade")}</a></div>`; return; }
    let seed = [...td].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    const all = pool("all").slice(); for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    Sound.stopMusic();
    A.startQuiz({ key: "daily", title: t("daily"), questions: all.slice(0, 5), timer: true, onPass: () => {} });
    const orig = A.celebrate; A.celebrate = o => { if (o.title !== t("daily")) return orig(o); A.celebrate = orig; const sc = (S.quiz.daily || {}).last || 0; const pts = sc * 20; S.daily[td] = pts; A.addXP(XP_RULES.daily); A.save(); orig(Object.assign(o, { sub: pts + " pts ×2" })); };
  }
})();
