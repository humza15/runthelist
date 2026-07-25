// Rounding List service worker
// Strategy: network-first for HTML/JS/CSS/JSON (always try to get the newest app),
// cache-first for images/fonts/icons (fine to be stale, saves data + works offline).

const CACHE_PREFIX = "rounding-list";
let CACHE_NAME = null; // resolved during install from version.json

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./version.json"
];

const STATIC_ASSET_RE = /\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf)$/i;
const APP_CODE_RE = /\.(html|js|css|json)$/i;

async function getVersion() {
  try {
    const res = await fetch("./version.json", { cache: "no-store" });
    const data = await res.json();
    return data.version || "0.0.0";
  } catch (e) {
    return "0.0.0";
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const version = await getVersion();
      CACHE_NAME = `${CACHE_PREFIX}-v${version}`;
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_SHELL);
      // Do not auto-activate. New version waits until the user (via the update
      // modal in app.js) confirms, or until no other tabs are open.
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate" || APP_CODE_RE.test(url.pathname)) {
    // Network-first: always try for the newest app code; fall back to cache offline.
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME || (await currentCacheName()));
          cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          const cached = await caches.match(req);
          return cached || caches.match("./index.html");
        }
      })()
    );
    return;
  }

  if (STATIC_ASSET_RE.test(url.pathname)) {
    // Cache-first: static assets rarely change, keep them fast and offline-ready.
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME || (await currentCacheName()));
          cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          return cached;
        }
      })()
    );
  }
});

async function currentCacheName() {
  const keys = await caches.keys();
  const match = keys.find((k) => k.startsWith(CACHE_PREFIX));
  return match || `${CACHE_PREFIX}-v0.0.0`;
}
