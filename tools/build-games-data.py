"""Build js/games-data.js from /workspace/hvac-research/games-data.json (the textbook-verified research data) plus:
   - ES strings for the few EN-only fields (braze steps/fillers, RTU parts, Boss Rush steps, OEM decay rules)
   - QA corrections: R-454B gauge cases re-derived from Chemours Opteon XL41 P-T data (tools/xl41-chemours.json),
     Boss Rush br02 no longer implies "Rheem = B" without the diagram, heat-pump outdoor wiring (R, O/B, W2/defrost) made explicit.
   - authored game-only content (trap cards, roof-card distractors, leak-tool rules) that paraphrases the cited sources.
   Run: python3 tools/build-games-data.py  (from the hvac-app folder)"""
import json, copy, os
SRC = os.environ.get('GAMES_JSON', '/workspace/hvac-research/games-data.json')
D = json.load(open(SRC)); G = {g['id']: g for g in D['games']}
T = lambda en, es: {'en': en, 'es': es}

# ---------- R-454B: Chemours pressures (dew for suction, bubble for liquid) ----------
X = json.load(open('tools/xl41-chemours.json'))['full']
def chem(F, k): v = X[str(int(F))]; return v[0] if k == 'bubble' else v[1]
for c in G['gauge_reader']['cases']:
    if c['refrigerant'] != 'R-454B': continue
    old = (c['suctionPsig'], c['liquidPsig'])
    c['suctionPsig'] = chem(c['evapSatF_dew'], 'dew'); c['liquidPsig'] = chem(c['condSatF_bubble'], 'bubble')
    ex = c.get('extra', {})
    if 'saturationPsigAt85F' in ex:
        delta = round(ex['offCycleStandingPsig'] - ex['saturationPsigAt85F'], 1)
        ex['saturationPsigAt85F'] = chem(85, 'bubble'); ex['offCycleStandingPsig'] = round(ex['saturationPsigAt85F'] + delta, 1)
    c['ptSource'] = 'chemours_xl41'; c['_was'] = old
    if 'chemours_xl41' not in c['sources']: c['sources'] = [s if s != 'app_pt' else 'chemours_xl41' for s in c['sources']]
D['sources']['chemours_xl41'] = {'title': 'Chemours Opteon XL41 (R-454B) Pressure-Temperature Data (Eng), C-XL41PT-ENG rev 7/23', 'url': 'https://www.opteon.com/en/-/media/files/opteon/eng-xl41-pt-chart-eng-rev-07-23.pdf', 'type': 'manufacturer'}
D['sources']['app_pt']['title'] = "App PT table (js/pt-data.js): R-410A from CoolProp; R-454B from Chemours Opteon XL41 P-T data"
G['gauge_reader']['blendSources'] = ['opteon_xl41', 'chemours_xl41']
G['gauge_reader']['glideNote'] = T('Chemours chart: R-454B glide is about 2.2-2.4 F at A/C temperatures (dew vs bubble).', 'Tabla Chemours: el deslizamiento del R-454B es de unos 2.2-2.4 F a temperaturas de A/C (rocío vs burbuja).')
G['gauge_reader']['conditionsText'] = T('95F outdoor, 80F DB / 67F WB return air, steady after 15 min', '95F exterior, 80F BS / 67F BH en el retorno, estable tras 15 min')
G['gauge_reader']['diagnoses'] = [
  {'id': 'normal', 'name': T('Normal', 'Normal')}, {'id': 'lowCharge', 'name': T('Low charge', 'Falta de carga')}, {'id': 'overcharge', 'name': T('Overcharge', 'Sobrecarga')},
  {'id': 'restriction', 'name': T('Liquid line restriction', 'Restricción en línea de líquido')}, {'id': 'lowAirflow', 'name': T('Low indoor airflow', 'Poco aire interior')},
  {'id': 'dirtyCondenser', 'name': T('Dirty condenser / condenser airflow', 'Condensador sucio / poco aire')}, {'id': 'moreInfo', 'name': T('Suspect non-condensables: need more info', 'Sospecha de no condensables: falta info')}]
