import { Column, Id, KanbanTask as Task } from "@/types";
import { SortableContext } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  column: Column;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  onAddTask: (columnId: Id) => void;
}

function ColumnContainer({ column, tasks, deleteTask, onAddTask }: Props) {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `${column.id}`,
    data: { type: "Column", columnId: column.id },
  });

  return (
    <div className="flex flex-col w-72 min-w-[18rem] bg-gray-50 rounded-lg border border-gray-200 h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm">{column.title}</h3>
        <span className="text-xs font-medium bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>

      <div ref={setDroppableRef} className="flex flex-col gap-2 p-3 flex-grow overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
          ))}
        </SortableContext>
      </div>

      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          
          className="w-full justify-start text-gray-400 hover:text-gray-600 text-xs"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Task
        </Button>
      </div>
    </div>
  );
}

export default ColumnContainer;
