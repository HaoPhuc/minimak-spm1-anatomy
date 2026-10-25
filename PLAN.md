# SPM1 Anatomy: critique and plan for Inspect

The plan has one idea: **fewer rules.** Today, Inspect shows part information in up to three places, chooses between four layouts by width, and runs about ten hidden rules for sheets: caps, fold-to-fit, auto-close, three timers and a double-click undo. Most of the problems below come from these rules interacting. The target model gives each surface one job and reserves one fixed width for sheets. In place of the hidden rules there is one visible behaviour: a column that scrolls.

## How this was checked

- The app was served at `http://127.0.0.1:8765/` and driven in headless Chrome through the DevTools Protocol. The runs used real mouse moves, clicks, drags and keys, and read the DOM and app state through `window.__spm1`. Window sizes: 1920×1080, 1440×900, 1000×800, 900×900, 600×900 and 390×844 (touch).
- Screenshots are in `.arena/run-20261025-035053-s14073/plan-evidence-7f3/` (git-ignored; open them locally). **[13]** means `13-….png`.
- Claims based on reading code name the function in `index.html`. Claims not run in a browser are marked **(code only)**.
- Contrast was checked two ways:
  - Token pairs: by the WCAG formula.
  - Text on the translucent screens: **measured on rendered pixels**. The screen's text was hidden, each screen was captured, and the darkest 1 % (light theme) or brightest 1 % (hologram) of its background pixels was taken as the worst case.
- Piece lists and labels were read from `__spm1.piecesOf` in the running app. Source citations were counted in `parts.js`.

| Walk-through you asked for | What was done | Evidence |
|---|---|---|
| 1. TF coils | Stepped with › and `.`, used Take apart, kept 3 sheets on coil 1 and 3 on coil 5, then folded the inspector | [10]–[14] |
| 2. Viewport link and back | Back viewport → Webcam chip → Viewports chip → `Backspace` ×2 | [20]–[23], run log |
| 3. Many sheets | Kept 16 sheets on six joint flanges, one at a time, logging the column after each. Then Tidy, Fold all and the Esc ladder; Close all on the lateral ports | [30]–[35], [42], run log |
| 4. Drag and drop | Dragged a preview out; dropped a kept sheet on the part | [40], [41] |
| 5. Themes | Light at every width below; hologram at 1440, 1000, 600 and 390 | [50]–[52], [53h], [57h], [59h] |
| 5. Widths | 1920 and 1440 (both panels open), 1000 with the inspector open, 900, 600, 390 (touch) | [15], [53]–[59] |
| 5. Keyboard | From page load, Tab only, counting stops to the tree, the TF coils row and **Inspect on its own**. Then Enter, `I`, `.`, Enter on a "Made of" row, Shift+Tab to the pin, Enter, Esc | Run log |
| 5. Reduced motion | Inspect with `prefers-reduced-motion: reduce` | The zoom had reached its target 150 ms after `I` |

## Assumptions

- "Inspect" means everything between **Inspect on its own** and **Done**, including the inspector panel while it is open.
- Effort, for one person who knows the code: **S** = up to half a day, **M** = 1–3 days, **L** = more than 3 days.
- Where the README contradicts itself, the finding says so. The plan then takes the reading that serves the stated purpose: explain each part, how it attaches, and where each number comes from.
- "Fewer rules" wins ties. When two designs both work, the plan picks the one with fewer modes, timers and special cases.
- A **repeated** part is one that `parts.js` gives `count` > 1 (12 parts, such as the 8 TF coils). A **composite** part has `count` 1 but several pieces in Inspect that are different objects. There are 4: *HV supply and leads*, *Gas inlet valve and line*, *Vacuum gauge*, *Spectrometer and fibre*.

---

## 1. What is wrong, in short

1. **The sheet column hides what it holds.** Folding itself follows the README's fit rule, but a folded bar cuts off the sub-part name. With 9 kept joint-flange sheets, eight bars read "FRONT–RIGHT JOINT, RI…" or "RIGHT-BACK JOINT, RIG…", and none of them shows its sub-part [35]. The README gives three fold rules that cannot all hold. The 10th kept sheet silently closes the oldest.
2. **Comparing pieces shows two copies of the same sheet.** Kept sheets are keyed by piece. The TF coil former kept on coil 1 and on coil 5 makes two sheets, and both say "same on all 8 pieces". The coil 1 copies are folded and dimmed to 62 % opacity [13]. In Inspect, 16 parts have more than one piece:
   - 12 are repeated parts. Only 3 of them have per-piece data in `parts.js`, and the TF coils are not one of them.
   - 4 are composite parts, such as a supply box and two cables.
3. **Width decides the mode, and the thresholds surprise:**
   - At 1000 px with the inspector open, the view is 408 px wide, so a mouse user gets phone gestures [54].
   - At 900 px the inspector stacks under the model, and the view shows no part information [55].
   - At 600 px, kept sheets pile up over the part [57], [57h].
   - At 1920 px the view shows the component screens, and the inspector beside it shows the same facts [15].
4. **Part information appears in up to three places, and they drift apart:** the inspector, the component screen and the Structure screen.
5. **A learner gets a spec dump, not a path.**
   - There is one overview paragraph, and it disappears as soon as anything is selected.
   - Jargon (ConFlat, PF, eV, glow discharge) is never defined.
   - **Connects to** gives names, not how two parts attach.
6. **The keyboard path is long.** From page load it takes 34 Tab presses to reach the TF coils row and 99 to reach **Inspect on its own**.

---

## 2. Findings

### 2.1 Where the app differs from the README (the spec)

