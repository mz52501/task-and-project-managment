import { Id, KanbanTask as Task, TaskDragData } from "@/types";
import { tagColor } from "@/constants/project";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MessageSquare, GitBranch, Trash2 } from "lucide-react";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
}

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

function TaskCard({ task, deleteTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 h-32"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing bg-white relative">
        {mouseIsOver && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="absolute top-2 right-2 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex justify-between items-start gap-2 pr-5">
            <Link
              to={`/task/${task.id}`}
              className="text-sm font-medium leading-tight hover:text-indigo-600 transition-colors line-clamp-2"
              onClick={(e) => e.stopPropagation()}
            >
              {task.title}
            </Link>
            <Badge
              variant="secondary"
              className={`text-xs shrink-0 ${priorityStyles[task.priority] ?? priorityStyles.low}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-3 px-3 space-y-2">
          {task.description && (
            <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
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

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              {task.time_tracked && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {task.time_tracked}
                </span>
              )}
              {task.subtask_count !== undefined && task.subtask_count > 0 && (
                <span className="flex items-center gap-0.5">
                  <GitBranch className="w-3 h-3" />
                  {task.subtask_count}
                </span>
              )}
              {task.comment_count !== undefined && task.comment_count > 0 && (
                <span className="flex items-center gap-0.5">
                  <MessageSquare className="w-3 h-3" />
                  {task.comment_count}
                </span>
              )}
            </div>

            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 3).map((a) => (
                  <Avatar key={a.id} className="w-5 h-5 border border-white">
                    <AvatarFallback
                      className="text-[9px] font-medium"
                      style={a.color ? { backgroundColor: a.color, color: "#fff" } : undefined}
                    >
                      {a.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <Avatar className="w-5 h-5 border border-white">
                    <AvatarFallback className="text-[9px] bg-gray-200 text-gray-600">
                      +{task.assignees.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskCard;
