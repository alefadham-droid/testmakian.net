const CACHE_NAME = 'poultry-dashboard-v1';
const urlsToCache = [
  '/testmakian.net/',
  '/testmakian.net/index.html',
  '/testmakian.net/manifest.json',
  '/testmakian.net/icons/icon-192.png',
  '/testmakian.net/icons/icon-512.png'
];

// نصب سرویس ورکر و کش کردن فایل‌ها
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// فعال‌سازی و پاک کردن کش‌های قدیمی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// استراتژی: ابتدا کش، سپس شبکه (Cache-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // اگر در کش بود، همان را برگردان
        }
        // در غیر این صورت از شبکه درخواست کن
        return fetch(event.request).then(networkResponse => {
          // (اختیاری) می‌توانید پاسخ را هم به کش اضافه کنید
          let responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
  );
});
