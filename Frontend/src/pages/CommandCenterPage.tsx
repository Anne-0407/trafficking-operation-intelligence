import React, { useState } from 'react';
import { Operation } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { 
  Database, 
  FolderKanban, 
  AlertTriangle, 
  Activity,
  ArrowRight,
  Filter,
  Layers,
  Network
} from 'lucide-react';

export interface CommandCenterPageProps {
  operations: Operation[];
  onSelectOperation: (op: Operation) => void;
  onNavigateToOverview: () => void;
  onNavigateToGraph: () => void;
  searchQuery?: string;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  operations,
  onSelectOperation,
  onNavigateToOverview,
  onNavigateToGraph,
  searchQuery = '',
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredOps = operations.filter((op) => {
    // Status Filter
    if (filterStatus === 'REVIEW_REQUIRED' && op.status !== 'Requires Investigator Review') return false;
    if (filterStatus === 'HIGH_CONFIDENCE' && op.candidateScore < 0.85) return false;

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = op.code.toLowerCase().includes(q);
      const matchName = op.name.toLowerCase().includes(q);
      const matchSummary = op.summary.toLowerCase().includes(q);
      return matchCode || matchName || matchSummary;
    }

    return true;
  });

  const totalRecords = operations.reduce((sum, op) => sum + op.recordCount, 0);
  const reviewRequiredCount = operations.filter((op) => op.status === 'Requires Investigator Review').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800/40">
              COMMAND CENTER
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Enterprise Investigation Console</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Candidate Operations & Dataset Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Explore candidate operational clusters connecting synthetic digital records across multi-signal correlation evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
          <Badge variant="success" size="md" dot>
            Dataset: Synthetic Active (50 Records)
          </Badge>
        </div>
      </div>

      {/* 4 Prominent Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Candidate Operations</div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{operations.length}</div>
              <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono mt-0.5">Identified clusters</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Synthetic Records</div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">50</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{totalRecords} clustered</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Candidates</div>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{reviewRequiredCount}</div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">Requires review</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Dataset Status</div>
              <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">Ready</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Synthetic benchmark v1.4</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Candidate Operations Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Candidate Operations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select an operation to explore connected records, signal breakdown, and relationship evidence.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterStatus === 'ALL'
                  ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold border border-sky-300 dark:border-sky-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All ({operations.length})
            </button>
            <button
              onClick={() => setFilterStatus('REVIEW_REQUIRED')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterStatus === 'REVIEW_REQUIRED'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Requires Review ({reviewRequiredCount})
            </button>
          </div>
        </div>

        {/* Clean Candidate Operation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOps.map((op) => {
            const isFeatured = op.code === 'OP-031';

            return (
              <div
                key={op.id}
                onClick={() => {
                  onSelectOperation(op);
                  onNavigateToOverview();
                }}
                className={`p-5 rounded-xl border transition-all cursor-pointer shadow-sm flex flex-col justify-between space-y-4 ${
                  isFeatured
                    ? 'bg-white dark:bg-slate-900/90 border-sky-500 shadow-md hover:border-sky-600 dark:hover:border-sky-400'
                    : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-bold text-sky-700 dark:text-sky-400">
                      {op.code}
                    </span>
                    <Badge
                      variant={
                        op.status === 'Requires Investigator Review'
                          ? 'amber'
                          : 'success'
                      }
                      size="sm"
                      dot
                    >
                      {op.status === 'Requires Investigator Review' ? 'Requires Review' : 'Reviewed'}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Candidate Operation
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      Match Strength: <span className="font-mono font-bold text-slate-900 dark:text-white">{(op.candidateScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                      {op.recordCount} candidate records • {op.locationCount} locations
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOperation(op);
                      onNavigateToOverview();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <span>View Operation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOperation(op);
                      onNavigateToGraph();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Graph</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CommandCenterPage;
