import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Project } from "@/types";

const statusColors: Record<string, string> = {
  active: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  archived: "Archived",
};

export interface ProjectWithCounts extends Project {
  total_tasks: number;
  completed_tasks: number;
  team_members: number;
}

interface Props {
  project: ProjectWithCounts;
}

export function ProjectCard({ project }: Props) {
  const pct = project.total_tasks
    ? Math.round((project.completed_tasks / project.total_tasks) * 100)
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold text-gray-800 leading-tight">{project.name}</h2>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2 ${statusColors[project.status] ?? "bg-gray-100 text-gray-800"}`}>
          {statusLabels[project.status] ?? project.status}
        </span>
      </div>

      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="text-sm text-gray-600 flex justify-between mb-1">
        <span>Progress</span>
        <span>{project.completed_tasks ?? 0}/{project.total_tasks ?? 0} tasks</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        {project.deadline && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(project.deadline).toLocaleDateString()}
          </div>
        )}
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {project.team_members ?? 0} members
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t">
        <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline text-sm font-medium">
          Open Project
        </Link>
      </div>
    </div>
  );
}
