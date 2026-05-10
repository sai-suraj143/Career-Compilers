import api from '../api/axios';
import type { Activity } from '../types';

export const searchActivities = async (query: string, stopId: string) => {
  const response = await api.get<{ data: Activity[] }>('/activities/search', {
    params: { q: query, stopId },
  });
  return response.data.data;
};

export const createActivity = async (payload: Omit<Activity, 'id'> & { tripId: string }) => {
  const response = await api.post<{ data: Activity }>('/activities', payload);
  return response.data.data;
};

export const updateActivity = async (id: string, payload: Partial<Omit<Activity, 'id'>>) => {
  const response = await api.put<{ data: Activity }>(`/activities/${id}`, payload);
  return response.data.data;
};

export const deleteActivity = async (id: string) => {
  const response = await api.delete<{ data: object }>(`/activities/${id}`);
  return response.data.data;
};
