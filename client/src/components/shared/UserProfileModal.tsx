import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User, ShieldCheck, Mail, Building, Landmark, LogOut, X, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, login } = useAuthStore();
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const handleRoleSwitch = async (email: string) => {
    await login(email, 'password123');
    onClose();
    navigate('/dashboard');
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/30';
      case 'BUREAU_HEAD':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'EXPERT':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'REVIEWER':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center space-x-4 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-xl">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center text-slate-900 dark:text-slate-200">
              <User className="w-8 h-8 text-cyan-300" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getRoleBadgeStyle(user.role)}">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{user.role.replace('_', ' ')}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{user.name}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-500" /> {user.email}
            </p>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-800 dark:text-slate-300">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Building className="w-4 h-4 text-violet-400" /> Department:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{user.department || 'Academic Operations'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Landmark className="w-4 h-4 text-cyan-400" /> Institution:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{user.institution || 'AICTE Headquarters'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Security Status:
            </span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
              AUTHENTICATED
            </span>
          </div>
        </div>

        {/* Quick Role Switcher Inside Profile Modal */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Switch Governance Role
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleRoleSwitch('admin@aicte-india.org')}
              className={`p-2 rounded-xl border text-left transition-all font-semibold ${
                user.role === 'ADMIN'
                  ? 'bg-violet-600/20 border-violet-500 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              AICTE Admin
            </button>
            <button
              onClick={() => handleRoleSwitch('bureau@aicte-india.org')}
              className={`p-2 rounded-xl border text-left transition-all font-semibold ${
                user.role === 'BUREAU_HEAD'
                  ? 'bg-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              Bureau Head
            </button>
            <button
              onClick={() => handleRoleSwitch('expert@aicte-india.org')}
              className={`p-2 rounded-xl border text-left transition-all font-semibold ${
                user.role === 'EXPERT'
                  ? 'bg-emerald-600/20 border-emerald-500 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              Subject Expert
            </button>
            <button
              onClick={() => handleRoleSwitch('public@aicte-india.org')}
              className={`p-2 rounded-xl border text-left transition-all font-semibold ${
                user.role === 'PUBLIC_VIEWER'
                  ? 'bg-amber-600/20 border-amber-500 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              Public Viewer
            </button>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              logout();
              onClose();
              navigate('/login');
            }}
            className="w-full py-2.5 bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-rose-500/30 flex items-center justify-center space-x-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
