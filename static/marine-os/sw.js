const CACHE_NAME = 'marine-os-shell-v5';
const PRECACHE = ['./', './index.html', "./assets/clipWorker-wzh5Hi5Q.js", "./assets/index-DmVMasB1.js", "./assets/index-fagfuwWz.css", "./assets/transformers.web-Br84DjOd.js"];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== 'transformers-cache').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const allowedOrigin =
    url.origin === self.location.origin ||
    url.hostname.includes('jsdelivr.net') ||
    url.hostname.includes('huggingface.co') ||
    url.hostname.includes('hf.co');
  if (!allowedOrigin) return;
  const targetCache = url.hostname.includes('huggingface.co') || url.hostname.includes('hf.co') ? 'transformers-cache' : CACHE_NAME;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(targetCache).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    })
  );
});
