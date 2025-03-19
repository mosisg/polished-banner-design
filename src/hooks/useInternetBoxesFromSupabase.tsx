
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InternetBox, ConnectionType, SortOption } from '@/types/internet';

interface InternetBoxResponse {
  id: string;
  name: string;
  operator: string;
  price: string;
  download_speed: string;
  upload_speed: string;
  wifi_type: string;
  commitment: string | null;
  tv_option: string | null;
  call_option: string | null;
  features: string[];
  image: string | null;
  special_offer: string | null;
  created_at: string;
  updated_at: string;
  affiliate_url: string | null;
}

const fetchInternetBoxes = async (): Promise<InternetBox[]> => {
  const { data, error } = await supabase
    .from('internet_boxes')
    .select('*')
    .order('price');

  if (error) {
    console.error('Error fetching internet boxes:', error);
    throw new Error('Failed to fetch internet boxes');
  }

  return (data as InternetBoxResponse[]).map(box => ({
    id: parseInt(box.id.slice(0, 8), 16), // Convert UUID to a simple numeric ID
    name: box.name,
    operator: box.operator,
    price: box.price,
    downloadSpeed: box.download_speed,
    uploadSpeed: box.upload_speed,
    wifiType: box.wifi_type,
    commitment: box.commitment || undefined,
    tvOption: box.tv_option || undefined,
    callOption: box.call_option || undefined,
    features: box.features,
    image: box.image || undefined,
    specialOffer: box.special_offer || undefined,
    affiliate_url: box.affiliate_url || undefined
  }));
};

export const useInternetBoxesFromSupabase = () => {
  const [speedRange, setSpeedRange] = useState<number[]>([1000]);
  const [priceRange, setPriceRange] = useState<number[]>([30]);
  const [connectionType, setConnectionType] = useState<ConnectionType>('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedWifiTypes, setSelectedWifiTypes] = useState<string[]>([]);
  const [filteredBoxes, setFilteredBoxes] = useState<InternetBox[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch data using React Query
  const { data: allBoxes = [], isLoading, error } = useQuery({
    queryKey: ['internetBoxes'],
    queryFn: fetchInternetBoxes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // All available operators from the data
  const operators = Array.from(new Set(allBoxes.map(box => box.operator)));
  // All available WiFi types from the data
  const wifiTypes = Array.from(new Set(allBoxes.map(box => box.wifiType)));

  const handleOperatorChange = (operator: string) => {
    setSelectedOperators(prev => {
      if (prev.includes(operator)) {
        return prev.filter(op => op !== operator);
      } else {
        return [...prev, operator];
      }
    });
  };

  const handleWifiTypeChange = (type: string) => {
    setSelectedWifiTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Apply filters
  useEffect(() => {
    if (!allBoxes.length) return;
    
    // Set filtering state to true
    setIsFiltering(true);
    
    // Set a small timeout to simulate loading and show skeleton
    const filterTimer = setTimeout(() => {
      let filtered = [...allBoxes];

      // Filter by download speed
      filtered = filtered.filter(box => {
        const speedMatch = box.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
        if (!speedMatch) return true;
        
        const speedValue = parseFloat(speedMatch[1]);
        const speedUnit = speedMatch[2];
        
        // Convert to Mbps for comparison
        const speedMbps = speedUnit === 'Gb/s' ? speedValue * 1000 : speedValue;
        
        return speedMbps <= speedRange[0];
      });

      // Filter by price
      filtered = filtered.filter(box => {
        const price = parseFloat(box.price);
        return price <= priceRange[0];
      });

      // Filter by connection type
      if (connectionType !== 'all') {
        filtered = filtered.filter(box => {
          if (connectionType === 'fibre') {
            return box.downloadSpeed.includes('Gb/s') || parseInt(box.downloadSpeed) > 100;
          } else if (connectionType === 'adsl') {
            return box.downloadSpeed.includes('Mb/s') && parseInt(box.downloadSpeed) <= 100;
          } else if (connectionType === 'box4g') {
            return box.name.toLowerCase().includes('4g') || box.name.toLowerCase().includes('5g');
          }
          return true;
        });
      }

      // Filter by selected operators
      if (selectedOperators.length > 0) {
        filtered = filtered.filter(box => selectedOperators.includes(box.operator));
      }

      // Filter by selected WiFi types
      if (selectedWifiTypes.length > 0) {
        filtered = filtered.filter(box => selectedWifiTypes.includes(box.wifiType));
      }

      // Sort results
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        
        const speedMatchA = a.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
        const speedMatchB = b.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
        
        const speedValueA = speedMatchA ? parseFloat(speedMatchA[1]) : 0;
        const speedUnitA = speedMatchA ? speedMatchA[2] : 'Mb/s';
        const speedValueB = speedMatchB ? parseFloat(speedMatchB[1]) : 0;
        const speedUnitB = speedMatchB ? speedMatchB[2] : 'Mb/s';
        
        const speedMbpsA = speedUnitA === 'Gb/s' ? speedValueA * 1000 : speedValueA;
        const speedMbpsB = speedUnitB === 'Gb/s' ? speedValueB * 1000 : speedValueB;

        switch (sortOption) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'speed-asc':
            return speedMbpsA - speedMbpsB;
          case 'speed-desc':
            return speedMbpsB - speedMbpsA;
          default:
            return priceA - priceB;
        }
      });

      setFilteredBoxes(filtered);
      setIsFiltering(false);
    }, 600); // 600ms delay to show the skeleton loading state
    
    return () => clearTimeout(filterTimer);
  }, [allBoxes, speedRange, priceRange, connectionType, selectedOperators, selectedWifiTypes, sortOption]);

  return {
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
    setFiltersOpen,
    isLoading,
    isFiltering,
    error
  };
};
