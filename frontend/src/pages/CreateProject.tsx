import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Calendar, Users, Tag, FolderPlus } from "lucide-react";
import { createProject } from "@/api/projects";
import { getUsers, UserSummary } from "@/api/user";
import { useWorkspace } from "@/context/WorkspaceContext";
import { tagColor, STATUS_OPTIONS } from "@/constants/project";
import { toast } from "sonner";
import { ProjectStatus, MemberRole } from "@/types";

interface SelectedMember {
  user_id: string;
  role: MemberRole;
}

const CreateProject = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planning");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!currentWorkspace) return;
    getUsers(currentWorkspace.id)
      .then(setUsers)
      .catch(() => {});
  }, [currentWorkspace?.id]);

  function toggleMember(id: string) {
    setSelectedMembers((prev) =>
      prev.some((m) => m.user_id === id)
        ? prev.filter((m) => m.user_id !== id)
        : [...prev, { user_id: id, role: "developer" }]
    );
  }

  function setMemberRole(id: string, role: MemberRole) {
    setSelectedMembers((prev) => prev.map((m) => (m.user_id === id ? { ...m, role } : m)));
  }

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !currentWorkspace) return;
    setSubmitting(true);
    const result = await createProject(currentWorkspace.id, {
      name: name.trim(),
      description: description.trim() || undefined,
      status,
      start_date: startDate || undefined,
      deadline: deadline || undefined,
      members: selectedMembers,
      tags,
    }).catch(() => {
      toast.error("Failed to create project");
      return null;
    });
    setSubmitting(false);
    if (result) {
      toast.success("Project created");
      navigate("/projects");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
            <p className="text-gray-500 text-sm">Set up a new project and invite your team.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderPlus className="w-5 h-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project name *</Label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this project about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  {(() => {
                    const selected = STATUS_OPTIONS.find((s) => s.value === status);
                    return (
                      <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
                        <SelectTrigger
                          className={`w-full font-medium border-0 ${selected?.color ?? ""}`}
                        >
                          <span>{selected?.label}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              <span
                                className={`w-full px-2 py-0.5 rounded-md text-xs font-medium ${s.color}`}
                              >
                                {s.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-sm text-gray-400">No other users found.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {users.map((user) => {
                    const selected = selectedMembers.find((m) => m.user_id === user.id);
                    const isSelected = !!selected;
                    const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                          isSelected ? "border-gray-400 bg-gray-50" : "border-gray-200 bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleMember(user.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900 leading-none">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-gray-400 capitalize mt-0.5">{user.email}</p>
                          </div>
                        </button>

                        {isSelected && (
                          <Select
                            value={selected.role}
                            onValueChange={(v) => setMemberRole(user.id, v as MemberRole)}
                          >
                            <SelectTrigger
                              className="w-32 h-7 text-xs border-gray-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${tagColor(tag)}`}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="cursor-pointer hover:opacity-70 flex items-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/projects")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              <FolderPlus className="w-4 h-4" />
              {submitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
