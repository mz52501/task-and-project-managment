import React from "react";
import { BarChart2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WeeklyTimeDay } from "@/api/dashboard";

interface Props {
  days: WeeklyTimeDay[];
}

const WeeklyTimeChart = ({ days }: Props) => {
  const today = new Date().toISOString().split("T")[0];
  const maxMinutes = Math.max(...days.map((d) => d.minutes), 1);
  const totalHours = (days.reduce((s, d) => s + d.minutes, 0) / 60).toFixed(1);

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center text-base">
          <BarChart2 className="w-5 h-5 text-blue-600 mr-2" />
          This Week's Time
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {days.map((d) => {
            const isToday = d.date === today;
            const isFuture = d.date > today;
            const hours = (d.minutes / 60).toFixed(1);
            const barWidth = d.minutes > 0 ? Math.round((d.minutes / maxMinutes) * 100) : 0;
            return (
              <div key={d.date} className="flex items-center gap-3">
                <span
                  className={`text-xs w-7 shrink-0 ${isToday ? "font-semibold text-blue-600" : "text-gray-500"}`}
                >
                  {d.day}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  {barWidth > 0 && (
                    <div
                      className={`h-2 rounded-full ${isToday ? "bg-blue-500" : isFuture ? "bg-gray-300" : "bg-gray-400"}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  )}
                </div>
                <span
                  className={`text-xs w-8 text-right shrink-0 ${isFuture && d.minutes === 0 ? "text-gray-300" : "text-gray-600"}`}
                >
                  {d.minutes > 0 ? `${hours}h` : "—"}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t flex justify-between text-sm">
          <span className="text-gray-500">Total this week</span>
          <span className="font-semibold text-gray-900">{totalHours}h</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyTimeChart;
