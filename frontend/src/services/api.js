import axios from 'axios';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function apiFetch(url, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  try {
    const response = await axios({
      url,
      method,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders(),
        ...headers,
      },
    });
    return response.data || null;
  } catch (error) {
    const message = error.response?.data || error.message;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
}