import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, User, Plus, Loader2 } from "lucide-react";
import { getProjects } from "@/api/projects";
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

interface ProjectWithCounts extends Project {
  total_tasks: number;
  completed_tasks: number;
  team_members: number;
}

const Projects = () => {
  const navigate = useNavigate();
  const [owned, setOwned] = useState<ProjectWithCounts[]>([]);
  const [member, setMember] = useState<ProjectWithCounts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => {
        setOwned(data.owned as ProjectWithCounts[]);
        setMember(data.member as ProjectWithCounts[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const all = [...owned, ...member];

  function progressPercent(p: ProjectWithCounts) {
    if (!p.total_tasks) return 0;
    return Math.round((p.completed_tasks / p.total_tasks) * 100);
  }

  return (
    <div className="bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage and track your project progress</p>
          </div>
          <button
            onClick={() => navigate("/projects/new")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Project
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : all.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-sm mt-1">Create your first project to get started.</p>
          </div>
        ) : (
          <>
            {owned.length > 0 && member.length > 0 && (
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Your Projects
              </h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {owned.map((project) => (
                <ProjectCard key={project.id} project={project} progressPercent={progressPercent} />
              ))}
            </div>

            {member.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-8 mb-3">
                  Member Of
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {member.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      progressPercent={progressPercent}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function ProjectCard({
  project,
  progressPercent,
}: {
  project: ProjectWithCounts;
  progressPercent: (p: ProjectWithCounts) => number;
}) {
  const pct = progressPercent(project);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold text-gray-800 leading-tight">{project.name}</h2>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2 ${statusColors[project.status] ?? "bg-gray-100 text-gray-800"}`}
        >
          {statusLabels[project.status] ?? project.status}
        </span>
      </div>

      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="text-sm text-gray-600 flex justify-between mb-1">
        <span>Progress</span>
        <span>
          {project.completed_tasks ?? 0}/{project.total_tasks ?? 0} tasks
        </span>
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
        <Link
          to={`/projects/${project.id}`}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Open Project
        </Link>
      </div>
    </div>
  );
}

export default Projects;
