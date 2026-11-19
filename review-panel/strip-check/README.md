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

## Hologram aurora

Seven `aurora-*` scenarios (127 assertions) cover the six root clocks (37/53/71/89/113/137 s),
the shared fixed field on all six HUD surface types, and plain tables, search
and editable desk controls. Unmounted surface types use temporary CSS fixtures;
mounted surfaces use the real elements. Colour, Greyscale and Blueprint are
checked on arrival and after a live Hologram switch, including stale `holo-*`
classes. Desk buttons cover INITIALISE, pumping, GLOW ON, violet tint and gain,
a coil ramp, a trip, STOP and Done. Without the desk there is no glow or ramp.

Hidden-tab checks temporarily override `document.hidden` and dispatch
`visibilitychange`, then restore it; all six clocks must pause and resume.
Reduced motion removes the root animation and leaves the field drawn. The tiny
read-only `__spm1.tableWeights()` hook returns copies of the last draw’s table
sub-part names and weights: skins, trim and name plates are 1, frame and legs
0.32, with nothing selected. Peak-frame and reduced-motion screenshots are saved.

### Contrast: one-off pixel measurement

This is documented evidence, not an automatic PASS in this suite: `shot.mjs`
saves PNGs but does not return their pixels to the in-page scenario. The approved
field was sampled at 1440 × 900, pausing its six root animations with
`a.pause(); a.currentTime = 76000`, both without and with `holo-glow`, after
allowing 1.4 s for tint and gain to settle. A 0–136 s sweep at 4 s intervals
located this sampled peak; it is not a proof of the maximum over all six cycles.

The computed panel field was rasterised over white (a conservative backing).
Its brightest pixels were RGB (49, 85, 120) normally and (69, 74, 119) with
glow: body text `#cfe3f2` exceeds 5.8:1 in both. Muted text `#7a9fb9` relies
on the existing dark halo. Archivo and Red Hat Mono at 11–16 px, weights
400/600, were rasterised over the brighter stress backing RGB (60, 95, 130).
A text-free halo image and a white-on-black glyph mask isolate the background
at glyph cores (mask ≥ 192/255); its brightest pixel was (21, 40, 60), giving
5.34:1 for muted text. Ratios use linearised sRGB relative luminance and
`(Llighter + 0.05) / (Ldarker + 0.05)`. These measurements exceed 4.5:1;
repeat the pixel measurement if the field, veil, fonts, colours or halo change.
