// Geometry of the MinimaK SPM1, in centimetres, z up, vessel midplane at z = 0, torus axis at the origin.
// The front of the table is -y. Lateral ports sit at 0°, 90°, 180°, 270°; the four joints sit on the diagonals,
// where the corner posts clamp them (as in the photos on slides 9, 15 and 16 of the Oct 2025 webinar).
// Classic script: window.SPM1Device.build(THREE, paint) returns the assembled scene graph.
// `paint(geometry, tone, { part, clip })` and `paint.instanced(geometry, tone, matrices, opts)` come from the page,
// which owns the materials; this file only knows shapes, tones, part ids and how each piece comes apart.
(function (root) {
  const DEG = Math.PI / 180;

  // ConFlat sizes from the MBE-Komponenten CF table (parts.js, source S9): flange OD, bolt circle, bolt count,
  // thickness, bolt-hole radius, tube OD and wall, gasket ID and OD, knife-edge and gasket-recess diameters. Bolts are
  // M8 through the Ø8.4 mm holes and M6 through the Ø6.8 mm ones: head across flats af, head height k, nut height m,
  // shank radius br. `len` is the through bolt's stock length: grip (two flanges and the gasket) + nut + two threads,
  // rounded up to the next stock size (parts.js, derived).
  const M8 = { af: 1.3, k: 0.53, m: 0.65, br: 0.4 };
  const M6 = { af: 1.0, k: 0.4, m: 0.52, br: 0.3 };
  const CF = {
    160: { od: 20.32, bc: 18.10, n: 20, t: 2.10, hr: 0.42, tube: 15.4, wall: 0.2, gasket: [7.625, 8.565], edge: 16.61, recess: 17.14, len: 5.5, ...M8 },
    100: { od: 15.24, bc: 13.03, n: 16, t: 1.95, hr: 0.42, tube: 10.4, wall: 0.2, gasket: [5.085, 6.025], edge: 11.53, recess: 12.06, len: 5.0, ...M8 },
    63: { od: 11.43, bc: 9.22, n: 8, t: 1.70, hr: 0.42, tube: 6.35, wall: 0.18, gasket: [3.6, 4.12], edge: 7.72, recess: 8.25, len: 4.5, ...M8 },
    40: { od: 6.99, bc: 5.87, n: 6, t: 1.25, hr: 0.34, tube: 3.8, wall: 0.15, gasket: [1.96, 2.41], edge: 4.19, recess: 4.83, len: 3.5, ...M6 },
  };
  // ISO-KF joints as drawn (sizes not published for the SPM1; parts.js tags them assumed): tube bore and outside
  // radius, flange radius, flange length and rim thickness, the gap the centring ring holds, the clamp's outer radius.
  const KF = {
    16: { ti: 0.75, to: 0.95, f: 1.5, t: 0.45, rim: 0.12, g: 0.3, c: 1.85 },
    40: { ti: 1.85, to: 2.05, f: 2.75, t: 0.6, rim: 0.18, g: 0.4, c: 3.2 },
  };

  const D = {
    R0: 23,
    aOut: 7.7,
    aIn: 7.5,
    gap: 0.2,
    table: { top: -22, thick: 11, half: 45, floor: -107, leg: 9, legAt: 36, shelf: -91 },
    lat: { flangeAt: 35.5 },
    small: { flangeAt: 11.5 },
    gport: { flangeAt: 11 },
    tf: { halfW: 3.6, rIn: 7.8, rOut: 10.2, tabR: 10.9, tabs: 26 },
    former: { r: 10.4, t: 0.4, top: 9.5 },
    pfIn: { z: 6.2, h: 2.6, rOut: 11.4 },
    sol: { h: 6, rOut: 11.0 },
    pfOut: { R: 31.5, z: 12.8 },
    satTop: { R: 35, z: 16.5, r: 1.6 },
    satBot: { R: 33.5, z: -18.6, r: 1.6 },
    post: { R: 40.2, half: 2.25, top: 19 },
    cut: [287, 352],
    CF,
    KF,
  };

  // How far each part travels when it is inspected on its own: up (`lift`), away from the torus axis (`spread`).
  // Instances can override this with an explicit vector (joint flanges part along the ring, the drawer slides out).
  const DETACH = {
    vessel: { spread: 7 }, joints: { spread: 2 }, gaskets: { lift: 0 }, lateral: { spread: 7 }, viewport: { spread: 10 },
    diagPorts: { lift: 0 }, tf: { lift: 16 }, pfInner: { lift: 0 }, pfOuter: { lift: 0 }, satellite: { lift: 0 },
    solenoid: { lift: 0 }, former: { lift: 0 }, electrode: { lift: 0 }, hv: { lift: 6 }, pumpPort: { spread: 8 },
    hose: { spread: 6 }, pump: { spread: 12 }, stack: { lift: 10 }, gauge: { lift: 10 }, needle: { lift: 8 }, laser: { lift: 10 },
    probe: { lift: 12 }, camera: { lift: 8 }, spectro: { lift: 8 }, table: {}, posts: { spread: 6 }, psu: {},
    drawer: {}, estop: { lift: 8 },
  };

  function build(THREE, paint) {
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const Z = V(0, 0, 1);
    const radial = (deg) => V(Math.cos(deg * DEG), Math.sin(deg * DEG), 0);
    const toroidal = (deg) => V(-Math.sin(deg * DEG), Math.cos(deg * DEG), 0);
    const pol = (R, deg, z = 0) => V(R * Math.cos(deg * DEG), R * Math.sin(deg * DEG), z);

    function geo(pos, nor, idx) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setIndex(idx);
      return g;
    }

    function merge(list) {
      let nv = 0, ni = 0;
      for (const g of list) {
        nv += g.attributes.position.count;
        ni += g.index ? g.index.count : g.attributes.position.count;
      }
      const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = new Uint32Array(ni);
      let vo = 0, io = 0;
      for (const g of list) {
        const n = g.attributes.position.count;
        for (let k = 0; k < n; k++) {
          pos[(vo + k) * 3] = g.attributes.position.getX(k);
          pos[(vo + k) * 3 + 1] = g.attributes.position.getY(k);
          pos[(vo + k) * 3 + 2] = g.attributes.position.getZ(k);
          nor[(vo + k) * 3] = g.attributes.normal.getX(k);
          nor[(vo + k) * 3 + 1] = g.attributes.normal.getY(k);
          nor[(vo + k) * 3 + 2] = g.attributes.normal.getZ(k);
        }
        if (g.index) { for (let k = 0; k < g.index.count; k++) idx[io + k] = g.index.getX(k) + vo; io += g.index.count; }
        else { for (let k = 0; k < n; k++) idx[io + k] = vo + k; io += n; }
        vo += n;
        g.dispose();
      }
      const out = new THREE.BufferGeometry();
      out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      out.setIndex(new THREE.BufferAttribute(idx, 1));
      out.computeBoundingSphere();
      out.computeBoundingBox();
      return out;
    }

    // Matrix that maps local Y onto `axis` and places the origin; `ref` steers local X.
    function frame(origin, axis, ref) {
      const y = axis.clone().normalize();
      const x = (ref ? ref.clone() : Math.abs(y.z) < 0.9 ? Z.clone() : V(1, 0, 0));
      x.sub(y.clone().multiplyScalar(x.dot(y))).normalize();
      const z = new THREE.Vector3().crossVectors(x, y);
      return new THREE.Matrix4().makeBasis(x, y, z).setPosition(origin);
    }

    // Basis with local x = radial, y = toroidal, z = up at toroidal angle `deg`.
    function rtz(origin, deg) {
      return new THREE.Matrix4().makeBasis(radial(deg), toroidal(deg), Z.clone()).setPosition(origin);
    }
    const T = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);

    const at = (g, m) => g.applyMatrix4(m);

    // Thick toroidal shell between minor radii rIn and rOut, closed with caps where the angles do not wrap.
    function torusShell(R, rIn, rOut, p0, p1, o = {}) {
      const t0 = o.t0 ?? 0, t1 = o.t1 ?? Math.PI * 2;
      const fullP = Math.abs(p1 - p0 - Math.PI * 2) < 1e-6;
      const fullT = Math.abs(t1 - t0 - Math.PI * 2) < 1e-6;
      const nP = o.nP ?? Math.max(2, Math.ceil((Math.abs(p1 - p0) / (Math.PI * 2)) * 160));
      const nT = o.nT ?? Math.max(2, Math.ceil(((t1 - t0) / (Math.PI * 2)) * 48));
      const nR = 1;
      const pos = [], nor = [], idx = [];
      const P = (r, p, t) => [(R + r * Math.cos(t)) * Math.cos(p), (R + r * Math.cos(t)) * Math.sin(p), r * Math.sin(t)];
      const M = (p, t) => [Math.cos(t) * Math.cos(p), Math.cos(t) * Math.sin(p), Math.sin(t)];
      function grid(nu, nv, point, normal, flip) {
        const base = pos.length / 3;
        for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) { pos.push(...point(i / nu, j / nv)); nor.push(...normal(i / nu, j / nv)); }
        for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
          const a = base + i * (nv + 1) + j, b = base + (i + 1) * (nv + 1) + j, c = b + 1, d = a + 1;
          if (flip) idx.push(a, c, b, a, d, c); else idx.push(a, b, c, a, c, d);
        }
      }
      const pA = (u) => p0 + (p1 - p0) * u, tA = (v) => t0 + (t1 - t0) * v, rA = (w) => rIn + (rOut - rIn) * w;
      grid(nP, nT, (u, v) => P(rOut, pA(u), tA(v)), (u, v) => M(pA(u), tA(v)), false);
      if (rIn > 0) grid(nP, nT, (u, v) => P(rIn, pA(u), tA(v)), (u, v) => M(pA(u), tA(v)).map((x) => -x), true);
      if (!fullP) {
        const capN = (p, s) => [s * Math.sin(p), -s * Math.cos(p), 0];
        grid(nR, nT, (w, v) => P(rA(w), p0, tA(v)), () => capN(p0, 1), false);
        grid(nR, nT, (w, v) => P(rA(w), p1, tA(v)), () => capN(p1, -1), true);
      }
      if (!fullT) {
        const tN = (p, t, s) => { const x = -Math.sin(t) * Math.cos(p), y = -Math.sin(t) * Math.sin(p), z = Math.cos(t); return [s * x, s * y, s * z]; };
        grid(nP, nR, (u, w) => P(rA(w), pA(u), t0), (u) => tN(pA(u), t0, -1), false);
        grid(nP, nR, (u, w) => P(rA(w), pA(u), t1), (u) => tN(pA(u), t1, 1), true);
      }
      return geo(pos, nor, idx);
    }

    // Surface of revolution around local Y from a counter-clockwise (r, y) outline; crisp corners.
    function revolve(profile, seg = 48) {
      const pos = [], nor = [], idx = [];
      for (let k = 0; k < profile.length - 1; k++) {
        const [r0, y0] = profile[k], [r1, y1] = profile[k + 1];
        let nr = y1 - y0, ny = -(r1 - r0);
        const l = Math.hypot(nr, ny) || 1; nr /= l; ny /= l;
        const base = pos.length / 3;
        for (let j = 0; j <= seg; j++) {
          const a = (j / seg) * Math.PI * 2, s = Math.sin(a), c = Math.cos(a);
          pos.push(r0 * s, y0, r0 * c, r1 * s, y1, r1 * c);
          nor.push(nr * s, ny, nr * c, nr * s, ny, nr * c);
        }
        for (let j = 0; j < seg; j++) {
          const a = base + j * 2, b = base + (j + 1) * 2, c = b + 1, d = a + 1;
          idx.push(a, b, c, a, c, d);
        }
      }
      return geo(pos, nor, idx);
    }

    // Port neck along `ax` whose inner end follows the vessel wall (a saddle), so nothing pokes into the vessel.
    // `startAt(o)` gives the distance along `ax` where the neck point with offset `o` meets the mid-wall.
    function saddleNeck(base, ax, rIn, rOut, sEnd, startAt, seg = 48) {
      const u = Math.abs(ax.z) < 0.9 ? Z.clone() : radial(0);
      u.sub(ax.clone().multiplyScalar(u.dot(ax))).normalize();
      const v = new THREE.Vector3().crossVectors(ax, u);
      const pos = [], nor = [], idx = [];
      const band = (r, sFn, nSign) => {
        const b = pos.length / 3;
        for (let j = 0; j <= seg; j++) {
          const a = (j / seg) * Math.PI * 2;
          const dir = u.clone().multiplyScalar(Math.cos(a)).add(v.clone().multiplyScalar(Math.sin(a)));
          const o = dir.clone().multiplyScalar(r);
          const p = base.clone().add(o).add(ax.clone().multiplyScalar(sFn(o)));
          pos.push(p.x, p.y, p.z);
          nor.push(dir.x * nSign, dir.y * nSign, dir.z * nSign);
        }
        return b;
      };
      const quad = (a0, a1, flip) => {
        for (let j = 0; j < seg; j++) {
          const a = a0 + j, b = a0 + j + 1, c = a1 + j + 1, d = a1 + j;
          if (flip) idx.push(a, c, b, a, d, c); else idx.push(a, b, c, a, c, d);
        }
      };
      const capRing = (r, sFn, n) => {
        const b = pos.length / 3;
        for (let j = 0; j <= seg; j++) {
          const a = (j / seg) * Math.PI * 2;
          const o = u.clone().multiplyScalar(Math.cos(a) * r).add(v.clone().multiplyScalar(Math.sin(a) * r));
          const p = base.clone().add(o).add(ax.clone().multiplyScalar(sFn(o)));
          pos.push(p.x, p.y, p.z);
          nor.push(n.x, n.y, n.z);
        }
        return b;
      };
      const end = () => sEnd;
      const o0 = band(rOut, startAt, 1), o1 = band(rOut, end, 1);
      quad(o0, o1, false);
      const i0 = band(rIn, startAt, -1), i1 = band(rIn, end, -1);
      quad(i0, i1, true);
      const back = ax.clone().negate();
      const s0 = capRing(rIn, startAt, back), s1 = capRing(rOut, startAt, back);
      quad(s0, s1, false);
      const e0 = capRing(rIn, end, ax), e1 = capRing(rOut, end, ax);
      quad(e0, e1, true);
      return geo(pos, nor, idx);
    }
    const aMid = (D.aIn + D.aOut) / 2;
    const lateralStart = (deg) => (o) => {
      const z = o.z, t = o.dot(toroidal(deg));
      const rho = D.R0 + Math.sqrt(Math.max(0, aMid * aMid - z * z));
      return Math.sqrt(Math.max(0, rho * rho - t * t)) - D.R0;
    };
    const verticalStart = (deg) => (o) => {
      const dR = o.dot(radial(deg)), dT = o.dot(toroidal(deg));
      const rho = Math.hypot(D.R0 + dR, dT);
      return Math.sqrt(Math.max(0, aMid * aMid - (rho - D.R0) ** 2));
    };

    const rect = (rIn, rOut, h) => [[rIn, -h / 2], [rOut, -h / 2], [rOut, h / 2], [rIn, h / 2], [rIn, -h / 2]];
    const ring = (rIn, rOut, h, seg) => revolve(rect(rIn, rOut, h), seg);
    function flangeRing(rIn, rOut, h, seg = 64) {
      const b = Math.min(0.3, h / 4);
      return revolve([[rIn, -h / 2], [rOut - b, -h / 2], [rOut, -h / 2 + b], [rOut, h / 2 - b], [rOut - b, h / 2], [rIn, h / 2], [rIn, -h / 2]], seg);
    }
    // A sealing face: the gasket recess, DR deep, and inside it the knife edge, HK high on a WK base, so its tip stands
    // just proud of the face and bites the gasket in the gap (the depths are the drawing's; the diameters are S9's).
    const DR = 0.06, HK = 0.09, WK = 0.12;
    // The outline for revolve() of the part of a flange inside radius rCut: along the face (+1, the side along the
    // axis) from rCut in to the bore at rIn, down the bore, and out along the back (-1) to rCut, each side flat or a
    // sealing face for `cf`. It is left open at rCut, where it meets the drilled outer ring, so no face lies inside
    // the metal for a section to show.
    function sealProfile(rIn, rCut, t, seals) {
      const face = (s) => {
        const y0 = t / 2;
        if (!s) return [[rCut, y0], [rIn, y0]];
        const rR = s.cf.recess / 2, rE = s.cf.edge / 2, yF = y0 - DR;
        const pts = rR < rCut - 1e-6 ? [[rCut, y0], [rR, y0], [rR, yF]] : [[rCut, yF]];
        pts.push([rE + WK / 2, yF], [rE, yF + HK], [rE - WK / 2, yF], [rIn, yF]);
        return pts;
      };
      const top = face(seals.find((s) => s.side > 0));
      const bottom = face(seals.find((s) => s.side < 0)).map(([r, y]) => [r, -y]).reverse();
      return [...top, ...bottom];
    }
    // A ConFlat flange drilled for its bolts: an annulus rIn..rOut (rIn 0 for a blank), thickness t, centred on
    // `centre` with its axis along `axis`. Each hole set puts n clearance holes of radius r on a bolt circle of
    // radius rad, at exactly the angles circleMatrices(.., u, v, rad, n, phase) gives the bolts that pass through.
    // `seals` lists the faces that seal on a gasket ({ side: ±1, cf }): inside the widest recess the flange is a
    // revolved profile with the recess and knife edge. A hole set inside that recess (the reducer's tapped DN40
    // holes) is not drilled through; the caller marks it on its face.
    function cfRing(centre, axis, rIn, rOut, t, sets, seg = 72, seals = []) {
      const M = frame(centre, axis);
      const inv = M.clone().invert();
      const rCut = seals.length ? Math.max(...seals.map((s) => s.cf.recess / 2)) : rIn;
      // The outline runs one way round and every hole the other, so the extruded walls face out of the metal.
      const poly = (path, cx, cz, r, n, hole) => {
        for (let k = 0; k <= n; k++) {
          const a = (hole ? -k / n : k / n) * Math.PI * 2, x = cx + r * Math.cos(a), y = -(cz + r * Math.sin(a));
          if (k === 0) path.moveTo(x, y); else path.lineTo(x, y);
        }
        return path;
      };
      const shape = poly(new THREE.Shape(), 0, 0, rOut, seg);
      if (rCut > 0) shape.holes.push(poly(new THREE.Path(), 0, 0, rCut, seg, true));
      const holes = [];
      for (const h of sets) {
        if (h.rad < rCut) continue;
        for (let i = 0; i < h.n; i++) {
          const b = ((i + (h.phase ?? 0.5)) / h.n) * Math.PI * 2;
          const w = centre.clone().add(h.u.clone().multiplyScalar(h.rad * Math.cos(b))).add(h.v.clone().multiplyScalar(h.rad * Math.sin(b))).applyMatrix4(inv);
          holes.push([w.x, w.z, h.r]);
          shape.holes.push(poly(new THREE.Path(), w.x, w.z, h.r, 14, true));
        }
      }
      const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, steps: 1, curveSegments: 1 });
      g.deleteAttribute('uv');
      g.translate(0, 0, -t / 2);
      g.rotateX(-Math.PI / 2);
      // Shade the rim, the bore and every hole wall as true cylinders, not facets.
      const p = g.attributes.position, nrm = g.attributes.normal;
      for (let k = 0; k < p.count; k++) {
        if (Math.abs(nrm.getY(k)) > 0.5) continue;
        const x = p.getX(k), z = p.getZ(k), rho = Math.hypot(x, z);
        if (Math.abs(rho - rOut) < 0.02) nrm.setXYZ(k, x / rho, 0, z / rho);
        else if (rCut > 0 && Math.abs(rho - rCut) < 0.02) nrm.setXYZ(k, -x / rho, 0, -z / rho);
        else {
          let best = null, bd = Infinity;
          for (const hl of holes) { const d = Math.hypot(x - hl[0], z - hl[1]) - hl[2]; if (Math.abs(d) < bd) { bd = Math.abs(d); best = hl; } }
          if (best) { const dx = x - best[0], dz = z - best[1], l = Math.hypot(dx, dz) || 1; nrm.setXYZ(k, -dx / l, 0, -dz / l); }
        }
      }
      if (!seals.length) {
        g.applyMatrix4(M);
        g.computeBoundingSphere();
        g.computeBoundingBox();
        return g;
      }
      // The outer ring's own wall at rCut would lie inside the metal, against the revolved part: drop it, and put back
      // only the recess wall of the widest seal, from its floor up to the face.
      const src = g.index ? g.toNonIndexed() : g;
      const sp = src.attributes.position, sn = src.attributes.normal, pos = [], nor = [];
      for (let i = 0; i < sp.count; i += 3) {
        let wall = true;
        for (let j = 0; j < 3 && wall; j++) wall = Math.abs(Math.hypot(sp.getX(i + j), sp.getZ(i + j)) - rCut) < 0.01 && Math.abs(sn.getY(i + j)) < 0.5;
        if (wall) continue;
        for (let j = 0; j < 3; j++) { pos.push(sp.getX(i + j), sp.getY(i + j), sp.getZ(i + j)); nor.push(sn.getX(i + j), sn.getY(i + j), sn.getZ(i + j)); }
      }
      const ringPart = new THREE.BufferGeometry();
      ringPart.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      ringPart.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      const parts = [ringPart.applyMatrix4(M), revolve(sealProfile(rIn, rCut, t, seals), seg).applyMatrix4(M)];
      for (const s of seals) {
        if (Math.abs(s.cf.recess / 2 - rCut) > 1e-6) continue;
        const y0 = (s.side * t) / 2, yF = s.side * (t / 2 - DR);
        parts.push(revolve(s.side > 0 ? [[rCut, y0], [rCut, yF]] : [[rCut, yF], [rCut, y0]], seg).applyMatrix4(M));
      }
      return merge(parts);
    }
    const drilled = (u, v, cf) => ({ u, v, rad: cf.bc / 2, n: cf.n, r: cf.hr });
    const disc = (r, h, seg = 32) => revolve([[0, -h / 2], [r, -h / 2], [r, h / 2], [0, h / 2]], seg);
    const rod = (r, len, seg = 10) => { const g = new THREE.CylinderGeometry(r, r, len, seg); g.deleteAttribute('uv'); return g; };
    function hex(af, h) {
      const r = af / Math.sqrt(3);
      const g = new THREE.CylinderGeometry(r, r, h, 6).toNonIndexed();
      g.deleteAttribute('uv');
      g.computeVertexNormals();
      return g;
    }
    const box = (w, h, d) => { const g = new THREE.BoxGeometry(w, h, d); g.deleteAttribute('uv'); return g; };

    function tube(points, r, o = {}) {
      const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
      const seg = o.seg ?? 64, radialSeg = o.radial ?? 10;
      const g = new THREE.TubeGeometry(curve, seg, r, radialSeg, false);
      g.deleteAttribute('uv');
      if (o.corrugate) {
        const p = g.attributes.position, n = g.attributes.normal;
        const len = curve.getLength();
        for (let k = 0; k < p.count; k++) {
          const i = Math.floor(k / (radialSeg + 1));
          const s = (i / seg) * len;
          const d = o.corrugate * Math.cos((s / o.pitch) * Math.PI * 2);
          p.setXYZ(k, p.getX(k) + n.getX(k) * d, p.getY(k) + n.getY(k) * d, p.getZ(k) + n.getZ(k) * d);
        }
        g.computeVertexNormals();
      }
      const parts = [g];
      for (const [t, s] of [[0, -1], [1, 1]]) {
        const c = new THREE.CircleGeometry(r, radialSeg);
        c.deleteAttribute('uv');
        const dir = curve.getTangentAt(t).multiplyScalar(s);
        const m = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(Z, dir));
        m.setPosition(curve.getPointAt(t));
        parts.push(at(c, m));
      }
      return merge(parts);
    }

    const rootGroup = new THREE.Group();
    const groups = [];
    const stretch = [];
    const instances = [];
    const along = (v, d) => v.clone().multiplyScalar(d);

    // An explode group: everything in it moves together by `offset` (at spread 1) when the machine is taken apart.
    function group(name, offset, delay, parent = rootGroup) {
      const g = new THREE.Group();
      g.name = name;
      parent.add(g);
      groups.push({ obj: g, offset, delay });
      return g;
    }

    // One physical piece of a part (one of the 8 TF coils, one viewport...).
    // `apart`: how far it moves from its group in the exploded assembly (spread 1).
    // `detach`: how it lifts out when inspected on its own (default from DETACH).
    // `sub`: the name of the sub-part its meshes belong to unless a mesh names another.
    // `axis`: the axis it is turned about or sealed along, if it has one; a section of the piece contains it.
    function piece(part, parent, o = {}) {
      const g = new THREE.Group();
      g.userData.part = part;
      g.userData.label = o.label || null;
      g.userData.detach = o.detach || null;
      g.userData.apart = o.apart || V(0, 0, 0);
      g.userData.sub = o.sub || null;
      g.userData.clip = !!o.clip;
      g.userData.axis = o.axis ? o.axis.clone().normalize() : null;
      parent.add(g);
      instances.push(g);
      return g;
    }

    // `sub` names the sub-part a mesh belongs to; `ex` is where it goes when its part is taken apart (spread 1).
    function tag(pc, m, o) {
      m.userData.sub = o.sub || pc.userData.sub || null;
      m.userData.ex = o.ex ? o.ex.clone() : V(0, 0, 0);
      pc.add(m);
      return m;
    }
    function add(pc, geometry, tone, o = {}) {
      return tag(pc, paint(geometry, tone, { part: pc.userData.part, clip: o.clip ?? pc.userData.clip }), o);
    }
    function addInst(pc, geometry, tone, matrices, o = {}) {
      return tag(pc, paint.instanced(geometry, tone, matrices, { part: pc.userData.part, clip: o.clip ?? pc.userData.clip }), o);
    }

    // Bolt with its head at local y = 0..h and the shank running down -y for `len`.
    function boltGeom(len, af = M8.af, r = M8.br, k = M8.k) {
      return merge([at(hex(af, k), T(0, k / 2, 0)), at(rod(r, len), T(0, -len / 2, 0))]);
    }
    // A hex nut (or any hex fitting) with a bore of radius r; local Y is its axis, centred like hex().
    function hexNut(af, h, r) {
      const R = af / Math.sqrt(3);
      const shape = new THREE.Shape();
      // The hexagon runs one way round and the bore the other, so the extruded walls face out of the metal.
      for (let k = 0; k <= 6; k++) {
        const a = (k / 6) * Math.PI * 2, x = R * Math.cos(a), y = -R * Math.sin(a);
        if (k === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
      }
      const bore = new THREE.Path();
      for (let k = 0; k <= 16; k++) {
        const a = (-k / 16) * Math.PI * 2, x = r * Math.cos(a), y = -r * Math.sin(a);
        if (k === 0) bore.moveTo(x, y); else bore.lineTo(x, y);
      }
      shape.holes.push(bore);
      const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, steps: 1, curveSegments: 1 });
      g.deleteAttribute('uv');
      g.translate(0, 0, -h / 2);
      g.rotateX(-Math.PI / 2);
      // The bore shades as a cylinder; the six flats keep their own facing.
      const p = g.attributes.position, nrm = g.attributes.normal;
      for (let k = 0; k < p.count; k++) {
        if (Math.abs(nrm.getY(k)) > 0.5) continue;
        const x = p.getX(k), z = p.getZ(k), rho = Math.hypot(x, z);
        if (rho < r + 0.01) nrm.setXYZ(k, -x / rho, 0, -z / rho);
      }
      g.computeBoundingSphere();
      g.computeBoundingBox();
      return g;
    }
    // Nuts are bored to the bolt's shank, so a bolt taken out leaves a nut you can see through.
    const nutGeom = (af = M8.af, r = M8.br + 0.02, m = M8.m) => at(hexNut(af, m, r), T(0, m / 2, 0));

    // Bolt-circle matrices on a flange face: `centre` on the face, `axis` out of the face, `u` and `v` span it.
    function circleMatrices(centre, axis, u, v, rad, n, phase = 0.5) {
      const out = [];
      for (let i = 0; i < n; i++) {
        const b = ((i + phase) / n) * Math.PI * 2;
        const p = centre.clone().add(u.clone().multiplyScalar(rad * Math.cos(b))).add(v.clone().multiplyScalar(rad * Math.sin(b)));
        out.push(frame(p, axis, u));
      }
      return out;
    }

    // A CF flange pair's bolts, at their stock length: heads on the outer face, nuts on the back face of the other
    // flange. Taken apart, the bolts pull out along the axis and the nuts drop off the back (or go where o.boltsEx and
    // o.nutsEx say). `o.name` tells several sets on one piece apart ("6 bolts on the blank").
    function cfBolts(pc, cf, face, back, axis, u, v, o = {}) {
      const name = o.name ? ` ${o.name}` : '';
      addInst(pc, boltGeom(cf.len, cf.af, cf.br, cf.k), 'bolt', circleMatrices(face, axis, u, v, cf.bc / 2, cf.n, o.phase ?? 0.5),
        { sub: `${cf.n} bolts${name}`, ex: o.boltsEx || along(axis, o.bolts ?? 10) });
      addInst(pc, nutGeom(cf.af, cf.br + 0.02, cf.m), 'bolt', circleMatrices(back, axis.clone().negate(), u, v, cf.bc / 2, cf.n, o.phase ?? 0.5),
        { sub: `${cf.n} nuts${name}`, ex: o.nutsEx || along(axis, -(o.nuts ?? 4)) });
    }
    // A copper CF gasket centred in the gap at `centre`, across `axis`.
    const cfGasket = (cf, centre, axis, seg = 40) => at(ring(cf.gasket[0], cf.gasket[1], D.gap * 0.9, seg), frame(centre, axis));

    // ---------- ISO-KF joints ----------
    // A KF flange below its joint plane (local y up, the plane at y = 0): the bore, a tapered back the clamp pulls on,
    // and the flat face that holds the centring ring.
    const kfFlange = (kf, seg) => revolve([[kf.ti, -kf.g / 2 - kf.t], [kf.to, -kf.g / 2 - kf.t], [kf.f, -kf.g / 2 - kf.rim], [kf.f, -kf.g / 2], [kf.ti, -kf.g / 2], [kf.ti, -kf.g / 2 - kf.t]], seg);
    // A joint at `origin` along `axis`, the fixed side behind it: `stub` gets the fixed side's flange, `mate` the
    // other side's, `ring` the centring ring and its O-ring, `clamp` the hinged clamp and its wing screw, each as
    // { pc, sub, ex }. `side` points to where the wing screw sits. Returns the mating flange's mesh.
    function kfJoint(kf, origin, axis, side, stub, mate, ring_, clamp, seg = 32) {
      const opt = (x) => ({ sub: x.sub, ex: x.ex || V(0, 0, 0) });
      add(stub.pc, at(kfFlange(kf, seg), frame(origin, axis)), 'steel2', opt(stub));
      const m = add(mate.pc, at(kfFlange(kf, seg), frame(origin, axis.clone().negate())), 'steel2', opt(mate));
      add(ring_.pc, at(ring(kf.ti, kf.ti + 0.22, kf.g, seg), frame(origin, axis)), 'steel2', opt(ring_));
      const tor = new THREE.TorusGeometry(kf.ti + 0.22 + kf.g * 0.58, kf.g * 0.58, 10, seg);
      tor.deleteAttribute('uv');
      tor.rotateX(-Math.PI / 2);
      add(ring_.pc, at(tor, frame(origin, axis)), 'black', opt(ring_));
      const hw = kf.g / 2 + kf.t, jaw = kf.to + 0.1, flat = kf.f + 0.05, lip = kf.g / 2 + kf.rim;
      add(clamp.pc, at(revolve([[jaw, -hw], [kf.c, -hw], [kf.c, hw], [jaw, hw], [flat, lip], [flat, -lip], [jaw, -hw]], seg), frame(origin, axis)), 'alu', opt(clamp));
      const across = new THREE.Vector3().crossVectors(axis, side).normalize();
      const screwAt = origin.clone().add(side.clone().multiplyScalar(kf.c + 0.2));
      add(clamp.pc, at(rod(kf.c * 0.09, kf.c * 1.1), frame(screwAt, across)), 'bolt', opt(clamp));
      add(clamp.pc, at(box(kf.c * 0.28, kf.c * 0.16, kf.c * 0.8), frame(screwAt.clone().add(across.clone().multiplyScalar(kf.c * 0.5)), across, side)), 'alu', opt(clamp));
      return m;
    }

    // A thin weld bead where a tube meets a flange.
    const bead = (r, at0, axis) => at(revolve([[r, -0.14], [r + 0.16, -0.05], [r + 0.16, 0.05], [r, 0.14]], 48), frame(at0, axis));

    const J = CF[160], L = CF[100], S = CF[40], G = CF[63];
    const TB = D.table;
    const quarters = [];
    // Quarter k is centred on 90k°; joint k sits at 45 + 90k°, between quarter k and the next one round.
    const QUARTER = ['Right', 'Back', 'Left', 'Front'];
    const JOINT = ['Right–back', 'Back–left', 'Left–front', 'Front–right'];

    // ---------- Vessel quarters: elbow, joint flanges, lateral port, TF coils ----------
    for (let k = 0; k < 4; k++) {
      const pk = 90 * k;
      const q = group(`quarter${k}`, radial(pk).multiplyScalar(16), 0.3 + k * 0.05);
      quarters.push(q);
      const p0 = pk - 45, p1 = pk + 45;
      const inset = (D.gap / 2 + J.t * 0.5) / D.R0;

      const shell = piece('vessel', q, { clip: true, sub: 'Elbow, 150 mm stainless tube', label: `${QUARTER[k]} quarter` });
      add(shell, torusShell(D.R0, D.aIn, D.aOut, p0 * DEG + inset, p1 * DEG - inset), 'vessel');

      // Joint flanges: B at the start of the quarter (nuts), A at the end (bolt heads). Each is named by its joint and
      // the quarter it is welded to, so the eight read apart.
      for (const [pj, side, jt] of [[p0, 1, (k + 3) % 4], [p1, -1, k]]) {
        const tdir = toroidal(pj).multiplyScalar(side);
        const fl = piece('joints', q, { clip: true, sub: 'DN160CF flange', label: `${JOINT[jt]} joint, ${QUARTER[k].toLowerCase()} side`, detach: tdir.clone().multiplyScalar(3.2).add(radial(pj).multiplyScalar(2)), axis: tdir });
        const centre = pol(D.R0, pj).add(tdir.clone().multiplyScalar(D.gap / 2 + J.t / 2));
        add(fl, cfRing(centre, tdir, D.aIn, J.od / 2, J.t, [drilled(radial(pj), Z, J)], 80, [{ side: -1, cf: J }]), 'steel2');
        // A weld does not come apart: Take apart leaves it on its flange.
        add(fl, bead(D.aOut, pol(D.R0, pj).add(tdir.clone().multiplyScalar(D.gap / 2 + J.t + 0.14)), tdir), 'steel2', { sub: 'TIG weld to the elbow' });
        const face = pol(D.R0, pj).add(tdir.clone().multiplyScalar(D.gap / 2 + J.t));
        const mats = circleMatrices(face, tdir, radial(pj), Z, J.bc / 2, J.n);
        if (side < 0) addInst(fl, boltGeom(J.len, J.af, J.br, J.k), 'bolt', mats, { sub: '20 bolts', ex: along(tdir, 9) });
        else addInst(fl, nutGeom(J.af, J.br + 0.02, J.m), 'bolt', mats, { sub: '20 nuts', ex: along(tdir, 7) });
      }

      // Lateral DN100CF port: a tube welded into the elbow, with a flange welded on its end.
      const rdir = radial(pk);
      // Tube, weld and flange are one welded piece, so nothing on it comes off.
      const lat = piece('lateral', q, { clip: true, sub: 'Port tube, 104 mm', label: `${k ? QUARTER[k] : 'Right (pump)'} port`, axis: rdir });
      const nR = L.tube / 2;
      add(lat, saddleNeck(pol(D.R0, pk), rdir, nR - L.wall, nR, D.lat.flangeAt - D.R0, lateralStart(pk)), 'steel');
      add(lat, cfRing(pol(D.lat.flangeAt + L.t / 2, pk), rdir, nR - L.wall, L.od / 2, L.t, [drilled(Z, toroidal(pk), L)], 72, [{ side: 1, cf: L }]), 'steel2', { sub: 'DN100CF flange' });
      add(lat, bead(nR, pol(D.lat.flangeAt - 0.14, pk), rdir.clone().negate()), 'steel2', { sub: 'TIG weld' });

      // Two TF coils per quarter, either side of the lateral port. Taken apart along the coil axis:
      // the copper former one way, the cover band the other, the winding in the middle.
      // Each coil is named by the neighbouring quarter it faces: j = 0 (pk − 22.5°) leans towards
      // quarter k − 1, j = 1 (pk + 22.5°) towards quarter k + 1.
      for (const [j, pc] of [[0, pk - 22.5], [1, pk + 22.5]]) {
        const side = QUARTER[(k + (j ? 1 : 3)) % 4].toLowerCase();
        const coil = piece('tf', q, { clip: true, apart: V(0, 0, 20), label: `${QUARTER[k]} quarter, ${side}-side coil`, axis: toroidal(pc) });
        const tf = D.tf, hw = tf.halfW / D.R0, c = pc * DEG;
        const axis = toroidal(pc);
        const FORMER = { sub: 'Copper former with fold-out tabs', ex: along(axis, -11) };
        add(coil, torusShell(D.R0, tf.rIn, tf.rOut, c - hw, c + hw, { nT: 72 }), 'cable', { sub: 'Winding: 50 turns of 6 mm cable' });
        add(coil, torusShell(D.R0, tf.rOut, tf.rOut + 0.12, c - hw + 0.004, c + hw - 0.004, { nT: 72 }), 'copper', { sub: 'Copper cover band', ex: along(axis, 11) });
        add(coil, torusShell(D.R0, D.aOut, D.aOut + 0.1, c - hw - 0.012, c + hw + 0.012, { nT: 72 }), 'copper', FORMER);
        // The former's cut tabs, folded out on both cheeks of the winding.
        const tabs = [];
        const r0 = D.aOut + 0.1, r1 = tf.tabR, rm = (r0 + r1) / 2, splay = Math.tan(16 * DEG);
        for (const s of [-1, 1]) {
          const ps = pc + (s * tf.halfW / D.R0) / DEG;
          const C = pol(D.R0, ps), tq = toroidal(ps);
          for (let i = 0; i < tf.tabs; i++) {
            const th = ((i + 0.5) / tf.tabs) * Math.PI * 2;
            const u = radial(ps).multiplyScalar(Math.cos(th)).add(Z.clone().multiplyScalar(Math.sin(th)));
            const w = radial(ps).multiplyScalar(-Math.sin(th)).add(Z.clone().multiplyScalar(Math.cos(th)));
            const len = (r1 - r0) / Math.cos(16 * DEG);
            const ax = u.clone().add(tq.clone().multiplyScalar(s * splay)).normalize();
            const centre = C.clone().add(u.clone().multiplyScalar(rm)).add(tq.clone().multiplyScalar(s * (0.06 + (rm - r0) * splay)));
            const width = ((2 * Math.PI * rm) / tf.tabs) * 0.74;
            tabs.push(at(box(width, len, 0.08), frame(centre, ax, w)));
          }
        }
        add(coil, merge(tabs), 'copper', FORMER);
        // Terminal block under the coil, with the two lead studs.
        const blockAt = pol(D.R0, pc, -(tf.rOut + 0.75));
        const TERM = { sub: 'Terminal block and lead studs', ex: V(0, 0, -7) };
        add(coil, at(box(1.6, tf.halfW * 1.4, 1.2), rtz(blockAt, pc)), 'black', TERM);
        for (const s of [-1, 1]) add(coil, at(rod(0.26, 0.7), frame(blockAt.clone().add(toroidal(pc).multiplyScalar(s * 1.2)).add(V(0, 0, -0.85)), Z)), 'bolt', TERM);
      }
    }
    const [qR, qB, qL, qF] = quarters;

    // Copper gaskets between the joint flanges, halfway between the two quarters when taken apart.
    for (let k = 0; k < 4; k++) {
      const pj = 45 + 90 * k;
      const off = radial(90 * k).multiplyScalar(16).add(radial(90 * ((k + 1) % 4)).multiplyScalar(16)).multiplyScalar(0.5);
      const g = group(`gasket${k}`, off, 0.32 + k * 0.05);
      const gk = piece('gaskets', g, { clip: true, sub: 'OFHC copper gasket', label: `${JOINT[k]} joint`, detach: V(0, 0, 0), axis: toroidal(pj) });
      add(gk, cfGasket(J, pol(D.R0, pj), toroidal(pj), 80), 'copper');
    }

    // ---------- Lateral port fittings ----------
    const latFace = D.lat.flangeAt + L.t;
    function windowFlange(pc, deg, glassR) {
      const rdir = radial(deg);
      add(pc, cfGasket(L, pol(latFace + D.gap / 2, deg), rdir, 48), 'copper', { sub: 'Copper gasket', ex: along(rdir, 3) });
      add(pc, cfRing(pol(latFace + D.gap + L.t / 2, deg), rdir, glassR, L.od / 2, L.t, [drilled(Z, toroidal(deg), L)], 72, [{ side: -1, cf: L }]), 'steel2', { sub: 'Viewport flange', ex: along(rdir, 7) });
      add(pc, at(disc(glassR, 0.6, 48), frame(pol(latFace + D.gap + 0.5, deg), rdir)), 'glass', { sub: 'Window glass, sealed into the flange', ex: along(rdir, 11) });
      cfBolts(pc, L, pol(latFace + D.gap + L.t, deg), pol(D.lat.flangeAt, deg), rdir, Z, toroidal(deg), { bolts: 16, nuts: 5 });
    }
    const vpB = piece('viewport', qB, { clip: true, apart: along(radial(90), 12), label: 'Back viewport (spectrometer)', axis: radial(90) });
    windowFlange(vpB, 90, 4.5);
    const vpL = piece('viewport', qL, { clip: true, apart: along(radial(180), 12), label: 'Left viewport (webcam)', axis: radial(180) });
    windowFlange(vpL, 180, 4.5);
    const vpF = piece('viewport', qF, { clip: true, apart: along(radial(270), 12), label: 'Front viewport (eyes)', axis: radial(270) });
    windowFlange(vpF, 270, 4.5);

    // Right port: zero-length reducer to a KF40 stub for the bellows line. The hose's own KF40 flange is drawn with the
    // port, so the whole joint (stub, centring ring and O-ring, hose flange, clamp) comes apart together; the hose
    // stays plugged into its flange.
    let pumpLineFrom, pumpPortEnd;
    {
      const rdir = radial(0), K = KF[40];
      const pc = piece('pumpPort', qR, { clip: true, apart: along(rdir, 10), axis: rdir });
      add(pc, cfGasket(L, pol(latFace + D.gap / 2, 0), rdir, 48), 'copper', { sub: 'Copper gasket', ex: along(rdir, 3) });
      const RED = { sub: 'Zero-length reducer with KF40 stub', ex: along(rdir, 7) };
      add(pc, cfRing(pol(latFace + D.gap + L.t / 2, 0), rdir, 2.05, L.od / 2, L.t, [drilled(Z, toroidal(0), L)], 72, [{ side: -1, cf: L }]), 'steel2', RED);
      cfBolts(pc, L, pol(latFace + D.gap + L.t, 0), pol(D.lat.flangeAt, 0), rdir, Z, toroidal(0), { bolts: 13, nuts: 5 });
      const from = latFace + D.gap + L.t, to = from + 3.2 - K.t;
      add(pc, at(ring(K.ti, K.to, to - from, 32), frame(pol((from + to) / 2, 0), rdir)), 'steel', RED);
      const joint = pol(to + K.t + K.g / 2, 0);
      pumpPortEnd = kfJoint(K, joint, rdir, Z, { pc, ...RED }, { pc, sub: 'Hose end flange, KF40', ex: along(rdir, 10) },
        { pc, sub: 'KF40 centring ring and O-ring', ex: along(rdir, 9).add(V(0, 0, 4)) }, { pc, sub: 'KF40 clamp with wing nut', ex: along(rdir, 13).add(V(0, 0, -6)) }, 40);
      pumpLineFrom = to + K.t * 2 + K.g;
    }

    // ---------- Small DN40CF ports on the top and bottom of the front and left quarters ----------
    function smallPort(q, deg, up, label) {
      const dir = up ? Z.clone() : Z.clone().negate();
      // Tube, weld and flange are one welded piece.
      const pc = piece('diagPorts', q, { clip: true, sub: 'Port tube, 38 mm', label, axis: Z });
      const zs = up ? 1 : -1;
      const nr = S.tube / 2;
      add(pc, saddleNeck(pol(D.R0, deg, 0), dir, nr - S.wall, nr, D.small.flangeAt, verticalStart(deg), 36), 'steel');
      add(pc, cfRing(pol(D.R0, deg, zs * (D.small.flangeAt + S.t / 2)), dir, nr - S.wall, S.od / 2, S.t, [drilled(radial(deg), toroidal(deg), S)], 40, [{ side: 1, cf: S }]), 'steel2', { sub: 'DN40CF flange' });
      add(pc, bead(nr, pol(D.R0, deg, zs * (D.small.flangeAt - 0.14)), dir.clone().negate()), 'steel2', { sub: 'TIG weld' });
      const face = D.small.flangeAt + S.t;
      const mate = zs * (face + D.gap);
      return {
        pc, dir, zs, face, mate,
        // The mating flange's bolts and nuts belong to whatever is mounted on the port.
        bolts: (owner, o) => cfBolts(owner, S, pol(D.R0, deg, zs * (face + D.gap + S.t)), pol(D.R0, deg, zs * D.small.flangeAt), dir, radial(deg), toroidal(deg), o),
        gasket: (owner) => add(owner, cfGasket(S, pol(D.R0, deg, zs * (face + D.gap / 2)), dir, 32), 'copper', { sub: 'Copper gasket', ex: along(dir, 2) }),
      };
    }

    // Front top: laser diagnostics window.
    {
      const sp = smallPort(qF, 270, true, 'Front top port');
      const pc = piece('laser', qF, { clip: true, apart: V(0, 0, 10), axis: Z });
      sp.gasket(pc);
      add(pc, cfRing(pol(D.R0, 270, sp.mate + S.t / 2), Z, 1.9, S.od / 2, S.t, [drilled(radial(270), toroidal(270), S)], 40, [{ side: -1, cf: S }]), 'steel2', { sub: 'DN40CF viewport flange', ex: V(0, 0, 5) });
      add(pc, at(disc(1.9, 0.3, 32), frame(pol(D.R0, 270, sp.mate + 0.35), Z)), 'glass', { sub: 'Window glass', ex: V(0, 0, 8) });
      sp.bolts(pc, { bolts: 12, nuts: 3 });
    }

    // Bottom ports: the two discharge electrodes. The anode rod stands up into the vessel.
    const hvEnds = [];
    for (const [q, deg, name] of [[qF, 270, 'Electrode A (front)'], [qL, 180, 'Electrode B (left)']]) {
      const sp = smallPort(q, deg, false, `${deg === 270 ? 'Front' : 'Left'} bottom port`);
      const pc = piece('electrode', q, { clip: true, apart: V(0, 0, -12), label: name, axis: Z });
      sp.gasket(pc);
      const FEED = { sub: 'HV feedthrough: flange, ceramic insulator, anode rod', ex: V(0, 0, -6) };
      const zf = sp.mate - S.t / 2;
      add(pc, cfRing(pol(D.R0, deg, zf), Z, 0.55, S.od / 2, S.t, [drilled(radial(deg), toroidal(deg), S)], 40, [{ side: 1, cf: S }]), 'steel2', FEED);
      sp.bolts(pc, { bolts: 12, nuts: 3 });
      const insFrom = -(sp.face + D.gap + S.t);
      const prof = [[0.55, 0]];
      for (let i = 0; i < 4; i++) prof.push([1.25, i + 0.15], [1.25, i + 0.35], [0.9, i + 0.5], [0.9, i + 1.0]);
      prof.push([0.55, 4.0], [0.55, 0]);
      add(pc, at(revolve(prof, 32), frame(pol(D.R0, deg, insFrom), Z.clone().negate())), 'ceramic', FEED);
      const capAt = pol(D.R0, deg, insFrom - 4.6);
      const cap = add(pc, at(disc(0.75, 1.2, 24), frame(capAt, Z)), 'bolt', { sub: 'HV terminal cap', ex: V(0, 0, -10) });
      add(pc, at(rod(0.22, sp.face - (D.aIn - 2.6), 12), frame(pol(D.R0, deg, -(sp.face + D.aIn - 2.6) / 2), Z)), 'bolt', FEED);
      add(pc, at(disc(0.9, 0.35, 28), frame(pol(D.R0, deg, -(D.aIn - 2.6)), Z)), 'steel2', { sub: 'Anode disc', ex: V(0, 0, 3) });
      hvEnds.push({ from: capAt.clone().add(V(0, 0, -0.6)), deg, cap });
    }

    // Left top: Langmuir probe on a bellows linear feedthrough.
    {
      const sp = smallPort(qL, 180, true, 'Left top port');
      const pc = piece('probe', qL, { clip: true, apart: V(0, 0, 14), axis: Z });
      sp.gasket(pc);
      const base = sp.mate + S.t;
      const FEED = { sub: 'Bellows linear feedthrough', ex: V(0, 0, 6) };
      const DRIVE = { sub: 'Micrometer drive and knob', ex: V(0, 0, 11) };
      const PROBE = { sub: 'Probe: shaft, ceramic sleeve, wire tip', ex: along(radial(180), 7).add(V(0, 0, 3)) };
      add(pc, cfRing(pol(D.R0, 180, sp.mate + S.t / 2), Z, 0.5, S.od / 2, S.t, [drilled(radial(180), toroidal(180), S)], 40, [{ side: -1, cf: S }]), 'steel2', FEED);
      sp.bolts(pc, { bolts: 16, nuts: 3 });
      const top = base + 6;
      const prof = [[0.6, base]];
      const folds = 12;
      for (let i = 0; i <= folds * 2; i++) prof.push([i % 2 ? 1.55 : 1.15, base + ((top - base) * i) / (folds * 2)]);
      prof.push([0.6, top], [0.6, base]);
      add(pc, at(revolve(prof, 36), frame(pol(D.R0, 180, 0), Z)), 'steel', FEED);
      add(pc, at(box(4.4, 4.4, 0.8), rtz(pol(D.R0, 180, top + 0.4), 180)), 'alu', FEED);
      for (const s of [-1, 1]) add(pc, at(rod(0.3, 6.8), frame(pol(D.R0, 180, base + 3.4).add(toroidal(180).multiplyScalar(s * 2.0)), Z)), 'bolt', FEED);
      add(pc, at(disc(0.9, 3.0, 24), frame(pol(D.R0, 180, top + 2.3), Z)), 'steel2', DRIVE);
      add(pc, at(disc(1.15, 1.6, 24), frame(pol(D.R0, 180, top + 4.6), Z)), 'black', DRIVE);
      for (let i = 0; i < 5; i++) add(pc, at(ring(0.92, 0.97, 0.06, 24), frame(pol(D.R0, 180, top + 1.2 + i * 0.45), Z)), 'ink', DRIVE);
      add(pc, at(rod(0.15, base - 1.5 + 0.5), frame(pol(D.R0, 180, (base + 1.5) / 2 - 0.25), Z)), 'bolt', PROBE);
      add(pc, at(rod(0.32, D.aIn - 1.4, 12), frame(pol(D.R0, 180, 1.5 + (D.aIn - 1.4) / 2), Z)), 'ceramic', PROBE);
      add(pc, at(rod(0.09, 1.2, 8), frame(pol(D.R0, 180, 0.9), Z)), 'tip', PROBE);
    }

    // Back top: the larger gauge port (DN63CF) with the gauge and gas-inlet stack. Above the reducer sit four DN40
    // seals, each with its own gasket: reducer → cross, cross → blank and cross → KF16 adaptor (the stack's three) and
    // cross → needle valve (the valve's). The reducer's DN40 holes are tapped; every other DN40 joint is bolted through
    // with nuts.
    let gaugeCableFrom, gasFrom, gaugePlug, needleOut;
    {
      const deg = 90;
      const port = piece('diagPorts', qB, { clip: true, sub: 'Port tube, 63.5 mm', label: 'Back top gauge port (DN63)', axis: Z });
      const nr = G.tube / 2;
      add(port, saddleNeck(pol(D.R0, deg, 0), Z, nr - G.wall, nr, D.gport.flangeAt, verticalStart(deg), 40), 'steel');
      add(port, cfRing(pol(D.R0, deg, D.gport.flangeAt + G.t / 2), Z, nr - G.wall, G.od / 2, G.t, [drilled(radial(deg), toroidal(deg), G)], 56, [{ side: 1, cf: G }]), 'steel2', { sub: 'DN63CF flange' });
      add(port, bead(nr, pol(D.R0, deg, D.gport.flangeAt - 0.14), Z.clone().negate()), 'steel2', { sub: 'TIG weld' });
      const face = D.gport.flangeAt + G.t;

      const st = piece('stack', qB, { clip: true, apart: V(0, 0, 10), axis: Z });
      add(st, cfGasket(G, pol(D.R0, deg, face + D.gap / 2), Z), 'copper', { sub: 'Copper gasket', ex: V(0, 0, 2) });
      const rz = face + D.gap;
      const RED = { sub: 'DN63 to DN40 reducer flange', ex: V(0, 0, 5) };
      add(st, cfRing(pol(D.R0, deg, rz + G.t / 2), Z, 1.75, G.od / 2, G.t, [drilled(radial(deg), toroidal(deg), G), drilled(radial(deg), toroidal(deg), S)], 56, [{ side: -1, cf: G }, { side: 1, cf: S }]), 'bronze', RED);
      // The DN40 holes are tapped into the top face, not drilled through.
      addInst(st, disc(S.hr, 0.02, 12), 'hole', circleMatrices(pol(D.R0, deg, rz + G.t + 0.01), Z, radial(deg), toroidal(deg), S.bc / 2, S.n), RED);
      cfBolts(st, G, pol(D.R0, deg, rz + G.t), pol(D.R0, deg, D.gport.flangeAt), Z, radial(deg), toroidal(deg), { bolts: 9, nuts: 3 });
      // DN40 four-way cross: vertical body, two side arms along the ring.
      const CROSS = { sub: 'DN40 four-way cross', ex: V(0, 0, 10) };
      const GASKETS = '3 DN40 gaskets';
      const c0 = rz + G.t + D.gap, c1 = c0 + 8, cm = (c0 + c1) / 2;
      const cr = S.tube / 2;
      add(st, cfGasket(S, pol(D.R0, deg, rz + G.t + D.gap / 2), Z, 32), 'copper', { sub: GASKETS, ex: V(0, 0, 7.5) });
      add(st, at(ring(cr - 0.15, cr, c1 - c0 - 2 * S.t, 32), frame(pol(D.R0, deg, cm), Z)), 'steel', CROSS);
      add(st, cfRing(pol(D.R0, deg, c0 + S.t / 2), Z, cr - 0.15, S.od / 2, S.t, [drilled(radial(deg), toroidal(deg), S)], 40, [{ side: -1, cf: S }]), 'steel2', CROSS);
      // M6 × 25 into the tapped holes: through the cross flange and the gasket, then 10.5 mm into the reducer.
      addInst(st, boltGeom(2.5, S.af, S.br, S.k), 'bolt', circleMatrices(pol(D.R0, deg, c0 + S.t), Z, radial(deg), toroidal(deg), S.bc / 2, S.n), { sub: '6 bolts into the reducer', ex: V(0, 0, 18) });
      add(st, cfRing(pol(D.R0, deg, c1 - S.t / 2), Z, cr - 0.15, S.od / 2, S.t, [drilled(radial(deg), toroidal(deg), S)], 40, [{ side: 1, cf: S }]), 'steel2', CROSS);
      const tq = toroidal(deg);
      const armFace = cr + 4 - 0.2;
      for (const s of [-1, 1]) {
        const ax = tq.clone().multiplyScalar(s);
        const centre = pol(D.R0, deg, cm);
        add(st, at(ring(cr - 0.15, cr, 4 - S.t, 32), frame(centre.clone().add(ax.clone().multiplyScalar(cr + (4 - S.t) / 2 - 0.2)), ax)), 'steel', CROSS);
        add(st, cfRing(centre.clone().add(ax.clone().multiplyScalar(armFace - S.t / 2)), ax, cr - 0.15, S.od / 2, S.t, [drilled(Z, radial(deg), S)], 40, [{ side: 1, cf: S }]), 'steel2', CROSS);
        if (s > 0) {
          // Blank on the +toroidal arm.
          const up = V(0, 0, 10);
          const at0 = (d) => centre.clone().add(ax.clone().multiplyScalar(d));
          add(st, cfGasket(S, at0(armFace + D.gap / 2), ax, 32), 'copper', { sub: GASKETS, ex: along(ax, 2.5).add(up) });
          add(st, cfRing(at0(armFace + D.gap + S.t / 2), ax, 0, S.od / 2, S.t, [drilled(Z, radial(deg), S)], 40, [{ side: -1, cf: S }]), 'steel2', { sub: 'DN40 blank flange', ex: along(ax, 5).add(up) });
          cfBolts(st, S, at0(armFace + D.gap + S.t), at0(armFace - S.t), ax, Z, radial(deg), { name: 'on the blank', boltsEx: along(ax, 10).add(up), nutsEx: V(0, 0, 14) });
        }
      }
      // Top: DN40 to KF16 adaptor flange, with its KF16 stub.
      const ADAPT = { sub: 'DN40 to KF16 adaptor flange', ex: V(0, 0, 15) };
      add(st, cfGasket(S, pol(D.R0, deg, c1 + D.gap / 2), Z, 32), 'copper', { sub: GASKETS, ex: V(0, 0, 12.5) });
      add(st, cfRing(pol(D.R0, deg, c1 + D.gap + S.t / 2), Z, 0.8, S.od / 2, S.t, [drilled(radial(deg), toroidal(deg), S)], 40, [{ side: -1, cf: S }]), 'steel2', ADAPT);
      cfBolts(st, S, pol(D.R0, deg, c1 + D.gap + S.t), pol(D.R0, deg, c1 - S.t), Z, radial(deg), toroidal(deg), { name: 'on the adaptor', boltsEx: V(0, 0, 21), nutsEx: V(0, 0, 7) });
      const kfFrom = c1 + D.gap + S.t;
      const K = KF[16], stub = 1.0;
      add(st, at(ring(K.ti, K.to, stub, 24), frame(pol(D.R0, deg, kfFrom + stub / 2), Z)), 'steel', ADAPT);
      const kfJ = kfFrom + stub + K.t + K.g / 2;

      // The gauge comes off at its KF16 clamp: its own flange, the centring ring with its O-ring and the clamp belong
      // to it, and the stub flange stays on the adaptor.
      const gg = piece('gauge', qB, { clip: true, apart: V(0, 0, 22), label: 'Vacuum gauge', sub: 'Convectron ATM display module', axis: Z });
      const kfTo = kfFrom + 9, gBack = kfJ + K.g / 2 + K.t;
      const TUBE = { sub: 'KF16 tube and flange' };
      add(gg, at(ring(K.ti, K.to, kfTo - gBack, 24), frame(pol(D.R0, deg, (gBack + kfTo) / 2), Z)), 'steel', TUBE);
      kfJoint(K, pol(D.R0, deg, kfJ), Z, radial(deg), { pc: st, ...ADAPT }, { pc: gg, ...TUBE },
        { pc: gg, sub: 'KF16 centring ring and O-ring', ex: V(0, 0, -1.5) }, { pc: gg, sub: 'KF16 clamp', ex: along(radial(deg), 6) }, 32);
      // The nut fits over the Ø19 mm tube, so it is 24 mm across flats: a hex any narrower than its bore turns inside out.
      add(gg, at(hexNut(2.4, 1.0, 0.97), frame(pol(D.R0, deg, kfTo - 0.5), Z)), 'steel2', { sub: 'Sensor tube nut', ex: V(0, 0, 3) });
      const head = pol(D.R0, deg, kfTo + 2.6);
      const HEAD = { ex: V(0, 0, 7) };
      add(gg, at(box(3.2, 8.4, 5.0), rtz(head, deg)), 'gaugeblue', HEAD);
      // Display window and two buttons on the face toward the centre of the ring.
      const lcd = add(gg, at(box(0.12, 4.2, 1.5), rtz(head.clone().add(radial(deg).multiplyScalar(-1.62)).add(V(0, 0, 0.8)), deg)), 'lcd', HEAD);
      lcd.userData.lcd = true;
      for (const s of [-1, 1]) add(gg, at(disc(0.25, 0.14, 12), frame(head.clone().add(radial(deg).multiplyScalar(-1.65)).add(tq.clone().multiplyScalar(s * 0.9)).add(V(0, 0, -1.1)), radial(deg).negate())), 'ink', HEAD);
      gaugePlug = add(gg, at(disc(0.5, 1.2, 16), frame(head.clone().add(tq.clone().multiplyScalar(-4.8)), tq)), 'bolt', { sub: 'Cable connector', ex: along(tq, -4).add(V(0, 0, 7)) });
      gaugeCableFrom = head.clone().add(tq.clone().multiplyScalar(-5.4));

      // Needle valve on the -toroidal arm, with its gas line down to the table.
      const ax = tq.clone().negate();
      const nv = piece('needle', qB, { clip: true, apart: along(ax, 7).add(V(0, 0, 10)), label: 'Needle valve', axis: ax });
      const arm = pol(D.R0, deg, cm).add(ax.clone().multiplyScalar(armFace));
      const armEnd = arm.clone().add(ax.clone().multiplyScalar(D.gap));
      add(nv, cfGasket(S, arm.clone().add(ax.clone().multiplyScalar(D.gap / 2)), ax, 32), 'copper', { sub: 'Copper gasket', ex: along(ax, 1.5) });
      add(nv, cfRing(armEnd.clone().add(ax.clone().multiplyScalar(S.t / 2)), ax, 0.4, S.od / 2, S.t, [drilled(Z, radial(deg), S)], 40, [{ side: -1, cf: S }]), 'steel2', { sub: 'DN40 inlet flange', ex: along(ax, 3) });
      cfBolts(nv, S, armEnd.clone().add(ax.clone().multiplyScalar(S.t)), arm.clone().add(ax.clone().multiplyScalar(-S.t)), ax, Z, radial(deg), { boltsEx: along(ax, 8), nutsEx: along(ax, -1.5).add(V(0, 0, -2)) });
      const vb = armEnd.clone().add(ax.clone().multiplyScalar(S.t + 1.2));
      const BODY = { sub: 'Needle valve body', ex: along(ax, 6) };
      const STEM = { sub: 'Needle stem and knob', ex: along(ax, 6).add(V(0, 0, 5)) };
      add(nv, at(box(2.4, 2.6, 2.4), frame(vb, ax, Z)), 'brass', BODY);
      add(nv, at(rod(0.35, 1.8), frame(vb.clone().add(V(0, 0, 2.1)), Z)), 'bolt', STEM);
      add(nv, at(disc(1.05, 1.3, 24), frame(vb.clone().add(V(0, 0, 3.6)), Z)), 'black', STEM);
      const ridges = [];
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const o = radial(0).multiplyScalar(1.07 * Math.cos(a)).add(V(0, 1.07 * Math.sin(a), 0));
        ridges.push(at(box(0.14, 1.2, 0.14), frame(vb.clone().add(V(0, 0, 3.6)).add(o), Z, o)));
      }
      add(nv, merge(ridges), 'black', STEM);
      const OUT = { sub: 'Outlet compression fitting', ex: along(ax, 10) };
      add(nv, at(rod(0.4, 1.0), frame(vb.clone().add(ax.clone().multiplyScalar(1.7)), ax)), 'brass', OUT);
      needleOut = add(nv, at(hexNut(1.1, 0.7, 0.3), frame(vb.clone().add(ax.clone().multiplyScalar(2.3)), ax)), 'brass', OUT);
      gasFrom = vb.clone().add(ax.clone().multiplyScalar(2.7));
    }

    // ---------- Central former with PF1, PF2 and the solenoid ----------
    // Taken apart, the former drops with the table and the coils stay up: they slide off its top.
    {
      const g = group('former', V(0, 0, -30), 0.05);
      const F = D.former, top = TB.top;
      const fm = piece('former', g, { sub: 'White metal tube' });
      const h = F.top - top;
      add(fm, at(ring(F.r - F.t, F.r, h - 0.45, 72), frame(V(0, 0, top + (h - 0.45) / 2), Z)), 'white');
      add(fm, at(flangeRing(F.r - F.t - 0.2, F.r + 0.25, 0.5, 72), frame(V(0, 0, F.top - 0.2), Z)), 'white', { sub: 'Top rim', ex: V(0, 0, 5) });
      add(fm, cfRing(V(0, 0, top + 0.3), Z, F.r - F.t, F.r + 2.2, 0.6, [{ u: V(1, 0, 0), v: V(0, 1, 0), rad: F.r + 1.2, n: 8, r: 0.3 }]), 'alu', { sub: 'Base flange', ex: V(0, 0, -4) });
      addInst(fm, hex(0.9, 0.5), 'bolt', circleMatrices(V(0, 0, top + 0.6 + 0.25), Z, V(1, 0, 0), V(0, 1, 0), F.r + 1.2, 8), { sub: '8 base bolts', ex: V(0, 0, 5) });
      const screws = [];
      for (let i = 0; i < 8; i++) {
        const a = ((i + 0.5) / 8) * 360;
        screws.push(frame(pol(F.r + 0.05, a, F.top - 1.1), radial(a), Z));
      }
      addInst(fm, disc(0.3, 0.12, 12), 'black', screws, { sub: '8 rim screws', ex: V(0, 0, 9) });
      // Leads from the coils run up inside the former and out over its rim.
      for (const a of [130, 150]) {
        add(fm, tube([pol(F.r - F.t - 0.3, a, top + 0.5), pol(F.r - F.t - 0.5, a, 0), pol(F.r - F.t - 0.6, a - 4, F.top - 2), pol(F.r - F.t - 0.25, a - 6, F.top - 0.5)], 0.22, { seg: 24, radial: 8 }), 'cable', { sub: 'Coil leads', ex: V(0, 0, 22) });
      }

      for (const up of [true, false]) {
        const zs = up ? 1 : -1;
        const pg = group(up ? 'pf1' : 'pf2', V(0, 0, up ? 18 : -2), 0.18);
        const pc = piece('pfInner', pg, { sub: 'Winding, copper-taped cable', label: up ? 'PF1 (upper)' : 'PF2 (lower)' });
        const zc = zs * D.pfIn.z;
        add(pc, at(ring(F.r, D.pfIn.rOut, D.pfIn.h, 96), frame(V(0, 0, zc), Z)), 'copper');
        for (const dz of [-0.55, 0.55]) add(pc, at(ring(D.pfIn.rOut - 0.02, D.pfIn.rOut + 0.06, 0.12, 96), frame(V(0, 0, zc + dz), Z)), 'tapeline');
        for (let i = 0; i < 6; i++) {
          const a = i * 60 + 15;
          add(pc, at(box(0.5, 0.24, D.pfIn.h + 0.25), rtz(pol(D.pfIn.rOut + 0.04, a, zc), a)), 'black', { sub: '6 cable ties', ex: along(radial(a), 4) });
        }
      }
      const sg = group('sol', V(0, 0, 8), 0.14);
      const sp = piece('solenoid', sg, { sub: 'Winding' });
      add(sp, at(ring(F.r, D.sol.rOut, D.sol.h, 96), frame(V(0, 0, 0), Z)), 'cable');
      for (let i = 1; i < 6; i++) add(sp, at(ring(D.sol.rOut - 0.02, D.sol.rOut + 0.05, 0.1, 96), frame(V(0, 0, -D.sol.h / 2 + i), Z)), 'tapeline');
      add(sp, at(ring(F.r, D.sol.rOut + 0.1, 0.25, 96), frame(V(0, 0, D.sol.h / 2), Z)), 'black', { sub: 'Upper end ring', ex: V(0, 0, 4) });
      add(sp, at(ring(F.r, D.sol.rOut + 0.1, 0.25, 96), frame(V(0, 0, -D.sol.h / 2), Z)), 'black', { sub: 'Lower end ring', ex: V(0, 0, -4) });
    }

    // ---------- Outer PF coils on aluminium channels, braced to the posts ----------
    function uChannel(R) {
      const w = 1.5, h = 1.3, web = 0.3, ch = 0.3;
      const pts = [[-w, -h], [w, -h], [w, -h + ch], [-w + web, -h + ch], [-w + web, h - ch], [w, h - ch], [w, h], [-w, h], [-w, -h]].map(([r, y]) => [-r, -y]);
      return revolve(pts.map(([r, y]) => [R + r, y]), 120);
    }
    for (const up of [true, false]) {
      const zs = up ? 1 : -1;
      const g = group(up ? 'pf3' : 'pf4', V(0, 0, up ? 34 : -14), 0.1);
      const pc = piece('pfOuter', g, { sub: 'Aluminium U-channel former', label: up ? 'PF3 (upper)' : 'PF4 (lower)' });
      const m = new THREE.Matrix4().makeRotationX(Math.PI / 2).setPosition(0, 0, zs * D.pfOut.z);
      add(pc, at(uChannel(D.pfOut.R), m.clone()), 'alu');
      add(pc, at(ring(D.pfOut.R - 1.25, D.pfOut.R + 1.2, 2.0, 120), m.clone()), 'tape', { sub: 'Winding', ex: V(0, 0, zs * 5) });
      for (let i = 0; i < 4; i++) {
        const deg = 45 + i * 90;
        const from = D.pfOut.R + 1.5, to = D.post.R - D.post.half;
        add(pc, at(box(to - from, 2.0, 1.2), rtz(pol((from + to) / 2, deg, zs * D.pfOut.z), deg)), 'alu', { sub: '4 post brackets', ex: along(radial(deg), 6) });
        for (const s of [-1, 1]) add(pc, at(hex(0.9, 0.4), frame(pol((from + to) / 2 + s * 1.1, deg, zs * D.pfOut.z + zs * 0.8), Z.clone().multiplyScalar(zs))), 'bolt', { sub: '8 bracket bolts', ex: along(radial(deg), 6).add(V(0, 0, zs * 3)) });
      }
    }

    // ---------- Satellite PF coils: hose-wound rings, the top one on brackets, the bottom one on pads ----------
    for (const up of [true, false]) {
      const S2 = up ? D.satTop : D.satBot;
      const g = group(up ? 'satTop' : 'satBot', V(0, 0, up ? 50 : -22), 0);
      const pc = piece('satellite', g, { sub: 'Cable in a hose sleeve, taped', label: up ? 'Upper satellite coil' : 'Lower satellite coil' });
      const tor = new THREE.TorusGeometry(S2.R, S2.r, 22, 240);
      tor.deleteAttribute('uv');
      add(pc, at(tor, T(0, 0, S2.z)), 'hose');
      const tapes = [];
      for (let i = 0; i < 28; i++) {
        const c = ((i + 0.5) / 28) * Math.PI * 2;
        tapes.push(at(torusShell(S2.R, S2.r - 0.05, S2.r + 0.1, c - 0.011, c + 0.011, { nT: 24, nP: 2 }), T(0, 0, S2.z)));
      }
      add(pc, merge(tapes), 'tape');
      for (let i = 0; i < 4; i++) {
        if (up) {
          const deg = 45 + i * 90;
          const from = S2.R + S2.r - 0.2, to = D.post.R - D.post.half;
          const BR = { sub: '4 brackets to the posts', ex: along(radial(deg), 6) };
          add(pc, at(box(to - from + 0.6, 3.2, 0.6), rtz(pol((from + to) / 2 + 0.3, deg, S2.z - S2.r - 0.3), deg)), 'alu', BR);
          add(pc, at(box(0.5, 3.2, 3.6), rtz(pol(to - 0.25, deg, S2.z - S2.r + 1.2), deg)), 'alu', BR);
          add(pc, at(box(1.2, 3.4, 0.5), rtz(pol(S2.R, deg, S2.z + S2.r + 0.25), deg)), 'black', { sub: '4 retaining straps', ex: V(0, 0, 5) });
        } else {
          const deg = i * 90 + 45;
          const h = S2.z - S2.r - TB.top;
          add(pc, at(box(3.2, 3.2, h), rtz(pol(S2.R, deg, TB.top + h / 2), deg)), 'black', { sub: '4 rubber pads', ex: V(0, 0, -5) });
        }
      }
    }

    // ---------- Table (Thorlabs Nexus), legs, shelf, posts ----------
    // In the exploded view the table and everything on and under it drops, to clear the coils below the vessel.
    const DROP = V(0, 0, -30);
    const tableG = group('table', DROP, 0);
    {
      const g = tableG;
      const tb = piece('table', g, { sub: 'Table core, steel side band' });
      const SKIN = { sub: 'Breadboard top skin, M6 on 25 mm', ex: V(0, 0, 8) };
      add(tb, at(box(TB.half * 2, TB.half * 2, 1), T(0, 0, TB.top - 0.5)), 'table', SKIN);
      add(tb, at(box(TB.half * 2 - 0.2, TB.half * 2 - 0.2, TB.thick - 1), T(0, 0, TB.top - 1 - (TB.thick - 1) / 2)), 'black');
      const holes = [];
      const pitch = 2.5;
      for (let i = -17; i <= 17; i++) for (let j = -17; j <= 17; j++) holes.push(T(i * pitch, j * pitch, TB.top + 0.01));
      const holeMesh = addInst(tb, at(new THREE.CircleGeometry(0.3, 10).deleteAttribute('uv'), new THREE.Matrix4()), 'hole', holes, SKIN);
      holeMesh.userData.sameInkAs = 'table';
      // Engraved name plates on the front band.
      for (const [x, w] of [[-24, 12], [26, 10]]) add(tb, at(box(w, 0.08, 1.6), T(x, -TB.half - 0.1, TB.top - TB.thick / 2)), 'alu', { sub: 'Name plates', ex: V(0, -3, 0) });
      const legTop = TB.top - TB.thick;
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const lx = sx * TB.legAt, ly = sy * TB.legAt;
        const h = legTop - 1.6 - (TB.floor + 2.5);
        const out = V(sx * 7, sy * 7, -6);
        add(tb, at(box(TB.leg, TB.leg, h), T(lx, ly, TB.floor + 2.5 + h / 2)), 'black', { sub: '4 legs', ex: out });
        add(tb, at(disc(2.2, 1.6, 24), frame(V(lx, ly, legTop - 0.8), Z)), 'steel2', { sub: '4 isolator pads', ex: out.clone().add(V(0, 0, 4)) });
        add(tb, at(rod(0.9, 2.6, 16), frame(V(lx, ly, TB.floor + 2.0), Z)), 'bolt', { sub: '4 levelling feet', ex: out.clone().add(V(0, 0, -5)) });
        add(tb, at(disc(3.0, 1.2, 28), frame(V(lx, ly, TB.floor + 0.6), Z)), 'ink', { sub: '4 levelling feet', ex: out.clone().add(V(0, 0, -5)) });
      }
      const inner = TB.legAt - TB.leg / 2;
      for (const s of [-1, 1]) {
        add(tb, at(box(inner * 2, 5, 7), T(0, s * TB.legAt, TB.shelf - 3.5)), 'black', { sub: 'Frame beams', ex: V(0, s * 4, -6) });
        add(tb, at(box(5, inner * 2, 7), T(s * TB.legAt, 0, TB.shelf - 3.5)), 'black', { sub: 'Frame beams', ex: V(s * 4, 0, -6) });
        add(tb, at(box(5, inner * 2, 6), T(s * TB.legAt, 0, legTop - 1.6 - 3)), 'black', { sub: 'Frame beams', ex: V(s * 4, 0, -3) });
      }
      add(tb, at(box(inner * 2, inner * 2, 1.0), T(0, 0, TB.shelf + 0.5)), 'panel', { sub: 'Lower shelf', ex: V(0, 0, -3) });
    }

    // Post i stands at 45 + 90i°: +x is right, +y is back, so 45° is the back-right corner.
    const CORNER = ['Back-right', 'Back-left', 'Front-left', 'Front-right'];
    for (let i = 0; i < 4; i++) {
      const deg = 45 + i * 90;
      const P = D.post;
      const pc = piece('posts', tableG, { sub: 'Slotted aluminium extrusion', apart: along(radial(deg), 10), label: `${CORNER[i]} post` });
      const h = P.top - TB.top;
      const c = pol(P.R, deg, TB.top + h / 2);
      add(pc, at(box(P.half * 2, P.half * 2, h), rtz(c, deg)), 'alu');
      add(pc, at(box(P.half * 2 + 0.1, P.half * 2 + 0.1, 0.4), rtz(pol(P.R, deg, P.top + 0.2), deg)), 'black', { sub: 'End cap', ex: V(0, 0, 5) });
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const o = radial(deg).multiplyScalar(dx * (P.half + 0.03)).add(toroidal(deg).multiplyScalar(dy * (P.half + 0.03)));
        add(pc, at(box(dx ? 0.1 : 0.8, dy ? 0.1 : 0.8, h - 1.2), rtz(c.clone().add(o), deg)), 'slot');
      }
      // Angle bracket at the foot, outboard of the post.
      const foot = pol(P.R + P.half + 2.1, deg, TB.top);
      const BRK = { sub: 'Angle bracket', ex: along(radial(deg), 5) };
      add(pc, at(box(4.2, 4.0, 0.5), rtz(foot.clone().add(V(0, 0, 0.25)), deg)), 'alu', BRK);
      add(pc, at(box(0.5, 4.0, 4.2), rtz(pol(P.R + P.half + 0.25, deg, TB.top + 2.1), deg)), 'alu', BRK);
      for (const s of [-1, 1]) add(pc, at(hex(1.0, 0.45), frame(foot.clone().add(toroidal(deg).multiplyScalar(s * 1.2)).add(radial(deg).multiplyScalar(0.9)).add(V(0, 0, 0.5)), Z)), 'bolt', { sub: 'Bracket bolts', ex: along(radial(deg), 5).add(V(0, 0, 4)) });
      // Clamp block that holds the joint flange pair.
      const from = D.R0 + J.od / 2, to = P.R - P.half;
      const blockAt = pol((from + to) / 2, deg, 0);
      add(pc, at(box(to - from, J.t * 2 + D.gap + 2.4, 4.4), rtz(blockAt, deg)), 'steel2', { sub: 'Flange clamp block', ex: along(radial(deg), -6) });
      for (const s of [-1, 1]) add(pc, at(hex(1.0, 0.45), frame(blockAt.clone().add(toroidal(deg).multiplyScalar(s * 0.6)).add(V(0, 0, 2.2 + 0.22)), Z)), 'bolt', { sub: 'Clamp bolts', ex: along(radial(deg), -6).add(V(0, 0, 4)) });
    }

    // ---------- Under the table: coil supply chassis, control drawer, pump ----------
    let pumpInlet, pumpClamp;
    {
      const g = group('rack', DROP, 0);
      const base = TB.shelf + 1.0;
      const front = -20, depth = 38;
      const x0 = -31, x1 = 16;
      const pc = piece('psu', g, { sub: '19-inch rack chassis' });
      const chassis = (zFrom, h) => {
        add(pc, at(box(x1 - x0, depth, h), T((x0 + x1) / 2, front + depth / 2, zFrom + h / 2)), 'black');
        for (const s of [-1, 1]) add(pc, at(box(1.6, 0.6, h - 0.4), T(s < 0 ? x0 - 0.8 : x1 + 0.8, front - 0.3, zFrom + h / 2)), 'alu', { sub: 'Rack ears', ex: V(s * 3, -2, 0) });
      };
      const mod = (x, w, zFrom, h, label, name) => {
        const cy = front - 0.2;
        const M = { sub: name, ex: V(0, -9, 0) };
        add(pc, at(box(w - 0.3, 0.4, h - 0.6), T(x, cy, zFrom + h / 2)), 'panel', M);
        const lcd = add(pc, at(box(w - 2.0, 0.15, 1.5), T(x, cy - 0.27, zFrom + h - 2.4)), 'lcd', M);
        lcd.userData.lcd = true;
        add(pc, at(disc(0.8, 0.9, 20), frame(V(x, cy - 0.65, zFrom + h / 2 - 0.4), V(0, -1, 0))), 'ink', M);
        for (const s of [-1, 1]) add(pc, at(disc(0.36, 0.9, 12), frame(V(x + s * (w / 2 - 1.2), cy - 0.65, zFrom + 1.5), V(0, -1, 0))), s < 0 ? 'red' : 'ink', M);
        if (label) add(pc, at(box(w - 1.6, 0.06, 0.8), T(x, cy - 0.23, zFrom + h - 0.8)), label, M);
      };
      chassis(base, 13.3);
      const wm = (x1 - x0) / 8;
      for (let i = 0; i < 8; i++) mod(x0 + wm / 2 + i * wm, wm, base, 13.3, null, '8 TF supply channels');
      const top2 = base + 13.3;
      chassis(top2, 13.3);
      for (let i = 0; i < 7; i++) mod(x0 + wm / 2 + i * wm, wm, top2, 13.3, i < 4 ? null : 'yellowtag', i < 4 ? '4 PF supply channels' : 'Satellite and solenoid channels');

      // Pull-out control drawer under the table top, with the DIN rail inside.
      const dz = TB.top - TB.thick - 7.2;
      const dr = piece('drawer', g, { sub: 'Drawer tray', detach: V(0, -34, 0), apart: V(0, -28, 0) });
      const dx0 = -24, dx1 = 24, dy0 = -30, dy1 = 10;
      add(dr, at(box(dx1 - dx0, dy1 - dy0, 0.4), T(0, (dy0 + dy1) / 2, dz - 4.8)), 'panel');
      for (const s of [-1, 1]) add(dr, at(box(0.4, dy1 - dy0, 9.6), T(s * ((dx1 - dx0) / 2 - 0.2), (dy0 + dy1) / 2, dz)), 'panel');
      add(dr, at(box(dx1 - dx0, 0.4, 9.6), T(0, dy1 - 0.2, dz)), 'panel');
      const FRONT = { sub: 'Front panel and handles', ex: V(0, -8, 0) };
      add(dr, at(box(dx1 - dx0 + 2, 0.6, 11), T(0, dy0 - 0.3, dz + 0.3)), 'alu', FRONT);
      for (const s of [-1, 1]) {
        add(dr, at(box(0.8, 1.6, 0.8), T(s * 16, dy0 - 1.4, dz + 3.4)), 'alu', FRONT);
        add(dr, at(box(0.8, 1.6, 0.8), T(s * 16, dy0 - 1.4, dz - 2.8)), 'alu', FRONT);
        add(dr, at(box(0.8, 0.8, 7.0), T(s * 16, dy0 - 2.2, dz + 0.3)), 'alu', FRONT);
      }
      const rail = (y) => add(dr, at(box(dx1 - dx0 - 3, 3.5, 0.3), T(0, y, dz - 4.45)), 'steel2', { sub: 'DIN rails', ex: V(0, 0, 3) });
      rail(-20);
      rail(-6);
      // PLC, relays and terminal blocks on the front rail; switch-mode supply and DAQ on the back rail.
      const PLC = { sub: 'PLC safety monitor', ex: V(0, 0, 10) };
      add(dr, at(box(9, 4.2, 6.5), T(-14, -20, dz - 1.0)), 'panel', PLC);
      const plcLeds = [];
      for (let i = 0; i < 6; i++) plcLeds.push(T(-17 + i * 1.2, -22.15, dz + 0.8));
      const led = addInst(dr, box(0.5, 0.1, 0.5), 'led', plcLeds, PLC);
      led.userData.led = true;
      for (let i = 0; i < 4; i++) add(dr, at(box(1.6, 4.0, 5.5), T(-6.5 + i * 2.0, -20, dz - 1.5)), 'black', { sub: '4 relays', ex: V(0, 0, 9) });
      for (let i = 0; i < 12; i++) add(dr, at(box(0.7, 4.4, 4.2), T(2.5 + i * 0.85, -20, dz - 2.1)), i % 3 === 2 ? 'red' : 'grey', { sub: 'Terminal blocks', ex: V(0, 0, 8) });
      const PSU = { sub: 'Switch-mode supply', ex: V(0, 0, 10) };
      add(dr, at(box(16, 9, 4.2), T(-10, -6, dz - 2.2)), 'steel2', PSU);
      for (let i = 0; i < 10; i++) add(dr, at(box(0.25, 9.1, 3.4), T(-17 + i * 1.5, -6, dz - 2.1)), 'slot', PSU);
      add(dr, at(box(10, 6, 2.5), T(10, -6, dz - 3)), 'pcb', { sub: 'DAQ and digital I/O board', ex: V(0, 0, 9) });

      // Rotary vane pump on the shelf, right of the chassis.
      const pp = piece('pump', g, { sub: 'Pump block (oil-sealed vane stage)', apart: V(18, 0, 0) });
      const px = 24.5, py = 0, pz = base;
      const BASE = { sub: 'Base plate and rubber feet', ex: V(0, 0, -4) };
      add(pp, at(box(12.5, 32, 0.8), T(px, py, pz + 0.4)), 'black', BASE);
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) add(pp, at(disc(1.1, 0.8, 16), frame(V(px + sx * 5, py + sy * 13.5, pz + 0.4), Z)), 'ink', BASE);
      const mz = pz + 0.8 + 6.4;
      const MOTOR = { sub: 'Electric motor', ex: V(0, -9, 0) };
      add(pp, at(disc(6.2, 15, 48), frame(V(px, py - 7.5, mz), V(0, 1, 0))), 'pumpgrey', MOTOR);
      for (let i = 0; i < 14; i++) {
        const a = Math.PI * (0.06 + (0.88 * i) / 13);
        add(pp, at(box(0.8, 13.5, 0.3), frame(V(px + 6.5 * Math.cos(a), py - 7.5, mz + 6.5 * Math.sin(a)), V(0, 1, 0), V(Math.cos(a), 0, Math.sin(a)))), 'pumpgrey', MOTOR);
      }
      const FAN = { sub: 'Fan cover', ex: V(0, -16, 0) };
      add(pp, at(disc(6.6, 2.4, 48), frame(V(px, py - 16.2, mz), V(0, 1, 0))), 'white', FAN);
      for (let i = 0; i < 5; i++) add(pp, at(ring(1.0 + i * 1.1, 1.35 + i * 1.1, 0.3, 40), frame(V(px, py - 17.5, mz), V(0, 1, 0))), 'ink', FAN);
      add(pp, at(box(11.5, 14, 13.5), T(px, py + 7.5, pz + 0.8 + 6.75)), 'pumpgrey');
      const SIGHT = { sub: 'Oil sight glass', ex: V(-4, 0, 0) };
      add(pp, at(disc(1.3, 0.5, 24), frame(V(px - 5.95, py + 7.5, pz + 5), V(-1, 0, 0))), 'oil', SIGHT);
      add(pp, at(ring(1.3, 1.8, 0.5, 24), frame(V(px - 5.95, py + 7.5, pz + 5), V(-1, 0, 0))), 'bolt', SIGHT);
      add(pp, at(box(5, 6, 4), T(px, py - 6, mz + 7.2)), 'black', { sub: 'Motor terminal box', ex: V(0, -9, 5) });
      // The inlet is a KF40 joint like the pump port's: the hose's own flange is drawn with the pump.
      const inletZ = pz + 0.8 + 13.5, K = KF[40];
      const INLET = { sub: 'KF40 inlet port', ex: V(0, 0, 4) };
      add(pp, at(ring(K.ti, K.to, 3.4 - K.t, 28), frame(V(px, py + 8, inletZ + (3.4 - K.t) / 2), Z)), 'steel', INLET);
      pumpClamp = kfJoint(K, V(px, py + 8, inletZ + 3.4 + K.g / 2), Z, V(1, 0, 0), { pc: pp, ...INLET }, { pc: pp, sub: 'Hose end flange, KF40', ex: V(0, 0, 9) },
        { pc: pp, sub: 'KF40 centring ring and O-ring', ex: V(0, 0, 6.5) }, { pc: pp, sub: 'KF40 clamp', ex: V(6, 0, 7) }, 32);
      add(pp, at(disc(1.6, 3.0, 24), frame(V(px + 3.6, py + 12, inletZ + 1.5), Z)), 'black', { sub: 'Exhaust oil-mist filter', ex: V(4, 0, 5) });
      pumpInlet = V(px, py + 8, inletZ + 3.4 + K.g + K.t);
    }

    // ---------- On the table: HV supply, E-stop, spectrometer, webcam ----------
    const hvBox = V(14, -38.5, TB.top + 2.8);
    const hvTerm = [];
    let spectroIn, spectroPort;
    {
      const g = group('bench', DROP, 0);
      const hv = piece('hv', g, { sub: 'Supply enclosure', apart: V(0, -4, 6), label: 'HV supply' });
      add(hv, at(box(11, 7, 5.6), T(hvBox.x, hvBox.y, hvBox.z)), 'white');
      const FACE = { sub: 'Display and indicator', ex: V(0, -4, 0) };
      const lcd = add(hv, at(box(5.5, 0.12, 1.8), T(hvBox.x - 1.5, hvBox.y - 3.56, hvBox.z + 1.0)), 'hvlcd', FACE);
      lcd.userData.lcd = true;
      add(hv, at(box(2.2, 0.12, 1.8), T(hvBox.x + 3.2, hvBox.y - 3.56, hvBox.z + 1.0)), 'red', FACE);
      for (const s of [-1, 1]) hvTerm.push(add(hv, at(disc(0.5, 0.8, 16), frame(V(hvBox.x + s * 3.5, hvBox.y + 3.9, TB.top + 0.75), V(0, 1, 0))), 'bolt', { sub: 'HV output terminals', ex: V(0, 4, 0) }));
      for (const s of [-1, 1]) add(hv, at(box(1.4, 1.4, 0.4), T(hvBox.x + s * 6.2, hvBox.y, TB.top + 0.2)), 'white', { sub: 'Mounting feet and bolts', ex: V(s * 3, 0, -3) });
      for (const s of [-1, 1]) add(hv, at(hex(0.9, 0.5), frame(V(hvBox.x + s * 6.2, hvBox.y, TB.top + 0.65), Z)), 'bolt', { sub: 'Mounting feet and bolts', ex: V(s * 3, 0, 1) });

      const es = piece('estop', g, { sub: 'Yellow enclosure', apart: V(0, 0, 8) });
      const ep = V(35, -37, TB.top + 3);
      add(es, at(box(7.5, 7.5, 6), T(ep.x, ep.y, ep.z)), 'yellow');
      add(es, at(disc(1.2, 1.0, 24), frame(V(ep.x, ep.y, ep.z + 3.5), Z)), 'ink', { sub: 'Contact block collar', ex: V(0, 0, 3) });
      add(es, at(revolve([[0, 0], [2.1, 0], [2.1, 0.7], [1.6, 1.4], [0, 1.5]], 40), frame(V(ep.x, ep.y, ep.z + 4.0), Z)), 'red', { sub: 'Mushroom button', ex: V(0, 0, 6) });
      add(es, at(disc(0.7, 1.4, 16), frame(V(ep.x + 4.2, ep.y, ep.z - 1.5), V(1, 0, 0))), 'grey', { sub: 'Cable gland', ex: V(3, 0, 0) });

      const sp = piece('spectro', g, { sub: 'Spectrometer body', apart: V(0, 0, 6), label: 'Spectrometer' });
      const sx = -20, sy = 40, sz = TB.top + 2.6;
      add(sp, at(box(12, 7, 5.2), T(sx, sy, sz)), 'panel');
      add(sp, at(box(12.1, 0.14, 1.2), T(sx, sy - 3.55, sz + 1.4)), 'ink');
      spectroPort = add(sp, at(disc(0.55, 1.0, 16), frame(V(sx + 6.5, sy, sz - 0.6), V(1, 0, 0))), 'bolt', { sub: 'SMA fibre input', ex: V(4, 0, 0) });
      add(sp, at(box(2.2, 0.1, 0.6), T(sx - 3, sy - 3.55, sz - 0.9)), 'led');
      for (const s of [-1, 1]) for (const t of [-1, 1]) add(sp, at(disc(0.25, 0.1, 10), frame(V(sx + s * 5.4, sy + t * 2.9, sz + 2.62), Z)), 'ink', { sub: 'Lid screws', ex: V(0, 0, 3) });
      spectroIn = V(sx + 7.0, sy, sz - 0.6);

      // Webcam on an optical post in front of the left viewport, looking in along +x.
      const cam = piece('camera', g, { sub: 'Post holder and base', apart: V(-10, 0, 4) });
      const cx = -43, cz = 0;
      add(cam, at(disc(1.6, 0.6, 24), frame(V(cx, 0, TB.top + 0.3), Z)), 'black');
      add(cam, at(rod(1.0, 7, 20), frame(V(cx, 0, TB.top + 4.1), Z)), 'black');
      add(cam, at(rod(0.6, cz - 3.5 - (TB.top + 7.6), 16), frame(V(cx, 0, (cz - 3.5 + TB.top + 7.6) / 2), Z)), 'steel2', { sub: 'Optical post', ex: V(0, 0, 5) });
      add(cam, at(box(2.4, 2.4, 1.6), T(cx, 0, cz - 2.7)), 'black', { sub: 'Mounting clamp', ex: V(0, 0, 8) });
      const BODY = { sub: 'Webcam body and lens', ex: V(0, 0, 11) };
      add(cam, at(box(3.2, 7.4, 3.0), T(cx, 0, cz)), 'black', BODY);
      add(cam, at(disc(1.25, 1.4, 28), frame(V(cx + 2.2, 0, cz), V(1, 0, 0))), 'black', BODY);
      add(cam, at(disc(0.85, 0.12, 28), frame(V(cx + 2.95, 0, cz), V(1, 0, 0))), 'glass', BODY);
      add(cam, at(disc(0.2, 0.1, 10), frame(V(cx + 1.65, 2.6, cz + 0.9), V(1, 0, 0))), 'led', BODY);
    }

    // ---------- Lines that span two pieces, rebuilt as the machine comes apart ----------
    // `ends` are the two meshes the line plugs into; the line follows them, wherever they go.
    function stretchLine(part, points, r, tone, o, ends, label) {
      const holder = piece(part, rootGroup, { label, sub: label });
      const mesh = add(holder, tube(points, r, o), tone);
      stretch.push({ mesh, holder, points: points.map((p) => p.clone()), r, o, ends });
      return mesh;
    }

    const hf = pumpLineFrom;
    stretchLine('hose', [
      V(hf, 0, 0), V(hf + 3, 0, -0.4), V(hf + 6.5, 0, -3.5), V(hf + 8.2, 0, -12), V(hf + 8.2, -1, -38),
      V(hf + 6, -2, -60), V(38, 4, -66), pumpInlet.clone().add(V(4, 0, 6)), pumpInlet.clone().add(V(0, 0, 1.6)), pumpInlet.clone(),
    ], 2.0, 'steel', { seg: 420, radial: 14, corrugate: 0.24, pitch: 1.15 }, [pumpPortEnd, pumpClamp], 'Bellows hose');

    const gasTo = V(13, 43.6, TB.top + 0.9);
    let gasFitting;
    {
      const gb = piece('needle', tableG, { label: 'Gas inlet fitting', sub: 'Gas inlet fitting', apart: V(0, 0, 5) });
      gasFitting = add(gb, at(box(2.4, 2.4, 1.8), T(gasTo.x, gasTo.y + 1.2, TB.top + 0.9)), 'brass');
      add(gb, at(hexNut(1.4, 0.8, 0.3), frame(V(gasTo.x, gasTo.y + 2.8, TB.top + 0.9), V(0, 1, 0))), 'brass');
    }
    stretchLine('needle', [gasFrom, gasFrom.clone().add(V(1.4, 0.4, 1.4)), V(14, 30, 21.5), V(13.5, 37, 20.8), V(13, 40.6, 15), V(13, 41.2, 0), V(13, 41.4, -16), V(13, 42.4, TB.top + 1.6), gasTo], 0.26, 'brass', { seg: 70, radial: 8 }, [needleOut, gasFitting], 'Gas line');

    const gc = gaugeCableFrom;
    const gaugeTo = V(20, 37.6, TB.top + 2.0);
    let gaugeClamp;
    {
      const cc = piece('gauge', tableG, { label: 'Gauge cable clamp', sub: 'Cable clamp', apart: V(0, 0, 5) });
      gaugeClamp = add(cc, at(box(2.6, 2.6, 2.0), T(gaugeTo.x, gaugeTo.y, TB.top + 1.0)), 'black');
    }
    stretchLine('gauge', [gc, gc.clone().add(V(0.8, 0, 0)), V(10, 26, 33), V(16, 32, 25), V(19.5, 36.5, 19), V(20, 37.6, 6), V(20, 37.6, -14), gaugeTo], 0.28, 'black', { seg: 70, radial: 8 }, [gaugePlug, gaugeClamp], 'Gauge cable');

    hvEnds.forEach((e, i) => {
      const f = e.from;
      const z0 = TB.top + 0.45;
      const ty = hvBox.y + 4.3, tz = TB.top + 0.75;
      const pts = e.deg === 270
        ? [f, f.clone().add(V(0, 0, -1.2)), V(f.x + 0.6, f.y - 0.8, z0 + 0.4), V(3, -27, z0), V(7, -30.5, z0), V(hvBox.x - 3.5, ty + 1.8, z0 + 0.1), V(hvBox.x - 3.5, ty, tz)]
        : [f, f.clone().add(V(0, 0, -1.2)), V(f.x + 0.6, f.y - 0.8, z0 + 0.4), V(-14, -10, z0), V(-4, -17, z0), V(6, -20, z0), V(14, -26, z0), V(hvBox.x + 3.5, ty + 1.8, z0 + 0.1), V(hvBox.x + 3.5, ty, tz)];
      stretchLine('hv', pts, 0.36, 'pink', { seg: 70, radial: 10 }, [e.cap, hvTerm[e.deg === 270 ? 0 : 1]], e.deg === 270 ? 'HV lead A' : 'HV lead B');
    });

    // Spectrometer fibre: an SMA adaptor on the back viewport, a yellow jacketed fibre down to the spectrometer.
    let fibrePlug;
    {
      const fa = piece('spectro', qB, { clip: true, apart: along(radial(90), 22), label: 'Fibre adaptor', sub: 'Adaptor bracket' });
      add(fa, at(box(9.0, 0.5, 1.6), rtz(pol(latFace + D.gap + L.t + 0.25, 90, 0), 90)), 'alu');
      fibrePlug = add(fa, at(disc(0.6, 1.4, 20), frame(pol(latFace + D.gap + L.t + 1.0, 90, 0), radial(90))), 'bolt', { sub: 'SMA connector', ex: along(radial(90), 3) });
    }
    const ff = pol(latFace + D.gap + L.t + 1.7, 90, 0);
    stretchLine('spectro', [ff, ff.clone().add(V(0, 1.2, -0.5)), V(-0.8, 43.4, -6), V(-2, 43.8, -15), V(-4, 43.6, TB.top + 0.8), V(-8, 42, TB.top + 0.75), V(-11.4, 40.2, TB.top + 1.4), V(spectroIn.x + 0.6, spectroIn.y, spectroIn.z), spectroIn.clone()], 0.26, 'yellow', { seg: 70, radial: 8 }, [fibrePlug, spectroPort], 'Optical fibre');

    // Openings in the elbow walls behind each port, so a window looks into the vessel.
    // Each is a cylinder segment in the shell's own (rest) coordinates: base point, axis, radius, length.
    const holes = [];
    for (let k = 0; k < 4; k++) holes.push({ p: pol(D.R0, 90 * k), a: radial(90 * k), r: L.tube / 2 - L.wall, len: D.aOut + 1.2 });
    for (const [deg, up] of [[270, 1], [270, -1], [180, 1], [180, -1]]) holes.push({ p: pol(D.R0, deg), a: V(0, 0, up), r: S.tube / 2 - S.wall, len: D.aOut + 1.2 });
    holes.push({ p: pol(D.R0, 90), a: V(0, 0, 1), r: G.tube / 2 - G.wall, len: D.aOut + 1.2 });

    // Points the home view frames: the machine and the table top.
    const fit = [];
    for (const [x, y] of [[1, 1], [-1, -1], [1, -1], [-1, 1]]) {
      fit.push(V(x * TB.half, y * TB.half, TB.top - TB.thick), V(x * 38, y * 38, 21));
    }
    fit.push(pol(D.R0, 90, 40));

    return { root: rootGroup, groups, stretch, instances, fit, holes, dims: D, detach: DETACH, tube, frames: { pol, radial, toroidal } };
  }

  root.SPM1Device = { build, dims: D, detach: DETACH };
})(typeof window !== 'undefined' ? window : globalThis);
