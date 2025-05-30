
import { useEffect, useState } from 'react';

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate | null>(null);

  useEffect(() => {
    // Register service worker with enhanced caching
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Enable background sync for backup operations if supported
            if (registration.sync) {
              registration.sync.register('backup-sync').catch(console.warn);
            }
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      // Trigger background sync when coming online if supported
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          if (registration.sync) {
            registration.sync.register('backup-sync').catch(console.warn);
          }
        });
      }
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get storage estimate for backup management
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        setStorageEstimate(estimate);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const requestPersistentStorage = async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      const isPersistent = await navigator.storage.persist();
      return isPersistent;
    }
    return false;
  };

  const getStorageUsage = () => {
    if (storageEstimate) {
      return {
        used: storageEstimate.usage || 0,
        quota: storageEstimate.quota || 0,
        available: (storageEstimate.quota || 0) - (storageEstimate.usage || 0)
      };
    }
    return null;
  };

  return { 
    isInstalled, 
    isOffline, 
    storageEstimate,
    requestPersistentStorage,
    getStorageUsage
  };
};
