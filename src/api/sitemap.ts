
import { fetchAPI } from '@/services/strapi/api';
import { StrapiResponse, StrapiArticle } from '@/services/strapi/types';
import { generateSitemapXML } from '@/utils/sitemap';

/**
 * Récupère tous les articles pour le sitemap
 */
export const getAllArticlesForSitemap = async (): Promise<StrapiArticle[]> => {
  try {
    // On récupère tous les articles (100 maximum)
    const response = await fetchAPI<StrapiResponse<StrapiArticle[]>>(
      'articles?pagination[pageSize]=100'
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles pour le sitemap:', error);
    return [];
  }
};

/**
 * Génère le contenu du sitemap
 */
export const generateSitemap = async (): Promise<string> => {
  const articles = await getAllArticlesForSitemap();
  return generateSitemapXML(articles);
};
