
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultsList from './ResultsList';
import ResultsHeader from './ResultsHeader';
import { mobilePlans } from '@/data/mobilePlans';
import type { MobilePlan, SortOption } from '@/types/mobile';

interface ResultsPanelProps {
  filteredPlans: MobilePlan[];
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  filteredPlans, 
  sortOption, 
  setSortOption 
}) => {
  return (
    <div className="flex-1 px-4 lg:px-6 py-6">
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
