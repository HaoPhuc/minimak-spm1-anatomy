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
      gives: 'Confirms S2’s headline specification: major radius 23 cm, minor radius 7.5 cm; 8 TF coils each with its own supply, 0.025 T continuous and up to 0.1 T pulsed; 4 PF coils independently controlled; glow discharge from variable HV and RF sources in N₂ or He; low-temperature plasma of 1–5 eV; 90 × 90 × 160 cm envelope. It also says the machine is modular and upgradeable for teaching E×B, J×B, cross-field and instability effects.',
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
      gives: 'CF flanges are named by outside diameter: 2¾″ (DN40), 4½″ (DN63), 6″ (DN100), 8″ (DN160).',
    },
    {
      id: 'S9', short: 'MBE, CF dimensions',
      title: 'Flange, gasket and tube dimensions (ConFlat)',
      who: 'MBE-Komponenten GmbH', url: 'https://www.mbe-komponenten.de/service/flange-gasket/',
      gives: 'For DN40, DN63, DN100 and DN160CF: flange OD, thickness, bolt circle, bolt count and hole diameter, knife-edge and seal-recess diameters; the matching tube OD and wall; and the OFHC copper gasket OD, ID and thickness. Every flange, tube, gasket and bolt hole is drawn to this table, and the bolt counts match the photos.',
    },
    {
      id: 'S10', short: 'Lesker, Kodial viewports',
      title: 'CF flanged viewports, Kodial glass (VPZL-275, VPZL-600)',
      who: 'Kurt J. Lesker Company', url: 'https://www.lesker.com/viewports/viewports-cf-flanged-kodial-glass.cfm',
      gives: 'Reference data for standard zero-length viewports: Kodial (alkali borosilicate 7056) glass sealed to a 304L flange through a Kovar sleeve; view 38.0 mm and glass 3.0 mm for DN40CF, view 90.0 mm and glass 6.0 mm for DN100CF; bake-out to 350 °C at no more than 2–3 °C per minute. The make of the SPM1 viewports is not published.',
    },
    {
      id: 'S11', short: 'Lesker, KF notes',
      title: 'KF (QF) flanges, technical notes',
      who: 'Kurt J. Lesker Company', url: 'https://www.lesker.com/newweb/flanges/flanges_technicalnotes_kf_1.cfm',
      gives: 'How a KF joint goes together: the flanges are sexless, the elastomer O-ring is held on a centring ring that also aligns the two flanges, and a circumferential clamp pulls on the chamfered backs of both flanges, tightened by a wing nut, thumbscrew, bolt or over-centre lever. The page’s dimension figure is not in its text, so KF sizes on the sheets are the drawing’s.',
    },
    {
      id: 'S6', short: 'Vacuum flange',
      title: 'Vacuum flange (ConFlat and KF)',
      who: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Vacuum_flange',
      gives: 'How a CF knife edge bites into a soft copper gasket to make an all-metal seal, and how a KF joint uses a clamp and an elastomer O-ring (AS568) mounted in a metal centring ring; its KF table gives the O-ring size for each flange: AS-314 for KF16, AS-326 for KF40.',
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
        ['Volume', '≈ 25 L (π a² · 2π R₀, derived)', 'derived'],
      ],
      connects: ['joints', 'lateral', 'diagPorts', 'tf', 'posts', 'plasma'],
      // Which quarter carries which port, as the photos show it; the probe's port is the drawing's guess.
      piecesHead: 'Ports',
      pieces: {
        'Right quarter': [['Lateral port', 'the pump line', 'photo']],
        'Back quarter': [['Lateral port', 'a viewport', 'photo'], ['Top port', 'the gauge and gas stack (≈ DN63)', 'photo']],
        'Left quarter': [['Lateral port', 'a viewport', 'photo'], ['Top port', 'the Langmuir probe (port not published)', 'assumed'], ['Bottom port', 'discharge electrode B', 'photo']],
        'Front quarter': [['Lateral port', 'a viewport', 'photo'], ['Top port', 'the laser window', 'photo'], ['Bottom port', 'discharge electrode A', 'photo']],
      },
      know: 'The chamber wall is also the discharge cathode (S4 slide 20), so the vessel is part of the electrical circuit as well as the vacuum boundary. The wall thickness drawn (2 mm) is not published.',
      sources: ['S1', 'S2', 'S4'],
    },
    {
      id: 'joints', name: 'Joint flanges', group: 'vessel', count: 8, basis: 'spec',
      what: 'Each of the four joints between quarters is a pair of 8-inch (DN160) ConFlat flanges. Tightening the 20 bolts drives the knife edge on each face into the copper gasket between them, which gives an all-metal seal good to ultra-high vacuum. The corner posts clamp the vessel by these flange pairs.',
      specs: [
        ['Type', 'ConFlat (CF), knife edge', 'S4'],
        ['Size', 'DN160CF, 8″ (203.2 mm) OD', 'S9'],
        ['Bolts', '20 per joint, through Ø8.4 mm holes', 'S9'],
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
        ['Where', 'one in each of the four joints, on the diagonals between the quarters', 'photo'],
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
        ['Flange', 'DN100CF, 152.4 mm OD, 16 bolts', 'S9'],
        ['Tube', '104 × 2.0 mm', 'S9'],
        ['Position', 'outboard midplane, middle of each quarter', 'photo'],
      ],
      connects: ['vessel', 'viewport', 'pumpPort'],
      pieces: {
        'Right (pump) port': [['Carries', 'the pump port and bellows line', 'photo']],
        'Back port': [['Carries', 'a viewport', 'photo']],
        'Left port': [['Carries', 'a viewport', 'photo']],
        'Front port': [['Carries', 'a viewport', 'photo']],
      },
      know: 'Which port faces the camera, the spectrometer or the pump on the TU/e machine is a guess here; check at installation.',
      sources: ['S1', 'S4', 'S5'],
    },
    {
      id: 'viewport', name: 'Viewports', group: 'vessel', count: 3, basis: 'photo',
      what: 'Glass windows sealed into DN100CF flanges on three lateral ports. Drawn here: the front one left open for eyes, the left one for the webcam and the back one for the spectrometer fibre.',
      specs: [
        ['Count', '3 lateral viewing ports', 'S1'],
        ['Clear view', '90 mm on a standard DN100CF Kodial viewport (make not published)', 'S10'],
        ['Used by', 'webcam, spectrometer, eyes', 'S4'],
      ],
      connects: ['lateral', 'camera', 'spectro'],
      // Which window serves which use is not published: S4 names the three uses, the drawing assigns them.
      pieces: {
        'Back viewport (spectrometer)': [['Used for', 'the spectrometer fibre (which window: not published)', 'assumed']],
        'Left viewport (webcam)': [['Used for', 'the webcam (which window: not published)', 'assumed']],
        'Front viewport (eyes)': [['Used for', 'looking in by eye (which window: not published)', 'assumed']],
      },
      know: 'Vent the chamber slowly: under vacuum a 90 mm window carries about 640 N (65 kg) of air pressure.',
      sources: ['S1', 'S4'],
    },
    {
      id: 'diagPorts', name: 'Top and bottom ports', group: 'vessel', count: 5, basis: 'photo',
      what: 'Small 2¾-inch (DN40) CF ports on the top and bottom of the front and left quarters, giving vertical lines of sight through the plasma. Drawn here they carry the laser window, the Langmuir probe and the two electrodes. A larger port on top of the back quarter carries the gauge and gas stack.',
      specs: [
        ['Diagnostic ports', '4, looking through the plasma', 'S1'],
        ['Flange', 'DN40CF, 69.9 mm OD, 6 bolts', 'S9'],
        ['Gauge port', '≈ DN63CF on the back quarter (photo)', 'photo'],
        ['Placement', 'top and bottom of two quarters', 'photo'],
      ],
      connects: ['vessel', 'laser', 'probe', 'electrode', 'stack'],
      pieces: {
        'Front top port': [['Carries', 'the laser diagnostics window', 'photo']],
        'Left top port': [['Carries', 'the Langmuir probe (port not published)', 'assumed']],
        'Front bottom port': [['Carries', 'discharge electrode A', 'photo']],
        'Left bottom port': [['Carries', 'discharge electrode B', 'photo']],
        'Back top gauge port (DN63)': [['Carries', 'the gauge and gas-inlet stack', 'photo']],
      },
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
        ['Field on axis', '≈ 14 mT at 40 A (μ₀·400·40 A / 2π·0.23 m, derived)', 'derived'],
        ['Cable per coil', '≈ 25 m (50 turns × ≈ 0.5 m, derived)', 'derived'],
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
      know: 'With no plasma current the PF coils move and shape the glow; they cannot hold it in place on their own. Which of the pair is PF1 is not published; the drawing calls the upper one PF1.',
      sources: ['S2', 'S4'],
    },
    {
      id: 'pfOuter', name: 'Outer PF coils (PF3, PF4)', group: 'magnets', count: 2, basis: 'assumed',
      what: 'The second pair of the four PF coils. Their radius and height are not published, so they are drawn as rings on aluminium channels outside the TF coils, braced to the corner posts.',
      specs: [
        ['PF coils', '4 in all, at top and bottom of the chamber', 'S1'],
        ['Radius, height', 'not published (drawn at R 315 mm, ±128 mm)', 'assumed'],
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
      pieces: {
        'Upper satellite coil': [['Held by', 'brackets from the corner posts, above the vessel', 'photo']],
        'Lower satellite coil': [['Held by', 'the table top, under the vessel', 'photo']],
      },
      know: 'Tens of mT near the coils: keep anyone with a pacemaker or implant out of the coil area, and steel tools away.',
      sources: ['S1', 'S4'],
    },
    {
      id: 'solenoid', name: 'Central solenoid', group: 'magnets', count: 1, basis: 'assumed',
      what: 'The transformer coil of a tokamak, in the hole of the torus. A changing current in it induces a voltage round the ring. It is drawn here wound on the central former across the midplane; its turns and height are not published.',
      specs: [
        ['Position', 'inside the centre of the torus', 'S1'],
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
        ['Volume', '≈ 25 L, the whole chamber', 'derived'],
      ],
      connects: ['vessel', 'electrode', 'probe'],
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
      pieces: {
        'Electrode A (front)': [['Port', 'the front quarter’s bottom port', 'photo']],
        'Electrode B (left)': [['Port', 'the left quarter’s bottom port', 'photo']],
      },
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
        ['Reducer', 'DN100CF to KF40 (size assumed)', 'assumed'],
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
        ['Placement', 'not published (drawn on the left top port)', 'assumed'],
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
      connects: ['table', 'joints', 'pfOuter', 'satellite', 'vessel'],
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
      connects: ['psu', 'hv', 'estop', 'gauge', 'pump', 'camera', 'spectro'],
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

  // How two connected parts attach: one entry per pair in `connects` (each pair once, in either order), a sentence
  // that reads from both sides, and its tags. A sentence that is partly a guess says which part is not published.
  const JOINS = [
    ['vessel', 'joints', 'Each elbow is TIG welded to a ConFlat flange at both ends, and the flanges of neighbouring quarters are bolted together.', ['S4', 'S1']],
    ['vessel', 'lateral', 'Each elbow has a short port tube welded into its outboard side, ending in a DN100CF flange.', ['photo']],
    ['vessel', 'diagPorts', 'Small port tubes are welded into the top and bottom of the front and left quarters, and a larger one into the top of the back quarter.', ['photo']],
    ['vessel', 'tf', 'Each coil is wound directly onto a copper former mounted on an elbow, two coils per quarter.', ['S4']],
    ['vessel', 'posts', 'The posts hold the vessel by its joint flanges, so the ring stands clear of the table.', ['photo']],
    ['vessel', 'plasma', 'The glow fills the whole chamber, and the chamber wall is the cathode of the discharge.', ['S4']],
    ['joints', 'gaskets', 'One copper gasket sits between the two flanges of each joint, and tightening the bolts drives both knife edges into it.', ['S6']],
    ['joints', 'posts', 'A clamp block on each post grips one joint’s pair of flanges.', ['photo']],
    ['lateral', 'viewport', 'Three lateral ports carry a viewport, bolted to the port’s DN100CF flange over a copper gasket.', ['S1', 'S9']],
    ['lateral', 'pumpPort', 'The fourth lateral port is the vacuum port: a zero-length reducer bolts onto its DN100CF flange.', ['S1', 'photo']],
    ['viewport', 'camera', 'As drawn, the webcam stands on a post and looks in through the left viewport; which window it uses is not published.', ['assumed']],
    ['viewport', 'spectro', 'As drawn, an adaptor on the back viewport holds the fibre that takes the glow’s light to the spectrometer; which window is not published.', ['assumed']],
    ['diagPorts', 'laser', 'The laser window is a DN40CF viewport bolted to the front quarter’s top port.', ['photo']],
    ['diagPorts', 'probe', 'As drawn, a bellows feedthrough on the left quarter’s top port pushes the probe in; the probe is an option, and its port is not published.', ['assumed']],
    ['diagPorts', 'electrode', 'Each electrode is a high-voltage feedthrough on a DN40CF flange, bolted to a bottom port: one under the front quarter, one under the left.', ['photo']],
    ['diagPorts', 'stack', 'The stack’s reducer flange bolts to the larger port on top of the back quarter (≈ DN63CF).', ['photo']],
    ['tf', 'psu', 'Each coil is driven by its own supply channel, up to 40 A continuous.', ['S2', 'S4']],
    ['pfInner', 'former', 'PF1 and PF2 are wound round the central former, one above and one below the midplane, and their leads run up inside it.', ['photo']],
    ['pfInner', 'psu', 'Each of the four PF coils is controlled on its own supply channel.', ['S2']],
    ['pfOuter', 'posts', 'As drawn, PF3 and PF4 sit on aluminium channels braced to the corner posts; how they are really mounted is not published.', ['assumed']],
    ['pfOuter', 'psu', 'Like PF1 and PF2, each is controlled on its own supply channel.', ['S2']],
    ['satellite', 'posts', 'The upper satellite coil is held above the vessel by brackets from the corner posts.', ['photo']],
    ['satellite', 'table', 'The lower satellite coil lies on the table top, under the vessel.', ['photo']],
    ['satellite', 'psu', 'Like every magnet coil, each can be connected to its own variable switch-mode supply.', ['S1']],
    ['solenoid', 'former', 'The solenoid sits inside the centre of the torus. It is drawn wound on the central former; its turns and height are not published.', ['S1', 'assumed']],
    ['solenoid', 'psu', 'It is driven at low voltage, AC or DC, from its own supply.', ['S2']],
    ['former', 'table', 'The central former stands on the table top, in the hole of the torus.', ['photo']],
    ['plasma', 'electrode', 'The glow strikes between the anode electrodes and the chamber wall, which is the cathode.', ['S4']],
    ['plasma', 'probe', 'The probe’s tip reaches into the glow to sample it; how far it goes in is not published.', ['assumed']],
    ['electrode', 'hv', 'A pink HV lead from the supply plugs onto each electrode’s terminal cap.', ['photo']],
    ['hv', 'drawer', 'The PLC safety monitor in the drawer interlocks the HV supply.', ['S4']],
    ['pumpPort', 'hose', 'A KF clamp holds the bellows hose’s own KF flange against the reducer’s KF stub, with a centring ring and its O-ring between them.', ['photo', 'S11']],
    ['hose', 'pump', 'The hose runs over the table edge and down to the pump’s inlet on the shelf below.', ['photo']],
    ['pump', 'drawer', 'As drawn, the pump is wired through the drawer; how it is switched is not published.', ['assumed']],
    ['stack', 'gauge', 'The gauge clamps onto the KF16 stub of a DN40CF to KF16 adaptor on the cross’s top arm, with a centring ring and its O-ring between the flanges. It comes off at that clamp.', ['photo', 'S11']],
    ['stack', 'needle', 'The needle valve bolts to one side arm of the four-way cross, on its own copper gasket, with six bolts and nuts; the other side arm is blanked off.', ['photo', 'S9']],
    ['gauge', 'drawer', 'Its cable runs down under the table, and the control system monitors the vacuum pressure.', ['S4']],
    ['camera', 'drawer', 'Its video goes to the control software, which tracks the glow’s position and shape.', ['S2']],
    ['spectro', 'drawer', 'The control software takes its spectra for analysis.', ['S4']],
    ['table', 'posts', 'Each post is bolted to the table top with an angle bracket.', ['photo']],
    ['psu', 'drawer', 'The coil supplies are part of the control system, and the PLC safety monitor in the drawer handles the interlocks.', ['S4']],
    ['drawer', 'estop', 'The emergency stop on the table top feeds the PLC safety monitor in the drawer.', ['S4']],
  ];

  // How a run goes, in the order of the webinar (S4 slides 16–27). No operating procedure is published.
  const RUN = [
    { title: 'Pump down', text: 'The rotary vane pump empties the chamber through the pump port and the bellows line, and the gauge on the top stack reads the pressure.', parts: ['pump', 'hose', 'pumpPort', 'gauge'], tags: ['S4'] },
    { title: 'Let in a little gas', text: 'A needle valve on the stack bleeds nitrogen or helium in against the pump, so the pressure settles at the fill you want.', parts: ['needle', 'stack'], tags: ['S2', 'assumed'] },
    { title: 'Strike the glow', text: 'The 4 kV pulsed supply puts high voltage between the electrodes, the anode, and the chamber wall, the cathode. The gas breaks down into a glow that fills the vessel.', parts: ['hv', 'electrode', 'vessel', 'plasma'], tags: ['S4'] },
    { title: 'Add the magnetic field', text: 'Each coil runs on its own supply. The TF coils brighten the glow and gather it into a ring; changing the current in PF1 and PF2 moves it up or down.', parts: ['tf', 'pfInner', 'pfOuter', 'satellite', 'solenoid', 'psu'], tags: ['S4'] },
  ];

  // The guided tour: stops in the order of a run, each a part and why it matters at that point.
  const TOUR = [
    { part: 'vessel', text: 'Everything happens inside this ring: four stainless quarters bolted into a sealed torus that holds the gas and, later, the glow.', tags: ['S1'] },
    { part: 'pump', text: 'First the air comes out. This rotary vane pump under the table empties the chamber through the bellows line.', tags: ['S4'] },
    { part: 'gauge', text: 'The gauge on top of the back quarter tells you when the chamber is empty enough, and later how much gas you have let in.', tags: ['S4'] },
    { part: 'needle', text: 'Then a little nitrogen or helium is let back in through this valve, against the pump, until the pressure settles where a glow will strike.', tags: ['S2', 'assumed'] },
    { part: 'electrode', text: 'High voltage between these electrodes and the chamber wall breaks the gas down into a glow.', tags: ['S4'] },
    { part: 'tf', text: 'The eight TF coils add a field the long way round the ring. It traps the glow’s electrons, so the glow brightens and gathers into a ring.', tags: ['S4'] },
    { part: 'pfInner', text: 'PF1 and PF2 add a vertical field. Changing their current pushes the glow up or down: the webinar’s dipole position control.', tags: ['S4'] },
    { part: 'plasma', text: 'The result: a cold glow of 1–5 eV filling the chamber, shaped by the coils. No fusion and no plasma current, but a tokamak’s magnets.', tags: ['S2'] },
  ];

  // The order a part's sub-parts come off when it is taken apart, one list per step (what is in one step comes off
  // together); fitting it runs back up the list. No assembly procedure is published (S4 gives only the order of a run),
  // so every step is an assumption, shown tagged so. A joint comes undone nuts first, then bolts, then what they held,
  // and its seal comes out last. A part not listed here takes its order by the same rule (index.html): nuts, then bolts
  // and screws, then the rest in the reverse of the order it was built, a seal last. What does not come off (a weld, the
  // winding a coil is built round) is no step.
  // Where does it go? (index.html): the parts it asks about, each with the parts it sits on. Each pair is one of the
  // part's `connects` (checked in development), read one way: a viewport goes on a lateral port, not on the webcam that
  // looks through it. Parts that hang between two others (the bellows line) or stand apart from where they plug in
  // (the webcam, the spectrometer) are not asked.
  const QUIZ = {
    gauge: ['stack'], viewport: ['lateral'], laser: ['diagPorts'], probe: ['diagPorts'], electrode: ['diagPorts'],
    stack: ['diagPorts'], needle: ['stack'], pumpPort: ['lateral'], gaskets: ['joints'], solenoid: ['former'],
    pfInner: ['former'], pfOuter: ['posts'], satellite: ['table', 'posts'],
  };
  const ORDER = {
    viewport: [['16 nuts'], ['16 bolts'], ['Viewport flange', 'Window glass, sealed into the flange'], ['Copper gasket']],
    laser: [['6 nuts'], ['6 bolts'], ['DN40CF viewport flange', 'Window glass'], ['Copper gasket']],
    electrode: [['HV terminal cap'], ['6 nuts'], ['6 bolts'], ['HV feedthrough: flange, ceramic insulator, anode rod', 'Anode disc'], ['Copper gasket']],
    probe: [['6 nuts'], ['6 bolts'], ['Bellows linear feedthrough', 'Micrometer drive and knob', 'Probe: shaft, ceramic sleeve, wire tip'], ['Copper gasket']],
    needle: [['Outlet compression fitting'], ['6 nuts'], ['6 bolts'], ['DN40 inlet flange', 'Needle valve body', 'Needle stem and knob'], ['Copper gasket']],
    pumpPort: [['KF40 clamp with wing nut'], ['Hose end flange, KF40'], ['KF40 centring ring and O-ring'], ['16 nuts'], ['16 bolts'], ['Zero-length reducer with KF40 stub'], ['Copper gasket']],
    stack: [
      ['6 nuts on the adaptor'], ['6 bolts on the adaptor'], ['DN40 to KF16 adaptor flange'],
      ['6 nuts on the blank'], ['6 bolts on the blank'], ['DN40 blank flange'],
      ['6 bolts into the reducer'], ['DN40 four-way cross'], ['3 DN40 gaskets'],
      ['8 nuts'], ['8 bolts'], ['DN63 to DN40 reducer flange'], ['Copper gasket'],
    ],
    gauge: [['Cable connector'], ['KF16 clamp'], ['KF16 centring ring and O-ring'], ['Sensor tube nut'], ['Convectron ATM display module']],
    pump: [['KF40 clamp'], ['Hose end flange, KF40'], ['KF40 centring ring and O-ring'], ['Exhaust oil-mist filter'], ['Motor terminal box'], ['Fan cover'], ['Electric motor'], ['Oil sight glass'], ['KF40 inlet port'], ['Base plate and rubber feet']],
    tf: [['Terminal block and lead studs'], ['Copper cover band'], ['Copper former with fold-out tabs']],
  };

  // Words a first-year student may not know. The first use of each on a page is underlined and opens its definition.
  // `match` finds a use; a match that also contains another term (DN160CF holds DN and CF) defines both at once.
  const GLOSSARY = [
    { id: 'torus', term: 'Torus', def: 'A ring with a round cross-section, like a doughnut. Here the vacuum chamber: a tube bent round into a closed ring.', match: /\btor(?:us|i)\b/i },
    { id: 'toroidal', term: 'Toroidal', def: 'The long way round the ring, along the tube. The TF coils make a field that runs this way.', match: /\btoroidal\b/i },
    { id: 'poloidal', term: 'Poloidal', def: 'The short way round: around the tube, in a vertical plane through the centre of the ring. Flat coils round the vertical axis, such as the PF coils, make field in these planes.', match: /\bpoloidal\b/i },
    { id: 'tf', term: 'TF', def: 'Toroidal field: the field that runs the long way round the ring, made here by the eight coils that wrap the tube.', match: /\bTF\d*\b/ },
    { id: 'pf', term: 'PF', def: 'Poloidal field. The PF coils are flat rings above and below the midplane; their field pushes the glow up or down and shapes it.', match: /\bPF\d*\b/ },
    { id: 'solenoid', term: 'Solenoid', def: 'A long coil wound like a spring. In a tokamak the central solenoid is the primary of a transformer: changing its current induces a voltage round the ring.', match: /\bsolenoids?\b/i },
    { id: 'tokamak', term: 'Tokamak', def: 'A fusion device that holds a hot plasma in a torus with a strong toroidal field and the field of a large current driven round the plasma. The SPM1 has a tokamak’s coils but no plasma current.', match: /\btokamaks?\b/i },
    { id: 'cf', term: 'ConFlat (CF)', def: 'An all-metal vacuum flange. A knife edge on each face bites into a soft copper gasket, which seals down to ultra-high vacuum.', src: 'S6', match: /\bConFlat\b|\bCF\b|(?<=\d)CF\b/ },
    { id: 'dn', term: 'DN', def: 'Nominal diameter in millimetres, the size name of a flange. DN40, DN63, DN100 and DN160 ConFlat flanges are 2¾, 4½, 6 and 8 inches across.', src: 'S5', match: /\bDN ?\d+(?:CF)?\b/ },
    { id: 'knife', term: 'Knife edge', def: 'The sharp ring machined into the face of a CF flange. Tightening the bolts drives it into the copper gasket, which seals the joint.', src: 'S6', match: /\bknife[- ]edges?\b/i },
    { id: 'kf', term: 'KF', def: 'A quick vacuum joint (ISO-KF): two chamfered flanges held by a hinged clamp and sealed by a rubber O-ring on a centring ring. Quick to open, for the rough-vacuum side.', src: 'S6', match: /\bKF\d*\b/ },
    { id: 'ofhc', term: 'OFHC copper', def: 'Oxygen-free, high-conductivity copper: pure and soft, so a knife edge can sink into it. CF gaskets are made of it.', src: 'S6', match: /\bOFHC\b|\boxygen-free\b/i },
    { id: 'ev', term: 'eV', def: 'Electronvolt, a unit of energy. As a temperature, 1 eV is about 11,600 K. In the glow only the electrons are that hot; the gas stays near room temperature.', match: /\beV\b/ },
    { id: 'glow', term: 'Glow discharge', def: 'A gas at low pressure made to conduct by a high voltage between two electrodes. Electrons accelerated by the field excite and ionise the gas, which glows.', src: 'S4', match: /\bglow[- ]discharges?\b/i },
    { id: 'cathode', term: 'Cathode', def: 'The negative electrode of a discharge. On the SPM1 it is the chamber wall.', src: 'S4', match: /\bcathodes?\b/i },
    { id: 'anode', term: 'Anode', def: 'The positive electrode of a discharge. On the SPM1, the electrodes on the bottom ports.', src: 'S4', match: /\banodes?\b/i },
    { id: 'langmuir', term: 'Langmuir probe', def: 'A small bare wire put into a plasma. Sweeping its voltage and measuring the current it collects gives the electron temperature and density.', match: /\bLangmuir\b/i },
    { id: 'pirani', term: 'Pirani gauge', def: 'A heat-loss gauge: gas carries heat away from a hot wire, faster at higher pressure. A Convectron adds convection, so it reads up to atmosphere. The reading depends on the gas.', src: 'S7', match: /\bPirani\b|\bConvectron\b/i },
    { id: 'mbar', term: 'mbar', def: 'Millibar, a unit of pressure. The air around us is about 1000 mbar.', match: /\bmbar\b/ },
    { id: 'torr', term: 'Torr', def: 'A unit of pressure: 1 Torr is 1.33 mbar, and the atmosphere is 760 Torr.', match: /\bTorr\b/ },
    { id: 'uhv', term: 'UHV', def: 'Ultra-high vacuum: around 10⁻⁹ mbar and below. Reaching it takes all-metal seals such as CF, and usually a bake-out.', match: /\bUHV\b|\bultra-high vacuum\b/i },
    { id: 'bake', term: 'Bake-out', def: 'Heating a vacuum chamber, typically to 150–250 °C, to drive water and gas off its walls so it pumps down lower.', match: /\bbake[- ]?outs?\b/i },
    { id: 'tig', term: 'TIG welding', def: 'Tungsten inert gas welding: an arc from a tungsten electrode under a shield of argon, which gives the clean welds vacuum parts need.', src: 'S4', match: /\bTIG\b/ },
    { id: 'feedthrough', term: 'Feedthrough', def: 'A flange that passes something through the vacuum wall: a high-voltage conductor in a ceramic insulator, or a shaft that moves on a bellows.', match: /\bfeedthroughs?\b/i },
  ];

  // ---------- Sub-parts: the technical sheet shown on the glass board ----------
  // Rows follow the same rule as the parts: a source id, 'photo' for a photo estimate, null for a derived value.
  // Where the SPM1's own part is not published, the sheet gives the standard or reference part and says so.
  const cfFlange = (dn, od, t, bc, n, hole, edge, recess) => ({
    title: `DN${dn}CF flange`,
    material: 'Stainless steel (grade not published)',
    rows: [
      ['Outside diameter', `${od} mm`, 'S9'],
      ['Thickness', `${t} mm`, 'S9'],
      ['Bolt circle', `${bc} mm`, 'S9'],
      ['Bolt holes', `${n} × Ø${hole} mm`, 'S9'],
      ['Knife edge', `Ø${edge} mm`, 'S9'],
      ['Gasket recess', `Ø${recess} mm`, 'S9'],
    ],
    note: 'A knife edge on the face bites into the copper gasket when the bolts are drawn up. Keep the edge clean and unscratched: a nick leaks whatever the torque.',
    sources: ['S9', 'S6'],
  });
  const gasket = (dn, od, id) => ({
    title: `DN${dn}CF copper gasket`,
    material: 'OFHC copper, plain or silver-plated',
    rows: [
      ['Outside diameter', `${od} mm`, 'S9'],
      ['Inside diameter', `${id} mm`, 'S9'],
      ['Thickness', '2.0 ± 0.1 mm', 'S9'],
    ],
    note: 'Single use. The knife edges leave a groove in both faces, and a used gasket will not seal again.',
    sources: ['S9', 'S6'],
  });
  const tube = (dn, od, wall, id) => ({
    title: `Port tube for DN${dn}CF`,
    material: 'Stainless steel (grade not published)',
    rows: [
      ['Outside diameter', `${od} mm`, 'S9'],
      ['Wall', `${wall} mm`, 'S9'],
      ['Bore', `${id} mm`, 'S9'],
    ],
    note: 'Welded into a hole cut in the elbow, with the flange welded on its outer end. The drawn tube follows this standard size; the SPM1’s own tube size is not published.',
    sources: ['S9', 'S4'],
  });
  // A hex head or nut on an M8 bolt is 13 mm across flats, on 5/16-24 1/2 in; on M6 10 mm, on 1/4-28 7/16 in.
  const SPANNER = { M8: '13 mm (M8) or 1/2 in (5/16-24)', M6: '10 mm (M6) or 7/16 in (1/4-28)' };
  // The length is the grip, a nut and two threads, rounded up to the next stock length; the bolts are drawn at it.
  const bolts = (dn, n, hole, grip, metric, imperial, len) => ({
    title: `DN${dn}CF flange bolts`,
    material: 'Stainless steel (grade not published)',
    rows: [
      ['Count', `${n}, one per hole`, 'S9'],
      ['Holes they pass', `Ø${hole} mm`, 'S9'],
      ['Thread', `${metric} or ${imperial} (the hole takes either; not published)`, 'std'],
      ['Grip', `${grip} mm: two flanges and a 2 mm gasket`, 'derived'],
      ['Length', `${metric} × ${len} mm: the grip, a nut and two threads, rounded up to a stock length`, 'derived'],
      ['Spanner', SPANNER[metric], 'derived'],
      ['Washers', 'none drawn; not published', 'assumed'],
    ],
    note: 'Draw them up in a star pattern in small steps until the flange faces meet evenly. Bolts that see bake-out are often silver-plated so they do not gall.',
    sources: ['S9'],
  });
  const nuts = (dn, n, metric, imperial) => ({
    title: `DN${dn}CF nuts`,
    material: 'Stainless steel (grade not published)',
    rows: [['Count', `${n}, one per bolt`, 'S9'], ['Thread', `${metric} or ${imperial} (not published)`, 'std'], ['Seat', 'back face of the other flange', 'std'], ['Spanner', SPANNER[metric], 'derived']],
    note: 'Each nut carries the bolt from the far side, so a joint can be opened without reaching inside.',
    sources: ['S9'],
  });
  // A KF centring ring with its O-ring (S6 gives the O-ring for each size).
  const kfRing = (size, oring) => ({
    title: `KF${size} centring ring and O-ring`,
    material: 'Metal centring ring with an elastomer O-ring (materials not published)',
    rows: [
      ['O-ring', `AS568-${oring}, the size for KF${size}`, 'S6'],
      ['Ring', 'holds the O-ring in place and lines the two flanges up', 'S11'],
      ['Drawn as', size === 16 ? 'Ø15 mm bore, 3 mm between the flange faces' : 'Ø37 mm bore, 4 mm between the flange faces', 'assumed'],
    ],
    note: 'The O-ring is the seal, so a hair or a scratch across it leaks. It is elastomer, not metal: the KF side is for rough vacuum. The ring is easy to drop when the clamp comes off.',
    sources: ['S6', 'S11'],
  });
  // Small hardware whose size is not published: what it holds and how it is drawn.
  const fastener = (title, rows, holds) => ({
    title,
    material: 'Not published',
    rows: [...rows.map(([k, v]) => [k, v, 'assumed'])],
    note: `${holds} Its size and make are not published; the rows give how it is drawn, so you know what you are looking at.`,
    sources: [],
  });
  const SUBDOCS = {
    elbow: {
      title: 'Vacuum elbow (one quarter of the ring)',
      material: 'Stainless steel (grade not published)',
      rows: [
        ['Tube size', '150 mm, four standard quarters', 'S1'],
        ['Drawn as', '154 × 2.0 mm DN160CF tube, 150 mm bore', 'S9'],
        ['Bend', '90° on a 230 mm centre-line radius', 'S2'],
        ['Ring', '460 mm across, four quarters bolted', 'S1'],
        ['Joining', 'TIG welded to its flanges', 'S4'],
        ['Leak test', 'to 10⁻⁹ mbar', 'S4'],
      ],
      note: 'The published 75 mm minor radius is half the 150 mm bore. The real wall thickness is not published.',
      sources: ['S1', 'S2', 'S4', 'S9'],
    },
    cf160: cfFlange(160, '203.2', '21.0', '181.0', 20, '8.4', '166.1', '171.4'),
    cf100: cfFlange(100, '152.4', '19.5', '130.3', 16, '8.4', '115.3', '120.6'),
    cf63: cfFlange(63, '114.3', '17.0', '92.2', 8, '8.4', '77.2', '82.5'),
    cf40: cfFlange(40, '69.9', '12.5', '58.7', 6, '6.8', '41.9', '48.3'),
    'gasket-160': gasket(160, '171.3', '152.5'),
    'gasket-100': gasket(100, '120.5', '101.7'),
    'gasket-63': gasket(63, '82.4', '72.0'),
    'gasket-40': gasket(40, '48.2', '39.2'),
    'tube-100': tube(100, '104.0', '2.0', '100.0'),
    'tube-63': tube(63, '63.5', '1.8', '59.9'),
    'tube-40': tube(40, '38.0', '1.5', '35.0'),
    'bolts-160': bolts(160, 20, '8.4', '44.0', 'M8', '5/16-24 UNF', 55),
    'bolts-100': bolts(100, 16, '8.4', '41.0', 'M8', '5/16-24 UNF', 50),
    'bolts-63': bolts(63, 8, '8.4', '36.0', 'M8', '5/16-24 UNF', 45),
    'bolts-40': bolts(40, 6, '6.8', '27.0', 'M6', '1/4-28 UNF', 35),
    'nuts-160': nuts(160, 20, 'M8', '5/16-24 UNF'),
    'nuts-100': nuts(100, 16, 'M8', '5/16-24 UNF'),
    'nuts-63': nuts(63, 8, 'M8', '5/16-24 UNF'),
    'nuts-40': nuts(40, 6, 'M6', '1/4-28 UNF'),
    'bolts-tapped': {
      title: 'DN40CF bolts into the reducer',
      material: 'Stainless steel (grade not published)',
      rows: [
        ['Thread', 'M6 or 1/4-28 UNF (not published)', 'std'],
        ['Holes', '6 tapped on a 58.7 mm circle', 'S9'],
        ['Length', 'M6 × 25 mm: the 12.5 mm cross flange, the 2 mm gasket and 10.5 mm of thread', 'derived'],
        ['Spanner', SPANNER.M6, 'derived'],
      ],
      note: 'The DN40 side of a zero-length reducer is tapped, so these bolts screw straight in and need no nuts. A bolt long enough to bottom out in the thread will not pull the gasket tight.',
      sources: ['S9'],
    },
    weld: {
      title: 'TIG weld',
      material: 'Fused stainless steel',
      rows: [['Process', 'tungsten inert gas (TIG)', 'S4'], ['Tested', 'to 10⁻⁹ mbar with the vessel', 'S4']],
      note: 'Drawn as a bead on the outside. A weld does not come apart, so Take apart leaves it on its tube and flange. In UHV work tubes are usually welded from the vacuum side so no gas is trapped in a crevice (a virtual leak). How these welds were made is not published.',
      sources: ['S4'],
    },
    'kf-ring-16': kfRing(16, 314),
    'kf-ring-40': kfRing(40, 326),
    'kf-hose-flange': {
      title: 'Hose end flange, KF40',
      material: 'Stainless steel, part of the bellows hose (not published)',
      rows: [['Size', 'KF40, to match the port and the pump', 'assumed'], ['Drawn as', 'Ø55 mm flange on a Ø41 mm tube', 'assumed']],
      note: 'It belongs to the bellows hose. It is drawn with the port, and with the pump at the other end, so a whole KF joint (both flanges, the centring ring and the clamp) comes apart together.',
      sources: ['S11'],
    },
    'kf40-inlet': {
      title: 'Pump inlet, KF40',
      material: 'Stainless steel (not published)',
      rows: [['Size', 'KF40 (not published)', 'assumed'], ['Drawn as', 'Ø55 mm flange on a Ø41 mm tube', 'assumed']],
      note: 'The bellows hose clamps onto it with a centring ring and O-ring between the flanges.',
      sources: ['S11'],
    },
    'sensor-nut': fastener('Sensor tube nut', [['Drawn as', '24 mm across flats, 10 mm high, over the Ø19 mm tube']], 'Holds the sensor tube in the gauge module.'),
    'gauge-plug': fastener('Gauge cable connector', [['Drawn as', 'Ø10 mm, 12 mm long']], 'Plugs the gauge cable into the side of the module.'),
    'compression-fitting': fastener('Outlet compression fitting', [['Drawn as', 'brass, a nut 11 mm across flats on a Ø5 mm line']], 'Joins the gas line to the needle valve’s outlet.'),
    'gas-inlet-fitting': fastener('Gas inlet fitting', [['Drawn as', 'brass block 24 × 24 × 18 mm, a nut 14 mm across flats']], 'Where the gas line from the cylinder joins the line up to the needle valve.'),
    'former-base-bolts': fastener('Base bolts', [['Count', '8 on a Ø232 mm circle'], ['Drawn as', 'heads 9 mm across flats, 5 mm high']], 'Hold the central former’s base flange down on the table.'),
    'former-rim-screws': fastener('Rim screws', [['Count', '8, round the top rim'], ['Drawn as', 'Ø6 mm heads']], 'Hold the top rim on the central former.'),
    'pf-bracket-bolts': fastener('Bracket bolts', [['Count', '2 per bracket, 8 per coil'], ['Drawn as', 'heads 9 mm across flats']], 'Bolt the outer PF coil’s brackets to the corner posts.'),
    'post-bracket-bolts': fastener('Bracket bolts', [['Count', '2 per post'], ['Drawn as', 'heads 10 mm across flats']], 'Hold each post’s angle bracket on the table top.'),
    'post-clamp-bolts': fastener('Clamp bolts', [['Count', '2 per clamp block'], ['Drawn as', 'heads 10 mm across flats']], 'Tighten the clamp block that grips a joint’s pair of flanges.'),
    'hv-feet': fastener('Mounting feet and bolts', [['Count', '2 feet, one bolt each'], ['Drawn as', 'heads 9 mm across flats']], 'Hold the HV supply on the table.'),
    'spectro-lid-screws': fastener('Lid screws', [['Count', '4'], ['Drawn as', 'Ø5 mm heads']], 'Hold the spectrometer’s lid on.'),
    'cable-gland': fastener('Cable gland', [['Drawn as', 'Ø14 mm']], 'Seals where the E-stop’s cable enters its box.'),
    'levelling-feet': fastener('Levelling feet', [['Count', '4, one per leg'], ['Drawn as', 'Ø18 mm stud on a Ø60 mm pad']], 'Level the table; turn each foot to take out a rock.'),
    'sma': fastener('SMA fibre connector', [['Type', 'SMA 905, the usual fibre connector on small spectrometers'], ['Drawn as', 'Ø11–12 mm']], 'Joins the optical fibre to the spectrometer and to the adaptor on the back viewport.'),
    'vp-flange-100': {
      title: 'DN100CF zero-length viewport flange',
      material: '304L stainless steel (reference part)',
      rows: [
        ['Flange', 'DN100CF, 152.4 mm OD', 'S9'],
        ['Bolt holes', '16 × Ø8.4 mm on 130.3 mm', 'S9'],
        ['Clear view', '90.0 mm', 'S10'],
        ['Glass seal', 'Kovar transition sleeve', 'S10'],
      ],
      note: 'Values for a standard DN100CF Kodial viewport (Lesker VPZL-600). The make on the SPM1 is not published.',
      sources: ['S10', 'S9'],
    },
    'vp-glass-100': {
      title: 'Viewport window glass',
      material: 'Kodial glass (alkali borosilicate 7056), fully annealed',
      rows: [
        ['View diameter', '90.0 mm', 'S10'],
        ['Thickness', '6.0 mm', 'S10'],
        ['Sealed by', 'Kovar sleeve to the flange', 'S10'],
        ['Bake-out', 'up to 350 °C, heating at ≤ 2–3 °C per minute', 'S10'],
      ],
      note: 'Kodial’s thermal expansion matches Kovar, which is what lets the glass be sealed to metal. Values are for a standard DN100CF Kodial viewport (Lesker VPZL-600); the SPM1’s viewport type is not published.',
      sources: ['S10'],
    },
    'vp-flange-40': {
      title: 'DN40CF viewport flange',
      material: '304L stainless steel (reference part)',
      rows: [
        ['Flange', 'DN40CF, 69.9 mm OD', 'S9'],
        ['Bolt holes', '6 × Ø6.8 mm on 58.7 mm', 'S9'],
        ['Clear view', '38.0 mm', 'S10'],
      ],
      note: 'Values for a standard DN40CF Kodial viewport (Lesker VPZL-275); the window on the SPM1 is not published.',
      sources: ['S10', 'S9'],
    },
    'vp-glass-40': {
      title: 'Laser-port window',
      material: 'Kodial borosilicate on the reference part; laser ports often use UV-grade fused silica or sapphire',
      rows: [['View diameter', '38.0 mm', 'S10'], ['Thickness', '3.0 mm', 'S10'], ['Bake-out', 'up to 350 °C', 'S10']],
      note: 'The window material and coating on the SPM1’s laser port are not published. Check them before choosing a laser wavelength.',
      sources: ['S10', 'S2'],
    },
    'reducer-100-kf40': {
      title: 'Zero-length reducer, DN100CF to KF',
      material: 'Stainless steel (grade not published)',
      rows: [['CF side', 'DN100CF, 16 × Ø8.4 mm on 130.3 mm', 'S9'], ['Outlet', 'ISO-KF stub (size assumed: KF40)', 'assumed']],
      note: 'The photos show the flexible pump line leaving this port; the outlet size is a guess.',
      sources: ['S9', 'S4'],
    },
    'kf-clamp': {
      title: 'KF (ISO-KF) clamp',
      material: 'Hinged clamp (metal not published)',
      rows: [
        ['Grips', 'the chamfered backs of both flanges, pulling them onto the centring ring', 'S11'],
        ['Tightened by', 'a wing nut (drawn); thumbscrew, bolt or lever clamps also exist', 'S11'],
        ['Seal', 'O-ring on a centring ring between the two flanges', 'S6'],
      ],
      note: 'A KF joint seals on an elastomer, not metal, so it is for the rough-vacuum side. Open the clamp and the joint comes apart by hand; the centring ring stays on one flange or falls out. Size and make on the SPM1 are not published.',
      sources: ['S6', 'S11'],
    },
    'reducer-63-40': {
      title: 'Zero-length reducer, DN63CF to DN40CF',
      material: 'Bronze-coloured in the photos (finish not published)',
      rows: [['DN63 side', '8 × Ø8.4 mm on 92.2 mm', 'S9'], ['DN40 side', '6 tapped holes on 58.7 mm', 'S9'], ['Seen in', 'S4 slides 9 and 16', 'photo']],
      note: '',
      sources: ['S9', 'S4'],
    },
    'cross-40': {
      title: 'DN40CF four-way cross',
      material: 'Stainless steel (grade not published)',
      rows: [
        ['Flanges', '4 × DN40CF, 69.9 mm OD', 'S9'],
        ['Tube', '38.0 × 1.5 mm', 'S9'],
        ['Arms used', 'gauge up, needle valve and blank to the sides', 'photo'],
      ],
      note: 'The arms in the photos are arranged this way; their real lengths are not published.',
      sources: ['S9', 'S4'],
    },
    'blank-40': {
      title: 'DN40CF blank flange',
      material: 'Stainless steel (grade not published)',
      rows: [['Outside diameter', '69.9 mm', 'S9'], ['Thickness', '12.5 mm', 'S9'], ['Bolt holes', '6 × Ø6.8 mm on 58.7 mm', 'S9']],
      note: 'A spare arm, closed off. It can later carry another gauge or a gas line.',
      sources: ['S9'],
    },
    'adaptor-40-kf16': {
      title: 'DN40CF to KF16 adaptor',
      material: 'Stainless steel (grade not published)',
      rows: [['CF side', 'DN40CF, 6 × Ø6.8 mm, bolted through to the cross', 'S9'], ['KF side', 'KF16 stub flange: the gauge clamps onto it', 'photo'], ['Drawn as', 'a 10 mm stub, Ø30 mm KF flange', 'assumed']],
      note: 'The gauge comes off here, at its KF16 clamp; the adaptor stays on the cross.',
      sources: ['S9', 'S4', 'S11'],
    },
    convectron: {
      title: 'Convectron ATM gauge module',
      material: 'Blue enclosure with display (photo)',
      rows: [
        ['Type', 'convection-enhanced Pirani (heat-loss) gauge', 'S7'],
        ['Range of the family', '≈ 10⁻⁴ to 1000 Torr', 'S7'],
        ['Mount', 'KF16 stub on the top of the stack', 'photo'],
      ],
      note: 'The label “Convectron ATM” is visible in the photos; the exact model is not confirmed. A heat-loss gauge reads gas-dependent, so use the N₂ or He correction.',
      sources: ['S7', 'S4'],
    },
    'kf16-tube': {
      title: 'KF16 tube and flange',
      material: 'Stainless steel',
      rows: [['Seen in', 'S4 slides 9, 15 and 16', 'photo'], ['Flange', 'KF16, drawn Ø30 mm on a Ø19 mm tube', 'assumed']],
      note: 'Raises the gauge head clear of the cross. Its flange clamps onto the adaptor’s KF16 stub. Length drawn from the photos.',
      sources: ['S4', 'S11'],
    },
    'tf-winding': {
      title: 'TF winding',
      material: 'Copper cable, light-blue insulation (photo)',
      rows: [
        ['Turns', '50', 'S1'],
        ['Cable', '6 mm diameter copper', 'S1'],
        ['Current', '40 A continuous, several times more pulsed', 'S1'],
        ['Cable length', '≈ 25 m per coil (50 turns × ≈ 0.5 m)', 'derived'],
        ['Drawn layout', '≈ 4 layers of 12 turns', 'assumed'],
      ],
      note: 'Wound directly onto the copper former clamped round the elbow (S4 slide 15). Insulation class and cable type are not published.',
      sources: ['S1', 'S4'],
    },
    'tf-former': {
      title: 'TF coil former',
      material: 'Copper sheet',
      rows: [
        ['Material', 'copper', 'S4'],
        ['Mounting', 'clamped round the elbow, under the winding', 'S4'],
        ['Tabs', 'cut into both edges and folded out to hold the winding', 'photo'],
      ],
      note: 'Sheet thickness and tab count are not published; 26 tabs per side are drawn.',
      sources: ['S4'],
    },
    'tf-cover': {
      title: 'TF cover band',
      material: 'Copper sheet (photo)',
      rows: [['Seen in', 'S4 slides 9 and 19', 'photo']],
      note: 'Wrapped over the finished winding, between the folded tabs.',
      sources: ['S4'],
    },
    'tf-terminal': {
      title: 'TF lead terminals',
      material: 'Not published',
      rows: [['Leads', 'two black leads per coil in the photos', 'photo']],
      note: 'Where the leads leave the coil is drawn as a small terminal block. That is a guess.',
      sources: ['S4'],
    },
    'hv-feedthrough': {
      title: 'HV electrical feedthrough',
      material: 'Ceramic insulator on a DN40CF flange (insulator type not published)',
      rows: [
        ['Flange', 'DN40CF', 'S9'],
        ['Drive', '4 kV pulsed supply', 'S4'],
        ['Circuit', 'anode electrode; the chamber is the cathode', 'S4'],
      ],
      note: 'HV feedthroughs are usually alumina ceramic brazed to the flange. The rating of this one is not published, so do not exceed the supply it was delivered with.',
      sources: ['S4', 'S9'],
    },
    'hv-cap': {
      title: 'HV terminal cap',
      material: 'Metal terminal (not published)',
      rows: [['Lead', 'pink HV lead in the photos', 'photo']],
      note: 'The supply’s lead plugs onto it. Touch it only with the supply off and grounded.',
      sources: ['S4'],
    },
    anode: {
      title: 'Anode disc',
      material: 'Not published',
      rows: [['Role', 'anode electrode of the glow discharge', 'S4']],
      note: 'Its size and height in the vessel are drawn as a guess.',
      sources: ['S4'],
    },
    'linear-ft': {
      title: 'Bellows linear-motion feedthrough',
      material: 'Stainless steel, welded bellows (typical)',
      rows: [['Status', 'Langmuir probe listed as an upgrade', 'S4']],
      note: 'A welded bellows lets the shaft move in and out without a sliding seal. Stroke and make are not published.',
      sources: ['S4'],
    },
    'probe-tip': {
      title: 'Langmuir probe tip',
      material: 'Wire tip in a ceramic sleeve (tip metal not published)',
      rows: [['Listed as', 'diagnostic', 'S1'], ['Also listed as', 'upgrade', 'S4']],
      note: 'Probe tips are usually tungsten wire, with the ceramic sleeve defining the collecting area. Use the real area in the fit (minimak-groundwork, S8).',
      sources: ['S1', 'S4', 'S8'],
    },
    'needle-body': {
      title: 'Needle (leak) valve',
      material: 'Not published (drawn in brass)',
      rows: [['Gas', 'N₂ or He', 'S2'], ['Upgrade', 'gas handling', 'S4']],
      note: 'A fine needle in a seat meters gas in against the pump. Make, flow range and fittings are not published.',
      sources: ['S2', 'S4'],
    },
    'former-tube': {
      title: 'Central former',
      material: 'Metal, white finish',
      rows: [['Diameter', '≈ 210 mm (photo estimate)', 'photo'], ['Material', 'metal former', 'S4']],
      note: 'PF1, PF2 and the solenoid are wound round it.',
      sources: ['S4'],
    },
    'pf-inner-winding': {
      title: 'Inner PF winding',
      material: 'Cable under copper tape (photo)',
      rows: [['Field in demos', 'PF1 & PF2 ≈ 5 mT', 'S4'], ['Control', 'independent supply', 'S2']],
      note: 'Turns, cable and current are not published.',
      sources: ['S2', 'S4'],
    },
    'sol-winding': {
      title: 'Solenoid winding',
      material: 'Not published',
      rows: [['Drive', 'low voltage, AC and DC', 'S2'], ['Built system', 'DC drive', 'S4']],
      note: 'Turns, position and current are not published.',
      sources: ['S2', 'S4'],
    },
    'sat-coil': {
      title: 'Satellite coil',
      material: 'Cable in a black hose sleeve, taped (photo)',
      rows: [['Diameter', '≈ 700 mm (photo estimate)', 'photo'], ['Count', '2, above and below', 'S1']],
      note: 'Turns and current are not published.',
      sources: ['S1', 'S4'],
    },
    'table-top': {
      title: 'Breadboard top',
      material: 'Steel skin (Thorlabs Nexus table, photo)',
      rows: [['Holes', 'M6 tapped on a 25 mm grid', 'photo'], ['Make', 'Thorlabs Nexus', 'photo']],
      note: 'The hole grid is the metric breadboard standard; the table’s own model number is not published.',
      sources: ['S4'],
    },
    'post-extrusion': {
      title: 'Corner post',
      material: 'Slotted aluminium extrusion',
      rows: [['Profile', '≈ 45 mm square (photo estimate)', 'photo']],
      note: '',
      sources: ['S4'],
    },
    'post-clamp': {
      title: 'Flange clamp block',
      material: 'Not published',
      rows: [['Holds', 'one joint flange pair', 'photo']],
      note: 'Grey blocks between the posts and the joints in the photos (S4 slide 15).',
      sources: ['S4'],
    },
    'psu-tf': {
      title: 'TF supply channels',
      material: 'Switch-mode supplies',
      rows: [['Channels', '8, one per TF coil', 'S2'], ['Rating', 'continuous, up to 40 A per coil', 'S4'], ['Type', 'independent variable switch-mode', 'S1']],
      note: 'Make and voltage are not published.',
      sources: ['S1', 'S2', 'S4'],
    },
    'psu-other': {
      title: 'PF, satellite and solenoid channels',
      material: 'Switch-mode supplies',
      rows: [['PF', '4 coils, each independently controlled', 'S2'], ['Solenoid', 'DC drive', 'S4']],
      note: 'How the channels are split between the chassis is drawn as a guess.',
      sources: ['S2', 'S4'],
    },
    'pf-outer': {
      title: 'Outer PF coil',
      material: 'Not published (drawn on an aluminium channel)',
      rows: [['PF coils', '4 in all, at top and bottom of the chamber', 'S1'], ['Control', 'each independently controlled', 'S2']],
      note: 'Radius, height, former and turns are not published; this pair is drawn where it is plausible.',
      sources: ['S1', 'S2'],
    },
    'drawer-psu': {
      title: 'Switch-mode supply in the drawer',
      material: 'Enclosed switch-mode supply (photo)',
      rows: [['Seen in', 'S4 slide 12, drawer pulled out', 'photo']],
      note: 'Powers the control electronics; its rating is not published.',
      sources: ['S4'],
    },
    'drawer-rail': {
      title: 'Relays and terminal blocks',
      material: 'DIN-rail components (photo)',
      rows: [['Seen in', 'S4 slide 12, drawer pulled out', 'photo'], ['Safety', 'PLC-based safety monitor', 'S4']],
      note: 'How the interlock chain is wired is not published.',
      sources: ['S4'],
    },
    plc: {
      title: 'PLC safety monitor',
      material: 'DIN-rail controller (make not published)',
      rows: [['Role', 'PLC-based safety monitor and interlocks', 'S4'], ['I/O', 'networked digital I/O and DAQ', 'S4']],
      note: 'Never bypass an interlock.',
      sources: ['S4'],
    },
    'pump-block': {
      title: 'Rotary vane pump',
      material: 'Not published',
      rows: [['Type', 'oil-sealed rotary vane', 'S4'], ['Upgrade', 'turbopump', 'S4']],
      note: 'Make, pumping speed and ultimate pressure are not published.',
      sources: ['S4'],
    },
    'bellows-hose': {
      title: 'Flexible pump line',
      material: 'Corrugated stainless steel (photo)',
      rows: [['Seen in', 'S4 slides 14, 16 and 19', 'photo']],
      note: 'Bend it gently: kinked bellows crack and leak.',
      sources: ['S4'],
    },
    'spectro-body': {
      title: 'Spectrometer',
      material: 'Not published',
      rows: [['Range', 'UV–VIS, wide band', 'S2']],
      note: 'Model, resolution and fibre type are not published.',
      sources: ['S2', 'S4'],
    },
    webcam: {
      title: 'Webcam',
      material: 'Not published',
      rows: [['Role', 'tracks the glow’s position and shape', 'S2']],
      note: '',
      sources: ['S2', 'S4'],
    },
    'estop-button': {
      title: 'Emergency-stop button',
      material: 'Red mushroom head on a yellow enclosure (photo)',
      rows: [['Seen in', 'S4 slide 19', 'photo'], ['Safety', 'PLC-based safety monitor', 'S4']],
      note: '',
      sources: ['S4'],
    },
  };
  // Which sheet a sub-part shows: "part|sub-part name" first, then "*|sub-part name".
  const SUBMAP = {
    'vessel|Elbow, 150 mm stainless tube': 'elbow',
    'joints|DN160CF flange': 'cf160', 'joints|20 bolts': 'bolts-160', 'joints|20 nuts': 'nuts-160', 'joints|TIG weld to the elbow': 'weld',
    'gaskets|OFHC copper gasket': 'gasket-160',
    'lateral|Port tube, 104 mm': 'tube-100', 'lateral|DN100CF flange': 'cf100',
    'viewport|Copper gasket': 'gasket-100', 'viewport|Viewport flange': 'vp-flange-100', 'viewport|Window glass, sealed into the flange': 'vp-glass-100',
    'pumpPort|Copper gasket': 'gasket-100', 'pumpPort|Zero-length reducer with KF40 stub': 'reducer-100-kf40', 'pumpPort|KF40 clamp with wing nut': 'kf-clamp',
    'pumpPort|KF40 centring ring and O-ring': 'kf-ring-40', 'pumpPort|Hose end flange, KF40': 'kf-hose-flange',
    '*|16 bolts': 'bolts-100', '*|16 nuts': 'nuts-100', '*|8 bolts': 'bolts-63', '*|8 nuts': 'nuts-63', '*|6 bolts': 'bolts-40', '*|6 nuts': 'nuts-40',
    '*|TIG weld': 'weld',
    'diagPorts|Port tube, 38 mm': 'tube-40', 'diagPorts|DN40CF flange': 'cf40', 'diagPorts|Port tube, 63.5 mm': 'tube-63', 'diagPorts|DN63CF flange': 'cf63',
    'laser|Copper gasket': 'gasket-40', 'electrode|Copper gasket': 'gasket-40', 'probe|Copper gasket': 'gasket-40', 'stack|Copper gasket': 'gasket-63',
    'stack|3 DN40 gaskets': 'gasket-40', 'needle|Copper gasket': 'gasket-40',
    'laser|DN40CF viewport flange': 'vp-flange-40', 'laser|Window glass': 'vp-glass-40',
    'electrode|HV feedthrough: flange, ceramic insulator, anode rod': 'hv-feedthrough', 'electrode|HV terminal cap': 'hv-cap', 'electrode|Anode disc': 'anode',
    'probe|Bellows linear feedthrough': 'linear-ft', 'probe|Probe: shaft, ceramic sleeve, wire tip': 'probe-tip',
    'stack|DN63 to DN40 reducer flange': 'reducer-63-40', 'stack|DN40 four-way cross': 'cross-40', 'stack|6 bolts into the reducer': 'bolts-tapped',
    'stack|DN40 blank flange': 'blank-40', 'stack|6 bolts on the blank': 'bolts-40', 'stack|6 nuts on the blank': 'nuts-40',
    'stack|DN40 to KF16 adaptor flange': 'adaptor-40-kf16', 'stack|6 bolts on the adaptor': 'bolts-40', 'stack|6 nuts on the adaptor': 'nuts-40',
    'gauge|Convectron ATM display module': 'convectron', 'gauge|KF16 tube and flange': 'kf16-tube', 'gauge|KF16 clamp': 'kf-clamp',
    'gauge|KF16 centring ring and O-ring': 'kf-ring-16', 'gauge|Sensor tube nut': 'sensor-nut', 'gauge|Cable connector': 'gauge-plug',
    'needle|DN40 inlet flange': 'cf40', 'needle|Needle valve body': 'needle-body', 'needle|Needle stem and knob': 'needle-body',
    'needle|Outlet compression fitting': 'compression-fitting', 'needle|Gas inlet fitting': 'gas-inlet-fitting',
    'former|8 base bolts': 'former-base-bolts', 'former|8 rim screws': 'former-rim-screws', 'pfOuter|8 bracket bolts': 'pf-bracket-bolts',
    'posts|Bracket bolts': 'post-bracket-bolts', 'posts|Clamp bolts': 'post-clamp-bolts', 'hv|Mounting feet and bolts': 'hv-feet',
    'spectro|Lid screws': 'spectro-lid-screws', 'spectro|SMA fibre input': 'sma', 'spectro|SMA connector': 'sma', 'estop|Cable gland': 'cable-gland',
    'table|4 levelling feet': 'levelling-feet',
    'tf|Winding: 50 turns of 6 mm cable': 'tf-winding', 'tf|Copper former with fold-out tabs': 'tf-former', 'tf|Copper cover band': 'tf-cover', 'tf|Terminal block and lead studs': 'tf-terminal',
    'former|White metal tube': 'former-tube', 'pfInner|Winding, copper-taped cable': 'pf-inner-winding', 'solenoid|Winding': 'sol-winding',
    'satellite|Cable in a hose sleeve, taped': 'sat-coil',
    'table|Breadboard top skin, M6 on 25 mm': 'table-top', 'posts|Slotted aluminium extrusion': 'post-extrusion', 'posts|Flange clamp block': 'post-clamp',
    'psu|8 TF supply channels': 'psu-tf', 'psu|4 PF supply channels': 'psu-other', 'psu|Satellite and solenoid channels': 'psu-other',
    'drawer|PLC safety monitor': 'plc', 'drawer|Switch-mode supply': 'drawer-psu', 'drawer|4 relays': 'drawer-rail', 'drawer|Terminal blocks': 'drawer-rail', 'drawer|DIN rails': 'drawer-rail',
    'pfOuter|Aluminium U-channel former': 'pf-outer', 'pfOuter|Winding': 'pf-outer',
    'pump|Pump block (oil-sealed vane stage)': 'pump-block', 'pump|KF40 clamp': 'kf-clamp', 'hose|Bellows hose': 'bellows-hose',
    'pump|KF40 inlet port': 'kf40-inlet', 'pump|KF40 centring ring and O-ring': 'kf-ring-40', 'pump|Hose end flange, KF40': 'kf-hose-flange',
    'spectro|Spectrometer body': 'spectro-body', 'camera|Webcam body and lens': 'webcam', 'estop|Mushroom button': 'estop-button',
  };

  PARTS.forEach((p, i) => { p.n = i + 1; });
  root.SPM1_DOCS = { SOURCES, GROUPS, PARTS, NOT_DRAWN, JOINS, RUN, TOUR, ORDER, QUIZ, GLOSSARY, SUBDOCS, SUBMAP };
})(typeof window !== 'undefined' ? window : globalThis);
