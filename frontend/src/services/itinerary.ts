import api from '../api/axios';
import type { Stop } from '../types';

export const createStop = async (payload: Omit<Stop, 'id'>) => {
  const response = await api.post<{ data: Stop }>('/stops', payload);
  return response.data.data;
};

export const updateStop = async (id: string, payload: Partial<Omit<Stop, 'id'>>) => {
  const response = await api.put<{ data: Stop }>(`/stops/${id}`, payload);
  return response.data.data;
};

export const removeStop = async (id: string) => {
  const response = await api.delete<{ data: object }>(`/stops/${id}`);
  return response.data.data;
};

export interface StopOrder {
  id: string;
  orderIndex: number;
}

export const reorderStops = async (stops: StopOrder[]) => {
  const response = await api.put<{ data: Stop[] }>('/stops/reorder', { stops });
  return response.data.data;
};
