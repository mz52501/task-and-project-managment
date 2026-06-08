import React from "react";
import {
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Clock,
  AlertCircle,
  Building2,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { AppNotification } from "@/context/NotificationsContext";
import { NotificationType } from "@/types/notification";

const iconMap: Record<NotificationType, React.ElementType> = {
  task_assigned: UserPlus,
  task_status_changed: RefreshCw,
  task_due_soon: Clock,
  task_overdue: AlertCircle,
  task_completed: Trophy,
  comment_added: MessageSquare,
  mention: AlertCircle,
  workspace_invite: Building2,
  workspace_role_changed: Building2,
};

const colorMap: Record<NotificationType, string> = {
  task_assigned: "bg-purple-100 text-purple-700",
  task_status_changed: "bg-blue-100 text-blue-700",
  task_due_soon: "bg-orange-100 text-orange-700",
  task_overdue: "bg-red-100 text-red-700",
  task_completed: "bg-green-100 text-green-700",
  comment_added: "bg-blue-100 text-blue-700",
  mention: "bg-red-100 text-red-700",
  workspace_invite: "bg-indigo-100 text-indigo-700",
  workspace_role_changed: "bg-indigo-100 text-indigo-700",
};

interface Props {
  notification: AppNotification;
  variant?: "row" | "card";
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationItem({
  notification: n,
  variant = "row",
  onMarkRead,
  onDelete,
}: Props) {
  const Icon = iconMap[n.notification_type] ?? CheckCircle2;
  const colorClass = colorMap[n.notification_type] ?? "bg-gray-100 text-gray-700";

  if (variant === "row") {
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

  return (
    <div
      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${n.read ? "bg-white border-gray-200" : "bg-blue-50/50 border-blue-200"}`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{n.message}</p>
          {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!n.read && onMarkRead && (
          <button
            onClick={() => onMarkRead(n.id)}
            className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Mark as read"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(n.id)}
            className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
