import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/context/WorkspaceContext";

import AppLayout from "@/pages/AppLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Registration from "@/pages/Registration";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Task from "@/pages/Task";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import CreateProject from "@/pages/CreateProject";
import CreateWorkspace from "@/pages/CreateWorkspace";
import WorkspaceSettings from "@/pages/WorkspaceSettings";
import InviteAccept from "@/pages/InviteAccept";
import MyTasks from "@/pages/MyTasks";
import Timesheet from "@/pages/Timesheet";
import Logout from "@/pages/Logout";
import NotFound from "@/pages/NotFound";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

function WorkspaceGuard() {
  const { currentWorkspace, loading } = useWorkspace();
  if (loading) return null;
  if (!currentWorkspace) return <Navigate to="/create-workspace" replace />;
  return <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public invite route -- accessible regardless of auth state */}
        <Route path="/invite/:token" element={<InviteAccept />} />

        {/* Guest only */}
        <Route element={<GuestRoute />}>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Route>

        {/* Authenticated but no workspace yet */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create-workspace" element={<CreateWorkspace />} />
        </Route>

        {/* Authenticated + workspace required */}
        <Route element={<ProtectedRoute />}>
          <Route element={<WorkspaceGuard />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/new" element={<CreateProject />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="task/:id" element={<Task />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<WorkspaceSettings />} />
              <Route path="tasks" element={<MyTasks />} />
              <Route path="time" element={<Timesheet />} />
            </Route>
          </Route>
        </Route>

        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
