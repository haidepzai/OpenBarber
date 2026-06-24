import { useQuery } from '@tanstack/react-query';
import { shopsAPI } from '../api/apiClient';

export const useShops = (page = 0, size = 12) =>
  useQuery({
    queryKey: ['shops', page, size],
    queryFn: () => shopsAPI.getAll(page, size).then(r => r.data),
  });

export const useShopsWithinRadius = (lat: number | null, lng: number | null, page = 0, size = 12) =>
  useQuery({
    queryKey: ['shops', 'radius', lat, lng, page, size],
    queryFn: () => shopsAPI.getWithinRadius(lat!, lng!, page, size).then(r => r.data),
    enabled: lat !== null && lng !== null,
  });
