
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPhonesFromSupabase } from '@/services/phones/supabaseApi';
import { 
  filterPhones, 
  sortPhones 
} from '@/services/phones/phoneService';
import { SortOption, Phone } from '@/types/phones';
import { getExamplePhones } from '@/services/phones/exampleData';

export const usePhonesFromSupabase = () => {
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
  const [isFiltering, setIsFiltering] = useState(false);

  // Query for phones data from Supabase
  const { data: allPhones = [], isLoading, isError } = useQuery({
    queryKey: ['phones-supabase'],
    queryFn: fetchPhonesFromSupabase,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: getExamplePhones,
  });
  
  // Filtered phones state
  const [filteredPhones, setFilteredPhones] = useState<Phone[]>([]);
  
  // Apply filters and sorting
  useEffect(() => {
    if (!allPhones.length) return;
    
    // Set filtering state to true
    setIsFiltering(true);
    
    // Set a small timeout to simulate loading and show skeleton
    const filterTimer = setTimeout(() => {
      const filtered = filterPhones(allPhones, {
        brands: selectedBrands,
        priceRange: { min: priceRange[0], max: priceRange[1] },
        conditions: selectedConditions,
        operatingSystems: selectedOS,
        storage: selectedStorage,
        ecoFriendly: ecoFriendly
      });
      
      const sorted = sortPhones(filtered, sortOption);
      setFilteredPhones(sorted);
      setIsFiltering(false);
    }, 600); // 600ms delay to show the skeleton loading state
    
    return () => clearTimeout(filterTimer);
  }, [
    allPhones,
    priceRange,
    selectedBrands,
    selectedConditions,
    selectedOS,
    selectedStorage,
    ecoFriendly,
    sortOption
  ]);
  
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
    filteredPhones,
    isLoading,
    isFiltering,
    isError,
    // Functions
    toggleComparison
  };
};
