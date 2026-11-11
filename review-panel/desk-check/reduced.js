// With reduced motion nothing ramps or drifts: the pressure, a coil's current and the glow are there at once.
await open();
$('dkInit').click(); $('dkPump').click(); set('dkGas', 45); await sleep(250);
ok('the pressure is there at once', near(d.p, 0.4, 0.02), d.p.toFixed(3));
set('dkSet-tf1', 40); $('dkCoil-tf1').click(); $('dkHv').click(); await sleep(250);
ok('the current and the glow are there at once', d.coils.tf1.I === 40 && d.struck && near(d.now.k, A.deskGlow(A.deskFields()).k, 0.01), `I ${d.coils.tf1.I}, k ${d.now.k.toFixed(2)}`);
ok('the nudge does not animate', getComputedStyle($('dkInit')).animationName === 'none');
return out;
