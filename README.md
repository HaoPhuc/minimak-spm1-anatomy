# SPM1 anatomy

An interactive 3D anatomy of the MinimaK SPM1 simple magnetised torus by Rideo Systems, drawn in the style of [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy): solid shaded parts with inked outlines on a framed card. Its aim is the structure of the machine: what each part is, how it attaches to the next one, and where each number comes from. It does not model the plasma physics.

Open [`index.html`](index.html) in a browser. The first time it needs an internet connection, to load three.js from jsDelivr. There is no build step.

## The page

| Area | What it does |
| --- | --- |
| **Assembly** (left) | The 30 components in seven groups. Click a name to read about it, double-click to inspect it on its own. The eye hides a part or a whole group. The dot gives the geometry basis (below). The search box filters by name, spec or description; every word you type must match. Words that name a piece or a sub-part ("left viewport bolt", "gasket back") also list the matching pieces under their part, such as *Left viewport (webcam) · 16 bolts*; a click on one inspects that piece and keeps its sheet open. "Listed, not drawn" collects options and upgrades that are named in the sources but not drawn. |
| **Viewer** (centre) | The model. Drag to turn it like a plotly turntable, right-drag or Shift-drag to pan, scroll to zoom toward the pointer. The triad in the corner shows the axes; click an axis end to look along it. The scale bar is true at every zoom, because the view is orthographic. |
| **Inspector** (right) | **Part**: what the part does, its specification with a source tag on every row, its pieces, what it connects to, and practical notes. **Sources**: every reference, what was taken from it, and which parts cite it. **Controls**: every mouse, touch and key binding. |
| **Modebar** (top) | Orbit or pan on left-drag, zoom, reset, fit the whole system, the Iso, Front, Right and Top views, Explode with its **Spread** slider, Cutaway, **Panels**, and the theme: the light drawing or the hologram. |

Drag the edge between a side panel and the view to size the panel. Double-click the edge for the default width, or focus it and use the arrow keys. Dragged nearly shut, a panel folds to a thin rail; the arrow in its header does the same, and a click on the rail opens it again. **Panels** (or `F`) folds or unfolds both, giving the model and its screens the full width. The page remembers the sizes. On a narrow screen the panels stack under the model instead.

### Explode

**Explode** takes every component off the machine at once:

- The quarters move out, and the coils, ports and fittings lift off them.
- The PF and satellite coils rise.
- The table, the supplies and the pump drop away.
- Cables and the pump hose stay plugged into both ends.

The **Spread** slider next to the button, or `[` and `]`, sets how far apart they go (0.4× to 2.5×). The plasma is off while the machine is apart. The windows are clear glass, and each elbow has a real opening behind its port, so you can look into the vessel through any window.

### Inspecting one component

Double-click a part, or press **Inspect on its own**. The rest of the machine fades to an x-ray ghost, then the part lifts out while the camera glides round to frame it, so you can see where it comes from. Then:

- **Take apart** separates the part into its sub-parts along the directions they come off:
  - Bolts slide out of their holes and nuts come off the back.
  - Gaskets come out from between their flanges.
  - A TF coil's copper former, winding and cover band separate along the coil axis.
  - The pump's motor and fan cover come off its block.

  Its own **Spread** slider sets the spacing. A part with several pieces is taken apart one piece at a time, starting with the nearest.
