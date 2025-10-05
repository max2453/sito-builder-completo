const CACHE_NAME = 'studentsai-helper-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'style.css',
  'app.js'
  // aggiungi qui eventuali icone/asset
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aperta');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const whitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (!whitelist.includes(k)) {
          console.log('Elimino cache vecchia:', k);
          return caches.delete(k);
        }
      })
    ))
  );
});
