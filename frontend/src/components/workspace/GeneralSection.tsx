import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { updateWorkspace } from "@/api/workspaces";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";

export function GeneralSection() {
  const { currentWorkspace, refreshWorkspaces } = useWorkspace();
  const [wsName, setWsName] = useState(currentWorkspace?.name ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentWorkspace || !wsName.trim()) return;
    setSaving(true);
    const updated = await updateWorkspace(currentWorkspace.id, { name: wsName.trim() }).catch(() => {
      toast.error("Failed to update workspace");
      return null;
    });
    setSaving(false);
    if (updated) {
      await refreshWorkspaces();
      toast.success("Workspace updated");
    }
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          General
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="wsName">Workspace name</Label>
            <Input id="wsName" value={wsName} onChange={(e) => setWsName(e.target.value)} required />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
