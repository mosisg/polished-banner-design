
export interface MobilePlan {
  id: number;
  name: string;
  operator: string;
  data: string;
  price: string;
  coverage: string;
  features: string[];
}

export type NetworkType = 'all' | '4G' | '5G';
export type SortOption = 'price-asc' | 'price-desc' | 'data-asc' | 'data-desc';
