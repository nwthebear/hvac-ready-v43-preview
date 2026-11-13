/* Hands-On Skills tutorials — ORIGINAL step-by-step content (English; Spanish falls back).
   Always follow manufacturer instructions, local code, and your supervisor. tags = path goals. */
(function () {
  const T = (en, es) => ({ en, es: es || "" });
  const S = (id, icon, title, tags, o) => ({ id, icon, title: T(title), tags, videoUrl: null, enOnly: true, ...o });
  const q = (qq, a, why) => ({ q: T(qq), a: a.map(x => T(x)), c: 0, why: T(why) });
  window.SKILLS = [
    S("tube-cut", "✂️", "Tube cutting & deburring", ["residential", "commercial", "refrigeration"], {
      intro: T("Clean, square cuts make leak-free joints."),
      safety: ["Wear safety glasses — copper chips fly.", "Cut tube ends are sharp; handle with gloves."],
      steps: ["Measure and mark the tube.", "Seat the cutter wheel on the mark; tighten lightly.", "Rotate the cutter around the tube, tightening a little each turn.", "After the cut, ream the inside burr with a deburring tool, pointing the tube down so chips fall out.", "Lightly clean the outside edge; cap the tube until use."],
      mistakes: ["Over-tightening the cutter (crushes the tube out of round).", "Using a hacksaw (leaves chips and rough edges).", "Skipping deburring — burrs restrict flow and ruin flares."],
      cards: { tip: T("Small, steady turns beat big cranks of the knob."), analogy: T("Cutting tube is like peeling an apple in a spiral — gentle and even."), example: T("A ragged cut on a 3/8\" liquid line caused a flare to crack and leak a week later.") },
      check: [q("When deburring, point the tube…", ["Down, so chips fall out", "Up", "Sideways into the unit", "Doesn't matter"], "Gravity keeps chips out of the system."), q("Over-tightening a tube cutter can…", ["Deform the tube", "Sharpen the wheel", "Make a cleaner cut", "Anneal copper"], "Too much pressure squeezes the tube oval.")] }),
    S("tube-bend", "↪️", "Tube bending", ["residential", "refrigeration"], {
      intro: T("Bending reduces fittings — fewer joints, fewer leaks."),
      safety: ["Keep hands clear of the bender handle path.", "Soft copper only for hand bending; hard-drawn tube can crack."],
      steps: ["Choose the bender shoe that matches the tube size.", "Mark where the bend should start.", "Seat the tube and align the mark with the bender's 0° line.", "Pull the handle smoothly to the desired angle.", "Check for flattening or kinks."],
      mistakes: ["Bending too tight a radius (kinks).", "Using the wrong shoe size.", "Bending hard copper without a proper tool."],
      cards: { tip: T("Add a few degrees past your target — copper springs back slightly."), analogy: T("Like bending a drinking straw: too sharp and it collapses."), example: T("A kinked suction line raised superheat and starved the evaporator.") },
      check: [q("A kink in a refrigerant line causes…", ["A restriction", "Better flow", "Nothing", "Lower superheat only"], "A kink narrows the passage.")] }),
    S("flare", "🔩", "Flaring", ["residential", "refrigeration"], {
      intro: T("A 45° flare makes a mechanical seal — common on ductless mini-splits."),
      safety: ["Eye protection.", "Use refrigerant-rated flare nuts only."],
      steps: ["Cut square and deburr.", "Slide the flare nut on FIRST, threads facing the tube end.", "Clamp the tube in the flaring bar at the correct height.", "Turn the yoke to form an even 45° flare.", "Inspect: smooth, round, no cracks.", "Add a drop of refrigerant oil if the manufacturer allows, then torque the nut to spec with a torque wrench."],
      mistakes: ["Forgetting the nut before flaring.", "Over- or under-torquing.", "Cracked or off-center flares."],
      cards: { tip: T("Keep a flare-nut torque chart in your phone or bag."), analogy: T("A flare is like a funnel lip pressed into a cone — the metal-to-metal contact is the seal."), example: T("Most mini-split callbacks for leaks come from under-torqued flare nuts.") },
      check: [q("Flare nuts should be tightened with…", ["A torque wrench to spec", "As tight as possible", "Hand tight only", "Pliers"], "Spec torque prevents leaks and cracks."), q("What goes on the tube before flaring?", ["The flare nut", "Tape", "Solder", "Nothing"], "You can't add it after the flare is made.")] }),
    S("swage", "🔧", "Swaging", ["residential", "commercial", "refrigeration"], {
      intro: T("Swaging expands one tube so another of the same size slides in for brazing — no coupling needed."),
      safety: ["Glasses; keep the tool square to avoid slipping."],
      steps: ["Cut square and deburr.", "Insert the correct swage bit (or use a swaging tool).", "Expand the tube to about the depth of the tube's diameter.", "Check the other tube slides in snugly.", "Clean both surfaces before brazing."],
      mistakes: ["Swaging too shallow (weak joint).", "Splitting the tube by forcing it."],
      cards: { tip: T("Swaged depth ≈ tube OD is a good rule of thumb."), analogy: T("Like stretching the end of a sock to slip over another."), example: T("Swaging saved two couplings on a line set repair — fewer brazed joints to leak.") },
      check: [q("Swaging is used to…", ["Join same-size tubes without a coupling", "Make a 45° flare", "Cut tubing", "Bend tube"], "The expanded end acts as the fitting.")] }),
    S("braze", "🔥", "Brazing with nitrogen purge", ["residential", "commercial", "refrigeration"], {
      intro: T("Brazing joins copper above 840°F with filler rod. Flowing nitrogen inside stops scale from forming."),
      safety: ["Fire extinguisher nearby; use a heat shield.", "Wear tinted glasses and gloves.", "Ventilate — fumes are harmful.", "Wrap valves with a wet rag or heat paste.", "Never braze on a system with refrigerant in it; recover first."],
      steps: ["Clean and fit the joint (snug, no gaps).", "Connect nitrogen through a flowmeter/regulator at a low flow (just a gentle breeze at the open end).", "Heat the tube and fitting evenly until cherry red.", "Touch the rod to the joint opposite the flame; let capillary action pull it in.", "Remove heat, keep nitrogen flowing until it cools.", "Inspect for a full fillet all around."],
      mistakes: ["No nitrogen purge (black scale inside).", "Melting the rod with the flame instead of the heated metal.", "Overheating and burning through."],
      cards: { tip: T("Heat the fitting more than the tube — the filler flows toward heat."), analogy: T("Capillary action is like a paper towel wicking up water."), example: T("Unpurged brazing left scale that clogged a TXV screen weeks later.") },
      check: [q("Why purge with nitrogen while brazing?", ["Prevent oxide scale inside", "Cool the torch", "Add refrigerant", "Make flame hotter"], "Without oxygen inside, scale can't form."), q("Filler metal should be melted by…", ["The heated base metal", "Direct flame on the rod", "A soldering iron", "Friction"], "Hot metal draws the rod in for a strong joint.")] }),
    S("solder-vs-braze", "⚖️", "Soldering vs. brazing", ["residential", "commercial", "refrigeration"], {
      intro: T("Both join metal with filler, but at different temperatures and strengths."),
      safety: ["Same fire and fume precautions as brazing.", "Use lead-free solder on water lines."],
      steps: ["Soldering: filler melts below 840°F; used for drains and water lines.", "Brazing: filler melts above 840°F; required for most refrigerant joints because of pressure and vibration.", "Copper-to-copper brazing often uses phos-copper rod (no flux needed).", "Copper-to-brass or steel needs silver rod with flux.", "Check the manufacturer's spec for the alloy."],
      mistakes: ["Soldering high-pressure refrigerant lines.", "Using phos-copper on steel (brittle joint)."],
      cards: { tip: T("840°F is the dividing line — memorize it."), analogy: T("Soldering is glue; brazing is a weld-like bond."), example: T("A soft-soldered liquid line joint on an R-410A system failed under head pressure.") },
      check: [q("The temperature that separates soldering from brazing is…", ["840°F", "212°F", "1500°F", "500°F"], "Above 840°F is brazing.")] }),
    S("pressure-test", "🧪", "Pressure testing with nitrogen", ["residential", "commercial", "refrigeration"], {
      intro: T("Proving a system is tight before evacuating saves time and refrigerant."),
      safety: ["Dry nitrogen only — never oxygen or air.", "Always use a regulator; a full cylinder is over 2,000 psi.", "Never exceed the lowest rated component's test pressure (see nameplate)."],
      steps: ["Connect nitrogen through a regulator to the manifold.", "Pressurize slowly to the manufacturer's test pressure.", "Close the valve and record pressure and temperature.", "Wait (e.g., 15–30 minutes or longer) and recheck; temperature changes affect pressure.", "If it drops, find the leak with bubbles or a detector, repair, retest.", "Release nitrogen before evacuation."],
      mistakes: ["No regulator.", "Testing above the low-side rating.", "Ignoring temperature change during the hold."],
      cards: { tip: T("Soap-bubble every joint you made — it's cheap and fast."), analogy: T("Like pumping up a tire and checking it the next morning."), example: T("A 1 psi drop over 30 minutes turned out to be the sun going behind a cloud — temperature matters.") },
      check: [q("Nitrogen should always be used with…", ["A regulator", "An oxygen mix", "A torch", "No valves"], "Cylinder pressure is dangerously high."), q("Test pressure should never exceed…", ["The lowest-rated component's limit", "500 psi", "The tank pressure", "Any value is fine"], "Check nameplates.")] }),
    S("evacuation", "🌀", "Evacuation & micron gauge", ["residential", "commercial", "refrigeration"], {
      intro: T("A deep vacuum removes air and moisture so the system runs clean and efficient."),
      safety: ["Never run a compressor in a deep vacuum.", "Check pump oil — fresh oil pulls faster."],
      steps: ["Remove valve cores with a core tool; use short, large hoses.", "Put the micron gauge at the system end, away from the pump.", "Run the pump until the target (often 500 microns or lower — follow manufacturer).", "Isolate the pump and do a decay test: watch for 10+ minutes.", "If it rises and levels off ≈ moisture (keep pumping); keeps rising ≈ leak.", "Break vacuum with refrigerant, reinstall cores."],
      mistakes: ["Micron gauge at the pump (false good reading).", "Skipping the decay test.", "Old, wet pump oil."],
      cards: { tip: T("Change pump oil every job or two — moisture ruins it."), analogy: T("Boiling water out of the pipes at room temperature — in a deep vacuum, water boils cold."), example: T("Decay test rose to 1,500 microns and stopped — moisture. Another hour of pumping brought it to a stable 400.") },
      check: [q("Where should the micron gauge go?", ["At the system, away from the pump", "On the pump", "On the nitrogen tank", "Anywhere"], "It must read the system, not the pump."), q("A reading that keeps rising after isolation suggests…", ["A leak", "Perfect vacuum", "Too much oil", "Low voltage"], "Steady rise = air getting in.")] }),
    S("recovery", "♻️", "Refrigerant recovery basics", ["residential", "commercial", "refrigeration"], {
      intro: T("Recovery is required by law before opening a system — no venting."),
      safety: ["Gloves and glasses.", "Use a DOT-rated recovery cylinder; never fill above 80% by weight.", "Put the cylinder on a scale."],
      steps: ["Check recovery machine and hoses; label the cylinder for the refrigerant.", "Evacuate the empty recovery cylinder first.", "Connect: system → manifold → recovery machine inlet; machine outlet → cylinder vapor/liquid port.", "Recover liquid first if possible, then vapor.", "Run until the required evacuation level is reached.", "Purge the machine per its instructions, close valves, record pounds recovered."],
      mistakes: ["Mixing refrigerants in one cylinder.", "No scale (overfilling).", "Forgetting the filter on the machine inlet."],
      cards: { tip: T("Chill the recovery cylinder (e.g., in a bucket of ice water) to speed up recovery."), analogy: T("Like siphoning gas into a can — the can has to be the right size and labeled."), example: T("Mixed R-22 and R-410A in one cylinder: now it can't be reclaimed normally and costs extra to destroy.") },
      check: [q("Max fill of a recovery cylinder is…", ["80% by weight", "100%", "50%", "95%"], "Room for expansion."), q("Two different refrigerants in one cylinder…", ["Should never be mixed", "Is fine", "Improves recovery", "Is required"], "Mixed refrigerant is hard to reclaim.")] }),
    S("charging", "🎯", "Charging basics (SH/SC)", ["residential", "commercial", "refrigeration"], {
      intro: T("Charge by the manufacturer's method — usually superheat for fixed orifices, subcooling for TXV/EEV."),
      safety: ["Gloves and glasses.", "Charge blends as liquid, metered slowly into the suction side."],
      steps: ["Verify airflow first: clean filter, coils, correct blower speed.", "Let the system run 10–15 minutes to stabilize.", "Read suction pressure → saturation temp; measure suction line temp → superheat.", "Read liquid pressure → saturation temp; measure liquid line temp → subcooling.", "Compare to the manufacturer's chart (fixed orifice uses indoor wet-bulb and outdoor dry-bulb).", "Adjust in small amounts and wait to restabilize."],
      mistakes: ["Charging before checking airflow.", "Adding refrigerant without finding the leak.", "Vapor-charging a zeotropic blend."],
      cards: { tip: T("Weigh in the charge after a new install, then fine-tune with SH/SC."), analogy: T("Charging is seasoning soup — a little at a time and taste (measure) between."), example: T("Low suction and a frozen coil looked like low charge, but the filter was clogged. New filter fixed it.") },
      check: [q("TXV systems are usually charged by…", ["Subcooling", "Superheat only", "Amp draw", "Sight alone"], "The TXV controls superheat, so subcooling shows charge."), q("Before adding refrigerant, first check…", ["Airflow", "The thermostat color", "Paint", "The breaker brand"], "Airflow problems mimic charge problems.")] }),
    S("thermostat", "🌡️", "Wiring a thermostat", ["residential", "commercial"], {
      intro: T("Most thermostats use low-voltage (24V) control wiring."),
      safety: ["Turn power off at the furnace/air handler — a shorted 24V wire can blow the fuse or board.", "Label wires before removing the old thermostat."],
      steps: ["Power off; take a photo of existing wiring.", "Label each wire (R, C, G, Y, W, O/B).", "Mount the new base level.", "Connect wires to matching terminals: R power, C common, G fan, Y cool, W heat, O/B reversing valve for heat pumps.", "Set the thermostat's system type (conventional or heat pump) in setup.", "Restore power and test each mode."],
      mistakes: ["Wrong O/B setting (heats when calling for cool).", "No C wire for smart thermostats.", "Wiring with power on."],
      cards: { tip: T("Take a photo before you touch anything."), analogy: T("The thermostat wires are like text messages: each wire sends one command."), example: T("A heat pump blew warm air on cooling — the O/B setting was reversed in the thermostat setup.") },
      check: [q("Which terminal controls a heat pump's reversing valve?", ["O/B", "W", "G", "C"], "O energizes in cool, B in heat — depends on brand.")] }),
    S("multimeter", "📟", "Using a multimeter safely", ["residential", "commercial", "refrigeration"], {
      intro: T("Your meter is your most-used diagnostic tool — and a safety device."),
      safety: ["Use a meter and leads rated for the job (CAT III or higher for HVAC equipment).", "Inspect leads for damage.", "Live-dead-live test before trusting a zero reading.", "Never measure resistance or continuity on a live circuit."],
      steps: ["Select the function first (V AC, V DC, Ω, continuity, µF, amps).", "Plug leads into the correct jacks.", "Voltage: probes across the load or from line to line.", "Amps: clamp around ONE conductor.", "Resistance/continuity: power off and isolate the part.", "Record readings and compare to nameplate specs."],
      mistakes: ["Leads in the amps jack while measuring voltage.", "Clamping both wires of a cord (reads zero).", "Measuring ohms on a live circuit."],
      cards: { tip: T("Keep one hand away from the equipment when probing high voltage."), analogy: T("Voltage is pressure in a hose, amps is the flow, ohms is how pinched the hose is."), example: T("Compressor amp draw was double rated load amps — a failing start component.") },
      check: [q("To measure amps with a clamp meter, clamp around…", ["One conductor", "Both conductors", "The ground only", "The whole cord"], "Opposing currents cancel out."), q("Resistance should be measured with power…", ["Off", "On", "Half on", "Doesn't matter"], "Live circuits can damage the meter and you.")] }),
    S("capacitor", "🔋", "Capacitor testing", ["residential", "commercial", "refrigeration"], {
      intro: T("Bad capacitors are one of the most common no-cool causes."),
      safety: ["Power off and LOTO.", "Discharge the capacitor with an insulated resistor tool before handling.", "Never short terminals with a screwdriver."],
      steps: ["Note the rating (e.g., 45/5 µF ±6%, 440V).", "Discharge and remove wires (photo first).", "Set meter to µF and test each section: HERM–C and FAN–C.", "Compare to the rating and tolerance.", "Replace with the same µF and equal or higher voltage rating."],
      mistakes: ["Lower voltage replacement.", "Mixing up HERM and FAN wires.", "Trusting looks over a measurement."],
      cards: { tip: T("Tolerance math: 45 µF ±6% means 42.3–47.7 µF is OK."), analogy: T("A capacitor is a spring that gives the motor a push to start and keeps it rolling."), example: T("A 40 µF section reading 31 µF caused the compressor to hum and trip.") },
      check: [q("Replacement capacitor voltage rating should be…", ["Equal or higher", "Lower", "Any", "Exactly half"], "Lower ratings can fail."), q("HERM on a dual capacitor goes to…", ["The compressor", "The fan", "The thermostat", "Ground"], "HERM = hermetic compressor.")] }),
    S("lineset", "〰️", "Line set installation", ["residential"], {
      intro: T("A clean, well-supported line set is the backbone of a quiet, reliable system."),
      safety: ["Watch for wires and pipes when drilling.", "Ladder and roof safety."],
      steps: ["Plan the shortest practical route; check max length and lift limits from the manufacturer.", "Keep tubes capped until connected.", "Insulate the suction line fully; seal insulation seams.", "Support the line set at regular intervals without crushing insulation.", "Avoid kinks; use proper bending radii.", "Braze with nitrogen purge (or flare to spec), pressure test, evacuate."],
      mistakes: ["Uncapped tubing collecting dirt and moisture.", "Exceeding max length without adjusting charge.", "Uninsulated suction line sweating in the attic."],
      cards: { tip: T("Leave a service loop near the unit for future access."), analogy: T("The line set is the highway; potholes (kinks) and open lanes (uncapped ends) cause trouble."), example: T("Sweating bare suction line dripped through a ceiling — full insulation fixed it.") },
      check: [q("Which line must be fully insulated?", ["Suction line", "Liquid line only", "Neither", "Drain line"], "It's cold and sweats.")] }),
    S("condensate", "💧", "Condensate drain & trap", ["residential", "commercial"], {
      intro: T("AC pulls gallons of water a day from the air. It has to go somewhere safely."),
      safety: ["Install a float/safety switch where required by code.", "Use proper PVC primer and cement in ventilated areas."],
      steps: ["Slope the drain downward (commonly 1/8–1/4 inch per foot — follow code).", "Install a trap on draw-through (negative pressure) units so air isn't sucked in.", "Add a cleanout tee and cap for maintenance.", "Install a secondary pan or float switch as required.", "Pour water in the pan to test flow."],
      mistakes: ["No trap — water won't drain and pan overflows.", "Flat or uphill drain runs.", "No safety switch over finished ceilings."],
      cards: { tip: T("A vented cleanout tee makes flushing algae easy."), analogy: T("The trap is like the U-bend under your sink — water seals out air."), example: T("An untrapped drain on an attic air handler pulled air back and overflowed onto the ceiling.") },
      check: [q("A drain trap on a draw-through unit prevents…", ["Air being pulled in so water drains", "Refrigerant leaks", "Ice", "Electrical shorts"], "Negative pressure holds water in the pan without a trap.")] }),
    S("maintenance", "🧽", "Filter & coil maintenance", ["residential", "commercial", "refrigeration"], {
      intro: T("Most efficiency loss and many breakdowns start with dirt."),
      safety: ["Power off before cleaning coils.", "Use coil cleaners per label; wear gloves and eye protection."],
      steps: ["Replace or clean the filter (note size and MERV).", "Inspect the evaporator for dust; clean carefully.", "Rinse the condenser coil from inside out with low-pressure water.", "Straighten bent fins with a fin comb.", "Check the drain and pan; flush with water.", "Record temperatures and amp draws for the customer."],
      mistakes: ["High-pressure washers flattening fins.", "Spraying electrical parts.", "Forgetting to reinstall panels/filter correctly."],
      cards: { tip: T("Write the filter date on the filter frame with a marker."), analogy: T("A dirty coil is like a winter coat on your AC — it can't get rid of heat."), example: T("Cleaning a cottonwood-clogged condenser dropped head pressure dramatically and fixed nuisance trips.") },
      check: [q("Condenser coils should be rinsed…", ["Inside out, low pressure", "Outside in, high pressure", "With refrigerant", "Never"], "Push dirt out the way it came in.")] }),
    S("ductwork", "📦", "Ductwork basics", ["residential", "commercial"], {
      intro: T("The best equipment fails to comfort if the ducts are wrong."),
      safety: ["Sheet metal edges cut — wear gloves.", "Attic heat and insulation: mask, hydration."],
      steps: ["Know supply vs. return; trunk and branches.", "Seal joints with mastic or listed tape (not plain cloth tape).", "Support flex duct; pull it tight — no sags or kinks.", "Measure static pressure with a manometer and compare to the blower rating.", "Balance airflow with dampers."],
      mistakes: ["Crushed or kinked flex duct.", "Unsealed joints in attics.", "Undersized returns."],
      cards: { tip: T("Total external static pressure is a quick health check for the whole duct system."), analogy: T("Ducts are the lungs; a blocked airway means the system can't breathe."), example: T("A 'bad compressor' call turned out to be a collapsed return duct in the attic.") },
      check: [q("Static pressure is measured with a…", ["Manometer", "Clamp meter", "Micron gauge", "Thermometer"], "Manometers read air pressure in inches of water column.")] })
  ];
})();
