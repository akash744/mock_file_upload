import { MockTask, TaskStatus } from "../types/apiTypes";

const TASK_DURATION_MS = 5000;
const CHANCE_OF_FAILURE = 0.1;
const taskStore = new Map<string, MockTask>();

export const submitFileEndpoint = (file: File): Promise<{ taskId: string }> => {
  const fileName = file.name;
  const fileSize = file.size;
  console.log(
    `Mock submitFile api endpoint received request to submit file: ${fileName}`
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      const taskId = crypto.randomUUID();
      const duration = TASK_DURATION_MS;
      const finalStatus =
        Math.random() < CHANCE_OF_FAILURE ? "failed" : "success";

      const newTask: MockTask = {
        id: taskId,
        fileName,
        fileSize,
        startTime: Date.now(),
        duration,
        finalStatus,
        isCancelled: false,
      };
      taskStore.set(taskId, newTask);
      console.log(
        `Mock submitFile api endpoint successfully created task ${taskId}, it tookk duration: ${duration}ms, finalStatus: ${finalStatus}`
      );
      resolve({ taskId });
    }, 500);
  });
};

export const getTaskStatusEndpoint = (
  taskId: string
): Promise<{ status: TaskStatus; progress: number; error?: string }> => {
  console.log(
    `Mock api endpoint received request for status of task: ${taskId}`
  );
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = taskStore.get(taskId);

      if (!task) {
        console.error(`[Mock API] Task ${taskId} not found.`);
        return reject(new Error("Task not found"));
      }

      if (task.isCancelled) {
        console.log(`Mock api endpoint Task ${taskId} is cancelled.`);
        return resolve({ status: "cancelled", progress: 0 });
      }

      const elapsedTime = Date.now() - task.startTime;
      const progress = Math.min(
        100,
        Math.round((elapsedTime / task.duration) * 100)
      );

      if (elapsedTime >= task.duration) {
        console.log(
          `Mock api endpoint Task ${taskId} completed with status: ${task.finalStatus}`
        );
        if (task.finalStatus === "success") {
          resolve({ status: "success", progress: 100 });
        } else {
          resolve({
            status: "failed",
            progress: 100,
            error: "Processing failed due to a simulated error.",
          });
        }
      } else {
        console.log(
          `Mock api endpoint Task ${taskId} is processing. Progress: ${progress}%`
        );
        resolve({ status: "validating", progress });
      }
    }, 500);
  });
};

export const cancelTaskEndpoint = (
  taskId: string
): Promise<{ success: boolean }> => {
  console.log(`Mock api endpoint received request to cancel task: ${taskId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = taskStore.get(taskId);
      if (task) {
        const elapsedTime = Date.now() - task.startTime;
        if (elapsedTime < task.duration) {
          task.isCancelled = true;
          console.log(`Mock api endpoint Task ${taskId} marked as cancelled.`);
          taskStore.set(taskId, task);
          resolve({ success: true });
        } else {
          console.log(
            `Mock api endpoint Task ${taskId} already completed, cannot cancel.`
          );
          resolve({ success: false });
        }
      } else {
        console.error(
          `Mock api endpoint Cannot cancel task ${taskId}, not found.`
        );
        resolve({ success: false });
      }
    }, 250);
  });
};
