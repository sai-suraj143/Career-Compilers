export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  visibility?: 'PRIVATE' | 'PUBLIC';
  createdAt: string;
  stops?: Stop[];
  budget?: Budget;
}

export interface Stop {
  id: string;
  tripId: string;
  cityName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  orderIndex: number;
}

export interface Activity {
  id: string;
  stopId: string;
  title: string;
  category: string;
  cost: number;
  duration?: number;
  activityDate: string;
  description?: string;
  imageUrl?: string;
}

export interface Budget {
  id: string;
  tripId: string;
  transportCost: number;
  stayCost: number;
  foodCost: number;
  activityCost: number;
  totalCost: number;
}

export interface ChecklistItem {
  id: string;
  tripId: string;
  userId: string;
  itemName: string;
  category?: string;
  isPacked: boolean;
}

export interface Note {
  id: string;
  tripId: string;
  stopId?: string | null;
  userId: string;
  content: string;
  createdAt: string;
}

export interface City {
  name: string;
  country: string;
}

export interface Analytics {
  totalUsers: number;
  totalTrips: number;
  popularCities: string[];
  popularActivities: string[];
}
