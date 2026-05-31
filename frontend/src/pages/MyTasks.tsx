import { Link } from "react-router-dom";
import { CheckSquare, Loader2, Calendar, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tagColor } from "@/constants/project";
import { stageBadgeStyle } from "@/constants/task";
import { useMyTasks } from "@/hooks/queries/useTasks";

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
  if (diff < 0)   return { label: "Overdue",      className: "text-red-600" };
  if (diff === 0) return { label: "Due today",    className: "text-orange-600" };
  if (diff === 1) return { label: "Due tomorrow", className: "text-yellow-600" };
  return { label: due.toLocaleDateString(), className: "text-gray-400" };
}

const MyTasks = () => {
  const { data: groups = [], isLoading: loading } = useMyTasks();
  const totalTasks = groups.reduce((sum, g) => sum + g.tasks.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-600 mt-1">
            {loading ? "Loading..." : `All tasks assigned to you, grouped by project and stage.`}
          </p>
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
            {groups.map((group) => {
              // group tasks by stage, preserving position order
              const stageMap = new Map<string, { position: number; tasks: typeof group.tasks }>();
              for (const task of group.tasks) {
                const key = task.stage_name ?? "No Stage";
                if (!stageMap.has(key)) {
                  stageMap.set(key, { position: task.stage_position ?? 999, tasks: [] });
                }
                stageMap.get(key)!.tasks.push(task);
              }
              const stages = [...stageMap.entries()].sort((a, b) => a[1].position - b[1].position);

              // need total stages for color fraction
              const totalStages = stageMap.size;

              return (
                <Card key={group.project_id} className="rounded-xl border bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <FolderKanban className="w-4 h-4 text-gray-500" />
                      <Link
                        to={`/projects/${group.project_id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {group.project_name}
                      </Link>
                    </CardTitle>
                    <span className="text-xs text-gray-500">
                      {group.tasks.length} task{group.tasks.length !== 1 ? "s" : ""}
                    </span>
                  </CardHeader>

                  <CardContent className="space-y-5 pt-0">
                    {stages.map(([stageName, { position, tasks: stageTasks }], stageIndex) => {
                      const fraction = totalStages <= 1 ? 1 : stageIndex / (totalStages - 1);
                      const badgeStyle = stageBadgeStyle(fraction);
                      return (
                        <div key={stageName}>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                              style={badgeStyle}
                            >
                              {stageName}
                            </span>
                            <span className="text-xs text-gray-400">{stageTasks.length}</span>
                          </div>

                          <div className="space-y-1.5">
                            {stageTasks.map((task) => {
                              const due = formatDueDate(task.due_date);
                              return (
                                <Link
                                  key={task.id}
                                  to={`/task/${task.id}`}
                                  className="block rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition px-4 py-3"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-medium text-gray-900 truncate">
                                          {task.title}
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className={`text-xs capitalize shrink-0 ${priorityStyles[task.priority] ?? priorityStyles.low}`}
                                        >
                                          {task.priority}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 flex-wrap">
                                        {due && (
                                          <span className={`inline-flex items-center gap-1 ${due.className}`}>
                                            <Calendar className="w-3 h-3" />
                                            {due.label}
                                          </span>
                                        )}
                                        {task.tags.length > 0 && (
                                          <div className="flex gap-1 flex-wrap">
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
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
