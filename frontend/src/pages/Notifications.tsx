import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Check,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Clock,
  AlertCircle,
  Trash2,
  MailOpen,
  Mail,
} from "lucide-react";
import { useNotificationsContext } from "@/context/NotificationsContext";

type NotificationType = "task" | "comment" | "assignment" | "deadline" | "mention";

const iconMap: Record<NotificationType, React.ElementType> = {
  task: CheckCircle2,
  comment: MessageSquare,
  assignment: UserPlus,
  deadline: Clock,
  mention: AlertCircle,
};

const colorMap: Record<NotificationType, string> = {
  task: "bg-green-100 text-green-700",
  comment: "bg-blue-100 text-blue-700",
  assignment: "bg-purple-100 text-purple-700",
  deadline: "bg-orange-100 text-orange-700",
  mention: "bg-red-100 text-red-700",
};

function inferType(message: string): NotificationType {
  if (message.includes("comment")) return "comment";
  if (message.includes("assigned") || message.includes("added")) return "assignment";
  if (message.includes("due") || message.includes("deadline")) return "deadline";
  if (message.includes("mentioned")) return "mention";
  return "task";
}

const Notifications = () => {
  const { notifications, unreadCount, markAllRead } = useNotificationsContext();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">("all");
  const [deleted, setDeleted] = useState<Set<string>>(new Set());

  const visible = notifications.filter((n) => !deleted.has(n.id));
  const filtered = visible.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "read") return n.read;
    return true;
  });

  const deleteNotification = (id: string) => {
    setDeleted((prev) => new Set(prev).add(id));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <MailOpen className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filters */}
        <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as "all" | "unread" | "read")} className="mb-6">
          <TabsList className="h-11 px-1.5 gap-1">
            <TabsTrigger value="all" className="flex items-center gap-2 px-4 text-sm">
              All
              <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 leading-none">{visible.length}</span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2 px-4 text-sm">
              Unread
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 leading-none">{unreadCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read" className="px-4 text-sm">Read</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* List */}
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
            {filtered.map((n) => {
              const type = inferType(n.message);
              const Icon = iconMap[type];
              const colorClass = colorMap[type];

              return (
                <Card
                  key={n.id}
                  className={`group transition-all hover:shadow-sm ${
                    n.read ? "bg-white" : "bg-blue-50/50 border-blue-200"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-gray-900">
                                {n.message}
                              </h3>
                              {!n.read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">
                              {new Date(n.created_at).toLocaleString()}
                            </p>
                          </div>
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
                              ?
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-blue-600"
                            onClick={markAllRead}
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => deleteNotification(n.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
