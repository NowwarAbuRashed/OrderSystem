import { http } from '../../../app/api/http';
import { Category } from '../../../shared/types/categories';

export async function getManagerCategories() {
  const { data } = await http.get<Category[]>('/api/Categories');
  return data;
}

export async function getManagerCategoryById(id: number) {
  const { data } = await http.get<Category>(`/api/Categories/${id}`);
  return data;
}

export async function createManagerCategory(payload: { name: string }) {
  const { data } = await http.post('/api/ManagerCategories', payload);
  return data;
}

export async function updateManagerCategory(id: number, payload: { name: string }) {
  await http.put(`/api/ManagerCategories/${id}`, payload);
}

export async function deleteManagerCategory(id: number) {
  await http.delete(`/api/ManagerCategories/${id}`);
}
