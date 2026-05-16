import React from "react";
import { CheckCircle, Clock, Play } from "lucide-react";

const TodaysFocus = () => {
  const tasks = [
    {
      id: 1,
      title: "Complete user authentication flow",
      project: "TaskFlow App",
      priority: "high",
      dueTime: "2:00 PM",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Review design mockups",
      project: "Website Redesign",
      priority: "medium",
      dueTime: "4:30 PM",
      status: "pending",
    },
    {
      id: 3,
      title: "Update project documentation",
      project: "API Development",
      priority: "low",
      dueTime: "End of day",
      status: "pending",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Today's Focus</h2>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{task.title}</h4>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>{task.project}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.dueTime}
                </span>
              </div>
            </div>
            <div className="ml-4">
              {task.status === "in-progress" ? (
                <button className="flex items-center px-3 py-1 border rounded text-sm hover:bg-gray-100">
                  <Play className="w-3 h-3 mr-1" />
                  Continue
                </button>
              ) : (
                <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysFocus;
