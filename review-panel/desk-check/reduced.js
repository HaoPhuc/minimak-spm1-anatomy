// Reduced motion keeps the lesson's rates and intermediate states.
await open();
$('dkInit').click(); $('dkPump').click(); set('dkGas', 45);
ok('pressure falls through Pumping down', await until(() => d.scene === 'pumping' && d.p < 1013 && d.p > A.DESK.pHi));
ok('gas and pump settle in the operating window', await until(() => near(d.p, 0.4, 0.02) && !d.falling && d.scene === 'ready' && d.done.has('vac')));
set('dkSet-tf1', 40); $('dkCoil-tf1').click(); $('dkHv').click();
ok('coil current ramps through an intermediate readback', await until(() => d.coils.tf1.I > 0 && d.coils.tf1.I < 40 && parseFloat($('dkI-tf1').textContent) > 0));
ok('coil settles at its setpoint and the glow responds', await until(() => d.coils.tf1.I === 40 && d.struck && near(d.now.k, A.deskGlow(A.deskFields()).k, 0.01)));
$('dkCoil-tf1').click();
ok('switched-off coil ramps down before settling at zero', await until(() => d.coils.tf1.I > 0 && d.coils.tf1.I < 40) && await until(() => d.coils.tf1.I === 0));
ok('the nudge does not animate', getComputedStyle($('dkInit')).animationName === 'none');
return out;
