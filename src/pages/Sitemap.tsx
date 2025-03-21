
import React, { useEffect, useState } from 'react';
import { generateSitemap } from '@/api/sitemap';
import { Helmet } from 'react-helmet-async';

/**
 * Cette page sert le sitemap en format XML
 */
const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const sitemapXML = await generateSitemap();
        // Vérifier que le XML commence bien par la déclaration XML
        if (!sitemapXML.trim().startsWith('<?xml')) {
          throw new Error('Le XML généré ne commence pas par la déclaration XML correcte');
        }
        setSitemapContent(sitemapXML);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error);
        setError('Erreur lors de la génération du sitemap');
        // Fallback à un sitemap minimal mais valide
        setSitemapContent('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Génération du sitemap en cours...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sitemap | ComparePrix</title>
        <meta name="robots" content="noindex, follow" />
        {/* Important: Content-Type doit être correctement défini pour les fichiers XML */}
        <meta httpEquiv="Content-Type" content="text/xml; charset=utf-8" />
      </Helmet>
      {error ? (
        <div className="flex h-screen items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <pre
          dangerouslySetInnerHTML={{ __html: sitemapContent }} 
          style={{ 
            whiteSpace: 'pre', 
            fontFamily: 'monospace',
            padding: '20px',
            display: 'block'
          }} 
        />
      )}
    </>
  );
};

export default Sitemap;
