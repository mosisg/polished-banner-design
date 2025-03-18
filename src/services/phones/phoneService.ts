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
    
    // Get public URL for the XML file from the "mosis" bucket
    const { data: urlData, error: urlError } = await supabase
      .storage
      .from('mosis')
      .createSignedUrl('xmlTmp.xml', 60 * 60); // 1 hour expiry
      
    if (urlError || !urlData?.signedUrl) {
      console.error('Failed to get signed URL for XML file:', urlError);
      console.log('Falling back to example phones data');
      return getExamplePhones();
    }
    
    // Fetch the XML file
    const response = await fetch(urlData.signedUrl);
    if (!response.ok) {
      console.error(`Failed to fetch XML file: ${response.statusText}`);
      console.log('Falling back to example phones data');
      return getExamplePhones();
    }
    
    const xmlText = await response.text();
    const phones = parseXmlToPhones(xmlText);
    
    // If no phones parsed successfully, use example data
    if (phones.length === 0) {
      console.log('No phones found in XML, using example data');
      return getExamplePhones();
    }
    
    // Update cache
    phonesCache = phones;
    lastFetchTime = currentTime;
    
    console.log(`Successfully loaded ${phones.length} phones from XML`);
    return phones;
  } catch (error) {
    console.error('Error fetching phones data:', error);
    // Return cached data or example phones as fallback
    console.log('Error occurred, falling back to example phones data');
    return phonesCache || getExamplePhones();
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

// Export a more extensive set of example phones for testing
export const getExamplePhones = (): Phone[] => [
  {
    id: "example-1",
    ean: "1234567890123",
    title: "Samsung Galaxy S23 Ultra - 256 Go - Noir",
    trademark: "Samsung",
    description: "Galaxy S23 Ultra 5G - écran 6,8\" Dynamic AMOLED 2X - 12 Go RAM - 256 Go - S Pen inclus",
    fullDescription: "Le Galaxy S23 Ultra est doté d'un appareil photo de 200MP pour des prises de vue nocturnes époustouflantes, du S Pen intégré, et d'une batterie qui dure plus d'une journée.",
    price: 899,
    originalPrice: 1199,
    discount: 300,
    image: "https://images.samsung.com/is/image/samsung/p6pim/fr/2302/gallery/fr-galaxy-s23-ultra-s918-sm-s918bzkcfxp-534863638",
    additionalImages: [],
    category: "Smartphones",
    merchant: "Samsung Shop",
    condition: "new",
    operatingSystem: "Android",
    color: "Noir",
    storage: "256 Go",
    shipping: "Livraison gratuite",
    installmentPrice: 39,
    installmentMonths: 24,
    promotion: "Galaxy Buds2 Pro OFFERTS",
    isEcoFriendly: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 423
  },
  {
    id: "example-2",
    ean: "2345678901234",
    title: "iPhone 14 Pro - 256 Go - Violet Intense",
    trademark: "Apple",
    description: "iPhone 14 Pro - écran 6,1\" Super Retina XDR - 256 Go - Dynamic Island - Puce A16 Bionic",
    fullDescription: "L'iPhone 14 Pro introduit Dynamic Island et l'écran toujours activé. Appareil photo 48Mpx pour une résolution 4x supérieure. Détection des accidents. A16 Bionic, la puce de smartphone la plus rapide au monde.",
    price: 1099,
    originalPrice: 1329,
    discount: 230,
    image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-1-202209",
    category: "Smartphones",
    merchant: "Apple Store",
    condition: "new",
    operatingSystem: "iOS",
    color: "Violet Intense",
    storage: "256 Go",
    shipping: "Livraison sous 24h",
    promotion: "",
    rating: 4.9,
    reviewCount: 512,
    inStock: true
  },
  {
    id: "example-3",
    ean: "3456789012345",
    title: "Google Pixel 7 Pro - 128 Go - Vert Sauge",
    trademark: "Google",
    description: "Pixel 7 Pro - écran 6,7\" QHD+ LTPO OLED 120 Hz - 128 Go - Processeur Google Tensor G2",
    fullDescription: "Le Google Pixel 7 Pro est le smartphone le plus avancé de Google à ce jour. Il est équipé de la puce Google Tensor G2 et du système Titan M2, qui le rendent plus rapide, plus efficace et plus sécurisé.",
    price: 649,
    originalPrice: 899,
    discount: 250,
    image: "https://lh3.googleusercontent.com/uSGjbg5FYWX01alVH1x6s6JZlvl5YS_H9frL0a2-mjMYZHTWAaJqXpVvrOIkSHQkIxEHLX7FDbBz9jv3cGOsUfhbYGaf-zdI",
    category: "Smartphones",
    merchant: "Google Store",
    condition: "new",
    operatingSystem: "Android",
    color: "Vert Sauge",
    storage: "128 Go",
    shipping: "Livraison gratuite",
    rating: 4.6,
    reviewCount: 368,
    inStock: true,
    isEcoFriendly: true
  },
  {
    id: "example-4",
    ean: "4567890123456",
    title: "Xiaomi 13 - 256 Go - Blanc",
    trademark: "Xiaomi",
    description: "Xiaomi 13 - écran 6,36\" AMOLED 120 Hz - Snapdragon 8 Gen 2 - 256 Go - Co-développé avec Leica",
    price: 699,
    originalPrice: 999,
    discount: 300,
    image: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13-2.jpg",
    category: "Smartphones",
    merchant: "Mi Store",
    condition: "new",
    operatingSystem: "Android",
    color: "Blanc",
    storage: "256 Go",
    shipping: "Livraison en 48h",
    installmentPrice: 29,
    installmentMonths: 24,
    rating: 4.5,
    reviewCount: 215,
    inStock: true
  },
  {
    id: "example-5",
    ean: "5678901234567",
    title: "iPhone 13 - 128 Go - Rouge - Reconditionné",
    trademark: "Apple",
    description: "iPhone 13 reconditionné - écran 6,1\" Super Retina XDR - 128 Go - Grade A+",
    price: 599,
    image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-product-red-select-2021",
    category: "Smartphones",
    merchant: "Back Market",
    condition: "refurbished",
    operatingSystem: "iOS",
    color: "Rouge",
    storage: "128 Go",
    shipping: "Livraison gratuite",
    rating: 4.7,
    reviewCount: 432,
    isEcoFriendly: true,
    inStock: true
  },
  {
    id: "example-6",
    ean: "6789012345678",
    title: "Samsung Galaxy Z Flip4 - 256 Go - Lavande",
    trademark: "Samsung",
    description: "Galaxy Z Flip4 - écran principal 6,7\" Dynamic AMOLED 2X - écran externe 1,9\" - 256 Go",
    price: 799,
    originalPrice: 1199,
    discount: 400,
    image: "https://images.samsung.com/is/image/samsung/p6pim/fr/galaxy-z-flip4/feature/fr-feature-flex-your-world-with-a-foldable-phone-531153153",
    category: "Smartphones",
    merchant: "Darty",
    condition: "new",
    operatingSystem: "Android",
    color: "Lavande",
    storage: "256 Go",
    shipping: "Livraison gratuite",
    installmentPrice: 33,
    installmentMonths: 24,
    rating: 4.6,
    reviewCount: 187,
    inStock: true
  },
  {
    id: "example-7",
    ean: "7890123456789",
    title: "OnePlus 11 - 256 Go - Noir",
    trademark: "OnePlus",
    description: "OnePlus 11 5G - écran 6,7\" AMOLED LTPO3 120 Hz - Snapdragon 8 Gen 2 - 256 Go",
    price: 699,
    originalPrice: 919,
    discount: 220,
    image: "https://oasis.opstatics.com/content/dam/oasis/page/2023/operation/mar/0306/EU-IN_green_pdp_carousel_2_img.jpg",
    category: "Smartphones",
    merchant: "OnePlus Store",
    condition: "new",
    operatingSystem: "Android",
    color: "Noir",
    storage: "256 Go",
    shipping: "Livraison sous 48h",
    rating: 4.5,
    reviewCount: 156,
    inStock: true
  },
  {
    id: "example-8",
    ean: "8901234567890",
    title: "Nothing Phone (1) - 128 Go - Blanc",
    trademark: "Nothing",
    description: "Nothing Phone (1) - écran 6,55\" OLED 120 Hz - 128 Go - Interface Glyph - Snapdragon 778G+",
    price: 349,
    originalPrice: 469,
    discount: 120,
    image: "https://cdn.shopify.com/s/files/1/0597/9421/5509/products/Phone1-Black-Front.jpg",
    category: "Smartphones",
    merchant: "Amazon",
    condition: "new",
    operatingSystem: "Android",
    color: "Blanc",
    storage: "128 Go",
    shipping: "Livraison gratuite",
    rating: 4.3,
    reviewCount: 142,
    isEcoFriendly: true,
    inStock: true
  },
  {
    id: "example-9",
    ean: "9012345678901",
    title: "Samsung Galaxy A54 - 128 Go - Bleu",
    trademark: "Samsung",
    description: "Galaxy A54 5G - écran 6,4\" Super AMOLED 120 Hz - 128 Go - Batterie 5000 mAh",
    price: 299,
    originalPrice: 499,
    discount: 200,
    image: "https://images.samsung.com/is/image/samsung/p6pim/fr/sm-a546blbdxef/gallery/fr-galaxy-a54-5g-sm-a546-sm-a546blbdxef-536036031",
    category: "Smartphones",
    merchant: "Boulanger",
    condition: "new",
    operatingSystem: "Android",
    color: "Bleu",
    storage: "128 Go",
    shipping: "Livraison gratuite",
    installmentPrice: 12,
    installmentMonths: 24,
    rating: 4.4,
    reviewCount: 278,
    inStock: true
  },
  {
    id: "example-10",
    ean: "0123456789012",
    title: "iPhone 14 - 128 Go - Bleu",
    trademark: "Apple",
    description: "iPhone 14 - écran 6,1\" Super Retina XDR - 128 Go - Détection des accidents",
    price: 769,
    originalPrice: 869,
    discount: 100,
    image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue",
    category: "Smartphones",
    merchant: "FNAC",
    condition: "new",
    operatingSystem: "iOS",
    color: "Bleu",
    storage: "128 Go",
    shipping: "Livraison gratuite",
    rating: 4.7,
    reviewCount: 386,
    inStock: true
  },
  {
    id: "example-11",
    ean: "1092837465001",
    title: "Samsung Galaxy S22 Ultra - 256 Go - Bordeaux - Reconditionné",
    trademark: "Samsung",
    description: "Galaxy S22 Ultra reconditionné - Grade A - écran 6,8\" Dynamic AMOLED 2X - 256 Go - S Pen inclus",
    price: 599,
    originalPrice: 1099,
    discount: 500,
    image: "https://images.samsung.com/is/image/samsung/p6pim/fr/sm-s908bdrgeub/gallery/fr-galaxy-s22-ultra-s908-sm-s908bdrgeub-530750523",
    category: "Smartphones",
    merchant: "CertiDeal",
    condition: "refurbished",
    operatingSystem: "Android",
    color: "Bordeaux",
    storage: "256 Go",
    shipping: "Livraison gratuite",
    rating: 4.5,
    reviewCount: 324,
    isEcoFriendly: true,
    inStock: true
  },
  {
    id: "example-12",
    ean: "1092837465002",
    title: "Motorola Edge 40 Pro - 256 Go - Noir",
    trademark: "Motorola",
    description: "Motorola Edge 40 Pro - écran 6,67\" pOLED 165 Hz - Snapdragon 8 Gen 2 - 256 Go",
    price: 599,
    originalPrice: 899,
    discount: 300,
    image: "https://mobilecontent.costco.com/live/resource/img/ca-static-pages/d-motorola-edge-40-pro-cosmic.jpg",
    category: "Smartphones",
    merchant: "Cdiscount",
    condition: "new",
    operatingSystem: "Android",
    color: "Noir",
    storage: "256 Go",
    shipping: "Livraison en 24h",
    rating: 4.4,
    reviewCount: 112,
    inStock: true
  }
];
