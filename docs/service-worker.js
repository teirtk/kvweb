importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"),workbox.routing.registerRoute((({request:o})=>"image"===o.destination),new workbox.strategies.CacheFirst),workbox.routing.registerRoute((({url:o})=>"localhost"===o.hostname),new workbox.strategies.NetworkFirst);