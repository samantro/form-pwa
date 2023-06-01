// service-worker.js

this.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-cache').then(cache => {
            cache.addAll([
                // Add any static assets or URLs that you want to cache
                "/form.js",
                "/User.js",
                "/App.js",
                "/Index.js",
                "/static/js/bundle.js",
                "/manifest.json",
                "/favicon.ico"
            ]);
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
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    )
});


this.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete any outdated cache except the current cache
                    if (cacheName !== 'my-cache') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
  