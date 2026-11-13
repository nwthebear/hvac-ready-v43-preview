/* Teaching 3D cutaways. Local three.js r160 + RoomEnvironment / PMREM / ACES.
   mount(el, which, labels, onPick) — labels only when provided (this page). */
import * as THREE from "../vendor/three/three.module.min.js";
import { OrbitControls } from "../vendor/three/OrbitControls.js";
import { RoomEnvironment } from "../vendor/three/RoomEnvironment.js";

/* ---------- maps & materials ---------- */
function noiseTex(size, contrast, streak) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    let row = 128;
    for (let x = 0; x < size; x++) {
      const n = streak
        ? (row += (Math.random() - 0.5) * 18, row * (1 - contrast) + (Math.random() * 255) * contrast)
        : 128 + (Math.random() - 0.5) * 255 * contrast;
      const i = (y * size + x) * 4;
      const v = Math.max(0, Math.min(255, n));
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

let MAPS;
function maps() {
  if (MAPS) return MAPS;
  MAPS = {
    brush: noiseTex(256, 0.22, true),
    grit: noiseTex(256, 0.35, false)
  };
  MAPS.brush.repeat.set(2, 6);
  MAPS.grit.repeat.set(3, 3);
  return MAPS;
}

const std = (color, o = {}) => {
  const m = maps();
  const { brush, ...rest } = o;
  return new THREE.MeshStandardMaterial({
    color, metalness: 0.7, roughness: 0.35,
    roughnessMap: brush ? m.brush : m.grit,
    envMapIntensity: 1.05,
    ...rest
  });
};
const phys = (color, o = {}) => new THREE.MeshPhysicalMaterial({
  color, metalness: 0.8, roughness: 0.3, envMapIntensity: 1.1, ...o
});

const MAT = {
  paint: (hex = 0x2c3036) => std(hex, { metalness: 0.18, roughness: 0.48, brush: true, envMapIntensity: 0.7 }),
  steel: (hex = 0x9aa3ab) => std(hex, { metalness: 0.86, roughness: 0.28, brush: true }),
  darkSteel: () => std(0x3a4148, { metalness: 0.8, roughness: 0.32, brush: true }),
  copper: () => phys(0xb87333, { metalness: 0.95, roughness: 0.22, clearcoat: 0.15, clearcoatRoughness: 0.4 }),
  brass: () => phys(0xc4a35a, { metalness: 0.92, roughness: 0.26, clearcoat: 0.2, clearcoatRoughness: 0.35 }),
  alum: () => std(0x8e99a2, { metalness: 0.62, roughness: 0.42, envMapIntensity: 0.7 }),
  iron: () => std(0x2a2d31, { metalness: 0.55, roughness: 0.55 }),
  cut: () => std(0xe4c39a, { metalness: 0.18, roughness: 0.58, roughnessMap: maps().grit, envMapIntensity: 0.55 }),
  oil: () => phys(0x8a5a14, { metalness: 0.05, roughness: 0.12, transparent: true, opacity: 0.78, transmission: 0.15, ior: 1.45, thickness: 0.2 }),
  insul: () => std(0x1b242c, { metalness: 0.04, roughness: 0.92 }),
  plastic: (hex = 0x1a1c1e) => std(hex, { metalness: 0.08, roughness: 0.55 }),
  rubber: () => std(0x171717, { metalness: 0.05, roughness: 0.85 }),
  glass: () => phys(0xcfe8f4, { metalness: 0.05, roughness: 0.05, transparent: true, opacity: 0.35, transmission: 0.7, thickness: 0.05 }),
  wire: () => phys(0xd4a017, { metalness: 0.85, roughness: 0.28 }),
  lami: () => std(0x4b535a, { metalness: 0.7, roughness: 0.4 }),
  orange: () => std(0xc65a16, { metalness: 0.2, roughness: 0.5 })
};
MAT.bevel = () => std(0x6a5a48, { metalness: 0.35, roughness: 0.45 });

/* ---------- primitives ---------- */
function mesh(geo, mat) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
function box(w, h, d, mat) { return mesh(new THREE.BoxGeometry(w, h, d), mat); }
function cyl(r, h, mat, seg = 48, cap = true) { return mesh(new THREE.CylinderGeometry(r, r, h, seg, 1, !cap), mat); }
function cyl2(rt, rb, h, mat, seg = 48) { return mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); }
function sphere(r, mat, w = 32, h = 24) { return mesh(new THREE.SphereGeometry(r, w, h), mat); }
function torus(r, t, mat, rs = 12, ts = 48, start = 0, length = Math.PI * 2) {
  return mesh(new THREE.TorusGeometry(r, t, rs, ts, length), mat);
}
function pipe(points, r, mat, segs = 48, radSeg = 10) {
  const c = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, "catmullrom", 0.05);
  return mesh(new THREE.TubeGeometry(c, segs, r, radSeg, false), mat);
}
function tag(obj, id) { obj.userData.part = id; return obj; }

function weld(radius, tube, y, mat, thetaStart = 0, thetaLength = Math.PI * 2) {
  const w = torus(radius, tube, mat, 8, 40, 0, thetaLength);
  w.rotation.x = Math.PI / 2;
  w.rotation.z = thetaStart;
  w.position.y = y;
  return w;
}

/** Two radial section faces + a thin darker bevel lip. theta0/theta1 in radians. */
function cutWedge(rInner, rOuter, y0, y1, theta0, theta1, group) {
  const cut = MAT.cut(), lip = MAT.bevel();
  const h = y1 - y0, midR = (rInner + rOuter) / 2, w = rOuter - rInner;
  [theta0, theta1].forEach(th => {
    const face = box(w, h, 0.02, cut);
    face.position.set(Math.cos(th) * midR, (y0 + y1) / 2, Math.sin(th) * midR);
    face.rotation.y = -th;
    group.add(face);
    const edge = box(0.016, h, 0.026, lip);
    edge.position.set(Math.cos(th) * rOuter, (y0 + y1) / 2, Math.sin(th) * rOuter);
    edge.rotation.y = -th;
    group.add(edge);
  });
}

