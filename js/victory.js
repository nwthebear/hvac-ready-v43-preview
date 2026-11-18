/* VICTORY SCENE — synced to the user's 8 s 'Triumph in Motion' pass sting (~103 bpm, beat ≈ 0.583 s).
   Timeline (s): 0 overlay + speed streaks · 0–0.58 avatar drops in (squash on beat 1) · 1.17–2.92 three hops on beats 2–4
   with arms up · 2.92 trophy rises spinning · 3.50 trophy lands above the hands → UNLOCK sfx + haptic · title card fades in after the avatar lands (~0.8 s) so the message is never invisible.
   Tap anywhere skips to the end state; tap again / Continue closes. Reduced motion: fade + trophy only. Transform/opacity only. */
(function () {
  const A = window.App, S = A.S, esc = A.esc;
  const BEAT = 60 / 103, LAND = 6 * BEAT; // trophy lands on beat 6 (3.50 s)
  const trophy = () => `<svg class="vic-trophy-svg" viewBox="0 0 100 110" aria-hidden="true"><defs>
      <linearGradient id="vtg" x1="0" x2="1"><stop offset="0" stop-color="#7E6A4F"/><stop offset=".35" stop-color="#E9C77B"/><stop offset=".55" stop-color="#F6DFA4"/><stop offset=".8" stop-color="#B8925A"/><stop offset="1" stop-color="#6E5A40"/></linearGradient>
      <linearGradient id="vtb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a3326"/><stop offset="1" stop-color="#17140f"/></linearGradient></defs>
    <path d="M24 10h52v14c0 22-11 38-26 40C35 62 24 46 24 24z" fill="url(#vtg)" stroke="#5a4a33" stroke-width="2"/>
    <path d="M24 18H10c0 16 8 25 18 27M76 18h14c0 16-8 25-18 27" fill="none" stroke="url(#vtg)" stroke-width="6" stroke-linecap="round"/>
    <rect x="44" y="62" width="12" height="16" fill="url(#vtg)"/><path d="M30 78h40l5 14H25z" fill="url(#vtg)" stroke="#5a4a33" stroke-width="1.5"/>
    <rect x="20" y="92" width="60" height="14" rx="2" fill="url(#vtb)" stroke="#7E6A4F" stroke-width="1.5"/>
    <path d="M50 22l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#FFF3D0" opacity=".85"/></svg>`;
  A.victory = (o = {}) => {
    const es = S.lang === "es", reduced = A.reduced(), cert = o.kind === "cert", gear = o.kind === "gear", rank = o.kind === "rank" || gear, game = o.kind === "game", rec = o.kind === "record";
    const ov = document.createElement("div"); ov.className = "vic" + (reduced ? " vic-reduced" : ""); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", o.title || "Victory"); ov.dataset.t = Date.now(); ov._close = () => close();
    ov.innerHTML = `<button type="button" class="vic-x" id="vicX" aria-label="${es ? "Cerrar" : "Close"}">×</button>
      <div class="vic-bg"><div class="vic-glow"></div>${Array.from({ length: 16 }, (_, i) => `<i class="vic-streak s${i % 4}" style="--y:${(i * 6.4 + 3) % 100}%;--d:${(0.55 + (i * 37 % 9) / 10).toFixed(2)}s;--l:${(i * 53 % 10) / 10}s;--w:${40 + (i * 29 % 50)}%"></i>`).join("")}</div>
      <div class="vic-flash"></div>
      <div class="vic-stage"><div class="vic-trophy">${trophy()}<span class="vic-shine"></span></div>
        <div class="vic-av"><div class="vic-hop">${avatarSVG(o.avatar || S.avatar, 230, { cls: "vic-figure" })}</div><div class="vic-shadow"></div></div></div>
      <div class="vic-card"><div class="eyebrow">${game ? (es ? "Juego desbloqueado" : "Game unlocked") : rec ? (es ? "Nuevo récord" : "New record") : gear ? (es ? "Equipo desbloqueado" : "Gear unlocked") : rank ? (es ? "Subiste de rango" : "Rank up") : cert ? (es ? "Certificado de práctica" : "Practice certificate") : (es ? "Prueba superada" : "Test passed")}</div>
        <h2>${esc(game || rec ? o.title : rank ? o.title : cert ? (es ? "¡Certificado obtenido!" : "Certificate earned!") : (es ? "¡Aprobado!" : "Passed!"))}</h2>
        ${game || rec ? `<p class="vic-sub vic-tag">${esc(o.sub || "")}</p>` : rank ? `<p class="vic-sub vic-tag">${esc(o.sub || "")}</p>` : `<p class="vic-sub">${esc(o.title || "")}${o.sub ? ` · <b>${o.sub}</b>` : ""}</p>`}${o.extras || ""}
        <div class="row gap center st-btns" style="flex-wrap:wrap;justify-content:center">${o.laterLabel ? `<button class="btn primary big" id="vicGo">${esc(o.goLabel || t("continue"))}</button><button class="btn big vic-later" id="vicLater">${esc(o.laterLabel)}</button>` : `<button class="btn primary big" id="vicGo">${esc(o.goLabel || t("continue"))}</button>`}${o.again ? `<button class="btn" id="vicAgain">${t("playAgain")}</button>` : ""}</div>
        <p class="sm muted vic-hint">${es ? "Toca para saltar" : "Tap to skip"}</p></div>`;
    document.body.appendChild(ov); document.body.classList.add("vic-open");
    Sound.sting && Sound.sting("pass");
    let landed = false, done = false;
    const land = () => { if (landed) return; landed = true; Sound.sfx("unlock"); A.haptic("unlock"); ov.classList.add("vic-landed"); };
    /* Keep the hop / trophy beat, but don't hide the title for 3.8s — a full-screen
       textless avatar + X looked broken. Show the message after the avatar lands. */
    const tLand = setTimeout(land, (reduced ? 0.9 : LAND) * 1000);
    const tEnd = setTimeout(() => ov.classList.add("vic-end"), (reduced ? 0.25 : 0.8) * 1000);
    const skip = () => { if (ov.classList.contains("vic-end")) return false; clearTimeout(tEnd); ov.classList.add("vic-skip", "vic-end"); land(); return true; };
    const close = after => { if (done) return; done = true; clearTimeout(tLand); clearTimeout(tEnd); ov.classList.add("vic-out"); Sound.stopSting && Sound.stopSting(); setTimeout(() => { ov.remove(); document.body.classList.remove("vic-open"); after && after(); }, 260); };
    ov.addEventListener("click", e => { if (e.target.closest("#vicGo")) return close(o.onContinue); if (e.target.closest("#vicLater") || e.target.closest("#vicX")) return close(); if (e.target.closest("#vicAgain")) return close(o.again); skip(); });
    return { el: ov, skip, close };
  };
})();
