function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
