
import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { useMobilePlansFromSupabase } from '@/hooks/useMobilePlansFromSupabase';
import { useIsMobile } from '@/hooks/use-mobile';
import MobilePlansSEO from '@/components/mobile/MobilePlansSEO';
import MobileHero from '@/components/mobile/MobileHero';
import MobilePlansContent from '@/components/mobile/MobilePlansContent';
import LoadingState from '@/components/mobile/LoadingState';
import RelatedContent, { RelatedLink } from '@/components/navigation/RelatedContent';

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

  // Define related content links
  const relatedLinks: RelatedLink[] = [
    {
      path: "/internet",
      label: "Box Internet",
      description: "Trouvez votre box internet idéale avec notre comparateur de prix.",
      icon: <Wifi className="h-4 w-4" />
    },
    {
      path: "/telephones",
      label: "Téléphones",
      description: "Comparez les derniers modèles de smartphones et leurs prix.",
      icon: <Phone className="h-4 w-4" />
    },
    {
      path: "/blog",
      label: "Blog",
      description: "Conseils et astuces pour choisir votre forfait mobile.",
    }
  ];

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

          <RelatedContent links={relatedLinks} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MobilePlans;
