# Ruud (vacuum and lab technician): round 1

**Who I am.** Ruud. Twenty years building UHV rigs; I brief students before they touch the SPM1: which bolt, which gasket, which side, what order.

Shots are in `p2-technician\shots\`; `cNN` shots are in `common\`.

## What I tried (1440×900, zoomed up to ×30)

1. **The bolts of one joint.** I took apart *Right–back joint, right side* and kept the bolt and flange sheets (`r1-j1-joint-bolts-apart-sheets`). They give 20 × M8 or 5/16-24 (honestly tagged *std*), Ø8.4 holes on a 181.0 circle, all tagged S9. Heads on one quarter, nuts on the other: right.
2. **The sealing face at ×16** (`r1-j3-sealing-face-x16`) is a flat plate. The sheet's knife edge (Ø166.1) and recess (Ø171.4) aren't drawn.
3. **The gauge and the stack under it**, taken apart and hovered (`r1-s1-stack-apart-sheets`, `r2-h1`, `r2-h2`), then close up (`r3-b1-colour-blank-arm-x14`, `r2-g1-gauge-kf16-x22`). The whole stack has one copper gasket.
4. **The pump-port KF40** (`r2-p1-pumpport-apart-kf`): no centring ring.
5. **The smallest part.** The Langmuir wire tip at ×30 (`r2-t1-hologram-probe-tip-x30`) is clean, with a true 5 mm scale bar. Searched "bolt" and "gasket" (`r2-f1`, `r2-f2`).

**What works.** The hover preview catches a 2 mm gasket or an M6 bolt set first time. Every vacuum number is tagged. The stack's take-apart reads like a catalogue drawing.

## Findings

1. **P1. Four CF seals have no gasket:** reducer→cross, cross→blank, cross→adaptor and cross→needle valve (`r1-s1`; `device.js` 658–674, 698–699). Their bolt sheet still says "two flanges and a 2 mm gasket" (`parts.js` 650). Searching "gasket" finds 13 of the 17 CF joints. Students open these most.
2. **P2. Some bolts end in air.** The blank, adaptor and needle-valve bolts go through both flanges with no nuts (`r3-b1`). Either the nuts are missing, or the holes are tapped and the bolts are too long, and the sheet says neither. The tapped reducer is right (`parts.js` 696–701).
3. **P2. The knife edge and recess exist only as text.** `cfRing` is a flat extrusion (`device.js` 243–268). The edge students must never touch; the recess centres the gasket.
4. **P2. The KF joints aren't drawn as KF joints.** There is no flange pair, and the O-ring and centring ring are folded into the clamp (`device.js` 680–682). The gauge's tube is unbroken, so the gauge lifts off at the CF face, not at the clamp (`c08a`). The O-ring is the part students lose.
5. **P2. Nothing shows the order of work.** Take apart moves everything at once (`index.html` 3702–3705). A joint's bolts, nuts and gasket sit in three places. A TIG weld slides off like a washer (`c07b`). The 20 bolts are never numbered for the star pattern.
6. **P2. The fastener sheets lack what I fetch from the drawer:** bolt length (53 mm drawn, `device.js` 462; the sheet gives only the grip), spanner size (13 or 10 mm, modelled but not stated), washers and a tightening rule. 61 of 145 sub-parts have no sheet at all, mostly small hardware (clamp bolts, rim screws, cable gland).
7. **P3. There is no "enhance".** While inspecting, a double-click is just a click (`index.html` 3519), and sheets never move the camera. At ×28 I lost track of which flange I was on (`r1-j2-joint-top-x28`). The preview tint on grey bolts is invisible (`r3-h3-hover-blank-bolts-clip`).
8. **P3. Search truncates the count I searched for:** "Right–back joint, right side · 20 …" (`r2-f1`).

## Proposals (ranked)

1. **Make the vacuum hardware true (M).** Add the four DN40 gaskets. Give each bolt set nuts or a "tapped" row. Draw each KF joint as two flanges, a centring ring with its O-ring, and a clamp, with the gauge coming off at the clamp. *Check:* searching "gasket" lists 17 CF gaskets, and no bolt ends in air.
2. **"Open this joint" (M).** Gather a joint's two flanges, gasket, bolts and nuts, then step through: loosen in numbered star order, nuts off, bolts out, flanges apart, gasket out. Back reverses it. *Check:* the Right–back joint opens in numbered steps, in a proper 20-bolt cross pattern.
3. **Draw the knife edge and recess (S)** as a revolved face profile, with the gasket seated in the recess. *Check:* both read at ×16, at the sheet's diameters.
4. **A fastener schedule (S).** One tagged table with a row per joint: size, count, thread, length, spanner, nuts or tapped, gasket. Add Length, Spanner and Washers rows to the bolt sheets. *Check:* "what do I need to refit the stack?" is answered from one table.
5. **Enhance (S).** A double-click on a sub-part frames it, with one leader label that tracks as you orbit. Make the preview amber stronger in Colour. *Check:* two actions take a bolt set from the overview to a third of the view.

## On the Tony Stark direction for small components

**Borrow:** pulling one joint out and expanding it mid-air, in the order the hardware really comes off. Also an "enhance" that keeps the true scale bar, and callouts pinned to the part with the number and size ("20 × M8, 13 mm AF"). The hologram holds up at ×14–×30 (`r3-b2-hologram-blank-arm-x14`), but see-through edges hide which bolt is in front; brief in Colour.

**Avoid:** everything flying apart at once, gestures as the only way in, and theatre that invents hardware. A weld that slides off and a KF clamp drawn as a doughnut both teach the wrong thing. Glow is fine; a missing gasket is not.
