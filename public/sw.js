const CACHE_NAME = 'devtools-v1'
const MODEL_CACHE_NAME = 'devtools-models-v1'
const STATIC_ASSETS = [
  '/',
  '/en/code-canvas',
  '/en/qr-generator',
  '/zh/code-canvas',
  '/zh/qr-generator',
]

// Check if request is for AI model assets (ONNX, WASM from IMG.LY CDN)
const isModelAsset = (url) => {
  return (
    url.includes('.onnx') ||
    url.includes('.wasm') ||
    url.includes('staticimgly.com')
  )
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches (preserve model cache)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== MODEL_CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  // Claim all clients
  self.clients.claim()
})

// Fetch event - different strategies based on asset type
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return

  // Model assets: cache-first strategy (models rarely change, large files)
  if (isModelAsset(event.request.url)) {
    event.respondWith(
      caches.open(MODEL_CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) {
            return cached
          }
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone())
            }
            return response
          })
        })
      )
    )
    return
  }

  // Other assets: network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone()

        // Only cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request)
      })
  )
})
