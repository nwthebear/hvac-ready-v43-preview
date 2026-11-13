/* Lazy-loaded 3D models (procedural geometry) using locally vendored three.js.
   Usage: import('./js/models3d.js').then(m => m.mount(el, 'split'|'compressor'|'txv', labels, onPick)) */
import * as THREE from "../vendor/three/three.module.min.js";
import { OrbitControls } from "../vendor/three/OrbitControls.js";

const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.42, metalness: 0.38, ...o });
const COPPER = M(0xb87333, { metalness: 0.8, roughness: 0.35 });
function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
function cyl(r, h, mat, seg = 32) { return new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat); }
function pipe(points, r, mat) { const c = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, "catmullrom", 0.05); return new THREE.Mesh(new THREE.TubeGeometry(c, 64, r, 10, false), mat); }

function buildSplit(g, anim) {
  const panel = M(0xd9dee3), dark = M(0x37474f), coilM = M(0x90a4ae, { metalness: 0.6 });
  // condenser (outdoor) at x=-1.6 — louvered coil pack, pad, service valves
  const cond = new THREE.Group(); cond.position.set(-1.7, 0, 0); g.add(cond);
  const pad = box(1.9, 0.08, 1.9, M(0x8a8d90, { roughness: 0.95, metalness: 0.05 })); pad.position.y = -0.78; cond.add(pad);
  const fr = box(1.6, 1.4, 1.6, panel); fr.material = panel.clone(); fr.material.transparent = true; fr.material.opacity = 0.16; cond.add(fr);
  const finM = M(0xb8c0c6, { metalness: 0.7, roughness: 0.35 });
  for (let i = 0; i < 28; i++) {
    const fin = box(1.48, 1.18, 0.018, finM);
    fin.position.set(0, 0, -0.70 + i * 0.052);
    cond.add(fin);
  }
  const coil = box(0.08, 1.2, 1.5, coilM); coil.position.set(-0.76, 0, 0); cond.add(coil);
  const coil2 = coil.clone(); coil2.position.set(0.76, 0, 0); cond.add(coil2);
  const coil3 = coil.clone(); coil3.position.set(0, 0, -0.76); coil3.rotation.y = Math.PI / 2; cond.add(coil3);
  const top = box(1.62, 0.06, 1.62, dark); top.position.y = 0.72; cond.add(top);
  const guard = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.03, 8, 32), dark); guard.rotation.x = Math.PI / 2; guard.position.y = 0.78; cond.add(guard);
  // service valves on the side
  const svL = cyl(0.05, 0.12, COPPER, 16); svL.rotation.z = Math.PI / 2; svL.position.set(0.88, -0.35, 0.55); cond.add(svL);
  const svS = cyl(0.035, 0.1, COPPER, 16); svS.rotation.z = Math.PI / 2; svS.position.set(0.86, -0.48, 0.55); cond.add(svS);
  const fan = new THREE.Group(); fan.position.y = 0.78; cond.add(fan);
  for (let i = 0; i < 4; i++) { const b = box(0.55, 0.02, 0.16, M(0x263238)); b.position.x = 0.3; const h = new THREE.Group(); h.rotation.y = i * Math.PI / 2; b.rotation.x = 0.35; h.add(b); fan.add(h); }
  anim.push(dt => fan.rotation.y += dt * 9);
  const comp = cyl(0.25, 0.7, M(0x455a64, { metalness: 0.5 })); comp.position.set(0.25, -0.3, 0.25); cond.add(comp);
  const ctrl = box(0.3, 0.35, 0.08, M(0x607d8b)); ctrl.position.set(0.5, 0.25, 0.76); cond.add(ctrl);
  // air handler (indoor) at x=1.7
  const ah = new THREE.Group(); ah.position.set(1.8, 0.1, 0); g.add(ah);
  const cab = box(1.0, 1.9, 0.9, panel.clone()); cab.material.transparent = true; cab.material.opacity = 0.18; ah.add(cab);
  const a1 = box(0.9, 0.06, 0.8, coilM); a1.position.set(-0.2, 0.45, 0); a1.rotation.z = 1.0; ah.add(a1); const a2 = a1.clone(); a2.position.x = 0.2; a2.rotation.z = -1.0; ah.add(a2);
  const blower = cyl(0.32, 0.5, M(0x546e7a), 24); blower.rotation.x = Math.PI / 2; blower.position.y = -0.45; ah.add(blower);
  const wheel = new THREE.Group(); wheel.position.y = -0.45; ah.add(wheel);
  for (let i = 0; i < 16; i++) { const v = box(0.04, 0.22, 0.46, M(0x90a4ae)); const h = new THREE.Group(); v.position.y = 0.2; h.rotation.z = i * Math.PI / 8; h.add(v); wheel.add(h); }
  anim.push(dt => wheel.rotation.z += dt * 6);
  const filt = box(0.95, 0.04, 0.85, M(0xffffff, { roughness: 0.9 })); filt.position.y = -0.92; ah.add(filt);
  const txv = box(0.12, 0.12, 0.12, COPPER); txv.position.set(0, 0.0, 0.3); ah.add(txv);
  // line set
  const suction = pipe([[-1.45, -0.35, 0.55], [-0.6, -0.65, 0.6], [0.6, -0.65, 0.6], [1.6, 0.1, 0.3], [1.75, 0.1, 0.3]], 0.055, M(0x1a1a1a, { roughness: 0.95, metalness: 0.05 }));
  const liquid = pipe([[-1.3, -0.45, 0.7], [-0.6, -0.8, 0.75], [0.6, -0.8, 0.75], [1.65, -0.05, 0.4], [1.8, 0.0, 0.3]], 0.025, COPPER);
  g.add(suction, liquid);
  const drier = cyl(0.06, 0.22, M(0x1565c0, { metalness: 0.5, roughness: 0.35 }), 16);
  drier.rotation.z = Math.PI / 2; drier.position.set(0.15, -0.80, 0.75); g.add(drier);
  // flowing refrigerant dots
  const hot = new THREE.MeshBasicMaterial({ color: 0xff7043 }), cold = new THREE.MeshBasicMaterial({ color: 0x29b6f6 });
  const lc = liquid.geometry.parameters.path, sc = suction.geometry.parameters.path;
  const dots = []; for (let i = 0; i < 10; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), i % 2 ? hot : cold); d.userData = { u: i / 10, curve: i % 2 ? lc : sc, dir: i % 2 ? 1 : -1 }; g.add(d); dots.push(d); }
  anim.push(dt => dots.forEach(d => { d.userData.u = (d.userData.u + dt * 0.12 + 1) % 1; const u = d.userData.dir > 0 ? d.userData.u : 1 - d.userData.u; d.position.copy(d.userData.curve.getPointAt(u)); }));
  return [
    { id: "condenser", pos: [-2.5, 0.2, 0.8] }, { id: "compressor", pos: [-1.45, -0.3, 0.25] }, { id: "contactor", pos: [-1.2, 0.25, 0.85] },
    { id: "evaporator", pos: [1.8, 0.6, 0.5] }, { id: "txv", pos: [1.8, 0.0, 0.4] }, { id: "blower", pos: [1.8, -0.45, 0.5] }, { id: "filter", pos: [1.8, -0.85, 0.5] },
    { id: "suction", pos: [0, -0.62, 0.6] }, { id: "liquid", pos: [0, -0.84, 0.8] }
  ];
}
function buildCompressor(g, anim) {
  const shell = cyl(0.8, 2.0, M(0x455a64, { metalness: 0.5, transparent: true, opacity: 0.25, side: THREE.DoubleSide }), 48); g.add(shell);
  const motorS = cyl(0.62, 0.7, M(0x8d6e63)); motorS.position.y = -0.45; g.add(motorS);
  const windings = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 12, 40), COPPER); windings.rotation.x = Math.PI / 2; windings.position.y = -0.1; g.add(windings);
  const shaft = cyl(0.08, 1.6, M(0xcfd8dc, { metalness: 0.9 })); shaft.position.y = 0; g.add(shaft);
  const fixed = new THREE.Group(), orbit = new THREE.Group(); fixed.position.y = 0.55; orbit.position.y = 0.5; g.add(fixed, orbit);
  const spiral = (mat, rot) => { const pts = []; for (let a = 0; a < Math.PI * 6; a += 0.15) { const r = 0.08 + a * 0.03; pts.push(new THREE.Vector3(Math.cos(a + rot) * r, 0, Math.sin(a + rot) * r)); } return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.025, 6), mat); };
  fixed.add(spiral(M(0x90a4ae, { metalness: 0.7 }), 0)); orbit.add(spiral(M(0xffb74d, { metalness: 0.6 }), Math.PI));
  let tt = 0; anim.push(dt => { tt += dt * 4; orbit.position.x = Math.cos(tt) * 0.05; orbit.position.z = Math.sin(tt) * 0.05; shaft.rotation.y += dt * 4; });
  const suct = pipe([[0.8, -0.2, 0], [1.3, -0.2, 0]], 0.08, COPPER), disc = pipe([[0, 1.0, 0], [0, 1.25, 0], [0.6, 1.25, 0]], 0.05, COPPER); g.add(suct, disc);
  const term = box(0.3, 0.25, 0.1, M(0x263238)); term.position.set(0, -0.4, 0.82); g.add(term);
  return [{ id: "scrolls", pos: [0, 0.6, 0.3] }, { id: "motor", pos: [0, -0.4, 0.7] }, { id: "shaft", pos: [0.1, 0.1, 0.1] }, { id: "suctionPort", pos: [1.3, -0.2, 0] }, { id: "dischargePort", pos: [0.6, 1.25, 0] }, { id: "terminals", pos: [0, -0.4, 0.9] }];
}
function buildTXV(g, anim) {
  const body = box(0.6, 0.6, 0.6, COPPER); g.add(body);
  const head = cyl(0.42, 0.18, M(0xd4a373, { metalness: 0.7 })); head.position.y = 0.4; g.add(head);
  const inlet = pipe([[-1.4, 0, 0], [-0.3, 0, 0]], 0.08, COPPER), outlet = pipe([[0, -0.3, 0], [0, -1.2, 0]], 0.1, COPPER); g.add(inlet, outlet);
  const cap = pipe([[0, 0.5, 0], [0.3, 1.0, 0], [1.0, 1.0, 0.3], [1.4, 0.1, 0.4]], 0.015, COPPER); g.add(cap);
  const bulb = cyl(0.09, 0.55, COPPER); bulb.rotation.z = Math.PI / 2; bulb.position.set(1.55, 0.05, 0.4); g.add(bulb);
  const ext = pipe([[0.3, -0.05, 0], [0.9, -0.05, -0.2], [1.2, -0.3, -0.3]], 0.02, COPPER); g.add(ext);
  const pin = cyl(0.05, 0.4, M(0xeceff1, { metalness: 0.9 })); pin.position.y = 0.05; g.add(pin);
  const drop = new THREE.MeshBasicMaterial({ color: 0x29b6f6 }); const ds = []; for (let i = 0; i < 6; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), drop); d.userData.u = i / 6; g.add(d); ds.push(d); }
  anim.push(dt => ds.forEach(d => { d.userData.u = (d.userData.u + dt * 0.3) % 1; const u = d.userData.u; if (u < 0.5) d.position.set(-1.4 + u * 2.6, 0, 0); else d.position.set(0, -(u - 0.5) * 2.4, 0); d.material.color.setHex(u < 0.5 ? 0xff8a65 : 0x29b6f6); }));
  body.material = body.material.clone(); body.material.transparent = true; body.material.opacity = 0.55;
  return [{ id: "powerHead", pos: [0, 0.55, 0] }, { id: "bulb", pos: [1.55, 0.1, 0.45] }, { id: "capillary", pos: [0.8, 1.0, 0.2] }, { id: "pin", pos: [0, 0.05, 0.3] }, { id: "inlet", pos: [-1.1, 0, 0] }, { id: "outlet", pos: [0, -1.0, 0] }, { id: "equalizer", pos: [1.1, -0.25, -0.3] }];
}

