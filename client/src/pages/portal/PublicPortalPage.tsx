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

  const handleDownloadPDF = (curr: Curriculum) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download/print the PDF curriculum blueprint.');
      return;
    }

    const moduleCreditSum = (curr.modules || []).reduce((acc, m) => acc + (m.credits || 0), 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${curr.code} - Official AICTE Model Curriculum PDF Blueprint</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 40px; background: #ffffff; }
            .header { text-align: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 25px; }
            .govt-title { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; color: #475569; text-transform: uppercase; }
            .logo { font-size: 22px; font-weight: 900; color: #0369a1; margin-top: 4px; }
            .sub { font-size: 11px; color: #64748b; margin-top: 4px; }
            .title { font-size: 20px; font-weight: 800; margin-top: 15px; color: #0f172a; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: bold; font-size: 11px; padding: 3px 10px; border-radius: 12px; margin-top: 6px; }
            .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 10px; margin: 20px 0; border: 1px solid #e2e8f0; }
            .meta-item { font-size: 12px; line-height: 1.5; }
            .meta-item strong { color: #0f172a; }
            .section-title { font-size: 13px; font-weight: 800; color: #0284c7; text-transform: uppercase; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
            .module-card { border: 1px solid #cbd5e1; padding: 14px; margin-top: 12px; border-radius: 8px; page-break-inside: avoid; background: #ffffff; }
            .module-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; color: #0f172a; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px; }
            .module-desc { font-size: 11px; color: #334155; margin-top: 8px; leading-relaxed: true; }
            .module-topics { font-size: 11px; color: #0284c7; margin-top: 8px; font-weight: 600; }
            .footer { margin-top: 40px; border-top: 2px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 10px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="govt-title">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)</div>
            <div class="logo">National Model Curriculum Blueprint & Governance Portal</div>
            <div class="sub">Ministry of Education, Government of India • SIH Problem Statement SIH1465</div>
            <div class="title">${curr.title}</div>
            <div class="badge">Course Code: ${curr.code} | Status: ${curr.status} | Version: ${curr.currentVersion || 'v2.0'}</div>
          </div>

          <div class="meta-grid">
            <div class="meta-item"><strong>Degree & Branch:</strong> ${curr.degree} (${curr.branch})</div>
            <div class="meta-item"><strong>Total Degree Requirement:</strong> ${curr.totalCredits} Credits (NEP 2020 Standard)</div>
            <div class="meta-item"><strong>Academic Session:</strong> ${curr.academicYear}</div>
            <div class="meta-item"><strong>NEP Compliance Audit Score:</strong> ${curr.nepComplianceScore}% (Fully Compliant)</div>
            <div class="meta-item"><strong>Loaded Core Modules Credit Sum:</strong> ${moduleCreditSum} Credits (${curr.modules?.length || 0} Blueprint Modules)</div>
            <div class="meta-item"><strong>Publishing Authority:</strong> AICTE Executive Academic Bureau</div>
          </div>

          <div class="section-title">Model Curriculum Modules Breakdown (${curr.modules?.length || 0} Core Modules)</div>

          ${(curr.modules || []).map((m: any) => `
            <div class="module-card">
              <div class="module-header">
                <span>${m.code} - ${m.title}</span>
                <span>${m.credits} Credits (${m.lectureHours || 3}L : ${m.tutorialHours || 0}T : ${m.practicalHours || 0}P)</span>
              </div>
              <div class="module-desc">${m.description}</div>
              ${m.topics && m.topics.length > 0 ? `<div class="module-topics"><strong>Key Topics:</strong> ${m.topics.join(' • ')}</div>` : ''}
            </div>
          `).join('')}

          <div class="footer">
            Official AICTE Model Curriculum Document • Generated on ${new Date().toLocaleDateString()} • Verified Digital Blueprint
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Public Model Curriculum Portal</h1>
          <p className="text-xs text-slate-800 dark:text-slate-300 mt-1 max-w-2xl">
            Browse, inspect, and download official AICTE unified model engineering curricula for state universities and technical institutions.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by degree, branch, course code, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Branch:</span>
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
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
            className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl group"
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

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-300 transition-colors leading-snug">
                {curr.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{curr.description}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300">
                <div>
                  <span className="text-slate-500 text-[10px] block">Degree & Branch</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{curr.degree}</span>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] block truncate">{curr.branch}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Total Credits</span>
                  <span className="font-semibold text-emerald-400">{curr.totalCredits} Credits</span>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] block">NEP Score: {curr.nepComplianceScore}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setSelectedCurriculum(curr)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                <span>Inspect Syllabus</span>
              </button>
              <button
                onClick={() => handleDownloadPDF(curr)}
                className="p-2 bg-brand-600/20 hover:bg-brand-600 text-brand-400 hover:text-slate-900 dark:text-white rounded-xl border border-brand-500/30 transition-colors"
                title="Download Official PDF Blueprint"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Inspector for Public Curriculum Detail */}
      {selectedCurriculum && (
        <div className="fixed inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-brand-400">{selectedCurriculum.code}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCurriculum.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCurriculum(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-300">{selectedCurriculum.description}</p>

            {/* Credit Consistency Summary Box */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Degree Credit Target</span>
                <span className="font-extrabold text-emerald-400 text-sm">{selectedCurriculum.totalCredits} Credits</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 block">AICTE NEP 2020 Degree Norm</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Loaded Core Modules Credit Sum</span>
                <span className="font-extrabold text-cyan-400 text-sm">
                  {(selectedCurriculum.modules || []).reduce((sum, m) => sum + (m.credits || 0), 0)} Credits
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 block">
                  {selectedCurriculum.modules?.length || 0} Core Blueprint Modules
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                Modules Breakdown ({selectedCurriculum.modules?.length || 0})
              </h4>
              {(selectedCurriculum.modules || []).map((m, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                    <span>
                      {m.code} - {m.title}
                    </span>
                    <span className="text-brand-400 font-bold">{m.credits} Credits</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">{m.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => handleDownloadPDF(selectedCurriculum)}
                className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-slate-900 dark:text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
              >
                <Download className="w-4 h-4" /> Download Official Model Curriculum PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

