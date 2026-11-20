# Toolstrip checks

Run from the repository root, with output outside the repository:

```bash
node review-panel/shot.mjs . review-panel/strip-check/checks.json <temporary-output-folder>
```

The 81 scenarios cover tabs, themes, search, panels, learning tools, first visits,
keyboard and touch input, and layout in four themes at 1× and 2× text. Each
assertion prints `PASS` or `FAIL`; JavaScript exceptions and console errors also
fail the run. Output images are disposable.

Allow about fifteen to sixteen minutes for a full run. Run this suite, desk-check and
guide-check one at a time, so renderer contention cannot affect the results.

`settled.js` replaces the initial two-second delay. It waits for `__spm1`, a
completed model draw, `document.fonts.ready`, and two consecutive unchanged
animation-frame intervals for the strip, wheel, viewport, view tools, title
block, guide and caption. Finite animations on those elements must also finish.
A 30-second timeout fails explicitly. Layout state changes use the same wait
before measuring controls.

Every layout also inspects the longest part name from `parts.js` (currently
“Inner PF coils (PF1, PF2)”, tied at 23 characters). It checks fit, overlap and
pointer hit testing, including controls reached through the strip's own scroll.

Desktop layouts include 961 × 640, 1024 × 768, 1280 × 660, 1280 × 800,
1366 × 700 and 1440 × 900, in all four themes at both text sizes. The complete
view strip must sit at the view's top left, at least 4px inside Blueprint's
22px inner frame, and clear the triad, Start card, desk, title block, guide and
step caption. The desktop strip has no turntable control (no 360° button, no step arrows). Views must open downward
inside the view, with every choice reachable and receiving pointer input.

Each desktop layout also runs guide steps targeting Axis and Views and two
steps with captions. The guide must stay inside the view, clear the strip,
caption and open Views menu, and keep Next reachable through its own scroll.
On short Blueprint views with a caption, the guide can use the lower view
instead of reserving the scale-bar area. The whole caption must remain reachable
in its own scroll. Caption clearance
measures the painted portion inside the clipping isobar, not its offscreen
scroll content. The Axis ring must contain a button that receives pointer input.

Six title-block scenarios cover 961, 1024 and 1440px at 1× and 2×. They check a
folded first visit without writing a preference, native pointer clicks and
Enter/Space for both fold directions, accessible state, collapsed/expanded
details, and both saved choices across real reloads. The Blueprint status
readout is visible exactly while folded. Runtime Colour → Blueprint switches
check both choices with the panels open, including the former overlap case.

Wheel visibility is asserted in both directions: absent while inspecting a part
or running the desk, on touch screens, at widths up to 960px, with the tree
open, or when the space below the moved tool row cannot fit its drawn 336px
ring at the existing 82% readability floor; present otherwise. The height case
now tests the intended `.away` behavior, whose CSS specificity was corrected.
When visible, its drawn ring and every group button must stay inside the view
and clear of its tools. The ring SVG has 22px of unpainted padding at each end;
the clearance check excludes that padding, retaining full button hit areas.

The phone guide walk separately waits for animation frames after `guide.ready`:
the ring is updated by `guideTick`, not by the asynchronous step setup. The loupe
still requires a ring around `stage`; hiding the phone status bar does not hide
that target.

## Hologram plasma

Seven `aurora-*` scenarios (195 assertions) cover the six root clocks (37/53/71/89/113/137 s),
the shared fixed field on all six HUD surface types (six glow lobes sized to the
viewport under three drifting plasma layers, and the hot-rim overlay), and plain
tables, search and editable desk controls. The plasma's five textures, baked
once in a worker, must arrive as blob URLs within 5 s and be used by the layers;
outside the desk the hot rims are off. Unmounted surface types use temporary CSS
fixtures; mounted surfaces use the real elements. Colour, Greyscale and Blueprint
are checked on arrival and after a live Hologram switch, including stale
`holo-*` classes, with no field and no overlay. Desk buttons cover INITIALISE,
pumping, GLOW ON (violet tint, gain, hot rims at 0.45, half that in the toolstrip), a coil ramp, a trip, STOP
and Done (the rims ease off). Without the desk there is no glow or ramp.

Hidden-tab checks temporarily override `document.hidden` and dispatch
`visibilitychange`, then restore it; all six clocks must pause and resume.
Reduced motion removes the root animation and leaves the field drawn. The tiny
read-only `__spm1.tableWeights()` hook returns copies of the last draw’s table
sub-part names and weights: every one, legs and all, is 2.6, with nothing
selected and with the table selected. Peak-frame and reduced-motion screenshots
are saved.

### Contrast: one-off pixel measurement

This is documented evidence, not an automatic PASS in this suite: `shot.mjs`
saves PNGs but does not return their pixels to the in-page scenario. At 1440 ×
900 with the panels open and the plasma's textures in place, the six root
animations were paused at 20 times 7.3 s apart (0–139 s), normally and with
`holo-glow` and `holo-ramping` (the brightest state, gain 0.26). Each frame
was taken twice, with the panels' text shown and hidden. Letters are the pixels
more than 0.02 brighter (relative luminance) with the text shown; the ring is
the pixels 2–3 px outside them, where the dark halo meets the plasma. The 99th
percentile of the ring's luminance in the right panel, the left panel and the
toolstrip, over all frames, is the background the text is held against: at
worst 0.070 normally and 0.085 with the glow (the toolstrip, whose hot rims run
at half strength). Body text `#cfe3f2` is then 5.9:1 or more; muted text
`#afcadf` 5.1:1 or more normally and 4.56:1 or more with the glow. Ratios use
linearised sRGB relative luminance and `(Llighter + 0.05) / (Ldarker + 0.05)`.
Repeat the measurement if the field, the textures, the halo, the fonts or the
colours change.
