// Screenshot driver for the review panel: a static server + headless Chrome on the GPU (ANGLE d3d11) + CDP.
//
//   node shot.mjs <siteRoot> <scenarios.json> <outDir>
//
// scenarios.json is an array of scenarios. Each one loads the page fresh (localStorage cleared, then `theme` and
// `setup` applied, then reloaded) at its own size, runs its `steps` in order, and saves every `shot` step as a PNG.
//
//   { "name": "tf-apart", "w": 1440, "h": 900,            // viewport (default 1440×900)
//     "dpr": 1, "mobile": false,                           // mobile: true emulates a touch phone (taps via "tap")
//     "dark": false,                                       // emulate prefers-color-scheme: dark
//     "theme": "light" | "greyscale" | "dark",             // saved theme ('dark' = hologram)
//     "setup": "js run before the reload, e.g. localStorage",
//     "steps": [
//       { "js": "__spm1.inspect('tf')" },                  // body of an async function; a returned value is printed
//       { "wait": 2500 },                                   // ms
//       { "keys": ["Tab", "Enter", "ArrowRight", "Escape", "i", "."] },
//       { "move": [x, y] }, { "click": [x, y] }, { "dblclick": [x, y] }, { "rclick": [x, y] },
//       { "wheel": [x, y, dy] },                            // dy < 0 zooms in
//       { "drag": [x1, y1, x2, y2] },                       // left-drag in 12 steps
//       { "tap": [x, y] },                                  // touch tap (mobile scenarios)
//       { "shot": "name", "clip": { "x": 0, "y": 0, "width": 400, "height": 300 }, "scale": 2 }
//     ] }
//
// Coordinates are CSS pixels of the viewport. Console errors and page exceptions are printed per scenario.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const [root, scenFile, outDir] = process.argv.slice(2);
const scen = JSON.parse(fs.readFileSync(scenFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };
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

// Each run gets its own profile and lets Chrome pick a free debugging port, so several runs can go at once.
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'spm1-prof-'));
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
const events = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else events.push(d);
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) console.log('  JS error:', JSON.stringify(r.result.exceptionDetails).slice(0, 500));
  return r.result?.result?.value;
};
const KEYS = { Tab: 9, Enter: 13, Escape: 27, ' ': 32, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Backspace: 8, Home: 36, End: 35 };
async function key(k) {
  const vk = KEYS[k] ?? k.toUpperCase().charCodeAt(0);
  const code = k === ' ' ? 'Space' : k.length === 1 ? (/[a-z]/i.test(k) ? `Key${k.toUpperCase()}` : '') : k;
  const text = k === 'Enter' ? '\r' : k.length === 1 ? k : undefined;
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, ...(text ? { text } : {}) });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk });
  await sleep(120);
}
const mouse = (type, x, y, o = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: 'none', ...o });
async function click(x, y, button = 'left', count = 1) {
  await mouse('mouseMoved', x, y);
  for (let c = 1; c <= count; c++) {
    await mouse('mousePressed', x, y, { button, clickCount: c, buttons: button === 'left' ? 1 : 2 });
    await mouse('mouseReleased', x, y, { button, clickCount: c });
  }
}

await send('Page.enable');
await send('Runtime.enable');
for (const s of scen) {
  const w = s.w || 1440, h = s.h || 900;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: s.dpr || (s.mobile ? 2 : 1), mobile: !!s.mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: !!s.mobile, maxTouchPoints: s.mobile ? 5 : 0 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: s.dark ? 'dark' : 'light' }] });
  await send('Page.navigate', { url: base });
  await sleep(400);
  await evalJs(`localStorage.clear(); ${s.theme ? `localStorage.setItem('spm1-theme', ${JSON.stringify(s.theme)});` : ''} ${s.setup || ''}`);
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 100; i++) { await sleep(150); if (await evalJs('!!window.__spm1')) break; }
  await sleep(700);
  console.log(`[${s.name}]`);
  for (const st of s.steps || []) {
    if (st.js) { const v = await evalJs(`(async () => { ${st.js} })()`); if (v !== undefined) console.log('  →', JSON.stringify(v)); }
    if (st.wait) await sleep(st.wait);
    for (const k of st.keys || []) await key(k);
    if (st.move) { await mouse('mouseMoved', ...st.move); await sleep(60); }
    if (st.click) { await click(...st.click); await sleep(120); }
    if (st.rclick) { await click(...st.rclick, 'right'); await sleep(120); }
    if (st.dblclick) { await click(...st.dblclick, 'left', 2); await sleep(120); }
    if (st.wheel) { const [x, y, dy] = st.wheel; await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: dy }); await sleep(80); }
    if (st.drag) {
      const [x1, y1, x2, y2] = st.drag;
      await mouse('mouseMoved', x1, y1);
      await mouse('mousePressed', x1, y1, { button: 'left', clickCount: 1, buttons: 1 });
      for (let i = 1; i <= 12; i++) { await mouse('mouseMoved', x1 + ((x2 - x1) * i) / 12, y1 + ((y2 - y1) * i) / 12, { buttons: 1 }); await sleep(16); }
      await mouse('mouseReleased', x2, y2, { button: 'left', clickCount: 1 });
      await sleep(120);
    }
    if (st.tap) {
      const [x, y] = st.tap;
      await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(150);
    }
    if (st.shot) {
      const shot = await send('Page.captureScreenshot', { format: 'png', ...(st.clip ? { clip: { ...st.clip, scale: st.scale || 1 } } : {}) });
      fs.writeFileSync(path.join(outDir, `${st.shot}.png`), Buffer.from(shot.result.data, 'base64'));
      console.log('  shot', st.shot);
    }
  }
  for (const e of events.filter((e) => e.method === 'Runtime.exceptionThrown' || (e.method === 'Runtime.consoleAPICalled' && (e.params.type === 'error' || e.params.type === 'warning'))))
    console.log('  console:', JSON.stringify(e.params).slice(0, 300));
  events.length = 0;
}
ws.close();
chrome.kill();
server.close();
setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* still locked */ } process.exit(0); }, 500);
