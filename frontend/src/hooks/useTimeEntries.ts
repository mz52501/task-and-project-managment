import { useState } from "react";

export interface LocalTimeEntry {
  id: number;
  date: string;
  hours: string;
  description: string;
}

const initialEntries: LocalTimeEntry[] = [
  { id: 1, date: "2024-05-28", hours: "2h 30m", description: "Initial dashboard setup and layout" },
  {
    id: 2,
    date: "2024-05-27",
    hours: "3h 15m",
    description: "Implemented chart components using Recharts",
  },
  {
    id: 3,
    date: "2024-05-26",
    hours: "3h 0m",
    description: "Designed dashboard wireframes and component structure",
  },
];

export function useTimeEntries() {
  const [timeEntries, setTimeEntries] = useState<LocalTimeEntry[]>(initialEntries);
  const [newTimeEntry, setNewTimeEntry] = useState({ hours: "", description: "" });
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [editEntryData, setEditEntryData] = useState({ hours: "", description: "" });

  function logTime() {
    if (!newTimeEntry.hours.trim()) return;
    setTimeEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        hours: newTimeEntry.hours,
        description: newTimeEntry.description,
      },
    ]);
    setNewTimeEntry({ hours: "", description: "" });
  }

  function deleteTimeEntry(id: number) {
    setTimeEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function startEditEntry(entry: LocalTimeEntry) {
    setEditingEntry(entry.id);
    setEditEntryData({ hours: entry.hours, description: entry.description });
  }

  function saveEditEntry(id: number) {
    setTimeEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...editEntryData } : e)));
    setEditingEntry(null);
  }

  return {
    timeEntries,
    newTimeEntry,
    setNewTimeEntry,
    editingEntry,
    setEditingEntry,
    editEntryData,
    setEditEntryData,
    logTime,
    deleteTimeEntry,
    startEditEntry,
    saveEditEntry,
  };
}
