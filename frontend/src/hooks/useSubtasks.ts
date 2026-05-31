import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChildTasks, createChildTask, deleteTask } from "@/api/tasks";
import { getProject } from "@/api/projects";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";

export function useSubtasks(taskId: string, projectId: string, defaultStageId: string) {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const [newSubtask, setNewSubtask] = useState("");

  const { data: subtasks = [] } = useQuery({
    queryKey: ["subtasks", taskId],
    queryFn: () => getChildTasks(currentWorkspace!.id, taskId),
    enabled: !!taskId && !!currentWorkspace,
  });

  const { data: projectData } = useQuery({
    queryKey: ["project", currentWorkspace?.id, projectId],
    queryFn: () => getProject(currentWorkspace!.id, projectId),
    enabled: !!projectId && !!currentWorkspace,
  });

  const todoStageId = projectData?.stages.find((s) => s.name === "To Do")?.id ?? defaultStageId;

  async function addSubtask() {
    if (!newSubtask.trim() || !projectId || !todoStageId || !currentWorkspace) return;
    try {
      await createChildTask(currentWorkspace.id, {
        title: newSubtask.trim(),
        project_id: projectId,
        workflow_stage_id: todoStageId,
        parent_task_id: taskId,
      });
      setNewSubtask("");
      queryClient.invalidateQueries({ queryKey: ["subtasks", taskId] });
    } catch {
      toast.error("Failed to add subtask");
    }
  }

  async function removeSubtask(id: string) {
    if (!currentWorkspace) return;
    try {
      await deleteTask(currentWorkspace.id, id);
      queryClient.invalidateQueries({ queryKey: ["subtasks", taskId] });
    } catch {
      toast.error("Failed to remove subtask");
    }
  }

  return { subtasks, newSubtask, setNewSubtask, addSubtask, removeSubtask };
}
