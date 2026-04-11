import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../app/api/query-client';
import { adjustInventory, getInventoryHistory } from '../api/inventory.api';
import { managerProductKeys } from './useManagerProducts';

export const inventoryKeys = {
  history: (productId: number) => ['manager', 'inventory', productId, 'history'] as const,
};

export function useInventoryHistoryQuery(productId: number) {
  return useQuery({
    queryKey: inventoryKeys.history(productId),
    queryFn: () => getInventoryHistory(productId),
    enabled: !!productId,
  });
}

export function useAddInventory() {
  return useMutation({
    mutationFn: ({ productId, ...payload }: { productId: number } & Parameters<typeof adjustInventory>[1]) => adjustInventory(productId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.history(variables.productId) });
      queryClient.invalidateQueries({ queryKey: managerProductKeys.product(variables.productId) });
      queryClient.invalidateQueries({ queryKey: managerProductKeys.products() });
    },
  });
}

export function useRemoveInventory() {
  return useMutation({
    mutationFn: ({ productId, ...payload }: { productId: number } & Parameters<typeof adjustInventory>[1]) => adjustInventory(productId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.history(variables.productId) });
      queryClient.invalidateQueries({ queryKey: managerProductKeys.product(variables.productId) });
      queryClient.invalidateQueries({ queryKey: managerProductKeys.products() });
    },
  });
}