function foot(x, z, group, scale = 1) {
  const g = new THREE.Group();
  const pad = box(0.22 * scale, 0.04 * scale, 0.16 * scale, MAT.darkSteel());
  pad.position.y = 0.02 * scale;
  const upright = box(0.05 * scale, 0.16 * scale, 0.12 * scale, MAT.darkSteel());
  upright.position.set(0, 0.1 * scale, 0);
  const bolt = cyl(0.018 * scale, 0.05 * scale, MAT.steel(), 10);
  bolt.position.set(0.06 * scale, 0.05 * scale, 0);
  g.add(pad, upright, bolt);
  g.position.set(x, 0, z);
  group.add(g);
  return g;
}

function makeScrollGeo(turns, r0, r1, thickness, height, segs = 90) {
  const shape = new THREE.Shape();
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, a = t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t;
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
  for (let i = segs; i >= 0; i--) {
    const t = i / segs, a = t * turns * Math.PI * 2, r = Math.max(0.018, r0 + (r1 - r0) * t - thickness);
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
  shape.setFromPoints(pts);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height, bevelEnabled: true, bevelThickness: 0.007, bevelSize: 0.005, bevelSegments: 1, curveSegments: 1
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -height / 2, 0);
  geo.computeVertexNormals();
  return geo;
}

function finBank(w, h, depth, count, mat) {
  const geo = new THREE.BoxGeometry(w, h, Math.max(0.005, depth / (count * 10)));
  const meshI = new THREE.InstancedMesh(geo, mat, count);
  meshI.castShadow = true;
  meshI.receiveShadow = true;
  const dummy = new THREE.Object3D();
  const z0 = -depth / 2;
  for (let i = 0; i < count; i++) {
    dummy.position.set(0, 0, z0 + (count === 1 ? 0 : (i / (count - 1)) * depth));
    dummy.updateMatrix();
    meshI.setMatrixAt(i, dummy.matrix);
  }
  meshI.instanceMatrix.needsUpdate = true;
  return meshI;
}

function hairpins(group, x, y0, y1, zHalf, count, r, mat) {
  const step = (y1 - y0) / Math.max(1, count - 1);
  for (let i = 0; i < count; i++) {
    const y = y0 + i * step;
    group.add(pipe(
      [[x, y, -zHalf], [x + r * 2.2, y, -zHalf], [x + r * 2.2, y, zHalf], [x, y, zHalf]],
      r, mat, 36, 8
    ));
  }
}

/* ===================== MODELS ===================== */

