import React, { useState } from 'react';
import { Building2, Plus, CheckCircle, Search, X, Calendar, FileText, Send, Sparkles, UserCheck, ShieldCheck, Mail, BookOpen } from 'lucide-react';
import { useCurriculumStore } from '../../store/useCurriculumStore';

interface Expert {
  id: string;
  name: string;
  title: string;
  institution: string;
  dept: string;
  email: string;
  activeReviews: number;
  completed: number;
}

export const BureauExpertsPage: React.FC = () => {
  const { curricula, updateActiveCurriculum, setActiveCurriculum } = useCurriculumStore();

  const [experts, setExperts] = useState<Expert[]>([
    { id: '1', name: 'Dr. Rajesh Sharma', title: 'Senior Professor', institution: 'IIT Delhi', dept: 'Computer Science', email: 'r.sharma@iitd.ac.in', activeReviews: 3, completed: 14 },
    { id: '2', name: 'Dr. Priya Nair', title: 'Associate Professor', institution: 'IISc Bangalore', dept: 'Electrical Engineering', email: 'priya.nair@iisc.ac.in', activeReviews: 2, completed: 9 },
    { id: '3', name: 'Prof. S. K. Gupta', title: 'Department Head', institution: 'IIT Bombay', dept: 'Mechanical Engineering', email: 'skgupta@iitb.ac.in', activeReviews: 1, completed: 22 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Empanel Modal State
  const [isEmpanelModalOpen, setIsEmpanelModalOpen] = useState(false);
  const [newExpert, setNewExpert] = useState({
    name: '',
    title: 'Senior Professor',
    institution: '',
    dept: 'Computer Science',
    email: '',
  });

  // Assign Review Modal State
  const [selectedExpertForAssign, setSelectedExpertForAssign] = useState<Expert | null>(null);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState('');
  const [reviewDeadline, setReviewDeadline] = useState('14 Days');
  const [assignNotes, setAssignNotes] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleEmpanelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpert.name.trim() || !newExpert.institution.trim() || !newExpert.email.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const created: Expert = {
      id: 'exp_' + Date.now(),
      name: newExpert.name.trim(),
      title: newExpert.title,
      institution: newExpert.institution.trim(),
      dept: newExpert.dept,
      email: newExpert.email.trim(),
      activeReviews: 0,
      completed: 0,
    };

    setExperts((prev) => [created, ...prev]);
    setIsEmpanelModalOpen(false);
    setNewExpert({
      name: '',
      title: 'Senior Professor',
      institution: '',
      dept: 'Computer Science',
      email: '',
    });
    showToast(`Subject Expert "${created.name}" successfully empanelled into AICTE Roster!`);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpertForAssign || !selectedCurriculumId) {
      alert('Please select a curriculum to assign.');
      return;
    }

    const targetCurr = curricula.find((c) => c._id === selectedCurriculumId);
    if (targetCurr) {
      updateActiveCurriculum({
        ...targetCurr,
        status: 'UNDER_REVIEW',
        reviewer: selectedExpertForAssign.name,
      });
      setActiveCurriculum({
        ...targetCurr,
        status: 'UNDER_REVIEW',
        reviewer: selectedExpertForAssign.name,
      });
    }

    // Increment active reviews for expert
    setExperts((prev) =>
      prev.map((exp) =>
        exp.id === selectedExpertForAssign.id
          ? { ...exp, activeReviews: exp.activeReviews + 1 }
          : exp
      )
    );

    const expertName = selectedExpertForAssign.name;
    const currTitle = targetCurr?.code || 'Model Curriculum';

    setSelectedExpertForAssign(null);
    setSelectedCurriculumId('');
    setAssignNotes('');
    showToast(`Successfully assigned review of ${currTitle} to ${expertName}!`);
  };

  // Filter experts
  const filteredExperts = experts.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || exp.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  const totalActiveReviews = experts.reduce((acc, curr) => acc + curr.activeReviews, 0);
  const totalCompletedReviews = experts.reduce((acc, curr) => acc + curr.completed, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bureau Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-800 to-purple-900 text-white shadow-2xl space-y-2 border border-violet-700/30">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold backdrop-blur-md border border-white/15">
          <Building2 className="h-3.5 w-3.5 text-cyan-200" /> AICTE Academic Bureau Panel Management
        </div>
        <h1 className="text-3xl font-black tracking-tight">Subject Expert Committee Roster</h1>
        <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
          Authorize Subject Matter Experts (SMEs), assign model curricula for peer review, and manage bureau validation workloads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
            <UserCheck className="w-8 h-8 text-cyan-300" />
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Empanelled Experts</p>
              <p className="text-xl font-extrabold">{experts.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
            <BookOpen className="w-8 h-8 text-amber-300" />
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Active Reviews</p>
              <p className="text-xl font-extrabold">{totalActiveReviews}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Completed Validations</p>
              <p className="text-xl font-extrabold">{totalCompletedReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            Empanelled AICTE Subject Experts
            <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-xs font-bold border border-violet-500/30">
              {filteredExperts.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400">Manage expert credentials and assign curriculum peer evaluation duties</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search experts, institutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 w-56"
            />
          </div>

          <button
            onClick={() => setIsEmpanelModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> Empanel Expert
          </button>
        </div>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredExperts.map((exp) => (
          <div key={exp.id} className="glass-card-glow p-5 rounded-2xl space-y-4 hover:border-violet-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold text-[10px]">
                {exp.dept}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" /> Empanelled
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{exp.name}</h4>
              <p className="text-xs text-slate-400">{exp.title} • {exp.institution}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span className="font-mono text-[10px]">{exp.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 rounded-xl text-center border border-slate-800">
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
              onClick={() => {
                setSelectedExpertForAssign(exp);
                if (curricula.length > 0) {
                  setSelectedCurriculumId(curricula[0]._id);
                }
              }}
              className="w-full py-2 bg-slate-800 hover:bg-violet-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-700 hover:border-violet-500 transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Assign Curriculum Review
            </button>
          </div>
        ))}
      </div>

      {filteredExperts.length === 0 && (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
          <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No subject experts match your filter criteria.</p>
          <p className="text-xs text-slate-500">Try adjusting your search query or empanel a new expert.</p>
        </div>
      )}

      {/* --- EMPANEL EXPERT MODAL --- */}
      {isEmpanelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-violet-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-violet-400 font-bold">
                <Plus className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg text-white">Empanel New Subject Expert</h3>
              </div>
              <button
                onClick={() => setIsEmpanelModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmpanelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ananya Sen"
                  value={newExpert.name}
                  onChange={(e) => setNewExpert({ ...newExpert, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Academic Designation</label>
                  <select
                    value={newExpert.title}
                    onChange={(e) => setNewExpert({ ...newExpert, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Senior Professor">Senior Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Dean of Academics">Dean of Academics</option>
                    <option value="AICTE Committee Chair">AICTE Committee Chair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Domain Department</label>
                  <select
                    value={newExpert.dept}
                    onChange={(e) => setNewExpert({ ...newExpert, dept: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cyber Security">Cyber Security</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Institution / University *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IIT Madras, IISc Bangalore, NIT Trichy"
                  value={newExpert.institution}
                  onChange={(e) => setNewExpert({ ...newExpert, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="expert@institution.ac.in"
                  value={newExpert.email}
                  onChange={(e) => setNewExpert({ ...newExpert, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEmpanelModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" /> Empanel Subject Expert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ASSIGN CURRICULUM REVIEW MODAL --- */}
      {selectedExpertForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg text-white">Assign Peer Review Task</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assigning to <span className="text-white font-semibold">{selectedExpertForAssign.name}</span> ({selectedExpertForAssign.institution})
                </p>
              </div>
              <button
                onClick={() => setSelectedExpertForAssign(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Model Curriculum for Review *</label>
                <select
                  value={selectedCurriculumId}
                  onChange={(e) => setSelectedCurriculumId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {curricula.map((curr) => (
                    <option key={curr._id} value={curr._id}>
                      {curr.code} - {curr.title} ({curr.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Evaluation Target Deadline</label>
                <select
                  value={reviewDeadline}
                  onChange={(e) => setReviewDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="7 Days">7 Days (Expedited Review)</option>
                  <option value="14 Days">14 Days (Standard Review)</option>
                  <option value="30 Days">30 Days (Comprehensive Committee Review)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bureau Review Notes / Specific Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please pay special focus to NEP 2020 multidisciplinary credit allocation and Bloom taxonomy alignment in modules 2 & 3."
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedExpertForAssign(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

