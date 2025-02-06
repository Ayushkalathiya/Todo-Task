import {create} from 'zustand';

interface UserStore {
  user: { id: number; name: string; email: string } | null;
  setUser: (user: { id: number; name: string; email: string } | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
