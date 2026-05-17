import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Check, Clock, Plus, User } from "lucide-react";

const Task = () => {
  useParams();
  const [newComment, setNewComment] = useState("");
  const [newTimeEntry, setNewTimeEntry] = useState({ hours: "", description: "" });

  const task = {
    title: "Implement user dashboard",
    description:
      "Build a comprehensive user dashboard with charts, statistics, and user activity feeds. This should include responsive design and dark mode support.",
    status: "In Progress",
    priority: "High",
    assignee: "Mike Johnson",
    project: "E-commerce Platform",
    dueDate: "2024-06-15",
    totalTimeTracked: "8h 45m",
  };

  const subtasks = [
    { id: 1, title: "Create dashboard layout", completed: true },
    { id: 2, title: "Implement charts component", completed: true },
    { id: 3, title: "Add user statistics", completed: false },
    { id: 4, title: "Implement activity feed", completed: false },
    { id: 5, title: "Add responsive design", completed: false },
  ];

  const timeEntries = [
    {
      id: 1,
      date: "2024-05-28",
      hours: "2h 30m",
      description: "Initial dashboard setup and layout",
    },
    {
      id: 2,
      date: "2024-05-27",
      hours: "3h 15m",
      description: "Implemented chart components using Recharts",
    },
    {
      id: 3,
      date: "2024-05-26",
      hours: "3h 0m",
      description: "Designed dashboard wireframes and component structure",
    },
    {
      id: 4,
      date: "2024-05-25",
      hours: "2h 45m",
      description: "Added user statistics and activity feed",
    },
    {
      id: 5,
      date: "2024-05-24",
      hours: "1h 30m",
      description: "Implemented responsive design using Tailwind CSS",
    },
  ];

  const comments = [
    {
      id: 1,
      author: "Sarah Miller",
      initials: "SM",
      date: "2024-05-28",
      content:
        "Great progress on the charts! The visualization looks really clean. Make sure to add proper accessibility labels.",
    },
    {
      id: 2,
      author: "Alex Brown",
      initials: "AB",
      date: "2024-05-27",
      content:
        "Can we also include a dark mode toggle in the dashboard? It would be a nice UX enhancement.",
    },
    {
      id: 3,
      author: "Mike Johnson",
      initials: "MJ",
      date: "2024-05-26",
      content:
        "Started working on this task. Planning to have the basic layout done by end of week.",
    },
  ];

  const getColor = (type, value) => {
    const colors = {
      priority: {
        High: "bg-red-100 text-red-800",
        Medium: "bg-yellow-100 text-yellow-800",
        Low: "bg-green-100 text-green-800",
      },
      status: {
        "In Progress": "bg-blue-100 text-blue-800",
        Review: "bg-yellow-100 text-yellow-800",
        Done: "bg-green-100 text-green-800",
      },
    };
    return colors[type][value] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex-grow bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Task Detail */}
          <div className="bg-white rounded shadow p-6">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                <p className="text-gray-600 text-sm">{task.description}</p>
              </div>
              <div className="space-x-2 text-xs">
                <span className={`px-2 py-1 rounded ${getColor("priority", task.priority)}`}>
                  {task.priority}
                </span>
                <span
                  className={`px-2 py-1 rounded whitespace-nowrap ${getColor("status", task.status)}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {task.assignee}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {task.dueDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {task.totalTimeTracked}
              </div>
              <div>Project: {task.project}</div>
            </div>
          </div>

          {/* Subtasks */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="font-semibold mb-4">
              Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </h3>
            <div className="space-y-2">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center gap-3 text-sm">
                  <div
                    className={`w-5 h-5 flex items-center justify-center border rounded ${st.completed ? "bg-green-500 text-white" : "border-gray-300"}`}
                  >
                    {st.completed && <Check className="w-3 h-3" />}
                  </div>
                  <span className={st.completed ? "line-through text-gray-400" : ""}>
                    {st.title}
                  </span>
                </div>
              ))}
              <button className="flex items-center text-sm text-blue-600 hover:underline mt-3">
                <Plus className="w-4 h-4 mr-1" /> Add Subtask
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                    {c.initials}
                  </div>
                  <div>
                    <div className="font-medium">
                      {c.author} <span className="text-gray-500 text-xs">{c.date}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{c.content}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-4 border-t">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                  You
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full border rounded px-3 py-2 text-sm mb-2"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded shadow p-6 text-sm">
            <h3 className="font-semibold mb-1">Time Tracking</h3>
            <p className="text-gray-500 mb-4">Total: {task.totalTimeTracked}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <input
                type="text"
                placeholder="2h 30m"
                value={newTimeEntry.hours}
                onChange={(e) => setNewTimeEntry({ ...newTimeEntry, hours: e.target.value })}
                className="border rounded px-2 py-1"
              />
              <button className="bg-blue-900 text-white px-3 py-1 rounded text-sm">Log Time</button>
            </div>
            <input
              type="text"
              placeholder="What did you work on?"
              value={newTimeEntry.description}
              onChange={(e) => setNewTimeEntry({ ...newTimeEntry, description: e.target.value })}
              className="w-full border rounded px-2 py-1 mb-4"
            />
            <hr className="my-4" />
            <h4 className="font-medium mb-2">Recent Entries</h4>
            <div className="space-y-2">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="bg-gray-50 p-2 rounded">
                  <div className="flex justify-between font-medium">
                    <span>{entry.hours}</span>
                    <span className="text-gray-500">{entry.date}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{entry.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded shadow p-6 text-sm space-y-3">
            <h3 className="font-semibold">Quick Actions</h3>
            {["Change Status", "Assign to Someone", "Set Due Date", "Change Priority"].map(
              (action) => (
                <button key={action} className="w-full border rounded px-3 py-2 hover:bg-gray-50">
                  {action}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
