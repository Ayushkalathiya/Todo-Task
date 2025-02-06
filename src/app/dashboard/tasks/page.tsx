"use client";

import { TaskForm } from "@/components/dashboard/TaskForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/store/authStore";
import { useCategoriesStore } from "@/store/categoryStore";
import { useProjectsStore } from "@/store/projectStore";
import { useTasksStore } from "@/store/taskStore";
import { Task } from "@/types/type";
import {
  CheckCircle,
  Filter,
  Pencil,
  Plus,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function TasksPage() {
  const { tasks, setTasks, addTask, updateTask, deleteTask, completeTask } =
    useTasksStore();
  const { projects, setProjects } = useProjectsStore();
  const { categories, setCategories } = useCategoriesStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const { user, setUser } = useUserStore();
  const route = useRouter();

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
            { credentials: "include" }
          );

          if (!response.ok) {
            route.push("/auth/signin");
            throw new Error("Failed to fetch user");
          }

          const data = await response.json();
          setUser(data.user[0]);
        } catch (error) {
          route.push("/auth/signin");
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUser();
    }
  }, [user, setUser, route]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [taskResponse, projectResponse, categoryResponse] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task`, {
              credentials: "include",
            }).then((res) => res.json()),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project`).then((res) =>
              res.json()
            ),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`).then(
              (res) => res.json()
            ),
          ]);

        setTasks(taskResponse.tasks);
        setProjects(projectResponse.projects);
        setCategories(categoryResponse.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [setTasks, setProjects, setCategories]);

  useEffect(() => {
    let filtered = tasks.map(task => ({
      ...task,
      dueDate: task.dueDate ?? ""
    }));
    
    if (selectedProject) {
      filtered = filtered.filter(task => task.projectId === parseInt(selectedProject));
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === parseInt(selectedCategory));
    }
    
 
    setFilteredTasks(filtered);
  }, [tasks, selectedProject, selectedCategory]);

  const clearFilters = () => {
    setSelectedProject("");
    setSelectedCategory("");
  };

  const handleSubmit = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id!, taskData);
        toast.success("Task updated successfully");
      } else {
        await addTask({
          ...taskData,
          description: taskData.description || "",
          status: "pending",
          dueDate: taskData.dueDate || "",
        });
        toast.success("Task added successfully");
      }
      setIsDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Failed to add task");
    }
  };

  const handleEdit = (task: Task) => {
      setEditingTask({ ...task, dueDate: task.dueDate ?? "" });
      setIsDialogOpen(true);
    };

  const handleDelete = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        toast.success("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  const handleCompleteTask = async (taskId: number , completeed : boolean ) => {
    try {
      try {
        await completeTask(taskId);
        if(completeed){
          toast.success("Task incompleted successfully");
        }else{
          toast.success("Task completed successfully");
        }
      } catch (error) {
        console.error("Error completing task:", error);
        toast.error("Failed to complete task");
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getAvailableCategories = () => {
    if (!selectedProject) return categories;
    return categories.filter(category => {
      const project = projects.find(p => p.id === parseInt(selectedProject));
      return project && category.projectId === project.id;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTask(null)}>
              <Plus className="mr-2" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                {editingTask ? "Edit Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>
            <TaskForm
              initialTask={editingTask}
              onSubmit={(data) =>
                handleSubmit(
                  data as Omit<Task, "id" | "createdAt" | "updatedAt">
                )
              }
              onCancel={() => setIsDialogOpen(false)}
              projects={projects}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Section */}
      <Card className="p-4 mb-6 bg-white dark:bg-gray-800">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium dark:text-gray-100">Filters:</span>
          </div>
          
          <div className="flex-1 flex flex-wrap gap-4">
          <Select 
        value={selectedProject || "null"} 
        onValueChange={(value) => {
          setSelectedProject(value === "null" ? "" : value);
          setSelectedCategory(""); // Reset category when project changes
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id.toString()}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={selectedCategory || "null"} 
        onValueChange={(value) => setSelectedCategory(value === "null" ? "" : value)}
        disabled={!selectedProject}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">All Categories</SelectItem>
          {getAvailableCategories().map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

            {(selectedProject || selectedCategory) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableHead className="dark:text-gray-200">Title</TableHead>
              <TableHead className="dark:text-gray-200">Project</TableHead>
              <TableHead className="dark:text-gray-200">Category</TableHead>
              <TableHead className="dark:text-gray-200">Priority</TableHead>
              <TableHead className="dark:text-gray-200">Due Date</TableHead>
              <TableHead className="dark:text-gray-200">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow
                key={task.id}
                className={`
                  ${task.completed ? "bg-green-50 dark:bg-green-900/20" : "dark:bg-gray-800"}
                  dark:border-gray-700
                  dark:text-gray-300
                `}
              >
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  {task.projectId
                    ? projects.find((p) => p.id === task.projectId)?.name || "-"
                    : "-"}
                </TableCell>
                <TableCell>
                  {task.categoryId
                    ? categories.find((c) => c.id === task.categoryId)?.name ||
                      "-"
                    : "-"}
                </TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit({ ...task, dueDate: task.dueDate ?? "" })}
                            className="dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Task</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          {task.completed ? (
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => handleCompleteTask(task.id , task.completed)}
                              className="dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                              <Undo2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCompleteTask(task.id , task.completed)}
                              className="dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Task</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

  );
}