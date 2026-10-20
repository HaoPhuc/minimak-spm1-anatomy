// One entry per numbered part on the anatomy page.
// `basis` says where the geometry comes from: "spec" (Rideo / minitmak.com numbers), "photo" (scaled from photos), "assumed" (placed where it is plausible).
(function (root) {
  const PARTS = [
    {
      id: 'plasma', name: 'Glow-discharge plasma', group: 'Plasma', basis: 'assumed',
      spec: 'N₂ or He, about 1–5 eV, a few Pa to ~100 Pa fill',
      text: 'The subject. A 4 kV pulsed supply breaks the gas down into a glow. The toroidal field magnetises the electrons, which brightens and shapes the glow and brings out striations. With no plasma current it is a simple magnetised torus, not a tokamak.',
      know: 'Fill pressure decides whether the field matters: electrons are magnetised (ω_ce/ν > 1) around 0.1 mbar but barely at 1 mbar. Watch the readout as you move the pressure slider.',
    },
    {
      id: 'vessel', name: 'Vacuum vessel', group: 'Vacuum', basis: 'spec',
      spec: 'Four 150 mm stainless elbows; R₀ = 23 cm, a = 7.5 cm; ring Ø 460 mm',
      text: 'Four standard 150 mm quarter-elbows, TIG welded to ConFlat flanges and bolted into a ring. Pressure tested to 10⁻⁹ mbar.',
      know: 'Viewports can implode, so vent slowly. Pump-down behaviour is the first thing to learn: base pressure, how long it takes, and what a leak looks like on the gauge.',
    },
    {
      id: 'joints', name: 'ConFlat joint flanges', group: 'Vacuum', basis: 'photo',
      spec: '4 joints, ~200 mm OD flanges, 20 bolts each, copper gasket',
      text: 'Each joint is a pair of knife-edge ConFlat flanges that bite into a soft copper gasket. Take the machine apart to see the gasket between the flanges.',
      know: 'Use a new copper gasket every time a ConFlat seal is opened, and tighten the bolts in a star pattern in small steps.',
    },
    {
      id: 'tf', name: 'Toroidal field coils', group: 'Magnets', basis: 'spec',
      spec: '8 coils × 50 turns of 6 mm copper cable; up to 40 A each, CW',
      text: 'Wound directly onto copper formers clamped to the vessel. Each coil has its own supply. Together they make the toroidal field B = μ₀NI / 2πR, which falls off as 1/R across the vessel.',
      know: 'At 40 A the windings heat up in continuous mode. Switching an inductive coil off fast gives a voltage spike. Check polarity: all eight must push field the same way round.',
    },
    {
      id: 'pfInner', name: 'Inner poloidal coils PF1, PF2', group: 'Magnets', basis: 'assumed',
      spec: 'Above and below the vessel, independent supplies up to 40 A',
      text: 'Wound onto metal formers above and below the chamber. Driven together they add a vertical field that moves the glow up or down (the slides call this dipole position control).',
      know: 'With no plasma current the PF coils can only shift the plasma, not hold it. That is the lesson of the drift demo.',
    },
    {
      id: 'pfOuter', name: 'Outer poloidal coils PF3, PF4', group: 'Magnets', basis: 'assumed',
      spec: 'Above and below the vessel, independent supplies',
      text: 'The second pair of the four PF coils. The public pages say four PF coils at top and bottom but not their radii, so the inner and outer split here is a guess.',
      know: 'Ask at the kickoff for coil inductances, turns and the maximum pulsed current.',
    },
    {
      id: 'satellite', name: 'Satellite PF coils', group: 'Magnets', basis: 'photo',
      spec: '2 larger hose-wound rings, further out above and below',
      text: 'The black rings in every photo: cable wound in a flexible sleeve and held off the table on aluminium posts.',
      know: 'Tens of mT near the coils: keep anyone with a pacemaker or implant out of the coil area and steel tools away.',
    },
    {
      id: 'solenoid', name: 'Central solenoid', group: 'Magnets', basis: 'spec',
      spec: 'Low voltage, AC or DC drive, through the hole of the torus',
      text: 'The transformer of a tokamak. A changing solenoid current induces a toroidal loop voltage around the plasma, which is how real tokamaks drive plasma current.',
      know: 'A Rogowski coil (planned) would measure any current it drives. An HTS solenoid is on the upgrade list.',
    },
    {
      id: 'viewport', name: 'Lateral viewports', group: 'Diagnostics', basis: 'spec',
      spec: '3 lateral viewing ports, DN63 CF windows',
      text: 'Glass windows on the outboard side of three quarters, for the camera, the spectrometer fibre and your eyes.',
      know: 'N₂ plasma emits strongly at 337 nm. Do not stare at it through quartz windows.',
    },
    {
      id: 'vport', name: 'Pumping port and tee', group: 'Vacuum', basis: 'spec',
      spec: '1 vacuum port, reducer, tee and KF clamp',
      text: 'The fourth lateral port carries the pump line, the pressure gauge and the gas inlet.',
      know: 'KF clamps need a centring ring with an O-ring. ConFlat is metal sealed; KF is not.',
    },
    {
      id: 'gauge', name: 'Vacuum gauge', group: 'Vacuum', basis: 'assumed',
      spec: 'Pirani-type gauge with display (type to confirm)',
      text: 'Reads the fill pressure that sets everything else. The exact gauge type is not public.',
      know: 'A Pirani reading depends on the gas: N₂ and He read differently at the same true pressure. Learn the correction.',
    },
    {
      id: 'needle', name: 'Gas needle valve', group: 'Vacuum', basis: 'assumed',
      spec: 'Fine leak valve for N₂ or He',
      text: 'Bleeds gas in against the pump so the pressure settles at the fill you want.',
      know: 'Set fill pressure in mbar and log it with every shot (1 mbar = 100 Pa). Gas bottles must be secured.',
    },
    {
      id: 'hose', name: 'Bellows pump line', group: 'Vacuum', basis: 'photo',
      spec: 'Corrugated stainless KF hose',
      text: 'The flexible line from the tee to the pump inlet, seen on the right of the photos.',
      know: 'Bend it gently: kinked bellows crack and leak.',
    },
    {
      id: 'pump', name: 'Rotary vane pump', group: 'Vacuum', basis: 'photo',
      spec: 'Oil-sealed rotary vane; turbopump planned',
      text: 'Roughs the vessel to the pressure range a glow discharge needs. A turbopump is on the upgrade list.',
      know: 'The exhaust carries oil mist. Check the oil level in the sight glass.',
    },
    {
      id: 'diagPort', name: 'Diagnostic ports', group: 'Diagnostics', basis: 'spec',
      spec: '4 small ports top and bottom, looking through the plasma',
      text: 'Vertical lines of sight through the plasma: the laser diagnostics port, the Langmuir probe and the two discharge electrodes are placed on them here.',
      know: 'Which port carries which feedthrough is a guess on this page. Ask at the kickoff.',
    },
    {
      id: 'probe', name: 'Langmuir probe', group: 'Diagnostics', basis: 'assumed',
      spec: 'Biased wire tip on a linear feedthrough',
      text: 'A small wire tip pushed into the plasma and swept in voltage. Its I–V curve gives T_e, V_f, V_p and n_e. Open the cutaway to see the tip in the glow.',
      know: 'In a magnetic field the electron side of the curve is distorted, so trust the ion side more. minimak-groundwork/analysis/langmuir_fit.py does the fit.',
    },
    {
      id: 'electrode', name: 'Glow discharge electrodes', group: 'Power', basis: 'assumed',
      spec: 'Dual-electrode feedthroughs, 4 kV pulsed',
      text: 'Two insulated HV feedthroughs drive the glow. Their real position is not public.',
      know: 'Rely on the PLC interlocks and never bypass them. Touch electrodes only with the supply off and grounded.',
    },
    {
      id: 'camera', name: 'Camera', group: 'Diagnostics', basis: 'spec',
      spec: 'Webcam with vision-based position and shape tracking',
      text: 'Watches the glow through a viewport. The GUI tracks the plasma position and shape in real time.',
      know: 'Basic image processing (threshold, centroid, contour) turns this into a position measurement.',
    },
    {
      id: 'spectro', name: 'Spectrometer', group: 'Diagnostics', basis: 'spec',
      spec: 'Wide-band UV–visible, fibre-coupled',
      text: 'A fibre looks into the glow through a viewport and carries the light to the spectrometer.',
      know: 'Identify lines against the NIST atomic spectra database.',
    },
    {
      id: 'stand', name: 'Vessel stands', group: 'Structure', basis: 'assumed',
      spec: '4 pedestals under the joints',
      text: 'Hold the ring by its joint flanges above the table.',
      know: '',
    },
    {
      id: 'posts', name: 'Coil posts and arms', group: 'Structure', basis: 'photo',
      spec: 'Aluminium 40 × 40 extrusions',
      text: 'Slotted aluminium posts on the table carry the outer PF and satellite coils.',
      know: '',
    },
    {
      id: 'table', name: 'Optical table', group: 'Structure', basis: 'photo',
      spec: 'Breadboard top, 25 mm M6 grid; whole system in 90 × 90 × 160 cm',
      text: 'An optical table in the photos, with the pump and supplies underneath. The whole system fits a 90 × 90 × 160 cm envelope and runs from one mains supply.',
      know: '',
    },
    {
      id: 'supplies', name: 'Coil power supplies', group: 'Power', basis: 'spec',
      spec: 'Independent switch-mode supplies, up to 40 A per coil',
      text: 'One variable low-voltage supply per coil, so every TF and PF coil can be driven on its own.',
      know: 'Coils are inductive: ramp the current down before switching off.',
    },
    {
      id: 'hv', name: 'HV discharge supply', group: 'Power', basis: 'spec',
      spec: '4 kV pulsed glow supply',
      text: 'Drives the glow through the electrodes.',
      know: 'High voltage. Interlocked by the PLC.',
    },
    {
      id: 'plc', name: 'PLC interlock and E-stop', group: 'Power', basis: 'spec',
      spec: 'PLC safety monitor; .NET GUI, Python, MATLAB, LabVIEW, Arduino',
      text: 'The PLC watches the interlocks and can drop the HV and coil supplies. The red button stops everything.',
      know: 'Never bypass an interlock. Learn the DAQ data format and API before writing scripts against it.',
    },
  ];
  PARTS.forEach((p, i) => { p.n = i + 1; });
  root.SPM1_PARTS = PARTS;
})(typeof window !== 'undefined' ? window : globalThis);
