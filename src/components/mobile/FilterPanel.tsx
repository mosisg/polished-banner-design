
import React from 'react';
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { NetworkType } from '@/types/mobile';
import FilterHeader from './filters/FilterHeader';
import DataRangeFilter from './filters/DataRangeFilter';
import PriceRangeFilter from './filters/PriceRangeFilter';
import NetworkTypeFilter from './filters/NetworkTypeFilter';
import OperatorsFilter from './filters/OperatorsFilter';

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
        <FilterHeader filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} />

        <CollapsibleContent className="p-3 md:p-4 space-y-5">
          {/* Data Amount Slider */}
          <DataRangeFilter dataRange={dataRange} setDataRange={setDataRange} />

          {/* Price Range Slider */}
          <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} />

          {/* Network Type */}
          <NetworkTypeFilter networkType={networkType} setNetworkType={setNetworkType} />

          {/* Operators Checkboxes */}
          <OperatorsFilter 
            selectedOperators={selectedOperators} 
            operators={operators} 
            handleOperatorChange={handleOperatorChange} 
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterPanel;