| # | README says | The app does | Evidence |
|---|---|---|---|
| D1 | Folded sheets keep "their top bar, which names the sub-part" (*The sheet column*) | The bar reads `code · piece · sub-part · state` in 10.5 px uppercase mono, cut off with an ellipsis at 280 px. The sub-part is cut to "WINDING: …", or disappears when the piece name is long. | [13], [31], [35]; `sheetScreen()` |
| D2 | Three rules: "When the sheets don't all fit, the oldest fold" (*The sheet column*); "Past six open sheets, the oldest folds", and "Only when there are more sheets than the column can show as bars (about seven on a laptop) does the oldest folded one close" (*Organising*) | **The README conflicts with itself, and the app runs all three rules.** In practice fold-to-fit wins. At 1440×900 one open sheet is 266–522 px tall, so from the 2nd kept sheet on, only the newest stays open (run log: 2 pins → `[F O]`, 9 pins → `[F F F F F F F F O]`). That much is the spec working. At this height the six-open cap never gets to act. **The deviation:** closing starts at the **10th** sheet, not at about the 7th. The column holds 9, and each further sheet silently closes the oldest (run log, sheets 10–16) [35]. `pinSheet()` computes `max(7, floor((834 − 118 − 168) / 60)) = 9`. | Run log; [35]; `pinSheet()`, `layoutColumn()` |
| D3 | **Tidy**: "…the sheets in one column…, all open" | `tidySheets()` clears `HUD.folded`, and then `layoutColumn()` folds them again at once. After Tidy, 6 of 7 sheets are still folded. It is the same README conflict as D2: "all open" cannot hold alongside fold-to-fit. | [33] |
| D4 | "Sheets are kept per sub-part, so all pieces with that sub-part share one" | `sheetKey = pin|piece.id|sub`, so each piece gets its own copy. Another README sentence describes the code instead: "Sheets you kept on other pieces stay open, dimmed, so two pieces can be compared side by side". The README contradicts itself again. | [13]; `sheetKey`, `sheetScreen()` |
| D5 | Two pieces "can be compared side by side" | The other piece's sheets are folded (D2) and dimmed by `.screen.other { opacity: .62 }`, which leaves muted text at 2.51:1 in light and 2.72:1 in the hologram. The content is identical anyway (D4). | [13] |
| D6 | Below 640 px "kept sheets cascade down the right edge" | At 600 px a kept sheet stays where its preview opened, beside the pointer. Only a sheet kept without a preview goes to the right edge. With three kept sheets, two overlap each other, and together they cover the part and slide under the inspect bar, in both themes. | [57], [57h]; `pinSheet()` keeps the `live` position whenever `!sheetColumn()` |
| D7 | The component screens show "once the inspector is folded or the view is wide" | At windows of 640–960 px the inspector stacks under the model and cannot be folded: the stylesheet hides `.fold` and forces the panel open (index.html lines 299–312). At 900×900 the description starts below the model, and most of it needs scrolling. `compShown()` still treats the inspector as "beside", so the view shows no part information. At 1920×1080 ("wide", a 1258 px view), the component screens and the inspector's Part tab show the same specification side by side. | [55], [15]; `compShown()` checks `panels.insp` and the view width, not the layout |
| D8 | Phone behaviour is "on a phone" | `phoneHud()` is `view width < 520`. At a 1000 px window with both panels open, the view is 408 px. A mouse user then gets a tooltip only on hover, a preview only on a click, kept sheets one at a time, and no **Sheets** menu. | [54], [53h]; log `stageW 408` |
| D9 | "Pieces are named by where they sit" | TF coils are "TF coil 1–8" and posts are "Post 1–4": numbered, not placed. The gauge's main piece is "Vacuum gauge 1": `piece('gauge', …)` at `device.js` line 674 has no label, so the fallback at `index.html` line 915 appends `i + 1`. | `device.js` lines 477, 674, 848; `index.html` line 915; `piecesOf` labels |
| D10 | The ← button and `Backspace` go back; "every link goes both ways" | **Holds.** All 84 `connects` entries are symmetric. Webcam → Viewports opens on the left viewport, and two `Backspace` presses return to the back viewport with its kept sheet. | Link check over `parts.js`; run log |
| D11 | Sources table: S3 (rideosystems.biz) is "Used for: The same headline specification" | No row cites S3. In `parts.js`, `'S3'` occurs only in its own `SOURCES` entry (line 22). No `specs`, `pieces` or `SUBDOCS` row cites it, so `renderSources()` lists it with no citing parts. Quoted occurrences in `parts.js`: S1 43, S2 48, S4 122, S3 1 (its own entry). | `parts.js` search; `renderSources()` |

### 2.2 Information architecture (lead)

- **What a sheet holds, in order:**
  1. Bar: code, piece and sub-part, state, button.
  2. Hint (preview only).
  3. Title.
  4. A run-on "from" line: part · sub-part · piece · "same on all N pieces".
  5. **On this piece**.
  6. Material.
  7. Rows, then a tag key.
  8. Note.
  9. Sources.

  The title repeats the bar. The "same on all 8" fact is buried in the middle of the from-line [11]. A sheet that has **On this piece** gets two tag keys [40]. The main table has no heading, while **On this piece** does.
- **Overlap between surfaces.** The inspector's Part tab (`renderInspector()`) and the two component screens (`componentScreens()`) render the same facts through different code: what it does, sub-parts, specification, On this piece, Connects to, Good to know.
  - The inspector adds a basis chip, actions, piece chips and sources.
  - The screens add "piece n of N" and an Assembled/Apart status.
  - Which one you see depends on width (D7, D8). On wide windows you see both [15].
- **Unclear labels:**
  - "same on all 8 pieces" is clear. But it is what identifies the sheet, so it belongs in the header.
  - "On this piece" is clear, but it appears in a sheet whose identity is "same on all".
  - The tag keys are clear, but they repeat under every table.
  - "Shape: Spec" in the component bar reads like a status or a spec value. Nothing says it is about the drawn geometry.
- **Comparing pieces.** The data allows very little comparison.
  - Of the 12 repeated parts, `pieces` exists only for the lateral ports (4/4), viewports (3/3) and top/bottom ports (5/5). It is missing for the vessel quarters, joints, gaskets, TF coils, inner and outer PF pairs, satellites, electrodes and posts.
  - The 4 composite parts step through different objects. For example, "‹ All 3 ›" on *HV supply and leads* gives HV supply, HV lead A and HV lead B. Their pieces are not comparable at all.
  - A learner who compares two coils learns only that they are the same, after reading two sheets.
- **Are floating screens the right container?** Floating suits one thing: a sheet you want next to a particular place. For everything else, a docked list beats a pile of floating cards:
  - every sheet has a fixed slot;
  - it scrolls instead of folding;
  - it never covers the part;
  - it has a keyboard order.

  The current column already behaves like a dock; it just doesn't scroll. For the component, the inspector already is the container. A copy in the view only duplicates it.

### 2.3 Visual design

- **Contrast (WCAG AA: 4.5:1 for small text, 3:1 for non-text marks):**
  - Light `--accent #0f8f88` on the card is 3.79:1 and fails. It is used for the "Click the part to keep…" hint and the bar code.
  - Light `--muted #6a6962` on `--chip #e8e5da` is **4.37:1** and fails, on surfaces that Inspect uses:
    - the kept row in **Made of** (`.subs button.on`, with the 11 px `.subs .k`);
    - the selected tree row (`.ti.sel`, with the 11 px `.ti .n` and `.ti .cnt`);
    - the 11.5 px basis chip (`.chip`).
  - Hologram `--muted #6a8ea8` passes on its chip (4.57:1). On the selected tree row (`.holo .ti.sel`, a 14 % blue tint) it is about 4.46:1. This is computed from the tokens; the panel is translucent, so it is an estimate.
  - Dimmed sheets fail: 2.51:1 in light, 2.72:1 in the hologram.
  - Muted text on a solid card passes: 5.28:1 in light, 5.43:1 in the hologram.
  - Muted text **measured on screens** (worst 1 % of background pixels):
    - At 1440, sheets in the column sit over empty canvas: 4.96:1 in light, 5.11:1 in the hologram.
    - At 600 px, kept sheets cover the lit part: **4.13:1 in light, which fails**, and 4.70:1 in the hologram.
    - The hologram's phone-style dock: 4.86:1 at 1000 px and 4.80:1 at 390 px.
  - **Basis dots fail on the chip surfaces in the light theme.** On the card they pass (3.39–4.05:1). The dots are drawn only by `.basis` (lines 123–125): spec filled, photo half-filled, assumed a 1.5 px ring.
    - While inspecting they sit on `--chip #e8e5da`: the selected tree row (`.ti.sel`, line 109) and the inspector's basis chip (`.chip`, line 260, built at line 2371).
    - On `--chip`, photo `#b07a12` is **2.95:1** and assumed `#8a8882` is **2.81:1**. Spec `#2b8a6e` passes at 3.35:1.
    - 24 of the 30 parts are photo (17) or assumed (7).
    - Hologram dots pass on every surface: at least 4.46:1, which is assumed on the selected row.
- **Type and density.**
  - Screens use 10.5 px (bars, h5), 11 px (tag key, `.ref`), 11.5 px (from-line, hint) and 12.5 px (body).
  - The 10.5 px uppercase mono bar is the most important label in the column (D1), and it is the smallest.
  - The component screen is capped at 52 % of the view height, so its spec table is cut off mid-row [14].
- **Highlights.** In the light theme, `FRAG_COLOR` mixes a lit fill toward teal `#0f9e96` (`refreshLit()` level 0.42 for kept sub-parts). That turns copper `#d79e72` (hue 26°) into about `rgb(131,158,129)`, a green-grey [12], [13], [35]. In a figure about materials, that reads as a different material. The hologram's amber selection reads well against the blue [51].
- **Hologram legibility.**
  - The panels and screens are legible at 1440 [51] and on the phone dock [59h].
  - The scan line is 7 % alpha and stops under reduced motion.
  - Muted text on hologram screens measured at least 4.70:1 in every layout.
  - The legibility costs are elsewhere. One is the dimmed `.other` sheets. The other is the glass over the lit part at 600 px, which is the layout closest to failing in both themes [57], [57h]. The theme itself is not the problem.
