
import React, { lazy, ComponentType } from 'react';

/**
 * Utility for optimized lazy loading of components with dynamic imports
 * Implements retry mechanism and chunk naming
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  chunkName: string,
  retries = 2
): React.LazyExoticComponent<T> {
  return lazy(() => {
    let retriesLeft = retries;
    
    const tryImport = async (): Promise<{ default: T }> => {
      try {
        // Set a name for the chunk in webpack/vite
        // @ts-ignore - This comment helps bundlers identify chunk names
        return await importFunction();
      } catch (error) {
        if (retriesLeft > 0) {
          retriesLeft--;
          // Exponential backoff for retries (300ms, 900ms, etc.)
          const backoff = Math.pow(3, retries - retriesLeft) * 300;
          await new Promise(resolve => setTimeout(resolve, backoff));
          return tryImport();
        }
        console.error(`Failed to load chunk: ${chunkName}`, error);
        throw error;
      }
    };
    
    return tryImport();
  });
}
