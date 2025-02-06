import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Project {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  status: string;
}

interface ProjectsStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (projectId: number, updatedData: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
}

export const useProjectsStore = create<ProjectsStore>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),

  addProject: async (project) => {
    try {
      const response = await axios.post(`${API_URL}/api/project`, project);
      set((state) => ({
        projects: [...state.projects, response.data.project],
      }));
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  },

  updateProject: async (projectId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/api/project/${projectId}`, updatedData);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId ? { ...project, ...response.data.project } : project
        ),
      }));
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  },

  deleteProject: async (projectId) => {
    try {
      await axios.delete(`${API_URL}/api/project/${projectId}`, {
        withCredentials: true,
      });
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId),
      }));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  },
}));
