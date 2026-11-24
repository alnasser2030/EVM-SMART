// Render a frame range and pipe it straight into ffmpeg (no PNGs on disk).
// Usage: node record_pipe.js <out.mp4> <fps> <firstFrame> <lastFrameExclusive>
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const [out, fpsS, aS, bS] = process.argv.slice(2);
  const fps = Number(fpsS || 30);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.addInitScript(() => { window.__RECORD__ = true; });
  await page.goto('file://' + path.resolve(__dirname, 'prelim_film.html'));
  await page.evaluate(() => window.__READY__);
  const total = Math.round(await page.evaluate(() => T_END) * fps);
  const a = Number(aS || 0), b = Math.min(Number(bS || total), total);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-threads', '2', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = a; i < b; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - a) % 600 === 0) console.log(path.basename(out), i - a, '/', b - a);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('done', out, a, b, 'of', total);
})();
