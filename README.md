# SPM1 anatomy

An interactive 3D anatomy of the MinimaK SPM1 simple magnetised torus by Rideo Systems, drawn in the style of [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy): solid shaded parts with inked outlines on a framed card. Its aim is the structure of the machine: what each part is, how it attaches to the next one, and where each number comes from. It does not model the plasma physics.

Open [`index.html`](index.html) in a browser. The first time it needs an internet connection, to load three.js from jsDelivr. There is no build step.

## The page

| Area | What it does |
| --- | --- |
| **Assembly** (left) | The 30 components in seven groups. Click a name to read about it, double-click to inspect it on its own. The eye hides a part or a whole group. The dot gives the geometry basis (below). The search box filters by name, spec or description; every word you type must match. Words that name a piece or a sub-part ("left viewport bolt", "gasket back") also list the matching pieces under their part, such as *Left viewport (webcam) · 16 bolts*; a click on one inspects that piece and keeps its sheet open. "Listed, not drawn" collects options and upgrades that are named in the sources but not drawn. From the keyboard the list is one Tab stop, and the first Tab stop on the page, *Skip to the assembly*, jumps to it: ↑ ↓ move between rows, → ← open and close a group, Enter selects, Space hides or shows, and `I` inspects the selected part. |
| **Viewer** (centre) | The model. Drag to turn it like a plotly turntable, right-drag or Shift-drag to pan, scroll to zoom toward the pointer. The triad in the corner shows the axes; click an axis end to look along it. The scale bar is true at every zoom, because the view is orthographic. |
| **Inspector** (right) | **Part**: **Inspect on its own** first, then what the part does, what it connects to, what it is made of, its pieces, its specification with a source tag on every row, and practical notes. **Sources**: every reference, what was taken from it, and which parts cite it. **Controls**: every mouse, touch and key binding. |
| **Modebar** (top) | Orbit or pan on left-drag, zoom, reset, fit the whole system, the Iso, Front, Right and Top views, Explode with its **Spread** slider, Cutaway, **Panels**, and the theme: the light drawing or the hologram. |

Drag the edge between a side panel and the view to size the panel. Double-click the edge for the default width, or focus it and use the arrow keys. Dragged nearly shut, a panel folds to a thin rail; the arrow in its header does the same, and a click on the rail opens it again. **Panels** (or `F`) folds or unfolds both, giving the model and its sheets the full width. The page remembers the sizes. On a narrow screen the panels stack under the model instead.

### Explode

**Explode** takes every component off the machine at once:

- The quarters move out, and the coils, ports and fittings lift off them.
- The PF and satellite coils rise.
- The table, the supplies and the pump drop away.
- Cables and the pump hose stay plugged into both ends.

The **Spread** slider next to the button, or `[` and `]`, sets how far apart they go (0.4× to 2.5×). The plasma is off while the machine is apart. The windows are clear glass, and each elbow has a real opening behind its port, so you can look into the vessel through any window.

### Inspecting one component

Double-click a part, press **Inspect on its own**, or select it and press `I`. The rest of the machine fades to an x-ray ghost, then the part lifts out while the camera glides round to frame it, so you can see where it comes from. To give the model room, the assembly list folds to its rail while you inspect whenever the view would otherwise be under 1000 px wide; **Done** opens it again. Then:

- **Take apart** separates the part into its sub-parts along the directions they come off:
  - Bolts slide out of their holes and nuts come off the back.
  - Gaskets come out from between their flanges.
  - A TF coil's copper former, winding and cover band separate along the coil axis.
  - The pump's motor and fan cover come off its block.

  Its own **Spread** slider sets the spacing. A part with several pieces is taken apart one piece at a time, starting with the nearest.
- Pieces are named by where they sit. The gaskets are named by their joint (*Right–back joint*: joint k sits on the diagonal between two quarters). The eight joint flanges are named by their joint and the quarter they are welded to (*Right–back joint, right side*).
- A part with several pieces (three viewports, eight TF coils) starts with all of them, and a click or a tap on one picks it. The arrows beside **All** in the inspect bar, or `,` and `.`, step through them one at a time, and so does a click on a row of the **Pieces** table. The other pieces fade to ghosts and the camera glides to the one you picked. Clicking **All** picks the nearest piece, or goes back to every piece.
- The **Pieces** table, in the Part tab, has one row per piece of a repeated part, named by where it sits, with whatever the sources tell apart for each piece and its tag: which port carries the pump line, the laser window or an electrode. The piece in view is marked. Where the sources tell the pieces no differently, a line under the rows says so. A part made of different objects (the HV supply and its two leads, the gas valve, the gauge, the spectrometer) has no Pieces table: **Made of** lists each object's sub-parts under its name instead.
- **Connects to** names the parts this one attaches to. While inspecting, a click on one inspects it, on its piece nearest the one you were looking at (from the webcam, *Viewports* opens on the left viewport); from a view of every piece it opens on every piece too. Every link goes both ways. **← name** in the inspect bar, or `Backspace`, goes back to the part and piece you came from.
- **Context** turns the ghost of the rest of the machine on or off.
- **Esc** steps back one level: the preview, then from one piece to the whole part, then to the assembly, then the selection. It never closes a kept sheet, so three presses at most leave a part.
- **Done** or **Back to assembly** reverses the inspect at the pace of an explode, so you can see where the part goes:
  1. A part that was taken apart goes back together.
  2. The part flies home while the camera glides back to the view you had before.
  3. The rest of the machine gets its outlines, then turns solid, and the plasma lights again.

  Any drag, zoom or view button during the move takes over the camera. With reduced motion turned on, it goes back at once.

