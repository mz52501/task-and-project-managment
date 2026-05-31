import { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import KanbanBoard from "@/components/KanbanBoard";
import { ProjectHeaderCard } from "@/components/projects/ProjectHeaderCard";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { AddMemberDialog } from "@/components/projects/AddMemberDialog";
import { useProject } from "@/hooks/queries/useProjects";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ProjectDetail as ProjectDetailType, ProjectMemberDetail } from "@/api/projects";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const { data: project, isLoading } = useProject(id ?? "");
  const [editOpen, setEditOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  function updateCache(updater: (prev: ProjectDetailType) => ProjectDetailType) {
    queryClient.setQueryData(
      ["project", currentWorkspace?.id, id],
      (prev: ProjectDetailType | undefined) => prev ? updater(prev) : prev
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-50 text-gray-500">
        Project not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="px-8 pt-6 pb-0 flex-none max-w-[1800px] mx-auto w-full">
        <ProjectHeaderCard
          project={project}
          onEdit={() => setEditOpen(true)}
          onAddMember={() => setAddMemberOpen(true)}
        />
      </div>

      <div className="flex-1 px-8 py-4 min-h-0 overflow-hidden max-w-[1800px] mx-auto w-full">
        <div className="h-full bg-white rounded-xl border border-gray-200 overflow-hidden p-4">
          <KanbanBoard projectId={project.id} stages={project.stages} height="100%" />
        </div>
      </div>

      <EditProjectDialog
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={(updated) => updateCache((prev) => ({ ...prev, ...updated }))}
      />

      <AddMemberDialog
        project={project}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        onAdded={(member: ProjectMemberDetail) =>
          updateCache((prev) => ({ ...prev, members: [...prev.members, member] }))
        }
      />
    </div>
  );
};

export default ProjectDetail;
