import axios from 'axios';
import { getAuthHeader } from './api';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export const shareService = {
  getData: async (token) => {
    const res = await axios.get(`${BASE}/api/shares/${token}`, { headers: getAuthHeader() });
    return res.data;
  },

  // Destinations
  createDestination: async (token, data) => {
    const res = await axios.post(`${BASE}/api/shares/${token}/destinations`, data, { headers: getAuthHeader() });
    return res.data;
  },
  updateDestination: async (token, id, data) => {
    await axios.put(`${BASE}/api/shares/${token}/destinations/${id}`, data, { headers: getAuthHeader() });
  },
  deleteDestination: async (token, id) => {
    await axios.delete(`${BASE}/api/shares/${token}/destinations/${id}`, { headers: getAuthHeader() });
  },

  // Activities
  createActivity: async (token, data) => {
    const res = await axios.post(`${BASE}/api/shares/${token}/activities`, data, { headers: getAuthHeader() });
    return res.data;
  },
  updateActivity: async (token, id, data) => {
    await axios.put(`${BASE}/api/shares/${token}/activities/${id}`, data, { headers: getAuthHeader() });
  },
  deleteActivity: async (token, id) => {
    await axios.delete(`${BASE}/api/shares/${token}/activities/${id}`, { headers: getAuthHeader() });
  },

  // Expenses
  createExpense: async (token, data) => {
    const res = await axios.post(`${BASE}/api/shares/${token}/expenses`, data, { headers: getAuthHeader() });
    return res.data;
  },
  updateExpense: async (token, id, data) => {
    await axios.put(`${BASE}/api/shares/${token}/expenses/${id}`, data, { headers: getAuthHeader() });
  },
  deleteExpense: async (token, id) => {
    await axios.delete(`${BASE}/api/shares/${token}/expenses/${id}`, { headers: getAuthHeader() });
  },

  // Checklist
  createChecklistItem: async (token, text) => {
    const res = await axios.post(`${BASE}/api/shares/${token}/checklist`, { text }, { headers: getAuthHeader() });
    return res.data;
  },
  updateChecklistItem: async (token, id, data) => {
    await axios.put(`${BASE}/api/shares/${token}/checklist/${id}`, data, { headers: getAuthHeader() });
  },
  deleteChecklistItem: async (token, id) => {
    await axios.delete(`${BASE}/api/shares/${token}/checklist/${id}`, { headers: getAuthHeader() });
  },
};
