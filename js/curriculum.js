/* =====================================================================
   CURRICULUM OVERLAY — how the app uses the research data
   ---------------------------------------------------------------------
   ORDER SOURCE OF TRUTH: data/progression.json (from the learning-
   progression research). Each path's modules are sorted by stage
   (week_1 → year_2_plus) then by their order in the JSON. To reorder:
     1) edit data/progression.json and run tools/build-data.py, or
     2) add an entry to STAGE_OVERRIDES / ORDER_BOOST below.
   This file maps research module ids to in-app content, adds Spanish
   titles, Match My Path questions, and per-path first on-the-job tasks.
   The calendar is a GUIDE, not a standard: progress is gated by
   competency (quick checks and completed modules), not by dates.
   ===================================================================== */
(function () {
const T = (en, es) => ({ en, es: es || "" });

window.MATCH_QUESTIONS = [
  { key: "experience", q: T("Be honest — how long have you actually been on jobs, not just in a classroom?", "Sé honesto: ¿cuánto tiempo llevas realmente en trabajos, no solo en un aula?"), type: "single", options: [
    { value: "none", icon: "🌱", label: T("None — brand new", "Ninguna, soy nuevo") },
    { value: "helper_0_6mo", icon: "🧰", label: T("Helper, 0–6 months", "Ayudante, 0–6 meses") },
    { value: "support_6_12mo", icon: "🔧", label: T("6–12 months in the field", "6–12 meses en campo") },
    { value: "experienced_1_2yr", icon: "🛠️", label: T("1–2 years", "1–2 años") },
    { value: "journey_2plus", icon: "🏅", label: T("2+ years / journey level", "2+ años / nivel oficial") } ] },
  { key: "schooling", q: T("What formal HVAC training have you already finished?", "¿Qué formación formal de HVAC ya terminaste?"), type: "single", options: [
    { value: "none", icon: "➖", label: T("No schooling yet", "Aún no") },
    { value: "some_courses", icon: "📘", label: T("Some courses", "Algunos cursos") },
    { value: "trade_school_complete", icon: "🎓", label: T("Finished a trade-school / college program", "Terminé escuela técnica / colegio") },
    { value: "registered_apprentice", icon: "🤝", label: T("Registered apprentice", "Aprendiz registrado") } ] },
  { key: "goal", q: T("If you hopped in a truck tomorrow, what kind of work do you want on the windshield?", "Si mañana te subes a una camioneta, ¿qué tipo de trabajo quieres en el parabrisas?"), type: "single", options: [
    { value: "residential_service_tech", icon: "🏠", label: T("Residential service", "Servicio residencial") },
    { value: "residential_installer", icon: "📦", label: T("Residential install", "Instalación residencial") },
    { value: "commercial_service_tech", icon: "🏢", label: T("Commercial service", "Servicio comercial") },
    { value: "commercial_installer", icon: "🏗️", label: T("Commercial install", "Instalación comercial") },
    { value: "refrigeration", icon: "❄️", label: T("Refrigeration", "Refrigeración") },
    { value: "unsure", icon: "🤔", label: T("Not sure yet", "Aún no lo sé") } ] },
  { key: "sales", q: T("Later on, do you also want the sales add-on — walking a customer through a maintenance or install?", "Más adelante, ¿quieres también el complemento de ventas: acompañar a un cliente en un mantenimiento o una instalación?"), hint: T("It unlocks only after you can run a solid maintenance or install walkthrough.", "Se desbloquea solo cuando puedas hacer un mantenimiento o instalación completa."), type: "single", options: [
    { value: "yes", icon: "💬", label: T("Yes, add it", "Sí, agrégalo") },
    { value: "no", icon: "🔧", label: T("No, technical only", "No, solo técnico") } ] },
  { key: "certs", q: T("Which of these cards or certs do you already have in your wallet or file?", "¿Cuáles de estas credenciales o certificados ya tienes en la cartera o en el archivo?"), hint: T("Pick all that apply", "Elige todas las que apliquen"), type: "multi", options: [
    { value: "epa_608_core", icon: "🌎", label: T("EPA 608 Core", "EPA 608 Core") },
    { value: "epa_608_type_i", icon: "1️⃣", label: T("608 Type I", "608 Tipo I") },
    { value: "epa_608_type_ii", icon: "2️⃣", label: T("608 Type II", "608 Tipo II") },
    { value: "epa_608_type_iii", icon: "3️⃣", label: T("608 Type III", "608 Tipo III") },
    { value: "epa_608_universal", icon: "🏆", label: T("608 Universal", "608 Universal") },
    { value: "osha_10_construction", icon: "🦺", label: T("OSHA 10 Construction", "OSHA 10 Construcción") },
    { value: "osha_10_general_industry", icon: "🏭", label: T("OSHA 10 General Industry", "OSHA 10 Industria General") },
    { value: "osha_30_construction", icon: "⛑️", label: T("OSHA 30", "OSHA 30") },
    { value: "first_aid_cpr", icon: "⛑", label: T("First aid / CPR", "Primeros auxilios / RCP") },
    { value: "nate_ready_to_work", icon: "🎓", label: T("NATE Ready-to-Work", "NATE Ready-to-Work") },
    { value: "nate_support_technician", icon: "📜", label: T("NATE HVAC Support Technician", "NATE Técnico de Apoyo en HVAC") },
    { value: "nate_chp5", icon: "5️⃣", label: T("NATE CHP-5 (Certified HVAC Professional)", "NATE CHP-5 (Profesional HVAC Certificado)") },
    { value: "nate_core_installation", icon: "🛠️", label: T("NATE Core + Installation specialty", "NATE Core + especialidad de Instalación") },
    { value: "nate_core_service", icon: "🔧", label: T("NATE Core + Service specialty", "NATE Core + especialidad de Servicio") },
    { value: "nate_senior", icon: "🏅", label: T("NATE Senior Level / HVAC Efficiency Analyst", "NATE Nivel Senior / Analista de Eficiencia HVAC") },
    { value: "none", icon: "➖", exclusive: true, label: T("None yet", "Ninguna todavía") } ] },
  { key: "equipment", q: T("What equipment have you actually seen, helped on, or run — not just walked past?", "¿En qué equipos has estado de verdad, ayudado o operado, no solo visto de pasada?"), hint: T("Pick all that apply", "Elige todas las que apliquen"), type: "multi", options: [
    { value: "gas_furnace", icon: "🔥", label: T("Gas furnace", "Calefactor de gas") },
    { value: "oil_furnace", icon: "🛢️", label: T("Oil furnace", "Calefactor de aceite") },
    { value: "electric_heat", icon: "⚡", label: T("Electric heat", "Calor eléctrico") },
    { value: "heat_pump", icon: "🌀", label: T("Heat pump", "Bomba de calor") },
    { value: "ductless", icon: "🌬️", label: T("Ductless / mini-split", "Minisplit") },
    { value: "rtu", icon: "🏗️", label: T("Rooftop units", "Unidades de techo") },
    { value: "hydronic", icon: "♨️", label: T("Boiler / hydronic", "Caldera / hidrónico") },
    { value: "chiller", icon: "🏭", label: T("Chiller / low pressure", "Chiller / baja presión") },
    { value: "commercial_refrigeration", icon: "🧊", label: T("Walk-ins / commercial refrigeration", "Cuartos fríos / refrigeración comercial") },
    { value: "small_appliance", icon: "🗄️", label: T("Fridges / window units", "Refrigeradores / AC de ventana") },
    { value: "bas_controls", icon: "🖥️", label: T("Building controls (BAS)", "Controles de edificio (BAS)") },
    { value: "none", icon: "➖", exclusive: true, label: T("None yet", "Ninguno todavía") } ] },
  { key: "depth", q: T("When you were around that equipment, how hands-on were you?", "Cuando estuviste junto a ese equipo, ¿qué tan práctico fue tu trabajo?"), type: "single", options: [
    { value: "seen", icon: "👀", label: T("Mostly watched", "Mayormente observé") },
    { value: "assisted", icon: "🤝", label: T("Assisted a tech", "Ayudé a un técnico") },
    { value: "independent", icon: "💪", label: T("Worked on my own", "Trabajé por mi cuenta") } ] },
  { key: "climate", q: T("Where you work (or want to work), what keeps the phone ringing — heat, cooling, or both?", "Donde trabajas (o quieres trabajar), ¿qué hace sonar el teléfono: calor, frío o ambos?"), type: "single", options: [
    { value: "heating_first", icon: "🥶", label: T("Heating (cold climate)", "Calefacción (clima frío)") },
    { value: "cooling_first", icon: "🥵", label: T("Cooling (hot climate)", "Enfriamiento (clima cálido)") },
    { value: "both", icon: "🌤️", label: T("Both / not sure", "Ambos / no sé") } ] }
];

window.STAGE_LABELS = {
  week_1: T("Week 1", "Semana 1"), first_30_days: T("First 30 days", "Primeros 30 días"), days_31_60: T("Days 31–60", "Días 31–60"),
  days_61_90: T("Days 61–90", "Días 61–90"), months_3_6: T("Months 3–6", "Meses 3–6"), months_6_12: T("Months 6–12", "Meses 6–12"), year_2_plus: T("Year 2+", "Año 2+")
};

window.PATH_LABELS = {
  residential_service_tech: T("Residential Service Tech", "Técnico de servicio residencial"),
  residential_installer: T("Residential Installer", "Instalador residencial"),
  commercial_service_tech: T("Commercial Service Tech", "Técnico de servicio comercial"),
  commercial_installer: T("Commercial Installer", "Instalador comercial"),
  sales_track: T("Sales add-on", "Complemento de ventas")
};

/* Research module id → in-app content. types: guide | skill | quiz */
window.MODULE_LINKS = {
  "FOUND-SAFETY-01": [["guide", "safety"]],
  "FOUND-ELEC-SAFE-01": [["skill", "multimeter"]],
  "FOUND-TOOLS-01": [["dayone", "all"], ["guide", "tools"]],
  "FOUND-MEASURE-01": [["dayone", "all"], ["guide", "science"]],
  "FOUND-COMPONENTS-01": [["guide", "components"]],
  "FOUND-HEAT-01": [["guide", "science"]],
  "FOUND-CYCLE-01": [["guide", "cycle"]],
  "FOUND-ELEC-BASIC-01": [["guide", "nate-rtw"]],
  "FOUND-AIRDIST-INTRO-01": [["skill", "maintenance"], ["skill", "condensate"]],
  "FOUND-EPA608-AWARE-01": [["guide", "epa-core-guide"]],
  "FOUND-NATE-RTW-PREP-01": [["guide", "nate-rtw"]],
  "FOUND-CYCLE-02": [["guide", "ch5"]],
  "FOUND-MEASURE-DX-01": [["guide", "ch5"], ["skill", "charging"]],
  "FOUND-DIAGRAMS-01": [["skill", "thermostat"]],
  "FOUND-PIPING-01": [["skill", "tube-cut"], ["skill", "tube-bend"], ["skill", "flare"], ["skill", "swage"]],
  "FOUND-BRAZE-01": [["skill", "solder-vs-braze"], ["skill", "braze"]],
  "FOUND-EPA608-PREP-01": [["quiz", "core"], ["quiz", "type2"]],
  "FOUND-RECOVERY-01": [["skill", "pressure-test"], ["skill", "evacuation"], ["skill", "recovery"], ["skill", "charging"]],
  "FOUND-AIRFLOW-02": [["skill", "ductwork"]],
  "FOUND-MAINT-02": [["skill", "maintenance"]],
  "FOUND-ELEC-COMP-01": [["skill", "capacitor"], ["guide", "components"]],
  "CERT-NATE-RTW-SIT-01": [["guide", "nate-rtw"]],
  "PATH-RES-SVC-MAINT-01": [["skill", "maintenance"], ["skill", "condensate"]],
  "PATH-RES-INS-DUCT-ELEC-01": [["skill", "ductwork"], ["skill", "condensate"], ["skill", "thermostat"]],
  "PATH-RES-INS-CHANGEOUT-01": [["skill", "lineset"]],
  "PATH-COMM-CHILLER-INTRO-01": [["guide", "epa-t3-guide"], ["quiz", "type3"]],
  "CERT-NATE-SERVICE-01": [["guide", "ch5"], ["guide", "chp5-elec"], ["guide", "chp5-comfort"]],
  "CERT-NATE-INSTALL-01": [["guide", "ch5"], ["guide", "chp5-safety"], ["guide", "chp5-comfort"]]
};

/* Spanish titles for research modules (others fall back to English). */
window.MODULE_ES = {
  "FOUND-SAFETY-01": "Seguridad personal y en la obra", "FOUND-ELEC-SAFE-01": "Seguridad eléctrica y bloqueo/etiquetado",
  "FOUND-TOOLS-01": "Herramientas: identificación, cuidado y uso seguro", "FOUND-MEASURE-01": "Medidas y unidades",
  "FOUND-HABITS-01": "Hábitos profesionales y revisión final", "FOUND-COMPONENTS-01": "Identificación de componentes principales",
  "FOUND-DOCS-01": "Órdenes de trabajo, documentación y placas", "SALES-IMPRESSION-01": "Primeras impresiones y trato respetuoso",
  "FOUND-MATH-01": "Matemáticas del oficio", "FOUND-HEAT-01": "Fundamentos de transferencia de calor",
  "FOUND-CYCLE-01": "Ciclo de refrigeración y sus cuatro componentes", "FOUND-ELEC-BASIC-01": "Electricidad básica y uso del medidor",
  "FOUND-HEATSYS-INTRO-01": "Introducción a sistemas de calefacción", "FOUND-AIRDIST-INTRO-01": "Distribución de aire: filtros y drenajes",
  "FOUND-OSHA10-01": "OSHA 10 Construcción (u OSHA 30)", "FOUND-FIRSTAID-01": "Primeros auxilios / RCP / DEA",
  "FOUND-EPA608-AWARE-01": "EPA 608: qué requiere certificación", "FOUND-NATE-RTW-PREP-01": "Preparación NATE Ready-to-Work",
  "FOUND-CYCLE-02": "Saturación, tablas P-T y manómetros", "FOUND-MEASURE-DX-01": "Sobrecalentamiento, subenfriamiento y delta T",
  "FOUND-DIAGRAMS-01": "Símbolos eléctricos y diagramas", "FOUND-PIPING-01": "Tubería de cobre y plástico",
  "FOUND-BRAZE-01": "Soldadura blanda y fuerte", "FOUND-EPA608-PREP-01": "Preparación EPA 608 Core y tipos",
  "FOUND-A2L-01": "Seguridad con refrigerantes A2L / bajo GWP", "SALES-PLAIN-LANG-01": "Explicar hallazgos en lenguaje sencillo",
  "FOUND-RECOVERY-01": "Fugas, evacuación, recuperación y carga (supervisado)", "FOUND-AIRFLOW-02": "Flujo de aire y presión estática",
  "FOUND-HP-INTRO-01": "Introducción a bombas de calor", "CERT-NATE-RTW-SIT-01": "Presentar NATE Ready-to-Work",
  "FOUND-MAINT-02": "Mantenimiento preventivo repetible", "FOUND-ELEC-COMP-01": "Capacitores, contactores, transformadores y esquemas",
  "FOUND-HP-02": "Bombas de calor: servicio e instalación", "FOUND-GAS-02": "Calefactor de gas: secuencia y seguridad",
  "FOUND-TROUBLE-01": "Diagnóstico: aire vs carga vs eléctrico", "FOUND-IAQ-01": "Accesorios de calidad de aire",
  "CERT-NATE-SUPPORT-01": "Certificado NATE Support Technician", "SALES-OPTIONS-01": "Presentar opciones y causa raíz",
  "SALES-AGREEMENTS-01": "Contratos de mantenimiento y objeciones", "SALES-CHECKLIST-01": "Lista previa de servicio, mantenimiento e instalación"
};

/* Small, data-only ordering tweaks applied by the engine (research rules PR-12..PR-17). */
window.ORDER_BOOST = {
  installer: ["FOUND-PIPING-01", "FOUND-BRAZE-01", "PATH-COMM-INS-DRAW-01", "PATH-RES-INS-DUCT-ELEC-01"],   // PR-12
  service: ["FOUND-MEASURE-DX-01", "FOUND-DIAGRAMS-01", "FOUND-MAINT-02", "PATH-RES-SVC-MAINT-01"],         // PR-13
  heating_first: ["FOUND-GAS-02", "PATH-RES-INS-VENT-AWARE-01"],                 // PR-15 (after safety + cycle)
  cooling_first: ["FOUND-CYCLE-01", "FOUND-AIRFLOW-02", "FOUND-HP-INTRO-01"],
  heat_pump: ["FOUND-HP-INTRO-01", "FOUND-HP-02"]
};
/* Move a module to a different stage for everyone (leave empty to follow research). */
window.STAGE_OVERRIDES = {};
/* PR-15: in heating-first climates, gas heat moves ahead of deep cooling diagnostics. */
window.CLIMATE_STAGE_SHIFT = { heating_first: { "FOUND-GAS-02": "days_61_90" }, cooling_first: {} };

/* Practical first on-the-job tasks per path (from research section e). */
window.PATH_FIRST_TASKS = {
  residential_service_tech: {
    earliest: ["Ride along; carry and organize tools", "Change and report air filters", "Inspect and clear condensate drains and pans", "Help wash condenser coils", "Visual inspection: oil stains, rub-outs, damaged wiring, dirty blower/evap coil, missing screws or caps", "Confirm disconnects and thermostat setpoints before leaving", "Greet the customer, explain what was checked, complete the work order"],
    after: ["Assist recovery and charging", "Measure delta T; observe superheat/subcooling", "Replace a capacitor or contactor under a lead after the diagnosis is verified", "Complete a full maintenance with a run test at the end"],
    defer: ["Unsupervised no-cool diagnosis", "Compressor replacement decisions", "Gas manifold or combustion analysis without training", "Any 'replace the system' recommendation without a documented root cause"] },
  residential_installer: {
    earliest: ["Protect the home; stage materials", "Team-lift and set equipment under a lead", "Run and support flex duct", "Help hang or connect line sets (mechanical work first)", "Insulate suction lines; run condensate; seal penetrations", "Pull thermostat cable; cleanup and haul-away", "Collect model and serial numbers"],
    after: ["Braze under supervision with nitrogen purge", "Pressure test; evacuate to a deep vacuum and hold", "Assist start-up and charge; set a thermostat", "Walk the customer through filter access and operation; complete start-up paperwork"],
    defer: ["Solo setting in unsafe attic or roof conditions", "Unsupervised electrical lugs on new circuits", "Gas piping without authorization", "Load/duct design without training", "Final charge sign-off without airflow verification"] },
  commercial_service_tech: {
    earliest: ["Site check-in; roof and mechanical-room safety", "LOTO with a lead", "Replace RTU or air-handler filters", "Inspect belts and report wear/tension (don't adjust until shown)", "Coil cleaning assist", "Record nameplate data and requested readings", "Keep the roof clean; never leave panels unsecured"],
    after: ["Belt replacement and pulley alignment under supervision", "Supervised amp and voltage measurements on packaged units", "PM plus basic repairs (contactors, capacitors, drains)", "Read BAS alarms/trends with a senior tech", "Document findings for the facility manager"],
    defer: ["Independent chiller work", "BAS programming", "Unsupervised three-phase motor replacement", "Equipment rooms without sensor awareness and site rules", "Confined-space entry without training and a permit"] },
  commercial_installer: {
    earliest: ["Site orientation and PPE", "Stay clear of crane/rigging unless assigned and trained", "Stage curb caps, transitions and accessories", "Assist setting and aligning a unit with a lead", "Hang or connect duct; assist pipe supports; insulate", "As-built photos and model/serial documentation"],
    after: ["Make up piping and brazed joints under supervision", "Assist electrical connections", "Leak test, evacuate and start-up assist", "Complete commissioning sheets with a lead; punch-list items"],
    defer: ["Signaling a crane without qualification", "Unsupervised gas or high-voltage terminations", "Fire-stopping unless trained and allowed", "VRF or chiller start-up without manufacturer training and the right 608 type"] },
  sales_track: {
    earliest: ["Professional introduction", "Don't guess", "Narrate simple findings", "Ask whether anything else is needed", "Leave the site clean"],
    after: ["Present findings, root cause and three options", "Explain maintenance agreements as planned care, not a pressure close", "Document the customer's choice"],
    defer: ["Pricing replacements outside the company's estimating process", "Disparaging prior contractors", "Selling repairs that weren't verified"] }
};

/* Sources shown on the Credits screen (from the research). */
window.CREDITS_NOTE = T("Learning order, placement rules, certification timing and first tasks are based on a research synthesis (Nov 10, 2026) of public apprenticeship curricula (NCCER, ABC, UA), NATE and HVAC Excellence/ESCO materials, EPA Section 608 rules, OSHA Outreach guidance, ACCA, and HVAC School trainer content. The week/30/60/90 calendar is a guide for onboarding, not a published national standard. Registered apprenticeships typically run 4–5 years with about 8,000 OJT hours. State and local licensing varies. App content is original and not affiliated with or endorsed by any of these organizations.",
  "El orden de aprendizaje, las reglas de ubicación, el momento de las certificaciones y las primeras tareas se basan en una síntesis de investigación (10 nov 2026) de planes públicos de aprendizaje (NCCER, ABC, UA), materiales de NATE y HVAC Excellence/ESCO, reglas EPA Sección 608, guía de OSHA Outreach, ACCA y contenido de HVAC School. El calendario semana/30/60/90 es una guía, no un estándar nacional. Los programas de aprendiz registrados suelen durar 4–5 años con unas 8,000 horas de práctica. Las licencias estatales y locales varían. El contenido de la app es original y no está afiliado ni respaldado por estas organizaciones.");
})();
/* Spanish titles for path-specific modules */
Object.assign(window.MODULE_ES, {
  "PATH-RES-SVC-SHADOW-01": "Acompañar en servicio residencial y tareas de ayudante",
  "PATH-RES-SVC-MAINT-01": "Mantenimiento residencial con más independencia (sin refrigerante)",
  "PATH-RES-INS-VENT-AWARE-01": "Ventilación de hornos y riesgos de combustión (intro)",
  "PATH-RES-SVC-CALL-01": "Hacer una visita de mantenimiento completa bajo observación",
  "PATH-RES-SVC-ELEC-SUP-01": "Revisiones eléctricas residenciales supervisadas",
  "PATH-RES-SVC-DIAG-01": "Diagnóstico supervisado de llamadas comunes (sin frío / sin calor)",
  "PATH-RES-INS-MINISPLIT-01": "Fundamentos de instalación de minisplit",
  "PATH-RES-SVC-ADV-01": "Cierre del primer año: diagnóstico con mediciones junto a un líder",
  "CERT-NATE-SERVICE-01": "NATE Core + especialidad de Servicio (con experiencia)",
  "PATH-RES-INS-SITE-01": "Etiqueta en la obra residencial y preparación de material",
  "FOUND-STEEL-PIPE-01": "Prácticas básicas con tubería de acero",
  "PATH-RES-INS-DUCT-ELEC-01": "Instalación residencial: apoyo en ductos, condensado y cableado",
  "PATH-RES-INS-CHANGEOUT-01": "Apoyar un cambio de equipo completo y el arranque",
  "PATH-RES-INS-QI-01": "Prácticas de instalación de calidad (ACCA QI) y documentación",
  "PATH-RES-INS-LEADHELP-01": "Avanzar a ayudante principal en cambios sencillos",
  "CERT-NATE-INSTALL-01": "NATE Core + especialidad de Instalación (con experiencia)",
  "PATH-COMM-SITE-SAFE-01": "Seguridad en obra comercial, techos y cuartos de máquinas",
  "PATH-COMM-SVC-PM-SHADOW-01": "Acompañar mantenimiento preventivo comercial",
  "PATH-COMM-ELEC-3PH-01": "Trifásico y motores grandes (conocimiento)",
  "PATH-COMM-SVC-PM-01": "Mantenimiento comercial: filtros, bandas y bitácoras",
  "PATH-COMM-SVC-BELTS-01": "Cambio de bandas y alineación de poleas supervisado",
  "PATH-COMM-AIRSIDE-AWARE-01": "Lado de aire comercial (reconocer CV y VAV)",
  "PATH-COMM-SVC-RTU-01": "Mantenimiento de equipos de techo (RTU) y servicio básico",
  "PATH-COMM-BAS-READ-01": "Automatización: leer tendencias, alarmas y horarios (sin programar)",
  "PATH-COMM-HYDRONIC-AWARE-01": "Reconocer componentes hidrónicos",
  "PATH-COMM-SVC-TROUBLE-01": "Diagnóstico de equipos de techo y divididos comerciales con un líder",
  "PATH-COMM-CHILLER-INTRO-01": "Chillers y equipos de baja presión; requisito Tipo III",
  "PATH-COMM-REFRIG-AWARE-01": "Refrigeración comercial ligera (solo si la empresa la hace)",
  "PATH-COMM-INS-RIG-01": "Instalación comercial: izaje y manejo de material",
  "PATH-COMM-INS-DRAW-01": "Leer un plano mecánico sencillo con un líder",
  "PATH-COMM-INS-STARTUP-01": "Apoyar arranque comercial y documentación",
  "PATH-COMM-INS-RTU-01": "Instalación repetible de RTU o dividido comercial ligero",
  "PATH-COMM-INS-ADV-01": "Competencia asistida en instalaciones comerciales estándar"
});
