
import { Phone } from '@/types/phones';
import { supabase } from '@/integrations/supabase/client';
import { parseXmlToPhones } from './xmlParser';
import { getExamplePhones } from './exampleData';

// Cache mechanism
let phonesCache: Phone[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Fetches the XML file from Supabase storage and converts it to JSON
 */
export const fetchPhonesData = async (): Promise<Phone[]> => {
  const currentTime = Date.now();
  
  // Return cached data if available and not expired
  if (phonesCache && currentTime - lastFetchTime < CACHE_DURATION) {
    console.log('Using cached phones data');
    return phonesCache;
  }
  
  try {
    console.log('Fetching phones XML from Supabase');
    
    // Get public URL for the XML file from the "mosis" bucket
    const { data: urlData, error: urlError } = await supabase
      .storage
      .from('mosis')
      .createSignedUrl('xmlTmp.xml', 60 * 60); // 1 hour expiry
      
    if (urlError || !urlData?.signedUrl) {
      console.error('Failed to get signed URL for XML file:', urlError);
      console.log('Falling back to example phones data');
      return getExamplePhones();
    }
    
    // Fetch the XML file
    const response = await fetch(urlData.signedUrl);
    if (!response.ok) {
      console.error(`Failed to fetch XML file: ${response.statusText}`);
      console.log('Falling back to example phones data');
      return getExamplePhones();
    }
    
    const xmlText = await response.text();
    const phones = parseXmlToPhones(xmlText);
    
    // If no phones parsed successfully, use example data
    if (phones.length === 0) {
      console.log('No phones found in XML, using example data');
      return getExamplePhones();
    }
    
    // Update cache
    phonesCache = phones;
    lastFetchTime = currentTime;
    
    console.log(`Successfully loaded ${phones.length} phones from XML`);
    return phones;
  } catch (error) {
    console.error('Error fetching phones data:', error);
    // Return cached data or example phones as fallback
    console.log('Error occurred, falling back to example phones data');
    return phonesCache || getExamplePhones();
  }
};
