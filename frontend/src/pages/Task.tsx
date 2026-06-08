import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { TaskMetaCard } from "@/components/task/TaskMetaCard";
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
  const [assignees, setAssignees] = useState<{ id: string; name: string; initials: string }[]>([]);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);

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
        setAssignees(t.assignees);
        setDueDate(t.due_date);
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
      updateTask(currentWorkspace.id, id, {
        priority: val.toLowerCase() as "low" | "medium" | "high",
      }).catch(() => toast.error("Failed to update priority"));
  }

  function handleDueDateChange(val: string) {
    setDueDate(val || undefined);
    if (id && currentWorkspace)
      updateTask(currentWorkspace.id, id, { due_date: val || undefined }).catch(() =>
        toast.error("Failed to update due date")
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaskMetaCard
              title={task.title}
              description={task.description}
              projectName={task.project_name}
              projectId={task.project_id}
              taskId={task.id}
              assignees={assignees}
              dueDate={dueDate}
              stageId={stageId}
              stages={task.stages}
              priority={priority}
              isTimerRunning={isThisTaskRunning}
              isAnyTimerRunning={isRunning}
              elapsed={elapsed}
              totalTracked={totalTracked || ""}
              estimate={estimate}
              onNavigateToProject={() => navigate(`/projects/${task.project_id}`)}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onTimerToggle={() => (isThisTaskRunning ? stop() : start(task.id, task.title))}
              onAssigneesChange={setAssignees}
              onDueDateChange={handleDueDateChange}
            />

            <SubtasksCard
              taskId={task.id}
              projectId={task.project_id}
              defaultStageId={task.workflow_stage_id}
            />
            <CommentsCard taskId={task.id} />
          </div>

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
