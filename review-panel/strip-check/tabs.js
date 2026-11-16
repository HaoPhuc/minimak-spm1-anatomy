page('explore');
ok('Part is absent without a selection', $('tsPart').hidden && !shown($('tsPart')));
$('tsLearn').click(); page('learn'); $('tsExplore').click(); page('explore');
A.select('tf'); await sleep(300);
ok('selection reveals Part with the part name', shown($('tsPart')) && $('tsPartName').textContent === 'Toroidal field coils');
ok('selection switches to Part without isolating the machine', A.strip.tab === 'part' && A.iso.part === null); page('part');
$('tsPart').click(); await sleep(1600);
ok('Part inspects the selected part', A.iso.part === 'tf'); page('part');
$('bDone').click(); await sleep(2400); page('explore'); ok('Done returns the machine', !A.iso.part);
A.inspect('tf'); await sleep(1600); $('stage').focus(); key('Escape'); await sleep(2400);
ok('Esc returns to Explore', !A.iso.part && A.strip.tab === 'explore');
A.applyLink('#part=pump'); await sleep(1800);
ok('a part address opens Part', A.iso.part === 'pump' && A.strip.tab === 'part');
A.applyLink('#'); await sleep(2400);
ok('an assembly address returns to Explore', !A.iso.part && A.strip.tab === 'explore');
$('bLinkHere').click(); await sleep(100); const before = location.hash;
A.inspect('tf'); await sleep(1600); $('bLink').click(); await sleep(100); history.back(); await sleep(2600);
ok('browser Back returns to the previous assembly address', !A.iso.part && A.strip.tab === 'explore' && location.hash === before, location.hash);
$('tsRun').click(); await sleep(500); page('run'); ok('Run opens the desk', A.desk.on);
$('bDeskDone').click(); await sleep(600); page('explore'); ok('desk Done leaves Run', !A.desk.on);
return finish();


