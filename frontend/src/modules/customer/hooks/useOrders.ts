import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../app/api/query-client';
import { checkout, getMyOrders, getMyOrderById, getMyOrderPayment, payByCard } from '../api/orders.api';
import { OrderQuery } from '../../../shared/types/orders';

export const customerOrderKeys = {
  orders: (params?: OrderQuery) => ['me', 'orders', params] as const,
  order: (id: number) => ['me', 'orders', id] as const,
  payment: (orderId: number) => ['me', 'orders', orderId, 'payment'] as const,
};

export function useCheckout() {
  return useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'cart'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'orders'] });
    },
  });
}

export function useMyOrdersQuery(params: OrderQuery) {
  return useQuery({
    queryKey: customerOrderKeys.orders(params),
    queryFn: () => getMyOrders(params),
  });
}

export function useMyOrderQuery(id: number) {
  return useQuery({
    queryKey: customerOrderKeys.order(id),
    queryFn: () => getMyOrderById(id),
    enabled: !!id,
  });
}

export function useMyOrderPaymentQuery(orderId: number) {
  return useQuery({
    queryKey: customerOrderKeys.payment(orderId),
    queryFn: () => getMyOrderPayment(orderId),
    enabled: !!orderId,
  });
}

export function usePayByCard() {
  return useMutation({
    mutationFn: ({ orderId, ...payload }: { orderId: number } & Parameters<typeof payByCard>[1]) => payByCard(orderId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerOrderKeys.payment(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: customerOrderKeys.order(variables.orderId) });
    },
  });
}
