page('explore');
ok('Inspecting is absent on arrival', $('tsPart').hidden && !shown($('tsPart')));
$('tsLearn').click(); page('learn'); $('tsExplore').click(); page('explore');
A.select('tf'); await sleep(300);
ok('selection shows its name and count beside Explore', shown($('gSelected')) && $('selectionName').textContent === 'Toroidal field coils' && $('selectionCount').textContent === '×8');
ok('selection keeps Explore and the model assembled', !shown($('tsPart')) && shown($('bExplode')) && shown($('bCut')) && A.iso.part === null); page('explore');
$('tsLearn').click(); A.applyLink('#select=viewport'); page('learn');
ok('selection link updates the chip and inspector', $('selectionName').textContent === 'Viewports' && A.tab() === 'part');
$('bClearSelected').click(); page('learn');
ok('clear removes the chip and returns focus to Learn', !shown($('gSelected')) && !A.state.select && document.activeElement === $('tsLearn'));
A.select('tf'); $('bInspectSelected').click(); await sleep(1600);
ok('Inspect reveals the named mode tab', A.iso.part === 'tf' && shown($('tsPart')) && $('tsPartName').textContent === 'Toroidal field coils'); page('part');
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