function buildCompressor(g, anim) {
  /* Open a ~106° wedge toward the default camera (+X +Z). */
  const GAP = 1.85, FACE = Math.atan2(3.3, 2.5);
  const TH0 = FACE + GAP / 2, THL = Math.PI * 2 - GAP, TH1 = TH0 + THL;
  const R = 0.62, H = 1.55, yBot = -0.72, yTop = yBot + H;
  const paint = MAT.paint(0x2a2e33);
  const steel = MAT.steel();

  const shell = mesh(new THREE.CylinderGeometry(R, R * 1.02, H, 64, 1, true, TH0, THL), paint);
  shell.position.y = (yBot + yTop) / 2;
  g.add(shell);
  const bottom = mesh(new THREE.CylinderGeometry(R * 1.02, R * 1.08, 0.1, 48), MAT.darkSteel());
  bottom.position.y = yBot - 0.02;
  g.add(bottom);
  /* elliptical dome, same wedge */
  const dome = mesh(new THREE.SphereGeometry(R, 48, 24, TH0, THL, 0, Math.PI / 2), paint);
  dome.scale.set(1, 0.62, 1);
  dome.position.y = yTop;
  g.add(dome);
  /* closed top of remaining dome lip */
  const crown = mesh(new THREE.SphereGeometry(0.22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), MAT.darkSteel());
  crown.scale.set(1, 0.45, 1);
  crown.position.y = yTop + 0.08;
  g.add(crown);

  g.add(weld(R, 0.016, yBot + 0.08, steel, TH0, THL));
  g.add(weld(R, 0.018, yTop - 0.02, steel, TH0, THL));
  g.add(weld(R, 0.014, (yBot + yTop) / 2 + 0.08, steel, TH0, THL));
  cutWedge(0.0, R, yBot, yTop, TH0, TH1, g);
  /* dome cut faces (approximate radial slabs) */
  cutWedge(0.0, R, yTop, yTop + 0.36, TH0, TH1, g);

  /* mounting feet */
  [[-0.42, 0.38], [0.42, 0.38], [-0.42, -0.38], [0.42, -0.38]].forEach(([x, z]) => {
    const f = foot(x, z, g);
    f.position.y = yBot - 0.08;
  });

  /* oil sump */
  const oil = cyl(R * 0.86, 0.22, MAT.oil(), 40);
  oil.position.y = yBot + 0.16;
  oil.castShadow = false;
  g.add(oil);
  /* sight glass */
  const glass = cyl(0.07, 0.02, MAT.glass(), 20);
  glass.rotation.z = Math.PI / 2;
  glass.position.set(Math.cos(TH0 + THL * 0.35) * (R + 0.01), yBot + 0.2, Math.sin(TH0 + THL * 0.35) * (R + 0.01));
  g.add(glass);

  /* stator laminations + copper windings */
  const stator = tag(new THREE.Group(), "motor");
  stator.position.y = yBot + 0.52;
  const stack = mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.42, 48, 6, false, TH0, THL), MAT.lami());
  stator.add(stack);
  /* visible lamination rings at the cut */
  for (let i = 0; i < 8; i++) {
    const ring = mesh(new THREE.TorusGeometry(0.46, 0.006, 6, 40, THL), MAT.steel(0x6a7278));
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = TH0;
    ring.position.y = -0.18 + i * 0.05;
    stator.add(ring);
  }
  for (let i = 0; i < 12; i++) {
    const a = TH0 - 0.15 + (i / 11) * (THL + 0.3);
    /* keep windings on the visible cut as well as around the stator */
    const loop = mesh(new THREE.TorusGeometry(0.1, 0.028, 8, 16), MAT.wire());
    loop.position.set(Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4);
    loop.lookAt(0, 0, 0);
    loop.rotateX(Math.PI / 2);
    stator.add(loop);
  }
  g.add(stator);

  const rotor = cyl(0.18, 0.4, MAT.darkSteel(), 32);
  rotor.position.y = yBot + 0.52;
  g.add(rotor);

  const shaft = tag(cyl(0.05, 1.05, MAT.steel(0xd0d6dc), 16), "shaft");
  shaft.position.y = yBot + 0.85;
  g.add(shaft);
  /* eccentric / crank for orbiting scroll */
  const ecc = cyl(0.08, 0.1, MAT.steel(), 16);
  ecc.position.set(0.035, yBot + 1.22, 0);
  g.add(ecc);

  /* scrolls — thick spiral tubes so the involute reads clearly in the cut */
  const scrolls = tag(new THREE.Group(), "scrolls");
  scrolls.position.y = yBot + 1.28;
  function spiralMesh(turns, r0, r1, y, tube, mat, phase) {
    const pts = [];
    for (let i = 0; i <= 110; i++) {
      const t = i / 110, a = phase + t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 110, tube, 8, false), mat);
  }
  const fixed = spiralMesh(2.4, 0.06, 0.4, 0.05, 0.03, MAT.steel(0xe2e7ec), 0);
  const orbit = spiralMesh(2.4, 0.06, 0.4, -0.05, 0.03, MAT.steel(0xc0c8d0), 0.7);
  const plate = cyl(0.44, 0.04, MAT.darkSteel(), 40);
  plate.position.y = 0.12;
  const plate2 = cyl(0.44, 0.03, MAT.darkSteel(), 40);
  plate2.position.y = -0.12;
  scrolls.add(fixed, orbit, plate, plate2);
  g.add(scrolls);
  anim.push(dt => { orbit.rotation.y += dt * 1.6; });

  /* suction stub — large, side, copper neck into painted steel */
  const sucAng = TH0 + THL * 0.62;
  const suc = tag(new THREE.Group(), "suctionPort");
  const sucSteel = cyl(0.11, 0.22, MAT.paint(0x2a2e33), 24);
  sucSteel.rotation.z = Math.PI / 2;
  const sucCu = cyl(0.1, 0.38, MAT.copper(), 24);
  sucCu.rotation.z = Math.PI / 2;
  sucCu.position.x = 0.28;
  const sucFl = cyl2(0.13, 0.11, 0.05, MAT.steel(), 20);
  sucFl.rotation.z = Math.PI / 2;
  sucFl.position.x = 0.12;
  suc.add(sucSteel, sucCu, sucFl);
  suc.position.set(Math.cos(sucAng) * (R - 0.02), yBot + 0.7, Math.sin(sucAng) * (R - 0.02));
  suc.rotation.y = -sucAng + Math.PI / 2;
  g.add(suc);

  /* discharge — from the dome, copper */
  const dis = tag(new THREE.Group(), "dischargePort");
  const d1 = cyl(0.07, 0.16, MAT.paint(0x2a2e33), 20);
  const d2 = pipe([[0, 0.08, 0], [0, 0.22, 0], [0.18, 0.34, 0], [0.42, 0.28, 0.05]], 0.065, MAT.copper(), 28, 10);
  dis.add(d1, d2);
  dis.position.set(0.12, yTop + 0.05, 0.05);
  g.add(dis);

  /* terminal box */
  const boxG = tag(new THREE.Group(), "terminals");
  const tbox = box(0.34, 0.26, 0.2, MAT.plastic(0x1c1e22));
  const lid = box(0.36, 0.03, 0.22, MAT.plastic(0x111214));
  lid.position.y = 0.14;
  boxG.add(tbox, lid);
  const cols = [0xc4a35a, 0xc4a35a, 0xc4a35a];
  ["#bbb", "#bbb", "#bbb"].forEach((_, i) => {
    const prong = cyl(0.018, 0.1, MAT.steel(0xeee8aa), 8);
    prong.rotation.x = Math.PI / 2;
    prong.position.set(-0.08 + i * 0.08, 0.02, 0.14);
    boxG.add(prong);
  });
  const tbAng = TH0 + 0.35;
  boxG.position.set(Math.cos(tbAng) * (R + 0.1), yBot + 0.55, Math.sin(tbAng) * (R + 0.1));
  boxG.rotation.y = -tbAng;
  g.add(boxG);

  /* nameplate */
  const plateN = box(0.28, 0.12, 0.01, MAT.steel(0xc9c3b0));
  plateN.position.set(Math.cos(TH0 + 0.7) * (R + 0.01), yBot + 1.05, Math.sin(TH0 + 0.7) * (R + 0.01));
  plateN.rotation.y = -(TH0 + 0.7);
  g.add(plateN);

  return [
    { id: "scrolls", pos: [0.2, yBot + 1.28, 0.45] },
    { id: "motor", pos: [0.55, yBot + 0.52, 0.35] },
    { id: "shaft", pos: [0.05, yBot + 0.9, 0.45] },
    { id: "suctionPort", pos: [Math.cos(sucAng) * (R + 0.4), yBot + 0.7, Math.sin(sucAng) * (R + 0.4)] },
    { id: "dischargePort", pos: [0.5, yTop + 0.28, 0.05] },
    { id: "terminals", pos: [boxG.position.x, boxG.position.y + 0.2, boxG.position.z] }
  ];
}

