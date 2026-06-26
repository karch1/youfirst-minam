const CACHE_NAME = 'ga-visitor-v6'; 

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// [수정] 활성화될 때 예전 버전(v2 등)의 오래된 캐시를 싹 비우는 로직 추가
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('구버전 캐시 삭제 처리:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
