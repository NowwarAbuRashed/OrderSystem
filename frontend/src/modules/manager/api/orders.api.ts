import { http } from '../../../app/api/http';
import { PagedResult } from '../../../shared/types/common';
import { OrderQuery, OrderListItem, OrderDetails, OrderStatusChangeResponse } from '../../../shared/types/orders';
import { PaymentDetails } from '../../../shared/types/payments';

export async function getManagerOrders(params: OrderQuery) {
  const { data } = await http.get<PagedResult<OrderListItem>>('/api/v1/manager/orders', { params });
  return data;
}

export async function getManagerOrderById(orderId: number) {
  const { data } = await http.get<OrderDetails>(`/api/v1/manager/orders/${orderId}`);
  return data;
}

export async function markOrderReady(orderId: number) {
  const { data } = await http.post<OrderStatusChangeResponse>(`/api/v1/manager/orders/${orderId}/ready`);
  return data;
}

export async function markOrderOutForDelivery(orderId: number) {
  const { data } = await http.post<OrderStatusChangeResponse>(`/api/v1/manager/orders/${orderId}/out-for-delivery`);
  return data;
}

export async function markOrderDelivered(orderId: number) {
  const { data } = await http.post<OrderStatusChangeResponse>(`/api/v1/manager/orders/${orderId}/delivered`);
  return data;
}

export async function markCashCollected(orderId: number) {
  const { data } = await http.post<PaymentDetails>(`/api/v1/manager/orders/${orderId}/cash-collected`);
  return data;
}
