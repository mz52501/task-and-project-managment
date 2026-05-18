import { useEffect, useRef, useState } from "react";
import { createConsumer, Subscription } from "@rails/actioncable";

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

    fetch("http://localhost:3001/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: AppNotification[]) => {
        const list = Array.isArray(data) ? data : [];
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
    const token = localStorage.getItem("token");
    if (!token) return;

    const unread = notifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) =>
        fetch(`http://localhost:3001/notifications/${n.id}/mark_read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAllRead };
}
