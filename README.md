# SPM1 anatomy

An interactive 3D anatomy of the MinimaK SPM1 simple magnetised torus by Rideo Systems, drawn in the style of [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy): solid shaded parts with inked outlines on a framed card. Its aim is the structure of the machine: what each part is, how it attaches to the next one, and where each number comes from. It does not model the plasma physics.

Open [`index.html`](index.html) in a browser. The first time it needs an internet connection, to load three.js from jsDelivr. There is no build step.

## The page

| Area | What it does |
| --- | --- |
| **Assembly** (left) | The 30 components in seven groups. Click a name to read about it, double-click to inspect it on its own. The eye hides a part or a whole group. The dot gives the geometry basis (below). The search box filters by name, spec or description. "Listed, not drawn" collects options and upgrades that are named in the sources but not drawn. |
| **Viewer** (centre) | The model. Drag to turn it like a plotly turntable, right-drag or Shift-drag to pan, scroll to zoom toward the pointer. The triad in the corner shows the axes; click an axis end to look along it. The scale bar is true at every zoom, because the view is orthographic. |
| **Inspector** (right) | **Part**: what the part does, its specification with a source tag on every row, its pieces, what it connects to, and practical notes. **Sources**: every reference, what was taken from it, and which parts cite it. **Controls**: every mouse, touch and key binding. |
| **Modebar** (top) | Orbit or pan on left-drag, zoom, reset, fit the whole system, the Iso, Front, Right and Top views, Explode with its **Spread** slider, Cutaway, **Panels**, and the theme: the light drawing or the hologram. |

Either side panel folds to a thin rail with the arrow in its header, and **Panels** (or `F`) folds or unfolds both, giving the model and its screens the full width. The page remembers the choice. On a narrow screen the panels stack under the model instead.

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
- A part with several pieces (three viewports, eight TF coils) starts with all of them. The arrows beside **All** in the inspect bar, or `,` and `.`, step through them one at a time, and the camera frames each. Clicking **All** picks the nearest piece, or goes back to every piece. A double-click on a piece, or the pieces list in the inspector, does the same.
- **Context** turns the ghost of the rest of the machine on or off.
- **Esc** steps back one level: the last pinned sheet, then the piece, the part and the selection.
- **Done** or **Back to assembly** reverses the inspect at the pace of an explode, so you can see where the part goes:
  1. A part that was taken apart goes back together.
  2. The part flies home while the camera glides back to the view you had before.
  3. The rest of the machine gets its outlines, then turns solid, and the plasma lights again.

  Any drag, zoom or view button during the move takes over the camera. With reduced motion turned on, it goes back at once.

### Information screens

While inspecting, the part is described on screens floating beside it, after the displays around Tony Stark's holograms. The camera frames the part in the room between them. **Screens** in the inspect bar, or `S`, turns them off and on.

- **The component.** Its name and piece, what it does, and its specification. A second screen lists what it is made of, what it connects to and a practical note. Click a sub-part to pin its sheet, or a connected part to inspect that instead. With both panels open the inspector already shows this, so these two appear once the inspector is folded or the view is wide.
- **Sub-part sheets.** Point at a sub-part and its technical sheet appears on a live screen (dashed edge). It follows the pointer and lingers a moment after the pointer leaves. To keep a sheet, click the sub-part or the pin on the live screen. Up to four pinned sheets stay until you close them with ×, or with `Esc` for the last one.
- **Linking.** Hovering a screen lights its sub-part in the model. There are no arrows to follow as you turn.
- **On a phone** the last pinned sheet docks under the model.

A sheet gives the material, the dimensions and notes, with a source tag on every row.

