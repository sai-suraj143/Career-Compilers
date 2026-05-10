import { create } from 'zustand';
import type { Trip } from '../types';

interface TripState {
  trips: Trip[];
  selectedTrip: Trip | null;
  loading: boolean;
  error: string | null;
  setTrips: (trips: Trip[]) => void;
  setSelectedTrip: (trip: Trip | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  selectedTrip: null,
  loading: false,
  error: null,
  setTrips: (trips) => set({ trips }),
  setSelectedTrip: (selectedTrip) => set({ selectedTrip }),
  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message }),
}));
