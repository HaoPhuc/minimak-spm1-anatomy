$('tsLearn').click(); page('learn'); $('bGuide').focus(); $('bGuide').click(); await until(() => A.guide.ready);
ok('Guided analysis starts and focuses question', A.guide.on && document.activeElement === $('gQ'));
$('gExit').click(); await sleep(1200);
ok('guide Exit returns focus to visible launcher', !A.guide.on && shown($('bGuide')) && document.activeElement === $('bGuide'));
$('tsLearn').click(); $('bTour').click(); await sleep(1800);
ok('Take the tour starts at stop one', A.iso.tour === 0 && A.iso.part === 'vessel'); $('bDone').click(); await sleep(2400);
$('tsLearn').click(); $('bQuiz').click(); await sleep(1800);
ok('Where does it go starts quiz', A.quiz.on && A.quiz.i === 0 && shown($('quizbar')));
$('bQuizDone').click(); await sleep(1200); $('tsLearn').click();
ok('PDF links to downloadable guide', $('aManual').getAttribute('href') === 'docs/user-guide.pdf' && $('aManual').hasAttribute('download'));
$('bKeys').click(); ok('Keys opens Controls', A.tab() === 'help' && A.panels.insp);
$('bSources').click(); ok('Sources opens Sources', A.tab() === 'sources' && A.panels.insp);
return finish();

