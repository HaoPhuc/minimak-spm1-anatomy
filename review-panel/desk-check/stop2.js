// Second half, after the click on the emergency stop.
await settle(1500);
ok('a click on the emergency stop trips the desk', d.trip && !d.io && !d.hv && !d.struck && Object.values(d.coils).every((x) => !x.on && x.I === 0), `trip ${d.trip}, I ${d.coils.tf1.I}`);
ok('the pump keeps running', d.pump);
ok('it says so', d.scene === 'trip' && $('dkIo').textContent === 'E-STOP' && /Emergency stop/.test($('status').textContent), $('dkIo').textContent);
ok('the click selected nothing', A.state.select === null);
$('dkHv').click();
ok('nothing switches on while it is tripped', !d.hv && /reset/.test($('status').textContent), $('status').textContent);
$('dkInit').click(); await sleep(200);
ok('INITIALISE resets it', d.io && !d.trip && $('dkIo').textContent === 'I/O ready');

$('dkHv').click(); $('dkCoil-pf1').click(); set('dkProg', '3'); $('dkSeq').click(); await sleep(400);
$('dkStop').click(); await settle(1200);
ok('STOP: sequence ended, high voltage and coils off, I/O and vacuum as they were', !d.seq && !d.hv && Object.values(d.coils).every((x) => !x.on) && d.io && d.pump && d.gas > 0);
$('dkHv').click(); await sleep(300);
$('dkDown').click(); await sleep(300);
ok('SHUT DOWN: everything off', !d.hv && !d.pump && d.gas === 0 && !d.io && +$('dkGas').value === 0 && d.scene !== 'trip');
return out;
