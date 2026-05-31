import { useQuery } from "@tanstack/react-query";
import { getWorkspaceMembers, getWorkspaceInvites } from "@/api/workspaces";
import { useWorkspace } from "@/context/WorkspaceContext";

export function useWorkspaceMembers() {
  const { currentWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ["workspace-members", currentWorkspace?.id],
    queryFn: () => getWorkspaceMembers(currentWorkspace!.id),
    enabled: !!currentWorkspace,
  });
}

export function useWorkspaceInvites() {
  const { currentWorkspace, isAdmin } = useWorkspace();
  return useQuery({
    queryKey: ["workspace-invites", currentWorkspace?.id],
    queryFn: () => getWorkspaceInvites(currentWorkspace!.id),
    enabled: !!currentWorkspace && isAdmin,
  });
}
