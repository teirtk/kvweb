"use strict";
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

// This will work!
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    ({url}) => url.hostname === 'localhost',
    new workbox.strategies.StaleWhileRevalidate()
);