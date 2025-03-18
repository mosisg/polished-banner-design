
import { Phone } from '@/types/phones';

/**
 * Parses the XML string into a structured Phone array
 */
export const parseXmlToPhones = (xmlString: string): Phone[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Check for parser errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('XML parsing error:', parserError.textContent);
      return [];
    }
    
    // First, attempt to find product nodes (adapt this to match your XML structure)
    let productNodes = xmlDoc.getElementsByTagName('product');
    
    // If no products found, try alternative tags that might be used in the XML
    if (productNodes.length === 0) {
      const possibleTags = ['item', 'offer', 'phone', 'article', 'produit'];
      
      for (const tag of possibleTags) {
        const nodes = xmlDoc.getElementsByTagName(tag);
        if (nodes.length > 0) {
          console.log(`Found ${nodes.length} products using tag "${tag}"`);
          productNodes = nodes;
          break;
        }
      }
    }
    
    console.log(`Found ${productNodes.length} product nodes in XML`);
    
    const phones: Phone[] = [];
    
    for (let i = 0; i < productNodes.length; i++) {
      const product = productNodes[i];
      
      // Extract all the product fields with flexible tag name handling
      const getElementText = (tagName: string, alternativeTags: string[] = []): string => {
        // Try primary tag first
        const element = product.getElementsByTagName(tagName)[0];
        if (element && element.textContent) {
          return element.textContent.trim();
        }
        
        // Try alternatives
        for (const altTag of alternativeTags) {
          const altElement = product.getElementsByTagName(altTag)[0];
          if (altElement && altElement.textContent) {
            return altElement.textContent.trim();
          }
        }
        
        // Try attributes if element is not found
        if (product.getAttribute(tagName)) {
          return product.getAttribute(tagName) || '';
        }
        
        return '';
      };
      
      // Basic product info with flexible tag names
      const id = getElementText('id', ['product_id', 'identifier', 'gtin']);
      const ean = getElementText('product_id_ean', ['ean', 'gtin', 'ean13', 'upc']);
      const title = getElementText('title', ['name', 'product_name', 'nom']);
      const trademark = getElementText('trademark', ['brand', 'marque', 'fabricant']);
      const description = getElementText('desc', ['short_desc', 'description', 'description_short']);
      const fullDescription = getElementText('full_desc', ['description_long', 'long_description']);
      
      // Price handling with flexible formats
      const priceText = getElementText('price', ['price_including_taxes', 'prix', 'current_price'])
        .replace(/[^\d,.]/g, '')
        .replace(',', '.');
      const price = parseFloat(priceText) || 0;
      
      // Original price handling
      const originalPriceText = getElementText('old_price', ['price_excluding_taxes', 'regular_price', 'prix_normal'])
        .replace(/[^\d,.]/g, '')
        .replace(',', '.');
      const originalPrice = parseFloat(originalPriceText) || price;
      
      // Extract price and discount information
      let discount = 0;
      if (originalPrice > price) {
        discount = Math.round(originalPrice - price);
      } else {
        // Check for discounts in description
        const discountMatch = description.match(/(-\d+)€\s+REMISE/i);
        if (discountMatch && discountMatch[1]) {
          discount = Math.abs(parseInt(discountMatch[1]));
        }
      }
      
      // Image handling with multiple fallbacks
      const defaultImage = getElementText('product_images_image_default', [
        'image', 'image_url', 'picture', 'thumbnail', 'image_link'
      ]);
      const image = defaultImage || '/placeholder.svg';
      
      // Additional images (could be extracted from other fields)
      const additionalImages: string[] = [];
      const additionalImagesElements = product.getElementsByTagName('additional_image');
      for (let j = 0; j < additionalImagesElements.length; j++) {
        const imgUrl = additionalImagesElements[j].textContent;
        if (imgUrl) additionalImages.push(imgUrl);
      }
      
      // Category and merchant
      const category = getElementText('category_merchant_category_name', ['category', 'categorie']);
      const merchant = getElementText('category_merchant_name', ['merchant', 'vendeur', 'shop']);
      
      // Determine condition from description or other fields
      let condition: 'new' | 'refurbished' | 'used' = 'new';
      const conditionText = getElementText('condition', ['product_condition', 'etat']).toLowerCase();
      
      if (conditionText.includes('reconditionné') || 
          conditionText.includes('refurbished') || 
          description.toLowerCase().includes('reconditionné') || 
          title.toLowerCase().includes('reconditionné')) {
        condition = 'refurbished';
      } else if (conditionText.includes('occasion') || 
                conditionText.includes('used') || 
                description.toLowerCase().includes('occasion') || 
                title.toLowerCase().includes('occasion')) {
        condition = 'used';
      }
      
      // Extract operating system
      let operatingSystem = getElementText('operating_system', ['os', 'system']);
      if (!operatingSystem) {
        if (title.toLowerCase().includes('ios') || 
            trademark.toLowerCase() === 'apple' || 
            title.toLowerCase().includes('iphone')) {
          operatingSystem = 'iOS';
        } else if (title.toLowerCase().includes('android') || 
                  description.toLowerCase().includes('android')) {
          operatingSystem = 'Android';
        }
      }
      
      // Extract storage capacity
      let storage = getElementText('storage', ['capacity', 'memoire']);
      if (!storage) {
        const storageMatch = title.match(/(\d+)\s*Go\b/i) || description.match(/(\d+)\s*Go\b/i);
        if (storageMatch && storageMatch[1]) {
          storage = `${storageMatch[1]} Go`;
        }
      }
      
      // Extract color
      let color = getElementText('color', ['couleur']);
      if (!color) {
        const commonColors = ['noir', 'blanc', 'bleu', 'rouge', 'vert', 'jaune', 'rose', 'violet', 'gris', 'argent', 'or'];
        for (const c of commonColors) {
          if (title.toLowerCase().includes(c) || description.toLowerCase().includes(c)) {
            color = c.charAt(0).toUpperCase() + c.slice(1);
            break;
          }
        }
      }
      
      // Shipping information
      const shipping = getElementText('shipping_delivery', ['shipping', 'delivery', 'livraison']);
      
      // Installment payment
      let installmentPrice = 0;
      let installmentMonths = 0;
      
      const installmentPriceText = getElementText('installment_price', ['monthly_payment']);
      if (installmentPriceText) {
        installmentPrice = parseFloat(installmentPriceText.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      }
      
      const installmentMonthsText = getElementText('installment_months', ['payment_periods']);
      if (installmentMonthsText) {
        installmentMonths = parseInt(installmentMonthsText) || 0;
      }
      
      // If not found, try to extract from description
      if (installmentPrice === 0 || installmentMonths === 0) {
        const installmentMatch = description.match(/(\d+)[€\s]+\/\s*mois\s*x\s*(\d+)/i);
        if (installmentMatch && installmentMatch[1] && installmentMatch[2]) {
          installmentPrice = parseInt(installmentMatch[1]);
          installmentMonths = parseInt(installmentMatch[2]);
        }
      }
      
      // Promotions
      let promotion = getElementText('promotion', ['promo', 'offer']);
      if (!promotion) {
        if (description.includes('OFFERTE') || description.includes('OFFERT')) {
          promotion = description.match(/([^\n.]+OFFERTE?[^\n.]+)/i)?.[1] || '';
        }
      }
      
      // Eco-friendly flag
      const ecoFriendlyText = getElementText('eco_friendly', ['sustainable', 'green']);
      const isEcoFriendly = ecoFriendlyText === 'true' || 
                            ecoFriendlyText === '1' ||
                            description.includes('DURABLE') || 
                            description.includes('RESPONSABLE') ||
                            description.includes('ECO');
      
      // Product URL
      const productUrl = getElementText('product_url', ['url', 'link', 'lien']);
      
      // Rating and reviews
      const ratingText = getElementText('rating', ['average_rating', 'note']);
      const rating = parseFloat(ratingText) || undefined;
      
      const reviewCountText = getElementText('review_count', ['reviews', 'avis']);
      const reviewCount = parseInt(reviewCountText) || undefined;
      
      // Generate a unique ID if not available
      const finalId = id || ean || `phone-${i}-${Date.now()}`;
      
      phones.push({
        id: finalId,
        ean,
        title: title || 'Untitled Product',
        trademark: trademark || 'Unknown Brand',
        description: description || '',
        fullDescription: fullDescription || '',
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discount: discount > 0 ? discount : undefined,
        image,
        additionalImages,
        category: category || '',
        merchant: merchant || '',
        condition,
        operatingSystem: operatingSystem || undefined,
        color: color || undefined,
        storage: storage || undefined,
        shipping: shipping || undefined,
        installmentPrice: installmentPrice || undefined,
        installmentMonths: installmentMonths || undefined,
        promotion: promotion || undefined,
        isEcoFriendly,
        inStock: true, // Assuming all products are in stock by default
        rating,
        reviewCount,
        productUrl: productUrl || undefined
      });
    }
    
    return phones;
  } catch (error) {
    console.error('Error parsing XML:', error);
    return [];
  }
};
