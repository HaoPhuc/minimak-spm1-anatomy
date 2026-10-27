# Round 1: Prof. Janssen (lecturer, TU/e SPM1 lab course)

## 1. Who I am
I project this on a 1920×1080 (or 1280×720) beamer for 120 first-years, then set assignments they must answer alone.

## 2. What I tried
Screenshots are in `p6-lecturer/shots/`; the logs are `run1-log.txt` and `run2-log.txt`.

1. **"Find the gasket between the right and back quarters: size and source."** Searching *right back gasket* gives one row, and one click opens the sheet: 171.3 / 152.5 / 2.0 mm, S9, "Same on all 4" (A2, A3). Excellent. My own wording, *gasket between right and back*, gives an empty list with no message (T2).
2. **Where the gauge attaches and how it comes off.** *Zoom to it* went from 1.00× to only 1.13× (G1). Inspect lifts the gauge away, and its stack fades into the same ghost as everything else (G2). Take apart gives five unlabelled sub-parts, with the stack's mating adaptor out of frame (G3, P1). The flight home does show where it goes (G4).
3. **Pointing at a small part.** Hovering a TF terminal block shows a 12 px tooltip reading "Toroidal field coils" (T1). A pickAt scan of the home view finds 0 px of gasket (run1-log); terminal blocks and the KF16 clamp cover about 300 px².
4. **1280×720.** The layout holds, and the tour bar wraps cleanly (S1–S3). The hint box covers "20 cm" (S1).
5. **Panels folded (F).** The view is 1860 px wide, but the exploded gauge stays at 2.76× and fills about 300×550 px (P1 vs G3).

## 3. Findings
1. **P1: Nothing can be linked or bookmarked.** `index.html` never touches `location`, the hash or the history. `store` keeps only theme, panel widths, screens and drag (l. 650, 1927–47, 2004, 2038, 3260, 3297). I cannot put "open this" in Canvas or on a slide, or check that 120 students found the same thing.
2. **P1 in a hall: text is laptop-sized.** Sheets are 12.5 px (l. 223, 264), the tooltip and hints 12 px (l. 194, 181), the tree 13 px. A 24 pt slide minimum is about 48 px at 1920 wide, four times that. Browser zoom stops near 175%, because at 200% (960 CSS px) the stacked phone layout takes over (l. 405, 2013).
3. **P2: The model names nothing below part level.** Hover names the parent part (T1), and exploded sub-parts float unlabelled (G3, P1).
4. **P2: "Where it attaches" is told, not shown.** The partner is just more ghost (G2, S3), and the gasket sits in grey fog (A3, S2). Nothing marks which quarter is *Right* or *Back*, though the piece names depend on it.
5. **P2: Search fails silently on natural wording.** Every word must match (l. 2763ff), so "between" or "quarters" empties the list (T2).
6. **P2: *Zoom to it* frames the whole part box** (`zoomToPart`, l. 2583). For the gauge that includes its cable to the table, hence 1.13× (G1).
7. **P3: Folding the panels doesn't enlarge the part** (P1): the room is wasted just when I project.
8. **P3: The tour is watch-only.** It is eight presses of **Next** (`parts.js` l. 564–573), with no question at any stop, and it skips the gaskets, bolts and clamps my assignments use. Credit: lift-out and fly-home teach placement; the 3–4 s glides earn their time.

## 4. Proposals (ranked)
1. **Deep links.** Store part, piece, apart, kept sheets, view and theme in `location.hash` (`replaceState`), add **Copy link** to the inspect bar, and restore on load. **M.** *Check:* `#part=gaskets&piece=right-back&sheet=…` in a fresh profile reproduces A3, and all 30 parts round-trip.
2. **Presenter mode.** One `--ui-scale` for text (1.75–2×), thicker ink, the inspected part framed to the full view when panels fold, and no hologram motion. **M.** *Check:* sheet digits are at least 28 px at 1920, readable in a 640×360 downscale, with three columns kept.
3. **Partner and compass.** While inspecting, light the joined parts (`JOINS`) above ghost level and keep them in frame. Label the quarters (Front, Right, Back, Left) on the ghost or the table. **M.** *Check:* the gauge inspect shows the stack's KF16 adaptor distinct and in frame, and the right–back gasket shows "Right" and "Back".
4. **Calm callouts.** Add tracking leader-line labels on taken-apart sub-parts. Hover should name the sub-part and piece ("Terminal block · Front quarter, right-side coil"). **M–L.** *Check:* G3 shows five readable labels without hover, with no overlap at 1280×720.
5. **Do, not watch.** (a) Search should ignore stop words and rank partial matches (**S**). (b) Add "Where does it go?": the student clicks the place of a lifted part, checked against `connects` (**M**). *Check:* my wording finds the right–back gasket first, and a five-question round scores.

## 5. On the Tony Stark direction
Borrow these:
- labels that track the part;
- an "enhance" that frames one sub-part to fill the screen;
- the existing pull-out, with the partner kept in view;
- a calm HUD with few, large words.

For 120 people, a small part must be *big and named*.

Avoid these:
- the hologram as a lecture theme: a lit hall turns projector black grey, and the scan lines and 7 s sweep pull eyes off my pointer;
- gesture-only controls, since I use a mouse and a clicker;
- longer glides;
- sheets scattered over the model.

If it doesn’t make a bolt bigger or name it, it is a gimmick.
