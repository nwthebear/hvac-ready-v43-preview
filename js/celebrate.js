/* CELEBRATION TIERS — each kind of win has its own look, sound and haptic, quick and skippable:
   1 badge   → card slides down, shine sweeps the badge, light glow, short chime                (≈2.4 s, tap to dismiss)
   2 gear    → item spins and drops onto your avatar, sparkle burst, 'new gear' click             (≈2.8 s, tap to dismiss)
   3 rank-up → warm radial glow + light rays, badge stamps in with a dust burst, tagline types in,
               brass fanfare + thump haptic; tint by tier (bronze / steel / gold / Old Timer)    (tap skips, Continue closes)
   4 zone    → the existing trail color sweep (trail.js)
   5 exam    → the trophy victory scene, brightened (CSS)
   Reduced motion: no motion, opacity fades only; sounds and haptics stay. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, L = (en, es) => (S.lang === "es" ? es : en);
  const RM = () => A.reduced();
  const queue = []; let busy = false;
  const next = () => { if (busy || !queue.length) return; if (document.querySelector(".vic, .celebrate-ov, .rku") ) return setTimeout(next, 500); busy = true; queue.shift()(() => { busy = false; setTimeout(next, 180); }); };
  const enqueue = f => { queue.push(f); next(); };
  const sparks = (host, n, cls) => { if (RM()) return ""; return Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + Math.random() * 0.4, d = 34 + Math.random() * 46; return `<i class="${cls}" style="--dx:${(Math.cos(a) * d).toFixed(1)}px;--dy:${(Math.sin(a) * d).toFixed(1)}px;--dl:${(Math.random() * 0.12).toFixed(2)}s"></i>`; }).join(""); };

  /* 1 · badge */
  A.badgeCard = (icon, name, sub) => enqueue(done => {
    const d = document.createElement("div"); d.className = "cel-badge" + (RM() ? " rm" : ""); d.setAttribute("role", "status");
    d.innerHTML = `<span class="cb-medal"><span class="cb-ico">${icon}</span><span class="cb-shine"></span></span><span class="cb-txt"><small>${L("Badge earned", "Insignia ganada")}</small><b>${esc(name)}</b>${sub ? `<span>${esc(sub)}</span>` : ""}</span>`;
    document.body.appendChild(d); requestAnimationFrame(() => d.classList.add("in"));
    setTimeout(() => { Sound.sfx("chime"); A.haptic("badge"); }, 140);
    const out = () => { if (d._out) return; d._out = 1; d.classList.remove("in"); d.classList.add("out"); setTimeout(() => { d.remove(); done(); }, 320); };
    d.onclick = out; setTimeout(out, 2600); });

  /* 2 · gear */
  A.gearCard = (g, av) => enqueue(done => {
    const d = document.createElement("div"); d.className = "cel-gear" + (RM() ? " rm" : ""); d.setAttribute("role", "status");
    d.innerHTML = `<div class="cg-stage"><div class="cg-av">${avatarSVG(av, 92, { mode: "bust" })}</div><span class="cg-item">${g.icon}</span><span class="cg-burst">${sparks(d, 14, "cg-sp")}</span></div>
      <div class="cg-txt"><small>${L("New gear", "Equipo nuevo")}</small><b>${esc(tx(g.name))}</b><span>${L("Equip it in Your character.", "Póntelo en Tu personaje.")}</span></div>`;
    document.body.appendChild(d); requestAnimationFrame(() => d.classList.add("in"));
    setTimeout(() => { d.classList.add("landed"); Sound.sfx("gearclick"); A.haptic("unlock"); }, RM() ? 200 : 720);
    const out = () => { if (d._out) return; d._out = 1; d.classList.remove("in"); d.classList.add("out"); setTimeout(() => { d.remove(); done(); }, 320); };
    d.onclick = () => { out(); A.go("#/avatar"); }; setTimeout(out, 3000); });

  /* 3 · rank-up */
  const tierOf = r => { const R = window.RANKS, i = R.indexOf(r), n = R.length; if (i === n - 1 && !(A.isHomeowner && A.isHomeowner())) return "ot"; const f = i / Math.max(1, n - 1); return f < 0.34 ? "bronze" : f < 0.67 ? "steel" : "gold"; };
  const ROOT = { bronze: 57, steel: 60, gold: 62, ot: 55 }, RING = { bronze: 980, steel: 1320, gold: 1180, ot: 880 };
  A.rankScene = r => enqueue(done => {
    const tier = tierOf(r), line = tx(r.line || { en: "", es: "" }), nm = tx(r);
    const d = document.createElement("div"); d.className = `rku t-${tier}` + (RM() ? " rm" : ""); d.setAttribute("role", "dialog"); d.setAttribute("aria-label", nm);
    d.innerHTML = `<div class="rku-bg"><div class="rku-glow"></div><div class="rku-rays"></div></div>
      <div class="rku-in"><div class="rku-eyebrow">${L("Rank up", "Subiste de rango")}</div>
        <div class="rku-badge"><svg viewBox="0 0 120 132" aria-hidden="true"><defs><linearGradient id="rkuG" x1="0" x2="1" y1="0" y2="1"><stop offset="0" class="s0"/><stop offset=".45" class="s1"/><stop offset="1" class="s2"/></linearGradient></defs>
          <path d="M60 4l50 18v40c0 32-22 56-50 66C32 118 10 94 10 62V22z" fill="url(#rkuG)" class="rku-shield"/><path d="M60 14l40 14v34c0 26-18 46-40 54-22-8-40-28-40-54V28z" class="rku-inner"/></svg>
          <span class="rku-ico">${r.icon}</span><span class="rku-shine"></span></div>
        <span class="rku-dust">${sparks(d, 18, "rku-d")}</span>
        <h2>${esc(nm)}</h2><p class="rku-tag" data-full="${esc(line)}"></p>
        <button class="btn primary big" id="rkuGo">${t("continue")}</button><p class="sm rku-hint">${L("Tap to skip", "Toca para saltar")}</p></div>`;
    document.body.appendChild(d); requestAnimationFrame(() => d.classList.add("in"));
    Sound.sfx("rankfan", { root: ROOT[tier] });
    const tag = d.querySelector(".rku-tag"); let ti = 0, typer = 0, stamped = false;
    const type = () => { tag.textContent = line.slice(0, ++ti); if (ti < line.length) typer = setTimeout(type, 22); };
    const stamp = () => { if (stamped) return; stamped = true; d.classList.add("stamped"); Sound.sfx("rankstamp", { ring: RING[tier] }); A.haptic("rankup"); if (RM()) tag.textContent = line; else typer = setTimeout(type, 260); };
    const tS = setTimeout(stamp, RM() ? 100 : 620);
    const skip = () => { clearTimeout(tS); stamp(); clearTimeout(typer); tag.textContent = line; d.classList.add("end"); };
    const close = () => { clearTimeout(tS); clearTimeout(typer); d.classList.add("out"); setTimeout(() => { d.remove(); done(); }, 300); };
    d.addEventListener("click", e => { if (e.target.closest("#rkuGo")) return close(); if (!d.classList.contains("end")) skip(); });
    setTimeout(() => d.classList.add("end"), RM() ? 300 : 1900); });

  /* wire the tiers into the existing hooks */
  A.rankUp = r => setTimeout(() => A.rankScene(r), 900);
  const toast0 = A.toast;
  A.toast = (html, cls = "") => {
    if (/\bgold\b/.test(cls) && !/gear/.test(cls)) { const m = html.match(/^\s*(\S+)\s+(?:<b>)?([\s\S]*?)(?:<\/b>)?\s*$/); if (m) return A.badgeCard(m[1], m[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&")); }
    return toast0(html, cls); };
  /* gear: replace the plain toast with the drop-on card (postcap calls A.gearToast when present) */
  A.gearToast = (g, prev) => A.gearCard(g, prev);
})();
