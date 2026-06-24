import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsAPI } from '../api/apiClient';

export const useMyAppointments = () =>
  useQuery({
    queryKey: ['appointments', 'my'],
    queryFn: () => appointmentsAPI.getMy().then(r => r.data?.content ?? r.data ?? []),
  });

export const useShopAppointments = (shopId: number | null) =>
  useQuery({
    queryKey: ['appointments', 'shop', shopId],
    queryFn: () => appointmentsAPI.getByShop(shopId!).then(r => r.data?.content ?? r.data ?? []),
    enabled: !!shopId,
  });

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) => appointmentsAPI.cancel(id, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
