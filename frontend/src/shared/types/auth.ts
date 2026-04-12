export type AppRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

export type CurrentUser = {
  userId: number;
  fullName: string;
  email: string;
  role: AppRole;
  token: string;
  expiresAtUtc: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: number;
  fullName: string;
  email: string;
  role: AppRole;
  token: string;
  expiresAtUtc: string;
};

export type ProfileResponse = {
  userId: number;
  fullName: string;
  email: string;
  role: string;
};

export type UpdateProfileRequest = {
  fullName: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
