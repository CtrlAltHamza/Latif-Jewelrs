const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchRates = async () => {
  const response = await fetch(`${API_URL}/rates`);
  if (!response.ok) throw new Error('Failed to fetch rates');
  return response.json();
};

export const loginAdmin = async (username, password) => {
  const response = await fetch(`${API_URL}/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const updateRates = async (token, ratesData) => {
  const response = await fetch(`${API_URL}/update-rates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(ratesData)
  });
  if (!response.ok) throw new Error('Update failed');
  return response.json();
};

export const logoutAdmin = async () => {
  const response = await fetch(`${API_URL}/admin-logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
};