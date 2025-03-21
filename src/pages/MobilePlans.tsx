
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { useMobilePlansFromSupabase } from '@/hooks/useMobilePlansFromSupabase';
import { useIsMobile } from '@/hooks/use-mobile';
import MobilePlansSEO from '@/components/mobile/MobilePlansSEO';
import MobileHero from '@/components/mobile/MobileHero';
import MobilePlansContent from '@/components/mobile/MobilePlansContent';
import LoadingState from '@/components/mobile/LoadingState';

/**
 * MobilePlans page component
 * Displays mobile plans with filtering and sorting functionality
 */
const MobilePlans = () => {
  const {
    dataRange,
    setDataRange,
    priceRange,
    setPriceRange,
    networkType,
    setNetworkType,
    selectedOperators,
    operators,
    handleOperatorChange,
    filteredPlans,
    sortOption,
    setSortOption,
    filtersOpen,
    setFiltersOpen,
    isLoading,
    isFiltering,
    error
  } = useMobilePlansFromSupabase();

  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    // Ouvrir automatiquement les filtres sur desktop, mais pas sur mobile
    setFiltersOpen(!isMobile);
  }, [isMobile, setFiltersOpen]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les forfaits mobiles. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <>
      <MobilePlansSEO filteredPlans={filteredPlans} />

      <div className="flex flex-col min-h-screen">
        <Header />
        <main>
          <h1 className="sr-only">Forfaits Mobiles - ComparePrix</h1>
          <MobileHero />

          {isLoading && !isFiltering ? (
            <LoadingState />
          ) : (
            <MobilePlansContent
              dataRange={dataRange}
              setDataRange={setDataRange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              networkType={networkType}
              setNetworkType={setNetworkType}
              selectedOperators={selectedOperators}
              operators={operators}
              handleOperatorChange={handleOperatorChange}
              filteredPlans={filteredPlans}
              sortOption={sortOption}
              setSortOption={setSortOption}
              filtersOpen={filtersOpen}
              setFiltersOpen={setFiltersOpen}
              isLoading={isLoading}
              isFiltering={isFiltering}
              showFiltersDialog={showFiltersDialog}
              setShowFiltersDialog={setShowFiltersDialog}
            />
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MobilePlans;
