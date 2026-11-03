# Plan 3: Guided analysis

A walkthrough of the viewer that a first-time visitor starts from one button. It teaches them to answer three
questions with the page's own controls: *Where is this part?*, *How does it attach?* and *Where did that dimension
come from?* **Take the tour**, the eight stops of a run, and **Where does it go?**, the placement quiz, stay as they
are.

## Decisions

- **Launcher.** A **Guided analysis** button opens the modebar. The modebar is the one bar that stays on screen with
  both side panels folded, and on a phone it is the row above the view. Below 1320 px of window it is labelled
  *Guide*. On a phone the label stays, as the only modebar label. The Machine tab offers it too, beside **Take the
  tour** and **Where does it go?**.
- **The card.** One card holds the step:
  - the chapter, *Step n of N* and a progress bar
  - one question, in bold
  - the real control to use, by its name on the page, with its key and its touch gesture
  - **Look for**, which turns to a tick with *That's it* once the page is in that state
  - **‹ Back**, **Show this step**, **Next ›** (**Finish** on the last step), **Chapters** and a separate **Exit**

  On a desktop the card sits at the view's lower left, above the scale bar, and the camera frames everything above it
  (it is a bottom inset in `hudInsets`). Where the panels stack (≤ 960 px) it is fixed at the window's foot, under the
  view, so the bottom sheet and the inspect bar keep the view. Its text sizes with the Controls tab's text size, like
  the inspect bar.
- **Pointing.** A ring marks the real control. It never takes a click, so every control still works. When the control
  is hidden, the ring shows how to reach it, and the card says so. A control under **⋯** rings **⋯**. One in a folded
  panel rings the rail. One in the folded bottom sheet rings its head. A part in the model is lit with the viewer's own
  highlight (`state.rowPiece`, the light a Pieces row gives) and ringed by its screen rect. The leader line from a sheet
  to its bolt is the viewer's own.
- **Registry.** `GUIDE_STEPS` lists each step: `ch`, `id`, `q` (the question), `how` (the control), `look` (what
  shows when it works), `need()` (the state the step needs, set up with the same functions as manual use: `inspect`,
  `setApart`, `setStep`, `showMe`, `keepSheet`, `setJoint`, `setExplode`, `setCut`, `lookFrom`, `frameIsolated`),
  `act()` (*Show this step*, the same call or a click on the real button), `done(base)` (the expected state; `base` is
  taken when the step opens) and `target()`. No second renderer, camera or loop: a `guideTick()` called from
  `frame()` moves the ring and checks `done`.
- **Motion.** It uses the viewer's own glides: inspect 1.2 s, take apart 0.8 s, a piece 0.9 s, Show me 0.8 s, a view
  button's ease. A new step's text fades out, waits for the camera and parts to settle (the overlay's own clock,
  `ov.at`, at most 2.5 s), then fades in over 180 ms with its ring. A drag or pinch takes over at once, as it always
  has. Under reduced motion the viewer already cuts, and the card does not fade.
- **Its own state.** `guide = { on, i, seq, saved, base, … }`. Every `need` and `act` checks a token (`seq`) after
  each wait, so fast Back or Next, a replay, or Exit mid-glide leaves no stale callback.
- **What it leaves behind: nothing.**
  - While the guide is on, `writeLink` writes no address and `store.set` saves nothing, so it leaves no history
    entries and no saved preferences.
  - On **Exit** or **Finish** it puts back what it found:
    - the address, the camera and the camera **Done** would return to
    - the part, piece, apart, joint, step and Show me
    - the kept sheets of every part, with their folds and places
    - hidden parts, Explode, Spread, Cutaway, Ghost and Sheets
    - the panels and their widths, the theme and the Blueprint dimensions
    - text size, single-letter keys, drag mode, the tab, the search box, the scroll and focus
  - **Copy link** copies only on the visitor's click. In the guide it copies the link of what is shown without
    writing it to the address.
  - Browser **Back** during the guide first puts everything back, then goes back as usual.
- **Handing off.** **Take the tour** and **Where does it go?** first end the guide (everything put back), then start.
  So two modes never share input. Opening the guide during the quiz ends the quiz, so the state saved is the one the
  quiz returns to. A tour stop being inspected is saved, and put back with its place on the tour. Reopening the guide
  offers **Resume** at the step it left.

## Coverage

One row per function. *Inputs* are mouse · keys · touch. *Step* is the guide step that teaches it; the steps are
listed after the table.

