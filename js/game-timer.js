/* Shared arcade / quiz timer: performance.now countdown, big ring + number,
   smooth color stages (green/white >10s, yellow at 10, orange at 7, red+pulse at 3).
   Optional subtle tick only in the last 3 seconds (existing tick/click voice). */
(function () {
  const A = window.App;
  const lerp = (a, b, t) => a + (b - a) * t;
  const hex = h => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const rgb = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  const mix = (a, b, t) => { a = hex(a); b = hex(b); return rgb([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]); };

  const COL = { ok: "#C9E08A", numOk: "#F3F0E4", yellow: "#F5D76E", orange: "#FF9F43", red: "#FF5A4A" };

  function stageOf(left) {
    if (left > 10) return "ok";
    if (left > 7) return "yellow";
    if (left > 3) return "orange";
    return "red";
  }
  function colorFor(left) {
    if (left > 10) return { stroke: COL.ok, num: COL.numOk };
    if (left > 7) { const t = (10 - left) / 3; return { stroke: mix(COL.yellow, COL.orange, t), num: mix(COL.yellow, COL.orange, t) }; }
    if (left > 3) { const t = (7 - left) / 4; return { stroke: mix(COL.orange, COL.red, t), num: mix(COL.orange, COL.red, t) }; }
    return { stroke: COL.red, num: COL.red };
  }

  function markup(secs, cls) {
    const n = Math.max(0, Math.ceil(secs || 0));
    return `<span class="gtimer ${cls || ""}" data-stage="${stageOf(n)}" aria-label="Timer ${n} seconds">
      <svg viewBox="0 0 80 80" aria-hidden="true"><circle class="gt-bg" cx="40" cy="40" r="34"/><circle class="gt-fg" cx="40" cy="40" r="34" pathLength="100"/></svg>
      <b class="gt-num">${n}</b>
    </span>`;
  }

  function paint(el, left, total) {
    if (!el) return;
    const num = el.querySelector(".gt-num");
    const ring = el.querySelector(".gt-fg");
    const st = stageOf(left);
    const col = colorFor(left);
    el.dataset.stage = st;
    el.style.setProperty("--gt-stroke", col.stroke);
    el.style.setProperty("--gt-num", col.num);
    const t = total > 0 ? Math.max(0, Math.min(1, left / total)) : 0;
    if (ring) ring.style.strokeDashoffset = String((1 - t) * 100);
    if (num) num.textContent = String(Math.max(0, Math.ceil(left)));
  }

  function start(opts) {
    const el = typeof opts.el === "string" ? document.querySelector(opts.el) : opts.el;
    const total = opts.total;
    let left = opts.left != null ? opts.left : total;
    let last = performance.now();
    let shown = Math.ceil(left);
    let raf = 0;
    let stopped = false;
    const ticks = new Set();
    const tickLast = opts.tickLast === undefined ? 3 : opts.tickLast;
    paint(el, left, total);
    const frame = now => {
      if (stopped) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const paused = el && (el.dataset.paused === "1" || opts.paused && opts.paused());
      if (!paused) {
        left = Math.max(0, left - dt);
        if (opts.setLeft) opts.setLeft(left);
        paint(el, left, opts.totalRef ? opts.totalRef() : total);
        const s = Math.ceil(left);
        if (s !== shown) {
          shown = s;
          if (tickLast && s <= tickLast && s > 0 && !ticks.has(s)) {
            ticks.add(s);
            if (window.Sound && Sound.sfx) Sound.sfx("tick");
          }
        }
        if (left <= 0) { stopped = true; opts.onDone && opts.onDone(); return; }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return {
      get left() { return left; },
      set left(v) { left = Math.max(0, v); },
      add(s) { left = Math.max(0, left + s); },
      reset(t) { left = t == null ? total : t; shown = Math.ceil(left); ticks.clear(); last = performance.now(); paint(el, left, t == null ? total : t); },
      pause() { if (el) el.dataset.paused = "1"; },
      resume() { if (el) el.dataset.paused = "0"; last = performance.now(); },
      stop() { stopped = true; cancelAnimationFrame(raf); },
      paint() { paint(el, left, total); }
    };
  }

  const GT = { markup, paint, start, stageOf, colorFor };
  window.GameTimer = GT;
  if (A) A.GameTimer = GT;

  /* Shared hit / miss feel for the five arcade games. Uses existing spark + recorded sfx only. */
  const feel = {
    hit(el, n) { if (el && A && A.sparkAt && !(A.reduced && A.reduced())) A.sparkAt(el, n || 12); },
    miss(root) {
      const el = typeof root === "string" ? document.querySelector(root) : root;
      if (!el) return;
      el.classList.remove("tg-shake-big"); void el.offsetWidth; el.classList.add("tg-shake-big");
      setTimeout(() => el.classList.remove("tg-shake-big"), 420);
      if (A && A.reduced && A.reduced()) return;
      const flash = document.createElement("div"); flash.className = "feel-flash"; flash.setAttribute("aria-hidden", "true");
      el.appendChild(flash); setTimeout(() => flash.remove(), 320);
    },
    combo(host, n) {
      if (!host || n < 3 || (A && A.reduced && A.reduced())) return;
      host.querySelectorAll(".feel-combo").forEach(x => x.remove());
      const d = document.createElement("em"); d.className = "feel-combo"; d.textContent = "×" + n;
      host.style.position = host.style.position || "relative";
      host.appendChild(d); setTimeout(() => d.remove(), 700);
    }
  };
  if (A) A.feel = feel;
  window.GameFeel = feel;

})();
