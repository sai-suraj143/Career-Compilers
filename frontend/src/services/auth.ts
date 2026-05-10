import api from '../api/axios';
import type { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post<{ data: AuthResponse }>('/auth/login', payload);
  return response.data.data;
};

export const signup = async (payload: SignupPayload) => {
  const response = await api.post<{ data: User }>('/auth/signup', payload);
  return response.data.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post<{ data: object }>('/auth/forgot-password', { email });
  return response.data.data;
};

export const logout = async () => {
  const response = await api.post<{ data: object }>('/auth/logout');
  return response.data.data;
};
