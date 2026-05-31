import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getTimerStatus, startTimer, stopTimer } from "@/api/timer";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";

interface TimerContextValue {
  isRunning: boolean;
  elapsed: number;
  taskId: string | null;
  taskTitle: string | null;
  start: (taskId: string, taskTitle: string) => Promise<void>;
  stop: () => Promise<void>;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { currentWorkspace } = useWorkspace();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);

  function startCounting(startedAt: Date) {
    startedAtRef.current = new Date(startedAt).getTime();
    setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current!) / 1000));
    }, 1000);
  }

  useEffect(() => {
    if (!localStorage.getItem("token") || !currentWorkspace) return;

    getTimerStatus(currentWorkspace.id)
      .then((status) => {
        if (status.running && status.started_at) {
          setIsRunning(true);
          setTaskId(status.task_id ?? null);
          setTaskTitle(status.task_title ?? null);
          startCounting(new Date(status.started_at));
        }
      })
      .catch(() => {});

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentWorkspace?.id]);

  async function start(tid: string, title: string) {
    if (!currentWorkspace) return;
    const status = await startTimer(currentWorkspace.id, tid).catch(() => {
      toast.error("Failed to start timer");
      return null;
    });
    if (!status) return;
    setIsRunning(true);
    setTaskId(tid);
    setTaskTitle(title);
    if (status.started_at) startCounting(new Date(status.started_at));
  }

  async function stop() {
    if (!currentWorkspace) return;
    const result = await stopTimer(currentWorkspace.id).catch(() => {
      toast.error("Failed to stop timer");
      return null;
    });
    if (result === null) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setElapsed(0);
    setTaskId(null);
    setTaskTitle(null);
    startedAtRef.current = null;
    if (result.time_entry) toast.success("Time logged");
  }

  return (
    <TimerContext.Provider value={{ isRunning, elapsed, taskId, taskTitle, start, stop }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used inside TimerProvider");
  return ctx;
}
