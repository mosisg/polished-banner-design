import { getStrapiURL, getStrapiAPIKey, getStrapiMedia, USE_MOCK_DATA } from './utils';
import { MOCK_ARTICLES } from './mockData';
import { 
  StrapiResponse, 
  StrapiArticle, 
  Article 
} from './types';

// Simplified fetch API that falls back to mock data if needed
export const fetchAPI = async <T>(endpoint: string): Promise<T> => {
  console.log('USE_MOCK_DATA is set to:', USE_MOCK_DATA);
  
  // Try to fetch from API first if mock data is disabled
  if (!USE_MOCK_DATA) {
    try {
      const apiUrl = `${getStrapiURL()}/api/${endpoint}`;
      console.log(`Fetching from Strapi API: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getStrapiAPIKey()}`,
        },
        // Add a timeout to prevent long-hanging requests
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from Strapi: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Successfully fetched data from API');
      return data;
    } catch (error) {
      console.error("Error fetching from Strapi:", error);
      console.log("Falling back to mock data");
    }
  }
  
  // If USE_MOCK_DATA is true or if the API request failed, use mock data
  console.log('Using mock data for:', endpoint);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Parse the endpoint to determine what to return
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
  
  throw new Error(`No mock data available for endpoint: ${endpoint}`);
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
