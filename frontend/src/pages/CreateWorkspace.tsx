import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createWorkspace } from "@/api/workspaces";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const { refreshWorkspaces, switchWorkspace } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const workspace = await createWorkspace({
      name: name.trim(),
      description: description.trim() || undefined,
    }).catch(() => {
      toast.error("Failed to create workspace");
      return null;
    });
    setSubmitting(false);
    if (workspace) {
      await refreshWorkspaces();
      switchWorkspace(workspace);
      toast.success("Workspace created");
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your workspace</h1>
          <p className="text-gray-500 text-sm mt-1">A workspace is where your team collaborates on projects.</p>
        </div>

        <Card className="rounded-xl">
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does your team work on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating..." : "Create Workspace"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateWorkspace;
