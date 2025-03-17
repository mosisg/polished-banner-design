
import React from 'react';
import { Wifi, Download, Upload, Router, Monitor, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { ConnectionType } from '@/types/internet';

interface FilterPanelProps {
  speedRange: number[];
  setSpeedRange: (value: number[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  connectionType: ConnectionType;
  setConnectionType: (value: ConnectionType) => void;
  selectedOperators: string[];
  operators: string[];
  handleOperatorChange: (operator: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  wifiTypes: string[];
  selectedWifiTypes: string[];
  handleWifiTypeChange: (type: string) => void;
}

const FilterPanel = ({
  speedRange,
  setSpeedRange,
  priceRange,
  setPriceRange,
  connectionType,
  setConnectionType,
  selectedOperators,
  operators,
  handleOperatorChange,
  filtersOpen,
  setFiltersOpen,
  wifiTypes,
  selectedWifiTypes,
  handleWifiTypeChange,
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
            <Router className="h-5 w-5 text-primary" />
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
          {/* Speed Range Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Débit maximal</h3>
              </div>
              <Badge variant="outline" className="font-semibold">
                {speedRange[0] < 1000 ? `${speedRange[0]} Mb/s` : `${speedRange[0]/1000} Gb/s`}
              </Badge>
            </div>
            <Slider
              defaultValue={[1000]}
              max={8000}
              step={100}
              value={speedRange}
              onValueChange={setSpeedRange}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100 Mb/s</span>
              <span>1 Gb/s</span>
              <span>4 Gb/s</span>
              <span>8 Gb/s</span>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v12M15 9h-6M15 15h-6"/>
                </svg>
                <h3 className="font-medium">Budget maximum</h3>
              </div>
              <Badge variant="outline" className="font-semibold">
                {priceRange[0]}€/mois
              </Badge>
            </div>
            <Slider
              defaultValue={[30]}
              max={60}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0€</span>
              <span>20€</span>
              <span>40€</span>
              <span>60€</span>
            </div>
          </div>

          {/* Connection Type */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Router className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Type de connexion</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={connectionType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setConnectionType('all')}
              >
                Tous
              </Button>
              <Button
                variant={connectionType === 'fibre' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setConnectionType('fibre')}
              >
                Fibre
              </Button>
              <Button
                variant={connectionType === 'adsl' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setConnectionType('adsl')}
              >
                ADSL
              </Button>
              <Button
                variant={connectionType === 'box4g' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setConnectionType('box4g')}
              >
                Box 4G/5G
              </Button>
            </div>
          </div>

          {/* WiFi Type Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Technologie WiFi</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {wifiTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`wifi-${type}`}
                    checked={selectedWifiTypes.includes(type)}
                    onCheckedChange={() => handleWifiTypeChange(type)}
                  />
                  <label
                    htmlFor={`wifi-${type}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Services inclus */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Services inclus</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="tv-included" />
                <label
                  htmlFor="tv-included"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  TV incluse
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="calls-included" />
                <label
                  htmlFor="calls-included"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Appels illimités
                </label>
              </div>
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
