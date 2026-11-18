/* Launch trailer: plays on every app open. Tap to start unlocks audio on iOS.
   No skip / tap-to-skip — the trailer is short. No menu music during the intro
   (SFX only). The menu track starts exactly once when the first screen appears,
   with a smooth fade-in to SOFT. No tagline. */
(function () {
  const SRC = "video/intro.mp4", POSTER = "video/intro-poster.jpg", SOFT = 0.65;
  /* Source plate in the 720x1560 intro art (object-fit: cover, centered). */
  const ART_W = 720, ART_H = 1560, PLATE_BOTTOM = 1080;
  /* 2x emblem crop in 1x art pixels (from Gen B, rest pose). GPU-composited. */
  const LOGO_CROP = [6.5, 381.0, 720.0, 1107.0];
  const LOGO = {
    start: { cx: 363.5, cy: 757.5, s: 0.88 },
    rest:  { cx: 363.0, cy: 703.0, s: 0.80 },
    tA: 1.70, tI: 2.20,
    zeta: 0.38, omega: 11.4,
    vSpr: { cx: -2.19934009, cy: -239.72806959, s: -0.35189441 },
    letterOn: [2.1333333333333333, 2.2]
  };
  function logoEaseIn(u) { u = Math.min(1, Math.max(0, u)); return u * u * u * u; }
  function logoSpring(t, v0) {
    const z = LOGO.zeta, w = LOGO.omega, wd = w * Math.sqrt(1 - z * z);
    return Math.exp(-z * w * t) * (v0 / wd) * Math.sin(wd * t);
  }
  function logoPose(t) {
    const S = LOGO.start, R = LOGO.rest;
    let p;
    if (t <= LOGO.tA) p = { cx: S.cx, cy: S.cy, s: S.s };
    else if (t <= LOGO.tI) {
      const e = logoEaseIn((t - LOGO.tA) / (LOGO.tI - LOGO.tA));
      p = { cx: S.cx + (R.cx - S.cx) * e, cy: S.cy + (R.cy - S.cy) * e, s: S.s + (R.s - S.s) * e };
    } else {
      const dt = t - LOGO.tI;
      if (dt > 2) p = { cx: R.cx, cy: R.cy, s: R.s };
      else p = {
        cx: R.cx + logoSpring(dt, LOGO.vSpr.cx),
        cy: R.cy + logoSpring(dt, LOGO.vSpr.cy),
        s:  R.s  + logoSpring(dt, LOGO.vSpr.s)
      };
    }
    const a = LOGO.letterOn;
    p.letter = t <= a[0] ? 0 : t >= a[1] ? 1 : (t - a[0]) / (a[1] - a[0]);
    const dt = 1 / 120, p0 = logoPoseBare(Math.max(0, t - dt)), p1 = logoPoseBare(t + dt);
    p.speed = Math.hypot((p1.cx - p0.cx) / (2 * dt), (p1.cy - p0.cy) / (2 * dt));
    return p;
  }
  function logoPoseBare(t) {
    const S = LOGO.start, R = LOGO.rest;
    if (t <= LOGO.tA) return S;
    if (t <= LOGO.tI) {
      const e = logoEaseIn((t - LOGO.tA) / (LOGO.tI - LOGO.tA));
      return { cx: S.cx + (R.cx - S.cx) * e, cy: S.cy + (R.cy - S.cy) * e, s: S.s + (R.s - S.s) * e };
    }
    const dt = t - LOGO.tI;
    if (dt > 2) return R;
    return { cx: R.cx + logoSpring(dt, LOGO.vSpr.cx), cy: R.cy + logoSpring(dt, LOGO.vSpr.cy), s: R.s + logoSpring(dt, LOGO.vSpr.s) };
  }

  /* Letter heat stages from the original letter-stages asset, timed to the slam. */
  const HEAT = { appear: 2.133, hotEnd: 2.45, coolEnd: 2.95, brassEnd: 4.40, typeEnd: 6.20 };
  function letterHeat(t) {
    const H = HEAT, o = { hot: 0, cooling: 0, brass: 0, type: 0 };
    if (t <= H.appear) return o;
    if (t < H.hotEnd) { o.hot = (t - H.appear) / (H.hotEnd - H.appear); return o; }
    if (t < H.coolEnd) { const u = (t - H.hotEnd) / (H.coolEnd - H.hotEnd); o.hot = 1 - u; o.cooling = u; return o; }
    if (t < H.brassEnd) { const u = (t - H.coolEnd) / (H.brassEnd - H.coolEnd); o.cooling = 1 - u; o.brass = u; return o; }
    if (t < H.typeEnd) { const u = (t - H.brassEnd) / (H.typeEnd - H.brassEnd); o.brass = 1 - u; o.type = u; return o; }
    o.type = 1; return o;
  }
  function logoFlash(t) {
    if (t < 2.15 || t > 2.55) return 0;
    if (t <= 2.22) return 0.55;
    return 0.55 * Math.exp(-(t - 2.22) / 0.12);
  }

  function markStandalone() {
    try {
      const st = window.navigator.standalone === true ||
        window.matchMedia("(display-mode: standalone)").matches;
      if (st) document.documentElement.classList.add("is-standalone");
    } catch (e) {}
  }
  markStandalone();

  function cssPx(name) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    const n = parseFloat(v);
    return isFinite(n) ? n : 0;
  }
  function applyVisibleFrame(el) {
    if (!el) return;
    /* Edge-to-edge on the layout viewport, including under the status
       bar and home indicator. Safe-area padding belongs on the Tap to
       start controls, not on the artwork — shrinking the overlay by
       --sat/--sab (and visualViewport) left black bars on iPhone. */
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.right = "0";
    el.style.bottom = "0";
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.height = "100dvh";
    el.style.margin = "0";
    el.style.boxSizing = "border-box";
  }
  function placeStartBtn() {
    const ov = document.getElementById("intro-ov");
    const btn = document.getElementById("intro-start");
    if (!ov || !btn || finish.done) return;
    const iw = ov.clientWidth || window.innerWidth;
    const ih = ov.clientHeight || window.innerHeight;
    const scale = Math.max(iw / ART_W, ih / ART_H);
    const artTop = (ih - ART_H * scale) / 2;
    const plateBottomY = artTop + PLATE_BOTTOM * scale;
    const btnH = btn.offsetHeight || 40;
    const sab = cssPx("--sab");
    const vv = window.visualViewport;
    const visTop = vv ? vv.offsetTop : 0;
    const visBottom = vv ? (vv.offsetTop + vv.height) : ih;
    const maxBottom = Math.min(ih, visBottom) - Math.max(sab, 12);
    const minTop = visTop + 8;
    let top = plateBottomY + 28;
    if (top + btnH > maxBottom) top = maxBottom - btnH;
    if (top < minTop) top = minTop;
    btn.style.top = Math.round(top) + "px";
    btn.style.bottom = "auto";
    btn.style.left = "50%";
    btn.style.transform = "translateX(-50%)";
  }
  function artBox(ov) {
    const iw = ov.clientWidth || window.innerWidth;
    const ih = ov.clientHeight || window.innerHeight;
    const scale = Math.max(iw / ART_W, ih / ART_H);
    return { iw, ih, scale, w: ART_W * scale, h: ART_H * scale, left: (iw - ART_W * scale) / 2, top: (ih - ART_H * scale) / 2 };
  }
  function placeLogo(t) {
    const ov = document.getElementById("intro-ov");
    const box = document.getElementById("intro-logo");
    if (!ov || !box) return;
    const a = artBox(ov);
    box.style.left = a.left + "px";
    box.style.top = a.top + "px";
    box.style.width = a.w + "px";
    box.style.height = a.h + "px";
    const [x0, y0, x1, y1] = LOGO_CROP;
    const layerIds = ["intro-logo-blank", "intro-logo-hot", "intro-logo-cooling", "intro-logo-brass", "intro-logo-type"];
    layerIds.forEach(id => {
      const img = document.getElementById(id);
      if (!img) return;
      img.style.left = (x0 / ART_W * a.w) + "px";
      img.style.top = (y0 / ART_H * a.h) + "px";
      img.style.width = ((x1 - x0) / ART_W * a.w) + "px";
      img.style.height = ((y1 - y0) / ART_H * a.h) + "px";
    });
    const time = t == null ? (placeLogo.t || 0) : t;
    placeLogo.t = time;
    const p = logoPose(time);
    const tx = (p.cx - LOGO.rest.cx) * a.scale;
    const ty = (p.cy - LOGO.rest.cy) * a.scale;
    const k = p.s / LOGO.rest.s;
    box.style.transformOrigin = (LOGO.rest.cx / ART_W * 100) + "% " + (LOGO.rest.cy / ART_H * 100) + "%";
    box.style.transform = "translate3d(" + tx + "px," + ty + "px,0) scale(" + k + ")";
    const blur = Math.min(2.2, p.speed * 0.012);
    const lift = logoFlash(time);
    const filters = [
      "drop-shadow(" + (-12 * a.scale) + "px " + (22 * a.scale) + "px " + (11 * a.scale) + "px rgba(0,0,0,.48))"
    ];
    if (blur > 0.18) filters.push("blur(" + blur + "px)");
    if (lift > 0.02) filters.push("brightness(" + (1 + 0.55 * lift) + ")", "sepia(" + (0.22 * lift) + ")");
    box.style.filter = filters.join(" ");
    const heat = letterHeat(time);
    const setOp = (id, v) => { const el = document.getElementById(id); if (el) el.style.opacity = String(v); };
    setOp("intro-logo-hot", heat.hot);
    setOp("intro-logo-cooling", heat.cooling);
    setOp("intro-logo-brass", heat.brass);
    setOp("intro-logo-type", heat.type);
  }
  function logoTick(now) {
    if (finish.done) return;
    const t0 = logoTick.t0;
    const t = t0 == null ? 0 : Math.max(0, (now - t0) / 1000);
    placeLogo(t);
    if (t0 != null && t < 9) logoTick.raf = requestAnimationFrame(logoTick);
  }
  function frameIntro() {
    applyVisibleFrame(document.getElementById("intro-ov"));
    applyVisibleFrame(document.getElementById("splash"));
    placeLogo(placeLogo.t || 0);
    placeStartBtn();
  }
  function hookFrame() {
    frameIntro();
    const vv = window.visualViewport;
    if (hookFrame.on) return; hookFrame.on = true;
    window.addEventListener("resize", frameIntro);
    window.addEventListener("orientationchange", frameIntro);
    if (vv) {
      vv.addEventListener("resize", frameIntro);
      vv.addEventListener("scroll", frameIntro);
    }
  }
  function unhookFrame() {
    window.removeEventListener("resize", frameIntro);
    window.removeEventListener("orientationchange", frameIntro);
    const vv = window.visualViewport;
    if (vv) {
      vv.removeEventListener("resize", frameIntro);
      vv.removeEventListener("scroll", frameIntro);
    }
    hookFrame.on = false;
  }

  try { if (window.Sound && Sound.deferMusic) Sound.deferMusic(true); } catch (e) {}

  const es = () => { try { return JSON.parse(localStorage.getItem("hvac.state.v1") || "{}").lang === "es"; } catch (e) { return false; } };

  function armFailsafe(ms) {
    clearTimeout(finish.timer);
    finish.timer = setTimeout(() => { try { finish(); } catch (e) {} }, ms);
  }
  function finish() {
    if (finish.done) return; finish.done = true;
    clearTimeout(finish.timer);
    cancelAnimationFrame(logoTick.raf);
    const ov = document.getElementById("intro-ov"), vid = document.getElementById("intro-vid"), fx = document.getElementById("intro-fx");
    try { if (vid) { vid.pause(); vid.removeAttribute("src"); vid.load(); } } catch (e) {}
    try { if (fx) { fx.pause(); fx.removeAttribute("src"); fx.load(); } } catch (e) {}
    try { Sound.stopIntroStem && Sound.stopIntroStem(); } catch (e) {}
    if (ov) {
      ov.classList.add("out");
      ov.style.pointerEvents = "none";
      ov.setAttribute("aria-hidden", "true");
      setTimeout(() => { try { ov.style.display = "none"; ov.remove(); } catch (e) {} unhookFrame(); }, 420);
    }
    const sp = document.getElementById("splash");
    if (sp) {
      sp.classList.add("out");
      sp.style.pointerEvents = "none";
      setTimeout(() => { try { sp.style.display = "none"; sp.remove(); } catch (e) {} }, 200);
    }
    try {
      Sound.unlock && Sound.unlock();
      Sound.setMusicScale && Sound.setMusicScale(SOFT);
      Sound.deferMusic && Sound.deferMusic(false);
      Sound.playMusic && Sound.playMusic("chill");
    } catch (e) {}
    setTimeout(() => { try { App.offerStarter && App.offerStarter(); } catch (e) {} }, 500);
  }

  function hideGate() {
    const gate = document.getElementById("intro-gate");
    if (gate) { gate.hidden = true; gate.classList.add("off"); gate.setAttribute("aria-hidden", "true"); gate.style.display = "none"; }
  }

  function play() {
    if (play.started) return;
    play.started = true;
    const vid = document.getElementById("intro-vid");
    hideGate(); /* hide immediately — do not wait on play() */
    armFailsafe(12000); /* hard cap: drop intro layers even if video/emblem never end */
    logoTick.t0 = performance.now();
    cancelAnimationFrame(logoTick.raf);
    logoTick.raf = requestAnimationFrame(logoTick);
    /* Start the intro stem synchronously in this gesture. iOS will not
       unlock media started later on rAF / timeupdate, and WebAudio is
       muted by the ringer switch. */
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    try {
      Sound.playIntroStem && Sound.playIntroStem();
      Sound.unlock && Sound.unlock();
      Sound.deferMusic && Sound.deferMusic(true);
    } catch (e) {}
    if (!vid) return finish();
    vid.muted = true; /* picture only; soundtrack is the HTMLAudio stem */
    const fx = document.getElementById("intro-fx");
    if (fx) { fx.muted = true; try { fx.currentTime = 0; } catch (e) {} const fp = fx.play(); if (fp && fp.catch) fp.catch(() => {}); }
    const p = vid.play();
    if (p && p.catch) p.catch(() => {
      /* only restore the gate if the picture never started (audio unlock still needed) */
      if (vid.paused && vid.currentTime < 0.05) {
        play.started = false;
        const gate = document.getElementById("intro-gate");
        if (gate) { gate.hidden = false; gate.classList.remove("off"); gate.removeAttribute("aria-hidden"); gate.style.display = ""; }
        requestAnimationFrame(placeStartBtn);
      }
    });
  }

  function build() {
    const ES = es();
    const ov = document.createElement("div");
    ov.id = "intro-ov";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-label", ES ? "Introducción de HVAC Ready" : "HVAC Ready intro");
    ov.innerHTML = `<video id="intro-vid" playsinline webkit-playsinline preload="auto" poster="${POSTER}" src="${SRC}" muted></video>
      <div id="intro-logo" aria-hidden="true">
        <img id="intro-logo-blank" src="img/intro-emblem-blank.webp" alt="" draggable="false">
        <img id="intro-logo-hot" src="img/intro-emblem-hot.webp" alt="" draggable="false">
        <img id="intro-logo-cooling" src="img/intro-emblem-cooling.webp" alt="" draggable="false">
        <img id="intro-logo-brass" src="img/intro-emblem-brass.webp" alt="" draggable="false">
        <img id="intro-logo-type" src="img/intro-emblem.webp" alt="" draggable="false">
      </div>
      <video id="intro-fx" playsinline webkit-playsinline preload="auto" src="video/intro-fx.mp4" muted></video>
      <div id="intro-gate">
        <button type="button" class="intro-start" id="intro-start">${ES ? "Toca para empezar" : "Tap to start"}</button>
      </div>`;
    document.body.appendChild(ov);
    const splash = document.getElementById("splash");
    if (splash) splash.style.visibility = "hidden";
    hookFrame();
    const paint = () => { frameIntro(); requestAnimationFrame(placeStartBtn); };
    requestAnimationFrame(() => { paint(); requestAnimationFrame(paint); });
    ["intro-logo-blank", "intro-logo-hot", "intro-logo-cooling", "intro-logo-brass", "intro-logo-type"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("load", paint, { once: true });
    });

    const vid = ov.querySelector("#intro-vid");
    if (vid) vid.muted = true;
    const fx0 = ov.querySelector("#intro-fx"); if (fx0) fx0.muted = true;
    try { Sound.preloadIntroStem && Sound.preloadIntroStem(); } catch (e) {}

    const start = ev => { if (ev && ev.preventDefault && ev.type === "keydown") ev.preventDefault(); play(); };
    /* Whole screen is tappable, not just the pill. pointerdown keeps the
       HTMLAudio play() inside the iOS user-gesture window. */
    ov.addEventListener("pointerdown", start);
    ov.addEventListener("click", start);
    document.getElementById("intro-start").addEventListener("click", ev => { ev.stopPropagation(); play(); });
    ov.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") start(ev); });
    const maybeEnd = () => {
      try {
        if (vid.ended) return finish();
        const d = vid.duration;
        if (d && isFinite(d) && d > 0 && vid.currentTime >= d - 0.08) finish();
      } catch (e) {}
    };
    vid.addEventListener("ended", finish);
    vid.addEventListener("error", () => { if (play.started) finish(); });
    vid.addEventListener("timeupdate", maybeEnd);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
