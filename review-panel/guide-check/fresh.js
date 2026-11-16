// The first visit must not save the panels temporarily opened by the guide.
// Stop the idle turntable, then let the address settle before comparing camera state.
A.setSpinAxis(false); $('stage').focus(); $('bHome').click(); await sleep(1500);
$('tsLearn').click(); $('bGuide').focus();
const before = snap(), stripBefore = A.strip.tab, gone = A.strip.startGone;
$('bGuide').click(); await until(() => A.guide.ready);
log.push('fresh guide storage: ' + (snap().ls === before.ls ? 'unchanged' : 'CHANGED'));
await go('orient.scale'); await sleep(150);
log.push('desktop scale target: ' + A.GUIDE_STEPS[A.guide.i].target().id + ', ring=' + !$('gRing').hidden);
$('gExit').click(); await sleep(2500);
const changes = diff(before, snap());
log.push(changes.length ? 'FRESH EXIT DIFF: ' + changes.join(' ; ') : 'fresh Exit: everything as it was');
log.push('fresh strip restored=' + (A.strip.tab === stripBefore && A.strip.startGone === gone) + ', launcher=' + (document.activeElement === $('bGuide')));
return log;
