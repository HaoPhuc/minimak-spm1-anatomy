# Round 3: Prof. Janssen (lecturer)

## 1. Verdict
**Accept with changes.**

## 2. Blocking objections
1. **The text scale comes in Phase 5, but Phase 2 already uses it.** S3's callouts "scale with a `--ui-scale`", which L2 only adds in Phase 5. Until then, every label, sheet and breadcrumb from Phases 1–3 ships at 12–12.5 px, a quarter of a slide's minimum on my beamer.
   *Change:* move L2 into Phase 1 as **V6**.
   *Done when:* at 1920×1080 with scale 2, sheet digits are ≥ 25 px and callouts ≥ 24 px, with three columns kept. At 1280×720 with scale 1.5, nothing covers the part.
2. **Phase 0 gates too much.** Phase 1 (lit states, framing, picking) magnifies nothing, and T4, the 61 missing sheets, is missing text rather than wrong geometry.
   *Change:* make Phase 0 gate only what it exposes:
   - T1 and T3 gate Phase 2;
   - T2 gates W1, so the gauge's mate is drawn at its clamp;
   - T4 runs alongside the phases.

   Phase 1 starts now.

## 3. Move earlier: L1, deep links, into Phase 1
Every later phase adds state: the Show me target, step n, kept callouts. Adding a link format after five phases means retrofitting all of it.
- Define the hash schema in Phase 1: part, piece, sheets, view, theme.
- Add to each later phase's *done when*: "its new state round-trips through the link".

Then I can link assignments from the first release, not the last.
