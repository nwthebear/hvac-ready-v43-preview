/* IMAGE SLOTS — drop files into /img with these names to replace illustrated placeholders.
   Missing files fall back to the built-in SVG art automatically.
   bg-* are designed (code-drawn) study backdrops, not photos: black + FDE linework,
   empty center for UI text. Use portrait (720×1280) on phones; use the matching
   *-wide key (1920×1080) on wider screens. Crisp SVG masters live beside each
   JPEG as the same basename with a .svg extension. */
window.IMAGE_SLOTS = {
  "hero-home": { file: "img/hero-home.jpg", desc: "Friendly HVAC tech on a residential job, condenser in background (wide, 16:9)" },
  "hero-electrical": { file: "img/hero-electrical.jpg", desc: "Close-up of a condenser electrical panel: contactor, dual capacitor, wiring" },
  "hero-plumbing": { file: "img/hero-plumbing.jpg", desc: "Furnace with PVC condensate trap, float switch and gas drip leg" },
  "comp-compressor": { file: "img/comp-compressor.jpg", desc: "Scroll compressor inside an outdoor unit" },
  "comp-condenser": { file: "img/comp-condenser.jpg", desc: "Residential condensing unit, coil visible" },
  "comp-evaporator": { file: "img/comp-evaporator.jpg", desc: "Cased A-coil evaporator" },
  "comp-txv": { file: "img/comp-txv.jpg", desc: "TXV with sensing bulb strapped to suction line" },
  "comp-capacitor": { file: "img/comp-capacitor.jpg", desc: "Dual run capacitor showing HERM/FAN/C" },
  "comp-contactor": { file: "img/comp-contactor.jpg", desc: "Single-pole contactor" },
  "tool-manifold": { file: "img/tool-manifold.jpg", desc: "Digital manifold connected to a split system" },
  "tool-vacuum": { file: "img/tool-vacuum.jpg", desc: "Vacuum pump with micron gauge on a system" },
  "tool-recovery": { file: "img/tool-recovery.jpg", desc: "Recovery machine, gray/yellow recovery cylinder on a scale" },
  "skill-brazing": { file: "img/skill-brazing.jpg", desc: "Tech brazing copper with nitrogen purge, PPE on" },
  "skill-flaring": { file: "img/skill-flaring.jpg", desc: "Flaring tool forming a 45° flare" },
  "cert-bg": { file: "img/cert-bg.jpg", desc: "Subtle blueprint texture for certificates" },

  "bg-home": { file: "img/bg-home.jpg", desc: "Home backdrop: faint refrigerant-cycle frame, coil-fin edges, FDE Tron horizon" },
  "bg-quiz": { file: "img/bg-quiz.jpg", desc: "Quiz backdrop: close-up coil fins, gauge arcs, wiring-ladder sliver, FDE Tron floor" },
  "bg-lesson": { file: "img/bg-lesson.jpg", desc: "Lesson backdrop: refrigerant-cycle schematic, wiring ladder, blueprint grid" },
  "bg-map": { file: "img/bg-map.jpg", desc: "Map/board backdrop: overhead ductwork plan with takeoffs and diffusers" },
  "bg-arcade": { file: "img/bg-arcade.jpg", desc: "Arcade backdrop: copper hairpin coil banks, fin pattern, stronger Tron floor" },
  "bg-results": { file: "img/bg-results.jpg", desc: "Results backdrop: blueprint frame, empty title block, faint cycle" },

  "bg-home-wide": { file: "img/bg-home-wide.jpg", desc: "Home backdrop, 1920×1080" },
  "bg-quiz-wide": { file: "img/bg-quiz-wide.jpg", desc: "Quiz backdrop, 1920×1080" },
  "bg-lesson-wide": { file: "img/bg-lesson-wide.jpg", desc: "Lesson backdrop, 1920×1080" },
  "bg-map-wide": { file: "img/bg-map-wide.jpg", desc: "Map/board backdrop, 1920×1080" },
  "bg-arcade-wide": { file: "img/bg-arcade-wide.jpg", desc: "Arcade backdrop, 1920×1080" },
  "bg-results-wide": { file: "img/bg-results-wide.jpg", desc: "Results backdrop, 1920×1080" },

  /* Scene-key aliases used by js/scenes.js — designed art, not photos */
  "bg-rooftop": { file: "img/bg-rooftop.jpg", desc: "Alias of bg-home for the rooftop/home scene key" },
  "bg-mechroom": { file: "img/bg-mechroom.jpg", desc: "Alias of bg-lesson for the mech-room/quiz/library scene key" },
  "bg-attic": { file: "img/bg-attic.jpg", desc: "Alias of bg-results for the attic/certs/settings scene key" },
  "bg-truck": { file: "img/bg-truck.jpg", desc: "Alias of bg-map for the truck/skills/tools scene key" },
  "bg-condenser-yard": { file: "img/bg-condenser-yard.jpg", desc: "Alias of bg-arcade for the yard/arcade scene key" }
};
/* Drop a file into img/ and add its key to IMAGES_READY to show it (avoids 404s for empty slots). */
window.IMAGES_READY = [
  "hero-home", "hero-electrical", "hero-plumbing",
  "comp-compressor", "comp-condenser", "comp-evaporator", "comp-txv", "comp-capacitor", "comp-contactor",
  "tool-manifold", "tool-vacuum", "tool-recovery",
  "skill-brazing", "skill-flaring",
  "cert-bg",
  "bg-home", "bg-quiz", "bg-lesson", "bg-map", "bg-arcade", "bg-results",
  "bg-home-wide", "bg-quiz-wide", "bg-lesson-wide", "bg-map-wide", "bg-arcade-wide", "bg-results-wide",
  "bg-rooftop", "bg-mechroom", "bg-attic", "bg-truck", "bg-condenser-yard"
];
window.slotImg = (key, cls = "") => { const s = window.IMAGE_SLOTS[key]; return s && window.IMAGES_READY.includes(key) ? `<img class="slot-img ${cls}" src="${s.file}" alt="${s.desc}" loading="lazy" onerror="this.remove()">` : ""; };
