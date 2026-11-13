/* Path engine: turns Match My Path answers + research data into a plan.
   Pure functions — no DOM. Rule ids (PR-xx) refer to progression.json. */
(function () {
  const P = () => window.PROGRESSION;
  const STAGES = () => P().stages.slice().sort((a, b) => a.order - b.order).map(s => s.id);
  const SAFETY = ["FOUND-SAFETY-01", "FOUND-ELEC-SAFE-01", "PATH-COMM-SITE-SAFE-01"];
  const EXP_START = { none: "week_1", helper_0_6mo: "week_1", support_6_12mo: "days_31_60", experienced_1_2yr: "months_3_6", journey_2plus: "months_6_12" };
  const WALKTHROUGH = ["PATH-RES-SVC-CALL-01", "PATH-RES-INS-CHANGEOUT-01", "PATH-COMM-SVC-PM-01", "PATH-COMM-INS-STARTUP-01", "SALES-CHECKLIST-01"];

  function resolvePath(goal) {
    if (P().paths[goal]) return goal;
    if (goal === "refrigeration") return "commercial_service_tech";
    return "residential_service_tech";
  }

  function facts(p) {
    const certs = new Set(p.certs || []); const eq = new Set((p.equipment || []).filter(x => x !== "none"));
    if (p.goal === "refrigeration") eq.add("commercial_refrigeration");
    if (eq.has("hydronic")) { eq.add("boiler"); eq.add("chilled_water"); }
    if (eq.has("chiller")) eq.add("low_pressure");
    const uni = certs.has("epa_608_universal");
    return { certs, eq, uni,
      core: uni || certs.has("epa_608_core"), t1: uni || certs.has("epa_608_type_i"), t2: uni || certs.has("epa_608_type_ii"), t3: uni || certs.has("epa_608_type_iii"),
      any608: uni || ["epa_608_core", "epa_608_type_i", "epa_608_type_ii", "epa_608_type_iii"].some(c => certs.has(c)),
      supervised: p.schooling === "registered_apprentice", exp: p.experience || "none" };
  }
  const hasAny = (set, list) => (list || []).some(x => set.has(x));

  function buildPlan(p) {
    const D = P(), order = STAGES(), f = facts(p);
    const pathId = resolvePath(p.goal), path = D.paths[pathId];
    const fired = new Set();
    let mods = path.modules.map((m, i) => ({ m, i }));
    const all = {}; Object.values(D.paths).forEach(pp => pp.modules.forEach(m => { all[m.id] = all[m.id] || m; }));
    const addMod = (id, rule) => { if (!mods.find(x => x.m.id === id) && all[id]) { mods.push({ m: all[id], i: 500 + mods.length, added: rule }); fired.add(rule); } };
    if (p.sales === "yes") { D.paths.sales_track.modules.forEach(m => addMod(m.id, "PR-14")); }
    if (pathId.startsWith("residential") && f.eq.has("rtu")) { addMod("PATH-COMM-SITE-SAFE-01", "PR-17"); addMod("PATH-COMM-SVC-PM-01", "PR-17"); }
    if (f.eq.has("chiller")) addMod("PATH-COMM-CHILLER-INTRO-01", "PR-18");
    if (p.goal === "refrigeration") addMod("PATH-COMM-REFRIG-AWARE-01", "PR-18");

    let startStage = EXP_START[f.exp] || "week_1";
    if (p.schooling === "trade_school_complete" && order.indexOf(startStage) < order.indexOf("days_31_60")) { startStage = "days_31_60"; fired.add("PR-10"); }
    if (f.exp === "none") fired.add("PR-02");
    const startIdx = order.indexOf(startStage);
    const boosts = [];
    if (pathId.includes("installer")) { boosts.push(...window.ORDER_BOOST.installer); fired.add("PR-12"); }
    if (pathId.includes("service")) { boosts.push(...window.ORDER_BOOST.service); fired.add("PR-13"); }
    if (p.climate === "heating_first") { boosts.push(...window.ORDER_BOOST.heating_first); fired.add("PR-15"); }
    if (p.climate === "cooling_first") boosts.push(...window.ORDER_BOOST.cooling_first);
    if (f.eq.has("heat_pump")) boosts.push(...window.ORDER_BOOST.heat_pump);

    const out = mods.map(({ m, i, added }) => {
      const pers = m.personalization || {}; const e = { id: m.id, m, idx: i, stage: window.STAGE_OVERRIDES[m.id] || m.stage, status: "core", notes: [], gate: null, added };
      if (added) e.notes.push({ en: "Added for you (" + added + ")", es: "Agregado para ti (" + added + ")" });
      // certificate-based skips
      if (pers.skip_if_certs) {
        if (pers.skip_if_certs.includes("epa_608_core_plus_needed_type")) {
          const need3 = f.eq.has("chiller");
          if (f.core && f.t2 && (!need3 || f.t3)) { e.status = "skip"; e.notes.push({ en: "You already hold EPA 608 — exam prep skipped (refresher optional).", es: "Ya tienes EPA 608: se omite la preparación (repaso opcional)." }); fired.add("PR-07"); }
          else if (f.any608) e.notes.push({ en: "Study only the 608 sections you still need.", es: "Estudia solo las secciones 608 que te faltan." });
        } else if (hasAny(f.certs, pers.skip_if_certs)) {
          if (pers.skip_mode === "shorten_to_delta_and_check" || pers.never_skip) { e.status = "short"; e.notes.push({ en: "Short refresher + safety check (you have the course).", es: "Repaso corto + verificación (ya tienes el curso)." }); }
          else { e.status = "skip"; e.notes.push({ en: "Already completed — skipped.", es: "Ya completado: omitido." }); }
          if (m.id === "FOUND-OSHA10-01") fired.add("PR-09");
        }
      }
      if (m.id === "FOUND-OSHA10-01" && f.certs.has("osha_10_general_industry") && !hasAny(f.certs, ["osha_10_construction", "osha_30_construction"]))
        e.notes.push({ en: "You have General Industry; many HVAC employers expect the Construction card.", es: "Tienes Industria General; muchos empleadores de HVAC esperan la tarjeta de Construcción." });
      // exposure-dependent modules
      const reqList = pers.required_if_exposure || pers.required_if_equipment || pers.required_if_exposure_or_goal || pers.required_if_company_or_exposure;
      if (reqList) { if (hasAny(f.eq, reqList)) e.notes.push({ en: "Required for the equipment you work on.", es: "Necesario para el equipo con el que trabajas." }); else e.status = e.status === "skip" ? "skip" : "optional"; }
      if (pers.optional_unless_exposure && !hasAny(f.eq, pers.optional_unless_exposure)) e.status = "optional";
      if (pers.optional || pers.optional_otherwise) e.status = e.status === "core" ? "optional" : e.status;
      if (pers.optional_for === pathId || (pers.optional_for_commercial_installer && pathId === "commercial_installer")) e.status = "optional";
      if (pers.skip_if_shop_has_no_low_pressure && !f.eq.has("chiller")) e.status = "optional";
      if (pers.not_a_first_year_default) e.status = "later";
      if (pers.skip_intro_if_independent_exposure && p.depth === "independent" && hasAny(f.eq, pers.skip_intro_if_independent_exposure)) { e.status = "skip"; e.notes.push({ en: "You work on these independently — intro skipped.", es: "Ya trabajas en esto por tu cuenta: se omite la introducción." }); fired.add("PR-16"); }
      if (pers.move_earlier_if_exposure && hasAny(f.eq, pers.move_earlier_if_exposure)) e.stage = order[Math.max(0, order.indexOf(e.stage) - 1)];
      const cs = (window.CLIMATE_STAGE_SHIFT[p.climate] || {})[m.id]; if (cs) e.stage = cs;
      /* PR-15: heating-first only reorders within the stage (after safety + cycle basics), it never jumps ahead of safety. */
      if (pers.add_type_iii_if && hasAny(f.eq, pers.add_type_iii_if)) e.notes.push({ en: "Add EPA 608 Type III (you see low-pressure chillers).", es: "Agrega EPA 608 Tipo III (trabajas con chillers de baja presión)." });
      if (pers.prompt_type_ii_if_only_type_i && f.t1 && !f.t2) e.notes.push({ en: "You have Type I only — add Type II before split-system work.", es: "Solo tienes Tipo I: agrega Tipo II antes de trabajar en sistemas divididos." });
      if (pers.do_not_skip_if_608_already_held_and_no_a2l_training && f.any608) e.notes.push({ en: "Still needed even with 608 if you haven't had A2L training.", es: "Aún necesario con 608 si no tienes capacitación A2L." });
      // gates (competency, not calendar)
      if (pers.unlock_only_if === "consistent_maintenance_or_install_walkthrough_passed") e.gate = "walkthrough";
      if (pers.unlock_only_if === "sales_options_competency_passed") e.gate = "options";
      if ((pers.block_if_experience === "none_in_week_1" || pers.delay_if_experience === "none_until_foundation_complete") && f.exp === "none") e.gate = e.gate || "foundation";
      if (pers.requires_epa_608_or_close_supervision && !(f.core && f.t2) && !f.supervised) { e.gate = e.gate || "epa"; fired.add("PR-08"); }
      // placement
      if (SAFETY.includes(m.id)) { if (e.status === "skip") e.status = "short"; if (order.indexOf(e.stage) < startIdx) e.status = "short"; fired.add("PR-01"); }
      else if (order.indexOf(e.stage) < startIdx && ["core", "short"].includes(e.status)) { e.status = "review"; }
      if (SAFETY.includes(m.id) && order.indexOf(e.stage) < startIdx) e.stage = startStage;
      e.title = { en: m.title, es: window.MODULE_ES[m.id] || "" };
      e.links = window.MODULE_LINKS[m.id] || [];
      e.boost = SAFETY.includes(m.id) ? -10 + SAFETY.indexOf(m.id) : boosts.includes(m.id) ? boosts.indexOf(m.id) : 999;
      return e;
    });
    out.sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage) || a.boost - b.boost || a.idx - b.idx);
    const stages = order.map(id => ({ id, label: window.STAGE_LABELS[id], modules: out.filter(e => e.stage === id) })).filter(s => s.modules.length);
    return { profile: p, pathId, salesAddOn: p.sales === "yes", startStage, stages, modules: out, certs: certPlan(p, f, pathId), fired: [...fired].sort(),
      tasks: window.PATH_FIRST_TASKS[pathId], salesTasks: p.sales === "yes" ? window.PATH_FIRST_TASKS.sales_track : null,
      blockedIndependent: !(f.core && f.t2) && !f.supervised, facts: f };
  }

  const WHEN = {
    week_1: { en: "Week 1", es: "Semana 1" }, first_30_days: { en: "First 30 days", es: "Primeros 30 días" },
    year_1_if_program_requires: { en: "Year 1, if your program requires it", es: "Año 1, si tu programa lo pide" },
    days_31_90_before_independent_refrigerant_circuit_work: { en: "Days 31–90, before working on refrigerant circuits on your own", es: "Días 31–90, antes de trabajar solo en circuitos de refrigerante" },
    optional_year_1_if_servicing_small_appliances: { en: "Optional in year 1 (small appliances)", es: "Opcional en el año 1 (aparatos pequeños)" },
    when_or_shortly_before_low_pressure_chiller_work: { en: "Before low-pressure chiller work", es: "Antes de trabajar en chillers de baja presión" },
    year_1_to_2_if_equipment_mix_is_broad: { en: "Year 1–2 if you see lots of equipment types", es: "Año 1–2 si ves muchos tipos de equipo" },
    alongside_or_soon_after_608_when_newer_equipment_is_in_the_mix: { en: "With or soon after 608 (newer refrigerants)", es: "Con o después del 608 (refrigerantes nuevos)" },
    entry_level_to_6_months_study_first_30_to_90_days: { en: "0–6 months (study in days 1–90)", es: "0–6 meses (estudia en días 1–90)" },
    "6_to_12_months_in_the_field": { en: "6–12 months in the field", es: "6–12 meses en campo" },
    end_of_matching_module: { en: "After the matching module", es: "Al terminar el módulo correspondiente" },
    about_1_year_per_faq_or_2_years_per_handbook: { en: "About 1–2 years of experience", es: "Aprox. 1–2 años de experiencia" },
    about_2_years: { en: "About 2 years of experience", es: "Aprox. 2 años de experiencia" },
    months_3_12_for_installers_and_useful_for_service_verification: { en: "Months 3–12", es: "Meses 3–12" },
    after_consistent_maintenance_or_service_call_typically_months_3_12: { en: "After you run consistent calls (months 3–12)", es: "Cuando hagas llamadas consistentes (meses 3–12)" },
    follow_jurisdiction: { en: "Per your state/local rules", es: "Según tus reglas estatales/locales" }
  };
  function certPlan(p, f, pathId) {
    const inst = pathId.includes("installer"), svc = pathId.includes("service");
    return P().certifications.map(c => {
      let show = true, status = "todo", note = null;
      switch (c.id) {
        case "osha_10_construction": if (hasAny(f.certs, ["osha_10_construction", "osha_30_construction"])) status = "have"; break;
        case "osha_30_construction": show = p.schooling === "registered_apprentice" || f.certs.has("osha_30_construction"); if (f.certs.has("osha_30_construction")) status = "have"; break;
        case "first_aid_cpr": if (f.certs.has("first_aid_cpr")) status = "have"; break;
        case "epa_608_core_type_ii": if (f.core && f.t2) status = "have"; else if (f.t1 && !f.t2) note = { en: "You have Type I — add Type II.", es: "Tienes Tipo I: agrega Tipo II." }; break;
        case "epa_608_type_i": show = f.eq.has("small_appliance") || p.goal === "refrigeration" || f.t1; if (f.t1) status = "have"; break;
        case "epa_608_type_iii": show = f.eq.has("chiller") || f.t3; if (f.t3) status = "have"; break;
        case "epa_608_universal": show = !pathId.startsWith("residential") || p.goal === "unsure" || f.eq.size >= 5 || f.uni; if (f.uni) status = "have"; break;
        case "nate_ready_to_work": if (f.certs.has("nate_ready_to_work")) status = "have"; break;
        case "nate_support_technician": if (f.certs.has("nate_support_technician")) status = "have"; break;
        case "nate_core_installation": show = inst; break;
        case "nate_core_service": show = svc; break;
        case "nate_senior": case "app_internal_certificates": show = false; break;
        case "acca_qi": show = inst; break;
        case "acca_tacct": show = p.sales === "yes"; break;
      }
      return show ? { id: c.id, title: c.title, when: WHEN[c.when] || { en: c.when.replace(/_/g, " ") }, notes: c.notes, sources: c.sources, status, note, req: c.required_or_recommended } : null;
    }).filter(Boolean);
  }

  window.PathEngine = { buildPlan, resolvePath, stages: STAGES, WALKTHROUGH };
})();
