import { apiFetch } from './api';
import { ChecklistItem } from '../models/ChecklistItem';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const checklistService = {
  getAll: async (tripId) => {
    const data = await apiFetch(`${BASE}/api/trips/${tripId}/checklist`);
    return data.map(c => new ChecklistItem(c));
  },

  create: async (tripId, text) => {
    const data = await apiFetch(`${BASE}/api/trips/${tripId}/checklist`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return new ChecklistItem(data);
  },

  update: async (tripId, id, itemData) => {
    await apiFetch(`${BASE}/api/trips/${tripId}/checklist/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  delete: async (tripId, id) => {
    await apiFetch(`${BASE}/api/trips/${tripId}/checklist/${id}`, { method: 'DELETE' });
  },
};
