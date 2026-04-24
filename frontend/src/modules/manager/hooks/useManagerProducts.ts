import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../app/api/query-client';
import { 
  getManagerProducts, 
  getManagerProductById, 
  createManagerProduct, 
  updateManagerProduct,
  addProductImage,
  deleteProductImage
} from '../api/products.api';
import { uploadImage } from '../api/upload.api';
import { ProductQuery } from '../../../shared/types/products';

export const managerProductKeys = {
  products: (params?: ProductQuery) => ['manager', 'products', params] as const,
  product: (id: number) => ['manager', 'products', id] as const,
};

export function useManagerProductsQuery(params: ProductQuery) {
  return useQuery({
    queryKey: managerProductKeys.products(params),
    queryFn: () => getManagerProducts(params),
  });
}

export function useManagerProductQuery(id: number) {
  return useQuery({
    queryKey: managerProductKeys.product(id),
    queryFn: () => getManagerProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: createManagerProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerProductKeys.products() });
    },
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Parameters<typeof updateManagerProduct>[1]) => updateManagerProduct(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: managerProductKeys.products() });
      queryClient.invalidateQueries({ queryKey: managerProductKeys.product(variables.id) });
    },
  });
}

export function useAddProductImage() {
  return useMutation({
    mutationFn: addProductImage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: managerProductKeys.product(variables.productId) });
    },
  });
}

export function useDeleteProductImage() {
  return useMutation({
    mutationFn: ({ imageId, productId }: { imageId: number, productId: number }) => deleteProductImage(imageId, productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: managerProductKeys.product(variables.productId) });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
  });
}
