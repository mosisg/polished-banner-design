
import React, { useMemo } from 'react';
import { 
  Filter, Euro, Smartphone, RefreshCcw, Monitor, 
  Database, Leaf, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Phone } from '@/types/phones';
import { 
  getBrands, 
  getOperatingSystems, 
  getStorageOptions, 
  getPriceRange 
} from '@/services/phones/phoneService';

interface PhoneFilterPanelProps {
  allPhones: Phone[];
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedConditions: ('new' | 'refurbished' | 'used')[];
  setSelectedConditions: (conditions: ('new' | 'refurbished' | 'used')[]) => void;
  selectedOS: string[];
  setSelectedOS: (os: string[]) => void;
  selectedStorage: string[];
  setSelectedStorage: (storage: string[]) => void;
  ecoFriendly: boolean;
  setEcoFriendly: (value: boolean) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  isLoading: boolean;
}

const PhoneFilterPanel = ({
  allPhones,
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
  filtersOpen,
  setFiltersOpen,
  isLoading
}: PhoneFilterPanelProps) => {
  // Get filter options from phone data
  const brands = useMemo(() => getBrands(allPhones), [allPhones]);
  const operatingSystems = useMemo(() => getOperatingSystems(allPhones), [allPhones]);
  const storageOptions = useMemo(() => getStorageOptions(allPhones), [allPhones]);
  const fullPriceRange = useMemo(() => getPriceRange(allPhones), [allPhones]);
  
  // Handlers for filter changes
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };
  
  const handleConditionChange = (condition: 'new' | 'refurbished' | 'used') => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };
  
  const handleOSChange = (os: string) => {
    if (selectedOS.includes(os)) {
      setSelectedOS(selectedOS.filter(o => o !== os));
    } else {
      setSelectedOS([...selectedOS, os]);
    }
  };
  
  const handleStorageChange = (storage: string) => {
    if (selectedStorage.includes(storage)) {
      setSelectedStorage(selectedStorage.filter(s => s !== storage));
    } else {
      setSelectedStorage([...selectedStorage, storage]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange([fullPriceRange.min, fullPriceRange.max]);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedOS([]);
    setSelectedStorage([]);
    setEcoFriendly(false);
  };
  
  return (
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
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-8 text-xs"
              disabled={isLoading}
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Réinitialiser
            </Button>
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
        </div>

        <CollapsibleContent className="p-4 space-y-6">
          {/* Search bar */}
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Modèle, marque..."
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {/* Mode de livraison */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Mode de livraison</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="click-collect"
                  disabled={isLoading}
                />
                <label
                  htmlFor="click-collect"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Click & Collect
                </label>
              </div>
            </div>
          </div>

          {/* Brands Checkboxes */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Marque</h3>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brand-apple"
                    checked={selectedBrands.includes('Apple')}
                    onCheckedChange={() => handleBrandChange('Apple')}
                  />
                  <label
                    htmlFor="brand-apple"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Apple
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brand-samsung"
                    checked={selectedBrands.includes('Samsung')}
                    onCheckedChange={() => handleBrandChange('Samsung')}
                  />
                  <label
                    htmlFor="brand-samsung"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Samsung
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brand-xiaomi"
                    checked={selectedBrands.includes('Xiaomi')}
                    onCheckedChange={() => handleBrandChange('Xiaomi')}
                  />
                  <label
                    htmlFor="brand-xiaomi"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Xiaomi
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brand-google"
                    checked={selectedBrands.includes('Google')}
                    onCheckedChange={() => handleBrandChange('Google')}
                  />
                  <label
                    htmlFor="brand-google"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Google
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brand-iphone-reconditionne"
                    checked={selectedBrands.includes('iPhone reconditionné')}
                    onCheckedChange={() => handleBrandChange('iPhone reconditionné')}
                  />
                  <label
                    htmlFor="brand-iphone-reconditionne"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    iPhone reconditionné
                  </label>
                </div>
                <Button variant="link" size="sm" className="h-8 px-0 text-xs text-primary">
                  + de marques
                </Button>
              </div>
            )}
          </div>

          {/* Price options */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Prix</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="price-cheap"
                  disabled={isLoading}
                />
                <label
                  htmlFor="price-cheap"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Smartphone pas cher
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="price-value"
                  disabled={isLoading}
                />
                <label
                  htmlFor="price-value"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Meilleur rapport qualité-prix
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="price-best"
                  disabled={isLoading}
                />
                <label
                  htmlFor="price-best"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Meilleur smartphone
                </label>
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">État</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condition-new"
                  checked={selectedConditions.includes('new')}
                  onCheckedChange={() => handleConditionChange('new')}
                  disabled={isLoading}
                />
                <label
                  htmlFor="condition-new"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Neuf
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condition-refurbished"
                  checked={selectedConditions.includes('refurbished')}
                  onCheckedChange={() => handleConditionChange('refurbished')}
                  disabled={isLoading}
                />
                <label
                  htmlFor="condition-refurbished"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Reconditionné
                </label>
              </div>
            </div>
          </div>

          {/* Operating System */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Système</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="os-ios"
                  checked={selectedOS.includes('iOS')}
                  onCheckedChange={() => handleOSChange('iOS')}
                  disabled={isLoading}
                />
                <label
                  htmlFor="os-ios"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  iOS
                </label>
              </div>
              {operatingSystems
                .filter(os => os.label !== 'iOS')
                .map(os => (
                  <div key={os.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`os-${os.id}`}
                      checked={selectedOS.includes(os.label)}
                      onCheckedChange={() => handleOSChange(os.label)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={`os-${os.id}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {os.label}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PhoneFilterPanel;
