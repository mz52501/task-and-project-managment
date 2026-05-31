import React, { useEffect, useRef, useState } from "react";
import { Timer, Play, Square, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getTimeEntries } from "@/api/tasks";
import { getTasks } from "@/api/tasks";
import { TimeEntry, Task } from "@/types";
import { useTimer } from "@/context/TimerContext";
import { useWorkspace } from "@/context/WorkspaceContext";

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

const TimeTrackingWidget = () => {
  const { isRunning, elapsed, taskTitle, start, stop } = useTimer();
  const { currentWorkspace } = useWorkspace();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPicker) return;
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  useEffect(() => {
    if (!currentWorkspace) return;
    Promise.all([getTimeEntries(), getTasks(currentWorkspace.id)])
      .then(([e, t]) => {
        setEntries(e);
        setTasks(
          [...t.assigned, ...t.created].filter(
            (t, i, arr) => arr.findIndex((x) => x.id === t.id) === i
          )
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isRunning]);

  const today = new Date().toISOString().split("T")[0];
  const weekStart = (() => {
    const d = new Date();
    const day = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - (day - 1));
    return d.toISOString().split("T")[0];
  })();

  const todayMinutes = entries
    .filter((e) => e.work_date === today)
    .reduce((s, e) => s + e.duration_minutes, 0);
  const weekMinutes = entries
    .filter((e) => e.work_date >= weekStart)
    .reduce((s, e) => s + e.duration_minutes, 0);
  const recentEntries = entries.slice(0, 3);

  async function handleStop() {
    await stop();
    const updated = await getTimeEntries();
    setEntries(updated);
  }

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center text-base">
          <Timer className="w-5 h-5 text-blue-600 mr-2" />
          Time Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono font-bold text-gray-900 mb-1">
            {formatElapsed(elapsed)}
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {isRunning ? `Working on: ${taskTitle ?? "—"}` : "No timer running"}
          </p>

          {!isRunning ? (
            <div className="relative inline-block" ref={pickerRef}>
              <button
                onClick={() => setShowPicker((v) => !v)}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                <Play className="w-4 h-4" /> Start
                <ChevronDown className="w-3 h-3" />
              </button>
              {showPicker && (
                <div className="absolute left-0 top-full mt-1 z-20 bg-white border rounded-lg shadow-lg w-56 max-h-48 overflow-y-auto text-left">
                  {tasks.length === 0 ? (
                    <p className="text-xs text-gray-400 p-3">No assigned tasks</p>
                  ) : (
                    tasks.map((t) => (
                      <button
                        key={t.id}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 truncate"
                        onClick={() => {
                          start(t.id, t.title);
                          setShowPicker(false);
                        }}
                      >
                        {t.title}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-1 mx-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              <Square className="w-4 h-4" /> Stop & Save
            </button>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Today's Total</span>
            <span className="font-semibold">{loading ? "—" : formatMinutes(todayMinutes)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This Week</span>
            <span className="font-semibold">{loading ? "—" : formatMinutes(weekMinutes)}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Recent Entries</h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : recentEntries.length === 0 ? (
            <p className="text-xs text-gray-400">No entries yet</p>
          ) : (
            <div className="space-y-2 text-sm">
              {recentEntries.map((e) => {
                const taskName =
                  tasks.find((t) => t.id === e.task_id)?.title ?? e.comment ?? "Time entry";
                return (
                  <div key={e.id} className="flex justify-between">
                    <span className="text-gray-600 truncate max-w-[140px]">{taskName}</span>
                    <span className="font-medium shrink-0">
                      {formatMinutes(e.duration_minutes)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTrackingWidget;
