import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../app/api/query-client';
import { getManagerOrders, getManagerOrderById, markOrderReady, markOrderOutForDelivery, markOrderDelivered, markCashCollected } from '../api/orders.api';
import { OrderQuery } from '../../../shared/types/orders';

export const managerOrderKeys = {
  orders: (params?: OrderQuery) => ['manager', 'orders', params] as const,
  order: (id: number) => ['manager', 'orders', id] as const,
};

export function useManagerOrdersQuery(params: OrderQuery) {
  return useQuery({
    queryKey: managerOrderKeys.orders(params),
    queryFn: () => getManagerOrders(params),
  });
}

export function useManagerOrderQuery(id: number) {
  return useQuery({
    queryKey: managerOrderKeys.order(id),
    queryFn: () => getManagerOrderById(id),
    enabled: !!id,
  });
}

function invalidateOrders(orderId: number) {
  queryClient.invalidateQueries({ queryKey: managerOrderKeys.orders() });
  queryClient.invalidateQueries({ queryKey: managerOrderKeys.order(orderId) });
}

export function useMarkOrderReady() {
  return useMutation({
    mutationFn: (orderId: number) => markOrderReady(orderId),
    onSuccess: (_, orderId) => invalidateOrders(orderId),
  });
}

export function useMarkOrderOutForDelivery() {
  return useMutation({
    mutationFn: (orderId: number) => markOrderOutForDelivery(orderId),
    onSuccess: (_, orderId) => invalidateOrders(orderId),
  });
}

export function useMarkOrderDelivered() {
  return useMutation({
    mutationFn: (orderId: number) => markOrderDelivered(orderId),
    onSuccess: (_, orderId) => invalidateOrders(orderId),
  });
}

export function useMarkCashCollected() {
  return useMutation({
    mutationFn: (orderId: number) => markCashCollected(orderId),
    onSuccess: (_, orderId) => invalidateOrders(orderId),
  });
}
