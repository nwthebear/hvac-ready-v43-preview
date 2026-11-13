/* Launch trailer: plays on every app open. Tap to start unlocks audio on iOS.
   No skip / tap-to-skip — the trailer is short. No menu music during the intro
   (SFX only). The menu track starts exactly once when the first screen appears,
   with a smooth fade-in to SOFT. No tagline. */
(function () {
  const SRC = "video/intro.mp4", POSTER = "video/intro-poster.jpg", SOFT = 0.65;
  try { if (window.Sound && Sound.deferMusic) Sound.deferMusic(true); } catch (e) {}

  const es = () => { try { return JSON.parse(localStorage.getItem("hvac.state.v1") || "{}").lang === "es"; } catch (e) { return false; } };

  function finish() {
    if (finish.done) return; finish.done = true;
    const ov = document.getElementById("intro-ov"), vid = document.getElementById("intro-vid");
    try { if (vid) { vid.pause(); vid.removeAttribute("src"); vid.load(); } } catch (e) {}
    if (ov) { ov.classList.add("out"); setTimeout(() => ov.remove(), 420); }
    const sp = document.getElementById("splash");
    if (sp) { sp.classList.add("out"); setTimeout(() => { try { sp.remove(); } catch (e) {} }, 200); }
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
    const cues = [[0.85, "splash-whoosh", 0.8], [1.25, "splash-rattle", 0.85], [2.20, "splash-impact", 0.95]];
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

    const vid = ov.querySelector("#intro-vid");
    if (vid) vid.muted = true;
    document.getElementById("intro-start").addEventListener("click", ev => { ev.stopPropagation(); play(); });
    vid.addEventListener("ended", finish);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
