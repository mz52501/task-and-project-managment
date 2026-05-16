export type UserRole = "admin" | "developer" | "client";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
