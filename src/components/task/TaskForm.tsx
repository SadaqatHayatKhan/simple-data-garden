
import AnimatedButton from "@/components/ui-custom/AnimatedButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TaskFormProps {
  task?: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskSaved: () => void;
}

const TaskForm = ({ task, open, onOpenChange, onTaskSaved }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the current user first
      const { data: userData } = await supabase.auth.getSession();
      if (!userData.session) {
        toast.error("You must be logged in to create tasks");
        return;
      }
      
      const userId = userData.session.user.id;
      
      if (isEditing && task) {
        // Update existing task
        const { error } = await supabase
          .from("tasks")
          .update({
            title,
            description: description || null,
            // Don't update user_id on edit
          })
          .eq("id", task.id);

        if (error) throw error;
        toast.success("Task updated successfully");
      } else {
        // Create new task with user_id
        const { error } = await supabase.from("tasks").insert([
          {
            title,
            description: description || null,
            is_complete: false,
            user_id: userId, // Add the user_id
          },
        ]);

        if (error) {
          console.error("Task creation error:", error);
          throw error;
        }
        toast.success("Task created successfully");
      }

      onTaskSaved();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Task operation error:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} task: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditing ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your task details below."
                : "Add a new task to your list."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about your task"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <AnimatedButton type="submit" loading={isSubmitting}>
              {isEditing ? "Update Task" : "Create Task"}
            </AnimatedButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
