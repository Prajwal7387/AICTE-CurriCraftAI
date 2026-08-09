import React, { useEffect, useState } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { Award, CheckCircle, AlertTriangle, XCircle, Lightbulb, Play } from 'lucide-react';
import { api } from '../../services/api';
import { NepReport } from '../../types';

export const NepCompliancePage: React.FC = () => {
  const { activeCurriculum } = useCurriculumStore();
  const [report, setReport] = useState<NepReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeCurriculum) {
      runAudit();
    }
  }, [activeCurriculum]);

  const runAudit = async () => {
    if (!activeCurriculum) return;
    setIsLoading(true);
    try {
      const res = await api.post('/nep/evaluate', { curriculumData: activeCurriculum });
      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>Deterministic Rule-Based AICTE NEP 2020 Compliance Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NEP 2020 Compliance Audit</h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate credit thresholds, UHV requirements, mandatory internships, and lab contact ratios.
          </p>
        </div>

        <button
          onClick={runAudit}
          disabled={isLoading}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all"
        >
          <Play className="w-4 h-4" />
          <span>{isLoading ? 'Running Audit...' : 'Re-Run NEP Audit'}</span>
        </button>
      </div>

      {report && (
        <div className="space-y-6">
          {/* Audit Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center flex flex-col justify-center">
              <span className="text-xs font-medium text-slate-400">Compliance Score</span>
              <p className="text-4xl font-extrabold text-emerald-400 mt-1">{report.score}%</p>
              <span className="text-[11px] font-semibold text-slate-300 mt-1 uppercase tracking-wider">{report.status}</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{report.passedCount}</p>
                <p className="text-xs text-slate-400">Passed Checks</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{report.warningCount}</p>
                <p className="text-xs text-slate-400">Warnings</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{report.failedCount}</p>
                <p className="text-xs text-slate-400">Failed Checks</p>
              </div>
            </div>
          </div>

          {/* Audit Checks Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Detailed Rule Evaluation</h3>
              <div className="space-y-3">
                {report.checks.map((chk, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start space-x-3"
                  >
                    {chk.status === 'PASS' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : chk.status === 'WARNING' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{chk.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{chk.category}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{chk.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Panel */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Actionable Recommendations
              </h3>
              <div className="space-y-2 text-xs">
                {report.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
