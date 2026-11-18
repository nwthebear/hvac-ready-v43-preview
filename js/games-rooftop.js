/* ROOFTOP RUN v2: third-person lane runner across a commercial roof at sunset. The call at the top says what the job
   needs; grab the right gear for it, skip the wrong gear, dodge hazards, step over conduit. Every pickup or hit flashes
   a one-line why with its source. Ends at the RTU with the air-path trace, then a summary of what to fix.
   Facts: OSHA 29 CFR 1910.28(b)(3) holes/skylights & hatchways, 1910.28(b)(13) low-slope roofs, 1910.22 walking-working
   surfaces, 1910.147 lockout/tagout, OSHA heat guidance, OEM capacitor replacement practice, EPA/ASHRAE refrigerant rules. */
(function () {
  const A = window.App, S = A.S, esc = A.esc, TG = A.TG, $ = s => document.querySelector(s), L = TG.L;
  const RR = TG.game("rooftop_run"), T = (en, es) => ({ en, es });
  Object.assign(window.GAMES_DATA.sources, {
    osha_1910_28: { title: "OSHA 29 CFR 1910.28 — Duty to have fall protection (holes and skylights (b)(3), low-slope roofs (b)(13))", url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.28", type: "federal regulation" },
    osha_1910_22: { title: "OSHA 29 CFR 1910.22 — Walking-working surfaces (inspect, correct or guard hazards)", url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.22", type: "federal regulation" },
    osha_1910_147: { title: "OSHA 29 CFR 1910.147 — Control of hazardous energy (lockout/tagout)", url: "https://www.osha.gov/control-hazardous-energy", type: "federal regulation" },
    osha_heat: { title: "OSHA — Heat exposure: water, rest, shade", url: "https://www.osha.gov/heat-exposure", type: "federal guidance" },
    epa_608_regs: { title: "EPA Section 608 / 40 CFR Part 82 Subpart F (no mixing, no venting, approved recovery)", url: "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-C/part-82/subpart-F", type: "federal regulation" },
    ahri_a2l: { title: "AHRI Safe Refrigerant Transition (A2L tools, red-band cylinders)", url: "https://www.ahrinet.org/safe-refrigerant-task-force", type: "industry" },
    cap_rule: { title: "Run-capacitor replacement: same µF (within tolerance), voltage rating equal or higher (OEM practice; see HVAC School tech tips)", url: "https://www.hvacrschool.com/tech-tips-library/", type: "trade reference" },
    gas_ifgc: { title: "IFGC 2024 + manufacturer gas-valve instructions (leak test with solution/detector, never flame; orifices match the fuel)", url: "https://codes.iccsafe.org/content/IFGC2024V2.0", type: "model code" }
  });
  /* ---------- items (neutral cards: no color hints which are right) ---------- */
  const I = {
    g410: { ic: "gauge", t: T("R-410A gauges", "Manómetros R-410A") }, cyl410: { ic: "cyl", c: "#c8c3b8", t: T("R-410A", "R-410A") }, cyl454: { ic: "cyl", c: "#c8c3b8", band: 1, t: T("R-454B", "R-454B") }, cyl22: { ic: "cyl", c: "#c8c3b8", t: T("R-22", "R-22") },
    cap445: { ic: "cap", t: T("45/5 µF 440V", "45/5 µF 440V") }, cap355: { ic: "cap", t: T("35/5 µF 440V", "35/5 µF 440V") }, cap370: { ic: "cap", t: T("45/5 µF 370V", "45/5 µF 370V") },
    filter: { ic: "filter", t: T("Filters", "Filtros") }, harness: { ic: "harness", t: T("Harness", "Arnés") }, loto: { ic: "tag", t: T("Lock & tag", "Candado y etiqueta") }, water: { ic: "water", t: T("Water", "Agua") },
    jumper: { ic: "jumper", t: T("Jumper wire", "Cable puente") }, a2lrec: { ic: "rec", a2l: 1, t: T("A2L recovery", "Recuperadora A2L") }, oldrec: { ic: "rec", t: T("Recovery (A1 only)", "Recuperadora (solo A1)") },
    a2ldet: { ic: "det", t: T("A2L leak detector", "Detector A2L") }, n2: { ic: "cyl", c: "#4d5a4a", t: T("N₂ + regulator", "N₂ + regulador") }, oxy: { ic: "cyl", c: "#4a6a4a", t: T("Oxygen", "Oxígeno") }, micron: { ic: "micron", t: T("Micron gauge", "Vacuómetro") },
    lighter: { ic: "flame", t: T("Lighter", "Encendedor") }, mano: { ic: "mano", t: T("Manometer", "Manómetro de gas") }, combo: { ic: "analyzer", t: T("Combustion analyzer", "Analizador de combustión") }, pad: { ic: "pad", t: T("Fine abrasive pad", "Fibra abrasiva fina") },
    meter: { ic: "meter", t: T("Meter (µA)", "Multímetro (µA)") }, lp: { ic: "orifice", t: T("LP orifice kit", "Orificios de LP") }, flametest: { ic: "flame", t: T("Flame leak test", "Probar fuga con flama") }
  };
  const W = (en, es, src) => ({ w: T(en, es), src });
  const COMMON_GOOD = {
    harness: W("Within 15 ft of a roof edge you need fall protection (OSHA 1910.28(b)(13)).", "A menos de 15 ft de la orilla necesitas protección contra caídas (OSHA 1910.28(b)(13)).", "osha_1910_28"),
    loto: W("Lock out and tag the disconnect before your hands go in (OSHA 1910.147).", "Bloquea y etiqueta el desconectador antes de meter las manos (OSHA 1910.147).", "osha_1910_147"),
    water: W("Roofs run hot. Water, rest, shade (OSHA heat guidance).", "Las azoteas son calientes. Agua, descanso y sombra (guía de calor de OSHA).", "osha_heat"),
    filter: W("Dirty filters starve airflow. Check them before you touch the charge.", "Filtros sucios ahogan el aire. Revísalos antes de tocar la carga.", "cap_rule") };
  const CALLS = [
    { id: "cool410", call: T("RTU not cooling · R-410A · cap 45/5 µF 440V", "RTU no enfría · R-410A · capacitor 45/5 µF 440V"),
      good: { g410: W("Gauges and hoses rated for R-410A pressures.", "Manómetros y mangueras para las presiones del R-410A.", "epa_608_regs"), cyl410: W("Charge only with the refrigerant on the nameplate.", "Carga solo el refrigerante de la placa.", "epa_608_regs"), cap445: W("Same µF, same or higher voltage: correct replacement.", "Mismos µF, voltaje igual o mayor: reemplazo correcto.", "cap_rule"), ...COMMON_GOOD },
      bad: { cyl22: W("Never mix refrigerants. R-22 doesn't go in an R-410A unit.", "Nunca mezcles refrigerantes. El R-22 no va en un equipo R-410A.", "epa_608_regs"), cyl454: W("R-454B only goes in equipment designed and listed for it.", "El R-454B solo va en equipo diseñado y certificado para él.", "ahri_a2l"), cap355: W("Wrong µF: the motor runs hot or won't start. Match the rating.", "µF incorrectos: el motor se calienta o no arranca. Iguala el valor.", "cap_rule"), cap370: W("Voltage rating must be equal or higher than the original 440V.", "El voltaje debe ser igual o mayor que el original de 440V.", "cap_rule"), jumper: W("Never jumper a safety to 'see if it runs'.", "Nunca puentees una seguridad 'para ver si arranca'.", "osha_1910_147") } },
    { id: "a2l454", call: T("New RTU start-up · R-454B (A2L)", "Arranque de RTU nueva · R-454B (A2L)"),
      good: { cyl454: W("Label says R-454B; the red band marks a flammable (A2L) refrigerant.", "La etiqueta dice R-454B; la franja roja marca un refrigerante inflamable (A2L).", "ahri_a2l"), a2lrec: W("Recovery machine rated by its maker for A2L refrigerants.", "Recuperadora aprobada por su fabricante para A2L.", "ahri_a2l"), a2ldet: W("Use a leak detector rated for A2L refrigerants.", "Usa un detector de fugas aprobado para A2L.", "ahri_a2l"), n2: W("Pressure-test with dry nitrogen through a regulator.", "Prueba de presión con nitrógeno seco y regulador.", "epa_608_regs"), micron: W("Prove the evacuation with a micron gauge.", "Comprueba el vacío con un vacuómetro.", "epa_608_regs"), ...COMMON_GOOD },
      bad: { cyl410: W("Wrong refrigerant: this unit is listed for R-454B.", "Refrigerante equivocado: este equipo es para R-454B.", "epa_608_regs"), oldrec: W("A recovery machine not rated for A2L can ignite the refrigerant.", "Una recuperadora no aprobada para A2L puede encender el refrigerante.", "ahri_a2l"), oxy: W("Never pressurize with oxygen or compressed air.", "Nunca presurices con oxígeno ni aire comprimido.", "epa_608_regs"), lighter: W("No ignition sources around an A2L system.", "Nada de fuentes de ignición cerca de un sistema A2L.", "ahri_a2l") } },
    { id: "gasheat", call: T("Gas-heat RTU · no heat · natural gas", "RTU de gas · no calienta · gas natural"),
      good: { mano: W("Gas pressure is read in inches of water column.", "La presión de gas se lee en pulgadas de columna de agua.", "gas_ifgc"), combo: W("Check O₂, CO and flue temperature on the flue.", "Revisa O₂, CO y temperatura en la chimenea.", "gas_ifgc"), pad: W("A fine abrasive pad cleans a dirty flame sensor.", "Una fibra abrasiva fina limpia un sensor de flama sucio.", "gas_ifgc"), meter: W("Flame signal reads in microamps.", "La señal de flama se lee en microamperios.", "gas_ifgc"), ...COMMON_GOOD },
      bad: { jumper: W("Never jumper a rollout or limit. Find why it opened.", "Nunca puentees un rollout o límite. Busca por qué abrió.", "osha_1910_147"), lp: W("Natural-gas unit: LP orifices are only for a documented fuel conversion.", "Equipo de gas natural: los orificios de LP son solo para una conversión documentada.", "gas_ifgc"), flametest: W("Find gas leaks with leak solution or a detector, never a flame.", "Busca fugas de gas con solución o detector, nunca con flama.", "gas_ifgc"), cyl22: W("Not part of a no-heat gas call, and never mix refrigerants anyway.", "No es parte de una llamada de gas, y nunca mezcles refrigerantes.", "epa_608_regs") } }
  ];
  const HAZ = {
    skylight: W("Skylight: fall-through hazard. Needs a cover, guardrail or fall arrest (OSHA 1910.28(b)(3)(i)).", "Tragaluz: peligro de caer a través. Necesita tapa, barandal o arnés (OSHA 1910.28(b)(3)(i)).", "osha_1910_28"),
    hatch: W("Open roof hatch: needs a hinged cover and guardrail (OSHA 1910.28(b)(3)(v)).", "Escotilla abierta: necesita tapa con bisagra y barandal (OSHA 1910.28(b)(3)(v)).", "osha_1910_28"),
    soft: W("Soft, spongy roof: wet insulation or a damaged deck. Walk around it and report it (OSHA 1910.22).", "Techo blando: aislamiento mojado o cubierta dañada. Rodéalo y repórtalo (OSHA 1910.22).", "osha_1910_22"),
    spill: W("Energy-drink spill: slip hazard. Also, that was somebody's lunch (OSHA 1910.22).", "Bebida energética derramada: resbalón. Y era el almuerzo de alguien (OSHA 1910.22).", "osha_1910_22") };
  const OBS = { conduit: W("Conduit on supports: step over it at a crossover, don't trip (OSHA 1910.22).", "Tubería conduit sobre soportes: pásala por un cruce, no tropieces (OSHA 1910.22).", "osha_1910_22") };
  function rrReviewBank2() { const out = [];
    CALLS.forEach(c => { const g = Object.keys(c.good).filter(k => !COMMON_GOOD[k]), b = Object.keys(c.bad);
      g.forEach((k, i) => out.push(TG.mkQ(`${c.call.en}: which do you bring?`, `${c.call.es}: ¿qué llevas?`, [I[k].t, ...b.slice(i % 2, i % 2 + 3).map(x => I[x].t)], 0, c.good[k].w, [c.good[k].src], { key: `rr2:${c.id}:${k}` }))); });
    Object.entries(HAZ).forEach(([k, v]) => out.push(TG.mkQ(`Rooftop: ${k === "skylight" ? "an unguarded skylight" : k === "hatch" ? "an open roof hatch" : k === "soft" ? "a soft roof spot" : "a spill"} in your path. What's the rule?`, `Azotea: ${k === "skylight" ? "un tragaluz sin protección" : k === "hatch" ? "una escotilla abierta" : k === "soft" ? "un punto blando" : "un derrame"} en tu camino. ¿Cuál es la regla?`, [v.w, T("It's fine if you walk fast", "No pasa nada si caminas rápido"), T("Step on the edge of it", "Pisa la orilla"), T("Only a problem at night", "Solo es problema de noche")], 0, v.w, [v.src], { key: `rr2:hz:${k}` })));
    return out.concat(TG.byId.rooftop_run._oldBank ? TG.byId.rooftop_run._oldBank().filter(q => q.key === "rr:air") : []); }

  /* ---------- the runner ---------- */
  function rooftop2() {
    const R = new TG.Round({ id: "rooftop_run", hearts: 3, seconds: 180 }); const lvl = TG.level(R.id), call = TG.pick(CALLS);
    const hudM = $("#tgHudM"); hudM.innerHTML = `<span class="rr2-dist" id="rr2D">0 ft</span>`; const av0 = $("#tgAv"); if (av0) av0.style.display = "none";
    R.body.innerHTML = `<div class="rr2" id="rr2"><canvas id="rr2C"></canvas><div class="rr2-call" id="rr2Call"><small>${L("THE CALL", "LA LLAMADA")}</small><b>${esc(tx(call.call))}</b><span>${L("Grab what this job needs. Skip the rest.", "Toma lo que pide el trabajo. Deja lo demás.")}</span></div>
      <div class="rr2-why" id="rr2Why"></div><div class="rr2-help" id="rr2Help">${L("Swipe ← → lanes · swipe ↑ or tap middle to step over", "Desliza ← → carriles · desliza ↑ o toca al centro para pasar por encima")}</div></div>`;
    const box = $("#rr2"), cv = $("#rr2C"), c = cv.getContext("2d"), whyEl = $("#rr2Why"); let w = 0, h = 0, dpr = 1, sky = null;
    const RM = A.reduced();
    const size = () => { w = box.clientWidth; h = Math.max(380, Math.min(620, Math.round(innerHeight * 0.66))); dpr = Math.min(2, devicePixelRatio || 1); cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + "px"; box.style.height = h + "px"; c.setTransform(dpr, 0, 0, dpr, 0, 0); sky = null; };
    size(); const ro = new ResizeObserver(size); ro.observe(box); R.stops.push(() => ro.disconnect());
    /* world */
    const HOR = () => h * 0.34, CAMH = 1.7, F = () => h * 0.95, PZ = 3.4, LANES = [-1.7, 0, 1.7];
    const proj = (x, y, z) => { const f = F() / z; return { x: w / 2 + (x - cam.x) * f, y: HOR() + (CAMH - y) * f, s: f }; };
    const cam = { x: 0, shake: 0, roll: 0 };
    const P = { lane: 1, x: 0, y: 0, vy: 0, jump: false, squash: 0, t: 0, inv: 0, swing: 0, gear: new Set() };
    let objs = [], parts = [], dist = 0, speed = 9 + lvl * 0.4, spawnT = 0.3, elapsed = 0, running = false, finished = false, seen = new Set(), mistakes = [], goodGot = new Set(), sideT = 0, sides = [];
    const GOAL = 900 + lvl * 60; /* feet */
    const goodKeys = Object.keys(call.good), badKeys = Object.keys(call.bad);
    /* input: act on move once past the threshold (tight response) */
    let p0 = null, acted = false;
    const lane = d => { const n = Math.max(0, Math.min(2, P.lane + d)); if (n !== P.lane) { P.lane = n; Sound.sfx("swish", { pitch: 1.1 + Math.random() * .15 }); TG.buzz("tap"); cam.roll = d * 0.04; } };
    const jump = () => { if (P.jump) return; P.jump = true; P.vy = 6.4; P.squash = -0.25; Sound.sfx("jump"); TG.buzz("tap"); };
    box.onpointerdown = e => { p0 = { x: e.clientX, y: e.clientY }; acted = false; box.setPointerCapture(e.pointerId); };
    box.onpointermove = e => { if (!p0 || acted) return; const dx = e.clientX - p0.x, dy = e.clientY - p0.y; if (Math.abs(dx) > 22 && Math.abs(dx) > Math.abs(dy)) { lane(Math.sign(dx)); acted = true; } else if (dy < -26) { jump(); acted = true; } };
    box.onpointerup = e => { if (p0 && !acted) { const r = box.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width; if (fx < 0.33) lane(-1); else if (fx > 0.67) lane(1); else jump(); } p0 = null; };
    const key = e => { if (!running) return; if (e.key === "ArrowLeft") lane(-1); else if (e.key === "ArrowRight") lane(1); else if (e.key === "ArrowUp" || e.code === "Space") { e.preventDefault(); jump(); } };
    document.addEventListener("keydown", key); R.stops.push(() => document.removeEventListener("keydown", key));
    const wind = Sound.loop("fan", 0.0); R.stops.push(() => wind.stop());
    /* spawn */
    const spawn = () => { const r = Math.random(), ln = Math.floor(Math.random() * 3);
      const busy = objs.filter(o => o.z > 50).map(o => o.lane);
      const pickLane = () => { const free = [0, 1, 2].filter(l => !busy.includes(l)); return free.length ? TG.pick(free) : ln; };
      let o;
      if (r < 0.46) { const pool = goodKeys.filter(k => !goodGot.has(k) || Math.random() < 0.3); o = { kind: "good", id: TG.pick(pool.length ? pool : goodKeys) }; }
      else if (r < 0.72) o = { kind: "bad", id: TG.pick(badKeys) };
      else if (r < 0.88) o = { kind: "haz", id: TG.pick(Object.keys(HAZ)) };
      else o = { kind: "obs", id: "conduit" };
      o.lane = pickLane(); o.z = 44; o.bob = Math.random() * 6; objs.push(o);
      if (o.kind === "obs") { o.lane = -1; } /* conduit spans all lanes */ };
    /* feedback */
    let whyT = 0; const flash = (ok, text) => { whyEl.className = "rr2-why show " + (ok ? "ok" : "bad"); whyEl.innerHTML = `<i>${ok ? "✔" : "✖"}</i><span>${esc(text)}</span>`; whyT = ok ? 1.9 : 2.6; };
    const burst = (x, y, z, col, n, kind) => { for (let i = 0; i < n; i++) parts.push({ x, y, z, vx: (Math.random() - .5) * 3, vy: Math.random() * 3 + (kind === "dust" ? 0.4 : 1.5), vz: (Math.random() - .5) * 2, life: kind === "dust" ? .6 : .7, col, kind }); };
    const hurt = (o, why, label) => { P.inv = 1.2; hitDamp = .15; cam.shake = RM ? 0 : 0.5; R.combo = 0; R.mult = 1; const m = $("#tgMult"); if (m) { m.textContent = "×1"; m.dataset.m = 1; } R.mistakes++;
      Sound.sfx("wrong"); Sound.sfx("clunk", { pitch: 0.8 }); TG.buzz("wrong"); R.avatar && R.avatar("oops");
      R.hearts--; const hs = $("#tgHearts"); if (hs) { const i = hs.querySelectorAll("i:not(.lost)"); if (i.length) i[i.length - 1].classList.add("lost"); } Sound.sfx("heart");
      flash(false, `${label}: ${tx(why.w)}`); if (!seen.has(o.kind + o.id)) { seen.add(o.kind + o.id); mistakes.push({ label, why, key: o.kind === "haz" ? `rr2:hz:${o.id}` : o.kind === "bad" ? null : null }); }
      box.classList.remove("hit"); void box.offsetWidth; box.classList.add("hit");
      if (R.hearts <= 0) { running = false; setTimeout(() => summary(false), 700); } };
    const collect = (o, pp) => { const it = I[o.id], why = call.good[o.id]; goodGot.add(o.id); P.gear.add(o.id);
      R.hit({ pts: 120, quiet: true, x: pp.x - 30, y: pp.y + 30, label: tx(it.t) }); Sound.sfx("pickup", { pitch: 1 + Math.min(.5, R.combo * .04) }); flash(true, `${tx(it.t)}: ${tx(why.w)}`); burst(LANES[o.lane], 1.1, o.z, "#ffd27a", 14, "spark"); P.squash = 0.18; };
    /* drawing helpers */
    const rr = (x, y, ww, hh, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + ww, y, x + ww, y + hh, r); c.arcTo(x + ww, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + ww, y, r); c.closePath(); };
    const buildSky = () => { const s = document.createElement("canvas"); s.width = w * dpr; s.height = Math.ceil(HOR() + 4) * dpr; const g = s.getContext("2d"); g.scale(dpr, dpr); const H = HOR();
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#1b1530"); gr.addColorStop(.45, "#5a2f4a"); gr.addColorStop(.78, "#d9643a"); gr.addColorStop(1, "#ffb45a"); g.fillStyle = gr; g.fillRect(0, 0, w, H + 4);
      const sun = g.createRadialGradient(w * .62, H - 6, 4, w * .62, H - 6, w * .5); sun.addColorStop(0, "rgba(255,236,170,1)"); sun.addColorStop(.08, "rgba(255,200,110,.9)"); sun.addColorStop(.35, "rgba(255,140,60,.25)"); sun.addColorStop(1, "rgba(255,120,60,0)"); g.fillStyle = sun; g.fillRect(0, 0, w, H + 4);
      for (let layer = 0; layer < 2; layer++) { g.fillStyle = layer ? "#20141d" : "#3a2230"; let x = -20; const base = H + 2; while (x < w + 20) { const bw = 18 + Math.random() * 40, bh = (layer ? 26 : 44) + Math.random() * (layer ? 40 : 70); g.fillRect(x, base - bh, bw, bh); if (!layer && Math.random() < .35) g.fillRect(x + bw / 2 - 1, base - bh - 10, 2, 10); x += bw + (layer ? 2 : 6); }
        if (layer) { g.fillStyle = "rgba(255,190,110,.55)"; for (let i = 0; i < 70; i++) g.fillRect(Math.random() * w, H - Math.random() * 50, 1.5, 1.5); } }
      sky = s; };
    const drawSky = t => { if (!sky) buildSky(); const H = HOR(), par = -cam.x * 4;
      c.drawImage(sky, 0, 0, sky.width, sky.height, par - 8, 0, w + 16, H + 4);
      if (!RM) { /* heat shimmer just above the deck */ for (let y = H - 22; y < H; y += 3) { const off = Math.sin(t * 3.1 + y * .55) * 1.6; c.drawImage(sky, 0, y * dpr, sky.width, 3 * dpr, par - 8 + off, y, w + 16, 3); } } };
    const drawDeck = () => { const H = HOR(); const g = c.createLinearGradient(0, H, 0, h); g.addColorStop(0, "#6b5b55"); g.addColorStop(.25, "#4b4442"); g.addColorStop(1, "#2a2726"); c.fillStyle = g; c.fillRect(0, H, w, h - H);
      /* membrane seams scrolling toward camera */ const step = 4; c.strokeStyle = "rgba(255,230,200,.07)"; c.lineWidth = 1; for (let k = 0; k < 18; k++) { const z = 1.2 + ((k * step - dist * 0.3048) % (18 * step) + 18 * step) % (18 * step); if (z < 1.2) continue; const a = proj(-12, 0, z), b = proj(12, 0, z); c.globalAlpha = Math.min(1, 6 / z); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); } c.globalAlpha = 1;
      /* walkway pads (lanes) */ LANES.forEach(lx => { for (let k = 0; k < 14; k++) { const z0 = 1.5 + ((k * 4.5 - dist * 0.3048) % 63 + 63) % 63, z1 = z0 + 2.6; if (z0 < 1.5) continue; const a = proj(lx - .55, 0, z0), b = proj(lx + .55, 0, z0), cc = proj(lx + .55, 0, z1), d = proj(lx - .55, 0, z1); c.fillStyle = `rgba(150,140,125,${Math.min(.55, 3 / z0)})`; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.lineTo(cc.x, cc.y); c.lineTo(d.x, d.y); c.closePath(); c.fill(); } });
      /* parapets */ [-1, 1].forEach(sd => { const x0 = sd * 4.2, a = proj(x0, 0, 1.2), b = proj(x0, 0, 70), a2 = proj(x0, 1.0, 1.2), b2 = proj(x0, 1.0, 70); const gp = c.createLinearGradient(a.x, 0, b.x, 0); gp.addColorStop(0, sd < 0 ? "#3d3331" : "#2e2726"); gp.addColorStop(1, "#7a5e52"); c.fillStyle = gp; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.lineTo(b2.x, b2.y); c.lineTo(a2.x, a2.y); c.closePath(); c.fill();
        c.strokeStyle = "rgba(255,190,120,.35)"; c.lineWidth = 2; c.beginPath(); c.moveTo(a2.x, a2.y); c.lineTo(b2.x, b2.y); c.stroke(); }); };
    const drawSide = s => { const p = proj(s.x, 0, s.z); if (s.z < 1.6) return; const sc = p.s, a = Math.min(1, 10 / s.z);
      c.globalAlpha = a; if (s.k === "rtu") { const ww = 2.6 * sc, hh = 1.5 * sc; const gx = c.createLinearGradient(p.x - ww / 2, 0, p.x + ww / 2, 0); gx.addColorStop(0, "#7c7f84"); gx.addColorStop(1, "#4a4d52"); c.fillStyle = gx; c.fillRect(p.x - ww / 2, p.y - hh, ww, hh); c.fillStyle = "rgba(255,190,120,.25)"; c.fillRect(p.x - ww / 2, p.y - hh, ww, hh * .08);
          c.fillStyle = "#2b2d31"; c.beginPath(); c.ellipse(p.x + ww * .2, p.y - hh, ww * .22, hh * .1, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(0,0,0,.35)"; for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(p.x - ww / 2 + i * ww / 5, p.y - hh * .85); c.lineTo(p.x - ww / 2 + i * ww / 5, p.y - hh * .15); c.stroke(); } }
      else if (s.k === "duct") { const ww = 0.7 * sc, hh = 0.6 * sc, len = 3; const b = proj(s.x, 0, s.z + len); c.fillStyle = "#8d9196"; c.beginPath(); c.moveTo(p.x - ww / 2, p.y - hh); c.lineTo(p.x + ww / 2, p.y - hh); c.lineTo(b.x + ww / 2 * b.s / sc, b.y - hh * b.s / sc); c.lineTo(b.x - ww / 2 * b.s / sc, b.y - hh * b.s / sc); c.closePath(); c.fill(); c.fillStyle = "#6c7075"; c.fillRect(p.x - ww / 2, p.y - hh, ww, hh); }
      else if (s.k === "vent") { const ww = .25 * sc, hh = 1.1 * sc; c.fillStyle = "#9a9da2"; c.fillRect(p.x - ww / 2, p.y - hh, ww, hh); c.fillStyle = "#5c5f63"; c.fillRect(p.x - ww, p.y - hh - ww * .6, ww * 2, ww * .6); }
      c.globalAlpha = 1; };
    const icon = (k, x, y, s) => { c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 2.2; c.strokeStyle = "#2a2522"; const it = I[k], ic = it.ic;
      if (ic === "cyl") { c.fillStyle = it.c; rr(-9, -14, 18, 26, 6); c.fill(); c.stroke(); c.fillStyle = "#555"; c.fillRect(-4, -19, 8, 5); if (it.band) { c.fillStyle = "#c8322a"; c.fillRect(-9, -11, 18, 4); } }
      else if (ic === "gauge" || ic === "micron" || ic === "mano") { c.fillStyle = "#f2ead6"; c.beginPath(); c.arc(0, -2, 12, 0, 7); c.fill(); c.stroke(); c.strokeStyle = ic === "gauge" ? "#b3261e" : "#2a5b9c"; c.beginPath(); c.moveTo(0, -2); c.lineTo(6, -8); c.stroke(); }
      else if (ic === "cap") { c.fillStyle = "#b9bdc3"; rr(-8, -14, 16, 26, 4); c.fill(); c.stroke(); c.fillStyle = "#333"; c.fillRect(-6, -17, 3, 3); c.fillRect(3, -17, 3, 3); }
      else if (ic === "filter") { c.fillStyle = "#e9e1cc"; c.fillRect(-12, -12, 24, 22); c.strokeRect(-12, -12, 24, 22); c.beginPath(); for (let i = -8; i < 12; i += 5) { c.moveTo(i, -12); c.lineTo(i, 10); } c.stroke(); }
      else if (ic === "harness") { c.strokeStyle = "#e3a72f"; c.lineWidth = 4; c.beginPath(); c.moveTo(-8, -14); c.lineTo(6, 10); c.moveTo(8, -14); c.lineTo(-6, 10); c.stroke(); c.fillStyle = "#666"; c.beginPath(); c.arc(0, -2, 3, 0, 7); c.fill(); }
      else if (ic === "tag") { c.fillStyle = "#c8322a"; rr(-8, -10, 16, 20, 3); c.fill(); c.stroke(); c.strokeStyle = "#ddd"; c.beginPath(); c.arc(0, -13, 5, Math.PI, 0); c.stroke(); }
      else if (ic === "water") { c.fillStyle = "#7fc3e8"; rr(-6, -12, 12, 24, 4); c.fill(); c.stroke(); c.fillStyle = "#2a5b9c"; c.fillRect(-4, -16, 8, 4); }
      else if (ic === "jumper") { c.strokeStyle = "#d33"; c.lineWidth = 3; c.beginPath(); c.moveTo(-12, 6); c.bezierCurveTo(-6, -16, 6, -16, 12, 6); c.stroke(); c.fillStyle = "#222"; c.fillRect(-14, 4, 5, 6); c.fillRect(9, 4, 5, 6); }
      else if (ic === "rec") { c.fillStyle = it.a2l ? "#e3e0d6" : "#9aa0a6"; rr(-13, -10, 26, 20, 4); c.fill(); c.stroke(); c.fillStyle = "#333"; c.beginPath(); c.arc(-5, 0, 4, 0, 7); c.fill(); if (it.a2l) { c.fillStyle = "#c8322a"; c.fillRect(3, -6, 7, 3); } }
      else if (ic === "det") { c.fillStyle = "#e3a72f"; rr(-6, -6, 12, 18, 3); c.fill(); c.stroke(); c.strokeStyle = "#555"; c.beginPath(); c.moveTo(0, -6); c.quadraticCurveTo(0, -16, 8, -16); c.stroke(); }
      else if (ic === "flame") { c.fillStyle = "#ff8a2a"; c.beginPath(); c.moveTo(0, -14); c.quadraticCurveTo(10, 0, 0, 10); c.quadraticCurveTo(-10, 0, 0, -14); c.fill(); }
      else if (ic === "analyzer" || ic === "meter") { c.fillStyle = ic === "meter" ? "#e3a72f" : "#3b5b8c"; rr(-9, -13, 18, 24, 3); c.fill(); c.stroke(); c.fillStyle = "#cfe9d9"; c.fillRect(-6, -10, 12, 7); }
      else if (ic === "pad") { c.fillStyle = "#7a8a5a"; rr(-11, -7, 22, 14, 3); c.fill(); c.stroke(); }
      else if (ic === "orifice") { c.fillStyle = "#c9a14a"; for (let i = -1; i <= 1; i++) { c.beginPath(); c.arc(i * 8, 0, 4, 0, 7); c.fill(); c.stroke(); } }
      c.restore(); };
    const drawObj = (o, t) => { if (o.z < 2.3) return; c.save(); c.globalAlpha = Math.min(1, (o.z - 2.3) / 0.9); drawObj0(o, t); c.restore(); };
    const drawObj0 = (o, t) => { const lx = o.lane >= 0 ? LANES[o.lane] : 0;
      if (o.kind === "good" || o.kind === "bad") { const yy = 1.0 + Math.sin(t * 3 + o.bob) * .08, p = proj(lx, yy, o.z), sh = proj(lx, 0, o.z), s = p.s / 70; const cw = 72 * s, ch = 78 * s;
        c.fillStyle = "rgba(0,0,0,.35)"; c.beginPath(); c.ellipse(sh.x, sh.y, cw * .45, cw * .12, 0, 0, 7); c.fill();
        c.save(); c.shadowColor = "rgba(255,200,120,.55)"; c.shadowBlur = 14 * s; const gc = c.createLinearGradient(0, p.y - ch / 2, 0, p.y + ch / 2); gc.addColorStop(0, "#f7f0dd"); gc.addColorStop(1, "#d8ccb0"); c.fillStyle = gc; rr(p.x - cw / 2, p.y - ch / 2, cw, ch, 10 * s); c.fill(); c.restore();
        c.strokeStyle = "rgba(60,40,20,.5)"; c.lineWidth = 1; rr(p.x - cw / 2, p.y - ch / 2, cw, ch, 10 * s); c.stroke();
        icon(o.id, p.x, p.y - ch * .1, s * 1.2); if (s > .35) { c.fillStyle = "#2a1e12"; c.font = `800 ${Math.max(7, 11 * s)}px system-ui, sans-serif`; c.textAlign = "center"; const t2 = tx(I[o.id].t); c.fillText(t2.length > 14 ? t2.slice(0, 13) + "…" : t2, p.x, p.y + ch * .38); } }
      else if (o.kind === "haz") { const a = proj(lx - .8, 0, o.z), b = proj(lx + .8, 0, o.z), cc = proj(lx + .8, 0, o.z + 1.6), d = proj(lx - .8, 0, o.z + 1.6); const quad = () => { c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.lineTo(cc.x, cc.y); c.lineTo(d.x, d.y); c.closePath(); };
        if (o.id === "skylight") { quad(); c.fillStyle = "rgba(120,180,220,.75)"; c.fill(); c.strokeStyle = "#d8e9f5"; c.lineWidth = 2; c.stroke(); const top = proj(lx, .45, o.z + .8); c.fillStyle = "rgba(220,240,255,.45)"; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(top.x, top.y); c.lineTo(b.x, b.y); c.closePath(); c.fill(); }
        else if (o.id === "hatch") { quad(); c.fillStyle = "#0b0a0a"; c.fill(); c.strokeStyle = "#e3a72f"; c.lineWidth = 2; c.stroke(); const lid = proj(lx - .8, 1.5, o.z + 1.6), lid2 = proj(lx + .8, 1.5, o.z + 1.6); c.fillStyle = "#8a8f95"; c.beginPath(); c.moveTo(d.x, d.y); c.lineTo(cc.x, cc.y); c.lineTo(lid2.x, lid2.y); c.lineTo(lid.x, lid.y); c.closePath(); c.fill(); }
        else if (o.id === "soft") { c.fillStyle = "rgba(25,22,20,.55)"; c.beginPath(); const m = proj(lx, 0, o.z + .8); c.ellipse(m.x, m.y, (b.x - a.x) * .5, (a.y - d.y) * .55 + 2, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(0,0,0,.4)"; c.stroke(); }
        else { const m = proj(lx, 0, o.z + .8); c.fillStyle = "rgba(120,220,60,.55)"; c.beginPath(); c.ellipse(m.x, m.y, (b.x - a.x) * .45, (a.y - d.y) * .45 + 2, 0, 0, 7); c.fill(); const can = proj(lx + .4, .25, o.z + .5); c.fillStyle = "#1f8a3a"; c.fillRect(can.x - 6 * can.s / 70, can.y - 10 * can.s / 70, 12 * can.s / 70, 18 * can.s / 70); } }
      else if (o.kind === "obs") { const a = proj(-3.6, .35, o.z), b = proj(3.6, .35, o.z); c.strokeStyle = "#b9bdc3"; c.lineWidth = Math.max(2, .12 * a.s); c.lineCap = "round"; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.lineCap = "butt";
        [-3, -1, 1, 3].forEach(sx => { const q = proj(sx, 0, o.z), q2 = proj(sx, .35, o.z); c.fillStyle = "#3a3634"; c.fillRect(q.x - .12 * q.s, q2.y, .24 * q.s, q.y - q2.y); }); } };
    /* ---- runner: the user's own avatar from behind (runner-avatar.js), with smear ghosts on lane changes ---- */
    const ghosts = []; let lastPX = null; const JV = .62; /* visual jump height only; collision still uses P.y */
    const drawPlayer = (t, dt) => { const pp = proj(P.x, P.y * JV, PZ), base = proj(P.x, 0, PZ), sc = pp.s / 132;
      const vx = lastPX == null ? 0 : (pp.x - lastPX) / Math.max(dt || .016, .008); lastPX = pp.x;
      /* shadow shrinks + fades with height */
      c.fillStyle = `rgba(0,0,0,${Math.max(.12, .42 - P.y * .12)})`; c.beginPath(); c.ellipse(base.x, base.y, 24 * sc * (1 - P.y * .14), 6.5 * sc * (1 - P.y * .1), 0, 0, 7); c.fill();
      const air = P.jump ? Math.min(1, P.y / .25) : 0, lean = Math.max(-1, Math.min(1, (LANES[P.lane] - P.x) / 1.2));
      P.swing += ((-vx * .012) - P.swing) * Math.min(1, (dt || .016) * 6);
      const spr = window.RunnerAvatar.render(S.avatar, { t: P.t * 14, run: 1, air, vy: P.vy * (P.jump ? 1 : 0), lean, swing: P.swing * 10, gear: P.gear }, sc, dpr);
      /* squash & stretch around the feet: stretch on take-off/rise, squash on landing; slight forward pitch in the air */
      const st = P.jump ? Math.max(-.14, Math.min(.16, P.vy * .025)) : 0, sq = P.squash - st, sx = 1 + sq * .9, sy = 1 - sq;
      const rot = cam.roll * 2.2 + lean * -.09;
      const blit = (x, y, a) => { c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(rot); c.scale(sx, sy); c.drawImage(spr.canvas, -spr.ox, -spr.oy, spr.w, spr.h); c.restore(); };
      /* motion smear: ghosts trail the lane change */
      if (!RM && Math.abs(vx) > 140) ghosts.push({ x: pp.x, y: pp.y, a: Math.min(.22, Math.abs(vx) / 3000) });
      for (let i = ghosts.length - 1; i >= 0; i--) { const g = ghosts[i]; g.a -= (dt || .016) * 2.4; if (g.a <= 0) ghosts.splice(i, 1); }
      if (ghosts.length > 5) ghosts.splice(0, ghosts.length - 5);
      ghosts.forEach(g => blit(g.x, g.y, g.a));
      if (!RM && Math.abs(vx) > 140) { const dir = -Math.sign(vx), k = Math.min(1, Math.abs(vx) / 1400); c.strokeStyle = `rgba(255,236,210,${.35 * k})`; c.lineCap = "round";
        for (let i = 0; i < 5; i++) { const yy = pp.y - (20 + i * 22) * sc, len = (30 + i * 9) * sc * (1 + k); c.lineWidth = (2.2 - i * .25) * sc * 1.6; c.beginPath(); c.moveTo(pp.x + dir * 20 * sc, yy); c.lineTo(pp.x + dir * (20 * sc + len), yy + 2 * sc); c.stroke(); } c.lineCap = "butt"; }
      blit(pp.x, pp.y, P.inv > 0 && Math.floor(P.inv * 12) % 2 ? .45 : 1);
      return pp; };
    const drawParts = dt => { parts = parts.filter(p => (p.life -= dt) > 0); parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.vy -= 6 * dt; if (p.y < 0) { p.y = 0; p.vy *= -.3; } const q = proj(p.x, p.y, Math.max(1.2, p.z)), a = Math.min(1, p.life * 2);
      if (p.kind === "dust") { c.fillStyle = `rgba(200,180,150,${a * .5})`; c.beginPath(); c.arc(q.x, q.y, 4 * q.s / 70 * (2 - p.life), 0, 7); c.fill(); } else { c.fillStyle = p.col; c.globalAlpha = a; c.fillRect(q.x - 2, q.y - 2, 4, 4); c.globalAlpha = 1; } }); };
    /* ---- anime speed lines + swooshes: density, length and brightness follow the run speed (and combo), smoothed;
       nothing at low speed; they thin out after a hit. ---- */
    let spK = 0, hitDamp = 1; const SL = Array.from({ length: 34 }, (_, i) => ({ a: (i / 34) * Math.PI * 2 + Math.random() * .15, ph: Math.random(), sp: .8 + Math.random() * .7, wv: Math.random() }));
    const speedTarget = () => { const base = Math.max(0, Math.min(1, (speed - 10) / 6)), combo = Math.min(10, R.combo) / 10; return Math.max(0, Math.min(1, base * .82 + combo * .3 * base + combo * .1)) * hitDamp; };
    const speedLines = t => { if (RM) return; const dt = lastDt; hitDamp += (1 - hitDamp) * Math.min(1, dt * .7); spK += (speedTarget() - spK) * Math.min(1, dt * 2.5); const k = spK; if (k < .06) return;
      const vx = w / 2, vy = HOR() + h * .04, R0 = Math.min(w, h) * (.34 - k * .12), n = Math.round(6 + k * 28);
      c.save(); c.lineCap = "round";
      for (let i = 0; i < n; i++) { const L = SL[(i * 7) % SL.length]; L.ph = (L.ph + dt * L.sp * (1.2 + k * 2.6)) % 1;
        const a = L.a + Math.sin(t * .3 + L.wv * 6) * .01, ca = Math.cos(a), sa = Math.sin(a);
        if (sa < -.08) continue; /* keep the sky and the call card clean */
        const r0 = R0 + L.ph * h * .55, len = h * (.05 + k * .22) * (.6 + L.wv * .6), fade = Math.sin(L.ph * Math.PI), wd = (1 + k * 3.2) * (.5 + L.wv) * .9;
        /* tapered wedge: thin toward the vanishing point, wide at the edge (manga style) */
        const x0 = vx + ca * r0, y0 = vy + sa * r0 * .85, x1 = vx + ca * (r0 + len), y1 = vy + sa * (r0 + len) * .85, nx = -sa, ny = ca;
        c.fillStyle = `rgba(255,${228 + Math.round(k * 22)},${200 + Math.round(k * 40)},${(.07 + k * .4) * fade})`;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 + nx * wd, y1 + ny * wd); c.lineTo(x1 - nx * wd, y1 - ny * wd); c.closePath(); c.fill(); }
      /* two swooshes peel off the runner's shoulders toward the bottom corners */
      const pp = proj(P.x, P.y * JV, PZ), sc = pp.s / 132;
      [-1, 1].forEach(sd => { const sx = pp.x + sd * 24 * sc, sy = pp.y - 80 * sc, ex = pp.x + sd * (70 + k * 120) * sc, ey = pp.y + (20 + k * 40) * sc, cx = pp.x + sd * (60 + k * 50) * sc, cy = pp.y - 70 * sc;
        const g = c.createLinearGradient(sx, sy, ex, ey); g.addColorStop(0, `rgba(255,240,215,${.0})`); g.addColorStop(.35, `rgba(255,236,205,${.12 + k * .3})`); g.addColorStop(1, "rgba(255,230,200,0)");
        c.strokeStyle = g; c.lineWidth = (2 + k * 5) * sc * 1.4; const off = (t * (6 + k * 10)) % 1;
        c.setLineDash([40 * sc * (1 + k), 18 * sc]); c.lineDashOffset = -off * 58 * sc * (1 + k); c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(cx, cy, ex, ey); c.stroke();
        c.lineWidth *= .45; c.setLineDash([22 * sc, 26 * sc]); c.beginPath(); c.moveTo(sx, sy + 26 * sc); c.quadraticCurveTo(cx - sd * 10 * sc, cy + 40 * sc, ex - sd * 20 * sc, ey + 10 * sc); c.stroke(); });
      c.setLineDash([]); c.restore(); };
    let lastDt = .016;
    const drawFX = t => { const v = c.createRadialGradient(w / 2, h * .6, h * .2, w / 2, h * .6, h * .85); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.45)"); c.fillStyle = v; c.fillRect(0, 0, w, h);
      speedLines(t); };
    /* RTU at the finish */ const drawGoal = () => { const left = (GOAL - dist) * .3048; if (left > 70) return; const p = proj(0, 0, Math.max(2, left + 4)), sc = p.s, ww = 4.2 * sc, hh = 2.2 * sc; const g = c.createLinearGradient(p.x - ww / 2, 0, p.x + ww / 2, 0); g.addColorStop(0, "#9aa0a6"); g.addColorStop(1, "#5d6268"); c.fillStyle = g; c.fillRect(p.x - ww / 2, p.y - hh, ww, hh); c.fillStyle = "#e3a72f"; c.fillRect(p.x - ww / 2, p.y - hh, ww, hh * .06); c.fillStyle = "#26282c"; c.beginPath(); c.ellipse(p.x + ww * .25, p.y - hh, ww * .18, hh * .08, 0, 0, 7); c.fill(); c.fillStyle = "#fff"; c.font = `800 ${Math.max(9, .35 * sc)}px system-ui`; c.textAlign = "center"; c.fillText("RTU-3", p.x - ww * .2, p.y - hh * .5); };
    /* frame */
    let landed = true;
    R.onFrame = (dt, now) => { const t = now / 1000; if (!running) { render(t, 0); return; }
      elapsed += dt; speed = Math.min(16 + lvl * .5, 9 + lvl * .4 + elapsed * .09); dist += speed * dt / .3048; $("#rr2D").textContent = Math.round(Math.min(dist, GOAL)) + " ft";
      wind.set(Math.min(.25, speed / 70));
      spawnT -= dt; if (spawnT <= 0 && dist < GOAL - 120) { spawn(); spawnT = Math.max(.42, .95 - elapsed * .006) * (0.8 + Math.random() * .5); }
      sideT -= dt; if (sideT <= 0) { sides.push({ x: (Math.random() < .5 ? -1 : 1) * (3.2 + Math.random() * .6), z: 50, k: TG.pick(["rtu", "duct", "vent", "vent"]) }); sideT = .5 + Math.random() * .6; }
      const dz = speed * dt; objs.forEach(o => o.z -= dz); sides.forEach(s => s.z -= dz); sides = sides.filter(s => s.z > 1); 
      /* player physics */ P.t += dt * (speed / 10); P.x += (LANES[P.lane] - P.x) * Math.min(1, dt * 16); cam.x += (P.x * .9 - cam.x) * Math.min(1, dt * 6); cam.roll *= Math.pow(.05, dt);
      if (P.jump) { P.vy -= 18 * dt; P.y += P.vy * dt; if (P.y <= 0) { P.y = 0; P.jump = false; P.squash = .22; Sound.sfx("land"); burst(P.x, 0, PZ, "", 8, "dust"); TG.buzz("tap"); } }
      P.squash *= Math.pow(.004, dt); P.inv = Math.max(0, P.inv - dt); whyT -= dt; if (whyT <= 0 && whyEl.classList.contains("show")) whyEl.classList.remove("show");
      /* collisions near the player plane */
      objs = objs.filter(o => { if (o.z > PZ + .5 || o.z < PZ - .7) return o.z > .5; if (o.done) return o.z > .5;
        const inLane = o.lane === -1 || o.lane === P.lane; if (!inLane) return true;
        if (o.kind === "good") { if (P.y < 1.4) { o.done = true; collect(o, proj(P.x, 1, PZ)); return false; } return true; }
        if (o.kind === "bad") { if (P.y < 1.4 && P.inv <= 0) { o.done = true; hurt(o, call.bad[o.id], tx(I[o.id].t)); return false; } return true; }
        if (o.kind === "haz") { if (o.z < PZ + .3 && P.inv <= 0) { o.done = true; hurt(o, HAZ[o.id], ({ skylight: L("Skylight", "Tragaluz"), hatch: L("Open hatch", "Escotilla abierta"), soft: L("Soft roof", "Techo blando"), spill: L("Spill", "Derrame") })[o.id]); } return true; }
        if (o.kind === "obs") { if (o.z < PZ + .2) { o.done = true; if (P.y > .35) { R.hit({ pts: 60, quiet: true, label: L("clean step", "buen paso") }); } else if (P.inv <= 0) hurt(o, OBS.conduit, L("Conduit", "Conduit")); } return true; }
        return true; });
      cam.shake = Math.max(0, cam.shake - dt * 1.4);
      render(t, dt);
      if (dist >= GOAL && !finished) { finished = true; running = false; Sound.sfx("levelup"); TG.buzz("unlock"); setTimeout(() => summary(true), 900); } };
    const render = (t, dt) => { lastDt = dt || .016; c.save(); if (!RM && cam.roll) { c.translate(w / 2, h); c.rotate(-cam.roll * .5); c.translate(-w / 2, -h); } if (cam.shake > 0) c.translate((Math.random() - .5) * 14 * cam.shake, (Math.random() - .5) * 10 * cam.shake);
      drawSky(t); drawDeck(); drawGoal();
      const all = sides.map(s => ({ z: s.z, f: () => drawSide(s) })).concat(objs.map(o => ({ z: o.z, f: () => drawObj(o, t) })));
      all.sort((a, b) => b.z - a.z); all.filter(x => x.z > PZ).forEach(x => x.f());
      drawPlayer(t, dt); all.filter(x => x.z <= PZ).forEach(x => x.f()); drawParts(dt || 0); drawFX(t); c.restore(); };
    /* end: what to fix, then the RTU air path */
    const summary = win => { R.onFrame = null; wind.stop(); const missedGood = goodKeys.filter(k => !goodGot.has(k));
      mistakes.forEach(m => { if (m.key) { const q = rrReviewBank2().find(x => x.key === m.key); if (q) { A.reviewMark && A.reviewMark(q, false); R.cards.push({ q }); } } });
      R.body.innerHTML = `<div class="rr2-sum"><div class="tg-head"><b>${win ? L("You made it to the RTU", "Llegaste a la RTU") : L("Out of hard hats", "Sin cascos")}</b><p class="sm muted">${esc(tx(call.call))}</p></div>
        ${mistakes.length ? `<h4>${L("What to fix", "Qué corregir")}</h4><ul class="rr2-list bad">${mistakes.map(m => `<li><b>${esc(m.label)}</b><span>${esc(tx(m.why.w))}</span>${TG.srcChips([m.why.src])}</li>`).join("")}</ul>` : `<p class="rr2-clean">${ico("check", 18)} ${L("Zero incidents. Clean run.", "Cero incidentes. Recorrido limpio.")}</p>`}
        ${missedGood.length ? `<h4>${L("Left on the truck", "Se quedó en la camioneta")}</h4><ul class="rr2-list">${missedGood.map(k => `<li><b>${esc(tx(I[k].t))}</b><span>${esc(tx(call.good[k].w))}</span></li>`).join("")}</ul>` : ""}
        <div class="tg-src-detail"></div><button class="btn primary big full" id="rr2Go">${win ? L("Trace the RTU air path", "Traza la ruta de aire") : L("See results", "Ver resultados")} ${ico("arrow", 18)}</button></div>`;
      TG.bindSrc && TG.bindSrc(R.body);
      R.boards = 1; R.clean = mistakes.length ? 0 : 1;
      $("#rr2Go").onclick = () => { if (!win) return R.end(false, L("Out of hard hats", "Sin cascos")); if (!mistakes.length) R.bonus(400, L("Zero incidents", "Cero incidentes")); airPath(); }; };
    const airPath = () => { const ord = RR.rtuAirPathOrder, sh = TG.shuffle(ord.map((x, i) => i)); let k = 0, miss = 0; TG.qaCur = { kind: "air" };
      R.body.innerHTML = `<div class="tg-head"><b>${L("At the RTU", "En la RTU")}</b><p class="sm muted">${L("Tap the air path in order, outside air to supply.", "Toca la ruta del aire en orden, de aire exterior a suministro.")}</p></div>
        <div class="rr-path" id="rrPath">${ord.map(() => `<span class="rr-slot"></span>`).join("<i>›</i>")}</div><div class="rr-chips">${sh.map(i => `<button class="gr-chip" data-i="${i}"><b>${esc(tx(ord[i].short))}</b></button>`).join("")}</div><p class="sm muted">${esc(tx(RR.rtuAirPathNote))}</p>`;
      const slots = [...R.body.querySelectorAll(".rr-slot")], heatI = ord.findIndex(x => /heat|calor/i.test(x.short.en)), blowI = ord.findIndex(x => /blower/i.test(x.short.en));
      R.body.querySelectorAll(".rr-chips .gr-chip").forEach(b => b.onclick = async () => { if (b.disabled) return; const i = +b.dataset.i;
        const ok = i === k || (k === blowI && i === heatI) || (k === heatI && i === blowI);
        if (ok) { b.disabled = true; slots[k].textContent = tx(ord[i].short); slots[k].classList.add("fill"); Sound.sfx("snap", { pitch: .9 + k * .06 }); R.hit({ quiet: true, pts: 60 }); k++;
          if (k >= ord.length) { if (!miss) R.bonus(200, L("Air path", "Ruta de aire")); R.boardEnd({ speed: false }); setTimeout(() => R.end(true), 1200); } }
        else { miss++; b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 400); await R.miss({ did: L(`You put ${tx(ord[i].short)} next.`, `Pusiste ${tx(ord[i].short)} después.`), why: ord.map(x => tx(x.short)).join(" → "), rule: tx(RR.rtuAirPathNote), sources: RR.rtuSources, noHeart: true }); } }); };
    render(0, 0);
    TG.intro(R, `<div class="tg-intro-art">${TG.byId.rooftop_run.art(84)}</div><h3>${esc(tx(RR.name))}</h3><p class="rr2-intro-call"><small>${L("Today's call", "La llamada de hoy")}</small><b>${esc(tx(call.call))}</b></p><p class="sm">${L("Run the roof to the RTU. Grab the gear this call needs, skip the wrong gear, dodge hazards, step over conduit. Three hard hats.", "Corre por la azotea hasta la RTU. Toma lo que pide la llamada, deja lo equivocado, esquiva peligros y pasa sobre el conduit. Tres cascos.")}</p><p class="sm muted">${L("Swipe ← → to change lanes · swipe ↑ or tap the middle to step over", "Desliza ← → para cambiar de carril · desliza ↑ o toca el centro para pasar por encima")}</p>`, null,
      () => { R.boardStart(); running = true; Sound.sfx("whoosh"); setTimeout(() => { const hp = $("#rr2Help"); if (hp) hp.classList.add("gone"); }, 3500); });
    TG.qaCur = { kind: "rr2", call, objs: () => objs, P, goodKeys, badKeys, lane: n => { P.lane = n; }, jump, skipTo: ft => { dist = Math.max(dist, ft); }, setSpeed: v => { elapsed = Math.max(elapsed, (v - 9 - lvl * 0.4) / .09); }, spK: () => spK };
  }
  const def = TG.byId.rooftop_run; if (def) { def._oldBank = def.reviewBank; def.run = rooftop2; def.reviewBank = rrReviewBank2; def.tag = { en: "Right gear, roof hazards, RTU air path", es: "Equipo correcto, peligros, ruta de aire" }; }
})();
