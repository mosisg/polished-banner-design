
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchPhonesData, 
  getExamplePhones, 
  filterPhones, 
  sortPhones 
} from '@/services/phones/phoneService';
import { SortOption, Phone } from '@/types/phones';

export const usePhones = () => {
  // Filter state
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<('new' | 'refurbished' | 'used')[]>([]);
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  // Query for phones data
  const { data: allPhones = [], isLoading, isError } = useQuery({
    queryKey: ['phones'],
    queryFn: fetchPhonesData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: getExamplePhones,
  });
  
  // Apply filters and sorting
  const filteredPhones = filterPhones(allPhones, {
    brands: selectedBrands,
    priceRange: { min: priceRange[0], max: priceRange[1] },
    conditions: selectedConditions,
    operatingSystems: selectedOS,
    storage: selectedStorage,
    ecoFriendly: ecoFriendly
  });
  
  const sortedPhones = sortPhones(filteredPhones, sortOption);
  
  // Comparison functionality
  const toggleComparison = (phoneId: string) => {
    setComparisonList(prev => {
      if (prev.includes(phoneId)) {
        return prev.filter(id => id !== phoneId);
      } else {
        // Limit to 4 phones in comparison
        if (prev.length >= 4) {
          return [...prev.slice(1), phoneId];
        }
        return [...prev, phoneId];
      }
    });
  };

  return {
    // State
    priceRange,
    setPriceRange,
    selectedBrands,
    setSelectedBrands,
    selectedConditions,
    setSelectedConditions,
    selectedOS,
    setSelectedOS,
    selectedStorage,
    setSelectedStorage,
    ecoFriendly,
    setEcoFriendly,
    sortOption,
    setSortOption,
    filtersOpen,
    setFiltersOpen,
    comparisonList,
    // Data
    allPhones,
    filteredPhones: sortedPhones,
    isLoading,
    isError,
    // Functions
    toggleComparison
  };
};
