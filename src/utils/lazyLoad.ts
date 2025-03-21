
import React, { lazy, ComponentType } from 'react';

/**
 * Optimized lazy loading utility with retries, chunk naming, and error boundaries
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  chunkName: string,
  retries = 2,
  retryDelay = 1500
): React.LazyExoticComponent<T> {
  return lazy(() => {
    let retriesLeft = retries;
    
    const tryImport = async (): Promise<{ default: T }> => {
      try {
        // Add a prefetch hint to the browser
        if (typeof window !== 'undefined' && 'document' in window) {
          const linkElement = document.createElement('link');
          linkElement.rel = 'prefetch';
          linkElement.as = 'script';
          linkElement.href = `/${chunkName}.js`;
          document.head.appendChild(linkElement);
        }
        
        // @ts-ignore - This comment helps bundlers identify chunk names
        return await importFunction();
      } catch (error) {
        if (retriesLeft > 0) {
          retriesLeft--;
          // Exponential backoff
          const backoffTime = retryDelay * Math.pow(2, retries - retriesLeft);
          console.warn(`Chunk load failed for ${chunkName}, retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          return tryImport();
        }
        
        console.error(`Failed to load chunk: ${chunkName}`, error);
        
        // Return a minimal fallback component when all retries fail
        return {
          default: (() => {
            const FallbackComponent = (props: any) => (
              <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
                <h3 className="font-medium">Erreur de chargement</h3>
                <p className="text-sm">Impossible de charger le composant. Veuillez rafraîchir la page.</p>
              </div>
            ) as unknown as T;
            return FallbackComponent;
          })()
        };
      }
    };
    
    return tryImport();
  });
}
