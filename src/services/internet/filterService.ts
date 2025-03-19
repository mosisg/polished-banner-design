
import { InternetBox, ConnectionType, SortOption } from '@/types/internet';

/**
 * Filters internet boxes based on various criteria
 */
export const filterInternetBoxes = (
  allBoxes: InternetBox[],
  speedRange: number[],
  priceRange: number[],
  connectionType: ConnectionType,
  selectedOperators: string[],
  selectedWifiTypes: string[],
  sortOption: SortOption
): InternetBox[] => {
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

  return filtered;
};

/**
 * Extracts unique operators from a list of internet boxes
 */
export const extractOperators = (boxes: InternetBox[]): string[] => {
  return Array.from(new Set(boxes.map(box => box.operator)));
};

/**
 * Extracts unique WiFi types from a list of internet boxes
 */
export const extractWifiTypes = (boxes: InternetBox[]): string[] => {
  return Array.from(new Set(boxes.map(box => box.wifiType)));
};