AMAP = {'normal': 'normal', 'low charge': 'lowCharge', 'overcharge': 'overcharge', 'liquid line restriction': 'restriction', 'low indoor airflow': 'lowAirflow', 'low indoor airflow (TXV)': 'lowAirflow', 'dirty condenser / condenser airflow': 'dirtyCondenser', 'possible non-condensables (hint)': 'moreInfo'}
PMAP = {'normal': 'normal', 'low charge': 'lowCharge', 'overcharge': 'overcharge', 'liquid line restriction': 'restriction', 'low indoor airflow': 'lowAirflow', 'dirty condenser': 'dirtyCondenser', 'non-condensables (hint)': 'moreInfo'}
for c in G['gauge_reader']['cases']: c['diag'] = AMAP[c['answer']]
for pt in G['gauge_reader']['patterns']: pt['diag'] = PMAP[pt['fault']]

# ---------- Thermostat: trap cards (the scenario "note" mistakes as do/don't calls) + board check boards ----------
TRAPS = {
 ('tw03', 'assumed blue = C without checking the board'): T('Assume the blue wire is C without checking where it lands at the board.', 'Suponer que el cable azul es C sin revisar dónde llega en la tarjeta.'),
 ('tw05', 'C:from heating transformer'): T("Take the thermostat's C from the heating transformer.", 'Tomar el C del termostato del transformador de calor.'),
 ('tw06', 'single-stage A/C, jumper left off at a 2-stage-blower furnace'): T("Single-stage A/C on a furnace whose manual calls for a Y1-Y2 board jumper: leave the jumper off.", 'A/C de una etapa en un horno cuyo manual pide puente Y1-Y2: dejar el puente sin poner.'),
 ('tw10', 'heat pump and furnace heating together'): T('Let the heat pump compressor run while the furnace is heating.', 'Dejar el compresor de la bomba encendido mientras el horno calienta.'),
 ('tw10', 'coil in the return air'): T("Put the heat pump coil in the furnace's return air.", 'Poner el serpentín de la bomba en el retorno del horno.'),
 ('tw11', 'adapter placed between zone panel and equipment'): T('On a zoned system, install the adapter between the zone panel and the equipment.', 'En un sistema por zonas, instalar el adaptador entre el panel de zonas y el equipo.'),
}
for s in G['thermostat_wiring']['scenarios']:
    s['traps'] = []
    for m in s['mistakes']:
        w = m['wrong']; key = (s['id'], w['note']) if 'note' in w else (s['id'], 'C:' + w['C']) if w.get('C') == 'from heating transformer' else None
        if key in TRAPS: s['traps'].append({'q': TRAPS[key], 'explain': m['explain'], 'sources': m['sources']})
tw12 = next(s for s in G['thermostat_wiring']['scenarios'] if s['id'] == 'tw12')
tw12['boards'] = [
 {'id': 'ac', 'unit': T('Straight A/C condenser (basic contactor, no monitor board)', 'Condensador solo frío (contactor básico, sin tarjeta monitora)'), 'diagram': T('Unit diagram: contactor coil, two low-voltage leads.', 'Diagrama: bobina del contactor, dos cables de bajo voltaje.'),
  'need': ['Y', 'C'], 'options': ['R', 'C', 'Y', 'G', 'O/B', 'W2'], 'wrongPick': {'R': 0}, 'sources': ['goodman_gmvc96']},
 {'id': 'hp', 'unit': T('Heat pump outdoor unit with a defrost board', 'Bomba de calor exterior con tarjeta de deshielo'), 'diagram': T('Unit diagram (Carrier-style): R, C, Y, O and W2 (defrost heat output) land here.', 'Diagrama (estilo Carrier): aquí llegan R, C, Y, O y W2 (salida de calor en deshielo).'),
  'need': ['R', 'C', 'Y', 'O/B', 'W2'], 'options': ['R', 'C', 'Y', 'G', 'O/B', 'W2'], 'missing': 1, 'sources': ['carrier_25hpb', 'goodman_gmvc96']}]