function buildTXV(g, anim) {
  const GAP = 2.05, FACE = Math.atan2(3.2, 2.1);
  const TH0 = FACE + GAP / 2, THL = Math.PI * 2 - GAP, TH1 = TH0 + THL;
  const bodyR = 0.2, bodyH = 0.72;
  const brass = MAT.brass();
  const brassCut = mesh(new THREE.CylinderGeometry(bodyR, bodyR, bodyH, 48, 1, false, TH0, THL), brass);
  g.add(brassCut);
  /* hex flats around the lower body */
  const hex = mesh(new THREE.CylinderGeometry(bodyR * 1.12, bodyR * 1.12, 0.16, 6), brass);
  hex.position.y = -0.22;
  g.add(hex);
  cutWedge(0, bodyR, -bodyH / 2, bodyH / 2, TH0, TH1, g);

  const inlet = tag(new THREE.Group(), "inlet");
  const inCu = cyl(0.09, 0.55, MAT.copper(), 24);
  inCu.rotation.z = Math.PI / 2;
  const inNut = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 6), brass);
  inNut.rotation.z = Math.PI / 2;
  inNut.position.x = -0.18;
  inlet.add(inCu, inNut);
  inlet.position.set(-0.42, 0.02, 0);
  g.add(inlet);

  const outlet = tag(new THREE.Group(), "outlet");
  const outCu = cyl(0.11, 0.55, MAT.copper(), 24);
  const outNut = mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.1, 6), brass);
  outNut.position.y = 0.18;
  outlet.add(outCu, outNut);
  outlet.position.set(0, -0.58, 0);
  g.add(outlet);

  const head = tag(cyl(0.26, 0.2, MAT.steel(), 40), "powerHead");
  head.position.y = 0.48;
  g.add(head);
  const dome = mesh(new THREE.SphereGeometry(0.26, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), MAT.steel());
  dome.scale.set(1, 0.45, 1);
  dome.position.y = 0.58;
  g.add(dome);

  const diap = tag(mesh(new THREE.SphereGeometry(0.18, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), MAT.steel(0xd7ccc8)), "diaphragm");
  diap.position.y = 0.4;
  g.add(diap);

  const springPts = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80, a = t * 7 * Math.PI * 2;
    springPts.push(new THREE.Vector3(Math.cos(a) * 0.07, 0.32 - t * 0.38, Math.sin(a) * 0.07));
  }
  const spring = tag(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(springPts), 80, 0.012, 8, false), MAT.steel(0xcfd8dc)), "spring");
  g.add(spring);

  const pin = tag(cyl(0.03, 0.55, MAT.steel(0xeceff1), 12), "pin");
  pin.position.y = 0.06;
  g.add(pin);
  const seat = tag(cyl(0.055, 0.07, MAT.darkSteel(), 16), "orifice");
  seat.position.y = -0.22;
  g.add(seat);

  const cap = tag(pipe([[0, 0.62, 0], [0.22, 0.95, 0.08], [0.85, 1.08, 0.22], [1.32, 0.4, 0.38]], 0.015, MAT.copper(), 48), "capillary");
  g.add(cap);
  const bulb = tag(new THREE.Group(), "bulb");
  const bulbBody = cyl(0.09, 0.58, MAT.copper(), 24);
  bulbBody.rotation.z = Math.PI / 2;
  const bulbCap = sphere(0.09, MAT.copper(), 16, 12);
  bulbCap.position.x = 0.29;
  const bulbCap2 = bulbCap.clone(); bulbCap2.position.x = -0.29;
  bulb.add(bulbBody, bulbCap, bulbCap2);
  bulb.position.set(1.55, 0.18, 0.38);
  g.add(bulb);

  const eq = tag(pipe([[0.16, -0.12, 0], [0.65, -0.12, -0.12], [1.12, -0.32, -0.22]], 0.018, MAT.copper(), 32), "equalizer");
  g.add(eq);

  const drops = [];
  for (let i = 0; i < 8; i++) {
    const d = mesh(new THREE.SphereGeometry(0.03, 10, 8), phys(0xff8a65, { roughness: 0.25, metalness: 0.1, emissive: 0x331100, emissiveIntensity: 0.15 }));
    d.castShadow = false;
    d.userData.u = i / 8;
    g.add(d); drops.push(d);
  }
  anim.push(() => {
    pin.position.y = 0.06 + Math.sin(performance.now() / 700) * 0.028;
    drops.forEach(d => {
      d.userData.u = (d.userData.u + 0.0045) % 1;
      const u = d.userData.u;
      if (u < 0.45) d.position.set(-0.65 + u * 1.45, 0.02, 0);
      else d.position.set(0, -(u - 0.45) * 1.35, 0);
      d.material.color.setHex(u < 0.45 ? 0xff8a65 : 0x4fc3f7);
    });
  });

  return [
    { id: "powerHead", pos: [0, 0.75, 0] }, { id: "diaphragm", pos: [0.32, 0.48, 0.2] },
    { id: "spring", pos: [0.28, 0.16, 0.22] }, { id: "pin", pos: [0, 0.05, 0.28] },
    { id: "orifice", pos: [0.22, -0.22, 0.2] }, { id: "bulb", pos: [1.55, 0.35, 0.45] },
    { id: "capillary", pos: [0.75, 1.08, 0.22] }, { id: "inlet", pos: [-0.7, 0.18, 0] },
    { id: "outlet", pos: [0, -0.95, 0] }, { id: "equalizer", pos: [1.0, -0.28, -0.22] }
  ];
}

function buildCoils(g) {
  /* Indoor A-coil */
  const evap = tag(new THREE.Group(), "aCoil");
  evap.position.set(-1.15, 0.1, 0);
  evap.rotation.y = 0.45;
  const case_ = box(1.2, 1.4, 0.98, MAT.paint(0xc8cdd3));
  case_.material = MAT.paint(0xc8cdd3);
  case_.material.transparent = true;
  case_.material.opacity = 0.12;
  evap.add(case_);
  const pan = box(1.15, 0.06, 0.92, MAT.alum());
  pan.position.y = -0.68;
  evap.add(pan);
  const finM = MAT.alum();
  for (const s of [-1, 1]) {
    const slab = new THREE.Group();
    const fins = tag(finBank(0.08, 0.88, 0.82, 36, finM), "fins");
    fins.position.x = 0;
    slab.add(fins);
    hairpins(slab, 0, -0.34, 0.34, 0.38, 5, 0.022, MAT.copper());
    slab.rotation.z = s * 0.5;
    slab.position.set(s * 0.2, 0.05, 0);
    evap.add(tag(slab, "tubes"));
  }
  const dist = tag(cyl(0.045, 0.38, MAT.brass(), 16), "distributor");
  dist.rotation.z = Math.PI / 2;
  dist.position.set(0, 0.62, 0.12);
  evap.add(dist);
  for (let i = 0; i < 5; i++) {
    evap.add(pipe([[0, 0.62, 0.12], [0.05 * (i - 2), 0.55, 0.05], [(i - 2) * 0.08, 0.4, 0]], 0.008, MAT.copper(), 16));
  }
  const head = tag(cyl(0.05, 0.72, MAT.copper(), 14), "header");
  head.rotation.x = Math.PI / 2;
  head.position.set(0, -0.52, 0);
  evap.add(head);
  g.add(evap);

  /* Outdoor condenser slab */
  const cond = tag(new THREE.Group(), "condCoil");
  cond.position.set(1.2, 0.05, 0);
  cond.rotation.y = -0.95;
  const sheetM = MAT.steel(0x8a9298);
  const endL = box(0.42, 1.42, 0.05, sheetM); endL.position.z = -0.66;
  const endR = endL.clone(); endR.position.z = 0.66;
  cond.add(endL, endR);
  cond.add(tag(finBank(0.42, 1.36, 1.28, 52, finM), "fins"));
  hairpins(cond, 0.16, -0.58, 0.58, 0.6, 8, 0.024, MAT.copper());
  const hdr = tag(cyl(0.05, 1.28, MAT.copper(), 14), "header");
  hdr.rotation.x = Math.PI / 2;
  hdr.position.set(-0.2, 0, 0);
  cond.add(hdr);
  g.add(cond);

  return [
    { id: "aCoil", pos: [-1.2, 0.95, 0] }, { id: "fins", pos: [-1.2, 0.45, 0.55] },
    { id: "tubes", pos: [-0.7, 0.15, 0.5] }, { id: "distributor", pos: [-1.2, 0.88, 0.28] },
    { id: "header", pos: [-1.2, -0.52, 0.45] }, { id: "condCoil", pos: [1.25, 0.95, 0] }
  ];
}

