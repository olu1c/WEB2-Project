import { apiFetch } from './api';
import { Trip } from '../models/Trip';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const tripService = {
  getAll: async () => {
    const data = await apiFetch(`${BASE}/api/trips`);
    return data.map(t => new Trip(t));
  },

  getById: async (id) => {
    const data = await apiFetch(`${BASE}/api/trips/${id}`);
    return new Trip(data);
  },

  create: async (tripData) => {
    const data = await apiFetch(`${BASE}/api/trips`, {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
    return new Trip(data);
  },

  update: async (id, tripData) => {
    await apiFetch(`${BASE}/api/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  },

  delete: async (id) => {
    await apiFetch(`${BASE}/api/trips/${id}`, { method: 'DELETE' });
  },
};
