
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import FilterPanel from '@/components/mobile/FilterPanel';
import ResultsPanel from '@/components/mobile/ResultsPanel';
import { mobilePlans } from '@/data/mobilePlans';
import { MobilePlan, NetworkType, SortOption } from '@/types/mobile';

const MobilePlans = () => {
  const [dataRange, setDataRange] = useState<number[]>([100]);
  const [priceRange, setPriceRange] = useState<number[]>([20]);
  const [networkType, setNetworkType] = useState<NetworkType>('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<MobilePlan[]>(mobilePlans);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [filtersOpen, setFiltersOpen] = useState(true);

  // All available operators from the data
  const operators = Array.from(new Set(mobilePlans.map(plan => plan.operator)));

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

  const handleOperatorChange = (operator: string) => {
    setSelectedOperators(prev => {
      if (prev.includes(operator)) {
        return prev.filter(op => op !== operator);
      } else {
        return [...prev, operator];
      }
    });
  };

  const applyFilters = () => {
    let filtered = [...mobilePlans];

    // Filter by data amount
    filtered = filtered.filter(plan => {
      const dataAmount = parseInt(plan.data.replace(/[^0-9]/g, ''));
      return dataAmount <= dataRange[0];
    });

    // Filter by price
    filtered = filtered.filter(plan => {
      const price = parseFloat(plan.price.match(/\d+\.\d+/)?.[0] || '0');
      return price <= priceRange[0];
    });

    // Filter by network type (4G/5G)
    if (networkType !== 'all') {
      filtered = filtered.filter(plan => plan.coverage.includes(networkType));
    }

    // Filter by selected operators
    if (selectedOperators.length > 0) {
      filtered = filtered.filter(plan => selectedOperators.includes(plan.operator));
    }

    // Sort results
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price.match(/\d+\.\d+/)?.[0] || '0');
      const priceB = parseFloat(b.price.match(/\d+\.\d+/)?.[0] || '0');
      const dataA = parseInt(a.data.replace(/[^0-9]/g, ''));
      const dataB = parseInt(b.data.replace(/[^0-9]/g, ''));

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'data-asc':
          return dataA - dataB;
        case 'data-desc':
          return dataB - dataA;
        default:
          return priceA - priceB;
      }
    });

    setFilteredPlans(filtered);
  };

  // Apply filters when any filter value changes
  useEffect(() => {
    applyFilters();
  }, [dataRange, priceRange, networkType, selectedOperators, sortOption]);

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
        <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Trouvez le Meilleur Forfait Mobile
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Comparez les offres des principaux opérateurs et trouvez le forfait adapté à vos besoins.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <main className="flex-1 mt-8 container mx-auto px-4 md:px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Panel */}
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

            {/* Results Panel */}
            <ResultsPanel 
              filteredPlans={filteredPlans} 
              sortOption={sortOption} 
              setSortOption={setSortOption} 
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default MobilePlans;
