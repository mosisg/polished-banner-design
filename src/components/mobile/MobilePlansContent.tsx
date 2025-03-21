
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterPanel from '@/components/mobile/FilterPanel';
import ResultsPanel from '@/components/mobile/ResultsPanel';
import MobileFilterDialog from '@/components/mobile/MobileFilterDialog';
import { NetworkType, SortOption, MobilePlan } from '@/types/mobile';

interface MobilePlansContentProps {
  dataRange: number[];
  setDataRange: (value: number[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  networkType: NetworkType;
  setNetworkType: (value: NetworkType) => void;
  selectedOperators: string[];
  operators: string[];
  handleOperatorChange: (operator: string) => void;
  filteredPlans: MobilePlan[];
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  filtersOpen: boolean;
  setFiltersOpen: (value: boolean) => void;
  isLoading: boolean;
  isFiltering: boolean;
  showFiltersDialog: boolean;
  setShowFiltersDialog: (value: boolean) => void;
}

const MobilePlansContent = ({
  dataRange,
  setDataRange,
  priceRange,
  setPriceRange,
  networkType,
  setNetworkType,
  selectedOperators,
  operators,
  handleOperatorChange,
  filteredPlans,
  sortOption,
  setSortOption,
  filtersOpen,
  setFiltersOpen,
  isLoading,
  isFiltering,
  showFiltersDialog,
  setShowFiltersDialog
}: MobilePlansContentProps) => {
  const isMobile = useIsMobile();

  return (
    <main className="flex-1 mt-6 md:mt-8 container mx-auto px-4 md:px-6 pb-16">
      {isMobile && (
        <MobileFilterDialog 
          dataRange={dataRange}
          setDataRange={setDataRange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          networkType={networkType}
          setNetworkType={setNetworkType}
          selectedOperators={selectedOperators}
          operators={operators}
          handleOperatorChange={handleOperatorChange}
          showFiltersDialog={showFiltersDialog}
          setShowFiltersDialog={setShowFiltersDialog}
          filteredPlansCount={filteredPlans.length}
          isFiltering={isFiltering}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Filters Panel - Hidden in mobile, shown in desktop */}
        {!isMobile && (
          <FilterPanel 
            dataRange={dataRange}
            setDataRange={setDataRange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            networkType={networkType}
            setNetworkType={setNetworkType}
            selectedOperators={selectedOperators}
            operators={operators}
            handleOperatorChange={handleOperatorChange}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
          />
        )}

        {/* Results Panel */}
        <ResultsPanel 
          filteredPlans={filteredPlans} 
          sortOption={sortOption} 
          setSortOption={setSortOption}
          isLoading={isLoading}
          isFiltering={isFiltering}
        />
      </div>
    </main>
  );
};

export default MobilePlansContent;
