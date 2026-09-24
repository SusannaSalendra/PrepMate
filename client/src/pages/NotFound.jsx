import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The question, session, or interview path you are looking for has either moved or does not exist.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
