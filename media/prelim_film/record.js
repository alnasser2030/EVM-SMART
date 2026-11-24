// Render the film frame by frame with Playwright (one worker per process).
// Usage: node record.js <outDir> <fps> <firstFrame> <lastFrameExclusive>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const [out, fpsS, aS, bS] = process.argv.slice(2);
  const fps = Number(fpsS || 30);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.addInitScript(() => { window.__RECORD__ = true; });
  await page.goto('file://' + path.resolve(__dirname, 'prelim_film.html'));
  await page.evaluate(() => window.__READY__);
  const total = Math.round(await page.evaluate(() => T_END) * fps);
  const a = Number(aS || 0), b = Math.min(Number(bS || total), total);
  for (let i = a; i < b; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    await page.screenshot({ path: path.join(out, `f_${String(i).padStart(5, '0')}.png`) });
  }
  await browser.close();
  console.log('done', a, b, 'of', total);
})();
