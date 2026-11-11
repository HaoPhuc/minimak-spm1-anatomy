// The emergency stop (a real click on it in the model, by the scenario's next step), then STOP and SHUT DOWN.
// First half: a glow in a toroidal field, and where the emergency stop is on screen.
await open(); await ready();
$('dkHv').click(); set('dkSet-tf1', 30); $('dkCoil-tf1').click(); await settle(1800);
ok('running: glow and TF B1', d.struck && d.coils.tf1.I > 29);
const pc = A.piecesOf.get('estop')[0], c = A.boxOfPiece(pc).getCenter(new A.goal.target.constructor()), s = A.toScreen(c), r = $('stage').getBoundingClientRect();
window.__estop = [Math.round(r.left + s.x), Math.round(r.top + s.y)];
ok('the emergency stop is in the view, clear of the desk', A.pickAt(...window.__estop)?.part === 'estop' && window.__estop[0] > $('desk').getBoundingClientRect().right, String(window.__estop));
return out;
