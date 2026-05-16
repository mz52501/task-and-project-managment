import React, { useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
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

function KanbanBoard() {
  const [columns, setColumns] = React.useState<Column[]>([
    { id: 1, title: "To Do" },
    {
      id: 2,
      title: "In Progress",
    },
    { id: 3, title: "Done" },
  ]);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 1, columnId: 1, content: "Task 1" },
    { id: 2, columnId: 1, content: "Task 2" },
    { id: 3, columnId: 1, content: "Task 3" },
    { id: 4, columnId: 2, content: "Task 4" },
    { id: 5, columnId: 2, content: "Task 5" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, //10px
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const isOverColumn = over.data.current?.type === "Column";

    if (!isOverColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);
        const overTaskIndex = tasks.findIndex((task) => task.id === over.id);
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    } else {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);
        tasks[activeTaskIndex].columnId = Number(over.id);
        const dropIndex = tasks.filter((task) => task.columnId <= over.id).length - 1;
        return arrayMove(tasks, activeTaskIndex, dropIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const isOverColumn = over.data.current?.type === "Column";
    const activeId = active.id;
    const overId = over.id;
    const activeIndex = tasks.findIndex((task) => task.id === activeId);
    const overIndex = tasks.findIndex((task) => task.id === overId);

    console.log("activeIndex: " + activeIndex + ", going over " + overIndex);

    if (isOverColumn) {
      if (tasks[activeIndex].columnId !== Number(overId)) return;
    } else {
      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        setTasks((tasks) => {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex);
        });
      }
    }
  }

  function deleteTask(id: Id) {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  }

  return (
    <div className="flex-grow flex p-6">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex w-full h-3/4 justify-center overflow-x-auto">
          {columns.map((column) => (
            <ColumnContainer
              key={column.id}
              tasks={tasks.filter((task) => task.columnId === column.id)}
              deleteTask={deleteTask}
              column={column}
            />
          ))}
        </div>
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
