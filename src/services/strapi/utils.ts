// Constants and utility functions
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY || "cf7ca29cb2e91b040ba3bb57b6b8ef8d41783acaf88d693b31f3b17ebeb8499a6be4d95c23005a1f17da7f5d68b87d37fc518c5a02054d4687bee7359d9f8383e558eb947695fe1b6c6c102943d808624a5b7f5b837e034d941181fe77cad95f5458d95a26a0c31436bb60973d5917b344ae5c9e0a087afd83b431f4415c77d9";

// Enable mock data as fallback when the API is unavailable
export const USE_MOCK_DATA = true;

// Allowed origins for CORS - updated to include all possible Lovable domains
export const ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1337',
  'https://preview--polished-banner-design.lovable.app',
  'https://polished-banner-design.lovable.app',
  window.location.origin
];

export const getStrapiURL = (): string => {
  return STRAPI_URL;
};

export const getStrapiAPIKey = (): string => {
  return STRAPI_API_KEY;
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
