
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import PhoneFilterPanel from '@/components/phones/PhoneFilterPanel';
import PhoneResultsPanel from '@/components/phones/PhoneResultsPanel';
import { fetchPhonesData, getExamplePhones, filterPhones, sortPhones } from '@/services/phones/phoneService';
import { Phone, SortOption } from '@/types/phones';
import Footer from '@/components/layout/Footer';

const Telephones = () => {
  // Filter state
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<('new' | 'refurbished' | 'used')[]>([]);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  // Query for phones data
  const { data: allPhones = [], isLoading, isError } = useQuery({
    queryKey: ['phones'],
    queryFn: fetchPhonesData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: getExamplePhones,
  });
  
  // Apply filters and sorting
  const filteredPhones = filterPhones(allPhones, {
    brands: selectedBrands,
    priceRange: { min: priceRange[0], max: priceRange[1] },
    conditions: selectedConditions,
    operatingSystems: selectedOS,
    storage: selectedStorage,
    ecoFriendly: ecoFriendly
  });
  
  const sortedPhones = sortPhones(filteredPhones, sortOption);
  
  // Comparison functionality
  const toggleComparison = (phoneId: string) => {
    setComparisonList(prev => {
      if (prev.includes(phoneId)) {
        return prev.filter(id => id !== phoneId);
      } else {
        // Limit to 4 phones in comparison
        if (prev.length >= 4) {
          return [...prev.slice(1), phoneId];
        }
        return [...prev, phoneId];
      }
    });
  };
  
  // For SEO and structured data
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": sortedPhones.slice(0, 10).map((phone, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": phone.title,
          "description": phone.description,
          "brand": {
            "@type": "Brand",
            "name": phone.trademark
          },
          "offers": {
            "@type": "Offer",
            "price": phone.price,
            "priceCurrency": "EUR",
            "availability": phone.inStock 
              ? "https://schema.org/InStock" 
              : "https://schema.org/OutOfStock"
          }
        }
      }))
    };
  };

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Comparateur de Téléphones Mobiles | ComparePrix</title>
        <meta name="description" content="Comparez les meilleurs téléphones mobiles du marché. Trouvez le smartphone idéal au meilleur prix avec notre comparateur téléphone." />
        <link rel="canonical" href="https://compareprix.fr/telephones" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Trouvez le Téléphone Parfait
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Comparez les smartphones des meilleures marques et trouvez l'appareil qui répond à tous vos besoins.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
          {isError ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Impossible de charger les données
              </h2>
              <p className="text-muted-foreground">
                Veuillez rafraîchir la page ou réessayer plus tard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Panel */}
              <PhoneFilterPanel 
                allPhones={allPhones}
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
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                isLoading={isLoading}
              />

              {/* Results Panel */}
              <PhoneResultsPanel 
                phones={sortedPhones}
                sortOption={sortOption}
                setSortOption={setSortOption}
                isLoading={isLoading}
                comparisonList={comparisonList}
                toggleComparison={toggleComparison}
              />
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Telephones;
