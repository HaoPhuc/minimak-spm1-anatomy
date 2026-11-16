# Guided analysis checks

Scenarios for [`../shot.mjs`](../shot.mjs) that drive the guided analysis in headless Chrome and print what they find.
From the repository's root:

```bash
node review-panel/shot.mjs . review-panel/guide-check/checks.json review-panel/guide-check/out
```

It takes about 8.5 minutes. Each scenario prints its lines, and any console errors after them; compare the lines with
the pass conditions below.

| Scenario | What it does | It passes when |
| --- | --- | --- |
| `walk-desktop`, `walk-phone` | Opens every step in turn. Where a step has **Show this step**, presses it. | Every step settles (`ready=true`). Every step that checks its state goes from `before=false` to `after=true`. Where it rings a control, `ring=true`. On a phone, a control under ⋯ says so (`reach=…`). `orient.scale` targets `scale2` on a non-Blueprint desktop and `scale` on a phone or Blueprint. `use.history` and `use.finish` have no target (ring=false); read-only steps have before=null; `use.link` has no automatic action; the desktop loupe is informational (after=null). |
| `restore` | Starts from `#part=gaskets&piece=right-back&sheets=ofhc-copper-gasket`, with the sheet folded and the table hidden. Presses Next 12 times and Back 5 times during the glides. Runs steps that change the theme, dimensions, text size, hidden parts, panels, Explode, Spread, a floating sheet, the kept sheets and Ghost. Exits in the middle of a glide, waits, opens the guide again and finishes it. | History, storage and the address are unchanged during the guide. After Exit and after Finish, every value is as it was. Nothing changes after Exit. |
| `back` | Inspects the TF coils, then the pump, so history has a step back. Opens the guide, changes the theme, then presses browser Back. | The guide closes and gives everything back, and Back lands on the TF coils as usual. |
| `handoff` | Starts the tour, then the quiz, then the control desk, from their steps. Uses the standalone controls afterwards. | The guide is off when each starts, and all three work. Explode, Cutaway, inspect, Take apart, the steps and Done work, and the address is written again. |
| `keyboard` | Opens Learn, focuses its launcher, then opens the guide with Enter and walks it with Tab, Enter and Esc. | Focus goes to the question, then Show this step, then Next. Enter on Next moves on and keeps focus there. Esc closes the chapter list. Exit gives focus back to the launcher. |
| `reduced` | Runs with `prefers-reduced-motion: reduce`. | No transition or animation, and the camera is at its goal at once. |
| `phone` | Runs at 390 × 844 with touch. | The card sits under the view. Take apart rings ⋯ until ⋯ opens, then rings Take apart. The sheet is pulled up to read S9. The bottom sheet step works. |
| `fresh` | Starts from a fresh visit on Learn; opens the guide, reads the desktop scale, then exits. | Storage is unchanged; scale2 is ringed; Exit restores the snapshot and toolstrip state, with focus on the launcher. |

The keyboard launcher is selected explicitly because its position moved to Learn; subsequent Tab and Enter events are native driver events. The handoff chooses a known correct quiz place. On a main baseline without a control desk, only that unavailable handoff is skipped.

The walk waits for two animation frames after a step becomes ready, because `guideTick` places the ring on a rendered frame. The phone `use.loupe` target remains `stage` and must report `ring=true`. Its demonstration closes the loupe before returning, so `after=null` is expected on both desktop and phone.
