# Ruud: round 3 objections

## Verdict

**Accept with changes.** Phase 0 first is right, but T1 and T4 would put wrong numbers on screen.

## Blocking objections

1. **T1 gives the new gaskets the wrong sheet.** `stack|Copper gasket` maps to `gasket-63`, so new DN40 rings under that name would show DN63 numbers. The fourth gasket belongs to the needle valve, not the stack.

   **Change:**
   - Add the sub-part "3 DN40 gaskets" (stack) and `needle|Copper gasket`, both mapped to `gasket-40`.
   - Tapped holes: shorten the bolts to flange + gasket + thread engagement and fix the Grip row. Through holes: add nuts.
   - Keep the TIG weld beads still in Take apart ("welded, not removable"), so they never become an O1 step.
   - Done when: the model has a copper ring in all 17 CF joints. Search rows don't count.
2. **T4 tags bolt length *drawn*.** The 53 mm the code picked isn't a stock length, and a student would ask stores for it.

   **Change:** Length = grip + nut + two threads, rounded up to the next stock length (M8 × 55, M6 × 35), tagged *derived*. Redraw the bolts to match. No new *drawn* tag.

## Move

**Move S4 (single-bolt picking) after Phase 4.** The ring is the unit you work with, and S4's dimension lines can sit on the bolt sheet now (T4). That frees an M for O1–O2: fitting order and star-numbered bolts, which every student needs before touching a CF joint.
