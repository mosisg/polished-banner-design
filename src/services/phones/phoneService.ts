
// Re-export all phone service functionality from the individual modules
import { fetchPhonesData } from './api';
import { getExamplePhones } from './exampleData';
import { filterPhones, sortPhones } from './filterService';
import { getBrands, getOperatingSystems, getStorageOptions, getPriceRange } from './metadataService';

// Export specific brand collections for more granular data access
import { getSamsungPhones, getApplePhones, getOtherPhones } from './data';

export {
  fetchPhonesData,
  getExamplePhones,
  filterPhones,
  sortPhones,
  getBrands,
  getOperatingSystems,
  getStorageOptions,
  getPriceRange,
  // Brand-specific exports
  getSamsungPhones,
  getApplePhones,
  getOtherPhones
};
