import apiClient from './client';

export async function getRestaurants(country?: string) {
  const response = await apiClient.get('/restaurants', {
    params: country ? { country } : undefined,
  });
  return response.data;
}

export async function getRestaurant(id: number) {
  const response = await apiClient.get(`/restaurants/${id}`);
  return response.data;
}

export async function getRestaurantMenu(id: number) {
  const response = await apiClient.get(`/restaurants/${id}/menu`);
  return response.data;
}
