"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Category, Project, Task } from "@/types/type";
import { useState, useMemo } from "react";

interface TaskFormProps {
  initialTask?: Partial<Task> | null;
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
  projects: Project[];
  categories: Category[];
}

export function TaskForm({
  initialTask,
  onSubmit,
  onCancel,
  projects,
  categories,
}: TaskFormProps) {
  const [task, setTask] = useState<Partial<Task>>({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    priority: initialTask?.priority || "medium",
    projectId: initialTask?.projectId ? Number(initialTask.projectId) : undefined,
    categoryId: initialTask?.categoryId ? Number(initialTask.categoryId) : undefined,
    dueDate: initialTask?.dueDate || "",
  });

  // Get filtered categories based on selected project
  const availableCategories = useMemo(
    () =>
      task.projectId
        ? categories.filter((category) => category.projectId === Number(task.projectId))
        : [],
    [task.projectId, categories]
  );

  const handleProjectChange = (projectId: string) => {
    setTask((prev) => ({
      ...prev,
      projectId: projectId !== "none" ? Number(projectId) : undefined,
      categoryId: undefined, // Reset category when project changes
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="project">Project</Label>
        <Select
          value={task.projectId?.toString() || "none"}
          onValueChange={handleProjectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={task.categoryId?.toString() || "none"}
          onValueChange={(value) =>
            setTask({ ...task, categoryId: value !== "none" ? Number(value) : undefined })
          }
          disabled={!task.projectId || availableCategories.length === 0}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !task.projectId
                  ? "Select a project first"
                  : availableCategories.length === 0
                  ? "No categories available"
                  : "Select Category"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {availableCategories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={task.priority}
          onValueChange={(value) => setTask({ ...task, priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={task.dueDate}
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialTask ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </form>
  );
}
