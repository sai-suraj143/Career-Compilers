export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Trip {
  id: string;
  userId: number;
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
  activities?: Activity[];
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
  userId: number;
  title: string;
  category?: string;
  packed: boolean;
}

export interface Note {
  id: string;
  tripId: string;
  stopId?: string | null;
  userId: number;
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
