import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, User, Calendar, Play, Square, Folder } from "lucide-react";
import { PRIORITY_OPTIONS, priorityColors, stageBadgeStyle } from "@/constants/task";

interface Stage {
  id: string;
  name: string;
  position: number;
}

interface Props {
  title: string;
  description?: string;
  projectName: string;
  projectId: string;
  assigneeNames: string;
  dueDate?: string;
  stageId: string;
  stages: Stage[];
  priority: string;
  isTimerRunning: boolean;
  isAnyTimerRunning: boolean;
  elapsed: number;
  totalTracked: string;
  estimate: string;
  onNavigateToProject: () => void;
  onStatusChange: (stageId: string) => void;
  onPriorityChange: (priority: string) => void;
  onTimerToggle: () => void;
}

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function TaskMetaCard({
  title, description, projectName, projectId, assigneeNames, dueDate,
  stageId, stages, priority, isTimerRunning, isAnyTimerRunning, elapsed,
  totalTracked, estimate, onNavigateToProject, onStatusChange, onPriorityChange, onTimerToggle,
}: Props) {
  const currentStage = stages.find((s) => s.id === stageId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <h1 className="text-2xl font-semibold leading-snug">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{description}</p>
        )}

        <div className="border-b border-gray-100 mt-4 -mx-4" />

        {/* Top row: Project, Assignee, Due Date */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm mt-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</span>
            <Button
              variant="outline"
              onClick={onNavigateToProject}
              className="w-fit text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-800"
            >
              <Folder />
              {projectName}
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
              {dueDate ? new Date(dueDate).toLocaleDateString() : <span className="text-gray-400">Not set</span>}
            </span>
          </div>
        </div>

        {/* Bottom row: Logged Time, Status, Priority */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm mt-4">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Clock className="w-3 h-3" /> Logged Time
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="icon-xs"
                onClick={onTimerToggle}
                title={isTimerRunning ? "Stop timer" : isAnyTimerRunning ? "Switch to this task" : "Start timer"}
                className={`rounded-full ${isTimerRunning ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
              >
                {isTimerRunning ? <Square /> : <Play />}
              </Button>
              <span className="text-gray-700">
                {isTimerRunning ? formatElapsed(elapsed) : totalTracked || "0m"}
                {estimate && <span className="text-gray-400 ml-1">/ {estimate}</span>}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
            <Select value={stageId} onValueChange={onStatusChange}>
              <SelectTrigger
                className="h-8 w-36 text-sm font-medium border-0 cursor-pointer"
                style={currentStage ? stageBadgeStyle((currentStage.position - 1) / Math.max(stages.length - 1, 1)) : undefined}
              >
                <span>{currentStage?.name ?? ""}</span>
              </SelectTrigger>
              <SelectContent>
                {stages.map((s) => {
                  const f = (s.position - 1) / Math.max(stages.length - 1, 1);
                  return (
                    <SelectItem key={s.id} value={s.id} className="cursor-pointer">
                      <span className="w-full px-2 py-0.5 rounded-md text-xs font-medium" style={stageBadgeStyle(f)}>
                        {s.name}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</span>
            <Select value={priority} onValueChange={onPriorityChange}>
              <SelectTrigger className={`h-8 w-28 text-sm font-medium border-0 cursor-pointer ${priorityColors[priority] ?? ""}`}>
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
      </CardHeader>
    </Card>
  );
}
