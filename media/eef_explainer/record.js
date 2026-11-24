// Render the explainer frame by frame with Playwright, then encode with ffmpeg.
// Usage: node record.js <outDir> [fps] [seconds]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const out = process.argv[2];
  const fps = Number(process.argv[3] || 30), secs = Number(process.argv[4] || 12);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => { window.__RECORD__ = true; });
  await page.goto('file://' + path.resolve(__dirname, 'eef_explainer.html'));
  await page.waitForTimeout(500);
  const n = fps * secs;
  for (let i = 0; i < n; i++) {
    await page.evaluate(h => window.render(h), 24 * i / n);
    await page.screenshot({ path: path.join(out, `f_${String(i).padStart(4, '0')}.png`) });
  }
  await browser.close();
  console.log('frames', n);
})();
