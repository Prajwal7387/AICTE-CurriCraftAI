import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  BookOpen,
  Sparkles,
  Award,
  Globe,
  FileCode,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Users,
  Building,
  CheckSquare,
} from 'lucide-react';
import MagicRings from '../../components/ui/MagicRings';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, login } = useAuthStore();
  const navigate = useNavigate();

  const handleFeatureNavigation = async (path: string) => {
    if (!isAuthenticated) {
      await login('admin@aicte-india.org', 'password123');
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 bg-radial-grid text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Magic Rings WebGL Animation */}
      <MagicRings
        color="#0284c7"
        colorTwo="#10b981"
        speed={0.6}
        ringCount={6}
        baseRadius={0.4}
        opacity={0.65}
        followMouse={true}
      />

      {/* Top Public Header */}
      <header className="h-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 animated-logo">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                CurriCraft <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30">AICTE AI</span>
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Unified AICTE Model Curriculum Portal</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/portal"
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100/60 dark:bg-slate-800/60 transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Public Model Portal</span>
          </Link>

          <Link
            to="/login"
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-slate-900 dark:text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition-all hover:scale-105"
          >
            <span>Sign In to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-24 relative z-10">
        <div className="text-center space-y-6 max-w-4xl mx-auto pt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>SIH Problem Statement SIH1465 Solution</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Unified AICTE Model Curriculum Portal Powered by <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">Generative AI</span>
          </h1>

          <p className="text-base md:text-lg text-slate-800 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Standardizing national technical engineering education with deterministic NEP 2020 compliance scoring, Bloom's Taxonomy cognitive classification, Git-like version control, and multi-tier AICTE Bureau approval governance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleFeatureNavigation('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-slate-900 dark:text-white text-sm font-bold rounded-2xl shadow-xl shadow-violet-600/30 flex items-center justify-center space-x-3 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Explore AICTE Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/portal"
              className="w-full sm:w-auto px-8 py-4 bg-slate-50/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-sm font-bold rounded-2xl border border-slate-300/80 dark:border-slate-700/80 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Globe className="w-5 h-5 text-emerald-400" />
              <span>Browse Public Model Curricula</span>
            </Link>
          </div>
        </div>

        {/* SIH Key Features Grid - All Clickable & Interactive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: NEP Compliance */}
          <div
            onClick={() => handleFeatureNavigation('/nep-compliance')}
            className="glass-card-glow p-6 rounded-3xl space-y-3 cursor-pointer group hover:border-violet-500/50 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">NEP 2020 Compliance Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Deterministic rule-based evaluation of total credit caps, Universal Human Values (UHV), mandatory industry internships, and lab contact hour ratios.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-400 group-hover:underline pt-1">
              Launch Audit Engine →
            </span>
          </div>

          {/* Feature 2: Gemini AI */}
          <div
            onClick={() => handleFeatureNavigation('/ai-assistant')}
            className="glass-card-glow p-6 rounded-3xl space-y-3 cursor-pointer group hover:border-violet-500/50 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">Google Gemini AI Synthesis</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate structured syllabus modules, rewrite learning outcomes using Bloom taxonomy verbs, and analyze curriculum gaps against industry trends.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 group-hover:underline pt-1">
              Open AI Assistant →
            </span>
          </div>

          {/* Feature 3: Version Snapshots */}
          <div
            onClick={() => handleFeatureNavigation('/versions')}
            className="glass-card-glow p-6 rounded-3xl space-y-3 cursor-pointer group hover:border-violet-500/50 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileCode className="w-6 h-6 text-cyan-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">Git-Style Version Snapshots</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Create curriculum version tags (`v1.0`, `v2.0`), inspect side-by-side diff comparisons, and restore historical snapshots with 1-click simplicity.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 group-hover:underline pt-1">
              View Version Timeline →
            </span>
          </div>

          {/* Feature 4: Bureau Workflows */}
          <div
            onClick={() => handleFeatureNavigation('/workflows')}
            className="glass-card-glow p-6 rounded-3xl space-y-3 cursor-pointer group hover:border-violet-500/50 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CheckSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">AICTE Bureau Governance</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Multi-tiered review workflows (`DRAFT` → `SUBMITTED` → `APPROVED` → `PUBLISHED`) with peer committee feedback and instant publishing.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 group-hover:underline pt-1">
              Open Governance Workflows →
            </span>
          </div>

          {/* Feature 5: Public Portal */}
          <div
            onClick={() => handleFeatureNavigation('/portal')}
            className="glass-card-glow p-6 rounded-3xl space-y-3 cursor-pointer group hover:border-violet-500/50 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Globe className="w-6 h-6 text-rose-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">Public Adoption Portal</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Search, filter by branch/degree, inspect module structures, and download official model curriculum JSON blueprints for university adoption.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 group-hover:underline pt-1">
              Explore Public Portal →
            </span>
          </div>

          {/* Feature 6: Role Management */}
          <div
            onClick={() => handleFeatureNavigation('/admin/users')}
            className="glass-card-glow p-6 rounded-3xl space-y-3 cursor-pointer group hover:border-violet-500/50 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Building className="w-6 h-6 text-amber-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">Role-Based Access Control</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Configurable RBAC permissions for AICTE Administrators, Bureau Heads, Subject Matter Experts, Peer Reviewers, and Public Viewers.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:underline pt-1">
              Manage Roles & Permissions →
            </span>
          </div>
        </div>

        {/* Statistics Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-around gap-6 text-center">
          <div>
            <p className="text-4xl font-extrabold text-cyan-400">12+</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Engineering Disciplines</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-100 dark:bg-slate-800"></div>
          <div>
            <p className="text-4xl font-extrabold text-emerald-400">100%</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">NEP 2020 Alignment</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-100 dark:bg-slate-800"></div>
          <div>
            <p className="text-4xl font-extrabold text-amber-400">1,500+</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Affiliated Colleges</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-8 px-6 lg:px-12 text-center text-xs text-slate-500 space-y-2 relative z-10">
        <p className="font-semibold text-slate-600 dark:text-slate-400">CurriCraft AI — All India Council for Technical Education (AICTE)</p>
        <p className="text-[11px] text-slate-600">Smart India Hackathon SIH1465 Prototype Solution • Production Architecture</p>
      </footer>
    </div>
  );
};
