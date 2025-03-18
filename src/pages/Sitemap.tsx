
import React, { useEffect, useState } from 'react';
import { generateSitemap } from '@/api/sitemap';
import { Helmet } from 'react-helmet-async';

/**
 * Cette page sert le sitemap en format XML
 */
const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const sitemapXML = await generateSitemap();
        setSitemapContent(sitemapXML);
      } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error);
        setSitemapContent('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
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

  // Forcer le type de contenu à application/xml
  return (
    <>
      <Helmet>
        <title>Sitemap | ComparePrix</title>
        <meta name="robots" content="noindex, follow" />
        <meta httpEquiv="Content-Type" content="application/xml; charset=utf-8" />
      </Helmet>
      <div 
        dangerouslySetInnerHTML={{ __html: sitemapContent }} 
        style={{ 
          whiteSpace: 'pre', 
          fontFamily: 'monospace',
          padding: '20px'
        }} 
      />
    </>
  );
};

export default Sitemap;
