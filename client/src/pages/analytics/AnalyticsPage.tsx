import React from 'react';
import { BarChart3, TrendingUp, Award, PieChart as PieIcon, ShieldCheck } from 'lucide-react';
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
  LineChart,
  Line,
} from 'recharts';

const adoptionData = [
  { state: 'Maharashtra', colleges: 340, adopted: 290 },
  { state: 'Karnataka', colleges: 280, adopted: 245 },
  { state: 'Tamil Nadu', colleges: 310, adopted: 275 },
  { state: 'Uttar Pradesh', colleges: 420, adopted: 330 },
  { state: 'Gujarat', colleges: 210, adopted: 195 },
  { state: 'Telangana', colleges: 190, adopted: 175 },
];

const complianceTrend = [
  { year: '2022', score: 72 },
  { year: '2023', score: 78 },
  { year: '2024', score: 83 },
  { year: '2025', score: 88 },
  { year: '2026', score: 94 },
];

const creditDistribution = [
  { name: 'Core Courses (PCC)', percentage: 40 },
  { name: 'Basic Sciences (BSC)', percentage: 18 },
  { name: 'Humanities & UHV', percentage: 12 },
  { name: 'Open Electives (OEC)', percentage: 15 },
  { name: 'Internship & Project', percentage: 15 },
];

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-400 mb-1">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            <span>AICTE National Academic Operations & Adoption Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AICTE Curriculum Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual monitoring of institutional adoption, credit allocation, and NEP compliance scoring.
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Trend Line Chart */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> NEP 2020 Compliance Trend (2022-2026)
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceTrend}>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '10px', color: '#ffffff' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credit Breakdown Pie Chart */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-brand-400" /> Recommended Credit Ratio Breakdown
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={creditDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="percentage"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {creditDistribution.map((entry, index) => (
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
        </div>

        {/* State Adoption Bar Chart */}
        <div className="lg:col-span-12 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Institutional Model Adoption by State
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adoptionData}>
                <XAxis dataKey="state" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '10px', color: '#ffffff' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="colleges" fill="#334155" name="Affiliated Colleges" radius={[4, 4, 0, 0]} />
                <Bar dataKey="adopted" fill="#0284c7" name="Adopted Curricula" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
