$('bStartX').click(); $('bList').click(); await sleep(300);
ok('List opens list and hides wheel', A.panels.tree && shown($('treePanel')) && !shown($('wheel')) && $('bList').getAttribute('aria-pressed') === 'true');
$('bWheel').click(); await sleep(300);
ok('Wheel closes list and shows wheel', !A.panels.tree && !shown($('treePanel')) && shown($('wheel')) && $('bWheel').getAttribute('aria-pressed') === 'true');
$('bExplode').click(); await sleep(200);
ok('Explode reveals Spread', A.state.explode && shown($('spreadWrap')) && $('bExplode').getAttribute('aria-pressed') === 'true');
set('sSpread', 1.8); ok('Spread sets separation and readout', Math.abs(A.state.spread - 1.8) < .001 && $('oSpread').textContent.includes('1.8'));
$('bExplode').click(); ok('assemble hides Spread', !A.state.explode && !shown($('spreadWrap')));
$('bCut').click(); ok('Cutaway turns on', A.state.cut && $('bCut').getAttribute('aria-pressed') === 'true');
$('bCut').click(); ok('Cutaway turns off', !A.state.cut);
$('bLinkHere').click(); await until(() => /link/i.test($('status').textContent));
ok('Copy link writes address and announces result', location.hash.includes('view=') && /link.*(copied|address bar)/i.test($('status').textContent), $('status').textContent);
$('bFind').click(); ok('Find button opens and focuses search', A.panels.tree && document.activeElement === $('search'));
set('search', 'M8'); await sleep(250);
ok('search returns matching hardware', [...$('tree').querySelectorAll('.ti-hit')].some(e => shown(e) && /bolts|nuts/i.test(e.textContent)));
set('search', 'zzzz-no-such-part'); await sleep(250);
ok('search removes nonmatching rows', ![...$('tree').querySelectorAll('.ti[data-part]')].some(shown) && /Nothing matches/.test($('searchNote').textContent));
set('search', ''); $('stage').focus(); A.setPanel('tree', false); key('/');
ok('/ opens and focuses search', A.panels.tree && document.activeElement === $('search'));
$('bPanels').click(); await sleep(300);
ok('Panels hides both side panels', !A.panels.tree && !A.panels.insp && !shown($('treePanel')) && !shown($('inspPanel')));
$('bPanels').click(); await sleep(300);
ok('Panels shows both side panels', A.panels.tree && A.panels.insp && shown($('treePanel')) && shown($('inspPanel')));
$('bHelp').click(); ok('Help opens Controls', A.tab() === 'help' && shown($('inspPanel')));
return finish();