| # | Function | Question | Inputs | Needs | Visible result | Step | Verify |
|---|---|---|---|---|---|---|---|
| 1 | Turn | How does the back look? | drag · arrows on the view · one finger | — | spins about z, tilts | orient.turn | `goal.az` moves ≥ 25° |
| 2 | Pan | Can I slide it aside? | right-, Shift- or middle-drag, or pan mode (O/P) · Shift+arrows · two fingers | — | the machine slides | orient.pan | `goal.target` moves |
| 3 | Zoom | Closer on the coils? | wheel, ± buttons · + − · pinch | — | grows about the pointer; scale bar changes | orient.zoom | `goal.zoom` × 1.3 |
| 4 | Scale | How big is it? | scale bar; Blueprint title block 1:N | — | true length label | orient.scale | read only |
| 5 | Home | I'm lost | home button, double-click space · 0 · home button | — | whole machine (the part while inspecting) | orient.home | `goal` ≈ home |
| 6 | Look from a side | What is it from above? | Views menu, triad ends · 1–4, menu arrows · same | — | turns to the side | orient.views | `goal.el` > 80 |
| 7 | Fit | Everything in view? | — · A · — | exploded or panned | frames what is shown | inside.spread | `fitAll` ran |
| 8 | Panels | More room? | panels button, ‹ fold, rail, drag or double-click the edge · F, arrows on the edge · (stacked: scroll) | desktop | panels fold to rails | orient.panels | `panels.tree`/`insp` false |
| 9 | Hover name | What is that? | pointer · — · loupe | — | tooltip and light | first.find | look text |
| 10 | Search | Which parts use M8? | search box · / · same | list shown | list narrows to hits | find.search | value `M8`, hits |
| 11 | Search hit | Just the left viewport's bolts? | click hit · Enter · tap | hits | inspects that piece, keeps its sheet | find.pick | piece + pinned |
| 12 | Select vs inspect | What's the difference? | click vs double-click · Enter vs I · tap vs double-tap | assembly | teal layer vs isolated | find.select | `state.select`, no `iso.part` |
| 13 | Zoom to it | Look without lifting it out | Part tab button | selected | frames the part | find.select | look text |
| 14 | Hide, show | See past the table | eye, Hide · H, Space · eye | — | part or group goes | find.hide, find.show | `hidden` |
| 15 | Listed, not drawn | Is the turbopump in it? | caret at the list's foot | list | upgrades, with tags | find.notdrawn | caret expanded |
| 16 | List keys | No mouse? | Skip link, ↑ ↓ → ← Enter Space I | list | — | find.select | how text |
| 17 | Cutaway | Where is the glow? | switch · C | assembled | lid on or off; greyed while exploded | inside.cut | `state.cut` toggled |
| 18 | Explode | How does it come apart? | switch · E | — | every part off | inside.explode | `state.explode` |
| 19 | Spread | Further apart? | slider · [ ] | exploded | spacing | inside.spread | `state.spread` ≠ start |
| 20 | Reassemble | Back together? | switch · E | exploded | all home | inside.together | not exploded |
| 21 | Themes | Another drawing? | theme buttons · ← → in the group | — | redrawn | inside.themes | theme ≠ start |
| 22 | Dimensions | How tall is the table? | drag a line or figure, double-click | Blueprint, desktop, machine at rest | 910, 900, Ø460 move | inside.dims | `draft.dims` moved |
| 23 | Inspect | Where is the left viewport? | double-click, Inspect on its own · I · double-tap | — | isolated, lifted, mount half solid | first.find | `iso.part`, piece |
| 24 | Pieces, All | Which coil? | ‹ › All, click, Pieces row · , . · tap | repeated part | one piece, n of N | connect.pieces | `iso.focus` |
| 25 | Ghost | Hide the rest? | switch · G | inspecting | ghost goes | connect.ghost | `iso.context` toggled |
| 26 | How it attaches | What is it wound on? | link in the Part tab or card | inspecting | neighbour inspected | connect.attach | `iso.part` = vessel |
| 27 | Back | Back to the coil | ← name · Backspace | came by a link | part before | connect.back | `iso.part` = tf |
| 28 | Take apart | How does it come off? | switch · T · ⋯ | part comes apart | sub-parts off | first.apart, connect.apart | `iso.apart` |
| 29 | Its Spread | Further? | slider · [ ] | apart | spacing | connect.apart | `apartSpread` ≠ start |
| 30 | Steps, star order | What comes off first? | ‹ Step › · — · same | apart | caption, star numbers, holes | first.steps, connect.steps | `iso.step` |
| 31 | One bolt | Which bolt is this? | rest on a bolt · loupe | step of a ring | *Bolt 7 of 16 · star 3* | connect.steps | look text |
| 32 | Open this joint | How does a vessel joint open? | switch · J | gasket or joint flange | four steps, gasket last | connect.joint | `iso.joint` |
| 33 | Turn to see | Parts hide each other? | button · ⋯ | axis within 20° (35° joint) | view turns across | connect.turn | not offered after |
| 34 | Made of, callouts | What is it made of? | rows, callouts | inspecting | numbers match | evidence.callouts | read only |
| 35 | Preview | A quick look? | rest the pointer · tap · callout | one piece | dashed sheet | evidence.preview | `state.live` |
| 36 | Keep, compare | Two side by side? | click, Keep, row · Space · Keep | one piece | sheets stack, leader line | first.sheet, evidence.compare | 2 pinned |
| 37 | Fold, close | Too many sheets? | chevron, Fold all, ×, Close all | kept | bars only | evidence.fold | folded |
| 38 | Float, Tidy | Put one aside? | drag the bar · L, Tidy | column | floats, returns | evidence.float, evidence.tidy | `HUD.pos` |
| 39 | Bottom sheet | Read on a phone? | — · Esc · tap or drag the head, ⌃ | view < 660 px | 30 % ↔ 72 % | evidence.float | `HUD.up` |
| 40 | Show me | How long is a bolt? | frame button, double-click · Z, Enter on a row · frame button | inspecting | close-up, crumbs, M8 × 50 drawn | first.showme, evidence.crumb | `iso.show` |
| 41 | Citation | Where is it from? | tag · Enter · tap | a sheet or Part tab | Sources tab, ← back | first.source, first.back, evidence.cite | tab |
| 42 | Basis vs tags | How far to trust it? | chip, dots, tags | Part tab | photo vs S10 | evidence.basis | read only |
| 43 | Glossary | What is a knife edge? | dotted word · Tab, Enter · tap | — | definition opens | evidence.term | `aria-expanded` |
| 44 | Copy link | Send this view | link icon · — · ⋯ | inspecting | copied | use.link | click seen |
| 45 | Browser Back | Undo a jump? | browser Back | — | part before | use.history | read only |
| 46 | How a run goes | In what order is it used? | Machine tab, part chips | — | selects a part | use.run | tab |
| 47 | Tour | The machine's role, stop by stop | Take the tour | — | guide ends, tour starts | use.tour | `iso.tour` = 0 |
| 48 | Quiz | Can I place parts? | Where does it go? | — | guide ends, quiz starts | use.quiz | `quiz.on` |
| 49 | Settings | Bigger text? | Controls tab: text size, single-letter keys | — | scales; letters off | use.settings | `uiScale`/`letterKeys` |
| 50 | Loupe, near picks | Small parts on a phone? | hold a finger · — · (a mouse picks within 12 px) | touch | 3× loupe, name | use.loupe | loupe shown |
| 51 | Controls reference | Every binding? | Controls tab | — | the list | use.controls | tab |
| 52 | The guide itself | Again later? | Guided analysis, Chapters, Exit | — | resumes, jumps, restores | use.finish | state back |

