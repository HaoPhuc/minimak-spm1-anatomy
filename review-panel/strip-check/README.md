# Toolstrip checks

Run from the repository root, with output outside the repository:

```bash
node review-panel/shot.mjs . review-panel/strip-check/checks.json <temporary-output-folder>
```

The 83 scenarios run 10,502 assertions covering tabs, themes, search, panels, learning tools, first visits,
keyboard and touch input, and layout in four themes at 1× and 2× text. Each
assertion prints `PASS` or `FAIL`; JavaScript exceptions and console errors also
fail the run. Output images are disposable.

The piece and step scenario checks sourced figures for the front, left and back viewports, diagnostic and gauge ports, satellite coils and inner PF coils. Resume step, Esc and the active Show me button restore the step’s caption, highlight and camera. Successive Esc presses then show all steps with the sheet kept, show every piece, return to the assembly with the part selected, and clear the selection. The tab and keyboard checks cover the selection chip, Inspect in Details, the Inspecting tab and Done in the inspect row. The sheet header must clear both captions. The 390 × 844 sheet scenario hit-tests every visible header and card-bar button with the drawer peeking and expanded, and uses a native Previous card tap to move from Kept 2 of 2 to Kept 1 of 2.

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

Seven `aurora-*` scenarios (198 assertions) cover the six root clocks (37/53/71/89/113/137 s),
the shared fixed field on all six HUD surface types (six glow lobes sized to the
viewport, with plasma textures and hot rims fading in over them), and plain
tables, search and editable desk controls. The plasma's five textures, baked
once in a worker, must arrive as blob URLs within 5 s and be used by the layers;
at rest all plasma filaments and sparks are off, leaving the soft glow.
Unmounted surface types use temporary CSS fixtures; mounted surfaces use the
real elements. Colour, Greyscale and Blueprint
are checked on arrival and after a live Hologram switch, including stale
`holo-*` classes, with no field and no overlay. Desk buttons cover INITIALISE,
pumping, GLOW ON (plasma fades in over 1.1 s, violet tint, gain, hot rims at 0.45,
half that in the toolstrip), a coil ramp, a trip, STOP and Done (all plasma fades
out). Without the desk there is no glow or ramp.

Hidden-tab checks temporarily override `document.hidden` and dispatch
`visibilitychange`, then restore it; all six clocks must pause and resume.
Reduced motion removes the root animation; the soft field stays drawn and plasma
still follows the desk’s glow. The tiny read-only `__spm1.tableWeights()` hook returns copies of the last draw’s table
sub-part names and weights: every one, legs and all, is 2.6, with nothing
selected and with the table selected. Peak-frame and reduced-motion screenshots
are saved.

### Contrast: one-off pixel measurement

This is documented evidence, not an automatic PASS in this suite. Brief 14
re-measured the changed field at 1440 × 900: a full-viewport panel fixture,
with the same pseudo-elements over a white backing, was sampled at eight paused
animation times (0, 17, 38, 76, 121, 197, 253 and 307 s), at rest, with glow,
and with glow plus a coil ramp: 24 frames. The brightest raw background pixel
was compared with body text `#cfe3f2` and muted text `#afcadf`, without taking
credit for the text halo. The sampled minimum was **6.52:1 body, 5.05:1 muted**
(glow at 76 s; background luminance 0.07213). At rest the minima were 6.56:1
and 5.08:1; during the ramp, 6.86:1 and 5.32:1.

These replace the earlier text-ring percentile figures (5.9:1 body, 4.56:1
muted with glow). They still hold for this documentation pass: the brightest
field, textures, halo, fonts and colours are unchanged from that measurement.
Ratios use linearised sRGB relative luminance and
`(Llighter + 0.05) / (Ldarker + 0.05)`. These are sampled minima, not a bound
on every animation frame. Repeat if the field or text styling changes.
