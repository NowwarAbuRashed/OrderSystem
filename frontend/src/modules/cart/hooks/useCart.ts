import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../app/api/query-client';
import { getCart, addCartItem, updateCartItem, deleteCartItem, clearCart } from '../api/cart.api';

export const cartKeys = {
  cart: ['me', 'cart'] as const,
};

export function useCartQuery() {
  return useQuery({
    queryKey: cartKeys.cart,
    queryFn: getCart,
  });
}

export function useAddCartItem() {
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({ itemId, ...payload }: { itemId: number; quantity: number }) => updateCartItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}

export function useDeleteCartItem() {
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}

export function useClearCart() {
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}
