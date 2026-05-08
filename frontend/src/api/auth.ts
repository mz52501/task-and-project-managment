import client from "./client";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>("/auth/register", data);
  return response.data;
};
