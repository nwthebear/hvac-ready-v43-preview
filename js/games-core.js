/* TRAINING GAMES core: registry, unlock gating (ranks + trail zones), the shared round engine (score, combo x2/x3/x4,
   speed bonus, Clean Board stamps, timer ring that pauses for learn cards, hearts), learn cards that feed the Review deck,
   magnetic drag-to-terminal wiring, haptics, screen shake and the results screen. All facts come from window.GAMES_DATA
   (tools/build-games-data.py). Animation: transforms/opacity + one rAF loop per round; reduced motion honored. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, $ = s => document.querySelector(s);
  const GD = window.GAMES_DATA, GM = {}; GD.games.forEach(g => (GM[g.id] = g));
  const L = (en, es) => (S.lang === "es" ? es : en);
  const TG = A.TG = { data: GD, game: id => GM[id], defs: [], byId: {}, bySlug: {} };
  S.tg = S.tg || {}; /* per game: { lv, best, plays, unlocked } */
  const st = id => (S.tg[id] = S.tg[id] || { lv: 1, plays: 0 });
  TG.state = st;
  TG.L = L;
  TG.src = id => GD.sources[id] || { title: id, url: "" };
  TG.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  TG.pick = a => a[Math.floor(Math.random() * a.length)];
  TG.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* draw mostly from the player's level, plus one from the next level (spec §0 Difficulty) */
  TG.draw = (items, id, n, lvKey = "level") => { const lv = st(id).lv, sh = TG.shuffle(items);
    const cur = sh.filter(x => (x[lvKey] || 1) <= lv), next = sh.filter(x => (x[lvKey] || 1) === lv + 1), out = [];
    const pool = TG.shuffle(cur.filter(x => (x[lvKey] || 1) >= lv - 1)).concat(TG.shuffle(cur.filter(x => (x[lvKey] || 1) < lv - 1)));
    for (const x of pool) { if (out.length >= n - (next.length ? 1 : 0)) break; out.push(x); }
    if (next.length) out.push(next[0]);
    for (const x of sh) { if (out.length >= n) break; if (!out.includes(x)) out.push(x); }
    return out.slice(0, n).sort((a, b) => (a[lvKey] || 1) - (b[lvKey] || 1)); };

  /* ---------- registry ---------- */
  TG.register = def => { TG.defs.push(def); TG.byId[def.id] = def; TG.bySlug[def.slug] = def; TG.defs.sort((a, b) => a.order - b.order); };

  /* ---------- unlocks ---------- */
  const rankIdx = id => window.RANKS.findIndex(r => r.id === id);
  const zoneDone = zid => { const plan = A.plan(); if (!plan) return false; const pr = A.progress(plan); const sIdx = plan.stages.findIndex(s => s.id === zid);
    const stg = pr.stages.find(s => s.id === zid); if (stg) return stg.pct === 100;
    /* stage not on this player's path: treat it as passed once every earlier stage on the path is complete */
    if (sIdx < 0) return false; const earlier = plan.stages.slice(0, sIdx + 1).map(s => pr.stages.find(x => x.id === s.id)).filter(Boolean); return earlier.length > 0 && earlier.every(s => s.pct === 100); };
  const UL = id => (A.homeUnlock && A.homeUnlock(id)) || GM[id].unlock;
  TG.unlockOf = id => UL(id);
  /* Day-one Starter is the arcade Tool Match game (A.STARTER), not a training-game unlock.
     Training games keep their rank / zone gates. Does not rewrite hvac.state.v1 keys. */
  TG.STARTER_ID = null;
  TG.isUnlocked = id => { if (A.TG.devUnlockAll) return true; const u = UL(id); if (!u) return false; if (u.type === "tech") return false; if (u.type === "rank") return A.rank().i >= rankIdx(u.rank); if (u.type === "zoneComplete") return zoneDone(u.zone); return true; };
  TG.unlockText = id => { const u = UL(id);
    if (u.type === "tech") return L("On the tech paths · switch anytime", "En las rutas técnicas · cambia cuando quieras");
    if (u.type === "rank") { const r = window.RANKS[rankIdx(u.rank)], need = r.xp - S.xp; return L(`Unlocks at ${tx(r)} rank`, `Se desbloquea en el rango ${tx(r)}`) + (need > 0 ? ` · ${need} XP ${L("to go", "más")}` : ""); }
    const z = (window.TRAIL_ZONES || {})[u.zone]; return L(`Finish ${tx(z && z.name)} on your trail map`, `Termina ${tx(z && z.name)} en tu mapa`); };
  /* new unlock → the victory scene (trophy + unlock sfx). Batched: several at once share one scene. Never during a quiz/round. */
  TG.checkUnlocks = (opts = {}) => {
    if (!S.onboarded) return [];
    const fresh = TG.defs.filter(d => TG.isUnlocked(d.id) && !st(d.id).unlocked);
    if (!fresh.length) return [];
    fresh.forEach(d => (st(d.id).unlocked = Date.now())); A.save();
    if (opts.silent) return fresh;
    let tries = 0; const show = () => {
      const busy = document.querySelector(".vic, .celebrate-ov, .tg-learn") || /^#\/(quiz|onboard)/.test(location.hash) || (/^#\/arcade\/./.test(location.hash) && document.querySelector(".tg-round:not(.over)"));
      if (busy && tries++ < 240) return setTimeout(show, 700);
      const names = fresh.map(d => tx(GM[d.id].name)), es = S.lang === "es";
      A.victory && A.victory({ kind: "game", title: names.join(" + "), sub: es ? "Nuevo juego de entrenamiento — tú decides cuándo jugarlo." : "New training game — jump in when you're ready.", avatar: S.avatar,
        extras: `<div class="tg-unl-row">${fresh.map(d => `<span class="tg-unl-chip">${d.art(38)}<b>${esc(tx(GM[d.id].name))}</b></span>`).join("")}</div>`,
        goLabel: es ? "Jugar ahora" : "Play now", laterLabel: es ? "Ahora no" : "Skip for now",
        onContinue: () => A.go("#/arcade/" + fresh[0].slug) });
    };
    setTimeout(show, opts.delay || 900); return fresh;
  };
  { const add0 = A.addXP; A.addXP = n => { add0(n); TG.checkUnlocks({ delay: 2600 }); }; }
  window.addEventListener("hashchange", () => setTimeout(() => TG.checkUnlocks(), 400));
  document.addEventListener("DOMContentLoaded", () => { /* players who already passed a gate before this update: one batched scene */ setTimeout(() => TG.checkUnlocks({ delay: 1200 }), 300); });

  /* Day-one Starter: Component / Tool Match. Quick, accurate tap-to-match. Unlocked for every path from first launch.
     Shown once the first time the user opens Arcade/Games, with Play now / Skip for now / close X. Never auto-starts a game. */
  A.STARTER = { id: "match", route: "#/arcade/match" };
  A.offerStarter = () => {
    if (!S.onboarded) return;
    if (S.starterPrompted === A.STARTER.id) return;
    if (document.getElementById("intro-ov")) return;
    if (document.getElementById("starter-ov")) return;
    const h = (location.hash || "").split("?")[0];
    /* Only the Arcade/Games hub — not Home, and not mid-game at #/arcade/<slug>. */
    if (h !== "#/arcade") return;
    const es = S.lang === "es";
    const ov = document.createElement("div");
    ov.id = "starter-ov";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-labelledby", "starter-title");
    ov.innerHTML = `<div class="st-card">
        <button type="button" class="st-x" id="starter-x" aria-label="${es ? "Cerrar" : "Close"}">×</button>
        <div class="eyebrow">${es ? "Inicio" : "Starter"}</div>
        <h2 id="starter-title">${es ? "¡Juego de inicio desbloqueado!" : "Starter game unlocked!"}</h2>
        <p class="st-body">${es ? "Emparejar Herramientas: estás en la camioneta. Toca cada herramienta o pieza y luego su nombre. Un par a la vez, sin trucos — un calentamiento rápido antes de sacar manómetros o cables." : "Tool Match: you're at the truck. Tap each tool or part, then tap its name. One pair at a time, no trick questions — a quick warm-up before you break out gauges or wire."}</p>
        <div class="st-btns">
          <button type="button" class="btn primary big" id="starter-play">${es ? "Jugar ahora" : "Play now"}</button>
          <button type="button" class="btn big" id="starter-skip">${es ? "Ahora no" : "Skip for now"}</button>
        </div>
      </div>`;
    const done = go => { if (S.starterPrompted === A.STARTER.id) return; S.starterPrompted = A.STARTER.id; A.save(); ov.remove(); if (go) A.go(A.STARTER.route); };
    document.body.appendChild(ov);
    ov.querySelector("#starter-play").onclick = ev => { ev.stopPropagation(); Sound.sfx && Sound.sfx("tap"); done(true); };
    ov.querySelector("#starter-skip").onclick = ev => { ev.stopPropagation(); Sound.sfx && Sound.sfx("tap"); done(false); };
    ov.querySelector("#starter-x").onclick = ev => { ev.stopPropagation(); Sound.sfx && Sound.sfx("tap"); done(false); };
    ov.addEventListener("click", ev => { if (ev.target === ov) done(false); });
  };
  window.addEventListener("hashchange", () => setTimeout(() => A.offerStarter(), 350));
  document.addEventListener("DOMContentLoaded", () => setTimeout(() => A.offerStarter(), 1400));

  /* ---------- hub (inside #/arcade) ---------- */
  TG.hubHtml = () => {
    const es = S.lang === "es", open = TG.defs.filter(d => TG.isUnlocked(d.id)).length;
    return `<section class="tg-hub"><div class="row between tg-hub-h"><h3 class="sec-h">${es ? "Juegos de entrenamiento" : "Training games"}</h3><span class="chip">${open}/${TG.defs.length}</span></div>
      <p class="sm muted tg-hub-sub">${es ? "Práctica real en forma de juego. Cada error abre una tarjeta con la regla y su fuente." : "Real practice in game form. Every mistake opens a card with the rule and its source."}</p>
      <div class="tg-grid">${TG.defs.map((d, k) => { const g = GM[d.id], un = TG.isUnlocked(d.id), best = st(d.id).best || 0, fresh = un && !st(d.id).plays;
        return un ? `<a class="tg-card has-cov" href="#/arcade/${d.slug}" style="--k:${k}"><span class="tg-cov">${TG.ART ? TG.ART.cover(d.slug) : d.art(56)}</span><b>${esc(tx(g.name))}</b><small>${esc(tx(d.tag))}</small>
            <span class="tg-meta">${fresh ? `<span class="tg-new">${es ? "NUEVO" : "NEW"}</span>` : `${ico("trophy", 13)} ${best}`}<span class="tg-lv">${es ? "Nv" : "Lv"} ${st(d.id).lv}</span></span></a>`
          : `<div class="tg-card locked has-cov" style="--k:${k}" aria-disabled="true"><span class="tg-cov sil">${TG.ART ? TG.ART.cover(d.slug) : d.art(56)}</span><span class="tg-lock">${ico("lock", 14)}</span><b>${esc(tx(g.name))}</b><small>${esc(TG.unlockText(d.id))}</small></div>`; }).join("")}</div></section>`; };

  /* ---------- haptics / shake / popups ---------- */
  TG.buzz = p => A.haptic(p);
  A.touch = !!(window.matchMedia && matchMedia("(pointer: coarse)").matches);
  TG.shake = (el, big) => { if (!el || A.reduced()) return; el.classList.remove("tg-shake", "tg-shake-big"); void el.offsetWidth; el.classList.add(big ? "tg-shake-big" : "tg-shake"); setTimeout(() => el.classList.remove("tg-shake", "tg-shake-big"), 420); };
  TG.pop = (root, x, y, html, cls = "") => { const d = document.createElement("div"); d.className = "tg-pop " + cls; d.innerHTML = html; d.style.transform = `translate(${x}px, ${y}px)`; root.appendChild(d); setTimeout(() => d.remove(), 900); };
  TG.stamp = (root, html) => { const d = document.createElement("div"); d.className = "tg-stamp"; d.innerHTML = html; root.appendChild(d); setTimeout(() => d.remove(), 1300); };
  TG.srcChips = ids => (ids || []).filter((x, i, a) => a.indexOf(x) === i).map(id => { const s = TG.src(id); return `<button class="tg-src" data-src="${esc(id)}">${ico("book", 12)} ${esc((s.title || id).replace(/\s*\(.*$/, "").slice(0, 44))}</button>`; }).join("");
  TG.bindSrc = root => root.querySelectorAll("[data-src]").forEach(b => b.onclick = e => { e.stopPropagation(); const s = TG.src(b.dataset.src), box = root.querySelector(".tg-src-detail");
    if (!box) return; box.innerHTML = `<b>${esc(s.title)}</b>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url.replace(/^https?:\/\//, "").slice(0, 80))}${s.url.length > 88 ? "…" : ""}</a>` : ""}`; box.classList.add("open"); Sound.sfx("tap"); });

  /* ---------- review deck (spaced repetition) ---------- */
  TG.reviewBank = () => { const out = []; TG.defs.forEach(d => { if (d.reviewBank) d.reviewBank().forEach(q => out.push({ q, src: tx(GM[d.id].name) })); }); return out; };
  TG.mkQ = (en, es, answers, c, why, sources, extra = {}) => Object.assign({ q: { en, es }, a: answers, c, why, ref: (sources || []).map(s => (TG.src(s).title || s).replace(/\s*\(.*$/, "").slice(0, 40)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 2).join(" · "), srcIds: sources || [], tg: true }, extra);

  /* ---------- the round engine ---------- */
  const MULT = c => (c >= 10 ? 4 : c >= 6 ? 3 : c >= 3 ? 2 : 1);
  TG.Round = function (cfg) {
    const R = this, es = S.lang === "es", g = GM[cfg.id], def = TG.byId[cfg.id];
    Object.assign(R, { id: cfg.id, def, g, score: 0, combo: 0, best: 0, mult: 1, mistakes: 0, boards: 0, clean: 0, stamps: 0, boardMiss: 0, cards: [], left: cfg.seconds || g.roundSeconds, total: cfg.seconds || g.roundSeconds,
      hearts: cfg.hearts || 0, paused: 0, over: false, t0: performance.now(), stops: [], speed: 0 });
    const stage = $("#stage"); stage.innerHTML = `<div class="tg-round g-${def.slug}" id="tgR">
      <div class="tg-hud"><div class="tg-hud-l"><span class="tg-score" id="tgScore">0</span><span class="tg-mult" id="tgMult" data-m="1">×1</span></div>
        <div class="tg-hud-m" id="tgHudM">${cfg.hudMid || ""}</div>
        <div class="tg-hud-r">${R.hearts ? `<span class="tg-hearts" id="tgHearts">${"<i></i>".repeat(R.hearts)}</span>` : ""}<span class="tg-timer" id="tgTimer"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" class="tr-bg"/><circle cx="20" cy="20" r="17" class="tr-fg" id="tgRing"/></svg><b id="tgSec">${R.left}</b></span></div></div>
      <div class="tg-av" id="tgAv">${avatarSVG(S.avatar, 58)}</div>
      <div class="tg-body" id="tgBody"></div></div>`;
    R.el = $("#tgR"); R.body = $("#tgBody"); const ring = $("#tgRing"), sec = $("#tgSec"), CIRC = 2 * Math.PI * 17; ring.style.strokeDasharray = CIRC;
    let last = performance.now(), shown = R.left, raf = 0, ticks = new Set();
    const frame = now => { if (R.over) return; const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (!R.paused && R.left > 0) { R.left = Math.max(0, R.left - dt); const s = Math.ceil(R.left);
        ring.style.strokeDashoffset = (CIRC * (1 - R.left / R.total)).toFixed(2);
        if (s !== shown) { shown = s; sec.textContent = s; if (s <= 10 && s > 0 && !ticks.has(s)) { ticks.add(s); Sound.sfx("tick"); R.el.classList.add("hurry"); } }
        if (R.left <= 0) { R.timeUp(); return; } }
      R.onFrame && R.onFrame(dt, now);
      raf = requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    const vis = () => { if (document.hidden) R.pause("hidden"); else R.resume("hidden"); }; document.addEventListener("visibilitychange", vis);
    R.cleanup = () => { cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", vis); R.stops.forEach(f => { try { f(); } catch (e) {} }); R.stops = []; Sound.stopLoops && Sound.stopLoops(); document.querySelectorAll(".tg-learn, .tg-learn-back").forEach(x => x.remove()); };
    TG.cur = R; A.tgStop = () => { if (TG.cur === R) { R.over = true; R.cleanup(); } };
    const pauses = new Set(); R.pause = why => { pauses.add(why); R.paused = pauses.size; R.el.classList.toggle("paused", !!R.paused); };
    R.resume = why => { pauses.delete(why); R.paused = pauses.size; R.el.classList.toggle("paused", !!R.paused); last = performance.now(); };
    R.addTime = s => { R.left = Math.min(R.total, R.left + s); };
    const scoreEl = $("#tgScore"), multEl = $("#tgMult"), av = $("#tgAv");
    let shownScore = 0, sAnim = 0; const tickScore = () => { cancelAnimationFrame(sAnim); const from = shownScore, to = R.score, t0 = performance.now();
      const f = n => { const k = Math.min(1, (n - t0) / 380), e = 1 - Math.pow(1 - k, 3); shownScore = Math.round(from + (to - from) * e); scoreEl.textContent = shownScore; if (k < 1) sAnim = requestAnimationFrame(f); }; sAnim = requestAnimationFrame(f);
      scoreEl.classList.remove("bump"); void scoreEl.offsetWidth; scoreEl.classList.add("bump"); };
    R.avatar = kind => { av.classList.remove("pump", "oops"); void av.offsetWidth; av.classList.add(kind); };
    /* correct action. opts: { x, y (relative to round), pts, quiet (snap instead of cha-ching), label } */
    R.hit = (opts = {}) => { R.combo++; R.best = Math.max(R.best, R.combo); if (R.combo > (S.bestRow || 0)) { S.bestRow = R.combo; }
      const m = MULT(R.combo), up = m > R.mult; R.mult = m; const pts = Math.round((opts.pts || 100) * m); R.score += pts; tickScore();
      multEl.textContent = "×" + m; multEl.dataset.m = m; if (up) { multEl.classList.remove("up"); void multEl.offsetWidth; multEl.classList.add("up"); Sound.sfx("combo", { level: m }); TG.buzz("unlock"); R.avatar("pump"); }
      if (opts.quiet) Sound.sfx("snap", { pitch: 1 + Math.min(0.6, R.combo * 0.05) }); else Sound.sfx("correct", { streak: R.combo });
      const r = R.el.getBoundingClientRect(); TG.pop(R.el, opts.x != null ? opts.x : r.width / 2 - 30, opts.y != null ? opts.y : 120, `+${pts}${opts.label ? ` <small>${esc(opts.label)}</small>` : ""}`, m > 1 ? "m" + m : "");
      TG.buzz("correct"); return pts; };
    R.bonus = (pts, label, x, y) => { R.score += pts; tickScore(); const r = R.el.getBoundingClientRect(); TG.pop(R.el, x != null ? x : r.width / 2 - 50, y != null ? y : 150, `+${pts} <small>${esc(label)}</small>`, "bonus"); };
    /* mistake → buzzer, shake, haptic, timer pauses, learn card slides up; resolves when dismissed */
    R.miss = card => new Promise(res => { R.combo = 0; R.mult = 1; multEl.textContent = "×1"; multEl.dataset.m = 1; R.mistakes++; R.boardMiss++;
      Sound.sfx("wrong"); TG.buzz("wrong"); TG.shake(card.shakeEl || R.body, card.big); R.avatar("oops");
      if (R.hearts && !card.noHeart) { R.hearts--; const h = $("#tgHearts"); if (h) { const i = h.querySelectorAll("i:not(.lost)"); if (i.length) i[i.length - 1].classList.add("lost"); } Sound.sfx("heart"); }
      if (card.q) { A.reviewMark && A.reviewMark(card.q, false); R.cards.push(card); }
      R.pause("learn"); setTimeout(() => TG.learnCard(card, () => { R.resume("learn");
        if (R.mistakes % 3 === 0) { const sl = A.pickSaying("wrong"); if (sl) A.toast(esc(sl.text), "quip"); } /* humor: at most every 3rd mistake, never on the card */
        if (R.hearts === 0 && cfg.hearts) return R.end(false, L("Out of hearts", "Sin vidas")); res(); }), card.delay != null ? card.delay : 380); });
    R.boardStart = () => { R.boardMiss = 0; R.boardT0 = performance.now(); };
    R.boardEnd = (opts = {}) => { R.boards++; const clean = R.boardMiss === 0; if (clean) { R.clean++; R.stamps++; TG.stamp(R.el, `${L("CLEAN BOARD", "TABLERO LIMPIO")}`); Sound.sfx("stampg");
        const secs = Math.floor(R.left); if (secs > 0 && opts.speed !== false) setTimeout(() => R.bonus(secs, L("speed", "rapidez")), 420);
        if (R.stamps === 3) setTimeout(() => { R.bonus(300, L("3 clean boards", "3 tableros limpios")); Sound.sfx("streak5"); const sl = A.pickSaying("streak"); if (sl) A.toast(esc(sl.text), "quip"); }, 900); }
      return clean; };
    R.timeUp = () => R.end(false, L("Time's up", "Se acabó el tiempo"));
    /* results */
    R.end = (win, why) => { if (R.over) return; R.over = true; R.el.classList.add("over"); R.cleanup(); const s = st(R.id), prev = s.best || 0, nh = R.score > prev && R.score > 0;
      s.plays = (s.plays || 0) + 1; if (nh) s.best = R.score; S.high["tg:" + R.id] = Math.max(S.high["tg:" + R.id] || 0, R.score); S.games++;
      const rate = R.boards ? R.clean / R.boards : 0, lvUp = win && R.boards >= 2 && rate >= 0.8 && s.lv < 6; if (lvUp) s.lv++;
      A.log("game", "tg:" + R.id, g.name, R.score); A.save(); const xp = Math.round(R.score / 100 * XP_RULES.gamePer100 + 10);
      Sound.stopMusic(); if (!win) setTimeout(() => Sound.sfx("wahwah"), 250);
      const acc = R.boards ? Math.round(100 * rate) : 0;
      $("#stage").innerHTML = `<div class="tg-result ${win ? "win" : "fail"}"><div class="tg-res-av">${avatarSVG(S.avatar, 116, { cls: win ? "av-cheer" : "" })}</div>
        <div class="eyebrow">${esc(tx(g.name))}</div><h2>${esc(why || (win ? L("Round complete", "Ronda completa") : L("Round over", "Fin de la ronda")))}</h2>
        <div class="tg-res-score">${R.score}</div>${nh ? `<div class="pill gold">${ico("trophy", 16)} ${t("newHigh")}</div>` : `<div class="muted sm">${t("highScore")}: ${Math.max(prev, R.score)}</div>`}
        <div class="tg-res-stats"><div><b>${R.clean}/${R.boards}</b><span>${L("clean", "limpios")}</span></div><div><b>×${MULT(R.best)}</b><span>${L("best combo", "mejor combo")} (${R.best})</span></div><div><b>${acc}%</b><span>${L("accuracy", "precisión")}</span></div></div>
        ${lvUp ? `<div class="pill ok lv-pop">${ico("star", 14)} ${L("Level up", "Subiste de nivel")}: ${L("Lv", "Nv")} ${s.lv}</div>` : `<div class="sm muted">${L("Level", "Nivel")} ${s.lv}${s.lv < 6 ? ` · ${L("80% clean boards to level up", "80% de tableros limpios para subir")}` : ""}</div>`}
        ${R.cards.length ? `<a class="list-card tg-res-rev" href="#/review">${ico("history", 18)}<span class="grow"><b>${R.cards.length} ${L(R.cards.length === 1 ? "learn card" : "learn cards", R.cards.length === 1 ? "tarjeta" : "tarjetas")}</b><span class="sm muted block">${L("Saved to your Review deck", "Guardadas en tu Repaso")}</span></span>${ico("arrow", 16)}</a>` : ""}
        <p class="sm muted tg-disc">${L("Practice for school, NATE and the job, under supervision. Follow the unit's installation manual.", "Práctica para la escuela, NATE y el trabajo, con supervisión. Sigue el manual del equipo.")}</p>
        <button class="btn primary big full" id="tgAgain">${t("playAgain")}</button><a class="btn full" href="#/arcade">${t("arcade")}</a></div>`;
      $("#tgAgain").onclick = () => A.render();
      A.addXP(xp);
      if (nh && prev > 0 && A.victory) setTimeout(() => A.victory({ kind: "record", title: tx(g.name), sub: `${R.score} ${t("points").toLowerCase()}` }), 600);
      else { setTimeout(() => Sound.sting && Sound.sting("finished"), 350); if (win && !A.reduced()) A.particles("confetti", 90, 0.3); }
      TG.lastResult = { id: R.id, win, score: R.score, boards: R.boards, clean: R.clean, mistakes: R.mistakes, cards: R.cards.length, best: R.best, lvUp };
    };
  };

  /* ---------- learn card (bottom sheet; swipe down / button resumes) ---------- */
  TG.learnCard = (c, done) => {
    document.querySelectorAll(".tg-learn, .tg-learn-back").forEach(x => x.remove());
    const es = S.lang === "es";
    document.body.insertAdjacentHTML("beforeend", `<div class="tg-learn-back"></div><section class="tg-learn" role="dialog" aria-modal="true" aria-label="${es ? "Tarjeta de aprendizaje" : "Learn card"}">
      <div class="pts-grab"><span></span></div><div class="tgl-top"><span class="tgl-tag">${ico("lightbulb", 14)} ${es ? "Tarjeta" : "Learn card"}</span><span class="tgl-paused">${ico("pause", 12)} ${es ? "tiempo en pausa" : "timer paused"}</span></div>
      ${c.outcome ? `<div class="tgl-outcome">${esc(c.outcome)}</div>` : ""}
      <div class="tgl-sec"><small>${es ? "Lo que hiciste" : "What you did"}</small><p>${esc(c.did)}</p></div>
      <div class="tgl-sec why"><small>${es ? "Por qué está mal" : "Why it's wrong"}</small><p>${esc(c.why)}</p></div>
      ${c.rule ? `<div class="tgl-sec rule"><small>${es ? "La regla" : "The rule"}</small><p>${esc(c.rule)}</p></div>` : ""}
      ${c.oem ? `<div class="tgl-oem">${ico("info", 14)} ${es ? "Sigue el manual de instalación del equipo." : "Follow the unit's installation manual."}</div>` : ""}
      <div class="tgl-src"><small>${es ? "Fuente" : "Source"}</small><div class="tg-srcs">${TG.srcChips(c.sources)}</div><div class="tg-src-detail"></div></div>
      <button class="btn primary big full" id="tglGo">${es ? "Entendido" : "Got it"} ${ico("arrow", 18)}</button></section>`);
    const sh = document.querySelector(".tg-learn"), bk = document.querySelector(".tg-learn-back"); TG.bindSrc(sh);
    requestAnimationFrame(() => { sh.classList.add("open"); bk.classList.add("open"); });
    let closed = false; const close = () => { if (closed) return; closed = true; sh.classList.remove("open"); bk.classList.remove("open"); sh.style.transform = ""; Sound.sfx("whoosh"); setTimeout(() => { sh.remove(); bk.remove(); done && done(); }, 260); };
    sh.querySelector("#tglGo").onclick = close; setTimeout(() => { const b = sh.querySelector("#tglGo"); b && b.focus({ preventScroll: true }); }, 300);
    let y0 = null, dy = 0; const grab = sh.querySelector(".pts-grab"), top = sh.querySelector(".tgl-top");
    [grab, top].forEach(h => { h.addEventListener("pointerdown", e => { y0 = e.clientY; dy = 0; sh.style.transition = "none"; h.setPointerCapture(e.pointerId); });
      h.addEventListener("pointermove", e => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; });
      const end = () => { if (y0 == null) return; y0 = null; sh.style.transition = ""; if (dy > 70) close(); else sh.style.transform = ""; }; h.addEventListener("pointerup", end); h.addEventListener("pointercancel", end); });
    TG.openCard = close;
  };

  /* ---------- magnetic wire drag (pointer events). Draws a cable from a source anchor to the finger; within `magnet` px of a
     target it eases onto the terminal (snap feel). Tap source then tap target also works. ---------- */
  const WIRE_HEX = { red: "#D8402E", white: "#E8E3D6", yellow: "#E8C02A", green: "#3E9B4F", blue: "#3F7FD0", black: "#1E1E1E", orange: "#F08A24", brown: "#7A4A2A", gray: "#8A8A8A", "red/white": "#D8402E", "sensor pair": "#6A5ACD", "dark blue": "#2B4A8A", copper: "#C8763E", purple: "#7E4AA8" };
  TG.wireHex = c => WIRE_HEX[c] || c || "#C8763E";
  TG.cablePath = (x1, y1, x2, y2, sag = 0.22) => { const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), s = Math.min(70, d * sag);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1 + dx * 0.35).toFixed(1)} ${(y1 + dy * 0.1 + s).toFixed(1)} ${(x2 - dx * 0.35).toFixed(1)} ${(y2 - dy * 0.1 + s).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`; };
  TG.wireSvgPath = (color, d, cls = "") => `<g class="tg-cable ${cls}"><path class="tc-o" d="${d}"/><path class="tc-i" d="${d}" stroke="${TG.wireHex(color)}"/><path class="tc-h" d="${d}"/></g>`;
  /* cfg: { root (positioned container), svg (overlay <svg> inside root), sources: [{el, id, color}], targets: [{el, id}], magnet, onDrop(srcId, tgtId, srcEl, tgtEl), canDrag(srcId) } */
  TG.wiring = cfg => {
    const root = cfg.root, svg = cfg.svg, MAG = cfg.magnet || 46; let drag = null, sel = null, raf = 0;
    const rel = el => { const r = el.getBoundingClientRect(), o = root.getBoundingClientRect(); return { x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2, w: r.width, h: r.height }; };
    const anchorOf = (el, side) => { const r = rel(el); return side === "l" ? { x: r.x - r.w / 2 + 6, y: r.y } : side === "r" ? { x: r.x + r.w / 2 - 6, y: r.y } : { x: r.x, y: r.y }; };
    const live = document.createElementNS("http://www.w3.org/2000/svg", "g"); live.setAttribute("class", "tg-live"); svg.appendChild(live);
    const start = (src, e) => { if (cfg.canDrag && !cfg.canDrag(src.id)) return; const o = root.getBoundingClientRect(), a = anchorOf(src.el, cfg.srcSide || "r");
      drag = { src, a, o, x: e.clientX - o.left, y: e.clientY - o.top, x0: e.clientX - o.left, y0: e.clientY - o.top, ex: a.x, ey: a.y, tgts: cfg.targets.filter(t => !t.el.classList.contains("dis")).map(t => ({ t, p: anchorOf(t.el, cfg.tgtSide || "c") })), near: null, id: e.pointerId };
      src.el.classList.add("lifting"); Sound.sfx("pick"); TG.buzz("tap"); cfg.onPick && cfg.onPick(src.id);
      live.innerHTML = TG.wireSvgPath(src.color, TG.cablePath(a.x, a.y, a.x, a.y), "live"); raf = requestAnimationFrame(tick); };
    const tick = () => { if (!drag) return; let tx = drag.x, ty = drag.y, near = null, best = MAG;
      drag.tgts.forEach(o => { const d = Math.hypot(o.p.x - drag.x, o.p.y - drag.y); if (d < best) { best = d; near = o; } });
      if (near) { tx = near.p.x; ty = near.p.y; }
      if (near !== drag.near) { if (drag.near) drag.near.t.el.classList.remove("hot"); if (near) { near.t.el.classList.add("hot"); TG.buzz("tap"); Sound.sfx("micron"); } drag.near = near; }
      const k = near ? 0.45 : 0.6; drag.ex += (tx - drag.ex) * k; drag.ey += (ty - drag.ey) * k;
      const d = TG.cablePath(drag.a.x, drag.a.y, drag.ex, drag.ey), ps = live.querySelectorAll("path"); ps.forEach(p => p.setAttribute("d", d));
      raf = requestAnimationFrame(tick); };
    const finish = () => { if (!drag) return; cancelAnimationFrame(raf); const dd = drag; drag = null; dd.src.el.classList.remove("lifting"); if (dd.near) dd.near.t.el.classList.remove("hot");
      if (dd.near) { live.innerHTML = ""; cfg.onDrop(dd.src.id, dd.near.t.id, dd.src.el, dd.near.t.el); }
      else { /* retract */ const ps = live.querySelectorAll("path"), t0 = performance.now(), sx = dd.ex, sy = dd.ey; Sound.sfx("unsnap");
        const r = n => { const k = Math.min(1, (n - t0) / 180), e = k * k; const x = sx + (dd.a.x - sx) * e, y = sy + (dd.a.y - sy) * e, d = TG.cablePath(dd.a.x, dd.a.y, x, y); ps.forEach(p => p.setAttribute("d", d)); if (k < 1) requestAnimationFrame(r); else live.innerHTML = ""; }; requestAnimationFrame(r); } };
    const handlers = [];
    cfg.sources.forEach(src => { const down = e => { if (e.button > 0) return; e.preventDefault(); try { src.el.setPointerCapture(e.pointerId); } catch (x) {} start(src, e); };
      const move = e => { if (!drag || drag.src !== src) return; drag.x = e.clientX - drag.o.left; drag.y = e.clientY - drag.o.top; };
      const up = e => { if (!drag || drag.src !== src) return; const moved = Math.hypot(drag.x - drag.x0, drag.y - drag.y0) > 14;
        if (!moved) { cancelAnimationFrame(raf); drag = null; live.innerHTML = ""; src.el.classList.remove("lifting"); sel = sel === src ? null : src; cfg.sources.forEach(s => s.el.classList.toggle("sel", s === sel)); return; }
        finish(); };
      src.el.addEventListener("pointerdown", down); src.el.addEventListener("pointermove", move); src.el.addEventListener("pointerup", up); src.el.addEventListener("pointercancel", finish);
      handlers.push(() => { src.el.removeEventListener("pointerdown", down); }); });
    cfg.targets.forEach(t => t.el.addEventListener("click", () => { if (!sel || t.el.classList.contains("dis")) return; const s = sel; sel = null; cfg.sources.forEach(x => x.el.classList.remove("sel")); cfg.onDrop(s.id, t.id, s.el, t.el); }));
    return { anchorOf, rel, clearSel: () => { sel = null; cfg.sources.forEach(x => x.el.classList.remove("sel")); }, destroy: () => handlers.forEach(f => f()) };
  };

  /* ---------- small UI builders ---------- */
  TG.choiceGrid = (opts, cls = "") => `<div class="tg-choices ${cls}">${opts.map((o, i) => `<button class="tg-choice" data-i="${i}">${o}</button>`).join("")}</div>`;
  TG.intro = (R, html, label, cb) => { R.pause("intro"); const d = document.createElement("div"); d.className = "tg-intro"; d.innerHTML = `<div class="tg-intro-in">${html}<button class="btn primary big full" id="tgStart">${label || L("Start", "Empezar")} ${ico("play", 18)}</button></div>`;
    R.el.appendChild(d); requestAnimationFrame(() => d.classList.add("open")); d.querySelector("#tgStart").onclick = () => { Sound.sfx("whoosh"); d.classList.remove("open"); setTimeout(() => d.remove(), 250); R.resume("intro"); cb && cb(); }; };
  TG.flash = (R, html, cls = "", ms = 1100) => { const d = document.createElement("div"); d.className = "tg-flash " + cls; d.innerHTML = html; R.el.appendChild(d); setTimeout(() => d.remove(), ms); };
  TG.start = slug => { const d = TG.bySlug[slug]; if (!d) return false;
    if (!TG.isUnlocked(d.id)) { $("#stage").innerHTML = `<div class="empty tg-locked-full"><span class="tg-art sil big">${d.art(110)}</span><h3>${esc(tx(GM[d.id].name))}</h3><p class="muted">${esc(TG.unlockText(d.id))}</p><a class="btn" href="#/arcade">${t("arcade")}</a></div>`; return true; }
    Sound.playMusic("arcade"); d.run(); return true; };
  TG.title = slug => { const d = TG.bySlug[slug]; return d ? tx(GM[d.id].name) : null; };
})();
