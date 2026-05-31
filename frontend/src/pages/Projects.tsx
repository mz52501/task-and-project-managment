import { useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/queries/useProjects";
import { ProjectCard, ProjectWithCounts } from "@/components/projects/ProjectCard";

const Projects = () => {
  const navigate = useNavigate();
  const { data, isLoading: loading } = useProjects();
  const owned = (data?.owned ?? []) as ProjectWithCounts[];
  const member = (data?.member ?? []) as ProjectWithCounts[];
  const all = [...owned, ...member];

  return (
    <div className="bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage and track your project progress</p>
          </div>
          <Button onClick={() => navigate("/projects/new")}>
            <Plus className="w-4 h-4" />
            Create New Project
          </Button>
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
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {member.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-8 mb-3">
                  Member Of
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {member.map((project) => (
                    <ProjectCard key={project.id} project={project} />
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

export default Projects;
