import { useQuery } from '@tanstack/react-query';
import { shopsAPI } from '../api/apiClient';

export const useShop = (id: number | null) =>
  useQuery({
    queryKey: ['shop', id],
    queryFn: () => shopsAPI.getById(id!).then((r) => r.data),
    enabled: !!id,
  });

export const useMyShop = () =>
  useQuery({
    queryKey: ['myShop'],
    queryFn: () => shopsAPI.getByUser().then((r) => r.data),
  });
