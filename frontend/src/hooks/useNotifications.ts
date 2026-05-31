import { useEffect, useRef, useState } from "react";
import { createConsumer, Subscription } from "@rails/actioncable";
import client from "@/api/client";

export interface AppNotification {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const cable = createConsumer(`ws://localhost:3001/cable?token=${token}`);

    subscriptionRef.current = cable.subscriptions.create("NotificationsChannel", {
      received(data: AppNotification) {
        setNotifications((prev) => [data, ...prev]);
        if (!data.read) setUnreadCount((c) => c + 1);
      },
    });

    client
      .get<AppNotification[]>("/notifications")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read).length);
      })
      .catch(() => {});

    return () => {
      subscriptionRef.current?.unsubscribe();
      cable.disconnect();
    };
  }, []);

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => client.patch(`/notifications/${n.id}/mark_read`)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markRead = async (id: string) => {
    await client.patch(`/notifications/${id}/mark_read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const deleteNotification = async (id: string) => {
    await client.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => {
      const wasUnread = notifications.find((n) => n.id === id && !n.read);
      return wasUnread ? Math.max(0, prev - 1) : prev;
    });
  };

  return { notifications, unreadCount, markAllRead, markRead, deleteNotification };
}