G['thermostat_wiring']['settingsLabels'] = {
 'rJumper': T('Rc-Rh jumper', 'Puente Rc-Rh'), 'closed': T('1 wire (closed)', '1 cable (cerrado)'), 'open': T('2 wires (open)', '2 cables (abierto)'),
 'system': T('System', 'Sistema'), 'conventional': T('Conventional', 'Convencional'), 'heatpump': T('Heat pump', 'Bomba de calor'), 'dualfuel': T('Dual fuel', 'Dual'),
 'ob': T('O/B valve', 'Válvula O/B'), 'stages': T('Stages', 'Etapas')}


G['thermostat_wiring']['generic'] = {
 'jumperClosed': {'explain': T('One R wire = jumper/slider closed (1 wire) so Rc and Rh both get 24 V. Open, the side without a wire has no power.', 'Un cable R = puente cerrado (1 cable) para que Rc y Rh tengan 24 V. Abierto, el lado sin cable queda sin energía.'), 'sources': ['honeywell_t6pro_docs', 'ecobee_premium_manual']},
 'systemHP': {'explain': T('This is a heat pump: set the system to Heat pump so Y runs the compressor in heat and cool, O/B drives the reversing valve, and backup heat goes on AUX.', 'Es bomba de calor: elige Bomba de calor para que Y prenda el compresor en frío y calor, O/B mueva la válvula y el respaldo vaya en AUX.'), 'sources': ['honeywell_t6pro_docs', 'honeywell_x7']},
 'systemConv': {'explain': T('Furnace or boiler (with or without A/C) is a conventional system. Set the equipment type to match the equipment.', 'Horno o caldera (con o sin A/C) es sistema convencional. Configura el tipo de equipo igual al equipo.'), 'sources': ['honeywell_t6pro_pdf']},
 'systemDual': {'explain': T('Dual fuel needs a dual-fuel setup with outdoor temperature input, so the thermostat can keep the compressor off while the furnace heats.', 'Dual necesita configuración dual con temperatura exterior, para que el termostato apague el compresor mientras el horno calienta.'), 'sources': ['rheem_dualfuel', 'honeywell_t6pro_pdf']},
 'stages': {'explain': T('Match the equipment setup to the wires: 2 heat / 2 cool only when Y2 and W2 are actually used.', 'Configura igual que los cables: 2 calor / 2 frío solo si se usan Y2 y W2.'), 'sources': ['honeywell_t6pro_pdf', 'goodman_gmvc96']},
 'byLetter': T('Go by the letter the wire came off, not its color.', 'Guíate por la letra de donde salió el cable, no por el color.'),
 'outcomes': {'fuse': T('Transformer fuse pops', 'Se bota el fusible del transformador'), 'heatCallOutdoor': T('Heat call starts the outdoor unit', 'La llamada de calor prende la exterior'), 'onlyFan': T('Only the blower runs', 'Solo corre el soplador'),
   'coldInHeat': T('Heat pump blows cold in heat', 'La bomba sopla frío en calor'), 'nothing': T('Nothing happens', 'No pasa nada'), 'wrong': T('The wrong equipment runs', 'Enciende el equipo equivocado'), 'compOnE': T('Compressor runs on emergency heat', 'El compresor prende en emergencia'),
   'ok': T('System runs right', 'El sistema funciona bien')}}
G['wire_it_up']['generic'] = {
 'wrongLanding': T('{lead} goes to {right}, not {wrong}.', '{lead} va a {right}, no a {wrong}.'),
 'outcomes': {'ok': T('Compressor hums, fan spins', 'El compresor zumba, el ventilador gira'), 'trip': T('Spark, breaker trips', 'Chispa, se bota el breaker'), 'fuse': T('Low-voltage fuse blows', 'Se quema el fusible de bajo voltaje'), 'hum': T('Compressor hums but won\'t start', 'El compresor zumba pero no arranca'), 'nofan': T('Fan won\'t start', 'El ventilador no arranca')}}

