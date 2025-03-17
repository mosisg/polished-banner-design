
// Constants and utility functions
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY || "809930bddfb8e60de2fa673ac8098121dcff48ae6adc3dbabcfa40b6d8b65c359e57a0a49d04e36a32a9abe517fd00961b8f12f7d22cff4e9e423bd1b1ed034f4e2645b3867da6731bee1dfad1209fce787b57f112e1540bbdcf13427b62658d53533f7d3b85336d9ff955ae1a27fd4baee3a7f496c0d1a5a27d90b111ee073b";

// Use mock data when in development mode or when explicitly set
export const USE_MOCK_DATA = false;

// We're disabling CORS proxy since you're able to access the Strapi API directly
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
