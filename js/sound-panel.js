/* SOUND PANEL: the top-right cog opens a bottom sheet with a mixer (Master, Music, Game sounds, Quiz sounds, Clicks & page turns),
   each slider previewing its bus while you drag, plus Mute all, Haptics and Game-day mode (music off, SFX on).
   Values persist in S.settings.vol / .haptics / .gameDay and are routed through the audio.js buses (Sound.setVolumes).
   The same controls are mirrored in More > Settings (A.soundControls / A.bindSoundControls). */
(function () {
  const A = window.App, S = A.S, esc = A.esc, $ = s => document.querySelector(s);
  const L = (en, es) => (S.lang === "es" ? es : en);
  const ROWS = () => [
    ["master", "sound", L("Master", "General"), L("Everything", "Todo")],
    ["music", "play", L("Music", "Música"), L("Menu, study and arcade loops", "Loops de menú, estudio y arcade")],
    ["game", "game", L("Game sounds", "Sonidos de juego"), L("Wire snaps, torch, hiss, pumps", "Cables, soplete, siseo, bombas")],
    ["quiz", "star", L("Quiz sounds", "Sonidos de quiz"), L("Cha-ching, buzzer, streaks", "Cha-ching, chicharra, rachas")],
    ["ui", "hand", L("Clicks & page turns", "Clics y páginas"), L("Buttons and screen changes", "Botones y cambios de pantalla")]];
  /* migrate the old on/off switches into the mixer (the panel has no separate Music / UI-clicks switches) */
  if (S.settings.uiClicks === false) { S.settings.vol.ui = 0; S.settings.uiClicks = true; A.save(); }
  if (S.settings.music === false) { S.settings.vol.music = 0; S.settings.music = true; A.save(); }
  const pct = v => Math.round((v == null ? 0.8 : v) * 100);
  A.soundControls = (idp = "sp") => { const v = S.settings.vol, gd = !!S.settings.gameDay, on = S.settings.sound !== false;
    return `<div class="sp-controls ${on ? "" : "is-muted"}" data-sp="${idp}">
      <label class="switch-row sp-mute"><span>${ico(on ? "sound" : "mute", 18)} <b>${L("Sound on", "Sonido")}</b></span><input type="checkbox" class="switch" data-spk="sound" ${on ? "checked" : ""}></label>
      ${ROWS().map(([k, i, n, sub]) => { const dis = k === "music" && gd;
        return `<div class="sp-row ${dis ? "dis" : ""}" data-row="${k}"><div class="sp-lbl">${ico(i, 16)}<span><b>${n}</b><small>${dis ? L("Off in game-day mode", "Apagada en modo partido") : sub}</small></span><output id="${idp}-${k}-o">${pct(v[k])}</output></div>
          <input type="range" class="sp-range" min="0" max="100" step="1" value="${pct(v[k])}" data-vol="${k}" style="--v:${pct(v[k])}%" aria-label="${esc(n)}" ${dis ? "disabled" : ""}></div>`; }).join("")}
      <label class="switch-row"><span>${ico("hand", 18)} ${L("Haptics", "Vibración")}<small class="block muted">${"vibrate" in navigator ? L("Distinct buzz for taps, correct, wrong, streaks and rank-ups", "Vibración distinta para toques, aciertos, errores, rachas y rangos") : L("This browser can't vibrate (iPhone Safari). You get a soft edge glow instead.", "Este navegador no vibra (Safari de iPhone). Verás un brillo suave en el borde.")}</small></span><input type="checkbox" class="switch" data-spk="haptics" ${S.settings.haptics !== false ? "checked" : ""}></label>
      <label class="switch-row"><span>${ico("flag", 18)} ${L("Game-day mode", "Modo partido")}<small class="block muted">${L("Music off, sound effects stay on", "Sin música, con efectos")}</small></span><input type="checkbox" class="switch" data-spk="gameDay" ${gd ? "checked" : ""}></label>
    </div>`; };
  A.bindSoundControls = (root, rerender) => {
    if (!root) return;
    root.querySelectorAll("[data-vol]").forEach(r => {
      const k = r.dataset.vol, o = root.querySelector(`output[id$="-${k}-o"]`);
      const upd = () => { const v = +r.value / 100; S.settings.vol[k] = v; r.style.setProperty("--v", r.value + "%"); if (o) o.textContent = r.value; Sound.unlock(); Sound.setVolumes({ [k]: v }); };
      /* music at 0 = music stopped (no silent decoding); dragging up from 0 restarts the route's track */
      const musicGate = () => { if (k !== "music") return; const want = +r.value > 0, ms = Sound.musicState(), playing = !!(ms.file || ms.synth); if (want !== playing || !want) { A.applySettings(); if (want && !playing) A.routeMusic(); } };
      r.addEventListener("input", () => { upd(); musicGate(); Sound.preview(k); });
      r.addEventListener("change", () => { upd(); musicGate(); A.save(); document.querySelectorAll(`[data-vol="${k}"]`).forEach(x => { if (x !== r) { x.value = r.value; x.style.setProperty("--v", r.value + "%"); } }); });
    });
    root.querySelectorAll("[data-spk]").forEach(c => c.addEventListener("change", () => {
      const k = c.dataset.spk; S.settings[k] = c.checked; A.save(); Sound.unlock(); A.applySettings(); A.soundBtn && A.soundBtn();
      if (k === "haptics" && c.checked) A.haptic("tap");
      if (k === "sound" && c.checked) setTimeout(() => Sound.sfx("tap"), 30);
      if ((k === "gameDay" && !c.checked) || (k === "sound" && c.checked)) A.routeMusic();
      rerender && rerender();
    }));
  };
  /* bottom sheet */
  A.openSoundSheet = () => {
    if ($("#spSheet")) return closeSheet();
    document.body.insertAdjacentHTML("beforeend", `<div class="sp-back" id="spBack"></div><section class="sp-sheet" id="spSheet" role="dialog" aria-modal="true" aria-label="${L("Sound settings", "Ajustes de sonido")}">
      <div class="pts-grab" id="spGrab"><span></span></div><div class="row between sp-head"><b>${ico("cog", 18)} ${L("Sound", "Sonido")}</b><button class="iconbtn sm" id="spClose" aria-label="${L("Close", "Cerrar")}">${ico("close", 18)}</button></div>
      <div id="spBody">${A.soundControls("sp")}</div><a class="sp-more sm" href="#/settings">${L("All settings", "Todos los ajustes")} ${ico("arrow", 14)}</a></section>`);
    const sh = $("#spSheet"), paint = () => { $("#spBody").innerHTML = A.soundControls("sp"); A.bindSoundControls($("#spBody"), paint); };
    A.bindSoundControls($("#spBody"), paint);
    requestAnimationFrame(() => { sh.classList.add("open"); $("#spBack").classList.add("open"); });
    $("#spBack").onclick = closeSheet; $("#spClose").onclick = closeSheet; sh.querySelector(".sp-more").onclick = () => closeSheet();
    Sound.sfx("whoosh");
    /* swipe down to dismiss (pointer events, grab + header) */
    let y0 = null, dy = 0; const hs = [$("#spGrab"), sh.querySelector(".sp-head")];
    hs.forEach(h => { h.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; y0 = e.clientY; dy = 0; sh.style.transition = "none"; h.setPointerCapture(e.pointerId); });
      h.addEventListener("pointermove", e => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; });
      const end = () => { if (y0 == null) return; y0 = null; sh.style.transition = ""; if (dy > 70) closeSheet(); else sh.style.transform = ""; }; h.addEventListener("pointerup", end); h.addEventListener("pointercancel", end); });
    document.addEventListener("keydown", escClose);
  };
  const escClose = e => { if (e.key === "Escape") closeSheet(); };
  function closeSheet() { const sh = $("#spSheet"), bk = $("#spBack"); document.removeEventListener("keydown", escClose); if (!sh) return; sh.classList.remove("open"); sh.style.transform = ""; bk && bk.classList.remove("open"); setTimeout(() => { sh.remove(); bk && bk.remove(); }, 280); }
  A.closeSoundSheet = closeSheet;
  window.addEventListener("hashchange", () => { if ($("#spSheet")) closeSheet(); });
})();
