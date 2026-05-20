import React from "react";
import { CheckCircle, Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuickStats as QuickStatsData } from "@/api/dashboard";

interface Props {
  data: QuickStatsData | null;
}

const QuickStats = ({ data }: Props) => {
  const stats = [
    {
      title: "Active Projects",
      value: data?.active_projects ?? "—",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Tasks Due Soon",
      value: data?.tasks_due_today ?? "—",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Completed Tasks",
      value: data?.completed_tasks ?? "—",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Team Members",
      value: data?.team_members ?? "—",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
