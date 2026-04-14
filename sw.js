const CACHE_NAME = 'muzikant-cache-v23.2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// Instalace a uložení souborů do mezipaměti
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Zajištění fungování offline
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});