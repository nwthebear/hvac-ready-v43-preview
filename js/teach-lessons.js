/* v53 teaching overlay: conversational steps, videos, recap + checks.
   Attaches LESSONS[id].teach. Storage keys stay guide:<id> / check:guide:<id>. */
(function () {
  const T = (en, es) => ({ en, es: es || en });
  const YT = (id, title, channel, extra) => Object.assign({ id, title, channel, url: "https://www.youtube.com/watch?v=" + id }, extra || {});

  const V = {
    safety: YT("dRzbyWDUZ8o", "HVAC Safety Training for Technicians | Ladders, PPE, Lockout Tagout & More", "HVAC School"),
    cycle3d: YT("p6GXJdRUz9E", "3D How Refrigeration and Air Conditioning Works P1 - Components", "HVAC School"),
    cycleClass: YT("wjeoHrP9Nkg", "Refrigeration Cycle Training Class! Superheat, Subcooling, Saturation, Components, How it Works!", "AC Service Tech LLC"),
    heatPump: YT("G53tTKoakcY", "How A Heat Pump Works - HVAC", "The Engineering Mindset"),
    comfort: YT("dcXkz-sjbRI", "Human Comfort Basics - RSES NATE Prep", "HVAC School"),
    shsc: YT("BT14KanjckQ", "Exactly What is Superheat and Subcooling? Shown on a Live AC Unit!", "AC Service Tech LLC"),
    shExpect: YT("Mhx1-ArBAbA", "How to Calculate Expected Saturation & Superheat on a TXV System", "HVAC School"),
    ducts: YT("eqXR1J-JnRQ", "HVAC System BEFORE and AFTER! Measuring CFM Air Flow Loss, Sealing Ductwork, Measuring Again!", "AC Service Tech LLC"),
    static: YT("fWW-Luadq58", "Check for Ductwork Problems Before Replacing an HVAC Unit! It Won't Function Right Without This!", "AC Service Tech LLC"),
    vent: YT("s2e3VfZBZ6I", "Fined $37,500 for Venting Refrigerant? How to Prevent This!", "AC Service Tech LLC"),
    recover: YT("6F-u55EoMcU", "Refrigerant Recovery Procedure! Including Vacuuming the Hose Setup and Recovery Tank Weight!", "AC Service Tech LLC"),
    bottles: YT("dDwI3CQp84Q", "HVAC Training on Refrigerant Bottles! R-32, R-454B, R-410A, R-22 Disposable Types, Recovery Bottles!", "AC Service Tech LLC"),
    gauges: YT("xTctTHhOgaw", "Connect & Disconnect Refrigerant Gauges! Low Loss Fittings!", "AC Service Tech LLC")
  };

  function attach(id, teach) {
    const g = window.LESSONS[id];
    if (!g) return console.warn("teach: missing lesson", id);
    g.teach = teach;
    if (teach.check) g.check = teach.check;
    if (teach.minutes) g.minutes = teach.minutes;
    g.rewritten = true;
  }

  /* ---------------- Safety ---------------- */
  attach("safety", {
    minutes: 10,
    steps: [
      { kicker: T("Safety first", "La seguridad primero"),
        title: T("This work can hurt you if you rush", "Este trabajo puede lastimarte si tienes prisa"),
        body: [
          T("HVAC mixes electricity, pressure, heat, chemicals, and ladders. None of that is trying to be dramatic — those are just the tools of the job. The techs who last are the ones who slow down for thirty seconds and make the equipment safe before they touch it.",
            "El HVAC mezcla electricidad, presión, calor, químicos y escaleras. No es drama: son las herramientas del oficio. Los técnicos que duran son los que se detienen treinta segundos y dejan el equipo seguro antes de tocarlo.")
        ],
        call: T("You pull up to a no-cool call. The outdoor unit is humming, the homeowner is standing right there, and you want to look fast. That's exactly when people skip the disconnect and get bit.",
          "Llegas a una llamada de 'no enfría'. La unidad de afuera zumba, el cliente está al lado y quieres verte rápido. Ahí es cuando alguien se salta el desconectador y recibe un golpe.")
      },
      { title: T("Electricity: kill it, lock it, then prove it's dead", "Electricidad: córtala, bloquéala y comprueba que está muerta"),
        body: [
          T("Turn the power off at the disconnect — the metal box beside the outdoor unit, or the breaker that feeds the furnace. Then lock it and tag it so nobody 'helps' you by flipping it back on.",
            "Corta la energía en el desconectador — la caja de metal junto a la unidad de afuera, o el breaker del horno. Luego pon candado y etiqueta para que nadie 'ayude' encendiéndolo."),
          T("A switch being off is not proof. Test your meter on something you know is live, test the circuit you just locked out, then test the meter on live again. That's live–dead–live. If you skip the last check, a dead meter can talk you into grabbing a live wire.",
            "Que el switch esté apagado no es prueba. Prueba el medidor en algo que sabes que tiene energía, mide el circuito que bloqueaste, y vuelve a probar el medidor en uno con energía. Eso es vivo–muerto–vivo. Si te saltas el último paso, un medidor muerto te puede hacer agarrar un cable vivo.")
        ],
        visual: "loto",
        analogy: T("A charged capacitor is a stretched rubber band. The motor is off, but the energy is still waiting to snap. Discharge capacitors before you touch the terminals.",
          "Un capacitor cargado es una liga estirada. El motor está apagado, pero la energía sigue lista para soltarse. Descarga los capacitores antes de tocar las terminales.")
      },
      { title: T("Watch a tech walk through real jobsite safety", "Mira a un técnico recorrer la seguridad real en obra"),
        body: [
          T("Bryan Orr at HVAC School covers ladders, PPE, lockout/tagout, and the habits that keep you working. Tap play when you're ready — it won't start by itself.",
            "Bryan Orr de HVAC School cubre escaleras, EPP, bloqueo/etiquetado y los hábitos que te mantienen trabajando. Toca para reproducir: no empieza solo.")
        ],
        video: V.safety
      },
      { title: T("Refrigerant and the jobsite itself", "El refrigerante y la obra"),
        body: [
          T("Liquid refrigerant can frostbite skin and eyes in a blink. Wear glasses and gloves. Most refrigerants are heavier than air, so they can pool in a basement or a closet and push the oxygen out. If you ever feel dizzy in a tight space, get out.",
            "El refrigerante líquido puede quemar la piel y los ojos en un segundo. Usa lentes y guantes. La mayoría son más pesados que el aire, así que se juntan en un sótano o un closet y desplazan el oxígeno. Si te mareas en un espacio cerrado, sal."),
          T("Never pressurize a system with oxygen or compressed air — use dry nitrogen through a regulator. And on roofs and ladders: three points of contact, inspect the ladder, watch the edge. On anything that burns fuel, know where the gas shutoff is and bring a CO detector.",
            "Nunca presurices un sistema con oxígeno o aire comprimido: usa nitrógeno seco con regulador. En techos y escaleras: tres puntos de contacto, revisa la escalera, cuida el borde. Si el equipo quema combustible, ubica la llave de gas y lleva un detector de CO.")
        ],
        call: T("A helper once used shop air to 'see if it holds.' Oil plus air plus pressure is a recipe for a compressor turning into a bomb. Nitrogen only.",
          "Un ayudante usó aire del taller para 'ver si aguanta.' Aceite más aire más presión puede convertir el compresor en una bomba. Solo nitrógeno.")
      }
    ],
    recap: [
      T("Lock out, tag out, then prove it's dead with live–dead–live.", "Bloquea, etiqueta y comprueba que está muerto con vivo–muerto–vivo."),
      T("Capacitors can still bite after the power is off. Discharge them.", "Los capacitores pueden golpear aun sin energía. Descárgalos."),
      T("Glasses and gloves for refrigerant. Nitrogen only for pressure tests — never oxygen or air.", "Lentes y guantes con refrigerante. Solo nitrógeno para pruebas de presión, nunca oxígeno ni aire."),
      T("Refrigerant can displace oxygen in low, tight spaces. Fuel equipment needs a CO detector.", "El refrigerante puede desplazar oxígeno en espacios bajos. El equipo de combustión pide un detector de CO.")
    ],
    check: [
      { q: T("You're about to open an electrical panel on a no-cool call. What's the right order?", "Vas a abrir un panel eléctrico en una llamada de 'no enfría'. ¿Cuál es el orden correcto?"),
        a: [T("Lock the disconnect, tag it, then live–dead–live on your meter", "Bloquea el desconectador, etiquétalo y haz vivo–muerto–vivo con el medidor"), T("Flip the thermostat off and start probing", "Apaga el termostato y empieza a medir"), T("Shut the disconnect but skip the meter — it's obviously off", "Cierra el desconectador y sáltate el medidor, se ve apagado"), T("Leave it running so you can see the voltages", "Déjalo encendido para ver los voltajes")],
        c: 0, why: T("The disconnect can fail, and a dead meter can lie. Live–dead–live is how you prove the circuit is safe.", "El desconectador puede fallar y un medidor muerto puede mentir. Vivo–muerto–vivo es cómo pruebas que el circuito es seguro.") },
      { q: T("A helper wants to pressurize a system with shop air to find a leak. You should:", "Un ayudante quiere presurizar el sistema con aire del taller para buscar una fuga. Tú debes:"),
        a: [T("Stop them. Use dry nitrogen through a regulator.", "Detenerlo. Usa nitrógeno seco con regulador."), T("Let them, but only to 20 psig", "Dejarlo, pero solo a 20 psig"), T("Use oxygen — it's cleaner", "Usar oxígeno, está más limpio"), T("Add a little refrigerant so the air mixes", "Meter un poco de refrigerante para que se mezcle")],
        c: 0, why: T("Air or oxygen mixed with oil under pressure can explode. Dry nitrogen is the only safe pressure-test gas.", "Aire u oxígeno con aceite bajo presión puede explotar. El nitrógeno seco es el único gas seguro para esa prueba.") },
      { q: T("Why do we worry about refrigerant in a basement or crawlspace?", "¿Por qué nos preocupa el refrigerante en un sótano o un crawlspace?"),
        a: [T("It's usually heavier than air and can push oxygen out of a low space", "Suele ser más pesado que el aire y puede desplazar el oxígeno en un espacio bajo"), T("It always explodes if it touches water", "Siempre explota si toca agua"), T("It makes the space too cold to work", "Deja el espacio demasiado frío para trabajar"), T("It trips every smoke detector", "Hace saltar todos los detectores de humo")],
        c: 0, why: T("Most refrigerants sink and can asphyxiate you in a tight, low area. If you feel off, leave.", "La mayoría de los refrigerantes se hunden y pueden asfixiarte en un área baja y cerrada. Si te sientes mal, sal.") }
    ]
  });

  /* ---------------- Cycle ---------------- */
  attach("cycle", {
    minutes: 12,
    steps: [
      { kicker: T("The big idea", "La idea grande"),
        title: T("Your air conditioner is a heat mover, not a 'cold maker'", "El aire acondicionado mueve calor; no 'fabrica frío'"),
        body: [
          T("Cooling feels like magic until you see the trick. The system doesn't create cold. It grabs heat from the air inside the house and dumps that heat outside. What's left behind feels cool.",
            "Enfriar parece magia hasta que ves el truco. El sistema no crea frío. Toma calor del aire de adentro de la casa y lo tira afuera. Lo que queda se siente fresco."),
          T("The same idea as sweat: when sweat evaporates off your skin, it takes heat with it and you feel cooler. Refrigerant does that evaporating job on purpose, inside a coil, over and over.",
            "Es la misma idea que el sudor: cuando el sudor se evapora de tu piel, se lleva calor y te sientes más fresco. El refrigerante hace esa evaporación a propósito, dentro de un serpentín, una y otra vez.")
        ],
        analogy: T("A sponge doesn't 'make dry.' It soaks up water in one place and you wring it out somewhere else. The refrigeration cycle soaks up heat indoors and wrings it out outdoors.",
          "Una esponja no 'fabrica sequedad.' Absorbe agua en un sitio y la exprime en otro. El ciclo absorbe calor adentro y lo exprime afuera.")
      },
      { title: T("Four parts, one loop", "Cuatro partes, un circuito"),
        body: [
          T("Refrigerant rides a loop through four parts. The compressor is the pump. The condenser (the outdoor coil) dumps heat and turns the refrigerant into a high-pressure liquid. A metering device (a TXV or a piston) drops the pressure. The evaporator (the indoor coil) lets that cold, low-pressure refrigerant boil and soak up heat from the house air.",
            "El refrigerante recorre un circuito de cuatro partes. El compresor es la bomba. El condensador (el serpentín de afuera) suelta calor y convierte el refrigerante en líquido de alta presión. Un dispositivo de expansión (TXV o pistón) baja la presión. El evaporador (el serpentín de adentro) deja que ese refrigerante frío y de baja presión hierva y absorba el calor del aire de la casa.")
        ],
        visual: "cycle"
      },
      { title: T("Watch the cycle in 3D", "Mira el ciclo en 3D"),
        body: [
          T("This HVAC School animation walks the refrigerant through the parts so you can see pressure, temperature, and the vapor-to-liquid change. Tap when you want it — it stays off until you do.",
            "Esta animación de HVAC School recorre las partes para que veas presión, temperatura y el cambio de vapor a líquido. Toca cuando quieras: no arranca solo.")
        ],
        video: V.cycle3d
      },
      { title: T("Why the pressure change matters", "Por qué importa el cambio de presión"),
        body: [
          T("Raise the pressure and a liquid boils at a higher temperature. Lower the pressure and it boils colder. That's the whole game. We keep evaporator pressure low so the refrigerant boils colder than the room. We keep condenser pressure high so it condenses hotter than the outdoor air — otherwise it couldn't dump heat outside on a 95° day.",
            "Si subes la presión, un líquido hierve a más temperatura. Si la bajas, hierve más frío. Ese es todo el juego. Mantenemos baja la presión del evaporador para que hierva más frío que el cuarto. Mantenemos alta la del condensador para que condense más caliente que el aire de afuera: si no, no podría tirar calor un día de 95 °F.")
        ],
        call: T("On a 95° afternoon the outdoor coil has to be warmer than 95° or heat won't leave. That's why the high side runs hot. If the outdoor fan is dead, that heat has nowhere to go and pressures climb.",
          "En una tarde de 95 °F el serpentín de afuera tiene que estar más caliente que 95, o el calor no sale. Por eso el lado alto corre caliente. Si el ventilador de afuera está muerto, ese calor no tiene a dónde ir y las presiones suben.")
      }
    ],
    recap: [
      T("AC moves heat from inside to outside. It doesn't manufacture cold.", "El AC mueve calor de adentro hacia afuera. No fabrica frío."),
      T("Four parts: compressor, condenser, metering device, evaporator.", "Cuatro partes: compresor, condensador, dispositivo de expansión, evaporador."),
      T("Low pressure in the evaporator = boils cold and soaks up indoor heat.", "Baja presión en el evaporador = hierve frío y absorbe el calor de adentro."),
      T("High pressure in the condenser = condenses hot and dumps heat outside.", "Alta presión en el condensador = condensa caliente y tira el calor afuera.")
    ],
    check: [
      { q: T("A homeowner says 'the AC is making cold air.' The more accurate way to say it is:", "El cliente dice 'el AC está fabricando aire frío.' La forma más precisa es:"),
        a: [T("It's moving heat out of the house and dumping it outside", "Está sacando calor de la casa y tirándolo afuera"), T("It's creating extra cold particles in the supply vents", "Está creando partículas frías extra en las rejillas"), T("The compressor manufactures liquid ice", "El compresor fabrica hielo líquido"), T("The filter turns warm air into cold air", "El filtro convierte el aire caliente en frío")],
        c: 0, why: T("The cycle is a heat mover. Indoor air feels cooler because heat was carried away by boiling refrigerant.", "El ciclo es un movedor de calor. El aire de adentro se siente más fresco porque el refrigerante hirviendo se llevó el calor.") },
      { q: T("Which part drops the refrigerant's pressure so it can boil cold indoors?", "¿Qué parte baja la presión del refrigerante para que pueda hervir frío adentro?"),
        a: [T("The metering device (TXV or piston)", "El dispositivo de expansión (TXV o pistón)"), T("The filter drier", "El filtro deshidratador"), T("The condenser fan", "El ventilador del condensador"), T("The thermostat", "El termostato")],
        c: 0, why: T("The metering device is the pressure drop. After it, refrigerant is cold enough to boil in the evaporator and absorb heat.", "El dispositivo de expansión es la caída de presión. Después, el refrigerante está lo bastante frío para hervir en el evaporador y absorber calor.") },
      { q: T("It's 95°F outside and the outdoor fan isn't running. What happens?", "Hace 95 °F afuera y el ventilador exterior no corre. ¿Qué pasa?"),
        a: [T("Heat can't leave the condenser, so high-side pressure climbs", "El calor no puede salir del condensador, y sube la presión del lado alto"), T("The evaporator automatically makes more cold", "El evaporador automáticamente hace más frío"), T("Nothing — the compressor doesn't need a fan", "Nada: el compresor no necesita ventilador"), T("Only the indoor humidity changes", "Solo cambia la humedad de adentro")],
        c: 0, why: T("The condenser has to be hotter than outdoor air to dump heat. No fan means that heat stacks up as pressure.", "El condensador debe estar más caliente que el aire de afuera para tirar calor. Sin ventilador, ese calor se acumula como presión.") }
    ]
  });


  /* ---------------- Science (heat, P/T, superheat) ---------------- */
  attach("science", {
    minutes: 14,
    steps: [
      { kicker: T("How heat moves", "Cómo se mueve el calor"),
        title: T("Heat is a traveler. It always walks downhill.", "El calor es un viajero. Siempre camina cuesta abajo."),
        body: [
          T("Heat goes from warmer to cooler. Always. It can walk through a solid (conduction), ride along with moving air or water (convection), or jump across space as infrared (radiation). Your coils use the first two every time they run: heat conducts through copper or aluminum, then airflow carries it away.",
            "El calor va de lo más caliente a lo más frío. Siempre. Puede caminar por un sólido (conducción), irse con aire o agua en movimiento (convección) o saltar por el espacio como infrarrojo (radiación). Tus serpentines usan las dos primeras cada vez que corren: el calor conduce por el cobre o el aluminio y el flujo de aire se lo lleva.")
        ],
        visual: "heat"
      },
      { title: T("Sensible vs. latent — the heat you feel and the heat you don't", "Sensible vs. latente: el calor que sientes y el que no"),
        body: [
          T("Sensible heat changes the number on a thermometer. Latent heat changes a substance's state — liquid to vapor, or vapor to liquid — without changing its temperature. Boiling a pot of water at 212°F takes a huge amount of energy, and the pot stays at 212 until the water is gone.",
            "El calor sensible cambia el número del termómetro. El calor latente cambia el estado — de líquido a vapor, o de vapor a líquido — sin cambiar la temperatura. Hervir una olla a 212 °F toma muchísima energía, y la olla se queda en 212 hasta que se acaba el agua."),
          T("That's why refrigerant is so good at moving comfort. Most of the heat it carries is latent heat, absorbed while it boils in the evaporator and released while it condenses outside. Indoor AC also wrings moisture out of the air — that's latent cooling, and it's why the drain line drips.",
            "Por eso el refrigerante es tan bueno moviendo confort. La mayor parte del calor que carga es latente: lo absorbe al hervir en el evaporador y lo suelta al condensar afuera. El AC también saca humedad del aire — eso es enfriamiento latente, y por eso gotea el drenaje.")
        ],
        video: V.comfort,
        analogy: T("Sweat cooling your skin is latent heat at work: the liquid leaves, and it takes energy with it. The evaporator is a professional sweater.",
          "El sudor enfriando tu piel es calor latente: el líquido se va y se lleva energía. El evaporador es un sudor profesional.")
      },
      { title: T("Pressure and boiling point are dance partners", "La presión y el punto de ebullición bailan juntos"),
        body: [
          T("A pressure cooker boils water hotter than 212°F because the lid raises the pressure. Lower the pressure — like at high altitude — and water boils cooler. Refrigerant is chosen so that, at the pressures we run, it boils around 40°F in the evaporator and condenses well above the outdoor temperature.",
            "Una olla a presión hierve el agua a más de 212 °F porque la tapa sube la presión. Si bajas la presión — como en la montaña — el agua hierve más fria. El refrigerante se elige para que, a nuestras presiones, hierva cerca de 40 °F en el evaporador y condense por encima de la temperatura de afuera.")
        ],
        visual: "pt"
      },
      { title: T("Superheat and subcooling are how you 'see' the refrigerant", "El sobrecalentamiento y el subenfriamiento son cómo 'ves' el refrigerante"),
        body: [
          T("When liquid and vapor sit together, pressure and temperature are locked — that's saturation. A P/T chart (or a digital gauge) turns your pressure reading into a saturation temperature.",
            "Cuando hay líquido y vapor juntos, presión y temperatura están unidas — eso es saturación. Una tabla P/T (o un manómetro digital) convierte tu presión en temperatura de saturación."),
          T("Once all the liquid has boiled off, any extra heat raises the vapor's temperature. That extra is superheat: suction line temperature minus evaporator saturation temperature. A little superheat means the compressor is getting vapor, not slugging liquid.",
            "Cuando ya hirvió todo el líquido, el calor extra sube la temperatura del vapor. Eso es sobrecalentamiento: temperatura de la línea de succión menos la saturación del evaporador. Un poco de sobrecalentamiento significa que el compresor recibe vapor, no un golpe de líquido."),
          T("Subcooling is the opposite on the high side: condenser saturation temperature minus liquid line temperature. It tells you a solid column of liquid is feeding the metering device — not flash gas.",
            "El subenfriamiento es lo contrario en el lado alto: saturación del condensador menos temperatura de la línea de líquido. Te dice que una columna sólida de líquido alimenta el expansor, no gas flash.")
        ],
        video: V.shsc,
        call: T("R-410A suction at about 118 psig is roughly 40°F saturation. Suction line reads 50°F. Superheat is 10°. Write it as: line temp minus sat temp.",
          "R-410A a unos 118 psig es más o menos 40 °F de saturación. La succión lee 50 °F. El sobrecalentamiento es 10°. Escríbelo: temp de línea menos temp de saturación.")
      }
    ],
    recap: [
      T("Heat always flows from hot to cold, by conduction, convection, or radiation.", "El calor siempre va de caliente a frío, por conducción, convección o radiación."),
      T("Sensible heat changes temperature. Latent heat changes state — that's most of what refrigerant carries.", "El calor sensible cambia la temperatura. El latente cambia el estado — y es la mayor parte de lo que carga el refrigerante."),
      T("Higher pressure = higher boiling point. That's why the two sides of the system run at different pressures.", "Más presión = más alto el punto de ebullición. Por eso los dos lados corren a presiones distintas."),
      T("Superheat = suction line temp − sat temp. Subcooling = sat temp − liquid line temp.", "Sobrecalentamiento = temp de succión − temp de saturación. Subenfriamiento = temp de saturación − temp de líquido.")
    ],
    check: [
      { q: T("A coil is sweating and the drain is dripping. That moisture leaving the air is mostly:", "El serpentín suda y el drenaje gotea. Esa humedad que sale del aire es sobre todo:"),
        a: [T("Latent heat being removed as water vapor condenses", "Calor latente que se quita al condensar el vapor de agua"), T("Sensible heat only — the thermometer just dropped", "Solo calor sensible: bajó el termómetro"), T("Radiation from the thermostat", "Radiación del termostato"), T("The filter absorbing BTUs", "El filtro absorbiendo BTUs")],
        c: 0, why: T("Condensing water out of the air is a state change, so it's latent cooling. The room also gets sensible cooling as the air temperature falls.", "Condensar agua del aire es un cambio de estado, así que es enfriamiento latente. El cuarto también recibe enfriamiento sensible cuando baja la temperatura del aire.") },
      { q: T("Suction pressure is 118 psig on R-410A (about 40°F sat) and the suction line is 50°F. Superheat is:", "La succión es 118 psig en R-410A (unos 40 °F sat) y la línea está a 50 °F. El sobrecalentamiento es:"),
        a: [T("10°F", "10 °F"), T("40°F", "40 °F"), T("90°F", "90 °F"), T("118°F", "118 °F")],
        c: 0, why: T("Superheat is line temperature minus saturation temperature: 50 − 40 = 10°F.", "El sobrecalentamiento es temperatura de línea menos saturación: 50 − 40 = 10 °F.") },
      { q: T("Why does the condenser need to run hotter than the outdoor air?", "¿Por qué el condensador tiene que estar más caliente que el aire de afuera?"),
        a: [T("Heat only leaves if the coil is warmer than the air around it", "El calor solo sale si el serpentín está más caliente que el aire que lo rodea"), T("So the compressor has something to do", "Para que el compresor tenga algo que hacer"), T("To keep the evaporator from freezing, always", "Para que el evaporador no se congele, siempre"), T("It doesn't — colder is more efficient", "No hace falta: más frío es más eficiente")],
        c: 0, why: T("Heat flows hot to cold. High-side pressure is raised so the refrigerant is hot enough to dump heat into 95° air.", "El calor va de caliente a frío. Se sube la presión del lado alto para que el refrigerante esté lo bastante caliente y suelte calor a un aire de 95 °F.") }
    ]
  });

  /* ---------------- Airflow (new) ---------------- */
  window.LESSONS.airflow = window.LESSONS.airflow || {
    module: "hvac101", icon: "💨", minutes: 10,
    title: T("Airflow: the other half of comfort", "Flujo de aire: la otra mitad del confort"),
    intro: T("If the air isn't moving, the best refrigeration cycle in the world can't do its job.", "Si el aire no se mueve, el mejor ciclo de refrigeración del mundo no puede hacer su trabajo.")
  };
  attach("airflow", {
    minutes: 10,
    steps: [
      { kicker: T("Airflow", "Flujo de aire"),
        title: T("The refrigerant can't work if the air isn't moving", "El refrigerante no puede trabajar si el aire no se mueve"),
        body: [
          T("Every coil is a meeting place: refrigerant on one side, air on the other. If you starve the coil of air — a dirty filter, crushed return, closed supply vents — the heat has no ride. Indoor coils ice up. Outdoor coils overheat. Pressures go weird, and a tired tech starts adding refrigerant to a system that was just thirsty for air.",
            "Cada serpentín es un punto de encuentro: refrigerante de un lado, aire del otro. Si le quitas aire — filtro sucio, retorno aplastado, rejillas cerradas — el calor no tiene transporte. El serpentín de adentro se hiela. El de afuera se sobrecalienta. Las presiones se ponen raras, y un técnico cansado empieza a agregar refrigerante a un sistema que solo tenía sed de aire.")
        ],
        analogy: T("It's like trying to cool a pot of soup with the lid glued shut and no fan. The coil is the pot. Airflow is the breeze.",
          "Es como querer enfriar una sopa con la tapa pegada y sin ventilador. El serpentín es la olla. El flujo de aire es la brisa.")
      },
      { title: T("Follow the air through a furnace or air handler", "Sigue el aire por un horno o un manejador"),
        body: [
          T("Room air is pulled through a return grille, through a filter, into the blower, across a heat exchanger or cooling coil, and pushed out the supply ducts to the rooms. If any step is blocked, the whole comfort system suffers. A rule of thumb you'll hear is about 350–400 CFM of air per ton of cooling — enough air to let the coil do both sensible and latent work.",
            "El aire del cuarto entra por la rejilla de retorno, pasa el filtro, llega al soplador, cruza el intercambiador o el serpentín de frío, y sale por los ductos de suministro a las habitaciones. Si un paso está tapado, todo el confort se resiente. Una regla que vas a oír es unos 350–400 CFM de aire por tonelada de frío: suficiente para que el serpentín haga trabajo sensible y latente.")
        ],
        visual: "airflow"
      },
      { title: T("See what leaky ducts do to real airflow", "Mira lo que hacen los ductos con fugas al flujo real"),
        body: [
          T("Craig Migliaccio at AC Service Tech measures CFM, seals the ducts, and measures again. It's the nicest way to learn why 'the unit is new but the house still feels bad' is often a duct problem, not a refrigerant problem. Tap to watch.",
            "Craig Migliaccio de AC Service Tech mide CFM, sella los ductos y vuelve a medir. Es una buena forma de ver por qué 'el equipo es nuevo pero la casa se siente mal' muchas veces es un problema de ductos, no de refrigerante. Toca para verlo.")
        ],
        video: V.ducts
      },
      { title: T("Static pressure is the 'blood pressure' of the ducts", "La presión estática es la 'presión arterial' de los ductos"),
        body: [
          T("We measure how hard the blower is pushing and pulling, in inches of water column, with a manometer. Too much total external static pressure usually means a restriction: dirty filter, undersized return, a coil caked with dust, or supply runs that are too small. Before you change a charge, ask: is the air moving like the manufacturer designed it to?",
            "Medimos qué tan fuerte empuja y jala el soplador, en pulgadas de columna de agua, con un manómetro. Demasiada presión estática externa total casi siempre es una restricción: filtro sucio, retorno pequeño, un serpentín lleno de polvo, o suministros demasiado estrechos. Antes de tocar la carga, pregunta: ¿el aire se mueve como lo diseñó el fabricante?")
        ],
        call: T("A house 'needs a new system' — until someone opens the filter slot and finds a filter that looks like a throw rug. New air, old charge, happy customer.",
          "Una casa 'necesita equipo nuevo' — hasta que alguien abre el filtro y encuentra uno que parece un tapete. Aire nuevo, carga vieja, cliente feliz.")
      }
    ],
    recap: [
      T("Air and refrigerant have to meet at the coil. Starve one, and the other looks 'broken.'", "El aire y el refrigerante deben encontrarse en el serpentín. Si le quitas uno, el otro parece 'descompuesto.'"),
      T("Path: return → filter → blower → coil or heat exchanger → supply → rooms.", "Ruta: retorno → filtro → soplador → serpentín o intercambiador → suministro → habitaciones."),
      T("A common cooling target is about 350–400 CFM per ton, if the manufacturer agrees.", "Un objetivo común de frío es unos 350–400 CFM por tonelada, si el fabricante está de acuerdo."),
      T("High static pressure usually means a restriction. Check air before you add charge.", "La presión estática alta casi siempre es una restricción. Revisa el aire antes de agregar carga.")
    ],
    check: [
      { q: T("An indoor coil is icing on a 75° day. A smart first check is:", "El serpentín de adentro se hiela en un día de 75 °F. Una primera revisión inteligente es:"),
        a: [T("Airflow — dirty filter, blocked return, or a weak blower", "Flujo de aire: filtro sucio, retorno tapado o soplador débil"), T("Immediately add two pounds of refrigerant", "Agregar de inmediato dos libras de refrigerante"), T("Bypass the float switch and keep running", "Saltar el switch de flotador y seguir corriendo"), T("Turn the fan to 'auto' and leave", "Poner el ventilador en 'auto' y irte")],
        c: 0, why: T("Low airflow lets evaporator pressure (and temperature) fall until the coil ices. Fix the air before you guess at a charge.", "El poco aire deja que la presión (y la temperatura) del evaporador bajen hasta helarse. Arregla el aire antes de adivinar la carga.") },
      { q: T("Total external static pressure is much higher than the furnace nameplate. That usually means:", "La presión estática externa total está mucho más alta que la placa del horno. Eso casi siempre significa:"),
        a: [T("The ducts or filter are restricting the blower", "Los ductos o el filtro están restringiendo el soplador"), T("The refrigerant is overcharged", "El refrigerante está sobrecargado"), T("The thermostat is set too low", "El termostato está demasiado bajo"), T("The gas pressure is high", "La presión de gas está alta")],
        c: 0, why: T("Static is the duct system's resistance. High numbers point to a restriction on the air side, not the gas valve.", "La estática es la resistencia del sistema de ductos. Números altos apuntan a una restricción de aire, no a la válvula de gas.") },
      { q: T("Why do we care about CFM per ton?", "¿Por qué nos importa el CFM por tonelada?"),
        a: [T("The coil needs enough air to transfer heat and to dehumidify", "El serpentín necesita bastante aire para transferir calor y deshumidificar"), T("It's only a sales number", "Es solo un número de ventas"), T("It sets the refrigerant type", "Define el tipo de refrigerante"), T("It replaces a pressure reading", "Reemplaza una lectura de presión")],
        c: 0, why: T("Too little air and the coil gets too cold, ices, and does a poor job with both temperature and humidity.", "Con poco aire el serpentín se pone demasiado frío, se hiela y hace mal el trabajo de temperatura y humedad.") }
    ]
  });
  (function () {
    const g = window.GUIDE_GROUPS && window.GUIDE_GROUPS.find(x => x.id === "basics");
    if (g && g.guides.indexOf("airflow") < 0) {
      const i = g.guides.indexOf("science");
      g.guides.splice(i >= 0 ? i + 1 : g.guides.length, 0, "airflow");
    }
  })();

  /* ---------------- CHP-5 fundamentals ---------------- */
  attach("ch5", {
    minutes: 14,
    steps: [
      { kicker: T("CHP-5 fundamentals", "Fundamentos CHP-5"),
        title: T("Same physics, with an exam's vocabulary", "La misma física, con el vocabulario de un examen"),
        body: [
          T("The CHP-5 HVAC Fundamentals exam leans on this chapter of ideas: how heat moves, sensible vs. latent, the pressure–temperature relationship, and how techs use those to read a system. You've already met them. Here we tighten the wording and walk a service call the way a test item might.",
            "El examen de Fundamentos CHP-5 se apoya en estas ideas: cómo se mueve el calor, sensible vs. latente, la relación presión–temperatura, y cómo un técnico las usa para leer un sistema. Ya las conociste. Aquí afinamos el lenguaje y recorremos una llamada como podría verse en una pregunta.")
        ]
      },
      { title: T("Three ways heat moves, on the equipment you actually touch", "Tres formas en que se mueve el calor, en el equipo que sí tocas"),
        body: [
          T("Conduction is metal-to-metal and metal-to-refrigerant inside a coil or a heat exchanger. Convection is the air (or water) sweeping that heat away — the blower, the outdoor fan, a pump. Radiation is the quiet one: a hot furnace cabinet warming a closet, or the sun loading a west wall. Questions like to mix these, so name the path, not just the word.",
            "La conducción es metal con metal y metal con refrigerante dentro de un serpentín o un intercambiador. La convección es el aire (o el agua) llevándose ese calor: el soplador, el ventilador de afuera, una bomba. La radiación es la callada: un gabinete de horno calentando un closet, o el sol cargando una pared oeste. Las preguntas suelen mezclarlas, así que nombra el camino, no solo la palabra.")
        ],
        visual: "heat"
      },
      { title: T("Saturation is the handshake between pressure and temperature", "La saturación es el apretón de manos entre presión y temperatura"),
        body: [
          T("Inside a coil that's boiling or condensing, liquid and vapor share the space. At that point, each pressure has one matching temperature. That's why a P/T chart works, and why we talk about 'suction saturation' instead of bragging about a raw psi number. The psi only means something once you know the refrigerant and convert it.",
            "Dentro de un serpentín que hierve o condensa, conviven líquido y vapor. En ese punto, cada presión tiene una sola temperatura. Por eso funciona la tabla P/T, y por eso hablamos de 'saturación de succión' en vez de presumir un psi crudo. El psi solo significa algo cuando sabes el refrigerante y lo conviertes.")
        ],
        visual: "pt",
        call: T("Two techs argue about '118 pounds.' One is on R-410A (~40°F sat). One is thinking R-22. Same needle, totally different story. Convert first.",
          "Dos técnicos discuten por '118 libras.' Uno está en R-410A (~40 °F sat). El otro piensa en R-22. La misma aguja, otra historia. Primero convierte.")
      },
      { title: T("A short, field-tight way to expect superheat", "Una forma breve y de campo para esperar el sobrecalentamiento"),
        body: [
          T("On a typical TXV air conditioner, suction saturation often lands about 30–35°F below the return air, and the valve tries to hold something like 8–12° of superheat. HVAC School walks the arithmetic on a real return-air reading. Tap when you're ready.",
            "En un aire acondicionado típico con TXV, la saturación de succión suele quedar unos 30–35 °F por debajo del aire de retorno, y la válvula intenta mantener algo como 8–12° de sobrecalentamiento. HVAC School hace la cuenta con una lectura real de retorno. Toca cuando quieras.")
        ],
        video: V.shExpect
      }
    ],
    recap: [
      T("Name the heat path: conduction through metal, convection with air or water, radiation across space.", "Nombra el camino del calor: conducción por el metal, convección con aire o agua, radiación por el espacio."),
      T("Sensible changes the thermometer. Latent changes state — boiling, condensing, and dehumidifying.", "Lo sensible cambia el termómetro. Lo latente cambia el estado: hervir, condensar y deshumidificar."),
      T("At saturation, pressure and temperature are locked. Convert psi with a P/T chart before you judge it.", "En saturación, presión y temperatura van unidas. Convierte el psi con una tabla P/T antes de juzgarlo."),
      T("Superheat protects the compressor (vapor only). Subcooling confirms a full column of liquid to the metering device.", "El sobrecalentamiento protege el compresor (solo vapor). El subenfriamiento confirma una columna llena de líquido hacia el expansor.")
    ],
    check: [
      { q: T("A test item says heat travels through the copper tube wall into the refrigerant. That's:", "Una pregunta dice que el calor viaja por la pared del tubo de cobre hacia el refrigerante. Eso es:"),
        a: [T("Conduction", "Conducción"), T("Only radiation", "Solo radiación"), T("A latent-heat pump with no temperature difference", "Una bomba de calor latente sin diferencia de temperatura"), T("Convection inside the copper itself", "Convección dentro del cobre")],
        c: 0, why: T("Heat moving through a solid, from the tube wall into the refrigerant at the metal, is conduction.", "El calor que se mueve por un sólido, de la pared del tubo al refrigerante en el metal, es conducción.") },
      { q: T("You should convert a suction pressure to saturation temperature before you decide if it's 'right' because:", "Debes convertir la presión de succión a temperatura de saturación antes de decidir si está 'bien' porque:"),
        a: [T("The same psig means different temperatures on different refrigerants", "El mismo psig significa distintas temperaturas según el refrigerante"), T("Gauges only read in Celsius", "Los manómetros solo leen en Celsius"), T("Saturation is always 32°F", "La saturación siempre es 32 °F"), T("The EPA requires it on every invoice", "La EPA lo exige en cada factura")],
        c: 0, why: T("P/T is refrigerant-specific. 118 psig is a comfortable evaporating temperature on R-410A and a very different story on another blend.", "La P/T es específica del refrigerante. 118 psig es una evaporación cómoda en R-410A y otra historia en otra mezcla.") },
      { q: T("A TXV is holding about 10° of superheat. That mainly tells you:", "Una TXV mantiene unos 10° de sobrecalentamiento. Eso te dice sobre todo:"),
        a: [T("Vapor — not liquid — is leaving the evaporator toward the compressor", "Vapor — no líquido — está saliendo del evaporador hacia el compresor"), T("The condenser is iced over", "El condensador está helado"), T("The filter is brand new", "El filtro es nuevo"), T("Subcooling must be zero", "El subenfriamiento debe ser cero")],
        c: 0, why: T("Superheat is the margin above saturation on the suction side. That margin is how we know the refrigerant finished boiling.", "El sobrecalentamiento es el margen sobre la saturación en el lado de succión. Ese margen nos dice que el refrigerante ya terminó de hervir.") }
    ]
  });

  /* ---------------- EPA 608 Core ---------------- */
  attach("epa-core-guide", {
    minutes: 14,
    steps: [
      { kicker: T("EPA 608 Core", "EPA 608 Core"),
        title: T("These rules exist because the atmosphere is the other customer", "Estas reglas existen porque la atmósfera también es cliente"),
        body: [
          T("Chlorine from old CFC and HCFC refrigerants can drift up and damage the ozone layer that blocks UV. That's why the Montreal Protocol and the U.S. Clean Air Act changed how we handle this stuff. Core is the 'why,' plus the rules that apply no matter which type of equipment you work on.",
            "El cloro de los refrigerantes CFC y HCFC viejos puede subir y dañar la capa de ozono que bloquea la UV. Por eso el Protocolo de Montreal y la Ley de Aire Limpio de EE. UU. cambiaron cómo manejamos esto. Core es el 'por qué', más las reglas que aplican sin importar el tipo de equipo.")
        ]
      },
      { title: T("Do not vent. That's the headline.", "No liberes. Ese es el titular."),
        body: [
          T("You may not knowingly vent refrigerant during service, maintenance, repair, or disposal. Tiny 'de minimis' releases that happen while you're recovering properly are allowed. Opening a system and letting it hiss empty is not.",
            "No puedes liberar refrigerante a propósito durante servicio, mantenimiento, reparación o desecho. Las liberaciones mínimas 'de minimis' que ocurren al recuperar bien sí se permiten. Abrir un sistema y dejarlo silbar hasta vaciarse, no."),
          T("The fines are real. Tap the AC Service Tech video when you want a plain-English walk through what 'venting' looks like on a job — and how to stay out of that mess.",
            "Las multas son reales. Toca el video de AC Service Tech cuando quieras una explicación clara de cómo se ve 'liberar' en un trabajo, y cómo no meterte en ese lío.")
        ],
        video: V.vent,
        call: T("A 'quick recover' that is really just cracking a valve behind the house is venting. Recover into a proper cylinder, every time.",
          "Un 'recupero rápido' que en realidad es abrir una válvula detrás de la casa es liberar. Recupera siempre a un cilindro correcto.")
      },
      { title: T("The three R's, in order of 'how clean'", "Las tres R, en orden de 'qué tan limpio'"),
        body: [
          T("Recover: take it out and store it. Recycle: clean it enough to put back in the same owner's equipment. Reclaim: send it to a plant, reprocess it to AHRI 700 purity, and only then can it be sold to a new owner. Certification is required for the type of equipment you service, it includes Core, and it does not expire. Sales of most refrigerant are limited to certified techs.",
            "Recuperar: sacarlo y guardarlo. Reciclar: limpiarlo lo suficiente para devolverlo al equipo del mismo dueño. Regenerar: mandarlo a una planta, reprocesarlo a pureza AHRI 700, y solo entonces se puede vender a otro dueño. Se exige certificación para el tipo de equipo que sirves, incluye Core, y no vence. La venta de la mayoría de los refrigerantes se limita a técnicos certificados.")
        ],
        analogy: T("Recover is bagging the trash. Recycle is sorting it for the same house. Reclaim is the factory that turns it into a new, tested product.",
          "Recuperar es embolsar la basura. Reciclar es separarla para la misma casa. Regenerar es la fábrica que lo convierte en un producto nuevo y probado.")
      },
      { title: T("Cylinders, recovery, and the habits that keep you legal", "Cilindros, recuperación y los hábitos que te mantienen legal"),
        body: [
          T("Use certified recovery equipment. Recovery cylinders are DOT-rated, typically gray with a yellow top, and you fill them no more than 80% by weight so there's room for the liquid to expand. Label what's inside. Keep service and disposal records — generally three years. The last person in a disposal chain has to confirm the refrigerant was recovered.",
            "Usa equipo de recuperación certificado. Los cilindros de recuperación tienen aprobación DOT, normalmente grises con tapa amarilla, y se llenan máximo al 80% por peso para que el líquido tenga espacio de expandirse. Rotula el contenido. Guarda registros de servicio y desecho, por lo general tres años. La última persona en la cadena de desecho debe confirmar que se recuperó el refrigerante.")
        ],
        video: V.recover
      }
    ],
    recap: [
      T("No venting, except tiny de minimis amounts during a proper recovery.", "No liberar, excepto cantidades mínimas de minimis durante una recuperación correcta."),
      T("Recover, recycle, reclaim — reclaim is the only one that can be sold to a new owner (AHRI 700).", "Recuperar, reciclar, regenerar: regenerar es el único que se puede vender a un dueño nuevo (AHRI 700)."),
      T("Core plus a type (I, II, III, or Universal). Certification doesn't expire.", "Core más un tipo (I, II, III o Universal). La certificación no vence."),
      T("DOT cylinders, 80% full by weight, labeled, records kept. Nitrogen only to pressurize.", "Cilindros DOT, 80% por peso, rotulados, con registros. Solo nitrógeno para presurizar.")
    ],
    check: [
      { q: T("A system still has a charge and you're about to cut it apart. You should:", "El sistema todavía tiene carga y vas a cortarlo. Debes:"),
        a: [T("Recover the refrigerant into a proper cylinder, then open the system", "Recuperar el refrigerante a un cilindro correcto y luego abrir el sistema"), T("Crack a hose in the backyard until it stops hissing", "Abrir una manguera en el patio hasta que deje de silbar"), T("Vent it — this blend has no ozone impact, so it's fine", "Liberarlo: esta mezcla no afecta el ozono, así que está bien"), T("Run the compressor with the service valves front-seated until it's empty", "Correr el compresor con las válvulas front-seated hasta vaciarlo")],
        c: 0, why: T("Venting during service or disposal is illegal, including many HFCs. Recover first.", "Liberar durante servicio o desecho es ilegal, incluso con muchos HFC. Primero recupera.") },
      { q: T("What's the difference between recycle and reclaim?", "¿Cuál es la diferencia entre reciclar y regenerar?"),
        a: [T("Recycle is cleaned for the same owner; reclaim is reprocessed to AHRI 700 and can be sold to a new owner", "Reciclar se limpia para el mismo dueño; regenerar se reprocesa a AHRI 700 y se puede vender a un dueño nuevo"), T("They are two words for the same process", "Son dos palabras para el mismo proceso"), T("Reclaim is what you do with a garden hose", "Regenerar es lo que haces con una manguera de jardín"), T("Recycle requires a lab; reclaim does not", "Reciclar exige un laboratorio; regenerar no")],
        c: 0, why: T("Reclaim is the plant process with a purity test. Recycle stays with the same owner's equipment.", "Regenerar es el proceso de planta con prueba de pureza. Reciclar se queda en el equipo del mismo dueño.") },
      { q: T("A recovery cylinder should be filled:", "Un cilindro de recuperación se debe llenar:"),
        a: [T("No more than 80% by weight", "No más del 80% por peso"), T("All the way to the neck so nothing is wasted", "Hasta el cuello para no desperdiciar"), T("Until the pressure equals the system pressure", "Hasta que la presión iguale la del sistema"), T("With a mix of air and refrigerant to stay safe", "Con una mezcla de aire y refrigerante para que sea seguro")],
        c: 0, why: T("Liquid expands as it warms. The 80% rule leaves a vapor headspace so the cylinder doesn't go hydrostatic.", "El líquido se expande al calentarse. La regla del 80% deja un espacio de vapor para que el cilindro no se ponga hidrostático.") }
    ]
  });

  /* ---------------- Components ---------------- */
  attach("components", {
    minutes: 10,
    steps: [
      { kicker: T("The parts you can point at", "Las partes que puedes señalar"),
        title: T("If you can name it, you can test it", "Si puedes nombrarlo, puedes probarlo"),
        body: [
          T("A split system is just the cycle, packaged so you can walk up to it. Outside: compressor, condenser coil, outdoor fan, a service-valve pair. Inside: evaporator coil, metering device, blower, and a control like a thermostat and a control board. Learn them by what they do, not by a parts-list dump.",
            "Un sistema split es solo el ciclo, empaquetado para que puedas acercarte. Afuera: compresor, serpentín condensador, ventilador, un par de válvulas de servicio. Adentro: serpentín evaporador, expansor, soplador y un control como el termostato y la placa. Apréndelos por lo que hacen, no como una lista de piezas.")
        ]
      },
      { title: T("The four 'cycle' parts, in the metal", "Las cuatro partes del ciclo, en el metal"),
        body: [
          T("The compressor pumps vapor from low to high. The condenser rejects heat — you'll feel the air leaving it run warmer than the yard. The metering device is often a TXV with a bulb strapped to the suction line, or a simple piston. The evaporator absorbs heat — the supply air should leave cooler and a little drier, and a drain should be ready for the condensate.",
            "El compresor bombea vapor de baja a alta. El condensador rechaza calor: el aire que sale corre más caliente que el patio. El expansor suele ser una TXV con un bulbo en la línea de succión, o un pistón simple. El evaporador absorbe calor: el aire de suministro debe salir más fresco y un poco más seco, y el drenaje debe estar listo para el condensado.")
        ],
        visual: "cycle"
      },
      { title: T("The teammates around the cycle", "Los compañeros alrededor del ciclo"),
        body: [
          T("A contactor is a heavy switch the thermostat (through a control board) uses to start the compressor and outdoor fan. A capacitor is a short-term energy stash that helps motors start and run. The filter drier, on the liquid line, catches moisture and debris so they don't freeze or clog the metering device. None of these move heat by themselves, but the cycle stops without them.",
            "El contactor es un switch pesado que el termostato (por la placa) usa para arrancar el compresor y el ventilador de afuera. El capacitor es un almacén corto de energía que ayuda a los motores a arrancar y correr. El filtro deshidratador, en la línea de líquido, atrapa humedad y suciedad para que no se hielen ni tapen el expansor. Ninguno mueve calor por sí solo, pero el ciclo se para sin ellos.")
        ],
        video: V.cycleClass,
        call: T("A 'dead outdoor unit' is often a burned contactor or a failed capacitor, not a 'bad compressor.' Listen, look, and test before you condemn the expensive part.",
          "Una 'unidad de afuera muerta' muchas veces es un contactor quemado o un capacitor fallado, no un 'compresor malo.' Escucha, mira y prueba antes de condenar la pieza cara.")
      },
      { title: T("Follow two pipes and you'll know the story", "Sigue dos tubos y sabrás la historia"),
        body: [
          T("The big, insulated suction line carries cold, low-pressure vapor back to the compressor. The small liquid line carries high-pressure liquid to the metering device. If you can tell those two apart on a job, you already know which side is which.",
            "La línea de succión, gruesa y aislada, lleva vapor frío de baja presión de vuelta al compresor. La línea de líquido, delgada, lleva líquido de alta presión al expansor. Si las distingues en un trabajo, ya sabes cuál lado es cuál.")
        ]
      }
    ],
    recap: [
      T("Outside: compressor, condenser, fan, service valves. Inside: evaporator, metering device, blower, controls.", "Afuera: compresor, condensador, ventilador, válvulas. Adentro: evaporador, expansor, soplador, controles."),
      T("Contactors and capacitors run the motors. The filter drier protects the metering device.", "Contactores y capacitores corren los motores. El filtro deshidratador protege el expansor."),
      T("Big insulated pipe = suction (low, vapor). Small pipe = liquid (high, liquid).", "Tubo grueso aislado = succión (baja, vapor). Tubo delgado = líquido (alta, líquido).")
    ],
    check: [
      { q: T("The small uninsulated copper line between the outdoor unit and the indoor coil is usually the:", "La línea de cobre delgada y sin aislamiento entre la unidad de afuera y el serpentín de adentro suele ser:"),
        a: [T("Liquid line, carrying high-pressure liquid to the metering device", "Línea de líquido, que lleva líquido de alta presión al expansor"), T("Suction line, carrying low-pressure vapor", "Línea de succión, que lleva vapor de baja presión"), T("Condensate drain", "Drenaje de condensado"), T("Gas line for the furnace", "Línea de gas del horno")],
        c: 0, why: T("The liquid line is the smaller tube. The suction line is larger and insulated because it carries cold vapor.", "La línea de líquido es el tubo más delgado. La de succión es más grande y aislada porque lleva vapor frío.") },
      { q: T("A homeowner has no cooling and the outdoor fan and compressor are silent, but the thermostat is calling. A fair first suspect is:", "El cliente no tiene frío y el ventilador y el compresor de afuera están silenciosos, pero el termostato está pidiendo. Un primer sospechoso justo es:"),
        a: [T("The contactor or capacitor — the 'on' switch and the motor's helper", "El contactor o el capacitor: el switch de 'on' y el ayudante del motor"), T("A clogged condensate drain only", "Solo un drenaje de condensado tapado"), T("The refrigerant type being wrong", "Que el tipo de refrigerante esté mal"), T("The supply registers being open", "Que las rejillas de suministro estén abiertas")],
        c: 0, why: T("If the call is there and the outdoor motors are dead, start with the parts that start those motors: contactor and capacitor. Then check power.", "Si hay llamado y los motores de afuera están muertos, empieza por las partes que los arrancan: contactor y capacitor. Luego revisa la energía.") },
      { q: T("What is the filter drier for?", "¿Para qué es el filtro deshidratador?"),
        a: [T("To catch moisture and debris before they reach the metering device", "Para atrapar humedad y suciedad antes de que lleguen al expansor"), T("To add oil to the compressor", "Para agregar aceite al compresor"), T("To raise suction pressure", "Para subir la presión de succión"), T("To replace the thermostat", "Para reemplazar el termostato")],
        c: 0, why: T("Moisture and dirt ruin valves and turn into ice at the pressure drop. The drier is cheap insurance on the liquid line.", "La humedad y la suciedad arruinan las válvulas y se vuelven hielo en la caída de presión. El deshidratador es un seguro barato en la línea de líquido.") }
    ]
  });

  /* ---------------- Tools ---------------- */
  attach("tools", {
    minutes: 10,
    steps: [
      { kicker: T("The tools you'll actually reach for", "Las herramientas que sí vas a tomar"),
        title: T("A tool is only as good as the habit behind it", "Una herramienta solo es tan buena como el hábito que la acompaña"),
        body: [
          T("You don't need a truck full of chrome on day one. You need a meter you trust, a way to prove power is off, a manometer for air, and — once you're certified — gauges and a recovery setup you use without venting. This lesson is about what those tools are for, not a shopping list.",
            "No necesitas un camión lleno de cromo el día uno. Necesitas un medidor en el que confíes, una forma de probar que no hay energía, un manómetro de aire y — ya certificado — manómetros y un equipo de recuperación que uses sin liberar. Esta lección es para qué sirven, no una lista de compras.")
        ]
      },
      { title: T("Electrical and air first — they don't require a 608 card", "Primero lo eléctrico y el aire: no piden tarjeta 608"),
        body: [
          T("A decent digital meter, a solenoid tester or wiggy if you were taught that way, and a manometer with static tips will diagnose a huge share of 'it's broken' calls: no power, a bad capacitor, a restricted filter, a duct that's fighting the blower. Get comfortable live–dead–live and you'll be safer than a tech with prettier gauges and sloppy habits.",
            "Un buen medidor digital, un probador de solenoide si te lo enseñaron, y un manómetro con puntas de estática diagnostican un montón de llamadas de 'está descompuesto': no hay energía, un capacitor malo, un filtro restringido, un ducto que pelea con el soplador. Si te sientes cómodo con vivo–muerto–vivo, serás más seguro que un técnico con manómetros más bonitos y malos hábitos.")
        ],
        visual: "loto"
      },
      { title: T("Gauges and hoses, when you're ready and allowed", "Manómetros y mangueras, cuando estés listo y autorizado"),
        body: [
          T("Manifold gauges (or digital probes) let you read high- and low-side pressure so you can convert to saturation and calculate superheat and subcooling. Low-loss fittings help you hook up without dumping a cloud of refrigerant. This is service work: recover, don't vent, and know your cylinder rules.",
            "Los manifold (o sondas digitales) te dejan leer la presión de alta y de baja para convertir a saturación y calcular sobrecalentamiento y subenfriamiento. Los fittings de baja pérdida ayudan a conectar sin soltar una nube de refrigerante. Esto es trabajo de servicio: recupera, no liberes, y conoce las reglas del cilindro.")
        ],
        video: V.gauges
      },
      { title: T("Vacuum and recovery belong together", "El vacío y la recuperación van juntos"),
        body: [
          T("A recovery machine and a recovery cylinder take the charge out before you open a system. After a repair, a vacuum pump and a micron gauge let you pull moisture and air out — often to about 500 microns — and then watch for a rise. A fast rise usually means a leak or leftover moisture, not 'the pump is weak.'",
            "Una recuperadora y un cilindro de recuperación sacan la carga antes de abrir el sistema. Después de una reparación, una bomba de vacío y un medidor de micrones te dejan sacar humedad y aire — a menudo hasta unos 500 micrones — y luego mirar si sube. Una subida rápida casi siempre es fuga o humedad, no 'la bomba está débil.'")
        ],
        call: T("After a repair, pull to about 500 microns, isolate the pump, and watch. If it rockets up, find the leak or the moisture. If it holds, you're ready to charge.",
          "Después de una reparación, baja a unos 500 micrones, aísla la bomba y observa. Si sube como cohete, busca la fuga o la humedad. Si se sostiene, ya puedes cargar.")
      }
    ],
    recap: [
      T("Start with a trustworthy meter and a manometer. Many calls are power or air, not charge.", "Empieza con un medidor confiable y un manómetro. Muchas llamadas son energía o aire, no carga."),
      T("Gauges are for saturation, superheat, and subcooling — after you're certified to handle refrigerant.", "Los manómetros son para saturación, sobrecalentamiento y subenfriamiento, cuando ya estás certificado para manejar refrigerante."),
      T("Recover into a proper cylinder. Vacuum and watch microns after a repair.", "Recupera a un cilindro correcto. Haz vacío y observa los micrones después de una reparación."),
      T("A rising micron gauge usually means a leak or moisture, not a lecture about the pump.", "Un medidor de micrones que sube suele ser fuga o humedad, no una lección sobre la bomba.")
    ],
    check: [
      { q: T("Before you ever hook gauges to a system, a fair first kit is:", "Antes de conectar manómetros a un sistema, un primer kit justo es:"),
        a: [T("A meter (and live–dead–live) plus a manometer for airflow", "Un medidor (y vivo–muerto–vivo) más un manómetro de flujo de aire"), T("Only a recovery machine", "Solo una recuperadora"), T("A torch and a tank of oxygen", "Un soplete y un tanque de oxígeno"), T("A bigger hammer", "Un martillo más grande")],
        c: 0, why: T("A lot of 'bad charge' calls are actually power or air. Those tools don't require opening the refrigerant circuit.", "Muchas llamadas de 'mala carga' son en realidad energía o aire. Esas herramientas no piden abrir el circuito de refrigerante.") },
      { q: T("You pull a vacuum to 500 microns, close the pump off, and the gauge climbs quickly. You should think:", "Haces vacío a 500 micrones, cierras la bomba y el medidor sube rápido. Debes pensar:"),
        a: [T("Leak or moisture is still in the system", "Todavía hay fuga o humedad en el sistema"), T("That's normal — microns always bounce back to 5,000", "Es normal: los micrones siempre regresan a 5,000"), T("Add refrigerant immediately", "Agregar refrigerante de inmediato"), T("The micron gauge is supposed to follow outdoor temperature", "El medidor de micrones debe seguir la temperatura de afuera")],
        c: 0, why: T("A standing test after you isolate the pump tells you if the system is tight and dry. A fast rise is a problem, not a pass.", "Una prueba en espera al aislar la bomba te dice si el sistema está cerrado y seco. Una subida rápida es un problema, no un aprobado.") },
      { q: T("Low-loss fittings on gauge hoses are there to:", "Los fittings de baja pérdida en las mangueras de manómetro sirven para:"),
        a: [T("Cut down how much refrigerant escapes when you connect and disconnect", "Reducir cuánto refrigerante se escapa al conectar y desconectar"), T("Raise suction pressure", "Subir la presión de succión"), T("Replace the need for a recovery cylinder", "Reemplazar la necesidad de un cilindro de recuperación"), T("Charge the system with air", "Cargar el sistema con aire")],
        c: 0, why: T("Every hookup can vent a little. Low-loss fittings — plus good habits — keep that de minimis, not a cloud.", "Cada conexión puede liberar un poco. Los fittings de baja pérdida, más buenos hábitos, lo dejan en de minimis, no en una nube.") }
    ]
  });
})();
