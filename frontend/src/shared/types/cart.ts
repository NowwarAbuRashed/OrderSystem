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
