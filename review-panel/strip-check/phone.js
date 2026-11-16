ok('touch emulation is active', matchMedia('(pointer: coarse)').matches && navigator.maxTouchPoints > 0);
ok('panels stack below view', R($('inspPanel')).top >= R($('card')).bottom && R($('treePanel')).top >= R($('inspPanel')).bottom);
ok('phone hides status bar and start card', !shown($('statbar')) && !shown($('startCard')));
for (const id of ['tsExplore', 'tsLearn', 'tsRun']) ok(id + ': reachable touch tab', shown($(id)) && R($(id)).height >= 40 && R($(id)).width >= 40);
ok('Learn responds to a real touch tap', A.strip.tab === 'learn' && shown($('rowLearn')));
A.inspect('tf'); await sleep(1800); scrollTo(0, 0);
ok('Part bar stays over view on phone', shown($('isobar')) && inside(R($('isobar')), R($('card'))) && $('isobar').contains($('bDone')) && !$('rowPart').contains($('bDone')));
ok('selected Part tab is reachable', shown($('tsPart')) && R($('tsPart')).height >= 40);
$('bMore').click();
ok('Part bar buttons have 40px touch targets', [...$('isobar').querySelectorAll('button')].filter(shown).every(e=>R(e).height >= 40 && R(e).width >= 40));
$('bDone').click(); await sleep(2400); $('tsRun').click(); await sleep(600); scrollTo(0, 0);
ok('desk bar stays over view on phone', A.desk.on && shown($('deskbar')) && inside(R($('deskbar')), R($('card'))) && $('deskbar').contains($('bDeskDone')));
ok('desk controls are below view in inspector', $('inspBody').contains($('desk')) && R($('desk')).top >= R($('card')).bottom);
ok('desk Done has 40px touch target', R($('bDeskDone')).height >= 40 && R($('bDeskDone')).width >= 40);
ok('no horizontal page scroll', document.documentElement.scrollWidth <= innerWidth);
return finish();

