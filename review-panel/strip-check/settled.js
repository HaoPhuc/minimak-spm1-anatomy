// Readiness is observable, not a fixed delay: modules, fonts, the first complete
// model draw, and two unchanged animation-frame intervals for the measured UI.
window.__stripSettled = async () => {
  const next = () => new Promise(requestAnimationFrame);
  let timer;
  const ready = async () => {
    while (!window.__spm1?.hasDrawn()) await next();
    await document.fonts.ready;
    let previous = '', stable = 0;
    while (stable < 2) {
      await next();
      const els = [...document.querySelectorAll('#strip, #strip button, #card, #stage, #wheel, #whRing, #whGroups button, #viewbar, #navCluster, #turnTable, #statbar, #readout, .tb-details, #guide, #isobar, #stepCap')];
      const positions = JSON.stringify(els.map(e => {
        const r = e.getBoundingClientRect();
        return [r.x, r.y, r.width, r.height, getComputedStyle(e).display];
      }));
      const animating = els.some(e => e.getAnimations().some(a => a.playState === 'running' && a.effect.getComputedTiming().iterations !== Infinity));
      stable = positions === previous && !animating ? stable + 1 : 0;
      previous = positions;
    }
  };
  try {
    await Promise.race([ready(), new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Toolstrip did not settle within 30 seconds')), 30000);
    })]);
  } finally { clearTimeout(timer); }
};
await window.__stripSettled();
