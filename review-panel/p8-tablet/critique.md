# Lena: the tablet on the bench

## 1. Who I am
Lab assistant, tablet in a nitrile glove, looking from the SPM1 to the screen and back.

## 2. What I tried
On touch emulation, with the shots in `shots/` and the numbers in `run1-log.txt` and `run2-log.txt`:

1. **Gauge KF16 clamp, landscape 1024×768.** I searched "KF clamp" (t02) and tapped the gauge hit, which inspected the gauge and kept the clamp's sheet (t03). Good path, but the two-row bar covers the gauge.
2. **"Which part is this?" from home (t07).** The model gets 432×666 px. On screen the gauge covers 848 px², the needle valve 464 and the electrodes 80. Tap selected it (faint highlight); double-tap inspected it.
3. **Pump port apart, tap a nut (t04, t08).** A nut is about 15 px across. Within 10 px of a target, 38 % of touch points hit a bolt and 41 % a nut. My aimed tap missed (t08), and some nuts sit under the bar.
4. **Phone (t06, t09).** The four-row bar hides half the joint flange, and the model gets about 150 px of height. A nut is 6–7 px, with a 15 % hit rate, and my tap missed (t09).
5. **Portrait (t05), and landscape with Panels folded (t10).** Right: a sheet column, a 66×39 px clamp.

## 3. Findings
- **P1. Picking has no finger tolerance.** `pickMesh` (≈l.3436) casts one exact ray. Parts are 6–16 px on screen and a fingertip is about 40 px. A miss also clears the open preview: `if (!pc) return setLive(null)` (l.3511).
- **P1. Framing ignores the inspect bar.** `frameBox` and `hudInsets` (l.1575, 2032) have no top inset, so the wrapped bar covers the part (t03, t06), and parts under it cannot be tapped.
- **P2. Landscape, the way a tablet sits on a bench, gets the worst layout.** The view is under `COLUMN_MIN` (660 px), so the sheets go to a dock and the part gets about 270 px of height (t04). With the inspector folded the view is 914 px and the sheets get a column (t10).
- **P2. Targets are 22–28 px.** The inspect bar, a sheet's ×, the dock arrows and the modebar are all that size, and the triad's ends are 8–14 px. There is no `(pointer: coarse)` CSS (`coarse` is JS only, l.627).
- **P2. Tap slop is 5 px of total movement** (`drag.moved < 5`, l.3491). A shaky gloved tap becomes an orbit instead of a pick. (code read)
- **P2. Performance.** At DPR 2 there are 573 meshes and 256k triangles. Frame times on this laptop: Colour median 13.5 ms, Greyscale 20.6 ms (p95 47 ms). A mid-range tablet is several times slower, and there is no lower resolution while moving.
- **P3. Kept sub-parts barely show, and nothing points to them.** In Colour a lit part lightens toward the paper, which is invisible on the pale KF16 ring (t10). A sheet lights its sub-part on hover only (l.2347), and there are no leader lines.
- **P3. The triad in Hologram.** It is rebuilt every frame at 30 fps, and its node was replaced within 150 ms, so a finger tap probably loses its target.

**What works:** search by sub-part name, tap to preview and **Keep** to keep, double-tap to inspect, pinch toward the point between the fingers, inspect keeping my azimuth, and drawing only when something changes.

## 4. Proposals (ranked)
1. **Finger-tolerant picking and a loupe (M).** Cast rays across a disc about 24 px wide and prefer the smallest sub-part they hit. Hold a finger down for a 3× loupe with the sub-part's name; lifting it opens the preview. A miss keeps the preview open. *Check:* at least 90 % of taps within 12 px of a 15 px nut open its sheet.
2. **Frame below the bar (S).** Add `hudTop()` as a top inset. *Check:* `elementFromPoint` returns `canvas` at every nut point, at 1024 and at 390 px.
3. **A touch layout (S–M).** Under `pointer: coarse`, give every control at least 44 px, and add Back and Left views. In landscape under 1100 px, fold the inspector while inspecting. *Check:* at 1024×768 the sheets get a column and every button is at least 44 px.
4. **"Enhance" (S–M).** Tapping a sheet's bar frames that sub-part, and a leader line from the sheet stays on it as the model turns. *Check:* the clamp fills at least 30 % of the view's height, and the line still ends on it after a 90° turn.
5. **Lower resolution while moving (S).** Use DPR 1 while a finger is down or a glide runs, and skip the shadow pass until the view is still. *Check:* the median Greyscale frame time halves.

## 5. On the Tony Stark direction
**Borrow:**
- Long-press to grab a part, which is surer than a double-tap in gloves.
- A two-finger twist to turn the model; it does nothing today.
- Enhance, through the loupe and tap-to-frame.
- Callouts that track the part.
- A calm, one-row HUD with big controls.

**Avoid:**
- Flick inertia: on a bench, the model must stop where I leave it.
- Take-apart on a gesture only: a pinch already zooms, so keep the button.
- Hover-only links.
- Glow left animating at 30 fps on a battery tablet.
