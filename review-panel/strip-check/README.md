# Toolstrip checks

Run from the repository root:

```bash
node review-panel/shot.mjs . review-panel/strip-check/checks.json review-panel/strip-check/out
```

The 60 scenarios cover tabs, themes, search, panels, learning tools, first visits,
keyboard and touch input, and layout in four themes at 1× and 2× text. Each
assertion prints `PASS` or `FAIL`; JavaScript exceptions and console errors also
fail the run. Output images are disposable.

A full run takes about seven minutes (2756 assertions) and passes alone and while the
desk-check runs beside it (about seven and a half minutes then), so the two can share a
machine. The guided-analysis suite is the slow one; start it on its own if timing matters.

`settled.js` replaces the initial two-second delay. It waits for `__spm1`, a
completed model draw, `document.fonts.ready`, and two consecutive unchanged
animation-frame intervals for the strip, wheel, viewport and view tools. Finite
animations on those elements must also finish. A 30-second timeout fails
explicitly. Layout state changes use the same wait before measuring controls.

Every layout also inspects the longest part name from `parts.js` (currently
“Inner PF coils (PF1, PF2)”, tied at 23 characters). It checks fit, overlap and
pointer hit testing, including controls reached through the strip's own scroll.

Wheel visibility is asserted in both directions: absent while inspecting a part
or running the desk, on touch screens, at widths up to 960px, or with the tree
open; present otherwise. The desk's bar also intentionally hides the wheel.
When visible, its drawn ring and every group button must stay inside the view
and clear of its tools. The ring SVG has 22px of unpainted padding at each end;
the clearance check excludes that padding, while retaining the full button hit
areas. This avoids reporting empty SVG space as clipped artwork.

The phone guide walk separately waits for animation frames after `guide.ready`:
the ring is updated by `guideTick`, not by the asynchronous step setup. The loupe
still requires a ring around `stage`; hiding the phone status bar does not hide
that target.
