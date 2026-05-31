import { useEffect, useState } from "react";
import { getChildTasks, createChildTask } from "@/api/tasks";
import { getProject } from "@/api/projects";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Task } from "@/types";
import { toast } from "sonner";

export function useSubtasks(taskId: string, projectId: string, defaultStageId: string) {
  const { currentWorkspace } = useWorkspace();
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [todoStageId, setTodoStageId] = useState(defaultStageId);

  useEffect(() => {
    if (!taskId || !currentWorkspace) return;
    getChildTasks(currentWorkspace.id, taskId)
      .then(setSubtasks)
      .catch(() => toast.error("Failed to load subtasks"));
  }, [taskId, currentWorkspace?.id]);

  useEffect(() => {
    if (!projectId || !currentWorkspace) return;
    getProject(currentWorkspace.id, projectId)
      .then((p) => {
        const todo = p.stages.find((s) => s.name === "To Do");
        if (todo) setTodoStageId(todo.id);
      })
      .catch(() => {});
  }, [projectId, currentWorkspace?.id]);

  async function addSubtask() {
    if (!newSubtask.trim() || !projectId || !todoStageId || !currentWorkspace) return;
    try {
      const created = await createChildTask(currentWorkspace.id, {
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
