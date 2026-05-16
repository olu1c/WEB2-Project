import axios from 'axios';

const BASE = import.meta.env.VITE_USER_SERVICE_URL;

export const authService = {
  login: async (username, password) => {
    const res = await axios.post(`${BASE}/api/auth/login`, { username, password });
    return res.data;
  },

  register: async (username, email, password) => {
    const res = await axios.post(`${BASE}/api/auth/register`, { username, email, password });
    return res.data;
  },
};
