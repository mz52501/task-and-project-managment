import { Outlet, Link } from "react-router-dom";
import { Bell, Zap } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppSidebar } from "./AppSidebar";
import { useNotificationsContext, AppNotification } from "@/context/NotificationsContext";
import { CheckCircle2, MessageSquare, UserPlus, Clock, AlertCircle } from "lucide-react";
import React from "react";

const iconMap: Record<string, React.ElementType> = {
  comment: MessageSquare,
  assignment: UserPlus,
  deadline: Clock,
  mention: AlertCircle,
  task: CheckCircle2,
};

const colorMap: Record<string, string> = {
  comment: "bg-blue-100 text-blue-700",
  assignment: "bg-purple-100 text-purple-700",
  deadline: "bg-orange-100 text-orange-700",
  mention: "bg-red-100 text-red-700",
  task: "bg-green-100 text-green-700",
};

function inferType(message: string): string {
  if (message.includes("comment")) return "comment";
  if (message.includes("assigned") || message.includes("added")) return "assignment";
  if (message.includes("due") || message.includes("deadline")) return "deadline";
  if (message.includes("mentioned")) return "mention";
  return "task";
}

function NotificationRow({ n }: { n: AppNotification }) {
  const type = inferType(n.message);
  const Icon = iconMap[type];
  const colorClass = colorMap[type];
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex-none flex items-center justify-center ${colorClass}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-snug line-clamp-2">{n.message}</p>
        <p className="text-xs text-gray-400 mt-0.5">{new Date(n.created_at).toLocaleString()}</p>
      </div>
      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 flex-none mt-1.5" />}
    </div>
  );
}

export default function AppLayout() {
  const { unreadCount, notifications, markAllRead } = useNotificationsContext();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-18 flex items-center justify-between border-b border-gray-200 bg-white px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Link to="/" className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Zap className="h-4 w-4" />
                </span>
                <span className="text-lg font-bold text-gray-900">HyperFlow</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm text-gray-900">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-blue-600 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => <NotificationRow key={n.id} n={n} />)
                    )}
                  </div>
                  <Link
                    to="/notifications"
                    className="border-t flex items-center justify-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    View all notifications
                  </Link>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
