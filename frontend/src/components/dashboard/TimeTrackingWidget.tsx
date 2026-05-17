import React, { useState } from "react";
import { Timer, Play, Pause, Square } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TimeTrackingWidget = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState("02:34:12");

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center text-base">
          <Timer className="w-5 h-5 text-blue-600 mr-2" />
          Time Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono font-bold text-gray-900 mb-1">{currentTime}</div>
          <p className="text-sm text-gray-600 mb-3">Working on: User Authentication</p>
          <div className="flex justify-center gap-2">
            {!isRunning ? (
              <button
                onClick={() => setIsRunning(true)}
                className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-1" /> Start
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsRunning(false)}
                  className="flex items-center px-3 py-1 border text-sm rounded hover:bg-gray-100"
                >
                  <Pause className="w-4 h-4 mr-1" /> Pause
                </button>
                <button
                  onClick={() => { setIsRunning(false); setCurrentTime("00:00:00"); }}
                  className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  <Square className="w-4 h-4 mr-1" /> Stop
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Today's Total</span>
            <span className="font-semibold">6h 45m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This Week</span>
            <span className="font-semibold">32h 15m</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Recent Entries</h3>
          <div className="space-y-2 text-sm">
            {[["UI Components", "1h 30m"], ["Bug Fixes", "45m"], ["Code Review", "30m"]].map(([label, time]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTrackingWidget;
