import { useEffect, useState } from "react";
import { getTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry } from "@/api/tasks";
import { TimeEntry } from "@/types";
import { useTimer } from "@/context/TimerContext";
import { toast } from "sonner";

export function minutesToDisplay(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function parseHoursInput(input: string): number | null {
  const cleaned = input.trim().toLowerCase();
  const hoursMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*h/);
  const minsMatch = cleaned.match(/(\d+)\s*m/);
  let total = 0;
  if (hoursMatch) total += Math.round(parseFloat(hoursMatch[1]) * 60);
  if (minsMatch) total += parseInt(minsMatch[1], 10);
  if (!hoursMatch && !minsMatch) {
    const num = parseFloat(cleaned);
    if (!isNaN(num)) total = Math.round(num * 60);
  }
  return total > 0 ? total : null;
}

export function useTaskTimeEntries(taskId: string) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ hours: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ hours: "", description: "" });
  const { isRunning } = useTimer();

  useEffect(() => {
    if (!taskId) return;
    getTimeEntries()
      .then((all) => setTimeEntries(all.filter((e) => e.task_id === taskId)))
      .catch(() => toast.error("Failed to load time entries"));
  }, [taskId, isRunning]);

  async function logTime() {
    const minutes = parseHoursInput(newEntry.hours);
    if (!minutes) {
      toast.error("Invalid time format — try 2h 30m");
      return;
    }
    try {
      const created = await createTimeEntry({
        task_id: taskId,
        duration_minutes: minutes,
        work_date: new Date().toISOString().split("T")[0],
        comment: newEntry.description || undefined,
      });
      setTimeEntries((prev) => [created, ...prev]);
      setNewEntry({ hours: "", description: "" });
      toast.success("Time logged");
    } catch {
      toast.error("Failed to log time");
    }
  }

  function startEdit(entry: TimeEntry) {
    setEditingId(entry.id);
    setEditDraft({
      hours: minutesToDisplay(entry.duration_minutes),
      description: entry.comment ?? "",
    });
  }

  async function saveEdit(id: string) {
    const minutes = parseHoursInput(editDraft.hours);
    if (!minutes) {
      toast.error("Invalid time format — try 2h 30m");
      return;
    }
    try {
      const updated = await updateTimeEntry(id, {
        duration_minutes: minutes,
        comment: editDraft.description || undefined,
      });
      setTimeEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      setEditingId(null);
    } catch {
      toast.error("Failed to update time entry");
    }
  }

  async function removeEntry(id: string) {
    try {
      await deleteTimeEntry(id);
      setTimeEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Time entry deleted");
    } catch {
      toast.error("Failed to delete time entry");
    }
  }

  const totalMinutes = timeEntries.reduce((sum, e) => sum + e.duration_minutes, 0);

  return {
    timeEntries,
    newEntry,
    setNewEntry,
    logTime,
    editingId,
    setEditingId,
    editDraft,
    setEditDraft,
    startEdit,
    saveEdit,
    removeEntry,
    totalTracked: minutesToDisplay(totalMinutes),
    minutesToDisplay,
  };
}
