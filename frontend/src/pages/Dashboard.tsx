import React, { useEffect, useState } from "react";
import QuickStats from "../components/dashboard/QuickStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import TodaysFocus from "../components/dashboard/TodaysFocus";
import ProjectSnapshots from "../components/dashboard/ProjectSnapshots";
import TimeTrackingWidget from "../components/dashboard/TimeTrackingWidget";
import WeeklyTimeChart from "../components/dashboard/WeeklyTimeChart";
import { getDashboard, DashboardData } from "@/api/dashboard";
import { useWorkspace } from "@/context/WorkspaceContext";

const Dashboard = () => {
  const { currentWorkspace } = useWorkspace();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!currentWorkspace) return;
    getDashboard(currentWorkspace.id)
      .then(setData)
      .catch(() => {});
  }, [currentWorkspace?.id]);

  return (
    <div className="flex-grow bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>

        <QuickStats data={data?.stats ?? null} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <TodaysFocus tasks={data?.today_focus ?? []} />
            <ProjectSnapshots snapshots={data?.project_snapshots ?? []} />
            <RecentActivity />
          </div>

          <div className="space-y-6">
            <TimeTrackingWidget />
            <WeeklyTimeChart days={data?.weekly_time ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
