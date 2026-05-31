import { useQuery } from "@tanstack/react-query";
import { getProjects, getProject } from "@/api/projects";
import { useWorkspace } from "@/context/WorkspaceContext";

export function useProjects() {
  const { currentWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ["projects", currentWorkspace?.id],
    queryFn: () => getProjects(currentWorkspace!.id),
    enabled: !!currentWorkspace,
  });
}

export function useProject(projectId: string) {
  const { currentWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ["project", currentWorkspace?.id, projectId],
    queryFn: () => getProject(currentWorkspace!.id, projectId),
    enabled: !!currentWorkspace && !!projectId,
  });
}
