export type TaskStatus =
  | "pending"
  | "validating"
  | "success"
  | "failed"
  | "cancelled";

export type MockTask = {
  id: string;
  fileName: string;
  fileSize: number;
  startTime: number;
  duration: number;
  finalStatus: "success" | "failed";
  isCancelled: boolean;
};

export type Task = {
  id: string;
  fileName: string;
  status: TaskStatus;
  progress?: number;
  error?: string;
};
