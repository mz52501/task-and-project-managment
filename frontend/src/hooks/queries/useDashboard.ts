import { useQuery } from "@tanstack/react-query";
import { getDashboard, getActivityLogs } from "@/api/dashboard";
import { useWorkspace } from "@/context/WorkspaceContext";

export function useDashboard() {
  const { currentWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ["dashboard", currentWorkspace?.id],
    queryFn: () => getDashboard(currentWorkspace!.id),
    enabled: !!currentWorkspace,
  });
}

export function useActivityLogs() {
  const { currentWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ["activity-logs", currentWorkspace?.id],
    queryFn: () => getActivityLogs(currentWorkspace!.id),
    enabled: !!currentWorkspace,
  });
}
