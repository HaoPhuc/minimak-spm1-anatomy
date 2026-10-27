# Round 1: Amara, accessibility (WCAG 2.2 AA)

## 1. Who I am
Amara, WCAG 2.2 AA auditor: keyboard only, screen-reader output, 200% zoom, tremor, colour-blind checks.

## 2. What I tried
Logs: `p5-a11y/run1-log.txt`, `run2-log.txt`. Shots: `p5-a11y/shots/`.

1. **A joint's nuts, keyboard only (1440).** Skip link, then Enter ↓↓ Enter `I` `.` `T`. Focus went to the part name; the status announced the piece. The first sub-part row is 12 Tabs away. `+` ×6 enlarged the nuts well (`a3-kbd-zoom-x3.png`).
2. **A sheet for a small part at 200% (720×450, dpr 2).** From the tree I inspected the gauge; the view scrolled into sight. Enter on *Sensor tube nut* kept its sheet, moved focus to its heading and announced "Kept: Sensor tube nut. 1 sheet." No horizontal scroll. The nut itself cannot be seen in the model (`z2-200pc-inspect-gauge.png`, `z3-200pc-kept-sheet.png`).
3. **Tremor on the gas stack's bolts.** Bolt heads are 22–34 px. A ±5 px jitter never opened a preview. A 7 px wobble while pressing turned the model and kept nothing. A click 16 px off kept the wrong sheet, the four-way cross (`t1-tremor-after-miss.png`).
4. **Which part is kept?** I kept "20 nuts" in Colour (`k1-kept-nuts-colour.png`) and in Greyscale (`k2-kept-nuts-greyscale.png`).

**Works well:** the skip link, the ARIA tree, focus moving into a new sheet, `aria-pressed` rows, reduced motion everywhere, and basis dots and tags that do not rely on colour.

## 3. Findings
1. **P1: in Colour, a kept or hovered small part is close to invisible.** It only fades toward the paper colour and gets a teal rim at grazing angles (`FRAG`, index.html 813–822). The rim against steel is about 2.3:1, below the 3:1 of 1.4.11. Hover (0.45) and kept (0.42) differ only in strength (`refreshLit`). In k1 the kept nuts look unkept; in k2 they are plainly amber. Low-vision and colour-blind users lose the sheet-to-part link exactly on small parts.
2. **P2: keyboard focus lights nothing.** *Made of* rows, Pieces rows and link chips light their part only on `mouseenter` (lines 2992, 3059, 2961). With focus on a row, `hoverSub` stays null.
3. **P2: a sub-part cannot be framed.** By design the camera never moves for sheets, and keyboard zoom goes toward the view centre. At 200% the "All 3" frame leaves the gauge about 35 px tall, partly under the inspect bar (z2).
4. **P2: hard to use with a tremor.** A click counts only under 5 px of movement (`endPointer`), and a preview needs the pointer held within 4 px for 150 ms. The triad's targets are 8×8 px. Turning the model needs a drag; the only alternative is four fixed views (2.5.7, 2.5.8).
5. **P2: some state changes are silent.** Take apart, Explode, Context, Screens and Hide announce nothing. A tree row's name does not change when it is hidden. After leaving Inspect the live region still reads "Inspecting…" (4.1.3).
6. **P2: single-key shortcuts are global and cannot be turned off** (line 3558; 2.1.4). One stray `h` hid the flanges and left Inspect, with no announcement.
7. **P2: a source tag drops focus.** Enter on **S1** opens Sources and focus falls to `<body>` (`showSource`; `refButton` has no `data-fk`). Checking where a number comes from (goal 1) loses the user's place.
8. **P3: smaller issues.**
   - The 3D view's focus ring is clipped by `.view{overflow:hidden}` (`a2-stage-focus-ring.png`).
   - The view's `aria-label` and the hint describe only mouse gestures.
   - The idle spin turned 27° while I tabbed, with no pause (2.2.2).

## 4. Proposals (ranked)
1. **Make the lit states visible (S–M).** In Colour, use a solid fill as Greyscale does, with a different cue for each state: kept = fill, preview = dashed outline, hover = outline. *Check:* the kept nuts reach at least 3:1 against unkept ones.
2. **Treat focus like hover, and add Show me (M).** Focus on a row or chip lights its part. A **Show me** button and key on each sheet frames the sub-part (enhance) and draws a leader line to it. *Check:* focus sets `hoverSub`; at 720×450 the sensor nut becomes at least 120 px.
3. **Announce every state change (S).** Add Take apart, Explode, Context, Screens, hide/show, leaving Inspect and tour stops; add ", hidden" to tree rows. *Check:* `#status` after T, E, G, S, Esc.
4. **Tolerate a tremor (M).** Raise the click slop to about 10 px and the preview radius to 8 px. Prefer the smallest sub-part within 12 px of a click. Add ±15° turn buttons, and give the triad 24 px targets. *Check:* rerun my run 2; the bolt is kept both times.
5. **Keyboard safety (S).** Add a toggle to turn single-key shortcuts off. `showSource` should move focus to the source and offer "← back". Draw the view's focus ring inside its edge. *Check:* after Enter on S1, focus is on the S1 entry.

## 5. On the Tony Stark direction
**Borrow:**
- leader-line callouts that follow the part, which are the missing link for users who magnify
- "enhance" as a discrete step on a button and a key
- the calm HUD

**Avoid:**
- gesture-only interactions (air-grab, drag to pull out, flick to spin)
- reveals that open on dwell or hover alone
- labels that drift as the view turns, which are unreadable at 200%
- sweeps that ignore reduced motion
- dim blue-on-navy text
- amber as the only marker of a state.
