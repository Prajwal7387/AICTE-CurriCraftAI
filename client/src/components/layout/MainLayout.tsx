import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import MagicRings from '../ui/MagicRings';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 bg-radial-grid text-slate-100 flex flex-col relative overflow-hidden">
      {/* Subtle Ambient Ring Animation in Layout */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <MagicRings
          color="#0284c7"
          colorTwo="#06b6d4"
          speed={0.4}
          ringCount={4}
          baseRadius={0.45}
          opacity={0.35}
          followMouse={false}
        />
      </div>

      <Navbar />
      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
