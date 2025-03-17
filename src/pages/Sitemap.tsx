
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSitemap } from '@/api/sitemap';

/**
 * Cette page sert le sitemap en format XML
 */
const Sitemap = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const serveSitemap = async () => {
      try {
        const sitemapXML = await generateSitemap();
        
        // Créer un Blob avec le contenu XML
        const blob = new Blob([sitemapXML], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        // Ouvrir le XML directement dans le navigateur
        window.location.href = url;
        
        // Alternative: télécharger le fichier
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = 'sitemap.xml';
        // link.click();
        // URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error);
        navigate('/');
      }
    };

    serveSitemap();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Génération du sitemap en cours...</p>
    </div>
  );
};

export default Sitemap;
