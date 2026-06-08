import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { addProjectMember, ProjectDetail, ProjectMemberDetail } from "@/api/projects";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useWorkspaceMembers } from "@/hooks/queries/useWorkspaceData";

interface Props {
  project: ProjectDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: (member: ProjectMemberDetail) => void;
}

export function AddMemberDialog({ project, open, onOpenChange, onAdded }: Props) {
  const { currentWorkspace } = useWorkspace();
  const { data: workspaceMembers = [] } = useWorkspaceMembers();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("developer");
  const [adding, setAdding] = useState(false);

  const available = workspaceMembers.filter(
    (wm) => !project.members.some((pm) => pm.user_id === wm.user_id)
  );

  async function handleAdd() {
    if (!currentWorkspace || !selectedUserId) return;
    setAdding(true);
    try {
      const newMember = await addProjectMember(
        currentWorkspace.id,
        project.id,
        selectedUserId,
        selectedRole
      );
      onAdded(newMember);
      onOpenChange(false);
      setSelectedUserId("");
      setSelectedRole("developer");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        {available.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">
            All workspace members are already on this project.
            <br />
            Invite new people via Workspace Settings.
          </div>
        ) : (
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
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={adding}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={adding || !selectedUserId || available.length === 0}
          >
            {adding && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
