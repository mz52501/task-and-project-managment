import { User } from "@/types";

export const useAuth = () => {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  const isAuthenticated = !!token && !!user;

  const saveAuth = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return { user, token, isAuthenticated, saveAuth, clearAuth };
};
