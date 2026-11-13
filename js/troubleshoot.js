/* Troubleshooting Simulator: ticket → pick tests → diagnosis → fix → score. Data: js/content-sims.js */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views, $ = s => document.querySelector(s);
  const L = (en, es) => S.lang === "es" ? es : en;
  S.sims = S.sims || {};
  let R = null; // current run
  const stars = n => [1, 2, 3].map(i => ico("star", 16, i <= n ? "star-on" : "star-off")).join("");
  const sorted = () => { const pid = (A.plan() || {}).pathId; return SIM_SCENARIOS.slice().sort((a, b) => (b.paths.includes(pid) - a.paths.includes(pid)) || a.level - b.level); };
  V.sim = ([id]) => {
    if (!id) return `<main class="page">${A.head(L("Troubleshooting Simulator", "Simulador de diagnóstico"))}
      <p class="muted">${L("Read the ticket, run the tests you'd really run, then make the call. Fewer wasted tests, higher score.", "Lee la orden, haz las pruebas que harías de verdad y decide. Menos pruebas de más, mejor puntaje.")}</p>
      <div class="card-list">${sorted().map(s => { const b = S.sims[s.id]; return `<a class="list-card ${b ? "done" : ""}" href="#/sim/${s.id}"><span class="lc-ico">${ico(s.icon)}</span><span class="grow"><b>${esc(tx(s.title))}</b><span class="sm muted block">${"●".repeat(s.level)}${"○".repeat(3 - s.level)} · ${b ? stars(b.stars) : L("Not tried yet", "Sin intentar")}</span></span>${ico("arrow", 18)}</a>`; }).join("")}</div></main>`;
    const sc = SIM_SCENARIOS.find(x => x.id === id); if (!sc) return V.notfound();
    if (!R || R.id !== id) R = { id, done: [], step: "tests", diag: null, fix: null, safetyFirst: null };
    const head = A.head(tx(sc.title), "#/sim");
    if (R.step === "tests") return `<main class="page sim">${head}
      <div class="ticket"><div class="ticket-h">${ico("wrench", 16)} ${L("Service ticket", "Orden de servicio")}</div><p>${esc(tx(sc.call))}</p></div>${R.flavor ?? (R.flavor = A.saying("sim"))}
      <h3 class="sec-h">${L("What do you check?", "¿Qué revisas?")} <span class="chip">${R.done.length} ${L("tests", "pruebas")}</span></h3>
      <div class="sim-tests">${sc.tests.map(tst => { const d = R.done.includes(tst.id); return `<button class="sim-test ${d ? "on" : ""} ${tst.safety ? "safety" : ""}" data-t="${tst.id}" ${d ? "disabled" : ""}><span class="st-name">${tst.safety ? ico("shield", 16) + " " : ""}${esc(tx(tst.name))}</span>${d ? `<span class="st-read">${esc(tx(tst.reading))}</span>` : ""}</button>`; }).join("")}</div>${(() => { const g = gaugeRead(sc, R); return g ? `<section class="card sim-gauges"><div class="sim-g2"><div id="sgL"></div><div id="sgH"></div></div><div id="sgLeg"></div><p class="sm muted center">${L("Your manifold. Tap a dial to zoom; read the saturation temp off the ring.", "Tu manifold. Toca un manómetro para ampliar; lee la temperatura de saturación en el anillo.")}</p></section>` : ""; })()}
      <button class="btn primary big full" id="toDiag" ${R.done.length ? "" : "disabled"}>${L("Make the call", "Dar diagnóstico")} ${ico("arrow", 18)}</button></main>`;
    const opts = (list, key) => `<div class="stack">${list.map((o, i) => `<button class="btn choice" data-o="${i}">${esc(tx(o.t))}</button>`).join("")}</div>`;
    if (R.step === "diag") return `<main class="page sim">${head}<div class="ticket sm"><p>${esc(tx(sc.call))}</p></div><h3 class="sec-h">${L("What's wrong?", "¿Qué tiene?")}</h3>${opts(R.diagOrder.map(i => sc.diag[i]))}
      <details class="card tight mt"><summary class="sm"><b>${L("Your readings", "Tus lecturas")} (${R.done.length})</b></summary>${R.done.map(t => { const tst = sc.tests.find(x => x.id === t); return `<p class="sm"><b>${esc(tx(tst.name))}:</b> ${esc(tx(tst.reading))}</p>`; }).join("")}</details></main>`;
    if (R.step === "fix") return `<main class="page sim">${head}<div class="feedback ${R.diagOk ? "ok" : "bad"}"><b>${R.diagOk ? L("Good call.", "Buen diagnóstico.") : L("Not it. The real problem:", "No era eso. El problema real:")}</b> ${R.diagOk ? "" : esc(tx(sc.diag.find(d => d.ok).t))}</div><h3 class="sec-h">${L("What's the fix?", "¿Cuál es la reparación?")}</h3>${opts(R.fixOrder.map(i => sc.fix[i]))}</main>`;
    // result
    const keys = sc.tests.filter(x => x.key).map(x => x.id), foundKeys = keys.filter(k => R.done.includes(k)).length, extra = R.done.filter(t => !keys.includes(t) && !sc.tests.find(x => x.id === t).safety).length;
    const sfTest = sc.tests.find(x => x.safety);
    return `<main class="page sim">${head}<section class="card center result-hero"><div class="sim-stars">${stars(R.stars)}</div><div class="go-score">${R.score}</div><p class="muted">${L("points", "puntos")}</p></section>
      <section class="card"><div class="sim-line ${R.diagOk ? "ok" : "bad"}">${ico(R.diagOk ? "check" : "close", 18)} ${L("Diagnosis", "Diagnóstico")}: ${esc(tx(sc.diag.find(d => d.ok).t))}</div>
      <div class="sim-line ${R.fixOk ? "ok" : "bad"}">${ico(R.fixOk ? "check" : "close", 18)} ${L("Fix", "Reparación")}: ${esc(tx(sc.fix.find(d => d.ok).t))}</div>
      <div class="sim-line">${ico("target", 18)} ${L("Key tests found", "Pruebas clave")}: ${foundKeys}/${keys.length}${extra ? ` · ${extra} ${L("extra", "de más")}` : ""}</div>
      ${sfTest ? `<div class="sim-line ${R.safetyFirst ? "ok" : "warn"}">${ico("shield", 18)} ${R.safetyFirst ? L("Safety step done first", "Seguridad primero: hecho") : L("Do the safety step before hands-on tests next time", "La próxima vez haz el paso de seguridad antes de las pruebas")}</div>` : ""}</section>
      <section class="card"><h3>${L("Why", "Por qué")}</h3><p>${esc(tx(sc.why))}</p>${A.saying(R.diagOk && R.fixOk ? "correct" : "wrong")}</section>
      <button class="btn primary big full" id="simNext">${L("Next ticket", "Siguiente orden")} ${ico("arrow", 18)}</button><button class="btn full" id="simAgain">${L("Try this one again", "Repetir esta")}</button></main>`;
  };
  /* gauges test done: parse "Suction N psig ... Head N psig" and show a real manifold (R-410A unless the text names another) */
  function gaugeRead(sc, R) { const t = sc.tests.find(x => R.done.includes(x.id) && /Suction\s+\d/.test(tx(x.reading).replace(/Succión/, "Suction")) ) || sc.tests.find(x => R.done.includes(x.id) && /Suction\s+\d/.test(x.reading && x.reading.en || "")); if (!t) return null;
    const en = (t.reading && t.reading.en) || tx(t.reading), lo = en.match(/Suction\s+(\d+(?:\.\d+)?)\s*psig/i), hi = en.match(/Head\s+(\d+(?:\.\d+)?)\s*psig/i), ref = (en.match(/R-(410A|22|454B|32|134a|404A)/) || [, "410A"])[1];
    return lo ? { lo: +lo[1], hi: hi ? +hi[1] : null, ref: "R-" + ref } : null; }
  A.bind.sim = ([id]) => {
    if (!id) return; const sc = SIM_SCENARIOS.find(x => x.id === id); if (!sc) return;
    if ($("#sgL") && A.Gauge && R) { const g = gaugeRead(sc, R); if (g) { const a = A.Gauge.mount($("#sgL"), { side: "low", legend: false, required: g.ref }), b = A.Gauge.mount($("#sgH"), { side: "high", legend: false, required: g.ref }); A.Gauge.group($("#sgLeg"), [a, b], g.ref); a.set(g.lo); if (g.hi != null) b.set(g.hi); } }
    const shuffle = n => A.shuffle([...Array(n).keys()]);
    document.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { const tst = sc.tests.find(x => x.id === b.dataset.t); if (R.safetyFirst === null && sc.tests.some(x => x.safety)) R.safetyFirst = !!tst.safety; R.done.push(tst.id); Sound.sfx(tst.key ? "correct" : "tap"); const y = scrollY; A.render(); scrollTo(0, y); });
    const td = $("#toDiag"); if (td) td.onclick = () => { R.step = "diag"; R.diagOrder = shuffle(sc.diag.length); A.render(); scrollTo(0, 0); };
    if (R.step === "diag") document.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { R.diagOk = !!sc.diag[R.diagOrder[+b.dataset.o]].ok; Sound.sfx(R.diagOk ? "correct" : "wrong"); R.step = "fix"; R.fixOrder = shuffle(sc.fix.length); A.render(); scrollTo(0, 0); });
    else if (R.step === "fix") document.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { R.fixOk = !!sc.fix[R.fixOrder[+b.dataset.o]].ok; finish(sc); });
    const nx = $("#simNext"); if (nx) nx.onclick = () => { const list = sorted(), i = list.findIndex(x => x.id === id), n = list.find((x, k) => k > i && !S.sims[x.id]) || list[(i + 1) % list.length]; R = null; A.go("#/sim/" + n.id); };
    const ag = $("#simAgain"); if (ag) ag.onclick = () => { R = null; A.render(); scrollTo(0, 0); };
  };
  function finish(sc) {
    const keys = sc.tests.filter(x => x.key).map(x => x.id), foundKeys = keys.filter(k => R.done.includes(k)).length;
    const extra = R.done.filter(t => !keys.includes(t) && !sc.tests.find(x => x.id === t).safety).length;
    let score = 400 + foundKeys * 150 - extra * 40 + (R.diagOk ? 400 : 0) + (R.fixOk ? 300 : 0) + (R.safetyFirst ? 150 : 0);
    score = Math.max(50, Math.round(score)); const max = 400 + keys.length * 150 + 850 + (sc.tests.some(x => x.safety) ? 150 : 0);
    R.score = score; R.stars = R.diagOk && R.fixOk ? (score >= max * 0.85 ? 3 : 2) : 1; R.step = "result";
    const prev = S.sims[sc.id]; S.sims[sc.id] = { best: Math.max(score, prev ? prev.best : 0), stars: Math.max(R.stars, prev ? prev.stars : 0), solved: (prev && prev.solved) || (R.diagOk && R.fixOk) };
    A.addXP(R.diagOk && R.fixOk ? 60 : 20); A.log("sim", sc.id, tx(sc.title), score); A.save(); A.render(); scrollTo(0, 0);
    if (R.diagOk && R.fixOk) setTimeout(() => A.celebrate({ title: tx(sc.title), sub: `${score} ${L("points", "puntos")} · ${"★".repeat(R.stars)}`, showBoard: false }), 400); else Sound.sfx("wrong");
  }
})();
