/* Study Guides library. All content is ORIGINAL, written from general
   HVAC principles and the public EPA rules (40 CFR Part 82 Subpart F).
   Not copied from or affiliated with any textbook, NATE, ESCO or prep book.
   Each guide: summary(intro), terms, sections (step-by-step), cards,
   check quiz, slides auto-built from these, videoUrl for a future real video. */
(function () {
  const L = window.LESSONS;
  const T = (en, es) => ({ en, es: es || "" });
  // Key terms for HVAC 101 lessons
  L.safety.terms = [T("LOTO", "LOTO (bloqueo/etiquetado)"), T("PPE", "EPP (equipo de protección)"), T("Asphyxiation", "Asfixia"), T("Capacitor discharge", "Descarga del capacitor")];
  L.cycle.terms = [T("Compressor", "Compresor"), T("Condenser", "Condensador"), T("Metering device", "Dispositivo de expansión"), T("Evaporator", "Evaporador"), T("High side / low side", "Lado alto / lado bajo")];
  L.components.terms = [T("Contactor", "Contactor"), T("Run capacitor", "Capacitor de marcha"), T("Filter drier", "Filtro deshidratador"), T("Reversing valve", "Válvula inversora"), T("Accumulator", "Acumulador")];
  L.tools.terms = [T("Manifold gauges", "Manómetros"), T("Micron gauge", "Vacuómetro"), T("Recovery machine", "Máquina recuperadora"), T("Clamp meter", "Multímetro de gancho")];
  L.ch5.terms = [T("Sensible heat"), T("Latent heat"), T("Saturation"), T("Superheat"), T("Subcooling"), T("CFM per ton")];
  L.cycle.diagram = "cycle";
  L.components.recognition = true;
  Object.values(L).forEach(g => { if (!("videoUrl" in g)) g.videoUrl = null; });

  const add = (id, g) => { g.videoUrl = g.videoUrl || null; g.enOnly = g.enOnly !== false; L[id] = g; };

  add("science", { icon: "🔬", minutes: 12, title: T("The Science of HVAC", "La ciencia del HVAC"), diagram: "pt",
    intro: T("Four ideas explain almost everything a system does: heat moves hot to cold, pressure sets the boiling point, state changes move lots of heat, and superheat/subcooling tell you what the refrigerant is doing."),
    terms: [T("BTU"), T("Sensible heat"), T("Latent heat"), T("Saturation"), T("Superheat"), T("Subcooling"), T("P/T chart")],
    sections: [
      { h: T("Step 1 — Heat and BTUs"), p: T("Heat is energy. One BTU raises one pound of water by 1°F. A 'ton' of cooling is 12,000 BTU per hour — the heat it takes to melt one ton of ice in a day.") },
      { h: T("Step 2 — Sensible vs. latent"), p: T("Sensible heat changes temperature. Latent heat changes state (melting, boiling, condensing) without changing temperature. Boiling a pound of water absorbs far more heat than warming it by a few degrees, which is why refrigerant boiling in a coil is so effective.") },
      { h: T("Step 3 — Pressure and boiling point"), p: T("Raise the pressure and the boiling point goes up; lower it and the boiling point drops. In the evaporator we keep pressure low so refrigerant boils cold. In the condenser we keep it high so it condenses above outdoor temperature.") },
      { h: T("Step 4 — Saturation and the P/T chart"), p: T("Where liquid and vapor are mixed (inside the coils), pressure and temperature are locked together. Read pressure on a gauge, look up the saturation temperature on a P/T chart or digital gauge.") },
      { h: T("Step 5 — Superheat"), p: T("Once all liquid boils off, more heat raises the vapor's temperature: that's superheat. Superheat = suction line temperature − evaporator saturation temperature. Some superheat protects the compressor from liquid.") },
      { h: T("Step 6 — Subcooling"), p: T("Once all vapor condenses, more cooling lowers the liquid's temperature: that's subcooling. Subcooling = condenser saturation temperature − liquid line temperature. It shows a solid column of liquid feeds the metering device.") }
    ],
    keyPoints: { en: ["1 ton = 12,000 BTU/h.", "Latent heat moves the most energy.", "Lower pressure → lower boiling point.", "SH on the suction line, SC on the liquid line."] },
    cards: { tip: T("Write it down: SH = line temp − sat temp (suction). SC = sat temp − line temp (liquid). The bigger number always goes first."),
      analogy: T("A pressure cooker cooks hotter because higher pressure raises water's boiling point. A condenser works the same way."),
      example: T("R-410A suction at 118 psig ≈ 40°F saturation. Suction line reads 50°F → 10°F superheat.") },
    check: [
      { q: T("1 ton of cooling equals:"), a: [T("12,000 BTU/h"), T("1,000 BTU/h"), T("3,412 BTU/h"), T("24,000 BTU/h")], c: 0, why: T("One ton = 12,000 BTU per hour.") },
      { q: T("Subcooling is calculated from which line?"), a: [T("Liquid line"), T("Suction line"), T("Discharge line"), T("Drain line")], c: 0, why: T("Subcooling compares condenser saturation temperature with liquid line temperature.") },
      { q: T("Lowering pressure on a liquid refrigerant will:"), a: [T("Lower its boiling point"), T("Raise its boiling point"), T("Freeze it solid"), T("Change nothing")], c: 0, why: T("Pressure and boiling point move together.") }
    ] });

  add("epa-core-guide", { icon: "🌎", minutes: 15, enOnly: false, title: T("EPA 608 Core Study Guide", "Guía de estudio EPA 608 Core"),
    intro: T("Core covers the 'why' and the rules that apply to every technician: ozone science, the venting ban, the three R's, sales limits, safety, shipping and recordkeeping. Based on 40 CFR Part 82, Subpart F.", "Core cubre el 'por qué' y las reglas para todo técnico: ciencia del ozono, prohibición de liberar, las tres R, límites de venta, seguridad, envío y registros. Basado en 40 CFR Parte 82, Subparte F."),
    terms: [T("ODP", "ODP"), T("De minimis", "De minimis"), T("Recover / Recycle / Reclaim", "Recuperar / Reciclar / Regenerar"), T("AHRI 700", "AHRI 700"), T("Sales restriction", "Restricción de venta")],
    sections: [
      { h: T("Step 1 — Why the rules exist", "Paso 1 — Por qué existen las reglas"), p: T("Chlorine from CFCs and HCFCs drifts into the stratosphere and destroys ozone, which shields us from UV. The Montreal Protocol and the Clean Air Act phased these chemicals out.", "El cloro de los CFC y HCFC llega a la estratosfera y destruye el ozono, que nos protege de la radiación UV. El Protocolo de Montreal y la Ley de Aire Limpio eliminaron estos químicos.") },
      { h: T("Step 2 — The venting prohibition", "Paso 2 — Prohibición de liberar"), p: T("You may not knowingly release refrigerant during service, maintenance, repair or disposal. Small 'de minimis' releases while properly recovering are allowed (§82.154).", "No puedes liberar refrigerante a propósito durante servicio, mantenimiento, reparación o desecho. Se permiten pequeñas liberaciones 'de minimis' al recuperar correctamente (§82.154).") },
      { h: T("Step 3 — The three R's", "Paso 3 — Las tres R"), p: T("Recover: remove and store. Recycle: clean for reuse in the same owner's equipment. Reclaim: reprocess to AHRI 700 purity, proven by lab test, before selling to a new owner.", "Recuperar: sacar y guardar. Reciclar: limpiar para reusar en equipo del mismo dueño. Regenerar: reprocesar a pureza AHRI 700, probado en laboratorio, antes de venderlo a otro dueño.") },
      { h: T("Step 4 — Certification and sales", "Paso 4 — Certificación y venta"), p: T("Techs must be certified for the equipment type they work on (Type I, II, III or Universal; Core required). Certification doesn't expire. Refrigerant sales are restricted to certified techs (§82.154(c), §82.161).", "Los técnicos deben estar certificados para el tipo de equipo (Tipo I, II, III o Universal; Core obligatorio). La certificación no vence. La venta de refrigerante se limita a técnicos certificados (§82.154(c), §82.161).") },
      { h: T("Step 5 — Equipment and cylinders", "Paso 5 — Equipo y cilindros"), p: T("Use certified recovery equipment (§82.158). Recovery cylinders are DOT-rated, gray with yellow tops; fill no more than 80% by weight. Label contents.", "Usa equipo de recuperación certificado (§82.158). Los cilindros de recuperación tienen aprobación DOT, son grises con parte superior amarilla; llénalos máximo al 80% por peso. Rotula el contenido.") },
      { h: T("Step 6 — Safety, disposal, records", "Paso 6 — Seguridad, desecho, registros"), p: T("Pressurize with dry nitrogen only. Never heat cylinders with a torch. The last person in the disposal chain must verify refrigerant was recovered (§82.155). Keep records 3 years.", "Presuriza solo con nitrógeno seco. Nunca calientes cilindros con soplete. La última persona en la cadena de desecho debe verificar que se recuperó el refrigerante (§82.155). Guarda registros 3 años.") }
    ],
    keyPoints: { en: ["No venting (except de minimis).", "Reclaim before selling to a new owner.", "Cylinders ≤80% full.", "Certification never expires."], es: ["No liberar (excepto de minimis).", "Regenerar antes de vender a otro dueño.", "Cilindros ≤80% llenos.", "La certificación no vence."] },
    cards: { tip: T("Memorize the three R's in order of 'cleanliness': Recover < Recycle < Reclaim.", "Memoriza las tres R por 'limpieza': Recuperar < Reciclar < Regenerar."),
      analogy: T("Recovery is bagging the trash, recycling is sorting it, reclaiming is the factory that turns it into new product.", "Recuperar es embolsar la basura, reciclar es separarla y regenerar es la fábrica que la convierte en producto nuevo."),
      example: T("You recover R-22 from a customer's unit and want to put it into another customer's unit. You can't — it must go to a certified reclaimer first.", "Recuperas R-22 de la unidad de un cliente y quieres ponerlo en la de otro cliente. No puedes: primero debe ir a un regenerador certificado.") },
    quizLink: "core",
    check: [] });

  add("epa-t1-guide", { icon: "🗄️", minutes: 8, title: T("EPA 608 Type I Study Guide"),
    intro: T("Type I covers small appliances: factory-sealed systems with 5 lb or less of refrigerant, like fridges, freezers, window ACs, dehumidifiers and vending machines."),
    terms: [T("Small appliance"), T("Self-contained (active) recovery"), T("System-dependent (passive) recovery"), T("Piercing valve")],
    sections: [
      { h: T("Step 1 — What counts"), p: T("Manufactured, charged and hermetically sealed in a factory with 5 lb or less of refrigerant (§82.152).") },
      { h: T("Step 2 — Recovery requirements"), p: T("With equipment made after Nov. 15, 1993: recover 90% of the charge if the compressor runs, 80% if it doesn't — or reach a 4 in. Hg vacuum (§82.156(b)).") },
      { h: T("Step 3 — Active vs. passive"), p: T("Self-contained (active) machines have their own compressor. System-dependent (passive) methods use the appliance's compressor or pressure and are only allowed on small appliances. If the compressor won't run, access both high and low sides.") },
      { h: T("Step 4 — Access"), p: T("Piercing valves give quick access but can leak over time; don't leave them on a system that stays in service.") }
    ],
    keyPoints: { en: ["≤5 lb, factory sealed.", "90% (running) / 80% (not running) or 4 in. Hg.", "Passive recovery only for small appliances."] },
    cards: { tip: T("Run the compressor during passive recovery if it works — it pushes refrigerant into the bag or cylinder."), analogy: T("Passive recovery is like letting a balloon empty on its own; active recovery is using a pump."), example: T("A dorm fridge with a dead compressor: install piercing valves on both sides and tap the compressor shell to help free trapped refrigerant from oil.") },
    quizLink: "type1", check: [] });

  add("epa-t2-guide", { icon: "🌀", minutes: 10, title: T("EPA 608 Type II Study Guide"),
    intro: T("Type II covers medium-, high- and very high-pressure appliances (except small appliances and MVACs): split systems, heat pumps, RTUs and most commercial refrigeration."),
    terms: [T("Leak rate"), T("Comfort cooling"), T("Commercial refrigeration"), T("Industrial process refrigeration"), T("Required evacuation level")],
    sections: [
      { h: T("Step 1 — Leak repair (ODS, 50+ lb)"), p: T("Repair when the leak rate exceeds 10% for comfort cooling, 20% for commercial refrigeration, 30% for industrial process refrigeration. Generally within 30 days, then verification tests (§82.157).") },
      { h: T("Step 2 — Evacuation levels"), p: T("With recovery equipment made on or after Nov. 15, 1993: very high-pressure → 0 in. Hg; high-pressure (R-22, R-410A…) under 200 lb → 0 in. Hg, 200 lb+ → 10 in. Hg; medium-pressure (R-134a, R-12…) under 200 lb → 10 in. Hg, 200 lb+ → 15 in. Hg (§82.156(a), Table 1).") },
      { h: T("Step 3 — Recovery technique"), p: T("Recover liquid first to save time, then vapor. Chill the recovery cylinder to help. Watch for non-condensables (air) raising head pressure.") },
      { h: T("Step 4 — Leak checking"), p: T("Signs of leaks: oil spots, high superheat, low subcooling. Pressurize with nitrogen (a trace of HCFC-22 may be added) and use bubbles, electronic or ultrasonic detectors.") }
    ],
    keyPoints: { en: ["10 / 20 / 30% leak thresholds.", "30 days to repair.", "Know Table 1 evacuation levels."] },
    cards: { tip: T("Remember the leak thresholds as 'Comfort 10, Commercial 20, Industrial 30'."), analogy: T("Leak rate is like a tire losing air: a little each month adds up to a flat by year's end."), example: T("A 300 lb R-22 supermarket rack loses 75 lb in a year — 25%, over the 20% commercial threshold, so the owner must repair.") },
    quizLink: "type2", check: [] });

  add("epa-t3-guide", { icon: "🏭", minutes: 10, title: T("EPA 608 Type III Study Guide"),
    intro: T("Type III covers low-pressure appliances — mainly centrifugal chillers using refrigerants like R-123 or R-1233zd(E) — where part of the system runs in a vacuum."),
    terms: [T("Purge unit"), T("Non-condensables"), T("Rupture disc"), T("mm Hg absolute")],
    sections: [
      { h: T("Step 1 — Leaks go inward"), p: T("Because the low side is below atmospheric pressure, leaks pull air and moisture in. A purge unit removes them; frequent purging signals a leak.") },
      { h: T("Step 2 — Leak testing"), p: T("Raise pressure carefully with controlled hot water or heating blankets, or a little nitrogen — no more than about 10 psig, to stay under the 15 psig rupture disc.") },
      { h: T("Step 3 — Recovery"), p: T("Remove liquid first, then vapor. Circulate water through the tubes so they don't freeze. Evacuate to 25 mm Hg absolute (§82.156, Table 1).") },
      { h: T("Step 4 — Charging"), p: T("Add vapor first until pressure is high enough that liquid won't freeze water in the tubes, then add liquid.") }
    ],
    keyPoints: { en: ["Leaks pull air in → purge unit.", "Test ≤10 psig; rupture disc 15 psig.", "Evacuate to 25 mm Hg absolute."] },
    cards: { tip: T("Track purge run time — rising run time is an early leak warning."), analogy: T("A low-pressure chiller is like a straw in a drink: any pinhole sucks air in instead of leaking out."), example: T("A chiller's purge suddenly runs hours a day. The tech pressurizes with warm water to under 10 psig and finds a leaking gasket.") },
    quizLink: "type3", check: [] });

  add("nate-rtw", { icon: "🎓", minutes: 15, title: T("Ready-to-Work Entry Guide"),
    note: T("Original practice content in the style of an entry-level readiness exam. Not affiliated with, endorsed by, or copied from NATE or any testing organization."),
    intro: T("A broad entry-level review: safety, tools, basic electrical, heat transfer and basic construction/components."),
    terms: [T("Ohm's law"), T("Series / parallel"), T("Conduction / convection / radiation"), T("Duct static pressure"), T("Flare / swage / braze")],
    sections: [
      { h: T("Step 1 — Safety"), p: T("LOTO, PPE, ladder safety, nitrogen-only pressure testing, ventilation and CO awareness on fuel appliances.") },
      { h: T("Step 2 — Tools"), p: T("Gauges, thermometers, multimeter, vacuum pump with micron gauge, recovery machine, tubing tools, torque wrench and leak detectors.") },
      { h: T("Step 3 — Basic electrical"), p: T("Voltage pushes, current flows, resistance opposes. Ohm's law: V = I × R. Loads are wired in parallel so each gets full voltage; switches and safeties are wired in series with the load they control.") },
      { h: T("Step 4 — Heat transfer"), p: T("Conduction through solids, convection through moving air or water, radiation through infrared. Insulation slows conduction; fans boost convection.") },
      { h: T("Step 5 — Construction and components"), p: T("Supply and return ducts, registers, plenums and filters. Copper line sets joined by brazing, flaring or press fittings. Condensate drains need a trap and slope.") }
    ],
    keyPoints: { en: ["V = I × R.", "Switches in series, loads in parallel.", "Three heat transfer modes.", "Trap and slope the condensate drain."] },
    cards: { tip: T("If you know two of V, I, R you can always find the third — cover the one you want in the V/IR triangle."), analogy: T("Electricity is water in a hose: voltage is pressure, current is flow, resistance is a kink."), example: T("A 240V motor draws 5 A. Its effective resistance is about 48 Ω (240 ÷ 5).") },
    check: [
      { q: T("Ohm's law states:"), a: [T("V = I × R"), T("V = I ÷ R"), T("I = V × R"), T("R = V × I")], c: 0, why: T("Voltage equals current times resistance.") },
      { q: T("Safety switches are normally wired ___ with the load."), a: [T("In series"), T("In parallel"), T("Not connected"), T("To ground only")], c: 0, why: T("A series switch can break the circuit to stop the load.") },
      { q: T("Heat moving through a copper tube wall is:"), a: [T("Conduction"), T("Convection"), T("Radiation"), T("Evaporation")], c: 0, why: T("Conduction is heat transfer through a solid.") },
      { q: T("A condensate drain line should have:"), a: [T("A trap and downward slope"), T("An upward slope"), T("No trap ever"), T("A refrigerant valve")], c: 0, why: T("Slope lets water flow; the trap keeps air from being pulled through the drain.") }
    ] });

  /* Component recognition items (SVG icon ids drawn in diagrams.js) */
  window.COMPONENTS = [
    { id: "compressor", name: T("Compressor", "Compresor"), info: T("Pumps refrigerant; raises pressure and temperature. Types: reciprocating, scroll, rotary, screw, centrifugal.", "Bombea refrigerante; sube presión y temperatura. Tipos: reciprocante, scroll, rotativo, tornillo, centrífugo.") },
    { id: "condenser", name: T("Condenser coil", "Serpentín condensador"), info: T("Rejects heat; vapor condenses to liquid.", "Rechaza calor; el vapor se condensa en líquido.") },
    { id: "evaporator", name: T("Evaporator coil", "Serpentín evaporador"), info: T("Absorbs heat; liquid boils to vapor. Often an A-coil indoors.", "Absorbe calor; el líquido hierve a vapor. A menudo un serpentín en A.") },
    { id: "txv", name: T("TXV", "Válvula TXV"), info: T("Thermostatic expansion valve with a sensing bulb on the suction line; holds steady superheat.", "Válvula de expansión termostática con bulbo en la succión; mantiene el sobrecalentamiento estable.") },
    { id: "piston", name: T("Piston (fixed orifice)", "Pistón (orificio fijo)"), info: T("A fixed hole that meters refrigerant; simple, no adjustment.", "Un orificio fijo que dosifica refrigerante; simple, sin ajuste.") },
    { id: "eev", name: T("EEV", "Válvula EEV"), info: T("Electronic expansion valve driven by a stepper motor and controller.", "Válvula de expansión electrónica movida por motor a pasos y controlador.") },
    { id: "reversing", name: T("Reversing valve", "Válvula inversora"), info: T("Heat pumps only: switches refrigerant flow for heating or cooling.", "Solo bombas de calor: cambia el flujo para calefacción o enfriamiento.") },
    { id: "drier", name: T("Filter drier", "Filtro deshidratador"), info: T("Catches moisture, acid and debris in the liquid line.", "Atrapa humedad, ácido y suciedad en la línea de líquido.") },
    { id: "accumulator", name: T("Accumulator", "Acumulador"), info: T("Suction-side tank that stops liquid from reaching the compressor.", "Tanque en la succión que evita que llegue líquido al compresor.") },
    { id: "contactor", name: T("Contactor", "Contactor"), info: T("24V coil closes contacts to power the compressor and fan.", "Bobina de 24V cierra contactos para alimentar compresor y ventilador.") },
    { id: "capacitor", name: T("Capacitor", "Capacitor"), info: T("Stores energy to start/run motors. Dual caps have HERM, FAN and C terminals.", "Guarda energía para arrancar/mantener motores. Los duales tienen HERM, FAN y C.") },
    { id: "thermostat", name: T("Thermostat", "Termostato"), info: T("The control that calls for heat, cool and fan using 24V signals.", "El control que pide calor, frío y ventilador con señales de 24V.") }
  ];

  /* Group guides for the library */
  window.GUIDE_GROUPS = [
    { id: "basics", title: T("Basics", "Básicos"), guides: ["cycle", "science", "components", "safety", "tools"] },
    { id: "epa", title: T("EPA 608", "EPA 608"), guides: ["epa-core-guide", "epa-t1-guide", "epa-t2-guide", "epa-t3-guide"] },
    { id: "career", title: T("Career readiness", "Preparación laboral"), guides: ["nate-rtw", "ch5"] }
  ];
})();
