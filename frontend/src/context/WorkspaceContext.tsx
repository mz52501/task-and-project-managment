import React, { createContext, useContext, useEffect, useState } from "react";
import { WorkspaceMembership, WorkspaceRole } from "@/types";
import { getWorkspaces } from "@/api/workspaces";
import { updateMe } from "@/api/user";

interface WorkspaceContextValue {
  workspaces: WorkspaceMembership[];
  currentWorkspace: WorkspaceMembership | null;
  isAdmin: boolean;
  loading: boolean;
  switchWorkspace: (workspace: WorkspaceMembership) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceMembership[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceMembership | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadWorkspaces() {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const list = await getWorkspaces();
      setWorkspaces(list);

      const savedId = localStorage.getItem("current_workspace_id");
      const saved = list.find((w) => w.id === savedId);
      setCurrentWorkspace(saved ?? list[0] ?? null);
    } catch {
      // unauthenticated, ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspaces();
  }, []);

  function switchWorkspace(workspace: WorkspaceMembership) {
    setCurrentWorkspace(workspace);
    localStorage.setItem("current_workspace_id", workspace.id);
    updateMe({ current_workspace_id: workspace.id }).catch(() => {});
  }

  async function refreshWorkspaces() {
    await loadWorkspaces();
  }

  const isAdmin = currentWorkspace?.role === "admin";

  return (
    <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, isAdmin, loading, switchWorkspace, refreshWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