### Sheets

While inspecting, each sub-part has a technical sheet, and the sheets sit in a column on the right of the view. **Screens** in the inspect bar, or `S`, turns the sheets off and on.

- **Room.** The column is 280 px wide and keeps its room even while it is empty. The camera frames the part in the rest of the view, so nothing that opens in the column moves the camera or covers the part. A column needs a view of at least 660 px, which leaves the model at least 360 px. A narrower view has a dock under the model instead (below).
- **The part card.** The inspector's Part tab describes the component. When it is not beside the view, because the inspector is folded or the window is 960 px wide or less (where the inspector sits under the model), the column starts with a card that shows the same, built by the same code. It folds like a sheet and has no ×.
- **Previews.** Rest the pointer on a sub-part (it moves less than 4 px for 150 ms) and its sheet opens under the kept ones, with a dashed edge and the label *Preview*. A pointer crossing the model on its way somewhere opens nothing. The preview stays until the pointer rests on another sub-part, or you press **Keep** or × on it, press Esc, click an empty spot, or change piece or part. On the way to it, pausing over empty space or over another sheet never closes it. It takes at most half the column, and a longer sheet scrolls inside it.
- **Keeping.** With one piece shown, or on a part with one piece, click the sub-part in the model, press **Keep** on the preview, or click its row under **Made of** in the inspector. The sheet opens at the end of the column and scrolls into view. Click the sub-part again, on any piece, or its row, to close it. A double-click does no more than a click.
- **One sheet per sub-part.** Sheets belong to sub-parts, not pieces. The copper former kept on one TF coil is the same sheet on all eight, and the former is lit as kept on every coil. On a part with several pieces, the bar says on how many pieces the sheet is the same: *Same on all 8*, or *On 4 of 5*. What does tell the pieces apart is in the **Pieces** table.
- **The column scrolls.** Nothing in it folds or closes by itself. The chevron on a sheet's bar folds the sheet to its bar, which names the sub-part in full; the chevron again opens it. The header counts the kept sheets: **Fold all** folds them and the part card, and **Close all** closes the kept sheets.
- **Floating.** Drag a sheet, or the preview, out of the column by its bar: it floats where you drop it, and a preview dropped there is kept. Drop it back on the column to return it. While a sheet floats, **Tidy** (or `L`) in the header puts every floating sheet back. The camera never moves for any of this.
- **The dock.** In a view under 660 px (a phone, a narrow window, or a 1000 px window with the inspector open) the sheets sit in a dock under the model, at most 42 % of the view's height, one card at a time. Its room is kept even while it is empty, and the camera frames the part above it. Its header reads *Sheets n · ‹ card › · Close all*. The arrows step through the part card (when the inspector is under the model) and the kept sheets, and say which one shows: *Part*, or *kept 2 of 3*. A preview takes the card while it lasts, and the arrows clear it.
- **Mouse or touch.** The gestures follow the input, not the width. With a mouse, resting on a sub-part previews it and a click keeps it, in the column and in the dock alike. On touch, a tap previews, **Keep** keeps, and a tap on a kept sub-part shows its sheet without closing it. With every piece shown, a click or a tap picks a piece instead.
- **Linking.** Hovering a sheet lights its sub-part in the model, and pointing at a kept sub-part lights its sheet. There are no arrows to follow as you turn.
- **Coming back.** Each part keeps its sheets, folds and places, so going back to it by a link, or inspecting it again later, brings them back.

A sheet gives the material, the dimensions and notes, with a tag on every row. Which port carries the probe, and which viewport serves the webcam, the spectrometer or the eye, is not published, so those Pieces rows are tagged assumed. A source id (S1–S10) means the number is published there; a click opens the source. The other tags say how a number was arrived at, and one key at the foot of each sheet and of the Part tab explains the ones it uses:

- **photo**: scaled from the webinar photos.
- **std**: follows from the CF standard (S9), but the SPM1's own part is not published. Bolt and nut threads are tagged this way. A click opens S9.
- **derived**: worked out from tagged numbers (vessel volume, field on axis, cable per coil, bolt grip).
- **assumed**: not published, picked for the drawing (outer PF radius, KF40 reducer outlet, probe placement, TF winding layout).

The Part tab shows the part's basis as *Drawn from: published spec*, *photos* or *a guess*, with the same dot as the tree. That is how far to trust its drawn shape and position, not the numbers in its rows.

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
- The panels and the sheets are drawn as a HUD, with blue corner brackets and a slow scan passing down each sheet.

The animation runs at 30 frames a second while the page is idle, and stands still with reduced motion.

### Keys

Arrows turn, Shift+arrows pan, `+`/`−` zoom, `0` resets, `A` fits everything, `1`–`4` pick a view, `E` explode, `[` `]` spread, `C` cutaway, `I` inspect, `T` take apart, `,` `.` previous and next piece, `G` ghost, `S` sheets, `L` floating sheets back into the column, `Backspace` back to the previous part, `Esc` one step back, `F` panels, `H` hide.

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
| S3 | [rideosystems.biz/technology](https://www.rideosystems.biz/technology) | Confirms S2's headline numbers on the overview: R₀ and a, the TF field, the plasma, the envelope |
| S4 | [P. Apte, "The Minimak. Design, Build and Operation", Univ. of Manchester webinar, Oct 2025 (PDF)](https://www.minitmak.com/_files/ugd/5de522_5cee74b6dc514f1eb1a3fee4cb50b9e4.pdf) | Construction (TIG welds, ConFlat, leak test, copper TF formers, metal PF formers), pump and gauge, 40 A supplies, 4 kV glow supply, PLC, software, operating fields, upgrades. Its photos set most of the proportions |
| S5 | [Kurt J. Lesker, ConFlat technical notes](https://www.lesker.com/newweb/flanges/flanges_technicalnotes_conflat_1.cfm) | CF flange sizes |
| S6 | [Wikipedia, Vacuum flange](https://en.wikipedia.org/wiki/Vacuum_flange) | How CF and KF joints seal |
| S7 | [MKS, Mini-Convectron gauge](https://www.mks.com/p/275600-0-GD-T) | The Convectron gauge family and its range |
| S8 | [minimak-groundwork](https://github.com/HaoPhuc/minimak-groundwork) | Background, not cited by any row: TU/e context and the Langmuir fit script |
| S9 | [MBE-Komponenten, flange, gasket and tube dimensions](https://www.mbe-komponenten.de/service/flange-gasket/) | Every CF flange, port tube, gasket and bolt hole in the model and on the sheets |
| S10 | [Kurt J. Lesker, Kodial CF viewports](https://www.lesker.com/viewports/viewports-cf-flanged-kodial-glass.cfm) | Viewport glass, view diameter, thickness, Kovar seal, bake-out |

## How true it is

Every part has a basis, shown as the dot in the tree:

- **Spec** (filled dot): the number or placement is published. R₀ 230 mm, a 75 mm, four 150 mm elbows, 8 TF coils × 50 turns of 6 mm cable up to 40 A, 3 viewing + 1 vacuum + 4 diagnostic ports, the 90 × 90 × 160 cm envelope.
- **Photo** (half dot): scaled or placed from the webinar photos. The joints sit on the diagonals, clamped to four aluminium corner posts. The TF formers have fold-out copper tabs. The PF1/PF2 windings and leads are on a white central former. The satellite coils are hose-wound rings. The gauge and gas stack is on top of the back quarter. The table is a Thorlabs Nexus. The control drawer, the coil-supply chassis and the pump are under the table.
- **Assumed** (ring): placed where plausible. These are the outer PF coils (PF3, PF4), the solenoid's position, the HV supply, the gas valve, the Langmuir probe, the webcam and the spectrometer.

The flange sizes (DN160CF joints, DN100CF lateral ports, DN40CF top and bottom ports, ≈DN63CF gauge port) are drawn to the MBE-Komponenten CF table (S9) and match the bolt counts in the photos. The vessel is drawn as a 154 × 2 mm DN160CF tube, so its 150 mm bore gives the published 75 mm minor radius. Derived numbers in the inspector (vessel volume, field on axis, cable per coil) are marked "derived", and numbers picked for the drawing are marked "assumed".

To correct the model at the kickoff, change `D` at the top of `device.js` and the `basis` and spec rows in `parts.js`.