# ---------- Wire It Up: trap card ----------
wu04 = next(s for s in G['wire_it_up']['scenarios'] if s['id'] == 'wu04')
wu04['traps'] = [{'q': T('Wire the fan motor by lead color alone.', 'Conectar el motor del ventilador solo por el color de los cables.'), 'explain': wu04['mistakes'][1]['explain'], 'sources': wu04['mistakes'][1]['sources']}]
G['wire_it_up']['leadNames'] = {
 'Y': T('Y (thermostat)', 'Y (termostato)'), 'C': T('C (thermostat)', 'C (termostato)'), 'supply leg 1': T('Supply leg 1', 'Línea 1'), 'supply leg 2': T('Supply leg 2', 'Línea 2'),
 'compressor C': T('Compressor C', 'Compresor C'), 'compressor S': T('Compressor S', 'Compresor S'), 'compressor R': T('Compressor R', 'Compresor R'), 'cap C': T('Cap C', 'Capacitor C'),
 'fan common lead': T('Fan common', 'Ventilador común'), 'fan run lead': T('Fan run', 'Ventilador marcha'), 'fan cap lead': T('Fan cap lead', 'Ventilador a capacitor')}

# ---------- Braze Master: ES ----------
BR = G['braze_master']
STEP_ES = ['Corta a escuadra y escaria', 'Limpia tubo y conexión', 'Saca los obuses / envuelve válvulas', 'Abre el flujo de nitrógeno', 'Calienta primero el tubo', 'Pasa el calor a la copa de la conexión',
 'Fundente claro / rojo cereza opaco', 'Aplica la varilla en la unión, no en la llama', 'La capilaridad jala la aleación', 'Mantén N2 hasta que enfríe', 'Revisa un filete continuo']
BR['stepOrder'] = [T(e[0].upper() + e[1:], s) for e, s in zip(BR['stepOrder'], STEP_ES)]
FES = [('cobre con cobre (forjado)', 'BCuP (fósforo-cobre o plata-fósforo, ej. BCuP-2, BCuP-5)'), ('cobre con latón/bronce', 'BCuP o BAg'), ('cobre con acero/hierro', 'BAg (alta plata)'),
       ('soldadura blanda', 'no permitida (Carrier: nada que funda bajo 800F)'), ('ejemplo de fabricante', 'Goodman IOG-4048A: mínimo 2% de plata, sin fundente (cobre)')]
for r, (je, fe) in zip(BR['fillerRules'], FES): r['joint'] = T(r['joint'], je); r['filler'] = T(r['filler'], fe)
BR['joints'] = [
 {'id': 'cucu', 'name': T('Copper tube to copper fitting', 'Tubo de cobre a conexión de cobre'), 'rule': 0},
 {'id': 'cubrass', 'name': T('Copper tube to brass service valve', 'Tubo de cobre a válvula de servicio de latón'), 'rule': 1, 'valve': True},
 {'id': 'custeel', 'name': T('Copper tube to steel fitting (drier shell)', 'Tubo de cobre a conexión de acero (filtro)'), 'rule': 2}]
BR['fillerCards'] = [
 {'id': 'bcup', 'name': T('BCuP (phos-copper), no flux', 'BCuP (fósforo-cobre), sin fundente'), 'ok': ['cucu']},
 {'id': 'bcupflux', 'name': T('BCuP or BAg + white flux', 'BCuP o BAg + fundente blanco'), 'ok': ['cubrass']},
 {'id': 'bag', 'name': T('BAg (high silver) + flux', 'BAg (alta plata) + fundente'), 'ok': ['custeel', 'cubrass']},
 {'id': 'solder', 'name': T('Soft solder (melts under 800F)', 'Soldadura blanda (funde bajo 800F)'), 'ok': []}]
BR['prep'] = [
 {'id': 'ream', 'name': T('Cut square + ream', 'Cortar a escuadra y escariar'), 'fail': 'dirty'}, {'id': 'clean', 'name': T('Clean tube + fitting', 'Limpiar tubo y conexión'), 'fail': 'dirty'},
 {'id': 'cores', 'name': T('Schrader cores out', 'Obuses fuera'), 'fail': 'valveCooked'}, {'id': 'rag', 'name': T('Wet rag on the valve', 'Trapo húmedo en la válvula'), 'fail': 'valveCooked', 'valveOnly': True}]
