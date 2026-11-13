/* Detailed procedural 3D cutaways (locally vendored three.js).
   mount(el, which, labels, onPick)
   which: 'split' | 'cycle' | 'compressor' | 'txv' | 'coils' | 'furnace'
   Labels are teaching-only — pass a falsy/empty map to hide tags (identify games). */
import * as THREE from "../vendor/three/three.module.min.js";
import { OrbitControls } from "../vendor/three/OrbitControls.js";

const paint = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.42, metalness: 0.38, ...o });
const STEEL = () => paint(0x8a9096, { metalness: 0.82, roughness: 0.32 });
const DARK = () => paint(0x2a3036, { metalness: 0.55, roughness: 0.4 });
const PANEL = () => paint(0xc5ccd3, { metalness: 0.35, roughness: 0.55 });
const COPPER = () => paint(0xb87333, { metalness: 0.88, roughness: 0.28 });
const BRASS = () => paint(0xc4a35a, { metalness: 0.85, roughness: 0.3 });
const ALUM = () => paint(0xb8c0c6, { metalness: 0.72, roughness: 0.38 });
const ORANGE = () => paint(0xd45512, { metalness: 0.2, roughness: 0.55 });
const INSUL = () => paint(0x1f2933, { metalness: 0.05, roughness: 0.9 });
const BLUE = () => paint(0x4aa3c7, { metalness: 0.15, roughness: 0.55 });
const WIRE = () => paint(0xc9a227, { metalness: 0.6, roughness: 0.4 });

function box(w, h, d, mat) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.castShadow = false; return m; }
function cyl(r, h, mat, seg = 32, cap = true) { return new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg, 1, !cap), mat); }
function sphere(r, mat, seg = 24) { return new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg), mat); }
function pipe(points, r, mat, segs = 64) {
  const c = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, "catmullrom", 0.05);
  return new THREE.Mesh(new THREE.TubeGeometry(c, segs, r, 10, false), mat);
}
function tag(mesh, id) { mesh.userData.part = id; return mesh; }

function spiralPts(turns, r0, r1, y0, y1, segs) {
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, a = t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t;
    pts.push(new THREE.Vector3(Math.cos(a) * r, y0 + (y1 - y0) * t, Math.sin(a) * r));
  }
  return pts;
}
function spiralMesh(turns, r0, r1, y0, y1, tube, mat, segs = 120) {
  const c = new THREE.CatmullRomCurve3(spiralPts(turns, r0, r1, y0, y1, segs));
  return new THREE.Mesh(new THREE.TubeGeometry(c, segs, tube, 8, false), mat);
}

