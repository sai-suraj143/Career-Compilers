import api from '../api/axios';
import type { User } from '../types';

export const fetchProfile = async () => {
  const response = await api.get<{ data: User }>('/users/profile');
  return response.data.data;
};

export const updateProfile = async (payload: Partial<User>) => {
  const response = await api.put<{ data: User }>('/users/profile', payload);
  return response.data.data;
};
