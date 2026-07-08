import apiClient from './client';

export async function login(credentials: Record<string, any>) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

export async function getProfile() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}

export async function logout() {
  const response = await apiClient.post('/auth/logout');
  return response.data;
}
