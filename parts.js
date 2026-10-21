// The documentation behind the anatomy page: the sources, then one entry per component.
// Every spec row names the source it comes from. `basis` says how far to trust the drawn geometry:
//   "spec"    the number or the placement is published (minitmak.com, Rideo, the webinar text)
//   "photo"   scaled or placed from the photos in the Oct 2025 webinar
//   "assumed" placed where it is plausible; the real part may differ
// Loaded as a classic script so the page opens straight from file://.
(function (root) {
  const SOURCES = [
    {
      id: 'S1', short: 'minitmak.com',
      title: 'Minimak Modular Magnetic Torus, home page',
      who: 'Rideo Systems Ltd', url: 'https://www.minitmak.com/',
      gives: 'Vessel of four standard 150 mm quarters forming a 460 mm circle; 3 lateral viewing ports, 1 vacuum port, 4 diagnostic ports that look through the plasma; 8 TF magnets mounted on the chamber, 50 turns of 6 mm copper cable, 40 A continuous and several times that pulsed; a solenoid at the centre; 4 PF coils at top and bottom plus a further pair above and below; independent variable switch-mode supplies; dual-electrode AC discharge; optional 2.45 GHz magnetron; webcam, Hall sensors, Langmuir probe, spectrometer; .NET, Python and LabVIEW, microcontrollers and PLCs.',
    },
    {
      id: 'S2', short: 'minitmak.com/specification',
      title: 'SPM1 Simple Magnetised Torus, specification',
      who: 'Rideo Systems Ltd', url: 'https://www.minitmak.com/specification',
      gives: 'Major radius 23 cm, minor radius 7.5 cm; 8 TF coils each with its own supply, 0.025 T continuous and up to 0.1 T pulsed; 4 PF coils independently controlled; low-voltage solenoid with AC and DC drive; glow discharge from variable HV and RF sources in N₂ or He; plasma 1–5 eV; 90 × 90 × 160 cm envelope from a single mains supply; UV–VIS spectrometer, Langmuir probe, Hall magnetometer, cameras with position and shape tracking, laser diagnostics port.',
    },
    {
      id: 'S3', short: 'rideosystems.biz',
      title: 'Technology: SPM1 Table Top Tokamak',
      who: 'Rideo Systems Ltd', url: 'https://www.rideosystems.biz/technology',
      gives: 'The same headline specification as S2, and that the machine is modular and upgradeable for teaching E×B, J×B, cross-field and instability effects.',
    },
    {
      id: 'S4', short: 'Apte, webinar 2025',
      title: 'P. Apte, “The Minimak. Design, Build and Operation”, webinar for new Fusion CDT students, University of Manchester, October 2025 (31 slides, PDF)',
      who: 'Rideo Systems Ltd', url: 'https://www.minitmak.com/_files/ugd/5de522_5cee74b6dc514f1eb1a3fee4cb50b9e4.pdf',
      gives: 'Slides 12–13 specification. Slide 14: vessel TIG welded, ConFlat seals, pressure tested to 10⁻⁹ mbar. Slide 15: TF coils wound directly onto copper formers on the chamber; PF coils on metal formers above and below, with two larger satellite PF coils. Slide 16: rotary vane pump, pressure gauge, N₂ glow test. Slide 17: low-voltage supplies up to 40 A per coil, 4 kV pulsed glow supplies, DC solenoid drive, PLC safety monitor, video and webcam, wide-band spectrometer, networked digital I/O and DAQ. Slide 18: .NET interface, LabVIEW option, Python and MATLAB, Arduino and Raspberry Pi. Slide 20: anode electrode and chamber cathode. Slides 22–27: demonstrations at TF 15–20 mT and PF1&2 5 mT. Slide 28: upgrade list. The photos on slides 9, 12–16 and 19 set most of the proportions drawn here.',
    },
    {
      id: 'S5', short: 'Lesker, CF flanges',
      title: 'ConFlat flange technical notes',
      who: 'Kurt J. Lesker Company', url: 'https://www.lesker.com/newweb/flanges/flanges_technicalnotes_conflat_1.cfm',
      gives: 'CF flanges are named by outside diameter: 2¾″ (DN40), 4½″ (DN63), 6″ (DN100), 8″ (DN160). The bolt counts and thicknesses drawn here are the usual CF values for those sizes and match the bolt counts in the photos.',
    },
    {
      id: 'S6', short: 'Vacuum flange',
      title: 'Vacuum flange (ConFlat and KF)',
      who: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Vacuum_flange',
      gives: 'How a CF knife edge bites into a soft copper gasket to make an all-metal seal, and how a KF joint uses a clamp, a centring ring and an elastomer O-ring.',
    },
    {
      id: 'S7', short: 'MKS Convectron',
      title: 'Granville-Phillips 275 Mini-Convectron gauge',
      who: 'MKS Instruments', url: 'https://www.mks.com/p/275600-0-GD-T',
      gives: 'The Convectron family are convection-enhanced Pirani gauges reading about 10⁻⁴ to 1000 Torr. The machine carries a blue display module labelled “Convectron ATM” (visible in S4 slides 9, 15, 16); its exact model is not confirmed.',
    },
    {
      id: 'S8', short: 'minimak-groundwork',
      title: 'minimak-groundwork: preparation for the TU/e SPM1',
      who: 'TU/e', url: 'https://github.com/HaoPhuc/minimak-groundwork',
      gives: 'Context for this page: TU/e installs the machine in autumn 2026; primer, field-map and Langmuir-fit scripts.',
    },
  ];

  const GROUPS = [
    { id: 'vessel', name: 'Vacuum vessel' },
    { id: 'magnets', name: 'Magnets' },
    { id: 'discharge', name: 'Plasma and discharge' },
    { id: 'vacuum', name: 'Pumping and gas' },
    { id: 'diag', name: 'Diagnostics' },
    { id: 'structure', name: 'Structure' },
    { id: 'power', name: 'Power and control' },
  ];

  const PARTS = [
    // ---------- Vacuum vessel ----------
    {
      id: 'vessel', name: 'Vessel quarters', group: 'vessel', count: 4, basis: 'spec',
      what: 'Four 90° stainless-steel elbows of 150 mm tube, TIG welded to ConFlat flanges at both ends and bolted into a ring. Together they make the closed toroidal chamber that holds the gas and the plasma. Each quarter carries one lateral port and two TF coils.',
      specs: [
        ['Major radius R₀', '230 mm', 'S2'],
        ['Minor radius a', '75 mm', 'S2'],
        ['Tube', '150 mm, four standard quarters', 'S1'],
        ['Ring', '460 mm circle', 'S1'],
        ['Joining', 'TIG welded, ConFlat seals', 'S4'],
        ['Leak tested', 'to 10⁻⁹ mbar (UHV)', 'S4'],
        ['Volume', '≈ 25 L (π a² · 2π R₀, derived)', null],
      ],
      connects: ['joints', 'lateral', 'diagPorts', 'tf', 'posts'],
      know: 'The chamber wall is also the discharge cathode (S4 slide 20), so the vessel is part of the electrical circuit as well as the vacuum boundary. The wall thickness drawn (2 mm) is not published.',
      sources: ['S1', 'S2', 'S4'],
    },
    {
      id: 'joints', name: 'Joint flanges', group: 'vessel', count: 8, basis: 'spec',
      what: 'Each of the four joints between quarters is a pair of 8-inch (DN160) ConFlat flanges. Tightening the 20 bolts drives the knife edge on each face into the copper gasket between them, which gives an all-metal seal good to ultra-high vacuum. The corner posts clamp the vessel by these flange pairs.',
      specs: [
        ['Type', 'ConFlat (CF), knife edge', 'S4'],
        ['Size', 'DN160CF, 8″ (203 mm) OD', 'S5'],
        ['Bolts', '20 per joint', 'S5'],
        ['Joints', '4, so 8 flanges', 'S1'],
      ],
      connects: ['vessel', 'gaskets', 'posts'],
      know: 'A CF gasket is used once. Tighten in a star pattern in small steps until the flange faces meet evenly.',
      sources: ['S4', 'S5', 'S6'],
    },
    {
      id: 'gaskets', name: 'Copper gaskets', group: 'vessel', count: 4, basis: 'spec',
      what: 'Thin rings of soft copper squeezed between each flange pair. The knife edges cut into them and the copper flows into the scratches, which is what seals the joint. A spare large gasket lies on the parts table in S4 slide 14.',
      specs: [
        ['Material', 'Oxygen-free copper', 'S6'],
        ['Fits', 'DN160CF joints (one per joint)', 'S5'],
      ],
      connects: ['joints'],
      know: 'Inspect the knife edges before fitting a new gasket: a nicked edge leaks whatever you do to the bolts.',
      sources: ['S4', 'S6'],
    },
    {
      id: 'lateral', name: 'Lateral ports', group: 'vessel', count: 4, basis: 'spec',
      what: 'A short 4-inch tube welded to the outboard side of each elbow, ending in a 6-inch (DN100) ConFlat flange. Three of them carry viewports and the fourth carries the pump line.',
      specs: [
        ['Count', '3 viewing ports + 1 vacuum port', 'S1'],
        ['Flange', 'DN100CF, 152 mm OD, 16 bolts', 'S5'],
        ['Position', 'outboard midplane, middle of each quarter', 'photo'],
      ],
      connects: ['vessel', 'viewport', 'pumpPort'],
      know: 'Which port faces the camera, the spectrometer or the pump on the TU/e machine is a guess here; check at installation.',
      sources: ['S1', 'S4', 'S5'],
    },
    {
      id: 'viewport', name: 'Viewports', group: 'vessel', count: 3, basis: 'photo',
      what: 'Glass windows sealed into DN100CF flanges on three lateral ports. Drawn here: the front one left open for eyes, the left one for the webcam and the back one for the spectrometer fibre.',
      specs: [
        ['Count', '3 lateral viewing ports', 'S1'],
        ['Clear view', '≈ 90 mm (photo estimate)', 'photo'],
        ['Used by', 'webcam, spectrometer, eyes', 'S4'],
      ],
      connects: ['lateral', 'camera', 'spectro'],
      know: 'Vent the chamber slowly: under vacuum a 90 mm window carries about 640 N (65 kg) of air pressure.',
      sources: ['S1', 'S4'],
    },
    {
      id: 'diagPorts', name: 'Top and bottom ports', group: 'vessel', count: 5, basis: 'photo',
      what: 'Small 2¾-inch (DN40) CF ports on the top and bottom of the front and left quarters, giving vertical lines of sight through the plasma. Drawn here they carry the laser window, the Langmuir probe and the two electrodes. A larger port on top of the back quarter carries the gauge and gas stack.',
      specs: [
        ['Diagnostic ports', '4, looking through the plasma', 'S1'],
        ['Flange', 'DN40CF, 70 mm OD, 6 bolts', 'S5'],
        ['Gauge port', '≈ DN63CF on the back quarter (photo)', 'photo'],
        ['Placement', 'top and bottom of two quarters', 'photo'],
      ],
      connects: ['vessel', 'laser', 'probe', 'electrode', 'stack'],
      know: 'The public spec lists four diagnostic ports; the photos also show the larger gauge port. Ask which flange carries what on the TU/e unit.',
      sources: ['S1', 'S4', 'S5'],
    },

    // ---------- Magnets ----------
    {
      id: 'tf', name: 'Toroidal field coils', group: 'magnets', count: 8, basis: 'spec',
      what: 'Eight coils wound directly onto copper formers clamped round the elbows, two per quarter. The former is a copper sheet whose edges are cut into tabs and folded out to hold the winding; a copper band covers the finished winding. Driven together they make the toroidal field, which runs the long way round the ring and is strongest on the inboard side.',
      specs: [
        ['Count', '8, each with its own supply', 'S2'],
        ['Winding', '50 turns of 6 mm copper cable', 'S1'],
        ['Current', '40 A continuous, several times that pulsed', 'S1'],
        ['Field rating', '0.025 T continuous, 0.1 T pulsed', 'S2'],
        ['Field on axis', '≈ 14 mT at 40 A (μ₀·400·40 A / 2π·0.23 m, derived)', null],
        ['Cable per coil', '≈ 25 m (50 turns × ≈ 0.5 m, derived)', null],
        ['Former', 'copper, mounted on the chamber', 'S4'],
      ],
      connects: ['vessel', 'psu'],
      know: 'The webinar demonstrations run the TF at 15–20 mT (S4 slides 22, 27). A coil is an inductor: ramp the current down before switching off, and check that all eight drive the field the same way round.',
      sources: ['S1', 'S2', 'S4'],
    },
    {
      id: 'pfInner', name: 'Inner PF coils (PF1, PF2)', group: 'magnets', count: 2, basis: 'photo',
      what: 'Two windings on the central former, one above and one below the midplane, covered in copper tape. Driven together they add a vertical field that pushes the glow up or down; the webinar calls this dipole position control.',
      specs: [
        ['PF coils', '4 in all, each independently controlled', 'S2'],
        ['Formers', 'metal, above and below the chamber', 'S4'],
        ['Field in demos', 'PF1 & PF2 ≈ 5 mT', 'S4'],
        ['Placement', 'on the central former (photo, S4 slide 15)', 'photo'],
      ],
      connects: ['former', 'psu'],
      know: 'With no plasma current the PF coils move and shape the glow; they cannot hold it in place on their own.',
      sources: ['S2', 'S4'],
    },
    {
      id: 'pfOuter', name: 'Outer PF coils (PF3, PF4)', group: 'magnets', count: 2, basis: 'assumed',
      what: 'The second pair of the four PF coils. Their radius and height are not published, so they are drawn as rings on aluminium channels outside the TF coils, braced to the corner posts.',
      specs: [
        ['PF coils', '4 in all, at top and bottom of the chamber', 'S1'],
        ['Radius, height', 'not published (drawn at R 315 mm, ±128 mm)', null],
      ],
      connects: ['posts', 'psu'],
      know: 'Ask at the kickoff for the PF coil radii, turns, inductance and maximum pulsed current.',
      sources: ['S1', 'S2'],
    },
    {
      id: 'satellite', name: 'Satellite PF coils', group: 'magnets', count: 2, basis: 'photo',
      what: 'The two large black rings in every photo: cable run inside a hose sleeve and taped at intervals. One sits above the vessel on brackets from the posts, the other lies on the table under it. They are the “further pair of PF coils above and below the chamber”.',
      specs: [
        ['Count', '2, above and below', 'S1'],
        ['Diameter', '≈ 700 mm (photo estimate)', 'photo'],
        ['Mounting', 'brackets above, pads on the table below', 'photo'],
      ],
      connects: ['posts', 'table', 'psu'],
      know: 'Tens of mT near the coils: keep anyone with a pacemaker or implant out of the coil area, and steel tools away.',
      sources: ['S1', 'S4'],
    },
    {
      id: 'solenoid', name: 'Central solenoid', group: 'magnets', count: 1, basis: 'assumed',
      what: 'The transformer coil of a tokamak, in the hole of the torus. A changing current in it induces a voltage round the ring. It is drawn here wound on the central former across the midplane; its real turns and position are not published.',
      specs: [
        ['Drive', 'low voltage, AC and DC', 'S2'],
        ['Built system', 'DC solenoid drive', 'S4'],
        ['Upgrade', 'superconducting (HTS) solenoid', 'S4'],
      ],
      connects: ['former', 'psu'],
      know: 'A Rogowski coil (on the upgrade list) would measure any current it drives round the plasma.',
      sources: ['S2', 'S4'],
    },
    {
      id: 'former', name: 'Central former', group: 'magnets', count: 1, basis: 'photo',
      what: 'A white-painted metal cylinder standing on the table in the hole of the torus. PF1, PF2 and the solenoid are wound round it, and their leads run up inside it (blue cables in S4 slide 15).',
      specs: [
        ['Diameter', '≈ 210 mm (photo estimate)', 'photo'],
        ['Material', 'metal former, white finish', 'S4'],
      ],
      connects: ['pfInner', 'solenoid', 'table'],
      know: '',
      sources: ['S4'],
    },

    // ---------- Plasma and discharge ----------
    {
      id: 'plasma', name: 'Glow-discharge plasma', group: 'discharge', count: 1, basis: 'spec',
      what: 'What the machine is for. With the chamber pumped down and a little N₂ or He let in, high voltage between the electrode and the chamber wall breaks the gas down into a glow that fills the vessel. The magnetic field traps the electrons, which brightens the glow and shapes it into a ring.',
      specs: [
        ['Temperature', '1–5 eV', 'S2'],
        ['Gas', 'N₂ or He', 'S2'],
        ['Drive', 'HV glow (4 kV pulsed), RF option', 'S4'],
        ['Volume', '≈ 25 L, the whole chamber', null],
      ],
      connects: ['vessel', 'electrode'],
      know: 'N₂ glows pink-violet, He peach. It is a cold plasma: no fusion, no neutrons, and no significant plasma current.',
      sources: ['S2', 'S4'],
    },
    {
      id: 'electrode', name: 'Discharge electrodes', group: 'discharge', count: 2, basis: 'photo',
      what: 'Two high-voltage feedthroughs on bottom ports: a ceramic insulator with sheds outside, a rod and a small anode disc inside the chamber. The chamber wall is the other electrode. With AC drive the roles swap every half cycle.',
      specs: [
        ['System', 'dual-electrode AC discharge', 'S1'],
        ['Supply', '4 kV pulsed', 'S4'],
        ['Circuit', 'anode electrode, chamber cathode', 'S4'],
        ['Placement', 'bottom ports (pink HV lead in photos)', 'photo'],
      ],
      connects: ['diagPorts', 'hv', 'plasma'],
      know: 'Touch the electrodes only with the supply off and grounded. Rely on the PLC interlocks; never bypass them.',
      sources: ['S1', 'S4'],
    },
    {
      id: 'hv', name: 'HV supply and leads', group: 'discharge', count: 1, basis: 'assumed',
      what: 'Drives the electrodes through two pink HV leads. The white box with a display on the table front in the photos is drawn here as the supply; that is a guess, and the supply may sit in the rack.',
      specs: [
        ['Output', '4 kV pulsed glow supply', 'S4'],
        ['Sources', 'variable HV and RF', 'S2'],
        ['Interlock', 'PLC safety monitor', 'S4'],
      ],
      connects: ['electrode', 'drawer'],
      know: 'High voltage. Interlocked by the PLC.',
      sources: ['S2', 'S4'],
    },

    // ---------- Pumping and gas ----------
    {
      id: 'pumpPort', name: 'Pump port', group: 'vacuum', count: 1, basis: 'photo',
      what: 'The fourth lateral port, on the right quarter. A zero-length reducer takes the 6-inch CF flange down to a KF40 stub, and a KF clamp holds the flexible line on it.',
      specs: [
        ['Count', '1 vacuum port', 'S1'],
        ['Reducer', 'DN100CF to KF40 (size assumed)', null],
      ],
      connects: ['lateral', 'hose'],
      know: 'A KF joint is sealed by an O-ring on a centring ring, not by metal. Keep the ring clean and seated.',
      sources: ['S1', 'S6'],
    },
    {
      id: 'hose', name: 'Bellows pump line', group: 'vacuum', count: 1, basis: 'photo',
      what: 'A corrugated stainless flexible hose from the pump port, over the table edge, to the rotary pump on the shelf. It lets the pump vibrate without shaking the vessel.',
      specs: [
        ['Type', 'corrugated stainless KF hose', 'photo'],
      ],
      connects: ['pumpPort', 'pump'],
      know: 'Bend it gently: kinked bellows crack and leak.',
      sources: ['S4'],
    },
    {
      id: 'pump', name: 'Rotary vane pump', group: 'vacuum', count: 1, basis: 'photo',
      what: 'An oil-sealed rotary vane pump under the table roughs the chamber down from atmosphere to the pressure range a glow discharge needs.',
      specs: [
        ['Type', 'rotary vane', 'S4'],
        ['Location', 'under the table (S4 slide 19)', 'photo'],
        ['Upgrade', 'turbopump, gauges and gas handling', 'S4'],
      ],
      connects: ['hose', 'drawer'],
      know: 'Check the oil level in the sight glass. The exhaust carries oil mist.',
      sources: ['S4'],
    },
    {
      id: 'stack', name: 'Gauge and gas stack', group: 'vacuum', count: 1, basis: 'photo',
      what: 'On the back quarter’s top port: a reducer flange, then a small four-way cross. Its top arm carries the gauge, one side arm the gas valve, the other a blank.',
      specs: [
        ['Base', '≈ DN63CF to DN40CF reducer', 'photo'],
        ['Cross', 'DN40CF four-way', 'photo'],
      ],
      connects: ['diagPorts', 'gauge', 'needle'],
      know: '',
      sources: ['S4'],
    },
    {
      id: 'gauge', name: 'Vacuum gauge', group: 'vacuum', count: 1, basis: 'photo',
      what: 'A blue “Convectron ATM” display module on a short KF16 tube at the top of the stack, reading the chamber pressure from atmosphere down to the glow’s working range. Its cable runs down to the table.',
      specs: [
        ['Type', 'convection-enhanced Pirani with display', 'S7'],
        ['Range', '≈ 10⁻⁴ to 1000 Torr (gauge family)', 'S7'],
        ['Mount', 'KF16 on the top stack', 'photo'],
      ],
      connects: ['stack', 'drawer'],
      know: 'A heat-loss gauge reads differently for different gases: N₂ and He give different readings at the same true pressure. Use the gas correction.',
      sources: ['S4', 'S7'],
    },
    {
      id: 'needle', name: 'Gas inlet valve and line', group: 'vacuum', count: 1, basis: 'assumed',
      what: 'A needle valve on the stack’s side arm bleeds N₂ or He in against the pump, so the pressure settles at the fill you want. A thin line runs down to a fitting on the table. The real gas hardware is not published.',
      specs: [
        ['Gas', 'N₂ or He', 'S2'],
        ['Upgrade', 'gas handling', 'S4'],
      ],
      connects: ['stack'],
      know: 'Log the fill pressure with every shot. Secure the gas bottle.',
      sources: ['S2', 'S4'],
    },

    // ---------- Diagnostics ----------
    {
      id: 'laser', name: 'Laser diagnostics window', group: 'diag', count: 1, basis: 'photo',
      what: 'A small DN40 viewport on top of the front quarter, giving a vertical line of sight down through the plasma.',
      specs: [
        ['Listed as', 'laser diagnostics port', 'S2'],
        ['Placement', 'front top port (photo)', 'photo'],
      ],
      connects: ['diagPorts'],
      know: '',
      sources: ['S2', 'S4'],
    },
    {
      id: 'probe', name: 'Langmuir probe (option)', group: 'diag', count: 1, basis: 'assumed',
      what: 'A small wire tip on a ceramic shaft, pushed down into the plasma by a bellows linear feedthrough on the left top port. Sweeping its voltage gives the electron temperature and density.',
      specs: [
        ['Status', 'listed as a diagnostic', 'S1'],
        ['Status', 'on the upgrade list', 'S4'],
        ['Placement', 'not published (drawn on the left top port)', null],
      ],
      connects: ['diagPorts', 'plasma'],
      know: 'In a magnetic field trust the ion side of the I–V curve more than the electron side. minimak-groundwork has a fitting script (S8).',
      sources: ['S1', 'S4', 'S8'],
    },
    {
      id: 'camera', name: 'Webcam', group: 'diag', count: 1, basis: 'assumed',
      what: 'A webcam on an optical post looking into the left viewport. The control software tracks the glow’s position and shape from its video in real time.',
      specs: [
        ['Function', 'vision-based tracking of position and shape', 'S2'],
        ['Interface', 'video and webcam', 'S4'],
        ['Upgrade', 'high-speed video', 'S4'],
      ],
      connects: ['viewport', 'drawer'],
      know: 'Threshold, centroid and contour on each frame are enough to turn this into a position measurement.',
      sources: ['S2', 'S4'],
    },
    {
      id: 'spectro', name: 'Spectrometer and fibre', group: 'diag', count: 1, basis: 'assumed',
      what: 'An adaptor on the back viewport holds an optical fibre that carries the glow’s light to a compact spectrometer on the table.',
      specs: [
        ['Type', 'UV–VIS, wide band', 'S2'],
        ['Upgrade', 'wide-band and high-resolution spectrometers', 'S4'],
      ],
      connects: ['viewport', 'drawer'],
      know: 'Identify lines against the NIST atomic spectra database. N₂ shows strong bands near 337 and 391 nm.',
      sources: ['S2', 'S4'],
    },

    // ---------- Structure ----------
    {
      id: 'table', name: 'Optical table', group: 'structure', count: 1, basis: 'photo',
      what: 'A Thorlabs Nexus optical table (name on its front band in S4 slides 12 and 19) carries everything: the torus on top, the supplies, drawer and pump underneath.',
      specs: [
        ['Envelope', '90 × 90 × 160 cm', 'S2'],
        ['Top', 'tapped M6 holes on a 25 mm grid', 'photo'],
        ['Mains', 'one supply for the whole system', 'S2'],
      ],
      connects: ['posts', 'former', 'satellite'],
      know: '',
      sources: ['S2', 'S4'],
    },
    {
      id: 'posts', name: 'Corner posts and clamps', group: 'structure', count: 4, basis: 'photo',
      what: 'Four slotted aluminium extrusions bolted to the table with angle brackets, one at each joint. A block clamps each joint flange pair, so the vessel hangs from its joints with the coils clear of the table. The posts also carry the outer PF and upper satellite brackets.',
      specs: [
        ['Profile', '≈ 45 mm slotted aluminium (photo estimate)', 'photo'],
        ['Count', '4, at the joints', 'photo'],
      ],
      connects: ['table', 'joints', 'pfOuter', 'satellite'],
      know: '',
      sources: ['S4'],
    },

    // ---------- Power and control ----------
    {
      id: 'psu', name: 'Coil power supplies', group: 'power', count: 1, basis: 'photo',
      what: 'Two rack chassis on the shelf under the table hold one variable low-voltage switch-mode channel per coil, so every TF and PF coil can be driven on its own.',
      specs: [
        ['Type', 'independent variable switch-mode', 'S1'],
        ['Rating', 'continuous, up to 40 A per coil', 'S4'],
        ['Upgrade', 'pulsed supercapacitor supplies', 'S4'],
      ],
      connects: ['tf', 'pfInner', 'pfOuter', 'satellite', 'solenoid', 'drawer'],
      know: 'Coils are inductive: ramp the current down before switching off.',
      sources: ['S1', 'S4'],
    },
    {
      id: 'drawer', name: 'Control drawer', group: 'power', count: 1, basis: 'photo',
      what: 'A pull-out drawer under the table top holds the DIN rails: the PLC safety monitor, relays, terminal blocks, a switch-mode supply and the DAQ interface (open in S4 slide 12). A PC beside the table runs the control GUI.',
      specs: [
        ['Safety', 'PLC-based safety monitor and interlocks', 'S4'],
        ['I/O', 'networked digital I/O and DAQ', 'S4'],
        ['Software', '.NET GUI; LabVIEW, Python, MATLAB; Arduino, Raspberry Pi', 'S4'],
      ],
      connects: ['psu', 'hv', 'estop', 'gauge'],
      know: 'Never bypass an interlock. Learn the DAQ data format and API before writing scripts against it.',
      sources: ['S1', 'S4'],
    },
    {
      id: 'estop', name: 'Emergency stop', group: 'power', count: 1, basis: 'photo',
      what: 'A yellow box with a red mushroom button on the table top (S4 slide 19). Pressing it drops the HV and coil supplies through the PLC.',
      specs: [
        ['Chain', 'PLC safety monitor', 'S4'],
      ],
      connects: ['drawer'],
      know: 'Know where it is before the first shot.',
      sources: ['S4'],
    },
  ];

  // Listed in the sources but not drawn: options, upgrades and things that live off the table.
  const NOT_DRAWN = [
    ['2.45 GHz magnetron (ECR heating)', 'optional', 'S1'],
    ['Hall-effect magnetometer', 'listed, also an upgrade', 'S2'],
    ['Rogowski coil', 'upgrade', 'S4'],
    ['Turbomolecular pump', 'upgrade', 'S4'],
    ['HTS solenoid', 'upgrade', 'S4'],
    ['Supercapacitor pulsed supplies', 'upgrade', 'S4'],
    ['High-speed camera', 'upgrade', 'S4'],
    ['Control PC and monitor', 'beside the table', 'S4'],
    ['Gas bottle and regulator', 'not shown in photos', null],
  ];

  PARTS.forEach((p, i) => { p.n = i + 1; });
  root.SPM1_DOCS = { SOURCES, GROUPS, PARTS, NOT_DRAWN };
})(typeof window !== 'undefined' ? window : globalThis);
