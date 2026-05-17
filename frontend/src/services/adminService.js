import axios from 'axios';
import { getAuthHeader } from './api';

const BASE = import.meta.env.VITE_ADMIN_SERVICE_URL;

export const adminService = {
  getUsers: async () => {
    const res = await axios.get(`${BASE}/api/admin/users`, { headers: getAuthHeader() });
    return res.data;
  },

  deleteUser: async (id) => {
    await axios.delete(`${BASE}/api/admin/users/${id}`, { headers: getAuthHeader() });
  },

  changeRole: async (id, role) => {
    await axios.put(`${BASE}/api/admin/users/${id}/role`, JSON.stringify(role), {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    });
  },

  getAllTrips: async () => {
    const res = await axios.get(`${BASE}/api/admin/trips`, { headers: getAuthHeader() });
    return res.data;
  },
};
