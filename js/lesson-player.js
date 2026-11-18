/* v53 stepped lesson player: one idea per screen, videos lazy behind a tap. */
(function () {
  const A = window.App;
  if (!A) return;
  const V = A.views;
  const $ = s => document.querySelector(s);
  A._teachStep = A._teachStep || {};

  const tx = (x) => window.tx ? window.tx(x) : (x && (x[A.S.lang] || x.en || x)) || "";
  const esc = A.esc;

  A.teachSteps = function (g) {
    if (g && g.teach && g.teach.steps && g.teach.steps.length) return g.teach;
    /* Fallback: keep older guides working in the new layout. */
    const steps = [];
    if (g.intro) steps.push({ title: g.title, body: [g.intro], analogy: g.cards && g.cards.analogy, call: g.cards && g.cards.example });
    (g.sections || []).forEach(s => steps.push({ title: s.h, body: [s.p] }));
    if (g.cards && g.cards.tip) steps.push({ title: { en: "A tip from the truck", es: "Un consejo del camión" }, body: [g.cards.tip] });
    const recap = (g.keyPoints && (g.keyPoints[A.S.lang] || g.keyPoints.en)) || [];
    return { steps, recap: recap.map(x => typeof x === "string" ? { en: x, es: x } : x), check: g.check || [] };
  };

  function ytButton(v, es) {
    if (!v || !v.id) return "";
    const start = v.start != null ? Number(v.start) : 0;
    const end = v.end != null ? Number(v.end) : 0;
    const cap = es ? "Mira este video (se carga al tocar)" : "Watch this video (loads when you tap)";
    return `<button type="button" class="yt-wait" data-yt="${esc(v.id)}" data-start="${start}" data-end="${end}" aria-label="${esc(cap)}">
      <span class="yt-thumb"><img src="img/video/${esc(v.id)}.jpg" alt="" width="480" height="270">
        <span class="yt-play"><b>▶</b></span></span>
      <span class="yt-meta"><b>${esc(v.title)}</b><span>${esc(v.channel)} · ${cap}</span></span>
    </button>`;
  }

  /* Stable per-question answer order so the right answer isn't always first. */
  function order(id, qi, n) {
    let h = 2166136261; const s = id + ":" + qi;
    for (let k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619) >>> 0; }
    const a = Array.from({ length: n }, (_, k) => k);
    for (let k = n - 1; k > 0; k--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; const j = h % (k + 1); [a[k], a[j]] = [a[j], a[k]]; }
    return a;
  }

  function stepHtml(g, id, i, teach) {
    const es = A.S.lang === "es";
    const steps = teach.steps;
    const rec = (teach.recap && teach.recap.length) ? 1 : 0;
    const checks = teach.check || g.check || [];
    const chk = checks.length ? 1 : 0;
    const total = steps.length + rec + chk;
    const recapI = rec ? steps.length : -1;
    const checkI = chk ? steps.length + rec : -1;
    const pct = Math.round((Math.min(i, total - 1) + 1) / total * 100);
    const backHref = "#/library";
    let body = "";
    if (i < steps.length) {
      const s = steps[i];
      body += s.kicker ? `<p class="teach-kicker">${esc(tx(s.kicker))}</p>` : "";
      body += `<h2>${esc(tx(s.title))}</h2>`;
      (s.body || []).forEach(p => { body += `<p>${esc(tx(p))}</p>`; });
      if (s.visual && window.TeachViz) body += TeachViz.svg(s.visual, es);
      if (s.video) body += ytButton(s.video, es);
      if (s.analogy) body += `<div class="teach-note"><span class="lbl">${es ? "Piénsalo así" : "Think of it like this"}</span><p>${esc(tx(s.analogy))}</p></div>`;
      if (s.call) body += `<div class="teach-note"><span class="lbl">${es ? "En una llamada de servicio" : "On a service call"}</span><p>${esc(tx(s.call))}</p></div>`;
    } else if (i === recapI) {
      body += `<h2>${es ? "Lo que ahora sabes" : "What you now know"}</h2>`;
      body += `<ul class="teach-recap">${(teach.recap || []).map(x => `<li>${esc(tx(x))}</li>`).join("")}</ul>`;
    } else {
      body += `<h2>${es ? "Comprueba lo que aprendiste" : "Check what you learned"}</h2>`;
      checks.forEach((q, qi) => {
        body += `<div class="teach-q" data-qi="${qi}">
          <h3>${esc(tx(q.q))}</h3>
          ${order(id, qi, (q.a || []).length).map(ai => `<button type="button" class="ans teach-ans" data-qi="${qi}" data-ai="${ai}">${esc(tx(q.a[ai]))}</button>`).join("")}
          <div class="teach-why" hidden></div>
        </div>`;
      });
      body += `<div class="teach-done" id="teachDone" hidden><p class="ok">${es ? "Bien. Marcamos esta lección como lista." : "Nice work. This lesson is marked done."}</p></div>`;
    }
    const last = i >= total - 1;
    const nextLabel = last ? (es ? "Listo" : "Done") : (es ? "Siguiente" : "Next");
    const backLabel = i === 0 ? (es ? "Salir" : "Back") : (es ? "Atrás" : "Back");
    return `<main class="page teach" data-guide="${esc(id)}" data-step="${i}">
      <header class="teach-top">
        <a class="iconbtn" href="${backHref}" aria-label="${es ? "Cerrar" : "Close"}">${(window.ico && ico("close", 22)) || "×"}</a>
        <h1 class="teach-title">${esc(tx(g.title))}</h1>
        <span class="teach-count">${i + 1}/${total}</span>
      </header>
      <div class="teach-prog" aria-hidden="true"><i style="width:${pct}%"></i></div>
      <div class="teach-body">${body}</div>
      <footer class="teach-foot">
        <button type="button" class="btn ghost" id="teachBack">${backLabel}</button>
        <button type="button" class="btn primary" id="teachNext">${nextLabel}</button>
      </footer>
    </main>`;
  }

  const prevGuide = V.guide;
  V.guide = ([id], qs) => {
    const g = window.LESSONS[id];
    if (!g) return V.notfound ? V.notfound() : "";
    const teach = A.teachSteps(g);
    if (!teach.steps || !teach.steps.length) return prevGuide ? prevGuide([id], qs) : "";
    const max = teach.steps.length + (teach.recap && teach.recap.length ? 1 : 0) + ((teach.check || g.check || []).length ? 1 : 0) - 1;
    let i = A._teachStep[id];
    if (i == null) i = 0;
    i = Math.max(0, Math.min(max, i | 0));
    A._teachStep[id] = i;
    return stepHtml(g, id, i, teach);
  };

  const prevBind = A.bind.guide;
  A.bind.guide = ([id]) => {
    const g = window.LESSONS[id];
    if (!g) return;
    const teach = A.teachSteps(g);
    if (!teach.steps || !teach.steps.length) { if (prevBind) prevBind([id]); return; }
    document.querySelectorAll(".rku, .vic, .celebrate-ov, .cel-gear").forEach(el => { try { el.remove(); } catch (e) {} });
    const page = document.querySelector(".page.teach");
    const max = teach.steps.length + (teach.recap && teach.recap.length ? 1 : 0) + ((teach.check || g.check || []).length ? 1 : 0) - 1;
    const go = (n) => {
      A._teachStep[id] = Math.max(0, Math.min(max, n));
      /* Re-render in place — no hash change, so no whoosh or scroll jump. */
      const view = document.getElementById("view");
      if (!view) return;
      view.innerHTML = stepHtml(g, id, A._teachStep[id], teach);
      A.bind.guide([id]);
      const body = document.querySelector(".teach-body");
      if (body) body.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    const back = document.getElementById("teachBack");
    const next = document.getElementById("teachNext");
    if (back) back.onclick = () => {
      if (A._teachStep[id] <= 0) { A.go("#/library"); return; }
      go(A._teachStep[id] - 1);
    };
    if (next) next.onclick = () => {
      if (A._teachStep[id] >= max) {
        try {
          const checks = teach.check || g.check || [];
          const answered = (A._teachAns || {})["guide:" + id] || {};
          const tried = checks.length === 0 || checks.every((_, qi) => answered[qi] === true || answered[qi] === false);
          if (tried) A.markDone("guide:" + id, window.XP_RULES ? XP_RULES.guide : 0);
        } catch (e) {}
        A.go("#/library");
        return;
      }
      go(A._teachStep[id] + 1);
    };

    document.querySelectorAll(".yt-wait").forEach(btn => {
      btn.onclick = () => {
        const vid = btn.getAttribute("data-yt");
        const start = btn.getAttribute("data-start") || "0";
        const end = btn.getAttribute("data-end") || "";
        let src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(vid)}?rel=0&modestbranding=1&playsinline=1`;
        if (start && start !== "0") src += `&start=${encodeURIComponent(start)}`;
        if (end && end !== "0") src += `&end=${encodeURIComponent(end)}`;
        const wrap = document.createElement("div");
        wrap.className = "yt-frame";
        wrap.innerHTML = `<iframe src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Lesson video"></iframe>`;
        btn.replaceWith(wrap);
      };
    });

    const checks = teach.check || g.check || [];
    const answered = A._teachAns || (A._teachAns = {});
    const key = "guide:" + id;
    if (!answered[key]) answered[key] = {};
    const maybeFinish = () => {
      if (Object.keys(answered[key]).length < checks.length) return;
      const all = checks.every((_, qi) => answered[key][qi] === true || answered[key][qi] === false);
      if (all) {
        const el = document.getElementById("teachDone");
        if (el) el.hidden = false;
      }
    };
    document.querySelectorAll(".teach-q .ans").forEach(b => {
      b.onclick = () => {
        const qi = +b.dataset.qi, ai = +b.dataset.ai;
        const q = checks[qi];
        if (!q || answered[key][qi] != null) return;
        const ok = ai === q.c;
        answered[key][qi] = ok;
        const box = b.closest(".teach-q");
        box.querySelectorAll(".ans").forEach(x => {
          x.disabled = true;
          if (+x.dataset.ai === q.c) x.classList.add("right");
          if (x === b && !ok) x.classList.add("wrongp");
        });
        const why = box.querySelector(".teach-why");
        if (why) {
          why.hidden = false;
          why.innerHTML = `<b>${ok ? (A.S.lang === "es" ? "Así es." : "That's it.") : (A.S.lang === "es" ? "No exactamente." : "Not quite.")}</b> ${esc(tx(q.why || ""))}`;
        }
        try { Sound.sfx(ok ? "click" : "click"); } catch (e) {}
        maybeFinish();
      };
    });
  };

  /* Old slide-video links for guides land on the new lesson. Skills keep the existing player. */
  const prevVideo = V.video;

  /* Don't drop a rank-up / victory over a lesson. Show it after the student leaves. */
  ["rankScene", "victory", "celebrate"].forEach(name => {
    const prev = A[name];
    if (typeof prev !== "function" || prev._teachHold) return;
    const held = function () {
      if (document.body.classList.contains("is-teach") || document.querySelector(".page.teach")) {
        const args = arguments, self = this;
        const wait = () => {
          if (document.body.classList.contains("is-teach") || document.querySelector(".page.teach")) return setTimeout(wait, 400);
          prev.apply(self, args);
        };
        setTimeout(wait, 0);
        return;
      }
      return prev.apply(this, arguments);
    };
    held._teachHold = true;
    A[name] = held;
  });

  V.video = (params, qs) => {
    if (params && params[0] === "guide" && params[1]) { setTimeout(() => A.go("#/guide/" + params[1]), 0); return `<main class="page"></main>`; }
    return prevVideo ? prevVideo(params, qs) : "";
  };
})();
