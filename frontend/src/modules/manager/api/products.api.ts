import { http } from '../../../app/api/http';
import { PagedResult } from '../../../shared/types/common';
import { ProductListItem, ProductDetails, ProductQuery } from '../../../shared/types/products';

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  minQuantity: number;
  categoryId: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  minQuantity?: number;
  status?: string;
  categoryId?: number;
}

// Manager uses the public products endpoint for reading (it's AllowAnonymous)
export async function getManagerProducts(params: ProductQuery) {
  const { data } = await http.get<PagedResult<ProductListItem>>('/api/v1/products', { params });
  return data;
}

export async function getManagerProductById(id: number) {
  const { data } = await http.get<ProductDetails>(`/api/v1/products/${id}`);
  return data;
}

export async function createManagerProduct(payload: CreateProductRequest) {
  const { data } = await http.post<{ id: number }>('/api/v1/manager/products', payload);
  return data;
}

export async function updateManagerProduct(id: number, payload: UpdateProductRequest) {
  await http.patch(`/api/v1/manager/products/${id}`, payload);
}

export interface CreateProductImageRequest {
  productId: number;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export async function addProductImage(payload: CreateProductImageRequest) {
  const { imageUrl, altText, sortOrder, isPrimary } = payload;
  const { data } = await http.post(
    `/api/v1/manager/products/${payload.productId}/images`,
    { imageUrl, altText, sortOrder, isPrimary }
  );
  return data;
}

export async function deleteProductImage(imageId: number, productId: number) {
  await http.delete(`/api/v1/manager/products/${productId}/images/${imageId}`);
}

