"use strict";importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"),workbox.routing.registerRoute((({request:e})=>"image"===e.destination||"style"===e.destination||"script"===e.destination||"worker"===e.destination),new workbox.strategies.StaleWhileRevalidate({cacheName:"assets",plugins:[new workbox.cacheableResponse.Plugin({statuses:[200]})]})),workbox.routing.registerRoute((({url:e})=>e.pathname.startsWith("/api")),new workbox.strategies.NetworkFirst);