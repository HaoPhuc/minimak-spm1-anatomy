// A whole run by the desk's own buttons: each rule answers, the readbacks read, the tasks tick, the monitor draws.
const lum = () => { const cv = $('dkVideo'), c = cv.getContext('2d'), p = c.getImageData(cv.width * 0.45, cv.height * 0.5, 8, 8).data; let s = 0; for (let i = 0; i < p.length; i += 4) s += p[i] + p[i + 1] + p[i + 2]; return s / (p.length / 4) / 3; };
await open();
ok('opens from the Machine tab', d.on && $('deskbar').classList.contains('on') && !$('desk').hidden);
ok('cutaway on, list folded, Machine tab is the desk', A.state.cut && !A.panels.tree && $('inspBody').querySelector('h2')?.textContent === 'Control desk');
ok('focus on INITIALISE', document.activeElement.id === 'dkInit');
await sleep(500);
ok('address says desk=1', /(^#|&)desk=1/.test(location.hash), location.hash.split('&')[0]);
ok('scene: not connected', d.scene === 'off');

$('dkCoil-tf1').click(); $('dkHv').click();
ok('a supply refuses before INITIALISE', !d.coils.tf1.on && !d.hv && /INITIALISE/.test($('status').textContent), $('status').textContent);
ok('the pump works by hand, without the I/O', (() => { $('dkPump').click(); const on = d.pump; $('dkPump').click(); return on && !d.pump; })());

await ready();
ok('pumped down with gas in: 0.40 mbar, ready', near(d.p, 0.4, 0.02) && d.scene === 'ready' && d.done.has('vac'), `${d.p.toFixed(2)} mbar, ${d.scene}`);
ok('gauge reads it', $('dkP').textContent === '0.40 mbar', $('dkP').textContent);
const dark = lum();

$('dkHv').click(); await settle(1800);
ok('GLOW ON strikes the glow', d.struck && d.scene === 'glow' && d.done.has('glow') && /glow$/.test($('dkHvOut').textContent), $('dkHvOut').textContent);
ok('even glow: no striations to speak of, full minor radius, centred', near(d.now.k, 0.6, 0.05) && d.now.stri < 0.1 && near(d.now.minor, 5, 0.05) && near(d.now.z, 0, 0.05), `k ${d.now.k.toFixed(2)} stri ${d.now.stri.toFixed(2)}`);
ok('VIDEO 1 lights with the glow', lum() > dark + 40, `${dark.toFixed(0)} → ${lum().toFixed(0)}`);
ok('tracking says it fills the vessel', /fills the vessel/.test($('dkTrack').textContent), $('dkTrack').textContent);

set('dkSet-tf1', 55);
ok('a setpoint stops at 40 A', +$('dkSet-tf1').value === 40 && d.coils.tf1.set === 40);
set('dkSet-tf2', 40); $('dkCoil-tf1').click(); $('dkCoil-tf2').click(); await settle();
const f = A.deskFields();
ok('TF 40 A on both banks: 13.9 mT on the axis', near(f.Btf, 13.92, 0.05) && $('dkI-tf1').textContent === '40.0 A 13.9 mT', $('dkI-tf1').textContent);
ok('brighter and striated', d.now.k > 1.2 && d.now.stri > 0.7 && d.scene === 'tf' && d.done.has('tf'), `k ${d.now.k.toFixed(2)} stri ${d.now.stri.toFixed(2)}`);
ok('the eight TF coils are lit on the model', A.deskLive.size === 8 && [...A.deskLive].every((pc) => pc.userData.part === 'tf'), String(A.deskLive.size));
$('dkCoil-tf2').click(); await sleep(300);
ok('one bank off: four coils lit, half the field to come', A.deskLive.size === 4);
$('dkCoil-tf1').click(); await settle(1800);

set('dkSet-pf1', 12); set('dkSet-pf2', 6); $('dkCoil-pf1').click(); $('dkCoil-pf2').click(); await settle();
ok('PF1 above PF2: a ring, moved up', near(d.now.minor, 2.3, 0.1) && near(d.now.z, 3.2, 0.1) && d.scene === 'pf' && d.done.has('pf'), `minor ${d.now.minor.toFixed(2)} z ${d.now.z.toFixed(2)}`);
ok('tracking reads its height', /\+32 mm above the midplane/.test($('dkTrack').textContent), $('dkTrack').textContent);
set('dkSet-pf1', 6); set('dkSet-pf2', 12); await settle();
ok('swapped: moved down', near(d.now.z, -3.2, 0.1), `z ${d.now.z.toFixed(2)}`);
ok('the ring stays inside the vessel', Math.abs(d.now.z) + d.now.minor * 1.38 < 7.5);
$('dkCoil-pf1').click(); $('dkCoil-pf2').click(); await settle(1500);

set('dkGas', 100); await until(() => !d.struck, 6000); await sleep(200);
ok('too much gas: the glow goes out', !d.struck && d.hv && d.scene === 'thick' && /no glow/.test($('dkHvOut').textContent), `${d.p.toFixed(2)} mbar, ${$('dkHvOut').textContent}`);
set('dkGas', 0); await until(() => d.p < 0.05, 8000); await sleep(200);
ok('too little gas: no glow either', !d.struck && d.scene === 'thin', `${d.p.toFixed(3)} mbar`);
set('dkGas', 45); await until(() => d.struck, 8000);
ok('back in the window it strikes again', d.struck);

set('dkProg', '1'); set('dkIv', 100); $('dkSeq').click(); await sleep(300);
ok('SEQUENCE runs', !!d.seq && $('dkSeq').getAttribute('aria-pressed') === 'true');
await until(() => !d.seq, 8000); await sleep(200);
ok('the program ends by itself, its frames kept', !d.seq && d.rec.length === 17 && d.done.has('seq') && d.done.size === 5, `${d.rec.length} frames, done ${[...d.done]}`);
document.querySelector('[data-fk="mon:replay"]').click(); await sleep(200);
set('dkFrame', 8); await sleep(200);
ok('REPLAY shows a kept frame', d.replay === 8 && d.rec[8].say === 'TF 40 A' && d.rec[8].glow.stri > 0.7, d.rec[8].say);
document.querySelector('[data-fk="replay:play"]').click(); await sleep(700);
ok('Animate steps through the frames', d.playing && d.replay !== 8, String(d.replay));
document.querySelector('[data-fk="mon:hall"]').click(); await sleep(200);
ok('HALL reads the fields', /mT$/.test($('dkBtf').textContent) && /mT$/.test($('dkBpf').textContent), `${$('dkBtf').textContent}, ${$('dkBpf').textContent}`);
document.querySelector('[data-fk="mon:spec"]').click(); await sleep(200);
ok('SPECTROMETER draws', !!$('dkSpec') && !$('dkVideo'));
document.querySelector('[data-fk="mon:video"]').click(); await sleep(200);
ok('every task ticked', $('inspBody').querySelectorAll('.dk-tasks li.done').length === 5);
return out;
