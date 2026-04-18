import { http } from '../../../app/api/http';

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await http.post<{ url: string }>('/api/v1/manager/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}
