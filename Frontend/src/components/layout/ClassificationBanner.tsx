import React from 'react';
import { ShieldAlert, Database, AlertTriangle } from 'lucide-react';

export const ClassificationBanner: React.FC = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-900 border-b border-amber-500/40 text-xs px-4 py-1.5 flex items-center justify-between font-mono tracking-wider z-50 select-none transition-colors">
      <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400">
        <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-amber-600 dark:text-amber-400" />
        <span className="font-bold">RESTRICTED ACCESS</span>
        <span className="text-slate-400 dark:text-slate-500">•</span>
        <span className="text-slate-700 dark:text-slate-300">AUTHORIZED INVESTIGATOR CONSOLE ONLY</span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800/50 px-2 py-0.5 rounded text-[11px] font-medium">
          <Database className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          <span>SYNTHETIC DATASET (v1.4.2-synth)</span>
        </div>
        <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/50 px-2 py-0.5 rounded text-[11px] font-medium">
          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>DEMO MODE • ZERO LIVE PII</span>
        </div>
      </div>
    </div>
  );
};
