
import { getStrapiURL, getStrapiAPIKey, getStrapiMedia, USE_MOCK_DATA, ALLOWED_ORIGINS } from './utils';
import { MOCK_ARTICLES } from './mockData';
import { 
  StrapiResponse, 
  StrapiArticle, 
  Article 
} from './types';

// Improved fetch approach for Strapi API with better error handling
export const fetchAPI = async <T>(endpoint: string): Promise<T> => {
  console.log('Attempting to fetch from Strapi API');
  
  try {
    // Add a cache-busting parameter to prevent browser caching
    const cacheBuster = `_cb=${Date.now()}`;
    const separator = endpoint.includes('?') ? '&' : '?';
    const apiUrl = `${getStrapiURL()}/api/${endpoint}${separator}${cacheBuster}`;
    
    console.log(`Fetching from Strapi API: ${apiUrl}`);
    
    // Get current origin for CORS
    const currentOrigin = window.location.origin;
    console.log(`Current origin: ${currentOrigin}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStrapiAPIKey()}`,
      },
      mode: 'cors',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Strapi: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched data from API', data);
    return data;
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    
    if (USE_MOCK_DATA) {
      console.log("Using mock data as fallback");
      // Only use mock data if explicitly allowed
      if (endpoint.startsWith('articles')) {
        
        if (endpoint.includes('filters[slug]')) {
          // Extract slug from endpoint 
          const slugMatch = endpoint.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
          const slug = slugMatch ? slugMatch[1] : '';
          
          // Find the article with matching slug
          const article = MOCK_ARTICLES.find(a => a.attributes.slug === slug);
          
          if (!article) {
            throw new Error("Article not found");
          }
          
          return {
            data: [article],
            meta: {
              pagination: {
                page: 1,
                pageSize: 1,
                pageCount: 1,
                total: 1
              }
            }
          } as unknown as T;
        }
        
        // Handle pagination
        const pageMatch = endpoint.match(/pagination\[page\]=(\d+)/);
        const pageSizeMatch = endpoint.match(/pagination\[pageSize\]=(\d+)/);
        
        const page = pageMatch ? parseInt(pageMatch[1]) : 1;
        const pageSize = pageSizeMatch ? parseInt(pageSizeMatch[1]) : 6;
        
        // Mock pagination logic
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedArticles = MOCK_ARTICLES.slice(startIndex, endIndex);
        
        return {
          data: paginatedArticles,
          meta: {
            pagination: {
              page,
              pageSize,
              pageCount: Math.ceil(MOCK_ARTICLES.length / pageSize),
              total: MOCK_ARTICLES.length
            }
          }
        } as unknown as T;
      }
    }
    
    // If we get here, rethrow the error to be handled by the caller
    throw error;
  }
};

// Use original endpoints for articles
export const getArticles = async (page = 1, pageSize = 6): Promise<StrapiResponse<StrapiArticle[]>> => {
  try {
    return await fetchAPI<StrapiResponse<StrapiArticle[]>>(
      `articles?populate=cover,author.avatar,category&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`
    );
  } catch (error) {
    console.error("Failed to get articles:", error);
    // Directly return mock data when API fails
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = MOCK_ARTICLES.slice(startIndex, endIndex);
    
    return {
      data: paginatedArticles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(MOCK_ARTICLES.length / pageSize),
          total: MOCK_ARTICLES.length
        }
      }
    };
  }
};

export const getArticle = async (slug: string): Promise<StrapiResponse<StrapiArticle[]>> => {
  try {
    return await fetchAPI<StrapiResponse<StrapiArticle[]>>(
      `articles?filters[slug][$eq]=${slug}&populate=cover,author.avatar,category,blocks.file,blocks.files`
    );
  } catch (error) {
    console.error("Failed to get article:", error);
    // Directly return mock data when API fails
    const article = MOCK_ARTICLES.find(a => a.attributes.slug === slug);
    
    if (!article) {
      throw new Error("Article not found");
    }
    
    return {
      data: [article],
      meta: {
        pagination: {
          page: 1,
          pageSize: 1,
          pageCount: 1,
          total: 1
        }
      }
    };
  }
};

// Helper function to transform StrapiArticle[] to simplified Article[]
export const transformArticlesToSimpleFormat = (articles: StrapiArticle[]): Article[] => {
  return articles.map(article => ({
    id: article.id.toString(),
    title: article.attributes.title,
    slug: article.attributes.slug,
    description: article.attributes.description,
    cover: {
      url: article.attributes.cover?.data 
        ? getStrapiMedia(article.attributes.cover.data.attributes.url)
        : "/placeholder.svg",
    },
    publishedAt: article.attributes.publishedAt,
    author: article.attributes.author?.data ? {
      name: article.attributes.author.data.attributes.name,
      avatar: article.attributes.author.data.attributes.avatar?.data
        ? getStrapiMedia(article.attributes.author.data.attributes.avatar.data.attributes.url)
        : undefined,
    } : undefined,
    category: article.attributes.category?.data ? {
      name: article.attributes.category.data.attributes.name,
      slug: article.attributes.category.data.attributes.slug,
    } : undefined,
  }));
};
