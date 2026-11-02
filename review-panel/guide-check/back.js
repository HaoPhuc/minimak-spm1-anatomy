// Browser Back during the guide gives everything back first, then goes back as usual.
A.applyLink('#part=tf');
await sleep(2500);
A.inspect('pump');
await sleep(2500);
const h0 = history.length;
$('bGuide').click(); await until(() => A.guide.ready);
await go('inside.themes'); await A.gShowStep(); await sleep(600);
log.push(`in the guide: theme ${document.documentElement.dataset.theme}, part ${A.iso.part}, history ${history.length} (was ${h0})`);
history.back();
await sleep(3000);
log.push(`after Back: guide.on=${A.guide.on}, quiet=${A.store.quiet}, part=${A.iso.part}, theme=${document.documentElement.dataset.theme}, address ${location.hash.split('&')[0]}`);
return log;
