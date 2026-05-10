import api from '../api/axios';

export const fetchShareLink = async (tripId: string) => {
  const response = await api.get<{ data: { link: string } }>(`/share/${tripId}`);
  return response.data.data;
};

export const copyTrip = async (tripId: string) => {
  const response = await api.post<{ data: { newTripId: string } }>(`/share/${tripId}/copy`);
  return response.data.data;
};
