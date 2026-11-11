// The desk in the view at this window's size, theme and text size: nothing overlaps, and the machine is in the open.
await open(); await ready(); $('dkHv').click(); await settle(2400);
const R = (e) => e.getBoundingClientRect();
const clear = (a, b) => a.right <= b.left + 0.5 || b.right <= a.left + 0.5 || a.bottom <= b.top + 0.5 || b.bottom <= a.top + 0.5;
const card = R($('card')), desk = R($('desk')), nav = R($('navCluster')), bar = R($('deskbar')), foot = R(document.querySelector('.corner.bl')), triad = R($('triad'));
const size = `${innerWidth}×${innerHeight}`;
ok(`${size}: the desk is inside the view`, desk.left >= card.left && desk.top >= card.top && desk.right <= card.right && desk.bottom <= card.bottom, `${Math.round(desk.width)}×${Math.round(desk.height)}`);
ok(`${size}: the view's buttons lie in a row under the desk`, $('navCluster').classList.contains('row') && clear(desk, nav), `desk bottom ${Math.round(desk.bottom)}, buttons top ${Math.round(nav.top)}`);
ok(`${size}: the wheel is away`, !$('wheel').getClientRects().length);
ok(`${size}: the bar stands beside the desk, clear of the triad`, clear(desk, bar) && clear(bar, triad), `bar ${Math.round(bar.left)}–${Math.round(bar.right)}`);
ok(`${size}: the scale bar and the hint are clear of the desk and the buttons`, clear(desk, foot) && clear(nav, foot));
// The machine: its vessel and its stand, right of the desk.
const V = A.goal.target.constructor, left = Math.min(...['vessel', 'table', 'tf'].map((id) => A.screenRect(A.boxOfPart(id)).x0)) + R($('stage')).left;
ok(`${size}: the machine stands right of the desk`, left >= desk.right - 2, `machine from ${Math.round(left)}, desk to ${Math.round(desk.right)}`);
// At the usual text size the whole desk shows, STOP and SHUT DOWN included; at a larger one it scrolls.
ok(`${size}: ${A.uiScale() > 1 ? 'the desk scrolls where it is cut' : 'the whole desk shows, STOP included'}`, A.uiScale() > 1 ? getComputedStyle($('desk')).overflowY === 'auto' : $('desk').scrollHeight <= $('desk').clientHeight + 1, `${$('desk').scrollHeight} in ${$('desk').clientHeight}`);
ok(`${size}: no sideways scroll`, document.documentElement.scrollWidth <= innerWidth);
ok(`${size}: readbacks are not clipped`, [...$('desk').querySelectorAll('.dk-rd')].every((o) => o.scrollWidth <= o.clientWidth + 1), [...$('desk').querySelectorAll('.dk-rd')].filter((o) => o.scrollWidth > o.clientWidth + 1).map((o) => o.textContent).join('|'));
return out;
