const CACHE_NAME = 'intear-wallet-9d7fb0e';
const DOMAIN = self.location.hostname;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.add('/');
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Don't cache API requests, wallet.intear.tech only hosts static files. Also don't cache localhost for development.
  const isSameOrigin = url.hostname === DOMAIN && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1' && !url.hostname.endsWith('.localhost');
  const isStaticOrigin = url.hostname.endsWith('.nearcatalog.xyz') || url.hostname.endsWith('.nearcatalog.org') || url.hostname == 'fonts.gstatic.com' || url.hostname == 'fonts.googleapis.com';
  const isNftProxyOrigin = url.hostname == 'nft-proxy-service.intear.tech' && url.pathname.startsWith('/media/');
  const shouldCache = isSameOrigin || isStaticOrigin || isNftProxyOrigin;

  if (shouldCache) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }

          const fetchRequest = event.request.clone();

          return fetch(fetchRequest)
            .then((response) => {
              if (!response || response.status !== 200) {
                return response;
              }

              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            });
        })
    );
  }
});
