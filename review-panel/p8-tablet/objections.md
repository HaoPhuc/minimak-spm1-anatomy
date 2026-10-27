# Lena: round 3

## 1. Verdict
**Accept with changes.** The ring as the unit, Show me as a button, no camera moving by itself and labels as tap targets cover my case.

## 2. Blocking objections
1. **V4's "exact ray wins" defeats the disc on touch.** Near a pump-port bolt, the reducer took 50 % of my 10 px disc and the bolt only 38 %. A glove landing just off the bolt hits the reducer, and the reducer wins.
   *Change:* "With a mouse the exact ray wins. On a coarse pointer the 24 px disc always runs, and the smallest sub-part in it wins."
2. **V5 has no touch clause.** If a tap keeps a sheet, the phone dock fills up, which is why PLAN.md rejected "tap keeps".
   *Change:* "On touch a tap previews, Keep keeps, and a tap never closes." Also drop "a tap on a sheet bar" from S1. The bar sits next to the 24×22 px × and Keep, so a glove that misses them would swing the camera.

## 3. Move earlier
Move **Phase 6's touch layout into Phase 1**: 44 px targets, folding the inspector in landscape, and DPR 1 while a finger is down. At 1024×768 in landscape, Show me and the callouts otherwise get about 270 px of height under a two-row bar. The loupe can stay in Phase 6.
