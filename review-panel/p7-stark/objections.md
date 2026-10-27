# Kai (p7-stark): round 3

## 1. Verdict

**Accept with changes.** The draft keeps what matters most to me: Show me, named callouts, a lifted part with its seat, and single bolts after framing. I concede the auto-orbit; **Turn to see** is better.

## 2. Blocking objections

1. **Phase 0 gates too much.** Making T2 (the KF joints) and T4 (61 new sheets) prerequisites holds the owner's priority back by weeks.
   - **Change:** only T1 (gaskets) and T3 (knife edges) must ship before S1.
   - T2 and T4 run alongside Phase 2.
   - S1 turns on per part once that part's hardware is true.
2. **S3 has no layout for narrow views**, where there are no gutters to put callouts in. That covers 1366 with the column, 1024 tablets with the dock, and 200 % zoom.
   - **Change:** add to S3: *"When the free view is under 700 px, or a placement would cross a leader or cover a ring, callouts become numbered balloons on the part. Their names show in the Made of rows and the dock card. Check: zero crossings in k10's view at 1440 and 1366."*
   - Numbered balloons with names one row away are not the rejected "unnamed balloons".

## 3. Move earlier

**L2 (`--ui-scale`) belongs in Phase 2.** S3 depends on it, but it is scheduled for Phase 5.

## 4. Answers to the six challenges

- **Ruud.** Conceded: no routine job needs bolt 7 on its own, except a seized bolt. The real per-bolt job is your star order (O2). The draft already puts the gasket first (T1) and single bolts after framing (S4).
- **Sofia.** At 1366 the free view is about 730 px, which leaves two 120 px gutters with five rows of 30 px each: room enough. I can't prove there are no crossings without a run. Yes, I settle for balloons plus one leader below 700 px (my objection 2).
- **Daniel.** Mid-orbit nothing is shown to read: callouts hide while the camera moves and settle on the stop (S3), as I conceded in round 2. Crossings: anchors and labels are sorted by y in each gutter, and the check is zero in k10, else the view falls back to balloons.
- **Amara.** With reduced motion:
  - callouts appear at once on the stop;
  - Show me cuts;
  - there is no swing (Turn to see cuts);
  - the inset stays off.

  At 420×360 they become balloons, with names in the dock. Label 7 is Made of row 7 in Tab order, and Enter on it is Show me.
- **Janssen.** At `--ui-scale` 2 a label is 26 px with a 2 px leader. That reads from mid-hall, not from row 20; 48 px allows five callouts, not ten. Conceded. At 1280×720 the gutters fit five labels of 26 px each; beyond five, balloons.
- **Lena.** At 628 px there are no side columns: you get numbered balloons with 44 px tap areas (V4 coarse), names in the dock card, and a tap to preview. Where balloons overlap, the long-press loupe (Phase 6) settles which one you meant.
