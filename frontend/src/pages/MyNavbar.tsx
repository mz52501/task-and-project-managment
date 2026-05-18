import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { RxDropdownMenu } from "react-icons/rx";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, MessageSquare, UserPlus, Clock, AlertCircle } from "lucide-react";
import { useNotificationsContext, AppNotification } from "@/context/NotificationsContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
    <div className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex-none flex items-center justify-center ${colorClass}`}>
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

export function MyNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, notifications, markAllRead } = useNotificationsContext();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        topBarRef.current &&
        !topBarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col h-screen">
      <div
        ref={topBarRef}
        className="h-16 w-full flex-none bg-blue-600 flex justify-between items-center px-4 shadow-md"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-5xl hover:scale-110 transition-transform duration-200 cursor-pointer"
        >
          <RxDropdownMenu />
        </button>

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger className="relative text-white cursor-pointer hover:opacity-80 active:scale-90 transition-all duration-150">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-semibold text-sm text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
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
              <Link to="/notifications" className="border-t flex items-center justify-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer">
                View all notifications
              </Link>
            </PopoverContent>
          </Popover>
          <Link to="/" className="flex items-center gap-3">
            <p className="text-3xl font-bold text-white">HyperFlow</p>
            <div className="w-16 h-16 rounded-full overflow-hidden py-2">
              <img className="object-cover w-full h-full" src="/HyperFlow-white.png" alt="logo" />
            </div>
          </Link>
        </div>
      </div>

      <motion.div
        ref={sidebarRef}
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full w-52 bg-white backdrop-blur-sm bg-opacity-70 flex flex-col gap-6 items-center rounded-sm shadow-md shadow-gray-400 fixed top-16 left-0 z-10"
      >
        <div className="flex flex-col items-center mt-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
            <img className="object-cover w-full h-full" src="/head.jpg" alt="Profile" />
          </div>
          <p className="text-blue-800 font-semibold text-lg mt-2">Marko Žura</p>
        </div>

        <div className="flex flex-col gap-5 w-full px-4">
          {["Home", "Projects", "Tasks", "Profile", "Notifications"].map((item) => (
            <Link
              to={item === "Home" ? "/" : "/" + item.toLowerCase()}
              key={item}
              onClick={() => setIsOpen(false)}
              className="bg-white w-full flex justify-center py-2 border-2 border-blue-700 rounded-md text-blue-800 font-semibold shadow-lg transform transition-transform duration-200 hover:scale-110 hover:bg-gray-50"
            >
              {item}
            </Link>
          ))}
        </div>
      </motion.div>

      <Outlet />
    </div>
  );
}
