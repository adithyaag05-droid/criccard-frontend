import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string; email: string; name: string; plan: string;
  isGuest?: boolean; cards_used?: number; cards_limit?: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('criccard_token') : null,
  loading: false,

  setAuth: (token, user) => {
    localStorage.setItem('criccard_token', token);
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('criccard_token');
    set({ token: null, user: null });
  },

  refresh: async () => {
    const token = localStorage.getItem('criccard_token');
    if (!token) return;
    set({ loading: true });
    try {
      const data = await api.me();
      set({ user: data.user, token });
    } catch {
      localStorage.removeItem('criccard_token');
      set({ user: null, token: null });
    } finally {
      set({ loading: false });
    }
  },
}));
