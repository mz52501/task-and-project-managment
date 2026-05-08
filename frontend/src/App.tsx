import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { MyNavbar } from "./pages/MyNavbar";
import LandingPage from "./pages/LandingPage";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import KanbanBoard from "./components/KanbanBoard";
import Projects2 from "./pages/Projects2";
import NotFound from "./pages/NotFound";
import Task from "./pages/Task";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/landing2" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<MyNavbar />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/demo" element={<KanbanBoard />} />
          <Route path="/projects2" element={<Projects2 />} />
          <Route path="/task/:id" element={<Task />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
