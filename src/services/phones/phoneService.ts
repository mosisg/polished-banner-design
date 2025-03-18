
import { Phone, SortOption, FilterOption, PriceRange } from '@/types/phones';
import { supabase } from '@/integrations/supabase/client';

// Cache mechanism
let phonesCache: Phone[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Fetches the XML file from Supabase storage and converts it to JSON
 */
export const fetchPhonesData = async (): Promise<Phone[]> => {
  const currentTime = Date.now();
  
  // Return cached data if available and not expired
  if (phonesCache && currentTime - lastFetchTime < CACHE_DURATION) {
    console.log('Using cached phones data');
    return phonesCache;
  }
  
  try {
    console.log('Fetching phones XML from Supabase');
    
    // Get public URL for the XML file
    const { data: urlData } = await supabase
      .storage
      .from('mosis')
      .createSignedUrl('xmlTmp.xml', 60 * 60); // 1 hour expiry
      
    if (!urlData?.signedUrl) {
      throw new Error('Failed to get signed URL for XML file');
    }
    
    // Fetch the XML file
    const response = await fetch(urlData.signedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch XML file: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    const phones = parseXmlToPhones(xmlText);
    
    // Update cache
    phonesCache = phones;
    lastFetchTime = currentTime;
    
    return phones;
  } catch (error) {
    console.error('Error fetching phones data:', error);
    // Return empty array or cached data if available as fallback
    return phonesCache || [];
  }
};

/**
 * Parses the XML string into a structured Phone array
 */
const parseXmlToPhones = (xmlString: string): Phone[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const productNodes = xmlDoc.getElementsByTagName('product');
    
    const phones: Phone[] = [];
    
    for (let i = 0; i < productNodes.length; i++) {
      const product = productNodes[i];
      
      // Extract all the product fields
      const getElementText = (tagName: string) => {
        const element = product.getElementsByTagName(tagName)[0];
        return element ? element.textContent || '' : '';
      };
      
      // Basic product info
      const ean = getElementText('product_id_ean');
      const title = getElementText('title');
      const trademark = getElementText('trademark');
      const description = getElementText('desc');
      const fullDescription = getElementText('full_desc');
      const priceText = getElementText('price').replace(/[^\d,.]/g, '').replace(',', '.');
      const price = parseFloat(priceText) || 0;
      
      // Extract price and discount information
      let originalPrice = price;
      let discount = 0;
      
      // Check for discounts in description
      const discountMatch = description.match(/(-\d+)€\s+REMISE/i);
      if (discountMatch && discountMatch[1]) {
        discount = Math.abs(parseInt(discountMatch[1]));
        originalPrice = price + discount;
      }
      
      // Image handling
      const defaultImage = getElementText('product_images_image_default');
      const image = defaultImage || '/placeholder.svg';
      
      // Additional images (could be extracted from other fields)
      const additionalImages: string[] = [];
      
      // Category and merchant
      const category = getElementText('category_merchant_category_name');
      const merchant = getElementText('category_merchant_name');
      
      // Determine condition from description or other fields
      let condition: 'new' | 'refurbished' | 'used' = 'new';
      if (description.toLowerCase().includes('reconditionné') || 
          title.toLowerCase().includes('reconditionné')) {
        condition = 'refurbished';
      } else if (description.toLowerCase().includes('occasion') || 
                title.toLowerCase().includes('occasion')) {
        condition = 'used';
      }
      
      // Extract operating system
      let operatingSystem = '';
      if (title.toLowerCase().includes('ios') || 
          trademark.toLowerCase() === 'apple' || 
          title.toLowerCase().includes('iphone')) {
        operatingSystem = 'iOS';
      } else if (title.toLowerCase().includes('android') || 
                description.toLowerCase().includes('android')) {
        operatingSystem = 'Android';
      }
      
      // Extract storage capacity
      let storage = '';
      const storageMatch = title.match(/(\d+)\s*Go\b/i) || description.match(/(\d+)\s*Go\b/i);
      if (storageMatch && storageMatch[1]) {
        storage = `${storageMatch[1]} Go`;
      }
      
      // Extract color
      let color = '';
      const commonColors = ['noir', 'blanc', 'bleu', 'rouge', 'vert', 'jaune', 'rose', 'violet', 'gris', 'argent', 'or'];
      for (const c of commonColors) {
        if (title.toLowerCase().includes(c) || description.toLowerCase().includes(c)) {
          color = c.charAt(0).toUpperCase() + c.slice(1);
          break;
        }
      }
      
      // Shipping information
      const shipping = getElementText('shipping_delivery');
      
      // Installment payment
      let installmentPrice = 0;
      let installmentMonths = 0;
      const installmentMatch = description.match(/(\d+)[€\s]+\/\s*mois\s*x\s*(\d+)/i);
      if (installmentMatch && installmentMatch[1] && installmentMatch[2]) {
        installmentPrice = parseInt(installmentMatch[1]);
        installmentMonths = parseInt(installmentMatch[2]);
      }
      
      // Promotions
      let promotion = '';
      if (description.includes('OFFERTE') || description.includes('OFFERT')) {
        promotion = description.match(/([^\n.]+OFFERTE?[^\n.]+)/i)?.[1] || '';
      }
      
      // Eco-friendly flag
      const isEcoFriendly = description.includes('DURABLE') || 
                           description.includes('RESPONSABLE') ||
                           description.includes('ECO');
      
      // Generate a unique ID if EAN is not available
      const id = ean || `phone-${i}-${Date.now()}`;
      
      phones.push({
        id,
        ean,
        title,
        trademark,
        description,
        fullDescription,
        price,
        originalPrice,
        discount,
        image,
        additionalImages,
        category,
        merchant,
        condition,
        operatingSystem,
        color,
        storage,
        shipping,
        installmentPrice,
        installmentMonths,
        promotion,
        isEcoFriendly,
        inStock: true // Assuming all products are in stock by default
      });
    }
    
    return phones;
  } catch (error) {
    console.error('Error parsing XML:', error);
    return [];
  }
};

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

/**
 * Gets all unique brands from the phones data
 */
export const getBrands = (phones: Phone[]): FilterOption[] => {
  const brandsMap = new Map<string, number>();
  
  phones.forEach(phone => {
    if (phone.trademark) {
      const count = brandsMap.get(phone.trademark) || 0;
      brandsMap.set(phone.trademark, count + 1);
    }
  });
  
  return Array.from(brandsMap.entries())
    .map(([brand, count]) => ({ 
      id: brand.toLowerCase().replace(/\s+/g, '-'), 
      label: brand, 
      count 
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Gets all unique operating systems
 */
export const getOperatingSystems = (phones: Phone[]): FilterOption[] => {
  const osMap = new Map<string, number>();
  
  phones.forEach(phone => {
    if (phone.operatingSystem) {
      const count = osMap.get(phone.operatingSystem) || 0;
      osMap.set(phone.operatingSystem, count + 1);
    }
  });
  
  return Array.from(osMap.entries())
    .map(([os, count]) => ({ 
      id: os.toLowerCase().replace(/\s+/g, '-'), 
      label: os, 
      count 
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Gets all unique storage options
 */
export const getStorageOptions = (phones: Phone[]): FilterOption[] => {
  const storageMap = new Map<string, number>();
  
  phones.forEach(phone => {
    if (phone.storage) {
      const count = storageMap.get(phone.storage) || 0;
      storageMap.set(phone.storage, count + 1);
    }
  });
  
  return Array.from(storageMap.entries())
    .map(([storage, count]) => ({ 
      id: storage.toLowerCase().replace(/\s+/g, '-'), 
      label: storage, 
      count 
    }))
    .sort((a, b) => {
      // Sort by storage size numerically
      const sizeA = parseInt(a.label.match(/\d+/)?.[0] || '0');
      const sizeB = parseInt(b.label.match(/\d+/)?.[0] || '0');
      return sizeA - sizeB;
    });
};

/**
 * Gets price range (min and max) from all phones
 */
export const getPriceRange = (phones: Phone[]): PriceRange => {
  if (phones.length === 0) {
    return { min: 0, max: 2000 };
  }
  
  const prices = phones.map(phone => phone.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
};

// Export a small set of example phones for testing
export const getExamplePhones = (): Phone[] => [
  {
    id: "example-1",
    ean: "1234567890123",
    title: "Samsung Galaxy S21 - 128 Go - Noir",
    trademark: "Samsung",
    description: "Galaxy S21 5G - écran 6,2\" Dynamic AMOLED 2X - 8 Go RAM - 128 Go",
    price: 699,
    originalPrice: 849,
    discount: 150,
    image: "https://example.com/s21.jpg",
    category: "Smartphones",
    merchant: "Amazon",
    condition: "new",
    operatingSystem: "Android",
    color: "Noir",
    storage: "128 Go",
    shipping: "Livraison gratuite",
    installmentPrice: 29,
    installmentMonths: 24,
    isEcoFriendly: true,
    inStock: true
  },
  {
    id: "example-2",
    ean: "2345678901234",
    title: "iPhone 14 Pro - 256 Go - Argent",
    trademark: "Apple",
    description: "iPhone 14 Pro - écran 6,1\" Super Retina XDR - 256 Go",
    price: 1199,
    image: "https://example.com/iphone14.jpg",
    category: "Smartphones",
    merchant: "Apple Store",
    condition: "new",
    operatingSystem: "iOS",
    color: "Argent",
    storage: "256 Go",
    shipping: "Livraison sous 24h",
    rating: 4.8,
    reviewCount: 423,
    inStock: true
  }
];
