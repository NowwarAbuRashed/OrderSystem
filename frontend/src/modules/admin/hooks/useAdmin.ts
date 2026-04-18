import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminInventoryStatus,
  getAdminLowStock,
  getAdminDashboard,
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
  getAdminOrders,
  getAdminRevenue,
  getAdminActivity,
  updateCatalogBulkStatus,
  updateCatalogBulkPrice,
  getAdminNotificationsUnread,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/admin.api';

export const adminKeys = {
  inventoryStatus: ['admin', 'inventoryStatus'] as const,
  lowStock: ['admin', 'lowStock'] as const,
  dashboard: ['admin', 'dashboard'] as const,
  users: (params?: any) => ['admin', 'users', params] as const,
  orders: (params?: any) => ['admin', 'orders', params] as const,
  revenue: (days?: number) => ['admin', 'revenue', days] as const,
  activity: (params?: any) => ['admin', 'activity', params] as const,
};

// ── Existing ──
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

// ── Dashboard ──
export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: getAdminDashboard,
  });
}

// ── Users ──
export function useAdminUsersQuery(params?: { page?: number; pageSize?: number; role?: string }) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => getAdminUsers(params),
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

// ── Orders ──
export function useAdminOrdersQuery(params?: { page?: number; pageSize?: number; status?: number }) {
  return useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: () => getAdminOrders(params),
  });
}

// ── Revenue ──
export function useAdminRevenueQuery(days: number = 30) {
  return useQuery({
    queryKey: adminKeys.revenue(days),
    queryFn: () => getAdminRevenue({ days }),
  });
}

// ── Activity Log ──
export function useAdminActivityQuery(params?: { count?: number; entityType?: string; userId?: number }) {
  return useQuery({
    queryKey: adminKeys.activity(params),
    queryFn: () => getAdminActivity(params),
  });
}

// ── Catalog ──
export function useUpdateCatalogBulkStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productIds, isActive }: { productIds: number[]; isActive: boolean }) =>
      updateCatalogBulkStatus(productIds, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateCatalogBulkPriceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productIds, percentageChange }: { productIds: number[]; percentageChange: number }) =>
      updateCatalogBulkPrice(productIds, percentageChange),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ── Notifications ──

export function useAdminNotificationsQuery(limit: number = 50) {
  return useQuery({
    queryKey: ['admin', 'notifications', { limit }],
    queryFn: () => getAdminNotificationsUnread(limit),
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
    },
  });
}
