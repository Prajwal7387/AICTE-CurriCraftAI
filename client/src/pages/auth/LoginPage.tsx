import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@aicte-india.org');
  const [password, setPassword] = useState('password123');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
    const success = await login(roleEmail, 'password123');
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Sign In to AICTE Portal</h2>
        <p className="text-xs text-slate-400 mt-1">Access model curricula, AI assistants, and NEP compliance engine</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500"
              placeholder="admin@aicte-india.org"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/25"
        >
          <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick SIH Demo Login Shortcuts */}
      <div className="pt-3 border-t border-slate-800">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> SIH Demo Accounts (Click to Fill):
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleDemoLogin('admin@aicte-india.org')}
            className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-brand-600/20 hover:border-brand-500/50 text-left border border-slate-800 text-slate-300 transition-all group"
          >
            <p className="font-bold text-white group-hover:text-cyan-400">AICTE Admin</p>
            <p className="text-[10px] text-slate-400">Full Access (Instant Log In)</p>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('bureau@aicte-india.org')}
            className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-purple-600/20 hover:border-purple-500/50 text-left border border-slate-800 text-slate-300 transition-all group"
          >
            <p className="font-bold text-white group-hover:text-purple-400">Bureau Head</p>
            <p className="text-[10px] text-slate-400">Approval Auth (Instant Log In)</p>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('expert@aicte-india.org')}
            className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-emerald-600/20 hover:border-emerald-500/50 text-left border border-slate-800 text-slate-300 transition-all group"
          >
            <p className="font-bold text-white group-hover:text-emerald-400">Curriculum Expert</p>
            <p className="text-[10px] text-slate-400">Authoring & Edits (Instant Log In)</p>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('public@aicte-india.org')}
            className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-amber-600/20 hover:border-amber-500/50 text-left border border-slate-800 text-slate-300 transition-all group"
          >
            <p className="font-bold text-white group-hover:text-amber-400">Public Viewer</p>
            <p className="text-[10px] text-slate-400">Read Only (Instant Log In)</p>
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center gap-2 text-xs text-slate-400">
        <div>
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 font-semibold hover:underline">
            Register Expert Account
          </Link>
        </div>
        <Link to="/" className="text-cyan-400 font-semibold hover:underline text-[11px] flex items-center gap-1">
          ← Return to Main Home Portal
        </Link>
      </div>
    </div>
  );
};
