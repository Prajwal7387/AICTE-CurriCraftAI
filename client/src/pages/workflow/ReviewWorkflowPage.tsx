import React, { useEffect, useState } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CheckSquare, CheckCircle, XCircle, Globe, AlertCircle, Sparkles, MessageSquare, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import { Curriculum } from '../../types';

export const ReviewWorkflowPage: React.FC = () => {
  const { curricula, fetchCurricula, updateActiveCurriculum, setActiveCurriculum } = useCurriculumStore();
  const { user } = useAuthStore();

  // Feedback modal state
  const [requestEditsCurr, setRequestEditsCurr] = useState<Curriculum | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    fetchCurricula();
  }, [fetchCurricula]);

  const handleDecision = async (curriculumId: string, decision: 'APPROVED' | 'CHANGES_REQUESTED', customFeedback?: string) => {
    const targetCurr = curricula.find((c) => c._id === curriculumId);
    const feedbackNote = customFeedback || `Reviewed by ${user?.name || 'AICTE Bureau Head'}. Decision: ${decision}.`;

    if (targetCurr) {
      const updatedCurr = { ...targetCurr, status: decision, reviewNotes: feedbackNote };
      updateActiveCurriculum(updatedCurr);
      setActiveCurriculum(updatedCurr);
    }

    try {
      await api.post(`/reviews/decision/${curriculumId}`, {
        status: decision,
        feedback: feedbackNote,
      });
    } catch {
      // Local state already updated
    }
  };

  const handleReopen = async (curriculumId: string) => {
    const targetCurr = curricula.find((c) => c._id === curriculumId);
    if (targetCurr) {
      const updatedCurr = { ...targetCurr, status: 'UNDER_REVIEW' as const };
      updateActiveCurriculum(updatedCurr);
      setActiveCurriculum(updatedCurr);
    }
  };

  const handlePublish = async (curriculumId: string) => {
    const targetCurr = curricula.find((c) => c._id === curriculumId);
    if (targetCurr) {
      const updatedCurr = { ...targetCurr, status: 'PUBLISHED' as const };
      updateActiveCurriculum(updatedCurr);
      setActiveCurriculum(updatedCurr);
    }

    try {
      await api.post(`/reviews/publish/${curriculumId}`);
    } catch {
      // Local state already updated
    }
  };

  const handleConfirmRequestEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestEditsCurr) return;

    const note = feedbackText.trim() || 'Edits and revisions requested by AICTE Bureau Head. Please review module outcomes and NEP compliance guidelines.';
    handleDecision(requestEditsCurr._id, 'CHANGES_REQUESTED', note);

    setRequestEditsCurr(null);
    setFeedbackText('');
  };

  const pendingCurricula = curricula.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW');
  const deniedCurricula = curricula.filter((c) => c.status === 'CHANGES_REQUESTED');
  const approvedCurricula = curricula.filter((c) => c.status === 'APPROVED');
  const publishedCurricula = curricula.filter((c) => c.status === 'PUBLISHED');

  const presetFeedbackOptions = [
    'NEP 2020 Multidisciplinary Elective credits are insufficient.',
    'Module Bloom Taxonomy levels require re-alignment.',
    'Lab evaluation criteria incomplete for core practical modules.',
    'Skill Enhancement Course (SEC) credits do not meet minimum AICTE norms.',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 mb-1">
            <CheckSquare className="w-4 h-4 text-purple-400" />
            <span>AICTE Academic Bureau Approval Workflow</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Review & Governance Workflows</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Review submitted model curriculum proposals, issue formal feedback, approve, request edits, and publish live.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-900 dark:text-white">{curricula.length}</span> Total Curricula tracked in governance pipeline
        </div>
      </div>

      {/* Workflow Stage Columns - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Stage 1: Submitted / Under Review */}
        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-purple-400" /> Pending Review
              </h3>
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-bold">
                {pendingCurricula.length}
              </span>
            </div>

            <div className="space-y-3">
              {pendingCurricula.length > 0 ? (
                pendingCurricula.map((curr) => (
                  <div key={curr._id} className="p-4 bg-white dark:bg-slate-950 border border-purple-500/20 hover:border-purple-500/40 rounded-xl space-y-3 shadow-md transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-purple-400 font-bold">{curr.code}</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[9px] font-semibold">
                          {curr.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug mt-1">{curr.title}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{curr.branch} • {curr.totalCredits} Credits</p>
                      {curr.reviewer && (
                        <p className="text-[10px] text-indigo-300 mt-1 font-medium">Assigned SME: {String(curr.reviewer)}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleDecision(curr._id, 'APPROVED')}
                        className="flex-1 py-1.5 bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-400 hover:text-white text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center gap-1 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => {
                          setRequestEditsCurr(curr);
                          setFeedbackText(curr.reviewNotes || '');
                        }}
                        className="flex-1 py-1.5 bg-amber-50 dark:bg-amber-600/20 hover:bg-amber-600 text-amber-700 dark:text-amber-400 hover:text-white text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-500/30 flex items-center justify-center gap-1 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Request Edits
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No proposals pending review.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage 2: Denied / Revision Requested */}
        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Denied / Revision Requested
              </h3>
              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-full text-[10px] font-bold">
                {deniedCurricula.length}
              </span>
            </div>

            <div className="space-y-3">
              {deniedCurricula.length > 0 ? (
                deniedCurricula.map((curr) => (
                  <div key={curr._id} className="p-4 bg-white dark:bg-slate-950 border border-amber-500/30 rounded-xl space-y-3 shadow-md transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400 font-bold">{curr.code}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[9px] font-bold border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Revision Requested
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug mt-1">{curr.title}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{curr.branch} • {curr.totalCredits} Credits</p>
                    </div>

                    {/* Feedback box */}
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 rounded-lg text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Bureau Feedback Notes:
                      </span>
                      <p className="text-[11px] text-amber-900 dark:text-amber-200 italic leading-relaxed">
                        "{curr.reviewNotes || 'Edits requested by Bureau Head. Revisions needed before approval.'}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleReopen(curr._id)}
                      className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 text-slate-800 dark:text-slate-300 hover:text-white text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-open for Review
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No denied proposals or requested edits.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage 3: Approved Curricula */}
        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Approved Curricula
              </h3>
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full text-[10px] font-bold">
                {approvedCurricula.length}
              </span>
            </div>

            <div className="space-y-3">
              {approvedCurricula.length > 0 ? (
                approvedCurricula.map((curr) => (
                  <div key={curr._id} className="p-4 bg-white dark:bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3 shadow-md transition-all">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{curr.code}</span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug mt-1">{curr.title}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Approved by AICTE Peer Review Committee</p>
                    </div>

                    <button
                      onClick={() => handlePublish(curr._id)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Publish to AICTE Portal</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No approved curricula pending publish.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage 4: Published Live */}
        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Published Live
              </h3>
              <span className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 rounded-full text-[10px] font-bold">
                {publishedCurricula.length}
              </span>
            </div>

            <div className="space-y-3">
              {publishedCurricula.length > 0 ? (
                publishedCurricula.map((curr) => (
                  <div key={curr._id} className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 rounded-xl space-y-2 shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 font-bold">{curr.code}</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                        <Sparkles className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Live
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{curr.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Publicly accessible for university adoption</p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No published live curricula yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- REQUEST EDITS / DENY REASON MODAL --- */}
      {requestEditsCurr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-50 dark:bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-bold">
                <XCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h3 className="text-lg text-slate-900 dark:text-white">Request Edits / Issue Revision Note</h3>
              </div>
              <button
                onClick={() => setRequestEditsCurr(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white p-1 rounded-lg hover:bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRequestEdits} className="space-y-4">
              <div>
                <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold mb-1">Target Curriculum:</p>
                <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="font-mono text-xs text-amber-700 dark:text-amber-400 font-bold">{requestEditsCurr.code}</p>
                  <p className="text-xs text-slate-900 dark:text-white font-bold">{requestEditsCurr.title}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Quick Select Common Feedback Notes:</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {presetFeedbackOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFeedbackText(opt)}
                      className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-200 transition-all"
                    >
                      + {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Detailed Rejection / Revision Comments *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify required curriculum modifications, credit redistribution, or NEP compliance corrections..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRequestEditsCurr(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Issue Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

