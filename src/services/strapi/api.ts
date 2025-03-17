
import { getStrapiURL, getStrapiAPIKey, getStrapiMedia, USE_MOCK_DATA, ALLOWED_ORIGINS } from './utils';
import { MOCK_ARTICLES } from './mockData';
import { 
  StrapiResponse, 
  StrapiArticle, 
  Article 
} from './types';

// Simplified direct fetch approach for Strapi API
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
        'Origin': currentOrigin,
        'Accept': 'application/json',
        // Add cache control headers
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      credentials: 'include', // Include credentials for CORS
      // Extend timeout for potentially slow connections
      signal: AbortSignal.timeout(30000),
      // Add cache: 'no-store' to prevent caching
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Strapi API error (${response.status}): ${errorText}`);
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
    throw new Error(`Failed to fetch data from Strapi: ${(error as Error).message}`);
  }
};

// Simplified approach for fetching articles directly
export const getArticles = async (page = 1, pageSize = 6): Promise<StrapiResponse<StrapiArticle[]>> => {
  try {
    const apiUrl = `${getStrapiURL()}/api/articles`;
    console.log(`Direct fetch from: ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`, {
      headers: {
        'Authorization': `Bearer ${getStrapiAPIKey()}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched articles directly', data);
    return data;
  } catch (error) {
    console.error("Error in direct article fetch:", error);
    
    if (USE_MOCK_DATA) {
      console.log("Using mock data as fallback for getArticles");
      
      // Create a mock response with pagination
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
    
    throw error;
  }
};

// Using the same direct fetch approach for a single article
export const getArticle = async (slug: string): Promise<StrapiResponse<StrapiArticle[]>> => {
  try {
    const apiUrl = `${getStrapiURL()}/api/articles`;
    console.log(`Direct fetch article with slug ${slug} from: ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}?filters[slug][$eq]=${slug}&populate=*`, {
      headers: {
        'Authorization': `Bearer ${getStrapiAPIKey()}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched article directly', data);
    return data;
  } catch (error) {
    console.error("Error in direct article fetch:", error);
    
    if (USE_MOCK_DATA) {
      console.log("Using mock data as fallback for getArticle");
      
      // Find article with matching slug
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
    
    throw error;
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
