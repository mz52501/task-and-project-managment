import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";

const Projects2 = () => {
  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      description: "Building a modern e-commerce solution with React and Node.js",
      status: "In Progress",
      dueDate: "2024-06-15",
      team: ["John", "Sarah", "Mike"],
      tasksCount: 24,
      completedTasks: 16,
    },
    {
      id: 2,
      name: "Mobile App Design",
      description: "UI/UX design for the company's new mobile application",
      status: "Review",
      dueDate: "2024-05-30",
      team: ["Emma", "David"],
      tasksCount: 12,
      completedTasks: 10,
    },
    {
      id: 3,
      name: "Database Migration",
      description: "Migrating legacy database to new cloud infrastructure",
      status: "Planning",
      dueDate: "2024-07-01",
      team: ["Alex", "Tom", "Lisa", "James"],
      tasksCount: 8,
      completedTasks: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-yellow-100 text-yellow-800";
      case "Planning":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 flex-grow">
      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage and track your project progress</p>
          </div>
          <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-semibold shadow">
            Create New Project
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{project.name}</h2>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>

              <div className="text-sm text-gray-600 flex justify-between mb-1">
                <span>Progress</span>
                <span>
                  {project.completedTasks}/{project.tasksCount} tasks
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(project.completedTasks / project.tasksCount) * 100}%`,
                  }}
                />
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.dueDate}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {project.team.length} members
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t pt-4">
                <Link
                  to={`/task/${project.id}`}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  View Tasks
                </Link>
                <Link to="/kanban" className="text-blue-600 hover:underline text-sm font-medium">
                  Open Board
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects2;
