import { Outlet, Link } from "react-router-dom";
import { Bell, Zap } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppSidebar } from "./AppSidebar";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { NotificationItem } from "@/components/notifications/NotificationItem";

export default function AppLayout() {
  const { unreadCount, notifications, markAllRead, latestNotification, dismissLatest } = useNotificationsContext();

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
              <div className="relative">
                {latestNotification && (
                  <div
                    className="absolute right-0 top-11 z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={dismissLatest}
                  >
                    <div className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 bg-white border-l border-t border-gray-200" />
                    <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                      <NotificationItem notification={latestNotification} variant="row" />
                    </div>
                  </div>
                )}
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
                      notifications
                        .slice(0, 5)
                        .map((n) => <NotificationItem key={n.id} notification={n} variant="row" />)
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
