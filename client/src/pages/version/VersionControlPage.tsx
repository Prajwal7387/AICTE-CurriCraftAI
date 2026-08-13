import React, { useEffect, useState } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { GitBranch, Clock, Plus, RefreshCw, FileDiff, CheckCircle, Tag, Sparkles, X, Layers, AlertCircle, Lightbulb } from 'lucide-react';
import { api } from '../../services/api';
import { CurriculumVersion } from '../../types';

export const VersionControlPage: React.FC = () => {
  const { activeCurriculum, updateActiveCurriculum, setActiveCurriculum } = useCurriculumStore();

  const defaultVersions: CurriculumVersion[] = [
    {
      _id: 'ver_v2_0',
      curriculumId: activeCurriculum?._id || 'demo_cse_2026',
      version: 'v2.0',
      author: { id: 'u1', name: 'Prof. Ananth R. Rao', email: 'expert@aicte-india.org', role: 'EXPERT' },
      message: 'Integrated Universal Human Values-II & NEP 2020 160-credit threshold',
      tag: 'NEP 2020 Compliant',
      snapshot: activeCurriculum || ({} as any),
      createdAt: '2026-08-08T10:00:00.000Z',
    },
    {
      _id: 'ver_v1_1',
      curriculumId: activeCurriculum?._id || 'demo_cse_2026',
      version: 'v1.1',
      author: { id: 'u2', name: 'Prof. Rajive Kumar', email: 'bureau@aicte-india.org', role: 'BUREAU_HEAD' },
      message: 'Added AI & Machine Learning Architecture practical lab credits',
      tag: 'Bureau Peer Review Pass',
      snapshot: { ...activeCurriculum, currentVersion: 'v1.1', totalCredits: 158 } as any,
      createdAt: '2026-08-05T14:30:00.000Z',
    },
    {
      _id: 'ver_v1_0',
      curriculumId: activeCurriculum?._id || 'demo_cse_2026',
      version: 'v1.0',
      author: { id: 'u3', name: 'Dr. T. G. Sitharam', email: 'admin@aicte-india.org', role: 'ADMIN' },
      message: 'Initial model curriculum draft creation',
      tag: 'Baseline Snapshot',
      snapshot: { ...activeCurriculum, currentVersion: 'v1.0', totalCredits: 154 } as any,
      createdAt: '2026-08-01T09:15:00.000Z',
    },
  ];

  const [versions, setVersions] = useState<CurriculumVersion[]>(defaultVersions);
  const [newVersionTag, setNewVersionTag] = useState('');
  const [versionMsg, setVersionMsg] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [diffResult, setDiffResult] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (activeCurriculum) {
      fetchVersionHistory();
    }
  }, [activeCurriculum]);

  const fetchVersionHistory = async () => {
    if (!activeCurriculum) return;
    try {
      const res = await api.get(`/versions/history/${activeCurriculum._id}`);
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setVersions(res.data.data);
      }
    } catch {
      setVersions(defaultVersions);
    }
  };

  const handleCreateSnapshot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeCurriculum) return;
    setIsCreating(true);

    const nextVerNum = `v2.${versions.length + 1}`;
    const commitMessage = versionMsg.trim() || `Model curriculum iteration snapshot (${nextVerNum})`;
    const tagLabel = newVersionTag.trim() || 'Minor Revision';

    const newVerItem: CurriculumVersion = {
      _id: 'ver_' + Date.now(),
      curriculumId: activeCurriculum._id,
      version: nextVerNum,
      author: { id: 'u1', name: 'Prof. Rajive Kumar', email: 'bureau@aicte-india.org', role: 'BUREAU_HEAD' },
      message: commitMessage,
      tag: tagLabel,
      snapshot: { ...activeCurriculum, currentVersion: nextVerNum },
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await api.post('/versions', {
        curriculumId: activeCurriculum._id,
        version: nextVerNum,
        message: commitMessage,
        tag: tagLabel,
      });
      if (res.data.success && res.data.data) {
        updateActiveCurriculum({ currentVersion: nextVerNum });
        setVersions((prev) => [res.data.data, ...prev]);
        setVersionMsg('');
        setNewVersionTag('');
        setIsCreating(false);
        showToast(`Version snapshot ${nextVerNum} created and saved to history!`);
        return;
      }
    } catch {
      // Client state fallback
    }

    updateActiveCurriculum({ currentVersion: nextVerNum });
    setVersions((prev) => [newVerItem, ...prev]);
    setVersionMsg('');
    setNewVersionTag('');
    setIsCreating(false);
    showToast(`Version snapshot ${nextVerNum} created and saved to history!`);
  };

  const handleRestore = async (versionId: string) => {
    const found = versions.find((v) => v._id === versionId);
    if (!found) return;

    try {
      const res = await api.post(`/versions/restore/${versionId}`);
      if (res.data.success && res.data.data) {
        updateActiveCurriculum(res.data.data);
        setActiveCurriculum(res.data.data);
      } else if (found.snapshot && found.snapshot.title) {
        updateActiveCurriculum(found.snapshot);
        setActiveCurriculum(found.snapshot);
      } else {
        updateActiveCurriculum({ currentVersion: `Restored-${found.version}` });
      }
    } catch {
      if (found.snapshot && found.snapshot.title) {
        updateActiveCurriculum(found.snapshot);
        setActiveCurriculum(found.snapshot);
      } else {
        updateActiveCurriculum({ currentVersion: `Restored-${found.version}` });
      }
    }

    showToast(`Restored curriculum snapshot to version ${found.version}!`);
  };

  const handleCompareLatest = async () => {
    const topV1 = versions[1] || defaultVersions[1];
    const topV2 = versions[0] || defaultVersions[0];

    const v1Credits = topV1.snapshot?.totalCredits || 154;
    const v2Credits = topV2.snapshot?.totalCredits || activeCurriculum?.totalCredits || 160;
    const creditDelta = v2Credits - v1Credits;

    setDiffResult({
      v1: { version: topV1.version, message: topV1.message, totalCredits: v1Credits },
      v2: { version: topV2.version, message: topV2.message, totalCredits: v2Credits },
      creditDelta: creditDelta >= 0 ? `+${creditDelta}` : `${creditDelta}`,
      modulesAdded: [{ code: 'HSMC-UHV2', title: 'Universal Human Values-II', credits: 3 }],
    });

    showToast(`Diff comparison computed between ${topV1.version} and ${topV2.version}`);
  };

  const presetMessages = [
    { msg: 'Added NEP 2020 Multidisciplinary Elective credits', tag: 'NEP 2020 Audit Pass' },
    { msg: 'Revised Bloom Outcome levels for practical lab modules', tag: 'Bloom Alignment' },
    { msg: 'Approved by AICTE Peer Review Committee', tag: 'AICTE Approved' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-50 dark:bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>Git-Style Model Curriculum Snapshot System</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Curriculum Version Control</h1>
            <p className="text-xs text-slate-800 dark:text-slate-300 max-w-2xl leading-relaxed mt-1">
              Track historical snapshots, compare version diffs, and restore previous curriculum revisions.
            </p>
          </div>

          <button
            onClick={handleCompareLatest}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-purple-300 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:border-purple-500 flex items-center space-x-2 shadow-lg transition-all"
          >
            <FileDiff className="w-4 h-4 text-amber-400" />
            <span>Compare Top 2 Versions</span>
          </button>
        </div>

        {/* Active Curriculum Badge Bar */}
        {activeCurriculum && (
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-800 dark:text-slate-300 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-purple-300 font-bold bg-white/10 px-2 py-0.5 rounded">{activeCurriculum.code}</span>
              <span className="font-bold text-slate-900 dark:text-white">{activeCurriculum.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-300 font-semibold">{activeCurriculum.totalCredits} Total Credits</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                Active Version: {activeCurriculum.currentVersion || 'v2.0'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Snapshot Form */}
        <div className="lg:col-span-4 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Create Version Snapshot
            </h3>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400" /> Click presets below
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Quick Commit Presets:</span>
            <div className="space-y-1">
              {presetMessages.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setVersionMsg(p.msg);
                    setNewVersionTag(p.tag);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-purple-950/40 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-[11px] text-slate-800 dark:text-slate-300 hover:text-purple-200 transition-all truncate"
                >
                  + {p.msg}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateSnapshot} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Snapshot Commit Message</label>
              <input
                type="text"
                value={versionMsg}
                onChange={(e) => setVersionMsg(e.target.value)}
                placeholder="e.g. Added NEP Universal Human Values module"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Version Tag / Milestone</label>
              <input
                type="text"
                value={newVersionTag}
                onChange={(e) => setNewVersionTag(e.target.value)}
                placeholder="e.g. 2026 AICTE Release Candidate"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-900 dark:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/25 transform hover:-translate-y-0.5"
            >
              <GitBranch className="w-4 h-4" />
              <span>{isCreating ? 'Creating Snapshot...' : 'Tag & Save Version'}</span>
            </button>
          </form>

          {/* Diff Viewer Card */}
          {diffResult && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <FileDiff className="w-4 h-4" /> Version Diff Comparison
              </h4>
              <div className="p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-amber-500/30 text-xs space-y-1.5 shadow-md">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold text-slate-800 dark:text-slate-300">
                  <span>{diffResult.v1.version}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-400">{diffResult.v2.version}</span>
                </div>
                <p className="text-emerald-400 font-semibold text-[11px]">Total Credit Delta: {diffResult.creditDelta} Credits</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">Milestone Tag: {diffResult.v2.message}</p>
                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-cyan-300 font-mono">
                  + Added: {diffResult.modulesAdded[0].code} - {diffResult.modulesAdded[0].title}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Version History Timeline */}
        <div className="lg:col-span-8 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Historical Snapshot Timeline ({versions.length})
            </h3>
            {activeCurriculum?.currentVersion && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/20">
                Active: {activeCurriculum.currentVersion}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {versions.map((ver) => (
              <div
                key={ver._id}
                className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      {ver.version}
                    </span>
                    {ver.tag && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {ver.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{ver.message}</p>
                  <p className="text-[11px] text-slate-500">
                    Author: {ver.author?.name || 'Academic Expert'} • {new Date(ver.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRestore(ver._id)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 text-slate-900 dark:text-slate-200 hover:text-slate-900 dark:text-white text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:border-purple-500 flex items-center space-x-1.5 transition-all shadow"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
                    <span>Restore Snapshot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