function buildFurnace(g, anim) {
  const cabPaint = MAT.paint(0x8a9098);
  const cab = box(1.4, 2.2, 1.08, cabPaint);
  cab.material = cabPaint.clone();
  cab.material.transparent = true;
  cab.material.opacity = 0.08;
  g.add(cab);
  const back = box(1.4, 2.2, 0.05, MAT.paint(0x7e848c));
  back.position.z = -0.52;
  const sideL = box(0.05, 2.2, 1.08, MAT.paint(0x7e848c));
  sideL.position.x = -0.68;
  g.add(back, sideL);
  /* beveled front cut opening */
  const lip = MAT.cut();
  const bevel = MAT.bevel();
  [[0, 1.1, 0.54, 1.4, 0.03, 0.03], [0, -1.1, 0.54, 1.4, 0.03, 0.03], [0.7, 0, 0.54, 0.03, 2.2, 0.03], [-0.7, 0, 0.54, 0.03, 2.2, 0.03]].forEach(([x,y,z,w,h,d]) => {
    const a = box(w, h, d, lip); a.position.set(x, y, z); g.add(a);
    const b = box(Math.max(0.02, w*0.5), Math.max(0.02, h*0.5), d+0.01, bevel); b.position.set(x, y, z+0.01); g.add(b);
  });
  const div = box(1.32, 0.04, 1.0, MAT.darkSteel());
  div.position.y = 0.18;
  g.add(div);

  const hx = tag(new THREE.Group(), "heatExchanger");
  hx.position.set(0, 0.72, 0);
  const hxMat = MAT.steel(0x8f9aa3);
  for (let i = 0; i < 4; i++) {
    const x = -0.45 + i * 0.3;
    hx.add(pipe(
      [[x, -0.38, 0.28], [x, 0.5, 0.28], [x, 0.62, 0], [x, 0.5, -0.28], [x, -0.12, -0.28], [x, -0.22, 0]],
      0.068, hxMat, 48, 10
    ));
  }
  g.add(hx);
  const flue = tag(cyl(0.15, 0.28, MAT.steel(), 24), "flue");
  flue.position.set(0, 1.22, -0.18);
  const flueLip = weld(0.15, 0.012, 0.14, MAT.steel());
  flue.add(flueLip);
  g.add(flue);

  const burners = tag(new THREE.Group(), "burners");
  burners.position.set(0, 0.24, 0.3);
  for (let i = 0; i < 4; i++) {
    const x = -0.45 + i * 0.3;
    const tube = cyl(0.032, 0.36, MAT.darkSteel(), 12);
    tube.rotation.z = Math.PI / 2;
    tube.position.set(x, 0, 0);
    burners.add(tube);
    const flame = mesh(
      new THREE.ConeGeometry(0.042, 0.24, 12, 1, true),
      phys(0xff9a3c, { emissive: 0xff6a00, emissiveIntensity: 0.9, transparent: true, opacity: 0.88, side: THREE.DoubleSide, metalness: 0, roughness: 0.6 })
    );
    flame.castShadow = false;
    flame.position.set(x, 0.18, 0);
    burners.add(flame);
    anim.push(() => { flame.scale.y = 0.88 + Math.sin(performance.now() / 130 + i) * 0.14; });
  }
  g.add(burners);

  const valve = tag(new THREE.Group(), "gasValve");
  const vBody = box(0.32, 0.18, 0.2, MAT.paint(0x90a4ae));
  const vKnob = cyl(0.05, 0.06, MAT.plastic(0x111), 16);
  vKnob.position.y = 0.12;
  valve.add(vBody, vKnob);
  valve.position.set(-0.58, 0.06, 0.36);
  g.add(valve);
  g.add(pipe([[-0.72, 0.06, 0.36], [-0.5, 0.06, 0.36], [-0.2, 0.22, 0.3], [0.45, 0.22, 0.3]], 0.022, MAT.steel(0x888888), 24));

  const inducer = tag(new THREE.Group(), "inducer");
  inducer.position.set(0.48, 0.58, -0.36);
  const iHous = cyl(0.18, 0.16, MAT.paint(0x3a3f44), 28);
  const iWheel = cyl(0.14, 0.05, MAT.steel(), 20);
  inducer.add(iHous, iWheel);
  g.add(inducer);
  anim.push(dt => { iWheel.rotation.y += dt * 12; });

  const limit = tag(box(0.16, 0.1, 0.06, MAT.plastic(0x2a2a2a)), "limit");
  limit.position.set(0.52, 0.9, 0.46);
  g.add(limit);

  /* blower in a scroll housing */
  const blower = tag(new THREE.Group(), "blower");
  blower.position.set(0, -0.52, 0);
  const hous = mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.52, 32, 1, true, 0.4, Math.PI * 1.6), MAT.paint(0x4a5560));
  hous.rotation.z = Math.PI / 2;
  const outletD = box(0.28, 0.36, 0.4, MAT.paint(0x4a5560));
  outletD.position.set(0.35, 0.25, 0);
  blower.add(hous, outletD);
  const wheel = new THREE.Group();
  const hub = cyl(0.08, 0.36, MAT.darkSteel(), 16);
  hub.rotation.z = Math.PI / 2;
  wheel.add(hub);
  for (let i = 0; i < 16; i++) {
    const vane = box(0.03, 0.2, 0.36, MAT.steel(0x5a6570));
    const h = new THREE.Group();
    h.rotation.x = i * (Math.PI * 2 / 16);
    vane.position.y = 0.2;
    h.add(vane);
    wheel.add(h);
  }
  blower.add(wheel);
  g.add(blower);
  anim.push(dt => { wheel.rotation.x += dt * 6.5; });

  const filt = tag(box(1.28, 0.07, 0.96, std(0xefebe0, { metalness: 0, roughness: 0.95 })), "filter");
  filt.position.y = -1.0;
  g.add(filt);

  return [
    { id: "heatExchanger", pos: [0, 1.2, 0.45] }, { id: "burners", pos: [0, 0.42, 0.55] },
    { id: "gasValve", pos: [-0.72, 0.18, 0.5] }, { id: "inducer", pos: [0.72, 0.72, -0.36] },
    { id: "limit", pos: [0.68, 1.0, 0.5] }, { id: "flue", pos: [0, 1.45, -0.18] },
    { id: "blower", pos: [0.55, -0.52, 0.45] }, { id: "filter", pos: [0, -1.08, 0.4] }
  ];
}