- **Chrome that disappears:**
  - At 1000 px the modebar scrolls horizontally with its scrollbar hidden, so the theme button is cut in half [54].
  - At 390 px, Explode, Cutaway and the theme button are off screen [59].
  - The inspect bar wraps to two rows at 778 px and to three at 408 px [11], [54].
  - A dropped sheet can cover the scale bar and the hint [40].

### 2.4 Interaction and accessibility

- **Gesture load.** Pointing previews, a click keeps, a second click closes, a double-click zooms to the piece, and dragging a preview keeps it. A double-click is also two clicks, so it keeps and then closes a sheet (a flicker), and `HUD.undo` restores the state from before the first click (stage `dblclick` handler, `endPointer()`). Code that exists only to undo its own gestures is a sign that the gestures overlap.
- **Hidden rules a user cannot see:**
  - the six-open cap and fold-to-fit (D2);
  - closing past `most` (D2: from the 10th sheet);
  - 250 ms to show a preview, 150 ms to switch, 1200 ms to linger (`setLive()`);
  - a double-click undo;
  - **Esc** closing kept sheets one at a time, as the README's Esc ladder says. Leaving a part with 7 kept sheets took **9 Esc presses** (run log).
- **Camera framing:**
  - The empty column is reserved, so a preview never moves the camera. That works, and it costs 300 of 778 px at 1440.
  - Dropping a sheet on the part re-frames the camera: the zoom went from 2.21 to 1.76 and the target moved [41]. This is a fourth framing rule, beside inspect, piece and take apart.
  - On a phone, each preview moves the camera to centre the sub-part above the dock (`centreAboveDock()`, code only).
  - After a link, the inspector keeps its old scroll position, so the new part's name is scrolled out of view [22].
- **Keyboard (run, from page load):**
  - **No skip link, a long tree.** Tab goes through the 14 modebar buttons, the tree's fold button, the search box and then the tree, where every row is two stops (eye, then name). The first tree row is the 20th stop, and the TF coils row is the 34th.
  - **Inspect on its own is far away.** After Enter selects the row, **Inspect on its own** is 65 stops further on (99 in all), past the rest of the tree, both grips, the stage and the inspector's tabs. `I` inspects the selected part, but only the Controls tab says so.
  - **Made of only previews.** Enter on a "Made of" row (`subsList()` → `showSubOf()`) only *previews*. It also forces **Take apart**, and focus drops to `<body>` because `renderInspector()` rebuilds the panel.
  - **Keeping needs a detour.** Keeping the sheet means Shift+Tab back into the HUD to the pin button. After Enter on the pin, focus drops to `<body>` again, because `renderHud()` replaces the screen.
  - **No keyboard fold.** Folding and unfolding are pointer handlers on a `div` bar with `tabIndex −1`. The only keyboard fold is **Fold all**.
  - **No keyboard hover.** Nothing does from the keyboard what hovering a sub-part in the model does.
- **Screen readers (code only).** `#hud` and `#inspBody` are both `aria-live="polite"`. Every hover preview and every `renderInspector()` call (each pin, each piece step) queues a full re-read. Screens are unlabelled `section`s.
- **Touch and narrow.** The phone dock works: a tap previews, and the sheet docks under the model [59], [59h]. The mode that fails is the 520–640 px "beside the pointer" layout (D6). Desktop windows near 1000 px fall into the phone mode (D8).
- **Reduced motion.** Inspect lands at once: the zoom had reached its target 150 ms after `I` (run). The code skips glides in `frameIsolated()` and `endInspect()`, and stops the screen-in animation, the hologram scan and the turntable spin. This matches the README, so there is nothing to fix here.

### 2.5 The learner: a first-year physics student, five minutes

This is a judgement from the content, not a user test.

- **What the machine does: partly yes.** The Overview paragraph gives a ring chamber, eight copper coils, a cold glow and "a tokamak's magnets without a tokamak's plasma current". It disappears as soon as anything is clicked, and it comes back only by deselecting, which nothing signposts (`renderInspector()` shows `renderOverview()` only when nothing is selected).
- **What each part is for: mostly no, in 5 minutes.**
  - The parts are numbered in build order by group. The plasma, which the machine is for, is #13.
  - Nothing explains *running* it: pump down, let gas in, energise the coils, strike the glow.
  - Terms are never defined: torus, toroidal and poloidal field, ConFlat and knife edge, DN, KF, eV, Pirani or Convectron.
  - Connects to gives names. *How* a part attaches appears only sometimes, in the `what` text.
- **Path or spec dump?** A spec dump with good provenance. The provenance is the app's strength: every spec and sheet row has a tag (194 source ids, 37 photo, 13 std, 9 derived, 5 assumed). The plan keeps it as it is and adds the path.

---

## 3. Target model for Inspect

### 3.1 One job per surface

| Surface | Its one job | Shows | Never shows |
|---|---|---|---|
| **Inspect bar** (top of the view) | Where am I, and where can I go | ← back, part › piece, ‹ n / N ›, All, Take apart, Context, Screens, Done | Sheet management (it moves to the column header) |
| **Inspector Part tab** (beside the view, or under it at 960 px and less) | The component | Name and piece, "Drawn from" basis, What it does, How it attaches (Connects to), Made of (rows that keep sheets), **Pieces** table (repeated parts), Specification, Good to know, Sources, one tag key | Sub-part detail |
| **Part card** (the first card of the sheet column or dock, **whenever the Part tab is not beside the view**: the inspector is folded, or the layout is stacked at 960 px and less) | The same as the Part tab | Built by the **same function** as the Part tab | Never shown while the Part tab is beside the view |
| **Sheet column** (right of the view, 300 px, scrolls) | Sub-part detail | Header "Sheets n · Fold all · Close all" (plus Tidy when a sheet floats), the part card when due, the kept list, and the preview slot under it | Piece-specific rows |
| **Bottom dock** (views under 660 px) | The same as the column, one card at a time | Header "Sheets n · ‹ card › · Close all". One card: the part card (when due), a kept sheet, or the preview | Floating sheets |

The in-view component screens go. On today's default 1440 layout they are already hidden, because the inspector beside the view shows the same facts. Where they do show, at 1920, they duplicate it [15]. In the stacked layout, where the inspector is out of the view, the part card replaces them and fixes D7.

**Three rules replace today's four layouts:**

1. **Room.** The model always keeps at least **360 px** of width, the minimum that `sizePanel()` already leaves the view. The sheet column takes **300 px** (`SCREEN_W` 280 + 20, as `hudInsets()` reserves today), so it needs a view of at least **660 px**. A smaller view gets the bottom dock. Nothing else reserves width: the left inset for component screens goes.
2. **Panels.** While inspecting, the assembly tree beside the view folds to its rail whenever the view is under 1000 px. In the stacked layout at 960 px and less, the tree sits under the inspector and nothing folds. **Done** brings the tree back if Inspect folded it. Inspect never folds the inspector.
3. **Gestures follow the input, not the width.** With a mouse, hover previews and a click keeps, in the column and in the dock. On touch, a tap previews. Width chooses only the layout.

**What that gives.** The widths come from the CSS grid: 10 px padding, 10 px grips, 34 px rails, and panels of 260/360 px above 1180 px or 230/320 px below; the layout stacks at 960 px and less. Each value is ±2 px for borders.

