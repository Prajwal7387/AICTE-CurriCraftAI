import React, { useEffect, useState } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { GitBranch, Clock, Plus, RefreshCw, FileDiff, CheckCircle, Tag } from 'lucide-react';
import { api } from '../../services/api';
import { CurriculumVersion } from '../../types';

export const VersionControlPage: React.FC = () => {
  const { activeCurriculum, updateActiveCurriculum } = useCurriculumStore();
  const [versions, setVersions] = useState<CurriculumVersion[]>([]);
  const [newVersionTag, setNewVersionTag] = useState('');
  const [versionMsg, setVersionMsg] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [diffResult, setDiffResult] = useState<any>(null);

  useEffect(() => {
    if (activeCurriculum) {
      fetchVersionHistory();
    }
  }, [activeCurriculum]);

  const fetchVersionHistory = async () => {
    if (!activeCurriculum) return;
    try {
      const res = await api.get(`/versions/history/${activeCurriculum._id}`);
      if (res.data.success) {
        setVersions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCurriculum) return;
    setIsCreating(true);
    try {
      const nextVerNum = `v${(versions.length + 1).toFixed(1)}`;
      const res = await api.post('/versions', {
        curriculumId: activeCurriculum._id,
        version: nextVerNum,
        message: versionMsg || 'Manual version snapshot',
        tag: newVersionTag || 'Minor Revision',
      });
      if (res.data.success) {
        updateActiveCurriculum({ currentVersion: nextVerNum });
        fetchVersionHistory();
        setVersionMsg('');
        setNewVersionTag('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    try {
      const res = await api.post(`/versions/restore/${versionId}`);
      if (res.data.success) {
        updateActiveCurriculum(res.data.data);
        fetchVersionHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompareLatest = async () => {
    if (versions.length < 2) return;
    try {
      const res = await api.get(`/versions/compare?v1Id=${versions[1]._id}&v2Id=${versions[0]._id}`);
      if (res.data.success) {
        setDiffResult(res.data.data);
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
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-400 mb-1">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>Git-Style Model Curriculum Snapshot System</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Curriculum Version Control</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track historical snapshots, compare version diffs, and restore previous curriculum revisions.
          </p>
        </div>

        {versions.length >= 2 && (
          <button
            onClick={handleCompareLatest}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 shadow"
          >
            <FileDiff className="w-4 h-4 text-amber-400" />
            <span>Compare Top 2 Versions</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Snapshot Form */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-400" /> Create Version Snapshot
          </h3>

          <form onSubmit={handleCreateSnapshot} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Snapshot Commit Message</label>
              <input
                type="text"
                required
                value={versionMsg}
                onChange={(e) => setVersionMsg(e.target.value)}
                placeholder="e.g. Added NEP Universal Human Values module"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Version Tag / Milestone</label>
              <input
                type="text"
                value={newVersionTag}
                onChange={(e) => setNewVersionTag(e.target.value)}
                placeholder="e.g. 2026 AICTE Release Candidate"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/25"
            >
              <GitBranch className="w-4 h-4" />
              <span>{isCreating ? 'Creating Snapshot...' : 'Tag & Save Version'}</span>
            </button>
          </form>

          {/* Diff Viewer Card */}
          {diffResult && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <FileDiff className="w-4 h-4" /> Version Diff Comparison
              </h4>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <p className="text-slate-300 font-mono">
                  {diffResult.v1.version} → {diffResult.v2.version}
                </p>
                <p className="text-emerald-400">Credit Delta: {diffResult.creditDelta >= 0 ? `+${diffResult.creditDelta}` : diffResult.creditDelta} Credits</p>
                <p className="text-slate-400">Modules Delta: {diffResult.moduleDelta} Modules</p>
              </div>
            </div>
          )}
        </div>

        {/* Version History Timeline */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Historical Snapshot Timeline
          </h3>

          <div className="space-y-3">
            {versions.length > 0 ? (
              versions.map((ver) => (
                <div
                  key={ver._id}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30">
                        {ver.version}
                      </span>
                      {ver.tag && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {ver.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">{ver.message}</p>
                    <p className="text-[11px] text-slate-500">
                      Author: {ver.author?.name || 'Academic Expert'} • {new Date(ver.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRestore(ver._id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-brand-400" />
                      <span>Restore Snapshot</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">No version snapshots created yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
