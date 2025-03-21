
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
        <title>Comparateur de Téléphones Mobiles | Les Meilleurs Smartphones | ComparePrix</title>
        <meta name="description" content="Comparez les meilleurs smartphones du marché. Trouvez le téléphone mobile idéal au meilleur prix avec notre comparateur d'offres de téléphonie." />
        <meta name="keywords" content="comparateur téléphones, smartphones, meilleur smartphone, téléphone mobile, comparateur mobile, téléphonie, téléphone pas cher" />
        <link rel="canonical" href="https://compareprix.fr/telephones" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Comparateur de Téléphones Mobiles | ComparePrix" />
        <meta property="og:description" content="Comparez les smartphones et trouvez le téléphone idéal au meilleur prix." />
        <meta property="og:url" content="https://compareprix.fr/telephones" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://compareprix.fr/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Comparateur de Téléphones Mobiles | ComparePrix" />
        <meta name="twitter:description" content="Comparez et choisissez le smartphone idéal pour vos besoins." />
        <meta name="twitter:image" content="https://compareprix.fr/og-image.png" />
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
