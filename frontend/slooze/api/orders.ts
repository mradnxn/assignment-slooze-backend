import apiClient from './client';

export interface CreateOrderPayload {
  restaurantId: number;
  paymentMethod: string;
  items: {
    menuItemId: number;
    quantity: number;
  }[];
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await apiClient.post('/orders', payload);
  return response.data;
}

export async function checkoutOrder(id: number) {
  const response = await apiClient.post(`/orders/${id}/checkout`);
  return response.data;
}

export async function cancelOrder(id: number) {
  const response = await apiClient.post(`/orders/${id}/cancel`);
  return response.data;
}

export async function updateOrderPaymentMethod(id: number, paymentMethod: string) {
  const response = await apiClient.patch(`/orders/${id}/payment-method`, { paymentMethod });
  return response.data;
}

export async function getOrders(params?: { country?: string; userId?: number }) {
  const response = await apiClient.get('/orders', { params });
  return response.data;
}

export async function getOrder(id: number) {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
}