function buildSplit(g, anim) {
  /* Outdoor condenser */
  const cond = new THREE.Group(); cond.position.set(-1.7, 0, 0); g.add(cond);
  const pad = box(2.0, 0.08, 2.0, std(0x8a8d90, { metalness: 0.08, roughness: 0.95 }));
  pad.position.y = -0.82; cond.add(pad);
  const cabinet = box(1.62, 1.42, 1.62, MAT.paint(0x8a9098));
  cabinet.material = MAT.paint(0x8a9098);
  cabinet.material.transparent = true;
  cabinet.material.opacity = 0.12;
  cond.add(cabinet);
  const finM = MAT.alum();
  [[-0.78, 0], [0.78, 0], [0, Math.PI / 2]].forEach(([x, rot], n) => {
    const bank = tag(finBank(0.07, 1.2, 1.48, 32, finM), "condenser");
    if (n < 2) bank.position.set(x, 0, 0);
    else { bank.position.set(0, 0, -0.78); bank.rotation.y = rot; }
    cond.add(bank);
  });
  const top = box(1.66, 0.06, 1.66, MAT.darkSteel());
  top.position.y = 0.74; cond.add(top);
  const guard = mesh(new THREE.TorusGeometry(0.62, 0.022, 8, 40), MAT.darkSteel());
  guard.rotation.x = Math.PI / 2; guard.position.y = 0.82; cond.add(guard);
  for (let i = 0; i < 8; i++) {
    const wire = cyl(0.008, 0.62, MAT.darkSteel(), 6);
    wire.rotation.z = Math.PI / 2;
    wire.position.y = 0.82;
    const h = new THREE.Group(); h.rotation.y = i * Math.PI / 8; h.add(wire); cond.add(h);
  }
  const fan = new THREE.Group(); fan.position.y = 0.8; cond.add(fan);
  fan.add(cyl(0.08, 0.06, MAT.darkSteel(), 16));
  for (let i = 0; i < 5; i++) {
    const blade = box(0.58, 0.016, 0.15, MAT.paint(0x2a3036));
    blade.position.x = 0.3; blade.rotation.x = 0.4;
    const h = new THREE.Group(); h.rotation.y = i * (Math.PI * 2 / 5); h.add(blade); fan.add(h);
  }
  anim.push(dt => { fan.rotation.y += dt * 7; });

  const comp = cyl(0.22, 0.62, MAT.paint(0x2a2e33), 28);
  comp.position.set(0.28, -0.28, 0.22);
  cond.add(tag(comp, "compressor"));
  const cap = cyl(0.065, 0.2, MAT.paint(0xb0bec5), 16);
  cap.position.set(0.52, -0.15, 0.52); cond.add(cap);
  const ctrl = tag(box(0.34, 0.4, 0.1, MAT.paint(0x4a5560)), "contactor");
  ctrl.position.set(0.52, 0.28, 0.8); cond.add(ctrl);
  const svL = cyl(0.05, 0.14, MAT.copper(), 16); svL.rotation.z = Math.PI / 2; svL.position.set(0.9, -0.36, 0.52); cond.add(svL);
  const svS = cyl(0.035, 0.11, MAT.copper(), 16); svS.rotation.z = Math.PI / 2; svS.position.set(0.88, -0.5, 0.52); cond.add(svS);

  /* Indoor air handler */
  const ah = new THREE.Group(); ah.position.set(1.85, 0.12, 0); g.add(ah);
  const cab = box(1.08, 1.98, 0.95, MAT.paint(0x8a9098));
  cab.material = MAT.paint(0x8a9098);
  cab.material.transparent = true; cab.material.opacity = 0.16;
  ah.add(cab);
  const coilG = tag(new THREE.Group(), "evaporator");
  coilG.position.set(0, 0.38, 0);
  for (const s of [-1, 1]) {
    const slab = finBank(0.08, 0.72, 0.72, 22, finM);
    slab.rotation.z = s * 0.52; slab.position.set(s * 0.18, 0, 0); coilG.add(slab);
  }
  ah.add(coilG);
  const tx = tag(cyl(0.07, 0.16, MAT.brass(), 20), "txv");
  tx.rotation.z = Math.PI / 2; tx.position.set(0, 0.74, 0.18); ah.add(tx);
  const blower = tag(new THREE.Group(), "blower");
  blower.position.set(0, -0.52, 0);
  const wheel = cyl(0.3, 0.4, MAT.paint(0x455a64), 24, false);
  wheel.rotation.z = Math.PI / 2; blower.add(wheel);
  for (let i = 0; i < 12; i++) {
    const vane = box(0.035, 0.2, 0.38, MAT.darkSteel());
    const h = new THREE.Group(); h.rotation.x = i * Math.PI / 6; vane.position.y = 0.16; h.add(vane); blower.add(h);
  }
  ah.add(blower);
  anim.push(dt => { blower.rotation.x += dt * 6; });
  const filt = tag(box(0.95, 0.06, 0.85, std(0xefebe0, { metalness: 0, roughness: 0.95 })), "filter");
  filt.position.y = -0.92; ah.add(filt);

  const liq = tag(pipe([[-0.8, -0.5, 0.52], [0.2, -0.5, 0.52], [0.9, 0.7, 0.18], [1.85, 0.86, 0.18]], 0.028, MAT.copper(), 48), "liquid");
  const suc = tag(pipe([[1.85, 0.06, -0.12], [0.9, 0.06, -0.12], [0.2, -0.2, 0.18], [-1.45, -0.2, 0.18]], 0.05, MAT.insul(), 48), "suction");
  g.add(liq, suc);

  return [
    { id: "condenser", pos: [-1.7, 0.95, 0] }, { id: "compressor", pos: [-1.42, -0.1, 0.4] },
    { id: "contactor", pos: [-1.18, 0.4, 0.9] }, { id: "evaporator", pos: [1.85, 0.55, 0] },
    { id: "txv", pos: [1.85, 0.95, 0.28] }, { id: "blower", pos: [1.85, -0.42, 0] },
    { id: "filter", pos: [1.85, -0.88, 0] }, { id: "liquid", pos: [0.2, 0.4, 0.4] }, { id: "suction", pos: [0.25, 0.06, -0.15] }
  ];
}

