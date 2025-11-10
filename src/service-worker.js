import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
self.clients.claim();

precacheAndRoute(self.__WB_MANIFEST);

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

registerRoute(
  /^https:\/\/cdn\.tailwindcss\.com/,
  new StaleWhileRevalidate({
    cacheName: 'tailwind-cdn',
  })
);

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

registerRoute(
  /^https:\/\/story-api\.dicoding\.dev\/images\/stories\//,
  new StaleWhileRevalidate({
    cacheName: 'petacerita-images-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/,
  new StaleWhileRevalidate({
    cacheName: 'openstreetmap-tiles-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

self.addEventListener('push', (event) => {
  console.log('Service Worker: Menerima Push Event...');

  let notificationData = {
    title: 'Push Notifikasi!',
    options: {
      body: 'Sebuah pesan baru telah masuk.',
      icon: 'public/icons/icon-192x192.png',
      data: {
        url: '/index.html',
      },
    },
  };

  if (event.data) {
    const dataText = event.data.text();

    try {
      const dataJson = JSON.parse(dataText);

      notificationData.title = dataJson.title || notificationData.title;
      notificationData.options.body = dataJson.body || notificationData.options.body;
      notificationData.options.icon = dataJson.icon || notificationData.options.icon;
      notificationData.options.image = dataJson.image;
      notificationData.options.data.url = dataJson.url || notificationData.options.data.url;

    } catch (e) {

      console.warn('Data push bukan JSON, akan ditampilkan sebagai teks biasa.');
      notificationData.options.body = dataText;
    }
  }

  notificationData.options.actions = [
    {
      action: 'explore-action',
      title: 'Lihat Cerita',
    }
  ];

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData.options
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notifikasi diklik.');

  const notificationUrl = event.notification.data.url;

  if (event.action === 'explore-action') {
    event.waitUntil(clients.openWindow(notificationUrl));
  } else {
    event.waitUntil(clients.openWindow(notificationUrl));
  }

  event.notification.close();
});