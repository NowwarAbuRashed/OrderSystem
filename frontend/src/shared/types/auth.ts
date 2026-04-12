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

export type LoginResponse = {
  userId: number;
  fullName: string;
  email: string;
  role: AppRole;
  token: string;
  expiresAtUtc: string;
};
