import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Pencil, UserPlus, Loader2 } from "lucide-react";
import KanbanBoard from "@/components/KanbanBoard";
import { getProject, updateProject, addProjectMember, ProjectDetail as ProjectDetailType } from "@/api/projects";
import { getWorkspaceMembers } from "@/api/workspaces";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ProjectStatus } from "@/types";
import { WorkspaceMemberDetail } from "@/types";


const statusStyles: Record<string, string> = {
  active: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  on_hold: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-800 hover:bg-gray-200",
};

interface EditForm {
  name: string;
  description: string;
  status: ProjectStatus;
  deadline: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentWorkspace } = useWorkspace();
  const [project, setProject] = useState<ProjectDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", description: "", status: "active", deadline: "" });
  const [saving, setSaving] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMemberDetail[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("developer");
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    if (!id || !currentWorkspace) return;
    getProject(currentWorkspace.id, id)
      .then(setProject)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, currentWorkspace?.id]);

  const openEdit = () => {
    if (!project) return;
    setEditForm({
      name: project.name,
      description: project.description ?? "",
      status: project.status,
      deadline: project.deadline ? project.deadline.slice(0, 10) : "",
    });
    setEditOpen(true);
  };

  const openAddMember = async () => {
    if (!currentWorkspace) return;
    const members = await getWorkspaceMembers(currentWorkspace.id);
    setWorkspaceMembers(members);
    setSelectedUserId("");
    setSelectedRole("developer");
    setAddMemberOpen(true);
  };

  const handleAddMember = async () => {
    if (!project || !currentWorkspace || !selectedUserId) return;
    setAddingMember(true);
    try {
      const newMember = await addProjectMember(currentWorkspace.id, project.id, selectedUserId, selectedRole);
      setProject((prev) => prev ? { ...prev, members: [...prev.members, newMember] } : prev);
      setAddMemberOpen(false);
    } catch {
    } finally {
      setAddingMember(false);
    }
  };

  const handleEditSave = async () => {
    if (!project || !currentWorkspace) return;
    setSaving(true);
    try {
      const updated = await updateProject(currentWorkspace.id, project.id, {
        name: editForm.name,
        description: editForm.description || undefined,
        status: editForm.status,
        deadline: editForm.deadline || undefined,
      });
      setProject((prev) => prev ? { ...prev, ...updated } : prev);
      setEditOpen(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-50 text-gray-500">
        Project not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Header card */}
      <div className="px-8 pt-6 pb-0 flex-none max-w-[1800px] mx-auto w-full">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <Badge
                    className={`capitalize ${statusStyles[project.status] ?? ""}`}
                    variant="secondary"
                  >
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                {project.description && (
                  <p className="text-gray-500 mt-1 text-sm">{project.description}</p>
                )}
                <div className="flex items-center gap-6 mt-3 flex-wrap">
                  {project.deadline && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Deadline:{" "}
                      <span className="font-medium text-gray-900 ml-1">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    {project.members.slice(0, 5).map((m, i) => (
                      <Avatar
                        key={m.id}
                        className={`w-7 h-7 border-2 border-white ${i > 0 ? "-ml-2" : ""}`}
                      >
                        <AvatarFallback className="text-xs bg-gray-100">
                          {m.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 5 && (
                      <div className="w-7 h-7 -ml-2 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                        +{project.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-none">
                <Button variant="outline" onClick={openEdit}>
                  <Pencil /> Edit Project
                </Button>
                <Button onClick={openAddMember}>
                  <UserPlus /> Add Member
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="flex-1 px-8 py-4 min-h-0 overflow-hidden max-w-[1800px] mx-auto w-full">
        <div className="h-full bg-white rounded-xl border border-gray-200 overflow-hidden p-4">
          <KanbanBoard projectId={project.id} stages={project.stages} height="100%" />
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          {(() => {
            const available = workspaceMembers.filter(
              (wm) => !project.members.some((pm) => pm.user_id === wm.user_id)
            );
            if (available.length === 0) {
              return (
                <div className="py-6 text-center text-sm text-gray-500">
                  All workspace members are already on this project.
                  <br />
                  Invite new people via Workspace Settings.
                </div>
              );
            }
            return (
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Member</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {available.map((wm) => (
                        <SelectItem key={wm.user_id} value={wm.user_id}>
                          {wm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberOpen(false)} disabled={addingMember}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={addingMember || !selectedUserId}
            >
              {addingMember ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(v) => setEditForm((f) => ({ ...f, status: v as ProjectStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-deadline">Deadline</Label>
              <Input
                id="edit-deadline"
                type="date"
                value={editForm.deadline}
                onChange={(e) => setEditForm((f) => ({ ...f, deadline: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={saving || !editForm.name.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
