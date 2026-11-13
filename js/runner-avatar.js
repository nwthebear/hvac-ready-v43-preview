/* RUNNER AVATAR — the user's own avatar drawn from BEHIND on canvas, in the same blocky toy style as avatars.js
   (rounded blocks, soft dark outline, flat fills + one shading pass). Origin = between the boots, units = avatar SVG units
   (≈141 tall). Rendered into an offscreen sprite each frame so the runner gets one back-lit shading pass and cheap
   motion-smear ghosts. Pose: { t run phase (rad), run 0..1, air 0..1, vy, lean -1..1, sway, gear Set }. */
(function () {
  const BOOTS = { brown: "#7A4A28", black: "#2A2A2C", tan: "#B78A52", new: "#D9A24E" };
  const hex = h => { h = (h || "#888").replace("#", ""); if (h.length === 3) h = h.split("").map(x => x + x).join(""); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const mix = (h, w, a) => { const c = hex(h), t = w === "w" ? 255 : 0; return `rgb(${c.map(v => Math.round(v + (t - v) * a)).join(",")})`; };
  const dk = (h, a = .22) => mix(h, "k", a), lt = (h, a = .2) => mix(h, "w", a);
  const OL = "rgba(16,24,36,.5)";
  let c = null;
  const rrp = (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const fillOL = (fill, lw = 1.2) => { c.fillStyle = fill; c.fill(); c.lineWidth = lw; c.strokeStyle = OL; c.stroke(); };
  const block = (x, y, w, h, r, fill) => { rrp(x, y, w, h, r); fillOL(fill); };
  /* a limb segment from (x0,y0) to (x1,y1), rounded block of width w */
  const seg = (x0, y0, x1, y1, w, fill) => { const a = Math.atan2(y1 - y0, x1 - x0) - Math.PI / 2, L = Math.hypot(x1 - x0, y1 - y0); c.save(); c.translate(x0, y0); c.rotate(a); rrp(-w / 2, -w * .2, w, L + w * .4, w * .38); fillOL(fill); c.restore(); };
  const ell = (x, y, rx, ry, fill, lw) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); fillOL(fill, lw); };

  function draw(ctx, cfg, p) {
    c = ctx; const A = Object.assign({ skin: "#E3AA7F", hair: "short", hairColor: "#4A2F1D", head: "hardhat", headColor: "#FFC72C", top: "tee", topColor: "#1E5AA8", pants: "work", pantsColor: "#35537F", boots: "brown", tool: "none", shades: "none", belt: "none", body: "a" }, cfg || {});
    const B = A.body === "b", skin = A.skin, hairC = A.hairColor, pc = A.pantsColor, bc = BOOTS[A.boots] || BOOTS.brown;
    const shirt = A.top === "hivis" ? "#3A4650" : A.topColor, longSleeve = A.top === "work" || A.top === "hoodie";
    const t = p.t || 0, run = p.run == null ? 1 : p.run, air = p.air || 0, gear = p.gear || new Set();
    const bob = -Math.abs(Math.cos(t)) * 3.2 * run * (1 - air), sway = Math.sin(t) * 1.6 * run * (1 - air);
    const hipY = -42 + bob * .6, shY = -86 + bob, headY = shY - 4;
    /* ---- legs: from behind, the leg kicking back folds toward the camera (shin foreshortens, sole shows) ---- */
    const legs = [-1, 1].map(s => { const ph = Math.sin(t + (s > 0 ? Math.PI : 0)) * run; let back = Math.max(0, ph), fwd = Math.max(0, -ph);
      if (air) { back = .55 + .25 * Math.sin(s); fwd = 0; }
      return { s, back, fwd }; });
    /* draw the folded (back) leg last so its sole sits in front */
    legs.sort((a, b) => a.back - b.back).forEach(({ s, back, fwd }) => {
      const hx = s * (B ? 8.6 : 9.5) + sway * .3, kx = hx + s * (1.5 + back * 1.5), ky = hipY + 17 * (1 - .2 * fwd) - back * 2;
      const fy = ky + 16 * (1 - .78 * back) - fwd * 2.5, fx = kx + s * back * 1.5;
      seg(hx, hipY, kx, ky, B ? 16 : 17, pc); seg(kx, ky - 2, fx, fy, B ? 14.5 : 15.5, dk(pc, .06));
      if (A.pants === "cargo") { rrp(hx + s * 4 - 4, hipY + 6, 8, 8, 2); fillOL(dk(pc, .14), .9); }
      /* boot: heel from behind, or the sole when the leg is kicked up */
      if (back > .35) { block(fx - 9.5, fy - 3, 19, 9 + back * 3, 3, bc); c.fillStyle = dk(bc, .45); rrp(fx - 8.5, fy - 1 + back * 2, 17, 5 + back * 2, 2); c.fill();
        c.strokeStyle = lt(bc, .25); c.lineWidth = .8; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(fx - 6, fy + 1 + back * 2 + i * 2); c.lineTo(fx + 6, fy + 1 + back * 2 + i * 2); c.stroke(); } }
      else { block(fx - 10, fy - 2, 20, 10, 3, bc); c.fillStyle = dk(bc, .4); c.fillRect(fx - 10, fy + 5.4, 20, 2.6); }
    });
    /* ---- torso (back) ---- */
    c.save(); c.translate(sway * .5, 0); c.rotate((p.lean || 0) * .05);
    const tw = B ? 37 : 40, tx0 = -tw / 2;
    if (B) { c.beginPath(); c.moveTo(-18.5, shY + 4); c.quadraticCurveTo(-18.5, shY, -14.5, shY); c.lineTo(14.5, shY); c.quadraticCurveTo(18.5, shY, 18.5, shY + 4); c.lineTo(15.1, shY + 24); c.lineTo(17.5, hipY + 1); c.lineTo(-17.5, hipY + 1); c.lineTo(-15.1, shY + 24); c.closePath(); fillOL(shirt); }
    else block(tx0, shY, tw, hipY - shY + 1, 4.5, shirt);
    const clipTorso = () => { if (B) { c.beginPath(); c.moveTo(-18.5, shY + 4); c.quadraticCurveTo(-18.5, shY, -14.5, shY); c.lineTo(14.5, shY); c.quadraticCurveTo(18.5, shY, 18.5, shY + 4); c.lineTo(15.1, shY + 24); c.lineTo(17.5, hipY + 1); c.lineTo(-17.5, hipY + 1); c.lineTo(-15.1, shY + 24); c.closePath(); } else rrp(tx0, shY, tw, hipY - shY + 1, 4.5); };
    c.save(); clipTorso(); c.clip();
    if (A.top === "work") { c.strokeStyle = dk(shirt, .3); c.lineWidth = 1; c.beginPath(); c.moveTo(-20, shY + 9); c.quadraticCurveTo(0, shY + 12, 20, shY + 9); c.stroke(); c.beginPath(); c.moveTo(0, shY + 11); c.lineTo(0, hipY - 2); c.stroke(); }
    if (A.top === "tee") { c.strokeStyle = dk(shirt, .25); c.lineWidth = .9; c.beginPath(); c.moveTo(-6, hipY - 10); c.lineTo(-4, hipY - 2); c.moveTo(7, hipY - 12); c.lineTo(5, hipY - 3); c.stroke(); }
    if (A.top === "hivis") { const v = A.topColor; c.fillStyle = v; c.fillRect(-21, shY, 42, hipY - shY + 2); c.fillStyle = "rgba(0,0,0,.14)"; c.fillRect(-21, shY, 42, 3);
      c.fillStyle = "#E8EEF0"; [shY + 15, shY + 30].forEach(y => { c.fillRect(-21, y, 42, 4); }); c.fillRect(-10, shY, 4, 15); c.fillRect(6, shY, 4, 15);
      c.fillStyle = "rgba(160,170,175,.6)"; [shY + 17, shY + 32].forEach(y => c.fillRect(-21, y + 1, 42, 1)); }
    if (A.pants === "crackproof") { c.strokeStyle = dk(pc, .1); c.lineWidth = 3.4; c.lineCap = "round"; c.beginPath(); c.moveTo(-12, shY + 1); c.lineTo(9, hipY - 6); c.moveTo(12, shY + 1); c.lineTo(-9, hipY - 6); c.stroke(); c.lineCap = "butt";
      c.fillStyle = pc; rrp(-12, hipY - 9, 24, 10, 2); c.fill(); c.fillStyle = "#C9A54A"; c.beginPath(); c.arc(0, hipY - 18, 2, 0, 7); c.fill(); }
    if (gear.has("harness")) { c.strokeStyle = "#E3A72F"; c.lineWidth = 3.6; c.beginPath(); c.moveTo(-13, shY); c.lineTo(10, hipY - 4); c.moveTo(13, shY); c.lineTo(-10, hipY - 4); c.stroke(); c.fillStyle = "#8a8f95"; c.beginPath(); c.arc(0, shY + 10, 3.4, 0, 7); c.fill(); c.strokeStyle = OL; c.lineWidth = 1; c.stroke(); }
    c.restore();
    if (A.top === "hoodie") { c.beginPath(); c.moveTo(-13, shY + 1); c.quadraticCurveTo(0, shY - 4, 13, shY + 1); c.quadraticCurveTo(12, shY + 14, 0, shY + 15); c.quadraticCurveTo(-12, shY + 14, -13, shY + 1); fillOL(dk(shirt, .14)); }
    /* belt + pouches */
    if (A.belt === "toolbelt" || A.belt === "newbelt" || A.pants !== "crackproof") { block(-19, hipY - 5, 38, 5.5, 2, A.belt === "newbelt" ? "#C08A4E" : A.belt === "toolbelt" ? "#6B4A2B" : dk(pc, .35)); }
    if (A.belt === "toolbelt") [-1, 1].forEach(s => { block(s * 20 - 6, hipY - 3, 12, 15, 3, "#8A6038"); c.strokeStyle = "#5A3B20"; c.lineWidth = .9; c.beginPath(); c.moveTo(s * 20 - 4, hipY + 3); c.lineTo(s * 20 + 4, hipY + 3); c.stroke(); });
    if (gear.has("loto")) { block(12, hipY - 3, 6, 9, 1.5, "#c8322a"); }
    c.restore();
    /* ---- arms: forward swing tucks the hand up and in, back swing drops it low and out ---- */
    [-1, 1].forEach(s => { const ph = Math.sin(t + (s > 0 ? 0 : Math.PI)) * run; const fwd = Math.max(0, ph), back = Math.max(0, -ph);
      const sx = s * (B ? 18.5 : 20) + sway * .5, sy = shY + 4, up = air ? 1 : 0;
      const ex = sx + s * (4 + back * 2 - fwd * 1 + up * 3), ey = sy + 14 - fwd * 3 - up * 6;
      const hx = ex + s * (-fwd * 6 + back * 1 + up * 4), hy = ey + 13 - fwd * 8 + back * 1 - up * 10;
      seg(sx, sy, ex, ey, 10, shirt === "#3A4650" && A.top === "hivis" ? shirt : shirt); seg(ex, ey, hx, hy, 9, longSleeve ? dk(shirt, .06) : skin);
      if (!longSleeve) { /* short sleeve cuff */ seg(sx, sy, sx + (ex - sx) * .55, sy + (ey - sy) * .55, 11, lt(shirt, .04)); }
      ell(hx, hy + 1.5, 4.6, 4.6, skin, 1);
      /* tools in hand (left hand for most tools, right for the clipboard, matching the front-view avatar) */
      const tl = A.tool; if (!tl || tl === "none") return; const own = tl === "clipboard" ? 1 : -1; if (s !== own) return;
      c.save(); c.translate(hx, hy + 3); c.rotate(s * .25);
      if (tl === "wrench" || tl === "luckydriver") { block(-2, 0, 4.4, 18, 2, tl === "wrench" ? "#9AA7B0" : "#F2C230"); if (tl === "wrench") ell(0, 19, 4.4, 3.4, "#9AA7B0", 1); }
      else if (tl === "gauges") { block(-9, 1, 18, 8, 3, "#37474F"); ell(-4, 0, 4, 4, "#1E88E5", 1); ell(4, 0, 4, 4, "#E53935", 1); }
      else if (tl === "drill") { block(-3, 0, 7, 11, 2, "#F57C00"); block(-3, -4, 16, 6, 2.5, "#F57C00"); }
      else if (tl === "clipboard") { block(-7, -2, 14, 18, 2, "#A0703D"); c.fillStyle = "#F4F1E8"; c.fillRect(-5, 1, 10, 12); }
      else if (tl === "thermos") { block(-4.5, -4, 9, 18, 3, "#3F6B4A"); block(-3.5, -7, 7, 4, 1.5, "#2C4C34"); }
      else if (tl === "energycan") { block(-4, -2, 8, 13, 2, "#1D1F1C"); c.fillStyle = "#9BE22D"; c.fillRect(-4, 2, 8, 3); }
      else if (tl === "diymug") { block(-5, -2, 10, 11, 2, "#E8E2D2"); }
      else if (tl === "bbqtongs") { c.strokeStyle = "#B0BEC5"; c.lineWidth = 2; c.beginPath(); c.moveTo(-1, 0); c.lineTo(-3, 20); c.moveTo(1, 0); c.lineTo(4, 20); c.stroke(); }
      c.restore(); });
    /* ---- head (back) ---- */
    c.save(); c.translate(sway * .6, 0); const hy0 = headY - 40, hw = 44, hx0 = -22;
    /* braids + ponytail hang behind the shoulders, swinging with the run */
    const swing = (p.swing || 0) + Math.sin(t) * 5 * run - (p.vy || 0) * .9;
    block(-5, headY - 4, 10, 8, 2, dk(skin, .1));                      /* neck */
    [-1, 1].forEach(s => ell(s * 22.5, hy0 + 22, 3.2, 5, skin, 1));      /* ears */
    const hairNone = A.hair === "none";
    rrp(hx0, hy0, hw, 40, 14); fillOL(hairNone || A.hair === "buzz" ? skin : hairC);
    if (A.hair === "buzz") { rrp(hx0 + 1, hy0, hw - 2, 30, 13); c.fillStyle = hairC; c.globalAlpha = .75; c.fill(); c.globalAlpha = 1; }
    if (!hairNone && A.hair !== "buzz") { /* nape */ c.fillStyle = dk(hairC, .12); rrp(hx0 + 6, hy0 + 30, hw - 12, 9, 4); c.fill(); }
    if (hairNone) { c.fillStyle = "rgba(255,255,255,.14)"; c.beginPath(); c.ellipse(-6, hy0 + 10, 9, 5, -.3, 0, 7); c.fill(); }
    if (A.hair === "curly") for (let i = 0; i < 7; i++) ell(-18 + i * 6, hy0 + 32 + (i % 2) * 2, 4.6, 4.6, hairC, 1);
    if (A.hair === "long") { c.beginPath(); c.moveTo(-23, hy0 + 18); c.lineTo(-24 + swing * .15, headY + 16); c.quadraticCurveTo(0, headY + 21, 24 + swing * .15, headY + 16); c.lineTo(23, hy0 + 18); c.closePath(); fillOL(hairC); }
    if (A.hair === "ponytail") { const bx = 0, by = hy0 + 26; c.save(); c.translate(bx, by); c.rotate(swing * .045); c.beginPath(); c.moveTo(-5, 0); c.quadraticCurveTo(-8, 16, -2, 30); c.quadraticCurveTo(2, 34, 5, 28); c.quadraticCurveTo(8, 14, 5, 0); c.closePath(); fillOL(hairC); c.restore(); block(-4.5, by - 3, 9, 5, 2, dk(hairC, .35)); }
    if (A.hair === "braids") [-1, 1].forEach(s => { let x = s * 13, y = hy0 + 30; for (let i = 0; i < 5; i++) { const ang = swing * .03 * (1 + i * .4) * (s > 0 ? 1 : .8); x += Math.sin(ang) * 6; y += Math.cos(ang) * 6.2; ell(x, y, 3.8 - i * .15, 4.2, i % 2 ? dk(hairC, .08) : hairC, 1); } c.strokeStyle = "#E3A72F"; c.lineWidth = 1.8; c.beginPath(); c.moveTo(x - 2.4, y + 4); c.lineTo(x + 2.4, y + 4); c.stroke(); });
    if (A.shades === "gasshades") { c.fillStyle = "#1D1F1C"; rrp(hx0 - .5, hy0 + 24, hw + 1, 4, 1.5); c.fill(); }
    else if (A.glasses) { c.strokeStyle = "#263238"; c.lineWidth = 1.4; [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 22, hy0 + 25); c.lineTo(s * 24.5, hy0 + 25); c.stroke(); }); }
    /* headwear (back view) */
    const hc = A.head === "goldhat" ? "#D9AE48" : A.headColor;
    if (A.hair === "bun") { if (A.head === "none" || A.head === "ballcap" || A.head === "backwards") ell(0, hy0 + (A.head === "none" ? 2 : 28), 7, 6.5, hairC, 1.1); else ell(0, hy0 + 33, 6.5, 5.5, hairC, 1.1); }
    if (A.head === "hardhat" || A.head === "newhat" || A.head === "goldhat") { c.beginPath(); c.moveTo(-23, hy0 + 20); c.quadraticCurveTo(-23, hy0 - 3, 0, hy0 - 3); c.quadraticCurveTo(23, hy0 - 3, 23, hy0 + 20); c.closePath(); fillOL(hc);
      rrp(-28, hy0 + 17.5, 56, 6, 3); fillOL(dk(hc, .12)); block(-3.5, hy0 - 3, 7, 21, 3.5, lt(hc, .18));
      c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-15, hy0 + 6); c.quadraticCurveTo(-10, hy0, -5, hy0 - 1); c.stroke(); }
    else if (A.head === "ballcap" || A.head === "backwards") { c.beginPath(); c.moveTo(-22.5, hy0 + 19); c.quadraticCurveTo(-22.5, hy0 - 1, 0, hy0 - 1); c.quadraticCurveTo(22.5, hy0 - 1, 22.5, hy0 + 19); c.closePath(); fillOL(hc);
      if (A.head === "ballcap") { c.fillStyle = hairNone ? skin : hairC; c.beginPath(); c.ellipse(0, hy0 + 17, 6, 3.2, 0, Math.PI, 0); c.fill(); block(-7, hy0 + 15.5, 14, 2.4, 1, dk(hc, .25)); }
      else { c.beginPath(); c.moveTo(-14, hy0 + 17); c.quadraticCurveTo(0, hy0 + 27, 14, hy0 + 17); c.lineTo(12, hy0 + 15); c.quadraticCurveTo(0, hy0 + 21, -12, hy0 + 15); c.closePath(); fillOL(dk(hc, .2)); }
      ell(0, hy0 - .5, 2.4, 1.6, dk(hc, .2), .8); }
    else if (A.head === "beanie") { c.beginPath(); c.moveTo(-23, hy0 + 20); c.quadraticCurveTo(-23, hy0 - 4, 0, hy0 - 4); c.quadraticCurveTo(23, hy0 - 4, 23, hy0 + 20); c.closePath(); fillOL(hc);
      block(-23.5, hy0 + 14, 47, 8, 3, dk(hc, .12)); c.strokeStyle = dk(hc, .28); c.lineWidth = .9; for (let x = -19; x <= 19; x += 4) { c.beginPath(); c.moveTo(x, hy0 + 15); c.lineTo(x, hy0 + 21); c.stroke(); } }
    c.restore();
  }

  /* offscreen sprite + back-lit shading pass (the sun is ahead of the runner) */
  const SW = 130, SH = 200, OX = 65, OY = 185; let sprite = null, sctx = null;
  function render(cfg, pose, px, dpr) { const sw = Math.ceil(SW * px * dpr), sh = Math.ceil(SH * px * dpr);
    if (!sprite) { sprite = document.createElement("canvas"); sctx = sprite.getContext("2d"); }
    if (sprite.width !== sw || sprite.height !== sh) { sprite.width = sw; sprite.height = sh; }
    const g = sctx; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, sw, sh); g.setTransform(px * dpr, 0, 0, px * dpr, OX * px * dpr, OY * px * dpr);
    g.lineJoin = "round"; draw(g, cfg, pose);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "source-atop";
    const lg = g.createLinearGradient(0, 0, sw, 0); lg.addColorStop(0, "rgba(10,8,20,.26)"); lg.addColorStop(.55, "rgba(10,8,20,.06)"); lg.addColorStop(.85, "rgba(255,170,90,.10)"); lg.addColorStop(1, "rgba(255,180,100,.32)"); g.fillStyle = lg; g.fillRect(0, 0, sw, sh);
    const vg = g.createLinearGradient(0, 0, 0, sh); vg.addColorStop(0, "rgba(255,200,130,.16)"); vg.addColorStop(.3, "rgba(255,200,130,0)"); vg.addColorStop(1, "rgba(20,10,30,.12)"); g.fillStyle = vg; g.fillRect(0, 0, sw, sh);
    g.globalCompositeOperation = "source-over"; return { canvas: sprite, ox: OX * px, oy: OY * px, w: SW * px, h: SH * px }; }
  window.RunnerAvatar = { draw, render };
})();
