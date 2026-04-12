import { useQuery } from '@tanstack/react-query';
import { getAdminInventoryStatus, getAdminLowStock } from '../api/admin.api';

export const adminKeys = {
  inventoryStatus: ['admin', 'inventoryStatus'] as const,
  lowStock: ['admin', 'lowStock'] as const,
};

export function useAdminInventoryStatusQuery() {
  return useQuery({
    queryKey: adminKeys.inventoryStatus,
    queryFn: getAdminInventoryStatus,
  });
}

export function useAdminLowStockQuery() {
  return useQuery({
    queryKey: adminKeys.lowStock,
    queryFn: getAdminLowStock,
  });
}
