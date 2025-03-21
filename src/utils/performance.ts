
/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit how often a function is called
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit how often a function is called
 * @param func Function to throttle
 * @param limit Limit time in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number = 0;
  
  return function(...args: Parameters<T>): void {
    const context = this;
    const now = Date.now();
    
    if (now - lastRan >= limit) {
      func.apply(context, args);
      lastRan = now;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (now - lastRan));
    }
  };
}

/**
 * Memoize function results to avoid expensive recalculations
 * @param fn Function to memoize
 * @param maxCacheSize Maximum cache size (default: 100)
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  maxCacheSize = 100
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, {value: ReturnType<T>, timestamp: number}>();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      const entry = cache.get(key)!;
      // Update the timestamp to mark it as recently used
      entry.timestamp = Date.now();
      return entry.value;
    }
    
    // If cache is full, remove the oldest entry (LRU)
    if (cache.size >= maxCacheSize) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      
      cache.forEach((entry, key) => {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp;
          oldestKey = key;
        }
      });
      
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }
    
    const result = fn(...args);
    cache.set(key, {value: result, timestamp: Date.now()});
    return result;
  };
}

/**
 * Load a script dynamically with priority control
 * @param src Script source URL
 * @param options Loading options
 * @returns Promise that resolves when the script is loaded
 */
export function loadScript(
  src: string, 
  { 
    async = true, 
    defer = false, 
    priority = 'low',
    attributes = {}
  }: { 
    async?: boolean, 
    defer?: boolean, 
    priority?: 'high' | 'low',
    attributes?: Record<string, string>
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    // Add custom attributes
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
    
    if (priority === 'high') {
      document.head.insertBefore(script, document.head.firstElementChild);
    } else {
      document.head.appendChild(script);
    }
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
  });
}

/**
 * Setup intersection observer for lazy loading images
 * Improved to use modern browser capabilities and reduce main thread work
 */
export function setupLazyLoading(): void {
  if (!('IntersectionObserver' in window)) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          // Use requestIdleCallback when available to reduce main thread work
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              img.src = img.dataset.src!;
              img.removeAttribute('data-src');
            }, { timeout: 2000 });
          } else {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px', // Start loading 200px before the image enters the viewport
    threshold: 0.01
  });
  
  // Use requestAnimationFrame to schedule non-critical work
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
      });
    });
  } else {
    requestAnimationFrame(() => {
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    });
  }
}

/**
 * Utility function to split long tasks to prevent blocking the main thread
 * @param items Array of items to process
 * @param processor Function to process each item
 * @param chunkSize Number of items to process per chunk
 */
export function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize = 5
): Promise<R[]> {
  return new Promise((resolve) => {
    const results: R[] = [];
    let index = 0;
    
    function processNextChunk() {
      const startTime = performance.now();
      
      while (index < items.length) {
        results.push(processor(items[index]));
        index++;
        
        // Process items in chunks of time (max 50ms per chunk)
        if (index % chunkSize === 0 && performance.now() - startTime > 50) {
          setTimeout(processNextChunk, 0);
          return;
        }
      }
      
      resolve(results);
    }
    
    processNextChunk();
  });
}
