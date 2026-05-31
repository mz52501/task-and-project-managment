import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MailOpen } from "lucide-react";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { NotificationItem } from "@/components/notifications/NotificationItem";

const Notifications = () => {
  const { notifications, unreadCount, markAllRead, markRead, deleteNotification } = useNotificationsContext();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "read") return n.read;
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllRead}>
              <MailOpen className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs
          value={activeFilter}
          onValueChange={(v) => setActiveFilter(v as "all" | "unread" | "read")}
          className="mb-6"
        >
          <TabsList className="h-11 px-1.5 gap-1">
            <TabsTrigger value="all" className="flex items-center gap-2 px-4 text-sm">
              All
              <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 leading-none">
                {notifications.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2 px-4 text-sm">
              Unread
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 leading-none">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read" className="px-4 text-sm">
              Read
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Mail className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">
                {activeFilter === "unread"
                  ? "No unread notifications"
                  : activeFilter === "read"
                    ? "No read notifications"
                    : "No notifications yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                variant="card"
                onMarkRead={markRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
