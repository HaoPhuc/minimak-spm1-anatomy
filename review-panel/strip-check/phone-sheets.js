const pc = A.piecesOf.get('viewport').find(p => p.userData.label.startsWith('Front'));
A.inspect('viewport', pc); A.setApart(true);
A.keepSheet('viewport', 'Copper gasket'); A.keepSheet('viewport', '16 bolts');
scrollTo(0, 0); await settled();
window.checkDrawer = (position, ok) => {
  const drawer = $('sheets'), nav = $('navCluster');
  ok(position + ': view tools clear the drawer', !shown(nav) || R(nav).bottom <= R(drawer).top);
  for (const b of drawer.querySelectorAll('.sheets-head button, .bar button')) {
    if (!shown(b)) continue;
    const r = R(b), hit = document.elementFromPoint(r.x + r.width/2, r.y + r.height/2);
    ok(position + ': ' + (b.getAttribute('aria-label') || b.title || b.textContent) + ' receives its centre tap', b.contains(hit), hit?.id || hit?.tagName);
  }
};
checkDrawer('peeking', ok);
ok('the second kept sheet is showing before the tap', $('cardLabel').textContent === 'Kept 2 of 2');
return finish();
