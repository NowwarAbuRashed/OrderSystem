import { http } from '../../../app/api/http';
import { LoginRequest, LoginResponse } from '../../../shared/types/auth';

export async function loginApi(payload: LoginRequest) {
  const { data } = await http.post<LoginResponse>('/api/v1/auth/login', payload);
  return data;
}
