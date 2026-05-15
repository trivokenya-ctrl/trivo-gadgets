// Minimal service worker for PWA installability
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Required by Chrome to trigger the "Install App" prompt.
});
