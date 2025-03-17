
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import FilterPanel from '@/components/internet/FilterPanel';
import ResultsPanel from '@/components/internet/ResultsPanel';
import { internetBoxes } from '@/data/internetBoxes';
import { InternetBox, ConnectionType, SortOption } from '@/types/internet';

const InternetBoxes = () => {
  const [speedRange, setSpeedRange] = useState<number[]>([1000]);
  const [priceRange, setPriceRange] = useState<number[]>([30]);
  const [connectionType, setConnectionType] = useState<ConnectionType>('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedWifiTypes, setSelectedWifiTypes] = useState<string[]>([]);
  const [filteredBoxes, setFilteredBoxes] = useState<InternetBox[]>(internetBoxes);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [filtersOpen, setFiltersOpen] = useState(true);

  // All available operators from the data
  const operators = Array.from(new Set(internetBoxes.map(box => box.operator)));
  // All available WiFi types from the data
  const wifiTypes = Array.from(new Set(internetBoxes.map(box => box.wifiType)));

  // Generate structured data for all internet boxes
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": filteredBoxes.map((box, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": `${box.operator} ${box.name}`,
          "description": `Box internet ${box.downloadSpeed} en ${connectionType === 'all' ? 'Fibre/ADSL' : connectionType}`,
          "offers": {
            "@type": "Offer",
            "price": parseFloat(box.price),
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

  const handleWifiTypeChange = (type: string) => {
    setSelectedWifiTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const applyFilters = () => {
    let filtered = [...internetBoxes];

    // Filter by download speed
    filtered = filtered.filter(box => {
      const speedMatch = box.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
      if (!speedMatch) return true;
      
      const speedValue = parseFloat(speedMatch[1]);
      const speedUnit = speedMatch[2];
      
      // Convert to Mbps for comparison
      const speedMbps = speedUnit === 'Gb/s' ? speedValue * 1000 : speedValue;
      
      return speedMbps <= speedRange[0];
    });

    // Filter by price
    filtered = filtered.filter(box => {
      const price = parseFloat(box.price);
      return price <= priceRange[0];
    });

    // Filter by connection type
    if (connectionType !== 'all') {
      filtered = filtered.filter(box => {
        if (connectionType === 'fibre') {
          return box.downloadSpeed.includes('Gb/s') || parseInt(box.downloadSpeed) > 100;
        } else if (connectionType === 'adsl') {
          return box.downloadSpeed.includes('Mb/s') && parseInt(box.downloadSpeed) <= 100;
        } else if (connectionType === 'box4g') {
          return box.name.toLowerCase().includes('4g') || box.name.toLowerCase().includes('5g');
        }
        return true;
      });
    }

    // Filter by selected operators
    if (selectedOperators.length > 0) {
      filtered = filtered.filter(box => selectedOperators.includes(box.operator));
    }

    // Filter by selected WiFi types
    if (selectedWifiTypes.length > 0) {
      filtered = filtered.filter(box => selectedWifiTypes.includes(box.wifiType));
    }

    // Sort results
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      
      const speedMatchA = a.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
      const speedMatchB = b.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
      
      const speedValueA = speedMatchA ? parseFloat(speedMatchA[1]) : 0;
      const speedUnitA = speedMatchA ? speedMatchA[2] : 'Mb/s';
      const speedValueB = speedMatchB ? parseFloat(speedMatchB[1]) : 0;
      const speedUnitB = speedMatchB ? speedMatchB[2] : 'Mb/s';
      
      const speedMbpsA = speedUnitA === 'Gb/s' ? speedValueA * 1000 : speedValueA;
      const speedMbpsB = speedUnitB === 'Gb/s' ? speedValueB * 1000 : speedValueB;

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'speed-asc':
          return speedMbpsA - speedMbpsB;
        case 'speed-desc':
          return speedMbpsB - speedMbpsA;
        default:
          return priceA - priceB;
      }
    });

    setFilteredBoxes(filtered);
  };

  // Apply filters when any filter value changes
  useEffect(() => {
    applyFilters();
  }, [speedRange, priceRange, connectionType, selectedOperators, selectedWifiTypes, sortOption]);

  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Box Internet - Comparez les meilleures offres | ComparePrix</title>
        <meta name="description" content="Comparez les box internet des principaux opérateurs. Trouvez la meilleure connexion fibre ou ADSL avec notre comparateur de box internet." />
        <link rel="canonical" href="https://compareprix.fr/internet" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Trouvez la Meilleure Box Internet
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Comparez les offres Fibre, ADSL et 4G/5G des principaux opérateurs et économisez sur votre abonnement.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <main className="flex-1 mt-8 container mx-auto px-4 md:px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Panel */}
            <FilterPanel 
              speedRange={speedRange}
              setSpeedRange={setSpeedRange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              connectionType={connectionType}
              setConnectionType={setConnectionType}
              selectedOperators={selectedOperators}
              operators={operators}
              handleOperatorChange={handleOperatorChange}
              filtersOpen={filtersOpen}
              setFiltersOpen={setFiltersOpen}
              wifiTypes={wifiTypes}
              selectedWifiTypes={selectedWifiTypes}
              handleWifiTypeChange={handleWifiTypeChange}
            />

            {/* Results Panel */}
            <ResultsPanel 
              filteredBoxes={filteredBoxes} 
              sortOption={sortOption} 
              setSortOption={setSortOption} 
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default InternetBoxes;
