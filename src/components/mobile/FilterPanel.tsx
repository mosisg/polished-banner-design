
import React from 'react';
import { Filter, Wifi, Euro, Phone, Signal, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { NetworkType } from '@/types/mobile';

interface FilterPanelProps {
  dataRange: number[];
  setDataRange: (value: number[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  networkType: NetworkType;
  setNetworkType: (value: NetworkType) => void;
  selectedOperators: string[];
  operators: string[];
  handleOperatorChange: (operator: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

const FilterPanel = ({
  dataRange,
  setDataRange,
  priceRange,
  setPriceRange,
  networkType,
  setNetworkType,
  selectedOperators,
  operators,
  handleOperatorChange,
  filtersOpen,
  setFiltersOpen,
}: FilterPanelProps) => {
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
  );
};

export default FilterPanel;
