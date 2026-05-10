import api from '../api/axios';
import type { ChecklistItem } from '../types';

export const addChecklistItem = async (payload: Omit<ChecklistItem, 'id'>) => {
  const response = await api.post<{ data: ChecklistItem }>('/checklist', payload);
  return response.data.data;
};

export const updateChecklistItem = async (id: string, payload: Partial<Omit<ChecklistItem, 'id'>>) => {
  const response = await api.put<{ data: ChecklistItem }>(`/checklist/${id}`, payload);
  return response.data.data;
};

export const deleteChecklistItem = async (id: string) => {
  const response = await api.delete<{ data: object }>(`/checklist/${id}`);
  return response.data.data;
};
