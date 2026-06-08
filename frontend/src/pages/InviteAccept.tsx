import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInvitePreview, acceptInvite, getWorkspaces } from "@/api/workspaces";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/hooks/useAuth";
import { InvitePreview } from "@/types";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

const InviteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, saveAuth } = useAuth();
  const { refreshWorkspaces, switchWorkspace } = useWorkspace();

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!token) return;
    getInvitePreview(token)
      .then(setPreview)
      .catch(() => setError("This invite link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleJoin() {
    if (!token) return;
    setSubmitting(true);
    const result = await acceptInvite(token, { action_type: "join" }).catch(() => {
      toast.error("Failed to join workspace");
      return null;
    });
    setSubmitting(false);
    if (result) {
      await refreshWorkspaces();
      const list = await getWorkspaces();
      const joined = list.find((w) => w.id === result.workspace.id);
      if (joined) switchWorkspace(joined);
      toast.success(`Joined ${result.workspace.name}`);
      navigate("/");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !preview) return;
    setSubmitting(true);

    const data = preview.existing_account
      ? ({ action_type: "login", password } as const)
      : ({
          action_type: "register",
          first_name: firstName,
          last_name: lastName,
          password,
        } as const);

    const result = await acceptInvite(token, data).catch(() => {
      toast.error("Failed to accept invite");
      return null;
    });
    setSubmitting(false);
    if (result) {
      saveAuth(result.token, result.user);
      await refreshWorkspaces();
      const list = await getWorkspaces();
      const joined = list.find((w) => w.id === result.workspace.id);
      if (joined) switchWorkspace(joined);
      toast.success(`Joined ${result.workspace.name}`);
      navigate("/");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading invite...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-xl">
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-red-500 font-medium">{error}</p>
            <p className="text-sm text-gray-400">Ask your admin to send a new invite.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join {preview?.workspace_name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {preview?.invited_by_name} invited you as{" "}
            <span className="capitalize font-medium">{preview?.role}</span>
          </p>
        </div>

        <Card className="rounded-xl">
          <CardContent className="pt-6">
            {isAuthenticated ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-600">
                  You're already logged in. Click below to join this workspace.
                </p>
                <Button className="w-full" onClick={handleJoin} disabled={submitting}>
                  {submitting ? "Joining..." : `Join ${preview?.workspace_name}`}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={preview?.email ?? ""} disabled />
                </div>

                {!preview?.existing_account && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name *</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name *</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting
                    ? "..."
                    : preview?.existing_account
                      ? "Log in and join"
                      : "Create account and join"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InviteAccept;
