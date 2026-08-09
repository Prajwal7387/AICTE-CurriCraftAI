import { create } from 'zustand';
import { Curriculum } from '../types';
import { api } from '../services/api';

interface CurriculumState {
  curricula: Curriculum[];
  activeCurriculum: Curriculum | null;
  isLoading: boolean;
  error: string | null;
  fetchCurricula: (params?: any) => Promise<void>;
  fetchCurriculumById: (id: string) => Promise<void>;
  createCurriculum: (data: Partial<Curriculum>) => Promise<Curriculum | null>;
  updateActiveCurriculum: (data: Partial<Curriculum>) => Promise<void>;
  setActiveCurriculum: (curriculum: Curriculum | null) => void;
}

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  curricula: [],
  activeCurriculum: null,
  isLoading: false,
  error: null,

  fetchCurricula: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/curricula', { params });
      set({ curricula: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch curricula', isLoading: false });
    }
  },

  fetchCurriculumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/curricula/${id}`);
      set({ activeCurriculum: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch curriculum details', isLoading: false });
    }
  },

  createCurriculum: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/curricula', data);
      const newCurr = res.data.data;
      set((state) => ({ curricula: [newCurr, ...state.curricula], activeCurriculum: newCurr, isLoading: false }));
      return newCurr;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to create curriculum', isLoading: false });
      return null;
    }
  },

  updateActiveCurriculum: async (data) => {
    const active = get().activeCurriculum;
    if (!active) return;

    try {
      const res = await api.put(`/curricula/${active._id}`, data);
      const updated = res.data.data;
      set((state) => ({
        activeCurriculum: updated,
        curricula: state.curricula.map((c) => (c._id === updated._id ? updated : c)),
      }));
    } catch (err: any) {
      console.error('Autosave/update error:', err);
    }
  },

  setActiveCurriculum: (curriculum) => set({ activeCurriculum: curriculum }),
}));
