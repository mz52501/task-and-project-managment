import client from "./client";

export interface TimerStatus {
  running: boolean;
  started_at?: string;
  task_id?: string;
  task_title?: string;
}

export const getTimerStatus = async (workspaceId: string): Promise<TimerStatus> => {
  const res = await client.get<TimerStatus>(`/workspaces/${workspaceId}/timer/status`);
  return res.data;
};

export const startTimer = async (workspaceId: string, taskId: string): Promise<TimerStatus> => {
  const res = await client.post<TimerStatus>(`/workspaces/${workspaceId}/timer/start`, { task_id: taskId });
  return res.data;
};

export interface StopTimerResponse {
  running: false;
  time_entry: object | null;
}

export const stopTimer = async (workspaceId: string): Promise<StopTimerResponse> => {
  const res = await client.post<StopTimerResponse>(`/workspaces/${workspaceId}/timer/stop`);
  return res.data;
};
