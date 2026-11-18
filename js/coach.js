/* Tech Coach. Pluggable backend: any OpenAI-compatible /chat/completions endpoint
   (or a custom endpoint returning {reply}). Settings live in localStorage on the device
   only; no key ships with the app. Without a key/endpoint → offline search of app content. */
(function () {
  const STOP = new Set("a an the is are was were be to of and or in on at for with how what why when which who do does did i my me you your it this that can should from as by about vs y o el la los las un una de del en es que qué cómo como por para con mi tu se lo al".split(" "));
  const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9µ\s/-]/g, " ");
  const toks = s => norm(s).split(/\s+/).filter(w => w.length > 1 && !STOP.has(w)).map(w => w.replace(/(ing|es|s)$/, ""));
  let INDEX = null;
  function build() {
    const L = window.tx, docs = [];
    const add = (title, body, link, kind, extra = "") => docs.push({ title, body, link, kind, tt: toks(title.en + " " + (title.es || "") + " " + extra), bt: toks((body.en || "") + " " + (body.es || "")) });
    (window.DAY_ONE || []).forEach(c => add(c.q, c.a, "#/dayone/" + c.id, "Day One", c.tags || ""));
    (window.GLOSSARY || []).forEach(g => add(g.t, g.d, "#/glossary", "Glossary"));
    Object.entries(window.LESSONS || {}).forEach(([id, g]) => {
      (g.sections || []).forEach(s => add({ en: g.title.en + ": " + s.h.en, es: (g.title.es || g.title.en) + ": " + (s.h.es || s.h.en) }, s.p, "#/guide/" + id, "Guide"));
      if (g.cards) Object.values(g.cards).forEach(c => add(g.title, c, "#/guide/" + id, "Guide"));
    });
    (window.SKILLS || []).forEach(s => add(s.title, { en: s.intro.en + " " + s.steps.join(" ") + " " + s.safety.join(" ") + " " + s.mistakes.join(" ") }, "#/skill/" + s.id, "Skill"));
    (window.TOOLS || []).forEach(t => add(t.name, { en: [t.what, t.use, t.safety, t.mistake].map(x => x.en).join(" "), es: [t.what, t.use, t.safety, t.mistake].map(x => x.es).join(" ") }, "#/tool/" + t.id, "Tool"));
    Object.entries(window.EPA_QUESTIONS || {}).forEach(([sec, qs]) => qs.forEach(q => add(q.q, { en: q.a[q.c].en + ". " + q.why.en + " (" + q.ref + ")", es: (q.a[q.c].es || "") + ". " + (q.why.es || "") }, "#/epa/" + sec, "EPA 608")));
    (window.SCENARIOS || []).forEach(s => add(s.s, { en: s.a[s.c].en + ". " + s.why.en, es: s.a[s.c].es + ". " + s.why.es }, "#/sim", "Troubleshooting"));
    const df = {}; docs.forEach(d => new Set([...d.tt, ...d.bt]).forEach(w => df[w] = (df[w] || 0) + 1));
    INDEX = { docs, df, N: docs.length };
  }
  function search(q, k = 3) {
    if (!INDEX) build(); const qt = toks(q); if (!qt.length) return [];
    return INDEX.docs.map(d => {
      let s = 0; qt.forEach(w => { const idf = Math.log(1 + INDEX.N / (1 + (INDEX.df[w] || 0)));
        if (d.tt.includes(w)) s += 3 * idf; const c = d.bt.filter(x => x === w).length; if (c) s += Math.min(c, 3) * idf;
        else if (w.length > 4 && d.bt.some(x => x.startsWith(w.slice(0, 5)))) s += 0.4 * idf; });
      return { d, s };
    }).filter(x => x.s > 1.2).sort((a, b) => b.s - a.s).slice(0, k).map(x => x.d);
  }
  const cfg = () => JSON.parse(localStorage.getItem("hvac.coach") || "{}");
  async function ask(question, history, lang) {
    const c = cfg(); const hits = search(question, 4);
    if (!c.endpoint) return { offline: true, hits };
    const ctxText = hits.map(h => `- ${window.tx(h.title)}: ${window.tx(h.body)}`).join("\n");
    const sys = `You are "Tech Coach", a friendly HVAC trainer for beginners. Answer in ${lang === "es" ? "Spanish" : "English"}, in plain language, short (under 150 words). Put safety first; never encourage unsupervised refrigerant, gas or live-electrical work by untrained people; mention EPA 608 rules when relevant; say when to ask a supervisor. Use this app content if helpful:\n${ctxText}`;
    const headers = { "Content-Type": "application/json" }; if (c.apiKey) headers.Authorization = "Bearer " + c.apiKey;
    const body = { model: c.model || "default", messages: [{ role: "system", content: sys }, ...history.slice(-8), { role: "user", content: question }] };
    const r = await fetch(c.endpoint, { method: "POST", headers, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json(); const text = j.choices?.[0]?.message?.content || j.reply || j.answer || j.output_text;
    if (!text) throw new Error("No answer field"); return { offline: false, text, hits };
  }
  window.Coach = { search, ask, cfg, saveCfg: c => localStorage.setItem("hvac.coach", JSON.stringify(c)), rebuild: () => { INDEX = null; } };
})();