function finBank(w, h, depth, count, mat) {
  const geo = new THREE.BoxGeometry(w, h, Math.max(0.006, depth / (count * 8)));
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  const z0 = -depth / 2;
  for (let i = 0; i < count; i++) {
    dummy.position.set(0, 0, z0 + (i / Math.max(1, count - 1)) * depth);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

function addLights(scene) {
  scene.add(new THREE.HemisphereLight(0xfff3e6, 0x12151a, 0.62));
  const key = new THREE.DirectionalLight(0xfff6ea, 2.05); key.position.set(3.6, 6.0, 4.4); scene.add(key);
  const fill = new THREE.DirectionalLight(0x8eb8ff, 0.42); fill.position.set(-4.2, 2.4, -2.2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xff9a4a, 0.7); rim.position.set(-2.4, 3.4, 5.2); scene.add(rim);
  const kick = new THREE.PointLight(0xffc080, 0.6, 10, 2); kick.position.set(0.5, 1.8, 2.4); scene.add(kick);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(7, 64), paint(0x141618, { roughness: 1, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.05; scene.add(floor);
}

/* ---------- split system (outdoor condenser + indoor air handler) ---------- */
function buildSplit(g, anim) {
  const cond = new THREE.Group(); cond.position.set(-1.75, 0, 0); g.add(cond);
  const pad = box(1.95, 0.08, 1.95, paint(0x8a8d90, { roughness: 0.95, metalness: 0.05 })); pad.position.y = -0.8; cond.add(pad);
  const shell = box(1.62, 1.42, 1.62, PANEL()); shell.material = PANEL(); shell.material.transparent = true; shell.material.opacity = 0.14; cond.add(shell);
  const fins = ALUM();
  for (const [x, rot] of [[-0.78, 0], [0.78, 0], [0, Math.PI / 2]]) {
    const bank = finBank(0.06, 1.2, 1.5, 26, fins);
    bank.position.set(x === 0 ? 0 : x, 0, x === 0 ? -0.78 : 0);
    if (x === 0) bank.rotation.y = rot;
    cond.add(tag(bank, "condenser"));
  }
  const top = box(1.64, 0.06, 1.64, DARK()); top.position.y = 0.74; cond.add(top);
  const guard = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.03, 10, 40), DARK());
  guard.rotation.x = Math.PI / 2; guard.position.y = 0.8; cond.add(guard);
  const fan = new THREE.Group(); fan.position.y = 0.8; cond.add(fan);
  const hub = cyl(0.08, 0.06, DARK(), 16); fan.add(hub);
  for (let i = 0; i < 5; i++) {
    const blade = box(0.58, 0.018, 0.16, DARK()); blade.position.x = 0.32; blade.rotation.x = 0.38;
    const h = new THREE.Group(); h.rotation.y = i * (Math.PI * 2 / 5); h.add(blade); fan.add(h);
  }
  anim.push(dt => { fan.rotation.y += dt * 8; });
  const comp = cyl(0.26, 0.72, paint(0x3e4a52, { metalness: 0.62, roughness: 0.35 }));
  comp.position.set(0.28, -0.28, 0.22); cond.add(tag(comp, "compressor"));
  const cap = cyl(0.07, 0.22, paint(0xb0bec5, { metalness: 0.4 })); cap.position.set(0.55, -0.15, 0.55); cond.add(cap);
  const ctrl = box(0.32, 0.38, 0.08, paint(0x546e7a)); ctrl.position.set(0.52, 0.28, 0.8); cond.add(tag(ctrl, "contactor"));
  const svL = cyl(0.05, 0.13, COPPER(), 16); svL.rotation.z = Math.PI / 2; svL.position.set(0.9, -0.36, 0.55); cond.add(svL);
  const svS = cyl(0.035, 0.1, COPPER(), 16); svS.rotation.z = Math.PI / 2; svS.position.set(0.88, -0.5, 0.55); cond.add(svS);

  const ah = new THREE.Group(); ah.position.set(1.85, 0.12, 0); g.add(ah);
  const cab = box(1.05, 1.95, 0.95, PANEL()); cab.material = PANEL(); cab.material.transparent = true; cab.material.opacity = 0.16; ah.add(cab);
  // A-coil
  const coilG = new THREE.Group(); coilG.position.set(0, 0.35, 0); ah.add(tag(coilG, "evaporator"));
  for (const s of [-1, 1]) {
    const slab = finBank(0.72, 0.72, 0.72, 18, ALUM());
    slab.rotation.z = s * 0.55; slab.position.set(s * 0.18, 0, 0); coilG.add(slab);
  }
  const tx = cyl(0.07, 0.16, BRASS(), 20); tx.rotation.z = Math.PI / 2; tx.position.set(0, 0.72, 0.2); ah.add(tag(tx, "txv"));
  const blower = new THREE.Group(); blower.position.set(0, -0.55, 0); ah.add(tag(blower, "blower"));
  const wheel = cyl(0.32, 0.42, paint(0x455a64, { metalness: 0.5 }), 24, false); wheel.rotation.z = Math.PI / 2; blower.add(wheel);
  for (let i = 0; i < 12; i++) {
    const vane = box(0.04, 0.22, 0.4, DARK());
    const h = new THREE.Group(); h.rotation.x = i * Math.PI / 6; vane.position.y = 0.18; h.add(vane); blower.add(h);
  }
  anim.push(dt => { blower.rotation.x += dt * 6; });
  const filt = box(0.9, 0.06, 0.8, paint(0xefebe0, { roughness: 0.9, metalness: 0 })); filt.position.y = -0.92; ah.add(tag(filt, "filter"));

  const liq = pipe([[-0.85, -0.5, 0.55], [0.2, -0.5, 0.55], [0.9, 0.7, 0.2], [1.85, 0.84, 0.2]], 0.03, COPPER());
  const suc = pipe([[1.85, 0.05, -0.15], [0.9, 0.05, -0.15], [0.2, -0.2, 0.2], [-0.9, -0.2, 0.2], [-1.5, -0.2, 0.2]], 0.055, INSUL());
  g.add(tag(liq, "liquid"), tag(suc, "suction"));

  return [
    { id: "condenser", pos: [-1.75, 0.9, 0] }, { id: "compressor", pos: [-1.47, -0.1, 0.4] },
    { id: "contactor", pos: [-1.2, 0.4, 0.9] }, { id: "evaporator", pos: [1.85, 0.55, 0] },
    { id: "txv", pos: [1.85, 0.95, 0.3] }, { id: "blower", pos: [1.85, -0.45, 0] },
    { id: "filter", pos: [1.85, -0.85, 0] }, { id: "liquid", pos: [0.2, 0.4, 0.4] }, { id: "suction", pos: [0.3, 0.05, -0.15] }
  ];
}

/* ---------- 3D refrigeration cycle ---------- */
function buildCycle(g, anim) {
  const comp = cyl(0.32, 0.7, paint(0x3e4a52, { metalness: 0.65, roughness: 0.32 }));
  comp.position.set(0, 0.85, 0); g.add(tag(comp, "compressor"));
  const cap = sphere(0.16, STEEL(), 20); cap.position.set(0, 1.28, 0); g.add(cap);
  const cond = new THREE.Group(); cond.position.set(1.55, 0.55, 0); g.add(tag(cond, "condenser"));
  cond.add(finBank(0.18, 1.15, 1.15, 22, ALUM()));
  const hair = [];
  for (let i = 0; i < 5; i++) {
    const y = -0.45 + i * 0.22;
    const t = pipe([[-0.2, y, -0.52], [0.2, y, -0.52], [0.2, y, 0.52], [-0.2, y, 0.52]], 0.03, COPPER(), 40);
    cond.add(t); hair.push(t);
  }
  const evap = new THREE.Group(); evap.position.set(-1.55, -0.15, 0); g.add(tag(evap, "evaporator"));
  for (const s of [-1, 1]) {
    const slab = finBank(0.7, 0.7, 0.7, 16, ALUM());
    slab.rotation.z = s * 0.5; slab.position.set(s * 0.16, 0, 0); evap.add(slab);
  }
  const txv = new THREE.Group(); txv.position.set(0, -0.85, 0); g.add(tag(txv, "metering"));
  const body = cyl(0.12, 0.28, BRASS(), 24); txv.add(body);
  const head = cyl(0.16, 0.1, STEEL(), 24); head.position.y = 0.18; txv.add(head);

  const dis = pipe([[0.12, 1.15, 0], [0.5, 1.35, 0], [1.55, 1.2, 0], [1.55, 1.05, 0]], 0.05, paint(0xc25b3a, { metalness: 0.6, roughness: 0.35 }));
  const liq = pipe([[1.55, 0.0, 0], [1.55, -0.85, 0], [0.15, -0.85, 0]], 0.035, COPPER());
  const evl = pipe([[-0.15, -0.85, 0], [-1.55, -0.85, 0], [-1.55, -0.5, 0]], 0.035, COPPER());
  const suc = pipe([[-1.55, 0.25, 0], [-1.55, 0.85, 0], [-0.5, 1.15, 0], [-0.12, 1.15, 0]], 0.06, INSUL());
  g.add(tag(dis, "dischargePort"), tag(liq, "liquid"), tag(evl, "inlet"), tag(suc, "suction"));

  // refrigerant flow dots
  const path = [
    new THREE.Vector3(0, 1.2, 0), new THREE.Vector3(1.55, 1.15, 0), new THREE.Vector3(1.55, -0.85, 0),
    new THREE.Vector3(0, -0.85, 0), new THREE.Vector3(-1.55, -0.85, 0), new THREE.Vector3(-1.55, 0.85, 0), new THREE.Vector3(0, 1.2, 0)
  ];
  const curve = new THREE.CatmullRomCurve3(path, true, "catmullrom", 0.15);
  const dots = [];
  for (let i = 0; i < 10; i++) {
    const d = sphere(0.045, paint(0xff8a65, { roughness: 0.3, metalness: 0.1, emissive: 0x331100 }), 10);
    d.userData.u = i / 10; g.add(d); dots.push(d);
  }
  anim.push(dt => {
    dots.forEach(d => {
      d.userData.u = (d.userData.u + dt * 0.12) % 1;
      const u = d.userData.u;
      d.position.copy(curve.getPointAt(u));
      d.material.color.setHex(u < 0.35 ? 0xff8a65 : u < 0.55 ? 0xf0c36a : u < 0.8 ? 0x4fc3f7 : 0x90caf9);
    });
  });

  return [
    { id: "compressor", pos: [0, 1.35, 0] }, { id: "condenser", pos: [1.55, 1.2, 0] },
    { id: "metering", pos: [0, -1.05, 0] }, { id: "evaporator", pos: [-1.55, 0.35, 0] },
    { id: "liquid", pos: [1.1, -0.4, 0] }, { id: "suction", pos: [-0.8, 1.15, 0] }
  ];
}

/* ---------- scroll compressor cutaway ---------- */
function buildCompressor(g, anim) {
  // shell with a missing wedge so internals show
  const shellMat = paint(0x4a5560, { metalness: 0.7, roughness: 0.32, side: THREE.DoubleSide });
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 1.7, 48, 1, true, 0.55, Math.PI * 1.55), shellMat);
  g.add(shell);
  const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.12, 48), DARK()); bottom.position.y = -0.91; g.add(bottom);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 0.16, 48), DARK()); top.position.y = 0.9; g.add(top);
  const cap = sphere(0.28, STEEL(), 24); cap.scale.set(1, 0.55, 1); cap.position.y = 1.05; g.add(cap);

  // oil sump
  const oil = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.22, 32), paint(0x5a3a12, { metalness: 0.15, roughness: 0.55, transparent: true, opacity: 0.75 }));
  oil.position.y = -0.72; g.add(oil);

  // motor windings (stator)
  const stator = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.13, 12, 32), paint(0xc9a227, { metalness: 0.55, roughness: 0.4 }));
  stator.rotation.x = Math.PI / 2; stator.position.y = -0.18; g.add(tag(stator, "motor"));
  for (let i = 0; i < 10; i++) {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 8, 16), WIRE());
    loop.position.set(Math.cos(i * 0.63) * 0.42, -0.18, Math.sin(i * 0.63) * 0.42);
    loop.lookAt(0, -0.18, 0); g.add(loop);
  }
  const rotor = cyl(0.16, 0.5, paint(0x37474f, { metalness: 0.7, roughness: 0.3 }), 24);
  rotor.position.y = -0.18; g.add(rotor);
  const shaft = cyl(0.055, 1.15, paint(0xcfd8dc, { metalness: 0.9, roughness: 0.18 }), 16);
  shaft.position.y = 0.2; g.add(tag(shaft, "shaft"));

  // fixed + orbiting scrolls
  const scrolls = new THREE.Group(); scrolls.position.y = 0.52; g.add(tag(scrolls, "scrolls"));
  const fixed = spiralMesh(2.4, 0.08, 0.42, 0.05, 0.05, 0.035, paint(0xd0d5da, { metalness: 0.75, roughness: 0.25 }));
  const orbit = spiralMesh(2.4, 0.08, 0.42, -0.05, -0.05, 0.035, paint(0xb0bec5, { metalness: 0.75, roughness: 0.25 }));
  orbit.rotation.y = 0.45; scrolls.add(fixed, orbit);
  const plate = cyl(0.48, 0.05, STEEL(), 32); plate.position.y = 0.14; scrolls.add(plate);
  anim.push(dt => { orbit.rotation.y += dt * 2.2; });

  // suction / discharge
  const suc = pipe([[-0.9, 0.15, 0.35], [-0.55, 0.15, 0.35], [-0.4, 0.35, 0.2]], 0.09, INSUL(), 24);
  g.add(tag(suc, "suctionPort"));
  const dis = pipe([[0.2, 0.95, 0], [0.35, 1.15, 0], [0.7, 1.2, 0], [0.95, 1.0, 0]], 0.07, paint(0xc25b3a, { metalness: 0.55, roughness: 0.35 }), 24);
  g.add(tag(dis, "dischargePort"));

  const boxT = box(0.32, 0.22, 0.18, paint(0x37474f)); boxT.position.set(0.7, 0.15, 0.45); g.add(tag(boxT, "terminals"));
  for (let i = 0; i < 3; i++) {
    const prong = cyl(0.02, 0.1, paint(0xeee8aa, { metalness: 0.8 }), 8);
    prong.position.set(0.62 + i * 0.06, 0.15, 0.58); prong.rotation.x = Math.PI / 2; g.add(prong);
  }

  return [
    { id: "scrolls", pos: [0.15, 0.7, 0.5] }, { id: "motor", pos: [0.55, -0.15, 0.5] },
    { id: "shaft", pos: [0, 0.2, 0.55] }, { id: "suctionPort", pos: [-0.85, 0.25, 0.4] },
    { id: "dischargePort", pos: [0.85, 1.15, 0] }, { id: "terminals", pos: [0.85, 0.2, 0.55] }
  ];
}

