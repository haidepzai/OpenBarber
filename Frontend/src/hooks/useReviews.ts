import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsAPI } from '../api/apiClient';

export const useShopReviews = (shopId: number | null) =>
  useQuery({
    queryKey: ['reviews', 'shop', shopId],
    queryFn: () => reviewsAPI.getByShop(shopId!).then(r => r.data?.content ?? r.data ?? []),
    enabled: !!shopId,
  });

export const useMyReviews = () =>
  useQuery({
    queryKey: ['reviews', 'my'],
    queryFn: () => reviewsAPI.getMy().then(r => r.data?.content ?? r.data ?? []),
  });

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) => reviewsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
