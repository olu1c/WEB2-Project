import axios from 'axios';
import { Destination } from '../models/Destination';
import { getAuthHeader } from './api';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const destinationService = {
  getAll: async (tripId) => {
    const res = await axios.get(`${BASE}/api/trips/${tripId}/destinations`, { headers: getAuthHeader() });
    return res.data.map(d => new Destination(d));
  },

  create: async (tripId, destinationData) => {
    const res = await axios.post(`${BASE}/api/trips/${tripId}/destinations`, destinationData, { headers: getAuthHeader() });
    return new Destination(res.data);
  },

  update: async (tripId, id, destinationData) => {
    await axios.put(`${BASE}/api/trips/${tripId}/destinations/${id}`, destinationData, { headers: getAuthHeader() });
  },

  delete: async (tripId, id) => {
    await axios.delete(`${BASE}/api/trips/${tripId}/destinations/${id}`, { headers: getAuthHeader() });
  },
};
