import React, { useEffect } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CheckSquare, CheckCircle, XCircle, ArrowUpRight, Globe, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const ReviewWorkflowPage: React.FC = () => {
  const { curricula, fetchCurricula, updateActiveCurriculum } = useCurriculumStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCurricula();
  }, [fetchCurricula]);

  const handleDecision = async (curriculumId: string, decision: 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED') => {
    try {
      const res = await api.post(`/reviews/decision/${curriculumId}`, {
        status: decision,
        feedback: `Reviewed by ${user?.name || 'AICTE Bureau Head'}. Status set to ${decision}.`,
      });
      if (res.data.success) {
        fetchCurricula();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async (curriculumId: string) => {
    try {
      const res = await api.post(`/reviews/publish/${curriculumId}`);
      if (res.data.success) {
        fetchCurricula();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 mb-1">
            <CheckSquare className="w-4 h-4 text-purple-400" />
            <span>AICTE Academic Bureau Approval Workflow</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Review & Governance Workflows</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted model curriculum proposals, issue formal feedback, approve, and publish.
          </p>
        </div>
      </div>

      {/* Workflow Stage Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage 1: Submitted / Under Review */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Pending Review
            </h3>
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[10px] font-bold">
              {curricula.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW' || c.status === 'DRAFT').length}
            </span>
          </div>

          <div className="space-y-3">
            {curricula
              .filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW' || c.status === 'DRAFT')
              .map((curr) => (
                <div key={curr._id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div>
                    <span className="font-mono text-[10px] text-brand-400 font-bold">{curr.code}</span>
                    <h4 className="text-sm font-semibold text-white leading-snug">{curr.title}</h4>
                    <p className="text-[11px] text-slate-500">{curr.branch} • {curr.totalCredits} Credits</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleDecision(curr._id, 'APPROVED')}
                      className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-medium rounded border border-emerald-500/30 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                    <button
                      onClick={() => handleDecision(curr._id, 'CHANGES_REQUESTED')}
                      className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white text-xs font-medium rounded border border-amber-500/30 flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> Request Edits
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Stage 2: Approved / Ready for Publish */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Approved Curricula
            </h3>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold">
              {curricula.filter((c) => c.status === 'APPROVED').length}
            </span>
          </div>

          <div className="space-y-3">
            {curricula
              .filter((c) => c.status === 'APPROVED')
              .map((curr) => (
                <div key={curr._id} className="p-4 bg-slate-950 border border-emerald-500/20 rounded-xl space-y-3">
                  <div>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">{curr.code}</span>
                    <h4 className="text-sm font-semibold text-white leading-snug">{curr.title}</h4>
                    <p className="text-[11px] text-slate-400">Approved by AICTE Peer Committee</p>
                  </div>

                  <button
                    onClick={() => handlePublish(curr._id)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Publish to AICTE Portal</span>
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Stage 3: Published Live */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-400 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Published Live
            </h3>
            <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded text-[10px] font-bold">
              {curricula.filter((c) => c.status === 'PUBLISHED').length}
            </span>
          </div>

          <div className="space-y-3">
            {curricula
              .filter((c) => c.status === 'PUBLISHED')
              .map((curr) => (
                <div key={curr._id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-brand-400 font-bold">{curr.code}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Live</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-snug">{curr.title}</h4>
                  <p className="text-[11px] text-slate-500">Publicly accessible for university adoption</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
