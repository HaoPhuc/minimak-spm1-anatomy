# SPM1 anatomy

An interactive 3D anatomy of the MinimaK SPM1, drawn in the style of [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy): solid shaded parts with inked outlines, a framed card, a live readout and calm motion.

Open [`index.html`](index.html) in a browser. It needs an internet connection the first time, to load three.js from jsDelivr. There is no build step.

## What you can do

| Control | What it shows |
| --- | --- |
| **Take apart** (E) | The four vessel quarters, coils and pump separate. The copper gaskets sit between the ConFlat flanges. |
| **Open vessel** (C) | Cuts away the top of one quarter. Cut faces are hatched. The Langmuir probe tip stands in the glow. |
| **Field lines** (F) | Toroidal field lines at equal flux spacing, so they crowd toward the inboard side: B ∝ 1/R. |
| **Drift lesson** (D) | A cross-section looking along B. ∇B and curvature drifts separate the charges, E × B carries the plasma into the outer wall. |
| Sliders | TF current, PF1 + PF2 current, fill pressure, gas, discharge on or off |
| Click a part | Spec, what it does, and what to know before you touch it |

Drag to turn, scroll or pinch to zoom, right-drag or shift-drag to pan, double-click to reset.

## Files

| File | What it is |
| --- | --- |
| [`index.html`](index.html) | The page: renderer, ink pass, controls, legend |
| [`device.js`](device.js) | The geometry, in centimetres, from one table of dimensions (`D`) |
| [`parts.js`](parts.js) | The parts list: names, specs, notes, and where each shape comes from |
| [`model.js`](model.js) | The physics behind every number on the page. Same formulas and assumptions as [`docs/primer.md`](https://github.com/HaoPhuc/minimak-groundwork/blob/main/docs/primer.md) in minimak-groundwork |

## How true it is

- **From the spec:** R₀ 23 cm, a 7.5 cm, four 150 mm elbows in a 460 mm ring, 8 TF coils × 50 turns up to 40 A, 4 PF coils, 2 satellite coils, central solenoid, 3 viewports, 1 pumping port, 4 diagnostic ports, the 90 × 90 × 160 cm envelope.
- **Scaled from photos:** flange sizes, the copper coil formers, the hose-wound satellite rings, the posts, the optical table, the pump line.
- **Placed by guess:** PF coil radii and heights, which feedthrough sits on which port, the electrodes, the gauge, the supply rack. The parts list marks these *approx.*

The glow's brightness, width and vertical shift only show the trend. The table of numbers comes from `model.js` and assumes T_e = 3 eV, T_i = 0.1 eV and n_e = 10¹⁶ m⁻³.

After the kickoff, correct the dimensions in `D` at the top of `device.js` and the `basis` of each part in `parts.js`.
