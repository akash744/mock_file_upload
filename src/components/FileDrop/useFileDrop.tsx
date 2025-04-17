import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { cancelTaskEndpoint, submitFileEndpoint } from "@/service/api";
import { Task } from "@/types/apiTypes";
import { validateFile } from "@/utils/utils";

export const useFileDrop = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<{
    [key: string]: boolean | string;
  }>({});
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: submitFileEndpoint,
    onSuccess: (data, variables) => {
      console.log("Submission successful:", data);
      const newTask: Task = {
        id: data.taskId,
        fileName: variables.name,
        status: "pending",
        progress: 0,
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      setSelectedFile(null);
      setFileError({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.log(`Task started for ${variables}. ID: ${data.taskId}`);
    },
    onError: (error) => {
      console.error("Submission failed:", error);
      setFileError({
        status: false,
        message: `Submission failed: ${error.message}`,
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    const validationError = validateFile(file);
    setFileError({
      status: false,
      message: validationError.message as string,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || fileError) {
      return;
    }
    console.log("Submitting file:", selectedFile.name);
    submitMutation.mutate(selectedFile);
  };

  const updateTask = React.useCallback((updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const handleCancelTask = React.useCallback(
    async (taskId: string) => {
      console.log(`Attempting to cancel task: ${taskId}`);
      try {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId &&
            (task.status === "pending" || task.status === "validating")
              ? { ...task, status: "cancelled", progress: undefined }
              : task
          )
        );
        await queryClient.cancelQueries({ queryKey: ["taskStatus", taskId] });
        const result = await cancelTaskEndpoint(taskId);

        if (result.success) {
        } else {
          queryClient.invalidateQueries({ queryKey: ["taskStatus", taskId] });
        }
      } catch (error) {
        console.error(
          `Failed to send cancel request for task ${taskId}:`,
          error
        );
        queryClient.invalidateQueries({ queryKey: ["taskStatus", taskId] });
      }
    },
    [queryClient]
  );

  return {
    handleFileChange,
    handleSubmit,
    updateTask,
    handleCancelTask,
    fileInputRef,
    selectedFile,
    fileError,
    submitMutation,
  };
};
