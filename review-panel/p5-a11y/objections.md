# Round 3: Amara's objections

## 1. Verdict
**Accept with changes.** V1, V2, V4, S1 and the rejected list cover my asks.

## 2. Blocking objections
1. **The level-A fixes come last (Phase 6), yet Phases 2–4 rely on them.**
   - Shortcuts cannot be turned off (2.1.4), state changes are silent (4.1.3), and the view's focus ring is clipped (2.4.7).
   - S1 and O1 promise "announced" before the announcing exists.
   - *Change:* move the Phase 6 bullet "Announce Take apart, … a source tag keeps focus; the view's focus ring" into Phase 1 as **V6**.
   - *Done when:* `#status` changes after T, E, G, S, Space and Esc; with shortcuts off, `h` does nothing; after Enter on S1, focus is on its entry; the view's ring is visible.
2. **S3 puts callouts "in Tab order with the Made of rows".** That doubles the stops, which are already 12 before the first row, and gives screen readers two controls with the same name.
   - *Change:* callouts get `aria-hidden="true"` and `tabindex="-1"` but stay tappable. Their number goes into the row's name ("3 · KF16 clamp"), and focus on a row lights its callout.

## 3. Move earlier
**L2 `--ui-scale`: from Phase 5 into Phase 2, before S3.** S3 already scales with it, and low-vision users need it before more text lands on the model.

**On owner question 1:** use teal in Colour. Amber barely differs from copper, so it would fail V1's 3:1 against copper.
