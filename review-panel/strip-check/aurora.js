// Aurora CSS and desk-state checks; pixels are a documented one-off (README).
const root = document.documentElement, mode = window.__auroraMode;
const names = ['hud-aurora', 'hud-aurora-b', 'hud-aurora-c', 'hud-aurora-d', 'hud-aurora-e', 'hud-aurora-f'];
const periods = [37, 53, 71, 89, 113, 137];
const animations = () => root.getAnimations().filter(a => names.includes(a.animationName));
const has = name => root.classList.contains('holo-' + name);
const pick = async theme => {
  $('bLook').click(); $('looks').querySelector('[data-look="' + theme + '"]').click(); await settled();
};
// Use mounted surfaces where present, CSS fixtures for unmounted sheets/desk.
const surfaces = active => {
  for (const cls of ['top', 'panel', 'screen', 'startcard', 'guide', 'desk']) {
    let e = document.querySelector('.' + cls), fixture = !e;
    if (fixture) { e = document.createElement('div'); e.className = cls; document.body.append(e); }
    const s = getComputedStyle(e, '::after'), n = (s.backgroundImage.match(/radial-gradient/g) || []).length;
    const sizes = s.backgroundSize.split(',').map(x => x.trim()), b = getComputedStyle(e, '::before');
    ok(cls + ': ' + (active ? 'six soft lobes in the fixed viewport field' : 'no aurora field'), active ? n === 6 && s.content === '""' && s.backgroundAttachment.split(',').every(x => x.trim() === 'fixed') && sizes.length === 7 && sizes.every(x => x === innerWidth + 'px ' + innerHeight + 'px') : n === 0, sizes.join('|'));
    ok(cls + ': ' + (active ? 'event-only plasma overlay in the same fixed field' : 'no hot-rim overlay'), active ? b.content === '""' && b.backgroundAttachment.split(',').every(x => x.trim() === 'fixed') : !/url\(|gradient/.test(b.backgroundImage));
    if (fixture) e.remove();
  }
};
const plain = (selector, tag, cls, color) => {
  let e = document.querySelector(selector), fixture = !e;
  if (fixture) { e = document.createElement(tag); e.className = cls; document.body.append(e); }
  const s = getComputedStyle(e), after = getComputedStyle(e, '::after');
  ok(selector + ': plain backing', s.backgroundImage === 'none' && s.backgroundColor === color && !after.backgroundImage.includes('radial-gradient'));
  if (fixture) e.remove();
};
if (['light', 'greyscale', 'blueprint'].includes(mode)) {
  ok(mode + ': no root animation on arrival', getComputedStyle(root).animationName === 'none'); surfaces(false);
  await pick('dark'); ok('runtime Hologram starts all six', animations().length === 6); surfaces(true);
  root.classList.add('holo-glow', 'holo-ramping', 'holo-paused');
  await pick(mode);
  ok('leaving Hologram clears glow and ramping', !has('glow') && !has('ramping'));
  const defaults = () => ['--holo-tint', '--holo-gain'].map(p => getComputedStyle(root).getPropertyValue(p)).join('|');
  const before = defaults();
  root.classList.add('holo-glow', 'holo-ramping', 'holo-paused');
  ok(mode + ': stale holo classes cannot animate root', getComputedStyle(root).animationName === 'none' && animations().length === 0);
  surfaces(false);
  ok(mode + ': stale classes leave tint and gain unchanged', defaults() === before);
} else if (mode === 'field' || mode === 'reduced') {
  ok('outside desk: no glow or ramp', !has('glow') && !has('ramping'));
  if (mode === 'reduced') {
    ok('reduced motion is emulated', matchMedia('(prefers-reduced-motion: reduce)').matches);
    ok('reduced: no root animation or transition', getComputedStyle(root).animationName === 'none' && animations().length === 0 && getComputedStyle(root).transitionDuration === '0s');
  } else {
    const aa = animations();
    ok('six running root animations with unrelated periods', aa.length === 6 && names.every((n,i) => aa.some(a => a.animationName === n && a.playState === 'running' && a.effect.getTiming().duration === periods[i] * 1000)));
    const times = aa.map(a => a.currentTime); await sleep(180);
    ok('all six clocks advance', aa.every((a,i) => a.currentTime > times[i]));
    // The plasma's textures are baked once in a worker and arrive as five blob URLs on the root.
    ok('plasma textures arrive within 5 s', await until(() => (root.getAttribute('style') || '').split('blob:').length - 1 === 5, 5000));
    const top = document.querySelector('.top');
    ok('soft field has no textures; event overlay holds all five', !/url\(/.test(getComputedStyle(top, '::after').backgroundImage) && (getComputedStyle(top, '::before').backgroundImage.match(/url\("blob:/g) || []).length === 5);
    ok('at rest all filaments and sparks are off', getComputedStyle(top, '::before').opacity === '0');
    // Reproducible peak-frame screenshot, without changing the application's CSS.
    aa.forEach(a => { a.pause(); a.currentTime = 76000; });
  }
  surfaces(true);
  plain('table.specs', 'table', 'specs', 'rgb(8, 23, 37)');
  plain('table.ptab', 'table', 'ptab', 'rgb(8, 23, 37)');
  plain('.search', 'input', 'search', 'rgb(8, 23, 37)');
  plain('.dk-set', 'input', 'dk-set', 'rgb(8, 23, 37)');
  const off = (w) => [...new Set(w.filter(m => m.dim !== 2.6).map(m => m.sub + '=' + m.dim))].join(', ');
  let weights = A.tableWeights();
  ok('table: nothing selected or inspected', !A.state.select && !A.iso.part);
  ok('the whole table, legs and all, at the table gain', weights.length > 0 && weights.every(m => m.dim === 2.6), off(weights));
  A.select('table'); await settled(); weights = A.tableWeights();
  ok('selected, the table keeps its gain', A.state.select === 'table' && weights.every(m => m.dim === 2.6), off(weights));
} else if (mode === 'hidden') {
  const descriptor = Object.getOwnPropertyDescriptor(document, 'hidden');
  try {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange'));
    const aa = animations(); await sleep(80); const t = aa.map(a => a.currentTime); await sleep(200);
    ok('hidden tab sets holo-paused', has('paused'));
    ok('all six animations pause and stop advancing', aa.length === 6 && aa.every((a,i) => a.playState === 'paused' && a.currentTime === t[i]));
    Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange'));
    ok('visible tab resumes all six', !has('paused') && animations().every(a => a.playState === 'running'));
  } finally { if (descriptor) Object.defineProperty(document, 'hidden', descriptor); else delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); }
} else if (mode === 'desk') {
  const d = A.desk, tint = () => getComputedStyle(root).getPropertyValue('--holo-tint').trim();
  $('tsRun').click(); await settled();
  ok('desk alone: no glow or ramp', !has('glow') && !has('ramping'));
  ok('desk at rest has no filaments or sparks', +getComputedStyle(document.querySelector('.panel'),'::before').opacity === 0);
  $('dkInit').click(); $('dkPump').click(); set('dkGas', 45);
  ok('INITIALISE and pump do not light aurora', d.io && d.pump && !has('glow'));
  ok('pump reaches glow pressure', await until(() => Math.abs(d.p - .4) < .02));
  const initial = tint(); $('dkHv').click();
  ok('plasma fades over about a second', getComputedStyle(document.querySelector('.panel'),'::before').transitionDuration === '1.1s');
  ok('GLOW ON sets holo-glow', d.hv && has('glow'));
  await sleep(1400);
  ok('glow eases tint to violet and increases gain', initial !== tint() && tint() === 'rgb(177, 135, 237)' && +getComputedStyle(root).getPropertyValue('--holo-gain') === .23, tint());
  const hot = (sel = '.panel') => +getComputedStyle(document.querySelector(sel), '::before').opacity;
  ok('glow lights the plasma\'s hot rims', Math.abs(hot() - .45) < .02, hot());
  ok('the toolstrip\'s hot rims glow at half strength', Math.abs(hot('.top') - .225) < .02, hot('.top'));
  const input = $('dkSet-tf1'); input.value = 40; input.dispatchEvent(new Event('change', { bubbles: true })); $('dkCoil-tf1').click();
  ok('coil ramp sets holo-ramping', await until(() => has('ramping'), 1000));
  ok('settled coil clears holo-ramping', await until(() => !has('ramping')));
  A.deskTrip(); ok('trip clears glow', d.trip && !has('glow'));
  ok('trip fades every filament and spark out', await until(() => hot() === 0, 2500));
  $('dkInit').click(); $('dkHv').click(); ok('reset permits glow again', has('glow'));
  $('dkStop').click(); ok('STOP clears glow', !has('glow'));
  $('dkHv').click(); ok('glow on before Done', has('glow'));
  $('bDeskDone').click(); ok('Done clears glow and ramping', !d.on && !has('glow') && !has('ramping'));
  ok('Done eases the hot rims off', await until(() => hot() === 0, 2500), hot());
}
return finish();
