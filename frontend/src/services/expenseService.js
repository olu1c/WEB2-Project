import { apiFetch } from './api';
import { Expense } from '../models/Expense';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const expenseService = {
  getAll: async (tripId) => {
    const data = await apiFetch(`${BASE}/api/trips/${tripId}/expenses`);
    return data.map(e => new Expense(e));
  },

  create: async (tripId, expenseData) => {
    const data = await apiFetch(`${BASE}/api/trips/${tripId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
    return new Expense(data);
  },

  update: async (tripId, id, expenseData) => {
    await apiFetch(`${BASE}/api/trips/${tripId}/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  },

  delete: async (tripId, id) => {
    await apiFetch(`${BASE}/api/trips/${tripId}/expenses/${id}`, { method: 'DELETE' });
  },
};
