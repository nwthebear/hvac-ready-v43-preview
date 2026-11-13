/* Analog manifold gauge faces (original design, not a copy of any brand).
   Outer psig scale (low: 30 inHg vacuum to 350 psig; high: 0 to 800 psig) plus 3 colored saturation-temperature rings (°F)
   computed from window.PT_REF (CoolProp; R-454B from Chemours). Low side rings use DEW, high side rings use BUBBLE.
   App.Gauge.mount(el, { side, value, required }) -> { set(psig), destroy() }. Tap a dial to zoom (pinch / wheel / double-tap). */
(function () {
  const A = window.App, PT = window.PT_REF, TEMPS = PT.meta.temps;
  const L = (en, es) => (A.S.lang === "es" ? es : en);
  const DATA = Object.assign({}, PT.data, Object.fromEntries(Object.entries(PT.extra || {}).map(([k, v]) => [k, { bubble: v.bubble, dew: v.dew }])));
  const ALL = ["R-410A", "R-22", "R-454B", "R-32", "R-134a", "R-404A"].filter(r => DATA[r]);
  const COLOR = { "R-410A": "#D9578A", "R-22": "#2E9E4F", "R-454B": "#7E57C2", "R-32": "#0F9E96", "R-134a": "#4FA3D9", "R-404A": "#E07B1F" };
  const DEF = ["R-410A", "R-22", "R-454B"];
  const SIDE = {
    low: { max: 350, vac: true, a0: -225, a1: 45, vacDeg: 24, major: 50, mid: 10, minor: 5, body: ["#2C6CC4", "#163E78"], name: () => L("LOW", "BAJA"), lbl: 10 },
    high: { max: 800, vac: false, a0: -225, a1: 45, vacDeg: 0, major: 100, mid: 50, minor: 10, body: ["#C8372D", "#7A1A14"], name: () => L("HIGH", "ALTA"), lbl: 20 }
  };
  /* psig -> dial angle (deg, SVG: 0 = 3 o'clock, clockwise) */
  const ang = (side, p) => { const s = SIDE[side], z = s.a0 + s.vacDeg, span = s.a1 - z;
    if (p < 0) { const inHg = Math.min(30, -p * 2.036); return z - inHg / 30 * s.vacDeg; }
    return z + Math.min(p, s.max * 1.03) / s.max * span; };
  const pol = (a, r) => [Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r];
  const arc = (a0, a1, r) => { const [x0, y0] = pol(a0, r), [x1, y1] = pol(a1, r); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
  const line = (a, r0, r1, cls) => { const [x0, y0] = pol(a, r0), [x1, y1] = pol(a, r1); return `<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}"${cls ? ` class="${cls}"` : ""}/>`; };
  const txt = (a, r, t, cls) => { const [x, y] = pol(a, r); return `<text x="${x.toFixed(1)}" y="${(y + 2.6).toFixed(1)}" class="${cls}">${t}</text>`; };
  const kindOf = side => side === "low" ? "dew" : "bubble";
  /* face selection: saved list (max 3), the required refrigerant always shown */
  const saved = () => { const f = (A.S.settings.gaugeFace || DEF).filter(r => DATA[r]).slice(0, 3); return f.length ? f : DEF.slice(); };
  const faceFor = req => { const f = saved(); if (req && DATA[req] && !f.includes(req)) f[2] = req; return f; };

  let gid = 0;
  function svg(side, face, big) {
    const s = SIDE[side], id = "mg" + (++gid), z = s.a0 + s.vacDeg; let o = "";
    o += `<defs><radialGradient id="${id}b" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="${s.body[0]}"/><stop offset="1" stop-color="${s.body[1]}"/></radialGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FAFAFA"/><stop offset=".22" stop-color="#9AA0A6"/><stop offset=".45" stop-color="#F2F4F5"/><stop offset=".7" stop-color="#5E646B"/><stop offset="1" stop-color="#D8DCDF"/></linearGradient>
      <radialGradient id="${id}f" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#F6F1E4"/><stop offset=".85" stop-color="#E9E1CD"/><stop offset="1" stop-color="#CFC4A8"/></radialGradient>
      <linearGradient id="${id}g" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <radialGradient id="${id}h" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#9aa0a6"/><stop offset="1" stop-color="#3d4247"/></radialGradient></defs>`;
    o += `<circle r="128" fill="url(#${id}b)"/><circle r="127" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/><circle r="120.5" fill="none" stroke="url(#${id}c)" stroke-width="9"/>
      <circle r="116" fill="url(#${id}f)"/><circle r="116" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>`;
    /* psig scale */
    let t = "";
    for (let p = 0; p <= s.max; p += s.minor) { const a = ang(side, p), maj = p % s.major === 0, mid = p % s.mid === 0;
      t += line(a, maj ? 99 : mid ? 104 : 107, 113, maj ? "mg-tk maj" : mid ? "mg-tk mid" : "mg-tk"); if (maj) t += txt(a, 89, p, "mg-num"); }
    if (s.vac) { for (let v = 0; v <= 30; v += 5) { const a = z - v / 30 * s.vacDeg; t += line(a, v % 10 ? 106 : 101, 113, "mg-tk vac"); if (v && v % 10 === 0) t += txt(a, 91, v, "mg-num vac"); }
      t += `<path d="${arc(s.a0, z, 110)}" class="mg-vacband"/>`; const [vx, vy] = pol(s.a0 + 3, 74); t += `<text x="${vx.toFixed(1)}" y="${(vy + 14).toFixed(1)}" class="mg-unit vac">inHg</text>`; }
    t += `<path d="${arc(s.a0 - 1, s.a1 + 1, 113)}" class="mg-rim"/>`;
    o += `<g class="mg-scale">${t}</g>`;
    /* refrigerant rings */
    const k = kindOf(side);
    face.forEach((ref, i) => { const r = 77 - i * 14.5, d = DATA[ref][k], col = COLOR[ref]; let g = "", lastTick = -999, lastLbl = -999, a0 = null, a1 = null;
      const minLbl = 15 / r * 57.3, minTick = 2.2 / r * 57.3;
      TEMPS.forEach((T, j) => { const p = d[j]; if (p == null || p < -14.6 || p > s.max) return; const a = ang(side, p); if (a0 == null) a0 = a; a1 = a;
        const lab = T % s.lbl === 0 && a - lastLbl >= minLbl;
        if (a - lastTick >= minTick || lab) { g += line(a, r + 6.2, lab ? r - 1 : r + 2.5, "mg-rt"); lastTick = a; }
        if (lab) { g += txt(a, r - 3, T, "mg-rn"); lastLbl = a; } });
      if (a0 == null) return;
      o += `<g class="mg-ring" data-ref="${ref}" style="--rc:${col}"><path d="${arc(a0 - .5, a1 + .5, r + 1)}" class="mg-band" style="stroke-width:12.5"/><path d="${arc(a0 - .5, a1 + .5, r + 7.2)}" class="mg-edge"/>${g}
        <text x="0" y="${(r + 2.8).toFixed(1)}" class="mg-rname">${ref}<tspan class="mg-rk"> ${side === "low" ? "DEW" : "BUB"}</tspan></text></g>`; });
    /* labels, screw, needle, glass */
    o += `<text x="0" y="-26" class="mg-side">${s.name()}</text><text x="0" y="-16" class="mg-unit">PSIG · °F</text>
      <g class="mg-screw" transform="translate(0 25)"><circle r="5.2" fill="url(#${id}h)" stroke="#33373b" stroke-width=".7"/><path d="M-3.4 0H3.4" stroke="#2b2f33" stroke-width="1.3" transform="rotate(28)"/></g>
      <g class="mg-needle" style="transform:rotate(${ang(side, 0) + 90}deg)"><g class="mg-flut"><path d="M-2.6 16L-1 -84L0 -112L1 -84L2.6 16z" class="mg-ptr"/><path d="M-1 -84L0 -112L1 -84L1.5 -94L-1.5 -94z" class="mg-tip"/><circle r="9.5" fill="url(#${id}h)"/><circle r="3" fill="#2b2f33"/></g></g>
      <path d="M-104 -30A108 108 0 0 1 30 -104A118 118 0 0 0 -96 -2Z" fill="url(#${id}g)" class="mg-glare"/><circle r="116" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>`;
    return `<svg class="mg-svg ${side}${big ? " big" : ""}" viewBox="-130 -130 260 260" role="img" aria-label="${s.name()} ${L("side gauge", "manómetro")}">${o}</svg>`;
  }

  const live = new Set();
  function mount(el, opts) {
    const side = opts.side || "low"; let face = faceFor(opts.required), target = opts.value || 0, x = target, v = 0, raf = 0, zoomEl = null, hl = null;
    const c = { el, side, set, destroy, refresh, highlight: r => highlight(r, true), setRequired: r => { if (opts.required === r) return; opts.required = r; refresh(); } };
    el.classList.add("mg"); el.dataset.side = side;
    function render() { el.innerHTML = `<div class="mg-dial" tabindex="0" title="${L("Tap to zoom", "Toca para ampliar")}">${svg(side, face)}</div>
        ${opts.legend === false ? "" : `<div class="mg-legend">${face.map(r => `<button class="mg-chip${hl === r ? " on" : ""}" data-ref="${r}" style="--rc:${COLOR[r]}"><i></i>${r}</button>`).join("")}<button class="mg-face" aria-label="${L("Gauge face", "Carátula")}">${L("Face", "Carátula")}</button></div>`}`;
      el.querySelector(".mg-dial").onclick = openZoom; el.querySelectorAll(".mg-chip").forEach(b => b.onclick = () => highlight(hl === b.dataset.ref ? null : b.dataset.ref));
      const fb = el.querySelector(".mg-face"); if (fb) fb.onclick = e => { e.stopPropagation(); picker(fb); }; applyHl(); paint(); }
    function applyHl() { [el, zoomEl].forEach(r => r && r.querySelectorAll(".mg-svg").forEach(s => { s.classList.toggle("hl", !!hl); s.querySelectorAll(".mg-ring").forEach(g => g.classList.toggle("on", g.dataset.ref === hl)); }));
      el.querySelectorAll(".mg-chip").forEach(b => b.classList.toggle("on", b.dataset.ref === hl)); }
    function highlight(r, quiet) { hl = r; applyHl(); if (!quiet) { window.Sound && Sound.sfx("tap"); opts.onHl && opts.onHl(r); } }
    function paint() { const a = ang(side, x) + 90; [el, zoomEl].forEach(r => r && r.querySelectorAll(".mg-needle").forEach(n => n.style.transform = `rotate(${a.toFixed(2)}deg)`)); }
    function set(p, o2 = {}) { target = p; if (o2.instant || A.reduced()) { x = p; v = 0; paint(); return; } if (!raf) { let last = performance.now(); const step = now => { const dt = Math.min(.033, (now - last) / 1000); last = now;
        v += ((target - x) * 46 - v * 9.5) * dt; x += v * dt; paint(); if (Math.abs(target - x) < .05 && Math.abs(v) < .05) { x = target; paint(); raf = 0; return; } raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); } }
    function refresh() { face = faceFor(opts.required); render(); if (zoomEl) zoomEl.querySelector(".mgz-in").innerHTML = svg(side, face, true), applyHl(), paint(); }
    function destroy() { cancelAnimationFrame(raf); live.delete(c); zoomEl && zoomEl.remove(); }
    function openZoom() { if (zoomEl) return; window.Sound && Sound.sfx("tap");
      zoomEl = document.createElement("div"); zoomEl.className = "mg-zoom"; zoomEl.innerHTML = `<div class="mgz-stage"><div class="mgz-in">${svg(side, face, true)}</div></div>
        <div class="mgz-bar"><div class="mg-legend">${face.map(r => `<button class="mg-chip" data-ref="${r}" style="--rc:${COLOR[r]}"><i></i>${r}</button>`).join("")}</div><span class="sm">${L("Pinch or double-tap to zoom", "Pellizca o toca dos veces para ampliar")}</span><button class="btn" data-x>${L("Close", "Cerrar")}</button></div>`;
      document.body.appendChild(zoomEl); applyHl(); paint();
      const inner = zoomEl.querySelector(".mgz-in"), stage = zoomEl.querySelector(".mgz-stage"); let sc = 1, tx = 0, ty = 0; const pts = new Map(); let d0 = 0, s0 = 1, lastTap = 0, pan = null;
      const apply = () => { sc = Math.max(1, Math.min(4, sc)); if (sc === 1) { tx = ty = 0; } inner.style.transform = `translate(${tx}px,${ty}px) scale(${sc})`; };
      stage.addEventListener("pointerdown", e => { stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); if (pts.size === 2) { const [a, b] = [...pts.values()]; d0 = Math.hypot(a[0] - b[0], a[1] - b[1]); s0 = sc; }
        else { const now = performance.now(); if (now - lastTap < 300) { sc = sc > 1.2 ? 1 : 2.2; apply(); } lastTap = now; pan = [e.clientX - tx, e.clientY - ty]; } });
      stage.addEventListener("pointermove", e => { if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 2) { const [a, b] = [...pts.values()]; sc = s0 * Math.hypot(a[0] - b[0], a[1] - b[1]) / (d0 || 1); apply(); } else if (pan && sc > 1) { tx = e.clientX - pan[0]; ty = e.clientY - pan[1]; apply(); } });
      const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pan = null; }; stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
      stage.addEventListener("wheel", e => { e.preventDefault(); sc *= e.deltaY < 0 ? 1.15 : 1 / 1.15; apply(); }, { passive: false });
      zoomEl.querySelectorAll(".mg-chip").forEach(b => b.onclick = () => highlight(hl === b.dataset.ref ? null : b.dataset.ref));
      zoomEl.querySelector("[data-x]").onclick = () => { zoomEl.remove(); zoomEl = null; };
      requestAnimationFrame(() => zoomEl && zoomEl.classList.add("open")); }
    live.add(c); render(); set(target, { instant: true }); return c;
  }
  /* face picker: choose up to 3 rings; shared by every dial on screen */
  function picker(anchor) { document.querySelectorAll(".mg-pick").forEach(x => x.remove()); const cur = saved();
    const p = document.createElement("div"); p.className = "mg-pick"; p.innerHTML = `<b class="sm">${L("Gauge face: pick 3 refrigerants", "Carátula: elige 3 refrigerantes")}</b><div class="mg-pick-g">${ALL.map(r => `<button class="mg-chip${cur.includes(r) ? " on" : ""}" data-ref="${r}" style="--rc:${COLOR[r]}"><i></i>${r}</button>`).join("")}</div><small class="muted">${L("Max 3, like a real gauge face. Low side rings = dew, high side = bubble.", "Máx. 3, como una carátula real. Baja = rocío, alta = burbuja.")}</small>`;
    document.body.appendChild(p); const r = anchor.getBoundingClientRect(); p.style.top = Math.min(innerHeight - 190, r.bottom + 6) + "px"; p.style.left = Math.max(8, Math.min(innerWidth - 268, r.right - 260)) + "px";
    p.querySelectorAll(".mg-chip").forEach(b => b.onclick = e => { e.stopPropagation(); let f = saved(); const ref = b.dataset.ref;
      if (f.includes(ref)) { if (f.length > 1) f = f.filter(x => x !== ref); } else { f.push(ref); if (f.length > 3) f.shift(); }
      A.S.settings.gaugeFace = f; A.save && A.save(); p.querySelectorAll(".mg-chip").forEach(x => x.classList.toggle("on", f.includes(x.dataset.ref))); window.Sound && Sound.sfx("toggle");
      live.forEach(c => document.contains(c.el) ? c.refresh() : live.delete(c)); });
    setTimeout(() => document.addEventListener("pointerdown", function off(e) { if (!p.contains(e.target)) { p.remove(); document.removeEventListener("pointerdown", off, true); } }, true), 0); }
  /* sat temp at a pressure for a ref/side (used by tests / callers) */
  const satAt = (ref, side, p) => { const d = DATA[ref][kindOf(side)]; for (let i = 1; i < d.length; i++) if (d[i] >= p) { const t = (p - d[i - 1]) / (d[i] - d[i - 1]); return TEMPS[i - 1] + t * (TEMPS[i] - TEMPS[i - 1]); } return null; };
  /* one shared legend + face button for a pair of dials (manifold) */
  function group(el, cs, required) { let hl = null; const g = { el, refresh: draw, setRequired: r => { required = r; draw(); } };
    cs.forEach(c => c.onGroup = g);
    function draw() { const face = faceFor(required); el.className = "mg-legend mg-group"; el.innerHTML = `${face.map(r => `<button class="mg-chip${hl === r ? " on" : ""}" data-ref="${r}" style="--rc:${COLOR[r]}"><i></i>${r}</button>`).join("")}<button class="mg-face">${L("Face", "Carátula")}</button>`;
      el.querySelectorAll(".mg-chip").forEach(b => b.onclick = () => { hl = hl === b.dataset.ref ? null : b.dataset.ref; cs.forEach(c => c.highlight(hl)); window.Sound && Sound.sfx("tap"); draw(); });
      el.querySelector(".mg-face").onclick = e => { e.stopPropagation(); picker(el.querySelector(".mg-face")); }; }
    live.add({ el, refresh: () => { draw(); } }); draw(); return g; }
  A.Gauge = { mount, group, svg, ang, satAt, COLOR, ALL, faceFor, DATA };
})();
