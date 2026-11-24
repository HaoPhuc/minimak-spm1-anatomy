ok('native Previous card tap selects the first kept sheet', $('cardLabel').textContent === 'Kept 1 of 2');
$('bSheetUp').click(); await settled();
ok('drawer is expanded', $('bSheetUp').getAttribute('aria-expanded') === 'true');
checkDrawer('expanded', ok);
return finish();
