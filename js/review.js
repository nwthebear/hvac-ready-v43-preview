/* Spaced repetition: missed questions come back in a Review queue (Leitner boxes).
   Miss → box 0, due now. Right answer in review → next box: 1 day, 3 days, 7 days, then it graduates. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views, $ = s => document.querySelector(s);
  const L = (en, es) => (S.lang === "es" ? es : en);
  const DAY = 864e5, GAPS = [0, DAY, 3 * DAY, 7 * DAY];
  S.review = S.review || {};
  const qid = q => { let h = 2166136261; for (const ch of (q.q.en || "")) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return "q" + h.toString(36); };
  let index = null;
  const bank = () => { if (index) return index; index = {};
    const add = (q, src) => { if (q && q.q && q.a) index[qid(q)] = { q, src }; };
    Object.entries(window.LESSONS || {}).forEach(([id, l]) => (l.check || []).forEach(q => add(q, tx(l.title))));
    (window.SKILLS || []).forEach(s => (s.check || []).forEach(q => add(q, tx(s.title))));
    Object.entries(window.EPA_QUESTIONS || {}).forEach(([k, arr]) => arr.forEach(q => add(q, "EPA 608 " + tx((EPA_SECTIONS.find(x => x.id === k) || {}).title))));
    return index; };
  A.reviewMark = (q, ok) => {
    const id = qid(q), r = S.review[id], now = Date.now();
    if (!ok) S.review[id] = { box: 0, due: now, misses: ((r && r.misses) || 0) + 1, last: now };
    else if (r && r.due <= now) { const box = r.box + 1; if (box >= GAPS.length) delete S.review[id]; else S.review[id] = Object.assign(r, { box, due: now + GAPS[box], last: now }); }
    A.save();
  };
  A.reviewDue = () => { const now = Date.now(), b = bank(); return Object.entries(S.review).filter(([id, r]) => r.due <= now && b[id]).map(([id]) => id); };
  A.reviewCount = () => A.reviewDue().length;
  V.review = () => {
    const due = A.reviewDue(), all = Object.keys(S.review).filter(id => bank()[id]), next = all.filter(id => !due.includes(id)).map(id => S.review[id].due).sort((a, b) => a - b)[0];
    const boxes = [0, 1, 2, 3].map(b => all.filter(id => S.review[id].box === b).length);
    const days = next ? Math.max(1, Math.round((next - Date.now()) / DAY)) : 0;
    return `<main class="page">${A.head(L("Review", "Repaso"), "#/more")}
      <section class="card center"><div class="review-big">${due.length}</div><h2>${due.length ? L("Ready to review", "Listas para repasar") : L("Nothing due", "Nada pendiente")}</h2>
        <p class="muted sm">${L("Questions you missed come back here. Get one right and it waits longer before coming back: tomorrow, then 3 days, then a week, then it's done.", "Las preguntas que fallaste regresan aquí. Si la aciertas, tarda más en volver: mañana, luego 3 días, luego una semana, y listo.")}</p>
        ${due.length ? `<button class="btn primary big full" id="rvGo">${ico("play", 18)} ${L("Review", "Repasar")} ${Math.min(15, due.length)}</button>` : next ? `<p class="sm">${L("Next one in", "La próxima en")} ${days} ${days === 1 ? L("day", "día") : L("days", "días")}.</p>` : `<div class="empty fun sm-empty"><p><b>${L("Review deck is empty.", "El mazo de repaso está vacío.")}</b> ${L("Either you're a natural or you haven't started. Miss a question in any quiz and it lands here.", "O eres un crack o todavía no empiezas. Falla una pregunta en cualquier quiz y llega aquí.")}</p></div>`}</section>
      ${all.length ? `<section class="card"><h3>${L("Your queue", "Tu fila")}</h3><div class="rv-boxes">${[L("Today", "Hoy"), L("1 day", "1 día"), L("3 days", "3 días"), L("1 week", "1 semana")].map((n, i) => `<div class="rv-box"><b>${boxes[i]}</b><span class="sm muted">${n}</span></div>`).join("")}</div>
        <div class="card-list mt">${all.slice(0, 8).map(id => { const it = bank()[id]; return `<div class="list-card"><span class="grow"><b class="sm">${esc(tx(it.q.q))}</b><span class="sm muted block">${esc(it.src)}${S.review[id].misses > 1 ? ` · ${L("missed", "fallada")} ×${S.review[id].misses}` : ""}</span></span></div>`; }).join("")}</div></section>` : ""}</main>`;
  };
  A.bind.review = () => { const b = $("#rvGo"); if (b) b.onclick = () => { const items = A.reviewDue().slice(0, 15).map(id => bank()[id].q); A.startQuiz({ key: "review", title: L("Review", "Repaso"), questions: items, timer: false, review: true }); }; };
})();
