
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  author_name: string;
  author_avatar: string | null;
  rating: number;
  title: string;
  content: string;
  product_type: 'mobile_plan' | 'internet_box';
  product_id: string | null;
  created_at: string;
}

export const useReviews = (productType: 'mobile_plan' | 'internet_box') => {
  const fetchReviews = async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_type', productType)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to fetch reviews');
    }

    return data || [];
  };

  return useQuery({
    queryKey: ['reviews', productType],
    queryFn: fetchReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
