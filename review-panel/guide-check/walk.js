// Every step in turn: opened, then Show this step where it has one. One line per step.
const S = __spm1.GUIDE_STEPS, g = __spm1.guide, out = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ring = () => !document.getElementById('gRing').hidden;
document.getElementById('bGuide').click();
for (let i = 0; i < S.length; i++) {
  const s = S[i];
  __spm1.guideGo(i);
  const t0 = performance.now();
  while (!g.ready && performance.now() - t0 < 9000) await sleep(50);
  // guide.ready is set by guideGo; the ring is painted by the next guideTick.
  // Wait for that frame (and its layout), including on a busy touch renderer.
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
  const ready = g.ready, before = g.ok, r0 = ring(), reach = document.getElementById('gReach').textContent;
  let after = '-';
  if (s.act && !/use\.(tour|quiz|desk)/.test(s.id)) { await __spm1.gShowStep(); await sleep(2400); after = g.ok; }
  out.push(`${i + 1} ${s.id}: ready=${ready} before=${before} after=${after} ring=${r0}${reach ? ' reach=' + reach : ''}`);
}
return out;
