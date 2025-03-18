
import { StrapiArticle } from '@/services/strapi/types';
import { getStrapiURL } from '@/services/strapi/utils';

// Base URL de l'application
const BASE_URL = 'https://compareprix.net';

/**
 * Génère le contenu XML d'un sitemap pour le blog
 */
export const generateSitemapXML = (articles: StrapiArticle[]): string => {
  // Date de dernière modification pour les pages statiques
  const now = new Date().toISOString();
  
  // Début du document XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Ajouter les URLs statiques
  xml += `  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n`;
  
  xml += `  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  
  xml += `  <url>
    <loc>${BASE_URL}/mobile</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  
  xml += `  <url>
    <loc>${BASE_URL}/internet</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  
  xml += `  <url>
    <loc>${BASE_URL}/telephones</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  
  // Ajouter les pages de politique
  xml += `  <url>
    <loc>${BASE_URL}/politique-confidentialite</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
  
  xml += `  <url>
    <loc>${BASE_URL}/politique-cookies</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
  
  xml += `  <url>
    <loc>${BASE_URL}/mentions-legales</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
  
  xml += `  <url>
    <loc>${BASE_URL}/cgv</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
  
  // Ajouter les articles du blog
  articles.forEach(article => {
    const updatedAt = new Date(article.attributes.updatedAt).toISOString();
    
    xml += `  <url>
    <loc>${BASE_URL}/blog/${article.attributes.slug}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  });
  
  // Fermer le document XML
  xml += '</urlset>';
  
  return xml;
};
