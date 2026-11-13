/* Core: state, i18n helpers, router, XP/badges/certs, celebrations, game board. */
(function () {
  const KEY = "hvac.state.v1";
  const DEF = { lang: null, name: "", avatar: null, onboarded: false, profile: null, done: {}, quiz: {}, xp: 0, streak: { count: 0, last: null }, history: [], high: {}, games: 0, quizzes: 0, perfect: 0, videos: 0, dayoneSeen: {}, toolsSeen: {}, coachAsked: 0, badges: {}, certs: {}, kit: {}, settings: { sound: true, music: true, timer: true, narration: false, reduceMotion: false, haptics: true, gameDay: false, vol: { master: 0.8, music: 0.8, game: 0.8, quiz: 0.8, ui: 0.8 } }, last: null, daily: {}, early: false, late: false, usedEs: false, lastModule: null };
  let S;
  try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || "{}")); S.settings = Object.assign({}, DEF.settings, S.settings); S.settings.vol = Object.assign({}, DEF.settings.vol, S.settings.vol); if (S.last && typeof S.last.route !== "string") S.last = null; } catch (e) { S = Object.assign({}, DEF); }
  const save = () => localStorage.setItem(KEY, JSON.stringify(S));
  const App = window.App = { S, save, KEY };

  /* ---------- i18n ---------- */
  const lang = () => S.lang || "en";
  window.tx = o => { if (o == null) return ""; if (typeof o === "string") return o; return o[lang()] || o.en || ""; };
  window.t = (k, vars) => { let s = (window.I18N[k] && (window.I18N[k][lang()] || window.I18N[k].en)) || k; if (vars) Object.entries(vars).forEach(([a, b]) => s = s.replace("{" + a + "}", b)); return s; };
  App.isFallback = o => lang() === "es" && o && typeof o === "object" && !o.es;
  App.esNote = o => App.isFallback(o) ? `<div class="note es-note">🌐 ${t("enOnlyNote")}</div>` : "";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  App.esc = esc;
  /* haptics: one place, honors Settings > Sound > Haptics */
  App.HAPTICS = { tap: 8, correct: [14], wrong: [30, 40, 30], unlock: [12, 30, 18, 30, 40], heavy: 22 }; /* one vocabulary everywhere; honors Settings > Haptics */
  App.haptic = p => { if (S.settings.haptics === false) return; if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return; if (typeof p === "string") p = App.HAPTICS[p] || 8; try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
  App.reduced = () => S.settings.reduceMotion || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- humor ---------- */
  /* Picks one line: honors HUMOR_RATE (unless force), skips rare most of the time, and keeps the last HUMOR_COOLDOWN lines out of rotation. */
  App.pickSaying = (ctx, force) => {
    const L = lang(), bank = (window.SAYINGS[L] || window.SAYINGS.en);
    if (!force && Math.random() > (window.HUMOR_RATE[ctx] ?? 0.25)) return null;
    let recent = []; try { recent = JSON.parse(localStorage.getItem("hvac.humor") || "[]"); } catch (e) {}
    let sess = []; try { sess = JSON.parse(sessionStorage.getItem("hvac.humor.session") || "[]"); } catch (e) {}
    const key = s => L + ":" + s.id;
    const pool = bank.filter(s => s.ctx.includes(ctx) && !sess.includes(key(s)) && (!s.rare || Math.random() < 0.15)); if (!pool.length) return null; /* never repeat within a session */
    const fresh = pool.filter(s => !recent.includes(key(s)));
    const s = fresh.length ? fresh[Math.floor(Math.random() * fresh.length)] : pool.sort((x, y) => recent.indexOf(key(x)) - recent.indexOf(key(y)))[0];
    recent = recent.filter(k => k !== key(s)).concat(key(s)).slice(-window.HUMOR_COOLDOWN); localStorage.setItem("hvac.humor", JSON.stringify(recent));
    try { sessionStorage.setItem("hvac.humor.session", JSON.stringify(sess.concat(key(s)))); } catch (e) {}
    const styleB = window.normalizeAvatar && normalizeAvatar(S.avatar).body === "b";
    return styleB && s.textB ? Object.assign({}, s, { text: s.textB }) : s;
  };
  App.resultsQuip = (nItems = 0) => { const R = window.RESULTS_QUIP; let st = { n: 99 }; try { st = JSON.parse(localStorage.getItem("hvac.quip") || '{"n":99}'); } catch (e) {}
    st.n++; let pick = null;
    if (st.n > R.minGap && Math.random() < R.chance) { const L = lang(), bank = (window.SAYINGS[L] || window.SAYINGS.en).filter(x => x.ctx.includes("results"));
      const long = nItems >= R.longQuiz, late = new Date().getHours() >= R.lateHour;
      const pool = bank.filter(x => !x.when || (x.when === "long" && long) || (x.when === "late" && late)), pref = pool.filter(x => x.when);
      const from = pref.length && Math.random() < .6 ? pref : pool; pick = from[Math.floor(Math.random() * from.length)] || null; if (pick) st.n = 0; }
    localStorage.setItem("hvac.quip", JSON.stringify(st)); return pick ? `<p class="saying sm muted">${App.esc(pick.text)}</p>` : ""; };
  App.saying = (ctx, force) => {
    const s = App.pickSaying(ctx, force); if (!s) return "";
    return `<div class="saying">${s.joke ? `<span class="joke-tag">${lang() === "es" ? "BROMA" : "JOKE"}</span> ` : ""}${esc(s.text)}${s.joke && s.fix ? `<div class="joke-fix">${lang() === "es" ? "Lo correcto:" : "Real practice:"} ${esc(s.fix)}</div>` : ""}</div>`;
  };


  /* ---------- streak / xp / history ---------- */
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  App.today = today;
  App.touchStreak = () => {
    const td = today(); if (S.streak.last === td) return;
    const y = new Date(); y.setDate(y.getDate() - 1); const yd = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
    S.streak.count = S.streak.last === yd ? S.streak.count + 1 : 1; S.streak.last = td;
    const h = new Date().getHours(); if (h < 7) S.early = true; if (h >= 22) S.late = true; if (lang() === "es") S.usedEs = true; save();
  };
  /* the streak only starts/extends when the user completes something (lesson, quiz, game, module), never on app open;
     a broken streak reads 0 until the next completion */
  App.normalizeStreak = () => { const td = today(), y = new Date(); y.setDate(y.getDate() - 1); const yd = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
    if (S.streak.count && S.streak.last !== td && S.streak.last !== yd) { S.streak.count = 0; save(); } };
  App.rank = (xp = S.xp) => { let r = window.RANKS[0], i = 0; window.RANKS.forEach((x, j) => { if (xp >= x.xp) { r = x; i = j; } }); const nx = window.RANKS[i + 1]; return { r, i, next: nx, pct: nx ? Math.round(100 * (xp - r.xp) / (nx.xp - r.xp)) : 100 }; };
  App.rankStars = () => (S.otStars || []).length;
  App.rankName = (r, withStars) => { const n = tx(r); const k = App.rankStars(); return withStars && r === window.RANKS[window.RANKS.length - 1] && k ? `${n} ${"★".repeat(Math.min(k, 5))}${k > 5 ? "×" + k : ""}` : n; };
  /* Old Timer stars: each exam passed for the first time after reaching the cap */
  App.awardStar = key => { const top = window.RANKS.length - 1; if (App.rank().i < top || !/^(placement|epa):/.test(key || "")) return; S.otStars = S.otStars || []; if (S.otStars.includes(key)) return; S.otStars.push(key); save();
    setTimeout(() => App.toast(`★ ${App.rankName(window.RANKS[top], true)}`, "levelup"), 1200); };
  /* rank-up: the avatar victory scene with the rank title and tagline; waits for any open celebration first */
  App.rankUp = r => { let tries = 0; const go = () => { if (document.querySelector(".vic, .celebrate-ov") && tries++ < 120) return setTimeout(go, 500);
      if (App.victory) App.victory({ kind: "rank", title: `${r.icon} ${tx(r)}`, sub: tx(r.line) }); else App.toast(`${t("levelUp")}: ${r.icon} ${tx(r)}`, "levelup"); };
    setTimeout(go, 900); };
  App.addXP = n => { const before = App.rank().i; S.xp += Math.round(n); save(); const rk = App.rank(); if (rk.i > before) App.rankUp(rk.r); };
  App.log = (type, id, title, score, total) => { if (S.onboarded) App.touchStreak(); S.history.unshift({ t: Date.now(), type, id, title: typeof title === "object" ? title.en : title, score, total }); S.history = S.history.slice(0, 300); save(); };

  /* ---------- completion state ---------- */
  App.isDone = key => !!S.done[key];
  App.quizBest = key => (S.quiz[key] || {}).best;
  /* EPA practice uses 70% (the real 608 passing score). Short lesson checks pass at 2 of 3 (66%). */
  App.passPct = key => String(key).startsWith("epa:") ? 70 : 66;
  App.linkDone = ([type, id]) => {
    if (type === "quiz") return (App.quizBest("epa:" + id) || 0) >= 70;
    if (type === "dayone") return Object.keys(S.dayoneSeen).length >= 5;
    return App.isDone(type + ":" + id);
  };
  App.markDone = (key, xp) => { const first = !S.done[key]; if (S.onboarded) App.touchStreak(); if (first) { S.done[key] = Date.now(); if (xp) App.addXP(xp); } save(); App.syncModules(); return first; };

  /* ---------- plan ---------- */
  App.plan = () => S.profile ? window.PathEngine.buildPlan(S.profile) : null;
  const ACTIVE = ["core", "short", "optional"];
  App.boardModules = plan => plan.modules.filter(m => ["core", "short", "later"].includes(m.status) || (m.status === "optional" && m.links.length));
  App.moduleDone = m => !!S.done["module:" + m.id];
  App.gateOpen = (m, plan) => {
    if (!m.gate || m.gate === "epa") return true;
    if (m.gate === "walkthrough") return window.PathEngine.WALKTHROUGH.some(id => S.done["module:" + id]);
    if (m.gate === "options") return !!S.done["module:SALES-OPTIONS-01"];
    if (m.gate === "foundation") return window.PROGRESSION.beginner_vs_experienced.absolute_beginner_start.every(id => S.done["module:" + id]);
    return true;
  };
  App.syncModules = () => {
    const plan = App.plan(); if (!plan) return [];
    const newly = [];
    plan.modules.forEach(m => { if (m.links.length && !S.done["module:" + m.id] && m.links.every(App.linkDone)) { S.done["module:" + m.id] = Date.now(); newly.push(m); App.addXP(window.XP_RULES.moduleSignoff); } });
    if (newly.length) { S.lastModule = newly[newly.length - 1].id; save(); }
    return newly;
  };
  App.progress = plan => {
    const mods = App.boardModules(plan).filter(m => m.status !== "optional");
    const done = mods.filter(App.moduleDone).length;
    const stages = plan.stages.map(s => { const ms = s.modules.filter(m => mods.includes(m)); const d = ms.filter(App.moduleDone).length; return { id: s.id, label: s.label, total: ms.length, done: d, pct: ms.length ? Math.round(100 * d / ms.length) : 100 }; }).filter(s => s.total);
    return { total: mods.length, done, pct: mods.length ? Math.round(100 * done / mods.length) : 0, stages, stagesDone: stages.filter(s => s.pct === 100).length };
  };
  App.nextModule = plan => App.boardModules(plan).find(m => m.status !== "optional" && !App.moduleDone(m) && App.gateOpen(m, plan));
  App.moduleRoute = m => "#/module/" + m.id;

  /* ---------- certificates (in-app, practice only) ---------- */
  App.CERTS = [
    { id: "hvac101", icon: "🧰", title: { en: "HVAC 101 Foundations", es: "Fundamentos HVAC 101" }, test: () => ["safety", "cycle", "components", "tools"].every(g => App.isDone("guide:" + g)) },
    { id: "science", icon: "🔬", title: { en: "Science of HVAC + CHP-5 Fundamentals (practice)", es: "Ciencia del HVAC + Fundamentos CHP-5 (práctica)" }, test: () => App.isDone("guide:science") && App.isDone("guide:ch5") },
    { id: "epa-core", icon: "🌎", title: { en: "EPA 608 Core Practice (70%+)", es: "Práctica EPA 608 Core (70%+)" }, test: () => (App.quizBest("epa:core") || 0) >= 70 },
    { id: "epa-all", icon: "🏆", title: { en: "EPA 608 Universal Practice", es: "Práctica EPA 608 Universal" }, test: () => ["core", "type1", "type2", "type3"].every(s => (App.quizBest("epa:" + s) || 0) >= 70) },
    { id: "rtw", icon: "🎓", title: { en: "Ready-to-Work Practice (original, not NATE)", es: "Práctica Ready-to-Work (original, no NATE)" }, test: () => ["nate-rtw", "safety", "tools", "components"].every(g => App.isDone("guide:" + g)) },
    { id: "hands-on", icon: "🛠️", title: { en: "Hands-On Skills (all 17)", es: "Habilidades prácticas (las 17)" }, test: () => window.SKILLS.every(s => App.isDone("skill:" + s.id)) },
    { id: "stage", icon: "🚩", title: { en: "Path stage complete", es: "Etapa de ruta completa" }, test: () => { const p = App.plan(); return p && App.progress(p).stagesDone >= 1; } },
    { id: "path", icon: "🥇", title: { en: "Full path complete", es: "Ruta completa" }, test: () => { const p = App.plan(); return p && App.progress(p).pct === 100; } }
  ];
  /* Practice certificate ID: deterministic from name + cert + earned time. Format HVP-XXXX-XXXX. */
  App.certId = (id, name = S.name, ts = S.certs[id]) => { let h = 2166136261; for (const ch of `${name}|${id}|${ts}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } const x = h.toString(36).toUpperCase().padStart(8, "0").slice(-8); return `HVP-${x.slice(0, 4)}-${x.slice(4)}`; };
  App.checkCerts = () => { const n = []; App.CERTS.forEach(c => { if (!S.certs[c.id] && c.test()) { S.certs[c.id] = Date.now(); n.push(c); } }); if (n.length) save(); return n; };

  /* ---------- badges ---------- */
  App.badgeMet = b => {
    const r = b.rule, plan = App.plan();
    if (r.quizzes) return S.quizzes >= r.quizzes; if (r.games) return S.games >= r.games; if (r.perfect) return S.perfect >= r.perfect;
    if (r.streak) return S.streak.count >= r.streak; if (r.xp) return S.xp >= r.xp; if (r.videos) return S.videos >= r.videos;
    if (r.dayone) return Object.keys(S.dayoneSeen).length >= r.dayone; if (r.tools) return Object.keys(S.toolsSeen).length >= r.tools;
    if (r.coach) return S.coachAsked >= r.coach; if (r.done) return App.isDone(r.done); if (r.doneAll) return r.doneAll.every(App.isDone);
    if (r.skillsDone) return Object.keys(S.done).filter(k => k.startsWith("skill:")).length >= r.skillsDone;
    if (r.guidesDone) return Object.keys(S.done).filter(k => k.startsWith("guide:")).length >= r.guidesDone;
    if (r.high) return (S.high[r.high.game] || 0) >= r.high.gte; if (r.early) return S.early; if (r.late) return S.late; if (r.lang) return S.usedEs;
    if (r.inRow) return (S.bestRow || 0) >= r.inRow; if (r.certs) return Object.keys(S.certs).length >= r.certs;
    if (r.sims) return Object.values(S.sims || {}).filter(x => x.solved).length >= r.sims; if (r.simStars) return Object.values(S.sims || {}).some(x => x.stars >= 3); if (r.sim) return !!(S.sims || {})[r.sim]?.solved;
    if (r.stagesDone) return plan && App.progress(plan).stagesDone >= r.stagesDone; if (r.pathDone) return plan && App.progress(plan).pct === 100;
    return false;
  };
  App.checkBadges = () => { const n = []; window.BADGES.forEach(b => { if (!S.badges[b.id] && App.badgeMet(b)) { S.badges[b.id] = Date.now(); n.push(b); } }); if (n.length) save(); return n; };

  /* ---------- UI helpers ---------- */
  App.toast = (html, cls = "") => { const d = document.createElement("div"); d.className = "toast " + cls; d.innerHTML = html; document.body.appendChild(d); setTimeout(() => d.classList.add("show"), 10); setTimeout(() => { d.classList.remove("show"); setTimeout(() => d.remove(), 400); }, 2600); };
  App.go = h => { if (location.hash === h) App.render(); else location.hash = h; };

  /* ---------- celebrations ---------- */
  const EFFECTS = ["confetti", "fireworks", "burst", "stamp"];
  function particles(kind, count = 140, oy = 0.45) {
    const cv = document.createElement("canvas"); cv.className = "fx-canvas"; document.body.appendChild(cv);
    const W = cv.width = innerWidth * devicePixelRatio, H = cv.height = innerHeight * devicePixelRatio; const c = cv.getContext("2d"); const P = [];
    const colors = ["#FF7A1A", "#D9AE48", "#A08A6B", "#8DB255", "#5FB8DC", "#ECE6DA"];
    if (kind === "confetti") for (let i = 0; i < count; i++) P.push({ x: W / 2, y: H * oy, vx: (Math.random() - 0.5) * 26, vy: -Math.random() * 28 - 6, g: 0.7, s: 6 + Math.random() * 8, c: colors[i % 6], r: Math.random() * 6, vr: Math.random() - 0.5, life: 140 });
    if (kind === "fireworks") for (let b = 0; b < 4; b++) { const cx = W * (0.2 + 0.6 * Math.random()), cy = H * (0.2 + 0.3 * Math.random()), col = colors[b % 6]; for (let i = 0; i < 50; i++) { const a = i / 50 * Math.PI * 2, sp = 4 + Math.random() * 7; P.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.12, s: 4, c: col, life: 70 + Math.random() * 30, delay: b * 18, dot: true }); } }
    let f = 0; (function loop() {
      c.clearRect(0, 0, W, H); let alive = 0;
      P.forEach(p => { if (p.delay && f < p.delay) { alive++; return; } if (p.life-- <= 0) return; alive++; p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; c.globalAlpha = Math.min(1, p.life / 40); c.fillStyle = p.c;
        if (p.dot) { c.beginPath(); c.arc(p.x, p.y, p.s, 0, 7); c.fill(); } else { c.save(); c.translate(p.x, p.y); c.rotate(p.r += p.vr); c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore(); } });
      f++; if (alive && f < 240) requestAnimationFrame(loop); else cv.remove();
    })();
  }
  App.particles = particles;
  /* In-a-row milestones (quiz + arcade). Escalating banner, confetti and a sting layered on the cha-ching. */
  App.ROW_TIERS = [
    { n: 3, id: "row-3", name: { en: "Warmed Up", es: "Ya Calentó" }, conf: 0 },
    { n: 5, id: "row-5", name: { en: "Firing on All Cylinders", es: "A Todo Vapor" }, conf: 60 },
    { n: 7, id: "row-7", name: { en: "Full Charge", es: "Carga Completa" }, conf: 120 },
    { n: 10, id: "row-10", name: { en: "Y2K Compliant", es: "A Prueba del Y2K" }, conf: 220 }
  ];
  App.onStreak = n => {
    if (n > (S.bestRow || 0)) { S.bestRow = n; save(); }
    const tier = App.ROW_TIERS.find(x => x.n === n); if (!tier) return;
    const k = App.ROW_TIERS.indexOf(tier), es = lang() === "es";
    setTimeout(() => Sound.sfx("streak" + n), 230);
    const b = document.createElement("div"); b.className = `streak-banner tier-${k + 1}`; b.setAttribute("role", "status");
    b.innerHTML = `<span class="sb-n">${n}</span><span class="sb-t"><small>${es ? "seguidas" : "in a row"}</small><b>${esc(tx(tier.name))}</b></span>`;
    document.querySelectorAll(".streak-banner").forEach(x => x.remove()); document.body.appendChild(b); setTimeout(() => b.remove(), 1700 + k * 400);
    if (!App.reduced()) { if (tier.conf) particles("confetti", tier.conf, 0.18); if (k >= 2) document.body.classList.add("glow-" + (k + 1)), setTimeout(() => document.body.classList.remove("glow-" + (k + 1)), 1200); if (k === 3) particles("fireworks"); }
    const sl = App.pickSaying("streak"); if (sl) setTimeout(() => App.toast(esc(sl.text), "quip"), 1900);
    const nb = App.checkBadges(); nb.forEach(x => setTimeout(() => App.toast(`${x.icon} <b>${esc(tx(x.name))}</b>`, "gold"), 900));
  };
  function burst() {
    const em = Math.random() < 0.5 ? "❄️" : "🔥", box = document.createElement("div"); box.className = "fx-burst"; document.body.appendChild(box);
    for (let i = 0; i < 26; i++) { const s = document.createElement("span"); s.textContent = em; const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 160; s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d + "px"); s.style.animationDelay = Math.random() * 0.15 + "s"; box.appendChild(s); }
    setTimeout(() => box.remove(), 1800); return em === "❄️" ? "freeze" : "flame";
  }
  /* opts: { title, sub, key (path module tie-in), onDone, showBoard } */
  App.celebrate = (opts = {}) => {
    const newMods = App.syncModules(); const certs = App.checkCerts(); const badges = App.checkBadges();
    if ((certs.length || opts.examPass) && App.victory) { /* exam pass / certificate → the synced victory scene */
      const extras = newMods.map(m => `<div class="pill ok">✅ ${esc(tx(m.title))}</div>`).join("") + certs.map(c => `<div class="pill gold">📜 ${t("newCert")} ${esc(tx(c.title))}</div>`).join("") + badges.map(b => `<div class="pill badge">${b.icon} ${esc(tx(b.name))}</div>`).join("");
      const board = App.plan() && opts.showBoard !== false;
      App.victory({ kind: certs.length ? "cert" : "pass", title: certs.length ? tx(certs[0].title) : opts.title, sub: certs.length ? (opts.title ? esc(opts.title) + " · " + esc(opts.sub || "") : "") : esc(opts.sub || ""), extras, again: opts.again,
        goLabel: board ? (S.lang === "es" ? "Ver tablero" : "See game board") : null,
        onContinue: () => { if (board) { App.boardFrom = { from: S.lastModulePrev || null, mod: newMods.length ? newMods[newMods.length - 1].id : null, zoom: true }; App.go("#/board"); } else if (opts.onDone) opts.onDone(); } });
      return;
    }
    setTimeout(() => Sound.sting && Sound.sting("finished"), 250); /* lesson / non-gated quiz / arcade round over */
    const eff = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
    const line = App.pickSaying("complete") || { text: "" }; /* rare: ~1 in 5 */
    if (!App.reduced()) {
      if (eff === "confetti") { particles("confetti"); Sound.sfx("confetti"); }
      if (eff === "fireworks") { particles("fireworks"); Sound.sfx("firework"); }
      if (eff === "burst") Sound.sfx(burst());
    }
    if (eff === "stamp" || App.reduced()) Sound.sfx("stamp");
    Sound.sfx("levelup"); 
    const ov = document.createElement("div"); ov.className = "celebrate-ov";
    ov.innerHTML = `<div class="celebrate-card ${eff === "stamp" && !App.reduced() ? "with-stamp" : ""}">
      ${eff === "stamp" && !App.reduced() ? `<div class="stamp">${S.lang === "es" ? "LISTO" : "DONE"}</div>` : ""}
      <div class="cel-avatar">${avatarSVG(S.avatar, 130, { cls: "av-cheer" })}</div>
      <h2>${esc(opts.title || t("completed"))}</h2>${opts.sub ? `<p class="big">${opts.sub}</p>` : ""}
      ${line.text ? `<p class="cel-line">${esc(line.text)}</p>` : ""}
      ${newMods.map(m => `<div class="pill ok">✅ ${esc(tx(m.title))}</div>`).join("")}
      ${certs.map(c => `<div class="pill gold">📜 ${t("newCert")} ${esc(tx(c.title))}</div>`).join("")}
      ${badges.map(b => `<div class="pill badge">${b.icon} ${esc(tx(b.name))}</div>`).join("")}
      <div class="row gap"><button class="btn primary big" id="celGo">${App.plan() && opts.showBoard !== false ? ico("dice", 18) + " " + (S.lang === "es" ? "Ver tablero" : "See game board") : t("continue")}</button>
      ${opts.again ? `<button class="btn" id="celAgain">${t("playAgain")}</button>` : ""}</div></div>`;
    document.body.appendChild(ov);
    ov.querySelector("#celGo").onclick = () => { ov.remove(); if (App.plan() && opts.showBoard !== false) { App.boardFrom = { from: S.lastModulePrev || null, mod: newMods.length ? newMods[newMods.length - 1].id : null, zoom: true }; App.go("#/board"); } else if (opts.onDone) opts.onDone(); };
    if (opts.again) ov.querySelector("#celAgain").onclick = () => { ov.remove(); opts.again(); };
  };
})();
