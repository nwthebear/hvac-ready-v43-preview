/* TRAINING GAMES 1-2: Thermostat Wiring (unlock Gopher) and Wire It Up (unlock Apprentice Tech).
   Drag each wire to a terminal (magnetic snap), set the drawer, hit Power On / Energize. The check walks the wires in order:
   right ones score with a rising snap, the first wrong one shows what the equipment would do, then the learn card.
   Content: GAMES_DATA thermostat_wiring / wire_it_up (scenarios, mistakes, sources). */
(function () {
  const A = window.App, S = A.S, esc = A.esc, TG = A.TG, $ = s => document.querySelector(s), L = TG.L;
  const TW = TG.game("thermostat_wiring"), WU = TG.game("wire_it_up"), GEN = TW.generic, WGEN = WU.generic;
  const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
  const hashN = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const fmt = (o, v) => tx(o).replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : "");

  /* ===================== THERMOSTAT WIRING ===================== */
  const TERMS = TW.terminalsOnTrainerThermostat; /* Rc Rh C G Y1 Y2 W1 W2 AUX E O/B S PEK/K */
  const DEFKEY = { Rc: "Rc", Rh: "Rh", R: "R", C: "C", G: "G", Y: "Y/Y1", Y1: "Y/Y1", Y2: "Y2", W: "W/W1", W1: "W/W1", W2: "W2", AUX: "AUX", E: "E", "O/B": "O/B", O: "O/B", B: "O/B", S: "S", "PEK/K": "K/PEK" };
  const def = k => TW.terminalDefinitions[DEFKEY[k] || k];
  const lbl = w => w === "(spare)" ? L("spare", "libre") : w;
  /* correct map for a scenario (tw11: one adapter style chosen per board) */
  const mapOf = s => { if (s.id !== "tw11") return s.correctMap; return { R: "Rc", W: "W1", G: "C", Y: "PEK/K" }; };
  const expSet = s => { const st = s.settings || {}, wires = s.wiresAtWall.map(w => w.label);
    const system = /dual/.test(JSON.stringify(st)) || st.backup ? "dualfuel" : st.system === "heat pump" ? "heatpump" : "conventional";
    return { jumper: wires.includes("Rh") && wires.includes("Rc") ? "open" : "closed", system, ob: st.o_b ? st.o_b[0] : null, stages: (st.heatStages === 2 || st.coolStages === 2) ? 2 : 1 }; };
  const relevant = s => { const e = expSet(s); return { jumper: e.jumper === "open", system: e.system !== "conventional", ob: !!e.ob, stages: e.stages === 2 }; };

  function twReviewBank() {
    const out = [];
    TW.scenarios.forEach(s => { const m = mapOf(s), title = s.title;
      Object.entries(m).forEach(([w, term]) => { const wrongs = uniq((s.mistakes || []).map(x => x.wrong[w]).filter(x => x && TERMS.includes(x)));
        const pool = TERMS.filter(x => x !== term && !wrongs.includes(x)), h = hashN(s.id + w), opts = [term, ...wrongs.slice(0, 2)];
        for (let i = 0; opts.length < 4; i++) opts.push(pool[(h + i * 5) % pool.length]); const o = uniq(opts).slice(0, 4);
        out.push(TG.mkQ(`${title.en}: the wall wire "${lbl(w)}" lands on which trainer terminal?`, `${title.es}: ¿en qué terminal va el cable "${lbl(w)}"?`, o.map(x => ({ en: x, es: x })), 0, s.learn, s.sources, { key: `tw:${s.id}:${w}` })); });
      const e = expSet(s), r = relevant(s);
      if (r.jumper) out.push(TG.mkQ(`${title.en}: Rc-Rh jumper/slider?`, `${title.es}: ¿puente Rc-Rh?`, [TW.settingsLabels.open, TW.settingsLabels.closed], 0, s.learn, s.sources, { key: `tw:${s.id}:jumper` }));
      if (r.ob) out.push(TG.mkQ(`${title.en}: set the O/B changeover to?`, `${title.es}: ¿O/B en?`, [{ en: e.ob, es: e.ob }, { en: e.ob === "O" ? "B" : "O", es: e.ob === "O" ? "B" : "O" }], 0, s.learn, s.sources, { key: `tw:${s.id}:ob` }));
      if (r.system) out.push(TG.mkQ(`${title.en}: equipment type setting?`, `${title.es}: ¿tipo de equipo?`, [TW.settingsLabels[e.system], TW.settingsLabels.conventional, TW.settingsLabels[e.system === "heatpump" ? "dualfuel" : "heatpump"]], 0, s.learn, s.sources, { key: `tw:${s.id}:system` }));
      (s.traps || []).forEach((tp, i) => out.push(TG.mkQ(`Would you do this? ${tp.q.en}`, `¿Lo harías? ${tp.q.es}`, [{ en: "No, don't", es: "No" }, { en: "Yes, do it", es: "Sí" }], 0, tp.explain, tp.sources, { key: `tw:${s.id}:trap${i}` })));
      (s.boards || []).forEach(b => out.push(TG.mkQ(`Board check: which thermostat wires land at a ${b.unit.en.toLowerCase()}? (${b.diagram.en})`, `Revisión: ¿qué cables llegan a ${b.unit.es.toLowerCase()}? (${b.diagram.es})`,
        [{ en: b.need.join(", "), es: b.need.join(", ") }, { en: b.id === "hp" ? "Y, C" : "R, C, Y, O/B, W2", es: b.id === "hp" ? "Y, C" : "R, C, Y, O/B, W2" }, { en: "R, C, G, W1", es: "R, C, G, W1" }], 0, s.learn, b.sources, { key: `tw:tw12:${b.id}` })));
    });
    return out; }
  const twQ = key => twReviewBank().find(q => q.key === key);

  const houseSVG = () => `<svg class="tw-house" viewBox="0 0 150 92" aria-hidden="true">
    <path class="hs-line" d="M8 44L46 14l38 30v42H8z M30 86V62h14v24"/><rect class="hs-line" x="54" y="54" width="22" height="30" rx="2"/><g class="hs-flame"><path d="M65 76c-5-4-2-9 0-12 1 4 4 4 4 8 0 3-2 4-4 4z"/></g>
    <g class="hs-blower" transform="translate(65 62)"><circle r="6" class="hs-line"/><g class="hs-blades"><path d="M0-5v10M-5 0h10"/></g></g>
    <rect class="hs-line" x="100" y="58" width="40" height="28" rx="3"/><g class="hs-ofan" transform="translate(120 72)"><circle r="10" class="hs-line"/><g class="hs-blades"><path d="M0-9v18M-9 0h18M-6-6l12 12M6-6l-12 12"/></g></g>
    <g class="hs-air hs-cold"><path d="M20 38q6-4 12 0t12 0"/><path d="M22 30q6-4 12 0t12 0"/></g><g class="hs-air hs-warm"><path d="M20 38q6-4 12 0t12 0"/><path d="M22 30q6-4 12 0t12 0"/></g>
    <g class="hs-fuse" transform="translate(65 50)"><path d="M-8-6l4 4-3 2 6 6M4-8l-2 5 4 1-3 6"/></g><g class="hs-x"><path d="M100 20l16 16M116 20l-16 16"/></g></svg>`;

  function thermostat() {
    const R = new TG.Round({ id: "thermostat_wiring" });
    const boards = TG.draw(TW.scenarios, R.id, 4); let bi = 0;
    const hudM = $("#tgHudM"); hudM.innerHTML = `<span class="tg-bust">${avatarSVG(S.avatar, 40, { mode: "bust" })}</span><span class="tg-prog" id="twProg"></span>`;
    const av = $("#tgAv"); av.remove(); hudM.querySelector(".tg-bust").id = "tgAv";
    const prog = () => { $("#twProg").innerHTML = boards.map((b, i) => `<i class="${i < bi ? "done" : i === bi ? "cur" : ""}"></i>`).join(""); };
    const next = () => { if (R.over) return; if (bi >= boards.length) return R.end(true); prog(); const s = boards[bi]; R.boardStart(); (s.boards ? boardCheck : wireBoard)(s); };
    let advAt = -1; const advance = () => { if (advAt === bi) return; advAt = bi; bi++; setTimeout(next, 900); };
    const head = s => `<div class="tg-head"><span class="tg-lv-chip">${L("Lv", "Nv")} ${s.level}</span><b>${esc(tx(s.title))}</b><p class="sm muted">${esc(tx(s.system))}</p></div>`;

    function wireBoard(s) {
      const map = mapOf(s), exp = expSet(s), rel = relevant(s), conn = {}, scored = new Set(), set = { jumper: "closed", system: "conventional", ob: "O", stages: 1 }; let checking = false, firstTry = true;
      R.el.classList.remove("checking"); const SL = TW.settingsLabels; TG.qaCur = { kind: "tw", map, exp, rel };
      R.body.innerHTML = `${head(s)}<div class="tw-board" id="twB"><svg class="tg-wires" id="twSvg"></svg>
        <div class="tw-wall"><div class="tw-cap">${L("Old base", "Base vieja")}</div><div class="tw-hole" aria-hidden="true"></div>${s.wiresAtWall.map((w, i) => `<div class="tw-wire art" data-w="${esc(w.label)}" style="--wc:${TG.wireHex(w.color.split(" ")[0])}"><span class="tw-tagw"><span class="tw-tag">${esc(lbl(w.label))}</span><small>${esc(w.color)}</small></span>${TG.ART.curl(i)}</div>`).join("")}</div>
        <div class="tw-stat art"><div class="tw-cap">${L("New thermostat", "Termostato nuevo")}</div><div class="tw-sub"><span class="tw-sub-slot l"></span><span class="tw-sub-slot r"></span><span class="tw-sub-lvl"><i></i></span><div class="tw-terms">${TERMS.map(x => `<div class="tw-term" data-t="${x}"><i></i><b>${x}</b></div>`).join("")}</div><span class="tw-sub-brand">HVAC·PRO</span></div></div></div>
        <div class="tw-drawer">
          <div class="tw-set"><span>${tx(SL.rJumper)}</span><div class="seg sm" data-set="jumper"><button data-v="closed" class="sel">${tx(SL.closed)}</button><button data-v="open">${tx(SL.open)}</button></div></div>
          <div class="tw-set"><span>${tx(SL.system)}</span><div class="seg sm" data-set="system"><button data-v="conventional" class="sel">${tx(SL.conventional)}</button><button data-v="heatpump">${tx(SL.heatpump)}</button><button data-v="dualfuel">${tx(SL.dualfuel)}</button></div></div>
          <div class="tw-set two"><div><span>${tx(SL.ob)}</span><div class="seg sm" data-set="ob"><button data-v="O" class="sel">O</button><button data-v="B">B</button></div></div><div><span>${tx(SL.stages)}</span><div class="seg sm" data-set="stages"><button data-v="1" class="sel">1H/1C</button><button data-v="2">2H/2C</button></div></div></div></div>
        <div class="tw-foot">${TG.ART.house()}<div class="tw-out" id="twOut"></div><button class="btn primary big tw-power" id="twGo">${ico("bolt", 20)} ${L("Power On", "Encender")}</button></div>`;
      const B = $("#twB"), svg = $("#twSvg"), stat = svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g")), house = R.body.querySelector(".tw-house"), out = $("#twOut");
      const wires = [...B.querySelectorAll(".tw-wire")], terms = [...B.querySelectorAll(".tw-term")];
      const obSeg = R.body.querySelector('[data-set="ob"]'); const syncOb = () => obSeg.classList.toggle("dis", set.system === "conventional"); syncOb();
      R.body.querySelectorAll(".tw-drawer .seg").forEach(sg => sg.querySelectorAll("button").forEach(b => b.onclick = () => { if (checking) return; sg.querySelectorAll("button").forEach(x => x.classList.toggle("sel", x === b)); const k = sg.dataset.set; set[k] = k === "stages" ? +b.dataset.v : b.dataset.v; if (k === "system") syncOb(); }));
      const W = TG.wiring({ root: B, svg, srcSide: "r", tgtSide: "l", sources: wires.map(el => ({ el, id: el.dataset.w, color: s.wiresAtWall.find(w => w.label === el.dataset.w).color.split(" ")[0] })), targets: terms.map(el => ({ el, id: el.dataset.t })),
        canDrag: () => !checking, onPick: w => { if (conn[w]) { delete conn[w]; draw(); } },
        onDrop: (w, term, wEl, tEl) => { Object.keys(conn).forEach(k => { if (conn[k] === term && k !== w) delete conn[k]; }); conn[w] = term; draw(); Sound.sfx("snap", { pitch: 0.9 + Object.keys(conn).length * 0.04 }); TG.buzz("tap");
          tEl.classList.remove("snapped"); void tEl.offsetWidth; tEl.classList.add("snapped"); } });
      function draw() { stat.innerHTML = Object.entries(conn).map(([w, term]) => { const a = W.anchorOf(B.querySelector(`.tw-wire[data-w="${CSS.escape(w)}"]`), "r"), b = W.anchorOf(B.querySelector(`.tw-term[data-t="${CSS.escape(term)}"]`), "l");
          return TG.wireSvgPath(s.wiresAtWall.find(x => x.label === w).color.split(" ")[0], TG.cablePath(a.x, a.y, b.x, b.y), scored.has(w) ? "ok" : ""); }).join("");
        terms.forEach(el => el.classList.toggle("on", Object.values(conn).includes(el.dataset.t))); wires.forEach(el => el.classList.toggle("on", !!conn[el.dataset.w])); }
      const ro = new ResizeObserver(() => draw()); ro.observe(B); R.stops.push(() => ro.disconnect());
      const showOut = (k, ok) => { house.setAttribute("class", "tw-house " + k); out.innerHTML = `<span class="${ok ? "ok" : "bad"}">${esc(tx(GEN.outcomes[k] || GEN.outcomes.wrong))}</span>`; };
      const outcomeFor = (w, term) => { const wl = w.replace(/\(spare\)/, "spare"); if ((/^R/.test(wl) && term === "C") || (wl === "C" && /^R/.test(term))) return "fuse";
        if (/^W/.test(wl) && term === "Y1") return "heatCallOutdoor"; if (wl === "Y" && term === "G") return "onlyFan"; if (wl === "E" && /^Y/.test(term)) return "compOnE"; return "wrong"; };
      const wireCard = (w, term) => { const m = (s.mistakes || []).find(x => x.wrong[w] === term), right = map[w];
        const why = m ? tx(m.explain) : `${lbl(w)} = ${tx(def(w === "(spare)" ? "C" : w)) || lbl(w)}. ${term} = ${tx(def(term))}.${w !== right && s.wiresAtWall.find(x => x.label === w).color !== ({ R: "red", G: "green", Y: "yellow", W: "white" })[w] ? " " + tx(GEN.byLetter) : ""}`;
        return { did: L(`You landed the ${lbl(w)} wire on ${term}. It goes on ${right}.`, `Pusiste el cable ${lbl(w)} en ${term}. Va en ${right}.`), why, rule: tx(s.learn), sources: uniq([...(m ? m.sources : []), ...s.sources]), q: twQ(`tw:${s.id}:${w}`), outcome: tx(GEN.outcomes[outcomeFor(w, term)]), shakeEl: B }; };
      const setCard = k => { let m = null, g = null, outc = "wrong"; const sl = TW.settingsLabels;
        if (k === "jumper") { m = (s.mistakes || []).find(x => x.wrong.rJumper); g = exp.jumper === "closed" ? GEN.jumperClosed : null; outc = "nothing"; }
        if (k === "ob") { m = (s.mistakes || []).find(x => x.wrong.o_b); if (!m) { const o = TW.scenarios.find(x => x.id === (exp.ob === "O" ? "tw07" : "tw08")); m = o.mistakes.find(x => x.wrong.o_b); } outc = "coldInHeat"; }
        if (k === "system") { m = (s.mistakes || []).find(x => x.wrong.system); g = exp.system === "heatpump" ? GEN.systemHP : exp.system === "dualfuel" ? GEN.systemDual : GEN.systemConv; if (m && exp.system !== "heatpump") m = null; }
        if (k === "stages") g = GEN.stages;
        const val = { jumper: tx(sl[set.jumper]), system: tx(sl[set.system]), ob: set.ob, stages: set.stages + "H/" + set.stages + "C" }[k], want = { jumper: tx(sl[exp.jumper]), system: tx(sl[exp.system]), ob: exp.ob, stages: exp.stages + "H/" + exp.stages + "C" }[k];
        const name = { jumper: tx(sl.rJumper), system: tx(sl.system), ob: tx(sl.ob), stages: tx(sl.stages) }[k];
        return { did: L(`${name}: you set ${val}. This system needs ${want}.`, `${name}: pusiste ${val}. Este sistema necesita ${want}.`), why: tx((m || g).explain), rule: tx(s.learn), sources: uniq([...(m || g).sources, ...s.sources]), q: twQ(`tw:${s.id}:${k}`) || twQ(`tw:${s.id}:${Object.keys(map)[0]}`), outcome: tx(GEN.outcomes[outc]), shakeEl: R.body.querySelector(".tw-drawer") }; };
      const t0 = performance.now();
      $("#twGo").onclick = async () => {
        if (checking) return; const missing = s.wiresAtWall.filter(w => !conn[w.label]);
        if (missing.length) { Sound.sfx("tap"); missing.forEach(w => { const el = B.querySelector(`.tw-wire[data-w="${CSS.escape(w.label)}"]`); el.classList.remove("nudge"); void el.offsetWidth; el.classList.add("nudge"); }); out.innerHTML = `<span class="bad">${L("Land every wire first", "Conecta todos los cables")}</span>`; return; }
        checking = true; R.el.classList.add("checking"); Sound.sfx("clunk"); house.setAttribute("class", "tw-house checking");
        const order = s.wiresAtWall.map(w => w.label), wait = ms => new Promise(r => setTimeout(r, ms));
        for (const w of order) { if (R.over) return; const term = conn[w], ok = term === map[w], tEl = B.querySelector(`.tw-term[data-t="${CSS.escape(term)}"]`);
          if (scored.has(w) && ok) continue; await wait(150);
          if (ok) { scored.add(w); draw(); const r = W.rel(tEl); R.hit({ quiet: true, x: r.x + 10, y: r.y + B.offsetTop - 20 }); tEl.classList.add("good"); continue; }
          const card = wireCard(w, term); showOut(outcomeFor(w, term), false); if (outcomeFor(w, term) === "fuse") Sound.sfx("pop"); else Sound.sfx("spark");
          firstTry = false; await R.miss(card); if (R.over) return; delete conn[w]; draw(); tEl.classList.remove("good"); house.setAttribute("class", "tw-house"); out.innerHTML = ""; checking = false; R.el.classList.remove("checking"); return; }
        for (const k of ["jumper", "system", "ob", "stages"]) { if (R.over) return; if (k === "ob" && !exp.ob) continue;
          const ok = set[k] === exp[k]; if (ok) { if (rel[k] && !scored.has("set:" + k)) { scored.add("set:" + k); await wait(120); R.hit({ quiet: true, label: L("setup", "ajuste") }); } continue; }
          const card = setCard(k); showOut(k === "ob" ? "coldInHeat" : k === "jumper" ? "nothing" : "wrong", false); Sound.sfx("spark"); firstTry = false; await R.miss(card); if (R.over) return;
          house.setAttribute("class", "tw-house"); out.innerHTML = ""; checking = false; R.el.classList.remove("checking"); return; }
        /* passes: the house runs */
        const runs = exp.system === "conventional" ? (Object.values(map).some(x => /^Y/.test(x)) ? "cool" : "heat") : "hp"; showOut("ok", true); house.setAttribute("class", "tw-house run " + runs);
        const fan = Sound.loop("fan", 0.7); setTimeout(() => fan.stop(0.4), 1500); if (runs === "heat") Sound.sfx("ignite");
        await wait(500);
        for (const tp of (s.traps || [])) { if (R.over) return; const ans = await trapCard(tp); if (ans) R.hit({ label: L("good call", "bien") }); else { firstTry = false; await R.miss({ did: L(`You chose to: ${tx(tp.q).replace(/\.$/, "")}.`, `Elegiste: ${tx(tp.q).replace(/\.$/, "")}.`), why: tx(tp.explain), rule: tx(s.learn), sources: uniq([...tp.sources, ...s.sources]), q: twQ(`tw:${s.id}:trap${s.traps.indexOf(tp)}`) }); } }
        if (R.over) return; const clean = R.boardEnd();
        if (clean && s.id === "tw04") setTimeout(() => R.bonus(250, L("Colors Lie", "Colores engañan")), 700);
        if (clean && performance.now() - t0 < 20000) setTimeout(() => R.bonus(150, L("One-Take Install", "Instalación a la primera")), 1000);
        advance(); };
    }
    function trapCard(tp) { return new Promise(res => { const d = document.createElement("div"); d.className = "tg-trap"; d.innerHTML = `<div class="tg-trap-in"><small>${L("Would you do this?", "¿Lo harías?")}</small><p>${esc(tx(tp.q))}</p><div class="row gap"><button class="btn big" data-a="1">${ico("check", 18)} ${L("Do it", "Hacerlo")}</button><button class="btn big primary" data-a="0">${ico("close", 18)} ${L("Don't", "No")}</button></div></div>`;
      R.el.appendChild(d); requestAnimationFrame(() => d.classList.add("open")); Sound.sfx("whoosh");
      d.querySelectorAll("[data-a]").forEach(b => b.onclick = () => { d.classList.remove("open"); setTimeout(() => d.remove(), 220); res(b.dataset.a === "0"); }); }); }

    function boardCheck(s) {
      const list = TG.shuffle(s.boards).slice(0, 2); let k = 0;
      const one = () => { if (R.over) return; if (k >= list.length) { R.boardEnd(); return advance(); } const b = list[k], picked = new Set(); TG.qaCur = { kind: "bc", need: b.need };
        R.body.innerHTML = `${head(s)}<div class="bc-unit ${b.id}">${b.id === "hp" ? `<svg viewBox="0 0 120 80" class="bc-art"><rect x="10" y="10" width="100" height="62" rx="6"/><circle cx="60" cy="41" r="22"/><path d="M60 22v38M41 41h38"/><path class="bc-snow" d="M96 18l-6 6M90 18l6 6"/><path class="bc-sun" d="M22 20a5 5 0 1 0 0.1 0"/></svg>` : `<svg viewBox="0 0 120 80" class="bc-art"><rect x="10" y="10" width="100" height="62" rx="6"/><circle cx="60" cy="41" r="22"/><path d="M60 22v38M41 41h38"/><path class="bc-snow" d="M96 18l-6 6M90 18l6 6"/></svg>`}
          <div><b>${esc(tx(b.unit))}</b><p class="sm tw-diagram">${ico("list", 14)} ${esc(tx(b.diagram))}</p></div></div>
          <p class="sm muted">${L("Tap every thermostat wire that lands at this outdoor unit.", "Toca cada cable del termostato que llega a esta unidad exterior.")}</p>
          <div class="bc-chips">${b.options.map(o => `<button class="bc-chip" data-o="${o}"><b>${o}</b><small>${esc(tx(def(o)) || "")}</small></button>`).join("")}</div>
          <button class="btn primary big full" id="bcGo">${ico("check", 18)} ${L("Land them", "Conectar")}</button>`;
        R.body.querySelectorAll(".bc-chip").forEach(c => c.onclick = () => { const o = c.dataset.o; if (picked.has(o)) picked.delete(o); else picked.add(o); c.classList.toggle("on", picked.has(o)); Sound.sfx("snap", { pitch: 0.9 + picked.size * 0.06 }); TG.buzz("tap"); });
        $("#bcGo").onclick = async () => { const need = new Set(b.need), extra = [...picked].filter(x => !need.has(x)), miss = b.need.filter(x => !picked.has(x));
          for (const o of b.need.filter(x => picked.has(x))) { await new Promise(r => setTimeout(r, 110)); const c = R.body.querySelector(`.bc-chip[data-o="${CSS.escape(o)}"]`); c.classList.add("good"); R.hit({ quiet: true }); }
          if (extra.length || miss.length) { const m = extra.includes("R") && b.id === "ac" ? (s.mistakes || [])[0] : miss.length && b.id === "hp" ? s.mistakes[1] : null;
            const why = m ? tx(m.explain) : extra.map(x => `${x} = ${tx(def(x))}.`).join(" ") + " " + tx(s.learn);
            await R.miss({ did: L(`You landed ${[...picked].join(", ") || "nothing"}. This unit needs ${b.need.join(", ")}.`, `Conectaste ${[...picked].join(", ") || "nada"}. Esta unidad necesita ${b.need.join(", ")}.`), why, rule: tx(s.learn), sources: uniq([...(m ? m.sources : []), ...b.sources, ...s.sources]), q: twQ(`tw:tw12:${b.id}`) }); }
          k++; setTimeout(one, 400); }; };
      one(); }
    TG.intro(R, `<div class="tg-intro-art">${TG.byId.thermostat_wiring.art(84)}</div><h3>${esc(tx(TW.name))}</h3><p class="sm">${L("The old thermostat is coming off the wall. Drag each wire to the new base, set the installer drawer, then Power On. Go by the letter, never the color.", "El termostato viejo sale de la pared. Arrastra cada cable a la base nueva, ajusta el cajón de instalador y enciende. Guíate por la letra, nunca por el color.")}</p><p class="sm muted">${L("Power is off at the equipment before you touch wires.", "La energía está apagada en el equipo antes de tocar cables.")}</p>`, null, next);
  }

  /* ===================== WIRE IT UP ===================== */
  const PANEL = ["L1", "L2", "T1", "T2", "coil", "cap HERM", "cap FAN", "cap C"];
  const leadName = k => tx(WU.leadNames[k]) || k, tName = k => ({ coil: L("Coil", "Bobina"), "cap HERM": "HERM", "cap FAN": "FAN", "cap C": "C" })[k] || k;
  const LEAD_COLOR = { Y: "yellow", C: "blue", "supply leg 1": "black", "supply leg 2": "red", "compressor C": "black", "compressor S": "orange", "compressor R": "red", "cap C": "brown", "fan common lead": "white", "fan run lead": "purple", "fan cap lead": "brown" };
  function wuReviewBank() { const out = [];
    WU.scenarios.forEach(s => { if (s.id === "wu03") { out.push(TG.mkQ(`Ohm readings 1-2 = 0.9, 1-3 = 2.6, 2-3 = 3.5. Which terminal is common?`, `Lecturas 1-2 = 0.9, 1-3 = 2.6, 2-3 = 3.5. ¿Cuál es común?`, ["1", "2", "3"].map(x => ({ en: x, es: x })), 0, s.rule, s.sources, { key: "wu:wu03" })); return; }
      if (s.id === "wu05") { out.push(TG.mkQ(s.task.en, s.task.es, [{ en: "No: lock out and test", es: "No: bloquea y prueba" }, { en: "Yes, it's open", es: "Sí, está abierto" }], 0, (s.mistakes || [])[0].explain, s.sources, { key: "wu:wu05" })); return; }
      Object.entries(s.correct).forEach(([k, v]) => { const wr = uniq((s.mistakes || []).map(m => m.wrong[k]).filter(Boolean)), pool = PANEL.filter(x => x !== v && x !== k && !wr.includes(x)), h = hashN(s.id + k), o = [v, ...wr]; for (let i = 0; o.length < 4; i++) o.push(pool[(h + i * 3) % pool.length]);
        out.push(TG.mkQ(`${s.title.en}: where does "${WU.leadNames[k].en}" land?`, `${s.title.es}: ¿dónde va "${WU.leadNames[k].es}"?`, uniq(o).slice(0, 4).map(x => ({ en: x, es: x })), 0, s.note || s.rule || ((s.mistakes || [])[0] || {}).explain || WU.components.compressor.note, s.sources, { key: `wu:${s.id}:${k}` })); });
      (s.traps || []).forEach((tp, i) => out.push(TG.mkQ(`Would you do this? ${tp.q.en}`, `¿Lo harías? ${tp.q.es}`, [{ en: "No, don't", es: "No" }, { en: "Yes, do it", es: "Sí" }], 0, tp.explain, tp.sources, { key: `wu:${s.id}:trap${i}` }))); });
    return out; }
  const wuQ = key => wuReviewBank().find(q => q.key === key);
  const panelSVG = () => `<svg class="wu-art" viewBox="0 0 200 64" aria-hidden="true"><g class="wu-comp"><rect x="6" y="8" width="54" height="50" rx="10"/><path d="M18 24h30M18 34h30M18 44h30"/></g><g class="wu-fan"><circle cx="160" cy="33" r="26"/><g class="wu-blades"><path d="M160 9v48M136 33h48M143 16l34 34M177 16l-34 34"/></g></g><path class="wu-spark" d="M96 12l-8 18h10l-8 22"/></svg>`;
  function wireItUp() {
    const R = new TG.Round({ id: "wire_it_up" }); const boards = TG.draw(WU.scenarios, R.id, 4); let bi = 0;
    const hudM = $("#tgHudM"); hudM.innerHTML = `<span class="tg-bust" id="tgAvB">${avatarSVG(S.avatar, 40, { mode: "bust" })}</span><span class="tg-prog" id="wuProg"></span>`; $("#tgAv").remove(); $("#tgAvB").id = "tgAv";
    const prog = () => { $("#wuProg").innerHTML = boards.map((b, i) => `<i class="${i < bi ? "done" : i === bi ? "cur" : ""}"></i>`).join(""); };
    const head = s => `<div class="tg-head"><span class="tg-lv-chip">${L("Lv", "Nv")} ${s.level}</span><b>${esc(tx(s.title))}</b><p class="sm muted">${esc(tx(s.task))}</p></div>`;
    const next = () => { if (R.over) return; if (bi >= boards.length) return R.end(true); prog(); const s = boards[bi]; R.boardStart(); (s.id === "wu03" ? ohms : s.id === "wu05" ? safety : board)(s); };
    let advAt = -1; const advance = () => { if (advAt === bi) return; advAt = bi; bi++; setTimeout(next, 900); };
    function board(s) {
      const leads = Object.keys(s.correct), targets = uniq(Object.values(s.correct).concat(PANEL.filter(x => !leads.includes(x)))).filter(x => !leads.includes(x)), conn = {}, scored = new Set(); let checking = false;
      const order = PANEL.filter(x => targets.includes(x)); TG.qaCur = { kind: "wu", correct: s.correct };
      R.body.innerHTML = `${head(s)}<div class="tw-board wu-board" id="wuB"><svg class="tg-wires" id="wuSvg"></svg>
        <div class="tw-wall"><div class="tw-cap">${L("Leads", "Cables")}</div><div class="tw-hole conduit" aria-hidden="true"></div>${leads.map((k, i) => `<div class="tw-wire art" data-w="${esc(k)}" style="--wc:${TG.wireHex(LEAD_COLOR[k])}"><span class="tw-tagw"><span class="tw-tag sm">${esc(leadName(k))}</span></span>${TG.ART.curl(i + 2)}</div>`).join("")}</div>
        <div class="wu-panel art"><div class="tw-cap">${L("Control panel", "Panel de control")}</div>
          <div class="wu-blk wu-contactor"><span class="wu-name">${L("Contactor", "Contactor")}</span><span class="wu-coilwin" aria-hidden="true">24V</span>${order.filter(x => ["L1", "L2", "T1", "T2", "coil"].includes(x)).map(x => `<div class="tw-term wu-term" data-t="${x}"><i></i><b>${tName(x)}</b></div>`).join("")}</div>
          <div class="wu-blk wu-cap"><span class="wu-name">${L("Dual run cap", "Capacitor dual")}</span><span class="wu-capspec" aria-hidden="true">45+5 µF · 440 VAC</span>${order.filter(x => /^cap/.test(x)).map(x => `<div class="tw-term wu-term" data-t="${x}"><i></i><b>${tName(x)}</b></div>`).join("")}</div></div></div>
        <div class="tw-foot">${panelSVG()}<div class="tw-out" id="wuOut"></div><button class="btn primary big tw-power" id="wuGo">${ico("bolt", 20)} ${L("Energize", "Energizar")}</button></div>`;
      const B = $("#wuB"), svg = $("#wuSvg"), stat = svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g")), art = R.body.querySelector(".wu-art"), out = $("#wuOut");
      const wires = [...B.querySelectorAll(".tw-wire")], terms = [...B.querySelectorAll(".tw-term")];
      const W = TG.wiring({ root: B, svg, srcSide: "r", tgtSide: "l", sources: wires.map(el => ({ el, id: el.dataset.w, color: LEAD_COLOR[el.dataset.w] })), targets: terms.map(el => ({ el, id: el.dataset.t })), canDrag: () => !checking,
        onPick: k => { if (conn[k]) { delete conn[k]; draw(); } }, onDrop: (k, term, wEl, tEl) => { conn[k] = term; draw(); Sound.sfx("snap", { pitch: 0.85 + Object.keys(conn).length * 0.04 }); TG.buzz("tap"); tEl.classList.remove("snapped"); void tEl.offsetWidth; tEl.classList.add("snapped"); } });
      function draw() { const cnt = {}; stat.innerHTML = Object.entries(conn).map(([k, term]) => { cnt[term] = (cnt[term] || 0) + 1; const a = W.anchorOf(B.querySelector(`.tw-wire[data-w="${CSS.escape(k)}"]`), "r"), b = W.anchorOf(B.querySelector(`.tw-term[data-t="${CSS.escape(term)}"]`), "l");
          return TG.wireSvgPath(LEAD_COLOR[k], TG.cablePath(a.x, a.y, b.x, b.y + (cnt[term] - 1) * 5 - 4), scored.has(k) ? "ok" : ""); }).join("");
        terms.forEach(el => el.classList.toggle("on", Object.values(conn).includes(el.dataset.t))); wires.forEach(el => el.classList.toggle("on", !!conn[el.dataset.w])); }
      const ro = new ResizeObserver(() => draw()); ro.observe(B); R.stops.push(() => ro.disconnect());
      const outcome = (k, term) => (/^(Y|C)$/.test(k) && /^(L|T)/.test(term)) ? "fuse" : (/supply/.test(k) && term === "coil") ? "trip" : (/^(cap C|compressor S)$/.test(k)) ? "hum" : null;
      $("#wuGo").onclick = async () => { if (checking) return; const missing = leads.filter(k => !conn[k]);
        if (missing.length) { Sound.sfx("tap"); missing.forEach(k => { const el = B.querySelector(`.tw-wire[data-w="${CSS.escape(k)}"]`); el.classList.remove("nudge"); void el.offsetWidth; el.classList.add("nudge"); }); out.innerHTML = `<span class="bad">${L("Land every lead first", "Conecta todos los cables")}</span>`; return; }
        checking = true; Sound.sfx("clunk"); const wait = ms => new Promise(r => setTimeout(r, ms));
        for (const k of leads) { if (R.over) return; const term = conn[k], ok = term === s.correct[k], tEl = B.querySelector(`.tw-term[data-t="${CSS.escape(term)}"]`); if (scored.has(k) && ok) continue; await wait(140);
          if (ok) { scored.add(k); draw(); const r = W.rel(tEl); R.hit({ quiet: true, x: r.x, y: r.y + B.offsetTop - 20 }); tEl.classList.add("good"); continue; }
          const m = (s.mistakes || []).find(x => x.wrong[k] === term), oc = outcome(k, term); art.setAttribute("class", "wu-art spark"); Sound.sfx(oc === "trip" ? "pop" : "spark"); setTimeout(() => art.setAttribute("class", "wu-art"), 700);
          out.innerHTML = `<span class="bad">${esc(tx(WGEN.outcomes[oc || "trip"]))}</span>`;
          await R.miss({ did: L(`You landed ${leadName(k)} on ${tName(term)}.`, `Pusiste ${leadName(k)} en ${tName(term)}.`), why: m ? tx(m.explain) : fmt(WGEN.wrongLanding, { lead: leadName(k), right: tName(s.correct[k]), wrong: tName(term) }) + " " + tx(/cap|HERM|FAN/.test(s.correct[k] + k) ? WU.components.dualRunCapacitor.note : /compressor/.test(k) ? WU.components.compressor.note : WU.components.contactor.note),
            rule: tx(s.note || s.rule || WU.components.contactor.note), sources: uniq([...(m ? m.sources : []), ...s.sources]), q: wuQ(`wu:${s.id}:${k}`), outcome: oc ? tx(WGEN.outcomes[oc]) : null, shakeEl: B, big: oc === "trip" });
          if (R.over) return; delete conn[k]; draw(); out.innerHTML = ""; checking = false; return; }
        art.setAttribute("class", "wu-art run"); out.innerHTML = `<span class="ok">${esc(tx(WGEN.outcomes.ok))}</span>`; const hum = Sound.loop("hum", 0.9), fan = Sound.loop("fan", 0.8); setTimeout(() => { hum.stop(0.3); fan.stop(0.4); }, 1500);
        await wait(600);
        for (const tp of (s.traps || [])) { const ok = await trap(tp); if (ok) R.hit({ label: L("good call", "bien") }); else await R.miss({ did: L(`You chose to: ${tx(tp.q).replace(/\.$/, "")}.`, `Elegiste: ${tx(tp.q).replace(/\.$/, "")}.`), why: tx(tp.explain), rule: tx(WU.components.condenserFanPSC.note), sources: tp.sources, q: wuQ(`wu:${s.id}:trap0`) }); }
        if (R.over) return; R.boardEnd(); if (R.boardMiss === 0 && s.id === "wu06") setTimeout(() => R.bonus(400, L("No Smoke", "Sin humo")), 700); advance(); };
    }
    function trap(tp) { return new Promise(res => { const d = document.createElement("div"); d.className = "tg-trap"; d.innerHTML = `<div class="tg-trap-in"><small>${L("Would you do this?", "¿Lo harías?")}</small><p>${esc(tx(tp.q))}</p><div class="row gap"><button class="btn big" data-a="1">${L("Do it", "Hacerlo")}</button><button class="btn big primary" data-a="0">${L("Don't", "No")}</button></div></div>`;
      R.el.appendChild(d); requestAnimationFrame(() => d.classList.add("open")); d.querySelectorAll("[data-a]").forEach(b => b.onclick = () => { d.classList.remove("open"); setTimeout(() => d.remove(), 220); res(b.dataset.a === "0"); }); }); }
    function ohms(s) { const pick = {}; TG.qaCur = { kind: "ohm", correct: s.correct }; const rd = [["1-2", "0.9"], ["1-3", "2.6"], ["2-3", "3.5"]];
      R.body.innerHTML = `${head(s)}<div class="wu-ohm"><svg viewBox="0 0 200 120" class="wu-ohm-art"><circle cx="100" cy="64" r="50"/><circle cx="70" cy="50" r="10"/><circle cx="130" cy="50" r="10"/><circle cx="100" cy="92" r="10"/><text x="70" y="54">1</text><text x="130" y="54">2</text><text x="100" y="96">3</text></svg>
        <div class="wu-reads">${rd.map(([p, v]) => `<span><b>${p}</b> ${v} Ω</span>`).join("")}</div>
        ${["1", "2", "3"].map(n => `<div class="wu-ohm-row"><b>${n}</b><div class="seg sm" data-n="${n}">${["C", "S", "R"].map(x => `<button data-v="${x}">${x}</button>`).join("")}</div></div>`).join("")}
        <p class="sm muted">${esc(tx(s.safety))}</p><button class="btn primary big full" id="ohGo">${ico("check", 18)} ${L("Check", "Revisar")}</button></div>`;
      R.body.querySelectorAll(".wu-ohm-row .seg").forEach(sg => sg.querySelectorAll("button").forEach(b => b.onclick = () => { sg.querySelectorAll("button").forEach(x => x.classList.toggle("sel", x === b)); pick[sg.dataset.n] = b.dataset.v; Sound.sfx("snap"); }));
      $("#ohGo").onclick = async () => { if (Object.keys(pick).length < 3) { Sound.sfx("tap"); return; } let bad = null; for (const n of ["1", "2", "3"]) { if (pick[n] === s.correct[n]) { R.hit({ quiet: true }); await new Promise(r => setTimeout(r, 120)); } else if (!bad) bad = n; }
        if (bad) { const m = (s.mistakes || []).find(x => x.wrong[bad] === pick[bad]); await R.miss({ did: L(`You called terminal ${bad} ${pick[bad]}. It's ${s.correct[bad]}.`, `Dijiste que la terminal ${bad} es ${pick[bad]}. Es ${s.correct[bad]}.`), why: tx(m ? m.explain : s.rule), rule: tx(s.rule), sources: s.sources, q: wuQ("wu:wu03") }); }
        if (R.over) return; R.boardEnd(); advance(); }; }
    function safety(s) { TG.qaCur = { kind: "safety" }; R.body.innerHTML = `${head(s)}<div class="tg-safety"><svg viewBox="0 0 120 80" class="wu-sp-art"><rect x="20" y="10" width="80" height="60" rx="6"/><path d="M40 30h40M40 50h40M60 30v20"/><path class="wu-live" d="M30 70v-8M90 70v-8"/></svg><p class="big">${esc(tx(s.task))}</p>
        <div class="row gap"><button class="btn big full" data-a="yes">${L("Yes, safe", "Sí, seguro")}</button><button class="btn big primary full" data-a="no">${L("No", "No")}</button></div></div>`;
      R.body.querySelectorAll("[data-a]").forEach(b => b.onclick = async () => { if (b.dataset.a === "no") { R.hit({ pts: 150, label: L("safe call", "seguro") }); } else { Sound.sfx("spark"); await R.miss({ did: L("You said it was safe to touch.", "Dijiste que era seguro tocar."), why: tx((s.mistakes || [])[0].explain), rule: L("Lock out, tag out, verify zero energy.", "Bloquea, etiqueta y verifica cero energía."), sources: s.sources, q: wuQ("wu:wu05"), big: true }); }
        if (R.over) return; R.boardEnd({ speed: false }); advance(); }); }
    TG.intro(R, `<div class="tg-intro-art">${TG.byId.wire_it_up.art(84)}</div><h3>${esc(tx(WU.name))}</h3><p class="sm">${L("Land each lead on the contactor and the dual run cap, then Energize. Cap C shares a leg with compressor R.", "Conecta cada cable al contactor y al capacitor dual y energiza. C del capacitor comparte pata con R del compresor.")}</p><p class="sm muted">${L("Practice only: power is locked out on a real unit.", "Solo práctica: en un equipo real la energía está bloqueada.")}</p>`, null, next);
  }

  const art = (inner) => s => `<svg class="tg-art-svg" width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  TG.register({ id: "thermostat_wiring", slug: "thermostat", order: 1, tag: { en: "R, C, G, Y, W, O/B", es: "R, C, G, Y, W, O/B" }, run: thermostat, reviewBank: twReviewBank,
    art: art(`<rect x="12" y="8" width="40" height="48" rx="8"/><circle cx="32" cy="27" r="10"/><path d="M32 21v6l4 3"/><path class="ac" d="M20 46h4M28 46h4M36 46h4M44 46h-0"/><path class="ac2" d="M4 40c6 0 6 8 12 8M4 48c6 0 6-4 12-4"/>`) });
  TG.register({ id: "wire_it_up", slug: "wireitup", order: 3, tag: { en: "Contactor, cap, C/S/R", es: "Contactor, capacitor, C/S/R" }, run: wireItUp, reviewBank: wuReviewBank,
    art: art(`<rect x="8" y="12" width="26" height="40" rx="4"/><path d="M14 22h14M14 32h14M14 42h14"/><circle cx="48" cy="24" r="9"/><path d="M44 24h8M48 20v8"/><path class="ac" d="M34 22c8 0 6 2 14 2M34 42c10 0 14-6 14-9"/><path class="ac2" d="M52 44l-4 6h5l-4 6"/>`) });
})();