/* ---------- TXV cutaway ---------- */
function buildTXV(g, anim) {
  const body = cyl(0.22, 0.7, BRASS(), 36); body.material = BRASS(); body.material.transparent = true; body.material.opacity = 0.42; body.material.side = THREE.DoubleSide; g.add(body);
  // cutaway half-shell in solid brass so the body still reads
  const solid = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.7, 36, 1, false, Math.PI * 0.15, Math.PI * 1.15), BRASS());
  g.add(solid);
  const inlet = cyl(0.11, 0.55, COPPER(), 20); inlet.rotation.z = Math.PI / 2; inlet.position.set(-0.5, 0, 0); g.add(tag(inlet, "inlet"));
  const outlet = cyl(0.13, 0.6, COPPER(), 20); outlet.position.set(0, -0.55, 0); g.add(tag(outlet, "outlet"));

  const head = cyl(0.28, 0.22, STEEL(), 32); head.position.y = 0.46; g.add(tag(head, "powerHead"));
  const diap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), paint(0xd7ccc8, { metalness: 0.5, roughness: 0.35, side: THREE.DoubleSide }));
  diap.position.y = 0.42; g.add(tag(diap, "diaphragm"));
  const spring = spiralMesh(6.5, 0.07, 0.07, 0.28, -0.05, 0.012, paint(0xcfd8dc, { metalness: 0.85, roughness: 0.2 }), 160);
  g.add(tag(spring, "spring"));
  const pin = cyl(0.035, 0.55, paint(0xeceff1, { metalness: 0.95, roughness: 0.15 }), 12); pin.position.y = 0.05; g.add(tag(pin, "pin"));
  const seat = cyl(0.06, 0.08, DARK(), 16); seat.position.y = -0.22; g.add(tag(seat, "orifice"));

  const cap = pipe([[0, 0.58, 0], [0.25, 0.95, 0.1], [0.9, 1.05, 0.25], [1.35, 0.35, 0.4]], 0.016, COPPER(), 48);
  g.add(tag(cap, "capillary"));
  const bulb = cyl(0.1, 0.58, COPPER(), 20); bulb.rotation.z = Math.PI / 2; bulb.position.set(1.55, 0.15, 0.4); g.add(tag(bulb, "bulb"));
  const eq = pipe([[0.18, -0.15, 0], [0.7, -0.15, -0.15], [1.15, -0.35, -0.25]], 0.02, COPPER(), 32);
  g.add(tag(eq, "equalizer"));

  const dropM = paint(0xff8a65, { roughness: 0.3, metalness: 0.1 });
  const drops = [];
  for (let i = 0; i < 7; i++) {
    const d = sphere(0.035, dropM.clone(), 8); d.userData.u = i / 7; g.add(d); drops.push(d);
  }
  anim.push(dt => {
    pin.position.y = 0.05 + Math.sin(performance.now() / 650) * 0.03;
    drops.forEach(d => {
      d.userData.u = (d.userData.u + dt * 0.28) % 1;
      const u = d.userData.u;
      if (u < 0.45) d.position.set(-0.7 + u * 1.55, 0, 0);
      else d.position.set(0, -(u - 0.45) * 1.5, 0);
      d.material.color.setHex(u < 0.45 ? 0xff8a65 : 0x4fc3f7);
    });
  });

  return [
    { id: "powerHead", pos: [0, 0.7, 0] }, { id: "diaphragm", pos: [0.35, 0.5, 0.2] },
    { id: "spring", pos: [0.3, 0.15, 0.2] }, { id: "pin", pos: [0, 0.05, 0.3] },
    { id: "orifice", pos: [0.25, -0.22, 0.2] }, { id: "bulb", pos: [1.55, 0.3, 0.45] },
    { id: "capillary", pos: [0.8, 1.05, 0.25] }, { id: "inlet", pos: [-0.7, 0.15, 0] },
    { id: "outlet", pos: [0, -0.9, 0] }, { id: "equalizer", pos: [1.0, -0.3, -0.25] }
  ];
}

