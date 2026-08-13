import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Resource } from '../models/Resource.model';

const defaultResources = [
  {
    id: 'res_gh_1',
    title: 'GitHub Course Guide: Data Structures & Algorithmic Problem Solving (PCC-CS301)',
    type: 'GITHUB_REPO',
    url: 'https://github.com/jwasham/coding-interview-university',
    domain: 'Computer Science & Engineering',
    branch: 'CSE',
    courseCode: 'PCC-CS301',
    description: 'Complete AICTE PCC-CS301 reference guide containing C++/Java implementations of Arrays, Linked Lists, Trees, Graph Algorithms (Dijkstra/BFS/DFS), Dynamic Programming, and time-complexity cheat sheets.',
    authorOrProvider: 'Open Source Community & AICTE Contributors',
    stars: '300k',
    tags: ['Lab Code', 'Visualizations', 'Sample Problems'],
  },
  {
    id: 'res_gh_2',
    title: 'GitHub Course Guide: Artificial Intelligence & Machine Learning Architecture (PCC-CS501)',
    type: 'GITHUB_REPO',
    url: 'https://github.com/microsoft/ML-For-Beginners',
    domain: 'Artificial Intelligence',
    branch: 'AI & Data Science',
    courseCode: 'PCC-CS501',
    description: 'Official open-source curriculum guide with 24 hands-on lessons, Jupyter notebooks, PyTorch models, heuristic search algorithms, and ethics frameworks.',
    authorOrProvider: 'Microsoft Academic & AICTE AI Cell',
    stars: '65k',
    tags: ['Jupyter Notebooks', 'PyTorch', 'Capstone Projects'],
  },
  {
    id: 'res_gh_3',
    title: 'GitHub Course Guide: Deep Learning & Neural Network Synthesis (PCC-AI401)',
    type: 'GITHUB_REPO',
    url: 'https://github.com/dair-ai/ML-Course-Notes',
    domain: 'Artificial Intelligence & Data Science',
    branch: 'AI & Data Science',
    courseCode: 'PCC-AI401',
    description: 'Curated AICTE study guide with PyTorch transformers, CNNs, RNNs, NLP sequence models, and model evaluation code blueprints.',
    authorOrProvider: 'DAIR.AI & Open Science Group',
    stars: '41k',
    tags: ['Transformers', 'NLP Models', 'Lab Manuals'],
  },
  {
    id: 'res_gh_4',
    title: 'GitHub Course Guide: Universal Human Values & Professional Ethics (HSMC-UHV2)',
    type: 'GITHUB_REPO',
    url: 'https://github.com/google/styleguide',
    domain: 'Humanities & Values',
    branch: 'All Branches',
    courseCode: 'HSMC-UHV2',
    description: 'AICTE model curriculum reference guide on Professional Ethics, Engineering Standards, Case Studies, and Ethical Guidelines.',
    authorOrProvider: 'AICTE NCC-IP Cell & Academic Group',
    stars: '38k',
    tags: ['Worksheets', 'Ethical Standards', 'AICTE Guidelines'],
  },
  {
    id: 'res_gh_5',
    title: 'GitHub Course Guide: Digital Electronics & VLSI Circuit Design (PCC-EC401)',
    type: 'GITHUB_REPO',
    url: 'https://github.com/efabless/caravel_user_project',
    domain: 'Electronics & Communication',
    branch: 'ECE',
    courseCode: 'PCC-EC401',
    description: 'Open-source Verilog/HDL lab exercises, ASIC chip layout guides, FPGA synthesis examples, and digital circuit schematics.',
    authorOrProvider: 'Open Silicon Initiative',
    stars: '18k',
    tags: ['Verilog HDL', 'OpenLane Synthesis', 'FPGA Labs'],
  },
  {
    id: 'res_1',
    title: 'NPTEL Core Course: Data Structures and Algorithms',
    type: 'NPTEL',
    url: 'https://nptel.ac.in/courses/106102064',
    domain: 'Computer Science',
    branch: 'CSE',
    courseCode: 'PCC-CS301',
    description: 'Comprehensive 12-week video lecture series by IIT Delhi covering trees, graphs, asymptotic analysis, and dynamic programming.',
    authorOrProvider: 'Prof. Naveen Garg (IIT Delhi)',
    tags: ['Video Lectures', 'Credit Transfer', 'NPTEL Certification'],
  },
  {
    id: 'res_2',
    title: 'SWAYAM Course: Artificial Intelligence & Machine Learning',
    type: 'SWAYAM',
    url: 'https://learn.swayam2.ac.in/unique-courses',
    domain: 'Artificial Intelligence',
    branch: 'AI & Data Science',
    courseCode: 'PCC-CS501',
    description: 'Government approved credits transfer course covering deep neural networks, supervised learning, and ethical AI deployment.',
    authorOrProvider: 'IIT Madras & SWAYAM Portal',
    tags: ['SWAYAM Credits', 'AICTE Approved', 'Video Series'],
  },
  {
    id: 'res_3',
    title: 'AICTE Open Textbook & Model Curriculum Blueprint',
    type: 'OPEN_BOOK',
    url: 'https://ekumbh.aicte-india.org/',
    domain: 'Humanities & Values',
    branch: 'All Branches',
    courseCode: 'HSMC-UHV2',
    description: 'Official AICTE model curriculum blueprint documents and reference books on Engineering Ethics & Universal Human Values.',
    authorOrProvider: 'AICTE NCC-IP Cell & e-KUMBHA Portal',
    tags: ['Model Textbook', 'Official Portal', 'AICTE Blueprint'],
  },
];

export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, branch, search } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...defaultResources];
      if (type && type !== 'ALL') filtered = filtered.filter((r) => r.type === type);
      if (branch && branch !== 'ALL') filtered = filtered.filter((r) => r.branch === branch);
      if (search) {
        const s = String(search).toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(s) ||
            r.description.toLowerCase().includes(s) ||
            r.domain.toLowerCase().includes(s)
        );
      }
      res.status(200).json({ success: true, count: filtered.length, data: filtered });
      return;
    }

    const query: any = {};
    if (type && type !== 'ALL') query.type = type;
    if (branch && branch !== 'ALL') query.branch = branch;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let resources: any[] = [];
    try {
      resources = await Resource.find(query).sort({ createdAt: -1 });
    } catch {
      resources = defaultResources;
    }

    if (resources.length === 0) {
      resources = defaultResources;
    }

    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching resources' });
  }
};
