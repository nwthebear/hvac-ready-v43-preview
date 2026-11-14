/* Launch trailer: plays on every app open. Tap to start unlocks audio on iOS.
   No skip / tap-to-skip — the trailer is short. No menu music during the intro
   (SFX only). The menu track starts exactly once when the first screen appears,
   with a smooth fade-in to SOFT. No tagline. */
(function () {
  const SRC = "video/intro.mp4", POSTER = "video/intro-poster.jpg", SOFT = 0.65;

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
    const vv = window.visualViewport;
    const sat = cssPx("--sat"), sab = cssPx("--sab"), sal = cssPx("--sal"), sar = cssPx("--sar");
    const top = (vv ? vv.offsetTop : 0) + sat;
    const left = (vv ? vv.offsetLeft : 0) + sal;
    const w = (vv ? vv.width : window.innerWidth) - sal - sar;
    const h = (vv ? vv.height : window.innerHeight) - sat - sab;
    el.style.position = "fixed";
    el.style.top = top + "px";
    el.style.left = left + "px";
    el.style.width = Math.max(0, w) + "px";
    el.style.height = Math.max(0, h) + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.margin = "0";
    el.style.boxSizing = "border-box";
  }
  function frameIntro() {
    applyVisibleFrame(document.getElementById("intro-ov"));
    applyVisibleFrame(document.getElementById("splash"));
  }
  function hookFrame() {
    frameIntro();
    const vv = window.visualViewport;
    if (hookFrame.on) return; hookFrame.on = true;
    window.addEventListener("resize", frameIntro);
    if (vv) {
      vv.addEventListener("resize", frameIntro);
      vv.addEventListener("scroll", frameIntro);
    }
  }
  function unhookFrame() {
    window.removeEventListener("resize", frameIntro);
    const vv = window.visualViewport;
    if (vv) {
      vv.removeEventListener("resize", frameIntro);
      vv.removeEventListener("scroll", frameIntro);
    }
  }

  try { if (window.Sound && Sound.deferMusic) Sound.deferMusic(true); } catch (e) {}

  const es = () => { try { return JSON.parse(localStorage.getItem("hvac.state.v1") || "{}").lang === "es"; } catch (e) { return false; } };

  function finish() {
    if (finish.done) return; finish.done = true;
    const ov = document.getElementById("intro-ov"), vid = document.getElementById("intro-vid");
    try { if (vid) { vid.pause(); vid.removeAttribute("src"); vid.load(); } } catch (e) {}
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

  function cueIntroSfx(vid) {
    const cues = [[1.45, "splash-impact", 1.0], [2.05, "splash-drill", 0.92], [3.20, "splash-torch", 0.88]];
    const fired = new Set();
    const tick = () => {
      if (finish.done || !vid) return;
      const t = vid.currentTime || 0;
      cues.forEach((c, i) => {
        if (!fired.has(i) && t >= c[0]) {
          fired.add(i);
          try { Sound.playSplash && Sound.playSplash(c[1], { gain: c[2] }); } catch (e) {}
        }
      });
      if (fired.size < cues.length) requestAnimationFrame(tick);
    };
    vid.addEventListener("timeupdate", tick);
    requestAnimationFrame(tick);
  }

  function play() {
    const vid = document.getElementById("intro-vid");
    hideGate(); /* hide immediately — do not wait on play() */
    try {
      Sound.unlock && Sound.unlock();
      Sound.deferMusic && Sound.deferMusic(true);
      Sound.preloadSplash && Sound.preloadSplash();
    } catch (e) {}
    if (!vid) return finish();
    vid.muted = true; /* baked soundtrack stays off; SFX play on their own cues */
    const p = vid.play();
    cueIntroSfx(vid);
    if (p && p.catch) p.catch(() => {
      /* only restore the gate if the picture never started (audio unlock still needed) */
      if (vid.paused && vid.currentTime < 0.05) {
        const gate = document.getElementById("intro-gate");
        if (gate) { gate.hidden = false; gate.classList.remove("off"); gate.removeAttribute("aria-hidden"); gate.style.display = ""; }
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
        <div class="intro-card">
          <img src="img/logo.png" width="96" height="96" alt="">
          <b>HVAC Ready</b>
          <button type="button" class="intro-start" id="intro-start">${ES ? "Toca para empezar" : "Tap to start"}</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    const splash = document.getElementById("splash");
    if (splash) splash.style.visibility = "hidden";
    hookFrame();

    const vid = ov.querySelector("#intro-vid");
    if (vid) vid.muted = true;
    document.getElementById("intro-start").addEventListener("click", ev => { ev.stopPropagation(); play(); });
    vid.addEventListener("ended", finish);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
