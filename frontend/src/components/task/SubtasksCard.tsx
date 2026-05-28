import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSubtasks } from "@/hooks/useSubtasks";
import { StatusCircle } from "./StatusCircle";

interface Props {
  taskId: string;
  projectId: string;
  defaultStageId: string;
}

export function SubtasksCard({ taskId, projectId, defaultStageId }: Props) {
  const navigate = useNavigate();
  const { subtasks, newSubtask, setNewSubtask, addSubtask, removeSubtask } = useSubtasks(
    taskId,
    projectId,
    defaultStageId
  );

  const completedCount = subtasks.filter((s) => s.workflow_stage_id === defaultStageId).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>
          Subtasks ({completedCount}/{subtasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {subtasks.map((st) => (
            <div
              key={st.id}
              className="group flex items-center gap-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <button
                onClick={() => navigate(`/task/${st.id}`)}
                className="flex flex-1 items-center gap-3 px-2 py-1.5 text-left cursor-pointer"
              >
                <StatusCircle
                  position={(st as any).stage_position ?? 1}
                  totalStages={(st as any).total_stages ?? 3}
                />
                <span className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                  {st.title}
                </span>
              </button>
              <button
                onClick={() => removeSubtask(st.id)}
                className="mr-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 cursor-pointer transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Add a subtask..."
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSubtask()}
            className="flex-1"
          />
          <Button size="sm" onClick={addSubtask} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
