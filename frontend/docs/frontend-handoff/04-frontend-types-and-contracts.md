# Frontend Types and Contracts

هذا الملف يعطيك TypeScript contracts مباشرة لتبدأ بها.

---

## 1) Shared

```ts
export type ApiMessage = {
  message?: string;
  Message?: string;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
};
```

---

## 2) Auth

```ts
export type AppRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: number;
  fullName: string;
  email: string;
  role: AppRole;
  token: string;
  expiresAtUtc: string;
};
```

---

## 3) Categories

```ts
export type Category = {
  id: number;
  name: string;
};

export type CreateCategoryRequest = {
  name: string;
};

export type UpdateCategoryRequest = {
  name: string;
};
```

---

## 4) Product Images

```ts
export type ProductImage = {
  id: number;
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
};

export type AddProductImageRequest = {
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type UpdateProductImageRequest = {
  imageUrl?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
};
```

---

## 5) Products

```ts
export type ProductStatusLabel = 'ACTIVE' | 'INACTIVE';

export type ProductListItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  minQuantity: number;
  status: ProductStatusLabel;
  categoryId: number;
  images: ProductImage[];
};

export type ProductDetails = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  minQuantity: number;
  status: ProductStatusLabel;
  categoryId: number;
  images: ProductImage[];
};

export type ProductQuery = {
  search?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
};

export type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  minQuantity: number;
  categoryId: number;
};

export type UpdateProductRequest = {
  name?: string;
  description?: string;
  price?: number;
  minQuantity?: number;
  status?: string;
  categoryId?: number;
};
```

---

## 6) Cart

```ts
export type CartItem = {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Cart = {
  id: number;
  status: 'ACTIVE' | 'CHECKED_OUT';
  items: CartItem[];
  subtotal: number;
};

export type AddCartItemRequest = {
  productId: number;
  quantity: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};
```

---

## 7) Enums returned as numbers

```ts
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
```

### Helpers
```ts
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
```

---

## 8) Orders

```ts
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
```

---

## 9) Payments

```ts
export type PaymentDetails = {
  paymentId: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionRef: string | null;
  paidAt: string | null;
  createdAt: string;
};

export type PayByCardRequest = {
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
};
```

---

## 10) Inventory

```ts
export type AdjustInventoryRequest = {
  quantityDelta?: number;
  minQuantity?: number;
};

export type AdjustInventoryResponse = {
  productId: number;
  newQuantity: number;
  newMinQuantity: number;
  movementId: number;
  movementReason: string;
};

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

export type InventoryMovementQuery = {
  productId?: number;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export type InventoryStatusItem = {
  productId: number;
  name: string;
  quantity: number;
  minQuantity: number;
  stockStatus: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK';
};

export type LowStockItem = InventoryStatusItem;
```

---

## 11) API modules contract

### Example for products API
```ts
export async function getProducts(params: ProductQuery) {
  const { data } = await http.get<PagedResult<ProductListItem>>('/api/v1/products', { params });
  return data;
}

export async function getProductById(productId: number) {
  const { data } = await http.get<ProductDetails>(`/api/v1/products/${productId}`);
  return data;
}
```

### Example for auth API
```ts
export async function login(payload: LoginRequest) {
  const { data } = await http.post<LoginResponse>('/api/v1/auth/login', payload);
  return data;
}
```

---

## 12) Standard query hooks contract

```ts
export function useProductsQuery(params: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
  });
}
```

```ts
export function useAddCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}
```
