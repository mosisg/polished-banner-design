
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import InternetHero from '@/components/internet/InternetHero';
import InternetBoxesContent from '@/components/internet/InternetBoxesContent';
import InternetStructuredData from '@/components/internet/InternetStructuredData';
import Footer from '@/components/layout/Footer';
import { useInternetBoxesFromSupabase } from '@/hooks/useInternetBoxesFromSupabase';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const InternetBoxes = () => {
  const {
    speedRange,
    setSpeedRange,
    priceRange,
    setPriceRange,
    connectionType,
    setConnectionType,
    selectedOperators,
    operators,
    handleOperatorChange,
    selectedWifiTypes,
    wifiTypes,
    handleWifiTypeChange,
    filteredBoxes,
    sortOption,
    setSortOption,
    filtersOpen,
    setFiltersOpen,
    isLoading,
    isFiltering,
    error
  } = useInternetBoxesFromSupabase();

  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les box internet. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <>
      <Helmet>
        <title>Box Internet - Comparez les meilleures offres | ComparePrix</title>
        <meta name="description" content="Comparez les box internet des principaux opérateurs. Trouvez la meilleure connexion fibre ou ADSL avec notre comparateur de box internet." />
        <link rel="canonical" href="https://compareprix.fr/internet" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        <InternetHero />
        
        {isLoading && !isFiltering ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <InternetBoxesContent
            speedRange={speedRange}
            setSpeedRange={setSpeedRange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            connectionType={connectionType}
            setConnectionType={setConnectionType}
            selectedOperators={selectedOperators}
            operators={operators}
            handleOperatorChange={handleOperatorChange}
            selectedWifiTypes={selectedWifiTypes}
            wifiTypes={wifiTypes}
            handleWifiTypeChange={handleWifiTypeChange}
            filteredBoxes={filteredBoxes}
            sortOption={sortOption}
            setSortOption={setSortOption}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            isLoading={isLoading}
            isFiltering={isFiltering}
          />
        )}
        
        <InternetStructuredData 
          filteredBoxes={filteredBoxes}
          connectionType={connectionType}
        />
        <Footer />
      </div>
    </>
  );
};

export default InternetBoxes;
