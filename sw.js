const CACHE_NAME = 'LoFi-Radio-v1.0.2';
const OFFLINE_PAGE = 'index.html';
const ASSETS = [
  'index.html',
  'lib/Tone-15.3.5.js',
  'icon.svg',
  'icon-512.png',
  'icon-192.png',
  'screenshot-mobile.png',
  'screenshot-desktop.png',
  'logo.svg',
  'style/montagu-slab.css',
  'style/fonts/montaguslab_6qLHKZIQtB_zv0xUaXRDWkYVHlPWWxI.woff2',
  'style/fonts/montaguslab_6qLHKZIQtB_zv0xUaXRDWkYVH1PWWxI.woff2',
  'style/fonts/montaguslab_6qLHKZIQtB_zv0xUaXRDWkYVEVPW.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Network First for navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_PAGE))
    );
  } else {
    // Cache First for static assets
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request))
    );
  }
});

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
