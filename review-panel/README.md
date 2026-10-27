# Review panel, October 2026

The written record behind [PLAN-2.md](../PLAN-2.md). Eight critics, each with a persona, reviewed the app as merged in
#17 against the owner's three goals: inspect each component in detail, know where each component goes, and inspect
small components with inspiration from Tony Stark.

| Round | What each critic wrote | Brief |
|---|---|---|
| 1 | `critique.md`: what they tried, findings (P1–P3), five ranked proposals, a view on the Stark direction | [1-brief.md](1-brief.md) |
| 2 | `rebuttal.md`: three proposals opposed, three supported, a position on six contested questions, one challenge | [2-round-two.md](2-round-two.md) |
| 3 | `objections.md`: a verdict on the draft plan, at most two blocking objections, answers to the challenges | [3-plan-draft.md](3-plan-draft.md) |

| Folder | Critic |
|---|---|
| [p1-student](p1-student/) | Mai, first-year student, 1366×768 laptop |
| [p2-technician](p2-technician/) | Ruud, vacuum technician |
| [p3-cad](p3-cad/) | Sofia, mechanical CAD engineer |
| [p4-hci](p4-hci/) | Daniel, interaction designer |
| [p5-a11y](p5-a11y/) | Amara, accessibility auditor |
| [p6-lecturer](p6-lecturer/) | Prof. Janssen, lecturer with a beamer |
| [p7-stark](p7-stark/) | Kai, film-UI designer, the Stark champion |
| [p8-tablet](p8-tablet/) | Lena, tablet at the bench, with gloves |

The screenshots the papers cite are not committed. They are in the git-ignored `.arena/panel-20261026/` folder of the
working copy that ran the panel. The paths in [1-brief.md](1-brief.md) are that machine's.

[`shot.mjs`](shot.mjs) is the driver the critics used: a static server, headless Chrome on the GPU and the DevTools
Protocol, with scenario steps for clicks, drags, wheel, keys, touch taps and clipped screenshots. Use it to run the
plan's *done when* checks:

```bash
node review-panel/shot.mjs . my-scenarios.json out
```

[`parts-pieces-subs.json`](parts-pieces-subs.json) lists every part, its pieces and its sub-parts as the app built
them.
