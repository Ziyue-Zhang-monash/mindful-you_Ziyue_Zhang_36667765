const CACHE_NAME = 'mindful-you-offline-v1'

// Cache the main page and images used by the Learn articles.
const APP_FILES = [
  '/',
  '/index.html',
  '/assets/learn.png',
  '/assets/mindful-you-hero.png',
  '/assets/online-counselling.png',
  '/assets/family-support.png',
  '/assets/book-appointment.png',
  '/assets/self-help.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_FILES)

      // Read the built page and cache its generated JavaScript and CSS files.
      const pageResponse = await fetch('/')
      const pageHtml = await pageResponse.text()
      const linkedFiles = Array.from(
        pageHtml.matchAll(/(?:src|href)="(\/[^"#]+)"/g),
        (match) => match[1]
      ).filter((file) => !APP_FILES.includes(file))

      await cache.addAll(linkedFiles)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  )
  self.clients.claim()
})

// Use the network first and return the cached response when offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseCopy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy))
        return response
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => cachedResponse || caches.match('/index.html'))
      )
  )
})
