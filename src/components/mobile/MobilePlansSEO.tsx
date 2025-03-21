
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MobilePlan } from '@/types/mobile';

interface MobilePlansSEOProps {
  filteredPlans: MobilePlan[];
}

const MobilePlansSEO = ({ filteredPlans }: MobilePlansSEOProps) => {
  // Generate structured data for all mobile plans
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": filteredPlans.map((plan, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": `${plan.operator} ${plan.name}`,
          "description": `Forfait mobile ${plan.data} avec ${plan.coverage} - ${plan.engagement ? 'Avec engagement' : 'Sans engagement'}`,
          "offers": {
            "@type": "Offer",
            "price": parseFloat(plan.price.match(/\d+\.\d+/)?.[0] || '0'),
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    };
  };

  // Add specific longtail keywords for mobile plans
  const longTailKeywords = "comparateur forfait mobile pas cher, forfait mobile sans engagement, forfait 5G illimité, meilleur forfait data, forfait mobile international, forfait famille";

  return (
    <Helmet>
      <html lang="fr" />
      <title>Comparateur de Forfaits Mobiles - Meilleures Offres 4G/5G | ComparePrix</title>
      <meta name="description" content="Comparez les forfaits mobiles des opérateurs français et trouvez le meilleur rapport qualité-prix. Forfaits 4G/5G, avec ou sans engagement, à petit prix." />
      <meta name="keywords" content={`comparateur forfait mobile, forfait mobile et box, offre internet mobile, meilleurs forfaits mobile, forfait box mobile, box mobile, offre box et mobile, forfaits mobiles, comparateur forfait internet, ${longTailKeywords}`} />
      <link rel="canonical" href="https://compareprix.fr/mobile" />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content="Comparateur de Forfaits Mobiles - Meilleures Offres 4G/5G" />
      <meta property="og:description" content="Comparez les forfaits mobiles et trouvez l'offre idéale pour votre budget et vos besoins en data." />
      <meta property="og:url" content="https://compareprix.fr/mobile" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://compareprix.fr/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Comparateur de Forfaits Mobiles | ComparePrix" />
      <meta name="twitter:description" content="Comparez les forfaits mobiles et économisez sur votre abonnement." />
      <meta name="twitter:image" content="https://compareprix.fr/og-image.png" />
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};

export default MobilePlansSEO;
