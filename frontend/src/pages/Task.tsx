import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, User, Calendar } from "lucide-react";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, statusColors, priorityColors } from "@/constants/task";
import { SubtasksCard } from "@/components/task/SubtasksCard";
import { CommentsCard } from "@/components/task/CommentsCard";
import { EstimateCard } from "@/components/task/EstimateCard";
import { TimeTrackingCard } from "@/components/task/TimeTrackingCard";

const task = {
  title: "Implement user dashboard",
  description: "Build a comprehensive user dashboard with charts, statistics, and user activity feeds. This should include responsive design and dark mode support.",
  assignee: "Mike Johnson",
  project: "E-commerce Platform",
  projectId: "1",
  dueDate: "2024-06-15",
  totalTimeTracked: "8h 45m",
};

const Task = () => {
  useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("In Progress");
  const [priority, setPriority] = useState("High");
  const [estimate, setEstimate] = useState("12h 0m");
  const [editingEstimate, setEditingEstimate] = useState(false);
  const [estimateDraft, setEstimateDraft] = useState(estimate);

  function saveEstimate() {
    setEstimate(estimateDraft);
    setEditingEstimate(false);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Task header */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">{task.title}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" /> {task.assignee}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" /> {task.dueDate}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    {task.totalTimeTracked}
                    {estimate && <span className="text-gray-400">/ {estimate}</span>}
                  </div>
                  <div className="text-gray-600">
                    Project:{" "}
                    <button
                      onClick={() => navigate(`/projects/${task.projectId}`)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {task.project}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className={`h-8 w-36 text-sm font-medium border-0 cursor-pointer ${statusColors[status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s} className="cursor-pointer">
                            <span className={`w-full px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[s]}`}>{s}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</span>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className={`h-8 w-28 text-sm font-medium border-0 cursor-pointer ${priorityColors[priority]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((p) => (
                          <SelectItem key={p} value={p} className="cursor-pointer">
                            <span className={`w-full px-2 py-0.5 rounded-md text-xs font-medium ${priorityColors[p]}`}>{p}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SubtasksCard />
            <CommentsCard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EstimateCard
              estimate={estimate}
              totalTimeTracked={task.totalTimeTracked}
              editingEstimate={editingEstimate}
              estimateDraft={estimateDraft}
              setEstimateDraft={setEstimateDraft}
              setEditingEstimate={setEditingEstimate}
              saveEstimate={saveEstimate}
            />
            <TimeTrackingCard />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Task;
