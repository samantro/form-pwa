// service-worker.js

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-cache').then(cache => {
            return cache.addAll([
                // Add any static assets or URLs that you want to cache
                "/form.js",
                "/User.js",
                "/App.js",
                "/Index.js",
                "/http://localhost:3000/static/js/bundle.js",
                "/http://localhost:3000/manifest.json"
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
