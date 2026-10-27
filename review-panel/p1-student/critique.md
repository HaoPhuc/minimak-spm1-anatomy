# Mai: first-year applied physics, 1366×768 laptop, trackpad

**Who I am.** No CAD experience; next week I bolt part of the real SPM1 together; about a minute of patience per question.

Shots: `p1-student/shots/m01–m11` (1366×768). Measurements: `r1-log.txt`–`r3-log.txt`.

## What I tried

1. **First minute (m01).** The Machine tab is plain, the tour is in view, and dotted words explain themselves.
2. **A joint's bolts and their size (m02, m03).** "bolts" gave 28 rows across 14 parts, some cut off with "…". One click on "Right–back joint, right side · 20 bolts" inspected the joint and opened the sheet: M8 or 5/16-24, Ø8.4 mm holes, 44 mm grip, "star pattern". About 30 s, my best moment, but I couldn't tell which drawn parts were the bolts.
3. **Where the gauge goes (m05a–m07, m09).** The tooltip says "double-click", which helped. The gauge is framed with its cable down to the table, so the sensor nut was about 70 px² (8×8 px). After Take apart (m06) the machine had left the frame, so nothing showed what the gauge sits on. **Done** flew it home in about 1.4 s (m07). The *How it attaches* link to the stack answered it best (m09): stack at 4.35×, bolts and nuts, and "← Vacuum gauge" to go back.
4. **The smallest part: HV terminal cap (m04, m08, m10, m11).** It is about 16×16 px when first taken apart. Scroll-zoom toward the pointer took it to 11× and kept it under my cursor, a real "enhance". The preview even says to touch it only with the supply off and grounded. In Colour I couldn't see which object the sheet meant (m08). Greyscale turns it amber (m10).
5. **The knife edge I mustn't scratch.** The search found no piece for it. The sheet gives Ø166.1 mm, but the drawn flange faces are flat.

## Findings

1. **P1: there is no assembly order.** Take apart moves everything at once (m04): it shows directions, not a sequence. The fitting facts are scattered across `parts.js:652` (star pattern), `:117` (the gasket is used once) and the nuts sheet. I need steps.
2. **P2: "where it goes" vanishes while I inspect.** `frameIsolated` (`index.html:1715`) frames only the part, and the ghost is at alpha 0.12. The mating face isn't marked. Once taken apart, the machine is off-screen (m06).
3. **P2: in Colour, the highlight is invisible on steel.** A lit part only lightens toward the paper and gets a grazing-angle rim (`index.html:817–821`). See m03, m06 and m08, against m10. There are no labels, and the sheet sits about 400 px from its part.
4. **P2: small pieces open tiny.** The gauge is framed with its cable: nut 70 px², connector 88 px².
5. **P2: small features in the sheets aren't drawn.** CF faces have no knife edge or recess (`device.js` `cfRing`). The KF16 clamp is a plain ring (m06), while its sheet describes a hinged clamp.
6. **P2: front isn't shown.** Pieces are named "Right–back" and "Front viewport". Only the Controls tab says "−y is the front" (`index.html:3253`). In the lab I need that mapping.
7. **P3: search misses things.** It doesn't read the sheets, so "M8" and "o-ring" find nothing. "led" matches "sealed" (`index.html:2766`, `includes`).
8. **P3: trackpad.** Two-finger scroll always zooms (`index.html:3525`), and pan needs right-drag or Shift-drag. Pinch arrives as ctrl+wheel, so it could zoom while two-finger scroll pans.

## Proposals (ranked)

1. **A "Put it on" step player (M).** In Take apart, ‹ › put the sub-parts back one at a time in fitting order. Each step gets one sentence from the existing notes and its thread, and the bolts are numbered in star order. *Check:* a student lists the viewport fitting order, bolt sequence included, from the app alone in under 2 min.
2. **Show home (S–M).** Accent the mating face from `JOINS` with a dashed line to the seat, and add "Show where it goes" to frame the part and its seat together. *Check:* after the gauge is taken apart, the KF16 adaptor is marked on screen in every theme.
3. **Labels and a visible highlight (M).** Callouts on the taken-apart sub-parts that track the model and hide when they overlap, plus a real accent fill in Colour. *Check:* lit steel differs from unlit by ΔE > 20, and a newcomer points to the cap within 5 s.
4. **Frame for small parts (S).** Open multi-piece parts on the main piece, and add an "Enhance" key that zooms to the hovered sub-part. *Check:* the sensor nut is at least 400 px² on first inspect.
5. **Make small features findable (S each).** Draw the knife edge, recess and KF clamp halves, index the sheet rows for search, and match from word starts. *Check:* "M8" lists the M8 sheets and "led" lists no windows.

## On the Tony Stark direction

**Borrow:**
- The pull-out and fly-home, which already teach where a part goes. Let me scrub them.
- An explode in fitting order.
- Callouts that follow the part.
- "Enhance" to the sub-part under my pointer.
- One calm accent colour.

**Avoid:**
- Learning in Hologram: everything is the same blue, so the copper gasket and the steel bolts look alike (m11), and in the lab I'll recognise parts by colour.
- Scan lines, and slow cinematic moves when I want an answer.
- Gestures a trackpad can't make.

Fun, but it only helps if every floating piece knows its name and step.
