import { User } from "@/types";

export const useAuth = () => {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  const isAuthenticated = !!token && !!user;

  const saveAuth = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (user.current_workspace_id) {
      localStorage.setItem("current_workspace_id", user.current_workspace_id);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("current_workspace_id");
  };

  return { user, token, isAuthenticated, saveAuth, clearAuth };
};
