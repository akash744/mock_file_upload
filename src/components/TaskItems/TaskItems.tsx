import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTaskStatusEndpoint } from "@/service/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle, Loader2, Ban } from "lucide-react";
import { Task } from "@/types/apiTypes";

interface TaskItemProps {
  initialTask: Task;
  onUpdate: (task: Task) => void;
  onCancel: (taskId: string) => void;
}

const POLLING_INTERVAL_MS = 2000;

export function TaskItem({ initialTask, onUpdate, onCancel }: TaskItemProps) {
  const [currentTask, setCurrentTask] = useState<Task>(initialTask);

  const isPollingEnabled =
    currentTask.status === "pending" || currentTask.status === "validating";

  const {
    data,
    error,
    isFetching,
    isError,
    status: queryStatus,
  } = useQuery({
    queryKey: ["taskStatus", currentTask.id],
    queryFn: () => getTaskStatusEndpoint(currentTask.id),
    refetchInterval: isPollingEnabled ? POLLING_INTERVAL_MS : false,
    enabled: isPollingEnabled,
    staleTime: POLLING_INTERVAL_MS / 2,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  useEffect(() => {
    if (data && data.status !== currentTask.status) {
      const updatedTask: Task = {
        ...currentTask,
        status: data.status,
        progress: data.progress,
        error: data.error,
      };
      setCurrentTask(updatedTask);
      onUpdate(updatedTask);
    } else if (data && data.progress !== currentTask.progress) {
      const updatedTask: Task = { ...currentTask, progress: data.progress };
      setCurrentTask(updatedTask);
      onUpdate(updatedTask);
    } else if (isError && currentTask.status !== "failed") {
      const updatedTask: Task = {
        ...currentTask,
        status: "failed",
        error: `Polling failed: ${error?.message || "Unknown error"}`,
      };
      setCurrentTask(updatedTask);
      onUpdate(updatedTask);
    }

    if (
      initialTask.status === "cancelled" &&
      currentTask.status !== "cancelled"
    ) {
      console.log(
        `TaskItem ${currentTask.id}: Reflecting external cancellation.`
      );
      setCurrentTask(initialTask);
    }
  }, [data, error, isError, currentTask, onUpdate, initialTask]);

  const getStatusIcon = () => {
    switch (currentTask.status) {
      case "pending":
        return (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        );
      case "validating":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "cancelled":
        return <Ban className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const isCancelable =
    currentTask.status === "pending" || currentTask.status === "validating";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg break-all">
              {currentTask.fileName}
            </CardTitle>
            <CardDescription className="text-xs break-all">
              ID: {currentTask.id}
            </CardDescription>
          </div>
          {isFetching && isPollingEnabled && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          {getStatusIcon()}
          <span className="capitalize text-sm font-medium">
            {currentTask.status}
          </span>
        </div>
        {(currentTask.status === "validating" ||
          currentTask.status === "success" ||
          (currentTask.status === "failed" &&
            currentTask.progress !== undefined)) &&
          currentTask.progress !== undefined && (
            <Progress value={currentTask.progress} className="w-full h-2" />
          )}
        {currentTask.status === "failed" && currentTask.error && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-xs">
              {currentTask.error || "An unknown error occurred."}
            </AlertDescription>
          </Alert>
        )}
        {queryStatus === "error" && currentTask.status !== "failed" && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Polling Error</AlertTitle>
            <AlertDescription className="text-xs">
              Could not retrieve status update:{" "}
              {error?.message || "Network error"}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        {isCancelable && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(currentTask.id)}
          >
            Cancel Task
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
