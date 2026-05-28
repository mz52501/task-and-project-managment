import React, { useEffect, useMemo } from "react";
import type { Column, Id, KanbanTask } from "@/types";
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
import { getProjectTasks, KanbanTaskFromApi } from "@/api/tasks";
import { WorkflowStage } from "@/types";
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

function KanbanBoard({ projectId, stages = [], height = "calc(100vh - 64px)" }: Props) {
  const [columns, setColumns] = React.useState<Column[]>([]);
  const [tasks, setTasks] = React.useState<KanbanTask[]>([]);
  const [activeTask, setActiveTask] = React.useState<KanbanTask | null>(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (stages.length > 0) {
      setColumns(stages.map((s) => ({ id: s.id, title: s.name, position: s.position })));
    }
  }, [stages]);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    getProjectTasks(projectId)
      .then((data) => setTasks(data.map(apiTaskToKanban)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  const columnsIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

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
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === active.id);
        const overIndex = prev.findIndex((t) => t.id === over.id);
        prev[activeIndex].columnId = prev[overIndex].columnId;
        return arrayMove(prev, activeIndex, overIndex);
      });
    } else {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === active.id);
        prev[activeIndex].columnId = over.id;
        return arrayMove(prev, activeIndex, activeIndex);
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
        setTasks((prev) => {
          prev[activeIndex].columnId = over.id;
          return arrayMove(prev, activeIndex, activeIndex);
        });
      }
    } else {
      if (tasks[activeIndex]?.columnId !== tasks[overIndex]?.columnId) {
        setTasks((prev) => {
          prev[activeIndex].columnId = prev[overIndex].columnId;
          return arrayMove(prev, activeIndex, overIndex);
        });
      }
    }
  }

  function deleteTask(id: Id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function onAddTask(_columnId: Id) {
    // TODO: open create task modal
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto min-h-0 gap-4" style={{ height }}>
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
