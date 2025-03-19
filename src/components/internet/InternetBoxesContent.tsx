
import React from 'react';
import FilterPanel from '@/components/internet/FilterPanel';
import ResultsPanel from '@/components/internet/ResultsPanel';
import TrustBadges from '@/components/layout/TrustBadges';

interface InternetBoxesContentProps {
  speedRange: number[];
  setSpeedRange: (value: number[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  connectionType: string;
  setConnectionType: (value: any) => void;
  selectedOperators: string[];
  operators: string[];
  handleOperatorChange: (operator: string) => void;
  selectedWifiTypes: string[];
  wifiTypes: string[];
  handleWifiTypeChange: (type: string) => void;
  filteredBoxes: any[];
  sortOption: string;
  setSortOption: (value: any) => void;
  filtersOpen: boolean;
  setFiltersOpen: (value: boolean) => void;
}

const InternetBoxesContent: React.FC<InternetBoxesContentProps> = ({
  speedRange,
  setSpeedRange,
  priceRange,
  setPriceRange,
  connectionType,
  setConnectionType,
  selectedOperators,
  operators,
  handleOperatorChange,
  selectedWifiTypes,
  wifiTypes,
  handleWifiTypeChange,
  filteredBoxes,
  sortOption,
  setSortOption,
  filtersOpen,
  setFiltersOpen
}) => {
  return (
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
      
      <TrustBadges />
    </main>
  );
};

export default InternetBoxesContent;
