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

**Status: done** (October 2026). All three checks pass in headless Chrome, at 1366×768 and 1440×900 with the column
open, in Colour, Greyscale and Hologram:
- **Show me:**
  - One click on the sensor nut's Show me button frames it at 67 % of the free view's width: 46 % of its height at
    1366×768, 40 % at 1440×900. A tap at 1024×768 gives 67 % and 54 %.
  - The breadcrumb reads *Back quarter › Vacuum gauge › Sensor tube nut*.
  - The nut's seat is out of frame at that zoom, so the edge marker points to it. Zoomed out four times, the seat ring
    and its tether are drawn.
  - Esc returns to exactly the frame before.
- **Callouts:** the stack, taken apart, shows ten named callouts with no stub crossing another or the leader line, and
  none on a bolt ring. At text size 2 in a 1920×1080 window there are five, as numbered balloons.
- **Leader line:** with the adaptor flange's sheet kept, the line's end picks the adaptor flange before a 90° drag of
  the model and after it.
- **Also checked:**
  - Keyboard: Enter on a Made of row (12 Tabs from the part's name) and `Z` are Show me; Space keeps.
  - Esc steps Show me → piece → every piece → assembly. On the tour, four presses stay on the tour.
  - Reduced motion: Show me and Esc cut.
  - Links: `show=vacuum-gauge.sensor-tube-nut` reopens the same Show me.
  - Section and the theme buttons keep Show me, and Done clears the overlay. No console errors.

What differs from the plan:
- **The 700 px rule** is a fit test instead. Callouts become balloons when they do not fit beside the part, a stub
  would cross another or the leader line, or a label would sit on the leader line. At 1366×768 with the column, the
  free view is 630 px wide, and the stack's ten names fit.
- **The breadcrumb** has no "mounted on" step: *Gauge and gas stack* is not in it, since no data says what each part
  is mounted on. It gives the vessel quarter (from the scene), the part, the piece and the sub-part.
- **Enter on a Made of row** is Show me, as planned, so Space keeps the sheet; Enter used to. The row's Show me button
  is not a Tab stop: Enter and `Z` do its job.
- **The leader and the callouts:**
  - The sub-part the leader line ends on gets no callout, since its sheet names it.
  - The other labels keep clear of where the line crosses their gutter.
  - The callouts wait until the parts move less than 0.1 % of their travel per frame, about 1.5 s after Take apart.
    They are laid out once more when the parts have fully stopped.
- **The seat ring** also marks where a single lifted piece rests (W2 in full), when it is lifted more than 12 px.
  While a piece is taken apart, the callouts take its place.
- **Zoom** goes to 120× (was 40×), so Show me can fill the view with a 2 cm nut. The scale bar goes down to 1 mm.
- **Found on the way:** the gauge's sensor tube nut was drawn 17 mm across flats over the Ø19 mm tube, so its bore cut
  through the flats and the nut rendered inside out. Show me magnified exactly that. It is now drawn 24 mm across flats,
  and its sheet says so.
- **S5** stays deferred: no user test has been run.

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

**Status: built** (October 2026). The two checks that can be measured pass in headless Chrome, at 1366×768 and
1440×900 with the column open, in Colour, Greyscale and Hologram; the student test has not been run.
- **Gauge:**
  - On first inspect the stack is a mate (half solid) and the control drawer, joined to the gauge only by its cable,
    stays a ghost.
  - The stack's KF16 adaptor flange is inside the free view. The seat ring sits on the gauge's clamp face, and *Back*
    names its quarter.
  - Taken apart, the gauge's seat stays in frame.
  - V3 still holds: the sensor nut shows 546 visible pixels at 1366×768 and 790 at 1440×900 (400 asked).
- **Gasket:** inspecting the Right–back gasket makes both its flanges mates, with their 20 bolts and 20 nuts. *RIGHT*
  and *BACK* are in the view at 12 px, ink on a card halo.
- **Students:** not run. It needs five people who have not seen the app.
- **Also checked:**
  - Turn to see is not offered at the default view of the stack taken apart, but is offered from above. Pressed, it
    leaves the take-apart axis 71.5° from the line of sight. By Tab and Enter, focus then goes to Take apart; on touch
    it is a 44 px tap; under reduced motion it cuts.
  - One trail with the pointer on one bolt of a ring.
  - Context off hides the mates.
  - The view's description reads *seen from the front*, *the right*, *the back left* and *above, the front at the
    bottom* from those sides.
  - Phase 2's checks still pass. No console errors.

What differs from the plan:
- **Mates are the joined parts near where the part rests,** not every part in `connects`: the gauge's cable to the
  drawer would otherwise frame half the machine. They are drawn half solid without outlines, so the inspected part's
  edges still read through them. In the hologram they are dimmed to half.
- **Framing keeps the seat** by framing the part and where it rests together, with less padding (1.35 for a piece,
  was 1.6) so small parts stay large.
- **The seat ring of a lifted piece** rings the face it sits down on (the tenth of its resting box opposite the lift),
  not the whole box.
- **Quarter names:**
  - They are printed on the table top 6 cm in from each edge, each reading from its own side, and go down with the
    table in Explode.
  - A part's frame rarely reaches the table, so while inspecting, the quarters within 60° round the ring from the part
    are also named in the overlay. The name goes where the edge of the table is when nothing hides it, and is pinned to
    the edge of the view, pointing to it, when it is out of sight or hidden.
- **Turn to see** stops 15° short of square to the axis, so the view keeps some depth. Its axis is the main direction
  of the sub-parts' moves.
- **The trail** follows the sub-part under the pointer or its Made of row, else the leader line's sheet, and shows only
  while the piece is taken apart.

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

**Status: built** (October 2026). The star-order check passes in headless Chrome, at 1366×768 and 1440×900 with the
column open, in Colour, Greyscale and Hologram; the fitting-order check needs a student and has not been run. The
order is tagged *assumed* (open question 3).
- **Fitting order:** not run. It needs a first-year who has not seen the app. What the app gives them for the
  viewport, at four steps:
  1. *16 nuts:* "Undo the 16 nuts (13 mm spanner) in star order, as numbered on the heads, a little each round", with
     the numbers 1–16 on the heads.
  2. *16 bolts:* "Draw out the 16 bolts, M8 × 50 mm (13 mm spanner)", numbered again.
  3. *Viewport flange,* with its window.
  4. *Copper gasket:* "Fit a new one: a copper CF gasket is never reused." Fitting runs back from here to step 1.
- **Star order:** the Right–back joint opens in four steps from its gasket or either flange: the 20 nuts on the back
  side, the 20 bolts on the right side, the two quarters eased apart, then the gasket out. Steps 1 and 2 number all 20
  heads. Read in star order, the places run 1, 11, 6, 16, 3, 13, 8, 18, 2, 12, 7, 17, 4, 14, 9, 19, 5, 15, 10, 20 (the
  legacy cross pattern of ASME PCC-1), the same for the nuts and the bolts, so each nut and its bolt share a number.
- **Also checked:**
  - Each step lights its sub-parts and the mate they bear on, draws its trail, hides the callouts, and is announced.
    The stack comes apart in 13 steps, its first ring numbered 1–6.
  - Pointing at one bolt names it in the tooltip and the readout: *Bolt 16 of 16 · star 16*, and on the joint *Nut 2
    of 20 · star 9*. With sheets on, the tooltip shows only for one of a ring.
  - Show me on the viewport's bolts draws *M8 × 50 mm*, *grip 41 mm* and *13 mm across flats* on one bolt; the stack's
    8 bolts read *M8 × 45 mm* and *grip 36 mm*.
  - Keyboard only: `J` opens the joint; Tab reaches ‹ › in three presses from Open this joint and four from Take
    apart; Enter steps; Esc closes the joint, and on a piece taken apart goes back to All. Focus is never lost.
  - Touch at 1024×768: Open this joint and the step arrows are 44 px; a tap steps.
  - Reduced motion: the gasket is out at once, and back at once.
  - Links: `joint=1&step=2` opens the joint at step 2, and `apart=1&step=3` takes the viewport apart at step 3;
    both write themselves back the same.
  - Phases 2 and 3's checks still pass. No console errors.

What differs from the plan:
- **The order is a list per part** (`ORDER` in `parts.js`, each step a list of sub-parts that come off together),
  not an `order` on each sub-part: a step can hold two (the viewport flange with its window). A part with no list
  falls back to a rule: nuts, then bolts and screws, then the rest in the reverse of the build, seals last.
- **"All" stays the all-at-once view** and sits before step 1 on the arrows, as the pieces' arrows do; fitting is the
  same steps read back up, said under the last one.
- **The step's seat** is the trail's hollow ring, where the sub-part sat on its piece. **Its mate** is outlined: the
  mate piece whose resting box its sub-parts touch (the port, for each of the viewport's steps).
- **Star numbers** go on every ring a step takes off, nuts as well as bolts. A number whose head is hidden is drawn
  faint. Places are counted clockwise from the top, seen from the bolt heads, so a nut and its bolt read the same.
- **Dimension lines** go on the bolt seen most side-on, of those the one furthest out of the ring, and read along their
  lines as on a drawing. The length is measured under the head. The thread is given in the length (*M8 × 50 mm*), not
  on its own.
- **Open this joint** is a button beside Take apart (and `J`), offered on a gasket or a joint flange. Its third step
  moves the two quarters, with their elbows, as the flanges are welded on; the gasket then rises clear. The joint is
  framed at each step, as the gasket rises well clear of the rest. Turn to see is offered within 35° of its axis (20°
  for Take apart) and turns to 50° off it, a three-quarter view where the numbers and the parting both read. Section
  is off while a joint is open.
- **Flat triangles are dropped at load.** A ray grazing one (three corners in a line, where a lathe closes) made
  three.js r160 throw while picking. Pointing at the joint's nuts found it; it was there before this phase.

### Phase 5: teach and find (S–M)

| Item | Change |
|---|---|
| **L1** | **Search:** ignore stop words; index sheet rows ("M8", "o-ring"); match from word starts ("led" no longer finds "sealed"); say so when nothing matches. |
| **L2** | **"Where does it go?"** (M): a part is lifted, the student clicks its place, and the answer is checked against `connects`. Questions can be shared as links (V8). |
| **L3** | **Words and toggles:** "Screens" becomes **Sheets**, "Context" becomes **Ghost**, and one label for Done. Toggles are drawn as switches, not as primary buttons. Take apart's tooltip says "sub-parts". `]` acts only on what is exploded. |
| **L4** | **Long-press loupe on touch:** 3×, with the sub-part's name. Lifting the finger opens the preview. |

The phase has no *done when* of its own, so it is checked against the panel's: Mai's ("M8" lists the M8 sheets and
"led" lists no windows), Janssen's (his wording finds the Right–back gasket first, and a five-question round scores),
Daniel's (you can tell which toggles are on, and `]` no longer reaches the exploded machine), and Lena's (a held finger
shows a 3× loupe with the name, and lifting it opens the preview).

**Status: built** (October 2026). All four pass in headless Chrome, at 1366×768 and 1440×900 with the column open, in
Colour, Greyscale and Hologram, and the loupe on touch at 1024×768.
- **Search (L1):**
  - *the gasket between the right and back quarters* lists one row, *Right–back joint · OFHC copper gasket*, with
    "Closest matches: nothing has “quarters”" under the box. A click on it inspects that gasket with its sheet kept.
  - "M8" and "UNF" list the M8 bolt and nut rings of the joints and viewports (from their sheets); "o-ring" the three
    KF centring rings; "joint bolt" the four joints' 20 bolts; "KF clamp" the three clamps.
  - "led" finds nothing and says so ("sealed" still finds the windows by their own word). "xyzzy" says nothing
    matches and suggests a name, a size or a word.
- **Where does it go? (L2):** a round of five, answered once wrongly, then right, then four times by a real click
  on the model, scores *4 of 5 right first time*. The part lifts above the machine from the table top up, which is
  framed at 0.8–0.9× (the whole machine was 0.4×). A link, `#quiz=gauge,viewport,laser,needle,probe&q=2`, opens at
  the second question. Esc ends it: the part is home, the cutaway is back, and the score is announced.
- **Words and toggles (L3):** Explode, Cutaway, Panels, Take apart, Open this joint, Section, Ghost and Sheets are
  switches. Their buttons keep their background when on; the switch fills with the theme's accent (teal, black in
  Greyscale, blue in Hologram) and its knob moves right. Done and Next are the only filled buttons. Both Dones say
  *Done*. Take apart and its Spread slider say "sub-parts". `]` while inspecting with nothing apart, or in the
  assembly not exploded, changes nothing and says so; taken apart it spreads the part, exploded the machine.
- **Loupe (L4):** not open after 250 ms, open after 450 ms. On the gauge it reads *Vacuum gauge*; at the viewport's
  bolt step *Bolt 16 of 16 · star 16*. Sliding to the flange moves it (it then names a nut, as a tap there would).
  Lifting previews *16 nuts*. Held and lifted over nothing, the preview stays. A quick tap opens no loupe.
- **Also checked:**
  - Keyboard only: Enter on *Where does it go?* puts focus on the first choice; Tab and Enter answer; focus moves to
    *Next ›*, and Enter there to the next question's first choice. Esc ends the round with focus back on the
    Machine tab's button. The search note is a status, and the box is described by it.
  - Touch: the choices are 44 px tall, and a tap on a joint flange answers the gasket question.
  - Reduced motion: the lifted part is up within 300 ms and home within 300 ms (the glide takes about 1.5 s).
  - Phases 2, 3 and 4's checks still pass, with no console errors. The gauge's sensor nut shows 546 visible px at
    1366×768 and 790 at 1440×900, as before. (As merged, the switch style overrode `hidden`, so *Open this joint*
    showed on every part and wrapped the inspect bar, and the nut fell to 487; fixed after the taste review.)

What differs from the plan:
- **Search ranks by keeping the best, not by reordering.** The list keeps its groups, so the rows that score best are
  the ones shown: a word in a name counts 3, in a sheet or description 1, each times how rare the word is among the
  names. The rarest word decides, so the gasket beats the coils of the right and back quarters. A row found only
  through its part's name is not listed (the part's own row says it). Search hits wrap instead of cutting off "· 20 …"
  (Ruud).
