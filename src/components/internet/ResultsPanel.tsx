
import React from 'react';
import ResultsHeader from './ResultsHeader';
import ResultsList from './ResultsList';
import { InternetBox, SortOption } from '@/types/internet';

interface ResultsPanelProps {
  filteredBoxes: InternetBox[];
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
}

const ResultsPanel = ({ filteredBoxes, sortOption, setSortOption }: ResultsPanelProps) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      <ResultsHeader 
        filteredBoxesCount={filteredBoxes.length} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
      />
      <ResultsList filteredBoxes={filteredBoxes} />
    </div>
  );
};

export default ResultsPanel;
