
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, Sliders, Smartphone, Wifi, Phone, Euro, Check, 
  Signal, MapPin, Percent, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import PlanCard from '@/components/ui/PlanCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Sample mobile plan data
const mobilePlans = [
  {
    id: 1,
    name: 'Forfait 100Go',
    operator: 'Orange',
    data: '100 Go',
    price: '8.99€/mois',
    coverage: '4G/5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '15 Go d\'internet en Europe/DOM',
      'Réseau Orange - Qualité supérieure',
      'Sans engagement'
    ]
  },
  {
    id: 2,
    name: 'Forfait 200Go',
    operator: 'SFR',
    data: '200 Go',
    price: '9.99€/mois',
    coverage: '5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '20 Go d\'internet en Europe/DOM',
      'Réseau SFR',
      'Sans engagement'
    ]
  },
  {
    id: 3,
    name: 'Forfait 130Go',
    operator: 'Bouygues',
    data: '130 Go',
    price: '7.99€/mois',
    coverage: '4G/5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '12 Go d\'internet en Europe/DOM',
      'Réseau Bouygues - Excellente couverture',
      'Sans engagement'
    ]
  },
  {
    id: 4,
    name: 'Forfait 250Go',
    operator: 'Free',
    data: '250 Go',
    price: '19.99€/mois',
    coverage: '5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '25 Go d\'internet en Europe/DOM',
      'Réseau Free - 99% de couverture',
      'Sans engagement'
    ]
  },
  {
    id: 5,
    name: 'Forfait Oxygène',
    operator: 'Prixtel',
    data: '140 Go',
    price: '11.99€/mois',
    coverage: '5G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '15 Go d\'internet en Europe/DOM',
      'Réseau SFR',
      'Sans engagement',
      'Prix modulable selon consommation'
    ]
  },
  {
    id: 6,
    name: 'L\'essentiel',
    operator: 'YouPrice',
    data: '130 Go',
    price: '7.99€/mois',
    coverage: '4G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '12 Go d\'internet en Europe',
      'Choix du réseau : SFR ou Orange (+2€)',
      'Sans engagement'
    ]
  },
  {
    id: 7,
    name: 'Le Basic',
    operator: 'Coriolis',
    data: '50 Go',
    price: '5.99€/mois',
    coverage: '4G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '13 Go d\'internet en Europe',
      'Réseau SFR',
      'Sans engagement'
    ]
  },
  {
    id: 8,
    name: 'Forfait Eco',
    operator: 'Auchan Télécom',
    data: '40 Go',
    price: '5.99€/mois',
    coverage: '4G',
    features: [
      'Appels, SMS et MMS illimités en France',
      '19 Go d\'internet en Europe',
      'Réseau Bouygues Télécom',
      'Sans engagement'
    ]
  }
];

const MobilePlans = () => {
  const [dataRange, setDataRange] = useState<number[]>([100]);
  const [priceRange, setPriceRange] = useState<number[]>([20]);
  const [networkType, setNetworkType] = useState('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [filteredPlans, setFilteredPlans] = useState(mobilePlans);
  const [sortOption, setSortOption] = useState('price-asc');
  const [filtersOpen, setFiltersOpen] = useState(true);

  // All available operators from the data
  const operators = Array.from(new Set(mobilePlans.map(plan => plan.operator)));

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
  React.useEffect(() => {
    applyFilters();
  }, [dataRange, priceRange, networkType, selectedOperators, sortOption]);

  return (
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
          <div className="lg:col-span-1">
            <Collapsible
              open={filtersOpen}
              onOpenChange={setFiltersOpen}
              className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6 lg:mb-0 lg:sticky lg:top-24"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Filtres</h2>
                </div>
                <CollapsibleTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {filtersOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="p-4 space-y-6">
                {/* Data Amount Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Volume de données</h3>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {dataRange[0]} Go max
                    </Badge>
                  </div>
                  <Slider
                    defaultValue={[100]}
                    max={300}
                    step={10}
                    value={dataRange}
                    onValueChange={setDataRange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 Go</span>
                    <span>100 Go</span>
                    <span>200 Go</span>
                    <span>300 Go</span>
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Budget maximum</h3>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {priceRange[0]}€/mois
                    </Badge>
                  </div>
                  <Slider
                    defaultValue={[20]}
                    max={50}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0€</span>
                    <span>10€</span>
                    <span>25€</span>
                    <span>50€</span>
                  </div>
                </div>

                {/* Network Type */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Signal className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Type de réseau</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={networkType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNetworkType('all')}
                    >
                      Tous
                    </Button>
                    <Button
                      variant={networkType === '4G' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNetworkType('4G')}
                    >
                      4G
                    </Button>
                    <Button
                      variant={networkType === '5G' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNetworkType('5G')}
                    >
                      5G
                    </Button>
                  </div>
                </div>

                {/* Operators Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Opérateurs</h3>
                  </div>
                  <div className="space-y-2">
                    {operators.map((operator) => (
                      <div key={operator} className="flex items-center space-x-2">
                        <Checkbox
                          id={`operator-${operator}`}
                          checked={selectedOperators.includes(operator)}
                          onCheckedChange={() => handleOperatorChange(operator)}
                        />
                        <label
                          htmlFor={`operator-${operator}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {operator}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-4 rounded-lg border border-border">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredPlans.length} forfaits trouvés
                </h2>
                <p className="text-sm text-muted-foreground">
                  Comparaison mise à jour le {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Select 
                  value={sortOption} 
                  onValueChange={setSortOption}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Prix (croissant)</SelectItem>
                    <SelectItem value="price-desc">Prix (décroissant)</SelectItem>
                    <SelectItem value="data-asc">Données (croissant)</SelectItem>
                    <SelectItem value="data-desc">Données (décroissant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="space-y-6">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
                  <Info className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">Aucun forfait trouvé</h3>
                  <p className="text-muted-foreground text-center mt-1">
                    Essayez d'élargir vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobilePlans;
