// Shared geometry checks for the approved desktop tools and Blueprint title block.
const checkView = async (state, menu = true) => {
  await settled();
  if (innerWidth <= 960) return;
  const card = R($('card')), bar = R($('viewbar'));
  const blue = document.documentElement.classList.contains('blueprint');
  const inset = blue ? 26 : 8;
  // stepCap is content inside the scrolling isobar; only its clipped viewport is painted.
  const caption = () => { const r = R($('stepCap')), p = R($('isobar')); return new DOMRect(Math.max(r.left,p.left),Math.max(r.top,p.top),Math.min(r.right,p.right)-Math.max(r.left,p.left),Math.min(r.bottom,p.bottom)-Math.max(r.top,p.top)); };
  ok(state + ': view strip is at the top left inside the view', inside(bar, card) && Math.abs(bar.left - card.left - inset - 1) <= 1 && Math.abs(bar.top - card.top - inset - 1) <= 1);
  if (blue) ok(state + ': strip clears Blueprint inner frame by at least 4px', bar.left >= card.left + 26 && bar.top >= card.top + 26 && bar.right <= card.right - 26);
  ok(state + ': desktop has no turntable control', !shown($('turnTable')) && !document.querySelector('.spin-toggle'));
  for (const id of ['triad', 'startCard', 'desk', 'stepCap', 'guide', 'readout']) {
    const e = $(id);
    ok(state + ': view strip clears ' + id, !shown(e) || clear(bar, id === 'stepCap' ? caption() : R(e)));
  }
  if (blue) {
    ok(state + ': title block stays inside view', !shown($('readout')) || inside(R($('readout')), card));
    ok(state + ': status readout follows title fold', shown($('roLine')) === $('readout').classList.contains('folded'));
  }
  if (shown($('guide'))) {
    const g = R($('guide'));
    ok(state + ': guide stays inside view and clears caption', inside(g, card) && (!shown($('stepCap')) || clear(g, caption())));
    ok(state + ': guide content can scroll without escaping its card', getComputedStyle($('guide')).overflowY === 'auto' && getComputedStyle($('gBody')).overflowY === 'auto');
    const guide = $('guide'); guide.scrollTop = guide.scrollHeight;
    const next = R($('gNext')), hit = document.elementFromPoint((next.left+next.right)/2,(next.top+next.bottom)/2);
    ok(state + ': guide Next remains reachable by scrolling', inside(next,g) && $('gNext').contains(hit));
    guide.scrollTop = 0;
    if (shown($('stepCap'))) {
      const iso = $('isobar'); iso.scrollTop = iso.scrollHeight;
      ok(state + ': the whole caption is reachable by scrolling', R($('stepCap')).bottom <= R(iso).bottom + 1);
      iso.scrollTop = 0;
    }
  }
  if (menu) {
    $('bViews').click(); await settled();
    const m = R($('viewMenu'));
    ok(state + ': Views opens downwards fully inside view', shown($('viewMenu')) && m.top >= bar.bottom && inside(m, card));
    if (shown($('guide'))) ok(state + ': open Views clears guide card', clear(m, R($('guide'))));
    const blocked = [];
    for (const b of $('viewMenu').querySelectorAll('button')) {
      b.scrollIntoView({ block: 'nearest' });
      const r = R(b), hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2);
      if (!inside(r, m) || !b.contains(hit)) blocked.push(b.textContent.trim());
    }
    ok(state + ': every Views choice fits and receives pointer input', !blocked.length, blocked.join(', '));
    $('bViews').click();
  }
};
