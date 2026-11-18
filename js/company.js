/* COMPANY DASHBOARD (manager view) — v1 runs on clearly labeled DEMO data stored on this device.
   Data model (ready for a backend):
     Company   { id, name, plan, crew: CrewMember[] }
     CrewMember{ id, name, avatar, role, pathId, assignedBy, assignedAt, xp, progressPct, lastActive,
                 scores: { [quizKey]: { best, attempts } }, certs: Certificate[] }
     Certificate { id: "HVP-XXXX-XXXX", type: certId (see App.CERTS), holder, earnedAt, score, verified: "practice" }
   Swap CompanyAPI's methods for fetch() calls to a real server later; the views only use CompanyAPI. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, V = A.views, $ = s => document.querySelector(s);
  const L = (en, es) => S.lang === "es" ? es : en, KEY = "hvac.company.demo";
  const day = 864e5, now = Date.now();
  const mk = (id, name, avatar, role, pathId, xp, pct, scores, certs, lastDays) => ({ id, name, avatar, role, pathId, assignedBy: "demo-manager", assignedAt: now - 40 * day, xp, progressPct: pct, lastActive: now - lastDays * day, scores, certs: certs.map(([type, d, score]) => ({ id: A.certId(type, name, now - d * day), type, holder: name, earnedAt: now - d * day, score, verified: "practice" })) });
  const DEMO = () => ({ id: "demo-co", name: L("Demo Heating & Air (sample data)", "Demo Calefacción y Aire (datos de ejemplo)"), plan: "demo", crew: [
    mk("c1", "Marcus T.", "hardhat", "Helper", "residential_service_tech", 1650, 34, { "epa:core": { best: 85, attempts: 3 }, "check:guide:safety": { best: 100, attempts: 1 } }, [["hvac101", 21, 92], ["epa-core", 6, 85]], 0),
    mk("c2", "Lupe R.", { body: "b", skin: "#C68642", hair: "braids", hairColor: "#2B1B12", facial: "none", glasses: true, head: "hardhat", headColor: "#FFC107", top: "hivis", topColor: "#C6FF00", pants: "work", pantsColor: "#35537F", boots: "brown", tool: "drill" }, "Apprentice", "residential_installer", 3400, 58, { "epa:core": { best: 95, attempts: 2 }, "epa:type2": { best: 80, attempts: 2 } }, [["hvac101", 60, 100], ["epa-core", 30, 95], ["hands-on", 9, 88]], 1),
    mk("c3", "Devon K.", "gauge", "New hire", "residential_service_tech", 220, 6, { "check:guide:safety": { best: 67, attempts: 2 } }, [], 3),
    mk("c4", "Ana M.", "snow", "Crew member", "commercial_service_tech", 5100, 72, { "epa:core": { best: 100, attempts: 1 }, "epa:type2": { best: 90, attempts: 1 }, "epa:type3": { best: 80, attempts: 2 } }, [["hvac101", 120, 96], ["epa-core", 90, 100], ["epa-all", 45, 90], ["rtw", 20, 84]], 0),
    mk("c5", "Jake P.", "wrench", "Helper", "commercial_installer", 900, 19, { "epa:core": { best: 60, attempts: 2 } }, [["hvac101", 14, 80]], 8)
  ] });
  const load = () => { let c = null; try { c = JSON.parse(localStorage.getItem(KEY)); } catch (e) {} if (!c) { c = DEMO(); localStorage.setItem(KEY, JSON.stringify(c)); } return c; };
  const store = c => localStorage.setItem(KEY, JSON.stringify(c));
  window.CompanyAPI = {
    async getCompany() { return load(); },
    async assignPath(memberId, pathId) { const c = load(); const m = c.crew.find(x => x.id === memberId); if (m) { m.pathId = pathId; m.assignedAt = Date.now(); m.assignedBy = "you (demo)"; } store(c); return m; },
    async verifyCert(id) { id = (id || "").trim().toUpperCase(); const c = load(); for (const m of c.crew) { const f = m.certs.find(x => x.id === id); if (f) return { ...f, source: "demo" }; }
      for (const k of Object.keys(S.certs)) if (A.certId(k) === id) return { id, type: k, holder: S.name, earnedAt: S.certs[k], verified: "practice", source: "device" }; return null; },
    async reset() { localStorage.removeItem(KEY); }
  };
  const certTitle = type => { const c = A.CERTS.find(x => x.id === type); return c ? tx(c.title) : type; };
  const date = ts => new Date(ts).toLocaleDateString(S.lang === "es" ? "es-MX" : "en-US", { month: "short", day: "numeric", year: "numeric" });
  const PATHS = ["residential_service_tech", "residential_installer", "commercial_service_tech", "commercial_installer"];
  let CO = null;
  V.company = ([sub]) => {
    if (!CO) { CompanyAPI.getCompany().then(c => { CO = c; A.render(); }); return `<main class="page">${A.head(L("Company Dashboard", "Panel de empresa"))}<div class="empty">${A.saying("loading", true)}</div></main>`; }
    const tab = A.coTab || "crew", banner = `<div class="note warn demo-banner">${ico("info", 16)}<div><b>${L("DEMO DATA", "DATOS DE DEMOSTRACIÓN")}</b> · ${L("Sample crew on this device only. Real accounts and syncing come with a backend.", "Equipo de ejemplo solo en este dispositivo. Cuentas reales y sincronización llegarán con un servidor.")}</div></div>`;
    const tabs = `<div class="seg"><button data-ct="crew" class="${tab === "crew" ? "sel" : ""}">${L("Crew", "Equipo")}</button><button data-ct="assign" class="${tab === "assign" ? "sel" : ""}">${L("Assign", "Asignar")}</button><button data-ct="verify" class="${tab === "verify" ? "sel" : ""}">${L("Verify", "Verificar")}</button></div>`;
    if (sub) { const m = CO.crew.find(x => x.id === sub); if (!m) return V.notfound();
      return `<main class="page">${A.head(m.name, "#/company")}${banner}<section class="card"><div class="row gap">${avatarSVG(m.avatar, 96)}<div class="grow"><h2>${esc(m.name)}</h2><div class="muted sm">${esc(m.role)} · ${esc(tx(PATH_LABELS[m.pathId]))}</div></div>${ringSVG(m.progressPct, 64)}</div>
        <div class="stats"><div><b>${m.xp}</b>XP</div><div><b>${m.certs.length}</b>${L("certs", "cert.")}</div><div><b>${Object.keys(m.scores).length}</b>${L("quizzes", "quizzes")}</div><div><b>${Math.round((Date.now() - m.lastActive) / day)}d</b>${L("last seen", "últ. vez")}</div></div></section>
        <h3 class="sec-h">${L("Scores", "Puntajes")}</h3><section class="card">${Object.entries(m.scores).map(([k, v]) => `<div class="ft-li"><span>${esc(k.replace("epa:", "EPA 608 ").replace("check:guide:", L("Check: ", "Prueba: ")))}</span><b class="${v.best >= 70 ? "ok" : "warn"}">${v.best}% <small class="muted">×${v.attempts}</small></b></div>`).join("") || `<p class="muted">${L("No quizzes yet.", "Sin quizzes todavía.")}</p>`}</section>
        <h3 class="sec-h">${L("Practice certificates", "Certificados de práctica")}</h3>${m.certs.map(c => `<section class="card tight"><b>${esc(certTitle(c.type))}</b><div class="sm muted">${c.id} · ${date(c.earnedAt)} · ${c.score}%</div></section>`).join("") || `<p class="muted">${L("None yet.", "Ninguno todavía.")}</p>`}</main>`; }
    let body = "";
    if (tab === "crew") { const avg = Math.round(CO.crew.reduce((a, m) => a + m.progressPct, 0) / CO.crew.length), epa = CO.crew.filter(m => m.certs.some(c => c.type === "epa-core")).length;
      body = `<section class="card"><div class="stats"><div><b>${CO.crew.length}</b>${L("crew", "equipo")}</div><div><b>${avg}%</b>${L("avg path", "ruta prom.")}</div><div><b>${epa}</b>EPA Core</div><div><b>${CO.crew.reduce((a, m) => a + m.certs.length, 0)}</b>${L("certs", "cert.")}</div></div></section>
        <div class="card-list">${CO.crew.slice().sort((a, b) => b.progressPct - a.progressPct).map(m => `<a class="list-card" href="#/company/${m.id}">${avatarSVG(m.avatar, 44, { mode: "bust" })}<span class="grow"><b>${esc(m.name)}</b><span class="sm muted block">${esc(tx(PATH_LABELS[m.pathId]))}</span><span class="mini-bar"><span style="width:${m.progressPct}%"></span></span> <span class="sm">${m.progressPct}%</span></span>${(Date.now() - m.lastActive) > 7 * day ? `<span class="chip warn sm">${L("idle", "inactivo")}</span>` : ""}${ico("arrow", 18)}</a>`).join("")}</div>`; }
    if (tab === "assign") body = `<p class="muted sm">${L("Pick a path for each person. Their app will follow it (when connected to a backend).", "Elige una ruta para cada persona. Su app la seguirá (cuando haya servidor).")}</p>${CO.crew.map(m => `<section class="card tight"><div class="row gap">${avatarSVG(m.avatar, 36, { mode: "bust" })}<b class="grow">${esc(m.name)}</b></div><select class="input" data-assign="${m.id}">${PATHS.map(p => `<option value="${p}" ${p === m.pathId ? "selected" : ""}>${esc(tx(PATH_LABELS[p]))}</option>`).join("")}</select></section>`).join("")}`;
    if (tab === "verify") body = `<section class="card"><label class="sm">${L("Certificate ID", "ID del certificado")}<input id="cvId" class="input" placeholder="HVP-XXXX-XXXX" autocapitalize="characters"></label><button class="btn primary big full" id="cvGo">${ico("check", 18)} ${L("Verify", "Verificar")}</button><div id="cvOut" class="mt"></div></section>
      <p class="sm muted">${L("Try a demo ID:", "Prueba un ID de demo:")} <button class="chip btnchip" id="cvDemo">${CO.crew[1].certs[0].id}</button></p><div class="note">${ico("info", 16)}<div>${L("These are practice certificates from this app. They are not EPA, NATE, OSHA, or state credentials. Always check official cards for those.", "Son certificados de práctica de esta app. No son credenciales de EPA, NATE, OSHA ni estatales. Para esas, revisa siempre las tarjetas oficiales.")}</div></div>`;
    return `<main class="page">${A.head(L("Company Dashboard", "Panel de empresa"), "#/more")}${banner}<h2>${esc(CO.name)}</h2>${tabs}${body}<button class="btn ghost full mt" id="coReset">${L("Reset demo data", "Restablecer demo")}</button></main>`;
  };
  A.bind.company = () => {
    document.querySelectorAll("[data-ct]").forEach(b => b.onclick = () => { A.coTab = b.dataset.ct; A.render(); });
    document.querySelectorAll("[data-assign]").forEach(s => s.onchange = async () => { await CompanyAPI.assignPath(s.dataset.assign, s.value); CO = await CompanyAPI.getCompany(); A.toast(L("Path assigned", "Ruta asignada")); });
    const go = $("#cvGo"); if (go) { const run = async () => { const r = await CompanyAPI.verifyCert($("#cvId").value);
      $("#cvOut").innerHTML = r ? `<div class="feedback ok"><b>${ico("check", 18)} ${L("Valid practice certificate", "Certificado de práctica válido")}</b><p class="sm">${esc(certTitle(r.type))}<br>${esc(r.holder)} · ${date(r.earnedAt)}${r.source === "demo" ? ` · <span class="chip sm">DEMO</span>` : ""}</p></div>` : `<div class="feedback bad"><b>${L("No match", "Sin coincidencia")}</b><p class="sm">${L("Check the ID and try again.", "Revisa el ID e intenta otra vez.")}</p></div>`; };
      go.onclick = run; $("#cvId").onkeydown = e => { if (e.key === "Enter") run(); }; }
    const dm = $("#cvDemo"); if (dm) dm.onclick = () => { $("#cvId").value = dm.textContent; $("#cvGo").click(); };
    const rs = $("#coReset"); if (rs) rs.onclick = async () => { await CompanyAPI.reset(); CO = null; A.render(); };
  };
})();
