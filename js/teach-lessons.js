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
    gauges: YT("xTctTHhOgaw", "Connect & Disconnect Refrigerant Gauges! Low Loss Fittings!", "AC Service Tech LLC"),
    t1recover: YT("yXJNuMmEPog", "Recovering Refrigerant! Use the System's Compressor or Recovery Machine? Explained!", "AC Service Tech LLC"),
    chiller: YT("0rzQhSXVq60", "Chiller Basics - How they work", "The Engineering Mindset"),
    ohm: YT("HsLLq6Rm5tU", "Ohms Law Explained - The basics circuit theory", "The Engineering Mindset")
  };

  function attach(id, teach) {
    const g = window.LESSONS[id];
    if (!g) return console.warn("teach: missing lesson", id);
    g.teach = teach;
    if (teach.check) g.check = teach.check;
    if (teach.minutes) g.minutes = teach.minutes;
    g.rewritten = true;
  }

  /* ---------------- Safety (v66 quality pass) ---------------- */
  attach("safety", {
    minutes: 12,
    steps: [
      { kicker: T("Safety first", "La seguridad primero"),
        title: T("Four things on every job can hurt you", "Cuatro cosas en cada trabajo pueden lastimarte"),
        body: [
          T("Heating and cooling equipment mixes electricity, gas under pressure, open flame, and heights. None of it is dangerous when you respect it. All of it is dangerous when you rush.",
            "El equipo de calefacción y aire mezcla electricidad, gas a presión, flama y alturas. Nada es peligroso si lo respetas. Todo es peligroso si te apuras."),
          T("Good techs build a habit: before touching anything, they spend thirty seconds making it safe. This lesson is that habit, one hazard at a time.",
            "Los buenos técnicos tienen un hábito: antes de tocar algo, dedican treinta segundos a dejarlo seguro. Esta lección es ese hábito, un peligro a la vez.")
        ],
        call: T("You pull up to a 'no cooling' call on a 98° afternoon. The homeowner is watching and you want to look fast. That moment is exactly when people skip a step.",
          "Llegas a una llamada de 'no enfría' una tarde de 98°. El cliente te mira y quieres verte rápido. Justo en ese momento la gente se salta un paso.")
      },
      { title: T("Turn the power off — and make sure it stays off", "Apaga la energía y asegúrate de que siga apagada"),
        body: [
          T("Outdoor units have a metal shutoff box on the wall called the disconnect. Furnaces have a switch or a breaker. Turn it off, then put a padlock and a tag on it. That's called lockout/tagout.",
            "Las unidades de afuera tienen una caja metálica en la pared llamada desconectador. Los hornos tienen un switch o un breaker. Apágalo y ponle candado y etiqueta. Eso se llama bloqueo/etiquetado."),
          T("Why the lock? Because someone inside the house might flip it back on while your hands are in the unit. The lock means only you can turn it back on.",
            "¿Por qué el candado? Porque alguien en la casa podría volver a encenderlo mientras tus manos están en la unidad. El candado significa que solo tú puedes encenderlo.")
        ],
        visual: "loto",
        analogy: T("It's like taking the car keys with you before crawling under the car. Nobody can start it while you're down there.",
          "Es como llevarte las llaves del carro antes de meterte debajo. Nadie lo puede arrancar mientras estás ahí.")
      },
      { title: T("Off isn't proof. Test it.", "Apagado no es prueba. Mídelo."),
        body: [
          T("Breakers get mislabeled. Switches fail. So techs prove the power is gone with a meter, in three moves: test the meter on something known to be live, test the wires you just shut off, then test the meter on live again.",
            "Los breakers se etiquetan mal. Los switches fallan. Por eso los técnicos comprueban con un medidor que no hay energía, en tres pasos: prueban el medidor en algo que sí tiene energía, miden los cables que apagaron, y vuelven a probar el medidor en algo con energía."),
          T("That's called live–dead–live. The last step matters: if your meter died in the middle, it would happily read 'zero' on a live wire.",
            "Eso se llama vivo–muerto–vivo. El último paso importa: si tu medidor se murió a la mitad, marcaría 'cero' en un cable vivo sin problema.")
        ],
        analogy: T("It's like checking a smoke detector's test button before trusting the silence. A dead detector is quiet too.",
          "Es como apretar el botón de prueba del detector de humo antes de confiar en el silencio. Un detector muerto también está callado."),
        call: T("A breaker labeled 'AC' turns out to feed the dryer. The tech who tested found it. The tech who trusted the label got shocked.",
          "Un breaker marcado 'AC' resulta que alimenta la secadora. El técnico que midió lo descubrió. El que confió en la etiqueta recibió una descarga.")
      },
      { title: T("Some parts hold a charge after the power is off", "Algunas piezas guardan carga aunque apagues la energía"),
        body: [
          T("Motors in these units get a starting kick from a part called a capacitor — a metal can that stores electricity. It can stay charged for a while after you shut the power off.",
            "Los motores de estas unidades reciben un empujón de arranque de una pieza llamada capacitor, una lata de metal que guarda electricidad. Puede seguir cargada un rato después de apagar la energía."),
          T("Techs safely discharge it with an insulated tool before touching its terminals.",
            "Los técnicos la descargan con seguridad usando una herramienta aislada antes de tocar sus terminales.")
        ],
        analogy: T("A charged capacitor is a stretched rubber band. The motor is off, but the energy is still waiting to snap.",
          "Un capacitor cargado es una liga estirada. El motor está apagado, pero la energía sigue lista para soltarse.")
      },
      { title: T("Refrigerant is cold enough to burn and heavy enough to smother", "El refrigerante es tan frío que quema y tan pesado que asfixia"),
        body: [
          T("The refrigerant inside an AC can drop far below freezing the instant it escapes. A spray on bare skin or an eye causes frostbite in a second, so techs wear safety glasses and gloves when hooking up.",
            "El refrigerante de un aire puede bajar muy por debajo de congelación en cuanto se escapa. Un chorro en la piel o en un ojo causa congelación en un segundo, por eso los técnicos usan lentes y guantes al conectar."),
          T("Most refrigerants are heavier than air. In a basement or a closet, a big leak can sink and push out the oxygen you breathe. If you feel dizzy in a tight space, get out first and figure it out second.",
            "La mayoría de los refrigerantes pesan más que el aire. En un sótano o un closet, una fuga grande puede bajar y desplazar el oxígeno que respiras. Si te mareas en un lugar cerrado, sal primero y averigua después.")
        ],
        analogy: T("A leak in a closed room acts like water filling a bathtub: it fills from the floor up, and your nose is the last thing to know.",
          "Una fuga en un cuarto cerrado actúa como agua llenando una tina: se llena desde el piso, y tu nariz es lo último en enterarse.")
      },
      { title: T("Nitrogen only, ladders right, and a CO detector near flame", "Solo nitrógeno, escaleras bien y detector de CO cerca de la flama"),
        body: [
          T("To check a system for leaks, techs fill it with pressure. They use dry nitrogen — never oxygen or shop air. Oxygen and oil under pressure can explode.",
            "Para buscar fugas, los técnicos llenan el sistema de presión. Usan nitrógeno seco, nunca oxígeno ni aire del taller. El oxígeno y el aceite a presión pueden explotar."),
          T("On ladders and roofs: keep three points of contact and watch the edge. Around a furnace or water heater, carry a carbon monoxide (CO) detector — CO has no smell and no color.",
            "En escaleras y techos: tres puntos de contacto y cuidado con el borde. Cerca de un horno o calentador, lleva un detector de monóxido de carbono (CO): el CO no tiene olor ni color.")
        ],
        video: V.safety,
        call: T("A helper once grabbed the shop air hose 'just to see if it holds.' Oil plus air plus pressure is how a compressor turns into a bomb. Nitrogen only.",
          "Un ayudante una vez agarró la manguera de aire 'solo para ver si aguanta.' Aceite más aire más presión es como un compresor se vuelve bomba. Solo nitrógeno.")
      }
    ],
    recap: [
      T("Turn it off, then lock and tag it so only you can turn it back on.", "Apágalo y ponle candado y etiqueta para que solo tú lo enciendas."),
      T("Prove it's dead with live–dead–live. A label is not proof.", "Comprueba que está muerto con vivo–muerto–vivo. Una etiqueta no es prueba."),
      T("Capacitors can hold a charge after the power is off. Discharge them first.", "Los capacitores guardan carga sin energía. Descárgalos primero."),
      T("Glasses and gloves around refrigerant. Get out of a tight space if you feel dizzy.", "Lentes y guantes con refrigerante. Sal de un lugar cerrado si te mareas."),
      T("Nitrogen only for pressure tests. Three points on ladders. CO detector near anything that burns fuel.", "Solo nitrógeno para pruebas de presión. Tres puntos en escaleras. Detector de CO cerca de lo que quema combustible.")
    ],
    check: [
      { q: T("Why put a padlock on a disconnect you already switched off?", "¿Por qué poner candado a un desconectador que ya apagaste?"),
        a: [T("So nobody can turn it back on while you're working", "Para que nadie lo vuelva a encender mientras trabajas"), T("So the homeowner knows you were there", "Para que el cliente sepa que estuviste ahí"), T("Locks make the power flow faster", "El candado hace que la energía fluya más rápido"), T("It's only needed on rainy days", "Solo se necesita cuando llueve")],
        c: 0, why: T("Lockout/tagout means only the person holding the key can restore power.", "El bloqueo/etiquetado significa que solo quien tiene la llave puede devolver la energía.") },
      { q: T("In live–dead–live, why test the meter on a live source again at the end?", "En vivo–muerto–vivo, ¿por qué probar el medidor en algo con energía al final?"),
        a: [T("To make sure the meter didn't die and give a false 'zero'", "Para asegurarte de que el medidor no se murió y dio un 'cero' falso"), T("To charge the meter's battery", "Para cargar la batería del medidor"), T("Because the rules want three readings for paperwork", "Porque las reglas piden tres lecturas para el papeleo"), T("It isn't needed", "No hace falta")],
        c: 0, why: T("A broken meter reads zero on everything. The final check proves the 'dead' reading was real.", "Un medidor descompuesto marca cero en todo. La última prueba confirma que la lectura 'muerta' era real.") },
      { q: T("The power is off. Can you grab the capacitor terminals?", "La energía está apagada. ¿Puedes agarrar las terminales del capacitor?"),
        a: [T("Not yet — discharge it first, because it can still hold a charge", "Todavía no: descárgalo primero, porque puede seguir cargado"), T("Yes, off means safe", "Sí, apagado significa seguro"), T("Only if it's sunny", "Solo si hace sol"), T("Yes, capacitors never store energy", "Sí, los capacitores nunca guardan energía")],
        c: 0, why: T("Capacitors store electricity like a stretched rubber band. Discharge them safely before touching.", "Los capacitores guardan electricidad como una liga estirada. Descárgalos con seguridad antes de tocar.") },
      { q: T("You're working in a small basement and start feeling light-headed near a leaking unit. What first?", "Trabajas en un sótano pequeño y empiezas a marearte cerca de una unidad con fuga. ¿Qué haces primero?"),
        a: [T("Get out to fresh air", "Salir al aire fresco"), T("Finish the repair quickly", "Terminar la reparación rápido"), T("Sit down on the floor and rest", "Sentarte en el piso a descansar"), T("Light a match to see better", "Prender un cerillo para ver mejor")],
        c: 0, why: T("Refrigerant is heavier than air and can push oxygen out of low spaces. The floor is the worst place to rest.", "El refrigerante pesa más que el aire y desplaza el oxígeno en lugares bajos. El piso es el peor lugar para descansar.") },
      { q: T("What gas is used to pressure-test a system for leaks?", "¿Qué gas se usa para probar fugas con presión?"),
        a: [T("Dry nitrogen", "Nitrógeno seco"), T("Oxygen", "Oxígeno"), T("Shop compressed air", "Aire comprimido del taller"), T("Propane", "Propano")],
        c: 0, why: T("Nitrogen is dry and won't burn. Oxygen or air with oil under pressure can explode.", "El nitrógeno es seco y no arde. El oxígeno o el aire con aceite a presión pueden explotar.") }
    ]
  });

  /* ---------------- Cycle (v66 quality pass) ---------------- */
  attach("cycle", {
    minutes: 14,
    steps: [
      { kicker: T("The big idea", "La idea grande"),
        title: T("An air conditioner doesn't make cold. It moves heat.", "Un aire acondicionado no fabrica frío. Mueve calor."),
        body: [
          T("Cold isn't a thing you can add. It's just less heat. So an air conditioner works by picking up heat inside your house and carrying it outside. The air it leaves behind feels cool.",
            "El frío no es algo que se pueda agregar. Es solo menos calor. Así que un aire acondicionado funciona recogiendo calor dentro de la casa y llevándolo afuera. El aire que deja se siente fresco."),
          T("That's why the fan on the outdoor unit blows warm air on a summer day. That warm air is heat that used to be in your living room.",
            "Por eso el ventilador de la unidad de afuera echa aire caliente en verano. Ese aire caliente es calor que antes estaba en tu sala.")
        ],
        analogy: T("A sponge doesn't 'make dry.' It soaks up water in one spot and you wring it out somewhere else. The AC soaks up heat inside and wrings it out outside.",
          "Una esponja no 'fabrica seco.' Absorbe agua en un lugar y la exprimes en otro. El aire absorbe calor adentro y lo exprime afuera.")
      },
      { title: T("Evaporating liquid pulls heat — you already know this", "Un líquido que se evapora jala calor: ya lo sabes"),
        body: [
          T("Step out of a pool on a breezy day and you shiver, even in the sun. The water drying off your skin is turning into vapor, and that change takes heat from your body.",
            "Sal de una alberca con viento y tiemblas, aun con sol. El agua que se seca en tu piel se convierte en vapor, y ese cambio le quita calor a tu cuerpo."),
          T("An AC uses a special fluid called refrigerant that does the same thing on purpose. Inside the indoor coil, it boils into vapor and soaks up heat from the house air blowing across it.",
            "Un aire usa un líquido especial llamado refrigerante que hace lo mismo a propósito. Dentro del serpentín de adentro, hierve hasta volverse vapor y absorbe el calor del aire de la casa que pasa por encima.")
        ],
        analogy: T("Rubbing alcohol on your arm feels icy for the same reason: it evaporates fast and takes your heat with it.",
          "El alcohol en el brazo se siente helado por la misma razón: se evapora rápido y se lleva tu calor.")
      },
      { title: T("Pressure decides when a liquid boils", "La presión decide cuándo hierve un líquido"),
        body: [
          T("Water boils at 212°F at sea level, but at a lower temperature up a mountain where the air pressure is lower. Squeeze a liquid and it boils hotter. Release the pressure and it boils colder.",
            "El agua hierve a 212°F al nivel del mar, pero a menos temperatura en una montaña, donde la presión del aire es menor. Si aprietas un líquido, hierve más caliente. Si quitas presión, hierve más frío."),
          T("The AC uses this. Low pressure inside the house lets refrigerant boil cold enough to pull heat from 75° room air. High pressure outside makes it hot enough to dump that heat into 95° outdoor air.",
            "El aire usa esto. Presión baja adentro deja que el refrigerante hierva lo bastante frío para sacar calor de aire a 75°. Presión alta afuera lo pone lo bastante caliente para tirar ese calor a aire de 95°.")
        ],
        visual: "pt",
        analogy: T("A pressure cooker cooks faster because squeezing the water lets it get hotter than 212° before it boils. The AC's outdoor side works like a pressure cooker.",
          "Una olla exprés cocina más rápido porque, al apretar el agua, se calienta más de 212° antes de hervir. El lado de afuera del aire funciona como una olla exprés.")
      },
      { title: T("Four parts make the loop", "Cuatro partes forman el circuito"),
        body: [
          T("Compressor: the pump in the outdoor unit. It squeezes the refrigerant vapor into a hot, high-pressure gas. Condenser: the outdoor coil. The fan blows across it, heat leaves, and the refrigerant turns back into liquid.",
            "Compresor: la bomba en la unidad de afuera. Aprieta el vapor del refrigerante y lo convierte en gas caliente de alta presión. Condensador: el serpentín de afuera. El ventilador sopla por encima, el calor se va y el refrigerante vuelve a ser líquido."),
          T("Metering device: a small valve that lets the liquid through a tiny opening so its pressure drops. Evaporator: the indoor coil, where that cold, low-pressure liquid boils and soaks up house heat. Then it goes back to the compressor and starts over.",
            "Dispositivo de expansión: una válvula pequeña que deja pasar el líquido por un hoyo chiquito para que baje su presión. Evaporador: el serpentín de adentro, donde ese líquido frío de baja presión hierve y absorbe el calor de la casa. Luego regresa al compresor y empieza otra vez.")
        ],
        visual: "cycle",
        video: V.cycle3d
      },
      { title: T("The two copper lines tell the whole story", "Las dos líneas de cobre cuentan toda la historia"),
        body: [
          T("Look at an outdoor unit and you'll see two copper pipes going into the house. The fat, insulated one is the suction line. It carries cool vapor back from the indoor coil and feels cold and sweaty when the system is working.",
            "Mira una unidad de afuera y verás dos tubos de cobre que entran a la casa. El grueso y aislado es la línea de succión. Regresa vapor frío desde el serpentín de adentro y se siente frío y sudado cuando el sistema funciona."),
          T("The thin one is the liquid line. It carries warm liquid from the outdoor coil toward the indoor coil. Feeling both lines is one of the first things a tech does on arrival.",
            "El delgado es la línea de líquido. Lleva líquido tibio del serpentín de afuera hacia el de adentro. Tocar las dos líneas es de lo primero que hace un técnico al llegar.")
        ],
        call: T("A customer says the AC runs but the house stays warm. The tech touches the fat line: it's warm and dry instead of cold and sweaty. That one touch says the refrigerant isn't picking up heat inside — so the hunt starts there.",
          "Un cliente dice que el aire corre pero la casa sigue caliente. El técnico toca la línea gruesa: está tibia y seca en vez de fría y sudada. Ese toque dice que el refrigerante no está recogiendo calor adentro, y por ahí empieza la búsqueda.")
      },
      { title: T("A heat pump is the same loop, run backward in winter", "Una bomba de calor es el mismo circuito, al revés en invierno"),
        body: [
          T("A heat pump has one extra valve that flips the direction of the refrigerant. In winter, the outdoor coil becomes the one that soaks up heat — even cold outdoor air has some — and the indoor coil releases it into the house.",
            "Una bomba de calor tiene una válvula extra que voltea la dirección del refrigerante. En invierno, el serpentín de afuera es el que absorbe calor (aun el aire frío tiene algo) y el de adentro lo suelta en la casa."),
          T("Same four parts, same physics. Just a different direction.",
            "Las mismas cuatro partes, la misma física. Solo otra dirección.")
        ],
        video: V.heatPump,
        analogy: T("It's a moving truck that can drive either way. Summer: haul heat out of the house. Winter: haul heat in.",
          "Es un camión de mudanzas que maneja para los dos lados. Verano: saca calor de la casa. Invierno: lo mete.")
      }
    ],
    recap: [
      T("An AC moves heat from inside to outside. Cold is just less heat.", "Un aire mueve calor de adentro hacia afuera. El frío es solo menos calor."),
      T("Evaporating liquid pulls heat, like water drying on your skin.", "Un líquido que se evapora jala calor, como el agua que se seca en tu piel."),
      T("Low pressure makes refrigerant boil cold indoors; high pressure lets it dump heat outdoors.", "Presión baja hace que hierva frío adentro; presión alta deja que tire calor afuera."),
      T("Compressor, condenser, metering device, evaporator — then around again.", "Compresor, condensador, dispositivo de expansión, evaporador, y otra vuelta."),
      T("Fat line cold and sweaty, thin line warm. A heat pump runs the loop backward for heat.", "Línea gruesa fría y sudada, delgada tibia. Una bomba de calor corre el circuito al revés para calentar.")
    ],
    check: [
      { q: T("Why does the outdoor unit blow warm air in summer?", "¿Por qué la unidad de afuera echa aire caliente en verano?"),
        a: [T("It's releasing heat that was taken from inside the house", "Está soltando el calor que sacó de la casa"), T("It's broken", "Está descompuesta"), T("It has a heater inside for summer", "Tiene un calentador adentro para el verano"), T("The sun heats the fan blades", "El sol calienta las aspas")],
        c: 0, why: T("The AC moves heat. What you feel outside is your living room's heat leaving.", "El aire mueve calor. Lo que sientes afuera es el calor de tu sala que se va.") },
      { q: T("What makes the refrigerant boil cold enough to cool the house?", "¿Qué hace que el refrigerante hierva lo bastante frío para enfriar la casa?"),
        a: [T("Low pressure in the indoor coil", "Presión baja en el serpentín de adentro"), T("Adding ice to it", "Echarle hielo"), T("High pressure in the indoor coil", "Presión alta en el serpentín de adentro"), T("A colder thermostat setting adds cold refrigerant", "Bajar el termostato agrega refrigerante frío")],
        c: 0, why: T("Lower pressure means a lower boiling point. That's why the metering device drops the pressure before the indoor coil.", "Menos presión significa menor punto de ebullición. Por eso el dispositivo de expansión baja la presión antes del serpentín de adentro.") },
      { q: T("Which part is the pump that squeezes refrigerant into hot, high-pressure gas?", "¿Cuál pieza es la bomba que aprieta el refrigerante en gas caliente de alta presión?"),
        a: [T("Compressor", "Compresor"), T("Evaporator", "Evaporador"), T("Filter", "Filtro"), T("Thermostat", "Termostato")],
        c: 0, why: T("The compressor raises the pressure so the refrigerant can dump heat outdoors.", "El compresor sube la presión para que el refrigerante pueda tirar calor afuera.") },
      { q: T("The AC is running. The fat insulated copper line is warm and dry. What does that suggest?", "El aire está corriendo. La línea gruesa aislada está tibia y seca. ¿Qué sugiere?"),
        a: [T("The refrigerant isn't picking up heat inside like it should", "El refrigerante no está recogiendo calor adentro como debería"), T("Everything is perfect", "Todo está perfecto"), T("The thin line is the suction line", "La línea delgada es la de succión"), T("The furnace is on", "El horno está prendido")],
        c: 0, why: T("A working suction line is cold and sweaty. Warm and dry is a clue something is wrong.", "Una línea de succión que funciona está fría y sudada. Tibia y seca es pista de un problema.") },
      { q: T("How does a heat pump heat a house in winter?", "¿Cómo calienta una casa una bomba de calor en invierno?"),
        a: [T("It runs the refrigerant loop backward, pulling heat from outdoor air into the house", "Corre el circuito al revés, sacando calor del aire de afuera hacia la casa"), T("It burns gas in the outdoor unit", "Quema gas en la unidad de afuera"), T("It only blows the indoor fan", "Solo sopla el ventilador de adentro"), T("It can't heat at all", "No puede calentar")],
        c: 0, why: T("A reversing valve flips the flow. Same parts, opposite direction.", "Una válvula reversible voltea el flujo. Mismas piezas, dirección contraria.") }
    ]
  });

  /* ---------------- Science (v66 quality pass) ---------------- */
  attach("science", {
    minutes: 14,
    steps: [
      { kicker: T("The science", "La ciencia"),
        title: T("Heat always flows from warmer to cooler", "El calor siempre fluye de lo caliente a lo frío"),
        body: [
          T("Put a hot mug in your hands and your hands warm up. Put ice in your drink and the drink cools. Heat never flows the other way on its own.",
            "Agarra una taza caliente y tus manos se calientan. Pon hielo en tu bebida y la bebida se enfría. El calor nunca va al revés por sí solo."),
          T("Every piece of heating and cooling equipment is built around that rule. To cool a room, you need something colder than the room for the heat to flow into. To heat a room, you need something hotter.",
            "Todo equipo de calefacción y aire está hecho alrededor de esa regla. Para enfriar un cuarto necesitas algo más frío que el cuarto para que el calor fluya hacia ahí. Para calentar, algo más caliente.")
        ],
        visual: "heat",
        analogy: T("Heat is like water on a hill: it only rolls downhill, from hot to cold. A machine has to do work to push it back up.",
          "El calor es como agua en una loma: solo rueda hacia abajo, de caliente a frío. Una máquina tiene que trabajar para subirlo.")
      },
      { title: T("Heat travels three ways", "El calor viaja de tres formas"),
        body: [
          T("Conduction: through something solid you touch, like a hot pan handle. Convection: carried by moving air or water, like a fan blowing warm air. Radiation: straight through space as invisible light, like sunshine on your face.",
            "Conducción: a través de algo sólido que tocas, como el mango de un sartén caliente. Convección: llevado por aire o agua en movimiento, como un ventilador que sopla aire tibio. Radiación: directo por el espacio como luz invisible, como el sol en tu cara."),
          T("An AC coil uses all of them: heat conducts through the metal, and the fan's moving air carries it away by convection.",
            "Un serpentín usa todas: el calor pasa por el metal por conducción, y el aire del ventilador se lo lleva por convección.")
        ],
        analogy: T("Hot mug in your hand: conduction. Blowing on soup: convection. Feeling a campfire from across the yard: radiation.",
          "Taza caliente en la mano: conducción. Soplar la sopa: convección. Sentir una fogata desde el otro lado del patio: radiación.")
      },
      { title: T("The heat you feel, and the heat hiding in water", "El calor que sientes y el calor escondido en el agua"),
        body: [
          T("Sensible heat is heat you can feel and measure with a thermometer. Latent heat is heat that changes water between liquid and vapor without changing the temperature.",
            "El calor sensible es el que sientes y mides con un termómetro. El calor latente es el que cambia el agua entre líquido y vapor sin cambiar la temperatura."),
          T("This is why a humid 80° day feels worse than a dry 80° day. An AC has to cool the air and also pull water out of it. You can see that water: it's what drips out of the drain line all summer.",
            "Por eso un día húmedo de 80° se siente peor que uno seco de 80°. Un aire tiene que enfriar el aire y además sacarle agua. Esa agua se ve: es la que gotea del desagüe todo el verano.")
        ],
        video: V.comfort,
        call: T("A homeowner says the house is 74° but feels sticky. The temperature is fine. The humidity isn't. A tech looks at airflow and run time, because the AC isn't pulling enough water out.",
          "Un cliente dice que la casa está a 74° pero se siente pegajosa. La temperatura está bien; la humedad no. El técnico revisa el flujo de aire y el tiempo de funcionamiento, porque el aire no está sacando suficiente agua.")
      },
      { title: T("Pressure and boiling point move together", "La presión y el punto de ebullición se mueven juntos"),
        body: [
          T("Raise the pressure on a liquid and it boils at a higher temperature. Lower it and it boils at a lower temperature. When a liquid is boiling, its pressure and temperature are locked together.",
            "Si subes la presión de un líquido, hierve a más temperatura. Si la bajas, hierve a menos. Cuando un líquido está hirviendo, su presión y su temperatura están amarradas."),
          T("Techs carry a pressure–temperature chart for each refrigerant. Read the pressure on a gauge, look it up, and you know exactly what temperature the refrigerant is boiling at inside the pipe.",
            "Los técnicos traen una tabla de presión–temperatura para cada refrigerante. Leen la presión en el manómetro, la buscan, y saben exactamente a qué temperatura hierve el refrigerante dentro del tubo.")
        ],
        visual: "pt",
        analogy: T("Up in the mountains, pasta takes longer to cook. Lower air pressure makes water boil at a lower temperature, so it isn't as hot.",
          "En la montaña, la pasta tarda más en cocerse. Menos presión de aire hace que el agua hierva a menos temperatura, así que no está tan caliente.")
      },
      { title: T("Superheat: how much the vapor warmed up after boiling", "Sobrecalentamiento: cuánto se calentó el vapor después de hervir"),
        body: [
          T("Inside the indoor coil, refrigerant boils until it's all vapor. If the vapor keeps picking up heat after that, it gets warmer than its boiling point. That extra is called superheat.",
            "Dentro del serpentín de adentro, el refrigerante hierve hasta que todo es vapor. Si el vapor sigue agarrando calor, se calienta más que su punto de ebullición. Ese extra se llama sobrecalentamiento."),
          T("Techs measure the pipe temperature and subtract the boiling temperature from the chart. Too much superheat means the coil is starved of refrigerant. Too little means liquid might be heading back to the compressor, which can damage it.",
            "Los técnicos miden la temperatura del tubo y le restan la de ebullición de la tabla. Mucho sobrecalentamiento significa que al serpentín le falta refrigerante. Muy poco significa que podría regresar líquido al compresor y dañarlo.")
        ],
        video: V.shsc,
        analogy: T("A pot of water stays at 212° while it boils. Once it boils dry, the empty pot heats past 212° fast. Superheat is that 'past boiling' part.",
          "Una olla con agua se queda en 212° mientras hierve. Cuando se seca, la olla vacía pasa de 212° rápido. El sobrecalentamiento es esa parte 'después de hervir'.")
      },
      { title: T("Subcooling: how much the liquid cooled after condensing", "Subenfriamiento: cuánto se enfrió el líquido después de condensarse"),
        body: [
          T("In the outdoor coil, the reverse happens. Hot vapor gives up heat and turns into liquid. If the liquid keeps cooling after that, it drops below its condensing temperature. That extra cooling is subcooling.",
            "En el serpentín de afuera pasa lo contrario. El vapor caliente suelta calor y se vuelve líquido. Si el líquido se sigue enfriando, baja de su temperatura de condensación. Ese enfriamiento extra es el subenfriamiento."),
          T("Together, superheat and subcooling let a tech see what's happening inside a sealed copper pipe without opening it.",
            "Juntos, el sobrecalentamiento y el subenfriamiento dejan que el técnico vea lo que pasa dentro de un tubo de cobre sellado sin abrirlo.")
        ],
        call: T("On a 95° afternoon the tech reads high superheat and low subcooling. Both numbers point the same way: the system is low on refrigerant, probably from a leak. Next step is finding the leak, not just topping it off.",
          "Una tarde de 95°, el técnico lee sobrecalentamiento alto y subenfriamiento bajo. Los dos números apuntan a lo mismo: al sistema le falta refrigerante, probablemente por una fuga. Lo siguiente es encontrar la fuga, no solo rellenar.")
      }
    ],
    recap: [
      T("Heat only flows from warmer to cooler on its own.", "El calor solo fluye de lo caliente a lo frío por sí solo."),
      T("Three ways heat travels: conduction, convection, radiation.", "Tres formas de viajar: conducción, convección, radiación."),
      T("Sensible heat changes temperature; latent heat moves water between liquid and vapor. ACs fight both.", "El calor sensible cambia la temperatura; el latente cambia el agua entre líquido y vapor. El aire combate los dos."),
      T("While boiling, pressure and temperature are locked. A P–T chart turns a gauge reading into a temperature.", "Al hervir, presión y temperatura están amarradas. Una tabla P–T convierte una lectura en temperatura."),
      T("Superheat = vapor warmer than boiling. Subcooling = liquid cooler than condensing. Together they show what's inside the pipe.", "Sobrecalentamiento = vapor más caliente que la ebullición. Subenfriamiento = líquido más frío que la condensación. Juntos muestran lo que hay dentro del tubo.")
    ],
    check: [
      { q: T("You hold a cold soda can. Which way does heat move?", "Sostienes una lata de refresco fría. ¿Hacia dónde va el calor?"),
        a: [T("From your hand into the can", "De tu mano a la lata"), T("From the can into your hand", "De la lata a tu mano"), T("It doesn't move", "No se mueve"), T("Cold flows into your hand", "El frío fluye a tu mano")],
        c: 0, why: T("Heat flows from warmer to cooler. 'Cold' is just less heat.", "El calor va de lo caliente a lo frío. El 'frío' es solo menos calor.") },
      { q: T("A fan blowing air across a hot coil carries the heat away. That's:", "Un ventilador que sopla aire por un serpentín caliente se lleva el calor. Eso es:"),
        a: [T("Convection", "Convección"), T("Conduction", "Conducción"), T("Radiation", "Radiación"), T("Insulation", "Aislamiento")],
        c: 0, why: T("Moving air or water carrying heat is convection.", "Aire o agua en movimiento llevando calor es convección.") },
      { q: T("Why does a humid 80° day feel worse than a dry 80° day?", "¿Por qué un día húmedo de 80° se siente peor que uno seco de 80°?"),
        a: [T("There's extra latent heat in the water vapor, and sweat can't evaporate as well", "Hay calor latente extra en el vapor de agua, y el sudor no se evapora igual"), T("The thermometer is wrong", "El termómetro está mal"), T("Humid air is colder", "El aire húmedo es más frío"), T("It doesn't", "No se siente peor")],
        c: 0, why: T("Moisture carries hidden heat, and your sweat can't cool you as well when the air is already wet.", "La humedad lleva calor escondido, y tu sudor no te enfría igual cuando el aire ya está mojado.") },
      { q: T("What does a pressure–temperature chart let a tech do?", "¿Qué le permite hacer a un técnico una tabla de presión–temperatura?"),
        a: [T("Turn a pressure reading into the refrigerant's boiling temperature", "Convertir una lectura de presión en la temperatura de ebullición del refrigerante"), T("Set the thermostat", "Programar el termostato"), T("Measure airflow", "Medir el aire"), T("Find the house's square footage", "Calcular los metros de la casa")],
        c: 0, why: T("While refrigerant is boiling, pressure and temperature are locked. The chart links them.", "Mientras el refrigerante hierve, presión y temperatura están amarradas. La tabla las relaciona.") },
      { q: T("High superheat and low subcooling on a hot day most likely mean:", "Sobrecalentamiento alto y subenfriamiento bajo en un día caliente casi siempre significan:"),
        a: [T("The system is low on refrigerant", "Al sistema le falta refrigerante"), T("The system has too much refrigerant", "Al sistema le sobra refrigerante"), T("The thermostat batteries are low", "Las pilas del termostato están bajas"), T("Everything is normal", "Todo está normal")],
        c: 0, why: T("A starved coil gives high superheat, and a short supply of liquid gives low subcooling. Find the leak.", "Un serpentín con poco refrigerante da sobrecalentamiento alto, y poco líquido da subenfriamiento bajo. Busca la fuga.") }
    ]
  });

  /* ---------------- Airflow (v66 quality pass) ---------------- */
  window.LESSONS.airflow = window.LESSONS.airflow || {
    module: "hvac101", icon: "💨", minutes: 12,
    title: T("Airflow: the other half of comfort", "Flujo de aire: la otra mitad del confort"),
    intro: T("If the air isn't moving, the best refrigeration cycle in the world can't do its job.", "Si el aire no se mueve, el mejor ciclo de refrigeración del mundo no puede hacer su trabajo.")
  };
  attach("airflow", {
    minutes: 12,
    steps: [
      { kicker: T("Airflow", "Flujo de aire"),
        title: T("Air is the delivery truck for heat", "El aire es el camión de reparto del calor"),
        body: [
          T("The refrigerant can only grab heat from air that actually touches the coil. If not enough air moves across it, the heat has no ride, no matter how good the rest of the system is.",
            "El refrigerante solo puede agarrar calor del aire que de verdad toca el serpentín. Si no pasa suficiente aire, el calor no tiene transporte, por bueno que sea el resto del sistema."),
          T("A lot of 'broken AC' calls turn out to be air problems: a clogged filter, a crushed duct, or closed vents.",
            "Muchas llamadas de 'aire descompuesto' resultan ser problemas de aire: un filtro tapado, un ducto aplastado o rejillas cerradas.")
        ],
        analogy: T("Blowing on hot soup cools it fast. Hold your breath and the soup stays hot. The coil is the soup; airflow is your breath.",
          "Soplarle a la sopa caliente la enfría rápido. Si aguantas la respiración, sigue caliente. El serpentín es la sopa; el aire es tu soplido.")
      },
      { title: T("Follow the air around the house", "Sigue el aire por la casa"),
        body: [
          T("Air leaves the rooms through a big grille called the return. It passes through the filter, then a blower (a big fan) pushes it across the indoor coil or the furnace's heat exchanger.",
            "El aire sale de los cuartos por una rejilla grande llamada retorno. Pasa por el filtro, y luego un soplador (un ventilador grande) lo empuja por el serpentín de adentro o el intercambiador del horno."),
          T("Conditioned air then travels through supply ducts and out the smaller vents in each room. Then it comes back to the return, and around it goes.",
            "El aire acondicionado viaja por los ductos de suministro y sale por las rejillas chicas de cada cuarto. Luego regresa al retorno, y otra vuelta.")
        ],
        visual: "airflow",
        analogy: T("Your lungs and blood vessels: the return breathes in, the blower is the heart, and the supply ducts are arteries carrying fresh air to every room.",
          "Tus pulmones y venas: el retorno inhala, el soplador es el corazón, y los ductos de suministro son arterias que llevan aire a cada cuarto.")
      },
      { title: T("What too little air does", "Qué pasa con muy poco aire"),
        body: [
          T("With too little air in cooling mode, the indoor coil gets colder and colder until moisture on it freezes into a block of ice. Then almost no air gets through at all.",
            "Con muy poco aire en modo de enfriamiento, el serpentín de adentro se pone cada vez más frío hasta que la humedad se congela en un bloque de hielo. Entonces casi no pasa aire."),
          T("In heating mode, a furnace with too little air overheats and shuts itself off on a safety switch, again and again.",
            "En modo de calefacción, un horno con muy poco aire se sobrecalienta y se apaga solo por un interruptor de seguridad, una y otra vez.")
        ],
        call: T("July call: the indoor coil is a block of ice and the filter looks like a rug. The fix starts with a new filter and thawing the coil — not with adding refrigerant.",
          "Llamada de julio: el serpentín de adentro es un bloque de hielo y el filtro parece tapete. La reparación empieza con un filtro nuevo y descongelar el serpentín, no con agregar refrigerante.")
      },
      { title: T("Leaky ducts waste air you paid to cool", "Los ductos con fugas tiran aire que pagaste por enfriar"),
        body: [
          T("Supply ducts often run through hot attics. Every gap or loose joint leaks cooled air into the attic instead of your bedroom. Leaky return ducts can suck hot, dusty attic air into the system.",
            "Los ductos de suministro muchas veces pasan por áticos calientes. Cada hueco o unión floja fuga aire frío al ático en vez de a tu recámara. Los ductos de retorno con fugas pueden jalar aire caliente y polvoso del ático."),
          T("Sealing ducts with mastic or proper tape can make a weak room feel like a new system.",
            "Sellar los ductos con mástique o cinta correcta puede hacer que un cuarto débil se sienta como sistema nuevo.")
        ],
        video: V.ducts,
        analogy: T("It's like watering the garden with a hose full of holes. The faucet is fine; the water just doesn't reach the end.",
          "Es como regar el jardín con una manguera llena de hoyos. La llave está bien; el agua no llega al final.")
      },
      { title: T("Static pressure: the duct system's blood pressure", "Presión estática: la presión arterial de los ductos"),
        body: [
          T("Techs measure how hard the blower has to push using a tool called a manometer. That reading is static pressure.",
            "Los técnicos miden qué tan fuerte tiene que empujar el soplador con una herramienta llamada manómetro. Esa lectura es la presión estática."),
          T("High static means something is choking the air: a dirty filter, undersized ducts, or a dirty coil. The blower works harder, moves less air, and wears out sooner.",
            "Estática alta significa que algo ahoga el aire: un filtro sucio, ductos muy chicos o un serpentín sucio. El soplador trabaja más, mueve menos aire y se gasta antes.")
        ],
        video: V.static,
        analogy: T("High blood pressure means your heart works harder to push blood through narrow vessels. High static means the blower works harder to push air through tight ducts.",
          "La presión alta significa que tu corazón trabaja más para empujar sangre por venas angostas. La estática alta significa que el soplador trabaja más para empujar aire por ductos apretados.")
      },
      { title: T("How much air is enough", "Cuánto aire es suficiente"),
        body: [
          T("Air is measured in CFM: cubic feet per minute. A common rule of thumb is about 400 CFM for every ton of cooling, adjusted for climate and the equipment maker's specs.",
            "El aire se mide en CFM: pies cúbicos por minuto. Una regla común es unos 400 CFM por cada tonelada de enfriamiento, ajustado al clima y a lo que pide el fabricante."),
          T("A 3-ton system needs roughly 1,200 CFM. Much less, and the coil gets too cold and does a poor job of drying the air. Much more, and the air comes out less dry and can feel clammy.",
            "Un sistema de 3 toneladas necesita unos 1,200 CFM. Mucho menos, y el serpentín se enfría de más y seca mal el aire. Mucho más, y el aire sale menos seco y se puede sentir húmedo.")
        ],
        call: T("Before telling a customer they need a bigger unit, a good tech checks the filter, measures static, and looks at the ducts. Many 'too small' systems are really 'can't breathe' systems.",
          "Antes de decirle a un cliente que necesita una unidad más grande, un buen técnico revisa el filtro, mide la estática y mira los ductos. Muchos sistemas 'muy chicos' en realidad 'no pueden respirar'.")
      }
    ],
    recap: [
      T("Air carries the heat to and from the coil. No airflow, no comfort.", "El aire lleva el calor al serpentín y desde él. Sin aire, no hay confort."),
      T("Return → filter → blower → coil → supply → rooms → back to return.", "Retorno → filtro → soplador → serpentín → suministro → cuartos → retorno."),
      T("Too little air freezes an AC coil and overheats a furnace.", "Muy poco aire congela el serpentín y sobrecalienta el horno."),
      T("Leaky ducts waste conditioned air and can pull in attic air.", "Los ductos con fugas tiran aire acondicionado y pueden jalar aire del ático."),
      T("High static means something is choking the air. Aim for roughly 400 CFM per ton.", "Estática alta significa que algo ahoga el aire. Busca unos 400 CFM por tonelada.")
    ],
    check: [
      { q: T("The indoor coil is covered in ice and the filter is filthy. What's the first fix?", "El serpentín de adentro está cubierto de hielo y el filtro está muy sucio. ¿Cuál es la primera reparación?"),
        a: [T("Replace the filter and thaw the coil", "Cambiar el filtro y descongelar el serpentín"), T("Add refrigerant right away", "Agregar refrigerante de inmediato"), T("Chip the ice off with a screwdriver", "Quitar el hielo con un desarmador"), T("Turn the thermostat lower", "Bajar más el termostato")],
        c: 0, why: T("Low airflow froze the coil. Restore air first. Chipping ice can puncture the coil.", "El poco aire congeló el serpentín. Primero devuelve el aire. Picar el hielo puede perforar el serpentín.") },
      { q: T("Which part pulls air from the rooms back to the equipment?", "¿Qué parte regresa el aire de los cuartos al equipo?"),
        a: [T("The return", "El retorno"), T("The supply vent", "La rejilla de suministro"), T("The condenser fan", "El ventilador del condensador"), T("The thermostat", "El termostato")],
        c: 0, why: T("The return grille and duct bring room air back through the filter to the blower.", "La rejilla y el ducto de retorno regresan el aire del cuarto por el filtro hasta el soplador.") },
      { q: T("High static pressure usually means:", "La presión estática alta casi siempre significa:"),
        a: [T("Something is restricting airflow, like a dirty filter or small ducts", "Algo está restringiendo el aire, como un filtro sucio o ductos chicos"), T("The system has too much refrigerant", "El sistema tiene demasiado refrigerante"), T("The thermostat is set too low", "El termostato está muy bajo"), T("The gas pressure is high", "La presión del gas está alta")],
        c: 0, why: T("Static is the duct system's resistance — the blower's 'blood pressure.'", "La estática es la resistencia de los ductos: la 'presión arterial' del soplador.") },
      { q: T("About how much air does a 3-ton AC need, using the 400 CFM per ton rule of thumb?", "Más o menos cuánto aire necesita un aire de 3 toneladas, con la regla de 400 CFM por tonelada?"),
        a: [T("About 1,200 CFM", "Unos 1,200 CFM"), T("About 300 CFM", "Unos 300 CFM"), T("About 4,000 CFM", "Unos 4,000 CFM"), T("Airflow doesn't matter", "El aire no importa")],
        c: 0, why: T("3 tons × 400 CFM per ton ≈ 1,200 CFM. Always confirm against the manufacturer's data.", "3 toneladas × 400 CFM por tonelada ≈ 1,200 CFM. Siempre confirma con los datos del fabricante.") },
      { q: T("Why can leaky supply ducts in an attic make a bedroom hot?", "¿Por qué los ductos de suministro con fugas en el ático pueden hacer que una recámara esté caliente?"),
        a: [T("Cooled air escapes into the attic before reaching the room", "El aire frío se escapa al ático antes de llegar al cuarto"), T("Leaks make the compressor run backward", "Las fugas hacen que el compresor corra al revés"), T("Attic air is always cold", "El aire del ático siempre está frío"), T("Leaks only affect noise", "Las fugas solo afectan el ruido")],
        c: 0, why: T("Like a hose full of holes: the system makes cool air, but it never gets to the end of the line.", "Como una manguera con hoyos: el sistema hace aire frío, pero nunca llega al final.") }
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

  /* ---------------- EPA 608 Type I ---------------- */
  attach("epa-t1-guide", {
    minutes: 12,
    steps: [
      { kicker: T("EPA 608 Type I", "EPA 608 Tipo I"),
        title: T("Type I is the fridge, the window unit, and the other sealed boxes", "El Tipo I es el refri, la unidad de ventana y las otras cajas selladas"),
        body: [
          T("Think of the appliances already in a kitchen, a dorm, or a break room: a refrigerator, a freezer, a window air conditioner, a dehumidifier, a water cooler, a vending machine. They leave the factory already sealed, with five pounds of refrigerant or less inside. That is the whole definition of a 'small appliance.'",
            "Piensa en los aparatos que ya están en una cocina, un dormitorio o un comedor: un refrigerador, un congelador, un aire de ventana, un deshumidificador, un enfriador de agua, una máquina expendedora. Salen de fábrica ya sellados, con cinco libras de refrigerante o menos adentro. Esa es toda la definición de un 'aparato pequeño'."),
          T("Type I is its own certification because these units are everywhere, they usually have no regular service ports, and it is tempting to just let the charge hiss out when you throw one away. The law does not allow that.",
            "El Tipo I es su propia certificación porque estos equipos están en todos lados, casi nunca traen puertos de servicio normales, y es tentador dejar que la carga silbe hacia afuera cuando los tiras. La ley no lo permite.")
        ]
      },
      { title: T("Get the refrigerant out before you open it or throw it away", "Saca el refrigerante antes de abrirlo o tirarlo"),
        body: [
          T("Before you cut into a sealed system, or before a fridge or window unit goes to the scrap pile, the refrigerant has to come out into a proper recovery cylinder. Opening a process tube and letting it hiss empty is venting, and venting is illegal.",
            "Antes de cortar un sistema sellado, o antes de que un refri o un aire de ventana vaya a la chatarra, el refrigerante tiene que salir a un cilindro de recuperación correcto. Abrir un tubo de proceso y dejarlo silbar hasta vaciarse es liberar, y liberar es ilegal.")
        ],
        call: T("A landlord says, 'It's just a dorm fridge — pop the tube and toss it.' That shortcut is how refrigerant ends up in the air, and it is exactly what Type I certification is meant to stop.",
          "Un dueño dice: 'Es solo un refri de dormitorio: ábrele el tubo y tíralo.' Ese atajo es cómo el refrigerante termina en el aire, y es justo lo que la certificación Tipo I está pensada para detener.")
      },
      { title: T("How much you have to recover, and why the number changes", "Cuánto tienes que recuperar, y por qué cambia el número"),
        body: [
          T("With the recovery equipment you'll actually use — machines made after November 15, 1993 — you must recover 90% of the charge if the compressor still runs, or 80% if the compressor is dead. You can also satisfy the rule by pulling the unit down to a 4-inch mercury vacuum.",
            "Con el equipo de recuperación que realmente vas a usar — máquinas hechas después del 15 de noviembre de 1993 — debes recuperar el 90% de la carga si el compresor todavía corre, o el 80% si el compresor está muerto. También cumples la regla si bajas la unidad a un vacío de 4 pulgadas de mercurio."),
          T("The compressor is why those numbers are different. When it still runs, it helps push refrigerant out, so the law asks for more. When it is dead, some refrigerant hides in the oil and is harder to get, so 80% is the requirement — unless you pull that 4-inch vacuum instead.",
            "El compresor es la razón de que esos números sean distintos. Cuando todavía corre, ayuda a empujar el refrigerante hacia afuera, así que la ley pide más. Cuando está muerto, parte del refrigerante se esconde en el aceite y es más difícil de sacar, así que el requisito es 80% — a menos que en su lugar hagas ese vacío de 4 pulgadas.")
        ],
        analogy: T("It's like emptying a squeeze bottle. If you can still squeeze (the compressor runs), you can get almost all of it out. If you can't, you pour what you can and accept that a little stays behind — unless you hook up a pump and pull a vacuum.",
          "Es como vaciar un bote que se aprieta. Si todavía puedes apretar (el compresor corre), sacas casi todo. Si no, viertes lo que puedes y aceptas que queda un poco — a menos que conectes una bomba y hagas vacío.")
      },
      { title: T("Two ways to pull the charge: your machine, or the appliance itself", "Dos formas de sacar la carga: tu máquina, o el mismo aparato"),
        body: [
          T("A self-contained, or active, recovery machine has its own compressor. It is a pump that pulls refrigerant out of the appliance and into your cylinder. That is the method you'll use most.",
            "Una máquina de recuperación autocontenida, o activa, tiene su propio compresor. Es una bomba que saca el refrigerante del aparato y lo manda a tu cilindro. Ese es el método que más vas a usar."),
          T("A system-dependent, or passive, method uses the appliance's own compressor or its own pressure to push refrigerant into a cylinder. You may only use that method on appliances that hold 15 pounds or less — which includes every Type I small appliance. If the compressor is dead, you have to open a path on both the high side and the low side, or a lot of the charge will stay trapped.",
            "Un método dependiente del sistema, o pasivo, usa el propio compresor del aparato o su propia presión para empujar el refrigerante a un cilindro. Solo puedes usar ese método en aparatos que tienen 15 libras o menos — y eso incluye todo aparato pequeño Tipo I. Si el compresor está muerto, tienes que abrir un camino en el lado alto y en el lado bajo, o gran parte de la carga se queda atrapada.")
        ],
        video: V.t1recover,
        analogy: T("Active recovery is bringing your own shop-vac. Passive recovery is tipping the bucket and letting it pour — it only works on small containers, and only if there's something left to push the liquid out.",
          "La recuperación activa es traer tu propia aspiradora de taller. La pasiva es inclinar el balde y dejar que se vacíe: solo sirve en recipientes pequeños, y solo si queda algo que empuje el líquido hacia afuera.")
      },
      { title: T("Getting in: piercing valves are a temporary door, not a new port", "Cómo entrar: las válvulas de perforación son una puerta temporal, no un puerto nuevo"),
        body: [
          T("Most small appliances have no regular service ports. A piercing valve, sometimes called a saddle or bullet valve, clamps onto a straight piece of copper and pokes a hole so you can hook up and recover. Wear glasses and gloves — refrigerant can spray when the tube is pierced.",
            "La mayoría de los aparatos pequeños no tienen puertos de servicio normales. Una válvula de perforación, a veces llamada de silla o de bala, se sujeta a un tramo recto de cobre y hace un agujero para que puedas conectar y recuperar. Usa lentes y guantes: el refrigerante puede salir disparado al perforar el tubo."),
          T("These valves can leak later. If the appliance is being repaired and will stay in service, don't leave the piercing valve on as a permanent port. Recover, make a proper repair, and use a real process stub or service fitting if the unit needs one. If you are disposing of the unit, recover first, then it can be scrapped.",
            "Estas válvulas pueden fugar después. Si el aparato se va a reparar y se queda en servicio, no dejes la válvula de perforación como puerto permanente. Recupera, haz una reparación correcta y usa un tubo de proceso o un fitting de servicio de verdad si lo necesita. Si lo estás desechando, recupera primero y luego se puede chatarrear.")
        ],
        call: T("You get a 'dead fridge, just recycle it' call. The compressor doesn't run. You install piercing access on both sides, recover to the 80% rule or a 4-inch vacuum, and only then do you let it go to the scrap truck. You do not leave a piercing valve on a fridge the family still wants to keep.",
          "Te toca una llamada de 'el refri está muerto, solo recíclalo.' El compresor no corre. Instalas acceso de perforación en ambos lados, recuperas al 80% o a un vacío de 4 pulgadas, y solo entonces va al camión de chatarra. No dejas una válvula de perforación en un refri que la familia todavía quiere usar.")
      }
    ],
    recap: [
      T("Type I covers factory-sealed appliances with 5 pounds of refrigerant or less — fridges, window units, dehumidifiers, vending machines.", "El Tipo I cubre aparatos sellados de fábrica con 5 libras de refrigerante o menos: refris, unidades de ventana, deshumidificadores, expendedoras."),
      T("Recover before you open the system or throw the unit away. Letting it hiss out is venting.", "Recupera antes de abrir el sistema o tirar la unidad. Dejar que silbe hacia afuera es liberar."),
      T("With modern recovery equipment: 90% if the compressor runs, 80% if it doesn't — or a 4-inch vacuum.", "Con equipo de recuperación moderno: 90% si el compresor corre, 80% si no — o un vacío de 4 pulgadas."),
      T("System-dependent recovery is only for appliances with 15 pounds or less. Piercing valves are temporary. If the compressor is dead, access both sides.", "La recuperación dependiente del sistema solo es para aparatos de 15 libras o menos. Las válvulas de perforación son temporales. Si el compresor está muerto, accede a ambos lados.")
    ],
    check: [
      { q: T("Which of these is a Type I 'small appliance'?", "¿Cuál de estos es un 'aparato pequeño' Tipo I?"),
        a: [T("A kitchen refrigerator, factory-sealed with 5 pounds of refrigerant or less", "Un refrigerador de cocina, sellado de fábrica con 5 libras de refrigerante o menos"), T("A 3-ton split-system air conditioner at a house", "Un aire acondicionado split de 3 toneladas en una casa"), T("A centrifugal chiller in a building basement", "Un chiller centrífugo en el sótano de un edificio"), T("The air conditioner in a car", "El aire acondicionado de un auto")],
        c: 0, why: T("Type I is factory-sealed equipment with 5 pounds or less. A house split is Type II, a low-pressure chiller is Type III, and car AC is a different certification (609).", "El Tipo I es equipo sellado de fábrica con 5 libras o menos. Un split de casa es Tipo II, un chiller de baja presión es Tipo III, y el AC de auto es otra certificación (609).") },
      { q: T("The compressor on a window unit still runs. You are using a recovery machine made after 1993. How much refrigerant do you have to recover?", "El compresor de un aire de ventana todavía corre. Usas una máquina de recuperación hecha después de 1993. ¿Cuánto refrigerante tienes que recuperar?"),
        a: [T("90% of the charge, or pull a 4-inch vacuum", "El 90% de la carga, o un vacío de 4 pulgadas"), T("80% of the charge only — 90% is never required", "Solo el 80% de la carga: el 90% nunca se exige"), T("Half the charge is enough", "La mitad de la carga es suficiente"), T("You can vent what's left once the unit is outside", "Puedes liberar lo que queda si la unidad ya está afuera")],
        c: 0, why: T("With post-1993 equipment and a running compressor, the rule is 90%, or a 4-inch mercury vacuum. 80% is the number when the compressor is dead.", "Con equipo de después de 1993 y un compresor que corre, la regla es 90%, o un vacío de 4 pulgadas de mercurio. El 80% es el número cuando el compresor está muerto.") },
      { q: T("When may you use system-dependent (passive) recovery, which uses the appliance itself to push the charge out?", "¿Cuándo puedes usar recuperación dependiente del sistema (pasiva), que usa el mismo aparato para empujar la carga?"),
        a: [T("Only on appliances that hold 15 pounds of refrigerant or less", "Solo en aparatos que tienen 15 libras de refrigerante o menos"), T("On any rooftop unit, as long as you're in a hurry", "En cualquier unidad de azotea, si tienes prisa"), T("Only on low-pressure chillers", "Solo en chillers de baja presión"), T("Anytime the recovery machine is broken", "Siempre que la máquina de recuperación esté descompuesta")],
        c: 0, why: T("The law limits system-dependent recovery to appliances with a full charge of 15 pounds or less, unless a pump-out unit is permanently attached. That includes Type I small appliances. A big rooftop or a chiller is not in that group.", "La ley limita la recuperación dependiente del sistema a aparatos con 15 libras o menos, salvo una unidad de bombeo permanente. Eso incluye los aparatos pequeños Tipo I. Una azotea grande o un chiller no entran.") },
      { q: T("You need to recover a sealed dorm fridge that has no service ports. Which statement is right?", "Tienes que recuperar un refri de dormitorio sellado que no tiene puertos de servicio. ¿Cuál afirmación es correcta?"),
        a: [T("A piercing valve can get you in, but don't leave it on a unit that will stay in service", "Una válvula de perforación te puede dar acceso, pero no la dejes en una unidad que se va a quedar en servicio"), T("Leave the piercing valve on forever — it is as good as a factory port", "Déjala puesta para siempre: es tan buena como un puerto de fábrica"), T("Skip recovery if the fridge is going to the scrap yard", "Sáltate la recuperación si el refri va a la chatarra"), T("Pierce only the low side even if the compressor is dead and you can't move the charge", "Perfora solo el lado bajo aunque el compresor esté muerto y no puedas mover la carga")],
        c: 0, why: T("Piercing valves are a temporary door. They can leak later, so they should not stay on an appliance the customer will keep. If the compressor is dead, you need access on both sides, and you still have to recover before disposal.", "Las válvulas de perforación son una puerta temporal. Pueden fugar después, así que no deben quedarse en un aparato que el cliente va a conservar. Si el compresor está muerto, necesitas acceso en ambos lados, y aún así tienes que recuperar antes de desecharlo.") }
    ]
  });

  /* ---------------- EPA 608 Type II ---------------- */
  attach("epa-t2-guide", {
    minutes: 14,
    steps: [
      { kicker: T("EPA 608 Type II", "EPA 608 Tipo II"),
        title: T("Type II is the house AC, the rooftop, and the grocery-store rack", "El Tipo II es el AC de la casa, la azotea y el rack del supermercado"),
        body: [
          T("Type II covers medium-pressure, high-pressure, and very high-pressure systems — except small appliances and car air conditioners. The unit that cools a house, a rooftop package unit, a heat pump, and the rack that keeps a grocery case cold all live here.",
            "El Tipo II cubre sistemas de media, alta y muy alta presión, excepto aparatos pequeños y el aire del auto. La unidad que enfría una casa, un paquete de azotea, una bomba de calor y el rack que mantiene fría una vitrina de supermercado viven aquí."),
          T("The fridge in the kitchen is Type I. The giant low-pressure chiller in a building basement is Type III. Car AC is a separate certification. Type II is everything in between that uses the higher-pressure refrigerants you'll see on most service calls, like R-22 and R-410A.",
            "El refri de la cocina es Tipo I. El gran chiller de baja presión en el sótano de un edificio es Tipo III. El AC del auto es otra certificación. El Tipo II es todo lo de en medio que usa los refrigerantes de más presión que vas a ver en la mayoría de las llamadas, como R-22 y R-410A.")
        ]
      },
      { title: T("If a system holds 50 pounds or more, the law tracks how fast it leaks", "Si un sistema tiene 50 libras o más, la ley sigue qué tan rápido fuga"),
        body: [
          T("For appliances with 50 pounds or more of an ozone-depleting refrigerant (the older CFC and HCFC stuff, like R-22, or a blend that contains one), the owner has to watch the leak rate. If it goes over the limit, the leak generally has to be repaired within 30 days — or the equipment has to be retrofitted or retired.",
            "En aparatos con 50 libras o más de un refrigerante que agota el ozono (los CFC y HCFC viejos, como el R-22, o una mezcla que lo contiene), el dueño tiene que vigilar la tasa de fuga. Si se pasa del límite, en general hay que reparar la fuga en un plazo de 30 días, o cambiar o retirar el equipo."),
          T("The limits are easy to remember as Comfort 10, Commercial 20, Industrial 30: 10% a year for comfort cooling (the AC that keeps people comfortable), 20% for commercial refrigeration (grocery cases, walk-ins), and 30% for industrial process refrigeration.",
            "Los límites se recuerdan fácil como Confort 10, Comercial 20, Industrial 30: 10% al año para enfriamiento de confort (el AC que mantiene cómoda a la gente), 20% para refrigeración comercial (vitrinas, cámaras), y 30% para refrigeración de proceso industrial.")
        ],
        analogy: T("Leak rate is like a tire that loses air. Losing a little every month can still leave you flat by the end of the year. The percentages are that yearly loss compared with a full charge.",
          "La tasa de fuga es como una llanta que pierde aire. Perder un poco cada mes igual te deja ponchado al cabo del año. Los porcentajes son esa pérdida anual comparada con una carga completa."),
        call: T("A supermarket rack holds 300 pounds of R-22. Over a year it needs 75 pounds added back. That's 25%. Commercial refrigeration's limit is 20%, so this one is over the line and has to be addressed.",
          "Un rack de supermercado tiene 300 libras de R-22. En un año hay que reponerle 75 libras. Eso es 25%. El límite de la refrigeración comercial es 20%, así que este ya se pasó y hay que atenderlo.")
      },
      { title: T("How deep you have to recover depends on the refrigerant and the charge", "Qué tan profundo tienes que recuperar depende del refrigerante y de la carga"),
        body: [
          T("Once you are off a small appliance, the law sets a vacuum level you have to reach before you open the system or scrap it. Almost every recovery machine you'll use was made after November 15, 1993, so memorize the 'after 1993' column.",
            "Cuando ya no es un aparato pequeño, la ley fija el nivel de vacío que debes alcanzar antes de abrir el sistema o chatarrearlo. Casi toda máquina de recuperación que uses se hizo después del 15 de noviembre de 1993, así que memoriza la columna de 'después de 1993'."),
          T("Most of the systems you'll work on are high-pressure — R-22 and R-410A live here. If the unit holds less than 200 pounds, you recover until you are at 0 inches of vacuum, which is back to outdoor air pressure. If it holds 200 pounds or more, you keep going to a 10-inch vacuum so less is left inside.",
            "La mayoría de los sistemas que vas a trabajar son de alta presión: ahí viven el R-22 y el R-410A. Si la unidad tiene menos de 200 libras, recuperas hasta 0 pulgadas de vacío, que es volver a la presión del aire de afuera. Si tiene 200 libras o más, sigues hasta un vacío de 10 pulgadas para que quede menos adentro.")
        ],
        analogy: T("Think of wringing out a sponge. A small, high-pressure system can be wrung to 'just damp' (0 inches). A bigger charge, or a medium-pressure one, has to be wrung harder so less is left in the corners.",
          "Piensa en escurrir una esponja. Un sistema pequeño de alta presión se puede escurrir hasta 'solo húmedo' (0 pulgadas). Una carga más grande, o una de media presión, hay que escurrirla más fuerte para que quede menos en las esquinas.")
      },
      { title: T("The other pressure groups get their own numbers", "Los otros grupos de presión tienen sus propios números"),
        body: [
          T("Medium-pressure refrigerants (like R-12 and R-134a on this test) need a deeper pull: 10 inches if the charge is under 200 pounds, 15 inches if it is 200 or more. Very high-pressure specialty refrigerants only have to be recovered to 0 inches of vacuum.",
            "Los refrigerantes de media presión (como el R-12 y el R-134a en este examen) piden un vacío más profundo: 10 pulgadas si la carga es menor de 200 libras, 15 pulgadas si es de 200 o más. Los refrigerantes especiales de muy alta presión solo hay que recuperarlos a 0 pulgadas de vacío.")
        ],
        call: T("On the test, read the refrigerant first, then the charge size, then the year of the recovery machine. Those three facts pick the row.", "En el examen, lee primero el refrigerante, luego el tamaño de la carga y luego el año de la máquina de recuperación. Esos tres datos eligen el renglón.")
      },
      { title: T("How you actually pull a charge on a real unit", "Cómo sacas una carga de verdad en una unidad real"),
        body: [
          T("Recover liquid first, then the remaining vapor. Liquid moves a lot of refrigerant in a short time; vapor is slower and gets what's left. Weigh the recovery cylinder and never fill it more than 80% by weight — a hot truck will make the liquid expand. Identify the refrigerant, use certified recovery equipment, and keep the hoses short and tight.",
            "Recupera primero el líquido y luego el vapor que queda. El líquido mueve mucho refrigerante en poco tiempo; el vapor es más lento y saca lo que falta. Pesa el cilindro de recuperación y nunca lo llenes a más del 80% por peso: una camioneta caliente hace que el líquido se expanda. Identifica el refrigerante, usa equipo de recuperación certificado y mantén las mangueras cortas y bien puestas."),
          T("When you look for leaks, oil spots and numbers that don't look right are clues. Pressurize with dry nitrogen — never oxygen or shop air, which can turn oil into a bomb. A little soap solution, an electronic detector, or an ultrasonic detector will show you where it is coming from.",
            "Cuando buscas fugas, las manchas de aceite y los números que no cuadran son pistas. Presuriza con nitrógeno seco: nunca oxígeno ni aire del taller, que pueden convertir el aceite en una bomba. Un poco de agua jabonosa, un detector electrónico o uno ultrasónico te muestran de dónde sale.")
        ],
        video: V.recover,
        call: T("It's 95°F, you're recovering a 5-ton R-410A changeout, and the cylinder is already heavy. Check the scale before you keep going. An overfilled gray-and-yellow recovery bottle on a hot truck is a safety problem, not just a paperwork one.",
          "Hace 95°F, estás recuperando un cambio de 5 toneladas de R-410A, y el cilindro ya está pesado. Revisa la báscula antes de seguir. Una botella de recuperación gris y amarilla sobrecargada en una camioneta caliente es un problema de seguridad, no solo de papeles.")
      }
    ],
    recap: [
      T("Type II is medium-, high-, and very high-pressure equipment — house splits, heat pumps, rooftops, and commercial racks — not fridges, cars, or low-pressure chillers.", "El Tipo II es equipo de media, alta y muy alta presión: splits de casa, bombas de calor, azoteas y racks comerciales; no refris, autos ni chillers de baja presión."),
      T("For 50+ pound ozone-depleting systems: Comfort 10, Commercial 20, Industrial 30. Repair is generally due within 30 days.", "En sistemas de 50 libras o más que agotan el ozono: Confort 10, Comercial 20, Industrial 30. En general hay que reparar en 30 días."),
      T("With post-1993 equipment, high-pressure under 200 lb recovers to 0 inches of vacuum; 200 lb or more goes to 10 inches. Medium-pressure is 10 inches under 200 lb and 15 inches at 200 lb or more.", "Con equipo de después de 1993, la alta presión de menos de 200 lb se recupera a 0 pulgadas de vacío; 200 lb o más, a 10 pulgadas. La media presión es 10 pulgadas bajo 200 lb y 15 pulgadas a 200 lb o más."),
      T("Recover liquid first, then vapor. Never fill a recovery cylinder over 80%. Leak-check with nitrogen, never oxygen or shop air.", "Recupera líquido primero y luego vapor. Nunca llenes un cilindro de recuperación a más del 80%. Busca fugas con nitrógeno, nunca con oxígeno ni aire de taller.")
    ],
    check: [
      { q: T("Which job is Type II?", "¿Cuál trabajo es Tipo II?"),
        a: [T("A 3-ton split-system air conditioner at a house", "Un aire acondicionado split de 3 toneladas en una casa"), T("A kitchen refrigerator with 4 ounces of refrigerant", "Un refrigerador de cocina con 4 onzas de refrigerante"), T("A low-pressure centrifugal chiller", "Un chiller centrífugo de baja presión"), T("Recharging the air conditioner in a pickup truck", "Recargar el aire acondicionado de una troquita")],
        c: 0, why: T("A residential split is a high-pressure appliance, so it is Type II. The fridge is Type I, the low-pressure chiller is Type III, and vehicle AC is Section 609, not 608 Type II.", "Un split residencial es un aparato de alta presión, así que es Tipo II. El refri es Tipo I, el chiller de baja presión es Tipo III, y el AC de vehículo es la Sección 609, no el Tipo II de 608.") },
      { q: T("A comfort-cooling system holds 50 pounds or more of an ozone-depleting refrigerant. At what yearly leak rate must the leak be addressed?", "Un sistema de enfriamiento de confort tiene 50 libras o más de un refrigerante que agota el ozono. ¿A qué tasa de fuga anual hay que atender la fuga?"),
        a: [T("Over 10%", "Más del 10%"), T("Over 20%", "Más del 20%"), T("Over 30%", "Más del 30%"), T("Over 50%", "Más del 50%")],
        c: 0, why: T("Comfort cooling is 10%. Commercial refrigeration is 20%. Industrial process is 30%. Remember: Comfort 10, Commercial 20, Industrial 30.", "El enfriamiento de confort es 10%. La refrigeración comercial es 20%. El proceso industrial es 30%. Recuerda: Confort 10, Comercial 20, Industrial 30.") },
      { q: T("You are using a recovery machine made after 1993 on a high-pressure R-410A split that holds less than 200 pounds. What vacuum does the law require before you open it?", "Usas una máquina de recuperación hecha después de 1993 en un split de alta presión R-410A que tiene menos de 200 libras. ¿Qué vacío exige la ley antes de abrirlo?"),
        a: [T("0 inches of mercury vacuum (back to outdoor air pressure)", "0 pulgadas de vacío de mercurio (volver a la presión del aire de afuera)"), T("10 inches of mercury vacuum", "10 pulgadas de vacío de mercurio"), T("15 inches of mercury vacuum", "15 pulgadas de vacío de mercurio"), T("25 mm Hg absolute", "25 mm Hg absolutos")],
        c: 0, why: T("High-pressure appliances under 200 pounds, with post-1993 equipment, recover to 0 inches of vacuum. 10 inches is the number when that same high-pressure system holds 200 pounds or more. 15 inches is medium-pressure at 200 pounds or more. 25 mm Hg absolute is Type III (low-pressure).", "Los aparatos de alta presión de menos de 200 libras, con equipo de después de 1993, se recuperan a 0 pulgadas de vacío. 10 pulgadas es el número cuando ese mismo sistema de alta presión tiene 200 libras o más. 15 pulgadas es media presión a 200 libras o más. 25 mm Hg absolutos es Tipo III (baja presión).") },
      { q: T("A 300-pound R-22 supermarket rack needs 75 pounds added over a year. What does that tell you?", "Un rack de supermercado de 300 libras de R-22 necesita que le agreguen 75 libras en un año. ¿Qué te dice eso?"),
        a: [T("That's a 25% leak rate, over the 20% commercial limit, so it has to be addressed", "Es una tasa de fuga del 25%, por encima del límite comercial del 20%, así que hay que atenderlo"), T("That's under every leak limit, so no one has to do anything", "Está bajo todos los límites de fuga, así que nadie tiene que hacer nada"), T("Leak rates only apply to window air conditioners", "Las tasas de fuga solo aplican a aires de ventana"), T("You should vent the rest and start over", "Debes liberar el resto y empezar de cero")],
        c: 0, why: T("75 ÷ 300 = 25%. Commercial refrigeration's threshold is 20% per year on a 50-pound-or-more ozone-depleting system, so this rack is over the line. Comfort would have been 10%; industrial would have been 30%.", "75 ÷ 300 = 25%. El umbral de la refrigeración comercial es 20% al año en un sistema de 50 libras o más que agota el ozono, así que este rack ya se pasó. En confort habría sido 10%; en industrial, 30%.") }
    ]
  });

  /* ---------------- EPA 608 Type III ---------------- */
  attach("epa-t3-guide", {
    minutes: 12,
    steps: [
      { kicker: T("EPA 608 Type III", "EPA 608 Tipo III"),
        title: T("Type III is the big low-pressure chiller that cools a whole building", "El Tipo III es el gran chiller de baja presión que enfría todo un edificio"),
        body: [
          T("A low-pressure chiller is the machine in a basement or mechanical room that makes cold water for an entire building. The refrigerant inside — often something like R-123 or a newer low-pressure replacement — boils at such a low pressure that part of the machine actually runs below outdoor air pressure: in a vacuum.",
            "Un chiller de baja presión es la máquina en un sótano o cuarto de máquinas que hace agua fría para todo un edificio. El refrigerante de adentro — a menudo algo como R-123 o un reemplazo nuevo de baja presión — hierve a una presión tan baja que parte de la máquina corre por debajo de la presión del aire de afuera: en un vacío."),
          T("That one fact changes almost everything about how you service it. Type I was the fridge. Type II was the house AC and the rooftop. Type III is this vessel, and you treat it carefully.",
            "Ese solo hecho cambia casi todo en cómo lo sirves. El Tipo I era el refri. El Tipo II era el AC de la casa y la azotea. El Tipo III es este recipiente, y lo tratas con cuidado.")
        ],
        video: V.chiller
      },
      { title: T("Leaks on this machine often suck air in, not just let refrigerant out", "En esta máquina, las fugas a menudo meten aire, no solo dejan salir refrigerante"),
        body: [
          T("Because part of the chiller is under a vacuum, a pinhole on the low side can pull air and moisture in. Air is a non-condensable: it takes up space, raises head pressure, and makes the machine work harder. A purge unit is the little separator that pulls that air back out and tries not to throw refrigerant away with it.",
            "Como parte del chiller está en vacío, un pinhole en el lado bajo puede meter aire y humedad. El aire es un no condensable: ocupa espacio, sube la presión de descarga y hace que la máquina trabaje más. Una unidad de purga es el pequeño separador que saca ese aire y trata de no tirar refrigerante junto con él."),
          T("If the purge starts running a lot more than it used to, that is an early leak warning. The machine is telling you it is swallowing air.",
            "Si la purga empieza a correr mucho más que antes, eso es una alerta temprana de fuga. La máquina te está diciendo que está tragando aire.")
        ],
        analogy: T("A low-pressure chiller is like a straw in a drink. A pinhole in the straw doesn't spray the drink out — it sucks air in and the sip gets weak. The purge is the burp that gets that air out of the line.",
          "Un chiller de baja presión es como un popote en una bebida. Un pinhole en el popote no rocía la bebida hacia afuera: mete aire y el sorbo queda flojo. La purga es el eructo que saca ese aire de la línea."),
        call: T("A building engineer says the chiller 'is always purging now.' You don't ignore that. You look for the leak, because a purge that runs for hours is rarely 'just how this old machine is.'",
          "Un ingeniero del edificio dice que el chiller 'ahora está purgando todo el tiempo.' No lo ignores. Buscas la fuga, porque una purga que corre horas casi nunca es 'así es esta máquina vieja.'")
      },
      { title: T("When you look for a leak, don't blow the rupture disc", "Cuando buscas una fuga, no revientes el disco de ruptura"),
        body: [
          T("These vessels are not built for high pressure. A rupture disc — usually rated around 15 psig — is the emergency relief. If you over-pressurize the chiller, the disc bursts and you have a much worse day.",
            "Estos recipientes no están hechos para alta presión. Un disco de ruptura, por lo general calibrado cerca de 15 psig, es el alivio de emergencia. Si presurizas de más el chiller, el disco revienta y el día se te pone mucho peor."),
          T("To leak-test, raise the pressure gently: controlled warm water or heating blankets, or a little dry nitrogen. Stay around 10 psig, under that 15 psig disc. Then use soap, an electronic detector, or ultrasonic listening to find the leak. Never use a torch to heat a refrigerant vessel, and never use oxygen or shop air.",
            "Para probar fugas, sube la presión con cuidado: agua tibia controlada o cobertores térmicos, o un poco de nitrógeno seco. Quédate cerca de 10 psig, por debajo de ese disco de 15 psig. Luego usa jabón, un detector electrónico o escucha ultrasónica para hallar la fuga. Nunca uses un soplete para calentar un recipiente de refrigerante, y nunca uses oxígeno ni aire de taller.")
        ]
      },
      { title: T("Recover liquid first, keep the water moving, and pull a deep vacuum", "Recupera el líquido primero, mantén el agua en movimiento y haz un vacío profundo"),
        body: [
          T("Same idea as Type II, with two chiller-specific rules. Take the liquid out first, then the vapor. Keep water circulating through the tubes so they don't freeze as the pressure drops. Freeze a tube bundle and you can crack it.",
            "La misma idea que en el Tipo II, con dos reglas propias del chiller. Saca primero el líquido y luego el vapor. Mantén el agua circulando por los tubos para que no se congelen cuando baja la presión. Si congelas un paquete de tubos, lo puedes agrietar."),
          T("The required recovery level is 25 millimeters of mercury absolute — a deep vacuum, close to a nearly empty vessel. That is not the same thing as 25 inches of vacuum, and it is much deeper than the 4- or 10-inch numbers from Type I and Type II. When you charge back, add vapor first until the pressure is high enough that liquid won't freeze the water in the tubes, then add liquid.",
            "El nivel de recuperación exigido es 25 milímetros de mercurio absolutos: un vacío profundo, casi un recipiente vacío. No es lo mismo que 25 pulgadas de vacío, y es mucho más profundo que los números de 4 o 10 pulgadas del Tipo I y el Tipo II. Cuando vuelvas a cargar, agrega vapor primero hasta que la presión sea lo bastante alta para que el líquido no congele el agua de los tubos, y luego agrega líquido.")
        ],
        analogy: T("25 mm Hg absolute is like almost all the air sucked out of a jar. 25 inches of vacuum is a different, shallower measurement. On this test, low-pressure chillers want the deep one: 25 mm Hg absolute.",
          "25 mm Hg absolutos es como succionar casi todo el aire de un frasco. 25 pulgadas de vacío es otra medida, menos profunda. En este examen, los chillers de baja presión piden la profunda: 25 mm Hg absolutos."),
        call: T("You're recovering a chiller on a tight schedule. If you skip the water pumps, the barrel can frost and a tube can suffer. Keep the pumps on, liquid first, then vapor, down to 25 mm Hg absolute.",
          "Estás recuperando un chiller con poco tiempo. Si te saltas las bombas de agua, el tanque se puede escarchar y un tubo puede sufrir. Deja las bombas encendidas, líquido primero, luego vapor, hasta 25 mm Hg absolutos.")
      }
    ],
    recap: [
      T("Type III is low-pressure appliances — mainly centrifugal chillers — where part of the system runs in a vacuum.", "El Tipo III es aparatos de baja presión, sobre todo chillers centrífugos, donde parte del sistema corre en un vacío."),
      T("Leaks can suck air in. A purge unit removes that air. A purge that runs a lot more than usual is a leak warning.", "Las fugas pueden meter aire. Una unidad de purga saca ese aire. Una purga que corre mucho más de lo usual es una alerta de fuga."),
      T("Leak-test gently, around 10 psig, so you stay under the 15 psig rupture disc. Never heat a vessel with a torch.", "Prueba fugas con suavidad, cerca de 10 psig, para quedarte bajo el disco de ruptura de 15 psig. Nunca calientes un recipiente con soplete."),
      T("Recover liquid first, keep water circulating, and pull to 25 mm Hg absolute. Charge vapor first, then liquid, so the tubes don't freeze.", "Recupera el líquido primero, mantén el agua circulando y llega a 25 mm Hg absolutos. Carga vapor primero y luego líquido, para que los tubos no se congelen.")
    ],
    check: [
      { q: T("Why can a leak on a low-pressure chiller pull air in?", "¿Por qué una fuga en un chiller de baja presión puede meter aire?"),
        a: [T("Part of the system runs below outdoor air pressure, in a vacuum", "Parte del sistema corre por debajo de la presión del aire de afuera, en un vacío"), T("The refrigerant is always at 400 psig, so air is sucked toward it", "El refrigerante siempre está a 400 psig, así que el aire es succionado hacia él"), T("Window units always pull air in, and a chiller is the same thing", "Los aires de ventana siempre meten aire, y un chiller es lo mismo"), T("Air is heavier than refrigerant, so it falls in through the drain", "El aire es más pesado que el refrigerante, así que cae por el desagüe")],
        c: 0, why: T("The low side of these chillers is under a vacuum. A pinhole can let outdoor air and moisture in. That's why a purge unit exists, and why extra purge time is a warning.", "El lado bajo de estos chillers está en vacío. Un pinhole puede meter aire y humedad de afuera. Por eso existe la unidad de purga, y por eso más tiempo de purga es una alerta.") },
      { q: T("The purge unit on a chiller has started running for hours every day. What should you think first?", "La unidad de purga de un chiller empezó a correr horas todos los días. ¿Qué debes pensar primero?"),
        a: [T("Air is leaking in — look for a leak", "Está entrando aire: busca una fuga"), T("That's normal on every chiller, all day, every day", "Es normal en todos los chillers, todo el día, todos los días"), T("The rupture disc has already burst, so you can ignore the purge", "El disco de ruptura ya reventó, así que puedes ignorar la purga"), T("Add oxygen to keep the purge busy", "Agrega oxígeno para mantener la purga ocupada")],
        c: 0, why: T("The purge removes non-condensables. If it suddenly has a lot more work, air is getting in, which usually means a leak.", "La purga saca no condensables. Si de pronto tiene mucho más trabajo, está entrando aire, y eso casi siempre significa una fuga.") },
      { q: T("You need to leak-test a low-pressure chiller. What is the safe way to raise the pressure?", "Necesitas probar fugas en un chiller de baja presión. ¿Cuál es la forma segura de subir la presión?"),
        a: [T("Warm water or heating blankets, or a little nitrogen, staying around 10 psig — under the 15 psig rupture disc", "Agua tibia o cobertores térmicos, o un poco de nitrógeno, quedándote cerca de 10 psig, bajo el disco de ruptura de 15 psig"), T("Shop air, up to 150 psig, to really find it", "Aire de taller, hasta 150 psig, para encontrarla de verdad"), T("A torch on the vessel until the gauges climb", "Un soplete en el recipiente hasta que suban los manómetros"), T("Oxygen, because it is cheap and clean", "Oxígeno, porque es barato y limpio")],
        c: 0, why: T("The rupture disc commonly opens around 15 psig. Stay near 10 psig with controlled heat or a little dry nitrogen. Oxygen, shop air, and a torch on the vessel are all unsafe.", "El disco de ruptura por lo general abre cerca de 15 psig. Quédate cerca de 10 psig con calor controlado o un poco de nitrógeno seco. El oxígeno, el aire de taller y un soplete en el recipiente son inseguros.") },
      { q: T("What recovery level does the law require on a low-pressure appliance, and what else do you have to watch?", "¿Qué nivel de recuperación exige la ley en un aparato de baja presión, y qué más tienes que cuidar?"),
        a: [T("25 mm Hg absolute, and keep water circulating so the tubes don't freeze", "25 mm Hg absolutos, y mantén el agua circulando para que los tubos no se congelen"), T("4 inches of mercury vacuum, same as a window unit", "4 pulgadas de vacío de mercurio, igual que un aire de ventana"), T("0 inches of vacuum, same as a small high-pressure split", "0 pulgadas de vacío, igual que un split pequeño de alta presión"), T("25 inches of mercury vacuum — it's the same as 25 mm Hg absolute", "25 pulgadas de vacío de mercurio: es lo mismo que 25 mm Hg absolutos")],
        c: 0, why: T("Low-pressure appliances must be recovered to 25 mm Hg absolute, which is a deep vacuum, not 25 inches of vacuum and not the Type I or Type II inch numbers. Circulating water protects the tubes. Charge vapor first, then liquid, for the same reason.", "Los aparatos de baja presión deben recuperarse a 25 mm Hg absolutos, un vacío profundo, no 25 pulgadas de vacío ni los números en pulgadas del Tipo I o II. El agua circulando protege los tubos. Carga vapor primero y luego líquido, por la misma razón.") }
    ]
  });

  /* ---------------- Ready-to-Work ---------------- */
  attach("nate-rtw", {
    minutes: 16,
    steps: [
      { kicker: T("Ready-to-Work", "Listo para trabajar"),
        title: T("What a shop expects you to know on day one", "Lo que un taller espera que sepas el primer día"),
        body: [
          T("Nobody expects a brand-new helper to diagnose a compressor. They do expect you to stay safe, know the basic tools by name, understand how electricity and heat move, and know what the parts of a duct and piping system are for. That is what this lesson covers.",
            "Nadie espera que un ayudante nuevo diagnostique un compresor. Sí esperan que te mantengas seguro, conozcas las herramientas básicas por su nombre, entiendas cómo se mueven la electricidad y el calor, y sepas para qué sirven las partes de un sistema de ductos y tubería. Eso cubre esta lección."),
          T("Each idea below is something you will hear on your first week of ride-alongs. Learn the 'why' and the words will stick.",
            "Cada idea de abajo es algo que vas a oír en tu primera semana acompañando a un técnico. Aprende el 'por qué' y las palabras se quedan.")
        ]
      },
      { title: T("Safety comes first, every single call", "La seguridad va primero, en cada llamada"),
        body: [
          T("Lock out and tag out the power, then prove it's dead with a meter (live–dead–live). Wear glasses and gloves around refrigerant. Use only dry nitrogen to pressure-test — never oxygen or shop air. On a ladder, keep three points of contact. Around anything that burns gas, carry a CO detector.",
            "Bloquea y etiqueta la energía, y comprueba que está muerta con un medidor (vivo–muerto–vivo). Usa lentes y guantes con refrigerante. Solo nitrógeno seco para pruebas de presión, nunca oxígeno ni aire de taller. En una escalera, tres puntos de contacto. Cerca de lo que quema gas, lleva un detector de CO.")
        ],
        visual: "loto",
        video: V.safety,
        call: T("Your lead tech asks you to 'grab the disconnect.' That means pull it, lock it, and tag it — then test before anyone touches a wire.",
          "Tu técnico líder te pide 'agarra el desconectador.' Eso significa quitarlo, ponerle candado y etiqueta, y probar antes de que alguien toque un cable.")
      },
      { title: T("Electricity is water in a hose", "La electricidad es agua en una manguera"),
        body: [
          T("Voltage is the push, like water pressure. Current, measured in amps, is how much actually flows. Resistance, measured in ohms, is anything that slows it down, like a kink in the hose.",
            "El voltaje es el empuje, como la presión del agua. La corriente, en amperes, es cuánto fluye de verdad. La resistencia, en ohms, es lo que la frena, como un doblez en la manguera."),
          T("Ohm's law ties them together: voltage equals current times resistance, V = I × R. Know any two and you can find the third. A 240-volt motor drawing 5 amps acts like about 48 ohms, because 240 ÷ 5 = 48.",
            "La ley de Ohm los une: voltaje es igual a corriente por resistencia, V = I × R. Si sabes dos, encuentras el tercero. Un motor de 240 voltios que jala 5 amperes se comporta como unos 48 ohms, porque 240 ÷ 5 = 48.")
        ],
        video: V.ohm,
        analogy: T("Turn the faucet up (more voltage) and more water flows. Step on the hose (more resistance) and less flows, even with the same pressure.",
          "Abre más la llave (más voltaje) y fluye más agua. Pisa la manguera (más resistencia) y fluye menos, aunque la presión sea la misma.")
      },
      { title: T("Switches go in a line; loads sit side by side", "Los interruptores van en fila; las cargas van lado a lado"),
        body: [
          T("A load is anything that does work: a motor, a heater, a light. Loads are wired in parallel — each on its own branch — so every one gets the full voltage and one burning out doesn't kill the rest.",
            "Una carga es lo que hace trabajo: un motor, una resistencia, un foco. Las cargas se conectan en paralelo, cada una en su propia rama, para que todas reciban el voltaje completo y si una se quema no apague a las demás."),
          T("Switches and safeties are wired in series with the load they control — in the same single path. Open any one and the whole path stops. That is how a high-pressure switch can shut a compressor off.",
            "Los interruptores y las seguridades se conectan en serie con la carga que controlan, en el mismo camino. Si abres uno, todo el camino se detiene. Así es como un interruptor de alta presión puede apagar un compresor.")
        ],
        analogy: T("Series is a single-lane bridge: close it anywhere and nobody crosses. Parallel is a highway with several lanes: one lane closing doesn't stop the others.",
          "En serie es un puente de un solo carril: si lo cierras en cualquier punto, nadie cruza. En paralelo es una autopista de varios carriles: si se cierra uno, los demás siguen."),
        call: T("A condenser won't start. The tech finds the high-pressure switch open. Because it's in series with the contactor coil, the call to run never reaches the compressor. The switch is doing its job — now find out why pressure got high.",
          "Un condensador no arranca. El técnico encuentra abierto el interruptor de alta presión. Como está en serie con la bobina del contactor, la orden de arrancar nunca llega al compresor. El interruptor hace su trabajo; ahora hay que averiguar por qué subió la presión.")
      },
      { title: T("Heat moves three ways", "El calor se mueve de tres formas"),
        body: [
          T("Conduction is heat moving through something solid, like the copper wall of a tube. Convection is heat carried by moving air or water, like a blower pushing air across a coil. Radiation is heat that travels as infrared, like sun on a roof.",
            "La conducción es el calor que pasa por algo sólido, como la pared de cobre de un tubo. La convección es el calor que lleva el aire o el agua en movimiento, como un ventilador que empuja aire por un serpentín. La radiación es calor que viaja como infrarrojo, como el sol en un techo."),
          T("Insulation slows conduction. Fans speed up convection. Heat always moves from warmer to cooler — an air conditioner doesn't make cold, it moves heat out.",
            "El aislamiento frena la conducción. Los ventiladores aceleran la convección. El calor siempre va de lo más caliente a lo más frío: un aire acondicionado no hace frío, saca el calor.")
        ],
        visual: "heat",
        analogy: T("Hold a hot mug: that's conduction. Blow on your soup: convection. Feel a campfire from across the yard: radiation.",
          "Agarra una taza caliente: eso es conducción. Sopla tu sopa: convección. Siente una fogata desde el otro lado del patio: radiación.")
      },
      { title: T("Air needs a path in and a path out", "El aire necesita un camino de entrada y uno de salida"),
        body: [
          T("Return ducts pull room air back to the equipment through a filter. Supply ducts carry conditioned air back out to the registers. The plenum is the box where ducts connect to the unit.",
            "Los ductos de retorno regresan el aire del cuarto al equipo a través de un filtro. Los ductos de suministro llevan el aire acondicionado a las rejillas. El plenum es la caja donde los ductos se conectan a la unidad."),
          T("If the ducts are too small, leaky, or the filter is clogged, the blower fights resistance. Techs measure that with static pressure. High static means weak airflow, cold coils that can freeze, and unhappy customers.",
            "Si los ductos son muy chicos, fugan o el filtro está tapado, el ventilador pelea contra la resistencia. Los técnicos lo miden con la presión estática. Una estática alta significa poco aire, serpentines que se pueden congelar y clientes molestos.")
        ],
        video: V.ducts,
        call: T("A customer says the upstairs never cools. Before blaming the unit, the tech checks the filter and measures static. A filter that looks like a rug is the cheapest fix there is.",
          "Un cliente dice que arriba nunca enfría. Antes de culpar a la unidad, el técnico revisa el filtro y mide la estática. Un filtro que parece tapete es la reparación más barata que existe.")
      },
      { title: T("Copper, joints, and water that has to leave", "Cobre, uniones y el agua que tiene que salir"),
        body: [
          T("The two copper lines between the indoor and outdoor units are the line set. They get joined by brazing (melting filler metal into the joint with a torch, while nitrogen flows inside), by flaring (shaping the tube end to seal on a fitting), or by approved press fittings.",
            "Las dos líneas de cobre entre la unidad de adentro y la de afuera son el line set. Se unen soldando (derritiendo metal de aporte en la unión con soplete, mientras fluye nitrógeno por dentro), con flare (dando forma al extremo para sellar en un fitting), o con fittings de presión aprobados."),
          T("Cooling pulls water out of the air. That condensate drains through a pipe that needs a downhill slope and a trap — a U-bend that holds water so the blower can't suck air back up the drain.",
            "Enfriar saca agua del aire. Esa condensación se drena por un tubo que necesita pendiente hacia abajo y una trampa, una curva en U que guarda agua para que el ventilador no jale aire por el desagüe.")
        ],
        analogy: T("A condensate trap works like the U-bend under your kitchen sink: a little water sits in the bend and blocks air from coming the wrong way.",
          "Una trampa de condensado funciona como la curva en U bajo el fregadero: un poco de agua se queda en la curva y bloquea el aire que viene al revés."),
        call: T("Water on the ceiling under an attic unit? First look at the drain: a missing trap, a flat run, or a clog will overflow the pan.",
          "¿Agua en el techo bajo una unidad en el ático? Mira primero el desagüe: una trampa que falta, un tramo sin pendiente o un tapón hacen que la charola se desborde.")
      }
    ],
    recap: [
      T("Lock out, tag out, live–dead–live. Nitrogen only for pressure tests. CO detector around gas equipment.", "Bloquea, etiqueta, vivo–muerto–vivo. Solo nitrógeno para pruebas de presión. Detector de CO cerca de equipo de gas."),
      T("Voltage pushes, current flows, resistance slows it: V = I × R.", "El voltaje empuja, la corriente fluye, la resistencia frena: V = I × R."),
      T("Loads in parallel; switches and safeties in series with the load they control.", "Cargas en paralelo; interruptores y seguridades en serie con la carga que controlan."),
      T("Heat moves by conduction, convection, and radiation — always from warmer to cooler.", "El calor se mueve por conducción, convección y radiación, siempre de lo caliente a lo frío."),
      T("Return brings air back through the filter, supply sends it out. Condensate drains need slope and a trap.", "El retorno trae el aire por el filtro, el suministro lo manda afuera. Los desagües de condensado necesitan pendiente y trampa.")
    ],
    check: [
      { q: T("A 240-volt motor draws 5 amps. About how much resistance is it acting like?", "Un motor de 240 voltios jala 5 amperes. ¿Más o menos qué resistencia está mostrando?"),
        a: [T("48 ohms", "48 ohms"), T("1,200 ohms", "1,200 ohms"), T("5 ohms", "5 ohms"), T("245 ohms", "245 ohms")],
        c: 0, why: T("R = V ÷ I, so 240 ÷ 5 = 48 ohms.", "R = V ÷ I, así que 240 ÷ 5 = 48 ohms.") },
      { q: T("How is a high-pressure safety switch wired relative to the compressor's control circuit?", "¿Cómo se conecta un interruptor de seguridad de alta presión respecto al circuito de control del compresor?"),
        a: [T("In series, so opening it stops the compressor", "En serie, para que al abrirse se detenga el compresor"), T("In parallel, so it adds a second path", "En paralelo, para dar un segundo camino"), T("Only to ground", "Solo a tierra"), T("It isn't connected to anything", "No está conectado a nada")],
        c: 0, why: T("Safeties sit in series with what they protect. Open the switch and the single path breaks.", "Las seguridades van en serie con lo que protegen. Al abrir el interruptor, se rompe el único camino.") },
      { q: T("Heat moving through the copper wall of a tube is:", "El calor que pasa por la pared de cobre de un tubo es:"),
        a: [T("Conduction", "Conducción"), T("Convection", "Convección"), T("Radiation", "Radiación"), T("Evaporation", "Evaporación")],
        c: 0, why: T("Conduction is heat moving through a solid.", "La conducción es el calor que pasa por un sólido.") },
      { q: T("What does the trap on a condensate drain do?", "¿Qué hace la trampa en un desagüe de condensado?"),
        a: [T("Holds a little water so the blower can't pull air back through the drain", "Guarda un poco de agua para que el ventilador no jale aire por el desagüe"), T("Stores refrigerant", "Guarda refrigerante"), T("Speeds up the blower", "Acelera el ventilador"), T("Replaces the need for slope", "Reemplaza la necesidad de pendiente")],
        c: 0, why: T("The water in the U-bend seals the drain against air. You still need a downhill slope.", "El agua en la curva en U sella el desagüe contra el aire. Igual necesitas pendiente hacia abajo.") },
      { q: T("The upstairs won't cool and the filter is packed with dust. What is happening to the system?", "Arriba no enfría y el filtro está lleno de polvo. ¿Qué le pasa al sistema?"),
        a: [T("Static pressure is high, so airflow drops and the coil can get too cold", "La presión estática está alta, el aire baja y el serpentín se puede enfriar de más"), T("Nothing — filters don't affect airflow", "Nada: los filtros no afectan el aire"), T("The refrigerant turned into water", "El refrigerante se volvió agua"), T("Voltage doubled", "El voltaje se duplicó")],
        c: 0, why: T("A clogged filter adds resistance to airflow. The blower moves less air, rooms don't cool, and the coil can freeze.", "Un filtro tapado agrega resistencia al aire. El ventilador mueve menos aire, los cuartos no enfrían y el serpentín se puede congelar.") }
    ]
  });
})();
