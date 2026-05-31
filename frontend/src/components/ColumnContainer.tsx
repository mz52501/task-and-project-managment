import { Column, Id, KanbanTask as Task } from "@/types";
import { SortableContext } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { useMemo, useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  column: Column;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  onAddTask: (columnId: Id, title: string) => Promise<void>;
}

function ColumnContainer({ column, tasks, deleteTask, onAddTask }: Props) {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `${column.id}`,
    data: { type: "Column", columnId: column.id },
  });

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const handleConfirm = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setAdding(false);
      setTitle("");
      return;
    }
    setSaving(true);
    await onAddTask(column.id, trimmed);
    setSaving(false);
    setTitle("");
    setAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") {
      setAdding(false);
      setTitle("");
    }
  };

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

        {adding && (
          <div className="bg-white rounded-lg border border-blue-300 shadow-sm p-2 mt-1">
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleConfirm}
              disabled={saving}
              placeholder="Task title..."
              className="w-full text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
        )}
      </div>

      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-gray-600 text-xs"
          onClick={() => setAdding(true)}
          disabled={adding}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Task
        </Button>
      </div>
    </div>
  );
}

export default ColumnContainer;
