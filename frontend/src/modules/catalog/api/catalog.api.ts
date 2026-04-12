import { http } from '../../../app/api/http';
import { PagedResult } from '../../../shared/types/common';
import { ProductQuery, ProductListItem, ProductDetails } from '../../../shared/types/products';
import { Category } from '../../../shared/types/categories';

export async function getProducts(params: ProductQuery) {
  const { data } = await http.get<PagedResult<ProductListItem>>('/api/v1/products', { params });
  return data;
}

export async function getProductById(productId: number) {
  const { data } = await http.get<ProductDetails>(`/api/v1/products/${productId}`);
  return data;
}

export async function getCategories() {
  const { data } = await http.get<Category[]>('/api/Categories');
  return data;
}
