
import React from 'react';
import { InternetBox, ConnectionType } from '@/types/internet';

interface InternetStructuredDataProps {
  filteredBoxes: InternetBox[];
  connectionType: ConnectionType;
}

const InternetStructuredData: React.FC<InternetStructuredDataProps> = ({ filteredBoxes, connectionType }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredBoxes.map((box, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `${box.operator} ${box.name}`,
        "description": `Box internet ${box.downloadSpeed} en ${connectionType === 'all' ? 'Fibre/ADSL' : connectionType}`,
        "offers": {
          "@type": "Offer",
          "price": parseFloat(box.price),
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

export default InternetStructuredData;
