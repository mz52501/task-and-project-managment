import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Users, Mail, Copy, Trash2, Plus } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  getWorkspaceMembers,
  updateWorkspaceMemberRole,
  removeWorkspaceMember,
  getWorkspaceInvites,
  createInvite,
  revokeInvite,
  updateWorkspace,
} from "@/api/workspaces";
import { getProjects } from "@/api/projects";
import { WorkspaceMemberDetail, WorkspaceInvite, WorkspaceRole } from "@/types";
import { ProjectWithCounts } from "@/api/projects";
import { toast } from "sonner";

const WorkspaceSettings = () => {
  const { currentWorkspace, isAdmin, refreshWorkspaces, switchWorkspace } = useWorkspace();

  const [members, setMembers] = useState<WorkspaceMemberDetail[]>([]);
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [projects, setProjects] = useState<ProjectWithCounts[]>([]);

  const [wsName, setWsName] = useState(currentWorkspace?.name ?? "");
  const [savingName, setSavingName] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("member");
  const [inviteProjectIds, setInviteProjectIds] = useState<string[]>([]);
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    if (!currentWorkspace) return;
    setWsName(currentWorkspace.name);
    getWorkspaceMembers(currentWorkspace.id).then(setMembers).catch(() => {});
    if (isAdmin) {
      getWorkspaceInvites(currentWorkspace.id).then(setInvites).catch(() => {});
      getProjects(currentWorkspace.id).then((r) => setProjects([...r.owned, ...r.member])).catch(() => {});
    }
  }, [currentWorkspace?.id, isAdmin]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!currentWorkspace || !wsName.trim()) return;
    setSavingName(true);
    const updated = await updateWorkspace(currentWorkspace.id, { name: wsName.trim() }).catch(() => {
      toast.error("Failed to update workspace");
      return null;
    });
    setSavingName(false);
    if (updated) {
      await refreshWorkspaces();
      toast.success("Workspace updated");
    }
  }

  async function handleRoleChange(memberId: string, role: string) {
    if (!currentWorkspace) return;
    await updateWorkspaceMemberRole(currentWorkspace.id, memberId, role).catch(() => {
      toast.error("Failed to update role");
    });
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: role as WorkspaceRole } : m)));
  }

  async function handleRemoveMember(memberId: string) {
    if (!currentWorkspace) return;
    await removeWorkspaceMember(currentWorkspace.id, memberId).catch(() => {
      toast.error("Failed to remove member");
      return;
    });
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    toast.success("Member removed");
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!currentWorkspace || !inviteEmail.trim()) return;
    setSendingInvite(true);
    const invite = await createInvite(currentWorkspace.id, {
      email: inviteEmail.trim(),
      role: inviteRole,
      project_ids: inviteProjectIds,
    }).catch(() => {
      toast.error("Failed to create invite");
      return null;
    });
    setSendingInvite(false);
    if (invite) {
      setInvites((prev) => [invite, ...prev]);
      setInviteEmail("");
      setInviteProjectIds([]);
      toast.success("Invite created");
    }
  }

  async function handleRevokeInvite(inviteId: string) {
    if (!currentWorkspace) return;
    await revokeInvite(currentWorkspace.id, inviteId).catch(() => {
      toast.error("Failed to revoke invite");
      return;
    });
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    toast.success("Invite revoked");
  }

  function copyInviteLink(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  function toggleInviteProject(projectId: string) {
    setInviteProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  }

  if (!currentWorkspace) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspace Settings</h1>
          <p className="text-gray-500 text-sm">Manage your workspace and team.</p>
        </div>

        {/* General */}
        {isAdmin && (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveName} className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="wsName">Workspace name</Label>
                  <Input
                    id="wsName"
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={savingName}>
                    {savingName ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Members */}
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
                          <SelectTrigger className="w-28 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
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

        {/* Invite */}
        {isAdmin && (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Invite People
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail">Email address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as WorkspaceRole)}>
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
                          onClick={() => toggleInviteProject(p.id)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                            inviteProjectIds.includes(p.id)
                              ? "border-gray-400 bg-gray-100 text-gray-900"
                              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={sendingInvite}>
                  <Plus className="w-4 h-4" />
                  {sendingInvite ? "Creating..." : "Create invite link"}
                </Button>
              </form>

              {invites.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700">Pending invites</p>
                  {invites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-gray-900">{invite.email}</p>
                        <p className="text-xs text-gray-400 capitalize">{invite.role} · expires {new Date(invite.expires_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => copyInviteLink(invite.invite_url)}>
                          <Copy className="w-3.5 h-3.5" />
                          Copy link
                        </Button>
                        <button
                          onClick={() => handleRevokeInvite(invite.id)}
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
        )}
      </div>
    </div>
  );
};

export default WorkspaceSettings;
