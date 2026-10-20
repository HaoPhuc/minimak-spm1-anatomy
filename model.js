// Physics model behind every number on the anatomy page.
// Same formulas and assumptions as minimak-groundwork/docs/primer.md; loaded as a classic script so the page opens from file://.
(function (root) {
  const MU0 = 4e-7 * Math.PI;
  const QE = 1.602176634e-19;
  const ME = 9.1093837015e-31;
  const AMU = 1.66053906660e-27;
  const KB = 1.380649e-23;
  const EPS0 = 8.8541878128e-12;

  const DEVICE = {
    R0: 0.23,
    a: 0.075,
    tfCoils: 8,
    turnsPerCoil: 50,
    tfMaxA: 40,
    pfMaxA: 40,
    dischargeKV: 4,
    ecrGHz: 2.45,
  };

  const GASES = {
    N2: { label: 'N₂', ion: 'N₂⁺', ionAmu: 28, sigma: 1e-19, lines: '337 nm and 391 nm (N₂⁺) bands', core: '#d9d2ff', rim: '#7a5cff' },
    He: { label: 'He', ion: 'He⁺', ionAmu: 4, sigma: 6e-20, lines: '588, 668 and 706 nm lines', core: '#ffe0cc', rim: '#ff6f5e' },
  };

  const ASSUME = { Te: 3, Ti: 0.1, ne: 1e16, Tgas: 300 };

  function fieldAt(R, amps) {
    return (MU0 * DEVICE.tfCoils * DEVICE.turnsPerCoil * amps) / (2 * Math.PI * R);
  }

  function gyroradius(massKg, energyEV, B) {
    if (B <= 0) return Infinity;
    const v = Math.sqrt((2 * energyEV * QE) / massKg);
    return (massKg * v) / (QE * B);
  }

  function state(input) {
    const tfA = input.tfA;
    const gas = GASES[input.gas] || GASES.N2;
    const pressureMbar = input.pressureMbar;
    const { Te, Ti, ne, Tgas } = ASSUME;

    const B0 = fieldAt(DEVICE.R0, tfA);
    const Bin = fieldAt(DEVICE.R0 - DEVICE.a, tfA);
    const Bout = fieldAt(DEVICE.R0 + DEVICE.a, tfA);

    const rLe = gyroradius(ME, Te, B0);
    const rLi = gyroradius(gas.ionAmu * AMU, Ti, B0);

    // grad-B plus curvature drift in a vacuum toroidal field, averaged over a Maxwellian: v = 2T / (qBR)
    const vDrift = B0 > 0 ? (2 * Te) / (B0 * DEVICE.R0) : Infinity;
    const tCross = B0 > 0 ? DEVICE.a / vDrift : 0;

    const wce = (QE * B0) / ME;
    const nGas = (pressureMbar * 100) / (KB * Tgas);
    const vTe = Math.sqrt((2 * Te * QE) / ME);
    const nu = nGas * gas.sigma * vTe;
    const hall = nu > 0 ? wce / nu : Infinity;

    const lambdaD = Math.sqrt((EPS0 * Te) / (ne * QE));
    const ecrB = (2 * Math.PI * DEVICE.ecrGHz * 1e9 * ME) / QE;

    return {
      tfA, pfA: input.pfA, pressureMbar, gas, Te, Ti, ne,
      B0, Bin, Bout, rLe, rLi, vDrift, tCross, wce, nu, hall, lambdaD, ecrB,
      magnetised: hall > 1,
    };
  }

  // Shape of the glow for the drawing only. These are not measured quantities and the page labels them that way.
  function glowLook(s, on) {
    if (!on) return { intensity: 0, minor: 6.2, shiftZ: 0, striation: 0 };
    const p = s.pressureMbar;
    const lit = Math.min(1, Math.max(0, (Math.log10(p) + 2.2) / 1.2)) * Math.min(1, Math.max(0, (0.6 - Math.log10(p)) / 0.9));
    const squeeze = Math.min(1, Math.log10(1 + Math.max(0, s.hall)) / 1.3);
    return {
      intensity: 0.35 + 0.65 * lit,
      minor: 6.2 - 2.4 * squeeze,
      shiftZ: (2.4 * s.pfA) / DEVICE.pfMaxA,
      striation: s.B0 > 0.006 && p > 0.03 && p < 0.9 ? Math.min(1, (s.B0 - 0.006) / 0.006) : 0,
    };
  }

  function fmtField(T) {
    if (T === 0) return '0 mT';
    return `${(T * 1e3).toFixed(T < 0.01 ? 2 : 1)} mT`;
  }

  function fmtLength(m) {
    if (!isFinite(m)) return '∞';
    if (m < 1e-3) return `${(m * 1e6).toFixed(0)} µm`;
    if (m < 1e-2) return `${(m * 1e3).toFixed(2)} mm`;
    if (m < 1) return `${(m * 1e3).toFixed(1)} mm`;
    return `${m.toFixed(2)} m`;
  }

  function fmtSpeed(v) {
    if (!isFinite(v)) return '—';
    return v >= 1000 ? `${(v / 1000).toFixed(1)} km/s` : `${v.toFixed(0)} m/s`;
  }

  function fmtTime(t) {
    if (!t) return '—';
    return t < 1e-3 ? `${(t * 1e6).toFixed(0)} µs` : `${(t * 1e3).toFixed(1)} ms`;
  }

  function fmtSci(x, digits = 1) {
    if (!isFinite(x)) return '∞';
    if (x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)));
    const m = x / Math.pow(10, e);
    const sup = String(e).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    return `${m.toFixed(digits)} × 10${sup}`;
  }

  root.MinimakModel = { DEVICE, GASES, ASSUME, fieldAt, gyroradius, state, glowLook, fmtField, fmtLength, fmtSpeed, fmtTime, fmtSci };
})(typeof window !== 'undefined' ? window : globalThis);
