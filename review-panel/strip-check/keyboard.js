const phase = window.__keyPhase;
if (phase === 'learn') { ok('Tab reaches Learn from Explore', document.activeElement === $('tsLearn')); }
if (phase === 'run') { ok('Enter activates Learn', A.strip.tab === 'learn'); ok('Tab reaches Run', document.activeElement === $('tsRun')); }
if (phase === 'desk') { ok('Enter on Run opens desk', A.desk.on); $('bDeskDone').click(); A.select('tf'); $('bLinkHere').focus(); }
if (phase === 'part') { ok('Tab reaches the selection chip’s Inspect action', document.activeElement === $('bInspectSelected')); }
if (phase === 'inspect') { ok('Enter on Inspect lifts the selected part', A.iso.part === 'tf'); }
return finish();