## Steps

Seven chapters, each replayable from **Chapters**. **Next** runs through all of them.

1. **A viewport, bolt by bolt**, the first sequence:
   1. The whole SPM1, three-quarter. The left viewport is lit and ringed: inspect it.
   2. **Take apart**: the bolts and nuts leave the flange along the port's axis.
   3. **Step 2 of 4 · 16 bolts**: the bolt ring and the flange's empty holes both show.
   4. *How long is one of these bolts?* **Show me** on the bolt row: M8 × 50 mm under the head.
   5. Keep the bolts' sheet: the leader line runs from the sheet to the bolt.
   6. The **S9** tag on *Holes they pass*: the Sources tab.
   7. **← Back to the part tab**: the same piece and sheet.
   8. **Done**: the viewport goes back together and flies home, and the machine faces you again.
2. **Orient the view**: turn, pan, zoom, scale, a side, home, panels.
3. **Find hardware**: search M8, pick the left viewport's bolts, select vs inspect, hide the table, show it, listed not
   drawn.
4. **See inside**: Cutaway, Explode, Spread, back together, themes, Blueprint dimensions.
5. **Inspect a connection**: TF pieces and All, Ghost, How it attaches to the vessel, back, take the viewport apart
   with its Spread, steps and one bolt, open the right–back joint, Turn to see.
6. **Read the evidence**: callouts, preview, keep two, fold and close, float (or the bottom sheet), Tidy, the
   breadcrumb, a gasket's S6, basis vs tags, a glossary word.
7. **Use the result**: Copy link, Back, how a run goes, the tour, the quiz, settings, the loupe, the Controls tab,
   finish.

## Verification

[`review-panel/guide-check/`](review-panel/guide-check/README.md) holds the checks, as scenarios for
`review-panel/shot.mjs` (headless Chrome over CDP):

- Every step at 1280 × 800 and on a 390 × 844 touch phone, with **Show this step**. Each checked step goes from not
  done to done, and its ring finds the control or the way in.
- Exit and Finish from `#part=gaskets&piece=right-back&sheets=ofhc-copper-gasket`, with the sheet folded and the table
  hidden:
  - after rapid Next and Back during glides, and an Exit mid-glide
  - checked: the address, history length, localStorage, the camera, part and piece, kept and folded sheets, hidden
    parts, panels, theme, dimensions and settings
- The tour's and the quiz's handoffs, and the standalone controls afterwards.
- Keyboard only: Tab, Enter and Esc.
- `prefers-reduced-motion: reduce`.
- On the phone: the card under the view, **⋯**, and the bottom sheet.
- The first sequence was captured step by step at 1280 × 800 and looked at, before and after each action.
