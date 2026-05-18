import React, { createContext, useContext } from "react";
import { useNotifications, AppNotification } from "@/hooks/useNotifications";

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  markAllRead: async () => {},
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const value = useNotifications();
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotificationsContext = () => useContext(NotificationsContext);
export type { AppNotification };
