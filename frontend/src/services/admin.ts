import api from '../api/axios';
import type { Analytics } from '../types';

export const fetchAnalytics = async () => {
  const response = await api.get<{ data: Analytics }>('/admin/analytics');
  return response.data.data;
};
