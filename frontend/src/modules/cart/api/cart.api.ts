import { http } from '../../../app/api/http';
import { Cart, AddCartItemRequest, UpdateCartItemRequest } from '../../../shared/types/cart';

export async function getCart() {
  const { data } = await http.get<Cart>('/api/v1/me/cart');
  return data;
}

export async function addCartItem(payload: AddCartItemRequest) {
  const { data } = await http.post('/api/v1/me/cart/items', payload);
  return data;
}

export async function updateCartItem(itemId: number, payload: UpdateCartItemRequest) {
  const { data } = await http.put(`/api/v1/me/cart/items/${itemId}`, payload);
  return data;
}

export async function deleteCartItem(itemId: number) {
  const { data } = await http.delete(`/api/v1/me/cart/items/${itemId}`);
  return data;
}

export async function clearCart() {
  const { data } = await http.delete('/api/v1/me/cart/items');
  return data;
}
