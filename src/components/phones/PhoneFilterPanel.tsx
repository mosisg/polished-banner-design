
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
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };
  
  const handleConditionChange = (condition: 'new' | 'refurbished' | 'used') => {
    setSelectedConditions(prev => {
      if (prev.includes(condition)) {
        return prev.filter(c => c !== condition);
      } else {
        return [...prev, condition];
      }
    });
  };
  
  const handleOSChange = (os: string) => {
    setSelectedOS(prev => {
      if (prev.includes(os)) {
        return prev.filter(o => o !== os);
      } else {
        return [...prev, os];
      }
    });
  };
  
  const handleStorageChange = (storage: string) => {
    setSelectedStorage(prev => {
      if (prev.includes(storage)) {
        return prev.filter(s => s !== storage);
      } else {
        return [...prev, storage];
      }
    });
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
          {/* Price Range Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Budget</h3>
              </div>
              <Badge variant="outline" className="font-semibold">
                {priceRange[0]}€ - {priceRange[1]}€
              </Badge>
            </div>
            
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              <>
                <Slider
                  defaultValue={[fullPriceRange.min, fullPriceRange.max]}
                  min={fullPriceRange.min}
                  max={fullPriceRange.max}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{fullPriceRange.min}€</span>
                  <span>{Math.round((fullPriceRange.min + fullPriceRange.max) / 2)}€</span>
                  <span>{fullPriceRange.max}€</span>
                </div>
              </>
            )}
          </div>

          {/* Brands Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Marques</h3>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.label)}
                      onCheckedChange={() => handleBrandChange(brand.label)}
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full"
                    >
                      <span>{brand.label}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {brand.count}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Condition */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <RefreshCcw className="h-4 w-4 text-primary" />
              <h3 className="font-medium">État</h3>
            </div>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condition-used"
                  checked={selectedConditions.includes('used')}
                  onCheckedChange={() => handleConditionChange('used')}
                  disabled={isLoading}
                />
                <label
                  htmlFor="condition-used"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Occasion
                </label>
              </div>
            </div>
          </div>

          {/* Operating System */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Système d'exploitation</h3>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {operatingSystems.map((os) => (
                  <div key={os.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`os-${os.id}`}
                      checked={selectedOS.includes(os.label)}
                      onCheckedChange={() => handleOSChange(os.label)}
                    />
                    <label
                      htmlFor={`os-${os.id}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full"
                    >
                      <span>{os.label}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {os.count}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Storage Capacity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Capacité de stockage</h3>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                {storageOptions.map((storage) => (
                  <div key={storage.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`storage-${storage.id}`}
                      checked={selectedStorage.includes(storage.label)}
                      onCheckedChange={() => handleStorageChange(storage.label)}
                    />
                    <label
                      htmlFor={`storage-${storage.id}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full"
                    >
                      <span>{storage.label}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {storage.count}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Eco-Friendly */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <h3 className="font-medium">Écologie</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eco-friendly"
                checked={ecoFriendly}
                onCheckedChange={(checked) => setEcoFriendly(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="eco-friendly"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Produit éco-responsable
              </label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PhoneFilterPanel;
