
import React from 'react';
import { Phone } from '@/types/phones';

interface PhoneStructuredDataProps {
  phones: Phone[];
}

const PhoneStructuredData: React.FC<PhoneStructuredDataProps> = ({ phones }) => {
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": phones.slice(0, 10).map((phone, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": phone.title,
          "description": phone.description,
          "brand": {
            "@type": "Brand",
            "name": phone.trademark
          },
          "offers": {
            "@type": "Offer",
            "price": phone.price,
            "priceCurrency": "EUR",
            "availability": phone.inStock 
              ? "https://schema.org/InStock" 
              : "https://schema.org/OutOfStock"
          }
        }
      }))
    };
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(generateStructuredData())}
    </script>
  );
};

export default PhoneStructuredData;
