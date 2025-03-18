
import { Phone } from '@/types/phones';

/**
 * Parses the XML string into a structured Phone array
 */
export const parseXmlToPhones = (xmlString: string): Phone[] => {
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
