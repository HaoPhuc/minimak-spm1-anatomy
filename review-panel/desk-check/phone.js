// Where the panels stack (a phone): the desk's panel sits in the Machine tab, under the monitor, and works there.
await open();
ok('the desk opens', d.on && $('deskbar').classList.contains('on'));
ok('its panel is in the Machine tab, under the monitor', $('inspBody').contains($('desk')) && $('desk').classList.contains('in-page') && !!($('dkVideo').compareDocumentPosition($('desk')) & Node.DOCUMENT_POSITION_FOLLOWING));
ok('no sideways scroll', document.documentElement.scrollWidth <= innerWidth, `${document.documentElement.scrollWidth} of ${innerWidth}`);
ok('every switch is a finger wide', [...$('desk').querySelectorAll('button')].every((b) => b.getBoundingClientRect().height >= 44), String(Math.min(...[...$('desk').querySelectorAll('button')].map((b) => Math.round(b.getBoundingClientRect().height)))));
await ready(); $('dkHv').click(); await settle(1800);
ok('a run works from there', d.struck && d.scene === 'glow');
ok('the page re-rendered and kept the panel', $('inspBody').contains($('desk')) && !$('desk').hidden && $('dkHv').getAttribute('aria-pressed') === 'true');
A.deskTrip(); await sleep(300);
ok('the emergency stop trips it', d.trip && !d.struck);
$('bDeskDone').click(); await sleep(500);
ok('Done: the panel is gone from the page, the Machine tab is back', !d.on && !$('inspBody').querySelector('.desk') && !!$('inspBody').querySelector('[data-fk="act:desk"]'));
return out;
