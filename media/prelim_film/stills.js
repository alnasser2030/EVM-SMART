// Render selected moments of the film to PNG for review.
// Usage: node stills.js <outDir> <t1> <t2> ...   (times in seconds; "scene:<id>:<offset>" also works)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const [out, ...times] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.addInitScript(() => { window.__RECORD__ = true; });
  await page.goto('file://' + path.resolve(__dirname, 'prelim_film.html'));
  await page.evaluate(() => window.__READY__);
  for (const spec of times) {
    const t = await page.evaluate(s => {
      if (s.startsWith('scene:')) { const [, id, off] = s.split(':'); const sc = SC.find(x => x.id === id); return sc.a + Number(off); }
      return Number(s);
    }, spec);
    await page.evaluate(tt => window.render(tt), t);
    const name = spec.replace(/[:]/g, '_');
    await page.screenshot({ path: path.join(out, `${name}.png`) });
  }
  const total = await page.evaluate(() => T_END);
  console.log('T_END', total);
  await browser.close();
})();
