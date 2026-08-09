import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, User as UserIcon, ShieldCheck, Sparkles, BookOpen, Home, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout, login } = useAuthStore();
  const navigate = useNavigate();

  const handleRoleQuickSwitch = async (roleEmail: string) => {
    await login(roleEmail, 'password123');
    navigate('/dashboard');
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between shadow-2xl">
      {/* Brand Header with Link to Home Page (/) */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-3 group" title="Return to Main Home Page">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 animated-logo group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
              CurriCraft <span className="text-[10px] uppercase font-bold text-violet-300 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30">AICTE AI</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Unified Model Curriculum Portal</p>
          </div>
        </Link>

        {/* Dedicated Home Landing Page Button */}
        <Link
          to="/"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-violet-300 border border-violet-500/20 transition-all hover:scale-105"
        >
          <Home className="w-3.5 h-3.5 text-cyan-400" />
          <span>Home</span>
        </Link>
      </div>

      {/* Quick SIH Demo Role Switcher */}
      <div className="hidden lg:flex items-center space-x-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Demo Switch:
        </span>
        <button
          onClick={() => handleRoleQuickSwitch('admin@aicte-india.org')}
          className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
            user?.role === 'ADMIN' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => handleRoleQuickSwitch('bureau@aicte-india.org')}
          className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
            user?.role === 'BUREAU_HEAD' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Bureau Head
        </button>
        <button
          onClick={() => handleRoleQuickSwitch('expert@aicte-india.org')}
          className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
            user?.role === 'EXPERT' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Expert
        </button>
        <button
          onClick={() => handleRoleQuickSwitch('public@aicte-india.org')}
          className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
            user?.role === 'PUBLIC_VIEWER' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Public
        </button>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
              <div className="flex items-center justify-end gap-1 text-[11px] text-violet-300 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{user.role.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold shadow-md">
              <UserIcon className="w-4 h-4 text-violet-400" />
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-violet-600/25"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
