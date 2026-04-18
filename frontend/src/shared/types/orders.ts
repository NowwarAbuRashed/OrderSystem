export enum PaymentMethod {
  CASH = 0,
  CARD = 1,
}

export enum PaymentStatus {
  PENDING = 0,
  PAID = 1,
  FAILED = 2,
}

export enum OrderStatus {
  PROCESSING = 0,
  READY = 1,
  OUT_FOR_DELIVERY = 2,
  DELIVERED = 3,
}

export const orderStatusLabelMap: Record<OrderStatus, string> = {
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.READY]: 'Ready',
  [OrderStatus.OUT_FOR_DELIVERY]: 'Out for delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
};

export const paymentMethodLabelMap: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CARD]: 'Card',
};

export const paymentStatusLabelMap: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.FAILED]: 'Failed',
};

export type CheckoutRequest = {
  notes?: string;
  paymentMethod: PaymentMethod;
};

export type CheckoutResponse = {
  orderId: number;
  orderStatus: OrderStatus;
  paymentId: number;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  message: string;
};

export type OrderListItem = {
  orderId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  createdAt: string;
};

export type OrderItem = {
  orderItemId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderDetails = {
  orderId: number;
  customerId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  readyAt: string | null;
  outForDeliveryAt: string | null;
  deliveredAt: string | null;
  notes: string | null;
  items: OrderItem[];
};

export type OrderQuery = {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
};

export type OrderStatusChangeResponse = {
  orderId: number;
  status: OrderStatus;
  message: string;
};

export type OrderDeliveredResponse = {
  orderId: number;
  status: OrderStatus;
  deliveredAt: string;
  message: string;
};
