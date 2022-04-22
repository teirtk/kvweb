"use strict";
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

// This will work!
workbox.routing.registerRoute(
  ({ request }) =>
  request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  // Use a Stale While Revalidate caching strategy
  new workbox.strategies.StaleWhileRevalidate({
    // Put all cached files in a cache named 'assets'
    cacheName: 'assets',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api'),
  new workbox.strategies.NetworkFirst()
);