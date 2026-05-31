import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { updateWorkspaceMemberRole, removeWorkspaceMember } from "@/api/workspaces";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useWorkspaceMembers } from "@/hooks/queries/useWorkspaceData";
import { WorkspaceRole } from "@/types";
import { toast } from "sonner";

export function MembersSection() {
  const { currentWorkspace, isAdmin } = useWorkspace();
  const queryClient = useQueryClient();
  const { data: members = [] } = useWorkspaceMembers();

  async function handleRoleChange(memberId: string, role: string) {
    if (!currentWorkspace) return;
    await updateWorkspaceMemberRole(currentWorkspace.id, memberId, role).catch(() => toast.error("Failed to update role"));
    queryClient.invalidateQueries({ queryKey: ["workspace-members", currentWorkspace.id] });
  }

  async function handleRemove(memberId: string) {
    if (!currentWorkspace) return;
    await removeWorkspaceMember(currentWorkspace.id, memberId).catch(() => { toast.error("Failed to remove member"); return; });
    queryClient.invalidateQueries({ queryKey: ["workspace-members", currentWorkspace.id] });
    toast.success("Member removed");
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {members.map((member) => {
          const initials = member.name.split(" ").map((n) => n[0]).join("").toUpperCase();
          return (
            <div key={member.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-gray-100 text-gray-600">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <>
                    <Select value={member.role} onValueChange={(v) => handleRoleChange(member.id, v)}>
                      <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <button onClick={() => handleRemove(member.id)} className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <Badge variant="secondary" className="text-xs capitalize">{member.role}</Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
