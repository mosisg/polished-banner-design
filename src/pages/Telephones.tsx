
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import PhoneHero from '@/components/phones/PhoneHero';
import PhoneContent from '@/components/phones/PhoneContent';
import PhoneStructuredData from '@/components/phones/PhoneStructuredData';
import Footer from '@/components/layout/Footer';
import { usePhones } from '@/hooks/usePhones';

const Telephones = () => {
  const {
    // State
    priceRange,
    setPriceRange,
    selectedBrands,
    setSelectedBrands,
    selectedConditions,
    setSelectedConditions,
    selectedOS,
    setSelectedOS,
    selectedStorage,
    setSelectedStorage,
    ecoFriendly,
    setEcoFriendly,
    sortOption,
    setSortOption,
    filtersOpen,
    setFiltersOpen,
    comparisonList,
    // Data
    allPhones,
    filteredPhones,
    isLoading,
    isError,
    // Functions
    toggleComparison
  } = usePhones();

  return (
    <>
      <Helmet>
        <title>Comparateur de Téléphones et Smartphones | Prix et Caractéristiques | ComparePrix</title>
        <meta name="description" content="Comparez les meilleurs smartphones du marché français. Trouvez le téléphone idéal selon votre budget avec notre comparateur de téléphones mobiles ✓ Prix ✓ Avis ✓ Caractéristiques" />
        <meta name="keywords" content="comparateur téléphones, smartphones, iPhone, Samsung Galaxy, Xiaomi, téléphone pas cher, smartphone reconditionné, meilleur smartphone 2024, achat téléphone, téléphone Android, téléphone iOS, téléphones mobiles, comparatif smartphones" />
        <link rel="canonical" href="https://compareprix.net/telephones" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Comparateur de Téléphones et Smartphones | ComparePrix" />
        <meta property="og:description" content="Comparez les prix et caractéristiques des smartphones et trouvez le téléphone idéal selon votre budget. Téléphones neufs et reconditionnés disponibles." />
        <meta property="og:url" content="https://compareprix.net/telephones" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://compareprix.net/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Comparateur de Téléphones et Smartphones | ComparePrix" />
        <meta name="twitter:description" content="Comparez les prix et caractéristiques des smartphones. Neufs ou reconditionnés, trouvez le téléphone parfait pour vos besoins." />
        <meta name="twitter:image" content="https://compareprix.net/og-image.png" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Comparateur de Téléphones et Smartphones",
            "description": "Comparez les meilleurs smartphones du marché français. Trouvez le téléphone idéal selon votre budget.",
            "publisher": {
              "@type": "Organization",
              "name": "ComparePrix",
              "logo": "https://compareprix.net/logo.png"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://compareprix.net/telephones"
            }
          }
        `}</script>
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        <PhoneHero />
        <PhoneContent
          // Filter state
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedConditions={selectedConditions}
          setSelectedConditions={setSelectedConditions}
          selectedOS={selectedOS}
          setSelectedOS={setSelectedOS}
          selectedStorage={selectedStorage}
          setSelectedStorage={setSelectedStorage}
          ecoFriendly={ecoFriendly}
          setEcoFriendly={setEcoFriendly}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          // Data
          allPhones={allPhones}
          filteredPhones={filteredPhones}
          isLoading={isLoading}
          isError={isError}
          // Comparison
          comparisonList={comparisonList}
          toggleComparison={toggleComparison}
        />
        <Footer />
        {filteredPhones.length > 0 && <PhoneStructuredData phones={filteredPhones.slice(0, 10)} />}
      </div>
    </>
  );
};

export default Telephones;
