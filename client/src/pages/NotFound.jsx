import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#20B2AA]/10 border border-[#20B2AA]/25 flex items-center justify-center mx-auto text-[#20B2AA]">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h1 className="text-7xl font-display font-bold text-[#F9FBFB] tracking-tight">404</h1>
        <h2 className="text-xl font-display font-bold text-[#F9FBFB]">Page Not Found</h2>
        <p className="text-xs text-[#8EA3A0] leading-relaxed max-w-sm mx-auto">
          The problem, simulation session, or interview path you are looking for has either moved or does not exist.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all hover:-translate-y-0.5"
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
