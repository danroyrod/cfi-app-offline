/**
 * Data loading utilities with caching
 * Optimized for performance and iOS conversion
 */

// Cache for JSON data to avoid re-parsing
let acsDataCache: any = null;
let lessonPlansDataCache: any = null;

/**
 * Load ACS data with caching
 * In iOS app, this would load from local bundle or cache
 */
export function loadACSData(): Promise<any> {
  if (acsDataCache) {
    return Promise.resolve(acsDataCache);
  }

  return import('../acs_data.json')
    .then((module) => {
      acsDataCache = module.default;
      return acsDataCache;
    })
    .catch((error) => {
      console.error('Failed to load ACS data:', error);
      throw error;
    });
}

/**
 * Load lesson plans data with caching
 * In iOS app, this would load from local bundle or cache
 */
export function loadLessonPlansData(): Promise<any> {
  if (lessonPlansDataCache) {
    return Promise.resolve(lessonPlansDataCache);
  }

  return import('../lessonPlansData.json')
    .then((module) => {
      lessonPlansDataCache = module.default;
      return lessonPlansDataCache;
    })
    .catch((error) => {
      console.error('Failed to load lesson plans data:', error);
      throw error;
    });
}

/**
 * Clear data cache (useful for testing or memory management)
 */
export function clearDataCache() {
  acsDataCache = null;
  lessonPlansDataCache = null;
}

/**
 * Preload all data (useful for iOS app startup)
 */
export async function preloadAllData(): Promise<void> {
  await Promise.all([
    loadACSData(),
    loadLessonPlansData(),
  ]);
}

