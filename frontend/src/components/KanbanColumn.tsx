import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { Id, Task } from "@/types";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  deleteTask: (id: Id) => void;
}

export default function KanbanColumn({ id, title, tasks, deleteTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded-xl p-4 shadow-md min-h-[300px]">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
        ))}
      </div>
    </div>
  );
}
