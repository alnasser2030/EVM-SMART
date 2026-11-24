# EEF animated explainer (LinkedIn format, 1080×1350)

- `eef_explainer.mp4` — 12-s loop (one illustrative day, 30 fps, H.264)
- `eef_explainer.gif` — 720-px GIF version
- `eef_explainer_noon.png` — still frame (12:00)
- `eef_explainer.html` — source; open in a browser for the live animation
- `record.js` — renders frames with Playwright: `node record.js <frameDir> 30 12`, then
  `ffmpeg -framerate 30 -i <frameDir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 eef_explainer.mp4`

Story: all PV output is injected and absorbed by existing flexible loads; the same loads cut their consumption by the data center load every hour; the data center is always supplied by the grid. Illustrative day: PV daily energy = DC daily energy. Results card numbers come from the TPEC 2027 Riyadh case study (80% hourly matching).
Replace `[Author Name]` in the HTML before publishing.
