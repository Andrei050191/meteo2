import { Sun } from 'lucide-react';

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade">
    <div className="relative">
      <Sun size={48} className="text-yellow-400 animate-spin-slow" />
      <div className="absolute inset-0 blur-xl bg-yellow-400/20 animate-pulse"></div>
    </div>
    <p className="mt-4 text-slate-400 font-medium tracking-widest">CITIRE DATE SATELIT...</p>
  </div>
);