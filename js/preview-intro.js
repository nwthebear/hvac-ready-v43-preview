/* Standalone HVAC Ready intro preview. Not wired into the live app launch. */
(() => {
  const gate = document.getElementById("gate");
  const intro = document.getElementById("intro");
  const mock = document.getElementById("mock");
  const tag = document.getElementById("tag");
  const canvas = document.getElementById("fx");
  const cx = canvas.getContext("2d", { alpha: true });
  const RD = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const params = new URLSearchParams(location.search);
  const capture = params.has("capture") || params.get("siPreview") === "1";
  const silent = params.has("silent") || capture;
  const T = { logo: 0, logoDone: 800, sweep: 800, riser: 250, drop: 1220, impact: 1400, fade: 2000, done: 2480 };
  const api = { setTime: null, reset: null, silent, T, playing: false };
  window.IntroPreview = api;

  let w = 0, h = 0, dpr = 1, parts = [], seed = 16807;
  let whooshOn = false, rattleOn = false, impactOn = false, riserOn = false, handed = false, finished = false, raf = 0, removeTimer = 0;

  const rnd = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
  const resetSeed = () => { seed = 16807; };
  const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
  const ease = k => 1 - Math.pow(1 - clamp01(k), 3);

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = intro.clientWidth || innerWidth; h = intro.clientHeight || innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function buildParts() {
    resetSeed(); parts = [];
    for (let i = 0; i < 90; i++) {
      const p = i / 90;
      parts.push({
        born: T.sweep + p * 180, x0: -24 - rnd() * 40, y0: h * (0.32 + rnd() * 0.28),
        vx: 7.2 * 60 + rnd() * 5.4 * 60, vy: (rnd() - 0.5) * 1.6 * 60,
        max: 240 + rnd() * 180, r: 1.2 + rnd() * 2.4,
        c: rnd() < 0.28 ? (rnd() < 0.5 ? "#9bd3ea" : "#F4FBFF") : (rnd() < 0.45 ? "#FFC23D" : (rnd() < 0.7 ? "#FF7A1A" : "#FFF3C0")),
        kind: "sweep"
      });
    }
  }
  function addImpactParts() {
    const box = tag.getBoundingClientRect(), sx = box.left + box.width / 2, sy = box.top + box.height / 2, saved = seed;
    for (let i = 0; i < 72; i++) {
      const a = rnd() * Math.PI * 2, sp = (2.2 + rnd() * 5.5) * 60;
      parts.push({
        born: T.impact, x0: sx + (rnd() - 0.5) * 36, y0: sy + 6,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.7 - (1.2 + rnd() * 2) * 60,
        max: 180 + rnd() * 200, r: 1.4 + rnd() * 3.2,
        c: rnd() < 0.3 ? "#E9E1CF" : (rnd() < 0.5 ? "#FFC23D" : "#C9B48F"),
        kind: "puff"
      });
    }
    seed = saved;
  }
  function drawAt(ms) {
    cx.clearRect(0, 0, w, h);
    for (const p of parts) {
      const age = ms - p.born; if (age < 0 || age > p.max) continue;
      const k = age / p.max, sec = age / 1000;
      const x = p.x0 + p.vx * sec, y = p.y0 + p.vy * sec + (p.kind === "puff" ? 70 : 12) * sec * sec;
      const a = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85;
      cx.globalAlpha = Math.max(0, a) * (p.kind === "sweep" ? 0.9 : 0.85);
      cx.fillStyle = p.c;
      cx.beginPath(); cx.arc(x, y, p.r * (1 - k * 0.4), 0, Math.PI * 2); cx.fill();
      if (p.kind === "sweep" && p.r > 2) {
        cx.globalAlpha *= 0.35; cx.beginPath(); cx.arc(x - p.vx * 0.02, y, p.r * 1.6, 0, Math.PI * 2); cx.fill();
      }
    }
    cx.globalAlpha = 1;
  }
  function sfx(name, gain) {
    if (api.silent) return;
    try { Sound.playSplash && Sound.playSplash(name, { gain }); } catch (e) {}
  }
  function handoff() {
    if (handed) return; handed = true;
    if (api.silent) return;
    try { Sound.resolveRiser && Sound.resolveRiser(); } catch (e) {}
    try { Sound.setMusicScale && Sound.setMusicScale(0.33); Sound.deferMusic && Sound.deferMusic(false); Sound.playMusic && Sound.playMusic("chill"); } catch (e) {}
  }
  function apply(ms) {
    const img = intro.querySelector("img"), name = intro.querySelector("b.brand");
    const settle = (el, start) => {
      if (!el) return;
      const u = clamp01((ms - start) / 800);
      let op, sc;
      if (u <= 0) { op = 0; sc = 0.86; }
      else if (u < 0.72) { const k = u / 0.72; op = k; sc = 0.86 + (1.035 - 0.86) * ease(k); }
      else { const k = (u - 0.72) / 0.28; op = 1; sc = 1.035 + (1 - 1.035) * ease(k); }
      el.style.opacity = String(op); el.style.transform = "scale(" + sc + ")";
    };
    if (!RD()) { settle(img, 0); settle(name, 80); }
    else { if (img) { img.style.opacity = "1"; img.style.transform = "none"; } if (name) { name.style.opacity = "1"; name.style.transform = "none"; } }
    if (tag) {
      const u = RD() ? 1 : clamp01((ms - T.drop) / 280);
      let op, y, sy;
      if (u <= 0) { op = 0; y = -110; sy = 1.14; }
      else if (u < 0.72) { const k = u / 0.72; op = ease(k); y = -110 * (1 - ease(k)); sy = 1.14 - 0.14 * ease(k); }
      else if (u < 0.82) { const k = (u - 0.72) / 0.1; op = 1; y = 5 * k; sy = 1 - 0.1 * k; }
      else { const k = (u - 0.82) / 0.18; op = 1; y = 5 * (1 - ease(k)); sy = 0.9 + 0.1 * ease(k); }
      tag.style.opacity = String(op); tag.style.transform = "translateY(" + y + "px) scaleY(" + sy + ")";
    }
    if (!RD() && ms >= T.impact && ms < T.impact + 280) {
      const u = (ms - T.impact) / 280;
      const sx = u < 0.18 ? 0 : u < 0.36 ? -3 : u < 0.54 ? 3 : u < 0.72 ? -1 : 0;
      const sy2 = u < 0.18 ? 5 : u < 0.36 ? -2 : u < 0.54 ? 2 : u < 0.72 ? 1 : 0;
      intro.style.transform = "translate(" + sx + "px, " + sy2 + "px)";
    } else if (ms < T.fade) intro.style.transform = "";
    if (ms >= T.fade && !RD()) {
      const k = Math.min(1, (ms - T.fade) / 400);
      intro.style.opacity = String(1 - k);
      intro.style.transform = "";
    }
    if (ms >= T.riser && !riserOn) { riserOn = true; if (!RD() && !api.silent) { try { Sound.startRiser && Sound.startRiser({ climb: (T.fade - T.riser) / 1000 }); } catch (e) {} } }
    if (ms >= T.sweep && !whooshOn) { whooshOn = true; if (!RD()) sfx("splash-whoosh", 0.8); }
    if (ms >= T.sweep && !rattleOn) { rattleOn = true; if (!RD()) { buildParts(); sfx("splash-rattle", 0.85); } }
    if (ms >= T.impact && !impactOn) {
      impactOn = true;
      if (!RD()) { addImpactParts(); sfx("splash-impact", 0.95); }
      if (!api.silent) { try { if (navigator.vibrate) navigator.vibrate(22); } catch (e) {} }
    }
    if (ms >= T.fade) handoff();
    if (!RD()) drawAt(ms);
  }
  function showMock() {
    intro.hidden = true; intro.style.opacity = ""; intro.style.transform = "";
    mock.classList.add("show");
    api.playing = false;
  }
  function finish() {
    if (finished) return; finished = true;
    cancelAnimationFrame(raf);
    handoff();
    intro.style.opacity = "0";
    clearTimeout(removeTimer);
    removeTimer = setTimeout(showMock, RD() ? 0 : 80);
  }
  function resetClock() {
    whooshOn = rattleOn = impactOn = riserOn = handed = finished = false;
    parts = []; resetSeed();
    clearTimeout(removeTimer);
    intro.style.opacity = ""; intro.style.transform = "";
    cx.clearRect(0, 0, w, h);
  }
  function play() {
    cancelAnimationFrame(raf);
    resetClock();
    mock.classList.remove("show");
    intro.hidden = false;
    if (RD()) intro.classList.add("skip-motion");
    size();
    try { Sound.deferMusic && Sound.deferMusic(true); Sound.stopMusic && Sound.stopMusic(); Sound.setMusicScale && Sound.setMusicScale(0.33); Sound.preloadSplash && Sound.preloadSplash(); } catch (e) {}
    api.playing = true;
    if (capture) return; /* renderer drives setTime */
    if (RD()) { apply(T.done); return setTimeout(finish, 1100); }
    const t0 = performance.now();
    const loop = now => {
      if (finished) return;
      const ms = now - t0;
      apply(ms);
      if (ms >= T.done) return finish();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  api.setTime = ms => { apply(ms); if (ms >= T.done && !finished) finish(); };
  api.reset = () => { cancelAnimationFrame(raf); resetClock(); size(); };
  api.play = play;

  intro.addEventListener("pointerdown", ev => {
    if (finished || intro.hidden || capture) return;
    ev.preventDefault();
    try { Sound.unlock && Sound.unlock(); } catch (e) {}
    finish();
  }, { passive: false });
  addEventListener("resize", () => { if (!intro.hidden) size(); }, { passive: true });

  document.getElementById("choices").addEventListener("click", e => {
    const b = e.target.closest(".choice"); if (!b) return;
    document.querySelectorAll(".choice").forEach(x => x.classList.toggle("sel", x === b));
    document.getElementById("next").disabled = false;
  });
  document.getElementById("next").addEventListener("click", () => { /* mock only */ });
  document.getElementById("replay").addEventListener("click", () => {
    try { Sound.unlock && Sound.unlock(); } catch (e) {}
    play();
  });

  function unlockAndGo() {
    try { Sound.unlock && Sound.unlock(); } catch (e) {}
    gate.hidden = true;
    play();
  }
  gate.addEventListener("click", unlockAndGo);
  gate.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); unlockAndGo(); } });

  if (capture) {
    gate.hidden = true;
    intro.hidden = false;
    size();
    try { Sound.deferMusic && Sound.deferMusic(true); Sound.preloadSplash && Sound.preloadSplash(); } catch (e) {}
  }
})();
