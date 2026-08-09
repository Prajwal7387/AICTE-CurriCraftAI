import React, { useState } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { Sparkles, Wand2, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AiAssistantPage: React.FC = () => {
  const { activeCurriculum, updateActiveCurriculum } = useCurriculumStore();
  const [courseTitle, setCourseTitle] = useState(activeCurriculum?.title || 'Cloud Computing & Microservices');
  const [branch, setBranch] = useState(activeCurriculum?.branch || 'Computer Science & Engineering');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiModules, setAiModules] = useState<any[]>([]);

  // Outcome Rewriter state
  const [outcomeText, setOutcomeText] = useState('Understand data structures and basic sorting algorithms.');
  const [targetBloom, setTargetBloom] = useState('Analyze');
  const [improvedOutcome, setImprovedOutcome] = useState<any>(null);
  const [isRewriting, setIsRewriting] = useState(false);

  const handleGenerateSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await api.post('/ai/generate-syllabus', { title: courseTitle, branch, degree: 'B.Tech' });
      if (res.data.success) {
        setAiModules(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewriteOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRewriting(true);
    try {
      const res = await api.post('/ai/improve-outcome', { outcomeText, targetBloomLevel: targetBloom });
      if (res.data.success) {
        setImprovedOutcome(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleIntegrateIntoActive = () => {
    if (!activeCurriculum || aiModules.length === 0) return;
    updateActiveCurriculum({ modules: [...(activeCurriculum.modules || []), ...aiModules] });
    alert('Generated modules successfully integrated into your active workspace!');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Google Gemini AI Model Curriculum Synthesis Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Curriculum Assistant</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate structured syllabus modules, rewrite learning outcomes according to Bloom's Taxonomy, and analyze gaps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Syllabus Generator Tool */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-brand-400" /> AI Syllabus Synthesizer
          </h3>

          <form onSubmit={handleGenerateSyllabus} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Course Title</label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Engineering Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-brand-600/25 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGenerating ? 'Gemini AI Synthesizing...' : 'Generate Modules with Gemini AI'}</span>
            </button>
          </form>

          {/* Generated Modules Results */}
          {aiModules.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Generated Modules ({aiModules.length})
                </h4>
                {activeCurriculum && (
                  <button
                    onClick={handleIntegrateIntoActive}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Integrate into Workspace
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {aiModules.map((mod, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>
                        {mod.code} - {mod.title}
                      </span>
                      <span className="text-brand-400">{mod.credits} Credits</span>
                    </div>
                    <p className="text-slate-400">{mod.description}</p>
                    <div className="text-[11px] text-slate-500">
                      <strong>Topics:</strong> {(mod.topics || []).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Outcome Rewriter Tool */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" /> Bloom Outcome Optimizer
          </h3>

          <form onSubmit={handleRewriteOutcome} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Original Outcome Draft</label>
              <textarea
                rows={3}
                required
                value={outcomeText}
                onChange={(e) => setOutcomeText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Bloom Cognitive Level</label>
              <select
                value={targetBloom}
                onChange={(e) => setTargetBloom(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Remember">Remember</option>
                <option value="Understand">Understand</option>
                <option value="Apply">Apply</option>
                <option value="Analyze">Analyze</option>
                <option value="Evaluate">Evaluate</option>
                <option value="Create">Create</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isRewriting}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center space-x-2"
            >
              <span>{isRewriting ? 'Optimizing...' : 'Optimize Outcome Text'}</span>
            </button>
          </form>

          {improvedOutcome && (
            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-emerald-400">Enhanced Outcome:</span>
              <p className="text-white font-medium">{improvedOutcome.improvedOutcome}</p>
              <p className="text-[11px] text-slate-400 italic">{improvedOutcome.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
