import React, { createContext, useContext } from "react";
import { useNotifications, AppNotification } from "@/hooks/useNotifications";

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  markAllRead: async () => {},
  markRead: async () => {},
  deleteNotification: async () => {},
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const value = useNotifications();
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export const useNotificationsContext = () => useContext(NotificationsContext);
export type { AppNotification };
