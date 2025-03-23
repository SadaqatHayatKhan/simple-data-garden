
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AnimatedButton from "../ui-custom/AnimatedButton";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First get the current user
      const { data: userData } = await supabase.auth.getSession();
      
      if (!userData.session) {
        setError("You must be logged in to view tasks");
        setIsLoading(false);
        return;
      }
      
      // Then fetch tasks for this user
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userData.session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      setError(`Failed to load tasks: ${error.message || "Unknown error"}`);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setCurrentTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setFormOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(`Failed to delete task: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Tasks</h2>
        <AnimatedButton onClick={handleAddTask} className="group">
          <PlusIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Add Task
        </AnimatedButton>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="h-20 animate-pulse rounded-lg bg-muted/50"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">You don't have any tasks yet</p>
          <Button 
            variant="outline" 
            onClick={handleAddTask}
            className="group"
          >
            <PlusIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Create your first task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <TaskForm
        task={currentTask}
        open={formOpen}
        onOpenChange={setFormOpen}
        onTaskSaved={fetchTasks}
      />
    </div>
  );
};

export default TaskList;
