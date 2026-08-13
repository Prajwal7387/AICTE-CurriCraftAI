import React, { useEffect, useState } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  FileClock,
  CheckCircle,
  Globe,
  Award,
  Plus,
  Sparkles,
  ArrowRight,
  Search,
  Building,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const DashboardPage: React.FC = () => {
  const { curricula, fetchCurricula, createCurriculum, setActiveCurriculum } = useCurriculumStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>({
    totalCurricula: 24,
    draftCurricula: 6,
    underReview: 5,
    publishedCurricula: 10,
    complianceScore: 88,
    adoptionStats: [
      { state: 'Maharashtra', adoptedCurricula: 290 },
      { state: 'Karnataka', adoptedCurricula: 245 },
      { state: 'Tamil Nadu', adoptedCurricula: 275 },
      { state: 'Uttar Pradesh', adoptedCurricula: 330 },
      { state: 'Gujarat', adoptedCurricula: 195 },
    ],
    departmentStats: [
      { name: 'Computer Science', value: 35 },
      { name: 'AI & Data Science', value: 25 },
      { name: 'Electronics', value: 20 },
      { name: 'Mechanical', value: 20 },
    ],
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCurricula();
    api
      .get('/analytics/stats')
      .then((res) => {
        if (res.data.success) {
          setStats((prev: any) => ({ ...prev, ...res.data.data }));
        }
      })
      .catch(() => {});
  }, [fetchCurricula]);

  const handleCreateNew = async () => {
    const newCurr = await createCurriculum({
      title: 'B.Tech Model Curriculum in Artificial Intelligence & Data Engineering',
      code: `AICTE-AI-${Math.floor(1000 + Math.random() * 9000)}`,
      degree: 'B.Tech',
      branch: 'Artificial Intelligence & Data Science',
      academicYear: '2026-2027',
      totalCredits: 160,
      description: 'Unified AICTE model curriculum prepared for 2026 adoption.',
    });
    if (newCurr) {
      setActiveCurriculum(newCurr);
      navigate('/workspace');
    }
  };

  const filteredCurricula = curricula.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900/60 via-slate-900 to-slate-900 border border-brand-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-400 mb-1">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            <span>AICTE Academic Operations Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {user?.name || 'Academic Committee Expert'}
          </h1>
          <p className="text-xs text-slate-200 mt-1 max-w-2xl">
            Manage, evaluate, and publish unified model engineering curricula aligned with National Education Policy (NEP 2020) guidelines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create Model Curriculum</span>
          </button>

          <Link
            to="/ai-assistant"
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 flex items-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* KPI Executive Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-xs font-medium">Total Curricula</span>
            <FileText className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{curricula.length || stats.totalCurricula}</p>
          <span className="text-[10px] text-slate-500 mt-1">Across 12 Engineering Branches</span>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-xs font-medium">Draft Documents</span>
            <FileClock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{stats.draftCurricula}</p>
          <span className="text-[10px] text-slate-500 mt-1">In active drafting phase</span>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-xs font-medium">Under Review</span>
            <CheckCircle className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">{stats.underReview}</p>
          <span className="text-[10px] text-slate-500 mt-1">Awaiting Bureau decision</span>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-xs font-medium">Published Portal</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{stats.publishedCurricula}</p>
          <span className="text-[10px] text-slate-500 mt-1">Live for public adoption</span>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-xs font-medium">NEP Compliance Score</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 flex items-baseline gap-1">
            {stats.complianceScore}% <span className="text-xs text-emerald-400 font-normal">High</span>
          </p>
          <span className="text-[10px] text-slate-500 mt-1">Deterministic AICTE Rule Audit</span>
        </div>
      </div>

      {/* Analytics Recharts Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Adoption Statistics Bar Chart */}
        <div className="lg:col-span-2 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" /> State Institutional Adoption Statistics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Affiliated engineering colleges adopting model curricula</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.adoptionStats}>
                <XAxis dataKey="state" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '10px', color: '#ffffff' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="adoptedCurricula" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Pie Chart */}
        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Department Share</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Distribution across major branches</p>
          </div>
          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.departmentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.departmentStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '10px', color: '#ffffff' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-800 dark:text-slate-300">
            {stats.departmentStats.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum Registry Table */}
      <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AICTE Model Curriculum Registry</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Manage and edit active model curriculum documents</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search curriculum..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Curriculum Code & Title</th>
                <th className="p-3">Degree & Branch</th>
                <th className="p-3">Total Credits</th>
                <th className="p-3">NEP Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredCurricula.length > 0 ? (
                filteredCurricula.map((curr) => (
                  <tr key={curr._id} className="hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">
                      <div className="font-semibold text-sm">{curr.title}</div>
                      <span className="text-[11px] font-mono text-brand-700 dark:text-brand-400 font-bold">{curr.code}</span>
                    </td>
                    <td className="p-3 text-slate-800 dark:text-slate-300">
                      <div>{curr.degree}</div>
                      <span className="text-slate-500 text-[11px]">{curr.branch}</span>
                    </td>
                    <td className="p-3 text-slate-800 dark:text-slate-300 font-semibold">{curr.totalCredits} Credits</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        {curr.nepComplianceScore || 90}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          curr.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : curr.status === 'SUBMITTED' || curr.status === 'UNDER_REVIEW'
                            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {curr.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveCurriculum(curr);
                          navigate('/workspace');
                        }}
                        className="px-3 py-1 bg-brand-50 dark:bg-brand-600/20 hover:bg-brand-600 text-brand-700 dark:text-brand-300 hover:text-white rounded text-[11px] font-bold transition-colors border border-brand-200 dark:border-brand-500/30 inline-flex items-center gap-1"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No curriculum documents found. Click "Create Model Curriculum" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
