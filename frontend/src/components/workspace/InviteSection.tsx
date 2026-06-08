import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Copy, Trash2, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { createInvite, revokeInvite } from "@/api/workspaces";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useWorkspaceInvites } from "@/hooks/queries/useWorkspaceData";
import { useProjects } from "@/hooks/queries/useProjects";
import { WorkspaceRole } from "@/types";
import { toast } from "sonner";

export function InviteSection() {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const { data: invites = [] } = useWorkspaceInvites();
  const { data: projectsData } = useProjects();
  const projects = [...(projectsData?.owned ?? []), ...(projectsData?.member ?? [])];

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("member");
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  function toggleProject(id: string) {
    setProjectIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentWorkspace || !email.trim()) return;
    setSending(true);
    const invite = await createInvite(currentWorkspace.id, {
      email: email.trim(),
      role,
      project_ids: projectIds,
    }).catch(() => {
      toast.error("Failed to create invite");
      return null;
    });
    setSending(false);
    if (invite) {
      queryClient.invalidateQueries({ queryKey: ["workspace-invites", currentWorkspace.id] });
      setEmail("");
      setProjectIds([]);
      toast.success("Invite created");
    }
  }

  async function handleRevoke(inviteId: string) {
    if (!currentWorkspace) return;
    await revokeInvite(currentWorkspace.id, inviteId).catch(() => {
      toast.error("Failed to revoke invite");
      return;
    });
    queryClient.invalidateQueries({ queryKey: ["workspace-invites", currentWorkspace.id] });
    toast.success("Invite revoked");
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Invite People
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as WorkspaceRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {projects.length > 0 && (
            <div className="space-y-2">
              <Label>Also add to projects (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProject(p.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${projectIds.includes(p.id) ? "border-gray-400 bg-gray-100 text-gray-900" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Button type="submit" disabled={sending}>
            <Plus className="w-4 h-4" />
            {sending ? "Creating..." : "Create invite link"}
          </Button>
        </form>
        {invites.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700">Pending invites</p>
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-gray-900">{invite.email}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {invite.role} · expires {new Date(invite.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(invite.invite_url);
                      toast.success("Link copied");
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy link
                  </Button>
                  <button
                    onClick={() => handleRevoke(invite.id)}
                    className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
