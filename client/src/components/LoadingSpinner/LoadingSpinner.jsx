import React from 'react';

export function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
      <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
    </div>
  );
}

