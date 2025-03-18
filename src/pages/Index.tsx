
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Banner from '@/components/layout/Banner';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/layout/Footer';

// Import des sections
import MobileSection from '@/components/home/MobileSection';
import InternetSection from '@/components/home/InternetSection';
import ComparisonSection from '@/components/home/ComparisonSection';
import BlogSection from '@/components/home/BlogSection';
import PartnersSection from '@/components/home/PartnersSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
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
    <>
      <Helmet>
        <html lang="fr" />
        <title>ComparePrix - Comparez les meilleurs forfaits mobiles en France</title>
        <meta name="description" content="Trouvez et comparez les meilleurs forfaits mobiles en France. Économisez sur votre forfait avec notre comparateur de prix indépendant." />
        <link rel="canonical" href="https://compareprix.fr/" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Nouvelle section Hero Banner inspirée de la page Téléphones */}
          <section className="relative overflow-hidden bg-gradient-to-r from-blue-600/5 to-purple-600/5">
            {/* Background Elements */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl opacity-70 animate-pulse-subtle"></div>
            <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-70 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-10 right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
            
            <Banner />
          </section>
          
          <Separator />
          
          {/* Autres sections */}
          <MobileSection />
          <InternetSection />
          <ComparisonSection />
          <BlogSection />
          <PartnersSection />
          <TestimonialsSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
