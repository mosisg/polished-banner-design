
import React from 'react';
import { Phone } from '@/types/phones';

interface PhoneStructuredDataProps {
  phones: Phone[];
}

const PhoneStructuredData: React.FC<PhoneStructuredDataProps> = ({ phones }) => {
  // Format data for structured data
  const phoneListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': phones.map((phone, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': `${phone.trademark} ${phone.model}`,
        'description': phone.description || `${phone.trademark} ${phone.model} - ${phone.storage} Go`,
        'image': phone.imageUrl,
        'brand': {
          '@type': 'Brand',
          'name': phone.trademark
        },
        'offers': {
          '@type': 'Offer',
          'price': phone.price,
          'priceCurrency': 'EUR',
          'availability': 'https://schema.org/InStock'
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(phoneListSchema) }}
    />
  );
};

export default PhoneStructuredData;
