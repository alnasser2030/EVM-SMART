# EEF explainer film (58 s, 1080×1350)

- `eef_film.mp4` — the film (H.264, 30 fps), ready for LinkedIn
- `eef_film.html` — interactive version: open in a browser for play/pause, a timeline scrubber and scene buttons
- `eef_film_title.png`, `eef_film_idea.png`, `eef_film_results.png` — stills
- `record.js` — frame renderer: `node record.js <frameDir> 30 58`, then
  `ffmpeg -framerate 30 -i <frameDir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 eef_film.mp4`

Scenes: 1 Title (0–5 s) · 2 Problem: annual matching vs hourly reality (5–15) · 3 Batteries (15–21) ·
4 The idea: one animated day — loads absorb all PV by day, cut 100 MW at night, DC always on the grid (21–37) ·
5 Verification: contract, metering, hourly credits (37–43) · 6 Results: three pillars (43–53) · 7 Credits (53–58).
Numbers: TPEC 2027 Riyadh case study (40.4% AM; 80% target: 1,027 MWh battery, $30.2M/yr; EEF $17.3M/yr at $50/MWh; 296 → 99.5 kt CO2/yr).
