import React from "react";
import { Link } from "react-router-dom";
import { Clock, Plus, Timer, Calendar, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import QuickStats from "../components/dashboard/QuickStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import TodaysFocus from "../components/dashboard/TodaysFocus";
import ProjectSnapshots from "../components/dashboard/ProjectSnapshots";
import TimeTrackingWidget from "../components/dashboard/TimeTrackingWidget";

const Dashboard = () => {
  return (
    <div className="flex-grow bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>

        <QuickStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <TodaysFocus />
            <ProjectSnapshots />
            <RecentActivity />
          </div>

          <div className="space-y-6">
            <TimeTrackingWidget />

            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <Link
                  to="/new-task"
                  className="flex items-center w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create New Task
                </Link>
                <button className="flex items-center w-full px-4 py-2 rounded border hover:bg-gray-50 text-sm">
                  <Timer className="w-4 h-4 mr-2" /> Start Timer
                </button>
                <button className="flex items-center w-full px-4 py-2 rounded border hover:bg-gray-50 text-sm">
                  <Clock className="w-4 h-4 mr-2" /> Log Time
                </button>
                <Link
                  to="/projects"
                  className="flex items-center w-full px-4 py-2 rounded border hover:bg-gray-50 text-sm"
                >
                  <TrendingUp className="w-4 h-4 mr-2" /> View All Projects
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center text-base">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" /> Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-sm">
                {[
                  ["10:00 AM", "Team Standup"],
                  ["2:00 PM", "Project Review"],
                  ["4:30 PM", "Client Call"],
                ].map(([time, event]) => (
                  <div key={time} className="flex justify-between">
                    <span className="text-gray-600">{time}</span>
                    <span className="font-medium">{event}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
