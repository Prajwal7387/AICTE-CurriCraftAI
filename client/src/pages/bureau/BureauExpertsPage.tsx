import React, { useState } from 'react';
import { Building2, UserCheck, Award, Plus, CheckCircle, ShieldCheck, Mail, BookOpen } from 'lucide-react';

export const BureauExpertsPage: React.FC = () => {
  const [experts] = useState([
    { id: '1', name: 'Dr. Rajesh Sharma', title: 'Senior Professor', institution: 'IIT Delhi', dept: 'Computer Science', activeReviews: 3, completed: 14 },
    { id: '2', name: 'Dr. Priya Nair', title: 'Associate Professor', institution: 'IISc Bangalore', dept: 'Electrical Engineering', activeReviews: 2, completed: 9 },
    { id: '3', name: 'Prof. S. K. Gupta', title: 'Department Head', institution: 'IIT Bombay', dept: 'Mechanical Engineering', activeReviews: 1, completed: 22 },
  ]);

  return (
    <div className="space-y-6">
      {/* Bureau Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-800 via-indigo-700 to-purple-800 text-white shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold backdrop-blur-md border border-white/15">
          <Building2 className="h-3.5 w-3.5 text-cyan-200" /> AICTE Academic Bureau Panel Management
        </div>
        <h1 className="text-3xl font-black tracking-tight">Subject Expert Committee Roster</h1>
        <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
          Authorize Subject Matter Experts (SMEs), assign model curricula for peer review, and manage bureau validation workloads.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-white">Empanelled AICTE Subject Experts ({experts.length})</h3>
        <button
          onClick={() => alert('Empanel New Subject Expert modal triggered')}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Empanel Expert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {experts.map((exp) => (
          <div key={exp.id} className="glass-card-glow p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-bold text-[10px]">
                {exp.dept}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" /> Empanelled
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{exp.name}</h4>
              <p className="text-xs text-slate-400">{exp.title} • {exp.institution}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 rounded-xl text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Active Reviews</span>
                <p className="font-extrabold text-sm text-cyan-400">{exp.activeReviews}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Completed</span>
                <p className="font-extrabold text-sm text-emerald-400">{exp.completed}</p>
              </div>
            </div>

            <button
              onClick={() => alert(`Assigned model curriculum review to ${exp.name}`)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Assign Curriculum Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
