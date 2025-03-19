
// Export individual functions to allow for better tree-shaking
export { fetchPhonesData } from './api';
export { getExamplePhones } from './exampleData';
export { filterPhones, sortPhones } from './filterService';
export { 
  getBrands, 
  getOperatingSystems, 
  getStorageOptions, 
  getPriceRange 
} from './metadataService';

// Export brand-specific collections
export { 
  getSamsungPhones, 
  getApplePhones, 
  getOtherPhones 
} from './data';
