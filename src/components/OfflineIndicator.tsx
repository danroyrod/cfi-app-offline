import { useState, useEffect } from 'react';
import { offlineService } from '../services/offlineService';
import './OfflineIndicator.css';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [cacheSize, setCacheSize] = useState<number | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    setIsDevMode(isDev);

    // In dev mode, don't show the banner (service worker is disabled)
    if (isDev) {
      setIsServiceWorkerReady(true); // Pretend it's ready to hide the banner
      return;
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check service worker status
    const checkServiceWorker = async () => {
      try {
        const ready = await offlineService.isServiceWorkerReady();
        setIsServiceWorkerReady(ready);
        
        if (ready) {
          const size = await offlineService.getCacheSize();
          setCacheSize(size);
        }
      } catch (error) {
        // If service worker check fails, assume it's not available (dev mode or error)
        console.warn('Service worker check failed:', error);
        setIsServiceWorkerReady(true); // Hide banner on error
      }
    };

    checkServiceWorker();
    
    // Check periodically (but less frequently)
    const interval = setInterval(checkServiceWorker, 10000); // Every 10 seconds instead of 5

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Don't show banner in dev mode or when online and ready
  if (isDevMode || (isOnline && isServiceWorkerReady)) {
    return null;
  }

  return (
    <div className={`offline-indicator ${!isOnline ? 'offline' : ''}`}>
      {!isOnline ? (
        <div className="offline-status">
          <span className="offline-icon">📡</span>
          <span className="offline-text">Offline Mode</span>
          {isServiceWorkerReady && (
            <span className="offline-cache-info">
              {cacheSize !== null && `(${(cacheSize / 1024 / 1024).toFixed(1)}MB cached)`}
            </span>
          )}
        </div>
      ) : !isServiceWorkerReady ? (
        <div className="offline-status">
          <span className="offline-icon">⏳</span>
          <span className="offline-text">Preparing offline access...</span>
        </div>
      ) : null}
    </div>
  );
}

