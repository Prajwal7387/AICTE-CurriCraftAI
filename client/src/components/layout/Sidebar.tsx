import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Home,
  LayoutDashboard,
  FileCode,
  GitBranch,
  Sparkles,
  Award,
  Globe,
  BarChart3,
  CheckSquare,
  BookMarked,
  Users,
  Building2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'EXPERT';

  let navItems: Array<{ name: string; path: string; icon: any }> = [];

  const baseItems = [
    { name: 'Home Landing Page', path: '/', icon: Home },
  ];

  if (role === 'ADMIN') {
    navItems = [
      ...baseItems,
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'User & Role Management', path: '/admin/users', icon: Users },
      { name: 'Subject Expert Roster', path: '/bureau/experts', icon: Building2 },
      { name: 'Curriculum Workspace', path: '/workspace', icon: FileCode },
      { name: 'Version Control', path: '/versions', icon: GitBranch },
      { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
      { name: 'NEP 2020 Compliance', path: '/nep-compliance', icon: Award },
      { name: 'Review Workflows', path: '/workflows', icon: CheckSquare },
      { name: 'Public Portal', path: '/portal', icon: Globe },
      { name: 'AICTE Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Resource Hub', path: '/resources', icon: BookMarked },
    ];
  } else if (role === 'BUREAU_HEAD') {
    navItems = [
      ...baseItems,
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Subject Expert Roster', path: '/bureau/experts', icon: Building2 },
      { name: 'Review Workflows', path: '/workflows', icon: CheckSquare },
      { name: 'NEP 2020 Compliance', path: '/nep-compliance', icon: Award },
      { name: 'Public Portal', path: '/portal', icon: Globe },
      { name: 'AICTE Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Resource Hub', path: '/resources', icon: BookMarked },
    ];
  } else if (role === 'EXPERT') {
    navItems = [
      ...baseItems,
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Curriculum Workspace', path: '/workspace', icon: FileCode },
      { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
      { name: 'NEP 2020 Compliance', path: '/nep-compliance', icon: Award },
      { name: 'Version Control', path: '/versions', icon: GitBranch },
      { name: 'Resource Hub', path: '/resources', icon: BookMarked },
    ];
  } else if (role === 'REVIEWER') {
    navItems = [
      ...baseItems,
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Review Workflows', path: '/workflows', icon: CheckSquare },
      { name: 'NEP 2020 Compliance', path: '/nep-compliance', icon: Award },
      { name: 'Public Portal', path: '/portal', icon: Globe },
    ];
  } else {
    // PUBLIC_VIEWER
    navItems = [
      ...baseItems,
      { name: 'Public Model Portal', path: '/portal', icon: Globe },
      { name: 'AICTE Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Resource Hub', path: '/resources', icon: BookMarked },
    ];
  }

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between p-4 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {role.replace('_', ' ')} Navigation
          </p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-bold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 text-violet-400" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info Badge */}
      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between font-bold text-slate-200">
          <span>AICTE Model Portal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <p className="text-[11px] text-violet-400 font-semibold">{role.replace('_', ' ')} Mode</p>
      </div>
    </aside>
  );
};
