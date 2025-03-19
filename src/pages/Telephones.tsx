
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
        <title>Comparateur de Téléphones Mobiles | ComparePrix</title>
        <meta name="description" content="Comparez les meilleurs téléphones mobiles du marché. Trouvez le smartphone idéal au meilleur prix avec notre comparateur téléphone." />
        <link rel="canonical" href="https://compareprix.fr/telephones" />
        <meta name="robots" content="index, follow" />
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
