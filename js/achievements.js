/* ACHIEVEMENTS DATA — edit freely. XP ranks + badges (EN/ES).
   Badge "rule" types understood by app.js:
     quizzes:n  games:n  perfect:n  streak:n  xp:n  stagesDone:n  pathDone:true
     done:"guide:id"|"skill:id"  doneAll:[...]  skillsDone:n  guidesDone:n  videos:n
     dayone:n  coach:n  high:{game,gte}  early:true  late:true  certs:n  lang:"es"  tools:n */
/* RANK PACING — the single tuning knob. XP needed for ranks 1–12, based only on in-app XP/completion (not calendar stages).
   Target (user-confirmed): ~4 months to Old Timer at 3–4 study sessions a week. Math: a session ≈ 250–300 XP (a lesson, a quiz,
   the daily) → ~17 weeks × 3.5 × 275 ≈ 16k, plus ~3–4k from first-time exam passes ≈ 20k.
   with New Guy → Helper inside the first 1–2 weeks, then gradually wider gaps. Exam passes give big boosts (XP_RULES below). */
window.RANK_XP = [0, 150, 450, 1000, 2000, 3400, 5200, 7400, 10000, 13000, 16300, 20000];
/* RANKS — names, icons and taglines (Spanish in content-es.js → window.RANK_ES). After the cap, each exam passed
   for the first time adds a star to Old Timer (App.rankStars). */
window.RANKS = [
  { id: "new-guy",     xp: RANK_XP[0],     icon: "🐣", en: "New Guy",         line: { en: "Still has clean boots." } },
  { id: "gopher",      xp: RANK_XP[1],   icon: "🏃", en: "Gopher",          line: { en: "Knows the supply house counter guy by first name already." } },
  { id: "ladder",      xp: RANK_XP[2],   icon: "🪜", en: "Ladder Holder",   line: { en: "Has been trusted with the ladder. Not on it, just holding it." } },
  { id: "helper",      xp: RANK_XP[3],  icon: "🧰", en: "Helper",          line: { en: "Has learned that the first energy drink is breakfast." } },
  { id: "crew",        xp: RANK_XP[4],  icon: "👷", en: "Crew Member",     line: { en: "Shows up on time, mostly." } },
  { id: "apprentice",  xp: RANK_XP[5],  icon: "🔧", en: "Apprentice Tech", line: { en: "Has their own gauges, and still has the receipt." } },
  { id: "tech",        xp: RANK_XP[6],  icon: "🚐", en: "Tech",            line: { en: "Runs calls solo. The truck smells like Monster and old cigs." } },
  { id: "lead",        xp: RANK_XP[7],  icon: "⭐", en: "Lead Tech",       line: { en: "Gets the weird calls." } },
  { id: "foreman",     xp: RANK_XP[8], icon: "📋", en: "Foreman",         line: { en: "Runs the crew, the clipboard, and the overtime." } },
  { id: "chief",       xp: RANK_XP[9], icon: "🎖️", en: "Chief",           line: { en: "Gets called when the lead tech is stumped." } },
  { id: "boss",        xp: RANK_XP[10], icon: "😎", en: "The Boss",        line: { en: "Signs the checks, still fixes it faster than you." } },
  { id: "old-timer",   xp: RANK_XP[11], icon: "👴", en: "Old Timer",       line: { en: "Has seen it all, has a story for it, and the story always has a cigarette in it." } }
];
window.RANKS.forEach(r => { const es = (window.RANK_ES || {})[r.id] || {}; r.es = es.name || r.en; r.line.es = es.line || r.line.en; });

window.XP_RULES = { testOutPass: 300, epaPass: 400, chp5Pass: 250, guide: 60, skill: 60, video: 25, quizPerCorrect: 10, quizPass: 50, gamePer100: 1, daily: 75, dayone: 5, moduleSignoff: 40 };

