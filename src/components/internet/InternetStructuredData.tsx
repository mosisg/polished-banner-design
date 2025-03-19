
import React from 'react';
import { InternetBox } from '@/types/internet';

interface InternetStructuredDataProps {
  filteredBoxes: InternetBox[];
  connectionType: string;
}

const InternetStructuredData: React.FC<InternetStructuredDataProps> = ({ filteredBoxes, connectionType }) => {
  // Construction du schéma JSON-LD pour la page des box internet
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Les meilleures offres box internet ${connectionType !== 'all' ? connectionType : ''} en France`,
    "description": "Comparez les box internet des principaux opérateurs. Trouvez la meilleure connexion fibre ou ADSL avec notre comparateur.",
    "numberOfItems": filteredBoxes.length,
    "itemListElement": filteredBoxes.slice(0, 10).map((box, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": box.name,
        "description": `Box ${connectionType !== 'all' ? connectionType : 'internet'} ${box.name} de ${box.operator}`,
        "brand": {
          "@type": "Brand",
          "name": box.operator
        },
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
};

export default InternetStructuredData;
