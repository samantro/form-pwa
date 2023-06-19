const CACHE_NAME = `my-cache`; // Don't change this value

const urlToCache = [
    "/",
    "/index.html",
    "/static/js/bundle.js",
]

this.addEventListener('install', event => {
    // console.log('install');
    this.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                cache.addAll(urlToCache);
                fetch('/api/user')
                    .then(function (networkResponse) {
                        cache.add('/api/user', networkResponse.clone());
                    })
                    .catch(function (error) {
                        return new Response('File not found');
                    });
            })
    );
});

// this.addEventListener('fetch', event => {
//     console.log("I am Fetch: ",event);
//     event.respondWith(
//         caches.match(event.request).then(response => {
//             return response || fetch(event.request);
//         })
//     );
// });

this.addEventListener('fetch', event => {
    console.log("Fetch:", event);
    this.addEventListener('fetch', function (event) {
        // console.log('fetch');

        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    if (response) return response;

                    return fetch(event.request)
                        .then(function (networkResponse) {
                            caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    cache.put(event.request, networkResponse.clone());
                                })
                                .catch((e) => console.log(
                                    // console.log('SW Fetch: Catched new request')
                                ))

                            return networkResponse;
                        })
                        .catch(function (error) {
                            return new Response('File not found');
                        });

                })
        )
    });

    this.addEventListener('activate', event => {
        // console.log('Activate');
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all([
                    cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => {
                            return caches.delete(cacheName);
                        }),
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.addAll(urlToCache);
                        })
                ]);
            })
        );
    });
