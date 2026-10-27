# SPM1 Anatomy: review panel and plan for small parts

The plan has one idea: **Stark's choreography, not his rendering.** In the Iron Man workshop a part comes out of the
assembly, grows until it fills your view, names itself, comes apart in the order it was built, and you never lose
sight of where it came from. Each of those beats is buildable here and each one makes a small part easier to see,
name and place. None of them needs the glow: every feature in this plan works in Colour, Greyscale and Hologram, by
mouse, keyboard and touch, and under reduced motion.

This plan follows [PLAN.md](PLAN.md), whose three phases are done. It changes two of PLAN.md's decisions; section 2
says which and why.

## How this was made

- **The goals.** The owner set three, and every finding was judged against them:
  1. inspect each component in detail;
  2. know where each component goes;
  3. inspect small components, with inspiration from Tony Stark (the owner's own priority).
- **The panel.** Eight critics, each with a persona, reviewed the app as merged in #17 (`f86ec6a`). They worked in
  headless Chrome on the GPU, driving the page through the DevTools Protocol with real mouse, key and touch events.
  Each took at most 3 runs and about 15 screenshots, at the widths their persona uses.
- **The rounds.**
  1. Each critic wrote a critique on their own.
  2. Each read all eight critiques and wrote a rebuttal: three proposals to oppose, three to support, a position on
     the six contested questions, and one challenge to a named critic.
  3. Each reviewed a draft of this plan, gave a verdict and at most two blocking objections, and answered the
     challenges put to them.
- **The record.** The briefs and all 24 papers are in [`review-panel/`](review-panel/). Screenshots are in
  `.arena/panel-20261026/` (git-ignored). A citation such as *Ruud r1-s1* means `p2-technician/shots/r1-s1….png`.
- **The verdict.** All eight critics accepted the draft with changes. This plan is the draft with every blocking
  objection resolved, as section 3 shows.

| Critic | Persona | Tested at | Their P1 |
|---|---|---|---|
| Mai | First-year student, no CAD, bolts the real joint next week | 1366×768, trackpad | No fitting order: Take apart moves everything at once |
| Ruud | Vacuum technician, 20 years of UHV | 1440×900, up to ×30 | Four ConFlat (CF) seals in the gauge stack and needle valve have no gasket |
| Sofia | Mechanical CAD engineer | 1920 and 1440 | Inspect hides the mate: the seat leaves the frame |
| Daniel | Interaction designer, HCI | 1440×900 | "Where it goes" exists only in motion and in text |
| Amara | Accessibility auditor, WCAG 2.2 AA | 1440, 720×450 at dpr 2 | In Colour a kept or hovered small part is close to invisible |
| Prof. Janssen | Lecturer, beamer, 120 students | 1920 and 1280×720 | Nothing can be linked; the text is laptop-sized |
| Kai | Film-UI designer, the Stark champion | 1920 and 1440, Hologram | No label on the model; you cannot single out one bolt |
| Lena | Lab assistant, tablet with gloves | 1024×768, 820×1180, 390 px, touch | A finger cannot pick a 6–15 px part |

Effort, for one person who knows the code: **S** = up to half a day, **M** = 1–3 days, **L** = more than 3 days.

---

## 1. What is wrong, in short

1. **The hardware the app magnifies is not always true** (Ruud, Sofia, Mai).
   - **Missing gaskets:** four CF seals have no copper gasket. Three are in the gauge stack: reducer→cross,
     cross→blank and cross→KF16 adaptor. The fourth is cross→needle valve. The stack's only gasket is the DN63 one
     (`device.js:648`), and the needle valve has none. The bolt sheet still says "two flanges and a 2 mm gasket".
   - **Bolts that end in air:** the bolts on the blank, the adaptor and the needle valve have neither nuts nor a
     "tapped" note.
   - **Flat sealing faces:** knife edges and gasket recesses are only numbers on a sheet. `cfRing`
     (`device.js:243`) is a flat drilled ring.
   - **KF joints are not drawn as KF joints:** the O-ring and centring ring are folded into the clamp, so the gauge
     comes off at its CF face rather than at its clamp.
   - **Welds come apart:** in Take apart a TIG weld slides off like a washer.
   - **Missing sizes:** bolt sheets give no length, spanner size or washers, and 61 of the 145 sub-parts have no
     sheet at all (Ruud r1-s1, r3-b1, r1-j3; Sofia p10; Mai m06).
2. **In Colour, the selection disappears exactly on small steel parts.** Six of the eight critics found this on
   their own. A lit part only lightens toward the paper and gets a teal rim at grazing angles (`index.html:817`). On
   steel the rim is about 2.3:1. Kept and preview differ only in strength (Amara k1 vs k2; Mai m08 vs m10; Ruud
   r3-h3; Lena t10).
3. **Small parts open small and stay small.**
   - **Framed on the cable:** the gauge is framed with its 57 cm cable, which leaves its sensor nut at 8×8 px
     (Mai m05a; Daniel t2b; Kai k01).
   - **Zoom to it barely zooms:** on the gauge it reaches 1.13× (`zoomToPart`, `index.html:2583`; Janssen G1).
   - **A 3 cm floor:** `frameBox` will not frame anything under 3 cm (`index.html:1581`).
   - **No double-click enhance:** a double-click while inspecting does nothing (`index.html:3519`).
   - **No one-step zoom:** enlarging a terminal cap from 37 to 184 px took ten wheel notches (Daniel t6b).
4. **Nothing names a sub-part on the model.** With sheets on, the pointer tooltip is turned off. A sub-part's name
   appears only in the sheet column, 400–750 px away (Kai k03, k10; Janssen G3).
5. **Where a part goes is shown for 1.2 s, then lost.**
   - The part lifts out by `DETACH`, and `frameIsolated` frames only the part itself.
   - Its mate is the same faint ghost as everything else, and the ghost leaves out fasteners.
   - Take apart pushes the seat out of frame.
   - Link chips light nothing while inspecting: `legendHot` works only outside Inspect (`index.html:1660`).
   - Nothing marks which quarter is Front, Right, Back or Left (Sofia p06, p09; Daniel t2b, t2c; Janssen G2).
6. **Take apart shows directions, not an order.** Every sub-part moves at once. A joint's bolts, nuts and gasket land
   in three places, and the 20 bolts are never numbered for the star pattern (Mai m04; Ruud c07b).
7. **Picking is exact and unforgiving.**
   - **No finger tolerance:** `pickMesh` (`index.html:3436`) casts one exact ray. A nut is 6–15 px on a tablet; only
     15–41 % of touch points within 10 px of it hit it (Lena t08, t09).
   - **Tremor turns clicks into orbits:** a click counts only under 5 px of movement (`index.html:3491`).
   - **A miss closes the preview** (`index.html:3511`).
   - **One bolt ring is one InstancedMesh, and picking ignores `instanceId`,** so hovering one nut lights all 20 (Kai k06).
8. **Nothing can be linked, and text cannot grow.**
   - **No links:** the page never reads or writes the URL, and the browser's Back button leaves the app.
   - **Small text:** sheets are 12.5 px, about a quarter of a slide's minimum on a 1920 beamer.
   - **Zoom runs out early:** browser zoom stops near 175 %, where the phone layout takes over (Janssen; Daniel).
9. **Smaller but real:**
   - a click's meaning depends on hidden state (pick a piece, keep a sheet, or close it);
   - toggles that are on look like primary buttons;
   - Take apart's tooltip says "pieces";
   - several state changes are silent;
   - single-key shortcuts cannot be turned off;
   - a source tag drops focus to `<body>`;
   - the inspect bar covers the part on phones and landscape tablets;
   - targets are 22–28 px with no `pointer: coarse` CSS;
   - search misses words inside sheets and natural phrasing.

**What works and must be kept:** every critic credited these.
- **Search as a selection filter:** "joint bolt" plus one click reaches the bolt sheet.
- **The lift and the fly-home:** they already teach where a part goes.
- **The orthographic view:** its scale bar stays true at ×40.
- **Honest source tags on every number.**
- **The hover preview:** it catches a 2 mm gasket first time.
- **Esc:** it steps back predictably.
- **The amber selection in Greyscale and Hologram.**
- **The stack's take-apart:** it "reads like a catalogue drawing".

## 2. What the panel settled

These were argued in round 2 and are no longer in dispute.

| # | Decision | Vote |
|---|---|---|
| D1 | **The bolt ring is the unit you pick.** All 20 bolts share one sheet. One bolt matters only as a number in the star order. | 8/8 (Kai conceded in round 2) |
| D2 | **No camera moves by itself.** Kai's auto-orbit on Take apart is out; a **Turn to see** button replaces it. | 8/8 (Kai conceded in round 3) |
| D3 | **Enhance is one command, *Show me*, with several triggers.** Double-click is never the only one. | 8/8 |
| D4 | **The fitting order goes inside Take apart** as ‹ step n / N ›, not as a separate player or mode. | 8/8 (Daniel conceded in round 2) |
| D5 | **Labels are named, sit on the model, and never move while you read them.** They are hidden while the camera moves and laid out when it stops. One leader line runs from the hovered, focused or kept sheet to its sub-part. | 8/8 after round 3, with the fallback in 3.5 |
| D6 | **The selection is visible in every theme**, at 3:1 or more against the unlit material. | 8/8 |
| D7 | **The hardware is made true before the views that magnify it ship.** | 8/8 on the goal; for the order, see 3.1 |

**Two of PLAN.md's decisions change.**

- **"Leader lines from sheets to sub-parts" (PLAN.md §6) is withdrawn.** It rested on "hover lighting is enough".
  That is false in three ways:
  - four critics found hover lighting invisible on steel in Colour;
  - a tablet has no hover;
  - a lecture hall has no hover.

  The README's real objection was to arrows that *move as you turn*. D5 keeps that rule: nothing is drawn while the
  camera moves.
- **"Click the sub-part again to close it" (README, Sheets) becomes "a click keeps, × or the row closes"** (V5). A
  tremor's second click, or a glove's double tap, no longer undoes the work.

## 3. Where the panel still disagreed, and what this plan does

### 3.1 How much does the hardware hold back?
- **The positions:**
  - Ruud, Mai and Sofia: fix all of it first.
  - Janssen and Kai: gate only what a new view would expose.
- **Decision:** gate by exposure.
  - **Before Show me:** the gaskets and nuts (T1), the knife edge and recess (T3) and the section (T5) ship first,
    because Show me magnifies exactly those faces.
  - **Before mate context on the gauge:** the KF joint (T2), because W1 draws the gauge's mate at its clamp.
  - **Alongside the phases:** the sheets and stock lengths (T4), which are missing text, not wrong geometry.
- Phase 1 magnifies nothing, so it starts at once.

### 3.2 Show me first, or where it goes first?
- **Votes:** six critics put "where it goes" in their top 3, and seven put Show me there.
- **Sofia's blocking point:** enhance without a seat makes the lost-place problem worse. Ruud lost track of which
  flange he was on at ×28.
- **Decision:** the owner's priority puts Show me first, but it ships with **the seat ring and an edge marker** (W2,
  moved into Phase 2), so a framed sub-part always shows where home is. The rest of mate context (W1, W3–W5) is
  Phase 3.

