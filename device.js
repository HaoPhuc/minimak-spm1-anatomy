// Geometry of the MinimaK SPM1, in centimetres, z up, vessel midplane at z = 0.
// Classic script: window.SPM1Device.build(THREE, paint) returns the assembled scene graph.
// `paint(geometry, tone, { part, clip })` and `paint.instanced(geometry, tone, matrices, opts)` come from the page,
// which owns the materials; this file only knows shapes, tones and part ids.
(function (root) {
  const DEG = Math.PI / 180;

  const D = {
    R0: 23,
    aIn: 7.2,
    aOut: 7.5,
    table: { top: -30, thick: 6, half: 45, floor: -110, leg: 8, legAt: 37, shelf: -94 },
    tf: { halfW: 3.0, rIn: 7.62, rOut: 9.2, cheekR: 9.9, cheekT: 0.35, ribs: 28 },
    joint: { R: 10.15, t: 2.2, gap: 0.24, boltR: 9.05, bolts: 20 },
    lat: { neckR: 3.5, neckFrom: 29.6, flangeAt: 35.2, t: 1.3, flR: 5.7, boltR: 4.6, bolts: 8, glassR: 3.2 },
    small: { neckR: 1.9, neckFrom: 7.3, flangeAt: 12.4, t: 1.2, flR: 3.5, boltR: 2.9, bolts: 6, glassR: 1.5 },
    pfIn: { R: 11, z: 12.6 },
    pfOut: { R: 31.5, z: 12.6 },
    sat: { R: 36.5, z: 21, r: 1.6 },
    sol: { r: 4.6, rw: 5.8, half: 10.2, col: 2.5, top: 24 },
    postR: 42,
    pump: { R: 80, phi: 315 },
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
      const seg = o.seg ?? 64, radial = o.radial ?? 10;
      const g = new THREE.TubeGeometry(curve, seg, r, radial, false);
      g.deleteAttribute('uv');
      if (o.corrugate) {
        const p = g.attributes.position, n = g.attributes.normal;
        const len = curve.getLength();
        for (let k = 0; k < p.count; k++) {
          const i = Math.floor(k / (radial + 1));
          const s = (i / seg) * len;
          const d = o.corrugate * Math.cos((s / o.pitch) * Math.PI * 2);
          p.setXYZ(k, p.getX(k) + n.getX(k) * d, p.getY(k) + n.getY(k) * d, p.getZ(k) + n.getZ(k) * d);
        }
        g.computeVertexNormals();
      }
      const parts = [g];
      for (const [t, s] of [[0, -1], [1, 1]]) {
        const c = new THREE.CircleGeometry(r, radial);
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

    function group(name, offset, delay) {
      const g = new THREE.Group();
      g.name = name;
      rootGroup.add(g);
      groups.push({ obj: g, offset, delay });
      return g;
    }

    function add(parent, geometry, tone, part, o = {}) {
      const m = paint(geometry, tone, { part, clip: !!o.clip });
      parent.add(m);
      return m;
    }

    function addInst(parent, geometry, tone, matrices, part, o = {}) {
      const m = paint.instanced(geometry, tone, matrices, { part, clip: !!o.clip });
      parent.add(m);
      return m;
    }

    // Bolt with its head at local y = 0..0.65 and the shank running down -y for `len`.
    function boltGeom(len) {
      return merge([at(hex(1.1, 0.65), new THREE.Matrix4().makeTranslation(0, 0.325, 0)), at(new THREE.CylinderGeometry(0.4, 0.4, len, 10).deleteAttribute('uv'), new THREE.Matrix4().makeTranslation(0, -len / 2, 0))]);
    }
    const nutGeom = () => at(hex(1.1, 0.7), new THREE.Matrix4().makeTranslation(0, 0.35, 0));

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

    // ---------- Vessel quarters, each with its flanges, coils and ports ----------
    const J = D.joint, T = D.tf, L = D.lat, S = D.small;
    const quarters = [];
    const qOffset = (k) => radial(45 + 90 * k).multiplyScalar(10);

    for (let k = 0; k < 4; k++) {
      const q = group(`quarter${k}`, qOffset(k), 0.3 + k * 0.05);
      quarters.push(q);
      const p0 = 90 * k, p1 = 90 * (k + 1);
      const inset = (J.gap / 2 + J.t * 0.5) / D.R0;
      add(q, torusShell(D.R0, D.aIn, D.aOut, p0 * DEG + inset, p1 * DEG - inset), 'steel', 'vessel', { clip: true });

      // Flange B (start of quarter, nuts) and flange A (end, bolts).
      for (const [pj, side] of [[p0, 1], [p1, -1]]) {
        const tdir = toroidal(pj).multiplyScalar(side);
        const centre = pol(D.R0, pj).add(tdir.clone().multiplyScalar(J.gap / 2 + J.t / 2));
        add(q, at(flangeRing(D.aIn, J.R, J.t, 72), frame(centre, tdir)), 'steel2', 'joints', { clip: true });
        const face = pol(D.R0, pj).add(tdir.clone().multiplyScalar(J.gap / 2 + J.t));
        const mats = circleMatrices(face, tdir, radial(pj), Z, J.boltR, J.bolts);
        if (side < 0) addInst(q, boltGeom(J.t * 2 + J.gap + 0.9), 'bolt', mats, 'joints', { clip: true });
        else addInst(q, nutGeom(), 'bolt', mats, 'joints', { clip: true });
      }

      // Two TF coils per quarter.
      for (const pc of [p0 + 22.5, p0 + 67.5]) {
        const hw = T.halfW / D.R0, ct = T.cheekT / D.R0, c = pc * DEG;
        const bits = [
          torusShell(D.R0, T.rIn, T.rOut, c - hw + ct, c + hw - ct, { nT: 64 }),
          torusShell(D.R0, T.rIn - 0.04, T.cheekR, c - hw, c - hw + ct, { nT: 64, nP: 2 }),
          torusShell(D.R0, T.rIn - 0.04, T.cheekR, c + hw - ct, c + hw, { nT: 64, nP: 2 }),
        ];
        for (let i = 0; i < T.ribs; i++) {
          const th = (i / T.ribs) * Math.PI * 2;
          bits.push(torusShell(D.R0, T.rOut, T.rOut + 0.2, c - hw + ct, c + hw - ct, { t0: th - 0.012, t1: th + 0.012, nT: 1, nP: 8 }));
        }
        add(q, merge(bits), 'copper', 'tf', { clip: true });
        const blockAt = pol(D.R0, pc, -(T.rOut + 0.6));
        add(q, at(box(1.6, T.halfW * 1.5, 1.3), rtz(blockAt, pc)), 'black', 'tf', { clip: true });
        for (const s of [-1, 1]) {
          const studAt = blockAt.clone().add(toroidal(pc).multiplyScalar(s * 1.1)).add(V(0, 0, -0.9));
          add(q, at(new THREE.CylinderGeometry(0.28, 0.28, 0.6, 10).deleteAttribute('uv'), frame(studAt, Z)), 'bolt', 'tf', { clip: true });
        }
      }

      // Lateral port neck and its welded flange.
      const pp = p0 + 45;
      const rdir = radial(pp);
      add(q, saddleNeck(pol(D.R0, pp), rdir, L.neckR - 0.25, L.neckR, L.flangeAt - D.R0, lateralStart(pp)), 'steel', k === 3 ? 'vport' : 'viewport', { clip: true });
      add(q, at(flangeRing(L.neckR - 0.25, L.flR, L.t), frame(pol(L.flangeAt + L.t / 2, pp), rdir)), 'steel2', k === 3 ? 'vport' : 'viewport', { clip: true });
      const outer = L.flangeAt + L.t;
      const portBolts = (part) => {
        addInst(q, boltGeom(L.t * 2 + 0.8), 'bolt', circleMatrices(pol(outer + L.t, pp), rdir, Z, toroidal(pp), L.boltR, L.bolts), part, { clip: true });
        addInst(q, nutGeom(), 'bolt', circleMatrices(pol(L.flangeAt, pp), rdir.clone().negate(), Z, toroidal(pp), L.boltR, L.bolts), part, { clip: true });
      };

      if (k < 3) {
        add(q, at(flangeRing(L.glassR + 0.5, L.flR, L.t), frame(pol(outer + L.t / 2, pp), rdir)), 'steel2', 'viewport', { clip: true });
        const glass = add(q, at(disc(L.glassR + 0.5, 0.6), frame(pol(outer + 0.45, pp), rdir)), 'glass', 'viewport', { clip: true });
        glass.userData.window = true;
        portBolts('viewport');
      } else {
        // Reducer flange, tee, gauge on top, needle valve below, KF end for the pump line.
        add(q, at(flangeRing(2.0, L.flR, L.t), frame(pol(outer + L.t / 2, pp), rdir)), 'steel2', 'vport', { clip: true });
        portBolts('vport');
        const lineFrom = outer + L.t, lineTo = 47;
        add(q, at(ring(1.75, 2.0, lineTo - lineFrom, 32), frame(pol((lineFrom + lineTo) / 2, pp), rdir)), 'steel', 'vport', { clip: true });
        add(q, at(ring(1.75, 2.6, 0.6, 32), frame(pol(lineTo - 0.3, pp), rdir)), 'steel2', 'vport', { clip: true });
        add(q, at(ring(2.0, 2.4, 0.9, 32), frame(pol(lineTo - 0.3, pp), rdir)), 'bolt', 'vport', { clip: true });
        const teeR = 41;
        add(q, at(ring(1.45, 1.7, 5.0, 28), frame(pol(teeR, pp, 4.0), Z)), 'steel', 'vport', { clip: true });
        add(q, at(ring(1.45, 2.6, 0.7, 28), frame(pol(teeR, pp, 6.85), Z)), 'steel2', 'gauge', { clip: true });
        add(q, at(disc(1.6, 4.0, 28), frame(pol(teeR, pp, 9.2), Z)), 'steel2', 'gauge', { clip: true });
        const head = pol(teeR, pp, 13.2);
        add(q, at(box(3.6, 5.0, 4.0), rtz(head, pp)), 'panel', 'gauge', { clip: true });
        const lcd = add(q, at(box(0.2, 3.4, 1.4), rtz(head.clone().add(rdir.clone().multiplyScalar(1.85)).add(V(0, 0, 0.7)), pp)), 'lcd', 'gauge', { clip: true });
        lcd.userData.lcd = true;
        add(q, at(ring(1.45, 1.7, 3.8, 28), frame(pol(teeR, pp, -3.4), Z)), 'steel', 'needle', { clip: true });
        const valve = pol(teeR, pp, -6.5);
        add(q, at(box(2.6, 2.6, 2.6), rtz(valve, pp)), 'brass', 'needle', { clip: true });
        const knobAxis = toroidal(pp);
        add(q, at(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 10).deleteAttribute('uv'), frame(valve.clone().add(knobAxis.clone().multiplyScalar(2.1)), knobAxis)), 'bolt', 'needle', { clip: true });
        const knob = merge([disc(1.1, 1.4, 24)]);
        add(q, at(knob, frame(valve.clone().add(knobAxis.clone().multiplyScalar(3.6)), knobAxis)), 'black', 'needle', { clip: true });
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          const ridgeAt = valve.clone().add(knobAxis.clone().multiplyScalar(3.6)).add(rdir.clone().multiplyScalar(1.12 * Math.cos(a))).add(V(0, 0, 1.12 * Math.sin(a)));
          add(q, at(box(0.16, 1.3, 0.16), frame(ridgeAt, knobAxis, rdir)), 'black', 'needle', { clip: true });
        }
      }
    }
    const [q0, q1, q2, q3] = quarters;

    // Copper gaskets between the flange pairs, carried halfway between the two quarters when taken apart.
    for (let k = 0; k < 4; k++) {
      const pj = 90 * k;
      const off = qOffset(k).add(qOffset((k + 3) % 4)).multiplyScalar(0.5);
      const g = group(`gasket${k}`, off, 0.32 + k * 0.05);
      add(g, at(ring(D.aIn + 0.05, D.aIn + 1.3, J.gap * 0.9, 64), frame(pol(D.R0, pj), toroidal(pj))), 'copper', 'joints', { clip: true });
    }

    // ---------- Small vertical ports (two at q0, two at q2) ----------
    function smallPort(q, deg, up, part) {
      const dir = up ? Z.clone() : Z.clone().negate();
      const zs = up ? 1 : -1;
      add(q, saddleNeck(pol(D.R0, deg, 0), dir, S.neckR - 0.2, S.neckR, S.flangeAt, verticalStart(deg), 36), 'steel', 'diagPort', { clip: true });
      add(q, at(flangeRing(S.neckR - 0.2, S.flR, S.t, 40), frame(pol(D.R0, deg, zs * (S.flangeAt + S.t / 2)), dir)), 'steel2', 'diagPort', { clip: true });
      const face = S.flangeAt + S.t;
      addInst(q, nutGeom(), 'bolt', circleMatrices(pol(D.R0, deg, zs * S.flangeAt), dir.clone().negate(), radial(deg), toroidal(deg), S.boltR, S.bolts), 'diagPort', { clip: true });
      return { face, dir, zs, bolts: (tone) => addInst(q, boltGeom(S.t * 2 + 0.8), tone || 'bolt', circleMatrices(pol(D.R0, deg, zs * (face + S.t)), dir, radial(deg), toroidal(deg), S.boltR, S.bolts), part, { clip: true }) };
    }

    // q0 top: laser diagnostics window.
    {
      const sp = smallPort(q0, 45, true, 'diagPort');
      add(q0, at(flangeRing(S.glassR + 0.4, S.flR, S.t, 40), frame(pol(D.R0, 45, sp.face + S.t / 2), Z)), 'steel2', 'diagPort', { clip: true });
      const w = add(q0, at(disc(S.glassR + 0.4, 0.5, 28), frame(pol(D.R0, 45, sp.face + 0.4), Z)), 'glass', 'diagPort', { clip: true });
      w.userData.window = true;
      sp.bolts();
    }

    // q0 bottom: Langmuir probe on a linear feedthrough, tip up in the plasma.
    {
      const sp = smallPort(q0, 45, false, 'probe', { clip: true });
      const base = -(sp.face);
      add(q0, at(flangeRing(0.5, S.flR, S.t, 40), frame(pol(D.R0, 45, base - S.t / 2), Z)), 'steel2', 'probe', { clip: true });
      sp.bolts();
      const bellowsTop = base - S.t, bellowsBot = bellowsTop - 6;
      const prof = [];
      const folds = 12;
      for (let i = 0; i <= folds * 2; i++) prof.push([i % 2 ? 1.55 : 1.15, bellowsBot + ((bellowsTop - bellowsBot) * i) / (folds * 2)]);
      const bellowsOutline = [[0.6, bellowsBot], ...prof, [0.6, bellowsTop], [0.6, bellowsBot]];
      add(q0, at(revolve(bellowsOutline, 36), frame(pol(D.R0, 45, 0), Z)), 'steel', 'probe', { clip: true });
      add(q0, at(box(4.4, 4.4, 0.8), rtz(pol(D.R0, 45, bellowsBot - 0.4), 45)), 'alu', 'probe', { clip: true });
      for (const s of [-1, 1]) add(q0, at(new THREE.CylinderGeometry(0.3, 0.3, 6.8, 10).deleteAttribute('uv'), frame(pol(D.R0, 45, bellowsTop - 3.4).add(toroidal(45).multiplyScalar(s * 2.0)), Z)), 'bolt', 'probe', { clip: true });
      add(q0, at(disc(0.9, 3.2, 24), frame(pol(D.R0, 45, bellowsBot - 2.4), Z)), 'steel2', 'probe', { clip: true });
      add(q0, at(disc(1.15, 1.6, 24), frame(pol(D.R0, 45, bellowsBot - 4.8), Z)), 'black', 'probe', { clip: true });
      for (let i = 0; i < 6; i++) add(q0, at(ring(0.92, 0.97, 0.06, 24), frame(pol(D.R0, 45, bellowsBot - 1.2 - i * 0.45), Z)), 'ink', 'probe', { clip: true });
      add(q0, at(new THREE.CylinderGeometry(0.32, 0.32, D.aIn - 1.6, 12).deleteAttribute('uv'), frame(pol(D.R0, 45, -(D.aIn + 1.6) / 2), Z)), 'ceramic', 'probe', { clip: true });
      const tip = add(q0, at(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 8).deleteAttribute('uv'), frame(pol(D.R0, 45, -1.0), Z)), 'tip', 'probe', { clip: true });
      tip.userData.tip = true;
      add(q0, at(new THREE.CylinderGeometry(0.15, 0.15, 7.0, 8).deleteAttribute('uv'), frame(pol(D.R0, 45, base + 0.5 - 4.3), Z)), 'bolt', 'probe', { clip: true });
    }

    // q2 top and bottom: HV glow electrodes with pink cables to a junction box on the table.
    const hvBox = pol(50, 225, D.table.top + 2.5);
    const hvEnds = [];
    for (const up of [true, false]) {
      const sp = smallPort(q2, 225, up, 'electrode');
      const zs = sp.zs;
      add(q2, at(flangeRing(0.6, S.flR, S.t, 40), frame(pol(D.R0, 225, zs * (sp.face + S.t / 2)), Z)), 'steel2', 'electrode');
      sp.bolts();
      const insFrom = sp.face + S.t;
      const shedProfile = [[0.5, 0]];
      for (let i = 0; i < 4; i++) shedProfile.push([1.25, i * 1.0 + 0.15], [1.25, i * 1.0 + 0.35], [0.9, i * 1.0 + 0.5], [0.9, i * 1.0 + 1.0]);
      shedProfile.push([0.5, 4.0], [0.5, 0]);
      const insulator = revolve(shedProfile.map(([r, y]) => [r, y]), 32);
      const insM = up ? frame(pol(D.R0, 225, insFrom), Z) : frame(pol(D.R0, 225, -insFrom), Z.clone().negate());
      add(q2, at(insulator, insM), 'ceramic', 'electrode');
      const capAt = pol(D.R0, 225, zs * (insFrom + 4.6));
      add(q2, at(disc(0.75, 1.2, 20), frame(capAt, Z)), 'bolt', 'electrode');
      hvEnds.push({ from: capAt.clone().add(V(0, 0, zs * 0.6)), up });
    }

    // ---------- Webcam on the q1 viewport ----------
    {
      const deg = 135, rdir = radial(deg), tdir = toroidal(deg);
      const face = L.flangeAt + L.t * 2;
      const cam = pol(43.5, deg, 0);
      add(q1, at(box(3, 7, 3), rtz(cam, deg)), 'black', 'camera');
      add(q1, at(disc(1.2, 1.6, 24), frame(cam.clone().add(rdir.clone().multiplyScalar(-2.3)), rdir)), 'black', 'camera');
      add(q1, at(disc(0.85, 0.12, 24), frame(cam.clone().add(rdir.clone().multiplyScalar(-3.15)), rdir)), 'glass', 'camera');
      add(q1, at(disc(0.2, 0.1, 10), frame(cam.clone().add(rdir.clone().multiplyScalar(1.52)).add(tdir.clone().multiplyScalar(2.4)).add(V(0, 0, 0.8)), rdir)), 'led', 'camera');
      for (const s of [-1, 1]) {
        const len = 43.5 + 1.5 - face;
        add(q1, at(box(len, 0.5, 1.6), rtz(pol(face + len / 2, deg, 0).add(tdir.clone().multiplyScalar(s * 3.75)), deg)), 'alu', 'camera');
      }
    }

    // Spectrometer fibre adaptor on the q2 viewport.
    const fibreFrom = pol(L.flangeAt + L.t * 2 + 0.9, 225, 0);
    add(q2, at(disc(0.7, 1.4, 20), frame(pol(L.flangeAt + L.t * 2 + 0.3, 225, 0), radial(225))), 'bolt', 'spectro');

    // ---------- Inner PF coils on hubs that slide on the solenoid column ----------
    function uChannel(R, webOuter) {
      const w = 1.5, h = 1.3, web = 0.3, ch = 0.3;
      let pts = [[-w, -h], [w, -h], [w, -h + ch], [-w + web, -h + ch], [-w + web, h - ch], [w, h - ch], [w, h], [-w, h], [-w, -h]];
      if (webOuter) pts = pts.map(([r, y]) => [-r, -y]);
      return revolve(pts.map(([r, y]) => [R + r, y]), 96);
    }
    function pfCoil(g, R, z, webOuter, part, tone) {
      const m = new THREE.Matrix4().makeRotationX(Math.PI / 2).setPosition(0, 0, z);
      add(g, at(uChannel(R, webOuter), m.clone()), 'alu', part);
      const wIn = webOuter ? R - 1.25 : R - 1.2, wOut = webOuter ? R + 1.2 : R + 1.25;
      add(g, at(ring(wIn, wOut, 2.0, 96), m.clone()), tone, part);
    }
    for (const up of [true, false]) {
      const zs = up ? 1 : -1;
      const g = group(up ? 'pfInnerUp' : 'pfInnerDown', V(0, 0, zs * 8.5), 0.18);
      pfCoil(g, D.pfIn.R, zs * D.pfIn.z, false, 'pfInner', 'tape');
      add(g, at(ring(D.sol.col, D.sol.col + 1.0, 1.4, 32), frame(V(0, 0, zs * D.pfIn.z), Z)), 'alu', 'pfInner');
      for (let i = 0; i < 4; i++) {
        const deg = 45 + i * 90;
        const len = D.pfIn.R - 1.5 - (D.sol.col + 1.0);
        add(g, at(box(len, 1.2, 0.8), rtz(pol(D.sol.col + 1.0 + len / 2, deg, zs * D.pfIn.z), deg)), 'alu', 'pfInner');
      }
    }

    // ---------- Outer PF coils and satellites, clamped to the posts ----------
    for (const up of [true, false]) {
      const zs = up ? 1 : -1;
      const g = group(up ? 'pfOuterUp' : 'pfOuterDown', V(0, 0, zs * (up ? 16 : 8)), 0.1);
      pfCoil(g, D.pfOut.R, zs * D.pfOut.z, true, 'pfOuter', 'tape');
      for (let i = 0; i < 4; i++) add(g, at(box(1.2, 2.4, 3.0), rtz(pol(D.pfOut.R + 1.5 + 0.6, i * 90, zs * D.pfOut.z), i * 90)), 'alu', 'pfOuter');
    }
    for (const up of [true, false]) {
      const zs = up ? 1 : -1;
      const g = group(up ? 'satUp' : 'satDown', V(0, 0, up ? 12 : -5), 0);
      const tor = new THREE.TorusGeometry(D.sat.R, D.sat.r, 20, 220);
      tor.deleteAttribute('uv');
      add(g, at(tor, new THREE.Matrix4().makeTranslation(0, 0, zs * D.sat.z)), 'hose', 'satellite');
      const tapes = [];
      for (let i = 0; i < 24; i++) {
        const c = ((i + 0.5) / 24) * Math.PI * 2;
        tapes.push(at(torusShell(D.sat.R, D.sat.r - 0.05, D.sat.r + 0.12, c - 0.012, c + 0.012, { nT: 24, nP: 2 }), new THREE.Matrix4().makeTranslation(0, 0, zs * D.sat.z)));
      }
      add(g, merge(tapes), 'tape', 'satellite');
      const clampFrom = D.sat.R + D.sat.r, clampTo = D.postR - 2;
      for (let i = 0; i < 4; i++) add(g, at(box(clampTo - clampFrom + 0.4, 2.8, 3.6), rtz(pol((clampFrom + clampTo) / 2 - 0.2, i * 90, zs * D.sat.z), i * 90)), 'alu', 'satellite');
    }

    // ---------- Solenoid column (stays put) ----------
    {
      const g = group('solenoid', V(0, 0, 0), 0);
      const Sd = D.sol, top = D.table.top;
      add(g, at(box(14, 14, 1), new THREE.Matrix4().makeTranslation(0, 0, top + 0.5)), 'alu', 'solenoid');
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) add(g, at(hex(0.9, 0.5), frame(V(sx * 5.8, sy * 5.8, top + 1.25), Z)), 'bolt', 'solenoid');
      const lower = -Sd.half - 0.8 - (top + 1);
      add(g, at(disc(Sd.col, lower, 28), frame(V(0, 0, top + 1 + lower / 2), Z)), 'alu', 'solenoid');
      add(g, at(flangeRing(Sd.col, Sd.rw + 0.4, 0.8, 48), frame(V(0, 0, -Sd.half - 0.4), Z)), 'alu', 'solenoid');
      add(g, at(flangeRing(Sd.col, Sd.rw + 0.4, 0.8, 48), frame(V(0, 0, Sd.half + 0.4), Z)), 'alu', 'solenoid');
      add(g, at(ring(Sd.col, Sd.rw, Sd.half * 2, 64), frame(V(0, 0, 0), Z)), 'tape', 'solenoid');
      for (let i = 1; i < 8; i++) add(g, at(ring(Sd.rw - 0.05, Sd.rw + 0.06, 0.18, 64), frame(V(0, 0, -Sd.half + (i * Sd.half * 2) / 8), Z)), 'copper', 'solenoid');
      const upperLen = Sd.top - (Sd.half + 0.8);
      add(g, at(disc(Sd.col, upperLen, 28), frame(V(0, 0, Sd.half + 0.8 + upperLen / 2), Z)), 'alu', 'solenoid');
      add(g, at(flangeRing(0.5, 3.5, 1.2, 40), frame(V(0, 0, Sd.top + 0.6), Z)), 'steel2', 'solenoid');
      addInst(g, hex(0.9, 0.55), 'bolt', circleMatrices(V(0, 0, Sd.top + 1.2 + 0.27), Z, V(1, 0, 0), V(0, 1, 0), 2.9, 6), 'solenoid');
      for (const s of [-1, 1]) {
        const x = s * 1.0;
        add(g, tube([V(x, Sd.rw - 0.1, Sd.half - 1.2), V(x, 7.0, Sd.half - 2.2), V(x, 7.3, 0), V(x, 7.3, -20), V(x, 6.6, top + 2.5), V(x, 6.6, top + 1)], 0.22, { seg: 48, radial: 8 }), 'black', 'solenoid');
      }
    }

    // ---------- Table, stands and posts ----------
    const TB = D.table;
    {
      const g = group('table', V(0, 0, 0), 0);
      add(g, at(box(TB.half * 2, TB.half * 2, TB.thick), new THREE.Matrix4().makeTranslation(0, 0, TB.top - TB.thick / 2)), 'table', 'table');
      add(g, at(box(TB.half * 2 - 1, TB.half * 2 - 1, 0.6), new THREE.Matrix4().makeTranslation(0, 0, TB.top - TB.thick - 0.3)), 'black', 'table');
      const holes = [];
      const pitch = 2.5;
      for (let i = -17; i <= 17; i++) for (let j = -17; j <= 17; j++) holes.push(new THREE.Matrix4().makeTranslation(i * pitch, j * pitch, TB.top + 0.01));
      const holeGeom = at(new THREE.CircleGeometry(0.32, 10).deleteAttribute('uv'), new THREE.Matrix4());
      const holeMesh = addInst(g, holeGeom, 'hole', holes, 'table');
      holeMesh.userData.sameInkAs = 'table';
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const lx = sx * TB.legAt, ly = sy * TB.legAt;
        const h = TB.top - TB.thick - 0.6 - (TB.floor + 2);
        add(g, at(box(TB.leg, TB.leg, h), new THREE.Matrix4().makeTranslation(lx, ly, TB.floor + 2 + h / 2)), 'black', 'table');
        add(g, at(disc(3.2, 2, 24), frame(V(lx, ly, TB.floor + 1), Z)), 'ink', 'table');
        add(g, at(box(TB.leg + 1.2, TB.leg + 1.2, 1.2), new THREE.Matrix4().makeTranslation(lx, ly, TB.top - TB.thick - 1.2)), 'black', 'table');
      }
      const inner = TB.legAt - TB.leg / 2;
      for (const s of [-1, 1]) {
        add(g, at(box(inner * 2, 4, 5), new THREE.Matrix4().makeTranslation(0, s * TB.legAt, TB.shelf - 2.5)), 'black', 'table');
        add(g, at(box(4, inner * 2, 5), new THREE.Matrix4().makeTranslation(s * TB.legAt, 0, TB.shelf - 2.5)), 'black', 'table');
      }
      add(g, at(box(inner * 2, inner * 2, 1.2), new THREE.Matrix4().makeTranslation(0, 0, TB.shelf + 0.6)), 'panel', 'table');
      const plate = V(TB.half + 0.06, 0, TB.top - TB.thick / 2);
      add(g, at(box(0.12, 14, 3.4), new THREE.Matrix4().makeTranslation(plate.x, plate.y, plate.z)), 'brass', 'table');
      for (let i = 0; i < 3; i++) add(g, at(box(0.06, i === 0 ? 10 : 7, 0.18), new THREE.Matrix4().makeTranslation(plate.x + 0.08, i === 0 ? 0 : -1.5, plate.z + 0.9 - i * 0.9)), 'ink', 'table');
      for (const sy of [-1, 1]) for (const sz of [-1, 1]) add(g, at(disc(0.22, 0.06, 10), frame(V(plate.x + 0.07, sy * 6.3, plate.z + sz * 1.2), V(1, 0, 0))), 'ink', 'table');

      for (let i = 0; i < 4; i++) {
        const deg = i * 90;
        const h = -J.R - TB.top;
        add(g, at(box(4, 4, h - 0.8), rtz(pol(D.R0, deg, TB.top + (h - 0.8) / 2), deg)), 'alu', 'stand');
        add(g, at(box(5.4, 5.4, 0.8), rtz(pol(D.R0, deg, -J.R - 0.4), deg)), 'alu', 'stand');
        add(g, at(box(6, 6, 0.6), rtz(pol(D.R0, deg, TB.top + 0.3), deg)), 'alu', 'stand');
        for (const s of [-1, 1]) add(g, at(box(0.7, 0.1, h - 1.6), rtz(pol(D.R0, deg, TB.top + (h - 0.8) / 2).add(toroidal(deg).multiplyScalar(s * 2.03)), deg)), 'slot', 'stand');
      }

      for (let i = 0; i < 4; i++) {
        const deg = i * 90;
        const h = 24 - TB.top;
        const c = pol(D.postR, deg, TB.top + h / 2);
        add(g, at(box(4, 4, h), rtz(c, deg)), 'alu', 'posts');
        add(g, at(box(4.2, 4.2, 0.5), rtz(pol(D.postR, deg, 24.25), deg)), 'black', 'posts');
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const o = radial(deg).multiplyScalar(dx * 2.03).add(toroidal(deg).multiplyScalar(dy * 2.03));
          add(g, at(box(dx ? 0.1 : 0.7, dy ? 0.1 : 0.7, h - 1.2), rtz(c.clone().add(o), deg)), 'slot', 'posts');
        }
        add(g, at(box(4.5, 0.5, 4), rtz(pol(D.postR - 4.25, deg, TB.top + 2), deg)), 'alu', 'posts');
        add(g, at(box(4.5, 3, 0.5), rtz(pol(D.postR - 4.25, deg, TB.top + 0.25), deg)), 'alu', 'posts');
        for (const z of [-D.pfOut.z, D.pfOut.z]) {
          const from = D.pfOut.R + 1.5 + 1.2, to = D.postR - 2;
          add(g, at(box(to - from, 2.0, 2.0), rtz(pol((from + to) / 2, deg, z), deg)), 'alu', 'posts');
        }
      }
    }

    // ---------- Supplies on the shelf, HV supply, PLC and E-stop ----------
    let spectroIn;
    {
      const g = group('rack', V(0, 0, 0), 0);
      const base = TB.shelf + 1.2;
      const front = 26;
      const chassis = (zFrom, h, y0, y1, part) => {
        const depth = 30;
        add(g, at(box(depth, y1 - y0, h), new THREE.Matrix4().makeTranslation(front - depth / 2, (y0 + y1) / 2, zFrom + h / 2)), 'black', part);
      };
      chassis(base, 13, -28, 28, 'supplies');
      const mod = (y, w, zFrom, h, part, label) => {
        const cx = front + 0.2;
        add(g, at(box(0.4, w - 0.3, h - 0.6), new THREE.Matrix4().makeTranslation(cx, y, zFrom + h / 2)), 'panel', part);
        const lcd = add(g, at(box(0.15, w - 2.2, 1.6), new THREE.Matrix4().makeTranslation(cx + 0.27, y, zFrom + h - 2.6)), 'lcd', part);
        lcd.userData.lcd = true;
        add(g, at(disc(0.85, 0.9, 20), frame(V(cx + 0.65, y, zFrom + h / 2 - 0.6), V(1, 0, 0))), 'ink', part);
        add(g, at(disc(0.18, 0.12, 8), frame(V(cx + 1.15, y, zFrom + h / 2 + 0.25), V(1, 0, 0))), 'bolt', part);
        for (const s of [-1, 1]) add(g, at(disc(0.38, 0.9, 12), frame(V(cx + 0.65, y + s * (w / 2 - 1.3), zFrom + 1.5), V(1, 0, 0))), s < 0 ? 'red' : 'ink', part);
        if (label) add(g, at(box(0.06, w - 1.6, 0.9), new THREE.Matrix4().makeTranslation(cx + 0.23, y, zFrom + h - 0.9)), label, part);
      };
      for (let i = 0; i < 8; i++) mod(-28 + 3.5 + i * 7, 7, base, 13, 'supplies');
      const top2 = base + 13;
      chassis(top2, 11, -28, 14, 'supplies');
      for (let i = 0; i < 6; i++) mod(-28 + 3.5 + i * 7, 7, top2, 11, 'supplies');
      add(g, at(box(28, 14, 11), new THREE.Matrix4().makeTranslation(front - 14, 21, top2 + 5.5)), 'black', 'hv');
      mod(21, 14, top2, 11, 'hv', 'yellow');
      add(g, at(disc(0.9, 1.4, 20), frame(V(front + 0.9, 25, top2 + 3.2), V(1, 0, 0))), 'red', 'hv');

      const plc = V(36, 12, TB.top + 3);
      add(g, at(box(12, 8, 6), new THREE.Matrix4().makeTranslation(plc.x, plc.y, plc.z)), 'panel', 'plc');
      for (let i = 0; i < 6; i++) add(g, at(box(1.4, 7.2, 1.0), new THREE.Matrix4().makeTranslation(plc.x - 4.0 + i * 1.6, plc.y, plc.z + 3.5)), 'alu', 'plc');
      for (let i = 0; i < 4; i++) {
        const led = add(g, at(box(0.1, 0.5, 0.5), new THREE.Matrix4().makeTranslation(plc.x + 6.06, plc.y - 2.4 + i * 1.3, plc.z + 1.2)), 'led', 'plc');
        led.userData.led = true;
      }
      const es = V(37, 27, TB.top + 2.5);
      add(g, at(box(8, 8, 5), new THREE.Matrix4().makeTranslation(es.x, es.y, es.z)), 'yellow', 'plc');
      add(g, at(disc(1.0, 1.4, 20), frame(V(es.x, es.y, es.z + 3.2), Z)), 'ink', 'plc');
      add(g, at(revolve([[0, 0], [2.0, 0], [2.0, 0.7], [1.6, 1.3], [0, 1.4]], 40), frame(V(es.x, es.y, es.z + 3.9), Z)), 'red', 'plc');
      add(g, tube([V(plc.x + 1, plc.y + 4, plc.z + 1), V(plc.x + 1.5, plc.y + 8, plc.z + 0.5), V(es.x - 1, es.y - 4, es.z - 1)], 0.3, { seg: 20, radial: 8 }), 'black', 'plc');

      add(g, at(box(8, 6, 5), rtz(hvBox, 225)), 'panel', 'hv');
      add(g, at(box(3, 4, 0.06), rtz(pol(52, 225, hvBox.z + 2.53), 225)), 'yellow', 'hv');
      add(g, at(disc(0.7, 0.8, 16), frame(pol(45.6, 225, hvBox.z - 1.2), radial(225).negate())), 'bolt', 'hv');
      add(g, at(disc(0.7, 0.8, 16), frame(pol(48.5, 225, hvBox.z + 2.9), Z)), 'bolt', 'hv');

      const spec = V(-36, -10, TB.top + 2.5);
      add(g, at(box(9, 14, 5), new THREE.Matrix4().makeTranslation(spec.x, spec.y, spec.z)), 'panel', 'spectro');
      add(g, at(box(9.2, 0.15, 1.4), new THREE.Matrix4().makeTranslation(spec.x, spec.y + 7.06, spec.z + 1.2)), 'ink', 'spectro');
      add(g, at(disc(0.6, 1.0, 16), frame(V(spec.x, spec.y - 7.4, spec.z - 0.6), V(0, -1, 0))), 'bolt', 'spectro');
      spectroIn = V(spec.x, spec.y - 7.9, spec.z - 0.6);
    }

    // ---------- Rotary vane pump on the floor ----------
    const pumpGroup = group('pump', radial(D.pump.phi).multiplyScalar(12), 0.12);
    let pumpInlet;
    {
      const g = new THREE.Group();
      g.position.copy(pol(D.pump.R, D.pump.phi, TB.floor));
      g.rotation.z = D.pump.phi * DEG;
      pumpGroup.add(g);
      add(g, at(box(16, 34, 1.2), new THREE.Matrix4().makeTranslation(0, -1, 1.6)), 'black', 'pump');
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) add(g, at(disc(1.3, 1.0, 16), frame(V(sx * 6, -1 + sy * 14, 0.5), Z)), 'ink', 'pump');
      const mz = 2.2 + 7.2;
      add(g, at(disc(7, 18, 48), frame(V(0, -7, mz), V(0, 1, 0))), 'pumpblue', 'pump');
      for (let i = 0; i < 14; i++) {
        const a = Math.PI * (0.08 + (0.84 * i) / 13);
        add(g, at(box(0.9, 16, 0.3), frame(V(7.4 * Math.cos(a), -7, mz + 7.4 * Math.sin(a)), V(0, 1, 0), V(Math.cos(a), 0, Math.sin(a)))), 'pumpblue', 'pump');
      }
      add(g, at(disc(7.4, 3, 48), frame(V(0, -17.5, mz), V(0, 1, 0))), 'black', 'pump');
      for (let i = 0; i < 4; i++) add(g, at(ring(1.5 + i * 1.5, 1.9 + i * 1.5, 0.3, 40), frame(V(0, -19.1, mz), V(0, 1, 0))), 'ink', 'pump');
      add(g, at(box(13, 12, 16), new THREE.Matrix4().makeTranslation(0, 8, 2.2 + 8)), 'pumpblue', 'pump');
      add(g, at(disc(1.4, 0.5, 24), frame(V(6.7, 8, 6.5), V(1, 0, 0))), 'oil', 'pump');
      add(g, at(ring(1.4, 1.9, 0.5, 24), frame(V(6.7, 8, 6.5), V(1, 0, 0))), 'bolt', 'pump');
      add(g, at(ring(1.4, 1.65, 6, 28), frame(V(0, 8, 18.2 + 3), Z)), 'steel', 'pump');
      add(g, at(ring(1.4, 2.6, 0.6, 28), frame(V(0, 8, 24.5), Z)), 'steel2', 'pump');
      add(g, at(ring(1.9, 2.3, 0.9, 28), frame(V(0, 8, 24.5), Z)), 'bolt', 'pump');
      add(g, at(disc(2.6, 7.8, 32), frame(V(-4.5, 4.5, 18.2 + 3.9), Z)), 'black', 'pump');
      add(g, at(disc(2.8, 0.8, 32), frame(V(-4.5, 4.5, 26.4), Z)), 'panel', 'pump');
      for (const y of [3, 13]) add(g, at(box(1, 1, 3), new THREE.Matrix4().makeTranslation(4.5, y, 19.7)), 'black', 'pump');
      add(g, at(disc(0.5, 11, 12), frame(V(4.5, 8, 21.3), V(0, 1, 0))), 'black', 'pump');
      g.updateMatrix();
      pumpInlet = V(0, 8, 24.8).applyMatrix4(g.matrix);
    }

    // ---------- Lines that span two groups, rebuilt as the machine comes apart ----------
    function stretchLine(parentName, points, r, tone, part, o, ends) {
      const holder = group(parentName, V(0, 0, 0), 0);
      const mesh = add(holder, tube(points, r, o), tone, part);
      stretch.push({ mesh, points: points.map((p) => p.clone()), r, o, ends });
      return mesh;
    }

    const hoseFrom = pol(46.95, 315, 0);
    const pd = toroidal(315);
    stretchLine('hose', [
      hoseFrom, pol(53, 315, -0.3), pol(60, 315, -4), pol(66, 315, -16),
      pol(70, 315, -40).add(pd.clone().multiplyScalar(4)), pol(76, 315, -62).add(pd.clone().multiplyScalar(7)),
      pumpInlet.clone().add(V(0, 0, 6)), pumpInlet.clone(),
    ], 1.75, 'steel', 'hose', { seg: 420, radial: 14, corrugate: 0.22, pitch: 1.1 }, ['quarter3', 'pump']);

    const gasTo = pol(58, 315, TB.top + 0.5);
    stretchLine('gasline', [pol(41, 315, -7.8), pol(41, 315, -18), pol(42, 315, -28.8), pol(48, 315, TB.top + 0.5), gasTo], 0.28, 'brass', 'needle', { seg: 40, radial: 8 }, ['quarter3', 'table']);
    add(groups.find((x) => x.obj.name === 'table').obj, at(box(2.4, 2.4, 1.6), rtz(gasTo.clone().add(radial(315).multiplyScalar(1.2)).add(V(0, 0, 0.3)), 315)), 'brass', 'needle');

    for (const e of hvEnds) {
      const f = e.from;
      const hz = hvBox.z;
      const pts = e.up
        ? [f, f.clone().add(V(0, 0, 1.6)), pol(26.5, 225, 21.6), pol(33, 225, 19.2), pol(42, 225, 13), pol(46.5, 225, 0), pol(48.5, 225, -16), pol(48.5, 225, hz + 6), pol(48.5, 225, hz + 3.3)]
        : [f, f.clone().add(V(0, 0, -3)), pol(25, 225, hz - 1.2), pol(36, 225, hz - 1.2), pol(43, 225, hz - 1.2), pol(45.2, 225, hz - 1.2)];
      stretchLine('hvcable', pts, 0.42, 'pink', 'electrode', { seg: 60, radial: 10 }, ['quarter2', 'rack']);
    }

    stretchLine('fibre', [fibreFrom, pol(41.5, 225, 0), pol(44, 222, -6), pol(44.6, 214, -16), V(-36, -22, TB.top + 1.9), spectroIn.clone().add(V(0, -1.8, 0)), spectroIn], 0.3, 'yellow', 'spectro', { seg: 60, radial: 8 }, ['quarter2', 'rack']);

    // Points the home view frames: the machine and the table top. Zooming out shows the stand, rack and pump.
    const fit = [
      V(TB.half, TB.half, TB.top - TB.thick), V(-TB.half, -TB.half, TB.top - TB.thick), V(TB.half, -TB.half, TB.top - TB.thick), V(-TB.half, TB.half, TB.top - TB.thick),
      V(TB.half, TB.half, 26), V(-TB.half, -TB.half, 26), V(TB.half, -TB.half, 26), V(-TB.half, TB.half, 26),
    ];
    const fitAll = [
      ...fit,
      V(TB.half, TB.half, TB.floor), V(-TB.half, -TB.half, TB.floor), V(TB.half, -TB.half, TB.floor), V(-TB.half, TB.half, TB.floor),
      pol(D.pump.R + 10, D.pump.phi, TB.floor), pol(D.pump.R + 10, D.pump.phi, TB.floor + 28),
    ];

    return { root: rootGroup, groups, stretch, fit, fitAll, dims: D, tube, frames: { pol, radial, toroidal } };
  }

  root.SPM1Device = { build, dims: D };
})(typeof window !== 'undefined' ? window : globalThis);
