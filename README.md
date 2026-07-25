# Rounding List

A local-only, de-identified rounding checklist for hospitalists. No patient names — room numbers only. All data (rooms, dispo checklists, notes, reminders, timers) is stored in your phone's browser storage and never leaves the device.

## Hosting it on GitHub Pages

1. Push this folder to a GitHub repo (e.g. `rounding-list`).
2. In the repo, go to **Settings → Pages**, set source to the `main` branch, root folder.
3. GitHub will give you a URL like `https://yourusername.github.io/rounding-list/`.
4. Every push to `main` redeploys automatically — the service worker's network-first
   strategy means the app checks for a newer version each time it's opened, and
   prompts you with an in-app "update available" popup rather than requiring a
   reinstall.

## Installing on iPhone

1. Open the GitHub Pages URL in **Safari** (must be Safari, not Chrome, for iOS install).
2. Tap the Share icon → **Add to Home Screen**.
3. Launch it from the home screen icon from then on — it opens full-screen, no
   browser chrome, and works offline once loaded.

## Installing on Android

1. Open the URL in Chrome.
2. Tap the menu (⋮) → **Add to Home screen** / **Install app**.

## Versioning

- `version.json` is the single source of truth for the app version — bump it on
  every deploy and the service worker + in-app footer pick it up automatically.
- `CHANGELOG.md` holds full release history, viewable in-app from the menu or by
  tapping the version number at the bottom of any screen.
- Suggested scheme: `0.1.x` for small fixes, `0.x.0` for a meaningful new
  feature set, `1.0.0` once the core workflow is stable and battle-tested.

## Project structure

```
index.html          app shell
css/styles.css       all styling, light + dark mode
js/app.js             app logic, state, rendering, service worker registration
service-worker.js    offline caching + auto-update flow
manifest.json         PWA install config
version.json          current version + release notes shown in the update popup
CHANGELOG.md          full version history
icons/                 home screen icons
```

## What's intentionally not included (v0.1)

- No patient names, MRNs, or DOB — room number is the only identifier
- No account system, login, or cloud sync — everything is local to the device
- No real-time labs/vitals — the app is a checklist and notes tool, not an EHR
- Dispo items, reminders, and problem tags are entered via simple text prompts
  in this first build; nicer inline editing is a good candidate for a 0.2 pass
