const CACHE = 'our-story-v1';
const URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/pages.js',
  '/js/animations.js',
  '/js/config.js',
  '/manifest.json',
  '/assets/music/bg.m4a'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
