import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { differenceInDays } from "date-fns";
import { FaExclamationTriangle, FaClock, FaCheckCircle } from "react-icons/fa";

interface Task {
  id: number;
  name: string;
  due: string;
  priority: "High" | "Medium" | "Low";
}

interface Project {
  id: number;
  name: string;
  progress: number;
}

const tasks: Task[] = [
  { id: 1, name: "Fix UI bugs", due: "2025-04-10", priority: "High" },
  { id: 2, name: "API Integration", due: "2025-04-12", priority: "Medium" },
  { id: 3, name: "Write Documentation", due: "2025-04-15", priority: "Low" },
];

const projects: Project[] = [
  { id: 1, name: "Website Redesign", progress: 70 },
  { id: 2, name: "App Development", progress: 30 },
];

const getDaysRemaining = (dueDate: string): string => {
  const today = new Date();
  const due = new Date(dueDate);
  const daysLeft = differenceInDays(due, today);
  return daysLeft < 0 ? "Overdue" : `${daysLeft} days left`;
};

const getPriorityIcon = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return <FaExclamationTriangle className="text-red-500 text-lg" />;
    case "Medium":
      return <FaClock className="text-yellow-500 text-lg" />;
    case "Low":
      return <FaCheckCircle className="text-green-500 text-lg" />;
    default:
      return null;
  }
};

export default function Home() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 flex-grow overflow-auto">
      <motion.h1
        className="text-4xl font-bold text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      <motion.div
        className="bg-white p-6 shadow-md rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Most Critical Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center p-3 border-b last:border-none">
              <div className="flex items-center gap-3">
                {getPriorityIcon(task.priority)}
                <p className="text-lg">{task.name}</p>
              </div>
              <p className="text-gray-500 text-sm">{getDaysRemaining(task.due)}</p>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="bg-white p-6 shadow-md rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Project Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projects}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="progress" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="bg-white p-6 shadow-md rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="p-3 border-b last:border-none">
              <p className="text-lg">
                {project.name} - <span className="font-semibold">{project.progress}%</span> Complete
              </p>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
