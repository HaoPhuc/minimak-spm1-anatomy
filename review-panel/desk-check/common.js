// Shared by the control desk's checks: the desk's own buttons, and a line per thing checked.
const A = __spm1, d = A.desk, out = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const $ = (id) => document.getElementById(id);
const ok = (name, cond, detail = '') => out.push(`${cond ? 'PASS' : 'FAIL'} ${name}${detail !== '' ? ` (${detail})` : ''}`);
const set = (id, v) => { const e = $(id); e.value = v; e.dispatchEvent(new Event(e.type === 'range' ? 'input' : 'change', { bubbles: true })); };
const until = async (fn, ms = 9000) => { const t0 = performance.now(); while (!fn() && performance.now() - t0 < ms) await sleep(50); return !!fn(); };
const near = (a, b, eps) => Math.abs(a - b) <= eps;
// Open the desk from its button in the Machine tab.
const open = async () => { A.setTab('machine'); document.querySelector('[data-fk="act:desk"]').click(); await sleep(500); };
// INITIALISE, pump down, and gas to 0.40 mbar: ready to strike.
const ready = async () => { $('dkInit').click(); if (!d.pump) $('dkPump').click(); set('dkGas', 45); await until(() => near(d.p, 0.4, 0.02)); await sleep(150); };
const settle = (ms = 2200) => sleep(ms);
