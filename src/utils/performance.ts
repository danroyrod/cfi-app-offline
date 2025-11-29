/**
 * Performance monitoring utilities
 * Useful for identifying bottlenecks and preparing for iOS app
 */

/**
 * Measure function execution time
 * In iOS app, this could integrate with performance monitoring tools
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  if (import.meta.env.MODE === 'development') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
}

/**
 * Debounce function to limit execution frequency
 * Useful for search inputs, scroll handlers, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 * Useful for scroll handlers, resize handlers, etc.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if code is running in iOS/React Native environment
 * Useful for conditional logic when converting to iOS app
 */
export function isIOSEnvironment(): boolean {
  // In React Native, this would check Platform.OS === 'ios'
  return typeof navigator !== 'undefined' && 
         /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if code is running in mobile environment
 */
export function isMobileEnvironment(): boolean {
  return typeof window !== 'undefined' && 
         window.innerWidth < 768;
}

