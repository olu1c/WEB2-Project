import axios from 'axios';
import { Trip } from '../models/Trip';
import { getAuthHeader } from './api';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const tripService = {
  getAll: async () => {
    const res = await axios.get(`${BASE}/api/trips`, { headers: getAuthHeader() });
    return res.data.map(t => new Trip(t));
  },

  getById: async (id) => {
    const res = await axios.get(`${BASE}/api/trips/${id}`, { headers: getAuthHeader() });
    return new Trip(res.data);
  },

  create: async (tripData) => {
    const res = await axios.post(`${BASE}/api/trips`, tripData, { headers: getAuthHeader() });
    return new Trip(res.data);
  },

  update: async (id, tripData) => {
    await axios.put(`${BASE}/api/trips/${id}`, tripData, { headers: getAuthHeader() });
  },

  delete: async (id) => {
    await axios.delete(`${BASE}/api/trips/${id}`, { headers: getAuthHeader() });
  },
};
