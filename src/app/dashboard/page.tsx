"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/dashboard/Calendar";
import Dashboard from "@/components/dashboard/Dashboard";
import { useTasksStore } from "@/store/taskStore";
import { useProjectsStore } from "@/store/projectStore";
import { useCategoriesStore } from "@/store/categoryStore";
import { useUserStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Loader, CheckCircle, FileText } from "lucide-react";
import { Project, Task } from "@/types/type";

// Get all projects -> call api/projects
export async function getProjects() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/project`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("get Project");

    // console.log("response", response);

    if (response.status === 200) {
      // format the data
      // Project -> { id, name, description, dueDate, status }

      const projects = response.data.projects;

      
      const formattedProjects = projects.map((project: Project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
      }));

      // console.log("formattedProjects", formattedProjects);

      return formattedProjects;
    } else {
      return { error: "Failed to fetch projects" };
    }
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { error: "Failed to fetch projects" };
  }
}

// Get all categories -> call api/categories
export async function getCategories() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("get Category");
    console.log("response", response);

    if (response.status === 200) {
      // format the data
      // Category -> { id, name }

      const categories = response.data.categories;


      return categories;
    } else {
      return { error: "Failed to fetch categories" };
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { error: "Failed to fetch categories" };
  }
}

// Get all tasks -> call api/tasks
export async function getTasks() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/task`,
      {
        withCredentials: true,
      }
    );
    // console.log("get Task");

    // console.log("response", response);

    if (response.status === 200) {
      // format the data
      // Task -> { id, title , description, dueDate, priority, status, project, category }

      const tasks = response.data.tasks;

      // console.log("tasks", tasks);

      
      const formattedTasks = tasks.map((task : Task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.completed,
        project: task.projectId,
        category: task.categoryId,
      }));

      // console.log("formattedTasks", formattedTasks);

      return formattedTasks;
    } else {
      return { error: "Failed to fetch tasks" };
    }
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return { error: "Failed to fetch tasks" };
  }
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const { setTasks, tasks } = useTasksStore();
  const { setProjects, projects } = useProjectsStore();
  const { setCategories } = useCategoriesStore();
  const { user, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
            { credentials: "include" }
          );

          if (!response.ok) {
            router.push("/auth/signin");
            throw new Error("Failed to fetch user");
          }

          const data = await response.json();
          setUser(data.user[0]);
        } catch (error) {
          router.push("/auth/signin");
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUser();
    }
  }, [user, setUser]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [tasks, projects, categories] = await Promise.all([
          getTasks(),
          getProjects(),
          getCategories(),
        ]);
        setTasks(tasks);
        setProjects(projects);
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setTasks, setProjects, setCategories]);

  return (
    <div className="p-6">
      {/* Animated Welcome Message */}
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-blue-600">
          Welcome {user?.name || "Back"}! 🚀
        </h1>
        <p className="text-gray-500 mt-2">
          Stay on top of your projects & tasks. Let’s get things done! 💪
        </p>
      </motion.div>

      {/* Quick Stats Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <StatCard icon={<CheckCircle />} title="Total Tasks" value={tasks.length} color="bg-green-500" />
        <StatCard icon={<FileText />} title="Total Projects" value={projects.length} color="bg-blue-500" />
        <StatCard icon={<Loader />} title="Pending Tasks" value={tasks.filter(t => t.status !== "completed").length} color="bg-yellow-500" />
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button className="bg-blue-600 text-white flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span onClick={() => router.push("/dashboard/tasks")}  >Add Task</span>
        </Button>
        <Button className="bg-green-600 text-white flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span onClick={() => router.push("/dashboard/projects")}>Create Project</span>
        </Button>
      </div>

      {/* Dashboard Section */}
      <div className="mt-6">
        {/* <h2 className="text-2xl font-bold">📊 Your Dashboard</h2> */}
        {loading ? <LoadingSkeleton /> : <Dashboard />}
      </div>

      {/* Calendar Section */}
      <div className="mt-12">
        {/* <h2 className="text-2xl font-bold">📅 Calendar</h2> */}
        {loading ? <LoadingSkeleton /> : <Calendar />}
      </div>
    </div>
  );
}


const StatCard = ({ icon, title, value, color } : { icon: React.ReactNode; title: string; value: number; color: string }) => (
  <motion.div
    className={`p-6 rounded-lg text-white ${color} shadow-md flex flex-col items-center`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-3xl">{icon}</div>
    <h3 className="text-lg font-bold mt-2">{title}</h3>
    <p className="text-2xl font-semibold">{value}</p>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
    <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
    <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
  </div>
);
