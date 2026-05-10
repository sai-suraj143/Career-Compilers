import api from '../api/axios';
import type { Budget } from '../types';

export const fetchBudget = async (tripId: string) => {
  const response = await api.get<{ data: Budget }>(`/budget/${tripId}`);
  return response.data.data;
};

export const updateBudget = async (tripId: string, payload: Partial<Budget>) => {
  const response = await api.put<{ data: Budget }>(`/budget/${tripId}`, payload);
  return response.data.data;
};
