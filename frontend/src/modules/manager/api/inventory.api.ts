import { http } from '../../../app/api/http';
import { InventoryMovement, InventoryAdjustmentRequest } from '../../../shared/types/inventory';

export async function adjustInventory(productId: number, payload: InventoryAdjustmentRequest) {
  await http.patch(`/api/v1/manager/products/${productId}/inventory`, payload);
}

export async function getInventoryHistory(productId: number) {
  const { data } = await http.get<{ items: InventoryMovement[], totalCount: number }>(`/api/v1/manager/inventory/movements`, {
    params: { productId }
  });
  return data.items;
}
