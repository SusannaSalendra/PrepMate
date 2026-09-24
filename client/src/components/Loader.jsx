import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ text = 'Loading...', size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 animate-ping absolute inset-0"></div>
        <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-indigo-400 animate-spin`} />
      </div>
      {text && <p className="text-sm font-medium text-slate-400 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 bg-slate-800 rounded-full w-28"></div>
            <div className="h-5 bg-slate-800 rounded-full w-16"></div>
          </div>
          <div className="h-6 bg-slate-800 rounded-lg w-3/4 mb-3"></div>
          <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-2/3 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-slate-800 rounded-md w-14"></div>
            <div className="h-6 bg-slate-800 rounded-md w-16"></div>
            <div className="h-6 bg-slate-800 rounded-md w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
