
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
 * Load a script dynamically with priority control and resource hints
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
    attributes = {},
    preconnect = false
  }: { 
    async?: boolean, 
    defer?: boolean, 
    priority?: 'high' | 'low',
    attributes?: Record<string, string>,
    preconnect?: boolean
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    // Add preconnect for third-party domains
    if (preconnect && src.startsWith('https://') && typeof document !== 'undefined') {
      const urlObj = new URL(src);
      const origin = urlObj.origin;
      
      if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
        const linkEl = document.createElement('link');
        linkEl.rel = 'preconnect';
        linkEl.href = origin;
        linkEl.crossOrigin = 'anonymous';
        document.head.appendChild(linkEl);
        
        // Also add dns-prefetch as fallback
        const dnsEl = document.createElement('link');
        dnsEl.rel = 'dns-prefetch';
        dnsEl.href = origin;
        document.head.appendChild(dnsEl);
      }
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
  processor: (item: T, index: number) => R,
  chunkSize = 5
): Promise<R[]> {
  return new Promise((resolve) => {
    const results: R[] = [];
    let index = 0;
    
    function processNextChunk() {
      const startTime = performance.now();
      
      while (index < items.length) {
        results.push(processor(items[index], index));
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

/**
 * Pre-renders critical components into document fragments to speed up mounting
 * @param componentFactory Function that returns the component's DOM
 * @param id Unique identifier for the component
 */
export function preRenderComponent(
  componentFactory: () => HTMLElement,
  id: string
): void {
  if (typeof window === 'undefined' || !('requestIdleCallback' in window)) return;
  
  // Store pre-rendered components in a global cache
  if (!window.__PRE_RENDERED_COMPONENTS__) {
    window.__PRE_RENDERED_COMPONENTS__ = new Map();
  }
  
  // Don't re-render if already cached
  if (window.__PRE_RENDERED_COMPONENTS__.has(id)) return;
  
  // Create during idle time
  requestIdleCallback(() => {
    try {
      const fragment = document.createDocumentFragment();
      const element = componentFactory();
      fragment.appendChild(element);
      window.__PRE_RENDERED_COMPONENTS__.set(id, fragment);
    } catch (e) {
      console.warn('Failed to pre-render component:', e);
    }
  }, { timeout: 2000 });
}

// Add global type for pre-rendered components
declare global {
  interface Window {
    __PRE_RENDERED_COMPONENTS__?: Map<string, DocumentFragment>;
  }
}

/**
 * Checks if a value is a primitive type that can be safely stored
 */
export function isPrimitive(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

/**
 * Creates a safe serializable version of an object for logging
 * (useful to prevent circular reference errors)
 */
export function safeSerialize(obj: any, maxDepth = 3, currentDepth = 0): any {
  if (currentDepth > maxDepth) return '[Max Depth Exceeded]';
  if (isPrimitive(obj)) return obj;
  if (typeof obj === 'function') return '[Function]';
  
  if (Array.isArray(obj)) {
    return obj.map(item => safeSerialize(item, maxDepth, currentDepth + 1));
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = safeSerialize(obj[key], maxDepth, currentDepth + 1);
      }
    }
    return result;
  }
  
  return String(obj);
}
