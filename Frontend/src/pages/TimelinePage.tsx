import React from 'react';
import { Operation, TimelineEvent, TimelinePhase } from '../types';
import { TemporalLanes } from '../components/timeline/TemporalLanes';
import { Badge } from '../components/common/Badge';

export interface TimelinePageProps {
  operation: Operation;
  phases: TimelinePhase[];
  events: TimelineEvent[];
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  operation,
  phases,
  events,
}) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800/40">
              {operation.code} ACTIVITY TIMELINE
            </span>
            <Badge variant="success" size="sm">
              Sequential Activity
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Activity Timeline & Identifier Changes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chronological log tracking record postings, identifier changes, and location shifts over time.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
            <span>Period: </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{operation.dateRange.start} → {operation.dateRange.end}</span>
          </div>
        </div>
      </div>

      {/* Multi-Lane Component */}
      <TemporalLanes phases={phases} events={events} />
    </div>
  );
};
export default TimelinePage;
