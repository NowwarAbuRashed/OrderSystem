import { http } from '../../../app/api/http';
import { PagedResult } from '../../../shared/types/common';
import { CheckoutRequest, CheckoutResponse, OrderQuery, OrderListItem, OrderDetails } from '../../../shared/types/orders';
import { PaymentDetails, PayByCardRequest } from '../../../shared/types/payments';

export async function checkout(payload: CheckoutRequest) {
  const { data } = await http.post<CheckoutResponse>('/api/v1/me/orders', payload);
  return data;
}

export async function getMyOrders(params: OrderQuery) {
  const { data } = await http.get<PagedResult<OrderListItem>>('/api/v1/me/orders', { params });
  return data;
}

export async function getMyOrderById(orderId: number) {
  const { data } = await http.get<OrderDetails>(`/api/v1/me/orders/${orderId}`);
  return data;
}

export async function getMyOrderPayment(orderId: number) {
  const { data } = await http.get<PaymentDetails>(`/api/v1/me/orders/${orderId}/payment`);
  return data;
}

export async function payByCard(orderId: number, payload: PayByCardRequest) {
  const { data } = await http.post<PaymentDetails>(`/api/v1/me/orders/${orderId}/pay/card`, payload);
  return data;
}
