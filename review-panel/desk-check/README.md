# Control desk checks

Scenarios for [`../shot.mjs`](../shot.mjs) that work the control desk in headless Chrome by its own buttons and print a
line per thing checked, `PASS` or `FAIL`. From the repository's root:

```bash
node review-panel/shot.mjs . review-panel/desk-check/checks.json review-panel/desk-check/out
```

It takes about four minutes. Any console error is printed after its scenario's lines.

| Scenario | What it does | It passes when |
| --- | --- | --- |
| `run` | Opens the desk from the Machine tab and does a whole run: a supply before INITIALISE, pump down and gas, GLOW ON, both TF banks at 40 A, PF1 and PF2 one way and the other, too much gas and too little, a sequence, REPLAY, HALL, SPECTROMETER. | Every rule answers with the glow it should; the readbacks read; a setpoint stops at 40 A; the coils that are on are lit; VIDEO 1 lights with the glow; all five tasks tick. |
| `stop` | With a glow in a toroidal field, clicks the emergency stop on the model (a real click, at the place the page reports). Then INITIALISE, STOP and SHUT DOWN. | The click trips the desk and selects nothing; the pump keeps running; nothing switches on until INITIALISE; STOP and SHUT DOWN switch off what they should. |
| `leave` | Leaves the desk by Done, by Esc, by a link and by Back, and starts the tour, the quiz, the guided analysis, Explode and an inspect over it. | Done gives back the cutaway, the panels and the view, and the focus; each other mode ends the desk; `#desk=1` opens it; opening adds one step to the history. |
| `layout-…` | Opens the desk with a glow at 1440 × 900, 1280 × 800, 1366 × 700, 1280 × 660 and 1024 × 768, in each theme, and at text size 2×. | The desk is inside the view; the view's buttons lie in a row under it; the bar is clear of the desk and the triad; the machine stands right of the desk; at the usual text size the whole desk shows, STOP included; no readback is clipped. |
| `phone` | Runs at 390 × 844 with touch. | The desk's panel is in the Machine tab under the monitor, a run works from there, and Done takes it out again. |
| `reduced` | Runs with `prefers-reduced-motion: reduce`. | The pressure, a coil's current and the glow are there at once. |

`out/` is not committed.
