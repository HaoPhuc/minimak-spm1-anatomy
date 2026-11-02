// Helpers for the checks: wait for a step, and a snapshot of everything the guide must give back.
const A = __spm1, sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const $ = (id) => document.getElementById(id);
const until = async (f, ms = 9000) => { const t0 = performance.now(); while (!f() && performance.now() - t0 < ms) await sleep(50); return f(); };
const idx = (id) => A.GUIDE_STEPS.findIndex((s) => s.id === id);
const go = async (id) => { A.guideGo(idx(id)); await until(() => A.guide.ready && A.GUIDE_STEPS[A.guide.i].id === id); };
const snap = () => ({
  url: location.href, hl: history.length,
  ls: JSON.stringify(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)])),
  goal: [A.goal.az, A.goal.el, A.goal.zoom, A.goal.target.x, A.goal.target.y, A.goal.target.z].map((n) => +n.toFixed(2)).join(','),
  part: A.iso.part, focus: A.iso.focus?.userData.label || null, apart: A.iso.apart, step: A.iso.step, joint: !!A.iso.joint, show: A.iso.show?.sub || null,
  pins: A.state.pins.map((x) => x.sub).join('|'), folded: [...A.HUD.folded].sort().join('|'), kept: JSON.stringify([...A.HUD.kept]),
  hidden: [...A.hidden].sort().join('|'), panels: JSON.stringify(A.panels), theme: document.documentElement.dataset.theme || '', tab: A.tab(),
  explode: A.state.explode, cut: A.state.cut, spread: A.state.spread, scale: A.uiScale(), select: A.state.select, dims: JSON.stringify(A.draft.dims),
});
const diff = (a, b) => Object.keys(a).filter((k) => a[k] !== b[k]).map((k) => `${k}: ${a[k]} -> ${b[k]}`);
const log = [];
