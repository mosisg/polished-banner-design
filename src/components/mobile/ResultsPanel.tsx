
import React from 'react';
import ResultsHeader from './ResultsHeader';
import ResultsList from './ResultsList';
import { MobilePlan, SortOption } from '@/types/mobile';

interface ResultsPanelProps {
  filteredPlans: MobilePlan[];
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  isLoading?: boolean;
  isFiltering?: boolean;
}

const ResultsPanel = ({ filteredPlans, sortOption, setSortOption, isLoading = false, isFiltering = false }: ResultsPanelProps) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      <ResultsHeader 
        filteredPlansCount={filteredPlans.length} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
        isLoading={isLoading || isFiltering}
      />
      <ResultsList 
        filteredPlans={filteredPlans} 
        isLoading={isLoading || isFiltering} 
      />
    </div>
  );
};

export default ResultsPanel;
