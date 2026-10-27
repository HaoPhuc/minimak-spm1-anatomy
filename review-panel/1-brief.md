# Review panel brief: SPM1 Anatomy

You are one of eight critics on a review panel. Each critic has a persona. The panel's job is to criticise the UI/UX
of a web app, argue about what matters, and end with a development plan. You are a critic, not a developer: **do not
edit any file in the repository.** Write only inside your own folder (given in your prompt).

## The product

An interactive 3D anatomy of the **MinimaK SPM1**, a tabletop "simple magnetised torus" (a small fusion-style plasma
device) by Rideo Systems. It is used by first-year physics students (TU/e) to learn the machine's structure.

- Code: `D:\Projects\minimak-spm1-anatomy\.claude\worktrees\black-white-display-mode-fffbac\` — `index.html` (renderer,
  inspect mode, panels), `device.js` (geometry in cm), `parts.js` (all text: parts, joins, sheets, tour, glossary).
- Read `README.md` there first: it describes every feature (assembly tree, inspector tabs, modebar, Explode, Inspect,
  Take apart, pieces, sheets, the tour, explained words, the three themes Colour / Greyscale / Hologram, keys).
- `parts-pieces-subs.json` in this folder lists every part id, its pieces (named by where they sit) and its sub-parts.

## The owner's goals (judge everything against these)

1. **The goal of the product is to inspect each component of the device.** A user must be able to look into the
   details of each component effectively: its shape, its sub-parts, its numbers and where they come from.
2. **The user must know where each component goes**: where it sits on the machine, what it attaches to, how it comes
   off and goes back.
3. **The owner's personal priority: inspecting small components**, with inspiration from **Tony Stark** (the Iron
   Man films' holographic workshop: pulling a part out of the assembly with a gesture, turning it in the hand,
   expanding it into its pieces in mid-air, "enhance"-style zoom into tiny parts, labels and callouts that track the
   part, a calm HUD). Small components here are bolts, nuts, gaskets, knife edges, feedthroughs, electrodes, the
   gauge, valves, KF clamps, terminal blocks, LEDs, tabs on the coil formers, and so on.

## Shared evidence

`common\` in this folder has screenshots of the current app at 1440×900 unless noted (cNN numbers):
c01–c03 home in Colour / Greyscale / Hologram · c04 a part selected · c05 inspecting the 4 lateral ports ·
c06a–c one TF coil, taken apart, two sheets kept · c07a–b a joint flange taken apart (bolts, nuts) · c08a–b the
vacuum gauge inspected and taken apart (hologram) · c09 Explode · c10 the tour, stop 3 · c11 1000 px with a sheet ·
c12 / c12b phone 390 px, home and inspecting · c13 zoomed ×6 on the gauge and gas stack.

## Driving the app yourself

`node "D:\Projects\minimak-spm1-anatomy\.claude\worktrees\black-white-display-mode-fffbac\.arena\panel-20261026\shot.mjs" "D:\Projects\minimak-spm1-anatomy\.claude\worktrees\black-white-display-mode-fffbac" <your-scenarios.json> <your-out-folder>`

Read the header of `shot.mjs` for the scenario format: viewport, theme, phone emulation, and steps (`js`, `wait`,
`keys`, `move`, `click`, `dblclick`, `wheel`, `drag`, `tap`, `shot` with optional `clip`/`scale` for close-ups). Real
mouse moves are needed for hover previews (rest the pointer 150 ms on a sub-part while inspecting).

The page exposes `window.__spm1` for driving and measuring:
`select(id)`, `inspect(id, piece?)`, `endInspect()`, `setApart(bool)`, `focusPiece(piece)`, `stepPiece(±1)`,
`piecesOf.get(id)` (array of pieces; `piece.userData.label`), `keepSheet(part, sub, piece?)`, `setScreens(bool)`,
`setExplode(bool)`, `setCut(bool)`, `lookFrom(az, el, {zoom, target})`, `boxOfPart(id)` (a THREE.Box3:
`b.getCenter(b.min.clone())` gives a target), `fitAll()`, `resetView()`, `startTour()`, `nextStop()`,
`setTab('machine'|'part'|'sources'|'controls')`, `togglePanels()`, `pickAt(x, y)` → `{part, sub, piece}` under a
viewport point (use it to find where a small part is on screen before you click or hover it).

Rules for the harness: it starts its own headless Chrome on the GPU; seven other critics share the machine, so keep
to **at most 3 runs and about 15 screenshots**, and give each run a timeout of a few minutes. Look at screenshots
with the Read tool. Put scenario files and screenshots in your own folder.

## Round 1 output

Write `critique.md` in your folder, **under 900 words**, in this shape:

1. **Who I am** (one line, in character).
2. **What I tried**: 3–5 tasks that matter to your persona and to the owner's goals (for example: find the bolts of
   one joint and read their size; find where the gauge attaches; inspect the smallest part you can find).
   Say what happened, with screenshot paths.
3. **Findings**: at most 8, each tagged **P1** (blocks the goal) / **P2** / **P3**, each with evidence (screenshot
   path, or the function / line in `index.html`), and why it matters to you.
4. **Proposals**: at most 5, ranked. Each: what to build or change, why, effort (**S** ≤ ½ day, **M** 1–3 days, **L**
   more), and a check that would show it works.
5. **On the Tony Stark direction for small components**: what to borrow, what to avoid, from your persona's view.

Be concrete and in character, but honest: say so when something works well. Do not invent features the app does
not have; check before you claim.
