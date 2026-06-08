import React, { useEffect, useMemo } from "react";
import type { Id, KanbanTask } from "@/types";
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
import {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskApi,
  KanbanTaskFromApi,
} from "@/api/tasks";
import { WorkflowStage } from "@/types";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Loader2 } from "lucide-react";

interface Props {
  projectId?: string;
  stages?: WorkflowStage[];
  height?: string;
}

function apiTaskToKanban(t: KanbanTaskFromApi): KanbanTask {
  return {
    id: t.id,
    columnId: t.workflow_stage_id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    due_date: t.due_date,
    assignees: t.assignees.map((a) => ({ id: a.id, initials: a.initials })),
    tags: t.tags,
    time_tracked: t.time_tracked ?? undefined,
    subtask_count: t.subtask_count,
    comment_count: t.comment_count,
  };
}

function getTaskFromDragData(data: Record<string, unknown> | undefined): KanbanTask | null {
  if (data?.type === "Task" && data.task && typeof data.task === "object") {
    return data.task as KanbanTask;
  }
  return null;
}

function KanbanBoard({ projectId, stages = [], height = "calc(100vh - 64px)" }: Props) {
  const { currentWorkspace } = useWorkspace();
  const columns = React.useMemo(
    () => stages.map((s) => ({ id: s.id, title: s.name, position: s.position })),
    [stages]
  );
  const [tasks, setTasks] = React.useState<KanbanTask[]>([]);
  const [activeTask, setActiveTask] = React.useState<KanbanTask | null>(null);
  const [loading, setLoading] = React.useState(true);
  const dragStartColumnRef = React.useRef<Id | null>(null);

  useEffect(() => {
    if (!projectId || !currentWorkspace) return;
    let cancelled = false;
    getProjectTasks(currentWorkspace.id, projectId)
      .then((data) => {
        if (!cancelled) setTasks(data.map(apiTaskToKanban));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const columnsIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  function onDragStart(event: DragStartEvent) {
    const task = getTaskFromDragData(event.active.data.current);
    if (task) {
      setActiveTask(task);
      dragStartColumnRef.current = task.columnId;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const isOverColumn = over.data.current?.type === "Column";

    const newColumnId: Id | undefined = isOverColumn
      ? over.id
      : tasks.find((t) => t.id === over.id)?.columnId;

    if (!newColumnId) return;

    if (dragStartColumnRef.current !== newColumnId && currentWorkspace) {
      updateTask(currentWorkspace.id, taskId, { workflow_stage_id: String(newColumnId) }).catch(
        () => {}
      );
    }
    dragStartColumnRef.current = null;

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === active.id);
      if (activeIndex === -1) return prev;
      const updated = [...prev];
      updated[activeIndex] = { ...updated[activeIndex], columnId: newColumnId };
      if (isOverColumn) return arrayMove(updated, activeIndex, activeIndex);
      const overIndex = updated.findIndex((t) => t.id === over.id);
      return arrayMove(updated, activeIndex, overIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const isOverColumn = over.data.current?.type === "Column";
    const activeIndex = tasks.findIndex((t) => t.id === active.id);
    const overIndex = tasks.findIndex((t) => t.id === over.id);

    if (isOverColumn) {
      if (tasks[activeIndex]?.columnId !== over.id) {
        setTasks((prev) => {
          const updated = [...prev];
          updated[activeIndex] = { ...updated[activeIndex], columnId: over.id };
          return arrayMove(updated, activeIndex, activeIndex);
        });
      }
    } else {
      if (tasks[activeIndex]?.columnId !== tasks[overIndex]?.columnId) {
        setTasks((prev) => {
          const updated = [...prev];
          updated[activeIndex] = { ...updated[activeIndex], columnId: prev[overIndex].columnId };
          return arrayMove(updated, activeIndex, overIndex);
        });
      }
    }
  }

  function deleteTask(id: Id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (currentWorkspace) deleteTaskApi(currentWorkspace.id, String(id)).catch(() => {});
  }

  async function onAddTask(columnId: Id, title: string) {
    if (!currentWorkspace || !projectId) return;
    const created = await createTask(currentWorkspace.id, {
      title,
      project_id: projectId,
      workflow_stage_id: String(columnId),
      priority: "medium",
    });
    setTasks((prev) => [
      ...prev,
      {
        id: created.id,
        columnId,
        title: created.title,
        priority: created.priority as KanbanTask["priority"],
        assignees: [],
        tags: [],
      },
    ]);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto min-h-0 gap-4 kanban-scroll pb-3" style={{ height }}>
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
  );
}

export default KanbanBoard;
