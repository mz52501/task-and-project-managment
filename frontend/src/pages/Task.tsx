import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, User, Calendar, Loader2, Play, Square, Folder } from "lucide-react";
import { PRIORITY_OPTIONS, priorityColors, stageBadgeStyle } from "@/constants/task";
import { SubtasksCard } from "@/components/task/SubtasksCard";
import { CommentsCard } from "@/components/task/CommentsCard";
import { EstimateCard } from "@/components/task/EstimateCard";
import { TimeTrackingCard } from "@/components/task/TimeTrackingCard";
import { getTask, updateTask } from "@/api/tasks";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useTaskTimeEntries, minutesToDisplay, parseHoursInput } from "@/hooks/useTimeEntries";
import { useTimer } from "@/context/TimerContext";
import { toast } from "sonner";

interface Stage {
  id: string;
  name: string;
  position: number;
}

interface FullTask {
  id: string;
  title: string;
  description?: string;
  priority: string;
  due_date?: string;
  project_id: string;
  project_name: string;
  workflow_stage_id: string;
  stage_name: string;
  stages: Stage[];
  assignees: { id: string; name: string; initials: string }[];
  estimated_minutes?: number | null;
  time_tracked: string | null;
  created_by_name: string;
}

const Task = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const { isRunning, taskId: runningTaskId, elapsed, start, stop } = useTimer();

  const [task, setTask] = useState<FullTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [stageId, setStageId] = useState("");
  const [priority, setPriority] = useState("High");
  const [estimate, setEstimate] = useState("");

  const timeTracking = useTaskTimeEntries(id ?? "");
  const { totalTracked } = timeTracking;
  const isThisTaskRunning = isRunning && runningTaskId === id;

  useEffect(() => {
    if (!id || !currentWorkspace) return;
    getTask(currentWorkspace.id, id)
      .then((data) => {
        const t = data as unknown as FullTask;
        setTask(t);
        setStageId(t.workflow_stage_id);
        setPriority(t.priority.charAt(0).toUpperCase() + t.priority.slice(1));
        if (t.estimated_minutes) setEstimate(minutesToDisplay(t.estimated_minutes));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, currentWorkspace?.id]);

  function handleStatusChange(val: string) {
    setStageId(val);
    if (id && currentWorkspace)
      updateTask(currentWorkspace.id, id, { workflow_stage_id: val }).catch(() =>
        toast.error("Failed to update status")
      );
  }

  function handlePriorityChange(val: string) {
    setPriority(val);
    if (id && currentWorkspace)
      updateTask(currentWorkspace.id, id, { priority: val.toLowerCase() as "low" | "medium" | "high" }).catch(() =>
        toast.error("Failed to update priority")
      );
  }

  function handleEstimateSave(val: string) {
    setEstimate(val);
    const minutes = parseHoursInput(val);
    if (id && minutes !== null && currentWorkspace)
      updateTask(currentWorkspace.id, id, { estimated_minutes: minutes }).catch(() =>
        toast.error("Failed to save estimate")
      );
  }

  function formatElapsed(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 text-gray-500">
        Task not found.
      </div>
    );
  }

  const currentStage = task.stages.find((s) => s.id === stageId);
  const assigneeNames = task.assignees.map((a) => a.name).join(", ") || task.created_by_name;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <h1 className="text-2xl font-semibold leading-snug">{task.title}</h1>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{task.description}</p>
                )}

                <div className="border-b border-gray-100 mt-4 -mx-4" />

                {/* Top row: Project, Assignee, Due Date */}
                <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm mt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Project
                    </span>
                    <Button
                      variant="outline"
                      
                      onClick={() => navigate(`/projects/${task.project_id}`)}
                      className="w-fit text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-800"
                    >
                      <Folder />
                      {task.project_name}
                    </Button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <User className="w-3 h-3" /> Assignee
                    </span>
                    <span className="text-gray-700">{assigneeNames}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <Calendar className="w-3 h-3" /> Due Date
                    </span>
                    <span className="text-gray-700">
                      {task.due_date ? (
                        new Date(task.due_date).toLocaleDateString()
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Bottom row: Logged, Status, Priority */}
                <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm mt-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <Clock className="w-3 h-3" /> Logged Time
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon-xs"
                        onClick={() => (isThisTaskRunning ? stop() : start(task.id, task.title))}
                        title={
                          isThisTaskRunning
                            ? "Stop timer"
                            : isRunning
                              ? "Switch to this task"
                              : "Start timer"
                        }
                        className={`rounded-full ${isThisTaskRunning ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
                      >
                        {isThisTaskRunning ? <Square /> : <Play />}
                      </Button>
                      <span className="text-gray-700">
                        {isThisTaskRunning ? formatElapsed(elapsed) : totalTracked || "0m"}
                        {estimate && <span className="text-gray-400 ml-1">/ {estimate}</span>}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </span>
                    <Select value={stageId} onValueChange={handleStatusChange}>
                      <SelectTrigger
                        className="h-8 w-36 text-sm font-medium border-0 cursor-pointer"
                        style={
                          currentStage
                            ? stageBadgeStyle(
                                (currentStage.position - 1) / Math.max(task.stages.length - 1, 1)
                              )
                            : undefined
                        }
                      >
                        <span>{currentStage?.name ?? ""}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {task.stages.map((s) => {
                          const f = (s.position - 1) / Math.max(task.stages.length - 1, 1);
                          return (
                            <SelectItem key={s.id} value={s.id} className="cursor-pointer">
                              <span
                                className="w-full px-2 py-0.5 rounded-md text-xs font-medium"
                                style={stageBadgeStyle(f)}
                              >
                                {s.name}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Priority
                    </span>
                    <Select value={priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger
                        className={`h-8 w-28 text-sm font-medium border-0 cursor-pointer ${priorityColors[priority] ?? ""}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((p) => (
                          <SelectItem key={p} value={p} className="cursor-pointer">
                            <span
                              className={`w-full px-2 py-0.5 rounded-md text-xs font-medium ${priorityColors[p]}`}
                            >
                              {p}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <SubtasksCard
              taskId={task.id}
              projectId={task.project_id}
              defaultStageId={task.workflow_stage_id}
            />
            <CommentsCard taskId={task.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EstimateCard
              estimate={estimate}
              totalTimeTracked={totalTracked || "0m"}
              setEstimate={setEstimate}
              onSave={handleEstimateSave}
            />
            <TimeTrackingCard hook={timeTracking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
