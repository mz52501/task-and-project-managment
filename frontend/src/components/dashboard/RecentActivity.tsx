import React from "react";
import { CheckCircle, MessageSquare, Clock, User, Folder } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useActivityLogs } from "@/hooks/queries/useDashboard";
import type { ActivityLogEntry } from "@/api/dashboard";

const iconMap: Record<string, React.ElementType> = {
  created: CheckCircle,
  updated: CheckCircle,
  commented: MessageSquare,
  time_logged: Clock,
  assigned: User,
  completed: CheckCircle,
};

const colorMap: Record<string, string> = {
  created: "text-blue-600",
  updated: "text-gray-500",
  commented: "text-blue-600",
  time_logged: "text-purple-600",
  assigned: "text-orange-600",
  completed: "text-green-600",
};

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const RecentActivity = () => {
  const { data: activities = [], isLoading: loading } = useActivityLogs();

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center text-base">
          <Clock className="w-5 h-5 text-blue-600 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No recent activity</p>
        ) : (
          <div className="h-64 overflow-y-auto space-y-4 pr-2">
            {activities.map((activity) => {
              const Icon = iconMap[activity.activity_type] ?? Folder;
              const color = colorMap[activity.activity_type] ?? "text-gray-500";
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.summary}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {relativeTime(activity.occurred_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
