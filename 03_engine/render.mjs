// Stone Age Upgrade — render engine
// Usage: node render.mjs <scene.html> <out.mp4> [--w 1920 --h 1080 --fps 30 --from 0 --to <dur> --audio file --crf 18 --cap jpeg|png --jq 93 --preset veryfast --qp 0 --dsf 1.3333333333]
// --dsf keeps the 1920x1080 layout and captures at higher pixel density (2K: --dsf 1.3333333333 -> 2560x1440)
import { createRequire } from 'module';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
const require = createRequire(import.meta.url);
import { chromium, chromePath } from './env.mjs';

const args = process.argv.slice(2);
const scene = path.resolve(args[0]);
const out = path.resolve(args[1]);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const W = +opt('w', 1920), H = +opt('h', 1080), FPS = +opt('fps', 30), CRF = opt('crf', '20');
const audio = opt('audio', null);
const DSF = +opt('dsf', 1);
const CAP = opt('cap', 'jpeg'), JQ = +opt('jq', 93), PRESET = opt('preset', 'veryfast'), QP = opt('qp', null);

const browser = await chromium.launch({
  executablePath: chromePath,
  args: ['--force-color-profile=srgb', '--disable-gpu-vsync', '--hide-scrollbars', '--font-render-hinting=none'],
});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.goto('file://' + scene + `?w=${W}&h=${H}`);
await page.waitForFunction(() => window.SAU && window.SAU.ready === true, null, { timeout: 30000 });
const dur = await page.evaluate(() => window.SAU.duration);
const from = +opt('from', 0), to = +opt('to', dur);
const frames = Math.round((to - from) * FPS);

const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', CAP === 'png' ? 'png' : 'mjpeg', '-i', '-'];
if (audio) ffArgs.push('-ss', String(from), '-t', String(to - from), '-i', audio);
ffArgs.push('-c:v', 'libx264', '-preset', PRESET, ...(QP !== null ? ['-qp', QP] : ['-crf', CRF]), '-pix_fmt', 'yuv420p', '-r', String(FPS));
if (audio) ffArgs.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
ffArgs.push('-movflags', '+faststart', out);
const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });

const cdp = await page.context().newCDPSession(page);
const t0 = Date.now();
for (let i = 0; i < frames; i++) {
  const t = from + i / FPS;
  await page.evaluate(t => window.SAU.seek(t), t);
  const { data } = await cdp.send('Page.captureScreenshot', { ...(CAP === 'png' ? { format: 'png', optimizeForSpeed: true } : { format: 'jpeg', quality: JQ, optimizeForSpeed: JQ < 100 }), ...(DSF !== 1 ? { clip: { x: 0, y: 0, width: W, height: H, scale: DSF } } : {}) });
  const buf = Buffer.from(data, 'base64');
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 60 === 0) process.stdout.write(`\rframe ${i}/${frames}  ${(i / ((Date.now() - t0) / 1000 || 1)).toFixed(1)} fps`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log(`\ndone ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${out}`);
