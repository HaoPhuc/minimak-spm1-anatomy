const names = { light: 'Colour', greyscale: 'Greyscale', blueprint: 'Blueprint', dark: 'Hologram' };
for (const [theme, name] of Object.entries(names)) {
  $('bLook').click();
  ok(name + ': menu opens', shown($('looks')) && $('bLook').getAttribute('aria-expanded') === 'true');
  const b = $('looks').querySelector('[data-look="' + theme + '"]');
  b.focus(); b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); await sleep(300);
  ok(name + ': pick applies and names the theme', document.documentElement.dataset.theme === theme && $('lookName').textContent === name && b.getAttribute('aria-checked') === 'true');
  ok(name + ': pick closes and returns focus', $('looks').hidden && document.activeElement === $('bLook'));
}
// A mouse click leaves focus on the launcher: Esc must work there too.
$('bLook').focus(); $('bLook').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); key('Escape');
ok('Esc from launcher closes menu', $('looks').hidden && document.activeElement === $('bLook'));
if (!$('looks').hidden) $('bLook').click();
$('bLook').click(); key('Escape');
ok('Esc from a theme closes and returns focus', $('looks').hidden && document.activeElement === $('bLook'));
$('bLook').click(); $('strip').querySelector('.brand').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
ok('outside press closes and returns focus from menu', $('looks').hidden && document.activeElement === $('bLook'));
$('bHelp').click();
ok('Controls explains the moved strip and Blueprint fold, with no 360° button', $('inspBody').textContent.includes('view strip at the top left of the view') && !$('inspBody').textContent.includes('360°') && $('inspBody').textContent.includes('Blueprint title-block chevron: click, Enter or Space'));
return finish();

