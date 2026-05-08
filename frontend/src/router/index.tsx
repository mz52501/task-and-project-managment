import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { MyNavbar } from "@/pages/MyNavbar";
import Landing from "@/pages/Landing";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Registration from "@/pages/Registration";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Projects2 from "@/pages/Projects2";
import KanbanBoard from "@/components/KanbanBoard";
import Task from "@/pages/Task";
import NotFound from "@/pages/NotFound";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/landing2" element={<LandingPage />} />

        {/* Guest only (redirect to dashboard if already logged in) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Route>

        {/* Protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MyNavbar />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects2" element={<Projects2 />} />
            <Route path="demo" element={<KanbanBoard />} />
            <Route path="task/:id" element={<Task />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
