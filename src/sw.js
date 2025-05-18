const CACHE_NAME = 'story-app-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.bundle.js',
  '/manifest.json',
  '/images/icon-256.png',
  '/images/icon-512.png',
];
self.addEventListener('push', function(event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, data.options);
});

self.addEventListener('install', event => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});


// self.addEventListener('activate', event => {
//   console.log('Service Worker activated');
//   event.waitUntil(
//     caches.keys().then(cacheNames =>
//       Promise.all(
//         cacheNames
//           .filter(name => name !== CACHE_NAME)
//           .map(name => caches.delete(name))
//       )
//     )
//   );
// });

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  event.waitUntil(
    (async () => {
      await caches.keys().then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        )
      );
      self.clients.claim(); 
    })()
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

self.addEventListener('push', function (event) {
  let data = {
    title: 'Notifikasi Baru',
    options: {
      body: 'Push tanpa data spesifik.',
    },
  };

  if (event.data) {
    try {
      const incoming = event.data.json();
      data.title = incoming.title || data.title;
      data.options = incoming.options || data.options;
    } catch (err) {
      console.error('Gagal parse payload:', err);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
});
