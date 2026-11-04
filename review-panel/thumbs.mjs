// The wheel's part pictures: every part on its own, in every theme, cropped round it and saved small.
//
//   node review-panel/thumbs.mjs [siteRoot] [outDir]        (defaults: . and thumbs)
//
// Run it again after a part's drawing changes. For each theme it loads the page, folds both panels, turns the sheets
// and the ghost off, hides the view's own labels and buttons, then inspects each part in turn (DOCS.PARTS order), waits
// for the camera to settle, and crops a square round the part's box on screen, 160 px across, as WebP:
// <outDir>/<theme>/<part id>.webp, with the theme as themeName() gives it (light, greyscale, blueprint, dark).
// Headless Chrome on the GPU (ANGLE d3d11) and CDP, as shot.mjs.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const [root = '.', outDir = 'thumbs'] = process.argv.slice(2);
const THEMES = ['light', 'greyscale', 'blueprint', 'dark'];
const SIZE = 160;

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  fs.readFile(p.endsWith(path.sep) ? path.join(p, 'index.html') : p, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/index.html`;

const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'spm1-thumbs-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${prof}`,
  '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 120 && !wsUrl; i++) {
  await sleep(250);
  try {
    const [port] = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n');
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch { /* not up yet */ }
}
if (!wsUrl) { console.log('Chrome did not start'); process.exit(1); }
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) console.log('  JS error:', JSON.stringify(r.result.exceptionDetails).slice(0, 400));
  return r.result?.result?.value;
};

// Nothing but the part: the view's labels, buttons, bars, sheets and the drawing's frame are hidden (the inspect bar
// keeps its room, so the part is framed as it is when inspected).
const HIDE = '.wheel,.dial,.navcluster,.turn,.corner,.triad,.hud,.callouts,.overlay,.draft,.loupe,.tip,.top,.isobar,.guide{visibility:hidden!important}';
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 900, deviceScaleFactor: 1, mobile: false });
for (const theme of THEMES) {
  fs.mkdirSync(path.join(outDir, theme), { recursive: true });
  await send('Page.navigate', { url: base });
  await sleep(400);
  await evalJs(`localStorage.clear(); localStorage.setItem('spm1-theme', ${JSON.stringify(theme)});`);
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 120; i++) { await sleep(150); if (await evalJs('return !!window.__spm1')) break; }
  await sleep(800);
  const ids = await evalJs(`
    document.head.insertAdjacentHTML('beforeend', '<style>${HIDE}</style>');
    document.getElementById('stage').focus();
    document.getElementById('bPanels').click();
    __spm1.setScreens(false);
    return window.SPM1_DOCS.PARTS.map((p) => p.id);`);
  let ghostOff = false;
  for (const part of ids) {
    await evalJs(`__spm1.inspect(${JSON.stringify(part)});`);
    if (!ghostOff) { await sleep(600); await evalJs(`const b = document.getElementById('bContext'); if (b.getAttribute('aria-pressed') === 'true') b.click();`); ghostOff = true; }
    // The camera glides to the part: wait for it to settle, then for a frame or two.
    for (let i = 0; i < 40; i++) {
      await sleep(100);
      if (await evalJs(`const { view: v, goal: g } = __spm1; return Math.abs(v.zoom - g.zoom) < 1e-4 * g.zoom && v.target.distanceTo(g.target) < 1e-3 && Math.abs(v.az - g.az) < 0.01;`)) break;
    }
    await sleep(400);
    const r = await evalJs(`
      const s = __spm1.screenRect(__spm1.boxOfPart(${JSON.stringify(part)})), c = document.getElementById('canvas').getBoundingClientRect();
      return { x0: c.left + s.x0, y0: c.top + s.y0, x1: c.left + s.x1, y1: c.top + s.y1, w: c.width, h: c.height, l: c.left, t: c.top };`);
    // A square round the part's box, a little larger, kept inside the view.
    const side = Math.min(Math.max(r.x1 - r.x0, r.y1 - r.y0) * 1.08 + 12, r.w, r.h);
    const cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2;
    const x = Math.min(Math.max(cx - side / 2, r.l), r.l + r.w - side), y = Math.min(Math.max(cy - side / 2, r.t), r.t + r.h - side);
    const shot = await send('Page.captureScreenshot', { format: 'webp', quality: 82, clip: { x, y, width: side, height: side, scale: SIZE / side } });
    fs.writeFileSync(path.join(outDir, theme, `${part}.webp`), Buffer.from(shot.result.data, 'base64'));
    console.log(`  ${theme}/${part}.webp`);
  }
}
ws.close();
chrome.kill();
server.close();
setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* still locked */ } process.exit(0); }, 500);
