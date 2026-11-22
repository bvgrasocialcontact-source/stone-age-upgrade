// Finds Playwright and Chrome on Linux (claude.ai / Claude Code cloud) and Windows (Buğra's PC).
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
function loadChromium() {
  for (const m of ['playwright', 'playwright-core', '/opt/npm-tools/node_modules/playwright', '/opt/npm-tools/node_modules/playwright-core']) {
    try { return require(m).chromium; } catch {}
  }
  throw new Error('Playwright not found: run `npm i playwright-core` in 03_engine');
}
export const chromium = loadChromium();
const candidates = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
export const chromePath = candidates.find(p => { try { return fs.existsSync(p); } catch { return false; } });
// undefined => Playwright uses its own downloaded browser (npx playwright install chromium)
