import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Network, 
  Clock, 
  FileCheck2, 
  GitCompare, 
  BarChart3,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Operation } from '../../types';

export type ActivePage = 
  | 'command-center'
  | 'overview'
  | 'graph'
  | 'timeline'
  | 'evidence'
  | 'change-aware'
  | 'evaluation';

export interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentOperation: Operation;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  currentOperation,
}) => {
  const navItems = [
    {
      id: 'command-center' as ActivePage,
      label: 'Command Center',
      subtext: 'Operations & Candidates',
      icon: LayoutDashboard,
      badge: '5 Ops',
    },
    {
      id: 'overview' as ActivePage,
      label: 'Operation Overview',
      subtext: `${currentOperation.code} Details`,
      icon: Layers,
      badge: `${currentOperation.recordCount} Records`,
    },
    {
      id: 'graph' as ActivePage,
      label: 'Operation Graph',
      subtext: 'Interactive Network',
      icon: Network,
      badge: 'Interactive',
    },
    {
      id: 'timeline' as ActivePage,
      label: 'Activity Timeline',
      subtext: 'Chronological Events',
      icon: Clock,
      badge: '4 Months',
    },
    {
      id: 'evidence' as ActivePage,
      label: 'Candidate Relationships',
      subtext: 'Evidence & Review',
      icon: FileCheck2,
      badge: currentOperation.contradictionsCount > 0 ? `${currentOperation.contradictionsCount} Flags` : 'Review',
      alert: currentOperation.contradictionsCount > 0,
    },
    {
      id: 'change-aware' as ActivePage,
      label: 'Change-Aware Test',
      subtext: 'Controlled Drift Analysis',
      icon: GitCompare,
      badge: 'Drift Test',
    },
    {
      id: 'evaluation' as ActivePage,
      label: 'Synthetic Benchmark',
      subtext: 'Performance Metrics',
      icon: BarChart3,
      badge: 'Benchmark',
    },
  ];

  return (
    <aside className="w-64 bg-slate-50 dark:bg-[#0B1120] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between select-none h-full transition-colors">
      {/* Navigation Links */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-150 group cursor-pointer ${
                isActive
                  ? 'bg-sky-100 dark:bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 shadow-sm font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-850 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-sky-500 text-white dark:bg-sky-500/20 dark:text-sky-400'
                      : 'bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isActive ? 'text-sky-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {item.subtext}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    item.alert
                      ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60'
                      : isActive
                      ? 'bg-sky-200/80 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800'
                      : 'bg-slate-200 text-slate-600 border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Mission / Guardrail Card */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/40">
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-semibold font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Human-in-the-Loop</span>
          </div>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            AI signals formulate candidate hypotheses only. Final attribution verdicts require investigator confirmation.
          </p>
          <div className="pt-1 flex items-center justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500">
            <span>TOI Core v1.4</span>
            <span className="text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
              Synthetic Sandbox <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
