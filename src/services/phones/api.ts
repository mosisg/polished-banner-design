
import { Phone } from '@/types/phones';
import { supabase } from '@/integrations/supabase/client';
import { parseXmlToPhones } from './xmlParser';
import { getExamplePhones } from './exampleData';

// Cache mechanism
let phonesCache: Phone[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes - shorter cache for more frequent updates

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
    console.log('Fetching phones XML from Supabase mosis bucket');
    
    // Get public URL for the XML file from the "mosis" bucket
    const { data: urlData, error: urlError } = await supabase
      .storage
      .from('mosis')
      .createSignedUrl('xmlTmp.xml', 60 * 60); // 1 hour expiry
      
    if (urlError || !urlData?.signedUrl) {
      console.error('Failed to get signed URL for XML file:', urlError);
      
      // Try to list files in the bucket to see what's available
      const { data: listData, error: listError } = await supabase
        .storage
        .from('mosis')
        .list();
        
      if (!listError && listData) {
        console.log('Files available in mosis bucket:', listData.map(f => f.name));
      } else {
        console.error('Failed to list bucket contents:', listError);
      }
      
      console.log('Falling back to example phones data');
      return getExamplePhones();
    }
    
    // Fetch the XML file with proper cache control
    console.log('Fetching XML from signed URL:', urlData.signedUrl);
    const response = await fetch(urlData.signedUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch XML file: ${response.status} ${response.statusText}`);
      console.log('Falling back to example phones data');
      return getExamplePhones();
    }
    
    const xmlText = await response.text();
    console.log('XML content length:', xmlText.length);
    console.log('XML sample:', xmlText.substring(0, 200) + '...');
    
    const phones = parseXmlToPhones(xmlText);
    
    // Log parsing results
    console.log(`Parsed ${phones.length} phones from XML`);
    
    if (phones.length > 0) {
      console.log('First phone sample:', JSON.stringify(phones[0], null, 2));
    }
    
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
