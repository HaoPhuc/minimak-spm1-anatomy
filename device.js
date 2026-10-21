// Geometry of the MinimaK SPM1, in centimetres, z up, vessel midplane at z = 0, torus axis at the origin.
// The front of the table is -y. Lateral ports sit at 0°, 90°, 180°, 270°; the four joints sit on the diagonals,
// where the corner posts clamp them (as in the photos on slides 9, 15 and 16 of the Oct 2025 webinar).
// Classic script: window.SPM1Device.build(THREE, paint) returns the assembled scene graph.
// `paint(geometry, tone, { part, clip })` and `paint.instanced(geometry, tone, matrices, opts)` come from the page,
// which owns the materials; this file only knows shapes, tones, part ids and how each piece comes apart.
(function (root) {
  const DEG = Math.PI / 180;

  // ConFlat sizes: OD, bolt circle, bolt count, thickness, tube OD (CF standard; see parts.js, source S5).
  const CF = {
    160: { od: 20.32, bc: 18.11, n: 20, t: 2.24, tube: 15.24, af: 1.2, br: 0.4 },
    100: { od: 15.24, bc: 13.03, n: 16, t: 1.98, tube: 10.16, af: 1.2, br: 0.4 },
    63: { od: 11.43, bc: 9.22, n: 8, t: 1.75, tube: 6.35, af: 1.2, br: 0.4 },
    40: { od: 6.99, bc: 5.87, n: 6, t: 1.27, tube: 3.81, af: 1.0, br: 0.32 },
  };

  const D = {
    R0: 23,
    aOut: 7.5,
    aIn: 7.3,
    gap: 0.2,
    table: { top: -22, thick: 11, half: 45, floor: -107, leg: 9, legAt: 36, shelf: -91 },
    lat: { flangeAt: 35.5 },
    small: { flangeAt: 11.5 },
    gport: { flangeAt: 11 },
    tf: { halfW: 3.6, rIn: 7.6, rOut: 10.0, tabR: 10.75, tabs: 26 },
    former: { r: 10.4, t: 0.4, top: 9.5 },
    pfIn: { z: 6.2, h: 2.6, rOut: 11.4 },
    sol: { h: 6, rOut: 11.0 },
    pfOut: { R: 31.5, z: 12.8 },
    satTop: { R: 35, z: 16.5, r: 1.6 },
    satBot: { R: 33.5, z: -18.6, r: 1.6 },
    post: { R: 40.2, half: 2.25, top: 19 },
    cut: [287, 352],
    CF,
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

    // An explode group: everything in it moves together by `offset` when the machine is taken apart.
    function group(name, offset, delay, parent = rootGroup) {
      const g = new THREE.Group();
      g.name = name;
      parent.add(g);
      groups.push({ obj: g, offset, delay });
      return g;
    }

    // One physical piece of a part (one of the 8 TF coils, one viewport...). It moves on its own when inspected.
    function piece(part, parent, o = {}) {
      const g = new THREE.Group();
      g.userData.part = part;
      g.userData.label = o.label || null;
      g.userData.detach = o.detach || null;
      g.userData.clip = !!o.clip;
      parent.add(g);
      instances.push(g);
      return g;
    }

    function add(pc, geometry, tone, o = {}) {
      const m = paint(geometry, tone, { part: pc.userData.part, clip: o.clip ?? pc.userData.clip });
      pc.add(m);
      return m;
    }

    function addInst(pc, geometry, tone, matrices, o = {}) {
      const m = paint.instanced(geometry, tone, matrices, { part: pc.userData.part, clip: o.clip ?? pc.userData.clip });
      pc.add(m);
      return m;
    }

    // Bolt with its head at local y = 0..h and the shank running down -y for `len`.
    function boltGeom(len, af = 1.2, r = 0.4) {
      const h = af * 0.48;
      return merge([at(hex(af, h), T(0, h / 2, 0)), at(rod(r, len), T(0, -len / 2, 0))]);
    }
    const nutGeom = (af = 1.2) => at(hex(af, af * 0.55), T(0, af * 0.275, 0));

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

    // A CF flange pair's bolts: heads on the outer face, nuts on the back face of the welded flange.
    function cfBolts(pc, cf, face, back, axis, u, v, o = {}) {
      const len = cf.t * 2 + D.gap + 0.7;
      addInst(pc, boltGeom(len, cf.af, cf.br), 'bolt', circleMatrices(face, axis, u, v, cf.bc / 2, cf.n, o.phase ?? 0.5), o);
      addInst(pc, nutGeom(cf.af), 'bolt', circleMatrices(back, axis.clone().negate(), u, v, cf.bc / 2, cf.n, o.phase ?? 0.5), o);
    }

    // A thin weld bead where a tube meets a flange.
    const bead = (r, at0, axis) => at(revolve([[r, -0.14], [r + 0.16, -0.05], [r + 0.16, 0.05], [r, 0.14]], 48), frame(at0, axis));

    const J = CF[160], L = CF[100], S = CF[40], G = CF[63];
    const TB = D.table;
    const quarters = [];

    // ---------- Vessel quarters: elbow, joint flanges, lateral port, TF coils ----------
    for (let k = 0; k < 4; k++) {
      const pk = 90 * k;
      const q = group(`quarter${k}`, radial(pk).multiplyScalar(11), 0.3 + k * 0.05);
      quarters.push(q);
      const p0 = pk - 45, p1 = pk + 45;
      const inset = (D.gap / 2 + J.t * 0.5) / D.R0;

      const shell = piece('vessel', q, { clip: true, label: ['Right quarter', 'Back quarter', 'Left quarter', 'Front quarter'][k] });
      add(shell, torusShell(D.R0, D.aIn, D.aOut, p0 * DEG + inset, p1 * DEG - inset), 'steel');

      // Joint flanges: B at the start of the quarter (nuts), A at the end (bolt heads).
      for (const [pj, side] of [[p0, 1], [p1, -1]]) {
        const tdir = toroidal(pj).multiplyScalar(side);
        const fl = piece('joints', q, { clip: true, detach: tdir.clone().multiplyScalar(3.2).add(radial(pj).multiplyScalar(2)) });
        const centre = pol(D.R0, pj).add(tdir.clone().multiplyScalar(D.gap / 2 + J.t / 2));
        add(fl, at(flangeRing(D.aIn, J.od / 2, J.t, 80), frame(centre, tdir)), 'steel2');
        add(fl, bead(D.aOut, pol(D.R0, pj).add(tdir.clone().multiplyScalar(D.gap / 2 + J.t + 0.14)), tdir), 'steel2');
        const face = pol(D.R0, pj).add(tdir.clone().multiplyScalar(D.gap / 2 + J.t));
        const mats = circleMatrices(face, tdir, radial(pj), Z, J.bc / 2, J.n);
        if (side < 0) addInst(fl, boltGeom(J.t * 2 + D.gap + 0.9), 'bolt', mats);
        else addInst(fl, nutGeom(), 'bolt', mats);
      }

      // Lateral DN100CF port neck and its welded flange.
      const lat = piece('lateral', q, { clip: true, label: ['Right (pump)', 'Back', 'Left', 'Front'][k] + ' port' });
      const rdir = radial(pk);
      const nR = L.tube / 2;
      add(lat, saddleNeck(pol(D.R0, pk), rdir, nR - 0.2, nR, D.lat.flangeAt - D.R0, lateralStart(pk)), 'steel');
      add(lat, at(flangeRing(nR - 0.2, L.od / 2, L.t), frame(pol(D.lat.flangeAt + L.t / 2, pk), rdir)), 'steel2');
      add(lat, bead(nR, pol(D.lat.flangeAt - 0.14, pk), rdir.clone().negate()), 'steel2');

      // Two TF coils per quarter, either side of the lateral port.
      for (const [j, pc] of [[0, pk - 22.5], [1, pk + 22.5]]) {
        const coil = piece('tf', q, { clip: true, label: `TF coil ${2 * k + j + 1}` });
        const tf = D.tf, hw = tf.halfW / D.R0, c = pc * DEG;
        add(coil, torusShell(D.R0, tf.rIn, tf.rOut, c - hw, c + hw, { nT: 72 }), 'cable');
        add(coil, torusShell(D.R0, tf.rOut, tf.rOut + 0.12, c - hw + 0.004, c + hw - 0.004, { nT: 72 }), 'copper');
        add(coil, torusShell(D.R0, D.aOut, D.aOut + 0.1, c - hw - 0.012, c + hw + 0.012, { nT: 72 }), 'copper');
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
            const axis = u.clone().add(tq.clone().multiplyScalar(s * splay)).normalize();
            const centre = C.clone().add(u.clone().multiplyScalar(rm)).add(tq.clone().multiplyScalar(s * (0.06 + (rm - r0) * splay)));
            const width = ((2 * Math.PI * rm) / tf.tabs) * 0.74;
            tabs.push(at(box(width, len, 0.08), frame(centre, axis, w)));
          }
        }
        add(coil, merge(tabs), 'copper');
        // Terminal block under the coil, with the two lead studs.
        const blockAt = pol(D.R0, pc, -(tf.rOut + 0.75));
        add(coil, at(box(1.6, tf.halfW * 1.4, 1.2), rtz(blockAt, pc)), 'black');
        for (const s of [-1, 1]) add(coil, at(rod(0.26, 0.7), frame(blockAt.clone().add(toroidal(pc).multiplyScalar(s * 1.2)).add(V(0, 0, -0.85)), Z)), 'bolt');
      }
    }
    const [qR, qB, qL, qF] = quarters;

    // Copper gaskets between the joint flanges, halfway between the two quarters when taken apart.
    for (let k = 0; k < 4; k++) {
      const pj = 45 + 90 * k;
      const off = radial(90 * k).multiplyScalar(11).add(radial(90 * ((k + 1) % 4)).multiplyScalar(11)).multiplyScalar(0.5);
      const g = group(`gasket${k}`, off, 0.32 + k * 0.05);
      const gk = piece('gaskets', g, { clip: true, detach: radial(pj).multiplyScalar(0) });
      add(gk, at(ring(D.aOut, 8.57, D.gap * 0.9, 80), frame(pol(D.R0, pj), toroidal(pj))), 'copper');
    }

    // ---------- Lateral port fittings ----------
    const latFace = D.lat.flangeAt + L.t;
    function windowFlange(pc, deg, glassR) {
      const rdir = radial(deg);
      add(pc, at(ring(L.tube / 2, 6.2, D.gap * 0.9, 48), frame(pol(latFace + D.gap / 2, deg), rdir)), 'copper');
      add(pc, at(flangeRing(glassR + 0.4, L.od / 2, L.t), frame(pol(latFace + D.gap + L.t / 2, deg), rdir)), 'steel2');
      const glass = add(pc, at(disc(glassR + 0.4, 0.6, 48), frame(pol(latFace + D.gap + 0.5, deg), rdir)), 'glass');
      glass.userData.window = true;
      cfBolts(pc, L, pol(latFace + D.gap + L.t, deg), pol(D.lat.flangeAt, deg), rdir, Z, toroidal(deg));
    }
    const vpB = piece('viewport', qB, { clip: true, label: 'Back viewport (spectrometer)' });
    windowFlange(vpB, 90, 4.2);
    const vpL = piece('viewport', qL, { clip: true, label: 'Left viewport (webcam)' });
    windowFlange(vpL, 180, 4.2);
    const vpF = piece('viewport', qF, { clip: true, label: 'Front viewport (eyes)' });
    windowFlange(vpF, 270, 4.2);

    // Right port: zero-length reducer to a KF40 stub for the bellows line.
    let pumpLineFrom;
    {
      const pc = piece('pumpPort', qR, { clip: true });
      const rdir = radial(0);
      add(pc, at(ring(L.tube / 2, 6.2, D.gap * 0.9, 48), frame(pol(latFace + D.gap / 2, 0), rdir)), 'copper');
      add(pc, at(flangeRing(2.05, L.od / 2, L.t), frame(pol(latFace + D.gap + L.t / 2, 0), rdir)), 'steel2');
      cfBolts(pc, L, pol(latFace + D.gap + L.t, 0), pol(D.lat.flangeAt, 0), rdir, Z, toroidal(0));
      const from = latFace + D.gap + L.t, to = from + 3.2;
      add(pc, at(ring(1.85, 2.05, to - from, 32), frame(pol((from + to) / 2, 0), rdir)), 'steel');
      add(pc, at(flangeRing(1.85, 3.25, 0.6, 40), frame(pol(to - 0.3, 0), rdir)), 'steel2');
      add(pc, at(revolve([[2.1, -0.75], [3.6, -0.55], [3.6, 0.55], [2.1, 0.75]], 40), frame(pol(to, 0), rdir)), 'alu');
      add(pc, at(rod(0.3, 3.4), frame(pol(to, 0, 3.85), toroidal(0))), 'bolt');
      add(pc, at(box(0.9, 0.5, 2.6), frame(pol(to, 0, 3.85).add(toroidal(0).multiplyScalar(1.6)), toroidal(0), rdir)), 'alu');
      pumpLineFrom = to + 0.6;
    }

    // ---------- Small DN40CF ports on the top and bottom of the front and left quarters ----------
    function smallPort(q, deg, up, label) {
      const pc = piece('diagPorts', q, { clip: true, label });
      const dir = up ? Z.clone() : Z.clone().negate();
      const zs = up ? 1 : -1;
      const nr = S.tube / 2;
      add(pc, saddleNeck(pol(D.R0, deg, 0), dir, nr - 0.15, nr, D.small.flangeAt, verticalStart(deg), 36), 'steel');
      add(pc, at(flangeRing(nr - 0.15, S.od / 2, S.t, 40), frame(pol(D.R0, deg, zs * (D.small.flangeAt + S.t / 2)), dir)), 'steel2');
      add(pc, bead(nr, pol(D.R0, deg, zs * (D.small.flangeAt - 0.14)), dir.clone().negate()), 'steel2');
      const face = D.small.flangeAt + S.t;
      const mate = zs * (face + D.gap);
      return {
        pc, dir, zs, face, mate,
        // The mating flange's bolts and nuts belong to whatever is mounted on the port.
        bolts: (owner) => cfBolts(owner, S, pol(D.R0, deg, zs * (face + D.gap + S.t)), pol(D.R0, deg, zs * D.small.flangeAt), dir, radial(deg), toroidal(deg)),
        gasket: (owner) => add(owner, at(ring(nr, 2.4, D.gap * 0.9, 32), frame(pol(D.R0, deg, zs * (face + D.gap / 2)), dir)), 'copper'),
      };
    }

    // Front top: laser diagnostics window.
    {
      const sp = smallPort(qF, 270, true, 'Front top port');
      const pc = piece('laser', qF, { clip: true });
      sp.gasket(pc);
      add(pc, at(flangeRing(1.6, S.od / 2, S.t, 40), frame(pol(D.R0, 270, sp.mate + S.t / 2), Z)), 'steel2');
      const w = add(pc, at(disc(1.6, 0.45, 32), frame(pol(D.R0, 270, sp.mate + 0.4), Z)), 'glass');
      w.userData.window = true;
      sp.bolts(pc);
    }

    // Bottom ports: the two discharge electrodes. The anode rod stands up into the vessel.
    const hvEnds = [];
    for (const [q, deg, name] of [[qF, 270, 'Electrode A (front)'], [qL, 180, 'Electrode B (left)']]) {
      const sp = smallPort(q, deg, false, `${deg === 270 ? 'Front' : 'Left'} bottom port`);
      const pc = piece('electrode', q, { clip: true, label: name });
      sp.gasket(pc);
      const zf = sp.mate - S.t / 2;
      add(pc, at(flangeRing(0.55, S.od / 2, S.t, 40), frame(pol(D.R0, deg, zf), Z)), 'steel2');
      sp.bolts(pc);
      const insFrom = -(sp.face + D.gap + S.t);
      const prof = [[0.55, 0]];
      for (let i = 0; i < 4; i++) prof.push([1.25, i + 0.15], [1.25, i + 0.35], [0.9, i + 0.5], [0.9, i + 1.0]);
      prof.push([0.55, 4.0], [0.55, 0]);
      add(pc, at(revolve(prof, 32), frame(pol(D.R0, deg, insFrom), Z.clone().negate())), 'ceramic');
      const capAt = pol(D.R0, deg, insFrom - 4.6);
      add(pc, at(disc(0.75, 1.2, 24), frame(capAt, Z)), 'bolt');
      add(pc, at(rod(0.22, sp.face - (D.aIn - 2.6), 12), frame(pol(D.R0, deg, -(sp.face + D.aIn - 2.6) / 2), Z)), 'bolt');
      add(pc, at(disc(0.9, 0.35, 28), frame(pol(D.R0, deg, -(D.aIn - 2.6)), Z)), 'steel2');
      hvEnds.push({ from: capAt.clone().add(V(0, 0, -0.6)), deg });
    }

    // Left top: Langmuir probe on a bellows linear feedthrough.
    {
      const sp = smallPort(qL, 180, true, 'Left top port');
      const pc = piece('probe', qL, { clip: true });
      sp.gasket(pc);
      const base = sp.mate + S.t;
      add(pc, at(flangeRing(0.5, S.od / 2, S.t, 40), frame(pol(D.R0, 180, sp.mate + S.t / 2), Z)), 'steel2');
      sp.bolts(pc);
      const top = base + 6;
      const prof = [[0.6, base]];
      const folds = 12;
      for (let i = 0; i <= folds * 2; i++) prof.push([i % 2 ? 1.55 : 1.15, base + ((top - base) * i) / (folds * 2)]);
      prof.push([0.6, top], [0.6, base]);
      add(pc, at(revolve(prof, 36), frame(pol(D.R0, 180, 0), Z)), 'steel');
      add(pc, at(box(4.4, 4.4, 0.8), rtz(pol(D.R0, 180, top + 0.4), 180)), 'alu');
      for (const s of [-1, 1]) add(pc, at(rod(0.3, 6.8), frame(pol(D.R0, 180, base + 3.4).add(toroidal(180).multiplyScalar(s * 2.0)), Z)), 'bolt');
      add(pc, at(disc(0.9, 3.0, 24), frame(pol(D.R0, 180, top + 2.3), Z)), 'steel2');
      add(pc, at(disc(1.15, 1.6, 24), frame(pol(D.R0, 180, top + 4.6), Z)), 'black');
      for (let i = 0; i < 5; i++) add(pc, at(ring(0.92, 0.97, 0.06, 24), frame(pol(D.R0, 180, top + 1.2 + i * 0.45), Z)), 'ink');
      add(pc, at(rod(0.15, base - 1.5 + 0.5), frame(pol(D.R0, 180, (base + 1.5) / 2 - 0.25), Z)), 'bolt');
      add(pc, at(rod(0.32, D.aIn - 1.4, 12), frame(pol(D.R0, 180, 1.5 + (D.aIn - 1.4) / 2), Z)), 'ceramic');
      const tip = add(pc, at(rod(0.09, 1.2, 8), frame(pol(D.R0, 180, 0.9), Z)), 'tip');
      tip.userData.tip = true;
    }

    // Back top: the larger gauge port (DN63CF) with the gauge and gas-inlet stack.
    let gaugeCableFrom, gasFrom;
    {
      const deg = 90;
      const port = piece('diagPorts', qB, { clip: true, label: 'Back top gauge port (DN63)' });
      const nr = G.tube / 2;
      add(port, saddleNeck(pol(D.R0, deg, 0), Z, nr - 0.15, nr, D.gport.flangeAt, verticalStart(deg), 40), 'steel');
      add(port, at(flangeRing(nr - 0.15, G.od / 2, G.t, 56), frame(pol(D.R0, deg, D.gport.flangeAt + G.t / 2), Z)), 'steel2');
      add(port, bead(nr, pol(D.R0, deg, D.gport.flangeAt - 0.14), Z.clone().negate()), 'steel2');
      const face = D.gport.flangeAt + G.t;

      const st = piece('stack', qB, { clip: true });
      add(st, at(ring(nr, 3.8, D.gap * 0.9, 40), frame(pol(D.R0, deg, face + D.gap / 2), Z)), 'copper');
      const rz = face + D.gap;
      add(st, at(flangeRing(1.75, G.od / 2, G.t, 56), frame(pol(D.R0, deg, rz + G.t / 2), Z)), 'bronze');
      cfBolts(st, G, pol(D.R0, deg, rz + G.t), pol(D.R0, deg, D.gport.flangeAt), Z, radial(deg), toroidal(deg));
      // DN40 four-way cross: vertical body, two side arms along the ring.
      const c0 = rz + G.t, c1 = c0 + 8, cm = (c0 + c1) / 2;
      const cr = S.tube / 2;
      add(st, at(ring(cr - 0.15, cr, c1 - c0 - 2 * S.t, 32), frame(pol(D.R0, deg, cm), Z)), 'steel');
      add(st, at(flangeRing(cr - 0.15, S.od / 2, S.t, 40), frame(pol(D.R0, deg, c0 + S.t / 2), Z)), 'steel2');
      addInst(st, boltGeom(S.t + 0.8, S.af, S.br), 'bolt', circleMatrices(pol(D.R0, deg, c0 + S.t), Z, radial(deg), toroidal(deg), S.bc / 2, S.n));
      add(st, at(flangeRing(cr - 0.15, S.od / 2, S.t, 40), frame(pol(D.R0, deg, c1 - S.t / 2), Z)), 'steel2');
      const tq = toroidal(deg);
      for (const s of [-1, 1]) {
        const ax = tq.clone().multiplyScalar(s);
        const centre = pol(D.R0, deg, cm);
        add(st, at(ring(cr - 0.15, cr, 4 - S.t, 32), frame(centre.clone().add(ax.clone().multiplyScalar(cr + (4 - S.t) / 2 - 0.2)), ax)), 'steel');
        add(st, at(flangeRing(cr - 0.15, S.od / 2, S.t, 40), frame(centre.clone().add(ax.clone().multiplyScalar(cr + 4 - S.t / 2 - 0.2)), ax)), 'steel2');
        if (s > 0) {
          // Blank on the +toroidal arm.
          add(st, at(disc(S.od / 2, S.t, 40), frame(centre.clone().add(ax.clone().multiplyScalar(cr + 4 + S.t / 2 - 0.2 + D.gap)), ax)), 'steel2');
          addInst(st, boltGeom(S.t * 2 + D.gap + 0.6, S.af, S.br), 'bolt', circleMatrices(centre.clone().add(ax.clone().multiplyScalar(cr + 4 + S.t - 0.2 + D.gap)), ax, Z, radial(deg), S.bc / 2, S.n));
        }
      }
      // Top: DN40 to KF16 adaptor flange with a short KF16 stub.
      add(st, at(flangeRing(0.8, S.od / 2, S.t, 40), frame(pol(D.R0, deg, c1 + D.gap + S.t / 2), Z)), 'steel2');
      addInst(st, boltGeom(S.t * 2 + D.gap + 0.6, S.af, S.br), 'bolt', circleMatrices(pol(D.R0, deg, c1 + D.gap + S.t), Z, radial(deg), toroidal(deg), S.bc / 2, S.n));
      const kfFrom = c1 + D.gap + S.t;

      const gg = piece('gauge', qB, { clip: true });
      const kfTo = kfFrom + 9;
      add(gg, at(ring(0.75, 0.95, kfTo - kfFrom, 24), frame(pol(D.R0, deg, (kfFrom + kfTo) / 2), Z)), 'steel');
      add(gg, at(flangeRing(0.75, 1.5, 0.45, 32), frame(pol(D.R0, deg, kfFrom + 3), Z)), 'steel2');
      add(gg, at(revolve([[1.0, -0.5], [1.8, -0.35], [1.8, 0.35], [1.0, 0.5]], 32), frame(pol(D.R0, deg, kfFrom + 3), Z)), 'alu');
      add(gg, at(hex(1.7, 1.0), frame(pol(D.R0, deg, kfTo - 0.5), Z)), 'steel2');
      const head = pol(D.R0, deg, kfTo + 2.6);
      add(gg, at(box(3.2, 8.4, 5.0), rtz(head, deg)), 'gaugeblue');
      // Display window and two buttons on the face toward the centre of the ring.
      const lcd = add(gg, at(box(0.12, 4.2, 1.5), rtz(head.clone().add(radial(deg).multiplyScalar(-1.62)).add(V(0, 0, 0.8)), deg)), 'lcd');
      lcd.userData.lcd = true;
      for (const s of [-1, 1]) add(gg, at(disc(0.25, 0.14, 12), frame(head.clone().add(radial(deg).multiplyScalar(-1.65)).add(tq.clone().multiplyScalar(s * 0.9)).add(V(0, 0, -1.1)), radial(deg).negate())), 'ink');
      add(gg, at(disc(0.5, 1.2, 16), frame(head.clone().add(tq.clone().multiplyScalar(-4.8)), tq)), 'bolt');
      gaugeCableFrom = head.clone().add(tq.clone().multiplyScalar(-5.4));

      // Needle valve on the -toroidal arm, with its gas line down to the table.
      const nv = piece('needle', qB, { clip: true });
      const ax = tq.clone().negate();
      const armEnd = pol(D.R0, deg, cm).add(ax.clone().multiplyScalar(cr + 4 - 0.2 + D.gap));
      add(nv, at(flangeRing(0.4, S.od / 2, S.t, 40), frame(armEnd.clone().add(ax.clone().multiplyScalar(S.t / 2)), ax)), 'steel2');
      addInst(nv, boltGeom(S.t * 2 + D.gap + 0.6, S.af, S.br), 'bolt', circleMatrices(armEnd.clone().add(ax.clone().multiplyScalar(S.t)), ax, Z, radial(deg), S.bc / 2, S.n));
      const vb = armEnd.clone().add(ax.clone().multiplyScalar(S.t + 1.2));
      add(nv, at(box(2.4, 2.6, 2.4), frame(vb, ax, Z)), 'brass');
      add(nv, at(rod(0.35, 1.8), frame(vb.clone().add(V(0, 0, 2.1)), Z)), 'bolt');
      add(nv, at(disc(1.05, 1.3, 24), frame(vb.clone().add(V(0, 0, 3.6)), Z)), 'black');
      const ridges = [];
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const o = radial(0).multiplyScalar(1.07 * Math.cos(a)).add(V(0, 1.07 * Math.sin(a), 0));
        ridges.push(at(box(0.14, 1.2, 0.14), frame(vb.clone().add(V(0, 0, 3.6)).add(o), Z, o)));
      }
      add(nv, merge(ridges), 'black');
      add(nv, at(rod(0.4, 1.0), frame(vb.clone().add(ax.clone().multiplyScalar(1.7)), ax)), 'brass');
      add(nv, at(hex(1.1, 0.7), frame(vb.clone().add(ax.clone().multiplyScalar(2.3)), ax)), 'brass');
      gasFrom = vb.clone().add(ax.clone().multiplyScalar(2.7));
    }

    // ---------- Central former with PF1, PF2 and the solenoid ----------
    {
      const g = group('centre', V(0, 0, 0), 0);
      const F = D.former, top = TB.top;
      const fm = piece('former', g);
      const h = F.top - top;
      add(fm, at(ring(F.r - F.t, F.r, h - 0.45, 72), frame(V(0, 0, top + (h - 0.45) / 2), Z)), 'white');
      add(fm, at(flangeRing(F.r - F.t - 0.2, F.r + 0.25, 0.5, 72), frame(V(0, 0, F.top - 0.2), Z)), 'white');
      add(fm, at(flangeRing(F.r - F.t, F.r + 2.2, 0.6, 72), frame(V(0, 0, top + 0.3), Z)), 'alu');
      addInst(fm, hex(0.9, 0.5), 'bolt', circleMatrices(V(0, 0, top + 0.6 + 0.25), Z, V(1, 0, 0), V(0, 1, 0), F.r + 1.2, 8), {});
      const screws = [];
      for (let i = 0; i < 8; i++) {
        const a = ((i + 0.5) / 8) * 360;
        screws.push(frame(pol(F.r + 0.05, a, F.top - 1.1), radial(a), Z));
      }
      addInst(fm, disc(0.3, 0.12, 12), 'black', screws);
      // Leads from the coils run up inside the former and out over its rim.
      for (const a of [130, 150]) {
        add(fm, tube([pol(F.r - F.t - 0.3, a, top + 0.5), pol(F.r - F.t - 0.5, a, 0), pol(F.r - F.t - 0.6, a - 4, F.top - 2), pol(F.r - F.t - 0.25, a - 6, F.top - 0.5)], 0.22, { seg: 24, radial: 8 }), 'cable');
      }

      for (const up of [true, false]) {
        const zs = up ? 1 : -1;
        const pg = group(up ? 'pf1' : 'pf2', V(0, 0, zs * 7), 0.18);
        const pc = piece('pfInner', pg, { label: up ? 'PF1 (upper)' : 'PF2 (lower)' });
        const zc = zs * D.pfIn.z;
        add(pc, at(ring(F.r, D.pfIn.rOut, D.pfIn.h, 96), frame(V(0, 0, zc), Z)), 'copper');
        for (const dz of [-0.55, 0.55]) add(pc, at(ring(D.pfIn.rOut - 0.02, D.pfIn.rOut + 0.06, 0.12, 96), frame(V(0, 0, zc + dz), Z)), 'tapeline');
        for (let i = 0; i < 6; i++) add(pc, at(box(0.5, 0.24, D.pfIn.h + 0.25), rtz(pol(D.pfIn.rOut + 0.04, i * 60 + 15, zc), i * 60 + 15)), 'black');
      }
      const sg = piece('solenoid', g);
      add(sg, at(ring(F.r, D.sol.rOut, D.sol.h, 96), frame(V(0, 0, 0), Z)), 'cable');
      for (let i = 1; i < 6; i++) add(sg, at(ring(D.sol.rOut - 0.02, D.sol.rOut + 0.05, 0.1, 96), frame(V(0, 0, -D.sol.h / 2 + i), Z)), 'tapeline');
      add(sg, at(ring(F.r, D.sol.rOut + 0.1, 0.25, 96), frame(V(0, 0, D.sol.h / 2), Z)), 'black');
      add(sg, at(ring(F.r, D.sol.rOut + 0.1, 0.25, 96), frame(V(0, 0, -D.sol.h / 2), Z)), 'black');
    }

    // ---------- Outer PF coils on aluminium channels, braced to the posts ----------
    function uChannel(R) {
      const w = 1.5, h = 1.3, web = 0.3, ch = 0.3;
      const pts = [[-w, -h], [w, -h], [w, -h + ch], [-w + web, -h + ch], [-w + web, h - ch], [w, h - ch], [w, h], [-w, h], [-w, -h]].map(([r, y]) => [-r, -y]);
      return revolve(pts.map(([r, y]) => [R + r, y]), 120);
    }
    for (const up of [true, false]) {
      const zs = up ? 1 : -1;
      const g = group(up ? 'pf3' : 'pf4', V(0, 0, zs * (up ? 14 : 6)), 0.1);
      const pc = piece('pfOuter', g, { label: up ? 'PF3 (upper)' : 'PF4 (lower)' });
      const m = new THREE.Matrix4().makeRotationX(Math.PI / 2).setPosition(0, 0, zs * D.pfOut.z);
      add(pc, at(uChannel(D.pfOut.R), m.clone()), 'alu');
      add(pc, at(ring(D.pfOut.R - 1.25, D.pfOut.R + 1.2, 2.0, 120), m.clone()), 'tape');
      for (let i = 0; i < 4; i++) {
        const deg = 45 + i * 90;
        const from = D.pfOut.R + 1.5, to = D.post.R - D.post.half;
        add(pc, at(box(to - from, 2.0, 1.2), rtz(pol((from + to) / 2, deg, zs * D.pfOut.z), deg)), 'alu');
        for (const s of [-1, 1]) add(pc, at(hex(0.9, 0.4), frame(pol((from + to) / 2 + s * 1.1, deg, zs * D.pfOut.z + zs * 0.8), Z.clone().multiplyScalar(zs))), 'bolt');
      }
    }

    // ---------- Satellite PF coils: hose-wound rings, the top one on brackets, the bottom one on pads ----------
    for (const up of [true, false]) {
      const S2 = up ? D.satTop : D.satBot;
      const g = group(up ? 'satTop' : 'satBot', V(0, 0, up ? 22 : 0), 0);
      const pc = piece('satellite', g, { label: up ? 'Upper satellite coil' : 'Lower satellite coil' });
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
          add(pc, at(box(to - from + 0.6, 3.2, 0.6), rtz(pol((from + to) / 2 + 0.3, deg, S2.z - S2.r - 0.3), deg)), 'alu');
          add(pc, at(box(0.5, 3.2, 3.6), rtz(pol(to - 0.25, deg, S2.z - S2.r + 1.2), deg)), 'alu');
          add(pc, at(box(1.2, 3.4, 0.5), rtz(pol(S2.R, deg, S2.z + S2.r + 0.25), deg)), 'black');
        } else {
          const deg = i * 90 + 45;
          const h = S2.z - S2.r - TB.top;
          add(pc, at(box(3.2, 3.2, h), rtz(pol(S2.R, deg, TB.top + h / 2), deg)), 'black');
        }
      }
    }

    // ---------- Table (Thorlabs Nexus), legs, shelf, posts ----------
    const tableG = group('table', V(0, 0, 0), 0);
    {
      const g = tableG;
      const tb = piece('table', g);
      add(tb, at(box(TB.half * 2, TB.half * 2, 1), T(0, 0, TB.top - 0.5)), 'table');
      add(tb, at(box(TB.half * 2 - 0.2, TB.half * 2 - 0.2, TB.thick - 1), T(0, 0, TB.top - 1 - (TB.thick - 1) / 2)), 'black');
      const holes = [];
      const pitch = 2.5;
      for (let i = -17; i <= 17; i++) for (let j = -17; j <= 17; j++) holes.push(T(i * pitch, j * pitch, TB.top + 0.01));
      const holeMesh = addInst(tb, at(new THREE.CircleGeometry(0.3, 10).deleteAttribute('uv'), new THREE.Matrix4()), 'hole', holes);
      holeMesh.userData.sameInkAs = 'table';
      // Engraved name plates on the front band.
      for (const [x, w] of [[-24, 12], [26, 10]]) add(tb, at(box(w, 0.08, 1.6), T(x, -TB.half - 0.1, TB.top - TB.thick / 2)), 'alu');
      const legTop = TB.top - TB.thick;
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const lx = sx * TB.legAt, ly = sy * TB.legAt;
        const h = legTop - 1.6 - (TB.floor + 2.5);
        add(tb, at(box(TB.leg, TB.leg, h), T(lx, ly, TB.floor + 2.5 + h / 2)), 'black');
        add(tb, at(disc(2.2, 1.6, 24), frame(V(lx, ly, legTop - 0.8), Z)), 'steel2');
        add(tb, at(rod(0.9, 2.6, 16), frame(V(lx, ly, TB.floor + 2.0), Z)), 'bolt');
        add(tb, at(disc(3.0, 1.2, 28), frame(V(lx, ly, TB.floor + 0.6), Z)), 'ink');
      }
      const inner = TB.legAt - TB.leg / 2;
      for (const s of [-1, 1]) {
        add(tb, at(box(inner * 2, 5, 7), T(0, s * TB.legAt, TB.shelf - 3.5)), 'black');
        add(tb, at(box(5, inner * 2, 7), T(s * TB.legAt, 0, TB.shelf - 3.5)), 'black');
        add(tb, at(box(5, inner * 2, 6), T(s * TB.legAt, 0, legTop - 1.6 - 3)), 'black');
      }
      add(tb, at(box(inner * 2, inner * 2, 1.0), T(0, 0, TB.shelf + 0.5)), 'panel');
    }

    for (let i = 0; i < 4; i++) {
      const deg = 45 + i * 90;
      const P = D.post;
      const pc = piece('posts', tableG, { label: `Post ${i + 1}` });
      const h = P.top - TB.top;
      const c = pol(P.R, deg, TB.top + h / 2);
      add(pc, at(box(P.half * 2, P.half * 2, h), rtz(c, deg)), 'alu');
      add(pc, at(box(P.half * 2 + 0.1, P.half * 2 + 0.1, 0.4), rtz(pol(P.R, deg, P.top + 0.2), deg)), 'black');
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const o = radial(deg).multiplyScalar(dx * (P.half + 0.03)).add(toroidal(deg).multiplyScalar(dy * (P.half + 0.03)));
        add(pc, at(box(dx ? 0.1 : 0.8, dy ? 0.1 : 0.8, h - 1.2), rtz(c.clone().add(o), deg)), 'slot');
      }
      // Angle bracket at the foot, outboard of the post.
      const foot = pol(P.R + P.half + 2.1, deg, TB.top);
      add(pc, at(box(4.2, 4.0, 0.5), rtz(foot.clone().add(V(0, 0, 0.25)), deg)), 'alu');
      add(pc, at(box(0.5, 4.0, 4.2), rtz(pol(P.R + P.half + 0.25, deg, TB.top + 2.1), deg)), 'alu');
      for (const s of [-1, 1]) add(pc, at(hex(1.0, 0.45), frame(foot.clone().add(toroidal(deg).multiplyScalar(s * 1.2)).add(radial(deg).multiplyScalar(0.9)).add(V(0, 0, 0.5)), Z)), 'bolt');
      // Clamp block that holds the joint flange pair.
      const from = D.R0 + J.od / 2, to = P.R - P.half;
      const blockAt = pol((from + to) / 2, deg, 0);
      add(pc, at(box(to - from, J.t * 2 + D.gap + 2.4, 4.4), rtz(blockAt, deg)), 'steel2');
      for (const s of [-1, 1]) add(pc, at(hex(1.0, 0.45), frame(blockAt.clone().add(toroidal(deg).multiplyScalar(s * 0.6)).add(V(0, 0, 2.2 + 0.22)), Z)), 'bolt');
    }

    // ---------- Under the table: coil supply chassis, control drawer, pump ----------
    let pumpInlet, spectroIn;
    {
      const g = group('rack', V(0, 0, 0), 0);
      const base = TB.shelf + 1.0;
      const front = -20, depth = 38;
      const x0 = -31, x1 = 16;
      const pc = piece('psu', g);
      const chassis = (zFrom, h) => {
        add(pc, at(box(x1 - x0, depth, h), T((x0 + x1) / 2, front + depth / 2, zFrom + h / 2)), 'black');
        for (const s of [-1, 1]) add(pc, at(box(1.6, 0.6, h - 0.4), T(s < 0 ? x0 - 0.8 : x1 + 0.8, front - 0.3, zFrom + h / 2)), 'alu');
      };
      const mod = (x, w, zFrom, h, label) => {
        const cy = front - 0.2;
        add(pc, at(box(w - 0.3, 0.4, h - 0.6), T(x, cy, zFrom + h / 2)), 'panel');
        const lcd = add(pc, at(box(w - 2.0, 0.15, 1.5), T(x, cy - 0.27, zFrom + h - 2.4)), 'lcd');
        lcd.userData.lcd = true;
        add(pc, at(disc(0.8, 0.9, 20), frame(V(x, cy - 0.65, zFrom + h / 2 - 0.4), V(0, -1, 0))), 'ink');
        for (const s of [-1, 1]) add(pc, at(disc(0.36, 0.9, 12), frame(V(x + s * (w / 2 - 1.2), cy - 0.65, zFrom + 1.5), V(0, -1, 0))), s < 0 ? 'red' : 'ink');
        if (label) add(pc, at(box(w - 1.6, 0.06, 0.8), T(x, cy - 0.23, zFrom + h - 0.8)), label);
      };
      chassis(base, 13.3);
      const wm = (x1 - x0) / 8;
      for (let i = 0; i < 8; i++) mod(x0 + wm / 2 + i * wm, wm, base, 13.3);
      const top2 = base + 13.3;
      chassis(top2, 13.3);
      for (let i = 0; i < 7; i++) mod(x0 + wm / 2 + i * wm, wm, top2, 13.3, i < 4 ? null : 'yellowtag');

      // Pull-out control drawer under the table top, with the DIN rail inside.
      const dz = TB.top - TB.thick - 7.2;
      const dr = piece('drawer', g, { detach: V(0, -34, 0) });
      const dx0 = -24, dx1 = 24, dy0 = -30, dy1 = 10;
      add(dr, at(box(dx1 - dx0, dy1 - dy0, 0.4), T(0, (dy0 + dy1) / 2, dz - 4.8)), 'panel');
      for (const s of [-1, 1]) add(dr, at(box(0.4, dy1 - dy0, 9.6), T(s * ((dx1 - dx0) / 2 - 0.2), (dy0 + dy1) / 2, dz)), 'panel');
      add(dr, at(box(dx1 - dx0, 0.4, 9.6), T(0, dy1 - 0.2, dz)), 'panel');
      add(dr, at(box(dx1 - dx0 + 2, 0.6, 11), T(0, dy0 - 0.3, dz + 0.3)), 'alu');
      for (const s of [-1, 1]) {
        add(dr, at(box(0.8, 1.6, 0.8), T(s * 16, dy0 - 1.4, dz + 3.4)), 'alu');
        add(dr, at(box(0.8, 1.6, 0.8), T(s * 16, dy0 - 1.4, dz - 2.8)), 'alu');
        add(dr, at(box(0.8, 0.8, 7.0), T(s * 16, dy0 - 2.2, dz + 0.3)), 'alu');
      }
      const rail = (y) => add(dr, at(box(dx1 - dx0 - 3, 3.5, 0.3), T(0, y, dz - 4.45)), 'steel2');
      rail(-20);
      rail(-6);
      // PLC, relays and terminal blocks on the front rail; switch-mode supply and DAQ on the back rail.
      add(dr, at(box(9, 4.2, 6.5), T(-14, -20, dz - 1.0)), 'panel');
      const plcLeds = [];
      for (let i = 0; i < 6; i++) plcLeds.push(T(-17 + i * 1.2, -22.15, dz + 0.8));
      const led = addInst(dr, box(0.5, 0.1, 0.5), 'led', plcLeds);
      led.userData.led = true;
      for (let i = 0; i < 4; i++) add(dr, at(box(1.6, 4.0, 5.5), T(-6.5 + i * 2.0, -20, dz - 1.5)), 'black');
      for (let i = 0; i < 12; i++) add(dr, at(box(0.7, 4.4, 4.2), T(2.5 + i * 0.85, -20, dz - 2.1)), i % 3 === 2 ? 'red' : 'grey');
      add(dr, at(box(16, 9, 4.2), T(-10, -6, dz - 2.2)), 'steel2');
      for (let i = 0; i < 10; i++) add(dr, at(box(0.25, 9.1, 3.4), T(-17 + i * 1.5, -6, dz - 2.1)), 'slot');
      add(dr, at(box(10, 6, 2.5), T(10, -6, dz - 3)), 'pcb');

      // Rotary vane pump on the shelf, right of the chassis.
      const pp = piece('pump', g);
      const px = 24.5, py = 0, pz = base;
      add(pp, at(box(12.5, 32, 0.8), T(px, py, pz + 0.4)), 'black');
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) add(pp, at(disc(1.1, 0.8, 16), frame(V(px + sx * 5, py + sy * 13.5, pz + 0.4), Z)), 'ink');
      const mz = pz + 0.8 + 6.4;
      add(pp, at(disc(6.2, 15, 48), frame(V(px, py - 7.5, mz), V(0, 1, 0))), 'pumpgrey');
      for (let i = 0; i < 14; i++) {
        const a = Math.PI * (0.06 + (0.88 * i) / 13);
        add(pp, at(box(0.8, 13.5, 0.3), frame(V(px + 6.5 * Math.cos(a), py - 7.5, mz + 6.5 * Math.sin(a)), V(0, 1, 0), V(Math.cos(a), 0, Math.sin(a)))), 'pumpgrey');
      }
      add(pp, at(disc(6.6, 2.4, 48), frame(V(px, py - 16.2, mz), V(0, 1, 0))), 'white');
      for (let i = 0; i < 5; i++) add(pp, at(ring(1.0 + i * 1.1, 1.35 + i * 1.1, 0.3, 40), frame(V(px, py - 17.5, mz), V(0, 1, 0))), 'ink');
      add(pp, at(box(11.5, 14, 13.5), T(px, py + 7.5, pz + 0.8 + 6.75)), 'pumpgrey');
      add(pp, at(disc(1.3, 0.5, 24), frame(V(px - 5.95, py + 7.5, pz + 5), V(-1, 0, 0))), 'oil');
      add(pp, at(ring(1.3, 1.8, 0.5, 24), frame(V(px - 5.95, py + 7.5, pz + 5), V(-1, 0, 0))), 'bolt');
      add(pp, at(box(5, 6, 4), T(px, py - 6, mz + 7.2)), 'black');
      const inletZ = pz + 0.8 + 13.5;
      add(pp, at(ring(1.85, 2.05, 3.4, 28), frame(V(px, py + 8, inletZ + 1.7), Z)), 'steel');
      add(pp, at(flangeRing(1.85, 3.25, 0.6, 32), frame(V(px, py + 8, inletZ + 3.1), Z)), 'steel2');
      add(pp, at(revolve([[2.1, -0.75], [3.6, -0.55], [3.6, 0.55], [2.1, 0.75]], 32), frame(V(px, py + 8, inletZ + 3.4), Z)), 'alu');
      add(pp, at(disc(1.6, 3.0, 24), frame(V(px + 3.6, py + 12, inletZ + 1.5), Z)), 'black');
      pumpInlet = V(px, py + 8, inletZ + 4.0);
    }

    // ---------- On the table: HV supply, E-stop, spectrometer, webcam ----------
    const hvBox = V(14, -38.5, TB.top + 2.8);
    {
      const g = group('bench', V(0, 0, 0), 0);
      const hv = piece('hv', g);
      add(hv, at(box(11, 7, 5.6), T(hvBox.x, hvBox.y, hvBox.z)), 'white');
      const lcd = add(hv, at(box(5.5, 0.12, 1.8), T(hvBox.x - 1.5, hvBox.y - 3.56, hvBox.z + 1.0)), 'hvlcd');
      lcd.userData.lcd = true;
      add(hv, at(box(2.2, 0.12, 1.8), T(hvBox.x + 3.2, hvBox.y - 3.56, hvBox.z + 1.0)), 'red');
      for (const s of [-1, 1]) add(hv, at(disc(0.5, 0.8, 16), frame(V(hvBox.x + s * 3.5, hvBox.y + 3.9, TB.top + 0.75), V(0, 1, 0))), 'bolt');
      for (const s of [-1, 1]) add(hv, at(box(1.4, 1.4, 0.4), T(hvBox.x + s * 6.2, hvBox.y, TB.top + 0.2)), 'white');
      for (const s of [-1, 1]) add(hv, at(hex(0.9, 0.5), frame(V(hvBox.x + s * 6.2, hvBox.y, TB.top + 0.65), Z)), 'bolt');

      const es = piece('estop', g);
      const ep = V(35, -37, TB.top + 3);
      add(es, at(box(7.5, 7.5, 6), T(ep.x, ep.y, ep.z)), 'yellow');
      add(es, at(disc(1.2, 1.0, 24), frame(V(ep.x, ep.y, ep.z + 3.5), Z)), 'ink');
      add(es, at(revolve([[0, 0], [2.1, 0], [2.1, 0.7], [1.6, 1.4], [0, 1.5]], 40), frame(V(ep.x, ep.y, ep.z + 4.0), Z)), 'red');
      add(es, at(disc(0.7, 1.4, 16), frame(V(ep.x + 4.2, ep.y, ep.z - 1.5), V(1, 0, 0))), 'grey');

      const sp = piece('spectro', g);
      const sx = -20, sy = 40, sz = TB.top + 2.6;
      add(sp, at(box(12, 7, 5.2), T(sx, sy, sz)), 'panel');
      add(sp, at(box(12.1, 0.14, 1.2), T(sx, sy - 3.55, sz + 1.4)), 'ink');
      add(sp, at(disc(0.55, 1.0, 16), frame(V(sx + 6.5, sy, sz - 0.6), V(1, 0, 0))), 'bolt');
      add(sp, at(box(2.2, 0.1, 0.6), T(sx - 3, sy - 3.55, sz - 0.9)), 'led');
      for (const s of [-1, 1]) for (const t of [-1, 1]) add(sp, at(disc(0.25, 0.1, 10), frame(V(sx + s * 5.4, sy + t * 2.9, sz + 2.62), Z)), 'ink');
      spectroIn = V(sx + 7.0, sy, sz - 0.6);

      // Webcam on an optical post in front of the left viewport, looking in along +x.
      const cam = piece('camera', g);
      const cx = -43, cz = 0;
      add(cam, at(disc(1.6, 0.6, 24), frame(V(cx, 0, TB.top + 0.3), Z)), 'black');
      add(cam, at(rod(1.0, 7, 20), frame(V(cx, 0, TB.top + 4.1), Z)), 'black');
      add(cam, at(rod(0.6, cz - 3.5 - (TB.top + 7.6), 16), frame(V(cx, 0, (cz - 3.5 + TB.top + 7.6) / 2), Z)), 'steel2');
      add(cam, at(box(2.4, 2.4, 1.6), T(cx, 0, cz - 2.7)), 'black');
      add(cam, at(box(3.2, 7.4, 3.0), T(cx, 0, cz)), 'black');
      add(cam, at(disc(1.25, 1.4, 28), frame(V(cx + 2.2, 0, cz), V(1, 0, 0))), 'black');
      add(cam, at(disc(0.85, 0.12, 28), frame(V(cx + 2.95, 0, cz), V(1, 0, 0))), 'glass');
      add(cam, at(disc(0.2, 0.1, 10), frame(V(cx + 1.65, 2.6, cz + 0.9), V(1, 0, 0))), 'led');
    }

    // ---------- Lines that span two groups, rebuilt as the machine comes apart ----------
    function stretchLine(part, points, r, tone, o, ends, label) {
      const holder = piece(part, rootGroup, { label });
      const mesh = add(holder, tube(points, r, o), tone);
      stretch.push({ mesh, points: points.map((p) => p.clone()), r, o, ends });
      return mesh;
    }

    const hf = pumpLineFrom;
    stretchLine('hose', [
      V(hf, 0, 0), V(hf + 3, 0, -0.4), V(hf + 6.5, 0, -3.5), V(hf + 8.2, 0, -12), V(hf + 8.2, -1, -38),
      V(hf + 6, -2, -60), V(38, 4, -66), pumpInlet.clone().add(V(4, 0, 6)), pumpInlet.clone().add(V(0, 0, 1.6)), pumpInlet.clone(),
    ], 2.0, 'steel', { seg: 420, radial: 14, corrugate: 0.24, pitch: 1.15 }, ['quarter0', 'rack']);

    const gasTo = V(13, 43.6, TB.top + 0.9);
    stretchLine('needle', [gasFrom, gasFrom.clone().add(V(1.4, 0.4, 1.4)), V(14, 30, 21.5), V(13.5, 37, 20.8), V(13, 40.6, 15), V(13, 41.2, 0), V(13, 41.4, -16), V(13, 42.4, TB.top + 1.6), gasTo], 0.26, 'brass', { seg: 70, radial: 8 }, ['quarter1', 'table'], 'Gas line');
    {
      const gb = piece('needle', tableG, { label: 'Gas inlet fitting' });
      add(gb, at(box(2.4, 2.4, 1.8), T(gasTo.x, gasTo.y + 1.2, TB.top + 0.9)), 'brass');
      add(gb, at(hex(1.4, 0.8), frame(V(gasTo.x, gasTo.y + 2.8, TB.top + 0.9), V(0, 1, 0))), 'brass');
    }

    const gc = gaugeCableFrom;
    const gaugeTo = V(20, 37.6, TB.top + 2.0);
    stretchLine('gauge', [gc, gc.clone().add(V(0.8, 0, 0)), V(10, 26, 33), V(16, 32, 25), V(19.5, 36.5, 19), V(20, 37.6, 6), V(20, 37.6, -14), gaugeTo], 0.28, 'black', { seg: 70, radial: 8 }, ['quarter1', 'table'], 'Gauge cable');
    {
      const cc = piece('gauge', tableG, { label: 'Gauge cable clamp' });
      add(cc, at(box(2.6, 2.6, 2.0), T(gaugeTo.x, gaugeTo.y, TB.top + 1.0)), 'black');
    }

    for (const e of hvEnds) {
      const f = e.from;
      const z0 = TB.top + 0.45;
      const ty = hvBox.y + 4.3, tz = TB.top + 0.75;
      const pts = e.deg === 270
        ? [f, f.clone().add(V(0, 0, -1.2)), V(f.x + 0.6, f.y - 0.8, z0 + 0.4), V(3, -27, z0), V(7, -30.5, z0), V(hvBox.x - 3.5, ty + 1.8, z0 + 0.1), V(hvBox.x - 3.5, ty, tz)]
        : [f, f.clone().add(V(0, 0, -1.2)), V(f.x + 0.6, f.y - 0.8, z0 + 0.4), V(-14, -10, z0), V(-4, -17, z0), V(6, -20, z0), V(14, -26, z0), V(hvBox.x + 3.5, ty + 1.8, z0 + 0.1), V(hvBox.x + 3.5, ty, tz)];
      stretchLine('hv', pts, 0.36, 'pink', { seg: 70, radial: 10 }, [e.deg === 270 ? 'quarter3' : 'quarter2', 'bench'], e.deg === 270 ? 'HV lead A' : 'HV lead B');
    }

    // Spectrometer fibre: an SMA adaptor on the back viewport, a yellow jacketed fibre down to the spectrometer.
    const fibreAt = pol(latFace + D.gap + L.t + 0.6, 90, 0);
    {
      const fa = piece('spectro', qB, { clip: true, label: 'Fibre adaptor' });
      add(fa, at(box(9.0, 0.5, 1.6), rtz(pol(latFace + D.gap + L.t + 0.25, 90, 0), 90)), 'alu');
      add(fa, at(disc(0.6, 1.4, 20), frame(pol(latFace + D.gap + L.t + 1.0, 90, 0), radial(90))), 'bolt');
    }
    const ff = pol(latFace + D.gap + L.t + 1.7, 90, 0);
    stretchLine('spectro', [ff, ff.clone().add(V(0, 1.2, -0.5)), V(-0.8, 43.4, -6), V(-2, 43.8, -15), V(-4, 43.6, TB.top + 0.8), V(-8, 42, TB.top + 0.75), V(-11.4, 40.2, TB.top + 1.4), V(spectroIn.x + 0.6, spectroIn.y, spectroIn.z), spectroIn.clone()], 0.26, 'yellow', { seg: 70, radial: 8 }, ['quarter1', 'bench'], 'Optical fibre');

    // Points the home view frames: the machine and the table top. "Fit all" adds the stand, rack and pump.
    const fit = [];
    for (const [x, y] of [[1, 1], [-1, -1], [1, -1], [-1, 1]]) {
      fit.push(V(x * TB.half, y * TB.half, TB.top - TB.thick), V(x * 38, y * 38, 21));
    }
    fit.push(pol(D.R0, 90, 40));
    const fitAll = [...fit];
    for (const [x, y] of [[1, 1], [-1, -1], [1, -1], [-1, 1]]) fitAll.push(V(x * TB.half, y * TB.half, TB.floor));
    fitAll.push(V(TB.half + 12, 0, -40), V(0, -TB.half - 4, TB.top + 8));

    return { root: rootGroup, groups, stretch, instances, fit, fitAll, dims: D, detach: DETACH, tube, frames: { pol, radial, toroidal } };
  }

  root.SPM1Device = { build, dims: D, detach: DETACH };
})(typeof window !== 'undefined' ? window : globalThis);
