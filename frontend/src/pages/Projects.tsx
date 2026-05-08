import { Add, MoreVert } from "@mui/icons-material";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  dueDate: string;
  progress: number;
  members: string[];
  tags: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Website Redesign",
    dueDate: "Apr 20, 2025",
    progress: 60,
    members: ["JD", "MK", "AS"],
    tags: ["Design", "Q2"],
  },
  {
    id: 2,
    title: "Marketing Campaign",
    dueDate: "May 10, 2025",
    progress: 35,
    members: ["LB", "TR"],
    tags: ["Marketing", "Urgent"],
  },
  {
    id: 3,
    title: "SEO Optimization",
    dueDate: "June 5, 2025",
    progress: 80,
    members: ["JG", "SK"],
    tags: ["SEO", "Growth"],
  },
  {
    id: 4,
    title: "App Launch",
    dueDate: "July 1, 2025",
    progress: 25,
    members: ["ML", "TC"],
    tags: ["Mobile", "Launch"],
  },
];

export default function Projects() {
  return (
    <div className="overflow-auto">
      <motion.div
        className="p-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex justify-between mb-2">
          <motion.h1
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Projects
          </motion.h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">
            <Add />
            <span>New Project</span>
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-700">Manage and track your project progress</p>
        </div>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search Projects"
            className="px-4 py-2 border border-gray-300 rounded-md w-1/3"
          />
          <button className="px-4 py-2 border border-gray-300 rounded-md">Active</button>
          <button className="px-4 py-2 border border-gray-300 rounded-md">Sort by Date</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVert />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Due: {project.dueDate}</p>

              <div className="flex gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              <div className="flex gap-2">
                {project.members.map((initials, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center"
                  >
                    {initials}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