BR['n2Band'] = {'min': 2, 'max': 3, 'unit': 'CFH', 'note': T('Harris starting point: 2-3 CFH (about 1.5-2 psi). Follow the unit manual.', 'Punto de partida Harris: 2-3 CFH (1.5-2 psi aprox.). Sigue el manual del equipo.')}

# ---------- Leak Hunter: tool rules per situation (from methods.use/limit), map spots ----------
LH = G['leak_hunter']
LH['situations'] = [
 {'id': 'charged', 'name': T('Running system, still has refrigerant', 'Sistema con refrigerante'), 'ok': ['visual', 'electronic', 'bubbles', 'ultrasonic'],
  'why': {'uvDye': T("Dye only where the OEM allows it; Trane doesn't recommend dyes in the field.", 'Tinte solo si el fabricante lo permite; Trane no lo recomienda en campo.')}},
 {'id': 'n2', 'name': T('New install, holding nitrogen only', 'Instalación nueva, solo nitrógeno'), 'ok': ['bubbles', 'ultrasonic'],
  'why': {'electronic': T("A refrigerant detector can't smell pure nitrogen. Use bubbles, ultrasonic, or the OEM's trace-gas procedure.", 'Un detector de refrigerante no detecta nitrógeno puro. Usa burbujas, ultrasónico o el procedimiento de traza del fabricante.'),
          'visual': T('A fresh install has no oil trail to follow yet.', 'Una instalación nueva aún no deja rastro de aceite.'), 'uvDye': T('No refrigerant/oil is circulating to carry dye, and Trane advises against dye in the field.', 'No circula refrigerante ni aceite para llevar tinte, y Trane no lo recomienda.')}},
 {'id': 'trace', 'name': T('Nitrogen + trace refrigerant (OEM procedure)', 'Nitrógeno + traza de refrigerante (procedimiento del fabricante)'), 'ok': ['electronic', 'bubbles', 'ultrasonic'],
  'why': {'visual': T('A fresh install has no oil trail to follow yet.', 'Una instalación nueva aún no deja rastro de aceite.'), 'uvDye': T("Dye only where the OEM allows it; Trane doesn't recommend dyes in the field.", 'Tinte solo si el fabricante lo permite; Trane no lo recomienda en campo.')}}]
LH['belt'] = ['visual', 'electronic', 'bubbles', 'ultrasonic', 'uvDye']
LH['spotPos'] = {'schrader': [0.12, 0.62], 'serviceValve': [0.2, 0.7], 'flare': [0.33, 0.66], 'rubOut': [0.46, 0.7], 'braze': [0.58, 0.42], 'switches': [0.07, 0.4], 'capTube': [0.27, 0.36], 'evapCoil': [0.84, 0.3]}
LH['gases'] = [{'id': 'n2', 'name': T('Dry nitrogen + regulator', 'Nitrógeno seco + regulador'), 'ok': True}, {'id': 'o2', 'name': T('Oxygen', 'Oxígeno'), 'ok': False}, {'id': 'air', 'name': T('Compressed air', 'Aire comprimido'), 'ok': False}]

# ---------- Vacuum: structured OEM decay rules ----------
VP = G['vacuum_pump_rush']
VP['oemRules'] = [
 {'brand': 'Goodman IOG-4048A', 'target': 500, 'holdMin': 10, 'pass': 1000, 'leakAbove': 2000, 'rule': T('Below 500, isolate 10 min: steady under 1000 = pass; 1000-2000 = moisture or small leak; over 2000 = leak.', 'Bajo 500, aislar 10 min: estable bajo 1000 = pasa; 1000-2000 = humedad o fuga pequeña; más de 2000 = fuga.'), 'source': 'goodman_iog4048'},
 {'brand': 'Trane 18-AC95D1', 'target': 350, 'holdMin': 1, 'pass': 500, 'rule': T('Pull to 350, isolate: must not rise above 500 within 1 minute.', 'Bajar a 350, aislar: no debe subir de 500 en 1 minuto.'), 'source': 'trane_18ac95'},
 {'brand': 'Lennox XC16', 'target': 500, 'holdMin': 20, 'pass': 500, 'rule': T('Must not rise above 500 within 20 minutes after isolation.', 'No debe subir de 500 en 20 minutos tras aislar.'), 'source': 'lennox_xc16'}]
