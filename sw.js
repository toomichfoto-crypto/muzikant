const CACHE_NAME = 'muzikant-cache-v278';
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

// Aktivace: smazat staré cache z předchozích verzí
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: cache-first strategie
// Aplikace se načte okamžitě z cache (funguje offline a na pomalém připojení).
// Na pozadí se zároveň stáhne aktuální verze a uloží do cache pro příští načtení.
self.addEventListener('fetch', (e) => {
    // Google Drive API a Google účty nikdy necachovat
    if (e.request.url.includes('googleapis.com') || e.request.url.includes('accounts.google.com')) {
        e.respondWith(fetch(e.request));
        return;
    }

    e.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(e.request);
            const fetchPromise = fetch(e.request).then((network) => {
                if (network && network.status === 200) {
                    cache.put(e.request, network.clone());
                }
                return network;
            }).catch(() => null);

            // Vrátíme cache ihned, síť jen aktualizuje cache do budoucna
            return cached || fetchPromise;
        })
    );
});
