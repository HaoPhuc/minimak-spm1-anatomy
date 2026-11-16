// The tour, the quiz and the control desk take over from the guide; the standalone controls still work afterwards.
$('bGuide').click(); await until(() => A.guide.ready);
await go('use.tour'); await A.gShowStep(); await sleep(2500);
log.push(`tour handoff: guide.on=${A.guide.on}, tour stop=${A.iso.tour}, part=${A.iso.part}, quiet=${A.store.quiet}`);
$('bTourNext').click(); await sleep(2500);
log.push(`tour Next: stop=${A.iso.tour}, part=${A.iso.part}`);
$('bDone').click(); await sleep(3000);
log.push(`tour Done: part=${A.iso.part}, tour=${A.iso.tour}`);
$('bGuide').click(); await until(() => A.guide.ready);
await go('use.quiz'); await A.gShowStep(); await sleep(2500);
log.push(`quiz handoff: guide.on=${A.guide.on}, quiz.on=${A.quiz.on}, question=${A.quiz.list[A.quiz.i]}`);
// Choose a known correct place, not the alphabetically first (possibly wrong) answer.
const answer = A.quiz.places[0].userData.part;
$('quizChoices').querySelector(`[data-part="${answer}"]`).click(); await sleep(2500);
log.push(`quiz answered: answered=${A.quiz.answered}`);
$('bQuizDone').click(); await sleep(1500);
log.push(`quiz Done: quiz.on=${A.quiz.on}`);
// main predates the control desk; keep the shared comparison runnable there.
if (A.desk) {
$('bGuide').click(); await until(() => A.guide.ready);
await go('use.desk'); await A.gShowStep(); await sleep(2000);
log.push(`desk handoff: guide.on=${A.guide.on}, desk.on=${A.desk.on}, quiet=${A.store.quiet}, focus=${document.activeElement.id}`);
$('bDeskDone').click(); await sleep(1500);
log.push(`desk Done: desk.on=${A.desk.on}`);
} else log.push('desk: unavailable on baseline');
const h0 = history.length;
$('bExplode').click(); await sleep(1500); const ex = A.state.explode;
$('bExplode').click(); await sleep(1500);
$('bCut').click(); const cut = A.state.cut; $('bCut').click();
A.inspect('viewport'); await sleep(2500); $('bNext').click(); await sleep(1500);
$('bApart').click(); await sleep(1500); $('bStepNext').click(); await sleep(800);
const st = { part: A.iso.part, focus: A.iso.focus?.userData.label, apart: A.iso.apart, step: A.iso.step };
await sleep(800);
const hash = location.hash;
$('bDone').click(); await sleep(3000);
log.push(`standalone: explode ${ex} then ${A.state.explode}, cut ${cut} then ${A.state.cut}, inspect ${JSON.stringify(st)}, after Done part=${A.iso.part}`);
log.push(`address written again outside the guide: ${hash.slice(0, 60)}; history ${h0} -> ${history.length}`);
return log;
