/**
 * Legaforce Service Worker — PWA & Offline Support
 *
 * Strategy:
 *  - Static assets (JS/CSS/fonts): Cache-first (fast loads on repeat visits)
 *  - API calls: Network-first with cache fallback (always fresh when online)
 *  - Navigation: Network-first (SPA routing handled by index.html fallback)
 *  - Images: Cache-first with network fallback (reduce bandwidth)
 */

const CACHE_VERSION = "legaforce-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Pre-cache these on install
const PRECACHE_URLS = [
  "/",
  "/legaforce-logo.png",
  "/manifest.json",
];

// ── Install ─────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate (clean old caches) ─────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch strategy ──────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension and other non-http
  if (!url.protocol.startsWith("http")) return;

  // API calls: Network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Images: Cache-first
  if (
    request.destination === "image" ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)
  ) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Static assets (JS, CSS, fonts): Network-first (ensure updates are picked up)
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    url.pathname.match(/\.(js|css|woff2?)$/)
  ) {
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Navigation (HTML pages): Network-first with SPA fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match("/") || caches.match(request))
    );
    return;
  }

  // Everything else: Network-first
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

// ── Cache-first strategy ────────────────────────
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return offline fallback for images
    return new Response("", { status: 408, statusText: "Offline" });
  }
}

// ── Network-first strategy ──────────────────────
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ success: false, message: "You are offline" }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// ── Push notification handler ───────────────────
self.addEventListener("push", (event) => {
  let data = { title: "Legaforce", body: "You have a new notification" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || data.message,
    icon: "/legaforce-logo.png",
    badge: "/legaforce-logo.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/app/dashboard",
    },
    actions: data.actions || [
      { action: "open", title: "View" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Legaforce", options)
  );
});

// ── Notification click handler ──────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const urlToOpen = event.notification.data?.url || "/app/dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return self.clients.openWindow(urlToOpen);
    })
  );
});
