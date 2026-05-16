import React from "react";
import { Link } from "react-router-dom";
import { Folder, Users, Calendar } from "lucide-react";

const ProjectSnapshots = () => {
  const projects = [
    {
      id: 1,
      name: "TaskFlow Mobile App",
      progress: 75,
      tasksCompleted: 12,
      totalTasks: 16,
      teamMembers: 4,
      dueDate: "Dec 15, 2024",
      status: "on-track",
    },
    {
      id: 2,
      name: "Website Redesign",
      progress: 45,
      tasksCompleted: 9,
      totalTasks: 20,
      teamMembers: 3,
      dueDate: "Jan 20, 2025",
      status: "on-track",
    },
    {
      id: 3,
      name: "API Development",
      progress: 90,
      tasksCompleted: 18,
      totalTasks: 20,
      teamMembers: 2,
      dueDate: "Dec 10, 2024",
      status: "ahead",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ahead":
        return "text-green-600 bg-green-100";
      case "on-track":
        return "text-blue-600 bg-blue-100";
      case "behind":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center text-gray-800">
          <Folder className="w-5 h-5 text-blue-600 mr-2" />
          Active Projects
        </h2>
        <Link
          to="/projects"
          className="text-sm border rounded px-3 py-1 hover:bg-gray-50 text-gray-700"
        >
          View All
        </Link>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 hover:shadow transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {project.teamMembers} members
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due {project.dueDate}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status.replace("-", " ")}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {project.tasksCompleted} of {project.totalTasks} tasks completed
                </span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                <div className="bg-blue-600 h-2" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSnapshots;
