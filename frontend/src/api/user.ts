import client from "./client";

export interface Me {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  member_since: string;
  projects_count: number;
  tasks_completed: number;
  hours_logged: number;
}

export interface UserSummary {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export const getUsers = async (): Promise<UserSummary[]> => {
  const res = await client.get<UserSummary[]>("/users");
  return res.data;
};

export const getMe = async (): Promise<Me> => {
  const res = await client.get<Me>("/me");
  return res.data;
};

export const updateMe = async (data: Partial<Pick<Me, "first_name" | "last_name" | "email">>): Promise<Me> => {
  const res = await client.patch<Me>("/me", data);
  return res.data;
};