window.BADGES = [
  { id: "first-quiz", icon: "☕", rule: { quizzes: 1 }, name: { en: "Coffee Runner", es: "El del Café" }, desc: { en: "Finished your first quiz. Now go get the crew's order.", es: "Terminaste tu primer quiz. Ahora ve por los cafés de la cuadrilla." } },
  { id: "first-guide", icon: "🪜", rule: { guidesDone: 1 }, name: { en: "Ladder Hauler", es: "Carga Escaleras" }, desc: { en: "Completed your first study guide. Heavy lifting starts small.", es: "Completaste tu primera guía. Lo pesado empieza poco a poco." } },
  { id: "streak-3", icon: "🔑", rule: { streak: 3 }, name: { en: "Didn't Lose the Truck Keys", es: "No Perdí las Llaves de la Troca" }, desc: { en: "3-day streak. Showing up is half the job.", es: "Racha de 3 días. Presentarse es la mitad del trabajo." } },
  { id: "streak-5", icon: "📅", rule: { streak: 5 }, name: { en: "Shows Up Before the Foreman", es: "Llega Antes que el Capataz" }, desc: { en: "5-day streak.", es: "Racha de 5 días." } },
  { id: "streak-14", icon: "🔥", rule: { streak: 14 }, name: { en: "Attic Survivor (July Edition)", es: "Sobreviviente del Ático (Edición Julio)" }, desc: { en: "14-day streak. You can take the heat.", es: "Racha de 14 días. Aguantas el calor." } },
  { id: "dayone-5", icon: "🧳", rule: { dayone: 5 }, name: { en: "Brought Your Own Tools", es: "Trajiste Tus Herramientas" }, desc: { en: "Read 5 Day One Survival cards.", es: "Leíste 5 tarjetas de Supervivencia del Día Uno." } },
  { id: "tools-10", icon: "🔩", rule: { tools: 10 }, name: { en: "Knows a Swager from a Flarer", es: "Distingue Expansor de Abocinador" }, desc: { en: "Opened 10 tools in the Specialized Tools guide.", es: "Abriste 10 herramientas de la guía." } },
  { id: "electrical", icon: "⚡", rule: { doneAll: ["skill:multimeter", "skill:capacitor"] }, name: { en: "Sparky's Cousin", es: "Primo del Electricista" }, desc: { en: "Finished multimeter and capacitor skills. Still not an electrician.", es: "Terminaste multímetro y capacitores. Aún no eres electricista." } },
  { id: "ductwork", icon: "🗡️", rule: { done: "skill:ductwork" }, name: { en: "Sheet Metal Samurai", es: "Samurái de la Lámina" }, desc: { en: "Completed ductwork basics. Mind the edges.", es: "Completaste ductos básicos. Cuidado con los filos." } },
  { id: "maint", icon: "🩹", rule: { done: "skill:maintenance" }, name: { en: "Duct Tape Is Not a Fix", es: "La Cinta No Es Reparación" }, desc: { en: "Completed filter & coil maintenance — the right way.", es: "Completaste mantenimiento de filtros y serpentines, como se debe." } },
  { id: "vacuum", icon: "🌀", rule: { done: "skill:evacuation" }, name: { en: "Vacuum Whisperer", es: "El Que Le Habla al Vacío" }, desc: { en: "Completed evacuation & micron gauge.", es: "Completaste evacuación y vacuómetro." } },
  { id: "micron", icon: "😌", rule: { doneAll: ["skill:evacuation", "skill:pressure-test"] }, name: { en: "Micron Mood", es: "Modo Micrón" }, desc: { en: "Pressure test + evacuation done. Holding steady at 500.", es: "Prueba de presión + evacuación. Estable en 500." } },
  { id: "braze", icon: "👑", rule: { doneAll: ["skill:braze", "skill:solder-vs-braze"] }, name: { en: "Braze Lord", es: "Señor de la Soldadura" }, desc: { en: "Brazing skills complete. Nitrogen flowing, ego in check.", es: "Soldadura completa. Nitrógeno fluyendo, ego bajo control." } },
  { id: "skills-5", icon: "🧤", rule: { skillsDone: 5 }, name: { en: "Gloves Actually Worn", es: "Sí Se Puso los Guantes" }, desc: { en: "5 hands-on skills complete.", es: "5 habilidades prácticas completas." } },
  { id: "perfect", icon: "💯", rule: { perfect: 1 }, name: { en: "Perfect Score Pete", es: "Pepe Puntaje Perfecto" }, desc: { en: "100% on a quiz. Don't let it go to your hard hat.", es: "100% en un quiz. Que no se te suba al casco." } },
  { id: "perfect-3", icon: "🎯", rule: { perfect: 3 }, name: { en: "Measure Twice, Ace Thrice", es: "Mide Dos Veces, Acierta Tres" }, desc: { en: "3 perfect quizzes.", es: "3 quizzes perfectos." } },
  { id: "video-3", icon: "🍿", rule: { videos: 3 }, name: { en: "Lunch Break Scholar", es: "Erudito de la Hora de Comida" }, desc: { en: "Watched 3 video lessons.", es: "Viste 3 lecciones en video." } },
  { id: "games-10", icon: "🕹️", rule: { games: 10 }, name: { en: "Rained-Out Day Gamer", es: "Jugador de Día de Lluvia" }, desc: { en: "Played 10 arcade games.", es: "Jugaste 10 juegos del arcade." } },
  { id: "freeze", icon: "🧊", rule: { high: { game: "freeze", gte: 3000 } }, name: { en: "Don't Freeze Champion", es: "Campeón de No Te Congeles" }, desc: { en: "Scored 3,000+ in Don't Freeze!", es: "3,000+ puntos en ¡No te congeles!" } },
  { id: "lightning", icon: "⚡", rule: { high: { game: "lightning", gte: 1500 } }, name: { en: "Faster Than a Tripped Breaker", es: "Más Rápido que un Breaker Botado" }, desc: { en: "1,500+ in Lightning Round.", es: "1,500+ en Ronda Relámpago." } },
  { id: "fix", icon: "🩺", rule: { high: { game: "fix", gte: 2000 } }, name: { en: "It's Always the Filter", es: "Siempre Es el Filtro" }, desc: { en: "2,000+ in Fix the System.", es: "2,000+ en Repara el Sistema." } },
  { id: "match", icon: "🧩", rule: { high: { game: "match", gte: 1500 } }, name: { en: "Parts Counter Pro", es: "Experto del Mostrador de Refacciones" }, desc: { en: "1,500+ in Component/Tool Match.", es: "1,500+ en Empareja Componentes." } },
  { id: "early", icon: "🌅", rule: { early: true }, name: { en: "6 AM Shop Meeting", es: "Junta de las 6 AM" }, desc: { en: "Studied before 7 AM.", es: "Estudiaste antes de las 7 AM." } },
  { id: "late", icon: "🌙", rule: { late: true }, name: { en: "Emergency Call at Midnight", es: "Llamada de Emergencia a Medianoche" }, desc: { en: "Studied after 10 PM.", es: "Estudiaste después de las 10 PM." } },
  { id: "coach", icon: "🗣️", rule: { coach: 5 }, name: { en: "Asks the Old-Timer", es: "Le Pregunta al Veterano" }, desc: { en: "Asked the Tech Coach 5 questions. No such thing as a dumb one.", es: "Hiciste 5 preguntas al Coach. No hay preguntas tontas." } },
  { id: "bilingual", icon: "🌎", rule: { lang: "es" }, name: { en: "Bilingual on the Job Site", es: "Bilingüe en la Obra" }, desc: { en: "Studied in Spanish.", es: "Estudiaste en español." } },
  { id: "stage-1", icon: "🚩", rule: { stagesDone: 1 }, name: { en: "Survived Week One", es: "Sobreviví la Primera Semana" }, desc: { en: "Completed a full stage of your path.", es: "Completaste una etapa completa de tu ruta." } },
  { id: "stage-3", icon: "🏗️", rule: { stagesDone: 3 }, name: { en: "Not the New Guy Anymore", es: "Ya No Soy el Nuevo" }, desc: { en: "Completed 3 path stages.", es: "Completaste 3 etapas." } },
  { id: "cert-1", icon: "📜", rule: { certs: 1 }, name: { en: "Frame-Worthy", es: "Digno de Enmarcar" }, desc: { en: "Earned your first in-app certificate.", es: "Ganaste tu primer certificado de la app." } },
  { id: "row-3", icon: "🔥", rule: { inRow: 3 }, name: { en: "Warmed Up", es: "Ya Calentó" }, desc: { en: "Three right answers in a row.", es: "Tres respuestas correctas seguidas." } },
    { id: "row-5", icon: "⚙️", rule: { inRow: 5 }, name: { en: "Firing on All Cylinders", es: "A Todo Vapor" }, desc: { en: "Five in a row. The burner's lit.", es: "Cinco seguidas. Ya prendió el quemador." } },
    { id: "row-7", icon: "🔋", rule: { inRow: 7 }, name: { en: "Full Charge", es: "Carga Completa" }, desc: { en: "Seven in a row. Weighed in, not guessed.", es: "Siete seguidas. Pesado en báscula, no al tanteo." } },
    { id: "row-10", icon: "💾", rule: { inRow: 10 }, name: { en: "Y2K Compliant", es: "A Prueba del Y2K" }, desc: { en: "Ten in a row. Nothing crashed.", es: "Diez seguidas. Nada se cayó." } },
    { id: "sim-1", icon: "🧰", rule: { sims: 1 }, name: { en: "Ticket Closed", es: "Orden Cerrada" }, desc: { en: "Solved your first troubleshooting call.", es: "Resolviste tu primera llamada de diagnóstico." } },
  { id: "sim-hum", icon: "🔊", rule: { sim: "hum-no-start" }, name: { en: "Hum Detective", es: "Detective del Zumbido" }, desc: { en: "Found the reason the outdoor unit just hums.", es: "Encontraste por qué la unidad exterior solo zumba." } },
  { id: "sim-drain", icon: "🪣", rule: { sim: "water-leak" }, name: { en: "Drain Line Whisperer", es: "Susurrador de Drenajes" }, desc: { en: "Cleared the clogged condensate case.", es: "Resolviste el caso del drenaje tapado." } },
  { id: "sim-3star", icon: "🎯", rule: { simStars: true }, name: { en: "No Wasted Trips", es: "Cero Vueltas de Más" }, desc: { en: "Three stars on a troubleshooting call.", es: "Tres estrellas en una llamada de diagnóstico." } },
  { id: "sim-all", icon: "🧰", rule: { sims: 6 }, name: { en: "Six-Pack of Service Calls", es: "Seis Llamadas al Hilo" }, desc: { en: "Solved six simulator calls.", es: "Resolviste seis llamadas del simulador." } },
  { id: "sim-13", icon: "🗂️", rule: { sims: 13 }, name: { en: "Seen It All (This Week)", es: "Ya Vi de Todo (Esta Semana)" }, desc: { en: "Solved all 13 simulator calls.", es: "Resolviste las 13 llamadas del simulador." } },
  { id: "path", icon: "🏆", rule: { pathDone: true }, name: { en: "Owns the Whole Toolbox", es: "Dueño de Toda la Caja" }, desc: { en: "Completed every core module on your path.", es: "Completaste todos los módulos de tu ruta." } }
];

/* Humorous lines for completion celebrations (randomized). */
/* Celebration lines now live in js/humor.js (ctx "complete"). */
