// Constants - you can change these to point to your actual Strapi instance
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "https://api.compareprix.fr";
const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY || "809930bddfb8e60de2fa673ac8098121dcff48ae6adc3dbabcfa40b6d8b65c359e57a0a49d04e36a32a9abe517fd00961b8f12f7d22cff4e9e423bd1b1ed034f4e2645b3867da6731bee1dfad1209fce787b57f112e1540bbdcf13427b62658d53533f7d3b85336d9ff955ae1a27fd4baee3a7f496c0d1a5a27d90b111ee073b";

// Set to true to use mock data instead of real API calls
const USE_MOCK_DATA = import.meta.env.DEV || true;

// Interface definitions
export interface StrapiMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText?: string;
    };
  };
}

export interface StrapiAuthor {
  data: {
    id: number;
    attributes: {
      name: string;
      avatar?: StrapiImage;
    };
  };
}

export interface StrapiCategory {
  data: {
    id: number;
    attributes: {
      name: string;
      slug: string;
    };
  };
}

export interface StrapiMediaComponent {
  __component: "shared.media";
  id: number;
  file: StrapiImage;
}

export interface StrapiQuoteComponent {
  __component: "shared.quote";
  id: number;
  title: string;
  body: string;
}

export interface StrapiRichTextComponent {
  __component: "shared.rich-text";
  id: number;
  body: string;
}

export interface StrapiSliderComponent {
  __component: "shared.slider";
  id: number;
  files: {
    data: Array<{
      id: number;
      attributes: {
        url: string;
        width: number;
        height: number;
        alternativeText?: string;
      };
    }>;
  };
}

export type StrapiBlock = StrapiMediaComponent | StrapiQuoteComponent | StrapiRichTextComponent | StrapiSliderComponent;

export interface StrapiArticle {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover: StrapiImage;
    author: StrapiAuthor;
    category: StrapiCategory;
    blocks: StrapiBlock[];
  };
}

// Simplified Article interface for frontend use
export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover: {
    url: string;
  };
  publishedAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
}

// Mock data for development
const MOCK_ARTICLES: StrapiArticle[] = [
  {
    id: 1,
    attributes: {
      title: "Comment choisir le forfait mobile idéal en 2023",
      description: "Guide complet pour trouver le forfait mobile qui correspond à vos besoins et à votre budget.",
      slug: "comment-choisir-forfait-mobile-ideal",
      createdAt: "2023-06-15T10:00:00.000Z",
      updatedAt: "2023-06-15T10:00:00.000Z",
      publishedAt: "2023-06-15T10:00:00.000Z",
      cover: {
        data: {
          id: 1,
          attributes: {
            url: "/placeholder.svg",
            width: 1200,
            height: 630,
            alternativeText: "Forfait mobile"
          }
        }
      },
      author: {
        data: {
          id: 1,
          attributes: {
            name: "Sophie Martin",
            avatar: {
              data: {
                id: 2,
                attributes: {
                  url: "/placeholder.svg",
                  width: 200,
                  height: 200,
                  alternativeText: "Sophie Martin"
                }
              }
            }
          }
        }
      },
      category: {
        data: {
          id: 1,
          attributes: {
            name: "Forfaits Mobiles",
            slug: "forfaits-mobiles"
          }
        }
      },
      blocks: [
        {
          __component: "shared.rich-text",
          id: 1,
          body: "<h2>Comprendre vos besoins en data</h2><p>Avant de choisir un forfait, évaluez votre consommation mensuelle de données. Utilisez-vous principalement votre téléphone pour les e-mails et la navigation web, ou êtes-vous un grand consommateur de vidéos en streaming et de jeux en ligne ?</p>"
        },
        {
          __component: "shared.quote",
          id: 2,
          title: "À savoir",
          body: "En moyenne, regarder une vidéo en HD sur YouTube consomme environ 1,5 Go par heure."
        },
        {
          __component: "shared.media",
          id: 3,
          file: {
            data: {
              id: 3,
              attributes: {
                url: "/placeholder.svg",
                width: 800,
                height: 450,
                alternativeText: "Consommation de data"
              }
            }
          }
        }
      ]
    }
  },
  {
    id: 2,
    attributes: {
      title: "Les box internet fibre : comparatif des meilleures offres",
      description: "Découvrez notre comparatif détaillé des meilleures box internet fibre du marché.",
      slug: "comparatif-meilleures-box-internet-fibre",
      createdAt: "2023-05-20T14:30:00.000Z",
      updatedAt: "2023-05-20T14:30:00.000Z",
      publishedAt: "2023-05-20T14:30:00.000Z",
      cover: {
        data: {
          id: 4,
          attributes: {
            url: "/placeholder.svg",
            width: 1200,
            height: 630,
            alternativeText: "Box internet fibre"
          }
        }
      },
      author: {
        data: {
          id: 2,
          attributes: {
            name: "Thomas Dubois",
            avatar: {
              data: {
                id: 5,
                attributes: {
                  url: "/placeholder.svg",
                  width: 200,
                  height: 200,
                  alternativeText: "Thomas Dubois"
                }
              }
            }
          }
        }
      },
      category: {
        data: {
          id: 2,
          attributes: {
            name: "Box Internet",
            slug: "box-internet"
          }
        }
      },
      blocks: [
        {
          __component: "shared.rich-text",
          id: 4,
          body: "<h2>Pourquoi passer à la fibre ?</h2><p>La fibre optique offre des débits bien supérieurs à l'ADSL, permettant une utilisation simultanée de plusieurs appareils sans perte de qualité.</p>"
        },
        {
          __component: "shared.slider",
          id: 5,
          files: {
            data: [
              {
                id: 6,
                attributes: {
                  url: "/placeholder.svg",
                  width: 600,
                  height: 400,
                  alternativeText: "Box fibre opérateur 1"
                }
              },
              {
                id: 7,
                attributes: {
                  url: "/placeholder.svg",
                  width: 600,
                  height: 400,
                  alternativeText: "Box fibre opérateur 2"
                }
              }
            ]
          }
        }
      ]
    }
  }
];

// Fetch API with error handling and mock data support
const fetchAPI = async <T>(endpoint: string): Promise<T> => {
  // Use mock data in development mode
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
    console.log(`Fetching from Strapi API: ${STRAPI_URL}/api/${endpoint}`);
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
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

export const getStrapiMedia = (url: string | null | undefined): string => {
  if (!url) return "";
  
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  
  if (url.startsWith("/")) {
    // Likely a placeholder or local asset
    return url;
  }
  
  return `${STRAPI_URL}${url}`;
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
