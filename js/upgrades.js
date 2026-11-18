/* Audit upgrades (Nov 2026): first-run ceremony, install card + offline banner, backup/restore, company code,
   "just looking" skip on Match with Day One queued, Reset All that clears every hvac.* key, consistent light haptics,
   long top-bar titles. Everything is local to this device; nothing is sent anywhere. */
(function () {
  const A = window.App, S = A.S, V = A.views, esc = A.esc, $ = s => document.querySelector(s);
  const L = (en, es) => S.lang === "es" ? es : en;
  const RM = () => A.reduced && A.reduced();

  /* ---------- light haptics, consistent across primary buttons, choices and onboarding taps (honors the Haptics switch) ---------- */
  document.addEventListener("pointerdown", e => {
    if (e.target.closest(".ans, [data-tf], .m-pic, .m-name, .sim-test, .ave-chip, .swatch")) return; /* these already buzz */
    const b = e.target.closest(".btn.primary, .btn.choice, .ave-preset, .tile, .ob-back, .lang-btn, .fr-skip, .fr-start, #nav a");
    if (b && !b.disabled) A.haptic("tap");
  }, { passive: true, capture: true });

  /* ---------- long top-bar titles: two lines max, smaller type, ellipsis after that ---------- */
  const r0 = A.render;
  A.render = (...a) => { r0(...a); const h = document.querySelector(".topbar h1"); if (h) { const n = (h.textContent || "").trim().length; h.classList.toggle("long", n > 22); h.classList.toggle("xlong", n > 38); h.title = h.textContent.trim(); } A.offlineBanner(); };

  /* ---------- offline banner ---------- */
  A.offlineBanner = () => { let b = $("#offBan"); const off = navigator.onLine === false;
    if (!off) { if (b) b.remove(); return; }
    if (!b) { document.body.insertAdjacentHTML("beforeend", `<div id="offBan" class="off-banner" role="status">${ico("info", 16)} <span></span></div>`); b = $("#offBan"); }
    b.querySelector("span").textContent = L("You're offline. Lessons and games you've opened still work; links to outside sources need a connection.", "Sin conexión. Las lecciones y juegos que ya abriste siguen funcionando; los enlaces a fuentes externas necesitan internet."); };
  window.addEventListener("online", A.offlineBanner); window.addEventListener("offline", A.offlineBanner);

  /* ---------- install ("Add to Home Screen") card: once, after the first finished lesson ---------- */
  let bip = null; window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); bip = e; if (A._route && A._route.name === "home") A.render(); });
  window.addEventListener("appinstalled", () => { S.a2hs = "installed"; A.save(); const c = $("#a2hs"); if (c) c.remove(); });
  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const lessonDone = () => Object.keys(S.done).some(k => /^(guide|skill|video):/.test(k));
  A.a2hsCard = () => {
    if (standalone() || S.a2hs || !lessonDone()) return "";
    const how = isIOS() ? L("In Safari, tap <b>Share</b> (the square with the arrow), then <b>Add to Home Screen</b>.", "En Safari, toca <b>Compartir</b> (el cuadro con la flecha) y luego <b>Agregar a inicio</b>.")
      : bip ? L("Install it like an app: it opens full screen and works offline.", "Instálala como app: abre en pantalla completa y funciona sin conexión.")
      : L("Open your browser menu (⋮) and choose <b>Install app</b> or <b>Add to Home screen</b>.", "Abre el menú del navegador (⋮) y elige <b>Instalar app</b> o <b>Agregar a la pantalla principal</b>.");
    return `<section class="card a2hs" id="a2hs"><div class="row gap"><img src="img/logo.png" alt="" width="44" height="44" class="a2hs-ico"><div class="grow"><b>${L("Put HVAC Ready on your home screen", "Pon HVAC Ready en tu pantalla de inicio")}</b><p class="sm muted">${how}</p></div></div>
      <div class="row gap">${bip && !isIOS() ? `<button class="btn primary grow" id="a2hsGo">${ico("arrow", 16)} ${L("Install", "Instalar")}</button>` : ""}<button class="btn ghost grow" id="a2hsNo">${L("Got it", "Entendido")}</button></div></section>`;
  };
  const bindA2hs = () => { const go = $("#a2hsGo"), no = $("#a2hsNo");
    if (go) go.onclick = async () => { try { bip.prompt(); const r = await bip.userChoice; S.a2hs = r && r.outcome === "accepted" ? "installed" : "dismissed"; } catch (e) { S.a2hs = "dismissed"; } bip = null; A.save(); const c = $("#a2hs"); if (c) c.remove(); };
    if (no) no.onclick = () => { S.a2hs = "dismissed"; A.save(); const c = $("#a2hs"); if (c) c.remove(); }; };

  /* ---------- Home: Day One queue (from "just looking") + install card ---------- */
  const home0 = V.home, bhome0 = A.bind.home;
  V.home = (...a) => { let h = home0(...a);
    const queued = !A.plan() && S.queue === "dayone" ? `<a class="card hero-card queued" href="#/dayone"><div class="eyebrow">${L("Queued for you", "En tu fila")}</div><h2>${L("Day One Survival", "Supervivencia del Día Uno")}</h2><p class="muted sm">${L("Five quick cards on what your first day on a truck actually looks like. No quiz.", "Cinco tarjetas rápidas sobre cómo es en realidad tu primer día en la camioneta. Sin examen.")}</p><span class="btn primary big full">${ico("play", 18)} ${L("Start Day One", "Empezar Día Uno")}</span></a>` : "";
    if (queued) h = h.replace('<a class="card hero-card cta"', queued + '<a class="card hero-card cta second"');
    const card = A.a2hsCard(); if (card) h = h.includes("<!--a2hs-->") ? h.replace("<!--a2hs-->", card) : h.replace(/(<h3 class="sec-h">)/, card + "$1");
    return h; };
  A.bind.home = (...a) => { if (bhome0) bhome0(...a); bindA2hs(); };
  const day0 = A.bind.dayone; A.bind.dayone = (...a) => { if (S.queue === "dayone") { S.queue = null; A.save(); } if (day0) day0(...a); };

  /* ---------- Match: "Just want to look around" ---------- */
  const match0 = V.match, bmatch0 = A.bind.match;
  V.match = (...a) => { const h = match0(...a); if ((A.mIdx || 0) !== 0) return h;
    return h.replace(/(<div class="row gap sticky-cta">)/, `<button class="btn link full look-around" id="lookAround">${L("Just want to look around? Skip to Home", "¿Solo quieres echar un vistazo? Ir al inicio")} ${ico("arrow", 14)}</button>$1`); };
  A.bind.match = (...a) => { bmatch0(...a); const la = $("#lookAround"); if (la) la.onclick = () => { S.queue = "dayone"; S.lookAround = Date.now(); A.mIdx = 0; A.mAns = null; A.save(); A.go("#/home"); }; };

  /* ---------- first-run ceremony (after the avatar step; deadpan, skippable) ---------- */
  A.firstRun = done => {
    const r = window.RANKS[0], es = S.lang === "es";
    const finish = () => { if (ov._done) return; ov._done = true; clearT(); S.ceremonySeen = Date.now(); A.save(); ov.classList.add("fr-out"); setTimeout(() => ov.remove(), RM() ? 0 : 320); done && done(); };
    const tm = [], at = (ms, f) => tm.push(setTimeout(f, RM() ? Math.min(ms, 60) : ms)), clearT = () => tm.forEach(clearTimeout);
    const ov = document.createElement("div"); ov.className = "fr-ov" + (RM() ? " rm" : ""); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", L("Welcome", "Bienvenida"));
    ov.innerHTML = `<button class="fr-skip" id="frSkip">${L("Skip", "Saltar")}</button>
      <div class="fr-stage">
        <div class="fr-av">${avatarSVG(S.avatar, 150)}</div>
        <p class="fr-cap fr-c1">${esc(L(`${S.name}. Reporting for duty.`, `${S.name}. Presentándose a trabajar.`))}</p>
        <div class="fr-rank"><span class="fr-rank-ico">${r.icon}</span><div><div class="eyebrow">${L("Rank", "Rango")}</div><b>${esc(A.rankName(r, true))}</b><div class="sm muted">${esc(tx(r.line))}</div></div></div>
        <div class="fr-trail"><svg viewBox="0 0 300 90" aria-hidden="true"><path d="M30 60 Q 90 10 150 50 T 270 40" fill="none" stroke="var(--fde-2)" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/><circle cx="30" cy="60" r="11" class="fr-n done"/><circle cx="150" cy="50" r="11" class="fr-n"/><circle cx="270" cy="40" r="11" class="fr-n far"/></svg><span class="fr-hopper">${avatarSVG(S.avatar, 40, { mode: "bust" })}</span><p class="fr-cap fr-c2">${L("First stop: Day One. It's mostly carrying things.", "Primera parada: Día Uno. Casi todo es cargar cosas.")}</p></div>
        <button class="btn primary big fr-start" id="frStart">${ico("play", 18)} ${L("Tap to start", "Toca para empezar")}</button>
        <p class="sm muted fr-note">${L("Your progress stays on this phone. Back it up anytime in Settings → Backup.", "Tu progreso se queda en este teléfono. Respáldalo cuando quieras en Ajustes → Respaldo.")}</p>
      </div>`;
    document.body.appendChild(ov);
    ov.querySelector("#frSkip").onclick = finish;
    ov.querySelector("#frStart").onclick = () => { Sound.unlock(); A.applySettings(); Sound.playMusic("chill"); finish(); };
    at(60, () => { ov.classList.add("s1"); Sound.sfx("swish"); });
    at(1100, () => ov.classList.add("s2"));
    at(2000, () => { ov.classList.add("s3"); Sound.sfx("stamp"); A.haptic("tap"); });
    at(3400, () => ov.classList.add("s4"));
    at(4100, () => { ov.classList.add("s5"); Sound.sfx("hop"); });
    at(4700, () => { Sound.sfx("land"); ov.querySelector(".fr-n:nth-of-type(2)") && ov.querySelectorAll(".fr-n")[1].classList.add("done"); });
    at(5300, () => ov.classList.add("s6"));
    at(5900, () => { ov.classList.add("s7"); });
    return ov;
  };

  /* ---------- company code (onboarding + Settings). Only the demo code exists; stays honest. ---------- */
  const DEMO_CODES = ["DEMO", "HVAC-DEMO", "DEMO-HVAC"];
  A.applyCompanyCode = raw => { const c = (raw || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!c) return L("Enter a code, or skip this. You can add one later in Settings.", "Escribe un código o sáltalo. Puedes agregarlo después en Ajustes.");
    if (DEMO_CODES.includes(c)) { S.companyCode = "DEMO"; S.settings.company = true; A.save(); return L("Demo code accepted. The Company dashboard (in Home → Explore) shows sample crew data stored only on this device. No real company account is connected.", "Código demo aceptado. El panel de Empresa (Inicio → Explorar) muestra datos de ejemplo guardados solo en este dispositivo. No hay una cuenta real de empresa conectada."); }
    return L("That code isn't recognized. Company accounts aren't live in this version; use DEMO to preview the manager dashboard with sample data.", "Ese código no se reconoce. Las cuentas de empresa aún no están activas en esta versión; usa DEMO para ver el panel de gerente con datos de ejemplo."); };

  /* ---------- backup / restore (local only: a code you copy, or a file you download) ---------- */
  const b64u = buf => { let s = ""; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64u = str => { str = str.replace(/-/g, "+").replace(/_/g, "/"); while (str.length % 4) str += "="; const s = atob(str), b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; };
  const pipe = async (bytes, T) => new Response(new Blob([bytes]).stream().pipeThrough(T)).arrayBuffer();
  const snapshot = () => { A.save(); return { app: "hvac-ready", v: 1, at: new Date().toISOString(), state: JSON.parse(localStorage.getItem(A.KEY) || "{}") }; };
  A.backupCode = async () => { const json = JSON.stringify(snapshot().state), raw = new TextEncoder().encode(json);
    if (window.CompressionStream) { try { return "HVP1." + b64u(await pipe(raw, new CompressionStream("deflate-raw"))); } catch (e) {} }
    return "HVP0." + b64u(raw); };
  A.restoreCode = async code => { code = (code || "").trim().replace(/\s+/g, ""); let json;
    if (code.startsWith("{")) json = code;
    else if (code.startsWith("HVP1.")) json = new TextDecoder().decode(await pipe(unb64u(code.slice(5)), new DecompressionStream("deflate-raw")));
    else if (code.startsWith("HVP0.")) json = new TextDecoder().decode(unb64u(code.slice(5)));
    else throw new Error("format");
    let st = JSON.parse(json); if (st && (st.app === "hvac-ready" || st.app === "hvac-path") && st.state) st = st.state;
    if (!st || typeof st !== "object" || !("xp" in st) || !("done" in st)) throw new Error("content");
    localStorage.setItem(A.KEY, JSON.stringify(st)); return st; };
  const downloadBackup = () => { const blob = new Blob([JSON.stringify(snapshot(), null, 1)], { type: "application/json" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `hvac-ready-backup-${A.today()}.json`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };

  /* ---------- Settings: Backup + Company code cards, Reset All clears every hvac.* key ---------- */
  const set0 = V.settings, bset0 = A.bind.settings;
  V.settings = (...a) => { let h = set0(...a);
    const co = S.settings.company && S.companyCode;
    const cards = `<section class="card" id="backupCard"><h3>${ico("box", 20)} ${L("Backup & restore", "Respaldo y restauración")}</h3><p class="sm muted">${L("Your progress lives only on this device. Save a backup code or file, then restore it here on a new phone or after clearing your browser. Nothing is uploaded.", "Tu progreso vive solo en este dispositivo. Guarda un código o archivo de respaldo y restáuralo aquí en un teléfono nuevo o después de borrar el navegador. No se sube nada.")}</p>
      <div class="row gap wrap"><button class="btn primary grow" id="bkCode">${ico("send", 16)} ${L("Get backup code", "Obtener código")}</button><button class="btn grow" id="bkFile">${ico("arrow", 16)} ${L("Download file", "Descargar archivo")}</button></div>
      <textarea id="bkOut" class="input mono" rows="3" readonly hidden aria-label="${L("Backup code", "Código de respaldo")}"></textarea><div class="sm muted" id="bkMsg" aria-live="polite"></div>
      <details class="mt"><summary class="sm"><b>${L("Restore from a backup", "Restaurar un respaldo")}</b></summary><textarea id="bkIn" class="input mono mt" rows="3" placeholder="HVP1.…" aria-label="${L("Paste backup code", "Pega el código")}"></textarea>
        <div class="row gap wrap"><button class="btn grow" id="bkRestore">${L("Restore code", "Restaurar código")}</button><label class="btn grow file-btn">${L("Choose file…", "Elegir archivo…")}<input type="file" id="bkPick" accept=".json,application/json" hidden></label></div></details></section>
      <section class="card" id="coCard"><h3>${ico("user", 20)} ${L("Company code", "Código de empresa")}</h3>${co ? `<p class="sm">${ico("check", 14, "ok")} ${L("Demo company dashboard is on (sample data on this device).", "El panel demo de empresa está activo (datos de ejemplo en este dispositivo).")}</p><div class="row gap"><a class="btn primary grow" href="#/company">${L("Open dashboard", "Abrir panel")}</a><button class="btn grow" id="coOff">${L("Remove code", "Quitar código")}</button></div>`
        : `<p class="sm muted">${L("Optional. If your employer gave you a code, enter it here. This version only includes a demo (code: DEMO).", "Opcional. Si tu empresa te dio un código, escríbelo aquí. Esta versión solo incluye un demo (código: DEMO).")}</p><div class="row gap"><input class="input grow" id="coIn" maxlength="24" autocapitalize="characters" placeholder="${L("Code", "Código")}"><button class="btn" id="coGo">${L("Apply", "Usar")}</button></div><p class="sm muted" id="coMsg" aria-live="polite"></p>`}</section>`;
    const i = h.lastIndexOf('<section class="card"><a class="list-card" href="#/credits">');
    return i > 0 ? h.slice(0, i) + cards + h.slice(i) : h.replace("</main>", cards + "</main>"); };
  A.bind.settings = (...a) => { bset0(...a);
    const msg = t => { const m = $("#bkMsg"); if (m) m.textContent = t; };
    $("#bkCode").onclick = async () => { const code = await A.backupCode(), o = $("#bkOut"); o.hidden = false; o.value = code; o.select();
      let copied = false; try { await navigator.clipboard.writeText(code); copied = true; } catch (e) {}
      msg((copied ? L("Copied. ", "Copiado. ") : "") + L(`${code.length} characters. Keep it somewhere safe (notes app, email to yourself).`, `${code.length} caracteres. Guárdalo en un lugar seguro (notas, un correo a ti mismo).`)); };
    $("#bkFile").onclick = () => { downloadBackup(); msg(L("Backup file downloaded.", "Archivo de respaldo descargado.")); };
    const restore = async txt => { try { await A.restoreCode(txt); msg(L("Restored. Reloading…", "Restaurado. Recargando…")); setTimeout(() => { location.hash = "#/home"; location.reload(); }, 600); } catch (e) { msg(L("That doesn't look like an HVAC Ready backup. Nothing was changed.", "Eso no parece un respaldo de HVAC Ready. No se cambió nada.")); } };
    $("#bkRestore").onclick = () => { const v = $("#bkIn").value; if (!v.trim()) return; if (confirm(L("Replace the progress on this device with the backup?", "¿Reemplazar el progreso de este dispositivo con el respaldo?"))) restore(v); };
    $("#bkPick").onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(txt => { if (confirm(L("Replace the progress on this device with the backup?", "¿Reemplazar el progreso de este dispositivo con el respaldo?"))) restore(txt); }); };
    const cg = $("#coGo"); if (cg) cg.onclick = () => { const m = A.applyCompanyCode($("#coIn").value); if (S.settings.company) A.render(); else $("#coMsg").textContent = m; };
    const cf = $("#coOff"); if (cf) cf.onclick = () => { S.settings.company = false; S.companyCode = null; A.save(); A.render(); };
    $("#rst").onclick = () => { if (!confirm(t("resetConfirm"))) return;
      Object.keys(localStorage).filter(k => k.startsWith("hvac.")).forEach(k => localStorage.removeItem(k)); /* hvac.state.v1, hvac.splash, hvac.humor, hvac.company.demo, … */
      try { Object.keys(sessionStorage).filter(k => k.startsWith("hvac.")).forEach(k => sessionStorage.removeItem(k)); } catch (e) {}
      location.hash = ""; location.reload(); };
  };
})();
