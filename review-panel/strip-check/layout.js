// Inspect the actual hit areas after scrolling the strip's own overflow, including at 2x text.
const checkLayout = async (state) => {
  scrollTo(0, 0); await settled();
  await checkView(state);
  const controls = [...$('strip').querySelectorAll('button, a[href], input')].filter(shown);
  const clipped = [], overlaps = [], blocked = [];
  for (const e of controls) {
    e.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const r = R(e), top = R($('strip'));
    if (!inside(r, top) || r.left < -.5 || r.right > innerWidth + .5 || r.top < -.5 || r.bottom > innerHeight + .5 || e.scrollWidth > e.clientWidth + 2) clipped.push(e.id || e.textContent.trim());
    const hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2);
    if (!hit || !(hit === e || e.contains(hit))) blocked.push(e.id || e.textContent.trim());
  }
  for (let i = 0; i < controls.length; i++) for (let j = i + 1; j < controls.length; j++) if (!clear(R(controls[i]), R(controls[j]))) overlaps.push((controls[i].id || controls[i].textContent.trim()) + '/' + (controls[j].id || controls[j].textContent.trim()));
  ok(state + ': every strip control fits and is reachable by scrolling', !clipped.length, clipped.join(', '));
  ok(state + ': strip controls do not overlap', !overlaps.length, overlaps.join(', '));
  ok(state + ': strip controls receive pointer input', !blocked.length, blocked.join(', '));
  scrollTo(0, 0);
  const strip = R($('strip')), card = R($('card')), nav = R($('navCluster'));
  ok(state + ': strip clears model viewport and view tools', clear(strip, card) && clear(strip, nav) && inside(R($('stage')), card));
  ok(state + ': view tools stay inside view', inside(nav, card) && (!shown($('turnTable')) || inside(R($('turnTable')), card)));
  // The moved tool row leaves less height: the wheel's existing 82% readability floor still applies.
  const wheelRoom = card.bottom - R($('viewbar')).bottom - 20;
  const wheelExpected = wheelRoom >= 336 * .82 && innerWidth > 960 && !matchMedia('(pointer: coarse)').matches && !A.panels.tree && !A.iso.part && !A.desk.on;
  ok(state + ': wheel visibility follows inspected part, input and folded tree', shown($('wheel')) === wheelExpected);
  if (shown($('wheel'))) {
    const pieces = [$('whRing'), ...$('whGroups').querySelectorAll('button')].filter(shown);
    // whRing's 380px SVG has 22px of empty space above/below its 168px-radius ticks.
    // Measure the drawn ring, not those unpainted margins; all button hit areas remain checked.
    const wheelRect = e => { const r = R(e); return e.id === 'whRing' ? new DOMRect(r.left, r.top + r.height * 22 / 380, r.width, r.height * 336 / 380) : r; };
    const bad = pieces.filter(e => !inside(wheelRect(e), card) || !clear(wheelRect(e), nav) || (shown($('turnTable')) && !clear(wheelRect(e), R($('turnTable')))));
    ok(state + ': wheel stays inside view and clear of view tools', !bad.length, bad.length ? JSON.stringify({card:card.toJSON(),nav:nav.toJSON(),pieces:bad.map(e=>[e.id||e.textContent,R(e).toJSON()])}) : '');
  }
  ok(state + ': status bar visibility follows 520px breakpoint', shown($('statbar')) === (innerWidth > 520));
  ok(state + ': status bar clears strip and view', !shown($('statbar')) || (clear(R($('statbar')), strip) && clear(R($('statbar')), card)));
  ok(state + ': no horizontal page scroll', document.documentElement.scrollWidth <= innerWidth, document.documentElement.scrollWidth + '/' + innerWidth);
};
await checkLayout('Explore');
$('bStartX').click(); $('bExplode').click(); await settled(); await checkLayout('Spread'); $('bExplode').click();
$('tsLearn').click(); await checkLayout('Learn');
A.inspect('viewport'); await settled();
// The nearest viewport depends on the camera glide. Keep the longest Back label in this regression.
A.setFocus([...A.piecesOf.get('viewport')].sort((a, b) => b.userData.label.length - a.userData.label.length)[0]);
$('bApart').click(); await settled(); await checkLayout('Part apart');
const longest = [...SPM1_DOCS.PARTS].sort((a, b) => b.name.length - a.name.length)[0];
A.inspect(longest.id); await checkLayout('Longest part (' + longest.name + ')');
$('tsRun').click(); await settled(); await checkLayout('Run');
if (innerWidth > 960) {
  $('bDeskDone').click(); await settled();
  $('tsLearn').click(); $('bGuide').click();
  for (const id of ['orient.axis', 'orient.views', 'first.steps', 'connect.steps']) {
    await A.guideGo(A.GUIDE_STEPS.findIndex(s => s.id === id));
    if (!id.startsWith('orient.')) await A.gShowStep();
    await settled(); await checkView('Guide ' + id, id === 'orient.views');
    if (id === 'orient.axis') {
      const b = $('bAxis'), r = R(b), hit = document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2);
      ok('Guide rings accessible axis button', !$('gRing').hidden && b.contains(hit) && inside(r,R($('gRing')), 3));
    } else if (!id.startsWith('orient.')) ok('Guide step caption is visible and scrollable', shown($('stepCap')) && R($('stepCap')).height > 0 && getComputedStyle($('isobar')).overflowY === 'auto');
  }
  $('gExit').click(); await settled();
}
return finish();

