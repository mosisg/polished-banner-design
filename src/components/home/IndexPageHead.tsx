
import React from 'react';
import { Helmet } from 'react-helmet-async';

const IndexPageHead = () => {
  // Structured data for the homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://compareprix.fr/",
    "name": "ComparePrix - Comparateur de forfaits mobiles en France",
    "description": "Trouvez et comparez les meilleurs forfaits mobiles en France. Économisez sur votre forfait avec notre comparateur de prix indépendant.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://compareprix.fr/mobile?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <html lang="fr" />
      <title>ComparePrix - Comparez les meilleurs forfaits mobiles en France</title>
      <meta name="description" content="Trouvez et comparez les meilleurs forfaits mobiles en France. Économisez sur votre forfait avec notre comparateur de prix indépendant." />
      <link rel="canonical" href="https://compareprix.fr/" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      {/* Preconnect to critical domains */}
      <link rel="preconnect" href="https://ygzelivzpmrxsdqljskh.supabase.co" />
      <link rel="dns-prefetch" href="https://ygzelivzpmrxsdqljskh.supabase.co" />
    </Helmet>
  );
};

export default IndexPageHead;
