import React, { useState } from 'react';
import { ShieldCheck, Users, UserPlus, Search, CheckCircle, XCircle, Filter, KeyRound } from 'lucide-react';
import { UserRole } from '../../types';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
}

const initialUsersList: UserItem[] = [
  { id: '1', name: 'Dr. T. G. Sitharam', email: 'admin@aicte-india.org', role: 'ADMIN', institution: 'AICTE Headquarters', department: 'Executive Directorate', status: 'ACTIVE', lastLogin: '2 mins ago' },
  { id: '2', name: 'Prof. Rajive Kumar', email: 'bureau@aicte-india.org', role: 'BUREAU_HEAD', institution: 'AICTE Headquarters', department: 'Academic Policy Bureau', status: 'ACTIVE', lastLogin: '1 hour ago' },
  { id: '3', name: 'Prof. Ananth R. Rao', email: 'expert@aicte-india.org', role: 'EXPERT', institution: 'IIT Bombay', department: 'Computer Science & Eng', status: 'ACTIVE', lastLogin: '3 hours ago' },
  { id: '4', name: 'Dr. Sunita Sharma', email: 'reviewer@aicte-india.org', role: 'REVIEWER', institution: 'IISc Bangalore', department: 'Peer Review Panel', status: 'ACTIVE', lastLogin: 'Yesterday' },
  { id: '5', name: 'Public Guest Student', email: 'public@aicte-india.org', role: 'PUBLIC_VIEWER', institution: 'State Engineering College', department: 'General Public', status: 'ACTIVE', lastLogin: '4 hours ago' },
  { id: '6', name: 'Prof. S. K. Gupta', email: 'sk.gupta@iitb.ac.in', role: 'EXPERT', institution: 'IIT Delhi', department: 'Mechanical Engineering', status: 'INACTIVE', lastLogin: '3 days ago' },
];

export const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>(initialUsersList);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const toggleStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.institution.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>AICTE System Administrator RBAC Governance Control Panel</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User & Role Permission Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage user accounts, assign governance roles, toggle account status, and configure academic bureau permissions.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search user, email, or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 font-medium"
          >
            <option value="ALL">All Governance Roles</option>
            <option value="ADMIN">AICTE Administrator</option>
            <option value="BUREAU_HEAD">Bureau Head</option>
            <option value="EXPERT">Curriculum Expert</option>
            <option value="REVIEWER">Peer Reviewer</option>
            <option value="PUBLIC_VIEWER">Public Viewer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" /> Registered AICTE Governance Portal Users ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">User Details</th>
                <th className="p-3">Institution & Dept</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Account Status</th>
                <th className="p-3">Last Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-300">{u.institution}</div>
                    <div className="text-[11px] text-slate-500">{u.department}</div>
                  </td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono font-bold text-cyan-400"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="BUREAU_HEAD">BUREAU_HEAD</option>
                      <option value="EXPERT">EXPERT</option>
                      <option value="REVIEWER">REVIEWER</option>
                      <option value="PUBLIC_VIEWER">PUBLIC_VIEWER</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {u.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-400 text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">{u.lastLogin}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
