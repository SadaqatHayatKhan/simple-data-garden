
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { CheckIcon, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AnimatedButton from "../ui-custom/AnimatedButton";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const toggleComplete = async () => {
    setIsCompleting(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ is_complete: !task.is_complete })
        .eq("id", task.id);

      if (error) throw error;
      
      toast.success(
        task.is_complete ? "Task marked as incomplete" : "Task completed"
      );
      
      // We don't need to update local state here as it will be refetched from the parent
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Card className="animate-scale-in overflow-hidden border border-border hover:border-primary/20 transition-all duration-300">
      <div className="p-4 sm:p-6 flex gap-4 items-start">
        <div className="flex-shrink-0 pt-1">
          <Checkbox 
            checked={task.is_complete} 
            onCheckedChange={toggleComplete}
            disabled={isCompleting}
            id={`task-${task.id}`}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-white transition-all duration-300"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <label 
              htmlFor={`task-${task.id}`}
              className={`font-medium ${
                task.is_complete ? "line-through text-muted-foreground" : ""
              } transition-all duration-300`}
            >
              {task.title}
            </label>
            
            {task.description && (
              <p className={`mt-1 text-sm ${
                task.is_complete ? "line-through text-muted-foreground/70" : "text-muted-foreground"
              } transition-all duration-300`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <AnimatedButton 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </AnimatedButton>
          
          <AnimatedButton 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash className="h-4 w-4" />
          </AnimatedButton>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;