/* ---------- evaporator A-coil + condenser slab ---------- */
function buildCoils(g) {
  const evap = new THREE.Group(); evap.position.set(-1.15, 0.15, 0); g.add(tag(evap, "aCoil"));
  const case_ = box(1.15, 1.35, 0.95, PANEL()); case_.material = PANEL(); case_.material.transparent = true; case_.material.opacity = 0.12; evap.add(case_);
  for (const s of [-1, 1]) {
    const slab = new THREE.Group();
    const fins = finBank(0.72, 0.85, 0.78, 22, ALUM());
    slab.add(tag(fins, "fins"));
    for (let i = 0; i < 6; i++) {
      const tube = cyl(0.028, 0.8, COPPER(), 12); tube.rotation.x = Math.PI / 2;
      tube.position.set(-0.22 + (i % 2) * 0.16, -0.3 + Math.floor(i / 2) * 0.28, 0);
      slab.add(tag(tube, "tubes"));
    }
    slab.rotation.z = s * 0.52; slab.position.set(s * 0.2, 0.05, 0); evap.add(slab);
  }
  const dist = cyl(0.05, 0.35, BRASS(), 16); dist.rotation.z = Math.PI / 2; dist.position.set(0, 0.62, 0.15); evap.add(tag(dist, "distributor"));
  const cap = pipe([[0, 0.62, 0.15], [0.15, 0.85, 0.2], [0.45, 0.9, 0.25]], 0.012, COPPER(), 24); evap.add(cap);
  const head = cyl(0.06, 0.7, COPPER(), 16); head.rotation.x = Math.PI / 2; head.position.set(0, -0.55, 0); evap.add(tag(head, "header"));

  const cond = new THREE.Group(); cond.position.set(1.25, 0.1, 0); g.add(tag(cond, "condCoil"));
  cond.add(finBank(0.28, 1.4, 1.35, 32, ALUM()));
  for (let i = 0; i < 7; i++) {
    const y = -0.58 + i * 0.19;
    cond.add(pipe([[-0.2, y, -0.62], [0.2, y, -0.62], [0.2, y, 0.62], [-0.2, y, 0.62]], 0.028, COPPER(), 36));
  }
  const hdrL = cyl(0.05, 1.3, COPPER(), 14); hdrL.rotation.x = Math.PI / 2; hdrL.position.set(-0.2, 0, 0); cond.add(tag(hdrL, "header"));

  return [
    { id: "aCoil", pos: [-1.15, 0.95, 0] }, { id: "fins", pos: [-1.15, 0.5, 0.5] },
    { id: "tubes", pos: [-0.7, 0.2, 0.5] }, { id: "distributor", pos: [-1.15, 0.9, 0.3] },
    { id: "header", pos: [-1.15, -0.55, 0.4] }, { id: "condCoil", pos: [1.25, 0.95, 0] }
  ];
}

