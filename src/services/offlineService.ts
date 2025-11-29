/**
 * Offline Service
 * Manages service worker registration, cache status, and offline functionality
 * iOS-ready: Service workers work on iOS Safari 11.3+
 */

class OfflineService {
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Register service worker
   * Note: vite-plugin-pwa generates the service worker automatically
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        // vite-plugin-pwa generates the service worker at build time
        // In dev mode, it may not be available, so we check first
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });

        this.serviceWorkerRegistration = registration;

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                this.onUpdateAvailable();
              }
            });
          }
        });

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if service worker is ready
   */
  async isServiceWorkerReady(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.active !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get cache size (approximate)
   */
  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) {
      return 0;
    }

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        // Estimate size (rough calculation)
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      return true;
    } catch (error) {
      console.error('Error clearing caches:', error);
      return false;
    }
  }

  /**
   * Force update check
   */
  async checkForUpdate(): Promise<boolean> {
    if (!this.serviceWorkerRegistration) {
      return false;
    }

    try {
      await this.serviceWorkerRegistration.update();
      return true;
    } catch (error) {
      console.error('Error checking for update:', error);
      return false;
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting(): Promise<boolean> {
    if (!this.serviceWorkerRegistration || !this.serviceWorkerRegistration.waiting) {
      return false;
    }

    try {
      this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      return true;
    } catch (error) {
      console.error('Error skipping waiting:', error);
      return false;
    }
  }

  /**
   * Get service worker registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.serviceWorkerRegistration;
  }

  /**
   * Check if app is installed
   */
  isInstalled(): boolean {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // Check localStorage flag
    return localStorage.getItem('pwa-installed') === 'true';
  }

  /**
   * Handle update available
   */
  private onUpdateAvailable(): void {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  }

  /**
   * Check if data files are cached
   */
  async areDataFilesCached(): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      // Check if any cache exists (data is bundled in JS chunks which are precached)
      return cacheNames.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Preload critical data files
   * Note: JSON files are bundled in JS chunks, so they're already cached via precache
   */
  async preloadCriticalData(): Promise<void> {
    // Since JSON files are imported as ES modules and bundled,
    // they're already included in the precached JS chunks
    // This method is here for future use if we need to fetch data separately
    try {
      const isReady = await this.isServiceWorkerReady();
      if (isReady) {
        console.log('Critical data files are available via bundled chunks');
      }
    } catch (error) {
      console.error('Error preloading critical data:', error);
    }
  }

  /**
   * Check offline data availability
   */
  async isDataAvailableOffline(): Promise<boolean> {
    // Since JSON data is bundled in JS chunks, if the app loads offline,
    // the data is available. We just need to check if service worker is active.
    return await this.isServiceWorkerReady();
  }

  /**
   * Get sync status
   */
  getSyncStatus(): 'online' | 'offline' | 'syncing' {
    if (!navigator.onLine) {
      return 'offline';
    }
    // In future, could track actual sync operations
    return 'online';
  }

  /**
   * Unregister service worker (for testing/debugging)
   */
  async unregister(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        await this.clearAllCaches();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unregistering service worker:', error);
      return false;
    }
  }
}

export const offlineService = new OfflineService();

