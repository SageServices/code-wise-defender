
const CACHE_NAME = 'security-dashboard-v2';
const BACKUP_CACHE = 'backup-data-v1';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)),
      caches.open(BACKUP_CACHE)
    ])
  );
});

// Fetch event - serve from cache with backup support
self.addEventListener('fetch', (event) => {
  // Handle backup-related requests differently
  if (event.request.url.includes('/api/backup')) {
    event.respondWith(handleBackupRequest(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Background sync for backup operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'backup-sync') {
    event.waitUntil(syncBackupData());
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== BACKUP_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle backup-specific requests
async function handleBackupRequest(request) {
  try {
    // Try network first for real-time backup operations
    const networkResponse = await fetch(request);
    
    // Cache successful backup responses
    if (networkResponse.ok) {
      const cache = await caches.open(BACKUP_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cached backup data when offline
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline backup response
    return new Response(JSON.stringify({
      error: 'Offline - backup data may be outdated',
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Sync backup data when connection is restored
async function syncBackupData() {
  try {
    // Get stored backup data that needs syncing
    const cache = await caches.open(BACKUP_CACHE);
    const requests = await cache.keys();
    
    // Process each cached backup request
    for (const request of requests) {
      try {
        await fetch(request);
        console.log('Synced backup data:', request.url);
      } catch (error) {
        console.log('Failed to sync backup data:', request.url);
      }
    }
  } catch (error) {
    console.log('Backup sync failed:', error);
  }
}

// Periodic cleanup of old backup data
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEANUP_BACKUPS') {
    event.waitUntil(cleanupOldBackups());
  }
});

async function cleanupOldBackups() {
  const cache = await caches.open(BACKUP_CACHE);
  const requests = await cache.keys();
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const date = response.headers.get('date');
      if (date && new Date(date).getTime() < sevenDaysAgo) {
        await cache.delete(request);
      }
    }
  }
}
