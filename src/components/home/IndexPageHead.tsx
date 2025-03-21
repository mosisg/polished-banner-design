
import React from 'react';
import { Helmet } from 'react-helmet-async';

const IndexPageHead = () => {
  // Current date for freshness signals
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Enhanced structured data for the homepage with improved SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://compareprix.fr/",
    "name": "ComparePrix - Comparateur de forfaits mobiles et box internet en France",
    "description": "Trouvez et comparez les meilleurs forfaits mobiles et offres box internet en France. Économisez jusqu'à 40% sur vos forfaits avec notre comparateur de prix indépendant.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://compareprix.fr/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "dateModified": currentDate
  };

  // Long-tail keywords for better targeting
  const longTailKeywords = "forfait mobile pas cher sans engagement, box internet fibre optique promotion, comparateur forfait 5G illimité, meilleure box internet pour télétravail, forfait mobile famille multi-lignes";

  return (
    <Helmet>
      <html lang="fr" />
      <title>ComparePrix - Comparateur de forfaits mobiles et box internet en France</title>
      <meta name="description" content="Trouvez et comparez les meilleurs forfaits mobiles et offres box internet en France. Économisez jusqu'à 40% avec notre comparateur de prix indépendant mis à jour en 2025." />
      <meta name="keywords" content={`comparateur forfait mobile, box internet, offre internet, forfait box et mobile, meilleurs forfaits mobile, forfait internet mobile, offre box fibre, comparateur internet, ${longTailKeywords}`} />
      <link rel="canonical" href="https://compareprix.fr/" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      {/* OpenGraph tags */}
      <meta property="og:title" content="ComparePrix - Comparateur de forfaits mobiles et box internet" />
      <meta property="og:description" content="Comparez et économisez sur vos forfaits mobiles et box internet. Trouvez les meilleures offres des opérateurs français avec notre outil mis à jour quotidiennement." />
      <meta property="og:url" content="https://compareprix.fr/" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://compareprix.fr/og-image.png" />
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="ComparePrix - Comparateur de forfaits" />
      <meta name="twitter:description" content="Comparez et économisez sur vos forfaits mobiles et box internet avec notre service gratuit et indépendant." />
      <meta name="twitter:image" content="https://compareprix.fr/og-image.png" />
      {/* Preconnect and DNS prefetch to critical domains */}
      <link rel="preconnect" href="https://ygzelivzpmrxsdqljskh.supabase.co" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://ygzelivzpmrxsdqljskh.supabase.co" />
      <link rel="preconnect" href="https://supabase.co" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://supabase.co" />
      {/* Freshness indicator for search engines */}
      <meta name="lastmod" content={currentDate} />
    </Helmet>
  );
};

export default IndexPageHead;
