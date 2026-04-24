import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts, getProductById, getCategories } from '../api/catalog.api';
import { ProductQuery } from '../../../shared/types/products';

export const catalogKeys = {
  products: (params?: ProductQuery) => ['products', params] as const,
  product: (id: number) => ['product', id] as const,
  categories: ['categories'] as const,
};

export function useProductsQuery(params: ProductQuery) {
  return useQuery({
    queryKey: catalogKeys.products(params),
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function useProductQuery(id: number) {
  return useQuery({
    queryKey: catalogKeys.product(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: catalogKeys.categories,
    queryFn: getCategories,
  });
}
