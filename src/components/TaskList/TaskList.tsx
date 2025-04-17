import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useFileDrop } from "../../hooks/useFileDrop";
import { TaskItem } from "../TaskItems/TaskItems";
import { Task } from "@/types/apiTypes";

type TaskListProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};
const TaskList = ({ tasks, setTasks }: TaskListProps) => {
  const { updateTask, handleCancelTask } = useFileDrop(setTasks);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                initialTask={task}
                onUpdate={updateTask}
                onCancel={handleCancelTask}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
