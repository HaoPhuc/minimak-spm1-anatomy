ok('Start here stays dismissed on a later visit or part address', $('startCard').hidden && A.strip.startGone);
if (location.hash.includes('part=')) ok('a part address goes straight to Part', A.iso.part === 'tf' && A.strip.tab === 'part');
return finish();

