
import { supabase } from '@/integrations/supabase/client';
import { InternetBox } from '@/types/internet';

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

/**
 * Fetches internet boxes from Supabase
 */
export const fetchInternetBoxes = async (): Promise<InternetBox[]> => {
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
