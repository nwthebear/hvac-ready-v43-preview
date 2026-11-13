/* FEEL: one haptic vocabulary for the whole app + an iOS-safe visual stand-in.
   - Distinct patterns per event: light tick for taps, double pulse for correct, buzz for wrong, rising pattern for streaks,
     big thump for rank-ups and trophies. Honors Settings > Haptics (off = nothing, not even the glow).
   - Sound.sfx events fire their matching haptic, deduped so a caller that also buzzes never doubles up.
   - iPhone Safari has no navigator.vibrate: we flash a soft edge glow (opacity only, so reduce-motion safe). */
(function () {
  const A = window.App, S = A.S;
  A.HAPTICS = Object.assign(A.HAPTICS || {}, {
    tap: 6, select: 10, land: 8,
    correct: [14, 60, 14],                 /* double pulse */
    wrong: [55, 35, 55],                   /* buzz */
    pickup: [10, 30, 16], hit: [40, 30, 70],
    streak: [8, 50, 12, 50, 18, 50, 26],   /* rising */
    streakBig: [10, 40, 16, 40, 24, 40, 34, 40, 50],
    badge: [10, 40, 22], unlock: [12, 30, 18, 30, 40], heavy: 22,
    rankup: [70, 40, 20, 40, 120],         /* big thump */
    trophy: [90, 50, 30, 50, 140]
  });
  const PRI = { tap: 1, select: 1, land: 1, pickup: 2, correct: 3, badge: 3, heavy: 3, wrong: 4, hit: 4, streak: 5, unlock: 5, streakBig: 6, rankup: 7, trophy: 8 };
  const GLOW = { correct: "ok", pickup: "ok", streak: "gold", streakBig: "gold", badge: "gold", unlock: "gold", rankup: "gold", trophy: "gold", wrong: "bad", hit: "bad", heavy: "gold" };
  const canVibe = "vibrate" in navigator; A.canVibrate = canVibe;
  let lastT = 0, lastP = 0, glowEl = null, glowT = 0;
  const glow = kind => { if (!GLOW[kind] || document.hidden) return; if (!glowEl) { glowEl = document.createElement("div"); glowEl.id = "hxGlow"; glowEl.setAttribute("aria-hidden", "true"); document.body.appendChild(glowEl); }
    glowEl.className = "hx-" + GLOW[kind] + (PRI[kind] >= 6 ? " big" : ""); void glowEl.offsetWidth; glowEl.classList.add("on"); clearTimeout(glowT); glowT = setTimeout(() => glowEl.classList.remove("on"), PRI[kind] >= 6 ? 420 : 200); };
  A.haptic = p => { if (S.settings.haptics === false) return; const kind = typeof p === "string" ? p : null, pri = PRI[kind] || 2, now = performance.now();
    if (now - lastT < 90 && pri <= lastP) return; lastT = now; lastP = pri; A.lastHaptic = kind || p;
    const pat = kind ? (A.HAPTICS[kind] != null ? A.HAPTICS[kind] : 8) : p;
    if (canVibe) { if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return; try { navigator.vibrate(pat); } catch (e) {} }
    else if (kind) glow(kind); };
  if (A.TG) A.TG.buzz = p => A.haptic(p);
  /* SFX → haptic */
  const MAP = { correct: "correct", wrong: "wrong", streak3: "streak", streak5: "streak", streak7: "streakBig", streak10: "streakBig", unlock: "unlock", stamp: "heavy", stampg: "heavy", land: "land", hop: "tap", pickup: "pickup", fanfare: "trophy", levelup: "badge", heart: "hit", combo: "streak", zonechime: "badge" };
  const s0 = Sound.sfx.bind(Sound); Sound.sfx = (name, opts) => { const r = s0(name, opts); const h = MAP[name]; if (h && !(opts && opts.noHaptic)) A.haptic(h); return r; };
})();
