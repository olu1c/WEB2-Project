import axios from 'axios';
import { Expense } from '../models/Expense';
import { getAuthHeader } from './api';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const expenseService = {
  getAll: async (tripId) => {
    const res = await axios.get(`${BASE}/api/trips/${tripId}/expenses`, { headers: getAuthHeader() });
    return res.data.map(e => new Expense(e));
  },

  create: async (tripId, expenseData) => {
    const res = await axios.post(`${BASE}/api/trips/${tripId}/expenses`, expenseData, { headers: getAuthHeader() });
    return new Expense(res.data);
  },

  update: async (tripId, id, expenseData) => {
    await axios.put(`${BASE}/api/trips/${tripId}/expenses/${id}`, expenseData, { headers: getAuthHeader() });
  },

  delete: async (tripId, id) => {
    await axios.delete(`${BASE}/api/trips/${tripId}/expenses/${id}`, { headers: getAuthHeader() });
  },
};
