import React from 'react';
import { 
  Search, 
  UserCheck, 
  ChevronDown, 
  Cpu, 
  FolderKanban,
  FileCheck2
} from 'lucide-react';
import { Operation } from '../../types';
import { Badge } from '../common/Badge';

import { ThemeToggle } from './ThemeToggle';

export interface HeaderProps {
  operations: Operation[];
  selectedOperation: Operation;
  onSelectOperation: (op: Operation) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pendingReviewCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  operations,
  selectedOperation,
  onSelectOperation,
  searchQuery,
  onSearchChange,
  pendingReviewCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-40 select-none transition-colors shadow-sm">
      {/* Brand & Active Operation Context */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center shadow-glow-accent border border-sky-400/40 shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm tracking-wider text-slate-900 dark:text-slate-100">TOI PLATFORM</span>
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">v1.4-POC</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans tracking-wide">Trafficking Operation Intelligence</p>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Operation Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-300 dark:border-slate-700/80 rounded-md text-xs font-mono text-slate-800 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
          >
            <FolderKanban className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <div className="text-left">
              <span className="text-sky-600 dark:text-sky-400 font-bold">{selectedOperation.code}</span>
              <span className="text-slate-400 dark:text-slate-400 mx-1.5">|</span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px] inline-block align-bottom font-sans font-medium">
                {selectedOperation.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-80 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden py-1">
              <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Candidate Operational Cluster
              </div>
              {operations.map((op) => (
                <button
                  key={op.id}
                  onClick={() => {
                    onSelectOperation(op);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                    op.id === selectedOperation.id ? 'bg-sky-50 dark:bg-sky-950/40 border-l-2 border-sky-500 dark:border-sky-400' : ''
                  }`}
                >
                  <div>
                    <div className="font-mono font-bold text-sky-700 dark:text-sky-300">{op.code}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[220px]">{op.name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{(op.candidateScore * 100).toFixed(0)}%</span>
                    <div className="text-[9px] text-slate-500">{op.recordCount} records</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search synthetic phone, telegram handle, ad code, or city..."
            className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 focus:border-sky-500/70 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-mono outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Triage Counter & Investigator Info */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        {pendingReviewCount > 0 && (
          <Badge variant="amber" dot size="sm" className="hidden lg:inline-flex">
            <FileCheck2 className="w-3 h-3 mr-0.5" />
            {pendingReviewCount} Requires Review
          </Badge>
        )}

        <div className="flex items-center gap-2.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md shadow-sm">
          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-500/50 flex items-center justify-center">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left font-mono">
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">INV-77042</div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">Special Ops</div>
          </div>
        </div>
      </div>
    </header>
  );
};
