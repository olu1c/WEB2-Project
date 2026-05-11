import { apiFetch } from './api';
import { Destination } from '../models/Destination';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const destinationService = {
  getAll: async (tripId) => {
    const data = await apiFetch(`${BASE}/api/trips/${tripId}/destinations`);
    return data.map(d => new Destination(d));
  },

  create: async (tripId, destinationData) => {
    const data = await apiFetch(`${BASE}/api/trips/${tripId}/destinations`, {
      method: 'POST',
      body: JSON.stringify(destinationData),
    });
    return new Destination(data);
  },

  update: async (tripId, id, destinationData) => {
    await apiFetch(`${BASE}/api/trips/${tripId}/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(destinationData),
    });
  },

  delete: async (tripId, id) => {
    await apiFetch(`${BASE}/api/trips/${tripId}/destinations/${id}`, { method: 'DELETE' });
  },
};