VP['curveNames'] = {'tightDry': T('Pass: tight and dry', 'Pasa: hermético y seco'), 'wet': T('Moisture: levels off', 'Humedad: se estabiliza'), 'leak': T('Leak: keeps climbing', 'Fuga: sigue subiendo')}
VP['curveExplain'] = {'tightDry': T('Small rise, then flat under the OEM limit.', 'Sube poco y se queda plano bajo el límite.'), 'wet': T('Rises then levels off: moisture boiling off. Keep pulling or do a nitrogen sweep.', 'Sube y se estabiliza: humedad evaporándose. Sigue evacuando o barre con nitrógeno.'),
                      'leak': T('Keeps climbing toward atmosphere: a leak. Break with nitrogen, leak test under pressure.', 'Sigue subiendo hacia la atmósfera: fuga. Rompe con nitrógeno y prueba con presión.')}

# ---------- Rooftop: ES air path, hazard art, distractors ----------
RT = G['rooftop_run']
PATH_ES = ['Campana de aire exterior', 'Compuertas exterior/retorno (economizador)', 'Filtros', 'Serpentín evaporador', 'Soplador de suministro', 'Sección de calor (gas o eléctrica; ubicación según modelo)', 'Ducto de suministro']
SHORT = [T('OA hood', 'Campana'), T('Dampers', 'Compuertas'), T('Filters', 'Filtros'), T('Evap coil', 'Evaporador'), T('Blower', 'Soplador'), T('Heat', 'Calor'), T('Supply', 'Suministro')]
RT['rtuAirPathOrder'] = [dict(T(e[0].upper() + e[1:], s), short=sh) for e, s, sh in zip(RT['rtuAirPathOrder'], PATH_ES, SHORT)]
WRONG = {
 'edge6': [T('Keep working; just stay a few feet back from the edge.', 'Sigue trabajando; solo quédate unos pies atrás del borde.'), T('A hard hat and safety glasses are enough.', 'Basta con casco y lentes.')],
 'gi6': [T('Nothing needed if the job takes under 15 minutes.', 'Nada si el trabajo dura menos de 15 minutos.'), T('A designated area with a warning line is enough at that distance.', 'Un área designada con línea de advertencia basta a esa distancia.')],
 'gi15': [T('Fall protection is never needed on a flat roof.', 'Nunca se necesita protección en techo plano.'), T("You can go right to the edge unprotected if you're quick.", 'Puedes ir al borde sin protección si eres rápido.')],
 'skylight': [T("Skylights hold a worker's weight; set your tools on it.", 'Los tragaluces aguantan a un trabajador; pon tus herramientas encima.'), T('Just walk around it carefully; no cover needed.', 'Solo rodéalo con cuidado; no hace falta cubierta.')],
 'ladder': [T("Rails flush with the roof edge so they don't snag.", 'Rieles al ras del borde para que no estorben.'), T('Base as close to the wall as you can get it.', 'Base lo más pegada a la pared posible.')],
 'underLoad': [T('Yes, if you move fast.', 'Sí, si pasas rápido.'), T('Yes, the rigging is rated.', 'Sí, el aparejo está certificado.')],
 'signal': [T('Operator lands it by feel while the crew shouts.', 'El operador la baja al tanteo mientras la cuadrilla grita.'), T('Use whatever hand signals the crew likes.', 'Usa las señas que quiera la cuadrilla.')],
 'powerline': [T('Power lines only matter if the boom touches them.', 'Las líneas solo importan si la pluma las toca.'), T('Fine as long as the boom stays 5 ft away.', 'Bien mientras la pluma quede a 5 ft.')],
 'loto': [T("Turn the thermostat off; that's enough.", 'Apaga el termostato; con eso basta.'), T('Flip the disconnect off; no need to lock or test.', 'Baja el desconectador; no hace falta bloquear ni probar.')],
 'heat': [T('Push through; breaks are for the afternoon.', 'Aguanta; los descansos son para la tarde.'), T('Energy drinks instead of water.', 'Bebidas energéticas en vez de agua.')]}
