/* Polish layer: splash hand-off, lesson reading progress + reveal-on-scroll, results count-up/stars/XP,
   image skeletons. Runs after every route render (MutationObserver on #view), so views stay untouched. */
(() => {
  const A = window.App;
  const RD = () => A.reduced();
  const LESSON = ["guide", "skill", "module", "tool", "lesson", "dayone", "chp5"];
  let readBar = null, onScroll = null, io = null;

  /* ---- splash ---- */
  const splash = document.getElementById("splash");
  const hideSplash = () => { if (!splash) return; const minMs = RD() ? 0 : 650, el = performance.now();
    setTimeout(() => { splash.classList.add("out"); setTimeout(() => splash.remove(), RD() ? 0 : 400); }, Math.max(0, minMs - el)); };

  /* ---- lessons ---- */
  function lessonFx(name) {
    if (readBar) { readBar.remove(); readBar = null; } if (onScroll) { removeEventListener("scroll", onScroll); onScroll = null; } if (io) { io.disconnect(); io = null; }
    if (!LESSON.includes(name)) return;
    readBar = document.createElement("div"); readBar.className = "read-prog"; readBar.setAttribute("aria-hidden", "true"); readBar.innerHTML = "<span></span>"; document.body.appendChild(readBar);
    const sp = readBar.firstChild; let ticking = false;
    const upd = () => { ticking = false; const h = document.documentElement.scrollHeight - innerHeight; sp.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 1})`; };
    onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }; addEventListener("scroll", onScroll, { passive: true }); upd();
    lessonGauge();
    if (RD() || !("IntersectionObserver" in window)) return;
    const els = [...document.querySelectorAll("#view .page .card, #view .page figure, #view .page .diagram, #view .page .dg, #view .page details, #view .page .step")].filter(e => !e.closest(".rv") && e.getBoundingClientRect().top > innerHeight * 0.92);
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach(e => { e.classList.add("rv"); io.observe(e); });
  }

  /* lessons that talk about manifold gauges get a live dial to play with */
  function lessonGauge() { if (!A.Gauge || document.querySelector(".lesson-gauge")) return;
    const hit = [...document.querySelectorAll("#view .page p, #view .page li")].find(p => /manifold gauge|manómetros? (de|del) manifold|juego de manómetros|Manifold gauges|Manómetros/i.test(p.textContent)); if (!hit) return;
    const host = hit.closest("section, .card, details") || hit; const es = (A.S.lang === "es");
    const box = document.createElement("section"); box.className = "card ft-gauge lesson-gauge";
    box.innerHTML = `<b>${es ? "Pruébalo: lee un manómetro real" : "Try it: read a real gauge"}</b><div class="lg-dial"></div><label class="sm">${es ? "Presión de succión" : "Suction pressure"}: <b class="lg-v">118</b> psig<input type="range" min="-10" max="200" value="118" class="lg-r"></label><p class="sm" style="opacity:.8">${es ? "La aguja apunta a la psig (escala externa) y, en cada anillo de color, a la temperatura de saturación de ese refrigerante." : "The needle points at psig on the outer scale and, on each colored ring, at that refrigerant's saturation temperature."}</p>`;
    host.after(box); const g = A.Gauge.mount(box.querySelector(".lg-dial"), { side: "low", value: 0 }); g.set(118);
    const r = box.querySelector(".lg-r"), v = box.querySelector(".lg-v"); r.oninput = () => { v.textContent = r.value; g.set(+r.value); }; }

  /* ---- results ---- */
  const countUp = (el, ms) => { const to = +el.dataset.to || 0; if (RD() || !to) { el.textContent = to; return; } const t0 = performance.now();
    const f = now => { const k = Math.max(0, Math.min(1, (now - t0) / ms)); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); }; el.textContent = 0; requestAnimationFrame(f); };
  function resultsFx() {
    const page = document.querySelector("#view .quiz-end"); if (!page || page.dataset.fx) return; page.dataset.fx = 1;
    const stars = page.querySelector(".res-stars"), xp = page.querySelector(".res-xp"), cnts = [...page.querySelectorAll(".cnt")];
    const bar = xp && xp.querySelector(".xpbar span"), x0 = xp ? +xp.dataset.x0 : 0, x1 = xp ? +xp.dataset.x1 : 0, r0 = A.rank(x0), r1 = A.rank(x1);
    if (RD()) return;
    if (stars) stars.classList.add("anim"); if (bar) bar.style.width = (r0.i === r1.i ? r0.pct : r0.pct) + "%";
    cnts.forEach(c => c.textContent = 0);
    const go = () => {
      cnts.forEach(c => countUp(c, 900));
      const on = stars ? [...stars.querySelectorAll(".rs.on")] : [];
      on.forEach((s, i) => setTimeout(() => { s.classList.add("popped"); Sound.sfx("tick"); A.haptic("tap"); }, 500 + i * 260));
      const t1 = 600 + on.length * 260;
      if (!bar) return;
      const fill = (from, to, ms, done) => bar.animate([{ width: from + "%" }, { width: to + "%" }], { duration: ms, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }).onfinish = done;
      setTimeout(() => {
        if (r1.i > r0.i) fill(r0.pct, 100, 700, () => { Sound.sfx("levelup"); A.haptic("unlock"); const up = xp.querySelector(".rx-up"); if (up) up.hidden = false; bar.getAnimations().forEach(a => a.cancel()); bar.style.width = "0%"; fill(0, r1.pct, 600, () => {}); });
        else fill(r0.pct, r1.pct, 800, () => {});
      }, t1);
    };
    /* the pass celebration overlay plays first; start once it is gone */
    let clear = 0; const wait = (n = 0) => { if (!document.contains(page)) return; clear = document.querySelector(".celebrate-ov, .vic") ? 0 : clear + 1; if (clear < 3 && n < 500) return setTimeout(() => wait(n + 1), 120); go(); };
    setTimeout(wait, 520);
  }

  /* ---- image skeletons ---- */
  const skel = () => document.querySelectorAll("#view .page img").forEach(im => { if (im.complete) return; im.classList.add("skel"); const d = () => im.classList.remove("skel"); im.addEventListener("load", d, { once: true }); im.addEventListener("error", d, { once: true }); });

  const after = () => { const name = (A._route || {}).name; lessonFx(name); if (name === "quiz") resultsFx(); skel(); };
  const view = document.getElementById("view");
  new MutationObserver(() => { after(); }).observe(view, { childList: true });
  after(); hideSplash();
})();
