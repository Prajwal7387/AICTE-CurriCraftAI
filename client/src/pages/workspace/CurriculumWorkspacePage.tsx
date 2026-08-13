import React, { useEffect, useState } from 'react';
import { useCurriculumStore } from '../../store/useCurriculumStore';
import { Module, LearningOutcome, BloomLevel } from '../../types';
import {
  Plus,
  Trash2,
  Save,
  Sparkles,
  Award,
  MessageSquare,
  CheckCircle,
  Clock,
  Layers,
  BookOpen,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { api } from '../../services/api';

export const CurriculumWorkspacePage: React.FC = () => {
  const { activeCurriculum, updateActiveCurriculum, fetchCurricula, curricula, setActiveCurriculum } =
    useCurriculumStore();

  const [activeTab, setActiveTab] = useState<'DETAILS' | 'MODULES' | 'NEP' | 'AI' | 'COMMENTS'>('MODULES');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Active module form state
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [moduleCredits, setModuleCredits] = useState(3);
  const [lectureHours, setLectureHours] = useState(3);
  const [practicalHours, setPracticalHours] = useState(0);
  const [moduleDesc, setModuleDesc] = useState('');
  const [topicsText, setTopicsText] = useState('');

  // AI loading indicator
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>('Saved');

  useEffect(() => {
    if (!activeCurriculum && curricula.length > 0) {
      setActiveCurriculum(curricula[0]);
    } else if (!activeCurriculum) {
      fetchCurricula();
    }
  }, [activeCurriculum, curricula, fetchCurricula, setActiveCurriculum]);

  useEffect(() => {
    if (activeCurriculum && activeCurriculum.modules?.length > 0 && !selectedModuleId) {
      const firstMod = activeCurriculum.modules[0];
      setSelectedModuleId(firstMod.id);
      loadModuleIntoState(firstMod);
    }
  }, [activeCurriculum, selectedModuleId]);

  const loadModuleIntoState = (mod: Module) => {
    setModuleTitle(mod.title);
    setModuleCode(mod.code);
    setModuleCredits(mod.credits);
    setLectureHours(mod.lectureHours || 3);
    setPracticalHours(mod.practicalHours || 0);
    setModuleDesc(mod.description || '');
    setTopicsText((mod.topics || []).join('\n'));
  };

  const handleSelectModule = (mod: Module) => {
    setSelectedModuleId(mod.id);
    loadModuleIntoState(mod);
  };

  const handleAddModule = () => {
    if (!activeCurriculum) return;
    const newMod: Module = {
      id: `mod_${Date.now()}`,
      title: 'New Engineering Module',
      code: `CS${Math.floor(300 + Math.random() * 400)}`,
      credits: 3,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 0,
      description: 'Module detailed scope and background.',
      topics: ['Topic 1', 'Topic 2'],
      learningOutcomes: [
        {
          id: `lo_${Date.now()}_1`,
          description: 'Analyze problem constraints and select appropriate algorithms.',
          bloomLevel: 'Analyze',
          assessmentMethod: 'Written & Practical Lab Test',
        },
      ],
    };

    const updatedModules = [...(activeCurriculum.modules || []), newMod];
    updateActiveCurriculum({ modules: updatedModules });
    setSelectedModuleId(newMod.id);
    loadModuleIntoState(newMod);
    triggerSaveNotification('New module added');
  };

  const handleSaveActiveModule = () => {
    if (!activeCurriculum || !selectedModuleId) return;

    const topicsArray = topicsText
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedModules = (activeCurriculum.modules || []).map((m) => {
      if (m.id === selectedModuleId) {
        return {
          ...m,
          title: moduleTitle,
          code: moduleCode,
          credits: Number(moduleCredits),
          lectureHours: Number(lectureHours),
          practicalHours: Number(practicalHours),
          description: moduleDesc,
          topics: topicsArray,
        };
      }
      return m;
    });

    updateActiveCurriculum({ modules: updatedModules });
    triggerSaveNotification('Module saved');
  };

  const handleDeleteModule = (modId: string) => {
    if (!activeCurriculum) return;
    const updated = (activeCurriculum.modules || []).filter((m) => m.id !== modId);
    updateActiveCurriculum({ modules: updated });
    if (selectedModuleId === modId) {
      if (updated.length > 0) {
        setSelectedModuleId(updated[0].id);
        loadModuleIntoState(updated[0]);
      } else {
        setSelectedModuleId(null);
      }
    }
    triggerSaveNotification('Module removed');
  };

  const handleAddLearningOutcome = () => {
    if (!activeCurriculum || !selectedModuleId) return;

    const newLo: LearningOutcome = {
      id: `lo_${Date.now()}`,
      description: 'Demonstrate proficiency in core module concepts.',
      bloomLevel: 'Apply',
      assessmentMethod: 'Laboratory Assignment & Final Exam',
    };

    const updatedModules = (activeCurriculum.modules || []).map((m) => {
      if (m.id === selectedModuleId) {
        return {
          ...m,
          learningOutcomes: [...(m.learningOutcomes || []), newLo],
        };
      }
      return m;
    });

    updateActiveCurriculum({ modules: updatedModules });
    triggerSaveNotification('Learning outcome added');
  };

  const handleAiGenerateModules = async () => {
    if (!activeCurriculum) return;
    setIsAiGenerating(true);
    try {
      const res = await api.post('/ai/generate-syllabus', {
        title: activeCurriculum.title,
        branch: activeCurriculum.branch,
        degree: activeCurriculum.degree,
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        const generatedMods = res.data.data;
        updateActiveCurriculum({ modules: [...(activeCurriculum.modules || []), ...generatedMods] });
        triggerSaveNotification('AI generated modules integrated!');
      }
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const triggerSaveNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus('Saved'), 2500);
  };

  if (!activeCurriculum) {
    return (
      <div className="p-12 text-center text-slate-600 dark:text-slate-400">
        <BookOpen className="w-12 h-12 text-brand-500 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Loading Workspace...</h2>
        <p className="text-xs text-slate-500 mt-1">Fetching active model curriculum document</p>
      </div>
    );
  }

  const activeModule = (activeCurriculum.modules || []).find((m) => m.id === selectedModuleId);

  return (
    <div className="space-y-4">
      {/* Top Workspace Bar */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {activeCurriculum.code}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Version: {activeCurriculum.currentVersion}</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium ml-2">
              <Clock className="w-3 h-3" /> {saveStatus}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">{activeCurriculum.title}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAiGenerateModules}
            disabled={isAiGenerating}
            className="px-3.5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20 flex items-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{isAiGenerating ? 'AI Synthesizing...' : 'AI Syllabus Generator'}</span>
          </button>

          <button
            onClick={() => {
              api.post(`/reviews/submit/${activeCurriculum._id}`).then(() => {
                updateActiveCurriculum({ status: 'SUBMITTED' });
                triggerSaveNotification('Submitted for Review');
              });
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      {/* 3-Column Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* LEFT COLUMN: Module & Section Navigation */}
        <div className="lg:col-span-3 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Modules ({activeCurriculum.modules?.length || 0})
              </h3>
              <button
                onClick={handleAddModule}
                className="p-1 rounded bg-brand-500/15 hover:bg-brand-600 text-brand-700 dark:text-brand-400 hover:text-white transition-colors"
                title="Add Module"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {(activeCurriculum.modules || []).map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => handleSelectModule(mod)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedModuleId === mod.id
                      ? 'bg-brand-600/15 border-brand-500/40 text-brand-900 dark:text-white font-medium shadow-md'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[10px] text-brand-700 dark:text-brand-400 font-bold">{mod.code}</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{mod.credits} Credits</span>
                  </div>
                  <p className="text-xs font-semibold leading-snug truncate">{mod.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => setActiveTab('NEP')}
              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 flex items-center justify-between text-xs text-slate-800 dark:text-slate-300"
            >
              <span className="flex items-center gap-2 font-medium">
                <Award className="w-4 h-4 text-amber-500 dark:text-yellow-400" /> NEP Compliance Score
              </span>
              <span className="font-bold text-emerald-500 dark:text-emerald-400">{activeCurriculum.nepComplianceScore || 90}%</span>
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: Module & Outcome Structured Editor */}
        <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5">
          {activeModule ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Module Section Editor</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Configure course outcomes, credits, and topics</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveActiveModule}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Module</span>
                  </button>
                  <button
                    onClick={() => handleDeleteModule(activeModule.id)}
                    className="p-1.5 bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 rounded-lg"
                    title="Delete Module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Module Metadata Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Module Title</label>
                  <input
                    type="text"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Module Code</label>
                  <input
                    type="text"
                    value={moduleCode}
                    onChange={(e) => setModuleCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Credits</label>
                  <input
                    type="number"
                    value={moduleCredits}
                    onChange={(e) => setModuleCredits(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Lecture Hrs/Wk</label>
                  <input
                    type="number"
                    value={lectureHours}
                    onChange={(e) => setLectureHours(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Practical Hrs/Wk</label>
                  <input
                    type="number"
                    value={practicalHours}
                    onChange={(e) => setPracticalHours(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Module Overview / Description</label>
                <textarea
                  rows={2}
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Syllabus Topics (One per line)</label>
                <textarea
                  rows={4}
                  value={topicsText}
                  onChange={(e) => setTopicsText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Course Learning Outcomes (CLO) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                    Course Learning Outcomes ({activeModule.learningOutcomes?.length || 0})
                  </h4>
                  <button
                    onClick={handleAddLearningOutcome}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 text-[11px] font-medium rounded flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Outcome
                  </button>
                </div>

                <div className="space-y-2">
                  {(activeModule.learningOutcomes || []).map((lo) => (
                    <div key={lo.id} className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-brand-700 dark:text-brand-400">Bloom Level:</span>
                        <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/20 rounded text-[10px] font-semibold">
                          {lo.bloomLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-900 dark:text-slate-200">{lo.description}</p>
                      <p className="text-[10px] text-slate-500 italic">Assessment: {lo.assessmentMethod}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500">Select or add a module to edit content.</div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Assistant / NEP Audit / Comments Side Panel */}
        <div className="lg:col-span-3 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 pb-2 space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('MODULES')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                activeTab === 'MODULES' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('NEP')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                activeTab === 'NEP' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              NEP Audit
            </button>
            <button
              onClick={() => setActiveTab('COMMENTS')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                activeTab === 'COMMENTS' ? 'bg-brand-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Comments
            </button>
          </div>

          {activeTab === 'NEP' ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">NEP 2020 Compliance Score</p>
                <p className="text-3xl font-extrabold text-emerald-400 mt-1">{activeCurriculum.nepComplianceScore || 90}%</p>
                <span className="text-[10px] text-slate-500">Rule-based AICTE Audit Passed</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <p className="font-bold text-slate-800 dark:text-slate-300">Passed Checks:</p>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Total Credits (160 Credits)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Universal Human Values (UHV)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Mandatory Internship
                  </li>
                </ul>
              </div>
            </div>
          ) : activeTab === 'COMMENTS' ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="font-semibold text-slate-900 dark:text-white">Reviewer Committee Comment</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  "Please ensure the practical hours in Module 2 comply with the minimum 2-hour lab guidelines."
                </p>
                <span className="text-[10px] text-slate-500 block text-right">— Dr. Sunita Sharma</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-1.5 text-brand-400 font-semibold">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Curriculum Metrics</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-800 dark:text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Total Credits</span>
                    <span className="font-bold">{activeCurriculum.totalCredits}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Degree</span>
                    <span className="font-bold">{activeCurriculum.degree}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
