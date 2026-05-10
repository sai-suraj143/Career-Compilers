import api from '../api/axios';
import type { User } from '../types';

export const fetchProfile = async (id: number) => {
  const response = await api.get<{ data: User }>(`/users/${id}`);
  return response.data.data;
};

export const updateProfile = async (id: number, payload: Partial<User>) => {
  const response = await api.put<{ data: User }>(`/users/${id}`, payload);
  return response.data.data;
};
