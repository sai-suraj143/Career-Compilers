import api from '../api/axios';
import type { Trip } from '../types';

export const fetchTrips = async () => {
  const response = await api.get<{ data: Trip[] }>('/trips');
  return response.data.data;
};

export const fetchTrip = async (id: string) => {
  const response = await api.get<{ data: Trip }>(`/trips/${id}`);
  return response.data.data;
};

export const createTrip = async (payload: Omit<Trip, 'id' | 'createdAt' | 'visibility' | 'stops' | 'budget'>) => {
  const response = await api.post<{ data: Trip }>('/trips', payload);
  return response.data.data;
};

export const updateTrip = async (id: string, payload: Partial<Omit<Trip, 'id' | 'createdAt' | 'userId' | 'visibility' | 'stops' | 'budget'>>) => {
  const response = await api.put<{ data: Trip }>(`/trips/${id}`, payload);
  return response.data.data;
};

export const deleteTrip = async (id: string) => {
  const response = await api.delete<{ data: object }>(`/trips/${id}`);
  return response.data.data;
};
