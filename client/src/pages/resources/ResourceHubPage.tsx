import React, { useEffect, useState } from 'react';
import { BookMarked, ExternalLink, Search, GitBranch, Code, Star, BookOpen, Sparkles, Filter, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

const defaultClientResources = [
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
    url: 'https://swayam.gov.in/nc_details/NPTEL',
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
    url: 'https://www.aicte-india.org/education/model-curriculum',
    domain: 'Humanities & Values',
    branch: 'All Branches',
    courseCode: 'HSMC-UHV2',
    description: 'Official AICTE model curriculum blueprint documents and reference books on Engineering Ethics & Universal Human Values.',
    authorOrProvider: 'AICTE NCC-IP Cell',
    tags: ['Model Textbook', 'Official Portal', 'AICTE Blueprint'],
  },
];

export const ResourceHubPage: React.FC = () => {
  const [resources, setResources] = useState<any[]>(defaultClientResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    api
      .get('/resources')
      .then((res) => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setResources(res.data.data);
        }
      })
      .catch(() => {
        setResources(defaultClientResources);
      });
  }, []);

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.courseCode && r.courseCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'ALL' || r.type === selectedType;

    return matchesSearch && matchesType;
  });

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'GITHUB_REPO':
        return 'bg-violet-500/10 text-violet-300 border-violet-500/30';
      case 'NPTEL':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'SWAYAM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'OPEN_BOOK':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold">
          <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
          <span>Official AICTE Educational Resource Recommendation Service</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Open Educational Resources & Course Guides Hub</h1>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Curated GitHub reference repositories, course guides, NPTEL video lectures, SWAYAM credit courses, and open textbooks mapped directly to AICTE model curricula modules.
        </p>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by course code, GitHub repo, NPTEL, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Resource Type Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto text-xs">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              selectedType === 'ALL' ? 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/30' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            All Resources ({resources.length})
          </button>
          <button
            onClick={() => setSelectedType('GITHUB_REPO')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
              selectedType === 'GITHUB_REPO' ? 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/30' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-violet-400" />
            <span>GitHub Guides</span>
          </button>
          <button
            onClick={() => setSelectedType('NPTEL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              selectedType === 'NPTEL' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            NPTEL
          </button>
          <button
            onClick={() => setSelectedType('SWAYAM')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              selectedType === 'SWAYAM' ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/30' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            SWAYAM
          </button>
          <button
            onClick={() => setSelectedType('OPEN_BOOK')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              selectedType === 'OPEN_BOOK' ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Open Books
          </button>
        </div>
      </div>

      {/* GitHub Course Guides Highlight Banner */}
      {selectedType === 'ALL' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-3 text-xs">
          <Code className="w-5 h-5 text-violet-400 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-white">GitHub Course Guides & Reference Blueprints</span>
            <p className="text-[11px] text-slate-400">
              Each AICTE model curriculum course includes an open-source GitHub study repository containing C++/Python code, lab manuals, and Jupyter notebooks.
            </p>
          </div>
        </div>
      )}

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id || res.title}
            className="glass-card-glow p-5 rounded-2xl flex flex-col justify-between space-y-4 relative group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] uppercase flex items-center gap-1 ${getBadgeStyle(res.type)}`}>
                  {res.type === 'GITHUB_REPO' && <GitBranch className="w-3 h-3 text-violet-300" />}
                  {res.type.replace('_', ' ')}
                </span>
                {res.courseCode && (
                  <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {res.courseCode}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{res.description}</p>
              </div>

              {/* Tags / Metadata */}
              {res.tags && res.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-[10px] font-medium text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="italic">Provider: {res.authorOrProvider}</span>
                {res.stars && (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {res.stars}
                  </span>
                )}
              </div>
            </div>

            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg ${
                res.type === 'GITHUB_REPO'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-600/25'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
              }`}
            >
              {res.type === 'GITHUB_REPO' ? (
                <>
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Open GitHub Repository Guide</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </>
              ) : (
                <>
                  <span>Access Educational Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
