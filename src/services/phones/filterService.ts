
import { Phone, SortOption, FilterOption, PriceRange } from '@/types/phones';

/**
 * Filters the phones data based on criteria
 */
export const filterPhones = (
  phones: Phone[], 
  filters: {
    brands: string[];
    priceRange: { min: number; max: number };
    conditions: ('new' | 'refurbished' | 'used')[];
    operatingSystems: string[];
    storage: string[];
    ecoFriendly?: boolean;
  }
) => {
  return phones.filter(phone => {
    // Filter by brand
    if (filters.brands.length > 0 && !filters.brands.includes(phone.trademark)) {
      return false;
    }
    
    // Filter by price
    if (phone.price < filters.priceRange.min || phone.price > filters.priceRange.max) {
      return false;
    }
    
    // Filter by condition
    if (filters.conditions.length > 0 && !filters.conditions.includes(phone.condition)) {
      return false;
    }
    
    // Filter by OS
    if (filters.operatingSystems.length > 0 && 
        phone.operatingSystem && 
        !filters.operatingSystems.includes(phone.operatingSystem)) {
      return false;
    }
    
    // Filter by storage
    if (filters.storage.length > 0 && 
        phone.storage && 
        !filters.storage.includes(phone.storage)) {
      return false;
    }
    
    // Filter by eco-friendly status
    if (filters.ecoFriendly && !phone.isEcoFriendly) {
      return false;
    }
    
    return true;
  });
};

/**
 * Sorts phones based on the selected sort option
 */
export const sortPhones = (phones: Phone[], sortOption: SortOption): Phone[] => {
  return [...phones].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      case 'newest':
        // This is a placeholder as we don't have a real "newest" field
        // In real implementation, we could use a date field
        return 0;
      case 'popularity':
        // This is a placeholder as we don't have a real "popularity" field
        // In real implementation, we could use views or sales count
        return 0;
      default:
        return 0;
    }
  });
};