| Window | Panels while inspecting | View | Sheets | Model width |
|---|---|---|---|---|
| 1440×900 (today, or if open question 7 keeps the tree) | both open | 778 | column | 478 |
| 1440×900 | tree rail, inspector open | 1006 | column | 706 |
| 1440×900 | both rails (the user folded the inspector) | 1332 | column, part card first | 1032 |
| 1000×800 | tree rail, inspector open | 606 | dock | 606, above the dock |
| 1000×800 | both rails | 892 | column, part card first | 592 |
| 900×900 | stacked, inspector below | 880 | column, part card first | 580 |
| 600×900 | stacked | 580 | dock, part card first | 580, above the dock |
| 390×844 | stacked | 370 | dock, part card first | 370, above the dock |

The dock keeps today's height cap: 42 % of the view (`.hud.phone .screen`). Its height is reserved like the column's. The camera frames the part in the view above it, even with no card open, so a preview never moves the camera in any layout.

### 3.2 Life of a sheet

"Stops" means the pointer moves less than 4 px for 150 ms. A pointer crossing the model on its way somewhere does not stop, so it changes nothing.

```
 mouse: the pointer stops on a sub-part          touch: tap a sub-part
        |                                                |
        v                                                v
 PREVIEW -- dashed. In the column: the preview slot under the kept list,
        |   at most half the column (a longer sheet scrolls inside it).
        |   In the dock: the one card.
        |   Replaced when the pointer stops on (or a tap hits) another sub-part.
        |   Otherwise it STAYS: moving or pausing over empty canvas, the column
        |   or a kept sheet never clears it. Cleared only by x on the preview,
        |   Esc, a click or tap on an empty spot, < > in the dock, or any
        |   change of piece or part.
        |
        |  click the sub-part | [Keep] on the preview | Enter on its Made of row
        |  | drag the preview out
        |  (with All shown, a click or a tap on a piece picks that piece instead)
        v
 KEPT ----- open, last in the kept list and scrolled into view,
        |   or floating where it was dropped. One sheet per sub-part.
        |   The kept state belongs to the sub-part, not the piece: the former
        |   kept on coil 1 is lit as kept on all 8 coils.
        |
        |  chevron on its bar | Fold all                  chevron again
        v                                                 ^
 FOLDED --- bar only: the sub-part name, in full ---------+
        |
        |  x on the bar | click the kept sub-part again, on any piece (mouse)
        |  | Close all
        v
 CLOSED --- only ever by the user. Nothing folds or closes by itself.

 On touch, a tap on a kept sub-part shows its sheet in the dock; it never
 closes it. Leaving a part keeps its sheets, folds and places; inspecting it
 again restores them (as today, HUD.kept).
```

### 3.3 How comparing pieces works

- **One sheet per sub-part.** A TF coil former is one sheet, badged **Same on all 8**. A sub-part that only some pieces have is badged **On 2 of 5**. Composite parts get no badge, because each of their sub-parts belongs to one piece.
- **Repeated parts** (`count` > 1): what differs between pieces lives in **one Pieces table**, in the Part tab or the part card.
  - One row per piece, named by place.
  - Columns for *where it sits*, plus whatever `pieces` gives (Carries, Used for), each with its tag.
  - The current piece is highlighted, and a click on a row goes to that piece. This replaces the piece chips.
  - Where the sources give no difference, one line under the rows says so. For example: "The sources give no difference between the 8 coils; they differ only by place."
- **Composite parts** (the 4 whose pieces are different objects): there is no Pieces table and no "no difference" line. **Made of** groups its rows under each piece's name, for example *HV supply*: enclosure, display, output terminals, feet; *HV lead A*; *HV lead B*. ‹ › still step through the pieces.

### 3.4 Wireframes

Default at 1440×900 (tree folded to its rail, inspector open):

```
+--+--------------------------------------------------------------+---------------------+
|A | <- Viewports  TF coils > Right qtr, coil 1  <1/8> All          | Part  Sources  Keys |
|s |   Take apart  Context  Screens  Done                           |---------------------|
|s |                              +- SHEETS 3  Fold all  Close all -+| TF coil             |
|e |                              | > Copper former  Same on all 8 x|| Right quarter, 1    |
|m |                              | > Copper cover band   Same, 8  x|| (o) Drawn from:     |
|b |       [ the part ]           | v Winding, 50 turns   Same, 8  x||     published spec  |
|l |      (706 px wide)           |   Material   copper cable   S1  || What it does ...    |
|y |                              |   Turns      50             S1  || How it attaches     |
|  |                              |   S1 = ... derived = ...        ||  Vessel quarters:   |
|  |                              |- - - - - - - - - - - - - - - - -||  clamped round the  |
|  |                              |: PREVIEW  Terminal block  [Keep]||  elbow          S4  |
|  |                              |: (stays until replaced or x)   :|| Made of  Pieces (8) |
|  |                              +- - - - - - - - - - - - - - - - -+| Specification  key  |
+--+--------------------------------------------------------------+---------------------+
```

When the Part tab is not beside the view (the inspector is folded, or the layout is stacked at 960 px and less, e.g. 900×900), the part card comes first in the column:

```
+-- SHEETS 3   Fold all  Close all ---+
| v TF coil . Right quarter, coil 1   |  <- part card (same renderer as the
|   Drawn from: published spec        |     Part tab; folds like a sheet,
|   What it does ... Made of ...      |     never closes)
| > Copper former     Same on all 8 x |
| > Winding, 50 turns  Same, 8      x |
|- - - - - - - - - - - - - - - - - - -|
|: PREVIEW  Terminal block    [Keep] :|
+- - - - - - - - - - - - - - - - - - -+
```

View under 660 px (a 1000 px window with the inspector open, a narrow window, a phone):

```
+--------------------------------------+
| TF coil 1  < 1/8 >  Take apart  Done |
|            [ the part ]              |
|  (framed above the reserved dock)    |
+--------------------------------------+
| SHEETS 3  < kept 2 of 3 >  Close all |
| Winding, 50 turns   Same on all 8  x |
| Material ... rows ...                |
+--------------------------------------+
  Inspector beside the view (1000 px): the dock holds sheets only.
  Stacked (600, 390 px): the part card is the first card, < Part >,
  and the dock opens on it.
```

### 3.5 What is removed, and what replaces it

| Removed | Replaced by |
|---|---|
| Six-open cap, fold-to-fit, close past `most` (`pinSheet()`, `layoutColumn()`) | The column scrolls |
| The 250 / 150 / 1200 ms preview timers and the linger | One 150 ms stop opens or replaces a preview. The preview stays until it is replaced, kept or dismissed |
| In-view component screens (`componentScreens()`, the left inset in `hudInsets()`, `compShown()`) | The inspector's Part tab, or the part card in the column or dock whenever the Part tab is not beside the view |
| `phoneHud()` deciding gestures by width | Gestures by input type; width picks column or dock |
| `centreAboveDock()` moving the camera for each preview | A reserved dock height |
| Double-click zoom in Inspect, and `HUD.undo` | A click or tap on a piece while All is shown; the Pieces table; ‹ › |
| The drop-on-part camera nudge (`largestFreeRect()`, `nudgeIntoGap()`, the Sheets flash) | A dropped sheet stays where it was dropped; the camera does not move |
| The **Sheets** menu in the inspect bar | Buttons in the column or dock header |
| Per-piece copies of sheets, and `.screen.other` dimming | One sheet per sub-part, kept state per sub-part, and the Pieces table |
| The 520–640 px "beside the pointer" layout and the cascade | The bottom dock |
| **Esc** closing kept sheets | **Esc**: preview → whole part → assembly (at most 3 presses) |

---

## 4. Phases

Each item lists: **Problem** · **Change** · **Done when** (acceptance) · **Effort** · **Touches**.

### Phase 1: quick wins (no change to the model)