- **Where does it go? reads `connects` one way.** Joins have no direction, so `QUIZ` in `parts.js` names what each
  of 13 parts sits on, each pair one of its `connects` (checked in development): a viewport goes on a lateral port,
  not on the webcam. Parts that hang between two others (the bellows line) or stand apart from where they plug in
  (the webcam, the spectrometer) are not asked. A place must also be within reach of where the part rests, so any of
  the three viewport ports is right but the drawer the gauge's cable runs to is not. Four choices in the bar make it
  work by keyboard, and one more try is given after a wrong answer. The cutaway is turned off while it runs.
- **A toggle keeps one label.** Take apart no longer turns into *Put together*, nor Open this joint into *Close the
  joint*; the switch says which. Orbit and Pan, and the theme, stay as segmented choices: they pick one of several,
  they are not on or off. The Part tab's actions are buttons, not switches, and keep their verbs.
- **The loupe is drawn again at 3×**, through the camera's view offset, rather than by stretching pixels, so edges
  stay sharp. It names what a tap at its centre would pick (the 24 px rule), so lifting does what it says.
- **Not done from Daniel's list:** "Resume at stop n" on the tour was not needed, as Esc already stays on the tour.

### After the phases: a taste review

The app was reviewed with the design-taste-frontend skill (its app-screen rules and inspector), for how easy the
machine is to explore and how satisfying it looks. The drawing held up; the frame round it read as a kit, the
machine got half the window, and inspecting on a phone covered the part. It also found *Open this joint* showing on
every part (fixed in #25). Its three changes, most effect first:

1. **Give the machine the screen.** *Done:*
   - **The width:** on a first visit the assembly list starts folded to its rail (a magnifier on the rail, or `/`,
     opens it to search; once opened or folded, the choice is kept), and the inspector is 23% of the window between
     300 and 360 px. The view is 71% of the window at 1440×900 and 1366×768 (it was 53% and 51%), 77% at 1920×1080
     and 70% at 1280×800.
   - **The home view** fits the whole machine, stand and pump included (it cut off below the table top), framed in
     the room right of the view's controls and clear of every label: at 1280–1920 px, on a 1024 px tablet and on a
     390 px phone, no pixel of the machine is under the controls, the hint, the readout, the triad or the caption.
     Zoom 1 keeps its meaning (the vessel on its table top), so links, the zoom limits and every framing are as they
     were; the home view is its own zoom (about 0.5), and the readout gives zoom against it, so it reads 1.00× there.
   - **Fewer controls:** the top bar keeps what changes the machine: Explode (with its Spread), Cutaway and the
     theme, 5 buttons where there were 16. The view's own controls are a small cluster at its left edge: zoom (not on
     touch, where you pinch), the home view, **Views** (a menu of the sides, the triad's axes for the keyboard),
     left-drag pans (one button, a mode, where Orbit and Pan were two), and the side panels. Iso, Front, Right and
     Top are in Views and on the triad; *Fit the whole system* went, as the home view now is that (`A` still fits
     what is shown).
   - **Checked:** Views by keyboard (Enter opens on the first side, ↓ moves, Enter picks Front, Esc and a click
     outside close it, focus back on its button); Home; Pan on and off; the rail's magnifier and `/`; the panels
     button (92% of the width with both folded); touch targets 44 px; inspecting the stack, no callout on the cluster;
     Colour, Greyscale and Hologram. Phases 2–5's checks still pass, with no console errors; the sensor nut shows 514
     visible px at 1366×768 and 764 at 1440×900.
2. **Inspecting on a phone.** *Done,* for any view under 660 px (the width that already chose the dock):
   - **One row:** the inspect bar runs across the top of the view with the part's name (two lines at most), one way
     to step (the tour's Next, else the steps once it is apart, else the pieces), **⋯** and Done: 54 px high at
     390×844, where it wrapped into six rows, 221 px (293 px taken apart), under the view's buttons. **⋯** opens the
     rest under the bar as a two-column panel: Take apart and its Spread, Open this joint, Turn to see, Section,
     Ghost, Sheets, Copy link, the pieces when the steps have the row, and ← back. They are the same controls,
     moved, so each keeps its handler, its key and its state; a wider view puts them back in the bar's order. A pick
     closes it, and so do a tap outside and Esc; opened from the keyboard, focus goes in and comes back to ⋯. The
     view's caption gives the bar its place, and the triad sits under it. While Turn to see is offered, ⋯ carries a
     dot. In Show me the breadcrumb takes the row, scrolled to its end, the sub-part (changing piece ends Show me, so
     the pieces wait under ⋯); a step's caption sits under the row, and the part is framed below it.
   - **A bottom sheet that peeks:** the dock (42% of the view, a box under the model) is a sheet across the foot of
     the view, 30% high: the card's head, name and first lines. A drag on its head, a tap there or ⌃ pulls it up to
     72% to read; down again the same ways, or by Esc. The camera never moves for it, and another part lets it peek.
     A touch near the head's buttons lands on one of them (the browser's touch targeting), so a drag may start on a
     button and still pulls the sheet; a tap stays the button's. The head shows ‹ › only with something to step
     through and Close all only with a sheet kept, where it showed three disabled buttons on the part card alone.
   - **The part framed in the room left:** at 390×844 the gauge stack has 276×300 px of the 343×540 view, where the
     bar and the dock left it 276×40 px, and nothing at all once taken apart; at 640×800 (a narrow window, by mouse)
     539×296 px, where it had 539×175. At 768×1024 and 1440×900 the bar, the column and the free view are the same as
     before, to the pixel.
   - **Checked:** by touch at 390×844: ⋯ by a tap and by the keyboard (focus goes in; Esc closes it, back on ⋯,
     with the part still inspected), Take apart from it, a tap outside it; the sheet pulled up by a drag on its head,
     down by a tap there, up by ⌃ from the keyboard and down by Esc; the tour's row (*1 of 8*, Next), the TF coils'
     pieces, a step's caption, Show me's breadcrumb, a joint opened with Turn to see's dot; Colour and Hologram. The
     inspector, at 390 on the stack taken apart: no findings. Phases 2–5's checks and the machine-first ones give the
     same results as main, but for the quiz's random rounds and Show me in a narrow window, which fills two thirds of
     a taller free view; no console errors.
3. **The frame as considered as the drawing.** *Done:*
   - **A title:** "MinimaK SPM1" is the page's `h1` at 20 px, 16 px from the window's edge (it was 16 px, 10 px in).
   - **Sentence-case labels:** no tracked capitals (12 before); the redundant *Machine* and *Part* labels above the
     tabs' headings are gone, and a part's group and number moved under its name.
   - **One typeface:** no monospace anywhere (21 uses before); tabular figures where numbers line up or change.
   - **A neutral ground:** stone #f1f1ef with panels #fafaf9, in place of the yellow cream #f2f0e9 / #fbfaf6.
   - **Two frame faults found on the way, both already on main:** the Controls tab's key table was 551 px wide in a
     343 px panel, pushing what each key does out of sight (the key column now wraps); and the scale bar's length sat
     unbacked on the drawing, unreadable over the dark drawer (it now has the hint's backing).
   - **The inspector**, Colour theme, 1440, 768 and 390: no findings, against 3 fails (tracked capitals, text at the
     window's edge, no title) and 2 warnings (cream ground, figures not tabular) before. The Hologram kept its own
     two fails and two warnings (text and button glows, bright panel borders, colour share), answered below.
   - **The cost:** the margins and the taller title take a little of the view. The gauge's sensor nut shows 514
     visible px at 1366×768 (546 before) and 759 at 1440×900 (790), still over the 400 asked. Phases 2–5's checks
     still pass, with no console errors.
4. **Flat Hologram controls** (a smaller suggestion of the review). *Done:* the glow is the model's alone (its
   shaders, the projector's floor, the plasma). The panels, bars, sheets and buttons are flat: opaque surfaces one step
   off the black (#06121e on #03080f), rules about 1.5:1 against it (#16314a, they were a bright blue), ice-blue text,
   and no glow, glass, corner brackets, scan line or grid. A choice is a pale blue tint; an action (Done, Next, the
   Part tab's first button) is the ink on black, inverted. The inspector, Hologram, 1440 and 768: no findings, against
   2 fails (text glows, button glows) and 2 warnings (bright panel borders, colour share) before; at 390 one warning
   is left, 12% of the phone's screen strongly coloured, which is the blue model filling a small screen (the drawing,
   not the frame). Colour is unchanged and still clean.
5. **A quieter highlight** (asked for after the review: the 4 px bands round a part under the pointer were too
   heavy, and the older wash read better). *Done:* the outline is as thin as the ink, one ink width each side of the
   part's edge where it was two, so it gives the part a clean edge without a band. The part carries the highlight:
   - **Under the pointer, or previewed:** a light wash of the selection colour over the part's own colour and shading
     (teal toward the paper in Colour, the pale amber wash Greyscale had before Phase 1, a faint amber in the
     hologram), with the thin line, dashed for a preview.
   - **Selected or kept:** in Colour the fill keeps the part's shading, where it was a flat near-black teal (#00261f)
     that made a bolt a dark blob. It takes three steps by the material's brightness, so it stays 3:1 or more from the
     same face unkept on the metals (V1): mid teal #0b6e68 on steel and aluminium (3.4–4.0:1), deeper #054a45 on
     bolts, copper, bronze and cable (3.2–4.8:1), pale #9eebe0 on the black parts, red and blue (2.8–13:1). The
     weakest are a part's holes and slots (2.4–3.1:1, against the old fill's 2.3:1 on the PSU panel). Greyscale and
     the hologram keep their amber fills.
   - **Checked:** a real hover on the satellite coils and the viewports, a selected viewport, and the stack inspected
     with a kept sheet and a preview, in Colour, Greyscale and Hologram, before and after; the inspect, loupe and
     hidden-part checks give the same results as main.

## 5. Open questions for you

1. **The selection colour in Colour.** Teal, as a solid fill (Amara: amber fails 3:1 against copper), or amber in
   every theme for one selection colour? The plan assumes teal. *Phase 1 built teal; amber stays a small change.*
2. **V5 reverses the README's "click it again to close."** The plan assumes yes. Daniel proposed it, Amara backed
   it, no critic objected in round 3, and Lena added the touch clause. It fixes tremor and glove double-taps.
   *Phase 1 built it; the README says so.*
3. **Fitting order (O1).** No procedure is published (S4 slides 16–27 give only a run order). Tag the steps
   *assumed*, or ask Rideo Systems for their build order? *Phase 4 tags them assumed; asking Rideo Systems is still
   open, and their order would replace `ORDER` in `parts.js`.*
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
