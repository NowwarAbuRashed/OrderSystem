export type ProductStatusLabel = 'ACTIVE' | 'INACTIVE';

export type ProductImage = {
  id: number;
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
};

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
  cost?: number;
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