export function mount(el, which, labels, onPick) {
  const W = el.clientWidth, H = el.clientHeight || 300;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H); el.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 100); cam.position.set(which === "split" ? 3.5 : 2.2, 2.0, which === "split" ? 5.2 : 3.5); if (W / H < 1.2) cam.position.multiplyScalar(1 + (1.2 - W / H) * 0.9);
  scene.add(new THREE.HemisphereLight(0xfff1e0, 0x16181c, 0.55));
  const key = new THREE.DirectionalLight(0xfff3e0, 1.85); key.position.set(3.4, 5.5, 4.2); scene.add(key);
  const fill = new THREE.DirectionalLight(0x8eb4ff, 0.38); fill.position.set(-4, 2.2, -2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xff9a4a, 0.62); rim.position.set(-2.2, 3.2, 5); scene.add(rim);
  const kick = new THREE.PointLight(0xffc080, 0.55, 8, 2); kick.position.set(0.4, 1.6, 2.2); scene.add(kick);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 48), M(0x1a1c1e, { roughness: 1, metalness: 0, color: 0x1a1c1e }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.95; scene.add(floor);
  const g = new THREE.Group(); scene.add(g); const anim = [];
  const pts = (which === "split" ? buildSplit : which === "compressor" ? buildCompressor : buildTXV)(g, anim);
  const ctl = new OrbitControls(cam, renderer.domElement); ctl.enableDamping = true; ctl.enablePan = false; ctl.minDistance = 2; ctl.maxDistance = 10;
  const overlay = document.createElement("div"); overlay.className = "m3d-labels"; el.appendChild(overlay);
  const tags = pts.map(p => { const b = document.createElement("button"); b.className = "m3d-tag"; b.textContent = labels[p.id] || p.id; b.onclick = () => onPick && onPick(p.id); overlay.appendChild(b); return { b, v: new THREE.Vector3(...p.pos) }; });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("reduce-motion");
  let last = performance.now(), running = true, visible = true;
  const io = new IntersectionObserver(e => { visible = e[0].isIntersecting; }); io.observe(el);
  function frame(now) {
    if (!running) return; requestAnimationFrame(frame); if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!reduced) anim.forEach(f => f(dt));
    ctl.update(); renderer.render(scene, cam);
    const w = el.clientWidth, h = el.clientHeight;
    tags.forEach(t => { const p = t.v.clone().applyMatrix4(g.matrixWorld).project(cam); const bw = t.bw || (t.bw = t.b.offsetWidth || 80), bh = t.b.offsetHeight || 22; const x = Math.min(w - bw - 6, Math.max(6, (p.x * 0.5 + 0.5) * w - bw / 2)), y = Math.min(h - bh - 6, Math.max(6, (-p.y * 0.5 + 0.5) * h - bh / 2)); t.b.style.transform = `translate(${x}px, ${y}px)`; t.b.style.opacity = p.z < 1 ? 1 : 0; });
  }
  requestAnimationFrame(frame);
  const ro = new ResizeObserver(() => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); }); ro.observe(el);
  return () => { running = false; io.disconnect(); ro.disconnect(); renderer.dispose(); el.innerHTML = ""; };
}
