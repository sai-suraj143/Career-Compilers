import api from '../api/axios';
import type { Note } from '../types';

export const fetchNotes = async (tripId: string) => {
  const response = await api.get<{ data: Note[] }>(`/notes/${tripId}`);
  return response.data.data;
};

export const createNote = async (payload: Omit<Note, 'id' | 'createdAt'>) => {
  const response = await api.post<{ data: Note }>('/notes', payload);
  return response.data.data;
};

export const updateNote = async (id: string, payload: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
  const response = await api.put<{ data: Note }>(`/notes/${id}`, payload);
  return response.data.data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete<{ data: object }>(`/notes/${id}`);
  return response.data.data;
};
