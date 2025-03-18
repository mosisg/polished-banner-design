
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ConnectionType } from '@/types/internet';
import FilterHeader from './filters/FilterHeader';
import SpeedRangeFilter from './filters/SpeedRangeFilter';
import PriceRangeFilter from './filters/PriceRangeFilter';
import ConnectionTypeFilter from './filters/ConnectionTypeFilter';
import WifiTypeFilter from './filters/WifiTypeFilter';
import ServicesFilter from './filters/ServicesFilter';
import OperatorsFilter from './filters/OperatorsFilter';

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
        <FilterHeader filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} />

        <CollapsibleContent className="p-4 space-y-6">
          {/* Speed Range Slider */}
          <SpeedRangeFilter speedRange={speedRange} setSpeedRange={setSpeedRange} />

          {/* Price Range Slider */}
          <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} />

          {/* Connection Type */}
          <ConnectionTypeFilter connectionType={connectionType} setConnectionType={setConnectionType} />

          {/* WiFi Type Checkboxes */}
          <WifiTypeFilter 
            wifiTypes={wifiTypes} 
            selectedWifiTypes={selectedWifiTypes} 
            handleWifiTypeChange={handleWifiTypeChange} 
          />

          {/* Services inclus */}
          <ServicesFilter />

          {/* Operators Checkboxes */}
          <OperatorsFilter 
            operators={operators} 
            selectedOperators={selectedOperators} 
            handleOperatorChange={handleOperatorChange} 
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterPanel;
