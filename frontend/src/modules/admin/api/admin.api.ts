import { http } from '../../../app/api/http';
import { PagedResult } from '../../../shared/types/common';
import { AdminInventoryStatusDto } from '../../../shared/types/inventory';

// ── Existing ──
export async function getAdminInventoryStatus() {
  const { data } = await http.get<PagedResult<AdminInventoryStatusDto> | any>('/api/v1/admin/inventory/status');
  return data.items || data;
}

export async function getAdminLowStock() {
  const { data } = await http.get<PagedResult<AdminInventoryStatusDto> | any>('/api/v1/admin/inventory/low-stock');
  return data.items || data;
}

// ── Dashboard ──
export async function getAdminDashboard() {
  const { data } = await http.get('/api/v1/admin/dashboard');
  return data;
}

// ── Users ──
export async function getAdminUsers(params?: { page?: number; pageSize?: number; role?: string }) {
  const { data } = await http.get('/api/v1/admin/users', { params });
  return data;
}

export async function updateUserRole(userId: number, role: string) {
  const { data } = await http.put(`/api/v1/admin/users/${userId}/role`, { role });
  return data;
}

export async function updateUserStatus(userId: number, isActive: boolean) {
  const { data } = await http.put(`/api/v1/admin/users/${userId}/status`, { isActive });
  return data;
}

// ── Orders ──
export async function getAdminOrders(params?: { page?: number; pageSize?: number; status?: number }) {
  const { data } = await http.get('/api/v1/admin/orders', { params });
  return data;
}

// ── Revenue ──
export async function getAdminRevenue(params?: { days?: number }) {
  const { data } = await http.get('/api/v1/admin/revenue', { params });
  return data;
}

// ── Activity Log ──
export async function getAdminActivity(params?: { count?: number; entityType?: string; userId?: number }) {
  const { data } = await http.get('/api/v1/admin/activity', { params });
  return data;
}

// ── Catalog ──
export async function updateCatalogBulkStatus(productIds: number[], isActive: boolean) {
  const { data } = await http.put('/api/v1/admin/catalog/bulk-status', { productIds, isActive });
  return data;
}

export async function updateCatalogBulkPrice(productIds: number[], percentageChange: number) {
  const { data } = await http.put('/api/v1/admin/catalog/bulk-price', { productIds, percentageChange });
  return data;
}

// ── Notifications ──
export async function getAdminNotificationsUnread(limit: number = 50) {
  const { data } = await http.get('/api/v1/admin/notifications/unread', { params: { limit } });
  return data;
}

export async function markNotificationAsRead(id: number) {
  const { data } = await http.put(`/api/v1/admin/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsAsRead() {
  const { data } = await http.put('/api/v1/admin/notifications/read-all');
  return data;
}
