/* TRAINING GAMES 3-4: Braze Master (unlock Helper) and Gauge Reader (unlock after The Basement).
   Braze: pick the filler, prep, set nitrogen, hold-to-heat (tube first, then the fitting cup), feed the rod, keep N2 until cool,
   then the sectioned-joint reveal. Gauge: needles sweep in, read saturation (DEW for suction, BUBBLE for liquid on R-454B),
   build SH/SC, diagnose. Content: GAMES_DATA braze_master / gauge_reader; PT numbers from js/pt-data.js (Chemours for R-454B). */
(function () {
  const A = window.App, S = A.S, esc = A.esc, TG = A.TG, $ = s => document.querySelector(s), L = TG.L;
  const BR = TG.game("braze_master"), GR = TG.game("gauge_reader");
  const uniq = a => a.filter((x, i) => a.indexOf(x) === i), wait = ms => new Promise(r => setTimeout(r, ms));
  const fail = id => BR.failures.find(f => f.id === id);

  /* ===================== BRAZE MASTER ===================== */
  function brReviewBank() { const out = [];
    BR.joints.forEach(j => { const r = BR.fillerRules[j.rule], ok = BR.fillerCards.filter(c => c.ok.includes(j.id)), bad = BR.fillerCards.filter(c => !c.ok.includes(j.id));
      out.push(TG.mkQ(`Braze ${j.name.en.toLowerCase()}: which filler and flux?`, `Soldar ${j.name.es.toLowerCase()}: ¿qué aleación y fundente?`, [ok[0].name, ...bad.slice(0, 3).map(c => c.name)], 0, r.note || { en: `${r.joint.en}: ${r.filler.en}${r.flux ? ", with flux" : ", no flux"}.`, es: `${r.joint.es}: ${r.filler.es}${r.flux ? ", con fundente" : ", sin fundente"}.` }, r.sources, { key: `br:filler:${j.id}` })); });
    BR.failures.forEach(f => { const others = BR.failures.filter(x => x.id !== f.id).slice(0, 3);
      out.push(TG.mkQ(`Braze joint: "${f.cue.en}". Most likely cause?`, `Unión: "${f.cue.es}". ¿Causa más probable?`, [f.cause, ...others.map(o => o.cause)], 0, { en: `${f.cue.en}: ${f.cause.en}.`, es: `${f.cue.es}: ${f.cause.es}.` }, f.sources, { key: `br:fail:${f.id}` })); });
    out.push(TG.mkQ("Nitrogen while brazing: when?", "Nitrógeno al soldar: ¿cuándo?", [{ en: "Start before heating, keep it until the joint is cool", es: "Antes de calentar y hasta que enfríe" }, { en: "Only after the alloy flows", es: "Solo después de que fluya la aleación" }, { en: "Only while the torch is on", es: "Solo con el soplete encendido" }], 0, BR.nitrogen.rule, BR.nitrogen.sources, { key: "br:n2" }));
    out.push(TG.mkQ("Heating a copper joint: where does the flame go first?", "Al calentar una unión: ¿dónde va primero la llama?", [{ en: "The tube, then the fitting cup", es: "El tubo, luego la copa" }, { en: "The fitting cup only", es: "Solo la copa" }, { en: "On the rod", es: "En la varilla" }], 0, { en: BR.stepOrder.slice(4, 8).map(x => x.en).join(" → "), es: BR.stepOrder.slice(4, 8).map(x => x.es).join(" → ") }, BR.stepSources, { key: "br:heat" }));
    return out; }
  const brQ = k => brReviewBank().find(q => q.key === k);
  const failCard = (id, did, extra = {}) => { const f = fail(id); return Object.assign({ did, why: `${tx(f.cue)}. ${tx(f.cause)}.`, rule: tx(BR.nitrogen.rule), sources: f.sources, q: brQ(`br:fail:${id}`) }, extra); };
  /* copper color by temperature (°F): bright copper → oxide → dull cherry red (~1100-1300) → bright orange (overheat) */
  const STOPS = [[70, [196, 126, 62]], [500, [150, 72, 36]], [900, [110, 40, 24]], [1100, [186, 32, 28]], [1300, [230, 40, 30]], [1500, [255, 118, 30]], [1750, [255, 210, 140]]];
  const copper = T => { let i = 1; while (i < STOPS.length - 1 && T > STOPS[i][0]) i++; const [t0, c0] = STOPS[i - 1], [t1, c1] = STOPS[i], k = Math.max(0, Math.min(1, (T - t0) / (t1 - t0))); return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * k)).join(",")})`; };
  /* data additions for the filler step (Harris procedures; verified Nov 2026) */
  if (!BR.failures.find(f => f.id === "excess")) BR.failures.push(
    { id: "excess", cue: { en: "Drips and icicles inside the tube", es: "Gotas y carámbanos dentro del tubo" }, cause: { en: "Kept feeding alloy after the joint was full", es: "Siguió aplicando aleación con la unión llena" }, sources: ["harris_proc", "harris_guide"] },
    { id: "starved", cue: { en: "Starved joint: voids, partial fillet", es: "Unión incompleta: huecos, filete parcial" }, cause: { en: "Not enough alloy fed all the way around", es: "No se aplicó suficiente aleación alrededor" }, sources: ["harris_ac", "harris_guide"] });
  const GDs = window.GAMES_DATA.sources; Object.assign(GDs, {
    harris_proc: GDs.harris_proc || { title: "Harris — Procedures for Brazing Pipe and Tubing (feed alloy only at brazing temperature; stop once the joint is filled)", url: "https://www.harrisproductsgroup.com/nl-NL/Resources/Knowledge-Center/Articles/Procedures-for-Brazing-Pipe-and-Tubing", type: "manufacturer" },
    harris_ac: GDs.harris_ac || { title: "Harris — Brazing Today's Air Conditioners (heat tube, then cup; alloy follows the heat; avoid starved areas)", url: "https://www.harrisproductsgroup.com/en/Resources/Knowledge-Center/Articles/Brazing-Todays-Air-Conditioners", type: "manufacturer" } });
  { const c = BR.fillerCards.find(x => x.id === "bcup"); if (c) c.name = { en: "BCuP (phos-copper, e.g. 15% silver BCuP-5), no flux", es: "BCuP (fósforo-cobre, ej. BCuP-5 con 15% de plata), sin fundente" }; }
  /* particle layer over the braze bench (sparks, flux smoke, heat shimmer, molten beads, drips) in SVG coordinates */
  function brFx(scene) {
    const cv = document.createElement("canvas"); cv.className = "br-fx"; scene.appendChild(cv); const c = cv.getContext("2d"); let P = [], acc = {}, alive = true;
    const fit = () => { const r = scene.querySelector(".br-svg").getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); cv.width = r.width * d; cv.height = r.height * d; cv.style.width = r.width + "px"; cv.style.height = r.height + "px"; c.setTransform(d * r.width / 360, 0, 0, d * r.height / 170, 0, 0); }; fit();
    const mk = (type, x, y) => { const R = Math.random;
      if (type === "spark") return { type, x, y, vx: -60 - R() * 120, vy: (R() - .7) * 120, life: .35 + R() * .3, g: 260 };
      if (type === "smoke") return { type, x: x + (R() - .5) * 10, y, vx: (R() - .5) * 12, vy: -18 - R() * 14, life: 1.2 + R() * .8, r: 4 + R() * 4 };
      if (type === "shimmer") return { type, x: x + (R() - .5) * 40, y: y + R() * 10, vx: 0, vy: -24 - R() * 10, life: .7, r: 6 + R() * 6 };
      if (type === "bead") return { type, x, y, vx: 0, vy: 0, life: .45, r: 1.6 + R() * 1.4 };
      if (type === "glint") return { type, x, y: y + (R() - .5) * 50, vx: (R() - .5) * 60, vy: (R() - .5) * 60, life: .6 + R() * .3, r: 1.2 };
      if (type === "drip") return { type, x: x + (R() - .5) * 16, y, vx: 0, vy: 10 + R() * 30, life: 1.2, g: 140, r: 2.2 }; };
    return { emit(type, x, y, n) { if (A.reduced()) return; acc[type] = (acc[type] || 0) + n; while (acc[type] >= 1) { acc[type]--; P.push(mk(type, x, y)); } },
      burst(type, x, y, n) { for (let i = 0; i < n; i++) P.push(mk(type, x, y)); },
      tick(dt) { if (!alive) return; c.clearRect(0, 0, 360, 170); P = P.filter(p => (p.life -= dt) > 0);
        P.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; if (p.g) p.vy += p.g * dt; const a = Math.min(1, p.life * 2);
          if (p.type === "spark") { c.strokeStyle = `rgba(255,${180 + Math.random() * 60 | 0},90,${a})`; c.lineWidth = 1.2; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * .03, p.y - p.vy * .03); c.stroke(); }
          else if (p.type === "smoke") { p.r += dt * 8; c.fillStyle = `rgba(200,195,185,${a * .18})`; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill(); }
          else if (p.type === "shimmer") { c.strokeStyle = `rgba(255,220,180,${a * .12})`; c.lineWidth = 1; c.beginPath(); c.ellipse(p.x, p.y, p.r, p.r * .35, 0, 0, 7); c.stroke(); }
          else if (p.type === "bead") { c.fillStyle = `rgba(255,240,190,${a})`; c.shadowColor = "#ffd27a"; c.shadowBlur = 6; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill(); c.shadowBlur = 0; }
          else if (p.type === "glint") { c.fillStyle = `rgba(255,255,230,${a})`; c.beginPath(); c.arc(p.x, p.y, p.r * (1 + a), 0, 7); c.fill(); }
          else if (p.type === "drip") { c.fillStyle = `rgba(230,210,150,${a})`; c.beginPath(); c.ellipse(p.x, p.y, p.r, p.r * 1.8, 0, 0, 7); c.fill(); } }); },
      stop() { alive = false; cv.remove(); } };
  }
  function braze() {
    const R = new TG.Round({ id: "braze_master" }); const firstPlay = !(TG.state("braze_master").plays);
    const joints = TG.shuffle(BR.joints).slice(0, firstPlay || TG.level("braze_master") <= 2 ? 2 : 3).sort((a, b) => a.rule - b.rule); let ji = 0;
    if (TG.level("braze_master") <= 1) joints.sort((a, b) => (a.id === "cucu" ? -1 : 0) - (b.id === "cucu" ? -1 : 0));
    const hudM = $("#tgHudM"); hudM.innerHTML = `<span class="tg-prog" id="brProg"></span>`;
    const prog = () => { $("#brProg").innerHTML = joints.map((b, i) => `<i class="${i < ji ? "done" : i === ji ? "cur" : ""}"></i>`).join(""); };
    const next = () => { if (R.over) return; if (ji >= joints.length) return R.end(true); prog(); R.boardStart(); joint(joints[ji]); };
    function joint(j) {
      const st = { fail: null, tubeT: 70, fitT: 70, n2: 0, heated: false, fill: 0, scale: false };
      const rule = BR.fillerRules[j.rule]; TG.qaCur = { kind: "br", st, j, ok: BR.fillerCards.filter(c => c.ok.includes(j.id)).map(c => tx(c.name)) };
      const guided = firstPlay && ji === 0;
      R.body.innerHTML = `<div class="tg-head"><p class="tg-goal" id="brGoal">${L("Heat the tube first, then the fitting. When the metal is ready, feed the rod.", "Calienta el tubo primero, luego el accesorio. Cuando el metal esté listo, aplica la varilla.")}</p><b>${esc(tx(j.name))}</b><p class="sm muted" id="brStep"></p></div>
        <div class="br-scene" id="brS"><svg viewBox="0 0 360 170" class="br-svg" aria-hidden="true">
          <defs><linearGradient id="brShade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
          <linearGradient id="brWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2722"/><stop offset="1" stop-color="#1a1816"/></linearGradient>
          <pattern id="brPeg" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1.3" fill="#0e0d0c"/></pattern>
          <linearGradient id="brBench" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4128"/><stop offset="1" stop-color="#2e2116"/></linearGradient>
          <radialGradient id="brHeatG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF8A2A" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A2A" stop-opacity="0"/></radialGradient>
          <linearGradient id="brGlint" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
          <radialGradient id="brCone" cx=".85" cy=".5" r=".7"><stop offset="0" stop-color="#F2FBFF"/><stop offset=".5" stop-color="#7FD3FF"/><stop offset="1" stop-color="#3A8FD8" stop-opacity="0"/></radialGradient>
          <radialGradient id="brFl" cx=".5" cy=".9" r=".9"><stop offset="0" stop-color="#cfe9ff"/><stop offset=".25" stop-color="#5fb8dc"/><stop offset=".6" stop-color="#ff9a3a" stop-opacity=".85"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient></defs>
          <g class="br-bg"><rect width="360" height="170" fill="url(#brWall)"/><rect width="360" height="170" fill="url(#brPeg)"/><rect y="128" width="360" height="42" fill="url(#brBench)"/><path d="M0 128h360" stroke="#8A6A3C" stroke-width="2"/>
            <g transform="translate(40 116)"><rect x="-12" y="-46" width="24" height="12" rx="2" fill="#555" stroke="#222"/><rect x="-4" y="-34" width="8" height="46" fill="#666" stroke="#222"/><rect x="-16" y="10" width="32" height="6" rx="2" fill="#444"/></g>
            <g transform="translate(330 30)" opacity=".8"><rect x="-10" y="0" width="20" height="56" rx="8" fill="#2C5A3A" stroke="#1a2a1e"/><rect x="-6" y="-8" width="12" height="10" rx="2" fill="#888"/><text x="0" y="32" text-anchor="middle" font-size="7" font-weight="800" fill="#e9e1cf" transform="rotate(-90 0 30)">N₂</text></g>
            <ellipse class="br-heat" id="brHeat" cx="200" cy="89" rx="44" ry="26" fill="url(#brHeatG)"/></g>
          <g id="brTube"><rect x="10" y="74" width="214" height="30" rx="4" id="brTubeR"/><rect x="10" y="74" width="214" height="30" rx="4" fill="url(#brShade)"/><rect class="br-glint" x="10" y="76" width="40" height="8" rx="3" fill="url(#brGlint)"/></g>
          <g id="brFit"><path id="brFitR" d="M196 64h80a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8h-80z"/><path d="M196 64h80a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8h-80z" fill="url(#brShade)"/>${j.valve ? `<rect x="284" y="58" width="60" height="62" rx="6" class="br-valve"/><circle cx="314" cy="89" r="10" class="br-valve-d"/>` : ""}${j.id === "custeel" ? `<rect x="284" y="62" width="66" height="54" rx="20" class="br-steel"/>` : ""}</g>
          <path id="brFillet" d="M196 64v50" class="br-fillet"/><g id="brRag" class="br-rag"><path d="M290 54c10-8 30-8 46 0v70c-16 8-36 8-46 0z"/></g>
          <g id="brFlux" class="br-flux"><circle cx="200" cy="70" r="3"/><circle cx="203" cy="96" r="2.5"/><circle cx="199" cy="84" r="2"/><circle cx="204" cy="108" r="2.5"/></g>
          <g id="brTorch" class="br-torch"><path d="M0 -6h70l10 6-10 6H0z" class="br-tip"/><g id="brFlame" class="br-flame"><ellipse cx="-26" cy="0" rx="30" ry="9" fill="url(#brFl)" class="fl-out"/><ellipse cx="-8" cy="0" rx="11" ry="3.4" fill="url(#brCone)" class="fl-cone"/><g class="br-sparks"><circle cx="-50" cy="-4" r="1"/><circle cx="-46" cy="5" r=".8"/><circle cx="-56" cy="1" r=".9"/></g></g></g>
          <g id="brN2" class="br-n2"><path d="M10 82c-6 0-8 4-12 4M10 96c-6 0-8-4-12-4"/></g></svg>
          <div class="br-meter"><div class="br-band"></div><i id="brNeedleT"></i><i id="brNeedleF"></i><span class="br-lbl">${L("tube", "tubo")} / ${L("fitting", "conexión")}</span></div>
          <div class="br-hint" id="brHint"></div></div>
        <div class="br-panel" id="brP"></div>`;
      const P = $("#brP"), step = $("#brStep"), hint = $("#brHint"), tubeR = $("#brTubeR"), fitR = $("#brFitR"), torch = $("#brTorch"), flame = $("#brFlame"), nT = $("#brNeedleT"), nF = $("#brNeedleF"), flux = $("#brFlux"), fillet = $("#brFillet"), rag = $("#brRag");
      rag.style.display = "none"; torch.style.display = "none"; $("#brN2").style.opacity = 0;
      const paint = () => { tubeR.style.fill = copper(st.tubeT); fitR.style.fill = copper(st.fitT); const pos = T => Math.max(0, Math.min(100, (T - 70) / (1700 - 70) * 100)); nT.style.transform = `translateX(${pos(st.tubeT) * 2.4}px)`; nF.style.transform = `translateX(${pos(st.fitT) * 2.4}px)`;
        const heatEl = $("#brHeat"); if (heatEl) heatEl.style.opacity = Math.max(0, Math.min(1, (Math.max(st.tubeT, st.fitT) - 500) / 900)); const fx = Math.min(st.tubeT, st.fitT); flux.setAttribute("class", "br-flux " + (fx > 1100 ? "clear" : fx > 600 ? "melt" : fx > 250 ? "boil" : "")); };
      paint();
      const done = async () => { /* sectioned reveal */ step.textContent = L("Sectioned joint", "Unión cortada");
        const good = !st.fail;
        P.innerHTML = `<div class="br-cut ${good ? "good" : "bad " + st.fail}"><svg viewBox="0 0 300 90"><rect x="10" y="20" width="200" height="50" rx="4" class="cut-tube"/><rect x="10" y="32" width="200" height="26" class="cut-bore"/><path d="M170 14h110v62H170z" class="cut-fit"/><path d="M170 20h40v4h-40zM170 66h40v4h-40z" class="cut-alloy"/>${st.scale ? `<g class="cut-scale">${Array.from({ length: 14 }, (_, i) => `<circle cx="${20 + i * 14}" cy="${36 + (i % 3) * 8}" r="2.4"/>`).join("")}</g>` : ""}</svg>
          <b>${good ? L("Full fillet, clean bore", "Filete completo, interior limpio") : esc(tx(fail(st.fail).cue))}</b></div><button class="btn primary big full" id="brNext">${ji + 1 < joints.length ? L("Next joint", "Siguiente unión") : L("Finish", "Terminar")} ${ico("arrow", 18)}</button>`;
        if (good) R.hit({ pts: 200, label: L("clean fillet", "filete limpio") });
        R.boardEnd(); $("#brNext").onclick = () => { ji++; next(); }; };
      /* 1. filler */
      const pickFiller = () => { step.textContent = L("1 · Pick the filler", "1 · Elige la aleación");
        const cards = TG.shuffle(BR.fillerCards); P.innerHTML = TG.choiceGrid(cards.map(c => esc(tx(c.name))), "two");
        P.querySelectorAll(".tg-choice").forEach(b => b.onclick = async () => { const c = cards[+b.dataset.i]; P.querySelectorAll(".tg-choice").forEach(x => x.disabled = true);
          if (c.ok.includes(j.id)) { b.classList.add("right"); R.hit(); await wait(450); return prep(); }
          b.classList.add("wrong"); const failId = c.id === "bcup" && j.id === "custeel" ? "phosOnSteel" : null;
          await R.miss(failId ? failCard(failId, L(`You picked ${tx(c.name)} for ${tx(j.name).toLowerCase()}.`, `Elegiste ${tx(c.name)} para ${tx(j.name).toLowerCase()}.`), { rule: tx(rule.note || rule.filler), q: brQ(`br:filler:${j.id}`), sources: uniq([...rule.sources, ...fail(failId).sources]) })
            : { did: L(`You picked ${tx(c.name)} for ${tx(j.name).toLowerCase()}.`, `Elegiste ${tx(c.name)} para ${tx(j.name).toLowerCase()}.`), why: c.id === "solder" ? `${tx(BR.fillerRules[3].joint)}: ${tx(BR.fillerRules[3].filler)}.` : `${tx(rule.joint)}: ${tx(rule.filler)}${rule.flux ? L(", with flux.", ", con fundente.") : L(", no flux.", ", sin fundente.")}`, rule: tx(rule.note || { en: "Match filler and flux to the base metals.", es: "Elige aleación y fundente según los metales." }), sources: c.id === "solder" ? BR.fillerRules[3].sources : rule.sources, q: brQ(`br:filler:${j.id}`) });
          prep(); }); };
      /* 2. prep */
      const prep = () => { step.textContent = L("2 · Prep (tap each)", "2 · Preparación (toca cada uno)"); const items = BR.prep.filter(p => !p.valveOnly || j.valve), chk = new Set();
        P.innerHTML = `<div class="br-prep">${items.map(p => `<button class="br-chk" data-p="${p.id}"><i>${ico("check", 16)}</i>${esc(tx(p.name))}</button>`).join("")}</div><button class="btn primary big full" id="brLight">${ico("flame", 18)} ${L("Light the torch", "Prender el soplete")}</button>`;
        P.querySelectorAll(".br-chk").forEach(b => b.onclick = () => { if (chk.has(b.dataset.p)) return; chk.add(b.dataset.p); b.classList.add("on"); Sound.sfx("snap", { pitch: 0.9 + chk.size * 0.08 }); TG.buzz("tap"); if (b.dataset.p === "rag") rag.style.display = ""; R.hit({ quiet: true, pts: 50 }); });
        $("#brLight").onclick = async () => { const miss = items.find(p => !chk.has(p.id)); if (miss) { await R.miss(failCard(miss.fail, L(`You lit up before: ${tx(miss.name).toLowerCase()}.`, `Prendiste antes de: ${tx(miss.name).toLowerCase()}.`), { rule: BR.stepOrder.slice(0, 4).map(tx).join(" → ") })); items.forEach(p => { chk.add(p.id); P.querySelector(`[data-p="${p.id}"]`).classList.add("on"); }); if (j.valve) rag.style.display = ""; }
          nitrogen(); }; };
      /* 3. nitrogen flow */
      const nitrogen = () => { step.textContent = L("3 · Set nitrogen flow", "3 · Ajusta el nitrógeno"); let v = 0; const hiss = Sound.loop("n2", 0);
        R.stops.push(() => hiss.stop());
        P.innerHTML = `<div class="br-n2set"><div class="br-flow"><svg viewBox="0 0 120 70"><path d="M10 64a50 50 0 0 1 100 0" class="fl-arc"/><path d="M${10 + 100 * 2 / 10} 64a50 50 0 0 1 0 0" /><path class="fl-band" d="M30.9 34.6A50 50 0 0 1 44.6 22.8"/><line x1="60" y1="64" x2="60" y2="20" id="brFlowN" class="fl-n"/></svg><b id="brFlowV">0.0</b><small>CFH</small></div>
          <input type="range" min="0" max="10" step="0.5" value="0" id="brFlowR" class="sp-range" style="--v:0%" aria-label="CFH"><p class="sm muted">${esc(tx(BR.n2Band.note))}</p></div><button class="btn primary big full" id="brN2Go">${ico("check", 18)} ${L("Lock flow", "Fijar flujo")}</button>`;
        const rng = $("#brFlowR"), nd = $("#brFlowN"), vv = $("#brFlowV");
        const upd = () => { v = +rng.value; rng.style.setProperty("--v", v * 10 + "%"); vv.textContent = v.toFixed(1); nd.style.transform = `rotate(${-90 + v * 18}deg)`; hiss.set(v / 6); $("#brN2").style.opacity = Math.min(1, v / 3); vv.classList.toggle("ok", v >= BR.n2Band.min && v <= BR.n2Band.max); };
        rng.oninput = upd; upd();
        $("#brN2Go").onclick = async () => { st.n2 = v; hiss.set(Math.min(v, 3) / 8);
          if (v >= BR.n2Band.min && v <= BR.n2Band.max) { R.hit({ label: "N₂" }); return heat(hiss); }
          const id = v > BR.n2Band.max ? "tooMuchN2" : "noN2";
          await R.miss(failCard(id, L(`You set ${v.toFixed(1)} CFH.`, `Pusiste ${v.toFixed(1)} CFH.`), { why: `${tx(fail(id).cue)}. ${tx(fail(id).cause)}. ${tx(BR.nitrogen.why)}`, rule: tx(BR.nitrogen.rule) + " " + tx(BR.n2Band.note), oem: true, sources: uniq([...fail(id).sources, ...BR.nitrogen.sources]) }));
          rng.value = 2.5; upd(); st.n2 = 2.5; heat(hiss); }; };
      /* 4. hold to heat: one Hold button, flame auto-positions tube then cup. Pause on lift, never fail on pointercancel. */
      const heat = hiss => { step.textContent = L("Hold to heat the joint", "Mantén para calentar la unión");
        hint.textContent = "";
        torch.style.display = ""; Sound.sfx("ignite");
        P.innerHTML = `<div class="br-hold"><button type="button" class="btn primary big full br-heat-btn" id="brHeatBtn">${ico("flame", 18)} ${L("Hold to heat", "Mantén para calentar")}<small class="block">${L("The flame moves for you. Hold until the copper glows cherry red.", "La llama se mueve sola. Mantén hasta que el cobre se ponga rojo cereza.")}</small></button></div>`;
        const btn = $("#brHeatBtn"), scene = $("#brS");
        let holding = false, roar = null, ready = false;
        const DONE = 1180, OVER = 1780, rate = 420;
        if (guided && btn) btn.classList.add("tg-hl");
        const finishHeat = async (kind) => {
          if (st.heated) return; st.heated = true; R.onFrame = null; holding = false;
          scene && scene.classList.remove("heating"); roar && roar.stop(0.15); torch.style.display = "none";
          if (kind === "overheat") { st.fail = "overheat"; st.overheated = true; Sound.sfx("sizzle"); fillet.setAttribute("class", "br-fillet run");
            await R.miss(failCard("overheat", L("The joint went bright orange.", "La unión se puso naranja brillante."), { rule: tx(BR.temperatureCues.phosColorCue) + " " + tx(BR.temperatureCues.fluxSequence), sources: BR.temperatureCues.sources }));
            return cool(hiss); }
          R.hit({ label: L("brazing temp", "temperatura") }); feed(hiss);
        };
        const down = e => { if (st.heated) return; e.preventDefault(); holding = true;
          if (!roar) roar = Sound.loop("torch", 0.6); scene && scene.classList.add("heating"); if (btn) btn.classList.add("held");
          try { btn && btn.setPointerCapture(e.pointerId); } catch (err) {}
          if (guided && btn) btn.classList.remove("tg-hl"); R.resume("guide"); TG.buzz("tap"); };
        const up = (e, mode) => { if (!holding) return; holding = false;
          if (btn) btn.classList.remove("held"); scene && scene.classList.remove("heating"); roar && roar.stop(0.15); roar = null;
          if (e && e.pointerId != null) { try { btn && btn.releasePointerCapture(e.pointerId); } catch (err) {} }
          /* pointercancel / lost capture only pause — they must not advance or fail the step */ };
        if (btn) {
          btn.addEventListener("pointerdown", down);
          btn.addEventListener("pointerup", up);
          btn.addEventListener("pointercancel", e => up(e, "pause"));
          btn.addEventListener("lostpointercapture", e => up(e, "pause"));
        }
        const upDoc = e => { if (holding) up(e, "up"); };
        document.addEventListener("pointerup", upDoc);
        R.stops.push(() => { document.removeEventListener("pointerup", upDoc); roar && roar.stop(); });
        /* failsafe: if the hold gesture never completes, auto-advance once the joint is close, else offer a way forward */
        const heatBail = setTimeout(() => { if (st.heated) return;
          if (Math.min(st.tubeT, st.fitT) >= 900) finishHeat("ok");
          else if (btn) { btn.insertAdjacentHTML("afterend", `<button type="button" class="btn full" id="brHeatGo">${L("Continue", "Seguir")}</button>`);
            const go = $("#brHeatGo"); if (go) go.onclick = () => { st.tubeT = st.fitT = Math.max(st.tubeT, DONE); paint(); finishHeat("ok"); }; }
        }, 22000);
        R.stops.push(() => clearTimeout(heatBail));
        R.onFrame = dt => { if (st.heated) return;
          const k = Math.min(1, (Math.max(st.tubeT, st.fitT) - 70) / 1200);
          const fx = 140 + k * 72;
          torch.setAttribute("transform", `translate(${fx + 26} 89) rotate(${holding ? -8 : 0})`);
          flame.style.opacity = holding ? 1 : 0.16;
          if (holding) {
            if (st.tubeT < 1150) { st.tubeT += rate * dt; st.fitT += rate * 0.4 * dt; }
            else { st.fitT += rate * 0.95 * dt; st.tubeT += rate * 0.28 * dt; }
            roar && roar.set(0.45 + 0.55 * k);
          } else {
            st.tubeT = Math.max(70, st.tubeT - (st.tubeT - 70) * 0.025 * dt);
            st.fitT = Math.max(70, st.fitT - (st.fitT - 70) * 0.025 * dt);
          }
          paint();
          if (Math.max(st.tubeT, st.fitT) > OVER) return finishHeat("overheat");
          if (Math.min(st.tubeT, st.fitT) >= DONE) { ready = true; return finishHeat("ok"); } };
      };
      /* 5. feed the rod: hold to feed, release pauses, auto-finishes when the joint is full. */
      const feed = hiss => { step.textContent = L("Hold to feed the rod", "Mantén para aplicar la varilla");
        const filler = tx((BR.fillerCards.find(c => c.ok.includes(j.id)) || BR.fillerCards[0]).name);
        hint.textContent = "";
        torch.style.display = ""; const scene = $("#brS"), FX = brFx(scene); R.stops.push(() => FX.stop());
        const svg = scene.querySelector(".br-svg");
        svg.insertAdjacentHTML("beforeend", `<g id="brRod" class="br-rod"><rect x="-3" y="-120" width="6" height="120" rx="3"/><circle class="br-rod-tip" cx="0" cy="0" r="3.5"/><g id="brBall" class="br-ball"></g></g><ellipse id="brCap" class="br-cap" cx="196" cy="89" rx="6" ry="27"/>`);
        const rod = $("#brRod"), ball = $("#brBall"), cap = $("#brCap");
        P.innerHTML = `<div class="br-feed"><div class="br-feed-meter"><div class="br-feed-band"></div><i id="brFill"></i><span>${L("filler in the joint", "aleación en la unión")}</span></div>
          <button type="button" class="btn primary big full br-feed-btn" id="brFeed">${ico("hand", 18)} ${L("Hold to feed rod", "Mantén para aplicar")}<small class="block">${esc(filler)}</small></button></div>`;
        const fillEl = $("#brFill"), btn = $("#brFeed"), roar = Sound.loop("torch", 0.5); R.stops.push(() => roar.stop());
        if (guided && btn) { btn.classList.add("tg-hl"); btn.addEventListener("pointerdown", () => btn.classList.remove("tg-hl"), { once: true }); }
        let T = Math.max(1100, Math.min(st.tubeT, st.fitT)), held = false, endT = false, sweep = 0, sizzT = 0, rodLen = 120;
        const end = async (kind, extra) => { if (endT) return; endT = true; held = false; R.onFrame = null; roar.stop(0.2); torch.style.display = "none"; if (btn) btn.disabled = true;
          if (kind === "ok") { fillet.setAttribute("class", "br-fillet done"); if (cap) cap.classList.add("done"); FX.burst("glint", 196, 89, 18); if (scene) { const sp = document.createElement("div"); sp.className = "br-sparkle"; scene.appendChild(sp); }
            Sound.sfx("flow"); Sound.sfx("correct", { pitch: 1.12 }); TG.buzz("correct"); R.hit({ pts: 180, label: L("capillary flow", "flujo capilar") }); await wait(500); return cool(hiss); }
          st.fail = kind; await R.miss(failCard(kind, extra.did, { rule: tx(BR.temperatureCues.phosColorCue) + " " + L("Feed only after both parts are at temperature; stop once the joint is filled.", "Aplica solo con ambas piezas a temperatura; detente cuando la unión esté llena."), sources: uniq([...fail(kind).sources, "harris_proc"]) }));
          cool(hiss); };
        const down = e => { e.preventDefault(); if (endT || held) return; held = true; if (btn) btn.classList.add("held"); TG.buzz("tap"); Sound.sfx("tick");
          try { btn && btn.setPointerCapture(e.pointerId); } catch (err) {} };
        const up = (e, mode) => { if (!held || endT) return; held = false; if (btn) btn.classList.remove("held");
          if (e && e.pointerId != null) { try { btn && btn.releasePointerCapture(e.pointerId); } catch (err) {} }
          /* A real lift after a nearly full joint counts as success; early lift only pauses so iOS pointercancel can't starve the joint. */
          if (mode !== "pause" && st.fill >= 0.72) end("ok"); };
        if (btn) {
          btn.addEventListener("pointerdown", down);
          btn.addEventListener("pointerup", e => up(e, "up"));
          btn.addEventListener("pointercancel", e => up(e, "pause"));
          btn.addEventListener("lostpointercapture", e => up(e, "pause"));
        }
        const upDoc = e => { if (held) up(e, "up"); };
        document.addEventListener("pointerup", upDoc);
        const kd = e => { if (e.code === "Space" && !e.repeat) down(e); }, ku = e => { if (e.code === "Space") up(e, "up"); };
        document.addEventListener("keydown", kd); document.addEventListener("keyup", ku);
        R.stops.push(() => { document.removeEventListener("keydown", kd); document.removeEventListener("keyup", ku); document.removeEventListener("pointerup", upDoc); });
        const feedBail = setTimeout(() => { if (endT) return;
          if (st.fill >= 0.55) end("ok");
          else if (btn) { btn.insertAdjacentHTML("afterend", `<button type="button" class="btn full" id="brFeedGo">${L("Continue", "Seguir")}</button>`);
            const go = $("#brFeedGo"); if (go) go.onclick = () => { st.fill = 1; end("ok"); }; }
        }, 22000);
        R.stops.push(() => clearTimeout(feedBail));
        R.onFrame = dt => { if (endT) return; sweep += dt * 6; const fxp = 210 + Math.sin(sweep) * 10;
          torch.setAttribute("transform", `translate(${fxp + 26} 89) rotate(-8)`); flame.style.opacity = 1;
          /* keep the joint in the feed window while they work; no hidden 300° drop */
          if (T < 1100) T += 180 * dt; else if (T < 1400) T += (held ? 8 : 20) * dt;
          st.tubeT = st.fitT = T; paint(); roar.set(0.55 + 0.25 * Math.sin(sweep * 0.5) ** 2);
          FX.emit("shimmer", fxp, 70, dt * 10); if (T > 1050) FX.emit("spark", fxp - 30, 89, dt * 14);
          if (T > 1780) return end("overheat", { did: L("You waited too long: the joint passed bright orange before you fed the rod.", "Esperaste demasiado: la unión pasó a naranja brillante antes de aplicar.") });
          const touch = held ? 1 : 0; rod.setAttribute("transform", `translate(196 ${62 - (1 - touch) * 26}) rotate(18)`);
          if (held) { st.fill += dt * 0.55; rodLen = Math.max(30, 120 - st.fill * 70); const rr = rod.querySelector("rect"); if (rr) { rr.setAttribute("y", -rodLen); rr.setAttribute("height", rodLen); }
            if (fillEl) fillEl.style.transform = `scaleX(${Math.min(1.4, st.fill) / 1.4})`;
            fillet.setAttribute("class", "br-fillet feeding"); fillet.style.strokeDashoffset = 50 * (1 - Math.min(1, st.fill));
            if (cap) { cap.style.opacity = Math.min(1, st.fill); cap.setAttribute("rx", 4 + Math.min(1, st.fill) * 5); }
            FX.emit("bead", 196, 72 + Math.random() * 34, dt * 30); FX.emit("smoke", 200, 64, dt * 6);
            sizzT -= dt; if (sizzT <= 0) { Sound.sfx("sizzle", { pitch: 0.9 + Math.random() * 0.2, vol: 0.5 }); sizzT = 0.32 + Math.random() * 0.2; }
            if (st.fill >= 1) { FX.burst("glint", 196, 89, 14); end("ok"); } }
          FX.tick(dt); };
      };
      /* 6. keep N2 until cool */
      const cool = hiss => { step.textContent = L("Keep N₂ on while it cools", "Mantén N₂ mientras enfría"); hint.textContent = "";
        const t0 = performance.now(), need = 1800; P.innerHTML = `<div class="br-cool"><div class="br-fillbar cool"><i id="brCool"></i></div><p class="sm muted center">${L("Nitrogen stays on until the joint is cool.", "El nitrógeno sigue hasta que la unión enfríe.")}</p></div>`;
        const bar = $("#brCool");
        const coolBail = setTimeout(() => { if (!st || st._cooled) return; st._cooled = true; R.onFrame = null; hiss && hiss.stop && hiss.stop(0.3); if (!st.fail) R.hit({ quiet: true, pts: 50, label: "N₂" }); done(); }, 4000);
        R.stops.push(() => clearTimeout(coolBail));
        R.onFrame = () => { const k = Math.min(1, (performance.now() - t0) / need); if (bar) bar.style.transform = `scaleX(${k})`; st.tubeT = 70 + (Math.max(st.tubeT, 600) - 70) * (1 - k) * 0.97 + 0.03; st.fitT = st.tubeT; paint(); if (k >= 1) { if (st._cooled) return; st._cooled = true; R.onFrame = null; hiss && hiss.stop && hiss.stop(0.3); if (!st.fail) R.hit({ quiet: true, pts: 50, label: "N₂" }); done(); } }; };
      const startHeat = () => {
        const hiss = Sound.loop("n2", 0);
        st.n2 = 2.5; hiss.set(2.5 / 8); const n2el = $("#brN2"); if (n2el) n2el.style.opacity = 1;
        const lamp = document.createElement("div"); lamp.className = "tg-n2lamp"; lamp.innerHTML = `<i></i>${L("N₂ flowing", "N₂ fluyendo")}`;
        (document.getElementById("brGoal") || step).after(lamp);
        if (guided) { R.pause("guide"); }
        heat(hiss);
      };
      startHeat();
    }
    TG.intro(R, `<div class="tg-intro-art">${TG.byId.braze_master.art(84)}</div><h3>${esc(tx(BR.name))}</h3><p class="sm">${L("Heat the tube first, then the fitting. When the copper is at brazing temperature, feed the rod and stop when the fillet is full. Nitrogen is already flowing.", "Calienta el tubo primero, luego el accesorio. Cuando el cobre esté a temperatura de soldadura, aplica la varilla y suelta al llenar el filete. El nitrógeno ya está fluyendo.")}</p><p class="sm muted">${esc(tx(BR.safety[0]))}</p>`, null, next);
  }

  /* ===================== GAUGE READER ===================== */
  const PT = window.PT_REF, TEMPS = PT.meta.temps;
  const lerp = (xs, ys, x) => { for (let i = 1; i < xs.length; i++) if (x <= xs[i]) { const f = (x - xs[i - 1]) / (xs[i] - xs[i - 1]); return ys[i - 1] + f * (ys[i] - ys[i - 1]); } return ys[ys.length - 1]; };
  const tAt = (r, p, k) => lerp(PT.data[r][k], TEMPS, p);
  const DIAG = GR.diagnoses, dName = id => tx(DIAG.find(d => d.id === id).name);
  const AR = { low: "↓", high: "↑", normal: "=", "normal-high": "=↑", "low-normal": "↓=", "normal-low": "=↓", varies: "~" };
  const arrow = v => AR[v] || AR[(v || "").split(" ")[0]] || "~";
  const patRow = id => { const p = GR.patterns.find(x => x.diag === id); if (!p) return ""; return `${L("Suction", "Succión")} ${arrow(p.suction)} · ${L("Head", "Alta")} ${arrow(p.head)} · SH ${arrow(p.SH)} · SC ${arrow(p.SC)}`; };
  function grReviewBank() { const out = [];
    GR.cases.forEach(c => { const wrong = TG.shuffle ? DIAG.filter(d => d.id !== c.diag).slice(0, 3) : [];
      const h = [...c.id].reduce((a, x) => a + x.charCodeAt(0), 0), others = DIAG.filter(d => d.id !== c.diag), o = [0, 1, 2].map(i => others[(h + i * 2) % others.length]);
      out.push(TG.mkQ(`${c.refrigerant} ${c.metering}: suction ${c.suctionPsig} psig, liquid ${c.liquidPsig} psig, SH ${c.superheatF}F, SC ${c.subcoolingF}F (${c.id}). Diagnosis?`, `${c.refrigerant} ${c.metering}: succión ${c.suctionPsig} psig, líquido ${c.liquidPsig} psig, SH ${c.superheatF}F, SC ${c.subcoolingF}F (${c.id}). ¿Diagnóstico?`,
        [DIAG.find(d => d.id === c.diag).name, ...uniq(o).map(d => d.name)], 0, c.explain, c.sources, { key: `gr:${c.id}`, needsPT: true })); });
    out.push(TG.mkQ("R-454B: which saturation temperature do you use for superheat?", "R-454B: ¿qué temperatura de saturación usas para el sobrecalentamiento?", [{ en: "Dew", es: "Rocío" }, { en: "Bubble", es: "Burbuja" }, { en: "The average of both", es: "El promedio" }], 0, GR.blendNote, GR.blendSources, { key: "gr:blend", needsPT: true }));
    return out; }
  const grQ = k => grReviewBank().find(q => q.key === k);
  const gaugeSVG = (cls, max, label) => { const ticks = Array.from({ length: 11 }, (_, i) => { const a = (-225 + i * 27) * Math.PI / 180, r1 = 40, r2 = i % 5 ? 35 : 31; return `<line x1="${50 + Math.cos(a) * r1}" y1="${50 + Math.sin(a) * r1}" x2="${50 + Math.cos(a) * r2}" y2="${50 + Math.sin(a) * r2}"/>`; }).join("");
    return `<svg class="gr-gauge ${cls}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" class="gg-rim"/><circle cx="50" cy="50" r="42" class="gg-face"/><path d="M${50 + Math.cos(-225 * Math.PI / 180) * 42} ${50 + Math.sin(-225 * Math.PI / 180) * 42}A42 42 0 1 1 ${50 + Math.cos(45 * Math.PI / 180) * 42} ${50 + Math.sin(45 * Math.PI / 180) * 42}" class="gg-arc"/>
      <g class="gg-ticks">${ticks}</g><text x="50" y="72" class="gg-lbl">${label}</text><text x="50" y="80" class="gg-max">0-${max}</text><g class="gg-needle"><path d="M50 50L50 12" /><circle cx="50" cy="50" r="4"/></g></svg>`; };
  function gauge() {
    const R = new TG.Round({ id: "gauge_reader" }); const twin = c => GR.cases.find(x => x.id === (c.id[2] === "A" ? "grB" : "grA") + c.id.slice(3));
    const firstPlay = !(TG.state("gauge_reader").plays);
    const pool = GR.cases.filter(c => c.id[2] === "A"), picked = TG.draw(pool, R.id, firstPlay ? 2 : 3).map(c => Math.random() < 0.5 ? twin(c) : c); let ci = 0;
    const hudM = $("#tgHudM"); hudM.innerHTML = `<span class="tg-prog" id="grProg"></span>`;
    const prog = () => { $("#grProg").innerHTML = picked.map((b, i) => `<i class="${i < ci ? "done" : i === ci ? "cur" : ""}"></i>`).join(""); };
    const next = () => { if (R.over) return; if (ci >= picked.length) return R.end(true); prog(); R.boardStart(); one(picked[ci]); };
    function one(c0) { let c = c0, stepN = 0; TG.qaCur = { kind: "gr", get c() { return c; }, diagI: () => DIAG.findIndex(d => d.id === c.diag) }; const blend = () => PT.meta.info[c.refrigerant].glide >= 0.5;
      const guided = firstPlay && ci === 0;
      R.body.innerHTML = `<div class="gr-play"><p class="tg-goal">${L("The house is still warm. Read the gauges and pick what's wrong.", "La casa sigue caliente. Lee los manómetros y elige qué está mal.")}</p>
        <div class="gr-stage"><div class="gr-man real compact"><div class="gr-g"><div class="gr-dial" id="grDL"></div><b id="grLo"></b><small>psig</small></div><div class="gr-g"><div class="gr-dial" id="grDH"></div><b id="grHi"></b><small>psig</small></div><div class="gr-body"><span class="gr-sight"></span><div class="gr-mid"><span class="gr-ref" id="grRef"><span>${c.refrigerant}</span><small>${c.metering}</small></span></div><span class="gr-sight"></span><i class="gr-port lo"></i><i class="gr-port mid"></i><i class="gr-port hi"></i></div></div></div>
        <div class="gr-facts"><div class="gr-readout" id="grRead"><span>${L("Superheat", "Sobrecalentamiento")}<b id="grSH">—</b></span><span>${L("Subcooling", "Subenfriamiento")}<b id="grSC">—</b></span></div><button type="button" class="gr-more" id="grMore">${L("Details", "Detalles")}</button></div>
        <div class="gr-step" id="grStep"></div>
        <div class="gr-drawer" id="grDraw" hidden><div class="gr-draw-in"><div class="row between"><b id="grRefD">${c.refrigerant}</b><span class="sm muted">${c.metering}</span></div><div class="gr-tags" id="grTags"></div><div id="grLeg"></div><button type="button" class="btn sm full" id="grPT">${ico("gauge", 15)} ${L("PT Chart", "Tabla PT")}</button><button type="button" class="btn full" id="grDrawX">${L("Close", "Cerrar")}</button></div></div></div>`;
      const gLo = A.Gauge.mount($("#grDL"), { side: "low", value: 0, legend: false, required: c.refrigerant }), gHi = A.Gauge.mount($("#grDH"), { side: "high", value: 0, legend: false, required: c.refrigerant }), gLeg = A.Gauge.group($("#grLeg"), [gLo, gHi], c.refrigerant);
      R.stops.push(() => { gLo.destroy(); gHi.destroy(); });
      const needle = (sel, p) => { const g = sel === "lo" ? gLo : gHi; g.setRequired(c.refrigerant); g.set(p); }; gLeg.setRequired(c.refrigerant);
      const paint = () => { const ref = R.body.querySelector("#grRef span"); if (ref) ref.textContent = c.refrigerant; const rd = $("#grRefD"); if (rd) rd.textContent = c.refrigerant; $("#grLo").textContent = c.suctionPsig.toFixed(1); $("#grHi").textContent = c.liquidPsig.toFixed(1);
        gLeg.setRequired(c.refrigerant); requestAnimationFrame(() => { needle("lo", c.suctionPsig); needle("hi", c.liquidPsig); }); Sound.sfx("gauge");
        const shEl = $("#grSH"), scEl = $("#grSC"); if (shEl) shEl.textContent = c.superheatF + "°F"; if (scEl) scEl.textContent = c.subcoolingF + "°F";
        const ex = c.extra || {}; $("#grTags").innerHTML = `<span class="gr-tag">${ico("sun", 13)} ${esc(tx(GR.conditionsText))}</span><span class="gr-tag clamp">${L("Suction line", "Línea succión")} <b>${c.suctionLineF}°F</b></span><span class="gr-tag clamp">${L("Liquid line", "Línea líquido")} <b>${c.liquidLineF}°F</b></span>
          ${ex.ratingPlateSC ? `<span class="gr-tag">${L("Rating plate SC", "SC de placa")} <b>${ex.ratingPlateSC}°F</b></span>` : ""}${ex.chartSH ? `<span class="gr-tag">${L("Chart SH", "SH de tabla")} <b>${ex.chartSH}°F</b> ±3</span>` : ""}
          ${ex.dropAcrossDrierF ? `<span class="gr-tag warn">${L("Drop across drier", "Caída en el filtro")} <b>${ex.dropAcrossDrierF}°F</b></span>` : ""}${ex.CTOA_F ? `<span class="gr-tag warn">${L("Condensing over ambient", "Condensación sobre ambiente")} <b>${ex.CTOA_F}°F</b></span>` : ""}
          ${ex.filter ? `<span class="gr-tag warn">${L("Filter", "Filtro")}: ${L("clogged", "tapado")}</span>` : ""}${ex.offCycleStandingPsig ? `<span class="gr-tag warn">${L("Off-cycle standing", "En reposo")} <b>${ex.offCycleStandingPsig}</b> psig @ ${ex.ambientF}°F</span>` : ""}`; };
      paint();
      const openDraw = on => { const d = $("#grDraw"); if (!d) return; d.hidden = !on; d.classList.toggle("open", on); };
      $("#grMore").onclick = () => { Sound.sfx("tap"); openDraw(true); };
      $("#grDrawX").onclick = () => { Sound.sfx("tap"); openDraw(false); };
      const ptBtn = "";
      const bindPT = () => { const b = $("#grPT"); if (b) b.onclick = () => { A.ptMount && A.ptMount(c.refrigerant); A.ptOpen && A.ptOpen(); }; };
      bindPT();
      /* step 1: saturation temps */
      const satStep = async (side) => { stepN = 1; const isLo = side === "lo", want = isLo ? c.evapSatF_dew : c.condSatF_bubble, p = isLo ? c.suctionPsig : c.liquidPsig;
        const trap = blend() ? Math.round(tAt(c.refrigerant, p, isLo ? "bubble" : "dew")) : null;
        const opts = uniq([want, ...(trap != null && Math.abs(trap - want) >= 2 ? [trap] : []), want + (isLo ? 5 : 6), want - (isLo ? 4 : 5), want + 10]).slice(0, 4).sort((a, b) => a - b);
        $("#grStep").innerHTML = `<div class="row between"><b>${isLo ? L("Evaporator saturation", "Saturación del evaporador") : L("Condenser saturation", "Saturación del condensador")}${blend() ? ` <span class="chip">${isLo ? L("DEW", "ROCÍO") : L("BUBBLE", "BURBUJA")}</span>` : ""}</b>${ptBtn}</div>
          <p class="sm muted">${L(`${isLo ? "Suction" : "Liquid"} reads ${p.toFixed(1)} psig on ${c.refrigerant}.`, `${isLo ? "Succión" : "Líquido"} marca ${p.toFixed(1)} psig con ${c.refrigerant}.`)}</p>${TG.choiceGrid(opts.map(o => o + "°F"), "four")}`; bindPT();
        return new Promise(res => $("#grStep").querySelectorAll(".tg-choice").forEach(b => b.onclick = async () => { const v = opts[+b.dataset.i]; $("#grStep").querySelectorAll(".tg-choice").forEach(x => x.disabled = true);
          if (Math.abs(v - want) <= 1) { b.classList.add("right"); R.hit(); await wait(350); return res(); }
          b.classList.add("wrong"); const usedWrongCurve = trap != null && v === trap;
          await R.miss({ did: L(`You read ${v}°F.`, `Leíste ${v}°F.`), why: usedWrongCurve ? tx(GR.blendNote) + " " + tx(GR.glideNote) : L(`${p.toFixed(1)} psig on ${c.refrigerant} is about ${want}°F ${blend() ? (isLo ? "(dew)" : "(bubble)") : ""} on the PT chart.`, `${p.toFixed(1)} psig con ${c.refrigerant} son unos ${want}°F ${blend() ? (isLo ? "(rocío)" : "(burbuja)") : ""} en la tabla PT.`),
            rule: tx(GR.blendNote), sources: blend() ? GR.blendSources : ["app_pt"], q: grQ("gr:blend") }); res(); })); };
      /* step 2: SH / SC */
      const calcStep = async (kind) => { stepN = 2; const isSH = kind === "SH", chips = [["sl", c.suctionLineF, L("suction line", "línea succión")], ["ll", c.liquidLineF, L("liquid line", "línea líquido")], ["es", c.evapSatF_dew, L("evap sat", "sat. evap.")], ["cs", c.condSatF_bubble, L("cond sat", "sat. cond.")]];
        const want = isSH ? ["sl", "es"] : ["cs", "ll"], slot = [];
        $("#grStep").innerHTML = `<b>${isSH ? L("Superheat", "Sobrecalentamiento") : L("Subcooling", "Subenfriamiento")}</b><div class="gr-formula">${kind} = <span class="gr-slot" id="gs0">?</span> − <span class="gr-slot" id="gs1">?</span> = <span id="gsR">?</span></div>
          <div class="gr-chips">${TG.shuffle(chips).map(([k, v, n]) => `<button class="gr-chip" data-k="${k}"><b>${v}°F</b><small>${n}</small></button>`).join("")}</div>`;
        return new Promise(res => $("#grStep").querySelectorAll(".gr-chip").forEach(b => b.onclick = async () => { if (slot.length >= 2 || b.disabled) return; b.disabled = true; slot.push(b.dataset.k); const ch = chips.find(x => x[0] === b.dataset.k);
          const el = $("#gs" + (slot.length - 1)); el.textContent = ch[1] + "°"; el.classList.add("fill"); Sound.sfx("snap");
          if (slot.length < 2) return; const v0 = chips.find(x => x[0] === slot[0])[1] - chips.find(x => x[0] === slot[1])[1]; $("#gsR").textContent = v0 + "°F";
          if (slot[0] === want[0] && slot[1] === want[1]) { $("#gsR").classList.add("ok"); R.hit({ label: kind }); await wait(500); return res(); }
          $("#gsR").classList.add("bad"); await R.miss({ did: L(`You built ${kind} = ${chips.find(x => x[0] === slot[0])[2]} − ${chips.find(x => x[0] === slot[1])[2]}.`, `Armaste ${kind} = ${chips.find(x => x[0] === slot[0])[2]} − ${chips.find(x => x[0] === slot[1])[2]}.`),
            why: isSH ? GR.formulas.superheat : GR.formulas.subcooling, rule: L(`Here ${kind} = ${isSH ? c.superheatF : c.subcoolingF}°F.`, `Aquí ${kind} = ${isSH ? c.superheatF : c.subcoolingF}°F.`) + " " + tx(GR.blendNote), sources: GR.blendSources.concat(["icp_421015103"]), q: grQ("gr:blend") }); res(); })); };
      /* step 3: diagnose */
      const diagStep = () => { stepN = 3;
        const opts = TG.shuffle([DIAG.find(d => d.id === c.diag), ...TG.shuffle(DIAG.filter(d => d.id !== c.diag)).slice(0, 3)]);
        TG.qaCur = { kind: "gr", get c() { return c; }, diagI: () => opts.findIndex(d => d.id === c.diag) };
        $("#grStep").innerHTML = TG.choiceGrid(opts.map(d => esc(tx(d.name))), "two diag");
        $("#grStep").querySelectorAll(".tg-choice").forEach(b => b.onclick = async () => { TG.clearHighlights(R.body); const d = opts[+b.dataset.i]; $("#grStep").querySelectorAll(".tg-choice").forEach(x => x.disabled = true);
          if (d.id === c.diag) { b.classList.add("right"); R.hit({ pts: 200, label: L("diagnosis", "diagnóstico") }); TG.flash(R, `<b>${esc(dName(c.diag))}</b><p>${esc(tx(c.explain))}</p>`, "explain", 2600); await wait(2300); }
          else { b.classList.add("wrong"); const ri = opts.findIndex(x => x.id === c.diag); const right = R.body.querySelector(`.tg-choice[data-i="${ri}"]`); if (right) right.classList.add("right");
            await R.miss({ did: L(`You called it ${dName(d.id)}. It's ${dName(c.diag)}.`, `Dijiste ${dName(d.id)}. Es ${dName(c.diag)}.`), why: tx(c.explain), rule: patRow(c.diag) + " · " + tx(GR.targets[c.metering === "TXV" ? "TXV" : "piston"]) + (blend() ? " " + tx(GR.blendNote) : ""), oem: true, sources: c.sources, q: grQ(`gr:${c.id}`) }); }
          R.boardEnd(); if (R.combo >= 5 && R.combo % 5 === 0) R.bonus(250, L("Sharp Eye", "Buen ojo")); ci++; setTimeout(next, 500); }); };
      if (guided) { R.pause("guide"); ["grDL","grDH","grRead"].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add("tg-hl"); }); setTimeout(() => { TG.clearHighlights(R.body); const step = $("#grStep"); if (step) step.classList.add("tg-hl"); R.resume("guide"); }, 1600); }
      diagStep();
    }
    TG.intro(R, `<div class="tg-intro-art">${TG.byId.gauge_reader.art(84)}</div><h3>${esc(tx(GR.name))}</h3><p class="sm">${L("The unit is running and the house is still warm. Read the two gauges, check superheat and subcooling, and pick what's wrong. One call per case.", "El equipo está corriendo y la casa sigue caliente. Lee los dos manómetros, mira SH y SC, y elige qué está mal. Un diagnóstico por caso.")}</p><p class="sm muted">${L("Teaching cases, not one unit's data. Rating plate and OEM charts win. Only EPA 608 certified techs add refrigerant.", "Casos de enseñanza, no datos de un equipo. Manda la placa y la tabla del fabricante. Solo técnicos con EPA 608 agregan refrigerante.")}</p>`, null, next);
  }

  const art = inner => s => `<svg class="tg-art-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  TG.register({ id: "braze_master", slug: "braze", order: 2, tag: { en: "Heat, then feed the rod", es: "Calienta, luego aplica la varilla" }, run: braze, reviewBank: brReviewBank,
    art: art(`<rect x="4" y="34" width="34" height="10" rx="2"/><path d="M34 30h16v18H34z"/><path class="ac" d="M52 22l8-8M48 20c4-6 10-6 12-12"/><path class="ac2" d="M24 28c-3-4 0-8 2-10 0 3 3 4 3 7s-2 4-5 3z"/>`) });
  TG.register({ id: "gauge_reader", slug: "gauges", order: 4, tag: { en: "Read the gauges, make the call", es: "Lee los manómetros y diagnostica" }, run: gauge, reviewBank: grReviewBank,
    art: art(`<circle cx="20" cy="28" r="14"/><circle cx="44" cy="28" r="14"/><path class="ac" d="M20 28l-6-7M44 28l7-6"/><path d="M10 50h44M20 42v8M44 42v8M32 50v8"/>`) });
})();
