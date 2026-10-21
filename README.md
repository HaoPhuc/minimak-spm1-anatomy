# SPM1 anatomy

An interactive 3D anatomy of the MinimaK SPM1 simple magnetised torus by Rideo Systems, drawn in the style of [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy): solid shaded parts with inked outlines on a framed card. Its aim is the structure of the machine: what each part is, how it attaches to the next one, and where each number comes from. It does not model the plasma physics.

Open [`index.html`](index.html) in a browser. The first time it needs an internet connection, to load three.js from jsDelivr. There is no build step.

## The page

| Area | What it does |
| --- | --- |
| **Assembly** (left) | The 30 components in seven groups. Click a name to read about it, double-click to inspect it on its own. The eye hides a part or a whole group. The dot gives the geometry basis (below). The search box filters by name, spec or description. "Listed, not drawn" collects options and upgrades that are named in the sources but not drawn. |
| **Viewer** (centre) | The model. Drag to turn it like a plotly turntable, right-drag or Shift-drag to pan, scroll to zoom toward the pointer. The triad in the corner shows the axes; click an axis end to look along it. The scale bar is true at every zoom, because the view is orthographic. |
| **Inspector** (right) | **Part**: what the part does, its specification with a source tag on every row, its pieces, what it connects to, and practical notes. **Sources**: every reference, what was taken from it, and which parts cite it. **Controls**: every mouse, touch and key binding. |
| **Modebar** (top) | Orbit or pan on left-drag, zoom, reset, fit the whole system, the Iso, Front, Right and Top views, Explode with its **Spread** slider, Cutaway, theme. |

### Explode

**Explode** takes every component off the machine at once:

- The quarters move out, and the coils, ports and fittings lift off them.
- The PF and satellite coils rise.
- The table, the supplies and the pump drop away.
- Cables and the pump hose stay plugged into both ends.

The **Spread** slider next to the button, or `[` and `]`, sets how far apart they go (0.4× to 2.5×). The plasma is off while the machine is apart. The windows are clear glass, and each elbow has a real opening behind its port, so you can look into the vessel through any window.

### Inspecting one component

Double-click a part, or press **Inspect on its own**. The part lifts out of the machine, everything else turns into an x-ray ghost, and the camera frames the part and turns around it. Then:

- **Take apart** separates the part into its sub-parts along the directions they come off:
  - Bolts slide out of their holes and nuts come off the back.
  - Gaskets come out from between their flanges.
  - A TF coil's copper former, winding and cover band separate along the coil axis.
  - The pump's motor and fan cover come off its block.

  Its own **Spread** slider sets the spacing. A part with several pieces is taken apart one piece at a time, starting with the nearest.
- The inspector lists what the part is **made of**. Hover a name to light that sub-part in the view, or hover the view to name the sub-part under the pointer.
- **Context** turns the ghost of the rest of the machine on or off.
- The **pieces** list in the inspector, or a double-click on one piece, zooms to a single piece (one of the eight TF coils, one joint flange). **All** goes back to every piece.
- **Esc** steps back one level: piece, then part, then selection.

Keys: arrows turn, Shift+arrows pan, `+`/`−` zoom, `0` resets, `A` fits everything, `1`–`4` pick a view, `E` explode, `[` `]` spread, `C` cutaway, `I` inspect, `T` take apart, `G` ghost, `H` hide.

## Files

| File | What it is |
| --- | --- |
| [`index.html`](index.html) | The page: renderer and ink pass, turntable camera, inspect mode, assembly tree, inspector |
| [`device.js`](device.js) | The geometry in centimetres. One table of dimensions (`D`) at the top, the ConFlat sizes (`CF`), and `DETACH`, how far each part travels when inspected. Each piece carries `apart`, where it goes in the exploded view. Each mesh carries `sub`, the sub-part it belongs to, and `ex`, where that sub-part goes when the part is taken apart |
| [`parts.js`](parts.js) | The documentation: `SOURCES`, `GROUPS`, one entry per component in `PARTS`, and `NOT_DRAWN` |

## Sources

| Id | Source | Used for |
| --- | --- | --- |
| S1 | [minitmak.com](https://www.minitmak.com/) | Vessel quarters and ring, port counts, TF turns, cable and current, PF and satellite coils, supplies, discharge, diagnostics, software |
| S2 | [minitmak.com/specification](https://www.minitmak.com/specification) | R₀ and a, TF field, PF control, solenoid drive, gases, plasma temperature, envelope |
| S3 | [rideosystems.biz/technology](https://www.rideosystems.biz/technology) | The same headline specification |
| S4 | [P. Apte, "The Minimak. Design, Build and Operation", Univ. of Manchester webinar, Oct 2025 (PDF)](https://www.minitmak.com/_files/ugd/5de522_5cee74b6dc514f1eb1a3fee4cb50b9e4.pdf) | Construction (TIG welds, ConFlat, leak test, copper TF formers, metal PF formers), pump and gauge, 40 A supplies, 4 kV glow supply, PLC, software, operating fields, upgrades. Its photos set most of the proportions |
| S5 | [Kurt J. Lesker, ConFlat technical notes](https://www.lesker.com/newweb/flanges/flanges_technicalnotes_conflat_1.cfm) | CF flange sizes |
| S6 | [Wikipedia, Vacuum flange](https://en.wikipedia.org/wiki/Vacuum_flange) | How CF and KF joints seal |
| S7 | [MKS, Mini-Convectron gauge](https://www.mks.com/p/275600-0-GD-T) | The Convectron gauge family and its range |
| S8 | [minimak-groundwork](https://github.com/HaoPhuc/minimak-groundwork) | TU/e context and the Langmuir fit script |

## How true it is

Every part has a basis, shown as the dot in the tree:

- **Spec** (filled dot): the number or placement is published. R₀ 230 mm, a 75 mm, four 150 mm elbows, 8 TF coils × 50 turns of 6 mm cable up to 40 A, 3 viewing + 1 vacuum + 4 diagnostic ports, the 90 × 90 × 160 cm envelope.
- **Photo** (half dot): scaled or placed from the webinar photos. The joints sit on the diagonals, clamped to four aluminium corner posts. The TF formers have fold-out copper tabs. The PF1/PF2 windings and leads are on a white central former. The satellite coils are hose-wound rings. The gauge and gas stack is on top of the back quarter. The table is a Thorlabs Nexus. The control drawer, the coil-supply chassis and the pump are under the table.
- **Assumed** (ring): placed where plausible. These are the outer PF coils (PF3, PF4), the solenoid's position, the HV supply, the gas valve, the Langmuir probe, the webcam and the spectrometer.

The flange sizes (DN160CF joints, DN100CF lateral ports, DN40CF top and bottom ports, ≈DN63CF gauge port) follow the CF standard and match the bolt counts in the photos. Derived numbers in the inspector (vessel volume, field on axis, cable per coil) are marked "derived".

To correct the model at the kickoff, change `D` at the top of `device.js` and the `basis` and spec rows in `parts.js`.
