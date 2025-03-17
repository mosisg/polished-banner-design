
import React from 'react';
import ResultsHeader from './ResultsHeader';
import ResultsList from './ResultsList';
import { MobilePlan, SortOption } from '@/types/mobile';

interface ResultsPanelProps {
  filteredPlans: MobilePlan[];
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
}

const ResultsPanel = ({ filteredPlans, sortOption, setSortOption }: ResultsPanelProps) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      <ResultsHeader 
        filteredPlansCount={filteredPlans.length} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
      />
      <ResultsList filteredPlans={filteredPlans} />
    </div>
  );
};

export default ResultsPanel;
