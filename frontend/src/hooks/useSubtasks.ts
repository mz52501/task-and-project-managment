import { useState } from "react";
import { Subtask } from "@/types/task";

const initialSubtasks: Subtask[] = [
  { id: 1, title: "Create dashboard layout", status: "Done" },
  { id: 2, title: "Implement charts component", status: "Done" },
  { id: 3, title: "Add user statistics", status: "In Progress" },
  { id: 4, title: "Implement activity feed", status: "To Do" },
  { id: 5, title: "Add responsive design", status: "To Do" },
];

export function useSubtasks() {
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);
  const [newSubtask, setNewSubtask] = useState("");

  function addSubtask() {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, { id: Date.now(), title: newSubtask.trim(), status: "To Do" }]);
    setNewSubtask("");
  }

  function deleteSubtask(id: number) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  return { subtasks, newSubtask, setNewSubtask, addSubtask, deleteSubtask };
}