### 3.3 Fitting order: before or after Show me?
- **The positions:**
  - Mai wanted the steps right after Phase 1, because she needs them at the bench.
  - Ruud agreed, provided single bolts move later.
- **Decision:** steps stay in Phase 4, after mate context. Each step names the part's seat (W2) and lights its
  mate (W1), and without those a step is only a caption.
- Ruud's trade is taken: S4 (single bolts) moves from Phase 2 to Phase 4, which frees an M for the steps.

### 3.4 What does a single bolt do?
- **The positions:**
  - Kai and Sofia: pick it and pull it out.
  - Daniel: a click that picks one bolt after Show me but keeps the ring's sheet before it gives one click two
    meanings.
- **Decision (Daniel's change):** `instanceId` only *names* the bolt under the pointer ("Bolt 7 of 20 · star 3").
  The click still keeps the ring's sheet.
- Dimension lines (thread, length, grip, across-flats) are drawn on one sample bolt when the ring is framed by Show me.

### 3.5 What do labels look like where there is no room?
- **The fallback:** in the gutters beside the part, callouts with short stubs. When the free view is under 700 px,
  or a placement would cross a leader or cover a bolt ring, they become numbered balloons on the part. Their names are
  in the Made of rows and the dock card (Kai's fallback, answering Sofia, Lena and Amara).
- **The limit:** at most ten labels, or five at text scale 2 (Kai's answer to Janssen).
- **Assistive technology:** callouts are hidden from it and out of the Tab order (`aria-hidden`, `tabindex="-1"`),
  but still tappable. Their numbers go into the Made of row names, and focus on a row lights its callout (Amara).

### 3.6 Picking: is the exact hit always right?
- **The positions:**
  - Sofia: with a mouse, a click 10 px from a bolt on a flange must select the flange.
  - Lena: on touch, near a pump-port bolt, the reducer takes 50 % of a 10 px disc and the bolt 38 %.
- **Decision:**
  - **With a mouse**, the exact ray wins, and a ~12 px disc runs only on a miss.
  - **On a coarse pointer**, the ~24 px disc always runs, and the smallest sub-part in it wins.

### 3.7 What comes into Phase 1?
- **The requests:** four critics asked to move a Phase 5 or 6 item into Phase 1, each because later phases depend
  on it:
  - the text scale (Janssen, Amara, Kai);
  - deep links (Janssen, Daniel);
  - WCAG level-A fixes (Amara);
  - the touch layout (Lena).
- **Decision:** all four move. Each is S, and each is a precondition:
  - S3's callouts scale with the text scale;
  - every later phase adds state the link must carry;
  - S1 and O1 promise announcements;
  - at 1024×768 in landscape, Show me would otherwise get about 270 px of height.

---

## 4. Phases

Every phase's *done when* includes, unless it says otherwise:
1. Colour, Greyscale and Hologram;
2. 1440×900 and **1366×768 with the sheet column open** (Mai);
3. a touch run at 1024×768 in landscape (Lena);
4. a keyboard-only run;
5. reduced motion;
6. its new state round-trips through the link (Janssen).

### Phase 0: make the small hardware true (S–M)

| Item | Change | Effort |
|---|---|---|
| **T1** | **Gaskets and fasteners.** In the stack, add the sub-part "3 DN40 gaskets" (reducer→cross, cross→blank, cross→KF16 adaptor), and add `needle\|Copper gasket` (cross→needle valve). Map both to `gasket-40`, not today's `gasket-63`. Fix each bolt set: through holes get nuts; tapped holes get bolts shortened to flange + gasket + thread engagement, a "tapped" row and a corrected Grip row. TIG weld beads stay put in Take apart, with the sheet line "welded, not removable". | S |
| **T2** | **KF joints as KF joints:** two KF flanges, a centring ring with its O-ring, and the clamp. The gauge comes off at its clamp, not at the CF face. Covers KF16 on the gauge and KF40 on the pump port. | M |
| **T3** | **Knife edge and gasket recess** on `cfRing` as a revolved face profile, at the S9 diameters, with the gasket seated in the recess. | S–M |
| **T4** | **Sizes on the sheets.** Bolt length = grip + nut + two threads, rounded up to the next stock length (M8 × 55, M6 × 35), tagged *derived*, with the bolts redrawn to match. Add spanner size (13 or 10 mm), washers, and the tightening rule. Write sheets for the 61 sub-parts without one, fasteners first. Runs alongside the phases. | M |
| **T5** | **Section the inspected piece:** a toggle that cuts through the piece's axis, with hatched cut faces (stripes already mean a cut face). | M |

- **Gates:** T1, T3 and T5 gate Phase 2. T2 gates W1 on the gauge.
- **Done when:**
  - the model has a copper ring in every one of the 17 CF joints (geometry, not search rows);
  - no bolt ends in air;
  - a sectioned Right–back joint at ×16 shows both knife edges biting the gasket at Ø166.1;
  - the gauge lifts off at its KF16 clamp, and the O-ring is a sub-part with a sheet.

**Status: done** (October 2026). All four checks pass in headless Chrome:
- **Gaskets:** a copper ring in all 17 CF joints. The stack has "3 DN40 gaskets" and the needle valve its own, both on the DN40 sheet.
- **Bolts:** none ends in air. Through-bolted joints have nuts; the reducer's DN40 holes are tapped, marked on its face, with M6 × 25 bolts.
- **Knife edges:** a sectioned Right–back joint at ×16 and ×40 shows both edges biting the gasket at Ø166.1, viewed square to the cut.
- **Gauge:** it lifts off at its KF16 clamp, and the "KF16 centring ring and O-ring" has a sheet (AS568-314, S6).

What differs from the plan:
- **KF sizes:** no source gives the ISO-KF dimensions in its text; the Lesker KF notes, added as **S11**, give only the assembly. So the KF flange, ring and clamp sizes are the usual ISO ones, tagged *assumed*. The KF40 flange is redrawn at Ø55 mm, down from 65 mm.
- **Hose flanges:** the bellows hose's own KF40 flanges are drawn with the pump port and the pump, so each KF joint comes apart whole.
- **Welds and welded ports:** welds and welded flanges no longer move in Take apart. Where nothing moves (the lateral ports, the DN40 and DN63 ports, a gasket on its own), Take apart is off and says why.
- **Section neighbours:** the section cuts the parts the inspected part is joined to (`connects`), and its own other pieces, inside a box round it; not every part within reach, which cluttered the view. It aims the plane but never turns the camera (D2); a square-on view waits for **Turn to see** (W4).
- **T4 sheets, partly done:** stock lengths, spanner sizes and washers are on every CF bolt and nut sheet, and 16 sheets are written for small hardware that had none. Sub-parts without a sheet fell from 61 of 145 to 45 of 155. The 45 left are frames, enclosures, cables and brackets; they run alongside, as planned.
- **Known blemish:** thin seam lines cross some hatched cut faces where the far surfaces behind the cut change depth.

### Phase 1: see it, reach it, link it (S each; no change to the model)

| Item | Change |
|---|---|
| **V1** | **Distinct lit states in every theme.** Kept = a solid fill in the theme's accent; preview = a dashed outline; hover = an outline. Each is 3:1 or more against the unlit material, checked on steel *and* copper. In Colour the accent stays teal (open question 1). |
| **V2** | **Keyboard focus on a Made of row, Pieces row or link chip lights its part**, as hover does. Link chips light their mate while inspecting too (today `legendHot` works only outside Inspect). |
| **V3** | **Framing.** A top inset keeps the part below the inspect bar. Small composite parts open framed on their head, not their cable. "Zoom to it" frames the part, not its box with cables. No 3 cm floor. |
| **V4** | **Tolerant picking** (3.6). A miss keeps the preview. Click slop is 10 px. The triad's targets are 24 px. |
| **V5** | **One meaning per click.** With a mouse, a click on the model keeps a sheet and never closes it; × or the row closes it. On touch a tap previews, Keep keeps, and a tap never closes. |
| **V6** | **WCAG level-A fixes:** announce Take apart, Explode, Context, Sheets, hide and show, and leaving Inspect. A switch turns single-key shortcuts off. A source tag keeps focus, and offers ← back. The 3D view's focus ring is drawn inside its edge. The idle spin pauses while the page has focus in a panel. |
| **V7** | **Text scale:** a `--ui-scale` of 1–2× for sheets, labels, the inspect bar and the breadcrumb. It replaces "presenter mode". |
| **V8** | **Deep links:** a hash schema (part, piece, sheets, view, theme, and later step and Show me target), written with `history.replaceState` or `pushState` so browser Back works, plus **Copy link** in the inspect bar. |
| **V9** | **Touch layout under `pointer: coarse`:** every control 44 px or more; the inspector folds while inspecting in landscape under 1100 px; DPR 1 and no shadow pass while a finger is down or a glide runs. |

**Done when:**
- **Contrast (V1):** the kept nuts reach 3:1 against unkept ones in Colour, and so does a kept TF former against
  its copper neighbours.
- **Picking (V4):** 90 % or more of taps within 12 px of a 15 px nut open its sheet.
- **Framing (V3):** on first inspect the gauge's sensor nut covers 400 px² or more.
- **Links (V8):** `#part=gaskets&piece=right-back&sheet=…` in a fresh profile reproduces the gasket assignment, and
  all 30 parts round-trip.
- **Text scale (V7):** at 1920×1080 and scale 2, sheet digits are 25 px or larger, with three sheets kept.
- **Announcements and shortcuts (V6):** `#status` changes after `T`, `E`, `G`, `S` and Esc; with shortcuts off, `h`
  does nothing.
- **Touch (V9):** at 1024×768 in landscape, every button is 44 px or more and the sheets get a column.

**Status: done** (October 2026). All seven checks pass in headless Chrome:
- **Contrast:** kept nuts against the same pixels unkept, 4.1:1 taken apart and 4.4:1 together. A kept TF former, 4.7:1
  against itself unkept and 6:1 against the copper cover band.
- **Picking:** all 300 taps within 12 px of the ~15 px gauge nuts open the nut's sheet, by touch and by mouse.
- **Framing:** the gauge's sensor nut covers 623 px² on first inspect at 1366×768.
- **Links:** the gasket link reproduces *Right–back joint* with the OFHC copper gasket sheet kept. All 30 parts
  round-trip, on their first and last piece with two sheets kept. Back returns to the previous part, then the assembly.
- **Text scale:** sheet digits are 25 px at 2× in a 1920×1080 window with three sheets kept, and the column sits under
  the two-row inspect bar. At 1280×720 and 1.5× the gauge stays clear of the column.
- **Announcements:** `#status` reads a new line after `T`, `E`, `G`, `S` and Esc. With single-letter keys off, `h`
  does nothing; with them on, it hides the part.
- **Touch:** at 1024×768 in landscape, no button is under 44 px, the inspector folds, and the sheets keep a column.

What differs from the plan:
- **Colour handling:** the renderer turns three.js colour management off, so a material's hex is shown as written. One
  teal could not reach 3:1 against both pale steel and dark copper. So the kept fill is dark teal (`#00261f`) on
  materials lighter than 35 % luma, and pale teal (`#9eebe0`) on darker ones.
- **Outlines:** the ink pass writes each mesh's lit state into a spare channel, and the edge pass draws the outline from
  it. So all three themes get the same outlines, solid for kept and hover and dashed for a preview. Greyscale lost its
  hover wash and amber rim; a hovered part now gets the outline like the others.
- **Text scale:** CSS `zoom` on the sheets, the inspect bar (the breadcrumb lives there), the view's labels and the
  tooltips, not a rem rewrite. The column widens with it, and the dock takes over 280 px earlier per extra 1×.
- **Copy link** is a link icon before **Done**, so the bar stays one row at 1×.
- **Links:** pieces and sheets are named by slugs of their labels, and `sheet=` is read as well as `sheets=`. The
  round trip showed that a prefix alone is not enough (*Gauge cable* opened *Gauge cable clamp*), so an exact
  slug wins.
- **Picking:** with a mouse the 12 px disc is searched only when the click hits nothing. On touch it is 24 px, and
  the smallest part in reach wins even over a hit.
- **Single-letter keys off** silences every key that types a character (`+`, `0`, `[` too), not only letters.
- **Found on the way:** the sheet column had always sat at its CSS 80 px, because its top was summed from the
  axis triad's `offsetTop`, which an SVG lacks. At 2× the inspect bar covered the sheets' header. Both are now
  measured as rects, and the view's hint stops short of the column.
- **Open questions 1 and 2** were taken as the plan assumed: teal in Colour, and a click never closes a sheet.

### Phase 2: Show me, the Stark core for small parts (M)

**S1. Show me.**
- **Triggers:**
  - a **Show me** button on each sheet bar and each Made of row (44 px on touch);
  - the `Z` key, or Enter on a row;
  - a double-click on a sub-part (mouse only).

  A tap on a sheet bar is *not* a trigger: on a glove it sits next to × and Keep.
- **What it does:**
  - frames the sub-part at 50 % or more of the free view, below the bar and beside the column;
  - dims the rest of the piece;
  - shows a breadcrumb in the inspect bar whose segments are links ("Back quarter › Gauge and gas stack › Gauge ›
    Sensor tube nut");
  - draws the seat ring (W2), with an **edge marker** pointing to it when it is off-screen;
  - cuts instead of gliding under reduced motion, and is announced.
- **The Esc ladder, written once** (Daniel): preview → Show me frame → one piece → every piece → the assembly.
  - On the tour, Esc stops at every piece and never leaves the tour; only **Done** leaves it.
  - No confirmation dialog.

**S2. One leader line** from the hovered, focused or kept sheet to its sub-part, drawn only while the view is still.

**S3. Named callouts on a taken-apart piece.**
- **Content:** "3 · KF16 clamp", numbered as the Made of rows.
- **Placement:** in the gutters with short stubs, laid out when the camera stops and hidden while it moves. They fall
  back to numbered balloons on narrow views (3.5).
- **Limit:** at most ten, five at scale 2.
- **Accessibility:** hidden from assistive technology, out of the Tab order, and tappable (a tap previews).

**S5 (deferred to a test).** A locator inset beyond 4× zoom, desktop only. It ships only if the breadcrumb and edge
marker leave users lost at ×28 in a test.

**Done when** (at 1366×768 with the column open, on a trackpad, and on touch at 1024×768):
- **Show me:** one action takes the sensor nut to 50 % or more of the free view, the seat ring is drawn, and Esc
  returns to the previous frame.
- **Callouts:** the stack, taken apart, shows its sub-part names without hovering, with no leaders crossing and none
  covering a bolt ring (Kai's k10 view, at 1440 and 1366).
- **Leader line:** it still ends on the kept sub-part after a 90° turn.

### Phase 3: where it goes (M)

| Item | Change |
|---|---|
| **W1** | **Mate context.** While inspecting, the parts in `connects` are drawn about 50 % solid, with their fasteners, not as ghosts. Framing keeps the seat in view, including after Take apart. |
| **W2** | **Seat ring and tether.** A dashed seat ring, 3:1 or more, where the part rests, and one tether from the lifted part to it. *Ships in Phase 2 with S1.* |
| **W3** | **Quarter names.** Front, Right, Back and Left on the table edge, and in the 3D view's text description. |
| **W4** | **Turn to see.** A button, offered when the take-apart axis is within about 20° of the line of sight. It cuts under reduced motion. |
| **W5** | **One trail line** for the hovered or kept sub-part only. No trails per bolt. |

**Done when:**
- **Gauge:** the inspected gauge shows the stack's KF16 adaptor solid and in frame, at its clamp (needs T2).
- **Gasket:** the Right–back gasket shows both flanges and their 20 bolts solid, with "Right" and "Back" readable on
  the table.
- **Students:** four of five point to the gauge's seat within 5 s.

### Phase 4: in order (M, then L)

**O1. Steps in fitting order** inside the Take apart bar, as ‹ step n / N ›.
- **Data:** a new `order` per sub-part, tagged *assumed* where no procedure is published.
- **The last step** is today's all-at-once view.
- **Each step says how, not only what** (Mai):
  - the part, and which way it faces;
  - its thread, bolt length and spanner (from T4);
  - for the gasket step: "new gasket, never reused".

  The step lights its mate (W1) and its seat (W2), and is announced.
- **Order rules:** welds never become a step, and a CF gasket comes out last.

**O2. Star-numbered bolts** at the bolt step. Numbers are drawn on the heads and given as text.

**S4. Single bolts named, not picked** (3.4).
- The tooltip and status read "Bolt 7 of 20 · star 3".
- Dimension lines go on one sample bolt of a framed ring.
- The click still keeps the ring's sheet.

**O3. Open this joint (L).** The two flanges, gasket, bolts and nuts of one joint as one sequence across parts, gasket
last.

**Done when:**
- **Fitting order:** a first-year recites the viewport's fitting order (bolt size, spanner and star order included)
  from the app alone in under 2 minutes.
- **Star order:** the Right–back joint opens in numbered steps, in a proper 20-bolt cross pattern.

### Phase 5: teach and find (S–M)

| Item | Change |
|---|---|
| **L1** | **Search:** ignore stop words; index sheet rows ("M8", "o-ring"); match from word starts ("led" no longer finds "sealed"); say so when nothing matches. |
| **L2** | **"Where does it go?"** (M): a part is lifted, the student clicks its place, and the answer is checked against `connects`. Questions can be shared as links (V8). |
| **L3** | **Words and toggles:** "Screens" becomes **Sheets**, "Context" becomes **Ghost**, and one label for Done. Toggles are drawn as switches, not as primary buttons. Take apart's tooltip says "sub-parts". `]` acts only on what is exploded. |
| **L4** | **Long-press loupe on touch:** 3×, with the sub-part's name. Lifting the finger opens the preview. |

## 5. Open questions for you

1. **The selection colour in Colour.** Teal, as a solid fill (Amara: amber fails 3:1 against copper), or amber in
   every theme for one selection colour? The plan assumes teal. *Phase 1 built teal; amber stays a small change.*
2. **V5 reverses the README's "click it again to close."** The plan assumes yes. Daniel proposed it, Amara backed
   it, no critic objected in round 3, and Lena added the touch clause. It fixes tremor and glove double-taps.
   *Phase 1 built it; the README says so.*
3. **Fitting order (O1).** No procedure is published (S4 slides 16–27 give only a run order). Tag the steps
   *assumed*, or ask Rideo Systems for their build order?
4. **Stock bolt lengths (T4).** Should the drawn bolts change to the derived stock length? Ruud: yes, or a student
   asks stores for a 53 mm bolt.

## 6. Rejected ideas

| Idea | Why not |
|---|---|
| Callouts on every sub-part, re-sorted every frame while the model turns | Unreadable mid-orbit and at 200 %, and they cross on the stack. Labels settle when the camera stops (D5). |
| Picking or pulling one bolt of 20 by default | It makes targets 20 times smaller for a sheet that is the same on all 20, and adds a fifth level. The ring is the unit (D1, 3.4). |
| The camera orbiting by itself on Take apart | A vestibular risk; it breaks matching the screen to the real machine, and the lecturer's narration. **Turn to see** instead (D2). |
| A trail line per bolt | Over 40 hairlines on one joint, where the parts are smallest. One trail for the hovered or kept sub-part (W5). |
| Numbered balloons without names | "3" is a lookup and a recall. Named labels, with balloons only as the narrow-view fallback (3.5). |
| A separate step player or "workshop mode" | A new mode. Steps live in the existing Take apart bar (D4). |
| Features only in the Hologram | The Hologram makes copper and steel the same blue (Mai m11), and a lit hall turns projector black to grey. Everything works in all three themes. |
| Gesture-only actions, and flick inertia | No keyboard path. On a bench the model must stop where you leave it. |
| A tap on a sheet bar as a Show me trigger | On a glove it sits next to × and Keep, so a miss would swing the camera. |
| A confirmation dialog when Esc would leave the tour | People learn to click through it. Esc never leaves the tour; Done does. |
| Presenter mode as a separate mode | One text-scale setting does its job (V7). |
