import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, Loader2, Calendar, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMyTasks, MyTasksGroup } from "@/api/tasks";
import { tagColor } from "@/constants/project";
import { useWorkspace } from "@/context/WorkspaceContext";

const priorityStyles: Record<string, string> = {
  high:   "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low:    "bg-green-100 text-green-800 border-green-200",
};

function formatDueDate(dateStr: string | null): { label: string; className: string } | null {
  if (!dateStr) return null;
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return { label: "Overdue",    className: "text-red-600" };
  if (diff === 0) return { label: "Due today",  className: "text-orange-600" };
  if (diff === 1) return { label: "Due tomorrow", className: "text-yellow-600" };
  return { label: due.toLocaleDateString(), className: "text-gray-400" };
}

const MyTasks = () => {
  const { currentWorkspace } = useWorkspace();
  const [groups, setGroups] = useState<MyTasksGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentWorkspace) return;
    getMyTasks(currentWorkspace.id)
      .then(setGroups)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentWorkspace?.id]);

  const totalTasks = groups.reduce((sum, g) => sum + g.tasks.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-center gap-3 mb-8">
          <CheckSquare className="w-7 h-7 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {loading ? "Loading..." : `${totalTasks} task${totalTasks !== 1 ? "s" : ""} assigned to you`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <CheckSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No tasks assigned to you</p>
            <p className="text-sm mt-1">Tasks assigned to you across all projects will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.project_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                {/* Project header */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <FolderKanban className="w-4 h-4 text-gray-400" />
                  <Link
                    to={`/projects/${group.project_id}`}
                    className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {group.project_name}
                  </Link>
                  <span className="ml-auto text-xs text-gray-400">{group.tasks.length} task{group.tasks.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Task rows */}
                <div className="divide-y divide-gray-100">
                  {group.tasks.map((task) => {
                    const due = formatDueDate(task.due_date);
                    return (
                      <Link
                        key={task.id}
                        to={`/task/${task.id}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.tags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className={`text-xs px-1.5 py-0.5 rounded-full border ${tagColor(tag.name)}`}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {task.stage_name && (
                            <span className="text-xs text-gray-400 hidden sm:block">{task.stage_name}</span>
                          )}

                          {due && (
                            <span className={`flex items-center gap-1 text-xs ${due.className}`}>
                              <Calendar className="w-3 h-3" />
                              {due.label}
                            </span>
                          )}

                          <Badge
                            variant="secondary"
                            className={`text-xs capitalize ${priorityStyles[task.priority] ?? priorityStyles.low}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
