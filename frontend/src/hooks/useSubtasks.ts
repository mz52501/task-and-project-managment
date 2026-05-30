import { useEffect, useState } from "react";
import { getChildTasks, createChildTask } from "@/api/tasks";
import { getProject } from "@/api/projects";
import { Task } from "@/types";
import { toast } from "sonner";

export function useSubtasks(taskId: string, projectId: string, defaultStageId: string) {
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [todoStageId, setTodoStageId] = useState(defaultStageId);

  useEffect(() => {
    if (!taskId) return;
    getChildTasks(taskId)
      .then(setSubtasks)
      .catch(() => toast.error("Failed to load subtasks"));
  }, [taskId]);

  useEffect(() => {
    if (!projectId) return;
    getProject(projectId)
      .then((p) => {
        const todo = p.stages.find((s) => s.name === "To Do");
        if (todo) setTodoStageId(todo.id);
      })
      .catch(() => {});
  }, [projectId]);

  async function addSubtask() {
    if (!newSubtask.trim() || !projectId || !todoStageId) return;
    try {
      const created = await createChildTask({
        title: newSubtask.trim(),
        project_id: projectId,
        workflow_stage_id: todoStageId,
        parent_task_id: taskId,
      });
      setSubtasks((prev) => [...prev, created]);
      setNewSubtask("");
    } catch {
      toast.error("Failed to add subtask");
    }
  }

  function removeSubtask(id: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  return { subtasks, newSubtask, setNewSubtask, addSubtask, removeSubtask };
}
