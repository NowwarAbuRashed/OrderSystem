import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../app/api/query-client';
import { getManagerCategories, getManagerCategoryById, createManagerCategory, updateManagerCategory, deleteManagerCategory } from '../api/categories.api';

export const managerCategoryKeys = {
  all: ['manager', 'categories'] as const,
  detail: (id: number) => ['manager', 'categories', id] as const,
};

export function useManagerCategoriesQuery() {
  return useQuery({
    queryKey: managerCategoryKeys.all,
    queryFn: getManagerCategories,
  });
}

export function useManagerCategoryQuery(id: number) {
  return useQuery({
    queryKey: managerCategoryKeys.detail(id),
    queryFn: () => getManagerCategoryById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: createManagerCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerCategoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; name: string }) => updateManagerCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: managerCategoryKeys.all });
      queryClient.invalidateQueries({ queryKey: managerCategoryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: deleteManagerCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerCategoryKeys.all });
    },
  });
}
