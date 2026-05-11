const BASE = import.meta.env.VITE_USER_SERVICE_URL;

export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  register: async (username, email, password) => {
    const response = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.text();
  },
};
