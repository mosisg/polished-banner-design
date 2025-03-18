import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import PhoneFilterPanel from '@/components/phones/PhoneFilterPanel';
import PhoneResultsPanel from '@/components/phones/PhoneResultsPanel';
import { fetchPhonesData, getExamplePhones, filterPhones, sortPhones } from '@/services/phones/phoneService';
import { SortOption } from '@/types/phones';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Smartphone, Search, ShoppingCart } from 'lucide-react';

const Telephones = () => {
  // Filter state
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<('new' | 'refurbished' | 'used')[]>([]);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
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

        {/* Bannière téléphones */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium">
                  Meilleurs prix garantis
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Trouvez le smartphone <span className="text-yellow-300">parfait</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/80 max-w-md">
                  Comparez plus de 500 téléphones des plus grandes marques et économisez jusqu'à 40%
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700">
                    <Search className="mr-2 h-5 w-5" />
                    Comparer maintenant
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Meilleures offres
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                    Livraison rapide
                  </div>
                  <div className="flex items-center">
                    <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                    Garantie 2 ans
                  </div>
                  <div className="flex items-center">
                    <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                    Retours gratuits
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-end relative">
                <div className="relative w-64 h-64 md:w-72 md:h-72 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center p-4">
                  <Smartphone className="w-40 h-40 text-white" />
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl">
                    -40%
                  </div>
                </div>
                <div className="absolute top-1/4 -left-4 bg-white shadow-lg rounded-lg p-3 animate-bounce">
                  <span className="text-blue-600 font-bold">iPhone 14</span>
                  <div className="text-sm">699€ <span className="line-through text-gray-500">999€</span></div>
                </div>
                <div className="absolute bottom-1/4 -right-4 bg-white shadow-lg rounded-lg p-3 animate-bounce delay-500">
                  <span className="text-purple-600 font-bold">Galaxy S23</span>
                  <div className="text-sm">649€ <span className="line-through text-gray-500">899€</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
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