function buildCycle(g, anim) {
  const comp = tag(cyl(0.3, 0.68, MAT.paint(0x2a2e33), 36), "compressor");
  comp.position.set(0, 0.85, 0); g.add(comp);
  const cap = sphere(0.16, MAT.steel(), 20, 16); cap.scale.set(1, 0.55, 1); cap.position.set(0, 1.24, 0); g.add(cap);
  g.add(weld(0.3, 0.012, 1.16, MAT.steel()));

  const cond = tag(new THREE.Group(), "condenser");
  cond.position.set(1.55, 0.55, 0);
  cond.add(finBank(0.2, 1.15, 1.15, 28, MAT.alum()));
  hairpins(cond, 0.12, -0.45, 0.45, 0.5, 6, 0.025, MAT.copper());
  g.add(cond);

  const evap = tag(new THREE.Group(), "evaporator");
  evap.position.set(-1.55, -0.12, 0);
  for (const s of [-1, 1]) {
    const slab = finBank(0.08, 0.7, 0.7, 20, MAT.alum());
    slab.rotation.z = s * 0.5; slab.position.set(s * 0.16, 0, 0); evap.add(slab);
  }
  g.add(evap);

  const txv = tag(new THREE.Group(), "metering");
  txv.position.set(0, -0.85, 0);
  txv.add(cyl(0.11, 0.26, MAT.brass(), 24));
  const hd = cyl(0.15, 0.09, MAT.steel(), 24); hd.position.y = 0.16; txv.add(hd);
  g.add(txv);

  g.add(tag(pipe([[0.14, 1.15, 0], [0.5, 1.35, 0], [1.55, 1.2, 0], [1.55, 1.05, 0]], 0.048, phys(0xc25b3a, { metalness: 0.7, roughness: 0.35 }), 32), "dischargePort"));
  g.add(tag(pipe([[1.55, 0.0, 0], [1.55, -0.85, 0], [0.15, -0.85, 0]], 0.032, MAT.copper(), 32), "liquid"));
  g.add(pipe([[-0.15, -0.85, 0], [-1.55, -0.85, 0], [-1.55, -0.5, 0]], 0.032, MAT.copper(), 28));
  g.add(tag(pipe([[-1.55, 0.25, 0], [-1.55, 0.85, 0], [-0.5, 1.15, 0], [-0.12, 1.15, 0]], 0.055, MAT.insul(), 32), "suction"));

  const path = [
    new THREE.Vector3(0, 1.2, 0), new THREE.Vector3(1.55, 1.15, 0), new THREE.Vector3(1.55, -0.85, 0),
    new THREE.Vector3(0, -0.85, 0), new THREE.Vector3(-1.55, -0.85, 0), new THREE.Vector3(-1.55, 0.85, 0), new THREE.Vector3(0, 1.2, 0)
  ];
  const curve = new THREE.CatmullRomCurve3(path, true, "catmullrom", 0.15);
  const dots = [];
  for (let i = 0; i < 10; i++) {
    const d = mesh(new THREE.SphereGeometry(0.04, 10, 8), phys(0xff8a65, { roughness: 0.25, metalness: 0.1, emissive: 0x331100, emissiveIntensity: 0.2 }));
    d.castShadow = false;
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
    { id: "compressor", pos: [0, 1.38, 0] }, { id: "condenser", pos: [1.55, 1.2, 0] },
    { id: "metering", pos: [0, -1.08, 0] }, { id: "evaporator", pos: [-1.55, 0.38, 0] },
    { id: "liquid", pos: [1.1, -0.4, 0] }, { id: "suction", pos: [-0.8, 1.15, 0] }
  ];
}

const BUILDERS = { split: buildSplit, cycle: buildCycle, compressor: buildCompressor, txv: buildTXV, coils: buildCoils, furnace: buildFurnace };
const CAM = {
  split: [3.6, 2.1, 5.3], cycle: [0.5, 2.5, 5.1], compressor: [2.5, 1.4, 3.3],
  txv: [2.1, 1.2, 3.2], coils: [0.5, 1.9, 4.5], furnace: [2.8, 1.5, 3.9]
};

/* ---------- label layout with leader lines ---------- */
function layoutLabels(items, w, h) {
  const gap = 7, margin = 8;
  const placed = [];
  for (const side of ["left", "right"]) {
    const col = items.filter(i => i.side === side && i.visible).sort((a, b) => a.ay - b.ay);
    const ys = col.map(i => Math.min(h - i.bh - margin, Math.max(margin, i.ay - i.bh / 2)));
    for (let i = 1; i < col.length; i++) {
      const minY = ys[i - 1] + col[i - 1].bh + gap;
      if (ys[i] < minY) ys[i] = minY;
    }
    if (col.length) {
      const last = col.length - 1;
      if (ys[last] + col[last].bh + margin > h) {
        ys[last] = h - col[last].bh - margin;
        for (let i = last - 1; i >= 0; i--) {
          const maxY = ys[i + 1] - col[i].bh - gap;
          if (ys[i] > maxY) ys[i] = maxY;
        }
      }
    }
    col.forEach((i, k) => {
      const x = side === "left" ? margin : w - i.bw - margin;
      i.lx = x; i.ly = ys[k];
      i.ex = side === "left" ? x + i.bw : x;
      i.ey = ys[k] + i.bh / 2;
      placed.push(i);
    });
  }
  items.filter(i => !i.visible).forEach(i => { i.lx = 0; i.ly = 0; });
  return placed;
}

