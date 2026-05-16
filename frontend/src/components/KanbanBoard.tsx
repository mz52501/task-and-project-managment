import React, { useMemo } from "react";
import type { Column, Id, KanbanTask as Task } from "@/types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

interface Props {
  projectName?: string;
  projectId?: string;
  initialColumns?: Column[];
  initialTasks?: Task[];
}

const DEFAULT_COLUMNS: Column[] = [
  { id: "col-1", title: "To Do", position: 1 },
  { id: "col-2", title: "In Progress", position: 2 },
  { id: "col-3", title: "Review", position: 3 },
  { id: "col-4", title: "Done", position: 4 },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "t-1",
    columnId: "col-1",
    title: "Design user authentication flow",
    description: "Create wireframes and mockups for login/signup",
    priority: "high",
    assignees: [{ id: "u1", initials: "JD", color: "#6366f1" }],
    time_tracked: "2h 30m",
    subtask_count: 3,
    comment_count: 2,
    tags: [{ id: "tag-1", name: "Design", color: "#6366f1" }],
  },
  {
    id: "t-2",
    columnId: "col-1",
    title: "Setup database schema",
    description: "Define tables and relationships for core entities",
    priority: "medium",
    assignees: [{ id: "u2", initials: "SM", color: "#0ea5e9" }],
    time_tracked: "1h 15m",
    subtask_count: 5,
    comment_count: 1,
    tags: [{ id: "tag-2", name: "Backend", color: "#10b981" }],
  },
  {
    id: "t-3",
    columnId: "col-2",
    title: "Implement user dashboard",
    description: "Build responsive dashboard with charts and stats",
    priority: "high",
    assignees: [
      { id: "u3", initials: "MJ", color: "#f59e0b" },
      { id: "u4", initials: "ER", color: "#ef4444" },
    ],
    time_tracked: "8h 45m",
    subtask_count: 4,
    comment_count: 7,
    tags: [
      { id: "tag-3", name: "Frontend", color: "#8b5cf6" },
      { id: "tag-4", name: "Q2", color: "#f59e0b" },
    ],
  },
  {
    id: "t-4",
    columnId: "col-2",
    title: "API integration",
    description: "Connect frontend with backend services",
    priority: "medium",
    assignees: [{ id: "u4", initials: "ER", color: "#ef4444" }],
    time_tracked: "5h 20m",
    subtask_count: 2,
    comment_count: 3,
    tags: [{ id: "tag-2", name: "Backend", color: "#10b981" }],
  },
  {
    id: "t-5",
    columnId: "col-3",
    title: "Payment gateway integration",
    description: "Integrate Stripe payment system",
    priority: "high",
    assignees: [{ id: "u5", initials: "AB", color: "#06b6d4" }],
    time_tracked: "12h 10m",
    subtask_count: 6,
    comment_count: 5,
    tags: [{ id: "tag-5", name: "Urgent", color: "#ef4444" }],
  },
  {
    id: "t-6",
    columnId: "col-4",
    title: "Project setup and configuration",
    description: "Initialize React app with all dependencies",
    priority: "low",
    assignees: [{ id: "u1", initials: "JD", color: "#6366f1" }],
    time_tracked: "3h 0m",
    subtask_count: 8,
    comment_count: 4,
  },
  {
    id: "t-7",
    columnId: "col-4",
    title: "Design system components",
    description: "Create reusable UI component library",
    priority: "medium",
    assignees: [{ id: "u2", initials: "SM", color: "#0ea5e9" }],
    time_tracked: "6h 30m",
    subtask_count: 12,
    comment_count: 8,
    tags: [
      { id: "tag-1", name: "Design", color: "#6366f1" },
      { id: "tag-3", name: "Frontend", color: "#8b5cf6" },
    ],
  },
];

function KanbanBoard({
  projectName = "E-commerce Platform",
  projectId: _projectId = "mock-project-id",
  initialColumns = DEFAULT_COLUMNS,
  initialTasks = DEFAULT_TASKS,
}: Props) {
  const [columns] = React.useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);

  const columnsIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const isOverColumn = over.data.current?.type === "Column";

    if (!isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        tasks[activeIndex].columnId = over.id;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const isOverColumn = over.data.current?.type === "Column";
    const activeIndex = tasks.findIndex((t) => t.id === active.id);
    const overIndex = tasks.findIndex((t) => t.id === over.id);

    if (isOverColumn) {
      if (tasks[activeIndex]?.columnId !== over.id) {
        setTasks((tasks) => {
          tasks[activeIndex].columnId = over.id;
          return arrayMove(tasks, activeIndex, activeIndex);
        });
      }
    } else {
      if (tasks[activeIndex]?.columnId !== tasks[overIndex]?.columnId) {
        setTasks((tasks) => {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex);
        });
      }
    }
  }

  function deleteTask(id: Id) {
    setTasks((tasks) => tasks.filter((t) => t.id !== id));
  }

  function onAddTask(_columnId: Id) {
    // TODO: open create task modal, pass columnId as default workflow_stage_id
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-x-auto min-h-0 flex flex-col items-center">
        <div className="w-full max-w-6xl px-6 pt-8 pb-6 flex-none">
          <h1 className="text-3xl font-bold text-gray-900">{projectName} Board</h1>
          <p className="text-gray-500 mt-1">Track progress and manage tasks visually</p>
        </div>

        <div className="flex-1 min-h-0 w-full max-w-6xl px-6 pb-6">
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <SortableContext items={columnsIds}>
              <div className="flex gap-4 h-full">
                {columns.map((column) => (
                  <ColumnContainer
                    key={column.id}
                    column={column}
                    tasks={tasks.filter((t) => t.columnId === column.id)}
                    deleteTask={deleteTask}
                    onAddTask={onAddTask}
                  />
                ))}
              </div>
            </SortableContext>

            {createPortal(
              <DragOverlay>
                {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} />}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default KanbanBoard;
