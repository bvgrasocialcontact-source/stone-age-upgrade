// node still.mjs <scene.html> <out.png> [--w 1920 --h 1080 --t 0 --q "style=1"]
import { createRequire } from 'module'; import path from 'path';
const require = createRequire(import.meta.url);
import { chromium, chromePath } from './env.mjs';
const a = process.argv.slice(2), opt = (k, d) => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : d; };
const W = +opt('w', 1920), H = +opt('h', 1080), t = +opt('t', 0), extra = opt('q', '');
const b = await chromium.launch({ executablePath: chromePath, args: ['--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: W, height: H } });
p.on('pageerror', e => console.error('PAGE ERROR', e.message));
await p.goto('file://' + path.resolve(a[0]) + `?w=${W}&h=${H}&${extra}`);
await p.waitForFunction(() => window.SAU && SAU.ready === true, null, { timeout: 30000 });
await p.evaluate(t => SAU.seek(t), t);
await p.screenshot({ path: a[1], omitBackground: a.includes('--transparent') });
await b.close(); console.log('ok', a[1]);
