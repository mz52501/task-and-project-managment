import client from "./client";

export interface TimerStatus {
  running: boolean;
  started_at?: string;
  task_id?: string;
  task_title?: string;
}

export const getTimerStatus = async (): Promise<TimerStatus> => {
  const res = await client.get<TimerStatus>("/timer/status");
  return res.data;
};

export const startTimer = async (taskId: string): Promise<TimerStatus> => {
  const res = await client.post<TimerStatus>("/timer/start", { task_id: taskId });
  return res.data;
};

export const stopTimer = async (): Promise<void> => {
  await client.post("/timer/stop");
};
