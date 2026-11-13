/* In-quiz PT CHART: a small tab at the bottom edge on questions that need pressure–temperature data; it slides up a
   bottom sheet with a temperature ⇄ pressure lookup (CoolProp data from pt-data.js), auto-selecting the refrigerant named
   in the question. Allowed in practice quizzes, EPA practice exams and module tests (real tests allow a PT chart).
   It never pauses the timer or leaves the question. Questions can set needsPT:true; otherwise keywords decide. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, $ = s => document.querySelector(s);
  const L = (en, es) => (S.lang === "es" ? es : en);
  const REF = window.PT_REF, TEMPS = REF.meta.temps, REFS = Object.keys(REF.data);
  /* PT-relevant wording (EN + ES), or a refrigerant name together with a pressure/temperature reading */
  const KEY = /superheat|subcool|saturat|p\/?t chart|pressure.?temperature|psig|gauge read|suction pressure|head pressure|discharge pressure|condensing (temp|pressure)|evaporat\w* (temp|pressure)|boiling point|standing pressure|charging pressure|sobrecalent|subenfri|saturaci|presi[oó]n.?temperatura/i;
  const REFNAME = /R-?(410A|454B|32|22|134a|12|502|123|404A|407C)\b/i, READING = /\d+\s*(psi|°F|ºF|degrees)|pressure|temperature|presi[oó]n|temperatura/i;
  /* Only the QUESTION decides (answers are ignored): it must ask for a chart lookup outright, or give a pressure/temperature
     reading together with a PT concept or a refrigerant name. Definitions ("What is superheat?") don't open the tab. */
  const CHART = /p\/?t chart|pressure.?temperature (chart|table|relationship)|tabla p\/?t|tabla de presi[oó]n|carta p\/?t/i, PSI = /\d+(\.\d+)?\s*(psig|psi)\b/i, DEGF = /\d+(\.\d+)?\s*(°\s?F|ºF|degrees|grados)/i;
  A.ptNeeded = q => { if (!q) return false; if (q.needsPT != null) return !!q.needsPT; const txt = [q.q.en || "", tx(q.q)].join(" "); return CHART.test(txt) || (PSI.test(txt) && (KEY.test(txt) || REFNAME.test(txt))) || (DEGF.test(txt) && REFNAME.test(txt) && KEY.test(txt)); };
  A.ptRefFor = q => { const txt = [q.q.en || tx(q.q), (q.a || []).map(a => a.en || tx(a)).join(" ")].join(" "); const m = txt.match(/R-?(410A|454B|32|22|134a)\b/i); return m ? REFS.find(r => r.toLowerCase() === ("r-" + m[1]).toLowerCase()) || "R-410A" : "R-410A"; };
  const lerp = (xs, ys, x) => { if (x <= xs[0]) return ys[0]; for (let i = 1; i < xs.length; i++) if (x <= xs[i]) { const f = (x - xs[i - 1]) / (xs[i] - xs[i - 1]); return ys[i - 1] + f * (ys[i] - ys[i - 1]); } return ys[ys.length - 1]; };
  const pAt = (r, t, k = "dew") => lerp(TEMPS, REF.data[r][k], t);
  const tAt = (r, p, k = "dew") => lerp(REF.data[r][k], TEMPS, p);
  const glide = r => (REF.meta.info[r] || {}).glide || 0;
  let st = { ref: "R-410A", mode: "t", t: 40, p: 118 };

  const body = () => { const r = st.ref, blend = glide(r) >= 0.5, info = REF.meta.info[r] || {};
    const t = st.mode === "t" ? st.t : tAt(r, st.p), pd = pAt(r, t), pb = pAt(r, t, "bubble");
    const maxP = Math.ceil(pAt(r, 130) / 10) * 10, minP = Math.floor(pAt(r, -40, "bubble"));
    const rows = [-10, -5, 0, 5, 10].map(d => Math.round(t / 5) * 5 + d).filter(x => x >= TEMPS[0] && x <= TEMPS[TEMPS.length - 1]);
    const f1 = v => (Math.round(v * 10) / 10).toFixed(1);
    return `<div class="pts-refs" role="group" aria-label="${L("Refrigerant", "Refrigerante")}">${REFS.map(x => `<button class="${x === r ? "sel" : ""}" data-ptref="${x}">${x}</button>`).join("")}</div>
      <div class="pts-kind sm muted">${esc(tx(info.kind || { en: "", es: "" }))}${info.a2l ? ` · <b class="warn">A2L</b>` : ""}</div>
      <div class="seg pts-mode"><button data-ptmode="t" class="${st.mode === "t" ? "sel" : ""}">°F → psig</button><button data-ptmode="p" class="${st.mode === "p" ? "sel" : ""}">psig → °F</button></div>
      <div class="pts-input">${st.mode === "t"
        ? `<input type="range" id="ptSl" min="-40" max="150" step="1" value="${Math.round(st.t)}" aria-label="°F"><input type="number" id="ptNum" inputmode="decimal" value="${Math.round(st.t)}" min="-40" max="150" step="1"><span>°F</span>`
        : `<input type="range" id="ptSl" min="${minP}" max="${maxP}" step="1" value="${Math.round(st.p)}" aria-label="psig"><input type="number" id="ptNum" inputmode="decimal" value="${Math.round(st.p)}" step="1"><span>psig</span>`}</div>
      <div class="pts-out">${st.mode === "t"
        ? (blend ? `<div><span class="sm muted">${L("Dew (superheat)", "Rocío (sobrecalent.)")}</span><b>${f1(pd)} <small>psig</small></b></div><div><span class="sm muted">${L("Bubble (subcooling)", "Burbuja (subenfr.)")}</span><b>${f1(pb)} <small>psig</small></b></div>` : `<div><span class="sm muted">${L("Saturation", "Saturación")}</span><b>${f1(pd)} <small>psig</small></b></div>`)
        : (blend ? `<div><span class="sm muted">${L("Dew (superheat)", "Rocío (sobrecalent.)")}</span><b>${f1(tAt(r, st.p))} <small>°F</small></b></div><div><span class="sm muted">${L("Bubble (subcooling)", "Burbuja (subenfr.)")}</span><b>${f1(tAt(r, st.p, "bubble"))} <small>°F</small></b></div>` : `<div><span class="sm muted">${L("Saturation", "Saturación")}</span><b>${f1(tAt(r, st.p))} <small>°F</small></b></div>`)}</div>
      <table class="pts-table"><thead><tr><th>°F</th>${blend ? `<th>${L("Dew", "Rocío")}</th><th>${L("Bubble", "Burbuja")}</th>` : `<th>psig</th>`}</tr></thead><tbody>${rows.map(x => `<tr class="${x === Math.round(t / 5) * 5 ? "hl" : ""}"><td>${x}</td><td>${f1(pAt(r, x))}</td>${blend ? `<td>${f1(pAt(r, x, "bubble"))}</td>` : ""}</tr>`).join("")}</tbody></table>
      <p class="sm muted pts-note">${L("psig at sea level · CoolProp; R-454B from the Chemours XL41 chart · practice aid; verify with the manufacturer's chart.", "psig a nivel del mar · CoolProp; R-454B de la tabla Chemours XL41 · ayuda de práctica; verifica con la tabla del fabricante.")}</p>`; };

  const open = () => { const sh = $("#ptSheet"); if (!sh) return; sh.classList.add("open"); $("#ptBack").classList.add("open"); sh.setAttribute("aria-hidden", "false"); Sound.sfx && Sound.sfx("tap"); };
  const close = () => { const sh = $("#ptSheet"); if (!sh) return; sh.classList.remove("open"); sh.style.transform = ""; $("#ptBack").classList.remove("open"); sh.setAttribute("aria-hidden", "true"); };
  A.ptOpen = open; A.ptClose = close;
  const paint = () => { const b = $("#ptBody"); if (!b) return; b.innerHTML = body(); bindBody(); };
  const bindBody = () => {
    document.querySelectorAll("[data-ptref]").forEach(b => b.onclick = () => { st.ref = b.dataset.ptref; paint(); });
    document.querySelectorAll("[data-ptmode]").forEach(b => b.onclick = () => { const r = st.ref; if (b.dataset.ptmode === "p" && st.mode === "t") st.p = Math.round(pAt(r, st.t)); if (b.dataset.ptmode === "t" && st.mode === "p") st.t = Math.round(tAt(r, st.p)); st.mode = b.dataset.ptmode; paint(); });
    const sl = $("#ptSl"), nu = $("#ptNum"), set = v => { v = parseFloat(v); if (isNaN(v)) return; if (st.mode === "t") st.t = Math.max(-40, Math.min(150, v)); else st.p = v; };
    if (sl) sl.oninput = () => { set(sl.value); const keep = document.activeElement === sl; paint(); if (keep) $("#ptSl").focus(); };
    if (nu) nu.onchange = () => { set(nu.value); paint(); };
  };
  /* inject on each quiz question that needs PT data */
  const inject = force => {
    document.querySelectorAll("#ptTab, #ptSheet, #ptBack").forEach(e => e.remove());
    const it = force ? null : A.quizItem && A.quizItem(); if (!force && (!it || !A.ptNeeded(it.q))) return;
    st.ref = force || A.ptRefFor(it.q);
    document.body.insertAdjacentHTML("beforeend", `<button class="pt-tab" id="ptTab" aria-controls="ptSheet">${ico("gauge", 16)} ${L("PT Chart", "Tabla PT")}</button>
      <div class="pt-back" id="ptBack"></div>
      <section class="pt-sheet" id="ptSheet" role="dialog" aria-label="${L("PT chart", "Tabla PT")}" aria-hidden="true"><div class="pts-grab" id="ptGrab"><span></span></div>
        <div class="row between pts-head"><b>${ico("gauge", 18)} ${L("PT Chart", "Tabla PT")}</b><button class="iconbtn" id="ptClose" aria-label="${L("Close", "Cerrar")}">${ico("close", 18)}</button></div><div id="ptBody"></div></section>`);
    paint();
    $("#ptTab").onclick = open; $("#ptBack").onclick = close; $("#ptClose").onclick = close;
    /* swipe down to dismiss */
    const sh = $("#ptSheet"), g = $("#ptGrab"); let y0 = null, dy = 0;
    const start = e => { y0 = (e.touches ? e.touches[0] : e).clientY; dy = 0; sh.style.transition = "none"; };
    const move = e => { if (y0 == null) return; dy = Math.max(0, (e.touches ? e.touches[0] : e).clientY - y0); sh.style.transform = `translateY(${dy}px)`; };
    const end = () => { if (y0 == null) return; y0 = null; sh.style.transition = ""; if (dy > 70) close(); else sh.style.transform = ""; };
    [g, sh.querySelector(".pts-head")].forEach(h => { h.addEventListener("touchstart", start, { passive: true }); h.addEventListener("touchmove", move, { passive: true }); h.addEventListener("touchend", end); });
  };
  /* training games (Gauge Reader) mount the same sheet on demand with a fixed refrigerant; no bottom tab */
  A.ptMount = ref => { if (!$("#ptSheet") || st.ref !== ref) { inject(ref); const tab = $("#ptTab"); if (tab) tab.remove(); } };
  const b0 = A.bind.quiz; A.bind.quiz = (...a) => { b0 && b0(...a); inject(); };
  window.addEventListener("hashchange", () => { if (!/^#\/(quiz|arcade\/gauges)/.test(location.hash)) document.querySelectorAll("#ptTab, #ptSheet, #ptBack").forEach(e => e.remove()); });
})();
