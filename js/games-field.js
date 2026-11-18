/* TRAINING GAMES 5-8: Leak Hunter (after The Attic), Vacuum Pump Rush (Tech), Rooftop Run (after The Rooftop), Boss Rush (Old Timer).
   Content: GAMES_DATA leak_hunter / vacuum_pump_rush / rooftop_run / boss_rush (OEM manuals, OSHA, HVAC School, Trane, Goodman, Lennox). */
(function () {
  const A = window.App, S = A.S, esc = A.esc, TG = A.TG, $ = s => document.querySelector(s), L = TG.L;
  const LH = TG.game("leak_hunter"), VP = TG.game("vacuum_pump_rush"), RR = TG.game("rooftop_run"), BR = TG.game("boss_rush");
  const uniq = a => a.filter((x, i) => a.indexOf(x) === i), wait = ms => new Promise(r => setTimeout(r, ms));
  const hashN = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const bust = id => { const hudM = $("#tgHudM"); hudM.innerHTML = `<span class="tg-bust" id="tgAvB">${avatarSVG(S.avatar, 40, { mode: "bust" })}</span><span class="tg-prog" id="${id}"></span>`; $("#tgAv").remove(); $("#tgAvB").id = "tgAv"; };
  const progDots = (id, n, i) => { const el = $("#" + id); if (el) el.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k < i ? "done" : k === i ? "cur" : ""}"></i>`).join(""); };
  const ynQ = (en, es, why, sources, key) => TG.mkQ(en, es, [{ en: "No, don't", es: "No" }, { en: "Yes, do it", es: "Sí" }], 0, why, sources, { key });

  /* ===================== LEAK HUNTER ===================== */
  const M = id => LH.methods.find(m => m.id === id), N2M = M("nitrogen");
  const TOOL_ICO = { visual: `<path d="M4 12s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="12" cy="12" r="2.6"/>`, electronic: `<rect x="7" y="8" width="10" height="13" rx="2"/><path d="M12 8V3M9 13h6M9 16h6"/>`, bubbles: `<circle cx="9" cy="14" r="4"/><circle cx="16" cy="8" r="3"/><circle cx="17" cy="16" r="2"/>`, ultrasonic: `<path d="M4 12h3M8 8c2 2 2 6 0 8M12 5c4 4 4 10 0 14M16 3c5 5 5 13 0 18"/>`, uvDye: `<rect x="8" y="3" width="8" height="10" rx="2"/><path d="M12 13v8M7 18l-3 2M17 18l3 2"/>` };
  function lhReviewBank() { const out = [];
    LH.situations.forEach(si => LH.belt.filter(t => !si.ok.includes(t)).forEach(t => { const ok = si.ok.find(x => x !== "visual") || si.ok[0];
      out.push(TG.mkQ(`${si.name.en}: which tool fits?`, `${si.name.es}: ¿qué herramienta sirve?`, [M(ok).name, M(t).name, ...LH.belt.filter(x => x !== ok && x !== t && !si.ok.includes(x)).slice(0, 1).map(x => M(x).name)], 0, si.why[t] || M(t).limit, M(t).sources.concat(M(ok).sources), { key: `lh:${si.id}:${t}` })); }));
    out.push(TG.mkQ("Pressure-testing a system for leaks: which gas?", "Prueba de presión para fugas: ¿qué gas?", LH.gases.map(g => g.name), 0, LH.rules[1], LH.ruleSources, { key: "lh:gas" }));
    N2M.oemExamples.forEach(o => { const opts = uniq([o.psig, 150, 450, 600, 300]).slice(0, 4);
      out.push(TG.mkQ(`${o.brand}: standing nitrogen test pressure?`, `${o.brand}: ¿presión de prueba con nitrógeno?`, opts.map(p => ({ en: p + " psig", es: p + " psig" })), 0, { en: `${o.psig} psig, ${o.hold.en}. ${LH.rules[2].en}`, es: `${o.psig} psig, ${o.hold.es}. ${LH.rules[2].es}` }, [o.source], { key: `lh:oem:${o.brand.split(" ")[0]}`, oem: true })); });
    const top = LH.leakSpots.filter(s => s.weight >= 3), low = LH.leakSpots.filter(s => s.weight <= 1);
    out.push(TG.mkQ("Which spot is one of the most common leak points?", "¿Cuál es uno de los puntos de fuga más comunes?", [top[0].name, ...low.map(s => s.name), LH.leakSpots.find(s => s.weight === 2).name].slice(0, 4), 0, { en: `Most common: ${top.map(s => s.name.en.toLowerCase()).join(", ")}.`, es: `Más comunes: ${top.map(s => s.name.es.toLowerCase()).join(", ")}.` }, uniq(top.flatMap(s => s.sources)), { key: "lh:spots" }));
    return out; }
  const lhQ = k => lhReviewBank().find(q => q.key === k);
  const weighted = arr => { const tot = arr.reduce((a, x) => a + x.weight, 0); let r = Math.random() * tot; for (const x of arr) { r -= x.weight; if (r <= 0) return x; } return arr[0]; };
  const mapSVG = () => `<svg viewBox="0 0 360 220" class="lh-map" aria-hidden="true"><g class="lm-line">
      <rect x="8" y="128" width="96" height="80" rx="8"/><circle cx="56" cy="168" r="28"/><path d="M56 142v52M30 168h52"/><rect x="18" y="114" width="20" height="14" rx="3"/>
      <path d="M104 150h22q10 0 10-10V70q0-10 10-10h150q10 0 10 10v28" class="lm-pipe"/><path d="M104 176h34q10 0 10-10V84q0-10 10-10h132" class="lm-pipe thin"/>
      <rect x="262" y="96" width="88" height="64" rx="6"/><path d="M270 108l10 20 10-20 10 20 10-20 10 20 10-20 10 20"/><path d="M8 40h352M140 40l20-26h200" class="lm-roof"/></g>
      <text x="56" y="222" class="lm-t">${L("Condenser", "Condensadora")}</text><text x="306" y="176" class="lm-t">${L("Evap coil (attic)", "Evaporador (ático)")}</text>
      <g id="lhSpot" class="lh-spot"><circle r="10"/></g><g id="lhOil" class="lh-oil"><ellipse rx="34" ry="14"/></g><g id="lhBub" class="lh-bub"></g>
      <g id="lhProbe" class="lh-probe"><circle r="14"/><circle r="3"/></g><g id="lhMarks"></g></svg>`;
  function leak() {
    const R = new TG.Round({ id: "leak_hunter" }); bust("lhProg"); const lv = TG.level(R.id), N = 3; let hi = 0;
    const next = () => { if (R.over) return; if (hi >= N) return R.end(true); progDots("lhProg", N, hi); R.boardStart(); hunt(); };
    function hunt() {
      const si = lv <= 1 && hi === 0 ? LH.situations[0] : TG.pick(LH.situations.concat(LH.situations[0])), spot = weighted(LH.leakSpots), pos = LH.spotPos[spot.id];
      const sx = pos[0] * 360, sy = pos[1] * 220; let tool = null, sweeps = 0, found = false; TG.qaCur = { kind: "lh", si, sx, sy };
      R.body.innerHTML = `<div class="tg-head"><span class="tg-lv-chip">${esc(tx(si.name))}</span><b>${L("Customer: low on charge again", "Cliente: otra vez bajo de carga")}</b><p class="sm muted" id="lhStep"></p></div>
        <div class="lh-wrap" id="lhW">${TG.ART ? TG.ART.leakMap(L) : mapSVG()}<div class="lh-read" id="lhRead"></div></div><div class="lh-panel" id="lhP"></div>`;
      const qaO = o => (TG.qaCur.oem = o.psig); const P = $("#lhP"), step = $("#lhStep"), W = $("#lhW"), svg = W.querySelector("svg"), probe = $("#lhProbe"), oil = $("#lhOil"), bub = $("#lhBub"), read = $("#lhRead"), spotEl = $("#lhSpot");
      spotEl.setAttribute("transform", `translate(${sx} ${sy})`); oil.setAttribute("transform", `translate(${sx + (Math.random() * 30 - 15)} ${sy + 6})`); probe.style.display = "none";
      /* pressure test for nitrogen situations */
      const pressure = async () => { step.textContent = L("Pressure test first", "Primero prueba de presión"); const gs = TG.shuffle(LH.gases);
        P.innerHTML = `<p class="sm">${L("Which gas goes in the system?", "¿Qué gas va al sistema?")}</p>${TG.choiceGrid(gs.map(g => esc(tx(g.name))))}`;
        await new Promise(res => P.querySelectorAll(".tg-choice").forEach(b => b.onclick = async () => { const g = gs[+b.dataset.i]; P.querySelectorAll(".tg-choice").forEach(x => x.disabled = true);
          if (g.ok) { b.classList.add("right"); R.hit({ label: "N₂" }); await wait(350); return res(); }
          b.classList.add("wrong"); Sound.sfx("pop"); await R.miss({ did: L(`You grabbed ${tx(g.name).toLowerCase()}.`, `Tomaste ${tx(g.name).toLowerCase()}.`), why: tx(LH.rules[1]) + (g.id === "o2" ? L(" Oxygen plus compressor oil can explode.", " El oxígeno con aceite del compresor puede explotar.") : L(" Shop air carries moisture into the system.", " El aire de taller mete humedad al sistema.")), rule: tx(LH.rules[1]), sources: LH.ruleSources, q: lhQ("lh:gas"), big: g.id === "o2" }); res(); }));
        if (R.over) return; const o = TG.pick(N2M.oemExamples); qaO(o); step.textContent = L("Set the regulator", "Ajusta el regulador");
        P.innerHTML = `<div class="lh-oem"><span class="chip">${ico("book", 13)} ${esc(o.brand)}</span><span class="sm">${L("Manual test pressure", "Presión del manual")}: <b>${o.psig} psig</b> · ${esc(tx(o.hold))}</span></div>
          <div class="lh-reg"><b id="lhPsi">0</b><small>psig</small><input type="range" min="0" max="600" step="10" value="0" class="sp-range" id="lhRng" style="--v:0%" aria-label="psig"></div><button class="btn primary big full" id="lhSet">${ico("check", 18)} ${L("Pressurize", "Presurizar")}</button>`;
        const rng = $("#lhRng"), ps = $("#lhPsi"); let lastTick = 0; rng.oninput = () => { rng.style.setProperty("--v", rng.value / 6 + "%"); ps.textContent = rng.value; ps.classList.toggle("ok", +rng.value === o.psig); if (Math.abs(rng.value - lastTick) >= 50) { lastTick = +rng.value; Sound.sfx("tick"); } };
        await new Promise(res => $("#lhSet").onclick = async () => { const v = +rng.value; Sound.sfx("valve");
          if (Math.abs(v - o.psig) <= 10) { R.hit({ label: o.psig + " psig" }); } else { await R.miss({ did: L(`You set ${v} psig. ${o.brand} says ${o.psig}.`, `Pusiste ${v} psig. ${o.brand} dice ${o.psig}.`), why: v > o.psig ? tx(LH.rules[2]) : L("Below the manual's pressure, small leaks may not show. Use the manual's number.", "Bajo la presión del manual, las fugas pequeñas pueden no verse. Usa el número del manual."), rule: tx(N2M.limit), oem: true, sources: [o.source], q: lhQ(`lh:oem:${o.brand.split(" ")[0]}`) }); }
          res(); });
        if (R.over) return; read.innerHTML = `<span class="lh-drop">${o.psig} → ${o.psig - 12} psig · ${L("dropping: there's a leak", "baja: hay fuga")}</span>`; Sound.sfx("gauge"); await wait(900); };
      const pickTool = () => new Promise(res => { step.textContent = L("Pick your tool off the belt", "Elige herramienta del cinturón");
        P.innerHTML = `<div class="lh-belt">${LH.belt.map(t => `<button class="lh-tool" data-t="${t}"><svg viewBox="0 0 24 24">${TOOL_ICO[t]}</svg><span>${esc(tx(M(t).name))}</span></button>`).join("")}</div>`;
        P.querySelectorAll(".lh-tool").forEach(b => b.onclick = async () => { const t = b.dataset.t; Sound.sfx("pick");
          if (si.ok.includes(t)) { P.querySelectorAll(".lh-tool").forEach(x => x.classList.toggle("on", x === b)); res(t); return; }
          b.classList.add("bad"); b.disabled = true; await R.miss({ did: L(`You grabbed ${tx(M(t).name).toLowerCase()} on a ${tx(si.name).toLowerCase()}.`, `Tomaste ${tx(M(t).name).toLowerCase()} en: ${tx(si.name).toLowerCase()}.`), why: tx(si.why[t] || M(t).limit), rule: si.ok.map(x => tx(M(x).name) + ": " + tx(M(x).use)).join(" · "), sources: uniq([...M(t).sources, ...LH.ruleSources.slice(0, 1)]), q: lhQ(`lh:${si.id}:${t}`) }); }); });
      const sweep = () => new Promise(res => { step.textContent = tool === "visual" ? L("Trace the oil, then switch to pinpoint", "Sigue el aceite y cambia para ubicar") : L("Drag along the lines. Mark the leak.", "Recorre las líneas. Marca la fuga.");
        P.innerHTML = `<div class="row gap"><button class="btn big" id="lhSwap">${ico("refresh", 16)} ${L("Tool", "Herramienta")}</button><button class="btn primary big grow" id="lhMark" disabled>${ico("pin", 18)} ${L("Mark leak", "Marcar fuga")}</button></div>`;
        let px = -100, py = -100, down = false, beepT = 0, near = 0, hiss = tool === "ultrasonic" ? Sound.loop("n2", 0) : null; probe.style.display = "";
        R.stops.push(() => hiss && hiss.stop());
        const toSvg = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 360, (e.clientY - r.top) / r.height * 220]; };
        const onDown = e => { down = true; W.setPointerCapture(e.pointerId); [px, py] = toSvg(e); sweeps++; $("#lhMark").disabled = false; }, onMove = e => { if (down) [px, py] = toSvg(e); }, onUp = () => { down = false; };
        W.addEventListener("pointerdown", onDown); W.addEventListener("pointermove", onMove); W.addEventListener("pointerup", onUp); W.addEventListener("pointercancel", onUp);
        const unbind = () => { W.removeEventListener("pointerdown", onDown); W.removeEventListener("pointermove", onMove); W.removeEventListener("pointerup", onUp); hiss && hiss.stop(0.2); R.onFrame = null; };
        R.onFrame = dt => { probe.setAttribute("transform", `translate(${px} ${py - (A.touch ? 26 : 0)})`); const d = Math.hypot(px - sx, (py - (A.touch ? 26 : 0)) - sy); near = Math.max(0, 1 - d / 140);
          if (tool === "electronic" && down && near > 0) { beepT -= dt; if (beepT <= 0) { Sound.sfx("beep", { pitch: 0.8 + near * 0.8 }); beepT = 0.6 - near * 0.52; } read.innerHTML = `<span class="lh-bars" aria-label="sniffer">${"<i></i>".repeat(Math.ceil(near * 8))}</span>`; }
          else if (tool === "ultrasonic") { hiss.set(down ? near * near * 0.7 : 0); read.innerHTML = down ? `<span class="lh-db">${Math.round(20 + near * 60)} dB</span>` : ""; }
          else if (tool === "bubbles") { if (down && d < 34 && bub.childElementCount < 14 && Math.random() < 0.35) { const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); c.setAttribute("cx", sx + Math.random() * 14 - 7); c.setAttribute("cy", sy); c.setAttribute("r", 2 + Math.random() * 3); bub.appendChild(c); Sound.sfx("bubble"); setTimeout(() => c.remove(), 1400); } }
          else if (tool === "visual") { oil.style.opacity = down ? Math.min(1, near * 1.6) : oil.style.opacity; }
          probe.classList.toggle("hot", near > 0.75); };
        $("#lhSwap").onclick = async () => { unbind(); probe.style.display = "none"; read.innerHTML = ""; tool = await pickTool(); res(sweep()); };
        $("#lhMark").onclick = async () => { const d = Math.hypot(px - sx, (py - (A.touch ? 26 : 0)) - sy);
          if (tool === "visual") { Sound.sfx("tap"); A.toast(esc(L("Oil narrows it down. Pinpoint it with bubbles or a detector.", "El aceite reduce el área. Ubícala con burbujas o detector.")), "info"); return; }
          if (d < 30) { unbind(); found = true; spotEl.classList.add("found"); Sound.sfx("catch"); R.hit({ pts: 250, label: L("found", "encontrada") }); res(); return; }
          Sound.sfx("tap"); TG.buzz("heavy"); R.left = Math.max(1, R.left - 3); const m = document.createElementNS("http://www.w3.org/2000/svg", "path"); m.setAttribute("d", `M${px - 5} ${py - 5}l10 10M${px + 5} ${py - 5}l-10 10`); m.setAttribute("class", "lh-x"); $("#lhMarks").appendChild(m);
          read.innerHTML = `<span class="bad">${L("Nothing there · −3s", "Nada aquí · −3s")}</span>`; }; });
      (async () => { if (si.id !== "charged") { await pressure(); if (R.over) return; } else { read.innerHTML = `<span class="sm">${esc(tx(LH.rules[0]))}</span>`; }
        tool = await pickTool(); if (R.over) return; await sweep(); if (R.over) return;
        TG.flash(R, `<b>${esc(tx(spot.name))}</b><p>${L("Repair it, then pressure test again before you evacuate.", "Repárala y vuelve a probar con presión antes de evacuar.")}</p>`, "explain", 1800);
        const clean = R.boardEnd(); if (clean && sweeps <= 3) setTimeout(() => R.bonus(200, L("Bloodhound", "Sabueso")), 600); hi++; setTimeout(next, 1700); })();
    }
    TG.intro(R, `<div class="tg-intro-art">${TG.byId.leak_hunter.art(84)}</div><h3>${esc(tx(LH.name))}</h3><p class="sm">${L("It's a 'cooling some, but not enough' call. Read the situation, pick the right tool, sweep the lines with your finger and mark the leak. On nitrogen jobs, pressure test to the manual's number first.", "Es una llamada de 'enfría un poco, pero no suficiente.' Lee la situación, elige la herramienta, recorre las líneas con el dedo y marca la fuga. Con nitrógeno, prueba primero a la presión del manual.")}</p>`, null, next);
  }

  /* ===================== VACUUM PUMP RUSH ===================== */
  function vpReviewBank() { const out = [];
    VP.setupChoices.forEach(c => out.push(TG.mkQ("Setting up to evacuate: which is right?", "Preparando la evacuación: ¿cuál es correcto?", [c.good, c.bad], 0, { en: c.good.en + ".", es: c.good.es + "." }, c.sources, { key: `vp:setup:${c.id}` })));
    VP.oemRules.forEach(o => ["tightDry", "wet", "leak"].forEach(k => out.push(TG.mkQ(`${o.brand} decay test: ${VP.curveExplain[k].en.split(":")[0].replace(/\.$/, "")}. What is it?`, `${o.brand} prueba de caída: ${VP.curveExplain[k].es.split(":")[0].replace(/\.$/, "")}. ¿Qué es?`, ["tightDry", "wet", "leak"].sort((a, b) => (a === k ? -1 : b === k ? 1 : 0)).map(x => VP.curveNames[x]), 0, { en: VP.curveExplain[k].en + " " + o.rule.en, es: VP.curveExplain[k].es + " " + o.rule.es }, [o.source, ...VP.decaySources], { key: `vp:${o.brand.split(" ")[0]}:${k}`, oem: true }))));
    VP.rules.forEach((r, i) => out.push(TG.mkQ("True or false: " + r.en, "¿Verdadero o falso?: " + r.es, [{ en: "True", es: "Verdadero" }, { en: "False", es: "Falso" }], 0, r, VP.ruleSources, { key: `vp:rule${i}` })));
    return out; }
  const vpQ = k => vpReviewBank().find(q => q.key === k);
  const fmtMic = m => m >= 10000 ? (m / 1000).toFixed(1) + "k" : Math.round(m).toString();
  /* simulated hold curve (microns vs minutes), shape per outcome, scaled to each OEM's numbers */
  const curve = (o, kind, t) => { const T = Math.max(1, o.holdMin), x = t / T, base = o.target;
    if (kind === "tightDry") return base + (o.pass * 0.82 - base) * (1 - Math.exp(-x * 6));
    if (kind === "wet") return base + ((o.leakAbove ? (o.pass + o.leakAbove) / 2 : o.pass * 2.1) - base) * (1 - Math.exp(-x * 4.5));
    return base + (o.pass * 1.1 - base) * x * 1.2 + Math.pow(x, 1.4) * o.pass * 2.6; };
  function vacuum() {
    const R = new TG.Round({ id: "vacuum_pump_rush" }); bust("vpProg"); const lv = TG.level(R.id), N = 2; let ji = 0;
    const next = () => { if (R.over) return; if (ji >= N) return R.end(true); progDots("vpProg", N, ji); R.boardStart(); job(); };
    function job() {
      const o = TG.pick(VP.oemRules), kinds = lv <= 1 && ji === 0 ? ["tightDry"] : ["tightDry", "wet", "leak"], kind = TG.pick(kinds); let good = 0, firstHold = true;
      R.body.innerHTML = `<div class="tg-head"><span class="tg-lv-chip">${esc(o.brand)}</span><b>${L("Evacuate the new install", "Evacúa la instalación nueva")}</b><p class="sm muted" id="vpStep"></p></div>
        <div class="vp-gauge art" id="vpG">${TG.ART.vacScene(L)}<div class="vp-dev"><div class="vp-lcd"><b id="vpMic">ATM</b><small>${L("microns", "micrones")}</small></div><svg class="vp-mini" viewBox="0 0 120 44" preserveAspectRatio="none"><path class="vp-mini-t" d="M0 ${44 - (1 - Math.log10(o.target) / Math.log10(25000)) * 40} H120"/><path id="vpMini" class="vp-mini-c"/></svg></div><div class="vp-log"><i id="vpLog"></i><span class="vp-tgt" style="left:${(1 - Math.log10(o.target) / Math.log10(25000)) * 100}%"></span></div>
        <div class="vp-oem">${ico("book", 13)} ${esc(tx(o.rule))}</div></div><div class="vp-panel" id="vpP"></div>`;
      const P = $("#vpP"), step = $("#vpStep"), mic = $("#vpMic"), logEl = $("#vpLog");
      const miniEl = $("#vpMini"), miniTxt = $("#vpMicMini"), hist = []; let histT = 0; const mini = m => { const now = performance.now(); if (now - histT < 90) return; histT = now; hist.push(44 - (1 - Math.log10(Math.max(1, m)) / Math.log10(25000)) * 40); if (hist.length > 120) hist.shift(); miniEl.setAttribute("d", "M" + hist.map((y, i) => `${i},${y.toFixed(1)}`).join("L")); };
      const show = m => { mini(m); if (miniTxt) miniTxt.textContent = m >= 24000 ? "ATM" : fmtMic(m); mic.textContent = m >= 24000 ? "ATM" : fmtMic(m); logEl.style.transform = `scaleX(${Math.max(0, Math.min(1, 1 - Math.log10(Math.max(1, m)) / Math.log10(25000)))})`; mic.classList.toggle("ok", m <= o.target); };
      /* 1. setup sprint */
      const setup = () => new Promise(res => { step.textContent = L("Setup sprint: tap the right way", "Preparación: toca la forma correcta"); let k = 0; const list = TG.shuffle(VP.setupChoices);
        const one = () => { if (R.over) return; if (k >= list.length) return res(); const c = list[k], flip = Math.random() < 0.5, opts = flip ? [c.bad, c.good] : [c.good, c.bad]; TG.qaCur = { kind: "vp", good: tx(c.good), curve: kind };
          P.innerHTML = `<div class="vp-pair">${opts.map((x, i) => `<button class="tg-choice vp-card" data-i="${i}">${esc(tx(x))}</button>`).join("")}</div><div class="vp-dots">${list.map((_, i) => `<i class="${i < k ? "done" : i === k ? "cur" : ""}"></i>`).join("")}</div>`;
          P.querySelectorAll(".vp-card").forEach(b => b.onclick = async () => { P.querySelectorAll(".vp-card").forEach(x => x.disabled = true); const right = opts[+b.dataset.i] === c.good;
            if (right) { b.classList.add("right"); good++; R.hit({ quiet: true, pts: 80 }); await wait(260); }
            else { b.classList.add("wrong"); await R.miss({ did: L(`You picked: ${tx(c.bad)}.`, `Elegiste: ${tx(c.bad)}.`), why: tx(c.good) + ".", rule: tx(VP.rules[2]), sources: c.sources, q: vpQ(`vp:setup:${c.id}`) }); }
            k++; one(); }); };
        one(); });
      /* 2. pull: tap fault chips as they pop; fewer setup misses = faster pull */
      const pull = () => new Promise(res => { step.textContent = L("Pulling. Tap problems as they pop up.", "Evacuando. Toca los problemas que aparezcan."); let m = 25000, stall = 0, nextEv = 2.2 + Math.random() * 1.5, ev = null, reached = false;
        const speed = 0.55 + good * 0.1 + lv * 0.03, floor = Math.max(30, o.target * 0.35), pump = Sound.loop("pump", 0.8); R.stops.push(() => pump.stop()); $("#vpG").classList.add("run");
        P.innerHTML = `<div class="vp-events" id="vpEv"></div><button class="btn primary big full" id="vpIso" disabled>${ico("lock", 18)} ${L("Isolate & hold", "Aislar y mantener")}</button>`;
        const evBox = $("#vpEv"), iso = $("#vpIso"); const EV = [{ k: "oil", t: L("Pump oil cloudy", "Aceite de la bomba turbio"), fix: L("Change oil", "Cambiar aceite") }, { k: "hose", t: L("Hose fitting hissing", "Conexión de manguera silbando"), fix: L("Snug it", "Apretar") }];
        let tickAcc = 0;
        R.onFrame = dt => { if (stall > 0) { stall -= dt; m = Math.min(25000, m + (3000 - m) * dt * 0.6); } else m = floor + (m - floor) * Math.exp(-dt * speed * (m > 5000 ? 1.4 : 0.55));
          show(m); tickAcc += dt; if (tickAcc > 0.12) { tickAcc = 0; pump.set(0.5 + Math.min(0.5, m / 25000)); }
          if (!ev && m > o.target * 1.4) { nextEv -= dt; if (nextEv <= 0) { const e = TG.pick(EV), el = document.createElement("button"); el.className = "vp-ev"; el.innerHTML = `${ico("warn", 16)} ${e.t} · <b>${e.fix}</b><i></i>`; evBox.appendChild(el); Sound.sfx("drip");
            ev = { el, left: 2.6 }; el.onclick = () => { if (!ev) return; Sound.sfx("valve"); R.hit({ quiet: true, pts: 60, label: e.fix }); el.classList.add("gone"); setTimeout(() => el.remove(), 250); ev = null; nextEv = 3 + Math.random() * 2; }; } }
          if (ev) { ev.left -= dt; ev.el.style.setProperty("--k", ev.left / 2.6); if (ev.left <= 0) { ev.el.classList.add("gone", "missed"); const el = ev.el; setTimeout(() => el.remove(), 250); ev = null; stall = 1.6; nextEv = 3; Sound.sfx("wrong"); R.combo = 0; } }
          if (!reached && m <= o.target) { reached = true; iso.disabled = false; iso.classList.add("pulse"); Sound.sfx("beep", { pitch: 1.5 }); TG.buzz("heavy"); }
          if (reached && m > o.target) { iso.disabled = true; iso.classList.remove("pulse"); reached = false; } };
        iso.onclick = () => { if (iso.disabled) return; R.onFrame = null; pump.stop(0.3); $("#vpG").classList.remove("run"); Sound.sfx("valve"); evBox.innerHTML = ""; R.hit({ label: "< " + o.target }); res(); }; });
      /* 3. hold and call it */
      const hold = () => new Promise(res => { step.textContent = L(`Isolated. Watching ${o.holdMin} min (sped up)…`, `Aislado. Observando ${o.holdMin} min (acelerado)…`);
        const top = Math.max(o.leakAbove || o.pass * 2, o.pass * 2.6), W = 300, H = 120, y = v => H - Math.min(1, v / top) * (H - 8) - 4;
        P.innerHTML = `<svg class="vp-graph" viewBox="0 0 ${W} ${H}"><line x1="0" x2="${W}" y1="${y(o.pass)}" y2="${y(o.pass)}" class="vg-pass"/><text x="4" y="${y(o.pass) - 4}" class="vg-t">${o.pass} ${L("limit", "límite")}</text>${o.leakAbove ? `<line x1="0" x2="${W}" y1="${y(o.leakAbove)}" y2="${y(o.leakAbove)}" class="vg-leak"/><text x="4" y="${y(o.leakAbove) - 4}" class="vg-t">${o.leakAbove}</text>` : ""}<path id="vpCurve" class="vg-curve"/></svg>
          <div id="vpCall"></div>`;
        const path = $("#vpCurve"), t0 = performance.now(), dur = 3600; let d = "";
        R.onFrame = () => { const k = Math.min(1, (performance.now() - t0) / dur), pts = []; for (let i = 0; i <= 60 * k; i++) { const tt = i / 60 * o.holdMin; pts.push(`${(i / 60 * W).toFixed(1)},${y(curve(o, kind, tt)).toFixed(1)}`); }
          path.setAttribute("d", "M" + pts.join("L")); show(curve(o, kind, k * o.holdMin)); if (k >= 1) { R.onFrame = null; call(); } };
        const call = () => { step.textContent = L("Make the call", "Tu diagnóstico"); const ks = ["tightDry", "wet", "leak"];
          $("#vpCall").innerHTML = TG.choiceGrid(ks.map(x => esc(tx(VP.curveNames[x]))), "three");
          $("#vpCall").querySelectorAll(".tg-choice").forEach(b => b.onclick = async () => { const pick = ks[+b.dataset.i]; $("#vpCall").querySelectorAll(".tg-choice").forEach(x => x.disabled = true);
            if (pick === kind) { b.classList.add("right"); R.hit({ pts: 200, label: tx(VP.curveNames[kind]).split(":")[0] }); if (kind === "tightDry" && firstHold) setTimeout(() => R.bonus(250, L("Bone Dry", "Bien seco")), 500);
              if (kind !== "tightDry") TG.flash(R, `<p>${esc(tx(VP.curveExplain[kind]))}</p>`, "explain", 1800); }
            else { b.classList.add("wrong"); $("#vpCall").querySelector(`[data-i="${ks.indexOf(kind)}"]`).classList.add("right");
              await R.miss({ did: L(`You called it "${tx(VP.curveNames[pick])}".`, `Dijiste "${tx(VP.curveNames[pick])}".`), why: tx(VP.curveExplain[kind]), rule: tx(o.rule), oem: true, sources: [o.source, ...VP.decaySources], q: vpQ(`vp:${o.brand.split(" ")[0]}:${kind}`) }); }
            await wait(700); res(); }); }; });
      (async () => { await setup(); if (R.over) return; await pull(); if (R.over) return; await hold(); if (R.over) return; R.boardEnd(); ji++; setTimeout(next, 600); })();
    }
    TG.intro(R, `<div class="tg-intro-art">${TG.byId.vacuum_pump_rush.art(84)}</div><h3>${esc(tx(VP.name))}</h3><p class="sm">${L("The repair is brazed and you're ready to open the valves. Set up the pump, pull below the OEM target, isolate, then read the decay: tight and dry, moisture, or a leak.", "La reparación ya está soldada y vas a abrir las válvulas. Prepara la bomba, baja del objetivo del fabricante, aísla y lee la caída: hermético y seco, humedad o fuga.")}</p><p class="sm muted">${esc(tx(VP.rules[0]))}</p>`, null, next);
  }

  /* ===================== ROOFTOP RUN ===================== */
  function rrReviewBank() { const out = [];
    RR.safetyCards.forEach(c => out.push(TG.mkQ(c.q.en, c.q.es, [c.a, ...c.wrong], 0, c.a, [c.source], { key: `rr:${c.id}` })));
    const ord = RR.rtuAirPathOrder; out.push(TG.mkQ("RTU air path: what comes right after the filters?", "Ruta de aire RTU: ¿qué sigue después de los filtros?", [ord[3], ord[1], ord[6]], 0, RR.rtuAirPathNote, RR.rtuSources, { key: "rr:air" }));
    return out; }
  const rrQ = k => rrReviewBank().find(q => q.key === k);
  const HZ = { edge: "#E8A23A", skylight: "#7FB7D9", ladder: "#C8A15A", crane: "#E8C34A", powerline: "#E05A3C", box: "#9AA3AD", sun: "#F2C14E" };
  function rooftop() {
    const R = new TG.Round({ id: "rooftop_run", hearts: 3 }); bust("rrProg"); const lv = TG.level(R.id), cards = TG.shuffle(RR.safetyCards).slice(0, 4 + Math.min(2, lv - 1)); let ci = 0, incidents = 0;
    R.body.innerHTML = `<div class="rr-wrap" id="rrW"><canvas id="rrC"></canvas><div class="rr-dist" id="rrD">0 ft</div></div><p class="sm muted rr-tip">${L("Swipe or tap left/right to grab tools and water.", "Desliza o toca izquierda/derecha para tomar herramientas y agua.")}</p>`;
    const W = $("#rrW"), cv = $("#rrC"), ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1); let w = 0, h = 0;
    const size = () => { w = W.clientWidth; h = Math.min(460, Math.round(window.innerHeight * 0.52)); cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); RRA && RRA.resize(w, h); }; const RRA = TG.ART && TG.ART.roofR ? TG.ART.roofR(ctx) : null; size();
    const ro = new ResizeObserver(size); ro.observe(W); R.stops.push(() => ro.disconnect());
    const avImg = new Image(); avImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(avatarSVG(S.avatar, 64).replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"'));
    let lane = 1, lx = 1, dist = 0, scroll = 0, items = [], nextItem = 1.2, nextHz = 2.2, hz = null, running = false, done = false;
    const laneX = l => w * (0.2 + l * 0.3), speed = 150 + lv * 12;
    const setLane = l => { const n = Math.max(0, Math.min(2, l)); if (n !== lane) { lane = n; Sound.sfx("step"); TG.buzz("tap"); } };
    let sx0 = null; W.onpointerdown = e => { sx0 = e.clientX; }; W.onpointerup = e => { if (sx0 == null) return; const dx = e.clientX - sx0; if (Math.abs(dx) > 24) setLane(lane + Math.sign(dx)); else { const r = W.getBoundingClientRect(); setLane(lane + (e.clientX - r.left < r.width / 2 ? -1 : 1)); } sx0 = null; };
    const key = e => { if (e.key === "ArrowLeft") setLane(lane - 1); if (e.key === "ArrowRight") setLane(lane + 1); }; document.addEventListener("keydown", key); R.stops.push(() => document.removeEventListener("keydown", key));
    const drawHz = (y, type) => { ctx.save(); ctx.translate(0, y); ctx.lineWidth = 3; ctx.strokeStyle = HZ[type]; ctx.fillStyle = HZ[type] + "33";
      if (type === "edge") { ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.stroke(); ctx.setLineDash([]); ctx.fillRect(0, -26, w, 26); }
      else if (type === "skylight") { ctx.fillRect(w / 2 - 50, -40, 100, 40); ctx.strokeRect(w / 2 - 50, -40, 100, 40); ctx.beginPath(); ctx.moveTo(w / 2 - 50, -40); ctx.lineTo(w / 2 + 50, 0); ctx.stroke(); }
      else if (type === "powerline") { for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(0, -20 + i * 12); ctx.quadraticCurveTo(w / 2, -4 + i * 12, w, -20 + i * 12); ctx.stroke(); } }
      else if (type === "crane") { ctx.strokeRect(w / 2 - 34, -50, 68, 40); ctx.beginPath(); ctx.moveTo(w / 2, -50); ctx.lineTo(w / 2, -90); ctx.stroke(); ctx.fillRect(w / 2 - 34, -50, 68, 40); }
      else if (type === "ladder") { ctx.strokeRect(w - 60, -70, 30, 70); for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(w - 60, -70 + i * 12); ctx.lineTo(w - 30, -70 + i * 12); ctx.stroke(); } }
      else if (type === "box") { ctx.fillRect(w / 2 - 22, -44, 44, 44); ctx.strokeRect(w / 2 - 22, -44, 44, 44); ctx.beginPath(); ctx.moveTo(w / 2 - 4, -36); ctx.lineTo(w / 2 - 10, -20); ctx.lineTo(w / 2 + 4, -22); ctx.lineTo(w / 2 - 2, -8); ctx.stroke(); }
      else if (type === "sun") { ctx.beginPath(); ctx.arc(w / 2, -30, 18, 0, 7); ctx.fill(); ctx.stroke(); }
      ctx.restore(); };
    const frame = dt => { if (!running) return; const v = hz && hz.y > h - 190 ? 0 : speed; scroll = (scroll + v * dt) % 48; dist += v * dt / 12; $("#rrD").textContent = Math.round(dist) + " ft";
      lx += (lane - lx) * Math.min(1, dt * 14);
      nextItem -= dt; if (nextItem <= 0) { items.push({ l: Math.floor(Math.random() * 3), y: RRA ? RRA.top + 10 : -20, z: Math.random() < 0.45 ? 70 : 0, k: Math.random() < 0.35 ? "water" : "tool" }); nextItem = 0.9 + Math.random() * 0.8; }
      if (!hz && !done) { nextHz -= dt; if (nextHz <= 0) { if (ci < cards.length) hz = { c: cards[ci], y: (RRA ? RRA.top : 0) - 10 }; else { done = true; airPath(); return; } } }
      if (hz) { hz.y += v * dt; if (hz.y > h - 190 && !hz.asked) { hz.asked = true; ask(hz); } }
      if (RRA) { RRA.setScroll(dist * 12); RRA.bg(performance.now() / 1000, dist * 12, lx, dist); } else { ctx.clearRect(0, 0, w, h); }
      const py = h - 70; items = items.filter(it => { it.y += v * dt; if (it.y > py - 20 && it.y < py + 20 && it.l === lane) { Sound.sfx("catch"); R.score += it.k === "water" ? 30 : 20; TG.pop(R.el, laneX(it.l) - 10, py + 40, it.k === "water" ? "+30 💧" : "+20", ""); return false; } if (it.y > h + 20) return false;
        if (it.z) it.z = Math.max(0, it.z - dt * 80); if (RRA) RRA.item(it, laneX(it.l)); else { ctx.fillStyle = "#C9A876"; ctx.beginPath(); ctx.arc(laneX(it.l), it.y, 8, 0, 7); ctx.fill(); } return true; });
      if (hz) { if (RRA) RRA.hz(hz.y, hz.c.hazard, HZ); else drawHz(hz.y, hz.c.hazard); }
      const bob = Math.sin(performance.now() / 110) * 3, x = w * (0.2 + lx * 0.3); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(x, py + 30, 18, 6, 0, 0, 7); ctx.fill(); if (avImg.complete) ctx.drawImage(avImg, x - 28, py - 34 + bob, 56, 56); };
    R.onFrame = dt => frame(dt);
    const ask = hzObj => { running = false; const c = hzObj.c, opts = TG.shuffle([c.a, ...c.wrong]); TG.qaCur = { kind: "rr", a: tx(c.a) };
      const d = document.createElement("div"); d.className = "rr-card"; d.innerHTML = `<div class="rr-in"><div class="rr-timer"><i></i></div><small>${ico("warn", 14)} ${L("Hazard", "Peligro")}</small><p>${esc(tx(c.q))}</p>${TG.choiceGrid(opts.map(o => esc(tx(o))))}</div>`;
      R.el.appendChild(d); requestAnimationFrame(() => d.classList.add("open")); Sound.sfx("boss"); TG.buzz("heavy");
      const limit = 3 + (lv <= 2 ? 3 : lv <= 4 ? 2 : 0), t0 = performance.now(); let answered = false; d.querySelector(".rr-timer i").style.animationDuration = limit + "s";
      const answer = async ok => { if (answered) return; answered = true; clearTimeout(tm); d.classList.remove("open"); setTimeout(() => d.remove(), 220);
        if (ok) { R.hit({ pts: 150 + Math.round(Math.max(0, limit - (performance.now() - t0) / 1000) * 20), label: L("safe", "seguro") }); }
        else { incidents++; await R.miss({ did: ok === null ? L("Time ran out on the hazard card.", "Se acabó el tiempo en la tarjeta.") : L("You picked the unsafe option.", "Elegiste la opción insegura."), why: tx(c.a), rule: tx(c.q) + " → " + tx(c.a), sources: [c.source], q: rrQ(`rr:${c.id}`), big: true }); }
        if (R.over) return; hz = null; ci++; progDots("rrProg", cards.length, ci); nextHz = 1.6; running = true; };
      const tm = setTimeout(() => answer(null), limit * 1000 + 300); R.stops.push(() => clearTimeout(tm));
      d.querySelectorAll(".tg-choice").forEach(b => b.onclick = () => { const ok = opts[+b.dataset.i] === c.a; b.classList.add(ok ? "right" : "wrong"); answer(ok); }); };
    const airPath = () => { R.onFrame = null; const ord = RR.rtuAirPathOrder, shuffled = TG.shuffle(ord.map((x, i) => i)); let k = 0, airMiss = 0; TG.qaCur = { kind: "air" };
      R.body.innerHTML = `<div class="tg-head"><b>${L("You made it to the RTU", "Llegaste a la RTU")}</b><p class="sm muted">${L("Tap the air path in order, outside air to supply.", "Toca la ruta del aire en orden, de aire exterior a suministro.")}</p></div>
        <div class="rr-path" id="rrPath">${ord.map(() => `<span class="rr-slot"></span>`).join("<i>›</i>")}</div><div class="rr-chips">${shuffled.map(i => `<button class="gr-chip" data-i="${i}"><b>${esc(tx(ord[i].short))}</b></button>`).join("")}</div><p class="sm muted">${esc(tx(RR.rtuAirPathNote))}</p>`;
      const slots = [...R.body.querySelectorAll(".rr-slot")];
      const heatI = ord.findIndex(x => /heat|calor/i.test(x.short.en)), blowI = ord.findIndex(x => /blower/i.test(x.short.en));
      R.body.querySelectorAll(".rr-chips .gr-chip").forEach(b => b.onclick = async () => { if (b.disabled) return; const i = +b.dataset.i;
        const okNow = i === k || (k === blowI && i === heatI && !R.body.querySelector(`.gr-chip[data-i="${heatI}"]`).disabled) || (k === heatI && i === blowI);
        const swap = i !== k && okNow; if (okNow) { b.disabled = true; slots[k].textContent = tx(ord[i].short); slots[k].classList.add("fill"); Sound.sfx("snap", { pitch: 0.9 + k * 0.06 }); R.hit({ quiet: true, pts: 60 });
          if (swap) { /* heat before blower is accepted: units differ */ } k++; if (k >= ord.length) { await wait(400); if (!airMiss) R.bonus(200, L("Air path", "Ruta de aire")); R.boardEnd({ speed: false }); if (!incidents) setTimeout(() => R.bonus(400, L("Zero Incidents", "Cero incidentes")), 600); setTimeout(() => R.end(true), 1500); } }
        else { airMiss++; b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 400); await R.miss({ did: L(`You put ${tx(ord[i].short)} next.`, `Pusiste ${tx(ord[i].short)} después.`), why: ord.map(x => tx(x.short)).join(" → "), rule: tx(RR.rtuAirPathNote), sources: RR.rtuSources, q: rrQ("rr:air"), noHeart: true }); } }); };
    TG.intro(R, `<div class="tg-intro-art">${TG.byId.rooftop_run.art(84)}</div><h3>${esc(tx(RR.name))}</h3><p class="sm">${L("Cross the roof to the RTU. Each hazard gets a 3-second safety call. Wrong calls cost a hard hat. Then trace the RTU air path.", "Cruza la azotea hasta la RTU. Cada peligro tiene 3 segundos para decidir. Un error cuesta un casco. Luego traza la ruta del aire.")}</p>`, null, () => { R.boardStart(); progDots("rrProg", cards.length, 0); running = true; });
  }

  /* ===================== BOSS RUSH ===================== */
  const OLD_TIMER = { skin: "#E0B48C", hair: "short", hairColor: "#D8D8D8", facial: "mustache", glasses: false, head: "ballcap", headColor: "#3A4A3A", top: "work", topColor: "#4A5A6A", pants: "work", pantsColor: "#3B3F45", boots: "brown", tool: "wrench", shades: "none", belt: "none", body: "a" };
  const weekKey = () => { const d = new Date(), j = new Date(d.getFullYear(), 0, 1); return d.getFullYear() + "-W" + Math.ceil(((d - j) / 864e5 + j.getDay() + 1) / 7); };
  const seeded = seed => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  function bossPool(gid) { const def = TG.byId[gid]; if (!def || !def.reviewBank) return []; const bank = def.reviewBank();
    const lvOf = { thermostat_wiring: k => (TG.game(gid).scenarios.find(s => k.includes(":" + s.id + ":")) || {}).level || 9, wire_it_up: k => (TG.game(gid).scenarios.find(s => k.includes(":" + s.id)) || {}).level || 9, gauge_reader: k => (TG.game(gid).cases.find(c => k === "gr:" + c.id) || {}).level || 9 };
    const min = { thermostat_wiring: 4, wire_it_up: 3, gauge_reader: 3 }[gid]; return min ? bank.filter(q => lvOf[gid](q.key) >= min && lvOf[gid](q.key) < 9) : bank; }
  function brReviewBank() { return BR.calls.map(c => { const others = BR.calls.filter(x => x.id !== c.id).map(x => x.steps[0]);
    return TG.mkQ(`${c.symptom.en} First check?`, `${c.symptom.es} ¿Primera revisión?`, [c.steps[0], ...others.slice(0, 3)], 0, { en: c.steps.map(s => s.en).join(" → "), es: c.steps.map(s => s.es).join(" → ") }, BOSS_SRC[c.id], { key: `bo:${c.id}` }); }); }
  const BOSS_SRC = { br01: ["hvacrschool_c_common", "copeland_terminals"], br02: ["hvacknowitall_ob", "rheem_rjnl"], br03: ["hvacrschool_diag"], br04: ["hvacrschool_leakdetect", "realzero_13", "trane_leak_guide"], br05: ["hvacrschool_decay", "goodman_iog4048"] };
  function boss() {
    const R = new TG.Round({ id: "boss_rush", hearts: 3 }); bust("boProg"); const rnd = seeded(hashN(new Date().toDateString())); const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const calls = shuf(BR.calls); let ci = 0;
    const next = () => { if (R.over) return; if (ci >= calls.length) { if (R.mistakes === 0) R.bonus(1000, L("Flawless", "Perfecto")); return finish(); } progDots("boProg", calls.length, ci); R.boardStart(); call(calls[ci]); };
    const finish = () => { const b = S.tg.boss_rush || (S.tg.boss_rush = { lv: 1, plays: 0 }); const wk = weekKey(); if (b.week !== wk) { b.week = wk; b.weekScores = []; } b.weekScores.push({ s: R.score, d: Date.now() }); b.weekScores.sort((x, y) => y.s - x.s); b.weekScores = b.weekScores.slice(0, 5); A.save(); R.end(true, L("You beat the Old Timer", "Le ganaste al Veterano")); };
    const askMC = (q, label) => new Promise(res => { const order = shuf(q.a.map((_, i) => i)); TG.qaCur = { kind: "mc", ans: tx(q.a[q.c]) };
      { const k = R.body.querySelector("#boClk"); if (k) { k.style.animation = "none"; void k.offsetWidth; k.style.animation = ""; } }
      R.body.querySelector("#boQ").innerHTML = `<small class="bo-lbl">${label}</small><p class="bo-q">${esc(tx(q.q))}</p>${TG.choiceGrid(order.map(i => esc(tx(q.a[i]))))}`;
      R.body.querySelectorAll("#boQ .tg-choice").forEach(b => b.onclick = async () => { const i = order[+b.dataset.i]; R.body.querySelectorAll("#boQ .tg-choice").forEach(x => x.disabled = true);
        if (i === q.c) { b.classList.add("right"); R.hit({ pts: 150 }); await wait(380); return res(true); }
        b.classList.add("wrong"); R.body.querySelector(`#boQ .tg-choice[data-i="${order.indexOf(q.c)}"]`).classList.add("right");
        await R.miss({ did: L(`You picked "${tx(q.a[i])}".`, `Elegiste "${tx(q.a[i])}".`), why: tx(q.why), rule: tx(q.a[q.c]), sources: q.srcIds || [], q, oem: q.oem }); res(false); }); });
    const SLUG = { thermostat_wiring: "thermostat", wire_it_up: "wireitup", braze_master: "braze", gauge_reader: "gauges", leak_hunter: "leak", vacuum_pump_rush: "vacuum", rooftop_run: "rooftop", boss_rush: "boss" };
    const call = async c => { R.body.innerHTML = `<div class="bo-call"><div class="bo-scene">${TG.ART ? TG.ART.cover(SLUG[(c.games || [])[0]] || "boss") : ""}<span class="bo-callno">${L("CALL", "LLAMADA")} ${ci + 1}/${calls.length}</span><span class="bo-addr">${["1418 Maple Ct", "77 Ridge Rd", "302 Cedar Ln", "9 Willow Way", "550 Oak St", "21 Birch Dr"][(ci + hashN(c.id)) % 6]}</span></div><div class="bo-clock"><i id="boClk"></i></div><div class="bo-boss">${avatarSVG(OLD_TIMER, 64, { mode: "bust" })}<div class="bo-bubble">${esc(tx(c.symptom))}</div></div><div id="boQ" class="bo-qbox"></div></div>`; Sound.sfx("boss");
      const first = brReviewBank().find(q => q.key === `bo:${c.id}`); 
      await askMC(first, L("First check", "Primera revisión")); if (R.over) return;
      const pool = shuf(c.games.flatMap(g => bossPool(g))).slice(0, 2);
      for (const q of pool) { await askMC(q, L("Rapid fire", "Rápido")); if (R.over) return; }
      R.boardEnd({ speed: false }); ci++; setTimeout(next, 450); };
    const b = S.tg.boss_rush || {}, wk = weekKey(), best = b.week === wk ? b.weekScores || [] : [];
    TG.intro(R, `<div class="bo-intro">${avatarSVG(OLD_TIMER, 110)}</div><h3>${esc(tx(BR.name))}</h3><p class="sm">${L("Five calls from the Old Timer. First check, then rapid fire from every game. Three hearts. Same calls for everyone today.", "Cinco llamadas del Veterano. Primera revisión y luego rápido de todos los juegos. Tres vidas. Las mismas llamadas para todos hoy.")}</p>
      <div class="bo-week"><b>${L("This week's best", "Mejores de la semana")}</b>${best.length ? best.map((x, i) => `<span><i>${i + 1}</i> ${x.s}</span>`).join("") : `<span class="muted empty-quip">${L("No records yet. The Old Timer is still waiting on his coffee.", "Sin récords todavía. El Veterano sigue esperando su café.")}</span>`}</div>`, null, next);
  }

  const art = inner => s => `<svg class="tg-art-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  TG.register({ id: "leak_hunter", slug: "leak", order: 5, tag: { en: "Tools, N₂ test, sweep", es: "Herramientas, N₂, búsqueda" }, run: leak, reviewBank: lhReviewBank,
    art: art(`<circle cx="26" cy="26" r="14"/><path d="M36 36l16 16"/><path class="ac" d="M20 26c2-4 6-6 10-4"/><circle class="ac2" cx="48" cy="16" r="3"/><circle class="ac2" cx="54" cy="24" r="2"/>`) });
  TG.register({ id: "vacuum_pump_rush", slug: "vacuum", order: 6, tag: { en: "Microns, decay test", es: "Micrones, prueba de caída" }, run: vacuum, reviewBank: vpReviewBank,
    art: art(`<rect x="6" y="30" width="34" height="22" rx="4"/><circle cx="16" cy="56" r="3"/><circle cx="32" cy="56" r="3"/><path d="M40 40h8c4 0 6-2 6-6V14"/><rect class="ac" x="46" y="6" width="16" height="10" rx="2"/><path class="ac2" d="M12 38h10"/>`) });
  TG.register({ id: "rooftop_run", slug: "rooftop", order: 7, tag: { en: "OSHA calls, RTU air path", es: "OSHA, ruta de aire RTU" }, run: rooftop, reviewBank: rrReviewBank,
    art: art(`<path d="M4 44h56"/><rect x="30" y="24" width="24" height="20" rx="2"/><path d="M34 30h16M34 36h16"/><path class="ac" d="M10 44l6-14 4 6 4-10"/><path class="ac2" d="M4 50h8M18 50h8M32 50h8M46 50h8"/>`) });
  TG.register({ id: "boss_rush", slug: "boss", order: 8, tag: { en: "5 calls, 3 hearts", es: "5 llamadas, 3 vidas" }, run: boss, reviewBank: brReviewBank,
    art: art(`<path d="M14 30c0-10 8-18 18-18s18 8 18 18"/><path d="M10 30h44v6H10z"/><path class="ac" d="M22 44c3 3 7 4 10 4s7-1 10-4"/><path class="ac2" d="M24 40h4M36 40h4"/>`) });
})();
