const cacheName = "Yggdrasil Labs AB-Booh Brawlers-1.1.424";
const contentToCache = [
  "Build/CryptoBuildNFT.loader.js",
  "Build/CryptoBuildNFT.framework.js.unityweb",
  "Build/CryptoBuildNFT.data.unityweb",
  "Build/CryptoBuildNFT.wasm.unityweb",
  "TemplateData/style.css"
];

// Toni -- Install and pre-cache essential files
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");

  self.skipWaiting();

  event.waitUntil(
    (async () => {
      // Toni -- Clean old caches
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));

      // Toni -- Open current cache and add assets
      const cache = await caches.open(cacheName);
      await cache.addAll(contentToCache);
      console.log("[ServiceWorker] Cached app shell and content");
    })()
  );
});

// Toni -- Activate new worker immediately and clean old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(self.clients.claim());
});

// Toni -- Fetch handler for runtime caching
self.addEventListener("fetch", (event) => {
  // Toni -- Don't cache this script
  if (event.request.url.endsWith("/ServiceWorker.js")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        // Toni -- Serve cached
        return cachedResponse;
      }

      try {
        // Toni -- Fetch and cache new request
        const fetchResponse = await fetch(event.request);
        if (event.request.method === "GET" && fetchResponse.status === 200) {
          cache.put(event.request, fetchResponse.clone());
        }
        return fetchResponse;
      } catch (err) {
        // Toni -- Offline fallback if needed (e.g., default file, error page, etc.)
        console.warn("[ServiceWorker] Fetch failed:", event.request.url);
        return new Response("Offline or failed to fetch.", { status: 503 });
      }
    })()
  );
});
