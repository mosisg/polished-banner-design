
export interface Phone {
  id: string;
  ean: string;
  title: string;
  trademark: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  additionalImages?: string[];
  category: string;
  merchant: string;
  condition: 'new' | 'refurbished' | 'used';
  operatingSystem?: string;
  color?: string;
  storage?: string;
  shipping?: string;
  installmentPrice?: number;
  installmentMonths?: number;
  promotion?: string;
  rating?: number;
  reviewCount?: number;
  isEcoFriendly?: boolean;
  inStock?: boolean;
  productUrl?: string;
}

export type FilterOption = {
  id: string;
  label: string;
  count: number;
};

export type PriceRange = {
  min: number;
  max: number;
};

export type SortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'popularity' 
  | 'newest'
  | 'rating-desc';
