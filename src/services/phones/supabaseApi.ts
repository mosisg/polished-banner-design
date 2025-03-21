
import { supabase } from '@/integrations/supabase/client';
import { Phone } from '@/types/phones';

/**
 * Fetche les téléphones depuis la table Supabase
 */
export const fetchPhonesFromSupabase = async (): Promise<Phone[]> => {
  try {
    console.log('Fetching phones from Supabase...');
    
    const { data, error } = await supabase
      .from('phones')
      .select('*')
      .order('price');
      
    if (error) {
      console.error('Error fetching phones from Supabase:', error);
      throw error;
    }
    
    console.log(`Successfully loaded ${data?.length || 0} phones from Supabase`);
    
    // Mapper les données de Supabase vers notre type Phone
    return (data || []).map(phone => ({
      id: phone.id,
      ean: phone.ean || '',
      title: phone.title,
      trademark: phone.trademark,
      description: phone.description,
      fullDescription: phone.full_description,
      price: phone.price,
      originalPrice: phone.original_price,
      discount: phone.discount,
      image: phone.image,
      additionalImages: phone.additional_images,
      category: phone.category || 'smartphone',
      merchant: phone.merchant || 'ComparePrix',
      condition: phone.condition || 'new',
      operatingSystem: phone.operating_system,
      color: phone.color,
      storage: phone.storage,
      shipping: phone.shipping,
      installmentPrice: phone.installment_price,
      installmentMonths: phone.installment_months,
      promotion: phone.promotion,
      rating: phone.rating,
      reviewCount: phone.review_count,
      isEcoFriendly: phone.is_eco_friendly,
      inStock: phone.in_stock !== false,
      productUrl: phone.product_url
    }));
  } catch (error) {
    console.error('Failed to fetch phones from Supabase:', error);
    throw error;
  }
};
