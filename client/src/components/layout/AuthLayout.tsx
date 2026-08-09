import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Home } from 'lucide-react';
import MagicRings from '../ui/MagicRings';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 bg-radial-grid flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Top Left Navigation Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-violet-300 transition-all hover:scale-105 shadow-xl"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Home Page</span>
        </Link>
      </div>

      {/* Background Magic Rings WebGL Animation */}
      <MagicRings
        color="#0284c7"
        colorTwo="#10b981"
        speed={0.7}
        ringCount={6}
        baseRadius={0.35}
        opacity={0.7}
        followMouse={true}
      />

      <div className="mb-6 flex flex-col items-center text-center relative z-10">
        <Link to="/" className="group flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 mb-3 shadow-2xl animated-logo group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-cyan-300" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">CurriCraft AI</h1>
          <p className="text-xs font-semibold text-violet-300 uppercase tracking-widest mt-1">
            AICTE Unified Model Curriculum Portal
          </p>
        </Link>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl relative z-10 glass-card-glow">
        <Outlet />
      </div>
    </div>
  );
};
