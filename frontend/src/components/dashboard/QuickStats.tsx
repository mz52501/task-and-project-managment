import React from "react";
import { CheckCircle, Clock, Users, TrendingUp } from "lucide-react";

const QuickStats = () => {
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this week",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Tasks Due Today",
      value: "5",
      change: "3 completed",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Completed Tasks",
      value: "28",
      change: "+4 today",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Team Members",
      value: "8",
      change: "2 online now",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
