import axios from 'axios';
import { Activity } from '../models/Activity';
import { getAuthHeader } from './api';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const activityService = {
  getAll: async (tripId) => {
    const res = await axios.get(`${BASE}/api/trips/${tripId}/activities`, { headers: getAuthHeader() });
    return res.data.map(a => new Activity(a));
  },

  create: async (tripId, activityData) => {
    const res = await axios.post(`${BASE}/api/trips/${tripId}/activities`, activityData, { headers: getAuthHeader() });
    return new Activity(res.data);
  },

  update: async (tripId, id, activityData) => {
    await axios.put(`${BASE}/api/trips/${tripId}/activities/${id}`, activityData, { headers: getAuthHeader() });
  },

  delete: async (tripId, id) => {
    await axios.delete(`${BASE}/api/trips/${tripId}/activities/${id}`, { headers: getAuthHeader() });
  },
};
