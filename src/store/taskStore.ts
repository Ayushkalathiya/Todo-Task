import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Task {
  id: number;
  userId?: number;
  projectId?: number;
  categoryId?: number;
  title: string;
  description: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  priority: string;
  status: string;
}

interface TasksStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (taskId: number, updatedData: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  completeTask: (taskId: number) => Promise<void>; // Added this
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),

  addTask: async (task) => {
    try {
      const response = await axios.post(`${API_URL}/api/task`, task);
      set((state) => ({
        tasks: [...state.tasks, response.data.tasks],
      }));
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  },

  updateTask: async (taskId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/api/task/${taskId}`, updatedData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...response.data.tasks } : task
        ),
      }));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/task/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      }));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  },

  completeTask: async (taskId) => {
    try {
      const response = await axios.patch(`${API_URL}/api/task/${taskId}`);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...response.data.tasks } : task
        ),
      }));
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  },
}));