**Q1. Bars name the sub-part.**
- **Problem:** D1. Folded bars do not say what they hold [35].
- **Change:**
  - The bar shows the sub-part name first, in the body sans at 12 px, wrapping to two lines if needed.
  - The piece name goes under it, in 12 px muted text.
  - Drop the `07·S` code and the word "Pinned". Kept is the default state. The preview keeps its dashed edge and a "Preview" label.
- **Done when:** with 9 joint-flange sheets at 1440×900, every bar shows its full sub-part name ("20 nuts", "TIG weld to the elbow") with no ellipsis.
- **Effort:** S.
- **Touches:** `screen()` and `sheetScreen()` in *Information screens beside the part*; the `.screen .bar` CSS.

**Q2. Reset the inspector's scroll on a new part.**
- **Problem:** after a link, the new part's name is scrolled out of view [22].
- **Change:** `renderInspector()` sets `scrollTop = 0` when the selected part or piece changes.
- **Done when:** following Viewports → Webcam shows the "Webcam" heading at the top.
- **Effort:** S.
- **Touches:** `renderInspector()` in *Inspector*.

**Q3. Correct the hint in Inspect.**
- **Problem:** while inspecting, the hint still says "double-click to inspect" [11], [15].
- **Change:** while inspecting, the hint reads "Point at a sub-part to preview · click to keep · Esc steps back". Outside Inspect it adds "I inspects the selected part".
- **Done when:** the hint text changes on inspect and changes back on Done.
- **Effort:** S.
- **Touches:** `HINT` and `setHint()`, called from `inspect()` and `endInspect()`.

**Q4. Contrast.**
- **Problem** (2.3):
  - light accent text is 3.79:1;
  - light muted text on chip is 4.37:1;
  - hologram muted text on the selected tree row is about 4.46:1;
  - dimmed sheets are about 2.5:1;
  - light glass over the lit part at 600 px measures 4.13:1;
  - the light photo and assumed basis dots are 2.95:1 and 2.81:1 on chip.
- **Change:**
  - Light `--accent` `#0f8f88` → `#0a736e`: 5.45:1 on card, 4.85:1 on soft, 4.51:1 on chip.
  - Light `--muted` `#6a6962` → `#5e5d57`: 6.32:1 on card, 5.63:1 on soft, 5.24:1 on chip.
  - Light `--photo` `#b07a12` → `#9a6a0f`: 4.53:1 on card, 4.03:1 on soft, 3.75:1 on chip. It stays an amber, half-filled dot.
  - Light `--assumed` `#8a8882` → `#7c7a74`: 4.11:1 on card, 3.66:1 on soft, 3.40:1 on chip. It stays a grey ring. Light `--spec` is unchanged (3.35:1 on chip).
  - These two tokens are used only by `.basis` (lines 123–125), so the tree, the legend and the chip change together.
  - Hologram `--muted` `#6a8ea8` → `#7a9fb9`: 6.73:1 on card, 5.65:1 on chip, about 5.52:1 on the selected tree row. Hologram `--assumed` keeps the old value: its ring is already 4.46:1 or more everywhere.
  - Remove the `.screen.other` opacity. Mark another piece's sheet with a 3 px left rule instead (R4 removes these sheets entirely).
  - Light `.screen` card mix 72 % → 90 %; hologram `.screen` background alpha 0.62 → 0.85.