/* ---------- mount ---------- */
export function mount(el, which, labels, onPick) {
  const W = el.clientWidth, H = el.clientHeight || 320;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  el.appendChild(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment(renderer);
  const envTex = pmrem.fromScene(room, 0.04).texture;
  room.dispose();

  const scene = new THREE.Scene();
  scene.environment = envTex;
  const cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 80);
  const cp = CAM[which] || CAM.compressor;
  cam.position.set(...cp);
  if (W / H < 1.2) cam.position.multiplyScalar(1 + (1.2 - W / H) * 0.85);

  scene.add(new THREE.HemisphereLight(0xfff3e8, 0x1a1e24, 0.55));
  const key = new THREE.DirectionalLight(0xfff6ea, 2.2);
  key.position.set(3.8, 6.2, 4.6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 22;
  key.shadow.camera.left = key.shadow.camera.bottom = -6;
  key.shadow.camera.right = key.shadow.camera.top = 6;
  key.shadow.radius = 3.5;
  key.shadow.bias = -0.00025;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9bb8ff, 0.45);
  fill.position.set(-4.4, 2.6, -2.4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffa45c, 0.85);
  rim.position.set(-2.6, 3.2, 5.4);
  scene.add(rim);
  const kick = new THREE.PointLight(0xffc090, 0.55, 10, 2);
  kick.position.set(0.6, 1.7, 2.3);
  scene.add(kick);

  const floor = mesh(new THREE.CircleGeometry(7, 64), new THREE.MeshStandardMaterial({
    color: 0x16181b, roughness: 0.95, metalness: 0.08, envMapIntensity: 0.3
  }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.15;
  floor.castShadow = false;
  floor.receiveShadow = true;
  scene.add(floor);

  const root = new THREE.Group();
  scene.add(root);
  const anim = [];
  const builder = BUILDERS[which] || BUILDERS.split;
  const pts = builder(root, anim) || [];

  const ctl = new OrbitControls(cam, renderer.domElement);
  ctl.enableDamping = true; ctl.dampingFactor = 0.08; ctl.enablePan = false;
  ctl.minDistance = 1.8; ctl.maxDistance = 11; ctl.autoRotate = true; ctl.autoRotateSpeed = 0.7;
  ctl.target.set(0, 0.15, 0);
  ctl.addEventListener("start", () => { ctl.autoRotate = false; });
  let resume;
  ctl.addEventListener("end", () => { clearTimeout(resume); resume = setTimeout(() => { ctl.autoRotate = true; }, 1600); });

  const showLabels = !!(labels && Object.keys(labels).length && pts.length);
  const overlay = document.createElement("div");
  overlay.className = "m3d-labels";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "m3d-leaders");
  svg.setAttribute("aria-hidden", "true");
  if (showLabels) { el.appendChild(svg); el.appendChild(overlay); }

  const tags = showLabels ? pts.map((p, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "m3d-tag";
    b.textContent = labels[p.id] || p.id;
    b.onclick = () => onPick && onPick(p.id);
    overlay.appendChild(b);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "m3d-leader");
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", "3.5");
    dot.setAttribute("class", "m3d-anchor");
    svg.appendChild(path);
    svg.appendChild(dot);
    return { b, path, dot, v: new THREE.Vector3(...p.pos) };
  }) : [];

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("reduce-motion");
  if (reduced) ctl.autoRotate = false;
  let last = performance.now(), running = true, visible = true;
  const io = new IntersectionObserver(e => { visible = e[0].isIntersecting; }); io.observe(el);

  const _proj = new THREE.Vector3();
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced) anim.forEach(fn => fn(dt));
    ctl.update();
    renderer.render(scene, cam);
    if (!showLabels || el.classList.contains("labels-off")) return;
    const w = el.clientWidth, h = el.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    const items = tags.map(t => {
      _proj.copy(t.v).applyMatrix4(root.matrixWorld).project(cam);
      const ax = (_proj.x * 0.5 + 0.5) * w;
      const ay = (-_proj.y * 0.5 + 0.5) * h;
      const visibleP = _proj.z < 1 && _proj.z > -0.2 && ax > -40 && ax < w + 40;
      const bw = t.bw || (t.bw = t.b.offsetWidth || 80);
      const bh = t.bh || (t.bh = t.b.offsetHeight || 24);
      return { t, ax, ay, visible: visibleP, side: ax < w * 0.5 ? "left" : "right", bw, bh };
    });
    const placed = layoutLabels(items, w, h);
    items.forEach(i => {
      if (!i.visible) {
        i.t.b.style.opacity = "0";
        i.t.path.setAttribute("d", "");
        i.t.dot.setAttribute("cx", "-10");
        return;
      }
      i.t.b.style.transform = `translate(${i.lx}px, ${i.ly}px)`;
      i.t.b.style.opacity = "1";
      const elbow = i.side === "left" ? Math.min(i.ax - 10, i.ex + 18) : Math.max(i.ax + 10, i.ex - 18);
      i.t.path.setAttribute("d", `M ${i.ex} ${i.ey} H ${elbow} L ${i.ax} ${i.ay}`);
      i.t.dot.setAttribute("cx", i.ax);
      i.t.dot.setAttribute("cy", i.ay);
    });
    void placed;
  }
  requestAnimationFrame(frame);

  const ro = new ResizeObserver(() => {
    const w = el.clientWidth, h = el.clientHeight || 320;
    renderer.setSize(w, h);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  });
  ro.observe(el);

  const dispose = () => {
    running = false;
    clearTimeout(resume);
    io.disconnect();
    ro.disconnect();
    ctl.dispose();
    envTex.dispose();
    pmrem.dispose();
    renderer.dispose();
    el.innerHTML = "";
  };
  dispose.setLabelsVisible = v => { el.classList.toggle("labels-off", !v); };
  return dispose;
}
