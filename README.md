# Molded Fortitude — Campaign Factory (Rebuilt)

This repo turns structured JSON into a **Metricool-ready CSV** and optionally burns subtitles/overlays onto videos with FFmpeg.

## What you get
- **Validation** with JSON Schema (Ajv) for `captions.json`, `schedule.json`, `links.json`
- **CSV generator** that maps captions + schedule into one calendar
- **Link injector** to merge your hosted media URLs into the CSV
- **FFmpeg helpers** to burn subtitles or overlay text
- **GitHub Action** that validates and builds on every push, and uploads the CSV as an artifact

## Quickstart
```bash
# 1) Install
npm install

# 2) Validate your JSON
npm run validate

# 3) Build base CSV
npm run build:csv

# 4) Inject media links into the CSV
npm run links
```

Outputs land in `data/metricool.csv` and `data/metricool_linked.csv`.

## Files to edit
- `data/captions.json` — text content per week/platform
- `data/schedule.json` — posting days/times/platforms
- `data/links.json` — map content slugs to public media URLs

## CSV Columns (Metricool-friendly)
- **date** (YYYY-MM-DD)
- **time** (HH:mm, 24h)
- **platform** (tiktok|instagram|facebook|linkedin|youtube)
- **text**
- **media_url**

> If your Metricool template expects different headers, change them in `scripts/generate_metricool_csv.js` and `scripts/inject_links.js`.

## FFmpeg helpers
- `bin/install_ffmpeg.sh` — best-effort installer for macOS/Linux/WSL
- `scripts/burn_subtitles.sh` — burn SRT into MP4
- `scripts/overlay_text.sh` — overlay a short text string

## CI
`.github/workflows/build-metricool.yml` validates JSON, generates CSV, and uploads it as a build artifact on every push.

## Troubleshooting
- **Node not found**: Use Node 18+
- **FFmpeg not found**: run `bash bin/install_ffmpeg.sh`, or install via your OS package manager
- **JSON validation fails**: read the error, fix your JSON against the schema in `data/schemas`.

## License
MIT. Do good with it.
