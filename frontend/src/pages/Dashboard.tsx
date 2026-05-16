import React from "react";
import { Link } from "react-router-dom";
import { Clock, Plus, Timer, CheckCircle, Users, Calendar, TrendingUp } from "lucide-react";

import QuickStats from "../components/dashboard/QuickStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import TodaysFocus from "../components/dashboard/TodaysFocus";
import ProjectSnapshots from "../components/dashboard/ProjectSnapshots";
import TimeTrackingWidget from "../components/dashboard/TimeTrackingWidget";

const Dashboard = () => {
  return (
    <div className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            <TodaysFocus />
            <ProjectSnapshots />
            <RecentActivity />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TimeTrackingWidget />

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/new-task"
                  className="block w-full text-left px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2 inline" /> Create New Task
                </Link>
                <button className="block w-full text-left px-4 py-2 rounded border hover:bg-gray-50">
                  <Timer className="w-4 h-4 mr-2 inline" /> Start Timer
                </button>
                <button className="block w-full text-left px-4 py-2 rounded border hover:bg-gray-50">
                  <Clock className="w-4 h-4 mr-2 inline" /> Log Time
                </button>
                <Link
                  to="/projects"
                  className="block w-full text-left px-4 py-2 rounded border hover:bg-gray-50"
                >
                  <TrendingUp className="w-4 h-4 mr-2 inline" /> View All Projects
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" /> Today's Schedule
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">10:00 AM</span>
                  <span className="font-medium">Team Standup</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2:00 PM</span>
                  <span className="font-medium">Project Review</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">4:30 PM</span>
                  <span className="font-medium">Client Call</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
