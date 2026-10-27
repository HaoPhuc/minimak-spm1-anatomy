# Kai (p7-stark): round 1

**Who I am.** Kai, a film-UI and motion designer. I build the hologram where Tony pulls a part out and says "enhance", and I make it buildable.

Screenshots are in `p7-stark\shots\`, Hologram, at 1920 (k01–k04) and 1440 (k05–k15).

## What I tried

1. **Gauge.** Inspect, Take apart, rest on the sensor nut, scroll in.
   - The lift and glide are a real Stark beat, and the amber nut jumps out (k03).
   - *All 3* frames the 50 cm cable: the head is 102×88 px of a 1250 px view (k01).
   - The nut's sheet is about 750 px away with no link and no data (k03).
   - At 27.6× the nut is crisp (k04).
2. **One bolt.** Hovering a nut lights all 20, plus nuts on three ghost joints (k06). At 21× I could not tell which nut I was on (k07).
3. **Gasket.** It sits between ghost flanges, which is good. Take apart moves nothing (k08 = k09).
4. **Stack taken apart.** The best exploded view in the app (k10), but its four bolt rings are named only on hover. The pointer label appears only with Screens off (k13).
5. **Where it attaches.** The gauge floats 10 cm over a faint ghost with no seat marked (k12). The vessel ghost glows over the electrode (k11).

## Findings

- **P1: no label on the model.** With Screens on, the tooltip is suppressed (`setHover` ~3547) and there are no leader lines. Names live in the column (k03, k10).
- **P1: you cannot select one bolt.** Each bolt ring is one `InstancedMesh` (device.js `cfBolts`), and `pickMesh` ignores `instanceId` (~3436). You cannot hover, pull or frame one bolt (k06).
- **P2: no "enhance".** Wheel zoom with no inset to keep your place (k07). `frameBox` floors the frame at 3 cm (~1581). Double-click while inspecting is unused (~3520).
- **P2: the seat leaves no trace.** No drop line, no seat marker (k12). The additive ghost is not depth-tested against the part (k11). The gasket and electrode have `lift: 0`.
- **P2: take-apart is hard to read.** The camera keeps its turn, so the explode axis runs into the screen and the parts overlap (k05, k15). The gasket's Take apart is dead (k09).
- **P2: small-part sheets are empty, though the drawing has sizes.** The nut is drawn 17 × 10 mm (`hexNut(1.7, 1.0…)`), and `boltGeom` has bolt length and head size.
- **P3: room is wasted at 1920.** The gauge is framed on its cable, and the empty 280 px column stays reserved (k01, k02).
- **What works:** the amber selection, lift and glide, honest tags (k14), the stack explode, and crisp zoom.

## Proposals (ranked)

1. **Tracked callouts (M).** An SVG layer in `.hud` puts one label per sub-part of a taken-apart piece.
   - Each has a leader line to the sub-part's centre (`screenBoxOf` exists).
   - Labels are in side columns, sorted by y, and redrawn as the camera moves.
   - Hovered and kept sub-parts are amber; a kept sheet gets a line to its sub-part.
   - *Check:* the stack shows 10 names with no hover and no overlaps, still anchored (`pickAt`) while orbiting.
2. **Enhance (M).** A double-click or `Z` frames one sub-part at about 60 % of the view, with no 3 cm floor.
   - The rest of the piece ghosts.
   - Its `ex` axis turns across the screen.
   - An inset shows the spot on the machine.
   - Esc goes back.
   - *Check:* the nut fills half the view within 1 s.
3. **Single instances (M).** Picking uses `instanceId`, and "Bolt 7 of 20" lights alone.
   - "Pull" slides that bolt out.
   - Dimension lines show thread, length, grip and across-flats, tagged.
   - *Check:* only bolt 7 lights.
4. **Seat marker, quieter ghost (S).**
   - An amber drop line from the mating face to a ring at the seat (`detachVec` is known).
   - The ghost fades with distance from the part.
   - The gasket and electrode get a small lift.
   - *Check:* a seat ring at the gauge's KF16 adaptor; part-to-ghost contrast of at least 3:1 (k11).
5. **Small fixes (S).**
   - Hide a Take apart that moves nothing.
   - On take-apart, orbit until the axis is at least 60° from the line of sight.
   - Frame the gauge on its head.
   - Show drawn sizes on sheets, tagged *drawn*.

## On the Tony Stark direction

**A bolt, the Stark way:**

1. Inspect the joint. *Exists.*
2. Take apart: the camera swings across the bolt axis and callouts appear. *Take apart exists; the swing and callouts do not.*
3. Hover one bolt: it alone glows, "M8 · grip 44 mm". *Missing.*
4. Double-click: it slides out, the view enhances, an inset holds the ring, dimensions draw on. *Only wheel zoom exists.*
5. Esc: it slides back. *Exists.*

**The gasket:** one clipping plane shows the knife edges biting the ring.

**The gauge:** a seat ring on the stack, labels on the head, nut and clamp, and enhance on the clamp.

**Borrow:**
- labels pinned to objects;
- one object held while the rest dims;
- the explode along a shown axis;
- an inset when zoomed;
- one accent colour.

**Avoid:**
- gestures with no keyboard path;
- 3D text turning away from the reader;
- glitch effects;
- narration;
- features that work only in the Hologram theme.
