import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setSidebarOpen: (value: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setToast: (toast: UiState['toast']) => void;
  clearToast: () => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('traveloop_theme');
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  }
  return 'dark';
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  theme: getInitialTheme(),
  toast: null,
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  setTheme: (theme) => {
    localStorage.setItem('traveloop_theme', theme);
    set({ theme });
  },
  setToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));
