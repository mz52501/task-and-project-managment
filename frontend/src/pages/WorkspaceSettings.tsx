import { useWorkspace } from "@/context/WorkspaceContext";
import { GeneralSection } from "@/components/workspace/GeneralSection";
import { MembersSection } from "@/components/workspace/MembersSection";
import { InviteSection } from "@/components/workspace/InviteSection";

const WorkspaceSettings = () => {
  const { currentWorkspace, isAdmin } = useWorkspace();

  if (!currentWorkspace) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspace Settings</h1>
          <p className="text-gray-500 text-sm">Manage your workspace and team.</p>
        </div>

        {isAdmin && <GeneralSection />}
        <MembersSection />
        {isAdmin && <InviteSection />}
      </div>
    </div>
  );
};

export default WorkspaceSettings;
