
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import FilterPanel from '@/components/mobile/FilterPanel';
import ResultsPanel from '@/components/mobile/ResultsPanel';
import { NetworkType, SortOption } from '@/types/mobile';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { useMobilePlansFromSupabase } from '@/hooks/useMobilePlansFromSupabase';

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
          "description": `Forfait mobile ${plan.data} avec ${plan.coverage}`,
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

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Forfaits Mobiles - Comparez les meilleures offres | ComparePrix</title>
        <meta name="description" content="Comparez les forfaits mobiles des principaux opérateurs. Trouvez le meilleur rapport qualité-prix pour votre forfait 4G/5G avec notre comparateur." />
        <link rel="canonical" href="https://compareprix.fr/mobile" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="w-full pt-20 pb-12 md:py-32 lg:py-40 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <h1 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Trouvez le Meilleur Forfait Mobile
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 text-sm md:text-xl">
                  Comparez les offres des principaux opérateurs et trouvez le forfait adapté à vos besoins.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <main className="flex-1 mt-6 md:mt-8 container mx-auto px-4 md:px-6 pb-16">
          {isLoading && !isFiltering ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {isMobile && (
                <div className="sticky top-16 z-10 bg-background/90 backdrop-blur-sm py-3 mb-4 flex justify-between items-center border-b border-border">
                  <p className="text-sm font-medium">
                    {isFiltering ? (
                      <span className="animate-pulse">Filtrage en cours...</span>
                    ) : (
                      `${filteredPlans.length} forfaits trouvés`
                    )}
                  </p>
                  <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md p-0">
                      <div className="p-0 max-h-[80vh] overflow-auto">
                        <FilterPanel 
                          dataRange={dataRange}
                          setDataRange={setDataRange}
                          priceRange={priceRange}
                          setPriceRange={setPriceRange}
                          networkType={networkType}
                          setNetworkType={setNetworkType}
                          selectedOperators={selectedOperators}
                          operators={operators}
                          handleOperatorChange={handleOperatorChange}
                          filtersOpen={true}
                          setFiltersOpen={() => {
                            setShowFiltersDialog(false);
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Filters Panel - Hidden in mobile, shown in desktop */}
                {!isMobile && (
                  <FilterPanel 
                    dataRange={dataRange}
                    setDataRange={setDataRange}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    networkType={networkType}
                    setNetworkType={setNetworkType}
                    selectedOperators={selectedOperators}
                    operators={operators}
                    handleOperatorChange={handleOperatorChange}
                    filtersOpen={filtersOpen}
                    setFiltersOpen={setFiltersOpen}
                  />
                )}

                {/* Results Panel */}
                <ResultsPanel 
                  filteredPlans={filteredPlans} 
                  sortOption={sortOption} 
                  setSortOption={setSortOption}
                  isLoading={isLoading}
                  isFiltering={isFiltering}
                />
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MobilePlans;
