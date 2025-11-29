import { useState, useEffect } from 'react';
import { offlineService } from '../services/offlineService';
import './OfflineIndicator.css';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [cacheSize, setCacheSize] = useState<number | null>(null);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check service worker status
    const checkServiceWorker = async () => {
      const ready = await offlineService.isServiceWorkerReady();
      setIsServiceWorkerReady(ready);
      
      if (ready) {
        const size = await offlineService.getCacheSize();
        setCacheSize(size);
      }
    };

    checkServiceWorker();
    
    // Check periodically
    const interval = setInterval(checkServiceWorker, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && isServiceWorkerReady) {
    return null; // Don't show anything when online and ready
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

