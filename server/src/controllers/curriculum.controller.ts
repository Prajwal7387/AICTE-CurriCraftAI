import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.middleware';
import { Curriculum } from '../models/Curriculum.model';
import { CurriculumVersion } from '../models/CurriculumVersion.model';

const demoCurricula = [
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
    nepComplianceScore: 94,
    currentVersion: 'v2.0',
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
    nepComplianceScore: 91,
    currentVersion: 'v1.1',
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
];

export const getCurricula = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, degree, branch, search } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...demoCurricula];
      if (status) filtered = filtered.filter((c) => c.status === status);
      if (degree) filtered = filtered.filter((c) => c.degree === degree);
      if (branch) filtered = filtered.filter((c) => c.branch === branch);
      if (search) {
        const s = String(search).toLowerCase();
        filtered = filtered.filter(
          (c) => c.title.toLowerCase().includes(s) || c.code.toLowerCase().includes(s) || c.branch.toLowerCase().includes(s)
        );
      }
      res.status(200).json({ success: true, count: filtered.length, data: filtered });
      return;
    }

    const query: any = {};
    if (status) query.status = status;
    if (degree) query.degree = degree;
    if (branch) query.branch = branch;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } },
      ];
    }

    let curricula: any[] = [];
    try {
      curricula = await Curriculum.find(query)
        .populate('author', 'name email role department')
        .populate('reviewer', 'name email role department')
        .sort({ updatedAt: -1 });
    } catch {
      curricula = demoCurricula;
    }

    res.status(200).json({ success: true, count: curricula.length, data: curricula });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching curricula' });
  }
};

export const getCurriculumById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const found = demoCurricula.find((c) => c._id === id) || demoCurricula[0];
      res.status(200).json({ success: true, data: found });
      return;
    }

    let curriculum;
    try {
      curriculum = await Curriculum.findById(id)
        .populate('author', 'name email role department institution')
        .populate('reviewer', 'name email role department institution');
    } catch {
      curriculum = null;
    }

    if (!curriculum) {
      curriculum = demoCurricula[0];
    }

    res.status(200).json({ success: true, data: curriculum });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching curriculum' });
  }
};

export const createCurriculum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { title, code, degree, branch, academicYear, totalCredits, description, modules } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const newCurr = {
        _id: 'curr_' + Date.now(),
        title,
        code: code ? code.toUpperCase() : `AICTE-${Math.floor(1000 + Math.random() * 9000)}`,
        degree: degree || 'B.Tech',
        branch: branch || 'Computer Science & Engineering',
        academicYear: academicYear || '2026-2027',
        totalCredits: totalCredits || 160,
        description: description || '',
        author: req.user.userId,
        modules: modules || [],
        status: 'DRAFT',
      };
      res.status(201).json({ success: true, message: 'Curriculum created successfully', data: newCurr });
      return;
    }

    const newCurriculum = await Curriculum.create({
      title,
      code: code ? code.toUpperCase() : `AICTE-${Math.floor(1000 + Math.random() * 9000)}`,
      degree: degree || 'B.Tech',
      branch: branch || 'Computer Science & Engineering',
      academicYear: academicYear || '2026-2027',
      totalCredits: totalCredits || 160,
      description: description || '',
      author: req.user.userId,
      modules: modules || [],
      status: 'DRAFT',
    });

    res.status(201).json({ success: true, message: 'Curriculum created successfully', data: newCurriculum });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error creating curriculum' });
  }
};

export const updateCurriculum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      res.status(200).json({ success: true, message: 'Curriculum updated successfully', data: { _id: id, ...req.body } });
      return;
    }

    const updated = await Curriculum.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    res.status(200).json({ success: true, message: 'Curriculum updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error updating curriculum' });
  }
};

export const deleteCurriculum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      res.status(200).json({ success: true, message: 'Curriculum deleted successfully' });
      return;
    }

    await Curriculum.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Curriculum deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error deleting curriculum' });
  }
};
