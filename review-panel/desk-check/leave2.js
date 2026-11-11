// After the scenario pressed Esc with the desk open: Esc leaves it, as it leaves the quiz.
await sleep(500);
ok('Esc leaves the desk', !d.on && $('desk').hidden);
return out;
