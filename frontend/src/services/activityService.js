import { apiFetch } from './api';
import { Activity } from '../models/Activity';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const activityService = {
  getAll: async (tripId) => {
    const data = await apiFetch(`${BASE}/api/trips/${tripId}/activities`);
    return data.map(a => new Activity(a));
  },

  create: async (tripId, activityData) => {
    const data = await apiFetch(`${BASE}/api/trips/${tripId}/activities`, {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
    return new Activity(data);
  },

  update: async (tripId, id, activityData) => {
    await apiFetch(`${BASE}/api/trips/${tripId}/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  },

  delete: async (tripId, id) => {
    await apiFetch(`${BASE}/api/trips/${tripId}/activities/${id}`, { method: 'DELETE' });
  },
};
