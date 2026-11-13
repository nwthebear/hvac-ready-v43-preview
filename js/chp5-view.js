/* NATE CHP-5 practice track view (#/chp5): five exams, published domain weights, lessons, related practice. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views;
  const L = (en, es) => (S.lang === "es" ? es : en);
  const linkInfo = ([type, id]) => {
    if (type === "guide") { const g = LESSONS[id]; return g && { title: tx(g.title), href: "#/guide/" + id, icon: (window.CONTENT_ICON || {})[id] || "book", done: A.isDone("guide:" + id) }; }
    if (type === "skill") { const s = SKILLS.find(x => x.id === id); return s && { title: tx(s.title), href: "#/skill/" + id, icon: "hand", done: A.isDone("skill:" + id) }; }
    if (type === "sim") { const s = SIM_SCENARIOS.find(x => x.id === id); return s && { title: L("Sim: ", "Simulador: ") + tx(s.title), href: "#/sim/" + id, icon: "target", done: !!(S.sims && S.sims[id]) }; }
  };
  const row = l => { const i = linkInfo(l); return i ? `<a class="list-card ${i.done ? "done" : ""}" href="${i.href}"><span class="lc-ico">${ico(i.icon)}</span><span class="grow">${esc(i.title)}</span>${i.done ? ico("check", 18, "ok") : ico("arrow", 18)}</a>` : ""; };

  /* small subtle badges on path module rows */
  A.chp5Badges = id => { const ex = (window.CHP5_MAP || {})[id]; if (!ex) return "";
    return ` <span class="chp5-tags" title="NATE CHP-5">${ex.map(e => `<em class="chp5-tag">${esc(tx(CHP5_SHORT[e]))}</em>`).join("")}</span>`; };
  /* readiness per path: which stages feed which exam */
  A.chp5Readiness = (plan, full) => {
    if (!plan) return ""; const es = S.lang === "es";
    const rows = window.CHP5_EXAMS.map(e => {
      const mods = []; plan.stages.forEach(st => st.modules.forEach(m => { if (m.status !== "skip" && (CHP5_MAP[m.id] || []).includes(e.id)) mods.push([st.id, m]); }));
      const done = mods.filter(([, m]) => A.moduleDone(m)).length, pct = mods.length ? Math.round(done / mods.length * 100) : 0;
      const byStage = {}; mods.forEach(([sid, m]) => { const b = byStage[sid] || (byStage[sid] = { n: 0, d: 0 }); b.n++; if (A.moduleDone(m)) b.d++; });
      const lessons = e.lessons.length ? `${e.lessons.filter(id => A.isDone("guide:" + id)).length}/${e.lessons.length} ${es ? "lecciones" : "lessons"}` : (es ? "lecciones próximamente" : "lessons coming soon");
      return `<details class="stage chp5-ready"><summary><span class="stage-name">${ico(e.icon, 16)} ${esc(tx(e.title))}</span><span class="mini-bar"><span style="width:${pct}%"></span></span><span class="muted sm">${done}/${mods.length}</span></summary>
        <div class="sm muted">${es ? "Etapas que alimentan este examen" : "Stages that feed this exam"}:</div>
        <div class="chips">${Object.entries(byStage).map(([sid, b]) => `<span class="chip ${b.d === b.n ? "ok" : ""}">${esc(tx(STAGE_LABELS[sid]))} · ${b.d}/${b.n}</span>`).join("") || `<span class="muted sm">${es ? "Ningún módulo de esta ruta" : "No modules in this path"}</span>`}</div>
        <ul class="mod-list">${mods.map(([, m]) => `<li><a class="mod ${A.moduleDone(m) ? "done" : ""}" href="#/module/${m.id}"><span class="mod-ico">${A.moduleDone(m) ? ico("check", 16) : ico("book", 16)}</span><span class="grow">${esc(tx(m.title))}</span></a></li>`).join("")}</ul>
        <a class="sm" href="#/chp5">${esc(lessons)} →</a></details>`;
    }).join("");
    return `<h3 class="sec-h">${es ? "Preparación NATE CHP-5" : "NATE CHP-5 readiness"}</h3>
      <p class="sm muted">${es ? "Cómo tus módulos se reparten entre los 5 exámenes CHP-5 (práctica; asignación nuestra, no de NATE)." : "How your path modules map to the 5 CHP-5 exams (practice; our mapping, not NATE's)."} ${full ? "" : `<a href="#/chp5">${es ? "Ver la ruta CHP-5" : "Open the CHP-5 track"}</a>`}</p>${rows}`;
  };
  V.chp5 = () => {
    const ex = window.CHP5_EXAMS;
    return `<main class="page chp5">${A.head("NATE CHP-5", "#/library")}
      <section class="card"><div class="eyebrow">${L("Practice track", "Ruta de práctica")}</div>
        <p>${L("CHP-5 is NATE's five-exam path: 30 questions and 1 hour per exam, and you pass all five to certify. The traditional Core + specialty path still exists.", "CHP-5 es la ruta de cinco exámenes de NATE: 30 preguntas y 1 hora por examen; hay que aprobar los cinco para certificarse. La ruta tradicional (Core + especialidad) sigue existiendo.")}</p>
        <p class="sm muted">${L("Domains and weights follow NATE's published CHP-5 outlines. Lessons and questions here are original practice material, not NATE questions, and passing them is not a NATE certification.", "Las áreas y porcentajes siguen los temarios CHP-5 publicados por NATE. Las lecciones y preguntas son material de práctica original, no preguntas de NATE, y aprobarlas no es una certificación NATE.")}</p>
        <a class="sm" href="https://natex.org/technician/take-an-exam/certified-hvac-professional-chp-5" target="_blank" rel="noopener">natex.org · CHP-5 ↗</a></section>
      ${ex.map((e, n) => { const done = e.lessons.filter(id => A.isDone("guide:" + id)).length;
        return `<section class="card chp5-exam" id="chp5-${e.id}"><div class="row between"><h3>${ico(e.icon, 20)} ${n + 1}. ${esc(tx(e.title))}</h3>${e.soon ? `<span class="chip">${L("Coming soon", "Próximamente")}</span>` : `<span class="chip ${done === e.lessons.length ? "ok" : ""}">${done}/${e.lessons.length}</span>`}</div>
          <div class="chp5-domains">${e.domains.map(d => `<div class="sbar"><span class="sm">${esc(tx(d.name))}</span><span class="mini-bar"><span style="width:${Math.round(d.w / 27 * 100)}%"></span></span><b class="sm">${d.w}%</b></div>`).join("")}</div>
          ${e.soon ? `<div class="note">${ico("info", 18)} ${L("Full lessons for this exam are coming soon. Until then, these existing skills and sims cover parts of it:", "Las lecciones completas de este examen llegarán pronto. Mientras tanto, estas habilidades y simulaciones cubren partes:")}</div>`
            : `<h4>${L("Lessons", "Lecciones")}</h4>${e.lessons.map(id => row(["guide", id])).join("")}<h4>${L("Related practice", "Práctica relacionada")}</h4>`}
          ${e.practice.map(row).join("")}</section>`; }).join("")}
      ${A.plan() ? A.chp5Readiness(A.plan(), true) : `<a class="btn full" href="#/match">${L("Match a path to see your CHP-5 readiness", "Elige una ruta para ver tu preparación CHP-5")}</a>`}
    </main>`;
  };
  A.bind.chp5 = () => {};
})();
