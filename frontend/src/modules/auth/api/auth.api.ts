import { http } from '../../../app/api/http';
import { LoginRequest, LoginResponse, RegisterRequest, ProfileResponse, UpdateProfileRequest, ChangePasswordRequest } from '../../../shared/types/auth';

export async function loginApi(payload: LoginRequest) {
  const { data } = await http.post<LoginResponse>('/api/v1/auth/login', payload);
  return data;
}

export async function registerApi(payload: RegisterRequest) {
  const { data } = await http.post<LoginResponse>('/api/v1/auth/register', payload);
  return data;
}

export async function getProfileApi() {
  const { data } = await http.get<ProfileResponse>('/api/v1/auth/profile');
  return data;
}

export async function updateProfileApi(payload: UpdateProfileRequest) {
  const { data } = await http.put<ProfileResponse>('/api/v1/auth/profile', payload);
  return data;
}

export async function changePasswordApi(payload: ChangePasswordRequest) {
  const { data } = await http.put<{ message: string }>('/api/v1/auth/change-password', payload);
  return data;
}
