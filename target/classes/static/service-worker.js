const CACHE_NAME = 'ame-portal-cache-v6';
const FILES_TO_CACHE = [
  '/login',
  '/offline-admin.html',
  '/offline-lecturer.html',
  '/offline-student.html',
  '/manifest.json',
  '/offline.html',
  '/Images/Zion.png',
  '/Images/images.jpg',
  '/Images/Image%201.jpg',
  '/Images/download%201.jpg',
  '/Images/download%202.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const isHtmlRequest = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');

  if (isHtmlRequest) {
    event.respondWith(
      fetch(new Request(request, { cache: 'no-store' }))
        .then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clonedResponse));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then(cachedResponse => cachedResponse || caches.match('/offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            if (request.url.startsWith(self.location.origin) && !request.url.endsWith('/service-worker.js')) {
              const clonedResponse = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, clonedResponse));
            }
          }
          return networkResponse;
        })
        .catch(() => caches.match(request));
    })
  );
});
