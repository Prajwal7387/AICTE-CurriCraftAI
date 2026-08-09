import { create } from 'zustand';
import { Curriculum } from '../types';
import { api } from '../services/api';

const defaultDemoCurricula: Curriculum[] = [
  {
    _id: 'demo_cse_2026',
    title: 'B.Tech Model Curriculum in Computer Science & Engineering',
    code: 'AICTE-CSE-2026',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    academicYear: '2026-2027',
    totalCredits: 160,
    status: 'PUBLISHED',
    description: 'National Unified Model Curriculum aligned with NEP 2020 guidelines, incorporating AI, Cloud, Cybersecurity, and Universal Human Values.',
    author: 'AICTE Executive Bureau',
    nepComplianceScore: 94,
    currentVersion: 'v2.0',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
    modules: [
      {
        id: 'mod_1',
        title: 'Data Structures & Algorithmic Problem Solving',
        code: 'PCC-CS301',
        credits: 4,
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        description: 'Fundamental data structures, asymptotic notation, trees, graph algorithms, and space-time tradeoffs.',
        topics: ['Arrays & Linked Lists', 'Stacks, Queues & Trees', 'Graph Algorithms & Dijkstra', 'Dynamic Programming'],
        learningOutcomes: [
          {
            id: 'lo_1',
            description: 'Analyze time and space complexity of iterative and recursive algorithms.',
            bloomLevel: 'Analyze',
            assessmentMethod: 'Written Examination & Coding Lab',
          },
          {
            id: 'lo_2',
            description: 'Implement complex graph structures to solve routing and optimization problems.',
            bloomLevel: 'Apply',
            assessmentMethod: 'Practical Laboratory Evaluation',
          },
        ],
      },
      {
        id: 'mod_2',
        title: 'Artificial Intelligence & Machine Learning Architecture',
        code: 'PCC-CS501',
        credits: 4,
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        description: 'Search algorithms, supervised/unsupervised learning, deep neural networks, and model deployment.',
        topics: ['Heuristic Search & Games', 'Supervised Learning & Regression', 'Neural Networks & PyTorch', 'Ethics in AI'],
        learningOutcomes: [
          {
            id: 'lo_3',
            description: 'Formulate machine learning models to solve complex real-world predictive tasks.',
            bloomLevel: 'Create',
            assessmentMethod: 'Mini Project & Capstone',
          },
        ],
      },
      {
        id: 'mod_3',
        title: 'Universal Human Values-II: Understanding Harmony',
        code: 'HSMC-UHV2',
        credits: 3,
        lectureHours: 2,
        tutorialHours: 1,
        practicalHours: 0,
        description: 'Mandatory AICTE NEP course on self-exploration, family harmony, society, and professional ethics.',
        topics: ['Process of Self-Exploration', 'Harmony in Self & Family', 'Professional Ethics in Engineering'],
        learningOutcomes: [
          {
            id: 'lo_4',
            description: 'Examine moral and ethical dilemmas in technological development.',
            bloomLevel: 'Evaluate',
            assessmentMethod: 'Group Discussions & Reflective Essays',
          },
        ],
      },
    ],
  },
  {
    _id: 'demo_ai_2026',
    title: 'B.Tech Model Curriculum in Artificial Intelligence & Data Science',
    code: 'AICTE-AI-2026',
    degree: 'B.Tech',
    branch: 'Artificial Intelligence & Data Science',
    academicYear: '2026-2027',
    totalCredits: 162,
    status: 'SUBMITTED',
    description: 'Specialized model curriculum covering Deep Learning, NLP, Big Data Engineering, and Responsible AI.',
    author: 'AICTE Academic Policy Bureau',
    nepComplianceScore: 91,
    currentVersion: 'v1.1',
    createdAt: '2026-08-02T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
    modules: [
      {
        id: 'mod_ai_1',
        title: 'Applied Deep Learning & Neural Networks',
        code: 'PCC-AI401',
        credits: 4,
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        description: 'Convolutional networks, recurrent architectures, transformers, and transfer learning.',
        topics: ['Computer Vision with CNNs', 'Sequence Processing with LSTMs', 'Attention Mechanisms & Transformers'],
        learningOutcomes: [
          {
            id: 'lo_ai_1',
            description: 'Design transformer architectures for natural language processing tasks.',
            bloomLevel: 'Create',
            assessmentMethod: 'Lab Assessment',
          },
        ],
      },
    ],
  },
  {
    _id: 'demo_ece_2026',
    title: 'B.Tech Model Curriculum in Electronics & Communication Engineering',
    code: 'AICTE-ECE-2026',
    degree: 'B.Tech',
    branch: 'Electronics & Communication',
    academicYear: '2026-2027',
    totalCredits: 160,
    status: 'DRAFT',
    description: 'Model curriculum emphasizing VLSI Design, Embedded Systems, IoT Protocols, and Digital Signal Processing.',
    author: 'AICTE Electronics Board',
    nepComplianceScore: 88,
    currentVersion: 'v1.0',
    createdAt: '2026-08-03T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
    modules: [
      {
        id: 'mod_ec_1',
        title: 'Digital Electronics & VLSI Circuit Design',
        code: 'PCC-EC401',
        credits: 4,
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        description: 'Verilog HDL, ASIC chip design layout, FPGA synthesis, and digital CMOS logic.',
        topics: ['Verilog HDL Modeling', 'CMOS Inverters & ASIC Flow', 'FPGA Synthesis'],
        learningOutcomes: [
          {
            id: 'lo_ec_1',
            description: 'Synthesize digital logic circuits on FPGA hardware using Verilog HDL.',
            bloomLevel: 'Apply',
            assessmentMethod: 'Hardware Lab Test',
          },
        ],
      },
    ],
  },
];

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
  curricula: defaultDemoCurricula,
  activeCurriculum: defaultDemoCurricula[0],
  isLoading: false,
  error: null,

  fetchCurricula: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/curricula', { params });
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        set({
          curricula: res.data.data,
          activeCurriculum: res.data.data[0],
          isLoading: false,
        });
      } else {
        set({ curricula: defaultDemoCurricula, activeCurriculum: defaultDemoCurricula[0], isLoading: false });
      }
    } catch {
      set({
        curricula: defaultDemoCurricula,
        activeCurriculum: get().activeCurriculum || defaultDemoCurricula[0],
        isLoading: false,
      });
    }
  },

  fetchCurriculumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/curricula/${id}`);
      if (res.data.success && res.data.data) {
        set({ activeCurriculum: res.data.data, isLoading: false });
      } else {
        const found = defaultDemoCurricula.find((c) => c._id === id) || defaultDemoCurricula[0];
        set({ activeCurriculum: found, isLoading: false });
      }
    } catch {
      const found = defaultDemoCurricula.find((c) => c._id === id) || defaultDemoCurricula[0];
      set({ activeCurriculum: found, isLoading: false });
    }
  },

  createCurriculum: async (data) => {
    set({ isLoading: true, error: null });
    const newCurr: Curriculum = {
      _id: 'curr_' + Date.now(),
      title: data.title || 'New Model Curriculum',
      code: data.code || `AICTE-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
      degree: data.degree || 'B.Tech',
      branch: data.branch || 'Computer Science & Engineering',
      academicYear: data.academicYear || '2026-2027',
      totalCredits: data.totalCredits || 160,
      description: data.description || '',
      author: 'AICTE Curriculum Committee',
      nepComplianceScore: 92,
      currentVersion: 'v1.0',
      status: 'DRAFT',
      modules: data.modules || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await api.post('/curricula', data);
      if (res.data.success && res.data.data) {
        const serverCurr = res.data.data;
        set((state) => ({
          curricula: [serverCurr, ...state.curricula],
          activeCurriculum: serverCurr,
          isLoading: false,
        }));
        return serverCurr;
      }
    } catch {
      // Fallback
    }

    set((state) => ({
      curricula: [newCurr, ...state.curricula],
      activeCurriculum: newCurr,
      isLoading: false,
    }));
    return newCurr;
  },

  updateActiveCurriculum: async (data) => {
    const active = get().activeCurriculum;
    if (!active) return;

    const updated = { ...active, ...data };
    set((state) => ({
      activeCurriculum: updated,
      curricula: state.curricula.map((c) => (c._id === updated._id ? updated : c)),
    }));

    try {
      await api.put(`/curricula/${active._id}`, data);
    } catch {
      // Client state already updated
    }
  },

  setActiveCurriculum: (curriculum) => set({ activeCurriculum: curriculum }),
}));
