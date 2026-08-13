import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../../types';
import { Lock, Mail, User as UserIcon, Building, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EXPERT');
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(name, email, password, role);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create AICTE Expert Account</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Register to author model curricula</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-800 dark:text-slate-300 mb-1">Full Name</label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              placeholder="Prof. Ramesh Kumar"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-800 dark:text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              placeholder="ramesh@iit.ac.in"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-800 dark:text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-800 dark:text-slate-300 mb-1">Requested Portal Role</label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              <option value="EXPERT">Curriculum Expert</option>
              <option value="REVIEWER">Reviewer Committee Member</option>
              <option value="BUREAU_HEAD">Bureau Head</option>
              <option value="PUBLIC_VIEWER">Public Viewer</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-slate-900 dark:text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/25"
        >
          <span>{isLoading ? 'Registering...' : 'Create Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-600 dark:text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-brand-400 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
