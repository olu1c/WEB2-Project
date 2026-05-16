import axios from 'axios';
import { ChecklistItem } from '../models/ChecklistItem';
import { getAuthHeader } from './api';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const checklistService = {
  getAll: async (tripId) => {
    const res = await axios.get(`${BASE}/api/trips/${tripId}/checklist`, { headers: getAuthHeader() });
    return res.data.map(c => new ChecklistItem(c));
  },

  create: async (tripId, text) => {
    const res = await axios.post(`${BASE}/api/trips/${tripId}/checklist`, { text }, { headers: getAuthHeader() });
    return new ChecklistItem(res.data);
  },

  update: async (tripId, id, itemData) => {
    await axios.put(`${BASE}/api/trips/${tripId}/checklist/${id}`, itemData, { headers: getAuthHeader() });
  },

  delete: async (tripId, id) => {
    await axios.delete(`${BASE}/api/trips/${tripId}/checklist/${id}`, { headers: getAuthHeader() });
  },
};
