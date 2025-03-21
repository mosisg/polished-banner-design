
import React from 'react';
import { Phone } from '@/types/phones';

interface PhoneStructuredDataProps {
  phones: Phone[];
}

const PhoneStructuredData: React.FC<PhoneStructuredDataProps> = ({ phones }) => {
  // Current date for freshness signals
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Format data for structured data
  const phoneListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': phones.map((phone, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': `${phone.trademark} ${phone.title}`,
        'description': phone.description || `${phone.trademark} ${phone.title} - ${phone.storage} - Smartphone disponible chez ComparePrix`,
        'image': phone.image,
        'brand': {
          '@type': 'Brand',
          'name': phone.trademark
        },
        'offers': {
          '@type': 'Offer',
          'price': phone.price,
          'priceCurrency': 'EUR',
          'availability': phone.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': phone.merchant || 'ComparePrix'
          },
          'url': phone.productUrl || `https://compareprix.net/telephones/${phone.id}`,
          'priceValidUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        },
        'aggregateRating': phone.rating ? {
          '@type': 'AggregateRating',
          'ratingValue': phone.rating,
          'reviewCount': phone.reviewCount || 5,
          'bestRating': '5',
          'worstRating': '1'
        } : undefined,
        'sku': phone.id,
        'mpn': phone.id,
        'dateModified': currentDate
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
