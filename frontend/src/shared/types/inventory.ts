export type InventoryMovement = {
  id: number;
  productId: number;
  productName: string;
  changeQty: number;
  reason: string;
  refOrderId: number | null;
  performedBy: number | null;
  createdAt: string;
};

export type InventoryAdjustmentRequest = {
  quantityDelta?: number;
  minQuantity?: number;
};

export type AdminInventoryStatusDto = {
  productId: number;
  name: string;
  quantity: number;
  minQuantity: number;
  stockStatus: string;
};
