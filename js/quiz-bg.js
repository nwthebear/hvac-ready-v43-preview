/* QUIZ BACKGROUNDS — faint, topic-themed line art behind every quiz:
   refrigeration = coil + line set, electrical = wiring/ladder diagram, gas heat = burner + heat exchanger,
   airflow = duct trunk + registers, tools/safety = hand tools; EPA = the same refrigeration look plus a small
   cylinder / recovery-machine motif and a slightly cooler accent. Soft amber glow behind the question, slow drift,
   brightens a little as the streak builds, gentle green/red pulse on each answer. The lower third gets a larger
   illustration that fades upward. Reduced motion: no drift, pulses become a plain fade. Light mode: sand/khaki ink. */
(function () {
  const A = window.App, S = A.S;
  const RX = {
    elec: /capacit|volt|amp(s|erage)?\b|ohm|contactor|wir(e|ing)|circuit|motor|transformer|thermostat|relay|meter|electric|fuse|breaker|µf|mfd|ecm|psc|condensador de arranque|cableado|voltaje/i,
    gas: /furnace|gas\b|flame|ignit|heat exchanger|flue|combust|burner|pilot|inducer|carbon monoxide|\bco\b|horno|quemador|llama|combusti/i,
    air: /duct|cfm|static|airflow|blower|psychro|humidity|wet.?bulb|dew point|register|grille|ducto|flujo de aire|humedad|psicrom/i,
    ref: /refrigerant|superheat|subcool|compressor|evaporat|condens|p\/?t\b|charg|r-?410|r-?454|r-?32|r-?22|a2l|braz|vacuum|micron|txv|metering|recover|refrigerante|sobrecalent|subenfri|compresor/i
  };
  const topicOf = Q => { const k = (Q.key || "") + " " + (Q.title || ""); if (/^epa:/.test(Q.key || "") || /\bEPA\b/.test(Q.title || "")) return "epa";
    const txt = k + " " + (Q.items || []).map(it => (it.q.q.en || "") + " " + (it.q.why && it.q.why.en || "")).join(" ");
    const score = Object.fromEntries(Object.keys(RX).map(t => [t, (txt.match(new RegExp(RX[t].source, "gi")) || []).length]));
    const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0]; return best && best[1] >= 2 ? best[0] : "tools"; };
  /* tileable line art (120×120) */
  const TILE = {
    ref: `<path d="M8 20h44c6 0 6 10 0 10H16c-6 0-6 10 0 10h36c6 0 6 10 0 10H8"/><path d="M70 14v92M82 14v92"/><circle cx="76" cy="60" r="10"/><path d="M96 30c10 0 14 8 14 16s-4 16-14 16M100 86h16M100 96h10"/><path d="M14 80h36v26H14z M20 86h24M20 92h24M20 98h24"/>`,
    elec: `<path d="M10 10v100M110 10v100"/><path d="M10 30h24l6-6 6 12 6-12 6 12 6-6h46"/><path d="M10 60h30M40 54v12M46 54v12M46 60h64"/><circle cx="60" cy="90" r="10"/><path d="M10 90h40M70 90h40M56 86l8 8M64 86l-8 8"/>`,
    gas: `<path d="M14 100h92M24 100V60h72v40"/><path d="M36 60c0-12 8-14 8-24 6 8 8 14 8 24M64 60c0-12 8-14 8-24 6 8 8 14 8 24"/><path d="M30 20h60M36 20v20M84 20v20M36 40c8 6 40 6 48 0"/><circle cx="104" cy="30" r="6"/>`,
    air: `<path d="M6 30h70l20 20v50"/><path d="M6 46h60l14 14v40"/><path d="M20 80h28v20H20zM24 86h20M24 92h20"/><path d="M90 14c8 0 8 6 16 6M90 24c8 0 8 6 16 6"/>`,
    tools: `<path d="M20 20l30 30M14 26l12-12 6 6-12 12zM48 48l8 8"/><circle cx="84" cy="36" r="14"/><path d="M84 36l8-8M76 80h30v10H76zM86 80V70h10v10"/><path d="M16 96h40M24 90v12M48 90v12"/>`
  };
  TILE.epa = TILE.ref;
  /* lower-third illustration (360×150) */
  const SCENE = {
    ref: `<rect x="196" y="40" width="120" height="96" rx="6"/><circle cx="256" cy="88" r="34"/><path d="M256 54v68M222 88h68M232 64l48 48M280 64l-48 48"/><path d="M196 110H120c-14 0-14-20 0-20h76M196 120H110c-20 0-24-40 0-40h86"/><path d="M20 70h50v66H20zM28 80h34M28 90h34M28 100h34M28 110h34M28 120h34"/><path d="M70 90h40M70 120h30"/>`,
    elec: `<path d="M20 20v120M340 20v120"/><path d="M20 40h70M110 40h60M150 34v12M156 34v12M156 40h184"/><circle cx="100" cy="40" r="10"/><path d="M20 80h60l8-10 10 20 10-20 10 20 8-10h214"/><path d="M20 120h120"/><rect x="140" y="110" width="40" height="20"/><path d="M180 120h160"/><path d="M240 70v20M232 76h16"/>`,
    gas: `<rect x="120" y="14" width="120" height="126" rx="6"/><path d="M130 100h100M140 100c0-14 10-16 10-28 8 10 10 16 10 28M180 100c0-14 10-16 10-28 8 10 10 16 10 28"/><path d="M140 30h80v40h-80zM150 40h60M150 50h60M150 60h60"/><path d="M240 30h60v-16M300 14h20"/><path d="M60 140V96h40"/>`,
    air: `<path d="M0 50h240l40 40v60"/><path d="M0 80h220l30 30v40"/><path d="M60 50v-20h30v20M150 50v-20h30v20"/><rect x="60" y="20" width="30" height="10"/><rect x="150" y="20" width="30" height="10"/><path d="M300 40c16 0 16 10 32 10M300 60c16 0 16 10 32 10M300 80c16 0 16 10 32 10"/>`,
    tools: `<path d="M40 120l60-60M30 130l18-18 12 12-18 18zM96 64l14-14 10 10-14 14"/><circle cx="200" cy="80" r="40"/><path d="M200 80l20-20M200 44v8M200 108v8M164 80h8M228 80h8"/><path d="M270 130V70h60v60zM280 90h40M280 104h40M280 118h40"/>`,
    epa: `<rect x="40" y="56" width="120" height="80" rx="8"/><circle cx="76" cy="96" r="18"/><path d="M110 76h36M110 88h36M110 100h24"/><path d="M160 112h40c10 0 10-30 26-30"/><rect x="230" y="40" width="60" height="96" rx="24"/><path d="M246 40V26h28v14M240 60h40"/><path d="M300 136h40"/>`
  };
  const svgTile = t => `<svg class="qbg-tile" aria-hidden="true"><defs><pattern id="qbgP-${t}" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><g>${TILE[t]}</g></pattern></defs><rect width="100%" height="100%" fill="url(#qbgP-${t})"/></svg>`;
  const svgScene = t => `<svg class="qbg-scene" viewBox="0 0 360 150" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><g>${SCENE[t]}</g>${t === "epa" ? `<g class="qbg-epa-tag"><rect x="236" y="70" width="48" height="16" rx="3"/><text x="260" y="82" text-anchor="middle">608</text></g>` : ""}</svg>`;
  const wrapIn = Vobj => { const q0 = Vobj.quiz; Vobj.quiz = (...a) => { const h = q0(...a), Q = A.quizState && A.quizState(); if (!Q || !/class="page quiz"/.test(h) || Q.i >= Q.items.length) return h;
      if (!Q._bg) Q._bg = topicOf(Q); const t = Q._bg, lvl = Math.min(1, (Q.streak || 0) / 6), d = -((Date.now() / 1000) % 90).toFixed(2);
      const bg = `<div class="qbg qbg-${t}" aria-hidden="true" style="--qs:${lvl.toFixed(2)};--qd:${d}s"><div class="qbg-glow"></div><div class="qbg-drift">${svgTile(t)}</div><div class="qbg-low">${svgScene(t)}</div><div class="qbg-pulse"></div></div>`;
      return h.replace('<main class="page quiz">', `<main class="page quiz has-qbg qt-${t}">${bg}`); }; };
  wrapIn(A.views);
  /* answer pulse */
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest(".quiz .ans"); if (!b) return;
    setTimeout(() => { const p = document.querySelector(".qbg"); if (!p) return; const ok = b.classList.contains("right"), bad = b.classList.contains("wrongp"); if (!ok && !bad) return;
      p.classList.remove("ok", "bad"); void p.offsetWidth; p.classList.add(ok ? "ok" : "bad"); if (ok) { const Q = A.quizState && A.quizState(); if (Q) p.style.setProperty("--qs", Math.min(1, Q.streak / 6).toFixed(2)); } }, 0); }, true);
})();