- Pieces are named by where they sit. The gaskets are named by their joint (*Right–back joint*: joint k sits on the diagonal between two quarters). The eight joint flanges are named by their joint and the quarter they are welded to (*Right–back joint, right side*).
- A part with several pieces (three viewports, eight TF coils) starts with all of them. The arrows beside **All** in the inspect bar, or `,` and `.`, step through them one at a time. The other pieces fade to ghosts and the camera glides to the one you picked. Sheets you kept on other pieces stay open, dimmed, so two pieces can be compared side by side; each sheet's bar names its piece. Clicking **All** picks the nearest piece, or goes back to every piece. A double-click on a piece, or the pieces list in the inspector, does the same.
- **Context** turns the ghost of the rest of the machine on or off.
- **Esc** steps back one level: the Sheets menu, the preview, the last pinned sheet, then the piece, the part and the selection.
- **Done** or **Back to assembly** reverses the inspect at the pace of an explode, so you can see where the part goes:
  1. A part that was taken apart goes back together.
  2. The part flies home while the camera glides back to the view you had before.
  3. The rest of the machine gets its outlines, then turns solid, and the plasma lights again.

  Any drag, zoom or view button during the move takes over the camera. With reduced motion turned on, it goes back at once.

### Information screens

While inspecting, the part is described on screens floating in the view, after the displays around Tony Stark's holograms. Drag any screen by its top bar to put it where you like; it stays there. **Screens** in the inspect bar, or `S`, turns them off and on.

- **The component.** Its name and piece, what it does, and its specification. A second screen lists what it is made of, what it connects to and a practical note. Click a sub-part there to preview its sheet, or a connected part to inspect that instead. A link lands on the connected part's piece nearest the one you were looking at (from the webcam, *Viewports* opens on the left viewport); from a view of every piece it opens on every piece too. Every link goes both ways. **← name** in the inspect bar, or `Backspace`, goes back to the part and piece you came from. Each part keeps its sheets, folds and places, so going back, or inspecting it again later, brings them back. They start on the left. With the inspector open beside a narrow view, it already shows the same, so these two appear once the inspector is folded or the view is wide.
- **The sheet column.** Sub-part sheets stack in a column on the right. The camera frames the part in the room between the screens, and the column is kept free even when it is empty, so a preview opening never moves the camera and never covers the part. Pinning or closing a sheet doesn't move it either. When the sheets don't all fit, the oldest fold to their top bar, which names the sub-part. Click a folded bar to open it; the next oldest folds instead.
- **Previews.** Point at a sub-part and its technical sheet appears at the bottom of the column, on a screen with a dashed edge. It follows the pointer to the next sub-part after a moment, and lingers a little after the pointer leaves, long enough to reach it.
- **Keeping a sheet.** Click the sub-part in the model and its sheet stays; click it again to close it. A double-click still zooms to the piece and leaves your sheets as they were. You can also drag a preview by its bar and drop it anywhere: it stays where you dropped it. The pin on a preview does the same as a click. Pointing at a kept sub-part in the model lights its sheet. A sheet dragged out of the column stays where you put it. If you drop it on the part, the part moves into the largest free space in the view and keeps its zoom unless it wouldn't fit there. If no free space is at least 160 px each way, the part stays put and **Sheets** flashes to suggest Tidy.
- **Organising.** Once a sheet is kept, or a screen is moved or folded, **Sheets** appears in the inspect bar with the number of kept sheets. It has three actions:
  - **Tidy** (or `L`) puts every screen back where it starts, the sheets in one column in piece order and then in build order, all open, and frames the part again.
  - **Fold all** folds every screen to its top bar.
  - **Close all** closes every sheet.

  Double-click a screen's top bar to fold it; a click opens it again. Past six open sheets, the oldest folds rather than closing. Only when there are more sheets than the column can show as bars (about seven on a laptop) does the oldest folded one close.
- **Narrow views.** Below 640 px there is no column: a preview opens beside the pointer, and kept sheets cascade down the right edge.
- **Linking.** Hovering a screen lights its sub-part in the model. There are no arrows to follow as you turn.
- **On a phone** a tap previews a sub-part, and the sheet docks under the model.

