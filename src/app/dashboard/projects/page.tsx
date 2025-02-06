'use client'
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/authStore";
import { useCategoriesStore } from "@/store/categoryStore";
import { useProjectsStore } from "@/store/projectStore";
import { Project } from "@/types/type";
import { FolderPlus, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, setProjects } = useProjectsStore();
  const { categories, addCategory, deleteCategory, setCategories } = useCategoriesStore();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useUserStore();
  const route = useRouter();

  // Auth check effect (unchanged)
  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        setIsLoading(true);
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
        }finally{
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [user, setUser, route]);

  // Fetch projects effect
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(false);
      try {
        
        const response = await fetch("/api/project", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects);
        }

        const respons = await fetch("/api/categories", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await respons.json();
          setCategories(data.categories);
        }

      } catch (error) {
        console.log(error);
      }
        finally{
          setIsLoading(false);
        }
      }
    
    fetchProjects();
  }, [setProjects , setCategories]);



  const handleProjectSubmit = async (projectData: Partial<Project>) => {
    if (editingProject) {
     try {
       await updateProject(editingProject.id!, projectData);
       toast.success("Project updated successfully");
     } catch (error) {
       toast.error("Failed to update project");
      
     }
    } else {
      try {
        await addProject({
          ...projectData,
          userId: user?.id || 1,
          name: projectData.name!,
          description: projectData.description || "",
          status: projectData.status || "active",
        });
        toast.success("Project added successfully");
      } catch (error) {
        toast.error("Failed to add project");
        
      }
    }
    setIsProjectDialogOpen(false);
    setEditingProject(null);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject && newCategory.trim()) {
      try {
        await addCategory({
          category: newCategory,
          projectId: selectedProject.id,
        });
        toast.success("Category added successfully");
      } catch (error) {
        toast.error("Failed to add category");
        
      }
      setNewCategory("");
      setIsCategoryDialogOpen(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  };

  const handleDelete = async (projectId: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        
        await deleteProject(projectId);
        toast.success("Project deleted successfully");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const getProjectCategories = (projectId: number) => {
    return categories.filter(category => category.projectId === projectId);
  };

  const ProjectSkeleton = () => (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-3 w-full">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <div className="mt-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProject(null)}>
              <Plus className="mr-2" /> Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <ProjectForm
              initialProject={editingProject}
              onSubmit={handleProjectSubmit}
              onCancel={() => {
                setIsProjectDialogOpen(false);
                setEditingProject(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-gray-600">{project.description}</p>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                  {project.status}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsCategoryDialogOpen(true);
                  }}
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {getProjectCategories(project.id).map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Tag className="h-3 w-3" />
                    {category.name}
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category to {selectedProject?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ProjectFormProps {
  initialProject?: Partial<Project> | null;
  onSubmit: (project: Partial<Project>) => void;
  onCancel: () => void;
}

function ProjectForm({ initialProject, onSubmit, onCancel }: ProjectFormProps) {
  const [project, setProject] = useState<Partial<Project>>({
    name: initialProject?.name || "",
    description: initialProject?.description || "",
    status: initialProject?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...project,
      id: initialProject?.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={project.status}
          onChange={(e) =>
            setProject({
              ...project,
              status: e.target.value as Project["status"],
            })
          }
          className="w-full p-2 border rounded"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialProject ? "Update Project" : "Add Project"}
        </Button>
      </div>
    </form>
  );
}

