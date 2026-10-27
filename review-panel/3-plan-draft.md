# Draft plan (for round 3): inspect small parts, Stark-style, and show where they go

Built from the eight critiques and rebuttals. One idea: **Stark's choreography, not his rendering** (Sofia). Every
feature works in Colour, Greyscale and Hologram, by mouse, keyboard and touch, and under reduced motion.

## What the panel settled (no longer argued)

1. **The bolt ring is the unit you pick.** A single bolt is reachable only after its ring is framed (8/8).
2. **No camera moves by itself.** Auto-orbit on Take apart is out; a **Turn to see** button replaces it (7/8).
3. **Enhance is one command, "Show me", with several triggers** (8/8). Double-click is never the only one (Lena).
4. **Taking apart in fitting order lives inside Take apart**, as ‹ › steps, not a new mode (8/8; Daniel conceded).
5. **Labels are named and settle when the camera stops**; one leader line runs from the hovered, focused or kept
   sheet. This overturns PLAN.md's rejection of leader lines: its premise ("hover lighting is enough") failed for
   four critics on steel in Colour, and tablets and lecture halls have no hover (7/8).
6. **The selection must be visible in every theme** (8/8).
7. **The hardware must be true** before the views that magnify it ship (8/8 on the goal; order argued, see Phase 0).

## Phase 0: make the small hardware true (S–M) — first, because enhance and mate views expose every error
- **T1** Add the 4 missing DN40 gaskets (stack); give every bolt set nuts or a "tapped" row (S).
- **T2** KF joints as two flanges + centring ring with O-ring + clamp; the gauge comes off at its clamp (M).
- **T3** Knife edge and gasket recess on `cfRing`, at the S9 diameters (S–M).
- **T4** Drawn sizes on sheets, tagged *drawn*: bolt length, across-flats, nut size; sheets for the 61 sub-parts
  that have none, starting with fasteners (M).
- *Done when:* "gasket" finds 17 CF gaskets; no bolt ends in air; at ×16 the knife edge reads at Ø166.1.

## Phase 1: see it (S–M)
- **V1** Distinct lit states in every theme: kept = solid fill in the theme's accent, preview = dashed outline,
  hover = outline; ≥3:1 against the unlit material, checked on steel *and* copper.
- **V2** Keyboard focus on a Made of row, Pieces row or chip lights its part, as hover does.
- **V3** Frame below the inspect bar (a top inset); open small composite parts framed on their head, not their
  cable; "Zoom to it" frames the part, not its box with cables; no 3 cm floor.
- **V4** Tolerant picking: the exact ray wins; on a miss or a coarse pointer, a disc (≈12 px mouse, ≈24 px touch)
  prefers the smallest sub-part; a miss keeps the preview; click slop 10 px; triad targets 24 px.
- **V5** One meaning per click: a click on the model keeps a sheet and never closes it; × or the row closes.

## Phase 2: Show me — the Stark core for small parts (M)
- **S1** *Show me*: a button on each sheet bar and Made of row (44 px on touch), `Z`, a double-click on a
  sub-part, a tap on a sheet bar. Frames the sub-part at ≥50 % of the free view, the rest of the piece dimmed; a
  breadcrumb in the inspect bar ("Back quarter › Stack › Gauge › Sensor nut"); Esc returns to the previous frame;
  cuts under reduced motion; announced.
- **S2** One leader line from the hovered, focused or kept sheet to its sub-part, drawn only while the view is still.
- **S3** Named callouts on a taken-apart piece: at most 10, "3 · KF16 clamp", numbered as the Made of rows, a short
  stub to the sub-part, laid out in the gutters when the camera stops and hidden while it moves; scale with a
  `--ui-scale`; on touch ≥44 px and tappable (tap = preview); in Tab order with the Made of rows.
- **S4** Single bolts after Show me: once a ring is framed (heads ≥30 px), `instanceId` picking gives "Bolt 7 of
  20" with dimension lines (thread, length, grip, AF; tagged).
- **S5** *Deferred to a test:* a locator inset beyond 4× zoom (desktop only).

## Phase 3: where it goes (M)
- **W1** Mate context: the parts in `connects` drawn ~50 % solid with their fasteners while inspecting; framing
  keeps the seat in view; link chips light their mate.
- **W2** A dashed seat ring (≥3:1) where the part rests, and one tether from the lifted part to it.
- **W3** Quarter names (Front, Right, Back, Left) on the table edge and in the view's description.
- **W4** *Turn to see*: a button, offered when the take-apart axis is within ~20° of the line of sight.
- **W5** A trail line for the hovered or kept sub-part only (no per-bolt trails).

## Phase 4: in order (M, then L)
- **O1** ‹ step n / N › in the Take apart bar, in fitting order (a new `order` per sub-part, tagged *assumed* where
  no procedure is published); the last step is today's all-at-once view; one sentence per step; announced.
- **O2** Star-numbered bolts at the bolt step (numbers drawn on the heads, also as text).
- **O3** *Open this joint* (L): flanges, gasket, bolts and nuts of one joint as one sequence, gasket last.

## Phase 5: share and teach (S–M)
- **L1** Deep links: part, piece, step, sheets, view and theme in `location.hash`; browser Back works; Copy link.
- **L2** A text-scale setting (`--ui-scale`, 1–2×) for beamers and low vision.
- **L3** Search: stop words, sheet rows indexed (M8, o-ring), matches from word starts.

## Phase 6: touch, keyboard and words (S each)
- 44 px targets under `pointer: coarse`; fold the inspector in landscape under 1100 px; long-press loupe; DPR 1 and
  no shadow pass while a finger is down or a glide runs.
- Announce Take apart, Explode, Context, Screens, hide/show, leaving Inspect; a switch to turn single-key shortcuts
  off; a source tag keeps focus; the view's focus ring inside its edge.
- Words: Screens → Sheets, Context → Ghost, one label for Done; toggles drawn as switches; Esc on the tour asks
  before leaving; `]` acts only on what is exploded.
- Section toggle on the inspected piece (after T3).

## Rejected
Callouts on every sub-part re-sorted every frame · single-bolt picking by default · auto-orbit on Take apart ·
per-bolt trail lines · unnamed balloons · features only in the Hologram · gesture-only actions · flick inertia ·
a separate "workshop mode".

## Open questions for the owner
1. Colour's selection accent: a solid teal (contrasts with copper), or amber in every theme?
2. V5 reverses the README's "click it again to close". Accept?
3. Fitting order: no procedure is published; tag the steps *assumed*, or ask Rideo?
