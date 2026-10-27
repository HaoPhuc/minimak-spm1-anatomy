# Round 1: Sofia, mechanical design engineer

## 1. Who I am

I live in SolidWorks, Onshape and Fusion. My test: can I isolate a 6 mm screw, examine it, and see where it seats?

## 2. What I tried (shots: `p3-cad\shots\pNN-*.png`)

1. **Pick a bolt in the assembly (1920).** I hovered a viewport bolt head at 9×. The tooltip says *Viewports*, and a click selects all three viewports, with a faint highlight (`p01`, `p02`).
2. **Read its size.** I inspected the front viewport and took it apart. Hovering a bolt opens its sheet: Ø8.4 hole, M8 or 5/16-24, grip 41 mm. At 40× the hex head is crisp under a true 5 mm scale bar. The take-apart directions are correct (`p03`–`p05`).
3. **Search *joint bolts* (1440).** One click on a hit inspects that flange with its bolt sheet, better than most CAD selection filters (`p07`, `p08`).
4. **Where does the gauge attach?** With the gauge inspected and taken apart, the stack it sits on is out of frame. Hovering *Gauge and gas stack* lights nothing (`p06`). A gasket's two flanges are ghosts like everything else, and its bolts are absent (`p09`).
5. **Smallest part I found: the former's 8 rim screws.** Taken apart, they float 9 cm up among the base bolts, with nothing tying them to their holes. Their sheet has no data (`p10`, `p11`).

## 3. Findings

1. **P1: Inspect hides the mate.**
   - The part lifts out by `DETACH` (`device.js:45`), and `frameIsolated` frames only its own box (`index.html:1715`), so the seat leaves the frame (`p06`).
   - The ghost is uniform, and `FINE` strips fasteners from it (`index.html:1047`, `:1448`).
   - Chip hover lights nothing while inspecting, because `legendHot` applies only outside inspect (`index.html:1660`).
2. **P2: No trail lines anywhere.** `ex`, `detachVec` and `apart` already hold every direction, but nothing draws them in Explode (`c09`), Inspect or Take apart (`p10`). Only the Done animation shows the way back.
3. **P2: Selection stops at the sub-part set.**
   - "20 bolts" is one InstancedMesh (`device.js:462`), and `pickMesh` ignores `instanceId` (`index.html:3436`).
   - One bolt can't be named or framed. In inspect a double-click does nothing (`:3520`), and a kept sheet never moves the camera.
4. **P2: No section on an inspected part, and no seal geometry to cut.** The cutaway is an assembly-only sector (`applyClip`, `index.html:1623`). `cfRing` is a plain drilled ring (`device.js:243`), so the knife edge exists only as a sheet number (`parts.js:615`).
5. **P2: Sheets omit drawn sizes.** The bolt sheet has grip but no length or across-flats, although `boltGeom` draws a length (`p04`). The rim screws give nothing at all (`p10`).
6. **P3: No bill of materials or fastener schedule, and no measure tool.** Totals such as 80 M8 bolts at the joints can be derived from `SUBMAP` but are shown nowhere.
7. **P3: Hide is coarse.** It works per part or group only: there is no *Show all* and no hiding a sub-part. Take apart moves every sub-part at once. Isolate does exist (Inspect, then `G`).
8. **Works well:** orthographic view, true scale bar, six-view triad, zoom toward the pointer, tags on every number, search as a selection filter.

## 4. Proposals (ranked)

1. **Mate context in Inspect (M; finding 1, owner goal 2).**
   - What: draw the `connects` parts as an outlined, partly filled "mate ghost" with fasteners kept. Frame the part with its rest box and a lit seat outline. Chips light their mate.
   - Check: the inspected gauge shows the cross's top arm and KF16 adaptor in frame and distinct; a gasket shows both flanges and 20 bolts solid.
2. **Trail lines (S; finding 2, "how it comes off and goes back").**
   - What: a dashed line from each moved piece or sub-part's rest centre to where it is now, with one per bolt along its axis.
   - Check: take a joint flange apart, and 20 lines end in 20 holes at both 1.0× and 2.5× spread.
3. **Instance pick and frame a sub-part (S–M; finding 3, owner goal 3).**
   - What: use `instanceId` so the tooltip reads *Bolt 7 of 20*, and the assembly tooltip reads *Viewports · 16 bolts*. A double-click in inspect frames that sub-part.
   - Check: at 1440×900 a double-clicked bolt head fills at least 300 px.
4. **Section the inspected piece and model the seal (M; finding 4).**
   - What: a *Section* toggle that cuts through the piece's axis with hatched faces. Add the knife edge and recess to `cfRing` from the S9 numbers.
   - Check: at 10× a sectioned joint shows the edge biting the gasket at Ø166.1.
5. **Fastener schedule and *Drawn as* rows (S; findings 5–6).**
   - What: a size × count × location table built from `SUBMAP`, and an assumed-size row on every sheet.
   - Check: the bolt total equals the sum over `piecesOf`.

## 5. On the Tony Stark direction

**Borrow:**

- Pull the part out but leave a glowing seat and a trail line back to it.
- "Expand into pieces" is Take apart plus trails.
- "Enhance" is a double-click that frames one sub-part.
- A leader line from a kept sheet to its sub-part (overturning "no arrows").

**Avoid:**

- Motion that leaves the seat behind (`p06`).
- Perspective.
- Additive glow that blurs front from back.
- Scan lines over a part you are dimensioning.

Keep the inked orthographic drawing. Take Stark's choreography, not his rendering.
