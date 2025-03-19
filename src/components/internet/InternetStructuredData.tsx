
import React from 'react';
import { InternetBox, ConnectionType } from '@/types/internet';

interface InternetStructuredDataProps {
  filteredBoxes: InternetBox[];
  connectionType: ConnectionType;
}

const InternetStructuredData: React.FC<InternetStructuredDataProps> = ({ 
  filteredBoxes,
  connectionType
}) => {
  // Create structured data for the internet boxes page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredBoxes.map((box, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": `${box.name} - ${box.operator}`,
      "description": `Box ${connectionType === 'fibre' ? 'Fibre' : connectionType === 'adsl' ? 'ADSL' : 'Internet'} ${box.name} avec ${box.downloadSpeed} en débit descendant et ${box.uploadSpeed} en débit montant.`,
      "offers": {
        "@type": "Offer",
        "price": box.price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
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
