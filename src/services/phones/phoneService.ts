
// Re-export all phone service functionality from the individual modules
import { fetchPhonesData } from './api';
import { getExamplePhones } from './exampleData';
import { filterPhones, sortPhones } from './filterService';
import { getBrands, getOperatingSystems, getStorageOptions, getPriceRange } from './metadataService';

export {
  fetchPhonesData,
  getExamplePhones,
  filterPhones,
  sortPhones,
  getBrands,
  getOperatingSystems,
  getStorageOptions,
  getPriceRange
};
