const CACHE_NAME = 'muzikant-cache-v336';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-512.png'
];

// Instalace: uložit všechny soubory do cache
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Aktivace: smazat staré cache, převzít kontrolu
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => {
            // Informujeme všechny otevřené karty o nové verzi
            self.clients.matchAll({ type: 'window' }).then(clients => {
                clients.forEach(client => client.postMessage({ type: 'NEW_VERSION' }));
            });
        })
    );
    self.clients.claim();
});

// Fetch: stale-while-revalidate pro HTML soubory
// — ihned vrátí cached verzi, na pozadí stáhne novou
self.addEventListener('fetch', (e) => {
    // Google Drive API a Google účty nikdy necachovat
    if (e.request.url.includes('googleapis.com') || e.request.url.includes('accounts.google.com')) {
        e.respondWith(fetch(e.request));
        return;
    }

    e.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(e.request);

            // Na pozadí vždy aktualizujeme cache
            const fetchPromise = fetch(e.request).then((network) => {
                if (network && network.status === 200) {
                    cache.put(e.request, network.clone());
                }
                return network;
            }).catch(() => null);

            // Vrátíme cache ihned (offline-first), síť aktualizuje cache
            return cached || fetchPromise;
        })
    );
});
