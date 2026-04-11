const CACHE_NAME = 'muzikant-cache-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-512.png'
];

// Instalace a uložení souborů do mezipaměti
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Zajištění fungování offline (Network First strategie)
// Vždy se snaží načíst nejnovější verzi z internetu. Když internet není, vezme data ze skladu.
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});