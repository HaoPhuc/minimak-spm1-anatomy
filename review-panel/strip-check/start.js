const mode = window.__startMode || 'dismiss';
ok('first visit shows Start here with inspector folded', shown($('startCard')) && !A.panels.insp && !shown($('inspPanel')));
if (mode === 'tour') {
  $('bStartTour').click(); await sleep(1600);
  ok('Start here tour starts at the vessel', A.iso.tour === 0 && A.iso.part === 'vessel');
  $('bDone').click(); await sleep(2400);
} else if (mode === 'about') {
  $('bStartAbout').click(); await sleep(250);
  ok('About opens the machine inspector', A.panels.insp && A.tab() === 'machine' && shown($('inspPanel')));
} else if (mode === 'select') {
  A.select('tf'); await sleep(250); ok('selecting a part dismisses Start here', $('startCard').hidden); A.select(null);
} else $('bStartX').click();
A.setPanel('insp', false); A.syncStrip('explore'); await sleep(250);
ok(mode + ': Start here stays dismissed after returning', $('startCard').hidden && A.strip.startGone && localStorage.getItem('spm1-start') === '0');
return finish();

