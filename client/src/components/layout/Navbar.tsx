import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, User as UserIcon, ShieldCheck, Sparkles, BookOpen, Home, Mail, Building, Landmark, CheckCircle, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout, login } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleRoleQuickSwitch = async (roleEmail: string) => {
    await login(roleEmail, 'password123');
    setIsProfileOpen(false);
    navigate('/dashboard');
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between shadow-2xl">
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

      {/* User Profile Container with Click Trigger */}
      <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        {user ? (
          <>
            {/* Interactive User Profile Trigger */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2.5 group cursor-pointer p-1.5 rounded-2xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
              title="Click to view full user profile info"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight flex items-center gap-1">
                  <span>{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </p>
                <div className="flex items-center justify-end gap-1 text-[11px] text-violet-300 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{user.role.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 group-hover:border-cyan-400 flex items-center justify-center text-slate-300 font-semibold shadow-md transition-all group-hover:scale-105">
                <UserIcon className="w-4 h-4 text-violet-400 group-hover:text-cyan-300" />
              </div>
            </button>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Interactive Profile Info Card Popup */}
            {isProfileOpen && (
              <div className="absolute top-14 right-0 w-80 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl z-50 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-lg">
                    <div className="w-full h-full bg-slate-950 rounded-[12px] flex items-center justify-center text-slate-200">
                      <UserIcon className="w-6 h-6 text-cyan-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">{user.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 uppercase">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-2 text-xs bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <Mail className="w-3.5 h-3.5 text-violet-400" /> Email:
                    </span>
                    <span className="font-semibold text-white truncate max-w-[140px]">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pt-1.5 border-t border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <Building className="w-3.5 h-3.5 text-cyan-400" /> Dept:
                    </span>
                    <span className="font-semibold text-white truncate max-w-[140px]">{user.department || 'Academic Ops'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pt-1.5 border-t border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <Landmark className="w-3.5 h-3.5 text-emerald-400" /> Institution:
                    </span>
                    <span className="font-semibold text-white truncate max-w-[140px]">{user.institution || 'AICTE HQ'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pt-1.5 border-t border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Status:
                    </span>
                    <span className="font-bold text-emerald-400 text-[10px]">AUTHENTICATED</span>
                  </div>
                </div>

                {/* Role Quick Switch Buttons inside Popover */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Governance Mode</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <button
                      onClick={() => handleRoleQuickSwitch('admin@aicte-india.org')}
                      className={`p-1.5 rounded-lg border text-left font-medium transition-all ${
                        user.role === 'ADMIN' ? 'bg-violet-600/20 border-violet-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      AICTE Admin
                    </button>
                    <button
                      onClick={() => handleRoleQuickSwitch('bureau@aicte-india.org')}
                      className={`p-1.5 rounded-lg border text-left font-medium transition-all ${
                        user.role === 'BUREAU_HEAD' ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Bureau Head
                    </button>
                    <button
                      onClick={() => handleRoleQuickSwitch('expert@aicte-india.org')}
                      className={`p-1.5 rounded-lg border text-left font-medium transition-all ${
                        user.role === 'EXPERT' ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Subject Expert
                    </button>
                    <button
                      onClick={() => handleRoleQuickSwitch('public@aicte-india.org')}
                      className={`p-1.5 rounded-lg border text-left font-medium transition-all ${
                        user.role === 'PUBLIC_VIEWER' ? 'bg-amber-600/20 border-amber-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Public Viewer
                    </button>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full py-2 bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-xl border border-rose-500/30 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Account</span>
                </button>
              </div>
            )}
          </>
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