HAZ = {'edge6': 'edge', 'gi6': 'edge', 'gi15': 'edge', 'skylight': 'skylight', 'ladder': 'ladder', 'underLoad': 'crane', 'signal': 'crane', 'powerline': 'powerline', 'loto': 'box', 'heat': 'sun'}
for c in RT['safetyCards']: c['wrong'] = WRONG[c['id']]; c['hazard'] = HAZ[c['id']]

# ---------- Boss Rush: ES steps + O/B correction ----------
BO = G['boss_rush']
STEPS = {
 'br01': [T('24 V at the contactor coil (Y to C)?', '¿24 V en la bobina del contactor (Y a C)?'), T('Yes and the contactor is pulled in: check line voltage, capacitor, compressor.', 'Sí y el contactor cerró: revisa voltaje de línea, capacitor y compresor.'), T('No: check thermostat Y, the board, and safety switches.', 'No: revisa Y del termostato, la tarjeta y los interruptores de seguridad.')],
 'br02': [T("Check the O/B setting against the unit's diagram (many Rheem/Ruud units use B; most others O).", 'Revisa el ajuste O/B contra el diagrama del equipo (muchos Rheem/Ruud usan B; la mayoría O).'), T('Verify the reversing valve energizes in the right mode.', 'Verifica que la válvula se energice en el modo correcto.')],
 'br03': [T('Airflow first: filter, blower, coil.', 'Primero el aire: filtro, soplador, serpentín.'), T('Then the charge.', 'Luego la carga.')],
 'br04': [T('Look for oil spots.', 'Busca manchas de aceite.'), T('Check the evaporator coil for corrosion.', 'Revisa corrosión en el evaporador.'), T('Check Schrader caps and cores.', 'Revisa tapas y obuses Schrader.'), T('Standing nitrogen test at the OEM pressure.', 'Prueba de nitrógeno a la presión del fabricante.')],
 'br05': [T('Treat it as a leak: break the vacuum with nitrogen.', 'Trátalo como fuga: rompe el vacío con nitrógeno.'), T('Leak test under pressure, repair, re-evacuate.', 'Prueba de fugas con presión, repara y vuelve a evacuar.')]}
for c in BO['calls']: c['steps'] = STEPS[c['id']]
BO['corrections'] = ['br02 step reworded: O/B depends on the unit diagram, not the brand alone (spec do-not-claim rule).']

# ---------- methods oemExamples ES ----------
HOLD = {'goodman_iog4048': T('15 min minimum; relief valve set no higher than 450 psig', '15 min mínimo; válvula de alivio a no más de 450 psig'), 'trane_18ac95': T('bubble-check every braze joint', 'burbujea cada unión soldada'), 'lennox_xc16': T('may add a trace of refrigerant for an electronic detector', 'puede llevar traza de refrigerante para detector electrónico')}
for m in LH['methods']:
    for ex in m.get('oemExamples', []): ex['hold'] = HOLD[ex['source']]

D['version'] = D.get('version', '') + '+app1'
D['corrections'] = ['R-454B gauge pressures re-derived from Chemours XL41 P-T data (app PT table switched from CoolProp to Chemours for R-454B; glide ~2.3 F, was ~2.7 F).',
  'Boss Rush br02: O/B check wording no longer implies Rheem/Ruud always B.', 'Thermostat tw12 board check: heat pump outdoor unit needs R, C, Y, O/B and W2/defrost when its diagram shows them; basic A/C condenser only Y + C.']
out = '/* GENERATED by tools/build-games-data.py from hvac-research/games-data.json (textbook-verified research data) + app corrections. Do not hand-edit. */\nwindow.GAMES_DATA = ' + json.dumps(D, ensure_ascii=False, separators=(',', ':')) + ';\n'
open('js/games-data.js', 'w').write(out)
print('ok', len(out), 'bytes;', [(c['id'], c['_was'], (c['suctionPsig'], c['liquidPsig'])) for c in G['gauge_reader']['cases'] if c['refrigerant'] == 'R-454B'][:3])
