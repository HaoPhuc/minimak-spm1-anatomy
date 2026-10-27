# Round 1: Daniel (interaction design, HCI)

## 1. Who I am
I count clicks, modes and "what does a click do now?" moments. Spectacle must remove effort.

## 2. What I tried (1440×900, shots in `p4-hci/shots/`)
1. **Bolts of one joint, and their thread.** Search "joint bolt", then one click on a hit: the joint is inspected with the **20 bolts** sheet kept (M8 or 5/16-24, grip 44 mm). **2 clicks** (`t1a`, `t1b`). Excellent.
2. **Where the gauge goes.** After a double-click, *All 3* frames the 57 cm cable, so the gauge is 84×73 px in a corner. The stack under it is an invisible ghost (`t2b`). Take apart frames the machine out entirely (`t2c`).
3. **Smallest sub-part.** The gauge's cable connector is **15×15 px** in *All 3*, and 32×31 once picked and taken apart. Enlarging the electrode's terminal cap from 37 to 184 px took ten wheel notches (`t6b`).
4. **Getting back.** Three Esc presses leave a part, predictably, but Esc at tour stop 3 ended the tour, with no resume. `]` while inspecting exploded the hidden machine (`t5`).
5. **Selection.** Selecting the gauge lightens it about 30% (`t3a`/`t3b`). Selecting the gaskets shows nothing (`t3c`).

## 3. Findings
1. **P1: "Where it goes" exists only in motion and in text.** After the 1.2 s lift there is no home marker. The mating part is a faint ghost, and take apart frames it out (`t2b`, `t2c`, `c10`; `frameIsolated`, index.html:1715). This fails goal 2.
2. **P2: A click's meaning depends on hidden state.** With every piece shown, a click picks a piece. With one piece shown, it keeps the sheet, or closes it if it is already kept (3512–3516). The only cue is a 12 px hint. On composite parts (gauge = body + clamp + cable), picking a piece is a wasted click. Outside Inspect, clicking the selected part deselects it (3494).
3. **P2: The level names disagree.** **Take apart**'s tooltip says "into its pieces", but it splits the part into sub-parts (565). **Screens** toggles what the header calls *Sheets* (568). **Context** is `G`, for "ghost". **Done** and **Back to assembly** are the same action. With four levels (part, piece, sub-part, sheet), the words are the only map.
4. **P2: You cannot tell a toggle that is on from a primary action.** Dark means "on" for Context, Screens and Cutaway, and "primary" for Done and Next. **Take apart** changes its label *and* turns dark (`c06c`, `t2b`).
5. **P2: Small sub-parts are unlabelled.** Naming each one takes a 150 ms rest of the pointer. Its sheet opens 450–700 px away (`t2c`).
6. **P2: There is no one-step "enhance".** A double-click while inspecting does nothing (the `dblclick` handler), so a small part costs about 10 wheel notches and re-aiming.
7. **P2: Selection in Colour is weak**, with no outline, accent colour or framing. Buried parts are invisible (`t3c`).
8. **P3: Modes leak.** Esc ends the tour (1805). `]` reaches the global Explode (3579). In all: about 18 independent states, 25 single-letter keys.

Credit: search, the **Made of** rows (hovering lights the sub-part), **← back** and the Esc steps are genuinely good.

## 4. Proposals (ranked)
1. **Home socket and solid mates (M).** While inspecting, draw the part's rest position as a dashed silhouette with one tether to it. Draw the parts in its `connects` list at 50% solid, not as ghosts. Take apart keeps the socket in frame. *Check:* the KF16 arm under the gauge is visible in `t2b`/`t2c`-style shots, and 4 of 5 students point to the gauge's seat within 5 s.
2. **Numbered balloons on taken-apart sub-parts (M).** Item numbers as on an engineering drawing, only when one piece is apart, at most 10. The same numbers appear on **Made of** rows and sheet titles. No leader lines. *Check:* someone names all 5 gauge sub-parts from `t2c` without hovering.
3. **Double-click a sub-part to frame it (S).** This reuses the gesture that now does nothing. *Check:* the connector goes from 32 to ≥200 px in one action.
4. **One meaning per click (S).** A click on the model keeps a sheet and never closes it; × or the row closes it. On composite parts, *All* goes straight to the sub-parts. *Check:* from `t2b`, one click opens the display module's sheet.
5. **Words and toggles (S).** Rename Screens to Sheets and Context to Ghost, and keep one label for Done. Fix the tooltip, and draw toggles as switches. On the tour, Esc stays on the tour and "Resume at stop n" is offered. `]` acts only while the machine is exploded. *Check:* users can say which toggles are on, and the tour and `]` cases no longer reproduce.

## 5. On the Tony Stark direction
**Borrow** what removes effort:
- Pulling a part out *on a tether to its socket*.
- Callouts attached to the parts (balloons, not floating paragraphs).
- "Enhance" as one gesture on what you are looking at.
- The calm amber selection the hologram already has.
- "Turning it in the hand" already exists as orbit.

**Avoid** what adds modes or hides affordances:
- Gesture-only manipulation.
- Cameras that move by themselves.
- A separate "workshop mode".
- Glow and scan lines over 15 px parts.
- Text floating over the model.

My rule: each Stark feature must measurably remove a click, a hover or a recall step. Otherwise it is set dressing.
