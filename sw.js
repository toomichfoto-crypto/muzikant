const CACHE_NAME = 'muzikant-cache-v271';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-512.png'
];
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
