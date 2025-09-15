// Service Worker for sq²ft Calculators
const CACHE_NAME = 'sq2ft-calculators-v1.0.0'
const STATIC_CACHE = 'sq2ft-static-v1.0.0'
const DYNAMIC_CACHE = 'sq2ft-dynamic-v1.0.0'

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/tile-calculator.html',
    '/carpet-calculator.html',
    '/hardwood-calculator.html',
    '/baseboard-calculator.html',
    '/subfloor-calculator.html',
    '/styles.css',
    '/script.js',
    '/calculator-base.js',
    '/tile-calculator.js',
    '/carpet-calculator.js',
    '/hardwood-calculator.js',
    '/baseboard-calculator.js',
    '/subfloor-calculator.js',
    '/manifest.json'
]

// CDN resources to cache
const CDN_FILES = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.3.2/css/hover-min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.min.js'
]

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...')
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Caching static files')
                return cache.addAll(STATIC_FILES)
            }),
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Service Worker: Caching CDN files')
                return cache.addAll(CDN_FILES)
            })
        ]).then(() => {
            console.log('Service Worker: Installation complete')
            return self.skipWaiting()
        })
    )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...')
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        }).then(() => {
            console.log('Service Worker: Activation complete')
            return self.clients.claim()
        })
    )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event
    const url = new URL(request.url)
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return
    }
    
    event.respondWith(
        caches.match(request).then(cachedResponse => {
            // Return cached version if available
            if (cachedResponse) {
                console.log('Service Worker: Serving from cache:', request.url)
                return cachedResponse
            }
            
            // Otherwise fetch from network
            return fetch(request).then(response => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response
                }
                
                // Clone the response
                const responseToCache = response.clone()
                
                // Cache the response
                caches.open(DYNAMIC_CACHE).then(cache => {
                    console.log('Service Worker: Caching new resource:', request.url)
                    cache.put(request, responseToCache)
                })
                
                return response
            }).catch(error => {
                console.log('Service Worker: Fetch failed:', error)
                
                // Return offline page for navigation requests
                if (request.mode === 'navigate') {
                    return caches.match('/index.html')
                }
                
                // Return a basic offline response for other requests
                return new Response('Offline content not available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                })
            })
        })
    )
})

// Background sync for form data (if supported)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered')
        event.waitUntil(doBackgroundSync())
    }
})

async function doBackgroundSync() {
    // Sync any pending form data when back online
    console.log('Service Worker: Performing background sync')
}

// Push notifications (for future use)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Open Calculator',
                    icon: '/icons/checkmark.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/icons/xmark.png'
                }
            ]
        }
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        )
    }
})

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification click received')
    
    event.notification.close()
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        )
    }
})
