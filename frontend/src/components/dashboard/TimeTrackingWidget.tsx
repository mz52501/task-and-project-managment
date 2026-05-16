import React, { useState } from "react";
import { Timer, Play, Pause, Square } from "lucide-react";

const TimeTrackingWidget = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState("02:34:12");

  const todayTotal = "6h 45m";
  const weekTotal = "32h 15m";

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center mb-2">
        <Timer className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Time Tracking</h2>
      </div>

      {/* Current Timer Display */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-mono font-bold text-gray-900 mb-2">{currentTime}</div>
        <p className="text-sm text-gray-600 mb-3">Working on: User Authentication</p>
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsRunning(false)}
                className="flex items-center px-3 py-1 border text-sm rounded hover:bg-gray-100"
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setCurrentTime("00:00:00");
                }}
                className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      {/* Time Summary */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Today's Total</span>
          <span className="font-semibold">{todayTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">This Week</span>
          <span className="font-semibold">{weekTotal}</span>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Entries</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">UI Components</span>
            <span className="font-medium">1h 30m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bug Fixes</span>
            <span className="font-medium">45m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Code Review</span>
            <span className="font-medium">30m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingWidget;
