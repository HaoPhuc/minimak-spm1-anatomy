# Guided analysis checks

Scenarios for [`../shot.mjs`](../shot.mjs) that drive the guided analysis in headless Chrome and print what they find.
From the repository's root:

```bash
node review-panel/shot.mjs . review-panel/guide-check/checks.json review-panel/guide-check/out
```

It takes about ten minutes. Each scenario prints its lines, and any console errors after them.

| Scenario | What it does | It passes when |
| --- | --- | --- |
| `walk-desktop`, `walk-phone` | Opens every step in turn. Where a step has **Show this step**, presses it. | Every step settles (`ready=true`). Every step that checks its state goes from `before=false` to `after=true`. Where it rings a control, `ring=true`. On a phone, a control under ⋯ says so (`reach=…`). |
| `restore` | Starts from `#part=gaskets&piece=right-back&sheets=ofhc-copper-gasket`, with the sheet folded and the table hidden. Presses Next 12 times and Back 5 times during the glides. Runs steps that change the theme, dimensions, text size, hidden parts, panels, Explode, Spread, a floating sheet, the kept sheets and Ghost. Exits in the middle of a glide, waits, opens the guide again and finishes it. | History, storage and the address are unchanged during the guide. After Exit and after Finish, every value is as it was. Nothing changes after Exit. |
| `back` | Inspects the TF coils, then the pump, so history has a step back. Opens the guide, changes the theme, then presses browser Back. | The guide closes and gives everything back, and Back lands on the TF coils as usual. |
| `handoff` | Starts the tour, then the quiz, from their steps. Uses the standalone controls afterwards. | The guide is off when each starts, and both work. Explode, Cutaway, inspect, Take apart, the steps and Done work, and the address is written again. |
| `keyboard` | Opens the guide and walks it with Tab, Enter and Esc. | Focus goes to the question, then Show this step, then Next. Enter on Next moves on and keeps focus there. Esc closes the chapter list. Exit gives focus back to the launcher. |
| `reduced` | Runs with `prefers-reduced-motion: reduce`. | No transition or animation, and the camera is at its goal at once. |
| `phone` | Runs at 390 × 844 with touch. | The card sits under the view. Take apart rings ⋯ until ⋯ opens, then rings Take apart. The sheet is pulled up to read S9. The bottom sheet step works. |
