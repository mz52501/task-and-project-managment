import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSubtasks } from "@/hooks/useSubtasks";
import { StatusCircle } from "./StatusCircle";

export function SubtasksCard() {
  const navigate = useNavigate();
  const { subtasks, newSubtask, setNewSubtask, addSubtask, deleteSubtask } = useSubtasks();
  const completedCount = subtasks.filter((s) => s.status === "Done").length;

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
            <div key={st.id} className="group flex items-center gap-3">
              <StatusCircle status={st.status} />
              <button
                onClick={() => navigate(`/task/${st.id}`)}
                className="flex-1 text-sm text-gray-800 text-left hover:text-blue-600 transition-colors cursor-pointer"
              >
                {st.title}
              </button>
              <button
                onClick={() => deleteSubtask(st.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 cursor-pointer transition-opacity"
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
