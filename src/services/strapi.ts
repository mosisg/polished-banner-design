
const STRAPI_URL = "http://localhost:1337";
const STRAPI_API_KEY = "809930bddfb8e60de2fa673ac8098121dcff48ae6adc3dbabcfa40b6d8b65c359e57a0a49d04e36a32a9abe517fd00961b8f12f7d22cff4e9e423bd1b1ed034f4e2645b3867da6731bee1dfad1209fce787b57f112e1540bbdcf13427b62658d53533f7d3b85336d9ff955ae1a27fd4baee3a7f496c0d1a5a27d90b111ee073b";

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

const fetchAPI = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${STRAPI_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
  }

  return await response.json();
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
  
  return `${STRAPI_URL}${url}`;
};
