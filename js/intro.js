/* Launch trailer: plays on every app open. Tap to start unlocks audio on iOS.
   No skip / tap-to-skip — the trailer is short. No menu music during the intro
   (SFX only). The menu track starts exactly once when the first screen appears,
   with a smooth fade-in to SOFT. No tagline. */
(function () {
  const SRC = "video/intro.mp4", POSTER = "video/intro-poster.jpg", SOFT = 0.65;
  /* Source plate in the 720x1560 intro art (object-fit: cover, centered). */
  const ART_W = 720, ART_H = 1560, PLATE_BOTTOM = 1080;

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
  function frameIntro() {
    applyVisibleFrame(document.getElementById("intro-ov"));
    applyVisibleFrame(document.getElementById("splash"));
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

  function finish() {
    if (finish.done) return; finish.done = true;
    const ov = document.getElementById("intro-ov"), vid = document.getElementById("intro-vid");
    try { if (vid) { vid.pause(); vid.removeAttribute("src"); vid.load(); } } catch (e) {}
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
      <div id="intro-gate">
        <button type="button" class="intro-start" id="intro-start">${ES ? "Toca para empezar" : "Tap to start"}</button>
      </div>`;
    document.body.appendChild(ov);
    const splash = document.getElementById("splash");
    if (splash) splash.style.visibility = "hidden";
    hookFrame();
    requestAnimationFrame(() => { frameIntro(); requestAnimationFrame(placeStartBtn); });

    const vid = ov.querySelector("#intro-vid");
    if (vid) vid.muted = true;
    try { Sound.preloadIntroStem && Sound.preloadIntroStem(); } catch (e) {}

    const start = ev => { if (ev && ev.preventDefault && ev.type === "keydown") ev.preventDefault(); play(); };
    /* Whole screen is tappable, not just the pill. pointerdown keeps the
       HTMLAudio play() inside the iOS user-gesture window. */
    ov.addEventListener("pointerdown", start);
    ov.addEventListener("click", start);
    document.getElementById("intro-start").addEventListener("click", ev => { ev.stopPropagation(); play(); });
    ov.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") start(ev); });
    vid.addEventListener("ended", finish);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