- **Done when** all three checks pass, in both themes:
  - Every text colour is ≥ 4.5:1 against every solid surface it sits on (card, soft, chip, selected row), by the WCAG formula.
  - Every basis dot's colour is ≥ 3:1 against card, soft and chip, by the WCAG formula.
  - On rendered pixels, with the screen's text hidden, muted text is ≥ 4.5:1 against the worst 1 % of a screen's background.
    - Measure it at 1440×900 (sheets in the column) and at 600×900 with kept TF sheets over the part (today's worst case).
    - With the text values above injected at runtime, this already measured 6.16:1 (light) and 6.26:1 (hologram) at 1440, and 5.49:1 and 6.08:1 at 600.
- **Effort:** S.
- **Touches:** the `:root` and `:root.holo` tokens; the `.screen`, `.screen.other` and `.holo .screen` CSS.

**Q5. A 12 px floor.**
- **Problem:** labels of 10.5–11.5 px carry the most important names (2.3).
- **Change:** no text below 12 px in the screens and the inspector. The `.ref` tag chips may stay at 11.5 px mono inside their box.
- **Done when:** the stylesheet has no `font-size` under 12 px for screen or inspector text.
- **Effort:** S.
- **Touches:** the `.screen …`, `.tagkey`, `.eyebrow`, `.chip` and `.doc h3` CSS.

**Q6. Rename "Shape: Spec / Photo / Assumed".**
- **Problem:** the label is ambiguous (2.2).
- **Change:** it becomes "Drawn from: published spec / photos / a guess", with the same basis dot as the tree. Its tooltip reads: "How far to trust the drawn shape and position. Each number carries its own tag."
- **Done when:** the label and the tree legend use the same words.
- **Effort:** S.
- **Touches:** `componentScreens()` (until R2 removes it), `renderInspector()`, `BASIS_SHORT`, `BASIS`.

**Q7. One tag key per screen.**
- **Problem:** there is a key under every table, so up to two per sheet [40].
- **Change:** `specTable()` returns the table only. The screen builds one key at its foot from the tags used anywhere on it.
- **Done when:** no screen or inspector page shows more than one key.
- **Effort:** S.
- **Touches:** `specTable()`, `sheetScreen()`, `componentScreens()`, `renderInspector()`.

**Q8. Fix the README's own conflicts.**
- **Problem:** D2, D3 and D4 are partly contradictions inside the README.
- **Change:** until Phase 2 lands, make the README describe today's app:
  - fold-to-fit is the rule, and the six-open cap is a backstop;
  - closing starts past the 9th sheet at 1440×900;
  - Tidy folds again whatever does not fit;
  - kept sheets are per piece.

  D7 is a defect, not a README conflict. R2 fixes it, so the README does not write it in.
- **Done when:** each of these README sentences matches a run at 1440×900.
- **Effort:** S.
- **Touches:** `README.md`, *Information screens*.

**Q9. One live region.**
- **Problem:** `#hud` and `#inspBody` are live regions that re-read whole sheets.
- **Change:**
  - Remove `aria-live` from both.
  - Add a visually hidden `<p id="status" aria-live="polite">` that says one line, such as "Kept: TF coil former. 3 sheets." or "Inspecting TF coil 3 of 8".
  - Give each screen an `aria-label` equal to its title.
- **Done when:** with a screen reader on, hovering sub-parts announces nothing, and keeping a sheet announces one line.
- **Effort:** S.
- **Touches:** the `#hud` and `#inspBody` markup, `pinSheet()`, `unpinSheet()`, `inspect()`, `setFocus()`.

**Q10. The modebar wraps instead of hiding.**
- **Problem:** the theme button is cut off at 1000 px, and three tools are off screen at 390 px [54], [59].
- **Change:** `.modebar { flex-wrap: wrap }`, and drop the hidden horizontal scroll.
- **Done when:** at 1000 and 390 px every modebar button is fully visible.
- **Effort:** S.
- **Touches:** the `.modebar` CSS.

**Q11. Highlights that keep the material.**
- **Problem:** kept copper turns green-grey [12], [13], [35].
- **Change, in plain words:**
  - In the light theme, a lit sub-part keeps its own colour and only gets lighter, toward the paper.
  - Its silhouette gets an accent-coloured rim, strongest at grazing angles. The hologram already lights its selection this way, with its rim term.
  - The existing `refreshLit()` levels (hover, kept, hot) set the rim's strength.
  - No stripes: in `FRAG_COLOR`, diagonal stripes already mean a cut face (the back-face hatch), and a selection must not look like a section.
- **Done when:**
  - in a screenshot of a kept TF former, its fill away from the rim keeps a copper hue of 20°–35° (the unlit `#d79e72` is 26°);
  - with Cutaway on and a sub-part kept, the only striped pixels are on cut faces;
  - normal, hovered and kept sub-parts can be told apart in one screenshot.
- **Effort:** S.
- **Touches:** `FRAG_COLOR` (*Materials* section) and the `refreshLit()` levels. The hologram path (`FRAG_HOLO`) is unchanged.

**Q12. Name every piece; no bare numbers.**
- **Problem:** D9.
- **Change:**
  - Each TF coil is named by its quarter and its position in that quarter, for example "Right quarter, first coil". The direction is yours to choose (open question 6).
  - Each post is named by its corner, for example "Front-right post".
  - The gauge's main piece gets a label, "Vacuum gauge".
  - The fallback in `index.html` line 915 stops appending `i + 1`. An unlabelled piece of a multi-piece part takes the part name and logs a console warning, so a missing label shows up in development.
  - The search text follows the new names.
- **Done when:** in the running app, no label in `__spm1.piecesOf` ends in a space and a number (`/\s\d+$/`), and the console shows no missing-label warning.
- **Effort:** S.
- **Touches:** the `piece()` labels in `device.js` at lines 477, 674 and 848; the label fallback at `index.html` line 915.

**Q13. Every listed source is cited, or says it is background.**
- **Problem:** D11. S3 sits in the README and the Sources tab, but no row cites it, so a learner cannot tell what it backs.
- **Change:**
  - `renderSources()` shows each source's citation count, for example "Cited by n rows".
  - A source with no citations says "Background: not cited by any row".
  - Then either cite S3 next to S2 on the headline rows it confirms, or keep it as background and change the README's "Used for" to "Background; confirms S2" (open question 8).
- **Done when:** every `SOURCES` entry has at least one citing row, or the background label appears in both the Sources tab and the README.
- **Effort:** S.
- **Touches:** `renderSources()` in *Inspector*; `parts.js` (`SOURCES`, and spec rows if S3 is cited); the README Sources table.

### Phase 2: restructure Inspect and the sheets

**R1. Room and gestures.**
- **Problem:** D8: a desktop window gets phone gestures because of its width. The inspect bar wraps to three rows [54]. The layout rules give the model no minimum width.
- **Change:**
  - `inspect()` folds the tree to its rail whenever the view is under 1000 px. `endInspect()` unfolds it again, if Inspect folded it.
  - One layout test is used everywhere: a view of 660 px or more has the sheet column; a smaller view has the bottom dock (R8).
  - Gestures test the input (`coarse`), never the width. `phoneHud()` goes.
- **Done when:**
  - the widths in the 3.1 table hold (±2 px) in every row except the first, which is today's layout;
  - the framed part is never narrower than 360 px while inspecting;
  - at 1000×800 with a mouse, hovering a TF sub-part previews it in the dock, and a click keeps it;
  - Done brings the tree back.
- **Effort:** M.
- **Touches:** `inspect()`, `endInspect()`, `applyPanels()`, `phoneHud()`, `sheetColumn()`, `hudInsets()`, `endPointer()`.

**R2. One part surface, one renderer.**
- **Problem:**
  - Three surfaces show the same facts through two code paths, and two of them show at once at 1920 px [15].
  - The 52 % cap cuts the spec [14].
  - D7: from 640 to 960 px the view shows no part information.
- **Change:**
  - Delete the in-view component screens: `componentScreens()`, `compShown()` and the left inset in `hudInsets()`.
  - One function, `renderPart(box)`, builds the inspector's Part tab, in this order: name and piece → Drawn from → What it does → How it attaches → Made of → Pieces → Specification → Good to know → Sources → key.
  - **Whenever the Part tab is not beside the view**, the same function builds the **part card**:
    - in a column layout, it is the first card in the sheet column;
    - in a dock layout, it is the first card of the dock, and the dock opens on it.
    - "Not beside" means the inspector is folded, or the layout is stacked (the 960 px media query).
    - The card folds like a sheet and has no ×.
- **Done when:**
  - the part card shows exactly when the Part tab is not beside the view: at 1440×900 with the inspector open, no card; with it folded, a card; at 900×900, 600×900 and 390×844, a card;
  - at 900×900 and 600×900, right after inspecting the TF coils, the part's name and "What it does" are visible inside the view without scrolling the page;
  - `hudInsets().l` is 0 in every layout;
  - the whole specification can be reached by scrolling.
- **Effort:** M.
- **Touches:** `componentScreens()`, `renderInspector()`, `placeScreen()`, `hudInsets()`, `renderHud()`, the `.screen.comp` and `.screen.links` CSS.

**R3. A sheet column that scrolls and decides nothing on its own.**
- **Problem:** D2, D3 and D5: hidden caps and three fold mechanisms. A preview can take the whole column.
- **Change:**
  - The column becomes a docked flex column in three parts:
    - the header "Sheets n · Fold all · Close all", plus "Tidy" when a sheet floats;
    - the kept list, which scrolls: the part card first when it is due (R2), then the kept sheets in the order they were kept;
    - the preview slot under it, present only while a preview shows. It takes at most half the column and scrolls inside.
  - A fold chevron button on each bar replaces the double-click.
  - Delete the six-open cap, the `most` close rule, `HUD.unfold`, the spare logic and fold-to-fit.
  - A newly kept sheet opens and is scrolled into view.
  - Remove the **Sheets** menu from the inspect bar.
- **Done when:**
  - at 1440×900, keeping all 8 sheets of the gauge and gas stack (8 sub-parts with sheets in `SUBMAP`) closes none and folds none;
  - every bar is readable;
  - with 4 kept sheets and a preview of the 522 px winding sheet showing, the kept list still has at least half the column;
  - previewing, keeping, folding and closing leave `goal.target` and `goal.zoom` unchanged;
  - Tidy returns floating sheets to the column.
- **Effort:** M.
- **Touches:** `pinSheet()`, `layoutColumn()`, `renderHud()`, `updateSheetsButton()`, `tidySheets()`, `foldAllSheets()`, `closeAllSheets()`, the `#sheetsWrap` markup, the `hud` dblclick handler, CSS.

**R4. One sheet per sub-part, kept on every piece.**
- **Problem:** D4. Each piece gets an identical copy [13].
- **Change:**
  - Key kept sheets by `part|sub`.
  - The kept state belongs to the sub-part, not the piece. Stepping to another piece shows the same sheets, and the sub-part is lit as kept on every piece that has it.
  - With one piece shown, a click on a kept sub-part closes its one sheet, whichever piece it was kept from. There is nothing to "keep again" on another piece.
  - The sheet header carries a badge (3.3): "Same on all 8" or "On 2 of 5" for repeated parts, and none for composite parts.
  - Move **On this piece** out of the sheets into the Pieces table (R5).
  - Delete `.screen.other`. `keepSheetsOnFocus()` keeps one job: clearing the preview on any change of piece (R7).
  - Pointing at a kept sub-part on any piece lights its sheet.
- **Done when:**
  - keep "Copper former" on coil 1, then press `.` four times to reach coil 5: there is one former sheet, and the former on coil 5 is lit as kept. A click on it there closes that sheet, which leaves 0;
  - keep 3 sub-parts on coil 1 and step through all 8 coils: there are always exactly 3 sheets, with none added and none dimmed;
  - search hits ("left viewport bolt") still open the right sheet and piece.
- **Effort:** M.
- **Touches:** `sheetKey`, `sameSheet`, `isPinned`, `refreshLit()`, `sheetScreen()`, `restoreSheets()`, `keepSheetsOnFocus()`, the search click handler in *Assembly tree*.

**R5. The Pieces table: how comparing works.**
- **Problem:** comparing pieces is impossible today (D5), and the data hides how little there is to compare. The 4 composite parts are different objects and must not be presented as copies.
- **Change:**
  - In `renderPart()`, for **repeated parts** (`count` > 1, 12 parts):
    - one row per piece, named by place, with columns for where it sits plus every `pieces` field, each with its tag;
    - the current row is highlighted, and a click on a row focuses that piece;
    - without per-piece data, show one line: "The sources give no difference between these N; they differ only by place."
  - For **composite parts** (`count` 1 with several pieces: hv, needle, gauge, spectro), there is no Pieces table and no such line. Made of groups its rows under each piece's name.
  - Remove the inspector's piece chips.
- **Done when:**
  - the TF coils show 8 rows and the no-difference line;
  - the viewports show 3 rows with "Used for … assumed";
  - *HV supply and leads* shows Made of grouped under HV supply, HV lead A and HV lead B, with no no-difference line;
  - a row click does the same as ‹ ›.
- **Effort:** M.
- **Touches:** `renderPart()` (R2), `subsList()`, `focusPiece()`; `parts.js` `pieces` (format unchanged) and `count` (read only).

**R6. One meaning per click and tap.**
- **Problem:** the click, the double-click and the undo overlap (2.4).
- **Change:**
  - With **All** shown, a click or a tap on a piece picks that piece. It keeps and previews nothing.
  - With one piece shown (or on a one-piece part), a click on a sub-part keeps its sheet. If the sub-part is already kept, from any piece, the click closes its sheet (R4). A tap previews (R8).
  - With a mouse, the pointer stopping on a sub-part previews it in both cases (R7).
  - Double-click does nothing in Inspect. Delete `HUD.undo` and the restore in the stage `dblclick` handler.
  - The hint (Q3) names the rule for the current case: "Click a piece to pick it" with All shown, "Click to keep" with one piece.
- **Done when:**
  - a double-click on a sub-part never flashes a sheet, and the string `HUD.undo` no longer exists;
  - on touch at 390×844 with the TF coils on All, a tap on coil 3 picks coil 3 and opens no sheet, and a second tap on its winding previews the winding in the dock.
- **Effort:** S.
- **Touches:** `endPointer()`, the stage `dblclick` handler, `setHint()`, `renderHelp()`.

**R7. One preview rule: open on a stop, stay until replaced or dismissed.**
- **Problem:** there are three timers (250, 150 and 1200 ms), plus a linger that the user has to race. The path from the part to the preview slot crosses empty canvas and kept sheets. Any rule that clears the preview when the pointer leaves the part can lose it on the way.
- **Change:**
  - A preview opens when the pointer **stops** on a sub-part (under 4 px of movement for 150 ms). A stop on another sub-part replaces it. Crossing sub-parts without stopping changes nothing.
  - Otherwise the preview **stays**. Moving or pausing over empty canvas, the column or a kept sheet never clears it.
  - It is dismissed only by:
    - × on the preview, or **Esc**;
    - a click or tap on an empty spot;
    - any change of piece or part: ‹ ›, a Pieces row, All, a link, Take apart, Done.
  - While it shows, its sub-part stays lit at the preview level.
  - This costs nothing, because the preview has its own slot (the preview slot, or the dock's card) that never covers the part.
  - On touch, the tap is the stop.
- **Done when:**
  - `setLive()` has one timeout, the 150 ms stop, reset by pointer movement, and no clear timer;
  - with the winding previewed, moving the pointer to the preview slot by any path keeps it showing. This includes straight, slow (10 px/s), or with a 2 s pause over empty canvas and then over a kept sheet;
  - the preview disappears only on another sub-part stop, Keep, ×, Esc, a click on an empty spot, or a change of piece or part;
  - after ‹ ›, no preview shows.
- **Effort:** S.
- **Touches:** `setLive()`, `setHover()`, the stage `pointermove` and click handlers, the `sheetScreen()` mouseleave, `keepSheetsOnFocus()`.

**R8. One small-view layout: the dock.**
- **Problem:** D6: kept sheets pile up over the part [57], [57h]. Each phone preview moves the camera (`centreAboveDock()`).
- **Change:**
  - Any view under 660 px uses the bottom dock, at most 42 % of the view's height. The camera frames the part above it, and the dock's height is reserved even when it is empty.
  - The dock header reads "Sheets n · ‹ card › · Close all". The cards are the part card when it is due (R2: the stacked layout), then the kept sheets. The header says "Part" or "kept k of n". Each sheet card has a × (and [Keep] while it is a preview).
  - A preview takes the card while it lasts. ‹ › step through the part card and the kept sheets, and they clear the preview.
  - With a mouse, the pointer stopping on a sub-part previews it in the dock, and a click keeps it. On touch, a tap previews (as today), and [Keep] keeps.
  - Delete the "beside the pointer" placement, the cascade and `centreAboveDock()`.
- **Done when:**
  - at 600×900 (a 580 px view) and 390×844, no sheet overlaps the part's screen box (`screenBoxOf()`), and `goal.target` does not move when a preview opens;
  - at 600×900, right after inspecting, the dock shows the part card;
  - at 600×900 with a mouse, keeping 3 sheets makes the dock show "kept 3 of 3". Then, moving the pointer from the part across two sub-parts to ‹ without stopping and clicking shows "kept 2 of 3", and no preview opens on the way;
  - on touch, one press of Close all closes 8 kept sheets.
- **Effort:** M.
- **Touches:** the `renderHud()` phone branch, `placeScreen()`, `centreAboveDock()`, the `frameIsolated()` insets, the `endPointer()` touch branch, the `.hud.phone` CSS.

**R9. Drag out, nothing else.**
- **Problem:** the drop-on-part camera rule [41] and its "Sheets flashes" fallback.
- **Change:** dragging a sheet or the preview out of the column floats it where it is dropped, and keeps it. Delete `largestFreeRect()`, `nudgeIntoGap()` and the flash.
- **Done when:** a drop anywhere leaves `goal.zoom` and `goal.target` unchanged.
- **Effort:** S.
- **Touches:** the `hud` pointerdown `up()` handler, *Organising the sheets*.

**R10. A short keyboard path and Esc ladder.**
- **Problem:** it takes 99 Tab presses from load to **Inspect on its own**, and 9 Esc presses to leave a part. Keyboard users cannot keep or fold sheets directly (2.4).
- **Change:**
  - A "Skip to the assembly" link is the first Tab stop.
  - The tree becomes one Tab stop, following the ARIA tree pattern with a roving `tabindex`: ↑ ↓ move between rows, → ← open and close groups, Enter selects, Space toggles the eye, and `I` inspects.
  - **Inspect on its own** is the first control in the Part tab, before the tab's content.
  - **Esc** goes preview → whole part (from one piece) → assembly. It never closes kept sheets.
  - **Enter** on a Made of row keeps or closes that sheet, without forcing Take apart. Focus moves to the sheet heading (`tabindex="-1"`), and × returns focus to the row.
  - Fold is a real `button`. Re-rendering keeps focus on the same control.
- **Done when**, keyboard only, from page load:
  1. Tab and Enter (the skip link), then ↓ presses, put focus on the TF coils row. Today that takes 34 Tabs.
  2. Enter selects the row and `I` inspects it. Today **Inspect on its own** is 65 Tabs further on.
  3. `.` steps to coil 1. The first "Made of" row is at most 12 Tabs away, and Enter on it keeps the winding sheet, with focus on its heading.
  4. At most three Esc presses return to the assembly, and `I` shows the kept sheet again.
- **Effort:** M.
- **Touches:** the tree markup and its key handler in *Assembly tree*, the `keydown` handler, `subsList()`, `showSubOf()`, `sheetScreen()`, `renderHud()`, the Esc row in `renderHelp()`.

**R11. Update the README to the new model.**
- **Problem:** the README is the spec, and Phase 2 changes the app.
- **Change:** rewrite *Information screens* along the lines of 3.1–3.5:
  - remove the six-open, ~7 and 160 px rules, the linger, the double-click undo and the component screens;
  - add the part card rule, the per-sub-part kept state and the preview that stays.
- **Done when:** every behaviour in the README matches a run at 1440, 1000, 900, 600 and 390 px.
- **Effort:** S.
- **Touches:** `README.md`.

### Phase 3: larger additions (the learner's path)

**L1. "How it attaches" for every link.**
- **Problem:** Connects to names parts but does not explain the joints (2.5). That is half of the stated purpose.
- **Change:**
  - Add `JOINS` to `parts.js`: one entry per undirected link (42), each a short sentence with its tag. For TF coil ↔ vessel quarters, for example: "wound on a copper former clamped round the elbow", tagged S4.
  - The Part tab shows "Vessel quarters: wound on a copper former clamped round the elbow S4", and the name still follows the link.
  - Unpublished joints are tagged `assumed`, like any other row.
- **Done when:** every `connects` pair has a sentence and a tag, and a script check confirms the 42 pairs and their symmetry.
- **Effort:** L (sourcing).
- **Touches:** `parts.js` (new `JOINS`), `renderPart()`.

**L2. An Overview that stays reachable, with how the machine runs.**
- **Problem:** the overview disappears on the first click, and nothing explains how the machine is operated.
- **Change:**
  - Make **Machine** the first inspector tab.
  - Under the existing paragraph, add four steps, each linking to its parts:
    1. Pump down: pump, port, gauge.
    2. Let in a little gas: gas inlet.
    3. Energise the coils: TF, PF, solenoid.
    4. Strike the glow with HV: electrodes, HV supply, plasma.
- **Done when:** the overview can be reached in one click from any state, and each step's links select or inspect the parts.
- **Effort:** M.
- **Touches:** the *Inspector* tabs, `renderOverview()`, `parts.js` (new `RUN` steps, with sources).

**L3. A guided tour.**
- **Problem:** there is no path, only free exploration.
- **Change:**
  - Add `TOUR` to `parts.js`: about 8 stops in operating order, each a part id and one sentence on why that part matters at this point.
  - "Take the tour" on the Machine tab inspects stop 1.
  - The inspect bar shows "Stop 3 of 8 · Next ›".
  - The sentence sits above What it does.
- **Done when:** from load, the tour reaches the plasma in ≤ 9 clicks, and leaving the tour is one click (Done).
- **Effort:** M.
- **Touches:** `parts.js` (`TOUR`), `updateIsoBar()`, `renderPart()`.

**L4. A glossary.**
- **Problem:** undefined jargon (2.5).
- **Change:**
  - Add `GLOSSARY` to `parts.js` with about 20 terms: torus, toroidal and poloidal, TF, PF, solenoid, ConFlat/CF, DN, knife edge, KF, OFHC, eV, glow discharge, cathode and anode, Langmuir probe, Pirani/Convectron, mbar, UHV, bake-out.
  - The first use of a term on a screen gets a dotted underline. It expands to the definition on click or focus, not on hover only.
- **Done when:** every term on that list is defined at its first use in each Part tab and sheet.
- **Effort:** M.
- **Touches:** `parts.js` (`GLOSSARY`), `renderPart()`, `sheetScreen()`.

**L5. Fill in the per-piece data where the sources allow it.**
- **Problem:** 9 of the 12 repeated parts have no `pieces` entry, so their Pieces table can only list places.
- **Change:** add `pieces` rows wherever something is known: which electrode is A or B, the upper and lower PF and satellite coils, or which quarter carries which port. Where nothing is known, keep the "no difference" line.
- **Done when:** every repeated part either has `pieces` or shows the no-difference line, and none of the 4 composite parts shows that line.
- **Effort:** M (data).
- **Touches:** `parts.js` `pieces`.

---

## 5. Open questions for you

1. **Floating sheets at all?** With a scrolling column, dragging a sheet out is the last free-placement rule. Keep it, as planned in R9, or drop it?
2. **The part card when you fold the inspector** (R2). The plan shows the part's facts at the top of the sheet column. The alternative has one rule fewer and shows nothing, since the folded inspector's rail is one click away. In the stacked layout the card is needed either way, because there the Part tab is below the view (D7).
3. **The dock at a 1000 px window** (R1). With the inspector open, the view is 606 px, under the 660 px a column needs, so sheets use the dock. A 300 px minimum for the model would allow the column there, with about 306 px left for the model. Is 360 px the right floor?
4. **The accent shift** to `#0a736e` darkens the teal. Is it acceptable, or should the accent stay for large text and be darkened only for small text? The same question applies to the darker photo amber `#9a6a0f`.
5. **Tour and run steps** (L2, L3). Which stops, in what order, suit the TU/e course? Should the tour start on the assembly or on the plasma?
6. **TF coil naming direction** (Q12): clockwise from the pump port, or by quarter and first or second?
7. **Folding the tree on inspect** (R1) also happens at 1440 px, where it widens the view from 778 to about 1006 px. Is that welcome, or should it fold only when the view would otherwise be under 660 px?
8. **S3** (Q13). Cite rideosystems.biz next to S2 on the headline rows it confirms, or keep it in the list as labelled background?

## 6. Rejected ideas

| Idea | Why not |
|---|---|
| Move all sheets into the inspector panel and drop the in-view screens | It loses the sheet beside the part, and the hover link in both directions. At 960 px and under, the inspector sits below the model. |
| Keep the component screens on the left of the view | A second 300 px reservation needs a view of at least 960 px (300 + 360 + 300). A 1000 px window does not reach that even with both panels folded (892 px). Where the screens do fit, they duplicate the inspector [15]. |
| A side-by-side compare view of two sheets | For 9 of the 12 repeated parts the sheets are identical across pieces, and the 4 composite parts have nothing to compare. The only differences are the `pieces` rows, which a table shows at a glance (R5). |
| Keep auto-folding, with a better rule | Any automatic fold is a hidden rule. A scrolling list is visible and predictable. |
| Keep a cap and auto-close | It loses kept work silently (sheets 10–16 in the run). Once the column scrolls, nothing needs a cap. |
| A preview that clears when the pointer leaves (today's 1200 ms linger, or a clear on any stop over empty canvas) | The path to the preview slot crosses empty canvas and kept sheets, so any clear-on-leave rule makes the user race it. The preview has its own slot, which never covers the part, so leaving it up costs nothing. ×, Esc, a click on an empty spot and a change of piece clear it. |
| A click on a sub-part kept from another piece re-opens the sheet instead of closing it | That gives one gesture two meanings, depending on which piece the sheet was kept from. With the kept state per sub-part (R4), "lit as kept, so a click closes" holds on every piece. |
| Tap keeps on touch | A phone user could not read a sheet without keeping it. A tap previews, as today, and [Keep] keeps. |
| Hatched highlights | In this drawing, stripes already mean a cut face (Q11). |
| Leader lines from sheets to sub-parts | The README rejects arrows that move as you turn. Hover lighting is enough. |
| Collapse the empty column to win back width | The camera would jump when the first preview opens, which is the problem the reserved column solves. |
| Drop the hologram's scan lines for legibility | Muted text on hologram screens, scan included, measured at least 4.70:1 in every layout. The scan is 7 % alpha and stops under reduced motion. The real costs were the dimming and the glass alpha (Q4, R4). |
| An undo stack for sheets | With nothing closing by itself, the only destructive actions are the user's × and Close all. An undo stack would be a new moving part. |
| Simplify the provenance to basis dots only | Out of bounds: the tags are the point. The plan changes only how they are presented (Q4, Q6, Q7, Q13). |
| A framework or build step for the restructure | Out of bounds, and not needed: every change above is plain DOM and CSS in `index.html`. |
