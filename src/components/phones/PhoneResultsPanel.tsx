
import React, { useState } from 'react';
import PhoneResultsHeader from './PhoneResultsHeader';
import PhoneComparisonButton from './PhoneComparisonButton';
import PhoneResults from './PhoneResults';
import { Phone, SortOption } from '@/types/phones';

interface PhoneResultsPanelProps {
  phones: Phone[];
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  isLoading: boolean;
  comparisonList: string[];
  toggleComparison: (id: string) => void;
}

const PhoneResultsPanel = ({
  phones,
  sortOption,
  setSortOption,
  isLoading,
  comparisonList,
  toggleComparison
}: PhoneResultsPanelProps) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const phonesPerPage = 9; // 3x3 grid
  
  // Get comparison phones
  const comparisonPhones = phones.filter(phone => 
    comparisonList.includes(phone.id)
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(phones.length / phonesPerPage);
  const startIndex = (page - 1) * phonesPerPage;
  const paginatedPhones = phones.slice(startIndex, startIndex + phonesPerPage);
  
  // Page change handler
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="lg:col-span-3">
      {/* Results Header */}
      <PhoneResultsHeader 
        isLoading={isLoading}
        phonesCount={phones.length}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Comparison selection reminder */}
      <PhoneComparisonButton 
        comparisonList={comparisonList}
        comparisonPhones={comparisonPhones}
      />

      {/* Results Content */}
      <PhoneResults
        phones={phones}
        isLoading={isLoading}
        paginatedPhones={paginatedPhones}
        comparisonList={comparisonList}
        toggleComparison={toggleComparison}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        viewType={view}
      />
    </div>
  );
};

export default PhoneResultsPanel;
