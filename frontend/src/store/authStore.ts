import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  hydrateFromStorage: () => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  hydrateFromStorage: () => {
    const userString = localStorage.getItem('traveloop_user');
    const token = localStorage.getItem('traveloop_token');
    if (userString && token) {
      set({ user: JSON.parse(userString), token });
    }
  },
  setAuth: (user, token) => {
    localStorage.setItem('traveloop_user', JSON.stringify(user));
    localStorage.setItem('traveloop_token', token);
    set({ user, token, loading: false, error: null });
  },
  clearAuth: () => {
    localStorage.removeItem('traveloop_user');
    localStorage.removeItem('traveloop_token');
    set({ user: null, token: null, loading: false, error: null });
  },
  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message }),
}));