A sheet gives the material, the dimensions and notes, with a tag on every row. Sheets are kept per sub-part, so all pieces with that sub-part share one; the sheet says so ("same on all 8 pieces"). Where the sources do tell the pieces apart, an **On this piece** section adds it: which port carries the pump line, the laser window or an electrode. Which port carries the probe, and which viewport serves the webcam, the spectrometer or the eye, is not published, so those rows are tagged assumed. A source id (S1–S10) means the number is published there; a click opens the source. The other tags say how a number was arrived at, and a key under each table explains the ones it uses:

- **photo**: scaled from the webinar photos.
- **std**: follows from the CF standard (S9), but the SPM1's own part is not published. Bolt and nut threads are tagged this way. A click opens S9.
- **derived**: worked out from tagged numbers (vessel volume, field on axis, cable per coil, bolt grip).
- **assumed**: not published, picked for the drawing (outer PF radius, KF40 reducer outlet, probe placement, TF winding layout).

The component screen's bar shows the part's basis as "Shape: Spec / Photo / Assumed". That is how far to trust its drawn shape and position, not the numbers in its rows.

- **Vacuum hardware** is drawn to the standard and documented from it:
  - ConFlat flanges, port tubes and copper gaskets for DN40, DN63, DN100 and DN160 come from the MBE-Komponenten table: OD, thickness, bolt circle, holes, knife edge and seal recess.
  - Bolts and nuts get the thread their holes take (M6 or ¼-28; M8 or 5/16-24) and their grip length.
  - The viewport windows (Kodial glass, Kovar sleeve, 90 × 6 mm for DN100CF, 38 × 3 mm for DN40CF, 350 °C bake-out) come from Lesker's reference parts.
  - Each sheet says when the SPM1's own part is not published.
- **Coils, electrodes, the gauge and the control parts** carry what the sources and photos show. Where nothing is published, the sheet says so rather than guessing.

### Hologram

The theme button switches between the light drawing and a hologram. A dark system theme opens the hologram. The palette is the soft ice blue of the displays in Tony Stark's workshop: `#4f9fd6` on deep navy, kept dim so it is easy on the eyes. The shading follows [holographic-shader-visualizer-three.Js](https://github.com/YasirAwan4831/holographic-shader-visualizer-three.Js) (fresnel rims and scan lines).

- Every surface adds light, brightest where it turns away from you, so the inside of the machine shows through.
- The nearest surface is drawn at full strength and the ones behind it faintly, so the front still reads first.
- The whole machine is one blue, a little brighter for parts that are light in the drawing. Only the plasma, which carries energy, glows in another colour (violet, pale at its core), and the selection in amber.
- The selection glows amber, so it stands apart from the blue machine, and stays visible through whatever is in front of it. So do a hovered part and the sub-parts whose sheets you keep, more faintly.
- Edges glow softly in the same blue.
- Scan lines drift up the model and a bright sweep passes through it every 7 s. Rings on the projector floor pulse outward.
- The panels and the information screens are drawn as a HUD, with blue corner brackets and a slow scan passing down each screen.

The animation runs at 30 frames a second while the page is idle, and stands still with reduced motion.

### Keys

Arrows turn, Shift+arrows pan, `+`/`−` zoom, `0` resets, `A` fits everything, `1`–`4` pick a view, `E` explode, `[` `]` spread, `C` cutaway, `I` inspect, `T` take apart, `,` `.` previous and next piece, `G` ghost, `S` screens, `L` tidy the screens, `Backspace` back to the previous part, `F` panels, `H` hide.

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

The flange sizes (DN160CF joints, DN100CF lateral ports, DN40CF top and bottom ports, ≈DN63CF gauge port) are drawn to the MBE-Komponenten CF table (S9) and match the bolt counts in the photos. The vessel is drawn as a 154 × 2 mm DN160CF tube, so its 150 mm bore gives the published 75 mm minor radius. Derived numbers in the inspector (vessel volume, field on axis, cable per coil) are marked "derived", and numbers picked for the drawing are marked "assumed".

To correct the model at the kickoff, change `D` at the top of `device.js` and the `basis` and spec rows in `parts.js`.
