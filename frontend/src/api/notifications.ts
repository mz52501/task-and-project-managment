import client from "./client";
import { Notification } from "@/types";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await client.get<Notification[]>("/notifications");
  return response.data;
};

export const markNotificationRead = async (id: number): Promise<Notification> => {
  const response = await client.patch<Notification>(`/notifications/${id}/mark_read`);
  return response.data;
};
