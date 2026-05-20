import React from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TodayFocusTask } from "@/api/dashboard";

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

interface Props {
  tasks: TodayFocusTask[];
}

const TodaysFocus = ({ tasks }: Props) => {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center text-base">
          <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
          Today's Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No upcoming tasks</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span className="truncate">{task.project_name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">{task.due_date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysFocus;
