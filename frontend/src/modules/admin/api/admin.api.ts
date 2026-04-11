import { http } from '../../../app/api/http';
import { PagedResult } from '../../../shared/types/common';
import { AdminInventoryStatusDto } from '../../../shared/types/inventory';

export async function getAdminInventoryStatus() {
  const { data } = await http.get<PagedResult<AdminInventoryStatusDto> | any>('/api/v1/admin/inventory/status');
  return data.items || data;
}

export async function getAdminLowStock() {
  const { data } = await http.get<PagedResult<AdminInventoryStatusDto> | any>('/api/v1/admin/inventory/low-stock');
  return data.items || data;
}
