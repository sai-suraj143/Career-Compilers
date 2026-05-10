import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setSidebarOpen: (value: boolean) => void;
  setToast: (toast: UiState['toast']) => void;
  clearToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toast: null,
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  setToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));
