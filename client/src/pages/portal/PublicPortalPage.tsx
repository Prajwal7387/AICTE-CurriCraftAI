import React, { useEffect, useState } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { Globe, Search, Download, BookOpen, CheckCircle, ExternalLink, Filter } from 'lucide-react';
import { Curriculum } from '../../types';

export const PublicPortalPage: React.FC = () => {
  const { curricula, fetchCurricula } = useCurriculumStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);

  useEffect(() => {
    fetchCurricula();
  }, [fetchCurricula]);

  const publishedCurricula = curricula.filter(
    (c) =>
      (selectedBranch === 'ALL' || c.branch === selectedBranch) &&
      (c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.branch.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDownloadSummary = (curr: Curriculum) => {
    const jsonStr = JSON.stringify(curr, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${curr.code}_AICTE_Model_Curriculum.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Public Header */}
      <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-slate-900 border border-brand-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>AICTE National Public Model Curriculum Repository</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Public Model Curriculum Portal</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Browse, inspect, and download official AICTE unified model engineering curricula for state universities and technical institutions.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by degree, branch, course code, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Branch:</span>
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Engineering Branches</option>
            <option value="Computer Science & Engineering">Computer Science & Eng</option>
            <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
          </select>
        </div>
      </div>

      {/* Public Curricula Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedCurricula.map((curr) => (
          <div
            key={curr._id}
            className="bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                  {curr.code}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {curr.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                {curr.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{curr.description}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 text-[10px] block">Degree & Branch</span>
                  <span className="font-semibold text-white">{curr.degree}</span>
                  <span className="text-slate-400 text-[11px] block truncate">{curr.branch}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Total Credits</span>
                  <span className="font-semibold text-emerald-400">{curr.totalCredits} Credits</span>
                  <span className="text-slate-400 text-[11px] block">NEP Score: {curr.nepComplianceScore}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setSelectedCurriculum(curr)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                <span>Inspect Syllabus</span>
              </button>
              <button
                onClick={() => handleDownloadSummary(curr)}
                className="p-2 bg-brand-600/20 hover:bg-brand-600 text-brand-400 hover:text-white rounded-xl border border-brand-500/30 transition-colors"
                title="Download JSON Summary"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Inspector for Public Curriculum Detail */}
      {selectedCurriculum && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-brand-400">{selectedCurriculum.code}</span>
                <h3 className="text-lg font-bold text-white">{selectedCurriculum.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCurriculum(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300">{selectedCurriculum.description}</p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Modules Breakdown ({selectedCurriculum.modules?.length || 0})
              </h4>
              {(selectedCurriculum.modules || []).map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-white">
                    <span>
                      {m.code} - {m.title}
                    </span>
                    <span className="text-brand-400">{m.credits} Credits</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{m.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleDownloadSummary(selectedCurriculum)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" /> Download Official Model Curriculum JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
