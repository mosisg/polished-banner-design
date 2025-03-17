
import { getStrapiURL, getStrapiAPIKey, getStrapiMedia, USE_MOCK_DATA } from './utils';
import { MOCK_ARTICLES } from './mockData';
import { 
  StrapiResponse, 
  StrapiArticle, 
  Article 
} from './types';

// Fetch API with error handling and fall back to mock data if needed
export const fetchAPI = async <T>(endpoint: string): Promise<T> => {
  // Use mock data in development mode ONLY if USE_MOCK_DATA is true
  if (USE_MOCK_DATA && endpoint.startsWith('articles')) {
    console.log('Using mock data for Strapi API:', endpoint);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Parse the endpoint to determine what to return
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
  
  // Real API call
  try {
    const apiUrl = `${getStrapiURL()}/api/${endpoint}`;
    console.log(`Fetching from Strapi API: ${apiUrl}`);
    
    // Using a simpler fetch approach similar to your Next.js example
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStrapiAPIKey()}`,
      },
    });

    if (!response.ok) {
      console.error(`Strapi API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch from Strapi: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    
    // If USE_MOCK_DATA is false, we should not fallback to mock data
    if (!USE_MOCK_DATA) {
      throw error;
    }
    
    // Fall back to mock data as a last resort if USE_MOCK_DATA is true
    console.warn("Falling back to mock data due to API error");
    if (endpoint.startsWith('articles')) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Parse the endpoint to determine what to return
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
    
    throw error;
  }
};

export const getArticles = async (page = 1, pageSize = 6): Promise<StrapiResponse<StrapiArticle[]>> => {
  return fetchAPI<StrapiResponse<StrapiArticle[]>>(
    `articles?populate=cover,author.avatar,category&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`
  );
};

export const getArticle = async (slug: string): Promise<StrapiResponse<StrapiArticle[]>> => {
  return fetchAPI<StrapiResponse<StrapiArticle[]>>(
    `articles?filters[slug][$eq]=${slug}&populate=cover,author.avatar,category,blocks.file,blocks.files`
  );
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
