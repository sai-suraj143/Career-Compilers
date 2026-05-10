import api from '../api/axios';
import type { City } from '../types';

export const searchCities = async (query: string) => {
  const response = await api.get<{ data: City[] }>('/cities/search', {
    params: { q: query },
  });
  return response.data.data;
};
