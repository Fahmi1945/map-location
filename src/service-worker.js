import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
self.clients.claim();

// 1. Pre-cache App Shell (HTML, JS, CSS)
// Ini disuntikkan oleh Webpack
precacheAndRoute(self.__WB_MANIFEST);

// 2. Cache Runtime (Google Fonts)
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' })
);
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
);

// 3. ⬇️ --- PERBAIKAN: Cache CDN Tailwind --- ⬇️
// Ini akan memperbaiki error 'tailwind is not defined' saat offline
registerRoute(
  /^https:\/\/cdn\.tailwindcss\.com/,
  new StaleWhileRevalidate({
    cacheName: 'tailwind-cdn',
  })
);

// 4. Cache API Data Cerita (Teks JSON)
registerRoute(
  /^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,
  new StaleWhileRevalidate({
    cacheName: 'petacerita-api-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }),
    ],
  })
);

// 5. ⬇️ --- PERBAIKAN: Cache Gambar Cerita --- ⬇️
// Ini akan memperbaiki "tidak ada gambar" saat offline
registerRoute(
  /^https:\/\/story-api\.dicoding\.dev\/images\/stories\//,
  new StaleWhileRevalidate({
    cacheName: 'petacerita-images-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60, // Simpan 60 gambar terakhir
        maxAgeSeconds: 30 * 24 * 60 * 60, // Simpan selama 30 hari
      }),
    ],
  })
);

// 6. ⬇️ --- PERBAIKAN: Cache Tile Peta --- ⬇️
// Ini akan memperbaiki "tidak ada map" saat offline
registerRoute(
  /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/,
  new StaleWhileRevalidate({
    cacheName: 'openstreetmap-tiles-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100, // Simpan 100 tile peta
        maxAgeSeconds: 30 * 24 * 60 * 60, // Simpan selama 30 hari
      }),
    ],
  })
);
// ⬆️ --- SELESAI SEMUA PERBAIKAN --- ⬆️

// 7. Fallback Navigasi Offline
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);