/* ---------- gas furnace cutaway ---------- */
function buildFurnace(g, anim) {
  const cab = box(1.35, 2.15, 1.05, PANEL()); cab.material = PANEL(); cab.material.transparent = true; cab.material.opacity = 0.13; g.add(cab);
  const divider = box(1.28, 0.04, 0.98, DARK()); divider.position.y = 0.15; g.add(divider);

  // tubular heat exchanger
  const hx = new THREE.Group(); hx.position.set(0, 0.7, 0); g.add(tag(hx, "heatExchanger"));
  for (let i = 0; i < 4; i++) {
    const x = -0.42 + i * 0.28;
    const tube = pipe([[x, -0.35, 0.25], [x, 0.45, 0.25], [x, 0.55, 0], [x, 0.45, -0.25], [x, -0.15, -0.25]], 0.07, paint(0x9aa3aa, { metalness: 0.7, roughness: 0.35 }), 40);
    hx.add(tube);
  }
  const flue = cyl(0.16, 0.28, STEEL(), 20); flue.position.set(0, 1.15, -0.15); g.add(tag(flue, "flue"));

  // inshot burners
  const burners = new THREE.Group(); burners.position.set(0, 0.22, 0.28); g.add(tag(burners, "burners"));
  for (let i = 0; i < 4; i++) {
    const b = cyl(0.035, 0.35, paint(0x5d6a73, { metalness: 0.6 }), 12);
    b.rotation.z = Math.PI / 2; b.position.set(-0.42 + i * 0.28, 0, 0); burners.add(b);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 10, 1, true), paint(0xff9a3c, { emissive: 0xff6a00, emissiveIntensity: 0.85, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
    flame.position.set(-0.42 + i * 0.28, 0.16, 0); burners.add(flame);
    anim.push(dt => { flame.scale.y = 0.9 + Math.sin(performance.now() / 140 + i) * 0.12; });
  }
  const valve = box(0.28, 0.16, 0.18, paint(0x90a4ae, { metalness: 0.5 })); valve.position.set(-0.55, 0.05, 0.35); g.add(tag(valve, "gasValve"));
  const gas = pipe([[-0.7, 0.05, 0.35], [-0.55, 0.05, 0.35], [-0.2, 0.2, 0.28], [0.42, 0.2, 0.28]], 0.025, paint(0x888888, { metalness: 0.7 }), 24); g.add(gas);

  const inducer = new THREE.Group(); inducer.position.set(0.45, 0.55, -0.35); g.add(tag(inducer, "inducer"));
  inducer.add(cyl(0.16, 0.14, DARK(), 20));
  const wheel = cyl(0.13, 0.05, STEEL(), 16); inducer.add(wheel);
  anim.push(dt => { wheel.rotation.y += dt * 14; });

  const limit = box(0.16, 0.1, 0.06, paint(0x37474f)); limit.position.set(0.5, 0.85, 0.45); g.add(tag(limit, "limit"));

  // blower compartment
  const blower = new THREE.Group(); blower.position.set(0, -0.55, 0); g.add(tag(blower, "blower"));
  const cage = cyl(0.38, 0.5, paint(0x455a64, { metalness: 0.5, roughness: 0.4, transparent: true, opacity: 0.45 }), 28, false);
  cage.rotation.z = Math.PI / 2; blower.add(cage);
  for (let i = 0; i < 14; i++) {
    const vane = box(0.04, 0.22, 0.46, DARK());
    const h = new THREE.Group(); h.rotation.x = i * (Math.PI * 2 / 14); vane.position.y = 0.2; h.add(vane); blower.add(h);
  }
  anim.push(dt => { blower.rotation.x += dt * 7; });
  const filt = box(1.15, 0.06, 0.9, paint(0xefebe0, { roughness: 0.92, metalness: 0 })); filt.position.y = -0.98; g.add(tag(filt, "filter"));

  return [
    { id: "heatExchanger", pos: [0, 1.15, 0.4] }, { id: "burners", pos: [0, 0.4, 0.55] },
    { id: "gasValve", pos: [-0.7, 0.15, 0.5] }, { id: "inducer", pos: [0.7, 0.7, -0.35] },
    { id: "limit", pos: [0.65, 0.95, 0.5] }, { id: "flue", pos: [0, 1.4, -0.15] },
    { id: "blower", pos: [0.55, -0.55, 0.4] }, { id: "filter", pos: [0, -1.05, 0.4] }
  ];
}

const BUILDERS = { split: buildSplit, cycle: buildCycle, compressor: buildCompressor, txv: buildTXV, coils: (g, anim) => buildCoils(g, anim), furnace: buildFurnace };
const CAM = {
  split: [3.5, 2.0, 5.2], cycle: [0.4, 2.4, 5.0], compressor: [2.3, 1.5, 3.4],
  txv: [2.0, 1.3, 3.2], coils: [0.4, 1.8, 4.4], furnace: [2.6, 1.6, 3.8]
};

export function mount(el, which, labels, onPick) {
  const W = el.clientWidth, H = el.clientHeight || 300;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  el.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
  const cp = CAM[which] || CAM.compressor;
  cam.position.set(...cp);
  if (W / H < 1.2) cam.position.multiplyScalar(1 + (1.2 - W / H) * 0.9);
  addLights(scene);
  const g = new THREE.Group(); scene.add(g);
  const anim = [];
  const builder = BUILDERS[which] || BUILDERS.split;
  const pts = builder(g, anim) || [];
  const ctl = new OrbitControls(cam, renderer.domElement);
  ctl.enableDamping = true; ctl.dampingFactor = 0.08; ctl.enablePan = false;
  ctl.minDistance = 1.8; ctl.maxDistance = 11; ctl.autoRotate = true; ctl.autoRotateSpeed = 0.9;
  ctl.addEventListener("start", () => { ctl.autoRotate = false; });
  let resume;
  ctl.addEventListener("end", () => {
    clearTimeout(resume);
    resume = setTimeout(() => { ctl.autoRotate = true; }, 1800);
  });

  const showLabels = !!(labels && Object.keys(labels).length && pts.length);
  const overlay = document.createElement("div"); overlay.className = "m3d-labels";
  if (showLabels) el.appendChild(overlay);
  const tags = showLabels ? pts.map(p => {
    const b = document.createElement("button");
    b.className = "m3d-tag"; b.type = "button";
    b.textContent = labels[p.id] || p.id;
    b.onclick = () => onPick && onPick(p.id);
    overlay.appendChild(b);
    return { b, v: new THREE.Vector3(...p.pos) };
  }) : [];

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("reduce-motion");
  if (reduced) ctl.autoRotate = false;
  let last = performance.now(), running = true, visible = true;
  const io = new IntersectionObserver(e => { visible = e[0].isIntersecting; }); io.observe(el);
  function frame(now) {
    if (!running) return; requestAnimationFrame(frame); if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!reduced) anim.forEach(f => f(dt));
    ctl.update(); renderer.render(scene, cam);
    const w = el.clientWidth, h = el.clientHeight;
    tags.forEach(t => {
      const p = t.v.clone().applyMatrix4(g.matrixWorld).project(cam);
      const bw = t.bw || (t.bw = t.b.offsetWidth || 80), bh = t.b.offsetHeight || 22;
      const x = Math.min(w - bw - 6, Math.max(6, (p.x * 0.5 + 0.5) * w - bw / 2));
      const y = Math.min(h - bh - 6, Math.max(6, (-p.y * 0.5 + 0.5) * h - bh / 2));
      t.b.style.transform = `translate(${x}px, ${y}px)`;
      t.b.style.opacity = p.z < 1 ? "1" : "0";
    });
  }
  requestAnimationFrame(frame);
  const ro = new ResizeObserver(() => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix();
  }); ro.observe(el);
  return () => { running = false; clearTimeout(resume); io.disconnect(); ro.disconnect(); renderer.dispose(); el.innerHTML = ""; };
}
