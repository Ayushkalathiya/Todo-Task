import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
  id: number;
  name: string;
  userId: number;
  projectId: number;
}

interface CategoriesStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: ({ category, projectId }: { category: string; projectId: number }) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),

  addCategory: async ( {category, projectId } : {category: string, projectId: number} ) => {
    try {
      console.log(category, projectId);
      
      const response = await axios.post(`${API_URL}/api/categories`, {
        name: category,
        projectId : projectId ,
      });
      console.log("response", response);

      set((state) => ({
        categories: [...state.categories, response.data.category],
      }));
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  },

  updateCategory: async (category) => {
    try {
      const response = await axios.post(`${API_URL}/api/categories`, {
        id: category.id,
        name: category.name,
      });
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === category.id ? response.data.category : cat
        ),
      }));
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      await axios.delete(`${API_URL}/api/categories/${categoryId}`);
      set((state) => ({
        categories: state.categories.filter(
          (category) => category.id !== categoryId
        ),
      }));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  },
}));
