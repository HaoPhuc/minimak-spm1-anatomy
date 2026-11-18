// Called after native driver clicks/keys and after real reloads.
const expected = window.__titleExpected || 'folded';
const b = $('readout').querySelector('.tb-fold'), folded = expected === 'folded';
ok(expected + ': title fold and accessible state agree', shown(b) && shown($('readout')) && $('readout').classList.contains('folded') === folded && b.getAttribute('aria-expanded') === String(!folded) && $('readout').querySelector('.tb-details').getAttribute('aria-hidden') === String(folded));
ok(expected + ': details collapse or open', folded ? R($('readout').querySelector('.tb-details')).height < 1 : R($('readout').querySelector('.tb-details')).height > 20);
ok(expected + ': status readout is visible only when folded', shown($('roLine')) === folded);
if (window.__titleSaved) ok(expected + ': choice is saved', localStorage.getItem('spm1-titleblock') === expected);
else ok('first visit folds without writing a preference', localStorage.getItem('spm1-titleblock') === null);
await checkView('title ' + expected);
return finish();
