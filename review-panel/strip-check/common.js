// desk-check conventions: one PASS/FAIL line per assertion returned to shot.mjs.
const settled = () => window.__stripSettled();
await settled();
const A = __spm1, out = [], $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (fn, ms = 9000) => { const t = performance.now(); while (!fn() && performance.now() - t < ms) await sleep(50); return !!fn(); };
const ok = (name, cond, detail = '') => out.push((cond ? 'PASS ' : 'FAIL ') + name + (detail !== '' ? ' (' + detail + ')' : ''));
const shown = (e) => !!e && !!e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
const R = (e) => e.getBoundingClientRect();
const inside = (a, b, eps = 1) => a.left >= b.left - eps && a.right <= b.right + eps && a.top >= b.top - eps && a.bottom <= b.bottom + eps;
const clear = (a, b) => a.right <= b.left + .5 || b.right <= a.left + .5 || a.bottom <= b.top + .5 || b.bottom <= a.top + .5;
const set = (id, value) => { const e = $(id); e.value = value; e.dispatchEvent(new Event('input', { bubbles: true })); };
const key = (value, e = document.activeElement) => e.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
const page = (name) => {
  const names = ['explore', 'part', 'learn', 'run'];
  ok(name + ': only its page is visible and exposed', names.every((n) => { const e = $('row' + n[0].toUpperCase() + n.slice(1)); return shown(e) === (n === name) && e.hidden === (n !== name); }));
  ok(name + ': selected tab agrees with the page', names.every((n) => $('ts' + n[0].toUpperCase() + n.slice(1)).getAttribute('aria-selected') === String(n === name)) && A.strip.tab === name);
};
// The driver also reports startup errors from before these listeners exist.
if (!window.__stripErrors) {
  window.__stripErrors = [];
  addEventListener('error', (e) => __stripErrors.push(e.message));
  addEventListener('unhandledrejection', (e) => __stripErrors.push(String(e.reason)));
  const error = console.error;
  console.error = (...args) => { __stripErrors.push(args.map(String).join(' ')); error.apply(console, args); };
}
const finish = () => { ok('no console errors during the scenario', !__stripErrors.length, __stripErrors.join('; ')); return out; };

