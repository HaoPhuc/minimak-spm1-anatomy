// The incoming state: a deep link with its sheet kept and folded, and the table hidden.
A.applyLink('#part=gaskets&piece=right-back&sheets=ofhc-copper-gasket');
await sleep(3500);
document.querySelector('.screen[data-key="pin|gaskets|OFHC copper gasket"] .fold-btn')?.click();
document.querySelector('#tree .ti[data-part="table"] .eye')?.click();
await sleep(1200);
const before = snap();
log.push('incoming: ' + JSON.stringify({ part: before.part, focus: before.focus, pins: before.pins, folded: before.folded, hidden: before.hidden, hash: before.url.split('#')[1] }));
$('bGuide').click();
await sleep(300);
for (let k = 0; k < 12; k++) { $('gNext').click(); await sleep(90); }
for (let k = 0; k < 5; k++) { $('gBack').click(); await sleep(70); }
await until(() => A.guide.ready);
log.push(`rapid Next x12, Back x5: settled on step ${A.guide.i + 1} (${A.GUIDE_STEPS[A.guide.i].id}), ready=${A.guide.ready}`);
for (const id of ['inside.themes', 'inside.dims', 'use.settings', 'find.hide', 'orient.panels', 'inside.explode', 'inside.spread', 'evidence.float', 'first.sheet', 'connect.ghost']) { await go(id); await A.gShowStep(); await sleep(900); }
const during = snap();
log.push(`during the guide: history ${during.hl === before.hl ? 'unchanged' : 'CHANGED'}, storage ${during.ls === before.ls ? 'unchanged' : 'CHANGED'}, address ${during.url === before.url ? 'unchanged' : 'CHANGED'}`);
A.guideGo(idx('first.find')); await sleep(120);
$('gExit').click();
await sleep(3000);
const after = snap();
const d = diff(before, after);
log.push(d.length ? 'EXIT DIFF: ' + d.join(' ; ') : 'Exit mid-glide: everything as it was');
log.push(`focus after Exit: ${document.activeElement?.id || document.activeElement?.tagName}`);
await sleep(3000);
const d2 = diff(after, snap());
log.push(d2.length ? 'STALE CHANGES: ' + d2.join(' ; ') : 'no stale callbacks 3 s after Exit');
$('bGuide').click();
await until(() => A.guide.ready);
log.push(`replay: ${[...document.querySelectorAll('#gStep button')].map((b) => b.textContent).join(',') || 'no resume'}`);
await go(A.GUIDE_STEPS.at(-1).id);
$('gNext').click();
await sleep(3000);
const d3 = diff(before, snap());
log.push(d3.length ? 'FINISH DIFF: ' + d3.join(' ; ') : 'Finish: everything as it was');
return log;
