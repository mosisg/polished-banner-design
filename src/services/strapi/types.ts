
// Interface definitions for Strapi API responses and data structures

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
