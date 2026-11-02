// Under prefers-reduced-motion the same states arrive at once.
const t0 = performance.now();
$('bGuide').click(); await until(() => A.guide.ready);
log.push(`reduced motion: first step ready in ${Math.round(performance.now() - t0)} ms, body transition ${getComputedStyle($('gBody')).transitionDuration}, ring animation ${getComputedStyle($('gRing')).animationName}`);
await A.gShowStep(); await sleep(150);
const d = Math.abs(A.view.az - A.goal.az) + Math.abs(A.view.el - A.goal.el) + Math.abs(A.view.zoom - A.goal.zoom);
log.push(`Show this step: part=${A.iso.part}; camera at its goal after 150 ms: ${d < 0.01}`);
const t2 = performance.now(); $('gNext').click(); await until(() => A.guide.ready && A.guide.i === 1);
log.push(`Next ready in ${Math.round(performance.now() - t2)} ms`);
$('gExit').click(); await sleep(150);
log.push(`Exit: camera at its goal after 150 ms: ${Math.abs(A.view.az - A.goal.az) + Math.abs(A.view.zoom - A.goal.zoom) < 0.01}, guide.on=${A.guide.on}`);
return log;
