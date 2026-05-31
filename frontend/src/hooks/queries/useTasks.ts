import { useQuery } from "@tanstack/react-query";
import { getMyTasks, getTasks, getTimeEntries } from "@/api/tasks";
import { useWorkspace } from "@/context/WorkspaceContext";

export function useMyTasks() {
  const { currentWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ["my-tasks", currentWorkspace?.id],
    queryFn: () => getMyTasks(currentWorkspace!.id),
    enabled: !!currentWorkspace,
  });
}

export function useTasks() {
  const { currentWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ["tasks", currentWorkspace?.id],
    queryFn: () => getTasks(currentWorkspace!.id),
    enabled: !!currentWorkspace,
  });
}

export function useTimeEntries() {
  return useQuery({
    queryKey: ["time-entries"],
    queryFn: getTimeEntries,
  });
}