- **Vacuum hardware** is drawn to the standard and documented from it:
  - ConFlat flanges, port tubes and copper gaskets for DN40, DN63, DN100 and DN160 come from the MBE-Komponenten table: OD, thickness, bolt circle, holes, knife edge and seal recess.
  - Bolts and nuts get the thread their holes take (M6 or ¼-28; M8 or 5/16-24) and their grip length.
  - The viewport windows (Kodial glass, Kovar sleeve, 90 × 6 mm for DN100CF, 38 × 3 mm for DN40CF, 350 °C bake-out) come from Lesker's reference parts.
  - Each sheet says when the SPM1's own part is not published.
- **Coils, electrodes, the gauge and the control parts** carry what the sources and photos show. Where nothing is published, the sheet says so rather than guessing.

### Hologram

The theme button switches between the light drawing and a hologram. A dark system theme opens the hologram. The colours follow [holographic-shader-visualizer-three.Js](https://github.com/YasirAwan4831/holographic-shader-visualizer-three.Js): cyan `#00d5ff` on a dark blue grid.

- Every surface adds light, brightest where it turns away from you, so the inside of the machine shows through.
- The nearest surface is drawn at full strength and the ones behind it faintly, so the front still reads first.
- The whole machine is one cyan, the colour of the optical table, a little brighter for parts that are light in the drawing. Only the plasma, which carries energy, glows in another colour (pink, white at its core).
- The selection is the same cyan, filled in more strongly, and stays visible through whatever is in front of it.
- Edges glow cyan.
- Scan lines drift up the model and a bright sweep passes through it every 7 s. Rings on the projector floor pulse outward.
- The panels and the information screens are drawn as a HUD, with cyan corner brackets and a slow scan passing down each screen.

The animation runs at 30 frames a second while the page is idle, and stands still with reduced motion.

### Keys

Arrows turn, Shift+arrows pan, `+`/`−` zoom, `0` resets, `A` fits everything, `1`–`4` pick a view, `E` explode, `[` `]` spread, `C` cutaway, `I` inspect, `T` take apart, `,` `.` previous and next piece, `G` ghost, `S` screens, `F` panels, `H` hide.

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
| S9 | [MBE-Komponenten, flange, gasket and tube dimensions](https://www.mbe-komponenten.de/service/flange-gasket/) | Every CF flange, port tube, gasket and bolt hole in the model and on the sheets |
| S10 | [Kurt J. Lesker, Kodial CF viewports](https://www.lesker.com/viewports/viewports-cf-flanged-kodial-glass.cfm) | Viewport glass, view diameter, thickness, Kovar seal, bake-out |

## How true it is

Every part has a basis, shown as the dot in the tree:

- **Spec** (filled dot): the number or placement is published. R₀ 230 mm, a 75 mm, four 150 mm elbows, 8 TF coils × 50 turns of 6 mm cable up to 40 A, 3 viewing + 1 vacuum + 4 diagnostic ports, the 90 × 90 × 160 cm envelope.
- **Photo** (half dot): scaled or placed from the webinar photos. The joints sit on the diagonals, clamped to four aluminium corner posts. The TF formers have fold-out copper tabs. The PF1/PF2 windings and leads are on a white central former. The satellite coils are hose-wound rings. The gauge and gas stack is on top of the back quarter. The table is a Thorlabs Nexus. The control drawer, the coil-supply chassis and the pump are under the table.
- **Assumed** (ring): placed where plausible. These are the outer PF coils (PF3, PF4), the solenoid's position, the HV supply, the gas valve, the Langmuir probe, the webcam and the spectrometer.

The flange sizes (DN160CF joints, DN100CF lateral ports, DN40CF top and bottom ports, ≈DN63CF gauge port) are drawn to the MBE-Komponenten CF table (S9) and match the bolt counts in the photos. The vessel is drawn as a 154 × 2 mm DN160CF tube, so its 150 mm bore gives the published 75 mm minor radius. Derived numbers in the inspector (vessel volume, field on axis, cable per coil) are marked "derived".

To correct the model at the kickoff, change `D` at the top of `device.js` and the `basis` and spec rows in `parts.js`.
