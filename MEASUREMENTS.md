# SPM1 measurements: the model at true size

Every size the model takes from a top-down photo of a real SPM1, how it was measured, and the sources behind each
reference. Measured in November 2026 for [PR #44](https://github.com/HaoPhuc/minimak-spm1-anatomy/pull/44)
(PLAN-2, entry 19). In `parts.js` these sizes carry the `measured` tag.

## Sources

| Id | Source | What it gives here |
|---|---|---|
| Photo | Top-down photo of an SPM1, 1920 × 1280 px, supplied by the project owner (not in the repository) | Every pixel measurement below |
| S1 | [Rideo Systems, minitmak.com](https://www.minitmak.com/) | Four 150 mm quarters forming a 460 mm circle; 8 TF coils of 50 turns of 6 mm copper cable; PF coils |
| S2 | [Rideo Systems, SPM1 specification](https://www.minitmak.com/specification) | Major radius 23 cm, minor radius 7.5 cm; 8 TF coils; 4 PF coils, each independently controlled |
| S4 | [P. Apte, “The Minimak. Design, Build and Operation”, webinar, Oct 2025 (PDF)](https://www.minitmak.com/_files/ugd/5de522_5cee74b6dc514f1eb1a3fee4cb50b9e4.pdf) | Slide 15: TF coils wound on copper formers on the chamber; “PF coils on metal formers above and below, with two larger satellite PF coils” |
| S5 | [Kurt J. Lesker, ConFlat technical notes](https://www.lesker.com/newweb/flanges/flanges_technicalnotes_conflat_1.cfm) | CF flanges are named by outside diameter: 2¾″ is DN40, 6″ is DN100, 8″ is DN160 (the caps on the photo read “2.75”) |
| S9 | [MBE-Komponenten, CF flange, gasket and tube dimensions](https://www.mbe-komponenten.de/service/flange-gasket/) | DN160CF: 203.2 mm OD, 20 holes on a 181.0 mm circle, 21.0 mm thick. DN100CF: 152.4 mm OD, 19.5 mm thick. DN40CF: 69.9 mm OD, 6 holes on 58.7 mm |
| T | [Thorlabs, Nexus optical tables](https://www.thorlabs.com/newgrouppage9.cfm?objectgroup_id=9222) | Metric tops: M6 holes on 25 mm centres. The table is a Thorlabs Nexus (its name plate in S4 slides 12 and 19) |
| C | [Pinhole camera model (Wikipedia)](https://en.wikipedia.org/wiki/Pinhole_camera_model) | The projection used to undo the photo's perspective |

## Method

The photo is a perspective view, so things nearer the camera look larger. A size can only be read once the camera is
known, and then only at the height of the thing measured.

- **Camera model** (C): straight down the torus axis, which images at pixel (999, 706). A point at radius R from the
  axis and height z above the vessel midplane images at radius
  `r = 1599 px × R / (975 mm − z)`. So the scale at height z is `s(z) = 159.9 / (97.5 − z[cm])` px per mm: 1.640 at
  the midplane, 1.818 at 9.55 cm, 1.849 at 11 cm, 1.915 at 14 cm, and 1.324 at the table top (−23.3 cm).
- **Edges:** circles were fitted by least squares to edge points found along 72–144 rays from the axis.
- **Polar unwrap:** the photo was resampled about the axis (0.1° per column, 1 px of radius per row). The camera looks
  down the axis, so every plane through the axis images as a straight radial line. A TF coil lies in such a plane, so
  its band becomes a vertical strip whose angular width can be read row by row.
- **Width from angle:** a band Δφ wide in angle at radius R is Δφ × R wide. R at an image radius comes from the camera
  model and the surface the point lies on (for a TF coil, a circle 87 mm round the tube's centre line).
- Angles are read in the photo's own frame: clockwise from the image's +x, 0° to the right.

## 1. Camera calibration

### Axis

| Reference | Fit | Result |
|---|---|---|
| Copper ring, inner edge | centre (1000.4, 701.0), r 219.2 px, residual 0.9 px, 72 rays | |
| Black ring, outer edge | centre (998.9, 707.1), r 585.9 px, residual 7.0 px, 89 rays | |
| DN40CF caps, right and front | centres (1439.4, 689.0) and (1001, 1147), both 440.5 px from the axis | axis at (999, 706.3) |

The axis is taken at (999, 706). The rings and caps agree to 1–5 px, so the camera stood over the axis.

### Scale and height

| Reference | Known size (source) | On the photo | Gives |
|---|---|---|---|
| Right lateral flange, DN100CF, seen edge-on | 152.4 mm OD (S9) | 580 → 830 px across: 250 px | 1.64 px/mm at the midplane, so f / H = 1.64 |
| DN40CF caps on the top ports, centred on the major radius | ports on the 230 mm radius (S2) | 440.5 px from the axis | 1.915 px/mm at the cap tops |
| Cap height | the drawn DN40 flange face (12.75 cm) plus the cap: about 14 cm | (assumed input) | with the line above: H = 97.5 cm, f = 1599 px |
| Breadboard holes, lower left and lower right | M6 on 25 mm centres (T) | 33.3 px and 33.0 px pitch: 33.1 px | 1.324 px/mm, so the table top is at −23.3 cm (the model has −22) |
| DN40CF caps, size | a cap over a 69.9 mm flange (S9, S5) | 136.5–141 px across | 71–74 mm at 14 cm: consistent |

### Independent check: the joint bolt rows

Each joint is a pair of DN160CF flanges, whose 20 bolts sit on a 181 mm circle (S9) centred on the tube at the
230 mm major radius (S2). One bolt sits at the top of each ring. A bolt at angle θ round the tube (θ = 0 outboard) is
at R = 230 + 90.5 cos θ and z = 90.5 sin θ mm. The nuts are read on both sides of each joint and averaged:

| θ | Predicted r | 45° joint | 135° joint | 225° joint | 315° joint | Mean | Error |
|---|---|---|---|---|---|---|---|
| 126° | 313.5 | 304 | 327.5 | 316 | 327.5 | 318.8 | +1.7% |
| 108° | 363.4 | 355 | 379 | 362.5 | 376 | 368.1 | +1.3% |
| 90° | 415.8 | 408 | 429 | 414 | 429 | 420.0 | +1.0% |
| 72° | 464.1 | 457 | 479 | 459 | 472.5 | 466.9 | +0.6% |
| 54° | 502.1 | 501 | 516 | 499 | 498.5 | 503.6 | +0.3% |
| 36° | 525.9 | 520 | 537.5 | 518.5 | 516 | 523.0 | −0.6% |

The camera fits the four joints together to within 1.7%. The 135°/315° diagonal reads 2–6% larger than the
45°/225° one, so a size read in one direction only carries about ±3%. The vessel's outboard outline, predicted at
510 px, measures 485–516 px between the coils.

## 2. Components

### TF coils

| Measurement | Photo | Result | Model before → now |
|---|---|---|---|
| Count | 8 | 8 (S2) | 8 → 8 |
| Centres | 16.9°, 69.4°, 108.4°, 161.5°, 200.0°, 250.5°, 285.4°, 336.8° | offsets from the nearest port: +16.9, −20.6, +18.4, −18.5, +20.0, −19.5, +15.4, −23.2° | ±22.5° → ±19° |
| Width over the cheeks, at r = 420 px (R ≈ 236 mm, just outboard of the top) | 13.7°, 13.7°, 14.8°, 13.8°, 14.2°, 14.5° (coils at 16.9, 69.4, 108.4, 250.5, 285.4, 336.8°) | 56.4, 56.4, 61.0, 56.9, 58.5, 59.7 mm; mean 58 | about 90 mm at the top → 58 mm |
| Copper band, same place | 11.1°, 11.7°, 12.2°, 12.5° (coils at 16.9, 250.5, 285.4, 336.8°) | 45.7, 48.2, 50.3, 51.5 mm; mean 49 | 72 mm at R₀ → 50 mm |
| Same width all round | coil at 16.9°: 20.25° at r = 300 px (inboard, R ≈ 165–170 mm), 11.0° at r = 530 px (outboard, R ≈ 300–310 mm). Coil at 285.4°: 11.8° over the cheeks and 10.2° of copper at r = 500 px (R ≈ 288 mm) | 58–60 mm both inboard and outboard; 59 and 51 mm at 288 mm | a wedge, 40 mm inboard to 104 mm outboard → a band of even width |
| Depth (winding build) | hidden from above. Copper shows past the vessel's outline before the black ring hides it: 37 px (coil at 336.8°), 27 px (250.5°), 15 px (69.4°) | at 1.78 px per mm of build: at least 21, 15 and 8 mm | 24 mm → 20 mm |

The depth is not measured. It lies between the photo's lower bound (at least 15–21 mm) and what the bore leaves: the
coils' inner legs must clear the 240 mm former and a solenoid winding, so no more than about 23 mm. It is drawn
at 20 mm and tagged assumed. Fifty turns of a cable 6 mm across (S1) would need about 37 mm in a 50 mm band, so the
“6 mm” more likely gives the copper's 6 mm² section.

### PF1 and the central former

| Measurement | Photo | Result | Model before → now |
|---|---|---|---|
| Copper ring (PF1's top), inner edge | r = 219.2 px (circle fit) | Ø241 mm at 9.55 cm | PF1 Ø208 inside → Ø240 |
| Copper ring, outer edge | r = 282–287 px by direction (the straps beside it spoil a fit): 284 px | Ø312 mm at 9.55 cm | PF1 Ø228 outside → Ø312 |
| Grey disc inside the ring (the former's top) | same edge as the ring's inside | Ø241 mm | former Ø208 → Ø240 |
| Height of PF1's top | not measurable | 9.55 cm (assumed): the ring hides the TF coils' inner legs, so it lies over them and its underside must clear them. At R = 156 mm the coils reach 6.9 cm, so the 26 mm coil spans 7.0–9.55 cm | top at 7.5 cm → 9.55 cm |
| Sensitivity | | ±3 cm of height moves both diameters by ±3.4%: Ø233–249 inside, Ø302–323 outside | |

The former now stands to 11 cm, so its rim screws clear PF1. The solenoid, hidden on the photo, is drawn out to
12.6 cm to stay on the wider former and clear the TF coils' inner legs (13.0 cm with their tabs). PF2 mirrors PF1
below the midplane.

### Satellite coils

| Measurement | Photo | Result | Model before → now |
|---|---|---|---|
| Upper ring, inner edge | r = 531.2 px (circle fit, 82 rays, residual 4.8 px) | | |
| Upper ring, outer edge | r = 585.9 px (circle fit, 89 rays, residual 7.0 px) | | |
| Centre line and hose | 558.5 px, 54.7 px across | at 11 cm: Ø604 mm on the centre line, Ø634 outside, hose Ø30 | Ø700 → Ø604; hose Ø32 → Ø30 |
| Height | between 9.5 cm (it passes over the TF coils and the flange tops) and 14 cm (the white junction box lies across it) | drawn at 11 cm (assumed); over that range the centre line is Ø583–615 mm | 16.5 cm → 11 cm |
| Lower ring | not in the photo | drawn the same size as the upper, on the table (assumed) | Ø670 → Ø604 |

The photo shows nothing like the outer PF pair that was drawn on aluminium channels (PF3 and PF4, assumed, at
R 315 mm, ±128 mm). The upper satellite sits where PF3 was drawn. Following S2 (four PF coils) and S4 slide 15, the
four PF coils are now PF1, PF2 and the two satellites, and PF3 and PF4 are removed.

### Lateral ports

| Measurement | Photo | Result | Model before → now |
|---|---|---|---|
| Outer face of the outer flange, at its top rim (z ≈ 7.6 cm) | r = 641 px (right), 644 px (left) | R = 360 and 362 mm from the axis | outer face at 396 mm → 360 mm |
| Depth of the flange stack seen before the black ring hides it | at least 55 px (about 31 mm) | more than one 19.5 mm DN100CF flange (S9): the port flange, gasket and a mating flange, 41 mm | |
| Port flange | | 360 − 41 = 319 mm: drawn at 32 cm | 35.5 cm → 32 cm |

### Not changed

| Part | Photo | Why it is not changed |
|---|---|---|
| Vessel | the joint bolt rows (above) fit the published 230 mm major radius (S2) to 1–2% | already at the published size: R₀ 23 cm, a 7.5 cm, 150 mm quarters (S1, S2) |
| Table top | −23.3 cm from the breadboard pitch | within the camera's uncertainty of the drawn −22 cm |
| Corner posts | black caps at r = 727 px (219.1°), 735 px (305.6°) and 759 px (35.3°); caps 74–78 px square | one photo from above cannot separate a post's height from its radius. At the drawn 40.2 cm radius the tops would be 9–13 cm above the midplane (drawn 19) with 41 mm caps; at the drawn 19 cm height they would stand 36–37 cm from the axis with 36–38 mm caps. Each stands 6–10° to one side of its joint (drawn on the joint) |
| Joint flange stacks | four plates, 14° wide at r = 400 px: about 55 mm | two DN160CF flanges and their gasket are 44 mm (S9); the extra plates are not identified |
| Joint bolts | one bolt at the top of each ring | drawn straddling the top; a detail |
| Former top | a closed grey lid | not drawn |
| Port layout | the photo's ports mirror the model's (the gauge on a lateral port, caps on the right and front tops) | another build; only sizes were compared |

## 3. What the model draws (`D` in `device.js`)

| Value | Before | Now | Basis |
|---|---|---|---|
| `tf.halfW` | 3.6 cm, as an angle at R₀ (a wedge) | 2.5 cm, half the width of a band with parallel sides (`band` in `torusShell`) | measured |
| `tf.at` | 22.5° (fixed in code) | 19° | measured |
| `tf.rIn` / `tf.rOut` | 7.8 / 10.2 cm | 7.8 / 9.8 cm | assumed between bounds |
| `tf.tabR` / `tf.splay` | 10.9 cm / 16° (fixed in code) | 10.1 cm / 8° | 58 mm over the cheeks, measured |
| `former.r` / `former.top` | 10.4 / 9.5 cm | 12 / 11 cm | measured / clears PF1 |
| `pfIn.rOut` / `pfIn.z` / `pfIn.h` | 11.4 / 6.2 / 2.6 cm | 15.6 / 8.25 / 2.6 cm | measured / assumed |
| `sol.rOut` | 11.0 cm | 12.6 cm | derived: fits between the former and the TF coils |
| `pfOut` | R 31.5, z ±12.8 cm | removed, with the PF3/PF4 part | the owner's choice |
| `satTop` | R 35, z 16.5, r 1.6 cm | R 30.2, z 11, r 1.5 cm | measured / assumed height |
| `satBot` | R 33.5, z −18.6, r 1.6 cm | R 30.2, z −18.6, r 1.5 cm | assumed: as the upper |
| `lat.flangeAt` | 35.5 cm | 32 cm | measured |
| `R0`, `aOut`, `aIn`, `table` | 23, 7.7, 7.5 cm; top −22 cm | unchanged | S2 and S9; checked |

Clearances in the new geometry, worked out from these numbers: PF1's underside to the TF tabs below it about 1 mm,
the solenoid's end rings to the TF coils' inner legs 3 mm, the upper satellite to the TF tabs 15 mm, a lateral port
flange to the nearest TF tab tip about 4 mm, the DN63 port flange above the TF tabs 9 mm.

## 4. Checking the result

- The rescaled model, drawn through the same camera (1599 px focal length, 97.5 cm up), lands on the photo's black
  ring, copper ring, TF straps, joints and ports.
- Through the same camera, the old model's coils, bore and ring miss the photo; its vessel, joints and ports
  already matched.
- The comparison images (`rescale-compare-camera.png`, `rescale-compare-app.png`) and the scripts that measured the
  photo are in the session's notes and scratchpad, not in the repository.
