import { create } from 'zustand';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('curricraft_user') || 'null'),
  token: localStorage.getItem('curricraft_token'),
  isAuthenticated: !!localStorage.getItem('curricraft_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data.data;

      localStorage.setItem('curricraft_token', token);
      localStorage.setItem('curricraft_user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Login failed. Please check credentials.';
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = res.data.data;

      localStorage.setItem('curricraft_token', token);
      localStorage.setItem('curricraft_user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Registration failed.';
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('curricraft_token');
    localStorage.removeItem('curricraft_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('curricraft_token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      const user = res.data.data.user;
      localStorage.setItem('curricraft_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('curricraft_token');
      localStorage.removeItem('curricraft_user');
      set({ isAuthenticated: false, user: null, token: null });
    }
  },
}));
